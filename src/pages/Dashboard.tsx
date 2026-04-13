import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  LayoutGrid, 
  CheckSquare, 
  TrendingUp, 
  Users, 
  Calendar,
  Plus
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import TaskManager from '../components/TaskManager';

// Tipos base para el Dashboard
export interface Service {
  name: string;
  score: number;
}

export interface Project {
  id: string;
  client: string;
  startDate: string;
  services: Service[];
  status: 'Óptimo' | 'Aceptable' | 'Mejorable' | 'Deficiente';
}

const initialProjects: Project[] = [
  {
    id: '1',
    client: 'Finanzas Globales S.A.',
    startDate: '2024-01-15',
    services: [
      { name: 'Auditoría V3', score: 5 },
      { name: 'Consultoría Estratégica', score: 4 }
    ],
    status: 'Óptimo'
  },
  {
    id: '2',
    client: 'Industrias del Norte',
    startDate: '2024-02-10',
    services: [
      { name: 'Soporte Técnico', score: 3 },
      { name: 'Mantenimiento Cloud', score: 2 }
    ],
    status: 'Mejorable'
  }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');
  const [projects] = useState<Project[]>(initialProjects);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      optimos: projects.filter(p => p.status === 'Óptimo').length,
      mejorables: projects.filter(p => p.status === 'Mejorable').length,
      avgScore: 4.2 // Demo value
    };
  }, [projects]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Ejecutivo */}
      <header className="glass-panel sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <LayoutGrid className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl tracking-tight">Elite Control Center</h2>
            <p className="text-slate-400 text-xs">Bienvenido, {user}</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutGrid size={18} /> Resumen Ejecutivo
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <CheckSquare size={18} /> Tareas (Zoho Style)
          </button>
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors text-sm font-medium"
        >
          <LogOut size={18} /> Salir
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPIs Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Proyectos Totales" value={stats.total} icon={<LayoutGrid />} color="blue" />
              <StatCard title="Estado Óptimo" value={stats.optimos} icon={<TrendingUp />} color="emerald" />
              <StatCard title="Atención Requerida" value={stats.mejorables} icon={<Plus />} color="amber" />
              <StatCard title="Score Promedio" value={stats.avgScore} icon={<Users />} color="cyan" />
            </div>

            {/* Grid de Proyectos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-2xl">Estatus de Clientes</h3>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/5 transition-all">
                  + Nuevo Proyecto
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <TaskManager />
        )}
      </main>

      <footer className="p-8 text-center text-slate-600 text-sm border-t border-white/5 bg-slate-950/20">
        © 2024 Antigravity Solutions - Strategic Project Auditing
      </footer>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-${color}-500`}>
      {icon}
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
  </div>
);

export default Dashboard;
