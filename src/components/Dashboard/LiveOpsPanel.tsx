import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  ShieldAlert, 
  Zap,
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
    <aside className="w-[380px] h-full glass-panel border-l border-white/5 flex flex-col overflow-hidden relative z-40">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Live Health</h2>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-rc-teal rounded-full animate-pulse shadow-[0_0_8px_rgba(59,188,169,0.8)]" />
             <span className="text-[9px] font-black text-rc-teal uppercase tracking-[0.2em]">Real-time</span>
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado Operativo de Cuentas</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10 pb-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Cuentas', value: projects.length, icon: Users, color: 'text-rc-teal' },
             { label: 'Críticas', value: criticalProjects.length, icon: ShieldAlert, color: 'text-rose-500' },
             { label: 'Efectividad', value: '94%', icon: TrendingUp, color: 'text-rc-teal' },
             { label: 'Pendientes', value: tasks.length, icon: Clock, color: 'text-amber-500' },
           ].map((kpi, idx) => {
             const Icon = kpi.icon;
             return (
               <div key={idx} className="glass-card p-4 rounded-3xl border-white/5 hover:border-rc-teal/30 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <div className={`p-2 rounded-xl bg-black/40 ${kpi.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={14} />
                     </div>
                     <span className={`text-lg font-black tracking-tighter ${kpi.color}`}>{kpi.value}</span>
                  </div>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{kpi.label}</span>
               </div>
             );
           })}
        </div>

        {/* Critical Alerts Feed */}
        <div className="space-y-4">
           <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Alertas Estratégicas</h3>
              <ShieldAlert size={14} className="text-rose-500" />
           </div>
           
           {criticalProjects.length > 0 ? (
             criticalProjects.slice(0, 3).map((project) => (
               <div key={project.id} className="glass-card p-5 rounded-[32px] flex items-center gap-4 hover:bg-white/[0.02] cursor-pointer group">
                  <div className="w-2 h-10 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-black text-white uppercase truncate pr-2">{project.client}</span>
                        <ArrowUpRight size={14} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all" />
                     </div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate">SLA en Riesgo Crítico</p>
                  </div>
               </div>
             ))
           ) : (
             <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-30">
                <p className="text-[9px] font-black uppercase tracking-widest">Sin alertas críticas</p>
             </div>
           )}
        </div>

        {/* Team Activity */}
        <div className="space-y-6">
           <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Estado del Equipo</h3>
              <Activity size={14} className="text-rc-teal" />
           </div>

           <div className="space-y-4">
              {tasks.filter(t => t.status === 'In Progress').slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-[24px] hover:bg-white/[0.02] transition-all group border border-transparent hover:border-white/5">
                   <div className="relative">
                      <div className="w-10 h-10 rounded-2xl bg-rc-teal/10 border border-rc-teal/20 flex items-center justify-center text-rc-teal text-[11px] font-black uppercase">
                         {task.assignedTo?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#050505] rounded-full" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                         <span className="text-[13px] font-black text-white truncate">{task.assignedTo}</span>
                         <span className="text-[8px] font-black text-rc-teal uppercase tracking-widest">Online</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium italic">"{task.title}"</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Global Performance Footer */}
      <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="bg-gradient-to-br from-rc-teal/10 to-transparent p-6 rounded-[32px] border border-rc-teal/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp size={40} className="text-rc-teal" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-rc-teal uppercase tracking-[0.2em]">Performance Index</span>
            <span className="px-2 py-0.5 bg-rc-teal text-black text-[8px] font-black rounded uppercase">Live</span>
          </div>
          <div className="text-4xl font-black tracking-tighter text-white">98.4%</div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Eficiencia operativa global</p>
        </div>
      </div>
    </aside>
  );
};

export default LiveOpsPanel;
