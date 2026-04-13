import React from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../pages/Dashboard';
import { Calendar, Layers, Star, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard: React.FC<{ project: Project, onOpenDetail: () => void }> = ({ project, onOpenDetail }) => {
  const { t } = useTranslation();
  const latestEval = project.evaluations[0];
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Stable': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Growth': return 'text-[#3BC7AA] bg-[#3BC7AA]/10 border-[#3BC7AA]/20';
      case 'At Risk': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const statusStyle = getStatusStyle(latestEval?.status || 'Stable');

  return (
    <motion.div 
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="glass-card p-5 rounded-[32px] border border-[var(--glass-border)] relative overflow-hidden group cursor-pointer"
      onClick={onOpenDetail}
    >
      {/* Background Accent */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${statusStyle.split(' ')[1]}`} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-[var(--text-primary)] font-black text-lg leading-tight group-hover:text-rc-teal transition-colors truncate uppercase tracking-tighter">
             {project.client}
          </h4>
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-bold mt-0.5 uppercase tracking-widest">
            <Calendar size={10} className="text-rc-teal" /> {project.startDate}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shrink-0 ${statusStyle}`}>
          {latestEval?.status === 'At Risk' || latestEval?.status === 'Critical' ? (
             <AlertTriangle size={10} />
          ) : (
             <ShieldCheck size={10} />
          )}
          {t(`status.${(latestEval?.status || 'stable').toLowerCase()}`)}
        </div>
      </div>

      {/* Snapshot Qualitativo Compacto */}
      <div className="bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-[var(--glass-border)] mb-4 h-14 flex items-center">
         <p className="text-[10px] text-[var(--text-secondary)] font-medium italic line-clamp-2 leading-tight">
            "{latestEval?.qualitative || 'Sin evaluación registrada.'}"
         </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Services Count */}
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rc-teal/10 flex items-center justify-center text-rc-teal">
                <Layers size={16} />
            </div>
            <div>
                <div className="text-[10px] font-black text-[var(--text-primary)] leading-none">{project.services.length}</div>
                <div className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">{t('projects.activeServices')}</div>
            </div>
        </div>

        {/* Health Score */}
        <div className="flex flex-col items-end gap-1 flex-1 max-w-[100px]">
           <div className="flex items-center gap-1">
              <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{t('projects.strategicHealth')}</span>
              <span className="text-xs font-black text-rc-teal">{latestEval?.quantitative || 0}/5</span>
           </div>
           <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(latestEval?.quantitative || 0) * 20}%` }}
                 className="h-full bg-rc-teal" 
              />
           </div>
        </div>
      </div>

      {/* Action Hover Overlay - Apple Style */}
      <div className="absolute inset-0 bg-rc-teal/0 group-hover:bg-rc-teal/[0.02] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
         <div className="bg-rc-teal text-white p-2 rounded-full shadow-lg scale-50 group-hover:scale-100 transition-transform">
            <ChevronRight size={16} />
         </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
