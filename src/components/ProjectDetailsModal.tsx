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
            initial={{ scale: 0.95, opacity: 0, y: 30 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-[85vw] h-[90vh] bg-[#161B22] border border-white/5 rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-[110]"
          >
            {/* Action Bar Superior */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-xl">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/[0.03] rounded-[32px] border border-white/10 flex items-center justify-center p-4 shadow-2xl">
                     {editedProject.logoUrl ? (
                        <img src={editedProject.logoUrl} className="w-full h-full object-contain" />
                     ) : (
                        <ShieldCheck className="text-rc-teal opacity-40" size={40} />
                     )}
                  </div>
                  <div>
                     <div className="flex items-center gap-4">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{editedProject.client}</h2>
                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${getFlagColor(editedProject.healthFlag)}`}>
                           <div className={`w-2 h-2 rounded-full ${editedProject.healthFlag === 'Verde' ? 'bg-emerald-400' : editedProject.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                           HC {editedProject.healthFlag}
                        </div>
                     </div>
                     <div className="flex items-center gap-4 mt-4">
                        {['En Proceso', 'Prueba', 'Activo', 'Inactivo'].map(status => (
                           <button
                              key={status}
                              onClick={() => setEditedProject({ ...editedProject, adminStatus: status as any })}
                              className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
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

               <div className="flex items-center gap-4">
                  <button onClick={() => onEditRequest?.(editedProject)} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-rc-teal hover:text-black rounded-3xl border border-white/10 text-slate-400 transition-all group">
                     <Edit3 size={20} />
                     <span className="text-[8px] font-black uppercase tracking-widest">Ajustes</span>
                  </button>
                  <button 
                    onClick={() => onArchive?.(editedProject)}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-amber-500/20 rounded-3xl border border-white/10 text-slate-400 hover:text-amber-400 transition-all"
                  >
                     <Archive size={20} />
                     <span className="text-[8px] font-black uppercase tracking-widest">Archivar</span>
                  </button>
                  <button onClick={() => onDelete?.(editedProject.id)} className="flex flex-col items-center gap-2 p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-3xl border border-rose-500/20 text-rose-500 transition-all">
                     <Trash size={20} />
                     <span className="text-[8px] font-black uppercase tracking-widest">Eliminar</span>
                  </button>
                  <div className="h-12 w-px bg-white/10 mx-3" />
                  <button onClick={onClose} className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl text-white transition-all border border-white/5">
                     <X size={28} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex px-12 gap-4 border-b border-white/5 bg-black/10">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-4 px-10 py-6 text-[12px] font-black uppercase tracking-[0.2em] transition-all relative ${
                        activeTab === tab.id ? 'text-rc-teal' : 'text-slate-500 hover:text-white'
                     }`}
                  >
                     <tab.icon size={18} />
                     {tab.label}
                     {activeTab === tab.id && (
                        <motion.div layoutId="modal-tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-rc-teal rounded-t-full shadow-[0_0_20px_rgba(59,188,169,0.8)]" />
                     )}
                  </button>
               ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-gradient-to-b from-black/20 to-transparent">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="max-w-7xl mx-auto w-full h-full"
                  >
                     {activeTab === 'summary' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                           <div className="space-y-10">
                              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 opacity-40">
                                 <Globe size={16} className="text-rc-teal" /> ADN Tecnológico
                              </h3>
                              <div className="space-y-5">
                                 {[
                                    { label: 'País de Origen', value: editedProject.techDNA?.country },
                                    { label: 'Sip Trunk Virtual', value: editedProject.techDNA?.sipTrunkVirtual },
                                    { label: 'ISP / Conectividad', value: editedProject.techDNA?.isp },
                                    { label: 'Modelo Operativo', value: editedProject.techDNA?.operationMode }
                                 ].map(item => (
                                    <div key={item.label} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center group hover:border-rc-teal/30 transition-all backdrop-blur-xl">
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                       <span className="text-[11px] font-black text-white uppercase tracking-tighter">{item.value || 'Pendiente'}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="md:col-span-2 space-y-10">
                              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 opacity-40">
                                 <TrendingUp size={16} className="text-rc-teal" /> Indicadores HC
                              </h3>
                              <div className="grid grid-cols-2 gap-8">
                                 <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] flex flex-col items-center justify-center gap-6 group hover:border-rc-teal/30 transition-all backdrop-blur-xl">
                                    <div className="text-7xl font-black text-white tracking-tighter flex items-baseline gap-2">
                                       {Object.values(editedProject?.quarterlyAssessment || {}).reduce((a: any, b: any) => a + (typeof b === 'number' ? b : 0), 0)}
                                       <span className="text-3xl text-rc-teal/50">%</span>
                                    </div>
                                    <span className="text-[10px] font-black text-rc-teal uppercase tracking-[0.4em]">Health Score Global</span>
                                 </div>
                                 <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] flex flex-col items-center justify-center gap-6 group hover:border-rc-teal/30 transition-all backdrop-blur-xl">
                                    <div className="text-7xl font-black text-white tracking-tighter">
                                       {editedProject?.services?.length || 0}
                                    </div>
                                    <span className="text-[10px] font-black text-rc-teal uppercase tracking-[0.4em]">Suscripciones Activas</span>
                                 </div>
                              </div>
                              <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] space-y-6 backdrop-blur-xl">
                                 <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Observaciones de Inteligencia</h4>
                                    <ArrowUpRight size={18} className="text-rc-teal opacity-50" />
                                 </div>
                                 <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                                    "El análisis proyectado indica una maduración tecnológica óptima. El cliente se encuentra en la ventana ideal para la implementación de capas de automatización IA y expansión de capacidad en Contact Center."
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'quality' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           {[
                              { key: 'responseTime', label: 'Tiempo de Respuesta', desc: 'Velocidad en feedback y toma de decisiones.' },
                              { key: 'communicationQuality', label: 'Calidad de Comunicación', desc: 'Claridad y asertividad en canales oficiales.' },
                              { key: 'effectiveResolution', label: 'Resolución Efectiva', desc: 'Capacidad de cerrar pendientes operando.' },
                              { key: 'proactivity', label: 'Proactividad / Cultura', desc: 'Iniciativa en la mejora de procesos.' },
                              { key: 'technicalKnowledge', label: 'Conocimiento del Servicio', desc: 'Entendimiento de las herramientas Rc506.' },
                              { key: 'reliability', label: 'Continuidad Operativa', desc: 'Estabilidad en los procesos del cliente.' },
                              { key: 'flexibility', label: 'Adaptación al Cambio', desc: 'Apertura a nuevas metodologías.' },
                              { key: 'innovation', label: 'Valor Añadido', desc: 'Uso estratégico de la información.' },
                              { key: 'serviceCulture', label: 'ADN Institucional', desc: 'Alineación con los estándares Rc506.' },
                              { key: 'valuePerception', label: 'Percepción de Valor', desc: 'Nivel de satisfacción y reconocimiento.' }
                           ].map((pillar) => {
                              const score = (editedProject.quarterlyAssessment as any)?.[pillar.key] || 0;
                              return (
                                 <div key={pillar.key} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6 hover:border-rc-teal/30 transition-all group">
                                    <div className="flex justify-between items-start">
                                       <div>
                                          <span className="text-[12px] font-black text-white uppercase tracking-tight block mb-1">{pillar.label}</span>
                                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{pillar.desc}</p>
                                       </div>
                                       <span className={`text-[14px] font-black ${score >= 4 ? 'text-rc-teal' : score >= 3 ? 'text-amber-400' : 'text-rose-500'}`}>
                                          {score}.0
                                       </span>
                                    </div>
                                    <div className="flex gap-3 h-2">
                                       {[1, 2, 3, 4, 5].map(n => (
                                          <div 
                                             key={n} 
                                             onClick={() => {
                                                const currentAssessment = editedProject.quarterlyAssessment || {
                                                   responseTime: 0,
                                                   communicationQuality: 0,
                                                   effectiveResolution: 0,
                                                   proactivity: 0,
                                                   technicalKnowledge: 0,
                                                   reliability: 0,
                                                   flexibility: 0,
                                                   innovation: 0,
                                                   serviceCulture: 0,
                                                   valuePerception: 0
                                                };
                                                setEditedProject({
                                                   ...editedProject,
                                                   quarterlyAssessment: {
                                                      ...currentAssessment,
                                                      [pillar.key]: n
                                                   }
                                                });
                                             }}
                                             className={`flex-1 rounded-full cursor-pointer transition-all duration-500 ${
                                                score >= n 
                                                ? 'bg-rc-teal shadow-[0_0_10px_rgba(59,188,169,0.5)]' 
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {editedProject.services?.length ? (
                              editedProject.services.map((service) => (
                                 <div key={service.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6 hover:border-rc-teal/30 transition-all group backdrop-blur-xl">
                                    <div className="flex justify-between items-start">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal border border-rc-teal/10">
                                             <Zap size={20} />
                                          </div>
                                          <div>
                                             <span className="text-[12px] font-black text-white uppercase tracking-tight block">{service.name}</span>
                                             <span className="text-[9px] text-rc-teal font-bold uppercase tracking-widest">{service.type}</span>
                                          </div>
                                       </div>
                                       <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${service.score >= 4 ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-amber-400 border-amber-400/20 bg-amber-400/5'}`}>
                                          Score: {service.score}.0
                                       </div>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3 italic">
                                       "{service.description || 'Sin descripción detallada disponible.'}"
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                       <div className="flex items-center gap-2">
                                          <Calendar size={14} className="text-slate-500" />
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Go-Live: {service.startDate}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <ShieldCheck size={14} className="text-rc-teal" />
                                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Activo</span>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[48px]">
                                 <Layers className="text-slate-700 mb-6" size={48} />
                                 <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">No hay servicios registrados en este expediente</p>
                              </div>
                           )}
                        </div>
                     )}

                     {activeTab === 'milestones' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {editedProject.assets?.length ? (
                              editedProject.assets.map((asset) => (
                                 <div key={asset.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6 hover:border-rc-teal/30 transition-all group backdrop-blur-xl">
                                    <div className="w-14 h-14 bg-white/5 rounded-[24px] flex items-center justify-center text-slate-400 group-hover:text-rc-teal transition-colors">
                                       <Headphones size={28} />
                                    </div>
                                    <div>
                                       <span className="text-[14px] font-black text-white uppercase tracking-tight block mb-1">{asset.model}</span>
                                       <div className="flex items-center gap-2">
                                          <User size={12} className="text-rc-teal" />
                                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Posición: {asset.assignedPosition}</span>
                                       </div>
                                    </div>
                                    <div className={`px-5 py-2.5 rounded-2xl border text-[9px] font-black uppercase tracking-[0.2em] w-fit ${
                                       asset.status === 'Operativo' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 
                                       asset.status === 'Mantenimiento' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 
                                       'text-rose-500 border-rose-500/20 bg-rose-500/5'
                                    }`}>
                                       {asset.status}
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[48px]">
                                 <Cpu className="text-slate-700 mb-6" size={48} />
                                 <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">No hay activos de hardware asignados</p>
                              </div>
                           )}
                        </div>
                     )}

                     {activeTab === 'admin' && (
                        <div className="max-w-3xl mx-auto space-y-5">
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
                                 className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all border-l-4 border-l-transparent hover:border-l-rc-teal"
                              >
                                 <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{item.label}</span>
                                 <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                                    editedProject.clientEvaluation?.[item.id as keyof typeof editedProject.clientEvaluation] 
                                    ? 'bg-rc-teal border-rc-teal text-black shadow-lg shadow-rc-teal/30 scale-110' 
                                    : 'border-white/10 text-transparent'
                                 }`}>
                                    <Check size={20} strokeWidth={4} />
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* Global Footer Actions */}
            <div className="p-12 bg-black/40 border-t border-white/5 flex items-center justify-between backdrop-blur-3xl">
               <div className="flex items-center gap-8">
                  <div className="flex -space-x-4">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-[#161B22] bg-slate-800 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-xl">
                           {i === 1 ? 'AI' : i === 2 ? 'PM' : i === 3 ? 'OP' : 'QA'}
                        </div>
                     ))}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] block">Sincronización HC Rc506</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Audit Mode: Enabled</span>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <button onClick={onClose} className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors">Cerrar</button>
                  <button 
                     onClick={handleSave}
                     className="px-16 py-6 bg-rc-teal text-black text-[12px] font-black uppercase tracking-[0.3em] rounded-[24px] shadow-[0_0_40px_rgba(59,188,169,0.3)] hover:scale-105 active:scale-95 transition-all"
                  >
                     Confirmar Cambios Estratégicos
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
