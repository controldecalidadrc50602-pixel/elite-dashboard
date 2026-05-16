import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Trash2, Calendar, Star, ShieldCheck, Edit3, AlertCircle, Save, Bell, 
  CheckCircle, AlertTriangle, FileText, Activity, Globe, Headphones, Cpu, Zap, Wifi, Layers,
  ChevronDown, MessageSquare, User, Users, Clock, History, Phone, ShieldAlert, Archive, Trash,
  TrendingUp, ArrowUpRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, QuarterlyAssessment, ClientEvaluation } from '../types/project';
import { exportService } from '../services/exportService';

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
  const [activeTab, setActiveTab] = useState<'summary' | 'services' | 'quality' | 'admin' | 'milestones'>('summary');
  const [editedProject, setEditedProject] = useState<Project | null>(project);

  React.useEffect(() => {
    setEditedProject(project);
  }, [project]);

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
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl" 
          />
          <motion.div 
            initial={{ scale: 0.98, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.98, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-[85vw] h-[90vh] bg-[#0B0E14] border border-white/5 rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-[110] font-light"
          >
            {/* Action Bar Superior */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-[#0B0E14]/50 backdrop-blur-3xl">
               <div className="flex items-center gap-10">
                  <div className="w-20 h-20 bg-white/[0.01] rounded-[32px] border border-white/5 flex items-center justify-center p-6 transition-all group-hover:border-rc-teal/30">
                     {editedProject.logoUrl ? (
                        <img src={editedProject.logoUrl} className="w-full h-full object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                     ) : (
                        <ShieldCheck className="text-white opacity-10" size={32} />
                     )}
                  </div>
                  <div>
                     <div className="flex items-center gap-6">
                        <h2 className="text-5xl font-light text-white tracking-tighter leading-none">{editedProject.client}</h2>
                        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-medium uppercase tracking-[0.2em] flex items-center gap-2 ${getFlagColor(editedProject.healthFlag)}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${editedProject.healthFlag === 'Verde' ? 'bg-emerald-400' : editedProject.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                           Salud: {editedProject.healthFlag}
                        </div>
                     </div>
                     <div className="flex items-center gap-3 mt-6">
                        {['En Proceso', 'Prueba', 'Activo', 'Inactivo'].map(status => (
                           <button
                              key={status}
                              onClick={() => setEditedProject({ ...editedProject, adminStatus: status as any })}
                              className={`px-5 py-2 rounded-full text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ${
                                 editedProject.adminStatus === status 
                                 ? 'bg-white text-black' 
                                 : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                              }`}
                           >
                              {status}
                           </button>
                        ))}
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
                  <button onClick={() => onEditRequest?.(editedProject)} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-[32px] border border-white/5 text-slate-400 hover:text-white transition-all">
                     <Edit3 size={18} strokeWidth={1.5} />
                     <span className="text-[8px] font-medium uppercase tracking-widest">Ajustes</span>
                  </button>
                  <button 
                    onClick={() => onArchive?.(editedProject)}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-amber-500/10 rounded-[32px] border border-white/5 text-slate-400 hover:text-amber-400 transition-all"
                  >
                     <Archive size={18} strokeWidth={1.5} />
                     <span className="text-[8px] font-medium uppercase tracking-widest">Archivar</span>
                  </button>
                  <button onClick={() => onDelete?.(editedProject.id)} className="flex flex-col items-center gap-2 p-4 bg-rose-500/5 hover:bg-rose-500/10 rounded-[32px] border border-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-all">
                     <Trash size={18} strokeWidth={1.5} />
                     <span className="text-[8px] font-medium uppercase tracking-widest">Eliminar</span>
                  </button>
                  <div className="h-10 w-px bg-white/5 mx-4" />
                  <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all border border-white/5">
                     <X size={24} strokeWidth={1} />
                  </button>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex px-12 gap-2 border-b border-white/5 bg-black/10">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-4 px-8 py-6 text-[11px] font-medium uppercase tracking-[0.3em] transition-all relative ${
                        activeTab === tab.id ? 'text-white' : 'text-slate-600 hover:text-white'
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
                              <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4 opacity-60">
                                 <Globe size={14} className="text-rc-teal" strokeWidth={1.5} /> ADN Tecnológico
                              </h3>
                              <div className="space-y-4">
                                 {[
                                    { label: 'País de Origen', value: editedProject.techDNA?.country },
                                    { label: 'Sip Trunk Virtual', value: editedProject.techDNA?.sipTrunkVirtual },
                                    { label: 'ISP / Conectividad', value: editedProject.techDNA?.isp },
                                    { label: 'Modelo Operativo', value: editedProject.techDNA?.operationMode }
                                 ].map(item => (
                                    <div key={item.label} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex justify-between items-center group hover:bg-white/[0.02] transition-all">
                                       <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">{item.label}</span>
                                       <span className="text-[11px] font-medium text-white uppercase tracking-tighter">{item.value || 'Pendiente'}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="md:col-span-2 space-y-12">
                              <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4 opacity-60">
                                 <TrendingUp size={14} className="text-rc-teal" strokeWidth={1.5} /> Indicadores Estratégicos
                              </h3>
                              <div className="grid grid-cols-2 gap-10">
                                 <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[48px] flex flex-col items-center justify-center gap-6 group hover:border-rc-teal/20 transition-all">
                                    <div className="text-7xl font-light text-white tracking-tighter flex items-baseline gap-2">
                                       {Object.values(editedProject?.quarterlyAssessment || {}).reduce((a: any, b: any) => a + (typeof b === 'number' ? b : 0), 0)}
                                       <span className="text-2xl text-rc-teal opacity-40">%</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-rc-teal uppercase tracking-[0.5em]">Health Score Global</span>
                                 </div>
                                 <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[48px] flex flex-col items-center justify-center gap-6 group hover:border-rc-teal/20 transition-all">
                                    <div className="text-7xl font-light text-white tracking-tighter">
                                       {(editedProject.services || []).length}
                                    </div>
                                    <span className="text-[10px] font-medium text-rc-teal uppercase tracking-[0.5em]">Servicios Activos</span>
                                 </div>
                              </div>
                              <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[48px] space-y-8 backdrop-blur-xl">
                                 <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.4em]">Análisis de Inteligencia</h4>
                                    <ArrowUpRight size={16} className="text-rc-teal opacity-30" />
                                 </div>
                                 <p className="text-lg text-slate-400 leading-relaxed font-light italic">
                                    "La arquitectura proyectada muestra una maduración tecnológica superior. Se recomienda la integración de capas predictivas y optimización de flujos omnicanal para el próximo ciclo."
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}

                      {activeTab === 'quality' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                              const score = (editedProject.quarterlyAssessment as any)?.[pillar.key] || 0;
                              return (
                                 <div key={pillar.key} className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8 transition-all hover:bg-white/[0.02]">
                                    <div className="flex justify-between items-start">
                                       <div className="space-y-2">
                                          <span className="text-[14px] font-medium text-white uppercase tracking-tight block">{pillar.label}</span>
                                          <p className="text-[9px] text-slate-600 font-medium uppercase tracking-[0.2em]">{pillar.desc}</p>
                                       </div>
                                       <span className={`text-[18px] font-light ${score >= 4 ? 'text-rc-teal' : score >= 3 ? 'text-amber-400' : 'text-rose-500'}`}>
                                          {score}.0
                                       </span>
                                    </div>
                                    <div className="flex gap-2 h-1.5">
                                       {[1, 2, 3, 4, 5].map(n => (
                                          <div 
                                             key={n} 
                                             onClick={() => {
                                                const currentAssessment = editedProject.quarterlyAssessment || {
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
                                                setEditedProject({
                                                   ...editedProject,
                                                   quarterlyAssessment: {
                                                      ...currentAssessment,
                                                      [pillar.key]: n
                                                   }
                                                });
                                             }}
                                             className={`flex-1 rounded-full cursor-pointer transition-all duration-700 ${
                                                score >= n 
                                                ? 'bg-rc-teal shadow-[0_0_15px_rgba(59,188,169,0.3)]' 
                                                : 'bg-white/5 hover:bg-white/10'
                                             }`} 
                                          />
                                       ))}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     )}

                     {activeTab === 'services' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           {(editedProject.services || []).length > 0 ? (
                              (editedProject.services || []).map((service) => (
                                 <div key={service.id} className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8 transition-all hover:bg-white/[0.02]">
                                    <div className="flex justify-between items-start">
                                       <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 bg-white/[0.03] rounded-3xl flex items-center justify-center text-rc-teal border border-white/5">
                                             <Zap size={24} strokeWidth={1} />
                                          </div>
                                          <div>
                                             <span className="text-[16px] font-medium text-white uppercase tracking-tight block">{service.name}</span>
                                             <span className="text-[10px] text-rc-teal font-medium uppercase tracking-[0.3em] mt-1">{service.type}</span>
                                          </div>
                                       </div>
                                       <div className={`px-4 py-2 rounded-full border text-[10px] font-medium uppercase tracking-widest ${service.score >= 4 ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-amber-400 border-amber-400/20 bg-amber-400/5'}`}>
                                          {service.score}.0 Score
                                       </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed font-light italic opacity-80">
                                       "{service.description || 'Proceso estratégico en ejecución continua.'}"
                                    </p>

                                    {/* Métricas Dinámicas */}
                                    {(service.extensionCount || service.positionsCount || service.botmakerType) && (
                                       <div className="flex items-center gap-10 p-6 bg-white/[0.01] border border-white/5 rounded-3xl">
                                          {service.extensionCount ? (
                                             <div className="flex flex-col">
                                                <span className="text-[9px] font-medium text-slate-600 uppercase tracking-[0.2em] mb-2">Extensiones</span>
                                                <span className="text-2xl font-light text-white leading-none">{service.extensionCount}</span>
                                             </div>
                                          ) : null}
                                          {service.positionsCount ? (
                                             <div className="flex flex-col">
                                                <span className="text-[9px] font-medium text-slate-600 uppercase tracking-[0.2em] mb-2">Posiciones</span>
                                                <span className="text-2xl font-light text-white leading-none">{service.positionsCount}</span>
                                             </div>
                                          ) : null}
                                          {service.botmakerType ? (
                                             <div className="flex flex-col">
                                                <span className="text-[9px] font-medium text-slate-600 uppercase tracking-[0.2em] mb-2">Motor Bot</span>
                                                <span className="text-[11px] font-medium text-white leading-none truncate max-w-[150px] uppercase">{service.botmakerType.split(' + ')[0]}</span>
                                             </div>
                                          ) : null}
                                       </div>
                                    )}

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-40">
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
                              <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[48px] bg-white/[0.01]">
                                 <Layers className="text-slate-800 mb-8" size={48} strokeWidth={1} />
                                 <p className="text-slate-600 font-medium uppercase tracking-[0.4em] text-[11px]">Bóveda de servicios vacía</p>
                              </div>
                           )}
                        </div>
                     )}

                     {activeTab === 'milestones' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                           {(editedProject.assets || []).length > 0 ? (
                              (editedProject.assets || []).map((asset) => (
                                 <div key={asset.id} className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8 transition-all hover:bg-white/[0.02]">
                                    <div className="w-16 h-16 bg-white/[0.03] rounded-[28px] flex items-center justify-center text-slate-500 group-hover:text-rc-teal transition-colors border border-white/5">
                                       <Headphones size={32} strokeWidth={1} />
                                    </div>
                                    <div>
                                       <span className="text-[16px] font-medium text-white uppercase tracking-tight block mb-2">{asset.model}</span>
                                       <div className="flex items-center gap-3 opacity-60">
                                          <User size={12} className="text-rc-teal" />
                                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Asignación: {asset.assignedPosition}</span>
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
                              <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[48px] bg-white/[0.01]">
                                 <Cpu className="text-slate-800 mb-8" size={48} strokeWidth={1} />
                                 <p className="text-slate-600 font-medium uppercase tracking-[0.4em] text-[11px]">Sin activos de hardware</p>
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
                                 onClick={() => {
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
                                 }}
                                 className="p-8 bg-white/[0.01] border border-white/5 rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all"
                              >
                                 <span className="text-[12px] font-medium text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{item.label}</span>
                                 <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-700 ${
                                    editedProject.clientEvaluation?.[item.id as keyof typeof editedProject.clientEvaluation] 
                                    ? 'bg-white border-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
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
            <div className="p-12 bg-[#0B0E14] border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-10">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0B0E14] bg-white/[0.02] flex items-center justify-center text-[9px] font-medium text-slate-500 uppercase">
                           {i === 1 ? 'AI' : i === 2 ? 'PM' : i === 3 ? 'OP' : 'QA'}
                        </div>
                     ))}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-white uppercase tracking-[0.5em] block opacity-80">Ecosistema Rc506</span>
                    <span className="text-[8px] font-medium text-slate-600 uppercase tracking-widest">Validación de Protocolo V4.2</span>
                  </div>
               </div>
               <div className="flex items-center gap-10">
                  <button onClick={onClose} className="text-[11px] font-medium text-slate-600 uppercase tracking-[0.3em] hover:text-white transition-colors">Cerrar</button>
                  <button 
                     onClick={handleSave}
                     className="px-12 py-5 bg-white text-black text-[11px] font-medium uppercase tracking-[0.2em] rounded-full hover:bg-slate-200 active:scale-95 transition-all shadow-2xl"
                  >
                     Sincronizar Estrategia
                  </button>
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
