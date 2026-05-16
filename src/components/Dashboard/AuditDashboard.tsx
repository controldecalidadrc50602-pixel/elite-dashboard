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

interface AuditDashboardProps {
  projects: Project[];
  isSingleProject?: boolean;
  selectedProjectId?: string | null;
  onSelectProject?: (id: string | null) => void;
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ projects, isSingleProject, selectedProjectId, onSelectProject }) => {
  const selectedProject = useMemo(() => {
    if (isSingleProject) return projects[0];
    if (selectedProjectId) return projects.find(p => p.id === selectedProjectId) || null;
    return null;
  }, [projects, isSingleProject, selectedProjectId]);
  
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const optimum = projects.filter(p => p.healthFlag === 'Verde').length;
    const critical = projects.filter(p => p.healthFlag === 'Roja' || p.healthFlag === 'Negra').length;
    const totalServices = projects.reduce((acc, p) => acc + (p.services?.length || 0), 0);
    
    const globalScore = projects.length > 0 
      ? Math.round(projects.reduce((acc, p) => {
          if (!p.quarterlyAssessment) return acc;
          const vals = Object.values(p.quarterlyAssessment).filter(v => typeof v === 'number') as number[];
          return acc + (vals.reduce((a, b) => a + b, 0) / (vals.length * 5));
        }, 0) / projects.length * 100)
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

    if (selectedProject) {
      return pillars.map(p => ({
        pillar: p.label,
        value: Math.round(((selectedProject.quarterlyAssessment?.[p.key as keyof QuarterlyAssessment] || 0) / 5) * 100)
      }));
    }

    return pillars.map(p => {
      const validProjects = projects.filter(proj => proj.quarterlyAssessment && proj.quarterlyAssessment[p.key as keyof QuarterlyAssessment] !== undefined);
      const avg = validProjects.length > 0
        ? validProjects.reduce((acc, proj) => acc + (proj.quarterlyAssessment![p.key as keyof QuarterlyAssessment] || 0), 0) / validProjects.length
        : 0;
      
      return {
        pillar: p.label,
        value: Math.round((avg / 5) * 100)
      };
    });
  }, [projects, selectedProject]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* 1. Header & Global Metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-light text-white tracking-tighter leading-none">
            {isSingleProject ? `Status: ${selectedProject?.client}` : 'Status Operativo Elite'}
          </h2>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] mt-6 opacity-60">
            {isSingleProject ? `Análisis Estratégico Individual` : 'Resumen de Gestión y Salud de Cartera'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="px-8 py-4 bg-white/[0.01] border border-white/5 rounded-[32px] flex items-center gap-6 backdrop-blur-xl">
               <div className="w-12 h-12 bg-rc-teal/5 rounded-2xl flex items-center justify-center text-rc-teal border border-rc-teal/10">
                  <Award size={20} strokeWidth={1.5} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-medium text-slate-500 uppercase tracking-[0.3em]">Health Index Global</span>
                  <span className="text-3xl font-light text-white leading-none mt-1">{stats.globalScore}%</span>
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

      {/* 2. Client Operational Matrix */}
      <div className="glass-panel p-10 rounded-[48px] border border-white/5 bg-black/10">
         <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
               <h3 className="text-2xl font-light text-white tracking-tight uppercase">Matriz de Operaciones</h3>
               <p className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.4em]">Status de Clientes y Calidad de Servicio</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] rounded-2xl border border-white/5">
               <Search size={14} className="text-rc-teal opacity-40" />
               <span className="text-[9px] font-medium text-slate-500 uppercase tracking-[0.3em]">Vista Consolidada</span>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ scale: 1.01, x: 5 }}
                onClick={() => onSelectProject?.(selectedProjectId === project.id ? null : project.id)}
                className={`p-6 border rounded-[32px] flex flex-col gap-6 transition-all group cursor-pointer backdrop-blur-xl ${
                  selectedProjectId === project.id 
                  ? 'bg-rc-teal/10 border-rc-teal shadow-[0_0_30px_rgba(59,188,169,0.1)]' 
                  : 'bg-white/[0.02] border-white/5 hover:border-rc-teal/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center p-2 border border-white/5 group-hover:border-rc-teal/20 transition-all">
                      {project.logoUrl ? (
                        <img src={project.logoUrl} alt={project.client} className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <Activity className="text-rc-teal opacity-20" size={20} />
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <h4 className="text-[13px] font-medium text-white uppercase tracking-wider">{project.client}</h4>
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
                          onSelectProject?.(project.id);
                          // Necesitamos una forma de avisar al Dashboard que abra el modal.
                          // Por ahora, usaremos un truco: si se hace doble clic o se pulsa este botón específico.
                          document.dispatchEvent(new CustomEvent('open-client-modal', { detail: { id: project.id } }));
                        }}
                        className="p-3 bg-white/5 hover:bg-rc-teal hover:text-black rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-white/5"
                        title="Ver Ficha Completa"
                      >
                         <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-light text-white leading-none tracking-tighter">
                      {Math.round((Object.values(project.quarterlyAssessment || {}).filter(v => typeof v === 'number') as number[]).reduce((a, b) => a + b, 0) / 50 * 100)}%
                    </span>
                    <span className="text-[8px] font-medium text-rc-teal uppercase tracking-[0.4em] mt-1">Calidad</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.services?.map(service => (
                    <div key={service.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.03] rounded-2xl border border-white/5 group/service hover:border-rc-teal/30 transition-all">
                      <div className="flex items-center gap-3 truncate">
                        <Zap size={10} className="text-rc-teal shrink-0" />
                        <div className="flex flex-col truncate">
                           <span className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-wider">{service.name}</span>
                           {(service.extensionCount || service.positionsCount) && (
                              <span className="text-[8px] font-medium text-rc-teal/40 uppercase tracking-[0.2em] mt-0.5">
                                 {service.extensionCount ? `${service.extensionCount} Extensiones` : `${service.positionsCount} Posiciones`}
                              </span>
                           )}
                        </div>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${service.score > 4 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
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
          <TrendingUp size={16} className="text-rc-teal opacity-50" />
          <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em]">Métricas de Rendimiento Operativo</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           {pillarMetrics.map((metric) => (
             <div key={metric.pillar} className="p-8 bg-white/[0.01] border border-white/5 rounded-[32px] flex flex-col items-center text-center group hover:bg-white/[0.02] transition-all">
                <span className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.3em] mb-4">{metric.pillar}</span>
                <div className="text-3xl font-light text-white mb-6 tracking-tighter">{metric.value}%</div>
                <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-rc-teal shadow-[0_0_10px_rgba(59,188,169,0.3)] transition-all duration-1000" 
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
