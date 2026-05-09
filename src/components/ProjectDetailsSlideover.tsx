import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Plus, Trash2, Calendar, Star, ShieldCheck, Edit3, AlertCircle, Save, Bell, 
  CheckCircle, AlertTriangle, FileText, Activity, Globe, Headphones, Cpu, Zap, Wifi, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Evaluation, Alert, ClientService } from '../types/project';
import { exportService } from '../services/exportService';

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (project: Project) => void;
  onDelete?: (id: string) => void;
  onEditRequest?: (project: Project) => void;
}

const ProjectDetailsSlideover: React.FC<Props> = ({ project, isOpen, onClose, onUpdate, onDelete, onEditRequest }) => {
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<'pulse' | 'services' | 'evaluations' | 'alerts'>('pulse');
  
  if (!project) return null;

  const getFlagColor = (flag: string) => {
    switch(flag) {
      case 'Verde': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Amarilla': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Roja': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Negra': return 'text-slate-900 bg-slate-950/20 border-slate-900/30';
      default: return 'text-rc-teal bg-rc-teal/10 border-rc-teal/20';
    }
  };

  const flagStyles = getFlagColor(project.healthFlag || 'Verde');

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]" 
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-[var(--bg-secondary)] border-l border-white/5 shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-[var(--bg-primary)]/50 relative overflow-hidden">
               {/* Background Glow */}
               <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 rounded-full ${flagStyles.split(' ')[1]}`} />

               <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-black/30 rounded-[24px] flex items-center justify-center text-rc-teal border border-white/10 overflow-hidden shrink-0 shadow-2xl">
                        {project.logoUrl ? (
                           <img src={project.logoUrl} alt={project.client} className="w-10 h-10 object-contain" />
                        ) : (
                           <ShieldCheck size={32} />
                        )}
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase truncate max-w-[280px] leading-tight">
                           {project.client}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                           <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest flex items-center gap-1 opacity-60">
                              <Calendar size={12} className="text-rc-teal" /> Onboarding: {project.startDate}
                           </p>
                           <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border ${flagStyles}`}>
                              Bandera {project.healthFlag}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => onEditRequest && onEditRequest(project)} className="p-3 bg-white/5 hover:bg-rc-teal/10 hover:text-rc-teal rounded-2xl transition-all text-[var(--text-secondary)] border border-white/5">
                        <Edit3 size={18} />
                     </button>
                     <button onClick={() => exportService.exportIndividualPDF(project, t)} className="p-3 bg-white/5 hover:bg-rc-teal/10 hover:text-rc-teal rounded-2xl transition-all text-[var(--text-secondary)] border border-white/5">
                        <FileText size={18} />
                     </button>
                     <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-[var(--text-secondary)] border border-white/5">
                        <X size={18} />
                     </button>
                  </div>
               </div>

               {/* Health Summary Bar */}
               <div className="bg-black/20 border border-white/5 p-4 rounded-3xl relative z-10">
                  <div className="flex items-center justify-between mb-2 px-1">
                     <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Salud Estratégica</span>
                     <span className="text-sm font-black text-rc-teal">{(project.evaluations?.[0]?.quantitative || 0).toFixed(1)}/5.0</span>
                  </div>
                  <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(project.evaluations?.[0]?.quantitative || 0) * 20}%` }}
                        className="h-full bg-gradient-to-r from-rc-teal/50 to-rc-teal" 
                     />
                  </div>
               </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex px-8 gap-6 border-b border-white/5 bg-[var(--bg-primary)]/30">
               {[
                 { id: 'pulse', label: 'Pulso', icon: Activity },
                 { id: 'services', label: 'Servicios', icon: Layers },
                 { id: 'evaluations', label: 'Auditoría', icon: Cpu },
                 { id: 'alerts', label: 'Matriz', icon: ShieldCheck },
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`py-5 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                      activeTab === tab.id ? 'text-rc-teal' : 'text-[var(--text-secondary)] opacity-50 hover:opacity-100'
                   }`}
                 >
                    <tab.icon size={14} />
                    {tab.label}
                    {activeTab === tab.id && <motion.div layoutId="tab-active-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-teal" />}
                 </button>
               ))}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
               {activeTab === 'pulse' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     {/* Contact Center Pulse */}
                     <section className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] flex items-center gap-2">
                              <Zap size={14} className="text-rc-teal" /> Operaciones: Contact Center
                           </h4>
                           <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${
                              project.opsPulse?.backupStatus === 'Disponible' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                           }`}>
                              Backup: {project.opsPulse?.backupStatus || 'N/A'}
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-6 bg-black/10 border border-white/5 rounded-[32px] space-y-2">
                              <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase opacity-50">HC Contratado</p>
                              <p className="text-3xl font-black text-[var(--text-primary)]">{project.opsPulse?.hcContracted || 0}</p>
                           </div>
                           <div className="p-6 bg-black/10 border border-white/5 rounded-[32px] space-y-2">
                              <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase opacity-50">HC Real Asignado</p>
                              <div className="flex items-baseline gap-2">
                                 <p className="text-3xl font-black text-rc-teal">{project.opsPulse?.hcReal || 0}</p>
                                 <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                                    ({Math.round(((project.opsPulse?.hcReal || 0) / (project.opsPulse?.hcContracted || 1)) * 100)}%)
                                 </span>
                              </div>
                           </div>
                        </div>
                     </section>

                     {/* Tech DNA DNA */}
                     <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] flex items-center gap-2">
                           <Globe size={14} className="text-rc-teal" /> Tech DNA DNA & Conectividad
                        </h4>
                        <div className="p-8 bg-black/10 border border-white/5 rounded-[40px] space-y-6">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--text-primary)]">Modalidad</span>
                              <span className="px-4 py-1.5 bg-rc-teal text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rc-teal/20">
                                 {project.techDNA?.operationMode || 'REMOTE'}
                              </span>
                           </div>
                           <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-6">
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase opacity-50 flex items-center gap-1">
                                    <Wifi size={10} /> Proveedor ISP
                                 </p>
                                 <p className="text-xs font-black text-[var(--text-primary)] uppercase">{project.techDNA?.isp || 'No registrado'}</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase opacity-50 flex items-center gap-1">
                                    <Globe size={10} /> Línea / Troncal
                                 </p>
                                 <p className="text-xs font-black text-[var(--text-primary)] uppercase">{project.techDNA?.phoneLine || 'No registrada'}</p>
                              </div>
                           </div>
                        </div>
                     </section>

                     {/* Assets */}
                     <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] flex items-center gap-2">
                           <Headphones size={14} className="text-rc-teal" /> Activos: Hardware Registry
                        </h4>
                        <div className="space-y-3">
                           {project.assets?.map(asset => (
                              <div key={asset.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center text-rc-teal">
                                       <Headphones size={20} />
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{asset.model}</p>
                                       <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase opacity-50">Compra: {asset.purchaseDate}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-lg font-black text-rc-teal">{asset.quantity}</p>
                                    <p className="text-[8px] font-black text-[var(--text-secondary)] uppercase">Unidades</p>
                                 </div>
                              </div>
                           ))}
                           {(!project.assets || project.assets.length === 0) && (
                              <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-30">
                                 <p className="text-[10px] font-black uppercase tracking-widest">Sin activos registrados</p>
                              </div>
                           )}
                        </div>
                     </section>
                  </div>
               )}

               {activeTab === 'services' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                     <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Portafolio de Soluciones</h4>
                     <div className="grid grid-cols-1 gap-4">
                        {project.services.map(service => (
                           <div key={service.id} className="p-6 bg-black/10 border border-white/5 rounded-[32px] hover:border-rc-teal/30 transition-all group">
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <h5 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-rc-teal transition-colors">{service.name}</h5>
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)] mt-1">{service.description || 'Sin descripción adicional.'}</p>
                                 </div>
                                 <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={10} className={i < service.score ? 'text-rc-teal fill-rc-teal' : 'text-white/5'} />
                                    ))}
                                 </div>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                 <span className="text-[9px] font-black text-rc-teal uppercase tracking-widest">Activo</span>
                                 <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase opacity-50">Iniciado: {service.startDate}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'evaluations' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Historial Estratégico</h4>
                     <div className="space-y-6">
                        {project.evaluations.map((evalItem, idx) => (
                           <div key={idx} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-white/5">
                              <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-rc-teal shadow-[0_0_10px_#3BC7AA]" />
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-[10px] font-black text-rc-teal uppercase tracking-widest">
                                    {evalItem.date ? new Date(evalItem.date).toLocaleDateString() : `${evalItem.month}/${evalItem.year}`}
                                 </span>
                                 <span className="text-xs font-black text-[var(--text-primary)]">{evalItem.quantitative.toFixed(1)}/5.0</span>
                              </div>
                              <div className="p-6 bg-black/10 border border-white/5 rounded-3xl">
                                 <p className="text-[11px] font-medium text-[var(--text-secondary)] leading-relaxed italic opacity-80">"{evalItem.qualitative || 'Sin observaciones registradas.'}"</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'alerts' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                     <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Matriz de Casos y Riesgos</h4>
                     <div className="space-y-4">
                        {project.alerts?.map(alert => (
                           <div key={alert.id} className="p-6 bg-black/10 border border-white/5 rounded-[32px] flex items-start gap-4">
                              <div className={`p-3 rounded-2xl ${
                                 alert.severity === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                 <AlertTriangle size={20} />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{alert.date}</span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                       alert.status === 'Open' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                                    }`}>
                                       {alert.status}
                                    </span>
                                 </div>
                                 <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight leading-tight mb-2">{alert.description}</p>
                                 <span className="text-[9px] font-black text-rc-teal uppercase tracking-[0.2em]">{alert.type}</span>
                              </div>
                           </div>
                        ))}
                        {(!project.alerts || project.alerts.length === 0) && (
                           <div className="py-20 text-center opacity-20">
                              <ShieldCheck size={48} className="mx-auto mb-4" />
                              <p className="text-xs font-black uppercase tracking-widest">Sin alertas críticas</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 bg-[var(--bg-primary)]/80 backdrop-blur-md flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                     <CheckCircle size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Sincronización Elite</p>
                     <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase opacity-50">V3.5 Real-time active</p>
                  </div>
               </div>
               <button 
                  onClick={onClose}
                  className="px-10 py-4 rounded-2xl bg-rc-teal text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-rc-teal/30 hover:scale-105 active:scale-95 transition-all"
               >
                  Cerrar Panel
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectDetailsSlideover;
