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
  TrendingUp,
  Bell,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Circle,
  Flag,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown
} from 'lucide-react';
import { exportService } from '../services/exportService';
import ProjectCard from '../components/ProjectCard'; // Keep it if needed elsewhere, but we will use Accordion here
import ProjectAccordion from '../components/ProjectAccordion';
import TaskManager, { Task } from '../components/TaskManager';
import AuditDashboard from '../components/Dashboard/AuditDashboard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import ProjectModal from '../components/Modals/ProjectModal';
import StatCard from '../components/common/StatCard';
import { motion, AnimatePresence } from 'framer-motion';
import { isFirebaseConfigured } from '../lib/firebase';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { initialProjects } from '../lib/mockData';

import { Project, Alert } from '../types/project';
import StoriesBar from '../components/Dashboard/StoriesBar';
import LiveOpsPanel from '../components/Dashboard/LiveOpsPanel';

interface DashboardProps {
  activeTab: 'overview' | 'clients' | 'status' | 'tasks';
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Timer update for tasks
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Modals / Slideover State
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

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  const stats = useMemo(() => {
    const riskCount = projects.filter(p => p.healthFlag === 'Roja' || p.healthFlag === 'Negra').length;
    const totalQuantitative = projects.reduce((acc, p) => acc + (p?.evaluations?.[0]?.quantitative || 0), 0);
    const avgScore = projects.length > 0 
      ? (totalQuantitative / projects.length).toFixed(1)
      : '0.0';

    return {
      total: projects.length,
      optimos: projects.filter(p => p.healthFlag === 'Verde').length,
      riesgo: riskCount,
      avgScore
    };
  }, [projects]);

  const recentAlerts = useMemo(() => {
     const allAlerts: { project: string, alert: Alert }[] = [];
     projects.forEach(p => {
        p.alerts?.forEach(a => {
           if (a.status === 'Open') {
              allAlerts.push({ project: p.client, alert: a });
           }
        });
     });
     return allAlerts.sort((a, b) => new Date(b.alert.date).getTime() - new Date(a.alert.date).getTime()).slice(0, 3);
  }, [projects]);

