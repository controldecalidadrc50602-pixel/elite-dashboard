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
  ShieldAlert
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
  date?: string; // Fecha exacta de la evaluación
  month: number;
  year: number;
  quantitative: number;
  qualitative: string;
  status: 'Stable' | 'At Risk' | 'Critical' | 'Growth';
}

export interface Alert {
  id: string;
  date: string;
  type: 'Technical' | 'Operational' | 'Strategic';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  status: 'Open' | 'Resolved';
}

export interface Project {
  id: string;
  client: string;
  startDate: string;
  services: ClientService[];
  evaluations: Evaluation[];
  alerts?: Alert[]; // Incidencias o situaciones críticas
  status: 'Óptimo' | 'Aceptable' | 'Mejorable' | 'Deficiente';
}

interface DashboardProps {
  activeTab: 'overview' | 'clients' | 'status' | 'tasks';
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

  // Dynamic Chart Calculations
  const chartData = useMemo(() => {
     const months = [
        { name: t('months.oct'), val: 0, count: 0 },
        { name: t('months.nov'), val: 0, count: 0 },
        { name: t('months.dec'), val: 0, count: 0 },
        { name: t('months.jan'), val: 0, count: 0 },
        { name: t('months.feb'), val: 0, count: 0 },
        { name: t('months.mar'), val: 0, count: 0 },
     ];

     // Simple mapping logic for demonstration (assuming evaluations are recent)
     projects.forEach(p => {
        p.evaluations.forEach(ev => {
           // Mapping evaluations to dummy months based on index for chart visual
           const idx = ev.month % 6; 
           months[idx].val += ev.quantitative;
           months[idx].count += 1;
        });
     });

     const points = months.map((m, i) => {
        const avg = m.count > 0 ? m.val / m.count : 3; // default base line
        const x = (i / 5) * 400;
        const y = 120 - (avg * 20); // Scale 0-5 to 0-120
        return `${x},${y}`;
     });

     return {
        path: `M${points.join(' L')}`,
        points: months
     };
  }, [projects, t]);

