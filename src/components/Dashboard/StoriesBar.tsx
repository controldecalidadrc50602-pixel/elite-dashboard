import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/project';

interface StoriesBarProps {
  projects: Project[];
}

const StoriesBar: React.FC<StoriesBarProps> = ({ projects }) => {
  const sortedProjects = [...projects].sort((a, b) => {
    const healthOrder = { 'Negra': 0, 'Roja': 1, 'Amarilla': 2, 'Verde': 3 };
    return (healthOrder[a.healthFlag as keyof typeof healthOrder] || 4) - 
           (healthOrder[b.healthFlag as keyof typeof healthOrder] || 4);
  });

  const getHealthRing = (flag: string) => {
    switch (flag) {
      case 'Verde': return 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
      case 'Amarilla': return 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
      case 'Roja': return 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
      case 'Negra': return 'border-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.3)]';
      default: return 'border-white/10';
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 no-scrollbar">
      <div className="flex items-center gap-5 px-1">
        {/* Hub Circle */}
        <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
          <div className="w-14 h-14 rounded-full border border-dashed border-rc-teal/30 flex items-center justify-center group-hover:border-rc-teal transition-all duration-300 bg-rc-teal/[0.02]">
            <div className="w-11 h-11 rounded-full bg-rc-teal/10 flex items-center justify-center text-rc-teal">
              <span className="text-[9px] font-black tracking-widest">HUB</span>
            </div>
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-rc-teal transition-colors">Global</span>
        </div>

        {sortedProjects.map((project, idx) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.08 }}
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
          >
            <div className={`p-0.5 rounded-full border-2 ${getHealthRing(project.healthFlag)} transition-all duration-500`}>
              <div className="w-13 h-13 rounded-full bg-black border border-white/5 flex items-center justify-center overflow-hidden relative">
                {project.logoUrl ? (
                  <img src={project.logoUrl} alt={project.client} className="w-8 h-8 object-contain relative z-10" />
                ) : (
                  <span className="text-[11px] font-black text-rc-teal uppercase relative z-10">{project.client.charAt(0)}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
              </div>
            </div>
            <span className="text-[9px] font-black text-[var(--text-primary)] truncate max-w-[65px] tracking-tight group-hover:text-rc-teal transition-colors uppercase">
              {project.client}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;

