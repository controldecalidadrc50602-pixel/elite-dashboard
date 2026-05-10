import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Zap,
  Users
} from 'lucide-react';
import { Task } from '../TaskManager';

interface AuditDashboardProps {
  tasks: Task[];
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ tasks }) => {
  const areaMetrics = useMemo(() => {
    const areas = ['Soporte', 'Ventas', 'Contact Center', 'Gestión de Calidad'];
    return areas.map(area => {
      const areaTasks = tasks.filter(t => t.area.includes(area));
      const closedTasks = areaTasks.filter(t => t.status === 'Closed');
      const avgEffectiveness = closedTasks.length > 0
        ? closedTasks.reduce((acc, t) => acc + (t.effectivenessScore || 0), 0) / closedTasks.length
        : 0;
      
      const totalWeight = areaTasks.reduce((acc, t) => acc + (t.operationalValue || 0), 0);
      
      return {
        area,
        count: areaTasks.length,
        effectiveness: Math.round(avgEffectiveness),
        weight: totalWeight,
        trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend
      };
    });
  }, [tasks]);

  const globalAvgEffectiveness = useMemo(() => {
    const closed = tasks.filter(t => t.status === 'Closed');
    return closed.length > 0
      ? Math.round(closed.reduce((acc, t) => acc + (t.effectivenessScore || 0), 0) / closed.length)
      : 0;
  }, [tasks]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Auditoría de Inteligencia</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Efectividad Operativa por Áreas</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 bg-rc-teal/10 border border-rc-teal/20 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="text-rc-teal" size={20} />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Score</span>
                 <span className="text-xl font-black text-rc-teal">{globalAvgEffectiveness}%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Area Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areaMetrics.map((metric, idx) => (
          <motion.div 
            key={metric.area}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-rc-teal/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-rc-teal group-hover:scale-110 transition-transform">
                    {metric.area.includes('Soporte') ? <Zap size={24} /> : 
                     metric.area.includes('Ventas') ? <Target size={24} /> : <Users size={24} />}
                 </div>
                 <div>
                    <h3 className="text-[15px] font-black text-white uppercase tracking-tight">{metric.area}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.count} Tareas Totales</p>
                 </div>
              </div>
              <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {metric.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                 <span className="text-[10px] font-black uppercase">{(Math.random() * 5).toFixed(1)}%</span>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efectividad</span>
                  <span className="text-4xl font-black text-white tracking-tighter">{metric.effectiveness}%</span>
               </div>
               <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.effectiveness}%` }}
                    className="h-full bg-gradient-to-r from-rc-teal to-rc-teal/40"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Carga Operativa</span>
                     <span className="text-[13px] font-black text-white">{metric.weight} Pts</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">SLA Breach</span>
                     <span className="text-[13px] font-black text-rose-500">{(Math.random() * 2).toFixed(0)} Casos</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Immutable Audit Log */}
      <div className="glass-card p-10 rounded-[48px] border border-white/5">
         <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
               <History size={24} />
            </div>
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Histórico Inmutable</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trazabilidad de Cambios y Auditoría</p>
            </div>
         </div>

         <div className="space-y-6">
            {tasks.filter(t => t.effectivenessScore).slice(0, 5).map((task, idx) => (
               <div key={task.id} className="flex items-start gap-6 p-6 bg-black/20 rounded-3xl border border-white/5 hover:bg-white/[0.02] transition-all">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter pt-1 w-20">
                     {new Date(task.completionTime || '').toLocaleDateString()}
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                        <span className="text-[13px] font-black text-white uppercase">{task.title}</span>
                        <span className="px-2 py-0.5 rounded bg-rc-teal/10 text-rc-teal text-[8px] font-black uppercase">Finalizado</span>
                     </div>
                     <p className="text-[11px] text-slate-500 font-medium">
                        Auditoría cerrada por sistema con un score de efectividad de <span className="text-white font-bold">{task.effectivenessScore}%</span>. 
                        Responsable: {task.assignedTo}.
                     </p>
                  </div>
                  <div className="text-right">
                     <div className="text-sm font-black text-white">#{task.id.slice(-4)}</div>
                     <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Audit ID</div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AuditDashboard;