  const getElapsedTime = (startTime: string) => {
    const start = new Date(startTime);
    const diff = now.getTime() - start.getTime();
    if (diff < 0) return 'Por iniciar';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const isOverdue = (endTime?: string) => {
    if (!endTime) return false;
    return new Date(endTime) < now;
  };

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
    <div className="h-full flex items-center justify-center bg-black">
       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rc-teal"></div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden bg-black/40">
      {/* Center Column: Feed */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-white/5">
        {/* Stories / Top Bar */}
        <div className="pt-6 px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-bold text-[var(--text-primary)] tracking-tight uppercase">{t('nav.dashboard')} <span className="text-rc-teal ml-2">V3.5</span></h2>
              <div className="flex items-center gap-4">
                 <button className="text-[var(--rc-slate)] hover:text-rc-teal transition-colors"><Bell size={18} strokeWidth={1.2} /></button>
                 <button className="text-[var(--rc-slate)] hover:text-rc-teal transition-colors"><Search size={18} strokeWidth={1.2} /></button>
              </div>
           </div>
           <StoriesBar projects={projects} />
        </div>

        {/* Scrollable Feed Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div className="max-w-4xl mx-auto space-y-10 pb-20">
              
              {/* VIEW: EXECUTIVE OVERVIEW (As Newsfeed) */}
              {activeTab === 'overview' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  
                  {/* Summary Cards (Condensed for Feed) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title={t('stats.total')} value={stats.total} icon={<Users />} color="rc-teal" trend="+2.4%" />
                    <StatCard title={t('stats.optimal')} value={stats.optimos} icon={<TrendingUp />} color="emerald" trend="+12%" />
                    <StatCard title={t('stats.risk')} value={stats.riesgo} icon={<AlertCircle />} color="rose" trend="-5%" />
                    <StatCard title={t('stats.avgScore')} value={stats.avgScore} icon={<Star />} color="amber" trend="+0.2" />
                  </div>

                  {/* Active Tasks Feed */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[11px] font-bold text-[var(--rc-slate)] uppercase tracking-[0.2em]">Activity Feed</h3>
                       <span className="text-[10px] text-rc-teal font-medium cursor-pointer hover:underline">Ver todas</span>
                    </div>
                    
                    {tasks.filter(t => t.status !== 'Closed').map((task, idx) => (
                      <motion.div 
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-8 rounded-[32px] border-white/5 hover:bg-white/[0.03] transition-all group"
                      >
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-rc-teal/10 flex items-center justify-center text-rc-teal text-[11px] font-bold">
                               {task.assignedTo?.charAt(0)}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-bold text-white">{task.assignedTo}</span>
                                  <span className="text-[11px] text-[var(--rc-slate)]">publicó una actualización</span>
                               </div>
                               <span className="text-[10px] text-[var(--rc-slate)] opacity-50 uppercase tracking-widest">{getElapsedTime(task.startTime)} atrás</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                               task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-rc-teal/10 text-rc-teal'
                            }`}>
                               {task.priority}
                            </span>
                         </div>

                         <h4 className="text-[18px] font-light text-white leading-tight mb-4 group-hover:text-rc-teal transition-colors">
                            {task.title}
                         </h4>
                         
                         {task.description && (
                            <p className="text-[14px] text-[var(--rc-slate)] leading-relaxed mb-6 font-medium">
                               {task.description}
                            </p>
                         )}

                         <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-6">
                               <div className="flex items-center gap-2 text-[var(--rc-slate)] hover:text-rc-teal transition-colors cursor-pointer">
                                  <CheckCircle2 size={16} strokeWidth={1.5} />
                                  <span className="text-[11px] font-bold uppercase tracking-widest">{task.status}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <SlaTimer 
                                 startTime={task.startTime} 
                                 endTime={task.endTime} 
                                 status={task.status} 
                               />
                               <div className="w-px h-8 bg-white/5 mx-2" />
                               <button 
                                 onClick={() => openProjectDetail(projects.find(p => p.id === task.projectId) || projects[0])}
                                 className="flex items-center gap-2 text-[var(--rc-slate)] hover:text-rc-teal transition-colors cursor-pointer"
                               >
                                  <ArrowRight size={16} strokeWidth={1.5} />
                                  <span className="text-[11px] font-bold uppercase tracking-widest">Ver Cliente</span>
                               </button>
                            </div>
                         </div>

                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'clients' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-6">
                       <h1 className="text-3xl font-light tracking-tight">{t('nav.clients')}</h1>
                       <button 
                         onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                         className="bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/20 text-[var(--bg-primary)] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                       >
                          <Plus size={16} strokeWidth={2.5} /> {t('projects.newProject')}
                       </button>
                    </div>

                    <div className="relative mb-10">
                       <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--rc-slate)]" />
                       <input 
                         type="text"
                         placeholder="Buscar clientes..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-sm focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal/50 outline-none transition-all"
                       />
                    </div>

                    <div className="space-y-4">
                       {filteredProjects.map((project) => (
                          <ProjectAccordion 
                            key={project.id}
                            project={project}
                            onOpenDetail={() => openProjectDetail(project)}
                          />
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'status' && (
                 <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                    <AuditDashboard tasks={tasks} />
                    
                    <div className="mt-20">
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Auditoría de Clientes</h3>
                       <div className="glass-card rounded-[40px] overflow-hidden border-white/5">
                          <div className="technical-grid-audit px-10 py-6 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-[var(--rc-slate)] bg-white/[0.02]">
                             <div>Cliente</div>
                             <div className="text-center">Score</div>
                             <div>Resumen</div>
                             <div className="text-right">Salud</div>
                          </div>
                          <div className="divide-y divide-white/5">
                             {projects.map(p => (
                                <div 
                                   key={p.id}
                                   onClick={() => openProjectDetail(p)}
                                   className="technical-grid-audit px-10 py-6 hover:bg-white/[0.03] transition-all cursor-pointer group"
                                >
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                                         {p.logoUrl ? <img src={p.logoUrl} className="w-7 h-7 object-contain" /> : <span className="text-rc-teal font-bold">{p.client.charAt(0)}</span>}
                                      </div>
                                      <span className="font-semibold text-white group-hover:text-rc-teal transition-colors">{p.client}</span>
                                   </div>
                                   <div className="text-center text-2xl font-light text-rc-teal tracking-tighter">{p.evaluations[0]?.quantitative || '-'}</div>
                                   <div className="text-[12px] text-[var(--rc-slate)] italic line-clamp-1 truncate">{p.evaluations[0]?.qualitative || 'Sin registros'}</div>
                                   <div className="text-right">
                                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                         p.healthFlag === 'Verde' ? 'text-emerald-500 bg-emerald-500/10' : 
                                         p.healthFlag === 'Amarilla' ? 'text-amber-500 bg-amber-500/10' : 'text-rose-500 bg-rose-500/10'
                                      }`}>
                                         {p.healthFlag}
                                      </span>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'tasks' && <TaskManager />}

           </div>
        </div>
      </div>

      {/* Right Column: Live Ops */}
      <LiveOpsPanel projects={projects} tasks={tasks} />

      {/* Modals remain global */}
      <ProjectDetailsModal 
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
