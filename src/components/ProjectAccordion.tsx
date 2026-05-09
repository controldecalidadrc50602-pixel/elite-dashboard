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
      case 'Verde': return 'bg-emerald-500 text-emerald-500';
      case 'Amarilla': return 'bg-amber-500 text-amber-500';
      case 'Roja': return 'bg-rose-500 text-rose-500';
      case 'Negra': return 'bg-slate-900 text-slate-400';
      default: return 'bg-rc-teal text-rc-teal';
    }
  };

  const flagStyles = getFlagStyles(project.healthFlag || 'Verde');

  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/[0.03] dark:bg-white/[0.01] rounded-[32px] mb-4 border border-white/10 shadow-2xl mt-4 scale-[1.01]' : 'border-b border-white/5 hover:bg-white/[0.02]'}`}>
      {/* PRECISION ROW (ZOHO-ELITE STYLE) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="technical-grid compact-row elite-accent-line cursor-pointer group py-5"
      >
        {/* State Indicator Dot */}
        <div className={`w-2 h-2 rounded-full shrink-0 ${flagStyles.split(' ')[0]} shadow-[0_0_12px_currentColor] ml-2`} />
        
        {/* Name Column */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt={project.client} className="w-7 h-7 object-contain" />
            ) : (
              <span className="text-xs font-black text-rc-teal uppercase">
                {project.client.charAt(0)}
              </span>
            )}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest truncate group-hover:text-rc-teal transition-colors">
              {project.client}
            </h4>
            <p className="text-[8px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-tighter mt-0.5">#{project.id}</p>
          </div>
        </div>

        {/* Ops Metrics Column */}
        <div className="hidden sm:flex items-center gap-8">
          <div className="flex flex-col gap-1">
             <span className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">HC Pulse</span>
             <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[var(--text-primary)] italic">
                   {project.opsPulse?.hcReal || 0}/{project.opsPulse?.hcContracted || 0}
                </span>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-rc-teal" 
                      style={{ width: `${Math.min(100, ((project.opsPulse?.hcReal || 0) / (project.opsPulse?.hcContracted || 1)) * 100)}%` }} 
                   />
                </div>
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">Salud</span>
             <div className="flex items-center gap-2 text-rc-teal">
                <Activity size={10} />
                <span className="text-xs font-black">{latestEval?.quantitative || 0}</span>
             </div>
          </div>
        </div>

        {/* Flag Status Column */}
        <div className="flex justify-end pr-6">
          <div className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${flagStyles.split(' ')[1]} bg-opacity-10 border border-current flex items-center gap-1.5`}>
             <ShieldAlert size={10} />
             {project.healthFlag || 'Verde'}
          </div>
        </div>

        {/* Action Column */}
        <div className="flex items-center justify-end pr-2">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity"
          >
            <ChevronDown size={16} />
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
            <div className="px-10 pb-10 pt-6 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/5 bg-black/[0.15]">
              
              <div className="md:col-span-8 space-y-6">
                 <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                       <Zap size={14} className="text-rc-teal" />
                       <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Pulso: {project.opsPulse?.backupStatus}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Calendar size={14} className="text-rc-teal" />
                       <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Inicio: {project.startDate}</span>
                    </div>
                 </div>
                 <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 shadow-inner backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Activity size={40} className="text-rc-teal" />
                    </div>
                    <p className="text-sm text-[var(--text-primary)] font-medium italic leading-relaxed opacity-80 relative z-10">
                       "{latestEval?.qualitative || 'Sin evaluación estratégica registrada.'}"
                    </p>
                 </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-end space-y-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
                  className="w-full bg-rc-teal text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-rc-teal/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ExternalLink size={16} /> Gestionar Elite V3.5
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
