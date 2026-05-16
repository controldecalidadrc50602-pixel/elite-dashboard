import React from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../types/project';
import { Calendar, Layers, Activity, AlertTriangle, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard: React.FC<{ project: Project, onOpenDetail: () => void }> = ({ project, onOpenDetail }) => {
  const { t } = useTranslation();
  const latestEval = project.evaluations[0];
  
  const getFlagStyles = (flag: string) => {
    switch (flag) {
      case 'Verde': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
      case 'Amarilla': return 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
      case 'Roja': return 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
      case 'Negra': return 'text-slate-300 bg-black/60 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]';
      default: return 'text-rc-teal bg-rc-teal/10 border-rc-teal/20 shadow-[0_0_20px_rgba(59,188,169,0.15)]';
    }
  };


  const flagStyle = getFlagStyles(project.healthFlag || 'Verde');

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card p-8 rounded-[48px] border border-white/5 relative overflow-hidden group cursor-pointer h-full flex flex-col shadow-2xl"
      onClick={onOpenDetail}
    >
      {/* Background Accent / Health Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-all duration-700 ${flagStyle.split(' ')[1]}`} />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-[24px] bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl group-hover:border-rc-teal/40 transition-all duration-500">
             {project.logoUrl ? (
               <img src={project.logoUrl} alt={project.client} className="w-10 h-10 object-contain" />
             ) : (
               <span className="text-xl font-medium text-rc-teal uppercase opacity-40">{project.client.charAt(0)}</span>
             )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[var(--text-primary)] font-light text-3xl leading-tight group-hover:text-rc-teal transition-all duration-500 truncate uppercase tracking-tighter">
               {project.client}
            </h4>
            <div className="flex items-center gap-3 text-slate-600 text-[10px] font-medium mt-3 uppercase tracking-[0.3em] opacity-60">
              <span className="flex items-center gap-1.5"><Zap size={12} className="text-rc-teal" strokeWidth={1.5} /> {project.techDNA?.operationMode}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span className="flex items-center gap-1.5"><Globe size={12} strokeWidth={1.5} /> {project.techDNA?.isp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Badge */}
      <div className="flex mb-6 relative z-10">
        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[9px] font-medium uppercase tracking-[0.3em] border shadow-2xl ${flagStyle}`}>
          {project.healthFlag === 'Roja' || project.healthFlag === 'Negra' ? (
             <AlertTriangle size={14} className="animate-pulse" strokeWidth={1.5} />
          ) : (
             <ShieldCheck size={14} strokeWidth={1.5} />
          )}
          Estado: {project.healthFlag}
        </div>
      </div>

      {/* Strategic Insight Snapshot */}
      <div className="bg-black/20 p-6 rounded-[32px] border border-white/5 mb-8 flex-1 relative overflow-hidden group/insight">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/insight:opacity-10 transition-opacity">
            <Activity size={40} className="text-rc-teal" />
         </div>
         <p className="text-sm text-[var(--text-primary)] font-medium italic leading-relaxed opacity-80 line-clamp-4 relative z-10">
            "{latestEval?.qualitative || 'Sin evaluación estratégica registrada.'}"
         </p>
      </div>

      {/* Operational Pulse Section */}
      <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-white/5 relative z-10">
        {/* HC Comparison */}
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.4em] opacity-40">Pulse HC</span>
                <span className="text-[10px] font-medium text-rc-teal tracking-tighter">{project.opsPulse?.hcReal || 0} / {project.opsPulse?.hcContracted || 0}</span>
            </div>
            <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((project.opsPulse?.hcReal || 0) / (project.opsPulse?.hcContracted || 1)) * 100)}%` }}
                    className="h-full bg-rc-teal shadow-[0_0_8px_#3BC7AA]" 
                />
            </div>
        </div>

        {/* Services / Assets Summary */}
        <div className="flex items-center justify-end gap-6">
            <div className="flex flex-col items-end">
                <span className="text-xl font-light text-white leading-none tracking-tighter">{project?.services?.length || 0}</span>
                <span className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.4em] opacity-40 mt-1">Services</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xl font-light text-rc-teal leading-none tracking-tighter">{project?.assets?.length || 0}</span>
                <span className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.4em] opacity-40 mt-1">Assets</span>
            </div>
        </div>
      </div>

      {/* Action Indicator */}
      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-40 transition-opacity">
         <Activity size={24} className="text-rc-teal animate-pulse" />
      </div>

    </motion.div>
  );
};

export default ProjectCard;
