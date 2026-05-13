import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Target,
  Zap,
  Users,
  LayoutGrid,
  Star,
  Activity,
  HeartPulse,
  Award
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
import { Project } from '../../types/project';
import { exportService } from '../../services/exportService';

interface AuditDashboardProps {
  projects: Project[];
  isSingleProject?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-2xl font-black text-rc-teal leading-none">{payload[0].value}%</p>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-tighter mt-1">Calidad Promedio</p>
      </div>
    );
  }
  return null;
};

const AuditDashboard: React.FC<AuditDashboardProps> = ({ projects, isSingleProject }) => {
  const selectedProject = isSingleProject ? projects[0] : null;
  
  // Cálculo de promedios de los 10 pilares globales
  const pillarMetrics = useMemo(() => {
    const pillars = [
      { key: 'responseTime', label: 'T. Respuesta' },
      { key: 'communicationQuality', label: 'Comunicación' },
      { key: 'effectiveResolution', label: 'Resolución' },
      { key: 'proactivity', label: 'Proactividad' },
      { key: 'technicalKnowledge', label: 'Tech DNA' },
      { key: 'reliability', label: 'Confiabilidad' },
      { key: 'flexibility', label: 'Flexibilidad' },
      { key: 'innovation', label: 'Innovación' },
      { key: 'serviceCulture', label: 'Cultura' },
      { key: 'valuePerception', label: 'Percepción' }
    ];

    return pillars.map(p => {
      const validProjects = projects.filter(proj => proj.quarterlyAssessment && proj.quarterlyAssessment[p.key as keyof typeof proj.quarterlyAssessment] !== undefined);
      const avg = validProjects.length > 0
        ? validProjects.reduce((acc, proj) => acc + (proj.quarterlyAssessment![p.key as keyof typeof proj.quarterlyAssessment] || 0), 0) / validProjects.length
        : 0;
      
      return {
        pillar: p.label,
        value: Math.round((avg / 5) * 100),
        raw: avg.toFixed(1),
        fullMark: 100
      };
    });
  }, [projects]);

  const globalHealthScore = useMemo(() => {
    if (projects.length === 0) return 0;
    const scores = projects.map(p => {
      if (!p.quarterlyAssessment) return 0;
      const values = Object.values(p.quarterlyAssessment).filter(v => typeof v === 'number') as number[];
      return values.reduce((a, b) => a + b, 0) / (values.length * 5);
    });
    return Math.round((scores.reduce((a, b) => a + b, 0) / projects.length) * 100);
  }, [projects]);

  const trendData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return months.map((month, i) => ({
      name: month,
      score: 75 + (i * 2) + Math.floor(Math.random() * 5)
    }));
  }, []);

  const adminStatusDistribution = useMemo(() => {
    const statuses = ['Activo', 'Prueba', 'En Proceso', 'Inactivo'];
    return statuses.map(status => ({
      name: status,
      count: projects.filter(p => p.adminStatus === status).length,
      percentage: projects.length > 0 ? Math.round((projects.filter(p => p.adminStatus === status).length / projects.length) * 100) : 0
    }));
  }, [projects]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            {isSingleProject ? `Status: ${selectedProject?.client}` : 'Centro de Inteligencia'}
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">
            {isSingleProject ? `Análisis Estratégico Individual` : 'Calidad Global de Cartera Rc506'}
          </p>
        </div>
        <div className="flex items-center gap-6">
           <div className="px-8 py-4 bg-rc-teal/10 border border-rc-teal/20 rounded-[32px] flex items-center gap-6 shadow-[0_0_40px_rgba(59,188,169,0.1)]">
              <div className="w-14 h-14 bg-rc-teal rounded-[20px] flex items-center justify-center text-black shadow-lg shadow-rc-teal/20">
                 <Award size={32} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Health Index</span>
                 <span className="text-4xl font-black text-white tracking-tighter">{globalHealthScore}%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-5 glass-panel p-10 rounded-[48px] border border-white/5 flex flex-col bg-black/10">
            <div className="mb-10 flex items-center justify-between">
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    {isSingleProject ? 'ADN de Servicio' : 'Matriz de Excelencia'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {isSingleProject ? 'Atributos de Valor del Cliente' : 'Atributos de Valor Global'}
                  </p>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-rc-teal">
                  <Activity size={20} />
               </div>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[320px]">
               <ResponsiveContainer width="100%" height={320} minHeight={320}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={pillarMetrics}>
                     <PolarGrid stroke="#ffffff10" />
                     <PolarAngleAxis dataKey="pillar" tick={{fill: '#6D6E71', fontSize: 8, fontWeight: 900}} />
                     <Radar
                        name="Calidad"
                        dataKey="value"
                        stroke="#3BBCA9"
                        fill="#3BBCA9"
                        fillOpacity={0.4}
                        animationDuration={2500}
                     />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
               {pillarMetrics.map(m => (
                 <div key={m.pillar} className="p-3 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-rc-teal/30 transition-colors">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block mb-1">{m.pillar}</span>
                    <span className="text-sm font-black text-white leading-none">{m.value}%</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-7 glass-panel p-10 rounded-[48px] border border-white/5 relative overflow-hidden bg-black/5 group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp size={140} className="text-rc-teal" />
            </div>
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Evolución Trimestral</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Satisfacción del Cliente Proyectada</p>
               </div>
               <div className="px-5 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Tendencia al Alza</span>
               </div>
            </div>

            <div className="h-[340px] w-full min-h-[340px]">
               <ResponsiveContainer width="100%" height="100%" minHeight={340}>
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
                        dy={15}
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

            {/* Ciclo de Vida del Cliente / Servicios Activos */}
            <div className="mt-12 pt-12 border-t border-white/5">
               {isSingleProject ? (
                 <>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Unidades de Servicio Activas</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedProject?.services.map(service => (
                        <div key={service.id} className="p-5 bg-white/[0.03] rounded-[24px] border border-white/5 flex items-center justify-between group hover:border-rc-teal/30 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal">
                                 <Zap size={18} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-black text-white uppercase tracking-tighter">{service.name}</span>
                                 <span className="text-[9px] font-bold text-slate-500 uppercase">{service.type || 'Soporte'}</span>
                              </div>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className="text-xs font-black text-rc-teal">{service.score?.toFixed(1) || '5.0'}</span>
                              <span className="text-[8px] font-black text-slate-600 uppercase">Score</span>
                           </div>
                        </div>
                      ))}
                   </div>
                 </>
               ) : (
                 <>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Ciclo de Vida del Cliente</h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {adminStatusDistribution.map(status => (
                        <div key={status.name} className="relative group">
                           <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-black text-white uppercase tracking-tighter">{status.name}</span>
                              <span className="text-[10px] font-black text-rc-teal">{status.percentage}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${status.percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  status.name === 'Activo' ? 'bg-emerald-400' :
                                  status.name === 'Prueba' ? 'bg-amber-400' :
                                  status.name === 'En Proceso' ? 'bg-blue-400' : 'bg-rose-500'
                                }`}
                              />
                           </div>
                           <p className="mt-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">{status.count} Clientes</p>
                        </div>
                      ))}
                   </div>
                 </>
               )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
         {pillarMetrics.map((metric, idx) => (
           <motion.div 
             key={metric.pillar}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: idx * 0.05 }}
             className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-rc-teal/30 transition-all flex flex-col items-center text-center group"
           >
              <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-rc-teal group-hover:scale-110 transition-transform mb-4">
                 <Star size={24} fill={metric.value > 85 ? "currentColor" : "none"} />
              </div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{metric.pillar}</h3>
              <div className="text-3xl font-black text-white tracking-tighter mb-4">{metric.value}%</div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-rc-teal transition-all duration-1000" style={{ width: `${metric.value}%` }} />
              </div>
           </motion.div>
         ))}
      </div>

      <div className="glass-panel p-10 rounded-[48px] border border-white/5 bg-black/10">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-rc-teal/10 rounded-[24px] flex items-center justify-center text-rc-teal">
                  <LayoutGrid size={32} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                      {isSingleProject ? 'Expediente del Cliente' : 'Auditoría Consolidada'}
                   </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {isSingleProject ? 'Reporte Detallado de Salud y ADN' : 'Reporte Ejecutivo de Salud de Cartera'}
                   </p>
               </div>
            </div>
            <button 
               onClick={() => isSingleProject ? exportService.exportIndividualPDF(selectedProject!, null) : exportService.exportGlobalQualityPDF(projects)}
               className="px-10 py-5 bg-rc-teal text-black hover:bg-white transition-all rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-rc-teal/10"
            >
               {isSingleProject ? 'Descargar Expediente' : 'Descargar Reporte Global'} <BarChart3 size={16} strokeWidth={3} />
            </button>
         </div>

         <div className="p-10 bg-rose-500/5 rounded-[40px] border border-rose-500/10 flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="w-14 h-14 bg-rose-500/10 rounded-[20px] flex items-center justify-center text-rose-500">
                  <HeartPulse size={28} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter">Freno de Emergencia</h4>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cuentas con Riesgo de Churn Detectado</p>
               </div>
            </div>
            <div className="flex gap-4">
               {projects.filter(p => p.healthFlag !== 'Verde').slice(0, 3).map(p => (
                  <div key={p.id} className="px-6 py-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
                     <div className={`w-3 h-3 rounded-full ${p.healthFlag === 'Amarilla' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                     <span className="text-[11px] font-black text-white uppercase">{p.client}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AuditDashboard;

