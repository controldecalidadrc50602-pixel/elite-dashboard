import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Plus,
  BarChart3,
  AlertCircle,
  DatabaseZap,
  Star,
  Search,
  Filter,
  Users,
  LayoutGrid,
  TrendingUp
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import TaskManager from '../components/TaskManager';
import ProjectDetailsSlideover from '../components/ProjectDetailsSlideover';
import ProjectModal from '../components/Modals/ProjectModal';
import StatCard from '../components/common/StatCard';
import { motion, AnimatePresence } from 'framer-motion';
import { isSupabaseConfigured } from '../lib/supabase';
import { projectService } from '../services/projectService';
import { initialProjects } from '../lib/mockData';

export interface ClientService {
  id: string;
  name: string;
  description: string;
  startDate: string;
  score: number;
}

export interface Evaluation {
  month: number;
  year: number;
  quantitative: number;
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

interface DashboardProps {
  activeTab: 'overview' | 'status' | 'tasks';
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Slideover State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  const stats = useMemo(() => {
    const riskCount = projects.filter(p => p.evaluations[0]?.status === 'At Risk' || p.evaluations[0]?.status === 'Critical').length;
    const avgScore = projects.length > 0 
      ? (projects.reduce((acc, p) => acc + (p.evaluations[0]?.quantitative || 0), 0) / projects.length).toFixed(1)
      : '0.0';

    return {
      total: projects.length,
      optimos: projects.filter(p => p.status === 'Óptimo').length,
      riesgo: riskCount,
      avgScore
    };
  }, [projects]);

  const handleSaveProject = async (project: Project) => {
    let newProjects;
    if (projects.find(p => p.id === project.id)) {
      newProjects = await projectService.updateProject(project, projects);
    } else {
      newProjects = await projectService.addProject(project, projects);
    }
    setProjects(newProjects);
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      const newProjects = await projectService.deleteProject(id, projects);
      setProjects(newProjects);
      setIsSlideoverOpen(false);
    }
  };

  const handleEditRequest = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
    setIsSlideoverOpen(false);
  };

  const handleUpdateFromSlideover = async (updatedProject: Project) => {
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
       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rc-teal"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Demo Banner - Reduced height */}
      {!isSupabaseConfigured && (
         <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4"
         >
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500">
                  <DatabaseZap size={16} />
               </div>
               <div>
                  <h4 className="text-amber-500 font-bold text-xs tracking-tight">Modo Offline Activo</h4>
                  <p className="text-amber-500/60 text-[10px] font-medium leading-none">Datos persistidos localmente en el navegador.</p>
               </div>
            </div>
            <div className="text-[9px] font-black text-amber-500/40 uppercase tracking-widest border border-amber-500/10 px-2 py-1 rounded-lg">Demo</div>
         </motion.div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Dashboard Header - Enhanced & Compact */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal animate-pulse">
                   <LayoutGrid size={24} />
                </div>
                <div>
                   <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] leading-tight">{t('nav.dashboard')}</h1>
                   <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-widest">{user?.email}</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <div className="relative group">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-rc-teal transition-colors" />
                   <input 
                      type="text"
                      placeholder="Buscar clientes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl py-2.5 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all outline-none w-full md:w-64"
                   />
                </div>
                <button 
                  onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                  className="bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/20 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0"
                >
                   <Plus size={16} /> {t('projects.newProject')}
                </button>
             </div>
          </div>

          {/* KPIs Grid - More compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title={t('stats.total')} value={stats.total} icon={<Users />} color="rc-teal" />
            <StatCard title={t('stats.optimal')} value={stats.optimos} icon={<TrendingUp />} color="emerald" trend="+12%" />
            <StatCard title={t('stats.risk')} value={stats.riesgo} icon={<AlertCircle />} color="rose" />
            <StatCard title={t('stats.avgScore')} value={stats.avgScore} icon={<Star />} color="amber" />
          </div>

          {/* Project Grid - Higher density */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] uppercase">{t('projects.title')}</h3>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{filteredProjects.length} Resultados</span>
                  <div className="h-px w-8 bg-[var(--glass-border)]" />
               </div>
            </div>
            
            <motion.div 
               layout
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onOpenDetail={() => openProjectDetail(project)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40">
                <Search size={48} className="text-rc-teal" />
                <p className="font-bold text-sm tracking-widest uppercase">No se encontraron clientes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-6 md:p-8 rounded-[32px] border border-[var(--glass-border)]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tighter">{t('projects.individualTitle')}</h3>
                       <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Auditoría Ejecutiva</p>
                    </div>
                 </div>
                 <button className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-[var(--text-secondary)] hover:text-rc-teal transition-colors">
                    <Filter size={18} />
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-[var(--glass-border)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">
                          <th className="pb-4">CLIENTE</th>
                          <th className="pb-4 text-center">HEALTH</th>
                          <th className="pb-4">HISTORIAL RECIENTE</th>
                          <th className="pb-4 text-right">STATUS</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                       {projects.map(p => (
                          <tr 
                            key={p.id} 
                            onClick={() => openProjectDetail(p)}
                            className="group hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                          >
                             <td className="py-5">
                                <div className="font-black text-[var(--text-primary)] text-sm tracking-tight">{p.client}</div>
                                <div className="text-[10px] font-bold text-[var(--text-secondary)] mt-0.5">{p.services.length} Servicios Activos</div>
                             </td>
                             <td className="py-5 text-center">
                                <span className="text-xl font-black text-rc-teal tracking-tighter">{p.evaluations[0]?.quantitative || '-'}</span>
                             </td>
                             <td className="py-5 max-w-sm">
                                <p className="text-[11px] text-[var(--text-secondary)] font-medium italic line-clamp-1 pr-4">
                                   "{p.evaluations[0]?.qualitative || 'Sin registros'}"
                                </p>
                             </td>
                             <td className="py-5 text-right">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
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

      <ProjectDetailsSlideover 
         project={selectedProject}
         isOpen={isSlideoverOpen}
         onClose={() => setIsSlideoverOpen(false)}
         onUpdate={handleUpdateFromSlideover}
         onEditRequest={handleEditRequest}
         onDelete={handleDeleteProject}
      />

      <ProjectModal 
         isOpen={isProjectModalOpen}
         onClose={() => setIsProjectModalOpen(false)}
         onSave={handleSaveProject}
         project={editingProject}
      />
    </div>
  );
};

export default Dashboard;
