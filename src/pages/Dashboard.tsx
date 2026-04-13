import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  LayoutGrid, 
  CheckSquare, 
  TrendingUp, 
  Users, 
  Plus,
  BarChart3,
  AlertCircle,
  DatabaseZap
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import TaskManager from '../components/TaskManager';
import ProjectDetailsSlideover from '../components/ProjectDetailsSlideover';
import { motion } from 'framer-motion';
import { isSupabaseConfigured } from '../lib/supabase';

// ... (previous interfaces and data)

// Tipos evolucionados para Gestión Estratégica
export interface ClientService {
  id: string;
  name: string;
  description: string;
  startDate: string;
  score: number; // Cuantitativo (1-5)
}

export interface Evaluation {
  month: number;
  year: number;
  quantitative: number; // 1-5
  qualitative: string;
  status: 'Stable' | 'At Risk' | 'Critical' | 'Growth';
}

export interface Project {
  id: string;
  client: string;
  startDate: string;
  services: ClientService[];
  evaluations: Evaluation[];
  status: 'Óptimo' | 'Aceptable' | 'Mejorable' | 'Deficiente';
}

const initialProjects: Project[] = [
  {
    id: '1',
    client: 'Finanzas Globales S.A.',
    startDate: '2024-01-15',
    services: [
      { id: 's1', name: 'Plataforma Botmaker', description: 'Bot conversacional con 1 flow principal', startDate: '2024-01-15', score: 5 },
      { id: 's2', name: 'Central Telefónica', description: 'Nube PBX con 5 extensiones activas', startDate: '2024-02-01', score: 4 }
    ],
    evaluations: [
      { month: 4, year: 2024, quantitative: 5, qualitative: 'La cuenta se mantiene sólida. El cliente está satisfecho con la automatización del bot.', status: 'Stable' }
    ],
    status: 'Óptimo'
  },
  {
    id: '2',
    client: 'Industrias del Norte',
    startDate: '2024-02-10',
    services: [
      { id: 's3', name: 'Soporte Técnico', description: 'Mantenimiento preventivo mensual', startDate: '2024-02-10', score: 3 }
    ],
    evaluations: [
      { month: 4, year: 2024, quantitative: 2, qualitative: 'Existen retrasos técnicos en la infraestructura del cliente. Posible riesgo de cancelación parcial.', status: 'At Risk' }
    ],
    status: 'Mejorable'
  }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'status' | 'tasks'>('overview');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  
  // State para Slideover
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      optimos: projects.filter(p => p.status === 'Óptimo').length,
      riesgo: projects.filter(p => p.evaluations[0]?.status === 'At Risk' || p.evaluations[0]?.status === 'Critical').length,
      avgScore: 4.2
    };
  }, [projects]);

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setIsSlideoverOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
      {/* Header Ejecutivo */}
      <header className="glass-panel sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <LayoutGrid className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl tracking-tight">Elite Control Center</h2>
            <p className="text-slate-400 text-xs">Bienvenido, {user?.email?.split('@')[0] || 'Ejecutivo'}</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/10">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={<LayoutGrid size={18} />} 
            label="Proyectos" 
          />
          <TabButton 
            active={activeTab === 'status'} 
            onClick={() => setActiveTab('status')} 
            icon={<BarChart3 size={18} />} 
            label="Estatus Global (CEO)" 
          />
          <TabButton 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            icon={<CheckSquare size={18} />} 
            label="Tareas" 
          />
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors text-sm font-medium"
        >
          <LogOut size={18} /> Salir
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {!isSupabaseConfigured && (
           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4"
           >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                    <DatabaseZap size={20} />
                 </div>
                 <div>
                    <h4 className="text-amber-500 font-bold text-sm">Modo Demostracin Activo</h4>
                    <p className="text-amber-500/60 text-[11px]">No se detectaron credenciales de Supabase. Los cambios solo se guardarn localmente en esta sesin.</p>
                 </div>
              </div>
              <div className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest border border-amber-500/10 px-3 py-1 rounded-lg">
                 OFFLINE
              </div>
           </motion.div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPIs Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Proyectos Totales" value={stats.total} icon={<LayoutGrid />} color="blue" />
              <StatCard title="Estado Óptimo" value={stats.optimos} icon={<TrendingUp />} color="emerald" />
              <StatCard title="Cuentas en Riesgo" value={stats.riesgo} icon={<AlertCircle />} color="rose" />
              <StatCard title="Score Promedio" value={stats.avgScore} icon={<Users />} color="cyan" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-2xl">Estatus de Clientes</h3>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2">
                  <Plus size={18} /> Nuevo Proyecto
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onOpenDetail={() => openProjectDetail(project)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                   <BarChart3 className="text-cyan-400" /> Auditoría de Salud de Cuentas (CEO View)
                </h3>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-widest">
                            <th className="pb-4 pt-2 font-bold">Cliente</th>
                            <th className="pb-4 pt-2 font-bold text-center">Salud (1-5)</th>
                            <th className="pb-4 pt-2 font-bold">Resumen Cualitativo</th>
                            <th className="pb-4 pt-2 font-bold text-right">Estatus</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {projects.map(p => (
                            <tr 
                              key={p.id} 
                              onClick={() => openProjectDetail(p)}
                              className="group hover:bg-white/5 transition-all cursor-pointer"
                            >
                               <td className="py-4">
                                  <div className="font-bold text-white">{p.client}</div>
                                  <div className="text-[10px] text-slate-500">{p.services.length} servicios activos</div>
                               </td>
                               <td className="py-4 text-center">
                                  <span className="text-2xl font-black text-cyan-400">{p.evaluations[0]?.quantitative || 'N/A'}</span>
                               </td>
                               <td className="py-4 max-w-md">
                                  <p className="text-xs text-slate-400 italic line-clamp-2">
                                     "{p.evaluations[0]?.qualitative || 'Sin evaluación este mes'}"
                                  </p>
                               </td>
                               <td className="py-4 text-right">
                                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                     p.evaluations[0]?.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                     p.evaluations[0]?.status === 'At Risk' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                     'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                     {p.evaluations[0]?.status || 'Unknown'}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'tasks' && <TaskManager />}
      </main>

      {/* Slideover para Gestión Detallada */}
      <ProjectDetailsSlideover 
         project={selectedProject}
         isOpen={isSlideoverOpen}
         onClose={() => setIsSlideoverOpen(false)}
         onUpdate={handleUpdateProject}
      />

      <footer className="p-8 text-center text-slate-600 text-sm border-t border-white/5 bg-slate-950/20">
        © 2024 Antigravity Solutions - Strategic Project Auditing
      </footer>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${active ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-white/5 bg-slate-900/20">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-${color}-500`}>
      {icon}
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
  </div>
);

export default Dashboard;
