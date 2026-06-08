import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { Project, QuarterlyAssessment } from '../../types/project';
import StatCard from '../common/StatCard';
import { AnalyticsPanel } from './AnalyticsPanel';

interface AuditDashboardProps {
  projects: Project[];
  demoMode?: boolean;
  onSelectClient?: (id: string) => void;
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ projects, demoMode, onSelectClient }) => {
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const optimum = projects.filter(p => p.healthFlag === 'Verde').length;
    const critical = projects.filter(p => p.healthFlag === 'Roja' || p.healthFlag === 'Negra').length;
    const totalServices = projects.reduce((acc, p) => acc + (p.services?.length || 0), 0);
    
    const globalScore = projects.length > 0 
      ? projects.reduce((acc, p) => {
          if (!p.quarterlyAssessment) return acc;
          const vals = Object.values(p.quarterlyAssessment).filter(v => typeof v === 'number') as number[];
          return acc + (vals.reduce((a, b) => a + b, 0) / (vals.length * 5));
        }, 0) / projects.length * 100
      : 0;

    return { totalProjects, optimum, critical, totalServices, globalScore };
  }, [projects]);

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
      const validProjects = projects.filter(proj => proj.quarterlyAssessment && proj.quarterlyAssessment[p.key as keyof QuarterlyAssessment] !== undefined);
      const avg = validProjects.length > 0
        ? validProjects.reduce((acc, proj) => acc + (proj.quarterlyAssessment![p.key as keyof QuarterlyAssessment] || 0), 0) / validProjects.length
        : 0;
      
      return {
        pillar: p.label,
        value: (avg / 5) * 100
      };
    });
  }, [projects]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* 1. Header & Global Metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-light text-[var(--text-primary)] tracking-tighter leading-none">
            Status Operativo Elite
          </h2>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] mt-6 opacity-60">
            Resumen de Gestión y Salud de Cartera
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="px-8 py-4 bg-white border border-slate-200 rounded-[32px] flex items-center gap-6 shadow-sm">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100">
                  <Award size={20} strokeWidth={2} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Health Index Global</span>
                  <span className="text-3xl font-bold text-slate-800 leading-none mt-1">{stats.globalScore.toFixed(2)}%</span>
               </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Cartera Optima" 
          value={`${stats.optimum}/${stats.totalProjects}`} 
          icon={<CheckCircle2 />} 
          color="emerald" 
          trend="Estable"
        />
        <StatCard 
          title="Clientes en Riesgo" 
          value={stats.critical} 
          icon={<AlertTriangle />} 
          color="rose" 
          trend={stats.critical > 0 ? "Atención" : "Limpio"}
        />
        <StatCard 
          title="Servicios Activos" 
          value={stats.totalServices} 
          icon={<Layers />} 
          color="rc-teal" 
        />
      </div>

      {/* Analytics & Historical Hub */}
      <AnalyticsPanel projects={projects} demoMode={demoMode} />

      {/* 2. Client Operational Matrix */}
      <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-200 shadow-sm">
         <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
               <h3 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Matriz de Operaciones</h3>
               <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.2em]">Status de Clientes y Calidad de Servicio</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
               <Search size={14} className="text-slate-400" />
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Vista Consolidada</span>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ scale: 1.01, x: 5 }}
                onClick={() => {
                  if (onSelectClient) {
                    onSelectClient(project.id);
                  }
                }}
                className={`bg-white border border-slate-200 rounded-[32px] p-6 flex flex-col gap-6 transition-all group cursor-pointer shadow-sm hover:shadow-md hover:border-blue-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 group-hover:border-blue-100 transition-all">
                      {project.logoUrl ? (
                        <img src={project.logoUrl} alt={project.client} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <Activity className="text-blue-400 opacity-50" size={20} />
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">{project.client}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            project.healthFlag === 'Verde' ? 'bg-emerald-500' : 
                            project.healthFlag === 'Amarilla' ? 'bg-amber-500' : 'bg-rose-500'
                          } shadow-[0_0_10px_currentColor]`} />
                          <span className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.2em]">
                            {project.healthFlag === 'Verde' ? 'ÓPTIMO' : 
                             project.healthFlag === 'Amarilla' ? 'ATENCIÓN' : 'CRÍTICO'}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectClient) {
                            onSelectClient(project.id);
                          }
                        }}
                        className="p-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-blue-100"
                        title="Ver Ficha Completa"
                      >
                         <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-slate-800 leading-none tracking-tighter">
                      {((Object.values(project.quarterlyAssessment || {}).filter(v => typeof v === 'number') as number[]).reduce((a, b) => a + b, 0) / 50 * 100).toFixed(2)}%
                    </span>
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">Calidad</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.services?.map(service => (
                    <div key={service.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 group/service hover:border-blue-300 transition-all">
                      <div className="flex items-center gap-3 truncate">
                        <Zap size={10} className="text-blue-500 shrink-0" />
                        <div className="flex flex-col truncate">
                           <span className="text-[11px] font-bold text-slate-600 truncate uppercase tracking-wider">{service.name}</span>
                           {(service.extensionCount || service.positionsCount) && (
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">
                                 {service.extensionCount ? `${service.extensionCount} Extensiones` : `${service.positionsCount} Posiciones`}
                              </span>
                           )}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${service.score > 4 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
         </div>
      </div>

      {/* 3. Operational Performance Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <TrendingUp size={16} className="text-slate-400" />
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Métricas de Rendimiento Operativo</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           {pillarMetrics.map((metric) => (
             <div key={metric.pillar} className="p-8 bg-white border border-slate-200 shadow-sm rounded-[32px] flex flex-col items-center text-center group hover:shadow-md hover:border-blue-200 transition-all">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">{metric.pillar}</span>
                <div className="text-3xl font-bold text-slate-800 mb-6 tracking-tighter">{metric.value.toFixed(2)}%</div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-blue-500 shadow-none transition-all duration-1000" 
                    style={{ width: `${metric.value}%` }} 
                   />
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;
