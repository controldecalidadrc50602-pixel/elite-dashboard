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

const Dashboard: React.FC<{ activeTab: 'overview' | 'clients' | 'status' | 'tasks' }> = ({ activeTab }) => {
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
    const totalQuantitative = projects.reduce((acc, p) => acc + (p?.evaluations?.[0]?.quantitative || 0), 0);
    return {
      total: projects.length,
      optimos: projects.filter(p => p.healthFlag === 'Verde').length,
      riesgo: riskCount,
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
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Cuentas" value={stats.total} icon={<Users />} color="rc-teal" trend="+2" />
                    <StatCard title="Óptimos" value={stats.optimos} icon={<TrendingUp />} color="emerald" trend="+5%" />
                    <StatCard title="Riesgo" value={stats.riesgo} icon={<AlertCircle />} color="rose" trend="-2" />
                    <StatCard title="Global" value={stats.avgScore + '%'} icon={<Star />} color="amber" trend="+0.5" />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-meta">Activity Stream</h3>
                       <span className="text-[10px] text-rc-teal font-black uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity">Full History</span>
                    </div>
                    
                    {tasks.filter(t => t.status !== 'Closed').slice(0, 5).map((task, idx) => (
                      <motion.div 
                        key={task.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-8 rounded-[40px] group relative"
                      >
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-rc-teal/10 flex items-center justify-center text-rc-teal text-[11px] font-black">
                               {task.assignedTo?.charAt(0)}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center gap-1.5">
                                  <span className="text-[13px] font-bold text-[var(--text-primary)]">{task.assignedTo}</span>
                                  <span className="text-[11px] text-[var(--text-secondary)] font-light">actualizó tarea en</span>
                                  <span className="text-[11px] font-bold text-rc-teal uppercase tracking-widest">{task.projectName}</span>
                               </div>
                               <span className="text-[9px] text-[var(--text-secondary)] font-light uppercase tracking-widest opacity-60">Just now</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-rc-teal/10 text-rc-teal'
                            } animate-neon`}>
                               {task.priority}
                            </div>
                         </div>

                         <h4 className="text-xl font-black text-[var(--text-primary)] leading-tight mb-4 tracking-tighter group-hover:text-rc-teal transition-colors">
                            {task.title}
                         </h4>
                         
                         {task.description && (
                            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-6 font-medium line-clamp-2">
                               {task.description}
                            </p>
                         )}

                         <div className="flex items-center justify-between pt-6 border-t border-[var(--glass-border)]">
                            <div className="flex items-center gap-6">
                               <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                  <CheckCircle2 size={16} strokeWidth={2} />
                                  <span className="text-meta">{task.status}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <SlaTimer startTime={task.startTime} endTime={task.endTime} status={task.status} />
                               <button 
                                 onClick={() => { setSelectedProject(projects.find(p => p.id === task.projectId) || null); setIsSlideoverOpen(true); }}
                                 className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-rc-teal transition-colors premium-button"
                               >
                                  <ArrowRight size={16} />
                                  <span className="text-meta">Detalle</span>
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'clients' && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-2">
                       <div>
                          <h1 className="text-title text-4xl">Client Control</h1>
                          <p className="text-meta mt-1">Directorio Estratégico de Cuentas</p>
                       </div>
                       <button 
                         onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                         className="bg-rc-teal text-black px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rc-teal/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 premium-button"
                       >
                          <Plus size={20} strokeWidth={3} /> {t('projects.newProject')}
                       </button>
                    </div>

                    <div className="relative">
                       <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                       <input 
                         type="text"
                         placeholder="Búsqueda táctica de clientes..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[32px] py-6 pl-16 pr-8 text-sm focus:border-rc-teal/40 outline-none transition-all font-medium"
                       />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {filteredProjects.map((project) => (
                          <motion.div 
                            key={project.id}
                            whileHover={{ y: -5 }}
                            className="glass-card p-8 rounded-[48px] group relative overflow-hidden"
                          >
                             <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-5">
                                   <div className="w-16 h-16 rounded-[28px] bg-black/40 border border-white/10 flex items-center justify-center p-4 shadow-inner relative overflow-hidden">
                                      {project.logoUrl ? (
                                         <img src={project.logoUrl} className="w-full h-full object-contain" />
                                      ) : (
                                         <Activity className="text-rc-teal opacity-20" size={28} />
                                      )}
                                      <div className={`absolute inset-0 bg-current opacity-5 animate-neon ${project.healthFlag === 'Verde' ? 'text-emerald-500' : project.healthFlag === 'Amarilla' ? 'text-amber-500' : 'text-rose-500'}`} />
                                   </div>
                                   <div>
                                      <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight truncate max-w-[200px]">{project.client}</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                         <div className={`w-1.5 h-1.5 rounded-full ${project.healthFlag === 'Verde' ? 'bg-emerald-500' : 'bg-rose-500'} glow-optimal`} />
                                         <span className="text-[9px] font-black text-rc-teal uppercase tracking-widest">Active Partner</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="text-3xl font-black text-[var(--text-primary)] tracking-tighter leading-none">{project.evaluations[0]?.quantitative || '--'}%</div>
                                   <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Efectividad</div>
                                </div>
                             </div>

                             <div className="space-y-6 mb-8">
                                <div className="flex items-center gap-4">
                                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest shrink-0">Servicios:</span>
                                   <div className="flex gap-3 overflow-x-auto custom-scrollbar no-scrollbar py-1">
                                      {project.services.map(s => (
                                         <div key={s.id} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-2xl border border-white/5 transition-all hover:bg-white/10">
                                            {s.name.includes('Bot') ? <Activity size={12} className="text-rc-teal" /> : 
                                             s.name.includes('Yeastar') ? <Phone size={12} className="text-amber-500" /> : <Zap size={12} className="text-rc-teal" />}
                                            <span className="text-[9px] font-black text-white uppercase">{s.name}</span>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                                <p className="text-[13px] text-[var(--text-secondary)] font-medium line-clamp-2 leading-relaxed opacity-70">
                                   {project.evaluations[0]?.qualitative || 'Sin resumen registrado.'}
                                </p>
                             </div>

                             <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                   {[1,2,3].map(i => (
                                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                         {String.fromCharCode(64+i)}
                                      </div>
                                   ))}
                                </div>
                                <button 
                                  onClick={() => { setSelectedProject(project); setIsSlideoverOpen(true); }}
                                  className="px-8 py-3 bg-white/5 hover:bg-rc-teal hover:text-black rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-rc-teal premium-button"
                                >
                                   Ver Ficha
                                </button>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'status' && <AuditDashboard tasks={tasks} />}
              {activeTab === 'tasks' && <TaskManager />}

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
