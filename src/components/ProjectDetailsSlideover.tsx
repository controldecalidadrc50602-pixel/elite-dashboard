import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, Save, Calendar, Star, ShieldCheck, Edit3, AlertCircle } from 'lucide-react';
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
  const { t, i18n } = useTranslation();
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'services' | 'evaluations'>('services');
  const [newService, setNewService] = useState({ name: '', description: '', score: 5 });
  const [newEvaluation, setNewEvaluation] = useState<Evaluation>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    quantitative: 5,
    qualitative: '',
    status: 'Stable'
  });

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dark:bg-slate-950/60 backdrop-blur-md z-[60]" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-[var(--bg-secondary)] border-l border-[var(--glass-border)] shadow-2xl z-[70] flex flex-col"
          >
            {/* Header - Compact & Operational */}
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
                           <Calendar size={10} className="text-rc-teal" /> {project.startDate}
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
                     {project.evaluations[0]?.status || 'N/A'}
                  </div>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1.5 bg-[var(--bg-primary)] border-b border-[var(--glass-border)] gap-1">
               <TabNavItem 
                active={activeTab === 'services'} 
                onClick={() => setActiveTab('services')} 
                label={i18n.language === 'es' ? 'Portfolio' : 'Portfolio'} 
              />
               <TabNavItem 
                active={activeTab === 'evaluations'} 
                onClick={() => setActiveTab('evaluations')} 
                label={t('audit.history')} 
              />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {activeTab === 'services' ? (
                <div className="space-y-6">
                  {/* List Services */}
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-1 flex items-center justify-between">
                       <span>{t('projects.activeServices')} ({project.services.length})</span>
                       <Plus size={14} className="text-rc-teal" />
                    </h4>
                    <div className="grid gap-3">
                      {project.services.map(s => (
                        <motion.div 
                          layout
                          key={s.id} 
                          className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-4 rounded-2xl flex justify-between items-center group hover:border-rc-teal/30 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                             <div className="text-xs font-black text-[var(--text-primary)] mb-0.5 uppercase tracking-tight truncate">{s.name}</div>
                             <p className="text-[10px] text-[var(--text-secondary)] font-medium truncate opacity-70">{s.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={10} className={i < s.score ? 'text-rc-teal fill-rc-teal' : 'text-slate-200 dark:text-slate-800'} />
                                 ))}
                             </div>
                             <button 
                                onClick={() => handleDeleteService(s.id)}
                                className="text-[var(--text-secondary)] hover:text-rose-500 transition-colors p-1.5 opacity-0 group-hover:opacity-100"
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Add Service - More compact */}
                  <div className="bg-rc-teal/5 rounded-[24px] p-6 border border-rc-teal/10 relative overflow-hidden">
                     <h4 className="text-xs font-black text-[var(--text-primary)] mb-4 flex items-center gap-2 uppercase tracking-tight">
                        Añadir Servicio
                     </h4>
                     <div className="space-y-3">
                        <input 
                           placeholder="Nombre del Servicio" 
                           value={newService.name}
                           onChange={e => setNewService({...newService, name: e.target.value})}
                           className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal outline-none transition-all font-medium"
                        />
                        <textarea 
                           placeholder="Descripción..." 
                           value={newService.description}
                           onChange={e => setNewService({...newService, description: e.target.value})}
                           className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal outline-none h-16 transition-all font-medium"
                        />
                        <button 
                           onClick={handleAddService}
                           className="w-full bg-rc-teal text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-[0.2em] transition-all"
                        >
                           Registrar Servicio
                        </button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                   {/* Create Evaluation */}
                   <div className="bg-[var(--bg-primary)] p-6 rounded-[32px] border border-[var(--glass-border)] shadow-lg">
                      <h4 className="text-xs font-black text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-tight">
                         <Star size={16} className="text-orange-400" /> {t('audit.new')}
                      </h4>
                      <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase block ml-1 tracking-widest">{t('audit.quantitative')} (1-5)</label>
                               <input 
                                  type="number" min="1" max="5" 
                                  value={newEvaluation.quantitative}
                                  onChange={e => setNewEvaluation({...newEvaluation, quantitative: parseInt(e.target.value)})}
                                  className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm text-rc-teal font-black outline-none"
                               />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase block ml-1 tracking-widest">{t('audit.status')}</label>
                               <select 
                                  value={newEvaluation.status}
                                  onChange={e => setNewEvaluation({...newEvaluation, status: e.target.value as any})}
                                  className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                               >
                                  <option value="Stable">Stable</option>
                                  <option value="Growth">Growth</option>
                                  <option value="At Risk">At Risk</option>
                                  <option value="Critical">Critical</option>
                                </select>
                            </div>
                         </div>
                         <textarea 
                            placeholder="Notas cualitativas..." 
                            value={newEvaluation.qualitative}
                            onChange={e => setNewEvaluation({...newEvaluation, qualitative: e.target.value})}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs h-24 outline-none focus:ring-2 focus:ring-rc-teal/20"
                         />
                         <button 
                            onClick={handleAddEvaluation}
                            className="w-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-black py-3 rounded-xl text-[9px] uppercase tracking-[0.2em] hover:bg-rc-teal hover:text-white transition-all"
                         >
                            {t('audit.sign')}
                         </button>
                      </div>
                   </div>

                   {/* History List */}
                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">{t('audit.history')}</h4>
                      <div className="space-y-3">
                        {project.evaluations.map((ev, idx) => (
                          <div key={idx} className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-4 rounded-2xl relative">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase">
                                  {ev.month} / {ev.year}
                                </span>
                                <div className="flex items-center gap-0.5">
                                   {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={8} className={i < ev.quantitative ? 'text-orange-400 fill-orange-400' : 'text-slate-200 dark:text-slate-800'} />
                                   ))}
                                </div>
                             </div>
                             <p className="text-[11px] text-[var(--text-primary)] font-medium leading-relaxed italic opacity-80">"{ev.qualitative}"</p>
                             <div className={`mt-3 text-[8px] font-black uppercase tracking-widest w-fit px-2 py-0.5 rounded-md border ${
                                ev.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                ev.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                             }`}>
                                {ev.status}
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
                  <span className="text-[9px] font-black uppercase tracking-widest">Cambios locales</span>
               </div>
               <button 
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-rc-teal text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rc-teal/20"
               >
                  Listo
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TabNavItem = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${active ? 'bg-rc-teal/10 text-rc-teal' : 'text-[var(--text-secondary)] hover:text-rc-teal'}`}
  >
    {label}
  </button>
);

export default ProjectDetailsSlideover;
r;
