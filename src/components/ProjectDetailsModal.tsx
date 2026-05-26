import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Trash2, Calendar, Star, ShieldCheck, Edit3, AlertCircle, Save, Bell, 
  CheckCircle, AlertTriangle, FileText, Activity, Globe, Headphones, Cpu, Zap, Wifi, Layers,
  ChevronDown, MessageSquare, User, Users, Clock, History, Phone, ShieldAlert, Archive, Trash,
  TrendingUp, ArrowUpRight, Check, Plus, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Project, QuarterlyAssessment, ClientEvaluation, Evaluation, PeriodAction } from '../types/project';
import { exportService } from '../services/exportService';
import { useAuth } from '../context/AuthContext';

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (project: Project) => void;
  onDelete?: (id: string) => void;
  onArchive?: (project: Project) => void;
  onEditRequest?: (project: Project) => void;
}

const ProjectDetailsModal: React.FC<Props> = ({ 
  project, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete, 
  onArchive,
  onEditRequest 
}) => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'summary' | 'services' | 'quality' | 'admin' | 'milestones'>('summary');
  const [editedProject, setEditedProject] = useState<Project | null>(project);

  // Escala Temporal: Mensual o Anual
  const [timeScale, setTimeScale] = useState<'month' | 'year'>('month');

  // Estados para nueva acción de bitácora
  const [newActionText, setNewActionText] = useState('');
  const [newActionCategory, setNewActionCategory] = useState<'Técnico' | 'SLA' | 'Procesos' | 'Relación' | 'Otros'>('Otros');

  React.useEffect(() => {
    setEditedProject(project);
  }, [project]);

  const MONTH_NAMES = React.useMemo(() => [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ], []);

  // Generar meses/años transcurridos desde startDate hasta hoy
  const periods = React.useMemo(() => {
    if (!editedProject) return [];
    const end = new Date();
    const start = editedProject.startDate ? new Date(editedProject.startDate) : new Date(end.getFullYear(), end.getMonth() - 5, 1);
    
    let startYear = isNaN(start.getTime()) ? end.getFullYear() : start.getFullYear();
    let startMonth = isNaN(start.getTime()) ? end.getMonth() : start.getMonth();

    const generated: { month: number; year: number; label: string }[] = [];

    if (timeScale === 'month') {
      let currentYear = startYear;
      let currentMonth = startMonth;

      while (currentYear < end.getFullYear() || (currentYear === end.getFullYear() && currentMonth <= end.getMonth())) {
        generated.push({
          month: currentMonth + 1,
          year: currentYear,
          label: `${MONTH_NAMES[currentMonth]} ${String(currentYear).slice(-2)}`
        });
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
      }
    } else {
      // Escala Anual
      for (let year = startYear; year <= end.getFullYear(); year++) {
        generated.push({
          month: 0, // 0 indica evaluación consolidada anual
          year: year,
          label: `Año ${year}`
        });
      }
    }

    if (generated.length === 0) {
      if (timeScale === 'month') {
        generated.push({
          month: end.getMonth() + 1,
          year: end.getFullYear(),
          label: `${MONTH_NAMES[end.getMonth()]} ${String(end.getFullYear()).slice(-2)}`
        });
      } else {
        generated.push({
          month: 0,
          year: end.getFullYear(),
          label: `Año ${end.getFullYear()}`
        });
      }
    }

    return generated;
  }, [editedProject?.startDate, MONTH_NAMES, timeScale]);

  const [selectedPeriod, setSelectedPeriod] = useState<{ month: number; year: number } | null>(null);

  // Sincronizar período seleccionado al cambiar escala temporal
  React.useEffect(() => {
    if (periods.length > 0) {
      const exists = periods.some(p => p.month === selectedPeriod?.month && p.year === selectedPeriod?.year);
      if (!exists) {
        const last = periods[periods.length - 1];
        setSelectedPeriod({ month: last.month, year: last.year });
      }
    }
  }, [periods, selectedPeriod]);

  // Obtener evaluación del período (cargada o agregada)
  const activeEval = React.useMemo(() => {
    if (!editedProject || !selectedPeriod) return null;
    
    if (selectedPeriod.month > 0) {
      // Vista mensual estándar
      return editedProject.evaluations?.find(
        e => e.month === selectedPeriod.month && e.year === selectedPeriod.year
      ) || null;
    } else {
      // Vista anual consolidada: agregamos todas las evaluaciones de ese año
      const yearEvals = editedProject.evaluations?.filter(e => e.year === selectedPeriod.year) || [];
      if (yearEvals.length === 0) return null;

      const count = yearEvals.length;
      const sumScore = yearEvals.reduce((sum, e) => sum + e.quantitative, 0);
      const avgScore = Math.round(sumScore / count);

      const aggregatedPillars: QuarterlyAssessment = {
        sla: 0,
        comunicacion: 0,
        resolucion: 0,
        experiencia: 0,
        continuidad: 0,
        orden: 0,
        conversion: 0,
        adaptacion: 0,
        cultura: 0,
        valor: 0
      };

      let hasPillars = false;
      yearEvals.forEach(e => {
        if (e.pillars) {
          hasPillars = true;
          Object.keys(aggregatedPillars).forEach(k => {
            (aggregatedPillars as any)[k] += (e.pillars as any)[k] || 0;
          });
        }
      });

      if (hasPillars) {
        Object.keys(aggregatedPillars).forEach(k => {
          (aggregatedPillars as any)[k] = Math.round((aggregatedPillars as any)[k] / count);
        });
      } else {
        Object.keys(aggregatedPillars).forEach(k => {
          (aggregatedPillars as any)[k] = 5;
        });
      }

      // Consolidar observaciones cualitativas
      const consolidatedQualitative = yearEvals
        .map(e => `[${MONTH_NAMES[e.month - 1]}] ${e.qualitative}`)
        .filter(q => q.trim().length > 5)
        .join('\n\n');

      // Consolidar acciones
      const consolidatedActions: PeriodAction[] = [];
      yearEvals.forEach(e => {
        if (e.actions) {
          e.actions.forEach(act => {
            consolidatedActions.push({
              ...act,
              description: `[${MONTH_NAMES[e.month - 1]}] ${act.description}`
            });
          });
        }
      });

      const latestMonthEval = [...yearEvals].sort((a, b) => b.month - a.month)[0];
      const yearStatus = latestMonthEval?.status || 'Stable';

      return {
        month: 0,
        year: selectedPeriod.year,
        quantitative: avgScore,
        qualitative: consolidatedQualitative || 'No hay observaciones registradas en este año.',
        status: yearStatus,
        pillars: aggregatedPillars,
        actions: consolidatedActions
      } as Evaluation;
    }
  }, [editedProject?.evaluations, selectedPeriod, MONTH_NAMES]);

  const activePillars = React.useMemo(() => {
    if (activeEval?.pillars) return activeEval.pillars;
    return editedProject?.quarterlyAssessment || {
      sla: 5,
      comunicacion: 5,
      resolucion: 5,
      experiencia: 5,
      continuidad: 5,
      orden: 5,
      conversion: 5,
      adaptacion: 5,
      cultura: 5,
      valor: 5
    };
  }, [activeEval, editedProject?.quarterlyAssessment]);

  const activeStatus = activeEval?.status || 'Stable';
  const activeQualitative = activeEval?.qualitative || '';

  const updateEvaluationForPeriod = (
    updater: (existing: Evaluation) => Partial<Evaluation>
  ) => {
    if (!editedProject || !selectedPeriod) return;
    
    // La vista anual es agregada, no editable de forma directa
    if (selectedPeriod.month === 0) return;
    
    const evals = [...(editedProject.evaluations || [])];
    const index = evals.findIndex(e => e.month === selectedPeriod.month && e.year === selectedPeriod.year);

    const defaultPillars = editedProject.quarterlyAssessment || {
      sla: 5,
      comunicacion: 5,
      resolucion: 5,
      experiencia: 5,
      continuidad: 5,
      orden: 5,
      conversion: 5,
      adaptacion: 5,
      cultura: 5,
      valor: 5
    };

    const baseEval: Evaluation = {
      month: selectedPeriod.month,
      year: selectedPeriod.year,
      quantitative: 100,
      qualitative: '',
      status: 'Stable',
      pillars: defaultPillars,
      actions: []
    };

    const existing = index >= 0 ? evals[index] : baseEval;
    const updatedFields = updater(existing);
    
    const merged: Evaluation = {
      ...existing,
      ...updatedFields,
    };

    // Calcular cuantitativo
    if (merged.pillars) {
      const sum = Object.values(merged.pillars).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
      merged.quantitative = Math.round((sum / 50) * 100);
    }

    if (index >= 0) {
      evals[index] = merged;
    } else {
      evals.push(merged);
    }

    // Ordenar descendente
    evals.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    const latestEval = evals[0];
    let nextHealthFlag = editedProject.healthFlag;
    if (latestEval) {
      if (latestEval.status === 'Stable' || latestEval.status === 'Growth') nextHealthFlag = 'Verde';
      else if (latestEval.status === 'At Risk') nextHealthFlag = 'Amarilla';
      else if (latestEval.status === 'Critical') nextHealthFlag = 'Roja';
    }

    setEditedProject({
      ...editedProject,
      evaluations: evals,
      quarterlyAssessment: latestEval?.pillars || editedProject.quarterlyAssessment,
      healthFlag: nextHealthFlag
    });
  };

  const handleAddAction = () => {
    if (!newActionText.trim() || !selectedPeriod || selectedPeriod.month === 0) return;
    
    const newAction: PeriodAction = {
      id: Math.random().toString(36).substr(2, 9),
      description: newActionText.trim(),
      status: 'Pending',
      category: newActionCategory
    };

    updateEvaluationForPeriod((existing) => ({
      actions: [...(existing.actions || []), newAction]
    }));

    setNewActionText('');
  };

  const handleToggleAction = (actionId: string) => {
    if (!selectedPeriod || selectedPeriod.month === 0) return;
    updateEvaluationForPeriod((existing) => ({
      actions: (existing.actions || []).map(act => 
        act.id === actionId 
          ? { ...act, status: act.status === 'Completed' ? 'Pending' : 'Completed' } as PeriodAction
          : act
      )
    }));
  };

  const handleDeleteAction = (actionId: string) => {
    if (!selectedPeriod || selectedPeriod.month === 0) return;
    updateEvaluationForPeriod((existing) => ({
      actions: (existing.actions || []).filter(act => act.id !== actionId)
    }));
  };

  const chartData = React.useMemo(() => {
    return periods.map(p => {
      if (p.month > 0) {
        // Escala Mensual
        const existing = editedProject?.evaluations?.find(e => e.month === p.month && e.year === p.year);
        
        let score = 0;
        let isReal = false;
        if (existing) {
          score = existing.quantitative;
          isReal = true;
        } else {
          const sum = Object.values(editedProject?.quarterlyAssessment || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
          score = sum > 0 ? Math.round((sum / 50) * 100) : 80;
        }

        return {
          name: p.label,
          month: p.month,
          year: p.year,
          'Calidad': score,
          isReal
        };
      } else {
        // Escala Anual
        const yearEvals = editedProject?.evaluations?.filter(e => e.year === p.year) || [];
        let score = 0;
        let isReal = false;

        if (yearEvals.length > 0) {
          const sum = yearEvals.reduce((s, e) => s + e.quantitative, 0);
          score = Math.round(sum / yearEvals.length);
          isReal = true;
        } else {
          const sum = Object.values(editedProject?.quarterlyAssessment || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
          score = sum > 0 ? Math.round((sum / 50) * 100) : 80;
        }

        return {
          name: p.label,
          month: 0,
          year: p.year,
          'Calidad': score,
          isReal
        };
      }
    });
  }, [periods, editedProject?.evaluations, editedProject?.quarterlyAssessment]);

  if (!project || !editedProject) return null;

  const handleSave = () => {
    onUpdate(editedProject);
    onClose();
  };

  const getFlagColor = (flag: string) => {
    switch(flag) {
      case 'Verde': return 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]';
      case 'Amarilla': return 'text-amber-400 bg-amber-400/5 border-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]';
      case 'Roja': return 'text-rose-500 bg-rose-500/5 border-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      default: return 'text-rc-teal bg-rc-teal/5 border-rc-teal/10';
    }
  };

  const tabs = [
    { id: 'summary', label: 'Resumen', icon: Activity },
    { id: 'services', label: 'Servicios', icon: Layers },
    { id: 'quality', label: 'Calidad HC', icon: Star },
    { id: 'admin', label: 'Comportamiento', icon: ShieldCheck },
    { id: 'milestones', label: 'Activos', icon: Headphones }
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.96, opacity: 0, y: 30 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.96, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 42, stiffness: 220 }}
            className="relative w-[85vw] h-[90vh] bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-[110] font-light text-[var(--text-primary)]"
          >
            {/* Action Bar Superior */}
            <div className="p-10 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--bg-secondary)]/50 backdrop-blur-3xl">
               <div className="flex items-center gap-10">
                  <div className="w-20 h-20 bg-[var(--card-bg)] rounded-[32px] border border-[var(--glass-border)] flex items-center justify-center p-6 transition-all group-hover:border-rc-teal/30">
                     {editedProject.logoUrl ? (
                        <img src={editedProject.logoUrl} className="w-full h-full object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                     ) : (
                        <ShieldCheck className="text-[var(--text-primary)] opacity-10" size={32} />
                     )}
                  </div>
                  <div>
                     <div className="flex items-center gap-6">
                        <h2 className="text-5xl font-light text-[var(--text-primary)] tracking-tighter leading-none">{editedProject.client}</h2>
                        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-medium uppercase tracking-[0.2em] flex items-center gap-2 ${getFlagColor(editedProject.healthFlag)}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${editedProject.healthFlag === 'Verde' ? 'bg-emerald-400' : editedProject.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                           Salud: {editedProject.healthFlag}
                        </div>
                     </div>
                     <div className="flex items-center gap-3 mt-6">
                        {['En Proceso', 'Prueba', 'Activo', 'Inactivo'].map(status => {
                           const isSelected = editedProject.adminStatus === status;
                           return (
                              <button
                                 key={status}
                                 onClick={isAdmin ? () => setEditedProject({ ...editedProject, adminStatus: status as any }) : undefined}
                                 className={`px-5 py-2 rounded-full text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ${
                                    isSelected 
                                    ? 'bg-[var(--text-primary)] text-[var(--bg-secondary)]' 
                                    : 'bg-[var(--text-primary)]\/5 text-[var(--text-secondary)]'
                                 } ${isAdmin && !isSelected ? 'hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]\/10 cursor-pointer' : 'cursor-default'}`}
                              >
                                 {status}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => exportService.exportIndividualPDF(editedProject)}
                    className="flex flex-col items-center gap-2 p-4 bg-rc-teal/5 hover:bg-rc-teal/10 rounded-[32px] border border-rc-teal/20 text-rc-teal transition-all"
                  >
                     <FileText size={18} strokeWidth={1.5} />
                     <span className="text-[8px] font-medium uppercase tracking-widest">Reporte PDF</span>
                  </button>
                  {isAdmin && (
                     <>
                        <button onClick={() => onEditRequest?.(editedProject)} className="flex flex-col items-center gap-2 p-4 bg-[var(--text-primary)]\/5 hover:bg-[var(--text-primary)]\/10 rounded-[32px] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer">
                           <Edit3 size={18} strokeWidth={1.5} />
                           <span className="text-[8px] font-medium uppercase tracking-widest">Ajustes</span>
                        </button>
                        <button 
                          onClick={() => onArchive?.(editedProject)}
                          className="flex flex-col items-center gap-2 p-4 bg-[var(--text-primary)]\/5 hover:bg-amber-500/10 rounded-[32px] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-amber-400 transition-all cursor-pointer"
                        >
                           <Archive size={18} strokeWidth={1.5} />
                           <span className="text-[8px] font-medium uppercase tracking-widest">Archivar</span>
                        </button>
                        <button onClick={() => onDelete?.(editedProject.id)} className="flex flex-col items-center gap-2 p-4 bg-rose-500/5 hover:bg-rose-500/10 rounded-[32px] border border-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-all cursor-pointer">
                           <Trash size={18} strokeWidth={1.5} />
                           <span className="text-[8px] font-medium uppercase tracking-widest">Eliminar</span>
                        </button>
                     </>
                   )}
                  <div className="h-10 w-px bg-[var(--glass-border)] mx-4" />
                  <button onClick={onClose} className="p-4 bg-[var(--card-bg)] hover:bg-[var(--text-primary)]\/10 rounded-full text-[var(--text-primary)] transition-all border border-[var(--glass-border)]">
                     <X size={24} strokeWidth={1} />
                  </button>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex px-12 gap-2 border-b border-[var(--glass-border)] bg-black/5">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-4 px-8 py-6 text-[11px] font-medium uppercase tracking-[0.3em] transition-all relative ${
                        activeTab === tab.id ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                     }`}
                  >
                     <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2 : 1.5} />
                     {tab.label}
                     {activeTab === tab.id && (
                        <motion.div layoutId="modal-tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-teal" />
                     )}
                  </button>
               ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-16">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -5 }}
                     transition={{ duration: 0.4 }}
                     className="max-w-7xl mx-auto w-full min-h-full"
                  >
                     {activeTab === 'summary' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                           <div className="space-y-12">
                              <h3 className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.5em] flex items-center gap-4 opacity-60">
                                 <Globe size={14} className="text-rc-teal" strokeWidth={1.5} /> ADN Tecnológico
                              </h3>
                              <div className="space-y-4">
                                 {[
                                    { label: 'País de Origen', value: editedProject.techDNA?.country },
                                    { label: 'Sip Trunk Virtual', value: editedProject.techDNA?.sipTrunkVirtual },
                                    { label: 'ISP / Conectividad', value: editedProject.techDNA?.isp },
                                    { label: 'Modelo Operativo', value: editedProject.techDNA?.operationMode }
                                 ].map(item => (
                                    <div key={item.label} className="p-6 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-3xl flex justify-between items-center group hover:bg-[var(--text-primary)]/[0.02] transition-all">
                                       <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">{item.label}</span>
                                       <span className="text-[11px] font-medium text-[var(--text-primary)] uppercase tracking-tighter">{item.value || 'Pendiente'}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="md:col-span-2 space-y-12">
                              <h3 className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.5em] flex items-center gap-4 opacity-60">
                                 <TrendingUp size={14} className="text-rc-teal" strokeWidth={1.5} /> Indicadores Estratégicos
                              </h3>
                              <div className="grid grid-cols-2 gap-10">
                                 <div className="p-12 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[48px] flex flex-col items-center justify-center gap-6 group hover:border-rc-teal/20 transition-all">
                                    <div className="text-7xl font-mono-data font-light text-[var(--text-primary)] tracking-tighter flex items-baseline gap-2">
                                       {Object.values(editedProject?.quarterlyAssessment || {}).reduce((a: any, b: any) => a + (typeof b === 'number' ? b : 0), 0)}
                                       <span className="text-2xl text-rc-teal opacity-40">%</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-rc-teal uppercase tracking-[0.5em]">Health Score Global</span>
                                 </div>
                                 <div className="p-12 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[48px] flex flex-col items-center justify-center gap-6 group hover:border-rc-teal/20 transition-all">
                                    <div className="text-7xl font-light text-[var(--text-primary)] tracking-tighter">
                                       {(editedProject.services || []).length}
                                    </div>
                                    <span className="text-[10px] font-medium text-rc-teal uppercase tracking-[0.5em]">Servicios Activos</span>
                                 </div>
                              </div>
                              <div className="p-12 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[48px] space-y-8 backdrop-blur-xl">
                                 <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.4em]">Análisis de Inteligencia</h4>
                                    <ArrowUpRight size={16} className="text-rc-teal opacity-30" />
                                 </div>
                                 <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-light italic">
                                    "La arquitectura proyectada muestra una maduración tecnológica superior. Se recomienda la integración de capas predictivas y optimización de flujos omnicanal para el próximo ciclo."
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}

                      {activeTab === 'quality' && (
                        <div className="space-y-12">
                          {/* TOP SECTION: HISTORICAL SELECTOR & TREND CHART */}
                          <div className="glass-panel p-8 rounded-[40px] border border-[var(--glass-border)] bg-black/25 space-y-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-6 shrink-0">
                                <div>
                                  <span className="text-[9px] font-semibold text-rc-teal uppercase tracking-[0.4em] block mb-2">Historial de Calidad</span>
                                  <h4 className="text-xl font-light text-[var(--text-primary)] uppercase tracking-tight">Tendencia Temporal</h4>
                                </div>
                                
                                {/* Selector de Escala Temporal (Mensual / Anual) */}
                                <div className="flex p-1 bg-[var(--text-primary)]\/5 border border-white/10 rounded-full w-fit">
                                  <button
                                    onClick={() => setTimeScale('month')}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                                      timeScale === 'month'
                                        ? 'bg-[var(--text-primary)] text-[var(--bg-secondary)] font-bold shadow-[0_2px_10px_rgba(255,255,255,0.15)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                  >
                                    Mensual
                                  </button>
                                  <button
                                    onClick={() => setTimeScale('year')}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                                      timeScale === 'year'
                                        ? 'bg-[var(--text-primary)] text-[var(--bg-secondary)] font-bold shadow-[0_2px_10px_rgba(255,255,255,0.15)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                  >
                                    Anual
                                  </button>
                                </div>
                              </div>
                              
                              {/* Selector Horizontal de Períodos */}
                              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 max-w-full lg:max-w-[65%]">
                                {periods.map((p) => {
                                  const isSelected = selectedPeriod?.month === p.month && selectedPeriod?.year === p.year;
                                  const hasEval = p.month > 0
                                    ? editedProject.evaluations?.some(e => e.month === p.month && e.year === p.year)
                                    : editedProject.evaluations?.some(e => e.year === p.year);
                                  return (
                                    <button
                                      key={`${p.month}-${p.year}`}
                                      onClick={() => setSelectedPeriod({ month: p.month, year: p.year })}
                                      className={`px-5 py-3 rounded-2xl text-[10px] font-medium uppercase tracking-wider shrink-0 transition-all flex items-center gap-2 border ${
                                        isSelected
                                          ? 'bg-[var(--text-primary)] border-white text-[var(--bg-secondary)] font-semibold shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105'
                                          : 'bg-[var(--text-primary)]/[0.02] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/[0.05]'
                                      }`}
                                    >
                                      {hasEval && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-rc-teal' : 'bg-rc-teal animate-pulse'}`} />
                                      )}
                                      {p.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Recharts AreaChart */}
                            <div className="h-[200px] w-full bg-black/10 border border-[var(--glass-border)] rounded-3xl p-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={chartData}
                                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="clientQualityGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3BBCA9" stopOpacity={0.25}/>
                                      <stop offset="95%" stopColor="#3BBCA9" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <XAxis 
                                    dataKey="name" 
                                    stroke="#475569" 
                                    fontSize={8}
                                    fontWeight={600}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={5}
                                  />
                                  <YAxis 
                                    stroke="#475569" 
                                    fontSize={8}
                                    fontWeight={600}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 100]}
                                    tickFormatter={(val) => `${val}%`}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: 'var(--bg-secondary)',
                                      border: '1px solid var(--glass-border)',
                                      borderRadius: '16px',
                                      fontSize: '9px',
                                    }}
                                    labelStyle={{ color: 'white', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#3BBCA9' }}
                                  />
                                  <Area 
                                    type="monotone" 
                                    dataKey="Calidad" 
                                    stroke="#3BBCA9" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#clientQualityGrad)" 
                                    dot={(props: any) => {
                                      const { cx, cy, payload } = props;
                                      const isCurrent = selectedPeriod?.month === payload.month && selectedPeriod?.year === payload.year;
                                      return (
                                        <g key={`${payload.month}-${payload.year}`}>
                                          {isCurrent && (
                                            <circle
                                              cx={cx}
                                              cy={cy}
                                              r={12}
                                              fill="#3BBCA9"
                                              className="animate-ping opacity-20"
                                            />
                                          )}
                                          <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isCurrent ? 6 : 4}
                                            stroke="#3BBCA9"
                                            strokeWidth={2}
                                            fill={isCurrent ? '#ffffff' : payload.isReal ? '#3BBCA9' : '#0f172a'}
                                          />
                                        </g>
                                      );
                                    }}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* BOTTOM SECTION: MONTH DETAILED ASSESSMENT */}
                          {selectedPeriod && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                              {/* Left Columns (2/3): Pillars Assessment */}
                              <div className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Star size={14} className="text-rc-teal" /> 10 Pilares de Calidad ({periods.find(p => p.month === selectedPeriod.month && p.year === selectedPeriod.year)?.label})
                                  </h4>
                                  <span className="text-xs font-bold text-rc-teal uppercase bg-rc-teal/5 border border-rc-teal/20 px-4 py-1.5 rounded-full">
                                    Health: {activeEval?.quantitative || Math.round((Object.values(activePillars).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / 50) * 100)}%
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {[
                                     { key: 'sla', label: 'SLA', desc: 'Cumplimiento de acuerdos de nivel de servicio.' },
                                     { key: 'comunicacion', label: 'Comunicación', desc: 'Claridad y fluidez en canales oficiales.' },
                                     { key: 'resolucion', label: 'Resolución', desc: 'Efectividad en el cierre de incidencias.' },
                                     { key: 'experiencia', label: 'Experiencia', desc: 'Nivel de satisfacción del usuario final.' },
                                     { key: 'continuidad', label: 'Continuidad', desc: 'Estabilidad y resiliencia de la operación.' },
                                     { key: 'orden', label: 'Orden', desc: 'Organización de procesos y documentación.' },
                                     { key: 'conversion', label: 'Conversión', desc: 'Efectividad en objetivos de negocio.' },
                                     { key: 'adaptacion', label: 'Adaptación', desc: 'Flexibilidad ante cambios estratégicos.' },
                                     { key: 'cultura', label: 'Cultura', desc: 'Alineación con valores de la corporación.' },
                                     { key: 'valor', label: 'Valor', desc: 'Percepción de retorno sobre inversión.' }
                                  ].map((pillar) => {
                                     const score = (activePillars as any)?.[pillar.key] || 0;
                                     return (
                                        <div key={pillar.key} className="p-10 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[40px] space-y-8 transition-all hover:bg-[var(--text-primary)]/[0.02]">
                                           <div className="flex justify-between items-start">
                                              <div className="space-y-2">
                                                 <span className="text-[14px] font-medium text-[var(--text-primary)] uppercase tracking-tight block">{pillar.label}</span>
                                                 <p className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-[0.2em]">{pillar.desc}</p>
                                              </div>
                                              <span className={`text-[18px] font-light ${score >= 4 ? 'text-rc-teal' : score >= 3 ? 'text-amber-400' : 'text-rose-500'}`}>
                                                 {score}.0
                                              </span>
                                           </div>
                                           <div className="flex gap-2 h-1.5">
                                              {[1, 2, 3, 4, 5].map(n => (
                                                 <div 
                                                    key={n} 
                                                    onClick={isAdmin && selectedPeriod?.month > 0 ? () => {
                                                       updateEvaluationForPeriod(
                                                         (existing) => ({
                                                           pillars: {
                                                             ...(existing.pillars || activePillars),
                                                             [pillar.key]: n
                                                           }
                                                         })
                                                       );
                                                    } : undefined}
                                                    className={`flex-1 rounded-full transition-all duration-700 ${
                                                       score >= n 
                                                       ? 'bg-rc-teal shadow-[0_0_15px_rgba(59,188,169,0.3)]' 
                                                       : 'bg-[var(--text-primary)]\/5'
                                                    } ${isAdmin && selectedPeriod?.month > 0 ? 'cursor-pointer hover:bg-[var(--text-primary)]\/10' : 'cursor-default'}`} 
                                                 />
                                              ))}
                                           </div>
                                        </div>
                                     );
                                  })}
                                </div>
                              </div>

                              {/* Right Column (1/3): Qualitative Observations & Status */}
                              <div className="space-y-8">
                                <div className="space-y-4">
                                  <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-[0.3em] flex items-center gap-3">
                                    <MessageSquare size={14} className="text-rc-teal" /> Diagnóstico Estratégico
                                  </h4>
                                  
                                  {/* Health Status Selector */}
                                  <div className="p-6 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-3xl space-y-4">
                                    <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest block">Salud Operacional</span>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { id: 'Stable', label: 'Estable', color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' },
                                        { id: 'Growth', label: 'Crecimiento', color: 'text-rc-teal border-rc-teal/20 bg-rc-teal/5' },
                                        { id: 'At Risk', label: 'En Riesgo', color: 'text-amber-400 border-amber-400/20 bg-amber-400/5' },
                                        { id: 'Critical', label: 'Crítico', color: 'text-rose-500 border-rose-500/20 bg-rose-500/5' }
                                      ].map((st) => {
                                        const isSelected = activeStatus === st.id;
                                        return (
                                          <button
                                            key={st.id}
                                            disabled={!isAdmin || selectedPeriod?.month === 0}
                                            onClick={() => {
                                              updateEvaluationForPeriod(
                                                () => ({ status: st.id as any })
                                              );
                                            }}
                                            className={`px-4 py-3 rounded-2xl text-[9px] font-medium uppercase tracking-wider transition-all border ${
                                              isSelected
                                                ? st.color + ' scale-105 border-opacity-100 font-bold shadow-lg'
                                                : 'bg-[var(--text-primary)]/[0.02] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-slate-300'
                                            } ${isAdmin && selectedPeriod?.month > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                          >
                                            {st.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Comments Textarea */}
                                  <div className="p-6 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-3xl space-y-4">
                                    <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest block">Observaciones Cualitativas</span>
                                    {isAdmin && selectedPeriod?.month > 0 ? (
                                      <textarea
                                        value={activeQualitative}
                                        onChange={(e) => {
                                          updateEvaluationForPeriod(
                                            () => ({ qualitative: e.target.value })
                                          );
                                        }}
                                        placeholder="Escribe el comentario estratégico de este mes..."
                                        rows={6}
                                        className="w-full bg-black/20 border border-[var(--glass-border)] rounded-2xl p-4 text-xs font-light text-[var(--text-primary)] placeholder-slate-600 focus:outline-none focus:border-rc-teal/50 transition-colors custom-scrollbar"
                                      />
                                    ) : (
                                      <p className="text-xs font-light text-[var(--text-secondary)] leading-relaxed italic p-4 bg-black/10 rounded-2xl border border-[var(--glass-border)] whitespace-pre-line custom-scrollbar max-h-[160px] overflow-y-auto">
                                        {activeQualitative || (selectedPeriod?.month === 0 ? "No hay observaciones cualitativas consolidadas para este año." : "No hay observaciones cualitativas registradas para este período.")}
                                      </p>
                                    )}
                                  </div>

                                  {/* Bitácora de Acciones Tácticas */}
                                  <div className="p-6 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-3xl space-y-6">
                                    <div className="flex items-center justify-between">
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest block">Bitácora de Acciones</span>
                                        <span className="text-[8px] text-rc-teal font-medium uppercase tracking-[0.2em] block">
                                          {selectedPeriod.month === 0 ? 'Resumen Anual (Lectura)' : 'Intervenciones del Periodo'}
                                        </span>
                                      </div>
                                      <div className="w-6 h-6 bg-rc-teal/10 border border-rc-teal/20 rounded-full flex items-center justify-center text-rc-teal text-[9px] font-bold">
                                        {activeEval?.actions?.length || 0}
                                      </div>
                                    </div>

                                    {/* Actions List */}
                                    <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                      {(activeEval?.actions || []).length > 0 ? (
                                        (activeEval?.actions || []).map((action) => {
                                          const catColors = {
                                            'Técnico': 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
                                            'SLA': 'text-amber-400 border-amber-400/20 bg-amber-400/5',
                                            'Procesos': 'text-purple-400 border-purple-400/20 bg-purple-400/5',
                                            'Relación': 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
                                            'Otros': 'text-[var(--text-secondary)] border-slate-400/20 bg-slate-400/5'
                                          };
                                          const isCompleted = action.status === 'Completed';

                                          return (
                                            <div 
                                              key={action.id} 
                                              className={`p-4 rounded-2xl border bg-black/25 flex items-start gap-3 transition-all duration-300 ${
                                                isCompleted ? 'border-[var(--glass-border)] opacity-60' : 'border-white/10 hover:border-white/20'
                                              }`}
                                            >
                                              {selectedPeriod.month > 0 && isAdmin ? (
                                                <button 
                                                  onClick={() => handleToggleAction(action.id)}
                                                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                                                    isCompleted 
                                                      ? 'bg-rc-teal border-rc-teal text-[var(--text-primary)]' 
                                                      : 'border-white/20 text-transparent hover:border-rc-teal/50'
                                                  }`}
                                                >
                                                  <Check size={12} strokeWidth={3} />
                                                </button>
                                              ) : (
                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                              )}

                                              <div className="flex-1 space-y-1.5 min-w-0">
                                                <p className={`text-xs font-light leading-relaxed break-words ${isCompleted ? 'line-through text-[var(--text-secondary)]' : 'text-slate-200'}`}>
                                                  {action.description}
                                                </p>
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[7px] font-semibold uppercase tracking-wider ${catColors[action.category] || catColors['Otros']}`}>
                                                  {action.category}
                                                </span>
                                              </div>

                                              {selectedPeriod.month > 0 && isAdmin && (
                                                <button 
                                                  onClick={() => handleDeleteAction(action.id)}
                                                  className="text-[var(--text-secondary)] hover:text-rose-500 transition-colors p-1"
                                                >
                                                  <Trash2 size={12} />
                                                </button>
                                              )}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="py-8 flex flex-col items-center justify-center border border-dashed border-[var(--glass-border)] rounded-2xl bg-[var(--text-primary)]/[0.005]">
                                          <Tag className="text-slate-800 mb-2" size={24} strokeWidth={1} />
                                          <p className="text-[var(--text-secondary)] font-medium uppercase tracking-[0.2em] text-[8px]">Sin acciones registradas</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Form Section (Admin Only & only in Month view) */}
                                    {selectedPeriod.month > 0 && isAdmin ? (
                                      <div className="space-y-4 pt-4 border-t border-[var(--glass-border)]">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={newActionText}
                                            onChange={(e) => setNewActionText(e.target.value)}
                                            placeholder="Nueva acción o hito..."
                                            className="flex-1 bg-black/25 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs font-light text-[var(--text-primary)] placeholder-slate-600 focus:outline-none focus:border-rc-teal/50 transition-colors"
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddAction();
                                              }
                                            }}
                                          />
                                          <button
                                            onClick={handleAddAction}
                                            disabled={!newActionText.trim()}
                                            className={`px-3 rounded-xl border flex items-center justify-center transition-all ${
                                              newActionText.trim()
                                                ? 'bg-rc-teal/10 border-rc-teal/20 text-rc-teal hover:bg-rc-teal/20'
                                                : 'bg-[var(--text-primary)]\/5 border-[var(--glass-border)] text-[var(--text-secondary)] cursor-not-allowed'
                                            }`}
                                          >
                                            <Plus size={16} />
                                          </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                          {(['Técnico', 'SLA', 'Procesos', 'Relación', 'Otros'] as const).map((cat) => {
                                            const isSelected = newActionCategory === cat;
                                            return (
                                              <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setNewActionCategory(cat)}
                                                className={`px-3 py-1.5 rounded-lg text-[8px] font-medium uppercase tracking-wider transition-all border ${
                                                  isSelected
                                                    ? 'bg-[var(--text-primary)]\/10 border-white/20 text-[var(--text-primary)] font-bold'
                                                    : 'bg-[var(--card-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-slate-300'
                                                }`}
                                              >
                                                {cat}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ) : selectedPeriod.month === 0 ? (
                                      <div className="p-3 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl text-[9px] text-rc-teal leading-relaxed font-light flex items-start gap-2">
                                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                        <span>
                                          Las acciones en la vista <strong>Anual</strong> son consolidadas de los meses del año. Para registrar o editar acciones, cambie a la vista <strong>Mensual</strong>.
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                     {activeTab === 'services' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           {(editedProject.services || []).length > 0 ? (
                              (editedProject.services || []).map((service) => (
                                 <div key={service.id} className="p-10 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[40px] space-y-8 transition-all hover:bg-[var(--text-primary)]/[0.02]">
                                    <div className="flex justify-between items-start">
                                       <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 bg-[var(--text-primary)]/[0.03] rounded-3xl flex items-center justify-center text-rc-teal border border-[var(--glass-border)]">
                                             <Zap size={24} strokeWidth={1} />
                                          </div>
                                          <div>
                                             <span className="text-[16px] font-medium text-[var(--text-primary)] uppercase tracking-tight block">{service.name}</span>
                                             <span className="text-[10px] text-rc-teal font-medium uppercase tracking-[0.3em] mt-1">{service.type}</span>
                                          </div>
                                       </div>
                                       <div className={`px-4 py-2 rounded-full border text-[10px] font-medium uppercase tracking-widest ${service.score >= 4 ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-amber-400 border-amber-400/20 bg-amber-400/5'}`}>
                                          {service.score}.0 Score
                                       </div>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-light italic opacity-80">
                                       "{service.description || 'Proceso estratégico en ejecución continua.'}"
                                    </p>

                                    {/* Métricas Dinámicas */}
                                    {(service.extensionCount || service.positionsCount || service.botmakerType) && (
                                       <div className="flex items-center gap-10 p-6 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-3xl">
                                          {service.extensionCount ? (
                                             <div className="flex flex-col">
                                                <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2">Extensiones</span>
                                                <span className="text-2xl font-light text-[var(--text-primary)] leading-none">{service.extensionCount}</span>
                                             </div>
                                          ) : null}
                                          {service.positionsCount ? (
                                             <div className="flex flex-col">
                                                <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2">Posiciones</span>
                                                <span className="text-2xl font-light text-[var(--text-primary)] leading-none">{service.positionsCount}</span>
                                             </div>
                                          ) : null}
                                          {service.botmakerType ? (
                                             <div className="flex flex-col">
                                                <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2">Motor Bot</span>
                                                <span className="text-[11px] font-medium text-[var(--text-primary)] leading-none truncate max-w-[150px] uppercase">{service.botmakerType.split(' + ')[0]}</span>
                                             </div>
                                          ) : null}
                                       </div>
                                    )}

                                    <div className="pt-6 border-t border-[var(--glass-border)] flex items-center justify-between opacity-40">
                                       <div className="flex items-center gap-3">
                                          <Calendar size={14} strokeWidth={1} />
                                          <span className="text-[9px] font-medium uppercase tracking-widest">Go-Live: {service.startDate}</span>
                                       </div>
                                       <div className="flex items-center gap-3">
                                          <ShieldCheck size={14} strokeWidth={1} />
                                          <span className="text-[9px] font-medium uppercase tracking-widest">Validado</span>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-[var(--glass-border)] rounded-[48px] bg-[var(--card-bg)]">
                                 <Layers className="text-slate-800 mb-8" size={48} strokeWidth={1} />
                                 <p className="text-[var(--text-secondary)] font-medium uppercase tracking-[0.4em] text-[11px]">Bóveda de servicios vacía</p>
                              </div>
                           )}
                        </div>
                     )}

                     {activeTab === 'milestones' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                           {(editedProject.assets || []).length > 0 ? (
                              (editedProject.assets || []).map((asset) => (
                                 <div key={asset.id} className="p-10 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[40px] space-y-8 transition-all hover:bg-[var(--text-primary)]/[0.02]">
                                    <div className="w-16 h-16 bg-[var(--text-primary)]/[0.03] rounded-[28px] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-rc-teal transition-colors border border-[var(--glass-border)]">
                                       <Headphones size={32} strokeWidth={1} />
                                    </div>
                                    <div>
                                       <span className="text-[16px] font-medium text-[var(--text-primary)] uppercase tracking-tight block mb-2">{asset.model}</span>
                                       <div className="flex items-center gap-3 opacity-60">
                                          <User size={12} className="text-rc-teal" />
                                          <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">Asignación: {asset.assignedPosition}</span>
                                       </div>
                                    </div>
                                    <div className={`px-5 py-2.5 rounded-full border text-[9px] font-medium uppercase tracking-[0.2em] w-fit ${
                                       asset.status === 'Operativo' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 
                                       asset.status === 'Mantenimiento' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 
                                       'text-rose-500 border-rose-500/20 bg-rose-500/5'
                                    }`}>
                                       {asset.status}
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-[var(--glass-border)] rounded-[48px] bg-[var(--card-bg)]">
                                 <Cpu className="text-slate-800 mb-8" size={48} strokeWidth={1} />
                                 <p className="text-[var(--text-secondary)] font-medium uppercase tracking-[0.4em] text-[11px]">Sin activos de hardware</p>
                              </div>
                           )}
                        </div>
                     )}

                     {activeTab === 'admin' && (
                        <div className="max-w-3xl mx-auto space-y-4">
                           {[
                              { id: 'paymentPunctuality', label: 'Puntualidad en Gestión de Pagos' },
                              { id: 'timelyDocumentation', label: 'Entrega Oportuna de Información' },
                              { id: 'advisoryReceptivity', label: 'Apertura a Asesoría Estratégica' },
                              { id: 'effectiveServiceUse', label: 'Uso de Herramientas Tecnológicas' },
                              { id: 'serviceContinuity', label: 'Fidelidad / Continuidad Operativa' },
                              { id: 'reportValuation', label: 'Valoración de Reportes / Data' },
                              { id: 'projectLeader', label: 'Líder de Proyecto con Poder Decisión' }
                           ].map(item => (
                              <div 
                                 key={item.id}
                                 onClick={isAdmin ? () => {
                                    const currentEval = (editedProject.clientEvaluation || {
                                       satisfactionLevel: 0,
                                       maturityIndex: 'Nivel 1: Inicial',
                                       growthPotential: '',
                                       status: 'Verde'
                                    }) as any;
                                    setEditedProject({
                                       ...editedProject,
                                       clientEvaluation: {
                                          ...currentEval,
                                          [item.id]: !currentEval[item.id as keyof typeof currentEval]
                                       }
                                    });
                                 } : undefined}
                                 className={`p-8 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[32px] flex items-center justify-between group transition-all ${
                                    isAdmin ? 'cursor-pointer hover:bg-[var(--text-primary)]/[0.03]' : 'cursor-default'
                                 }`}
                              >
                                 <span className={`text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.2em] ${isAdmin ? 'group-hover:text-[var(--text-primary)]' : ''} transition-colors`}>{item.label}</span>
                                 <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-700 ${
                                    editedProject.clientEvaluation?.[item.id as keyof typeof editedProject.clientEvaluation] 
                                    ? 'bg-[var(--text-primary)] border-white text-[var(--bg-secondary)] scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                                    : 'border-white/10 text-transparent'
                                 }`}>
                                    <Check size={16} strokeWidth={3} />
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* Global Footer Actions */}
            <div className="p-12 bg-[var(--bg-secondary)] border-t border-[var(--glass-border)] flex items-center justify-between">
               <div className="flex items-center gap-10">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--text-primary)]/[0.02] flex items-center justify-center text-[9px] font-semibold text-[var(--text-secondary)] uppercase">
                           {i === 1 ? 'AI' : i === 2 ? 'PM' : i === 3 ? 'OP' : 'QA'}
                        </div>
                     ))}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-[var(--text-primary)] uppercase tracking-[0.5em] block opacity-80">
                      {editedProject.lastModifiedBy ? `Audit: ${editedProject.lastModifiedBy}` : 'Ecosistema Rc506'}
                    </span>
                    <span className="text-[8px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">
                      {editedProject.lastModifiedAt ? `Última Modificación: ${new Date(editedProject.lastModifiedAt).toLocaleString()}` : 'Validación de Protocolo V4.2'}
                    </span>
                  </div>
               </div>
                <div className="flex items-center gap-10">
                   {isAdmin ? (
                      <>
                         <button onClick={onClose} className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.3em] hover:text-[var(--text-primary)] transition-colors cursor-pointer">Cancelar</button>
                         <button 
                            onClick={handleSave}
                            className="px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-secondary)] text-[11px] font-medium uppercase tracking-[0.2em] rounded-full hover:bg-slate-200 active:scale-95 transition-all shadow-2xl cursor-pointer"
                         >
                            Sincronizar Estrategia
                         </button>
                      </>
                   ) : (
                      <button 
                         onClick={onClose}
                         className="px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-secondary)] text-[11px] font-medium uppercase tracking-[0.2em] rounded-full hover:bg-slate-200 active:scale-95 transition-all shadow-2xl cursor-pointer"
                      >
                         Cerrar Expediente
                      </button>
                   )}
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectDetailsModal;
