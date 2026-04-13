import React from 'react';
import { Project } from '../pages/Dashboard';
import { Calendar, Layers, Star, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard: React.FC<{ project: Project, onOpenDetail: () => void }> = ({ project, onOpenDetail }) => {
  const latestEval = project.evaluations[0];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable': return 'emerald';
      case 'Growth': return 'cyan';
      case 'At Risk': return 'amber';
      case 'Critical': return 'rose';
      default: return 'slate';
    }
  };

  const statusColor = getStatusColor(latestEval?.status || 'Stable');

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`glass-card p-6 rounded-2xl border-t-2 border-${statusColor}-500/50 relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-white/5`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-white font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
             {project.client}
          </h4>
          <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
            <Calendar size={14} /> Inicio: {project.startDate}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-${statusColor}-500/10 text-${statusColor}-400 border border-${statusColor}-500/20`}>
          {latestEval?.status === 'At Risk' || latestEval?.status === 'Critical' ? (
             <AlertTriangle size={12} />
          ) : (
             <ShieldCheck size={12} />
          )}
          {latestEval?.status || 'Inactivo'}
        </div>
      </div>

      {/* Evaluación Cualitativa Rápida */}
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-6">
         <p className="text-[11px] text-slate-400 italic line-clamp-2 leading-relaxed">
            "{latestEval?.qualitative || 'Sin evaluación cualitativa registrada para este periodo.'}"
         </p>
      </div>

      <div className="space-y-4">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <Layers size={14} /> Servicios Activos ({project.services.length})
        </p>
        <div className="grid gap-2">
          {project.services.map((service) => (
            <div key={service.id} className="bg-slate-950/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-1">
                 <span className="text-sm font-semibold text-slate-200">{service.name}</span>
                 <div className="flex items-center gap-0.5">
                   {[...Array(5)].map((_, i) => (
                     <Star 
                       key={i} 
                       size={10} 
                       className={i < service.score ? `text-${statusColor}-400 fill-${statusColor}-400` : 'text-slate-800'} 
                     />
                   ))}
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
           <span className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">Salud Estratégica</span>
           <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                 className={`h-full bg-gradient-to-r from-${statusColor}-600 to-${statusColor}-400 transition-all duration-1000`} 
                 style={{ width: `${(latestEval?.quantitative || 3) * 20}%` }} 
              />
           </div>
        </div>
        <button 
           onClick={onOpenDetail}
           className="text-[11px] text-cyan-400 font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 group/btn"
        >
           Auditoria Detallada 
           <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
