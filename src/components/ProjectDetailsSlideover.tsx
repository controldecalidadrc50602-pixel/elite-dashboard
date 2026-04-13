import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, Save, Calendar, Star, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ClientService, Evaluation } from '../pages/Dashboard';

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (project: Project) => void;
}

const ProjectDetailsSlideover: React.FC<Props> = ({ project, isOpen, onClose, onUpdate }) => {
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
            {/* Header */}
            <div className="p-8 border-b border-[var(--glass-border)] flex items-center justify-between">
              <div>
                <motion.h3 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase"
                >
                  {project.client}
                </motion.h3>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1 flex items-center gap-1 font-bold uppercase tracking-widest">
                   <Calendar size={12} className="text-rc-teal" /> {t('projects.since')}: {project.startDate}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl transition-all text-[var(--text-secondary)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-2 bg-[var(--bg-primary)] border-b border-[var(--glass-border)]">
               <TabNavItem 
                active={activeTab === 'services'} 
                onClick={() => setActiveTab('services')} 
                label={i18n.language === 'es' ? 'Portafolio de Servicios' : 'Service Portfolio'} 
              />
               <TabNavItem 
                active={activeTab === 'evaluations'} 
                onClick={() => setActiveTab('evaluations')} 
                label={t('audit.history')} 
              />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {activeTab === 'services' ? (
                <div className="space-y-8">
                  {/* List Services */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                       <ShieldCheck size={14} className="text-rc-teal" /> {t('projects.activeServices')}
                    </h4>
                    <div className="grid gap-3">
                      {project.services.map(s => (
                        <motion.div 
                          layout
                          key={s.id} 
                          className="bg-[var(--bg-primary)] border border-[var(--glass-border)] p-5 rounded-3xl flex justify-between items-start group hover:border-rc-teal/30 transition-all"
                        >
                          <div>
                             <div className="text-sm font-black text-[var(--text-primary)] mb-1 uppercase tracking-tight">{s.name}</div>
                             <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed mb-3">{s.description}</p>
                             <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={10} className={i < s.score ? 'text-rc-teal fill-rc-teal' : 'text-slate-200 dark:text-slate-800'} />
                                 ))}
                             </div>
                          </div>
                          <button className="text-[var(--text-secondary)] hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2">
                             <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Add Service Initializer */}
                  <div className="bg-rc-teal/5 rounded-[32px] p-8 border border-rc-teal/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-rc-teal/5 rounded-full blur-3xl -z-10" />
                     <h4 className="text-sm font-black text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-tight">
                        <Plus size={20} className="text-rc-teal" /> {i18n.language === 'es' ? 'Incorporar Nuevo Servicio' : 'Add New Service'}
                     </h4>
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase ml-2 tracking-widest">{i18n.language === 'es' ? 'Nombre del Servicio' : 'Service Name'}</label>
                          <input 
                             placeholder="Ex: Central Telefónica Cloud" 
                             value={newService.name}
                             onChange={e => setNewService({...newService, name: e.target.value})}
                             className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal outline-none transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase ml-2 tracking-widest">{i18n.language === 'es' ? 'Descripción Técnica' : 'Technical Description'}</label>
                          <textarea 
                             placeholder="..." 
                             value={newService.description}
                             onChange={e => setNewService({...newService, description: e.target.value})}
                             className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal outline-none h-24 transition-all font-medium"
                          />
                        </div>
                        <button 
                           onClick={handleAddService}
                           className="w-full bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/20 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all"
                        >
                           {i18n.language === 'es' ? 'Actualizar Contrato' : 'Update Contract'}
                        </button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                   {/* Create Evaluation */}
                   <div className="bg-[var(--bg-primary)] p-8 rounded-[40px] border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
                      <h4 className="text-sm font-black text-[var(--text-primary)] mb-8 flex items-center gap-3 uppercase tracking-tight">
                         <Star size={20} className="text-orange-400" /> {t('audit.new')}
                      </h4>
                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase block ml-1 tracking-widest">{t('audit.quantitative')} (1-5)</label>
                               <input 
                                  type="number" min="1" max="5" 
                                  value={newEvaluation.quantitative}
                                  onChange={e => setNewEvaluation({...newEvaluation, quantitative: parseInt(e.target.value)})}
                                  className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl px-5 py-3 text-lg text-rc-teal font-black outline-none focus:ring-2 focus:ring-rc-teal/20"
                               />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase block ml-1 tracking-widest">{t('audit.status')}</label>
                               <select 
                                  value={newEvaluation.status}
                                  onChange={e => setNewEvaluation({...newEvaluation, status: e.target.value as any})}
                                  className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-rc-teal/20 cursor-pointer"
                               >
                                  <option value="Stable">Stable</option>
                                  <option value="Growth">Growth</option>
                                  <option value="At Risk">At Risk</option>
                                  <option value="Critical">Critical</option>
                                </select>
                            </div>
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase block ml-1 tracking-widest">{t('audit.qualitative')}</label>
                            <textarea 
                               placeholder="..." 
                               value={newEvaluation.qualitative}
                               onChange={e => setNewEvaluation({...newEvaluation, qualitative: e.target.value})}
                               className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-sm h-36 outline-none focus:ring-2 focus:ring-rc-teal/20 font-medium leading-relaxed"
                            />
                         </div>
                         <button 
                            onClick={handleAddEvaluation}
                            className="w-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-rc-teal hover:text-white transition-all shadow-lg active:scale-[0.98]"
                         >
                            {t('audit.sign')}
                         </button>
                      </div>
                   </div>

                   {/* History List */}
                   <div className="space-y-6 px-2">
                      <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">{t('audit.history')}</h4>
                      <div className="space-y-4">
                        {project.evaluations.map((ev, idx) => (
                          <div key={idx} className="bg-[var(--bg-primary)] border border-[var(--glass-border)] p-6 rounded-3xl relative hover:shadow-lg transition-all">
                             <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                                  {i18n.language === 'es' ? 'Mes' : 'Month'} {ev.month} / {ev.year}
                                </span>
                                <div className="flex items-center gap-1">
                                   {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={10} className={i < ev.quantitative ? 'text-orange-400 fill-orange-400' : 'text-slate-200 dark:text-slate-800'} />
                                   ))}
                                </div>
                             </div>
                             <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed italic opacity-80">"{ev.qualitative}"</p>
                             <div className={`mt-4 text-[9px] font-black uppercase tracking-widest w-fit px-3 py-1 rounded-xl border ${
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

            {/* Footer Actions */}
            <div className="p-8 border-t border-[var(--glass-border)] bg-[var(--bg-primary)] flex items-center justify-end gap-4">
               <button 
                onClick={onClose} 
                className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                  {i18n.language === 'es' ? 'Cerrar' : 'Close'}
              </button>
               <button className="px-8 py-3 rounded-2xl bg-rc-teal text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-rc-teal/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Save size={16} /> {i18n.language === 'es' ? 'Guardar Cambios' : 'Save Changes'}
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
    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${active ? 'text-rc-teal' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
  >
    {label}
    {active && (
      <motion.div 
        layoutId="tab-active"
        className="absolute bottom-0 left-0 right-0 h-1 bg-rc-teal rounded-full"
      />
    )}
  </button>
);

export default ProjectDetailsSlideover;
