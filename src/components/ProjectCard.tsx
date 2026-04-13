import React from 'react';
import { Project } from '../pages/Dashboard';
import { Calendar, Layers, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Óptimo': return 'emerald';
      case 'Aceptable': return 'sky';
      case 'Mejorable': return 'amber';
      case 'Deficiente': return 'rose';
      default: return 'slate';
    }
  };

  const statusColor = getStatusColor(project.status);

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`glass-card p-6 rounded-2xl border-l-4 border-${statusColor}-500/50 relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-white font-bold text-lg leading-tight">{project.client}</h4>
          <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
            <Calendar size={14} /> Inicio: {project.startDate}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${statusColor}-500/10 text-${statusColor}-400 border border-${statusColor}-500/20`}>
          {project.status}
        </span>
      </div>

      <div className="space-y-3 mt-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
          <Layers size={14} /> Servicios Activos ({project.services.length})
        </p>
        <div className="grid gap-2">
          {project.services.map((service, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm text-slate-300">{service.name}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < service.score ? `text-${statusColor}-400 fill-${statusColor}-400` : 'text-slate-700'} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 bg-slate-800 rounded-full overflow-hidden">
             <div className={`h-full bg-${statusColor}-500`} style={{ width: '85%' }} />
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Salud: 85%</span>
        </div>
        <button className="text-xs text-cyan-400 font-bold hover:underline">Ver Detalle</button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
