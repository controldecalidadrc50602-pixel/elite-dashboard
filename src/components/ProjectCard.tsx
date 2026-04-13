import React from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../pages/Dashboard';
import { Calendar, Layers, Star, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard: React.FC<{ project: Project, onOpenDetail: () => void }> = ({ project, onOpenDetail }) => {
  const { t } = useTranslation();
  const latestEval = project.evaluations[0];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable': return 'emerald';
      case 'Growth': return 'rc-teal';
      case 'At Risk': return 'amber';
      case 'Critical': return 'rose';
      default: return 'slate';
    }
  };

  const statusColor = getStatusColor(latestEval?.status || 'Stable');

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`glass-card p-7 rounded-[32px] border-t-4 border-${statusColor}-500 relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-[var(--text-primary)] font-black text-xl leading-tight group-hover:text-rc-teal transition-colors uppercase tracking-tighter">
             {project.client}
          </h4>
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-bold mt-1 uppercase tracking-widest">
            <Calendar size={12} className="text-rc-teal" /> {t('projects.since')}: {project.startDate}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-${statusColor}-500/10 text-${statusColor}-500 border border-${statusColor}-500/20`}>
          {latestEval?.status === 'At Risk' || latestEval?.status === 'Critical' ? (
             <AlertTriangle size={12} />
          ) : (
             <ShieldCheck size={12} />
          )}
          {t(`status.${(latestEval?.status || 'stable').toLowerCase()}`)}
        </div>
      </div>

      {/* Evaluación Cualitativa Rápida */}
      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-[var(--glass-border)] mb-8">
         <p className="text-[11px] text-[var(--text-secondary)] font-medium italic line-clamp-2 leading-relaxed">
            "{latestEval?.qualitative || 'Sin evaluación cualitativa registrada para este periodo.'}"
         </p>
      </div>

      <div className="space-y-4">
        <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <Layers size={14} className="text-rc-teal" /> {t('projects.activeServices')} ({project.services.length})
        </p>
        <div className="grid gap-2">
          {project.services.slice(0, 2).map((service) => (
            <div key={service.id} className="bg-white/40 dark:bg-black/20 p-3 rounded-xl border border-[var(--glass-border)] hover:border-rc-teal/30 transition-all">
              <div className="flex items-center justify-between mb-1">
                 <span className="text-xs font-black text-[var(--text-primary)]">{service.name}</span>
                 <div className="flex items-center gap-0.5">
                   {[...Array(5)].map((_, i) => (
                     <Star 
                       key={i} 
                       size={10} 
                       className={i < service.score ? 'text-rc-teal fill-rc-teal' : 'text-slate-300 dark:text-slate-800'} 
                     />
                   ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex items-center justify-between">
        <div className="flex flex-col gap-1">
           <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{t('projects.strategicHealth')}</span>
           <div className="w-24 h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                 className={`h-full bg-gradient-to-r from-rc-teal to-rc-teal/60 transition-all duration-1000`} 
                 style={{ width: `${(latestEval?.quantitative || 3) * 20}%` }} 
              />
           </div>
        </div>
        <button 
           onClick={onOpenDetail}
           className="text-[10px] text-rc-teal font-black uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 group/btn"
        >
           {t('projects.auditDetail')}
           <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
