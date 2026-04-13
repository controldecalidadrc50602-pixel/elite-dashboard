import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  TrendingUp, 
  Users, 
  Plus,
  BarChart3,
  AlertCircle,
  DatabaseZap,
  Star
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import TaskManager from '../components/TaskManager';
import ProjectDetailsSlideover from '../components/ProjectDetailsSlideover';
import { motion } from 'framer-motion';
import { isSupabaseConfigured } from '../lib/supabase';
import { projectService } from '../services/projectService';

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

interface DashboardProps {
  activeTab: 'overview' | 'status' | 'tasks';
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State para Slideover
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data.length > 0 ? data : initialProjects);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const riskCount = projects.filter(p => p.evaluations[0]?.status === 'At Risk' || p.evaluations[0]?.status === 'Critical').length;
    return {
      total: projects.length,
      optimos: projects.filter(p => p.status === 'Óptimo').length,
      riesgo: riskCount,
      avgScore: 4.2
    };
  }, [projects]);

  const handleUpdateProject = async (updatedProject: Project) => {
    const newProjects = await projectService.updateProject(updatedProject, projects);
    setProjects(newProjects);
    setSelectedProject(updatedProject);
  };

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setIsSlideoverOpen(true);
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rc-teal"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Demo Banner */}
      {!isSupabaseConfigured && (
         <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-between gap-4"
         >
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                  <DatabaseZap size={20} />
               </div>
               <div>
                  <h4 className="text-amber-500 font-bold text-sm tracking-tight">{i18n.language === 'es' ? 'Modo Demostración Activo' : 'Demo Mode Active'}</h4>
                  <p className="text-amber-500/60 text-[11px] font-medium leading-tight">
                    {i18n.language === 'es' ? 'Los datos se guardan en tu navegador comercial (Local). No se requiere base de datos.' : 'Data is stored in your local browser session. No database required.'}
                  </p>
               </div>
            </div>
            <div className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest border border-amber-500/10 px-3 py-1.5 rounded-xl">
               OFFLINE
            </div>
         </motion.div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
                <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">{t('nav.dashboard')}</h1>
                <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">
                   {t('projects.since')} April 2024 • {user?.email}
                </p>
             </div>
             <button className="bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/20 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                <Plus size={18} /> {t('projects.newProject')}
             </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title={t('stats.total')} value={stats.total} icon={<LayoutGrid />} color="rc-teal" />
            <StatCard title={t('stats.optimal')} value={stats.optimos} icon={<TrendingUp />} color="emerald" />
            <StatCard title={t('stats.risk')} value={stats.riesgo} icon={<AlertCircle />} color="rose" />
            <StatCard title={t('stats.avgScore')} value={stats.avgScore} icon={<Star />} color="rc-teal" />
          </div>

          {/* Project List */}
          <div className="space-y-6">
            <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">{t('projects.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="animate-in fade-in slide-in-from-right-8 duration-700">
           <div className="glass-card p-8 md:p-10 rounded-[40px]">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter flex items-center gap-4">
                    <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal">
                      <BarChart3 size={24} />
                    </div>
                    {t('projects.individualTitle')}
                 </h3>
                 <div className="text-[10px] font-black text-rc-teal uppercase tracking-widest bg-rc-teal/10 px-4 py-2 rounded-xl">
                    Executive Audit View
                 </div>
              </div>

              <div className="overflow-x-auto overflow-y-hidden">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-[var(--glass-border)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">
                          <th className="pb-6 font-black uppercase tracking-widest">CLIENT</th>
                          <th className="pb-6 font-black text-center uppercase tracking-widest">HEALTH</th>
                          <th className="pb-6 font-black uppercase tracking-widest">QUALITATIVE FEEDBACK</th>
                          <th className="pb-6 font-black text-right uppercase tracking-widest">STATUS</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                       {projects.map(p => (
                          <tr 
                            key={p.id} 
                            onClick={() => openProjectDetail(p)}
                            className="group hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                          >
                             <td className="py-6">
                                <div className="font-black text-[var(--text-primary)] tracking-tight">{p.client}</div>
                                <div className="text-[10px] font-bold text-[var(--text-secondary)] mt-1">{p.services.length} services active</div>
                             </td>
                             <td className="py-6 text-center">
                                <span className="text-2xl font-black text-rc-teal tracking-tighter">{p.evaluations[0]?.quantitative || 'N/A'}</span>
                             </td>
                             <td className="py-6 max-w-md">
                                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed italic pr-8">
                                   "{p.evaluations[0]?.qualitative || 'No evaluation recorded'}"
                                </p>
                             </td>
                             <td className="py-6 text-right">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                   p.evaluations[0]?.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                   p.evaluations[0]?.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                   'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                }`}>
                                   {t(`status.${(p.evaluations[0]?.status || 'stable').toLowerCase()}`)}
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

      {/* Slideover para Gestión Detallada */}
      <ProjectDetailsSlideover 
         project={selectedProject}
         isOpen={isSlideoverOpen}
         onClose={() => setIsSlideoverOpen(false)}
         onUpdate={handleUpdateProject}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-3xl relative overflow-hidden group transition-all"
  >
    <div className={`absolute -top-4 -right-4 w-24 h-24 bg-${color}/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{title}</span>
      <h4 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mt-1">{value}</h4>
    </div>
    <div className={`mt-4 text-${color} w-8 h-8 rounded-lg bg-${color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </motion.div>
);

export default Dashboard;
