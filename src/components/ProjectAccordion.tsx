import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../types/project';
import { 
  Layers, 
  ChevronDown, 
  ExternalLink,
  Activity,
  Calendar,
  Zap,
  ShieldAlert
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
  
  const getFlagStyles = (flag: string) => {
    switch (flag) {
      case 'Verde': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Amarilla': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Roja': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Negra': return 'bg-slate-900/10 text-slate-400 border-slate-900/20';
      default: return 'bg-[var(--rc-turquoise)]/10 text-[var(--rc-turquoise)] border-[var(--rc-turquoise)]/20';
    }
  };

  const flagStyles = getFlagStyles(project.healthFlag || 'Verde');

  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[var(--card-bg)] backdrop-blur-[10px] rounded-[32px] mb-6 border border-[var(--glass-border)] shadow-xl mt-6' : 'border-b border-[var(--glass-border)] hover:bg-black/[0.01] dark:hover:bg-white/[0.01]'}`}>
      {/* PRECISION ROW (ZOHO-ELITE STYLE) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="technical-grid compact-row elite-accent-line cursor-pointer group py-6 px-10"
      >
        {/* State Indicator Dot */}
        <div className={`w-2 h-2 rounded-full shrink-0 ${flagStyles.split(' ')[0]} ml-2`} />
        
        {/* Name Column */}
        <div className="flex items-center gap-5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--glass-border)] flex items-center justify-center overflow-hidden shrink-0">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt={project.client} className="w-9 h-9 object-contain" />
            ) : (
              <span className="text-xs font-semibold text-[var(--rc-turquoise)] uppercase">
                {project.client.charAt(0)}
              </span>
            )}
          </div>
          <div className="truncate">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)] tracking-tight truncate group-hover:text-[var(--rc-turquoise)] transition-colors">
              {project.client}
            </h4>
            <p className="text-[10px] font-medium text-[var(--text-secondary)] opacity-50 tracking-wide mt-0.5">#{project.id}</p>
          </div>
        </div>

        {/* Ops Metrics Column */}
        <div className="hidden sm:flex items-center gap-12">
          <div className="flex flex-col gap-1.5">
             <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-wider opacity-60">HC Pulse</span>
             <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-[var(--text-primary)] tabular-nums">
                   {project.opsPulse?.hcReal || 0}/{project.opsPulse?.hcContracted || 0}
                </span>
                <div className="w-16 h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-rc-teal" 
                      style={{ width: `${Math.min(100, ((project.opsPulse?.hcReal || 0) / (project.opsPulse?.hcContracted || 1)) * 100)}%` }} 
                   />
                </div>
             </div>
          </div>
          <div className="flex flex-col gap-1.5">
             <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-wider opacity-60">Salud</span>
             <div className="flex items-center gap-2 text-[var(--rc-turquoise)]">
                <Activity size={12} strokeWidth={2.5} />
                <span className="text-[13px] font-semibold tabular-nums">{latestEval?.quantitative || 0}</span>
             </div>
          </div>
        </div>

        {/* Flag Status Column */}
        <div className="flex justify-end pr-8">
          <div className={`text-[10px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-lg ${flagStyles} border flex items-center gap-2`}>
             <div className={`w-1.5 h-1.5 rounded-full ${flagStyles.split(' ')[0]} bg-current`} />
             {project.healthFlag || 'Verde'}
          </div>
        </div>

        {/* Action Column */}
        <div className="flex items-center justify-end">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity"
          >
            <ChevronDown size={18} strokeWidth={1.5} />
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
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-12 pb-12 pt-8 grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-[var(--glass-border)]">
              
              <div className="md:col-span-8 space-y-8">
                 <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                       <Zap size={14} className="text-rc-teal opacity-60" />
                       <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">Pulso: {project.opsPulse?.backupStatus}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Calendar size={14} className="text-rc-teal opacity-60" />
                       <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">Inicio: {project.startDate}</span>
                    </div>
                 </div>
                 <div className="bg-white/[0.03] dark:bg-black/[0.1] p-10 rounded-[40px] border border-[var(--glass-border)] relative overflow-hidden">
                    <p className="text-[15px] text-[var(--text-primary)] font-medium italic leading-relaxed opacity-90 relative z-10">
                       "{latestEval?.qualitative || 'Sin evaluación estratégica registrada.'}"
                    </p>
                 </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
                  className="w-full bg-[var(--rc-turquoise)] hover:bg-[var(--rc-turquoise)]/90 text-[var(--bg-primary)] py-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg shadow-[var(--rc-turquoise)]/20 active:scale-[0.98]"
                >
                  <ExternalLink size={18} strokeWidth={1.5} /> Gestionar Elite V3.5
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
