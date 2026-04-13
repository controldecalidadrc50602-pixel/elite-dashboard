import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, Calendar, Star, ShieldCheck, Edit3, AlertCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ClientService, Evaluation } from '../pages/Dashboard';

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
  
  const [activeTab, setActiveTab] = useState<'services' | 'evaluations'>('services');
  const [newService, setNewService] = useState({ name: '', description: '', score: 5 });
  const [newEvaluation, setNewEvaluation] = useState<Evaluation>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    quantitative: 5,
    qualitative: '',
    status: 'Stable'
  });

  if (!project) return null;

  const handleAddService = () => {
    if (!newService.name) return;
    const service: ClientService = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name,
      description: newService.description,
      startDate: new Date().toISOString().split('T')[0],
      score: newService.score
    };
    onUpdate({ ...project, services: [...project.services, service] });
    setNewService({ name: '', description: '', score: 5 });
  };

  const handleAddEvaluation = () => {
    onUpdate({ ...project, evaluations: [newEvaluation, ...project.evaluations] });
    setNewEvaluation({ ...newEvaluation, qualitative: '' });
  };

  const handleDeleteService = (serviceId: string) => {
     onUpdate({ ...project, services: project.services.filter(s => s.id !== serviceId) });
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-[var(--bg-secondary)] border-l border-[var(--glass-border)] shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)] bg-[var(--bg-primary)]/50">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal">
                        <ShieldCheck size={22} />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tighter uppercase truncate max-w-[280px]">
                           {project.client}
                        </h3>
                        <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest flex items-center gap-1">
                           <Calendar size={10} className="text-rc-teal" /> {t('projects.since')} {project.startDate}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={() => onEditRequest && onEditRequest(project)}
                        className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-rc-teal/10 hover:text-rc-teal rounded-xl transition-all text-[var(--text-secondary)]"
                     >
                        <Edit3 size={18} />
                     </button>
                     <button 
                        onClick={() => onDelete && onDelete(project.id)}
                        className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all text-[var(--text-secondary)]"
                     >
                        <Trash2 size={18} />
                     </button>
                     <div className="w-px h-6 bg-[var(--glass-border)] mx-1" />
                     <button 
                        onClick={onClose} 
                        className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all text-[var(--text-secondary)]"
                     >
                        <X size={18} />
                     </button>
                  </div>
               </div>

               {/* Health Snapshot */}
               <div className="flex items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-3 rounded-2xl">
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t('projects.strategicHealth')}</span>
                        <span className="text-xs font-black text-rc-teal">{project.evaluations[0]?.quantitative || 0}/5</span>
                     </div>
                     <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(project.evaluations[0]?.quantitative || 0) * 20}%` }}
                           className="h-full bg-rc-teal" 
                        />
                     </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                     project.evaluations[0]?.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                     project.evaluations[0]?.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                     {project.evaluations[0]?.status ? t(`status.${project.evaluations[0].status.toLowerCase().replace(' ', '')}`) : 'N/A'}
                  </div>
               </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex px-6 gap-6 border-b border-[var(--glass-border)] bg-[var(--bg-primary)]/30">
               <button 
                  onClick={() => setActiveTab('services')}
                  className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                     activeTab === 'services' ? 'text-rc-teal' : 'text-[var(--text-secondary)]'
                  }`}
               >
                  {t('projects.service_details')}
                  {activeTab === 'services' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-teal" />}
               </button>
               <button 
                  onClick={() => setActiveTab('evaluations')}
                  className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                     activeTab === 'evaluations' ? 'text-rc-teal' : 'text-[var(--text-secondary)]'
                  }`}
               >
                  {t('projects.audit_history')}
                  {activeTab === 'evaluations' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-teal" />}
               </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
               {activeTab === 'services' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                     <div className="space-y-3">
                        <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-1 flex items-center justify-between">
                           <span>{t('projects.activeServices')} ({project.services.length})</span>
                        </h4>
                        <div className="space-y-3">
                           {project.services.map(service => (
                              <motion.div 
                                 key={service.id} 
                                 layout
                                 className="group p-5 bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-[24px] hover:border-rc-teal/30 transition-all relative overflow-hidden"
                              >
                                 <div className="flex items-start justify-between relative z-10">
                                    <div className="flex-1 min-w-0">
                                       <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight mb-1 truncate">{service.name}</h4>
                                       <p className="text-[10px] font-medium text-[var(--text-secondary)] leading-relaxed opacity-70">
                                          {service.description || t('dashboard.no_records')}
                                       </p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4">
                                       <div className="flex items-center gap-0.5">
                                          {[...Array(5)].map((_, i) => (
                                             <Star key={i} size={10} className={i < service.score ? 'text-rc-teal fill-rc-teal' : 'text-slate-200 dark:text-slate-800'} />
                                          ))}
                                       </div>
                                       <button 
                                          onClick={() => handleDeleteService(service.id)}
                                          className="p-1.5 text-[var(--text-secondary)] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                       >
                                          <Trash2 size={14} />
                                       </button>
                                    </div>
                                 </div>
                                 <div className="absolute right-0 bottom-0 w-24 h-24 bg-rc-teal/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              </motion.div>
                           ))}
                        </div>
                     </div>

                     {/* New Service Quick Form */}
                     <div className="bg-rc-teal/5 rounded-[24px] p-6 border border-rc-teal/10 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-1.5 h-1.5 bg-rc-teal rounded-full" />
                           <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-widest">{t('projects.add_service')}</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           <input 
                              placeholder={t('projects.service_name')}
                              value={newService.name}
                              onChange={e => setNewService({...newService, name: e.target.value})}
                              className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[11px] font-medium outline-none focus:ring-1 focus:ring-rc-teal/30 focus:border-rc-teal transition-all text-[var(--text-primary)]"
                           />
                           <textarea 
                              placeholder={t('projects.description')}
                              value={newService.description}
                              onChange={e => setNewService({...newService, description: e.target.value})}
                              className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[11px] font-medium outline-none focus:ring-1 focus:ring-rc-teal/30 focus:border-rc-teal transition-all text-[var(--text-primary)] h-16"
                           />
                           <div className="flex items-center gap-4 px-2">
                              <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest shrink-0">{t('projects.quality_score')} ({newService.score})</span>
                              <input 
                                 type="range" min="1" max="5" step="1"
                                 value={newService.score}
                                 onChange={e => setNewService({...newService, score: parseInt(e.target.value)})}
                                 className="flex-1 accent-rc-teal"
                              />
                           </div>
                        </div>
                        <button 
                           onClick={handleAddService}
                           disabled={!newService.name}
                           className="w-full bg-rc-teal hover:bg-rc-teal-dark disabled:opacity-50 text-white rounded-xl py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                        >
                           <Plus size={14} /> {t('projects.add_service')}
                        </button>
                     </div>
                  </div>
               )}

               {activeTab === 'evaluations' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     {/* New Evaluation Form */}
                     <div className="p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[28px] space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <AlertCircle size={14} className="text-rc-teal" />
                           <h4 className="text-[10px] font-black text-rc-teal uppercase tracking-widest">{t('projects.quick_audit')}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                              <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t('common.month')}</label>
                              <select 
                                 value={newEvaluation.month}
                                 onChange={e => setNewEvaluation({...newEvaluation, month: parseInt(e.target.value)})}
                                 className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-xl px-3 py-2 text-[10px] font-bold outline-none text-[var(--text-primary)]"
                              >
                                 {Array.from({length: 12}, (_, i) => (
                                    <option key={i+1} value={i+1}>{i+1}</option>
                                 ))}
                              </select>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t('common.year')}</label>
                              <input 
                                 type="number"
                                 value={newEvaluation.year}
                                 onChange={e => setNewEvaluation({...newEvaluation, year: parseInt(e.target.value)})}
                                 className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-xl px-3 py-2 text-[10px] font-bold outline-none text-[var(--text-primary)]"
                              />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t('dashboard.table_history')}</label>
                           <textarea 
                              value={newEvaluation.qualitative}
                              onChange={e => setNewEvaluation({...newEvaluation, qualitative: e.target.value})}
                              placeholder="Observaciones de este periodo..."
                              className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[10px] font-medium min-h-[80px] outline-none focus:ring-1 focus:ring-rc-teal/30 text-[var(--text-primary)]"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Score ({newEvaluation.quantitative})</label>
                              <input 
                                 type="range" min="1" max="5" step="0.5"
                                 value={newEvaluation.quantitative}
                                 onChange={e => setNewEvaluation({...newEvaluation, quantitative: parseFloat(e.target.value)})}
                                 className="w-full accent-rc-teal cursor-pointer"
                              />
                           </div>
                           <div className="space-y-1.5">
                               <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t('dashboard.table_status')}</label>
                               <select 
                                 value={newEvaluation.status}
                                 onChange={e => setNewEvaluation({...newEvaluation, status: e.target.value as any})}
                                 className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none text-[var(--text-primary)]"
                               >
                                 <option value="Stable">{t('status.stable')}</option>
                                 <option value="At Risk">{t('status.risk')}</option>
                                 <option value="Critical">{t('status.critical')}</option>
                               </select>
                           </div>
                        </div>
                        <button 
                           onClick={handleAddEvaluation}
                           className="w-full bg-rc-teal text-white rounded-xl py-3 text-[9px] font-black uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-rc-teal/20"
                        >
                           {t('common.save')}
                        </button>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-1">{t('projects.audit_history')}</h4>
                        <div className="space-y-3">
                           {project.evaluations.map((evalItem, idx) => (
                              <div key={idx} className="flex gap-4 group">
                                 <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                                       idx === 0 ? 'bg-rc-teal text-white border-rc-teal' : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border-[var(--glass-border)]'
                                    }`}>
                                       {evalItem.quantitative}
                                    </div>
                                    {idx !== project.evaluations.length - 1 && <div className="w-0.5 flex-1 bg-[var(--glass-border)] my-1" />}
                                 </div>
                                 <div className="flex-1 pb-6">
                                    <div className="flex items-center justify-between mb-1">
                                       <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest">
                                          {evalItem.month}/{evalItem.year}
                                       </span>
                                       <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${
                                          evalItem.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                          evalItem.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 
                                          'bg-rose-500/10 text-rose-500 border-rose-500/10'
                                       }`}>
                                          {t(`status.${evalItem.status.toLowerCase().replace(' ', '')}`)}
                                       </span>
                                    </div>
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)] leading-relaxed italic opacity-80">
                                       "{evalItem.qualitative || t('dashboard.no_records')}"
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--glass-border)] bg-[var(--bg-primary)] flex items-center justify-between">
               <div className="flex items-center gap-2 text-rc-teal">
                  <AlertCircle size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t('stats.offline_mode')}</span>
               </div>
               <button 
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-rc-teal text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rc-teal/20 transition-all hover:scale-105 active:scale-95"
               >
                  {t('common.save')}
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
