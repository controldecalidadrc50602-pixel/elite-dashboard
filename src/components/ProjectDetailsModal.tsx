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
      case 'Verde': return 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]';
      case 'Amarilla': return 'text-amber-400 bg-amber-400/5 border-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]';
      case 'Roja': return 'text-rose-500 bg-rose-500/5 border-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'Negra': return 'text-slate-200 bg-slate-900 border-white/10';
      default: return 'text-rc-teal bg-rc-teal/5 border-rc-teal/10';
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
                         <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${getFlagColor(editedProject.healthFlag)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                               editedProject.healthFlag === 'Verde' ? 'bg-emerald-400' : 
                               editedProject.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-500'
                            }`} />
                            Bandera {editedProject.healthFlag}
                         </div>
                         <div className="h-4 w-px bg-white/10" />
                         <div className="flex gap-1">
                            {['En Proceso', 'Prueba', 'Activo', 'Inactivo'].map(status => (
                               <button
                                  key={status}
                                  onClick={() => setEditedProject({ ...editedProject, adminStatus: status as any })}
                                  className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                     editedProject.adminStatus === status 
                                     ? 'bg-rc-teal text-black shadow-lg shadow-rc-teal/20' 
                                     : 'bg-white/5 text-slate-500 hover:text-white'
                                  }`}
                               >
                                  {status}
                               </button>
                            ))}
                         </div>
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
                      <h3 className="text-meta">2. Pilares de Calidad Trimestral (Q1 - Q4)</h3>
                     
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
                   <div className="flex items-center justify-between">
                      <h3 className="text-meta">2. Autoevaluación Trimestral</h3>
                      <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map(n => (
                            <Star key={n} size={10} className="text-rc-teal opacity-40" />
                         ))}
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      {[
                         { key: 'responseTime', label: 'Tiempo de Respuesta', desc: '¿Qué tan rápido respondemos?' },
                         { key: 'communicationQuality', label: 'Calidad Comunicación', desc: 'Tono, empatía y claridad' },
                         { key: 'effectiveResolution', label: 'Resolución Efectiva', desc: 'Solución real y cierre' },
                         { key: 'customerExperience', label: 'Experiencia Cliente', desc: 'Confianza, facilidad y orden' },
                         { key: 'operationalContinuity', label: 'Continuidad Operativa', desc: 'Estabilidad y cumplimiento' },
                         { key: 'orderTraceability', label: 'Orden y Trazabilidad', desc: 'Organización operativa' },
                         { key: 'commercialConversion', label: 'Conversión Comercial', desc: 'Resultados y reuniones' },
                         { key: 'adaptability', label: 'Capacidad Adaptación', desc: 'Flexibilidad y personalización' },
                         { key: 'serviceCulture', label: 'Cultura de Servicio', desc: 'Actitud y disposición' },
                         { key: 'valuePerception', label: 'Percepción de Valor', desc: 'Posicionamiento y confianza' }
                      ].map((pillar) => {
                         const score = (editedProject.quarterlyAssessment as any)?.[pillar.key] || 0;
                         const getStatusLabel = (s: number) => {
                            switch(s) {
                               case 1: return 'CRÍTICO';
                               case 2: return 'DEBE MEJORAR';
                               case 3: return 'ACEPTABLE';
                               case 4: return 'BUENO';
                               case 5: return 'ÓPTIMO';
                               default: return 'SIN EVALUAR';
                            }
                         };

                         return (
                            <div key={pillar.key} className="space-y-3 group bg-white/[0.02] p-4 rounded-2xl border border-transparent hover:border-white/5 transition-all">
                               <div className="flex justify-between items-start">
                                  <div>
                                     <span className="text-[10px] font-black text-white uppercase tracking-tighter group-hover:text-rc-teal transition-colors">
                                        {pillar.label}
                                     </span>
                                     <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {pillar.desc}
                                     </p>
                                  </div>
                                  <div className="text-right">
                                     <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                                        score <= 1 ? 'bg-rose-500/10 text-rose-500' :
                                        score <= 3 ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-rc-teal/10 text-rc-teal'
                                     }`}>
                                        {getStatusLabel(score)}
                                     </span>
                                  </div>
                               </div>
                               
                               <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((num) => (
                                     <button
                                        key={num}
                                        onClick={() => {
                                           const newAssessment = { 
                                              ...(editedProject.quarterlyAssessment || {
                                                 responseTime: 0, communicationQuality: 0, effectiveResolution: 0,
                                                 customerExperience: 0, operationalContinuity: 0, orderTraceability: 0,
                                                 commercialConversion: 0, adaptability: 0, serviceCulture: 0, valuePerception: 0
                                              }), 
                                              [pillar.key]: num 
                                           };
                                           setEditedProject({ ...editedProject, quarterlyAssessment: newAssessment as any });
                                        }}
                                        className="flex-1 group/star"
                                     >
                                        <div className={`h-1.5 rounded-full transition-all duration-500 ${
                                           score >= num
                                           ? 'bg-rc-teal shadow-[0_0_12px_rgba(59,188,169,0.4)]'
                                           : 'bg-white/5 group-hover/star:bg-white/10'
                                        }`} />
                                     </button>
                                  ))}
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>

               {/* Col 3: Comportamiento Cliente */}
               <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                     <h3 className="text-meta">3. Evaluación Administrativa</h3>
                     
                     <div className="space-y-3">
                        {[
                           { id: 'projectLeader', label: 'Líder de Proyecto Asignado' },
                           { id: 'timelyDocumentation', label: 'Entrega Info Oportuna' },
                           { id: 'advisoryReceptivity', label: 'Receptivo a Asesoría' },
                           { id: 'effectiveServiceUse', label: 'Uso Efectivo del Servicio' },
                           { id: 'serviceContinuity', label: 'Continuidad en el Uso' },
                           { id: 'reportValuation', label: 'Valora Informes de Gestión' },
                           { id: 'paymentPunctuality', label: 'Puntualidad en Pagos' }
                        ].map(item => (
                           <div 
                              key={item.id} 
                              onClick={() => {
                                                                   const currentEval = (editedProject.clientEvaluation as any) || { projectLeader: false, timelyDocumentation: false, advisoryReceptivity: false, effectiveServiceUse: false, serviceContinuity: false, reportValuation: false, paymentPunctuality: false, status: 'Verde' };

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
