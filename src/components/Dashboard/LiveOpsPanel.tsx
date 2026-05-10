import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Users, 
  ShieldAlert, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Project } from '../../types/project';
import { Task } from '../TaskManager';

interface LiveOpsPanelProps {
  projects: Project[];
  tasks: Task[];
}

const LiveOpsPanel: React.FC<LiveOpsPanelProps> = ({ projects, tasks }) => {
  const criticalProjects = projects.filter(p => p.healthFlag === 'Roja' || p.healthFlag === 'Negra');

  return (
    <aside className="w-[340px] h-full glass-panel border-l border-[var(--glass-border)] flex flex-col overflow-hidden relative z-40 transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[12px] font-black text-[var(--text-primary)] uppercase tracking-tighter">Live Health</h2>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-rc-teal rounded-full animate-pulse shadow-[0_0_8px_rgba(59,188,169,0.8)]" />
             <span className="text-[8px] font-black text-rc-teal uppercase tracking-[0.2em]">Real-time</span>
          </div>
        </div>
        <p className="text-meta">Estado Operativo de Cuentas</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
           {[
             { label: 'Cuentas', value: projects.length, icon: Users, color: 'text-rc-teal' },
             { label: 'Críticas', value: criticalProjects.length, icon: ShieldAlert, color: 'text-rose-500' },
             { label: 'Efectividad', value: '94%', icon: TrendingUp, color: 'text-rc-teal' },
             { label: 'Pendientes', value: tasks.length, icon: Clock, color: 'text-amber-500' },
           ].map((kpi, idx) => {
             const Icon = kpi.icon;
             return (
               <div key={idx} className="glass-card p-4 rounded-[28px] border-[var(--glass-border)] hover:border-rc-teal/30 transition-all group premium-button">
                  <div className="flex items-center justify-between mb-2">
                     <div className={`p-1.5 rounded-xl bg-black/40 ${kpi.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={12} />
                     </div>
                     <span className={`text-base font-black tracking-tighter ${kpi.color}`}>{kpi.value}</span>
                  </div>
                  <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest leading-none">{kpi.label}</span>
               </div>
             );
           })}
        </div>

        {/* Critical Alerts Feed */}
        <div className="space-y-4">
           <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">Alertas Estratégicas</h3>
              <ShieldAlert size={12} className="text-rose-500" />
           </div>
           
           <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {criticalProjects.length > 0 ? (
                criticalProjects.slice(0, 3).map((project, idx) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-4 rounded-[28px] flex items-center gap-3 hover:bg-white/[0.02] cursor-pointer group premium-button border-[var(--glass-border)]"
                  >
                    <div className="w-1.5 h-8 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[12px] font-black text-[var(--text-primary)] uppercase truncate pr-2">{project.client}</span>
                          <ArrowUpRight size={12} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight truncate">SLA en Riesgo Crítico</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-6 text-center border border-dashed border-white/5 rounded-[28px] opacity-30">
                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Sin alertas críticas</p>
                </div>
              )}
            </AnimatePresence>
           </div>
        </div>

        {/* Team Activity */}
        <div className="space-y-4">
           <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">Estado del Equipo</h3>
              <Activity size={12} className="text-rc-teal" />
           </div>

           <div className="space-y-2">
              {tasks.filter(t => t.status === 'In Progress').slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-[20px] hover:bg-white/[0.02] transition-all group border border-transparent hover:border-white/5 premium-button">
                   <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-rc-teal/10 border border-rc-teal/20 flex items-center justify-center text-rc-teal text-[10px] font-black uppercase">
                         {task.assignedTo?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                         <span className="text-[12px] font-black text-[var(--text-primary)] truncate">{task.assignedTo}</span>
                         <span className="text-[7px] font-black text-rc-teal uppercase tracking-widest">Active</span>
                      </div>
                      <p className="text-[9px] text-[var(--text-secondary)] truncate mt-0.5 font-medium italic opacity-60">"{task.title}"</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Global Performance Footer */}
      <div className="p-6 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md">
        <div className="bg-gradient-to-br from-rc-teal/10 to-transparent p-5 rounded-[32px] border border-rc-teal/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp size={32} className="text-rc-teal" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[8px] font-black text-rc-teal uppercase tracking-[0.2em]">Performance Index</span>
            <span className="px-2 py-0.5 bg-rc-teal text-black text-[7px] font-black rounded uppercase">Live</span>
          </div>
          <div className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">98.4%</div>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Eficiencia operativa global</p>
        </div>
      </div>
    </aside>
  );
};

export default LiveOpsPanel;
