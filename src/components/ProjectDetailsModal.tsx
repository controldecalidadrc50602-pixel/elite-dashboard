import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Plus, Trash2, Calendar, Star, ShieldCheck, Edit3, AlertCircle, Save, Bell, 
  CheckCircle, AlertTriangle, FileText, Activity, Globe, Headphones, Cpu, Zap, Wifi, Layers,
  ChevronDown, MessageSquare, User, Users, Clock, History, Phone, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Evaluation, Alert, ClientService, ServiceLog } from '../types/project';
import { exportService } from '../services/exportService';
import TaskManager from './TaskManager';

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (project: Project) => void;
  onDelete?: (id: string) => void;
  onEditRequest?: (project: Project) => void;
}
const ProjectDetailsModal: React.FC<Props> = ({ 
  project, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete, 
  onEditRequest 
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'identity' | 'operations' | 'services' | 'tech' | 'assets' | 'evaluation'>('identity');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(project);

  // Sync editedProject when project changes
  React.useEffect(() => {
    setEditedProject(project);
  }, [project]);

  if (!project || !editedProject) return null;

  const handleSave = () => {
    onUpdate(editedProject);
    setIsEditing(false);
  };

  const getFlagColor = (flag: string) => {
    switch(flag) {
      case 'Verde': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Amarilla': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Roja': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Negra': return 'text-slate-900 bg-slate-950/20 border-slate-900/30';
      default: return 'text-rc-teal bg-[var(--rc-turquoise)]/10 border-rc-teal/20';
    }
  };


  const calculateScore = (assessment: any) => {
    if (!assessment) return 0;
    const values = Object.values(assessment).filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / (values.length * 5)) * 100);
  };

  const currentScore = calculateScore(editedProject.quarterlyAssessment);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-[95vw] h-[90vh] bg-[#0a0a0b] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col z-[110]"
          >
            {/* Header Compacto */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-center p-3 shadow-xl">
                     {editedProject.logoUrl ? (
                        <img src={editedProject.logoUrl} className="w-full h-full object-contain" />
                     ) : (
                        <Activity className="text-rc-teal opacity-20" size={24} />
                     )}
                  </div>
                  <div>
                     <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{editedProject.client}</h2>
                     <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black text-rc-teal uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck size={14} /> Expediente CRM SmartView
                        </span>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${editedProject.healthFlag === 'Verde' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-8">
                  <div className="text-right">
                     <div className="text-4xl font-black text-white tracking-tighter leading-none">{currentScore}%</div>
                     <div className="text-[10px] font-black text-rc-teal uppercase tracking-[0.2em] mt-1">Calidad Global</div>
                  </div>
                  <div className="h-12 w-px bg-white/10" />
                  <div className="flex items-center gap-3">
                     <button onClick={() => exportService.exportIndividualPDF(editedProject, t)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5 premium-button">
                        <FileText size={20} strokeWidth={1.5} />
                     </button>
                     <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5 premium-button">
                        <X size={20} strokeWidth={1.5} />
                     </button>
                  </div>
               </div>
            </div>

            {/* SmartView Grid: 3 Columnas */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-x divide-white/5 overflow-hidden">
               
               {/* Col 1: Tech DNA & Identity */}
               <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar bg-black/10">
                  <div className="space-y-6">
                     <h3 className="text-meta">1. Identidad & Tech DNA</h3>
                     
                     <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Modalidad</label>
                        <div className="grid grid-cols-2 gap-2">
                           {['RC506', 'WYP', 'IPBX', 'HIBRIDO'].map(mode => (
                              <button key={mode} className={`py-3 rounded-xl text-[9px] font-black border transition-all ${editedProject.techDNA?.operationMode === mode ? 'bg-rc-teal/20 border-rc-teal text-rc-teal' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                                 {mode}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[10px] font-bold text-slate-400 uppercase">Troncal Virtual</span>
                           <span className="text-[10px] font-black text-white">{editedProject.techDNA?.sipTrunkVirtual || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[10px] font-bold text-slate-400 uppercase">País</span>
                           <span className="text-[10px] font-black text-white">{editedProject.techDNA?.country || 'Costa Rica'}</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[10px] font-bold text-slate-400 uppercase">Account Manager</span>
                           <span className="text-[10px] font-black text-rc-teal">{editedProject.accountManager || 'No asignado'}</span>
                        </div>
                     </div>

                     <div className="p-6 bg-rc-teal/5 rounded-3xl border border-rc-teal/10 mt-8">
                        <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Activity size={12} /> Pulso Operativo
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="text-center">
                              <div className="text-xl font-black text-white">{editedProject.opsPulse?.hcReal || 0}</div>
                              <div className="text-[8px] font-bold text-slate-500 uppercase">HC Real</div>
                           </div>
                           <div className="text-center">
                              <div className="text-xl font-black text-white">{editedProject.opsPulse?.hcContracted || 0}</div>
                              <div className="text-[8px] font-bold text-slate-500 uppercase">HC Contrato</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Col 2: 10 Pilares de Calidad */}
               <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar bg-black/5">
                  <h3 className="text-meta">2. Autoevaluación de Calidad (1-5)</h3>
                  
                  <div className="space-y-5">
                     {[
                        { key: 'responseTime', label: 'Tiempo de Respuesta' },
                        { key: 'communication', label: 'Comunicación Fluida' },
                        { key: 'resolution', label: 'Capacidad de Resolución' },
                        { key: 'proactivity', label: 'Proactividad Operativa' },
                        { key: 'technicalKnowledge', label: 'Conocimiento Técnico' },
                        { key: 'reliability', label: 'Confiabilidad / Backup' },
                        { key: 'flexibility', label: 'Flexibilidad de Cambio' },
                        { key: 'innovation', label: 'Aporte de Innovación' },
                        { key: 'documentation', label: 'Reportes & Documentos' },
                        { key: 'overallSatisfaction', label: 'Satisfacción Global' }
                     ].map((pillar) => (
                        <div key={pillar.key} className="space-y-2 group">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-rc-teal transition-colors">
                                 {pillar.label}
                              </span>
                              <span className="text-xs font-black text-rc-teal">
                                 {editedProject.quarterlyAssessment?.[pillar.key as keyof typeof editedProject.quarterlyAssessment] || 0}/5
                              </span>
                           </div>
                           <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((num) => (
                                 <button
                                    key={num}
                                    onClick={() => {
                                       const newAssessment = { 
                                          ...(editedProject.quarterlyAssessment || {
                                             responseTime: 0, communication: 0, resolution: 0, proactivity: 0,
                                             technicalKnowledge: 0, reliability: 0, flexibility: 0, innovation: 0,
                                             documentation: 0, overallSatisfaction: 0
                                          }), 
                                          [pillar.key]: num 
                                       };
                                       setEditedProject({ ...editedProject, quarterlyAssessment: newAssessment });
                                    }}
                                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                                       (editedProject.quarterlyAssessment?.[pillar.key as keyof typeof editedProject.quarterlyAssessment] || 0) >= num
                                       ? 'bg-rc-teal shadow-[0_0_8px_rgba(59,188,169,0.4)]'
                                       : 'bg-white/5'
                                    }`}
                                 />
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Col 3: Comportamiento Cliente */}
               <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                     <h3 className="text-meta">3. Evaluación Administrativa</h3>
                     
                     <div className="space-y-3">
                        {[
                           { id: 'projectLeader', label: 'Líder de Proyecto Asignado' },
                           { id: 'documentation', label: 'Entrega Info Oportuna' },
                           { id: 'receptivity', label: 'Apertura a Asesoría' },
                           { id: 'continuity', label: 'Continuidad del Servicio' },
                           { id: 'reportValuation', label: 'Valora Informes de Gestión' },
                           { id: 'paymentPunctuality', label: 'Puntualidad en Pagos' }
                        ].map(item => (
                           <div 
                              key={item.id} 
                              onClick={() => {
                                 const currentEval = editedProject.clientEvaluation || { projectLeader: false, documentation: false, receptivity: false, continuity: false, reportValuation: false, paymentPunctuality: false, status: 'Verde' };
                                 const newVal = !currentEval[item.id as keyof typeof currentEval];
                                 setEditedProject({
                                    ...editedProject,
                                    clientEvaluation: { ...currentEval, [item.id]: newVal }
                                 });
                              }}
                              className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all group"
                           >
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                 editedProject.clientEvaluation?.[item.id as keyof typeof editedProject.clientEvaluation] 
                                 ? 'bg-rc-teal border-rc-teal text-black' 
                                 : 'border-white/10 text-transparent'
                              }`}>
                                 <CheckCircle size={14} strokeWidth={3} />
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="p-8 bg-rose-500/5 rounded-[32px] border border-rose-500/10 mt-10">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <AlertTriangle size={14} /> Notas de Auditoría
                        </h4>
                        <textarea 
                           className="w-full bg-transparent border-none p-0 text-xs text-slate-400 leading-relaxed resize-none h-24 focus:ring-0"
                           placeholder="Escriba observaciones críticas sobre la gestión de esta cuenta..."
                        />
                     </div>
                  </div>
               </div>

            </div>

            {/* Footer de Acciones */}
            <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${editedProject.healthFlag === 'Verde' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Estado de Registro Sincronizado</span>
               </div>
               <div className="flex items-center gap-4">
                  <button 
                     onClick={handleSave}
                     className="px-10 py-4 bg-rc-teal text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rc-teal/20 transition-all hover:scale-105 active:scale-95 premium-button"
                  >
                     Guardar Cambios en CRM
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
