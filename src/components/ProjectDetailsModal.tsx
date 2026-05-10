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
  const [activeTab, setActiveTab] = useState<'identity' | 'operations' | 'services' | 'tech' | 'assets'>('identity');
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

  const flagStyles = getFlagColor(editedProject.healthFlag || 'Verde');

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
                        {editedProject.logoUrl ? (
                           <img src={editedProject.logoUrl} alt={editedProject.client} className="w-12 h-12 object-contain" />
                        ) : (
                           <ShieldCheck size={40} className="text-rc-teal" />
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-4">
                           <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase leading-none">
                              {editedProject.client}
                           </h2>
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${flagStyles}`}>
                              Bandera {editedProject.healthFlag}
                           </div>
                        </div>
                        <div className="flex items-center gap-6 mt-3">
                           <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest flex items-center gap-2 opacity-60">
                              <Calendar size={14} className="text-rc-teal" /> Onboarding: {editedProject.startDate}
                           </p>
                           <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest flex items-center gap-2 opacity-60">
                              <Users size={14} className="text-rc-teal" /> ID: {editedProject.id}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     {isEditing ? (
                       <button 
                         onClick={handleSave} 
                         className="flex items-center gap-2 px-6 py-3 bg-rc-teal text-white rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-rc-teal/20 shadow-lg shadow-rc-teal/20"
                       >
                          <Save size={16} /> Guardar Cambios
                       </button>
                     ) : (
                       <button 
                         onClick={() => setIsEditing(true)} 
                         className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-[var(--rc-turquoise)]/10 hover:text-rc-teal rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/5"
                       >
                          <Edit3 size={16} /> {t('common.edit')}
                       </button>
                     )}
                     <button onClick={() => exportService.exportIndividualPDF(editedProject, t)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-[var(--rc-turquoise)]/10 hover:text-rc-teal rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/5">
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
                    { id: 'identity', label: 'Identidad', icon: User },
                    { id: 'operations', label: 'Operaciones', icon: Activity },
                    { id: 'services', label: 'Bitácora', icon: Layers },
                    { id: 'tech', label: 'Tech DNA', icon: Zap },
                    { id: 'assets', label: 'Activos', icon: Headphones },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 ${
                         activeTab === tab.id ? 'text-rc-teal' : 'text-[var(--text-secondary)] opacity-40 hover:opacity-100'
                      }`}
                    >
                       <tab.icon size={16} />
                       {tab.label}
                       {activeTab === tab.id && (
                         <motion.div 
                           layoutId="modal-tab-active" 
                           className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--rc-turquoise)] rounded-t-full" 
                         />
                       )}
                    </button>
                  ))}
               </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 p-10">
               <div className="max-w-7xl mx-auto">
                  
                  {/* TAB: IDENTIDAD */}
                  {activeTab === 'identity' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="lg:col-span-8 space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border border-white/5 space-y-10">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                               <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                                  <User size={24} />
                               </div>
                               <div>
                                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Perfiles de Enlace</h3>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestión Humana y Onboarding</p>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Account Manager (Interno)</label>
                                  <div className="relative group">
                                     <User className="absolute left-6 top-1/2 -translate-y-1/2 text-rc-teal opacity-50 group-hover:opacity-100 transition-opacity" size={18} />
                                     <input 
                                       disabled={!isEditing}
                                       value={editedProject.accountManager || ''}
                                       onChange={(e) => setEditedProject({...editedProject, accountManager: e.target.value})}
                                       className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-sm focus:border-rc-teal/50 outline-none transition-all disabled:opacity-50"
                                       placeholder="Nombre del AM"
                                     />
                                  </div>
                               </div>

                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Colaborador Enlace (Cliente)</label>
                                  <div className="relative group">
                                     <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-rc-teal opacity-50 group-hover:opacity-100 transition-opacity" size={18} />
                                     <input 
                                       disabled={!isEditing}
                                       value={editedProject.partnerLiaison?.name || ''}
                                       onChange={(e) => setEditedProject({...editedProject, partnerLiaison: {...(editedProject.partnerLiaison || {email: ''}), name: e.target.value}})}
                                       className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-sm focus:border-rc-teal/50 outline-none transition-all disabled:opacity-50"
                                       placeholder="Nombre del Enlace"
                                     />
                                  </div>
                               </div>

                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email de Contacto</label>
                                  <input 
                                    disabled={!isEditing}
                                    value={editedProject.partnerLiaison?.email || ''}
                                    onChange={(e) => setEditedProject({...editedProject, partnerLiaison: {...(editedProject.partnerLiaison || {name: ''}), email: e.target.value}})}
                                    className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 px-8 text-sm focus:border-rc-teal/50 outline-none transition-all disabled:opacity-50"
                                    placeholder="ejemplo@cliente.com"
                                  />
                               </div>

                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Fecha de Onboarding</label>
                                  <input 
                                    type="date"
                                    disabled={!isEditing}
                                    value={editedProject.startDate}
                                    onChange={(e) => setEditedProject({...editedProject, startDate: e.target.value})}
                                    className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 px-8 text-sm focus:border-rc-teal/50 outline-none transition-all disabled:opacity-50"
                                  />
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-4 space-y-6">
                         <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-rc-teal/5">
                            <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] mb-6">Resumen Ejecutivo</h4>
                            <div className="space-y-6">
                               <div className="flex flex-col gap-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">Objetivo Estratégico</span>
                                  <textarea 
                                    disabled={!isEditing}
                                    value={editedProject.strategicObjective || ''}
                                    onChange={(e) => setEditedProject({...editedProject, strategicObjective: e.target.value})}
                                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-white resize-none h-32 focus:ring-0"
                                    placeholder="Defina el objetivo principal..."
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: OPERACIONES */}
                  {activeTab === 'operations' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="glass-card p-10 rounded-[40px] border border-white/5 space-y-6">
                            <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em]">Matriz de Contact Center</h4>
                            <div className="space-y-4">
                               <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between">
                                  <span className="text-[10px] font-black text-slate-500 uppercase">HC Contratado</span>
                                  <input 
                                    type="number"
                                    disabled={!isEditing}
                                    value={editedProject.opsPulse?.hcContracted || 0}
                                    onChange={(e) => setEditedProject({...editedProject, opsPulse: {...(editedProject.opsPulse || {hcReal: 0, backupStatus: 'Disponible', operationType: 'Ventas'}), hcContracted: parseInt(e.target.value)}})}
                                    className="bg-transparent border-none text-right w-20 text-xl font-black focus:ring-0"
                                  />
                               </div>
                               <div className="p-6 bg-rc-teal/10 rounded-3xl border border-rc-teal/20 flex items-center justify-between">
                                  <span className="text-[10px] font-black text-rc-teal uppercase">HC Real Asignado</span>
                                  <input 
                                    type="number"
                                    disabled={!isEditing}
                                    value={editedProject.opsPulse?.hcReal || 0}
                                    onChange={(e) => setEditedProject({...editedProject, opsPulse: {...(editedProject.opsPulse || {hcContracted: 0, backupStatus: 'Disponible', operationType: 'Ventas'}), hcReal: parseInt(e.target.value)}})}
                                    className="bg-transparent border-none text-right w-20 text-xl font-black text-rc-teal focus:ring-0"
                                  />
                               </div>
                            </div>
                         </div>

                         <div className="glass-card p-10 rounded-[40px] border border-white/5 space-y-6">
                            <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em]">Tipo de Gestión</h4>
                            <div className="grid grid-cols-1 gap-4">
                               <select 
                                 disabled={!isEditing}
                                 value={editedProject.opsPulse?.operationType || 'Ventas'}
                                 onChange={(e) => setEditedProject({...editedProject, opsPulse: {...(editedProject.opsPulse || {hcContracted: 0, hcReal: 0, backupStatus: 'Disponible'}), operationType: e.target.value as any}})}
                                 className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 px-8 text-sm focus:border-rc-teal/50 outline-none transition-all appearance-none"
                               >
                                  <option value="Ventas">Ventas</option>
                                  <option value="Servicio al Cliente">Servicio al Cliente</option>
                                  <option value="Cobranza">Cobranza</option>
                                  <option value="Soporte Técnico">Soporte Técnico</option>
                               </select>
                               <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Estado de Respaldo</p>
                                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase">
                                     {editedProject.opsPulse?.backupStatus || 'Disponible'}
                                  </span>
                               </div>
                            </div>
                         </div>

                         <div className="glass-card p-10 rounded-[40px] border border-white/5 flex flex-col justify-center text-center">
                            <p className="text-5xl font-black text-white">{Math.round(((editedProject.opsPulse?.hcReal || 0) / (editedProject.opsPulse?.hcContracted || 1)) * 100)}%</p>
                            <p className="text-[10px] font-black text-rc-teal uppercase tracking-widest mt-2">Eficiencia Operativa</p>
                         </div>
                      </div>

                      {/* Turnos y Horarios Grid */}
                      <div className="glass-card p-10 rounded-[48px] border border-white/5">
                         <div className="flex items-center justify-between mb-8">
                            <div>
                               <h4 className="text-xl font-black text-white uppercase tracking-tighter">Matriz de Turnos</h4>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración de Horarios y Dotación</p>
                            </div>
                            {isEditing && (
                              <button className="px-6 py-3 bg-white/5 hover:bg-rc-teal/10 text-rc-teal rounded-2xl text-[9px] font-black uppercase tracking-widest border border-rc-teal/20 transition-all">
                                 + Agregar Turno
                              </button>
                            )}
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {editedProject.opsPulse?.shifts?.map(shift => (
                               <div key={shift.id} className="p-8 bg-black/40 rounded-[32px] border border-white/5 relative group">
                                  <Clock className="absolute right-6 top-6 text-rc-teal/20" size={24} />
                                  <h5 className="text-[13px] font-black text-white uppercase mb-1">{shift.name}</h5>
                                  <p className="text-[10px] font-bold text-rc-teal uppercase mb-4">{shift.timeRange}</p>
                                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                     <span className="text-[9px] font-black text-slate-500 uppercase">Personal</span>
                                     <span className="text-lg font-black text-white">{shift.peopleCount} HC</span>
                                  </div>
                               </div>
                            ))}
                            {(!editedProject.opsPulse?.shifts || editedProject.opsPulse.shifts.length === 0) && (
                               <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-20">
                                  <p className="text-xs font-black uppercase tracking-widest">Sin turnos configurados</p>
                               </div>
                            )}
                         </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: BITÁCORA (SERVICIOS) */}
                  {activeTab === 'services' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="flex items-center justify-between mb-4">
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Bitácora de Servicios</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trazabilidad Técnica y Operativa</p>
                         </div>
                         {isEditing && (
                           <button className="flex items-center gap-2 px-6 py-3 bg-rc-teal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rc-teal/20 hover:scale-105 transition-all">
                              <Plus size={16} /> Agregar Servicio
                           </button>
                         )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {editedProject.services.map(service => (
                           <div key={service.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-rc-teal/30 transition-all group flex flex-col h-full">
                              <div className="flex items-center justify-between mb-8">
                                 <div className={`w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-rc-teal group-hover:bg-rc-teal group-hover:text-white transition-all`}>
                                    {service.name.toLowerCase().includes('bot') ? <MessageSquare size={28} /> : 
                                     service.name.toLowerCase().includes('yeastar') ? <Phone size={28} /> : <Globe size={28} />}
                                 </div>
                                 <span className="text-[9px] font-black text-rc-teal bg-rc-teal/10 px-3 py-1 rounded-full uppercase tracking-widest">ACTIVO</span>
                              </div>

                              <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{service.name}</h4>
                              <p className="text-xs text-slate-500 font-medium mb-8 flex-1">{service.description}</p>

                              <div className="space-y-4 pt-8 border-t border-white/5">
                                 {service.name.toLowerCase().includes('bot') && (
                                   <>
                                     <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tipo</span>
                                        <span className="text-[11px] font-black text-white uppercase">{service.botType || 'No definido'}</span>
                                     </div>
                                     <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Propósito</span>
                                        <span className="text-[11px] font-black text-white uppercase">{service.purpose || 'No definido'}</span>
                                     </div>
                                   </>
                                 )}
                                 <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Última Act.</span>
                                    <span className="text-[11px] font-black text-rc-teal uppercase">{service.lastUpdate || '---'}</span>
                                 </div>
                              </div>
                              
                              <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                                 Ver Detalle Bitácora
                              </button>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: TECH DNA */}
                  {activeTab === 'tech' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                       <div className="glass-card p-10 rounded-[48px] border border-white/5 space-y-12">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                                <Zap size={24} />
                             </div>
                             <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Infraestructura Crítica</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conectividad y Redundancia</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-6">
                                <div className="space-y-4">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Proveedor de Internet (ISP)</label>
                                   <input 
                                     disabled={!isEditing}
                                     value={editedProject.techDNA?.isp || ''}
                                     onChange={(e) => setEditedProject({...editedProject, techDNA: {...(editedProject.techDNA || {operationMode: 'REMOTE', phoneLine: ''}), isp: e.target.value}})}
                                     className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 px-8 text-sm focus:border-rc-teal/50 outline-none transition-all disabled:opacity-50"
                                     placeholder="Ej: Tigo Business, Kolbi..."
                                   />
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Líneas Telefónicas / Troncales</label>
                                   <input 
                                     disabled={!isEditing}
                                     value={editedProject.techDNA?.phoneLine || ''}
                                     onChange={(e) => setEditedProject({...editedProject, techDNA: {...(editedProject.techDNA || {operationMode: 'REMOTE', isp: ''}), phoneLine: e.target.value}})}
                                     className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 px-8 text-sm focus:border-rc-teal/50 outline-none transition-all disabled:opacity-50"
                                     placeholder="Ej: +506 4000-0000"
                                   />
                                </div>
                             </div>

                             <div className="space-y-8">
                                <div className="p-10 bg-black/40 rounded-[40px] border border-white/5 flex flex-col gap-6">
                                   <div className="flex items-center justify-between">
                                      <h5 className="text-[11px] font-black text-white uppercase tracking-widest">Redundancia de Red</h5>
                                      <div 
                                        onClick={() => isEditing && setEditedProject({...editedProject, techDNA: {...(editedProject.techDNA || {operationMode: 'REMOTE', isp: '', phoneLine: ''}), redundancy: !editedProject.techDNA?.redundancy}})}
                                        className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${editedProject.techDNA?.redundancy ? 'bg-rc-teal' : 'bg-white/10'}`}
                                      >
                                         <motion.div 
                                           animate={{ x: editedProject.techDNA?.redundancy ? 24 : 4 }}
                                           className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" 
                                         />
                                      </div>
                                   </div>
                                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                      Indica si el cliente cuenta con un enlace secundario activo para asegurar la continuidad operativa.
                                   </p>
                                   {editedProject.techDNA?.redundancy && (
                                     <div className="px-4 py-2 bg-rc-teal/10 rounded-xl border border-rc-teal/20 text-center">
                                        <span className="text-[9px] font-black text-rc-teal uppercase">Certificado de Continuidad Activo</span>
                                     </div>
                                   )}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* TAB: ACTIVOS */}
                  {activeTab === 'assets' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                       <div className="glass-card p-10 rounded-[48px] border border-white/5">
                          <div className="flex items-center justify-between mb-10">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                                   <Headphones size={24} />
                                </div>
                                <div>
                                   <h3 className="text-xl font-black text-white uppercase tracking-tighter">Inventario de Hardware</h3>
                                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Headsets y Equipamiento</p>
                                </div>
                             </div>
                             {isEditing && (
                               <button className="px-6 py-3 bg-rc-teal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rc-teal/20">
                                  + Nuevo Activo
                               </button>
                             )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                             {editedProject.assets?.map(asset => (
                               <div key={asset.id} className="p-8 bg-black/40 rounded-[40px] border border-white/5 hover:border-rc-teal/30 transition-all group">
                                  <div className="flex items-center justify-between mb-6">
                                     <div className="w-10 h-10 rounded-xl bg-rc-teal/5 flex items-center justify-center text-rc-teal">
                                        <Headphones size={20} />
                                     </div>
                                     <span className="text-[10px] font-black text-slate-500 uppercase">#{asset.id.slice(-4)}</span>
                                  </div>
                                  <h5 className="text-[15px] font-black text-white uppercase mb-2">{asset.model}</h5>
                                  <div className="space-y-3 mt-6">
                                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-slate-500">Cantidad</span>
                                        <span className="text-rc-teal">{asset.quantity} Unidades</span>
                                     </div>
                                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-slate-500">Asignación</span>
                                        <span className="text-white">{asset.assignedPosition || 'Disponible'}</span>
                                     </div>
                                  </div>
                               </div>
                             ))}
                             {(!editedProject.assets || editedProject.assets.length === 0) && (
                               <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[40px] opacity-20">
                                  <p className="text-xs font-black uppercase tracking-widest">Sin activos registrados en inventario</p>
                               </div>
                             )}
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
               </div>
               <div className="flex items-center gap-4">
                  {isEditing ? (
                    <button 
                      onClick={handleSave}
                      className="px-12 py-5 rounded-3xl bg-rc-teal text-[var(--bg-primary)] text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(59,188,169,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                       Guardar Configuración
                    </button>
                  ) : (
                    <button 
                      onClick={onClose}
                      className="px-12 py-5 rounded-3xl bg-[var(--rc-turquoise)] text-[var(--bg-primary)] text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(59,188,169,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                       Cerrar Centro de Mando
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
