import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../types/project';
import { 
  Layers, 
  ChevronDown, 
  ExternalLink,
  Activity,
  Calendar
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable': return 'text-emerald-500';
      case 'Growth': return 'text-[#3BC7AA]';
      case 'At Risk': return 'text-amber-500';
      case 'Critical': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  const statusColor = getStatusColor(latestEval?.status || 'Stable');

  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/[0.03] dark:bg-white/[0.01] rounded-[24px] mb-2 border border-white/10 shadow-xl mt-2' : 'border-b border-white/5 hover:bg-white/[0.05] dark:hover:bg-white/[0.02]'}`}>
      {/* PRECISION ROW (ZOHO-ELITE STYLE) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="technical-grid compact-row elite-accent-line cursor-pointer group"
      >
        {/* State Indicator Dot */}
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColor.replace('text', 'bg')} shadow-[0_0_8px_currentColor]`} />
        
        {/* Name Column */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-black/20 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt={project.client} className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-[10px] font-black text-rc-teal uppercase">
                {project.client.charAt(0)}
              </span>
            )}
          </div>
          <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest truncate group-hover:text-rc-teal transition-colors">
            {project.client}
          </h4>
        </div>

        {/* ID Column */}
        <div className="hidden md:flex items-center gap-2">
           <span className="text-[9px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em] leading-none">#{project.id}</span>
        </div>

        {/* Operations Column */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2 opacity-60">
            <Layers size={10} className="text-rc-teal" />
            <span className="text-[10px] font-black text-[var(--text-primary)] leading-none italic">{project.services.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={10} className="text-rc-teal" />
            <span className="text-[10px] font-black text-rc-teal leading-none">{latestEval?.quantitative || 0}/5</span>
          </div>
        </div>

        {/* Status Column */}
        <div className="flex justify-end pr-4">
          <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${statusColor} bg-black/5 dark:bg-white/5 border border-white/5`}>
             {t(`status.${(latestEval?.status || 'stable').toLowerCase()}`)}
          </div>
        </div>

        {/* Action Column */}
        <div className="flex items-center justify-end">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-[var(--text-secondary)] opacity-20 group-hover:opacity-100 transition-opacity"
          >
            <ChevronDown size={14} />
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
            <div className="px-10 pb-8 pt-4 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/5 bg-black/[0.1] dark:bg-slate-900/40">
              
              <div className="md:col-span-8">
                 <div className="flex items-center gap-3 mb-4">
                    <Calendar size={12} className="text-rc-teal" />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em]">Auditoría: {project.startDate}</span>
                 </div>
                 <div className="bg-white/5 p-5 rounded-3xl border border-white/5 shadow-inner backdrop-blur-md">
                    <p className="text-sm text-[var(--text-primary)] font-medium italic leading-relaxed opacity-80">
                       "{latestEval?.qualitative || 'Sin evaluación estratégica registrada.'}"
                    </p>
                 </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
                  className="w-full bg-rc-teal/10 hover:bg-rc-teal text-rc-teal hover:text-white border border-rc-teal/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-rc-teal/10"
                >
                  <ExternalLink size={16} /> Gestionar Detalles Tácticos
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
