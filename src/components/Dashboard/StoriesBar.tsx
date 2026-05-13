import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/project';

interface StoriesBarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ projects, selectedProjectId, onSelectProject }) => {
  const sortedProjects = [...projects].sort((a, b) => {
    const healthOrder = { 'Negra': 0, 'Roja': 1, 'Amarilla': 2, 'Verde': 3 };
    return (healthOrder[a.healthFlag as keyof typeof healthOrder] || 4) - 
           (healthOrder[b.healthFlag as keyof typeof healthOrder] || 4);
  });

  const getHealthRing = (flag: string, isSelected: boolean) => {
    if (isSelected) return 'border-rc-teal scale-110 shadow-[0_0_20px_rgba(59,188,169,0.5)]';
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
        <div 
          onClick={() => onSelectProject(null)}
          className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
        >
          <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${
            selectedProjectId === null 
            ? 'border-rc-teal bg-rc-teal/10 scale-110 shadow-[0_0_20px_rgba(59,188,169,0.3)]' 
            : 'border-dashed border-rc-teal/30 bg-rc-teal/[0.02] group-hover:border-rc-teal'
          }`}>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-rc-teal ${selectedProjectId === null ? 'bg-rc-teal/20' : 'bg-rc-teal/10'}`}>
              <span className="text-[9px] font-black tracking-widest">HUB</span>
            </div>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${selectedProjectId === null ? 'text-rc-teal' : 'text-slate-500 group-hover:text-rc-teal'}`}>
            Global
          </span>
        </div>

        {sortedProjects.map((project, idx) => {
          const isSelected = selectedProjectId === project.id;
          return (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => onSelectProject(project.id)}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className={`p-0.5 rounded-full border-2 transition-all duration-500 ${getHealthRing(project.healthFlag, isSelected)}`}>
                <div className="w-13 h-13 rounded-full bg-black border border-white/5 flex items-center justify-center overflow-hidden relative">
                  {project.logoUrl ? (
                    <img src={project.logoUrl} alt={project.client} className="w-8 h-8 object-contain relative z-10" />
                  ) : (
                    <span className="text-[11px] font-black text-rc-teal uppercase relative z-10">{project.client.charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
                </div>
              </div>
              <span className={`text-[9px] font-black truncate max-w-[65px] tracking-tight transition-colors uppercase ${isSelected ? 'text-rc-teal' : 'text-[var(--text-primary)] group-hover:text-rc-teal'}`}>
                {project.client}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StoriesBar;