  const urgencyStats = useMemo(() => {
     const total = projects.length || 1;
     const optimized = projects.filter(p => p.evaluations[0]?.status === 'Stable' || p.evaluations[0]?.status === 'Growth').length;
     const attention = projects.filter(p => p.evaluations[0]?.status === 'At Risk').length;
     const critical = projects.filter(p => p.evaluations[0]?.status === 'Critical').length;

     return {
        optimized: Math.round((optimized / total) * 100),
        attention: Math.round((attention / total) * 100),
        critical: Math.round((critical / total) * 100),
        optimizedCount: optimized,
        attentionCount: attention,
        criticalCount: critical
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
      {/* Demo Banner */}
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
                  <h4 className="text-amber-500 font-bold text-xs tracking-tight">{t('stats.offline_mode')}</h4>
                  <p className="text-amber-500/60 text-[10px] font-medium leading-none">{t('stats.offline_desc')}</p>
               </div>
            </div>
            <div className="text-[9px] font-black text-amber-500/40 uppercase tracking-widest border border-amber-500/10 px-2 py-1 rounded-lg">{t('stats.demo_mode')}</div>
         </motion.div>
      )}

      {/* VIEW: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                <BarChart3 size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] leading-tight">{t('nav.dashboard')}</h1>
                <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-widest">{t('stats.trends')}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title={t('stats.total')} value={stats.total} icon={<Users />} color="rc-teal" trend="+2.4%" />
            <StatCard title={t('stats.optimal')} value={stats.optimos} icon={<TrendingUp />} color="emerald" trend="+12%" />
            <StatCard title={t('stats.risk')} value={stats.riesgo} icon={<AlertCircle />} color="rose" trend="-5%" />
            <StatCard title={t('stats.avgScore')} value={stats.avgScore} icon={<Star />} color="amber" trend="+0.2" />
          </div>

          {/* Executive Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="glass-card p-8 rounded-[32px] min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">{t('dashboard.audit_pulse')}</h3>
                   <div className="flex gap-2 text-[8px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-rc-teal rounded-full"></div> {t('dashboard.target')}</span>
                      <span className="flex items-center gap-1 text-[var(--text-secondary)]"><div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full"></div> {t('dashboard.actual')}</span>
                   </div>
                </div>
                
                <div className="flex-1 w-full mt-auto">
                   <svg viewBox="0 0 400 120" className="w-full h-32 overflow-visible">
                      <path d="M0,80 Q50,75 100,50 T200,60 T300,30 T400,45" fill="none" stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={chartData.path}
                        fill="none" 
                        stroke="#3BC7AA" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                      />
                      <circle cx="400" cy={chartData.path.split(' ').pop()?.split(',')[1] || 25} r="4" fill="#3BC7AA" className="animate-pulse" />
                   </svg>
                   <div className="flex justify-between mt-4 text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                      {chartData.points.map((m, i) => <span key={i}>{m.name}</span>)}
                   </div>
                </div>
             </div>

             <div className="glass-card p-8 rounded-[32px] min-h-[300px] flex flex-col">
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-8">{t('dashboard.urgency_matrix')}</h3>
                <div className="flex-1 flex items-center justify-center gap-12">
                   <div className="relative w-32 h-32">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500/20" />
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${urgencyStats.optimized} ${100 - urgencyStats.optimized}`} className="text-emerald-500" />
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${urgencyStats.attention} ${100 - urgencyStats.attention}`} strokeDashoffset={-urgencyStats.optimized} className="text-amber-500" />
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${urgencyStats.critical} ${100 - urgencyStats.critical}`} strokeDashoffset={-(urgencyStats.optimized + urgencyStats.attention)} className="text-rose-500" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-black text-[var(--text-primary)]">{stats.total}</span>
                         <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">{t('dashboard.total_cl')}</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded hover:scale-125 transition-transform bg-emerald-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t('dashboard.optimized')} <span className="text-[var(--text-primary)] ml-1">{urgencyStats.optimized}%</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded hover:scale-125 transition-transform bg-amber-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t('dashboard.attention')} <span className="text-[var(--text-primary)] ml-1">{urgencyStats.attention}%</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded hover:scale-125 transition-transform bg-rose-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t('dashboard.critical')} <span className="text-[var(--text-primary)] ml-1">{urgencyStats.critical}%</span></span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Quick Alerts Feed */}
          <div className="glass-card p-8 rounded-[32px] border border-[var(--glass-border)]">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                      <ShieldAlert size={20} />
                   </div>
                   <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">{t('projects.recent_alerts')}</h3>
                </div>
                {recentAlerts.length > 0 && (
                   <div className="flex items-center gap-1 text-rose-500 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                      <span className="text-[8px] font-black uppercase tracking-widest">{recentAlerts.length} Active</span>
                   </div>
                )}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentAlerts.map(({ project, alert }, idx) => (
                   <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-4 rounded-2xl relative overflow-hidden flex flex-col"
                   >
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[8px] font-black text-rc-teal uppercase tracking-widest">{project}</span>
                         <span className="text-[8px] font-bold text-[var(--text-secondary)]">{new Date(alert.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tight line-clamp-2 mb-3">
                         {alert.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                         <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${
                            alert.severity === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                         }`}>
                            {t(`projects.severity_${alert.severity.toLowerCase()}`)}
                         </span>
                         <button className="text-[var(--text-secondary)] hover:text-rc-teal transition-all">
                            <ArrowRight size={14} />
                         </button>
                      </div>
                   </motion.div>
                ))}
                {recentAlerts.length === 0 && (
                   <div className="col-span-3 py-4 text-center">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-50">{t('dashboard.no_records')}</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* VIEW: CLIENT MANAGEMENT (OPERATIONAL) */}
      {activeTab === 'clients' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                   <Users size={24} />
                </div>
                <div>
                   <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] leading-tight">{t('nav.clients')}</h1>
                   <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-widest">{filteredProjects.length} {t('dashboard.active_clients')}</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <div className="relative group">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-rc-teal transition-colors" />
                   <input 
                      type="text"
                      placeholder={t('dashboard.search_placeholder')}
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
              <p className="font-bold text-sm tracking-widest uppercase">{t('dashboard.no_clients')}</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW: AUDIT VIEW (TABLE) */}
      {activeTab === 'status' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-6 md:p-8 rounded-[32px] border border-[var(--glass-border)]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal">
                      <Star size={20} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tighter">{t('projects.individualTitle')}</h3>
                       <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{t('dashboard.audit_execution')}</p>
                    </div>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-[var(--glass-border)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">
                          <th className="pb-4">{t('dashboard.table_client')}</th>
                          <th className="pb-4 text-center">{t('dashboard.table_health')}</th>
                          <th className="pb-4">{t('dashboard.table_history')}</th>
                          <th className="pb-4 text-right">{t('dashboard.table_status')}</th>
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
                                <div className="text-[10px] font-bold text-[var(--text-secondary)] mt-0.5">{p.services.length} {t('projects.activeServices')}</div>
                             </td>
                             <td className="py-5 text-center">
                                <span className="text-xl font-black text-rc-teal tracking-tighter">{p.evaluations[0]?.quantitative || '-'}</span>
                             </td>
                             <td className="py-5 max-w-sm">
                                <p className="text-[11px] text-[var(--text-secondary)] font-medium italic line-clamp-1 pr-4">
                                   "{p.evaluations[0]?.qualitative || t('dashboard.no_records')}"
                                </p>
                             </td>
                             <td className="py-5 text-right">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                   p.evaluations[0]?.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                   p.evaluations[0]?.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                   p.evaluations[0]?.status === 'Growth' ? 'bg-rc-teal/10 text-rc-teal border-rc-teal/10' :
                                   'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                }`}>
                                   {t(`status.${(p.evaluations[0]?.status || 'stable').toLowerCase().replace(' ', '')}`)}
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
