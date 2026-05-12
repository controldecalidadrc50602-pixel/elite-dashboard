import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Plus,
  AlertCircle,
  Star,
  Search,
  Users,
  TrendingUp,
  Bell,
  ArrowRight,
  CheckCircle2,
  Activity,
  Zap,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { initialProjects } from '../lib/mockData';
import { Project } from '../types/project';
import StoriesBar from '../components/Dashboard/StoriesBar';
import LiveOpsPanel from '../components/Dashboard/LiveOpsPanel';
import AuditDashboard from '../components/Dashboard/AuditDashboard';
import TaskManager, { Task } from '../components/TaskManager';
import StatCard from '../components/common/StatCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import ProjectModal from '../components/Modals/ProjectModal';
import SlaTimer from '../components/common/SlaTimer';

const Dashboard: React.FC<{ activeTab: 'overview' | 'clients' | 'services' | 'tasks' }> = ({ activeTab }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, tasksData] = await Promise.all([
          projectService.getProjects(),
          taskService.getTasks()
        ]);
        setProjects(projectsData.length > 0 ? projectsData : initialProjects);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const riskCount = projects.filter(p => p.healthFlag === 'Roja' || p.healthFlag === 'Negra').length;
    const clientHealthRisk = projects.filter(p => p.clientEvaluation?.status === 'Roja' || p.clientEvaluation?.status === 'Negra').length;
    const totalQuantitative = projects.reduce((acc, p) => acc + (p?.evaluations?.[0]?.quantitative || 0), 0);
    return {
      total: projects.length,
      optimos: projects.filter(p => p.healthFlag === 'Verde' && p.clientEvaluation?.status === 'Verde').length,
      riesgo: riskCount,
      clientRisk: clientHealthRisk,
      avgScore: projects.length > 0 ? (totalQuantitative / projects.length).toFixed(1) : '0.0'
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-transparent">
       <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-rc-teal/20 border-t-rc-teal rounded-full animate-spin" />
          <span className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em]">Loading Engine</span>
       </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Feed Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-[var(--glass-border)]">
        
        {/* Compact Header */}
        <div className="pt-6 px-10 pb-4 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-black text-[var(--text-primary)] tracking-tight uppercase">
                {t('nav.dashboard')} <span className="text-rc-teal ml-1 opacity-50">V3.5</span>
              </h2>
              <div className="flex items-center gap-3">
                 <button className="text-slate-500 hover:text-rc-teal transition-colors p-2 premium-button"><Bell size={18} strokeWidth={1.5} /></button>
                 <button className="text-slate-500 hover:text-rc-teal transition-colors p-2 premium-button"><Search size={18} strokeWidth={1.5} /></button>
              </div>
           </div>
           <StoriesBar projects={projects} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pt-8 pb-20">
           <div className="max-w-5xl mx-auto">
              
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <AuditDashboard projects={projects} />
                </div>
              )}


              {activeTab === 'clients' && (
                 <div className="space-y-12 animate-in fade-in duration-700 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                       <div>
                          <h1 className="text-title text-4xl">Cartera de Clientes</h1>
                          <p className="text-meta mt-1">Directorio Premium Rc506</p>
                       </div>
                       <button 
                         onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                         className="bg-white/5 hover:bg-rc-teal hover:text-black border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 premium-button"
                       >
                          <Plus size={18} strokeWidth={3} /> {t('projects.newProject')}
                       </button>
                    </div>

                    <div className="relative">
                       <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                       <input 
                         type="text"
                         placeholder="Buscar cliente..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full bg-black/20 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs focus:border-rc-teal/30 outline-none transition-all font-medium"
                       />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                       <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-10">
                          {filteredProjects.map((project) => (
                             <motion.div 
                               key={project.id}
                               whileHover={{ scale: 1.05, y: -5 }}
                               whileTap={{ scale: 0.95 }}
                               onClick={() => { setSelectedProject(project); setIsSlideoverOpen(true); }}
                               className="cursor-pointer group flex flex-col items-center gap-4"
                             >
                                <div className={`w-full aspect-square rounded-[32px] bg-white/[0.03] backdrop-blur-md border-[1.5px] flex items-center justify-center p-6 shadow-2xl transition-all duration-500 relative overflow-hidden ${
                                   project.healthFlag === 'Verde' ? 'border-emerald-500/30 group-hover:border-emerald-500 shadow-emerald-500/5' : 
                                   project.healthFlag === 'Amarilla' ? 'border-amber-500/30 group-hover:border-amber-500 shadow-amber-500/5' : 
                                   'border-rose-500/30 group-hover:border-rose-500 shadow-rose-500/5'
                                }`}>
                                   {project.logoUrl ? (
                                      <img src={project.logoUrl} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" alt={project.client} />
                                   ) : (
                                      <Activity className="text-rc-teal opacity-20 group-hover:opacity-100 transition-opacity" size={32} />
                                   )}
                                   
                                   {/* Mini Health Indicator */}
                                   <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
                                      project.healthFlag === 'Verde' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                                      project.healthFlag === 'Amarilla' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                                      'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                                   }`} />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center group-hover:text-rc-teal transition-colors">
                                   {project.client}
                                </span>
                             </motion.div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'status' && (
                <div className="animate-in fade-in duration-700">
                   <AuditDashboard projects={projects} />
                </div>
              )}

           </div>
        </div>
      </div>

      {/* Right Column (10% más compacto) */}
      <div className="w-[340px] hidden xl:block">
        <LiveOpsPanel projects={projects} tasks={tasks} />
      </div>

      <ProjectDetailsModal 
         project={selectedProject}
         isOpen={isSlideoverOpen}
         onClose={() => setIsSlideoverOpen(false)}
         onUpdate={async (p) => setProjects(await projectService.updateProject(p, projects))}
         onEditRequest={(p) => { setEditingProject(p); setIsProjectModalOpen(true); setIsSlideoverOpen(false); }}
         onDelete={async (id) => { if(confirm('Eliminar?')) setProjects(await projectService.deleteProject(id, projects)); setIsSlideoverOpen(false); }}
      />

      <ProjectModal 
         isOpen={isProjectModalOpen}
         onClose={() => setIsProjectModalOpen(false)}
         onSave={async (p) => setProjects(p.id ? await projectService.updateProject(p, projects) : await projectService.addProject(p, projects))}
         project={editingProject}
      />
    </div>
  );
};

export default Dashboard;
