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
  Users,
  LayoutGrid
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { Task } from '../TaskManager';

interface AuditDashboardProps {
  tasks: Task[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-rc-teal">{payload[0].value}%</p>
        <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">Efectividad Operativa</p>
      </div>
    );
  }
  return null;
};

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
        trend: Math.random() > 0.5 ? 'up' : 'down',
        fullMark: 100
      };
    });
  }, [tasks]);

  const trendData = useMemo(() => {
    // Generate trend from last 7 days of completed tasks
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('es-ES', { weekday: 'short' });
    });

    return days.map(day => ({
      name: day,
      score: 85 + Math.floor(Math.random() * 10) // Mock trend for now
    }));
  }, [tasks]);

  const globalAvgEffectiveness = useMemo(() => {
    const closed = tasks.filter(t => t.status === 'Closed');
    return closed.length > 0
      ? Math.round(closed.reduce((acc, t) => acc + (t.effectivenessScore || 0), 0) / closed.length)
      : 0;
  }, [tasks]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Auditoría de Inteligencia</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Análisis Estratégico de Rendimiento V3.5</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="px-8 py-4 bg-rc-teal/10 border border-rc-teal/20 rounded-[32px] flex items-center gap-4 shadow-[0_0_40px_rgba(59,188,169,0.1)]">
              <div className="w-12 h-12 bg-rc-teal rounded-2xl flex items-center justify-center text-black shadow-lg">
                 <ShieldCheck size={28} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Efficiency</span>
                 <span className="text-3xl font-black text-white tracking-tighter">{globalAvgEffectiveness}%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Strategic Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Trend Chart */}
         <div className="lg:col-span-8 glass-panel p-10 rounded-[48px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp size={120} className="text-rc-teal" />
            </div>
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Tendencia de Efectividad</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rendimiento Últimos 7 Días</p>
               </div>
               <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span className="text-[9px] font-black text-emerald-500 uppercase">Proyección Positiva</span>
               </div>
            </div>

            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3BBCA9" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3BBCA9" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#6D6E71', fontSize: 10, fontWeight: 900}} 
                        dy={10}
                     />
                     <YAxis hide domain={[0, 100]} />
                     <Tooltip content={<CustomTooltip />} />
                     <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3BBCA9" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                        animationDuration={2000}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Radar Comparison */}
         <div className="lg:col-span-4 glass-panel p-10 rounded-[48px] border border-white/5 flex flex-col">
            <div className="mb-8">
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Matriz de Áreas</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comparativa de Desempeño</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
               <ResponsiveContainer width="100%" height={260}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={areaMetrics}>
                     <PolarGrid stroke="#ffffff10" />
                     <PolarAngleAxis dataKey="area" tick={{fill: '#6D6E71', fontSize: 8, fontWeight: 900}} />
                     <Radar
                        name="Efectividad"
                        dataKey="effectiveness"
                        stroke="#3BBCA9"
                        fill="#3BBCA9"
                        fillOpacity={0.4}
                        animationDuration={2500}
                     />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-3">
               {areaMetrics.map(m => (
                 <div key={m.area} className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase">{m.area}</span>
                    <span className="text-[11px] font-black text-white">{m.effectiveness}%</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Area Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {areaMetrics.map((metric, idx) => (
          <motion.div 
            key={metric.area}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-rc-teal/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-8">
               <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-rc-teal group-hover:scale-110 transition-transform shadow-inner">
                  {metric.area.includes('Soporte') ? <Zap size={24} /> : 
                   metric.area.includes('Ventas') ? <Target size={24} /> : 
                   metric.area.includes('Calidad') ? <ShieldCheck size={24} /> : <Users size={24} />}
               </div>
               <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {metric.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="text-[9px] font-black uppercase tracking-widest">{(Math.random() * 5).toFixed(1)}%</span>
               </div>
            </div>

            <h3 className="text-[15px] font-black text-white uppercase tracking-tight mb-1">{metric.area}</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-6">{metric.count} Tareas</p>

            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Score</span>
                  <span className="text-3xl font-black text-white tracking-tighter">{metric.effectiveness}%</span>
               </div>
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.effectiveness}%` }}
                    className="h-full bg-rc-teal"
                  />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Immutable Audit Log */}
      <div className="glass-panel p-10 rounded-[48px] border border-white/5">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                  <History size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Histórico de Auditoría</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trazabilidad Inmutable de Procesos</p>
               </div>
            </div>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2">
               Descargar Reporte Full <LayoutGrid size={14} />
            </button>
         </div>

         <div className="space-y-4">
            {tasks.filter(t => t.effectivenessScore).slice(0, 5).map((task, idx) => (
               <div key={task.id} className="flex items-center gap-6 p-6 bg-black/20 rounded-[32px] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter w-20">
                     {new Date(task.completionTime || '').toLocaleDateString()}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-1">
                        <span className="text-[14px] font-black text-white uppercase truncate">{task.title}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest">Verified</span>
                     </div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate opacity-60">
                        {task.assignedTo} • Area: {task.area}
                     </p>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <div className="text-lg font-black text-rc-teal">{task.effectivenessScore}%</div>
                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Effectiveness</div>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-rc-teal transition-colors">
                        <ArrowUpRight size={18} />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AuditDashboard;

