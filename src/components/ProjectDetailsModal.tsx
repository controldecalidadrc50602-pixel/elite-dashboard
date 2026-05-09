import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Plus, Trash2, Calendar, Star, ShieldCheck, Edit3, AlertCircle, Save, Bell, 
  CheckCircle, AlertTriangle, FileText, Activity, Globe, Headphones, Cpu, Zap, Wifi, Layers,
  ChevronDown, MessageSquare, User, Users, Clock, History, Phone
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

const ProjectDetailsModal: React.FC<Props> = ({ project, isOpen, onClose, onUpdate, onDelete, onEditRequest }) => {
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<'pulse' | 'services' | 'tasks' | 'intelligence' | 'evaluations' | 'alerts'>('pulse');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
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
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[85%] h-full max-h-[90vh] bg-[var(--bg-secondary)] border border-white/10 rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-[110]"
          >
            {/* Top Navigation / Header */}
            <div className="flex flex-col border-b border-white/5 bg-[var(--bg-primary)]/50">
               <div className="p-8 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 bg-black/40 rounded-[32px] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
                        {project.logoUrl ? (
                           <img src={project.logoUrl} alt={project.client} className="w-12 h-12 object-contain" />
                        ) : (
                           <ShieldCheck size={40} className="text-rc-teal" />
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-4">
                           <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">
                              {project.client}
                           </h2>
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${flagStyles}`}>
                              Bandera {project.healthFlag}
                           </div>
                        </div>
                        <div className="flex items-center gap-6 mt-3">
                           <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest flex items-center gap-2 opacity-60">
                              <Calendar size={14} className="text-rc-teal" /> Onboarding: {project.startDate}
                           </p>
                           <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest flex items-center gap-2 opacity-60">
                              <Users size={14} className="text-rc-teal" /> ID: {project.id}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <button onClick={() => onEditRequest && onEditRequest(project)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-rc-teal/10 hover:text-rc-teal rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/5">
                        <Edit3 size={16} /> {t('common.edit')}
                     </button>
                     <button onClick={() => exportService.exportIndividualPDF(project, t)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-rc-teal/10 hover:text-rc-teal rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/5">
                        <FileText size={16} /> {t('common.export')}
                     </button>
                     <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-[var(--text-secondary)] border border-white/5">
                        <X size={20} />
                     </button>
                  </div>
               </div>

               {/* Tabs */}
               <div className="flex px-8 gap-10">
                  {[
                    { id: 'pulse', label: 'Pulso Operativo', icon: Activity },
                    { id: 'services', label: 'Servicios', icon: Layers },
                    { id: 'tasks', label: 'Tareas / SLA', icon: Clock },
                    { id: 'intelligence', label: 'Inteligencia', icon: Zap },
                    { id: 'evaluations', label: 'Auditoría', icon: Cpu },
                    { id: 'alerts', label: 'Riesgos', icon: ShieldAlert },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id as any); setExpandedService(null); }}
                      className={`py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 ${
                         activeTab === tab.id ? 'text-rc-teal' : 'text-[var(--text-secondary)] opacity-40 hover:opacity-100'
                      }`}
                    >
                       <tab.icon size={16} />
                       {tab.label}
                       {activeTab === tab.id && (
                         <motion.div 
                           layoutId="modal-tab-active" 
                           className="absolute bottom-0 left-0 right-0 h-1 bg-rc-teal rounded-t-full" 
                         />
                       )}
                    </button>
                  ))}
               </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 p-10">
               <div className="max-w-7xl mx-auto">
                  {activeTab === 'pulse' && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Cards */}
                        <div className="lg:col-span-4 space-y-6">
                           <div className="glass-card p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                 <Activity size={80} className="text-rc-teal" />
                              </div>
                              <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] mb-4">Salud General</h4>
                              <div className="flex items-end gap-2 mb-4">
                                 <span className="text-5xl font-black text-white">{(project.evaluations?.[0]?.quantitative || 0).toFixed(1)}</span>
                                 <span className="text-xl font-bold text-rc-teal/40 mb-1">/ 5.0</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(project.evaluations?.[0]?.quantitative || 0) * 20}%` }}
                                    className="h-full bg-rc-teal shadow-[0_0_15px_rgba(59,199,170,0.5)]" 
                                 />
                              </div>
                           </div>

                           <div className="glass-card p-8 rounded-[40px] border border-white/5 space-y-6">
                              <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Indicadores HC</h4>
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contratado</span>
                                    <span className="text-xl font-black text-white">{project.opsPulse?.hcContracted || 0}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-4 bg-rc-teal/10 border border-rc-teal/20 rounded-2xl">
                                    <span className="text-[10px] font-bold text-rc-teal uppercase tracking-widest">Real Asignado</span>
                                    <span className="text-xl font-black text-rc-teal">{project.opsPulse?.hcReal || 0}</span>
                                 </div>
                                 <div className="pt-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2 px-1">
                                       <span className="text-slate-500">Eficiencia Operativa</span>
                                       <span className="text-rc-teal">{Math.round(((project.opsPulse?.hcReal || 0) / (project.opsPulse?.hcContracted || 1)) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                       <div 
                                          className="h-full bg-rc-teal" 
                                          style={{ width: `${Math.min(100, ((project.opsPulse?.hcReal || 0) / (project.opsPulse?.hcContracted || 1)) * 100)}%` }} 
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Detailed Pulse Grid */}
                        <div className="lg:col-span-8 space-y-8">
                           {/* Tech DNA DNA */}
                           <div className="glass-card p-10 rounded-[48px] border border-white/5 space-y-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                                    <Globe size={24} />
                                 </div>
                                 <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">Infraestructura & Tech DNA</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración de Conectividad</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div className="p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={12} className="text-rc-teal" /> Modalidad</p>
                                    <p className="text-sm font-black text-white uppercase">{project.techDNA?.operationMode || 'REMOTE'}</p>
                                 </div>
                                 <div className="p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Wifi size={12} className="text-rc-teal" /> Proveedor ISP</p>
                                    <p className="text-sm font-black text-white uppercase">{project.techDNA?.isp || 'No registrado'}</p>
                                 </div>
                                 <div className="p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Phone size={12} className="text-rc-teal" /> Troncal SIP</p>
                                    <p className="text-sm font-black text-white uppercase">{project.techDNA?.phoneLine || 'No registrada'}</p>
                                 </div>
                              </div>
                           </div>

                           {/* Assets Table */}
                           <div className="glass-card p-10 rounded-[48px] border border-white/5">
                              <div className="flex items-center justify-between mb-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                                       <Headphones size={24} />
                                    </div>
                                    <div>
                                       <h4 className="text-lg font-black text-white uppercase tracking-tighter">Inventario de Hardware</h4>
                                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Activos Registrados</p>
                                    </div>
                                 </div>
                              </div>

                              <div className="overflow-hidden rounded-3xl border border-white/5">
                                 <table className="w-full text-left">
                                    <thead className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                       <tr>
                                          <th className="px-6 py-4">Modelo / Dispositivo</th>
                                          <th className="px-6 py-4 text-center">Cantidad</th>
                                          <th className="px-6 py-4 text-right">Fecha de Adquisición</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                       {project.assets?.map(asset => (
                                          <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                                             <td className="px-6 py-4 text-sm font-black text-white uppercase tracking-tight">{asset.model}</td>
                                             <td className="px-6 py-4 text-center text-rc-teal font-black">{asset.quantity}</td>
                                             <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400">{asset.purchaseDate}</td>
                                          </tr>
                                       ))}
                                       {(!project.assets || project.assets.length === 0) && (
                                          <tr>
                                             <td colSpan={3} className="px-6 py-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest opacity-40">Sin activos registrados</td>
                                          </tr>
                                       )}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'services' && (
                     <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-4">
                           <div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Ecosistema de Servicios</h3>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestión de Soluciones y Bitácora Táctica</p>
                           </div>
                           <button className="flex items-center gap-2 px-6 py-3 bg-rc-teal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rc-teal/20 hover:scale-105 transition-all">
                              <Plus size={16} /> Agregar Servicio
                           </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                           {project.services.map(service => (
                              <div key={service.id} className={`glass-card overflow-hidden transition-all duration-500 border ${expandedService === service.id ? 'border-rc-teal/30 ring-1 ring-rc-teal/20 bg-rc-teal/[0.02]' : 'border-white/5 bg-black/20'}`}>
                                 {/* Summary Row */}
                                 <div 
                                    onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                                    className="p-8 flex items-center justify-between cursor-pointer group"
                                 >
                                    <div className="flex items-center gap-6">
                                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedService === service.id ? 'bg-rc-teal text-white' : 'bg-black/40 text-rc-teal border border-white/5'}`}>
                                          <Layers size={28} />
                                       </div>
                                       <div>
                                          <h4 className="text-lg font-black text-white uppercase tracking-tighter group-hover:text-rc-teal transition-colors">{service.name}</h4>
                                          <div className="flex items-center gap-4 mt-1">
                                             <span className="text-[9px] font-black text-rc-teal uppercase tracking-widest">Score: {service.score}/5.0</span>
                                             <span className="w-1 h-1 rounded-full bg-white/10" />
                                             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Inicio: {service.startDate}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <div className="hidden md:flex gap-1">
                                          {[...Array(5)].map((_, i) => (
                                             <Star key={i} size={12} className={i < service.score ? 'text-rc-teal fill-rc-teal' : 'text-white/5'} />
                                          ))}
                                       </div>
                                       <motion.div animate={{ rotate: expandedService === service.id ? 180 : 0 }}>
                                          <ChevronDown size={24} className="text-slate-500" />
                                       </motion.div>
                                    </div>
                                 </div>

                                 {/* Detailed Content / Bitácora */}
                                 <AnimatePresence>
                                    {expandedService === service.id && (
                                       <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="border-t border-white/5"
                                       >
                                          <div className="p-10 grid grid-cols-1 xl:grid-cols-12 gap-10">
                                             {/* Tech & Ops Columns */}
                                             <div className="xl:col-span-4 space-y-8">
                                                {/* Plataforma Section */}
                                                <div className="space-y-4">
                                                   <h5 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] flex items-center gap-2">
                                                      <MessageSquare size={14} /> Configuración de Plataforma
                                                   </h5>
                                                   <div className="grid grid-cols-1 gap-3">
                                                      {[
                                                         { label: 'Tipo de Bot', value: service.botType, icon: Cpu },
                                                         { label: 'Propósito', value: service.purpose, icon: Star },
                                                         { label: 'Último Acceso', value: service.lastAccess, icon: Clock },
                                                         { label: 'Actualización', value: service.lastUpdate, icon: History },
                                                      ].map((item, i) => (
                                                         <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                               <item.icon size={12} className="text-slate-500" />
                                                               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                            </div>
                                                            <span className="text-[11px] font-black text-white uppercase">{item.value || 'N/A'}</span>
                                                         </div>
                                                      ))}
                                                   </div>
                                                </div>

                                                {/* Contact Center Section */}
                                                <div className="space-y-4">
                                                   <h5 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] flex items-center gap-2">
                                                      <Users size={14} /> Operación de Contact Center
                                                   </h5>
                                                   <div className="grid grid-cols-1 gap-3">
                                                      {[
                                                         { label: 'Gestión', value: service.mgmtType, icon: Activity },
                                                         { label: 'Responsable', value: service.responsible, icon: User },
                                                         { label: 'Colaborador', value: service.collaborator, icon: Users },
                                                         { label: 'Posiciones', value: service.positionsCount, icon: Layers },
                                                      ].map((item, i) => (
                                                         <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                               <item.icon size={12} className="text-slate-500" />
                                                               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                            </div>
                                                            <span className="text-[11px] font-black text-white uppercase">{item.value || 'N/A'}</span>
                                                         </div>
                                                      ))}
                                                      <div className="p-4 bg-rc-teal/5 border border-rc-teal/20 rounded-2xl">
                                                         <p className="text-[9px] font-black text-rc-teal uppercase tracking-widest mb-1">Matriz de Turnos</p>
                                                         <p className="text-sm font-black text-white">{service.shiftMatrix || 'No definida'}</p>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>

                                             {/* Log / Bitácora Column */}
                                             <div className="xl:col-span-8 space-y-6">
                                                <div className="flex items-center justify-between">
                                                   <h5 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] flex items-center gap-2">
                                                      <History size={14} /> Bitácora del Servicio
                                                   </h5>
                                                   <button className="text-[9px] font-black text-rc-teal uppercase tracking-widest hover:underline">+ Nueva Entrada</button>
                                                </div>
                                                
                                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                                   {service.logs?.map((log, lIdx) => (
                                                      <div key={log.id} className="relative pl-6 pb-6 border-l border-white/5 last:pb-0">
                                                         <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-rc-teal" />
                                                         <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                               <div className="flex items-center gap-3">
                                                                  <span className="text-[10px] font-black text-rc-teal uppercase tracking-widest">{log.date}</span>
                                                                  <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{log.user}</span>
                                                               </div>
                                                               <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-400 uppercase">{log.action}</span>
                                                            </div>
                                                            <p className="text-xs text-white/80 leading-relaxed font-medium italic">"{log.observation}"</p>
                                                         </div>
                                                      </div>
                                                   ))}
                                                   {(!service.logs || service.logs.length === 0) && (
                                                      <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] opacity-20">
                                                         <History size={40} className="mx-auto mb-4" />
                                                         <p className="text-xs font-black uppercase tracking-widest">Sin registros en bitácora</p>
                                                      </div>
                                                   )}
                                                </div>
                                             </div>
                                          </div>
                                       </motion.div>
                                    )}
                                 </AnimatePresence>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'evaluations' && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
                        <div className="lg:col-span-4 space-y-6">
                           <div className="glass-card p-10 rounded-[48px] border border-white/5">
                              <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] mb-8">Resumen de Auditoría</h4>
                              <div className="space-y-8">
                                 <div className="text-center">
                                    <p className="text-6xl font-black text-white">{(project.evaluations?.[0]?.quantitative || 0).toFixed(1)}</p>
                                    <p className="text-[10px] font-black text-rc-teal uppercase tracking-widest mt-2">Puntaje Actual</p>
                                 </div>
                                 <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                       <p className="text-xl font-black text-white">{project.evaluations.length}</p>
                                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Evaluaciones</p>
                                    </div>
                                    <div className="text-center">
                                       <p className="text-xl font-black text-rc-teal">Top</p>
                                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Rendimiento</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                           {project.evaluations.map((evalItem, idx) => (
                              <div key={idx} className="glass-card p-10 rounded-[48px] border border-white/5 relative group overflow-hidden">
                                 <div className="absolute top-0 right-0 p-8 text-rc-teal/5 group-hover:text-rc-teal/10 transition-colors">
                                    <Cpu size={120} />
                                 </div>
                                 <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-rc-teal font-black">
                                          {evalItem.month}/{evalItem.year.toString().slice(-2)}
                                       </div>
                                       <div>
                                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                             evalItem.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                             evalItem.status === 'Growth' ? 'bg-rc-teal/10 text-rc-teal border-rc-teal/10' :
                                             'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                          }`}>
                                             {evalItem.status}
                                          </span>
                                       </div>
                                    </div>
                                    <span className="text-3xl font-black text-white">{evalItem.quantitative.toFixed(1)} <span className="text-sm text-slate-600">/ 5.0</span></span>
                                 </div>
                                 <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 relative z-10">
                                    <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{evalItem.qualitative || 'Sin observaciones registradas.'}"</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'alerts' && (
                     <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between">
                           <div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Matriz de Riesgos Tácticos</h3>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Eventos Críticos y Resolución</p>
                           </div>
                           <button className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-105 transition-all">
                              <AlertTriangle size={16} /> Reportar Incidencia
                           </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                           {project.alerts?.map(alert => (
                              <div key={alert.id} className="glass-card p-8 rounded-[40px] border border-white/5 space-y-6 hover:border-rose-500/30 transition-all group">
                                 <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                       alert.severity === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                       <AlertTriangle size={24} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                       alert.status === 'Open' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                                    }`}>
                                       {alert.status}
                                    </span>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{alert.date} • {alert.type}</p>
                                    <p className="text-sm font-black text-white uppercase tracking-tight leading-tight group-hover:text-rose-500 transition-colors">{alert.description}</p>
                                 </div>
                                 <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Prioridad: {alert.severity}</span>
                                    <button className="text-[9px] font-black text-rc-teal uppercase tracking-widest hover:underline">Gestionar Case</button>
                                 </div>
                              </div>
                           ))}
                        </div>
                        {(!project.alerts || project.alerts.length === 0) && (
                           <div className="py-32 text-center glass-card rounded-[48px] border-dashed border-2 border-white/5 opacity-20">
                              <ShieldCheck size={64} className="mx-auto mb-6 text-rc-teal" />
                              <h5 className="text-lg font-black text-white uppercase tracking-widest">Operación en Parámetros Óptimos</h5>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">No se detectan riesgos críticos en el ecosistema</p>
                           </div>
                        )}
                     </div>
                  )}

                  {activeTab === 'tasks' && (
                     <div className="animate-in fade-in duration-500">
                        <TaskManager projectId={project.id} />
                     </div>
                  )}

                  {activeTab === 'intelligence' && (
                     <div className="animate-in fade-in duration-500 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-rc-teal/5">
                              <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] mb-4">IQ Operativo</h4>
                              <p className="text-4xl font-black text-white">84.2 <span className="text-sm text-rc-teal/50">pts</span></p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Basado en efectividad de tareas</p>
                           </div>
                           <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-amber-500/5">
                              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4">SLA Compliance</h4>
                              <p className="text-4xl font-black text-white">91%</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Cumplimiento de tiempos</p>
                           </div>
                           <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-rose-500/5">
                              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">Áreas en Riesgo</h4>
                              <p className="text-4xl font-black text-white">1</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Efectividad {"<"} 70%</p>
                           </div>
                        </div>

                        <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/20">
                           <div className="flex items-center justify-between mb-10">
                              <div>
                                 <h4 className="text-lg font-black text-white uppercase tracking-tighter">Rendimiento por Área (Rc506)</h4>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impacto Directo en {project.client}</p>
                              </div>
                           </div>

                           <div className="space-y-8">
                              {[
                                 { area: 'Plataforma', score: 92, status: 'Optimal' },
                                 { area: 'Gestión de Calidad', score: 88, status: 'Optimal' },
                                 { area: 'Contact Center', score: 64, status: 'Critical' },
                                 { area: 'Inteligencia de Negocios', score: 95, status: 'Optimal' },
                              ].map((item, idx) => (
                                 <div key={idx} className="relative">
                                    <div className="flex justify-between items-end mb-3">
                                       <div className="flex items-center gap-3">
                                          <span className="text-[11px] font-black text-white uppercase tracking-widest">{item.area}</span>
                                          {item.status === 'Critical' && (
                                             <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black uppercase rounded animate-pulse">Cuello de Botella</span>
                                          )}
                                       </div>
                                       <span className={`text-sm font-black ${item.status === 'Critical' ? 'text-rose-500' : 'text-rc-teal'}`}>{item.score}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                       <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${item.score}%` }}
                                          transition={{ delay: idx * 0.1, duration: 1 }}
                                          className={`h-full ${item.status === 'Critical' ? 'bg-rose-500' : 'bg-rc-teal shadow-[0_0_15px_rgba(59,199,170,0.5)]'}`}
                                       />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Top Performers Ranking */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/20">
                              <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                 <Star size={14} /> Top Performers (Rc506 Elite)
                              </h4>
                              <div className="space-y-6">
                                 {[
                                    { name: 'Marilyn (Lead)', score: 98, tasks: 42, color: 'text-rc-teal' },
                                    { name: 'Carlos Ruiz', score: 94, tasks: 28, color: 'text-amber-500' },
                                    { name: 'Elena Solís', score: 91, tasks: 35, color: 'text-slate-400' },
                                 ].map((user, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 hover:border-rc-teal/30 transition-all group">
                                       <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-full bg-black/40 flex items-center justify-center font-black ${user.color}`}>
                                             #{idx + 1}
                                          </div>
                                          <div>
                                             <p className="text-[11px] font-black text-white uppercase">{user.name}</p>
                                             <p className="text-[8px] font-bold text-slate-500 uppercase">{user.tasks} Tareas Ejecutadas</p>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-lg font-black text-white">{user.score}</p>
                                          <p className="text-[7px] font-black text-rc-teal uppercase tracking-widest">Global IQ</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* Bottleneck Warning */}
                           <div className="flex flex-col justify-center gap-6">
                              <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-[48px] flex flex-col gap-6 relative overflow-hidden group">
                                 <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={120} className="text-rose-500" />
                                 </div>
                                 <div className="w-16 h-16 bg-rose-500 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-rose-500/20">
                                    <AlertTriangle size={32} />
                                 </div>
                                 <div>
                                    <h5 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-2">SISTEMA DE ALERTA TEMPRANA</h5>
                                    <p className="text-xs text-white/70 font-medium leading-relaxed">
                                       Se ha detectado un <span className="text-white font-bold">Cuello de Botella</span> en el área de <span className="text-white font-bold">Contact Center</span>. La efectividad proyectada es del <span className="text-rose-500 font-bold">64%</span>, lo que compromete el cumplimiento del SLA global para <span className="text-white font-bold">{project.client}</span>.
                                    </p>
                                 </div>
                                 <button className="w-full py-4 bg-rose-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all">
                                    Activar Protocolo de Mitigación
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Footer Status */}
            <div className="p-8 border-t border-white/5 bg-[var(--bg-primary)]/90 backdrop-blur-md flex items-center justify-between">
               <div className="flex items-center gap-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
                        <CheckCircle size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">Status: Sincronizado</p>
                        <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest">Protocolo Elite V3.5 Activo</p>
                     </div>
                  </div>
                  <div className="hidden xl:flex items-center gap-4 border-l border-white/10 pl-10">
                     <div className="text-right">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Seguridad Multicapa</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AES-256 E2EE Encryption</p>
                     </div>
                     <ShieldCheck size={28} className="text-rc-teal opacity-50" />
                  </div>
               </div>
               <button 
                  onClick={onClose}
                  className="px-12 py-5 rounded-3xl bg-rc-teal text-white text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(59,199,170,0.3)] hover:scale-105 active:scale-95 transition-all"
               >
                  Finalizar Revisión
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectDetailsModal;
