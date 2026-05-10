import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  ShieldAlert, 
  Zap,
  TrendingUp,
  Circle
} from 'lucide-react';
import { Project } from '../../types/project';
import { Task } from '../TaskManager';

interface LiveOpsPanelProps {
  projects: Project[];
  tasks: Task[];
}

const LiveOpsPanel: React.FC<LiveOpsPanelProps> = ({ projects, tasks }) => {
  const activeTasks = tasks.filter(t => t.status === 'In Progress');
  const criticalProjects = projects.filter(p => p.healthFlag === 'Roja' || p.healthFlag === 'Negra');

  return (
    <aside className="w-[380px] h-full glass-panel border-l border-white/5 flex flex-col overflow-hidden relative">
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

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 pb-10">
        {/* KPI Grid - 15% smaller text/padding */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Cuentas', value: projects.length, icon: Users, color: 'text-rc-teal' },
             { label: 'Críticas', value: projects.filter(p => p.healthFlag === 'Roja').length, icon: ShieldAlert, color: 'text-rose-500' },
             { label: 'Efectividad', value: '94%', icon: TrendingUp, color: 'text-rc-teal' },
             { label: 'Pendientes', value: tasks.length, icon: Clock, color: 'text-amber-500' },
           ].map((kpi, idx) => {
             const Icon = kpi.icon;
             return (
               <div key={idx} className="glass-card p-4 rounded-3xl border-white/5 hover:border-rc-teal/30 hover:shadow-[0_0_15px_rgba(59,188,169,0.1)] transition-all group">
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

        {/* Account Feed */}
        <div className="space-y-4">
            <div className="text-center py-6 border border-dashed border-white/5 rounded-3xl">
              <p className="text-[10px] text-[var(--rc-slate)] uppercase tracking-widest opacity-40">Sin alertas pendientes</p>
            </div>
          )}
        </div>
      </section>

      {/* Active Team Status */}
      <section className="space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-[var(--rc-slate)] uppercase tracking-[0.2em]">Estado del Equipo</h3>
          <Users size={14} className="text-[var(--rc-slate)] opacity-40" />
        </div>

        <div className="space-y-6">
          {tasks.filter(t => t.status === 'In Progress').slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-start gap-4">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-rc-teal/10 border border-rc-teal/20 flex items-center justify-center text-rc-teal text-[10px] font-bold">
                  {task.assignedTo?.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">{task.assignedTo}</span>
                  <span className="text-[9px] font-medium text-rc-teal opacity-60">En Linea</span>
                </div>
                <p className="text-[10px] text-[var(--rc-slate)] truncate mt-0.5">Trabajando en: <span className="text-white/60">{task.title}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Performance */}
      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="bg-gradient-to-br from-rc-teal/10 to-transparent p-6 rounded-[32px] border border-rc-teal/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-rc-teal uppercase tracking-widest">Global Score</span>
            <TrendingUp size={14} className="text-rc-teal" />
          </div>
          <div className="text-3xl font-light tracking-tighter text-rc-teal">98.2%</div>
          <p className="text-[9px] text-[var(--rc-slate)] mt-2">Eficiencia operativa en tiempo real</p>
        </div>
      </div>
    </aside>
  );
};

export default LiveOpsPanel;
