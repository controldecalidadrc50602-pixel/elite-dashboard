import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Plus, Trash2, Calendar, Star, ShieldCheck, Edit3, AlertCircle, Save, Bell, 
  CheckCircle, AlertTriangle, FileText, Activity, Globe, Headphones, Cpu, Zap, Wifi, Layers,
  ChevronDown, MessageSquare, User, Users, Clock, History, Phone, ShieldAlert, Archive, Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/project';
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
    { id: 'quality', label: 'Calidad (10P)', icon: Star },
    { id: 'admin', label: 'Administrativo', icon: ShieldCheck },
    { id: 'milestones', label: 'Activos', icon: Headphones }
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-[95vw] h-[90vh] bg-[var(--bg-main)] border border-[var(--border-ultra-thin)] rounded-[32px] shadow-2xl overflow-hidden flex flex-col z-[110]"
          >
            {/* Action Bar Superior */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/[0.03] rounded-3xl border border-white/10 flex items-center justify-center p-3 shadow-2xl">
                     {editedProject.logoUrl ? (
                        <img src={editedProject.logoUrl} className="w-full h-full object-contain" />
                     ) : (
                        <ShieldCheck className="text-rc-teal opacity-40" size={32} />
                     )}
                  </div>
                  <div>
                     <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-semibold text-white tracking-tight uppercase leading-none">{editedProject.client}</h2>
                        <div className={`px-3 py-1 rounded-full border text-[9px] font-semibold uppercase tracking-widest flex items-center gap-2 ${getFlagColor(editedProject.healthFlag)}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${editedProject.healthFlag === 'Verde' ? 'bg-emerald-400' : editedProject.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                           Bandera {editedProject.healthFlag}
                        </div>
                     </div>
                     <div className="flex items-center gap-4 mt-3">
                        {['En Proceso', 'Prueba', 'Activo', 'Inactivo'].map(status => (
                           <button
                              key={status}
                              onClick={() => setEditedProject({ ...editedProject, adminStatus: status as any })}
                              className={`px-4 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-widest transition-all ${
                                 editedProject.adminStatus === status 
                                 ? 'bg-rc-teal text-black shadow-lg shadow-rc-teal/30' 
                                 : 'bg-white/5 text-slate-500 hover:text-white'
                              }`}
                           >
                              {status}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button onClick={() => onEditRequest?.(editedProject)} className="flex flex-col items-center gap-1 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all group">
                     <Edit3 size={18} />
                     <span className="label-executive text-[7px]">Editar</span>
                  </button>
                  <button 
                    onClick={() => onArchive?.(editedProject)}
                    className="flex flex-col items-center gap-1 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-slate-400 hover:text-amber-400 transition-all"
                  >
                     <Archive size={18} />
                     <span className="label-executive text-[7px]">Archivar</span>
                  </button>
                  <button onClick={() => onDelete?.(editedProject.id)} className="flex flex-col items-center gap-1 p-3 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl border border-rose-500/20 text-rose-500 transition-all">
                     <Trash size={18} />
                     <span className="label-executive text-[7px]">Eliminar</span>
                  </button>
                  <div className="h-10 w-px bg-white/10 mx-2" />
                  <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5">
                     <X size={24} strokeWidth={2} />
                  </button>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex px-10 gap-2 border-b border-[var(--border-ultra-thin)] bg-[var(--bg-input)]/30 backdrop-blur-md">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-3 px-8 py-5 text-[11px] font-medium uppercase tracking-widest transition-all relative ${
                        activeTab === tab.id ? 'text-rc-teal' : 'text-[var(--text-secondary)] hover:text-white'
                     }`}
                  >
                     <tab.icon size={15} />
                     {tab.label}
                     {activeTab === tab.id && (
                        <motion.div layoutId="modal-tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-teal rounded-t-full shadow-[0_0_15px_rgba(59,188,169,0.5)]" />
                     )}
                  </button>
               ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-gradient-to-b from-black/20 to-transparent">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="max-w-7xl mx-auto w-full h-full"
                  >
                     {activeTab === 'summary' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                           <div className="space-y-8">
                              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                 <Globe size={14} className="text-rc-teal" /> ADN Tecnológico
                              </h3>
                              <div className="space-y-4">
                                 {[
                                    { label: 'País', value: editedProject.techDNA?.country },
                                    { label: 'Troncal Virtual', value: editedProject.techDNA?.sipTrunkVirtual },
                                    { label: 'ISP', value: editedProject.techDNA?.isp },
                                    { label: 'Operación', value: editedProject.techDNA?.operationMode }
                                 ].map(item => (
                                    <div key={item.label} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex justify-between items-center group hover:border-rc-teal/30 transition-all">
                                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                       <span className="text-[11px] font-black text-white uppercase">{item.value || 'N/A'}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="md:col-span-2 space-y-8">
                              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                 <Activity size={14} className="text-rc-teal" /> Resumen de Auditoría
                              </h3>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-4 group hover:border-rc-teal/30 transition-all">
                                    <div className="text-5xl font-black text-white tracking-tighter">
                                       {Object.values(editedProject?.quarterlyAssessment || {}).reduce((a: any, b: any) => a + (typeof b === 'number' ? b : 0), 0)}%
                                    </div>
                                    <span className="text-[9px] font-black text-rc-teal uppercase tracking-[0.3em]">Health Index Global</span>
                                 </div>
                                 <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-4 group hover:border-rc-teal/30 transition-all">
                                    <div className="text-5xl font-black text-white tracking-tighter">
                                       {editedProject?.services?.length || 0}
                                    </div>
                                    <span className="text-[9px] font-black text-rc-teal uppercase tracking-[0.3em]">Servicios Activos</span>
                                 </div>
                              </div>
                              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-4">
                                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Observaciones Estratégicas</h4>
                                 <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    El cliente muestra una estabilidad operativa alta en el último Q. Se recomienda iniciar fase de upsell para "IA Agent" dado el volumen de transacciones en Botmaker.
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'services' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {editedProject.services.map((service) => (
                              <div key={service.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] flex items-start gap-6 group hover:border-rc-teal/30 transition-all">
                                 <div className="p-4 bg-rc-teal/10 rounded-2xl text-rc-teal group-hover:scale-110 transition-transform">
                                    <Layers size={24} />
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex justify-between items-center mb-3">
                                       <h4 className="text-lg font-black text-white uppercase tracking-tighter">{service.name}</h4>
                                       <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">{service.type}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{service.description}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                          <span className="text-[8px] font-bold text-slate-600 uppercase block mb-1">Configuración</span>
                                          <span className="text-[10px] font-black text-white uppercase">
                                             {service.type === 'Botmaker' ? service.botmakerType : 
                                              service.type === 'Yeastar' || service.type === 'IPBX' ? `${service.extensionCount} Exts` :
                                              service.type === 'Servicios Web' ? service.webServiceType :
                                              service.type === 'Capacitaciones' ? service.trainingType :
                                              service.type === 'Contact Center' ? `${service.positionsCount} Pos` : 'General'}
                                          </span>
                                       </div>
                                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                          <span className="text-[8px] font-bold text-slate-600 uppercase block mb-1">Fecha de Alta</span>
                                          <span className="text-[10px] font-black text-white uppercase">{service.startDate || 'N/A'}</span>
                                       </div>
                                       {service.type === 'Contact Center' && (
                                          <>
                                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 col-span-2">
                                                <span className="text-[8px] font-bold text-slate-600 uppercase block mb-1">Horarios / Matriz</span>
                                                <span className="text-[10px] font-black text-rc-teal uppercase tracking-widest">{service.shiftMatrix || 'No especificado'}</span>
                                             </div>
                                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <span className="text-[8px] font-bold text-slate-600 uppercase block mb-1">Responsable</span>
                                                <span className="text-[10px] font-black text-white uppercase">{service.responsible || 'Pendiente'}</span>
                                             </div>
                                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <span className="text-[8px] font-bold text-slate-600 uppercase block mb-1">Líder / Sup</span>
                                                <span className="text-[10px] font-black text-white uppercase">{service.collaborator || 'Pendiente'}</span>
                                             </div>
                                          </>
                                       )}
                                       {service.type === 'Botmaker' && service.responsible && (
                                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 col-span-2">
                                             <span className="text-[8px] font-bold text-slate-600 uppercase block mb-1">Responsable del Servicio</span>
                                             <span className="text-[10px] font-black text-white uppercase">{service.responsible}</span>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {activeTab === 'quality' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {[
                              { key: 'responseTime', label: 'Tiempo de Respuesta' },
                              { key: 'communicationQuality', label: 'Calidad Comunicación' },
                              { key: 'effectiveResolution', label: 'Resolución Efectiva' },
                              { key: 'proactivity', label: 'Proactividad Operativa' },
                              { key: 'technicalKnowledge', label: 'Tech DNA' },
                              { key: 'reliability', label: 'Confiabilidad / Backup' },
                              { key: 'flexibility', label: 'Flexibilidad de Cambio' },
                              { key: 'innovation', label: 'Aporte de Innovación' },
                              { key: 'serviceCulture', label: 'Cultura de Servicio' },
                              { key: 'valuePerception', label: 'Percepción de Valor' }
                           ].map((pillar) => {
                              const score = (editedProject.quarterlyAssessment as any)?.[pillar.key] || 0;
                              return (
                                 <div key={pillar.key} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                    <div className="flex justify-between items-center">
                                       <span className="text-[11px] font-black text-white uppercase tracking-tight">{pillar.label}</span>
                                       <span className="text-[10px] font-black text-rc-teal">{score * 20}%</span>
                                    </div>
                                    <div className="flex gap-2 h-1.5">
                                       {[1, 2, 3, 4, 5].map(n => (
                                          <div key={n} className={`flex-1 rounded-full transition-all duration-700 ${score >= n ? 'bg-rc-teal' : 'bg-white/5'}`} />
                                       ))}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     )}

                      {activeTab === 'admin' && (
                        <div className="max-w-2xl mx-auto space-y-4">
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
                                 className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all"
                              >
                                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                                 <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                                    editedProject.clientEvaluation?.[item.id as keyof typeof editedProject.clientEvaluation] 
                                    ? 'bg-rc-teal border-rc-teal text-black shadow-lg shadow-rc-teal/20' 
                                    : 'border-white/10 text-transparent'
                                 }`}>
                                    <CheckCircle size={18} strokeWidth={3} />
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {activeTab === 'milestones' && (
                        <div className="grid grid-cols-1 gap-4">
                           {editedProject.assets?.map((asset) => (
                              <div key={asset.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-[32px] flex items-center gap-6 group hover:border-rc-teal/30 transition-all">
                                 <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal group-hover:scale-110 transition-transform">
                                    <Headphones size={24} />
                                 </div>
                                 <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Categoría</span>
                                       <span className="text-[10px] font-black text-white uppercase">{asset.category || 'Hardware'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Modelo / Nombre</span>
                                       <span className="text-[10px] font-black text-white uppercase">{asset.model}</span>
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Posición / VPN</span>
                                       <span className="text-[10px] font-black text-white uppercase">{asset.assignedPosition || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Notas</span>
                                       <span className="text-[10px] font-black text-rc-teal uppercase italic">{asset.notes || 'Sin detalles'}</span>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* Global Footer Actions */}
            <div className="p-10 bg-black/60 border-t border-white/5 flex items-center justify-between backdrop-blur-3xl">
               <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[10px] font-black text-white uppercase">
                           {i === 1 ? 'AD' : i === 2 ? 'PM' : 'OP'}
                        </div>
                     ))}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Equipo de Auditoría Sincronizado</span>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={onClose} className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors">Cancelar</button>
                  <button 
                     onClick={handleSave}
                     className="px-12 py-5 bg-rc-teal text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_25px_rgba(59,188,169,0.2)] hover:scale-105 active:scale-95 transition-all"
                  >
                     Guardar en Repositorio Central
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
