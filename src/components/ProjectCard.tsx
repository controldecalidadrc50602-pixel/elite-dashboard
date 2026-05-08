import React from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../types/project';
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
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' }}
      className="glass-card p-6 rounded-[40px] border border-white/5 relative overflow-hidden group cursor-pointer h-full flex flex-col"
      onClick={onOpenDetail}
    >
      {/* Background Accent */}
      <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity ${statusStyle?.split(' ')?.[1] || 'bg-slate-500/10'}`} />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-[18px] bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-rc-teal/30 transition-all">
             {project.logoUrl ? (
               <img src={project.logoUrl} alt={project.client} className="w-8 h-8 object-contain" />
             ) : (
               <span className="text-sm font-black text-rc-teal uppercase">{project.client.charAt(0)}</span>
             )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[var(--text-primary)] font-black text-xl leading-tight group-hover:text-rc-teal transition-colors truncate uppercase tracking-tighter">
               {project.client}
            </h4>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-black mt-1 uppercase tracking-widest opacity-60">
              <Calendar size={12} className="text-rc-teal" /> {project.startDate}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border shrink-0 shadow-sm ${statusStyle}`}>
          {latestEval?.status === 'At Risk' || latestEval?.status === 'Critical' ? (
             <AlertTriangle size={12} strokeWidth={2.5} />
          ) : (
             <ShieldCheck size={12} strokeWidth={2.5} />
          )}
          {t(`status.${(latestEval?.status || 'stable').toLowerCase()}`)}
        </div>
      </div>

      {/* Strategic Insight Snapshot */}
      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-3xl border border-white/5 mb-6 flex-1 flex items-center">
         <p className="text-[11px] text-[var(--text-secondary)] font-bold italic line-clamp-3 leading-relaxed">
            "{latestEval?.qualitative || 'Sin evaluación estratégica registrada.'}"
         </p>
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto">
        {/* Services Count */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rc-teal/10 flex items-center justify-center text-rc-teal border border-rc-teal/10">
                <Layers size={20} />
            </div>
            <div>
                <div className="text-sm font-black text-[var(--text-primary)] leading-none">{project?.services?.length || 0}</div>
                <div className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">{t('projects.activeServices')}</div>
            </div>
        </div>

        {/* Health Score Pillar */}
        <div className="flex flex-col items-end gap-1.5 flex-1 max-w-[120px]">
           <div className="flex items-center justify-between w-full">
              <span className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{t('projects.strategicHealth')}</span>
              <span className="text-xs font-black text-rc-teal">{latestEval?.quantitative || 0}/5</span>
           </div>
           <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(latestEval?.quantitative || 0) * 20}%` }}
                 transition={{ duration: 1, ease: 'easeOut' }}
                 className="h-full bg-gradient-to-r from-rc-teal/60 to-rc-teal" 
              />
           </div>
        </div>
      </div>

      {/* Apple-style Interactive Overlay */}
      <div className="absolute inset-0 bg-rc-teal/[0.01] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </motion.div>
  );
};

export default ProjectCard;
