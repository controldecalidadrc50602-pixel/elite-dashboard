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
    <aside className="w-[380px] h-full border-l border-white/5 bg-black/20 backdrop-blur-xl p-8 overflow-y-auto hidden xl:flex flex-col gap-10 custom-scrollbar">
      {/* System Health Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-[var(--rc-slate)] uppercase tracking-[0.2em]">Live Health Ops</h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-3xl border-white/5 bg-white/[0.02]">
            <Activity size={16} className="text-rc-teal mb-3" strokeWidth={1.5} />
            <div className="text-2xl font-light tracking-tighter">{projects.length}</div>
            <div className="text-[9px] font-medium text-[var(--rc-slate)] uppercase tracking-wider mt-1">Cuentas</div>
          </div>
          <div className="glass-card p-5 rounded-3xl border-white/5 bg-white/[0.02]">
            <Zap size={16} className="text-amber-400 mb-3" strokeWidth={1.5} />
            <div className="text-2xl font-light tracking-tighter">{activeTasks.length}</div>
            <div className="text-[9px] font-medium text-[var(--rc-slate)] uppercase tracking-wider mt-1">En Curso</div>
          </div>
        </div>
      </section>

      {/* Critical Alerts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-[var(--rc-slate)] uppercase tracking-[0.2em]">Alertas Críticas</h3>
          <span className="text-[10px] font-bold text-rose-500/60">{criticalProjects.length}</span>
        </div>

        <div className="space-y-4">
          {criticalProjects.slice(0, 3).map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-rose-500/[0.03] border border-rose-500/10 hover:bg-rose-500/[0.05] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/10">
                <ShieldAlert size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-semibold text-rose-500 truncate">{p.client}</h4>
                <p className="text-[10px] text-rose-500/60 truncate mt-0.5">SLA en riesgo crítico</p>
              </div>
            </motion.div>
          ))}
          {criticalProjects.length === 0 && (
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
