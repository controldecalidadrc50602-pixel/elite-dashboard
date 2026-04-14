import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../types/project';
import { 
  Calendar, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown, 
  ExternalLink,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  project: Project;
  onOpenDetail: () => void;
}

const ProjectAccordion: React.FC<Props> = ({ project, onOpenDetail }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden transition-all duration-500">
      {/* HEADERBAR (ALWAYS VISIBLE) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 md:px-10 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-2xl ${statusStyle.split(' ')[1]} flex items-center justify-center shrink-0 border border-white/5`}>
             <Activity size={20} className={statusStyle.split(' ')[0]} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[var(--text-primary)] font-black text-lg md:text-xl uppercase tracking-tighter truncate leading-none">
               {project.client}
            </h4>
            <div className="flex items-center gap-3 text-[10px] font-black text-[var(--text-secondary)] mt-1.5 uppercase tracking-[0.2em] opacity-60">
               <span className="bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">ID: {project.id}</span>
               <span className="hidden md:flex items-center gap-1"><Calendar size={10} /> {project.startDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className={`hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusStyle}`}>
            {latestEval?.status === 'At Risk' || latestEval?.status === 'Critical' ? (
               <AlertTriangle size={12} strokeWidth={2.5} />
            ) : (
               <ShieldCheck size={12} strokeWidth={2.5} />
            )}
            {t(`status.${(latestEval?.status || 'stable').toLowerCase()}`)}
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="p-2 text-[var(--text-secondary)]"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      {/* EXPANDABLE SECTION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-6 pb-8 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/5 pt-8 bg-black/[0.02] dark:bg-white/[0.01]">
              
              {/* Strategic Insights */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-rc-teal rounded-full" />
                  <span className="text-[10px] font-black text-rc-teal uppercase tracking-widest">Perspectiva Estratégica</span>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-[28px] border border-white/10 shadow-inner">
                   <p className="text-sm md:text-base text-[var(--text-primary)] font-medium italic leading-relaxed">
                      "{latestEval?.qualitative || 'Sin evaluación estratégica registrada.'}"
                   </p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="p-5 bg-white/40 dark:bg-slate-900/40 rounded-[28px] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rc-teal/10 flex items-center justify-center text-rc-teal">
                      <Layers size={20} />
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Servicios</div>
                      <div className="text-lg font-black text-[var(--text-primary)] leading-none">{project?.services?.length || 0} Activos</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Salud</div>
                    <div className="text-lg font-black text-rc-teal">{latestEval?.quantitative || 0}/5</div>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
                  className="w-full bg-rc-teal text-white py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rc-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <ExternalLink size={16} /> Gestionar Proyecto
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectAccordion;
