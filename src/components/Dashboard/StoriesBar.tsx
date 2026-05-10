import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/project';

interface StoriesBarProps {
  projects: Project[];
}

const StoriesBar: React.FC<StoriesBarProps> = ({ projects }) => {
  // Sort projects to show those with alerts or critical health first
  const sortedProjects = [...projects].sort((a, b) => {
    const healthOrder = { 'Negra': 0, 'Roja': 1, 'Amarilla': 2, 'Verde': 3 };
    return (healthOrder[a.healthFlag as keyof typeof healthOrder] || 4) - 
           (healthOrder[b.healthFlag as keyof typeof healthOrder] || 4);
  });

  const getHealthClass = (flag: string) => {
    switch (flag) {
      case 'Verde': return 'glow-ring-verde';
      case 'Amarilla': return 'glow-ring-amarilla';
      case 'Roja': return 'glow-ring-roja';
      case 'Negra': return 'glow-ring-negra';
      default: return 'border-white/10';
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 no-scrollbar">
      <div className="flex items-center gap-6 px-4">
        {/* "Tu Historia" or General Stats Placeholder */}
        <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-rc-teal transition-colors">
            <div className="w-14 h-14 rounded-full bg-rc-teal/10 flex items-center justify-center text-rc-teal">
              <span className="text-[10px] font-black tracking-tighter">RC</span>
            </div>
          </div>
          <span className="text-[10px] font-medium text-[var(--rc-slate)] uppercase tracking-widest">Global</span>
        </div>

        {sortedProjects.map((project) => (
          <motion.div 
            key={project.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
          >
            <div className={`p-0.5 rounded-full ${getHealthClass(project.healthFlag)} transition-all duration-500`}>
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                {project.logoUrl ? (
                  <img src={project.logoUrl} alt={project.client} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-sm font-semibold text-rc-teal uppercase">{project.client.charAt(0)}</span>
                )}
              </div>
            </div>
            <span className="text-[10px] font-medium text-[var(--text-primary)] truncate max-w-[70px] tracking-tight group-hover:text-rc-teal transition-colors">
              {project.client}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
