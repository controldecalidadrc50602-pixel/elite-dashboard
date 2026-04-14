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
import ProjectDetailsSlideover from '../components/ProjectDetailsSlideover';
import ProjectModal from '../components/Modals/ProjectModal';
import StatCard from '../components/common/StatCard';
import { motion, AnimatePresence } from 'framer-motion';
import { isFirebaseConfigured } from '../lib/firebase';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { initialProjects } from '../lib/mockData';

import { 
  Project, 
  ClientService, 
  Evaluation, 
  Alert 
} from '../types/project';

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
    const riskCount = projects.filter(p => p?.evaluations?.[0]?.status === 'At Risk' || p?.evaluations?.[0]?.status === 'Critical').length;
    const totalQuantitative = projects.reduce((acc, p) => acc + (p?.evaluations?.[0]?.quantitative || 0), 0);
    const avgScore = projects.length > 0 
      ? (totalQuantitative / projects.length).toFixed(1)
      : '0.0';

    return {
      total: projects.length,
      optimos: projects.filter(p => p?.status === 'Óptimo').length,
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

     if (projects.length > 0) {
        projects.forEach(p => {
           p.evaluations?.forEach(ev => {
              const idx = (ev.month || 0) % 6; 
              months[idx].val += ev.quantitative || 0;
              months[idx].count += 1;
           });
        });
     }

     const points = months.map((m, i) => {
        const avg = m.count > 0 ? m.val / m.count : 3; 
        const x = (i / 5) * 400;
        const y = 120 - (avg * 20); 
        return `${x},${y}`;
     });

     return {
        path: `M${points.join(' L')}`,
        points: months,
        lastY: points[points.length - 1]?.split(',')[1] || 60
     };
  }, [projects, t]);

  const urgencyStats = useMemo(() => {
     const total = projects.length || 1;
     const optimized = projects.filter(p => p?.evaluations?.[0]?.status === 'Stable' || p?.evaluations?.[0]?.status === 'Growth').length;
     const attention = projects.filter(p => p?.evaluations?.[0]?.status === 'At Risk').length;
     const critical = projects.filter(p => p?.evaluations?.[0]?.status === 'Critical').length;

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
    <div className="h-96 flex items-center justify-center">
       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rc-teal"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {!isFirebaseConfigured && (
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

    <div className="space-y-10 pb-12">
      {/* VIEW: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-rc-teal/10 rounded-[2rem] flex items-center justify-center text-rc-teal shadow-inner border border-rc-teal/10 group">
                   <BarChart3 size={32} className="group-hover:scale-110 transition-transform" />
                </div>
                <div>
                   <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)] leading-none italic uppercase">{t('nav.dashboard')}</h1>
                   <p className="text-[var(--text-secondary)] font-black text-[10px] uppercase tracking-[0.4em] mt-2 opacity-60">{t('stats.trends')}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizado</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title={t('stats.total')} value={stats.total} icon={<Users />} color="rc-teal" trend="+2.4%" />
            <StatCard title={t('stats.optimal')} value={stats.optimos} icon={<TrendingUp />} color="emerald" trend="+12%" />
            <StatCard title={t('stats.risk')} value={stats.riesgo} icon={<AlertCircle />} color="rose" trend="-5%" />
            <StatCard title={t('stats.avgScore')} value={stats.avgScore} icon={<Star />} color="amber" trend="+0.2" />
          </div>

          {/* Executive Charts Row - Premium Glassmorphism */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="glass-card p-10 rounded-[48px] min-h-[360px] flex flex-col border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rc-teal/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                
                <div className="flex items-center justify-between mb-12 relative z-10">
                   <div className="flex flex-col">
                      <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.3em]">{t('dashboard.audit_pulse')}</h3>
                      <span className="text-[9px] font-bold text-rc-teal uppercase tracking-widest opacity-60">Consultoría Estratégica</span>
                   </div>
                   <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2"><div className="w-2 h-2 bg-rc-teal rounded-full shadow-[0_0_10px_rgba(59,199,170,0.5)]"></div> {t('dashboard.target')}</span>
                      <span className="flex items-center gap-2 text-[var(--text-secondary)]"><div className="w-2 h-2 bg-slate-600 rounded-full"></div> {t('dashboard.actual')}</span>
                   </div>
                </div>
                
                <div className="flex-1 w-full mt-auto relative z-10">
                   <svg viewBox="0 0 400 120" className="w-full h-40 overflow-visible">
                      <defs>
                         <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3BC7AA" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3BC7AA" stopOpacity="1" />
                         </linearGradient>
                      </defs>
                      <path d="M0,80 Q50,75 100,50 T200,60 T300,30 T400,45" fill="none" stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        d={chartData.path}
                        fill="none" 
                        stroke="url(#lineGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                      />
                      <motion.circle 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.5 }}
                        cx="400" cy={chartData.lastY} r="6" fill="#3BC7AA" className="shadow-xl" 
                      />
                      <circle cx="400" cy={chartData.lastY} r="12" fill="#3BC7AA" opacity="0.1" className="animate-ping" />
                   </svg>
                   <div className="flex justify-between mt-8 text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em]">
                      {chartData.points.map((m, i) => <span key={i} className="hover:text-rc-teal transition-colors cursor-default">{m.name}</span>)}
                   </div>
                </div>
             </div>

             <div className="glass-card p-10 rounded-[48px] min-h-[360px] flex flex-col border border-white/5 relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] -ml-32 -mb-32 rounded-full" />
                
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.3em] mb-12 relative z-10">{t('dashboard.urgency_matrix')}</h3>
                
                <div className="flex-1 flex items-center justify-around gap-12 relative z-10">
                   <div className="relative w-40 h-40 group-hover:scale-105 transition-transform duration-500">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/5" />
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${urgencyStats.optimized} ${100 - urgencyStats.optimized}`} className="text-emerald-500 transition-all duration-1000" />
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${urgencyStats.attention} ${100 - urgencyStats.attention}`} strokeDashoffset={-urgencyStats.optimized} className="text-amber-500 transition-all duration-1000" />
                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${urgencyStats.critical} ${100 - urgencyStats.critical}`} strokeDashoffset={-(urgencyStats.optimized + urgencyStats.attention)} className="text-rose-500 transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">{stats.total}</span>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('dashboard.total_cl')}</span>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 group/item">
                         <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover/item:scale-125 transition-transform" />
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('dashboard.optimized')}</span>
                            <span className="text-lg font-black text-[var(--text-primary)] leading-none">{urgencyStats.optimized}%</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 group/item">
                         <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] group-hover/item:scale-125 transition-transform" />
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('dashboard.attention')}</span>
                            <span className="text-lg font-black text-[var(--text-primary)] leading-none">{urgencyStats.attention}%</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 group/item">
                         <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)] group-hover/item:scale-125 transition-transform" />
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('dashboard.critical')}</span>
                            <span className="text-lg font-black text-[var(--text-primary)] leading-none">{urgencyStats.critical}%</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Elite Task Center - NEW SECTION */}
          <div className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden">
             <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal border border-rc-teal/20 shadow-inner">
                      <Clock size={24} className="animate-pulse" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-[0.3em]">Centro de Operaciones</h3>
                      <p className="text-[10px] font-bold text-rc-teal/60 uppercase tracking-widest leading-none mt-1">Tareas Activas y Responsables</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tasks.filter(t => t.status !== 'Closed').length} Tareas Pendientes</div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {tasks.filter(t => t.status !== 'Closed').slice(0, 4).map((task, idx) => (
                   <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-900/40 border border-white/5 p-6 rounded-[32px] hover:bg-slate-900/60 transition-all group"
                   >
                      <div className="flex items-center justify-between mb-4">
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                            task.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                            task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                         }`}>
                            {task.priority}
                         </span>
                         <div className={`w-2 h-2 rounded-full ${isOverdue(task.endTime) ? 'bg-rose-500 animate-ping' : 'bg-rc-teal'}`} />
                      </div>
                      
                      <h4 className="text-sm font-black text-white/90 uppercase tracking-tight line-clamp-2 mb-4 group-hover:text-rc-teal transition-colors">
                         {task.title}
                      </h4>

                      <div className="space-y-4 mt-auto">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rc-teal/10 border border-rc-teal/20 flex items-center justify-center text-rc-teal text-[10px] font-black">
                               {task.assignedTo?.split(' ').map(n => n[0]).join('') || '?'}
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-none">Responsable</span>
                               <span className="text-[11px] font-black text-slate-800 dark:text-slate-100 leading-tight">{task.assignedTo}</span>
                            </div>
                         </div>

                         <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Tiempo</span>
                               <span className="text-[11px] font-black text-rc-teal tabular-nums">{getElapsedTime(task.startTime)}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                               task.status === 'In Progress' ? 'bg-rc-teal/10 text-rc-teal' : 'bg-white/5 text-slate-400'
                            }`}>
                               {task.status}
                            </div>
                         </div>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>

          {/* Quick Alerts Feed - Redesigned */}
          <div className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
             
             <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-inner">
                      <ShieldAlert size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-[0.3em]">{t('projects.recent_alerts')}</h3>
                      <p className="text-[10px] font-bold text-rose-500/60 uppercase tracking-widest leading-none mt-1">Monitoreo de Infraestructura</p>
                   </div>
                </div>
                {recentAlerts.length > 0 && (
                   <motion.div 
                     animate={{ opacity: [0.4, 1, 0.4] }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 rounded-2xl border border-rose-500/20"
                   >
                      <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)]"></div>
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{recentAlerts.length} Eventos Críticos</span>
                   </motion.div>
                )}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {recentAlerts.map(({ project, alert }, idx) => (
                   <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-slate-900/40 border border-white/5 p-6 rounded-[32px] relative overflow-hidden flex flex-col min-h-[180px] shadow-lg hover:shadow-rose-500/5 transition-all"
                   >
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em]">{project}</span>
                         <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(alert.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-bold text-white/90 leading-relaxed mb-6 flex-1">
                         {alert.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                            alert.severity === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                         }`}>
                            {t(`projects.severity_${alert.severity.toLowerCase()}`)}
                         </span>
                         <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <ArrowRight size={16} />
                         </button>
                      </div>
                   </motion.div>
                ))}
                {recentAlerts.length === 0 && (
                   <div className="col-span-3 py-12 text-center">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-[0.6em] opacity-40">{t('dashboard.no_records')}</p>
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
                <div className="relative">
                   <button 
                     onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                     className="bg-slate-900 border border-white/10 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                   >
                      <Download size={16} /> Exportar <ChevronDown size={14} className={`transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                   </button>
                   
                   <AnimatePresence>
                      {isExportMenuOpen && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] overflow-hidden"
                         >
                            <button 
                               onClick={() => { exportService.exportToPDF(projects, tasks, t); setIsExportMenuOpen(false); }}
                               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest text-slate-300 text-left"
                            >
                               <FileText size={16} className="text-rose-400" /> PDF Ejecutivo
                            </button>
                            <button 
                               onClick={() => { exportService.exportToExcel(projects, tasks); setIsExportMenuOpen(false); }}
                               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest text-slate-300 text-left"
                            >
                               <FileSpreadsheet size={16} className="text-emerald-400" /> Excel (XLSX)
                            </button>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                <button 
                  onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                  className="bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/20 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0"
                >
                   <Plus size={16} /> {t('projects.newProject')}
                </button>
             </div>
          </div>

          {/* TACTICAL TABLE HEADER - ZOHO ELITE STYLE */}
          <div className="technical-grid px-6 py-4 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40 border-b border-white/10 bg-black/5 dark:bg-white/5">
             <div className="w-1.5 h-1.5" />
             <div>Cliente</div>
             <div className="hidden md:block">Proyecto ID</div>
             <div className="hidden sm:block">Operaciones</div>
             <div className="text-right pr-4">Estado</div>
             <div className="text-right">Detalle</div>
          </div>

          <motion.div 
            layout
            className="flex flex-col"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  layout
                >
                  <ProjectAccordion 
                    project={project} 
                    onOpenDetail={() => openProjectDetail(project)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {projects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-6 glass-card rounded-[40px] border-dashed border-2 border-rc-teal/20"
            >
              <div className="w-20 h-20 bg-rc-teal/10 rounded-full flex items-center justify-center text-rc-teal animate-bounce">
                <Plus size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tighter uppercase">{t('dashboard.welcome_ready')}</h3>
                <p className="text-[var(--text-secondary)] font-medium text-sm max-w-xs mx-auto">
                  {t('dashboard.first_client_desc')}
                </p>
              </div>
              <button 
                onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                className="bg-rc-teal text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rc-teal/30 hover:scale-110 transition-all flex items-center gap-3"
              >
                <Plus size={18} /> {t('projects.newProject')}
              </button>
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40">
              <Search size={48} className="text-rc-teal" />
              <p className="font-bold text-sm tracking-widest uppercase">{t('dashboard.no_results')}</p>
            </div>
          ) : null}
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
                 {/* HEADER GRID */}
                 <div className="technical-grid-audit px-8 py-4 border-b border-[var(--glass-border)] text-[var(--text-secondary)] text-[8px] font-black uppercase tracking-[0.4em] bg-black/5 dark:bg-white/5">
                    <div>{t('dashboard.table_client')}</div>
                    <div className="text-center">{t('dashboard.table_health')}</div>
                    <div>{t('dashboard.table_history')}</div>
                    <div className="text-right">{t('dashboard.table_status')}</div>
                 </div>

                 {/* BODY GRID */}
                 <div className="flex flex-col divide-y divide-[var(--glass-border)]">
                    {projects.map(p => (
                       <div 
                          key={p.id} 
                          onClick={() => openProjectDetail(p)}
                          className="technical-grid-audit px-8 py-5 group hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer elite-accent-line"
                       >
                          {/* CLIENT */}
                          <div>
                             <div className="font-black text-[var(--text-primary)] text-[11px] tracking-widest uppercase">{p.client}</div>
                             <div className="text-[9px] font-bold text-rc-teal mt-0.5 opacity-60">ID: {p.id}</div>
                          </div>

                          {/* HEALTH - PERFECT SYMMETRY */}
                          <div className="text-center">
                             <div className="text-2xl font-black text-rc-teal tracking-tighter tabular-nums">{p.evaluations[0]?.quantitative || '-'}</div>
                          </div>

                          {/* HISTORY */}
                          <div className="max-w-md">
                             <p className="text-[11px] text-[var(--text-secondary)] font-medium italic line-clamp-1 pr-4">
                                "{p.evaluations[0]?.qualitative || t('dashboard.no_records')}"
                             </p>
                          </div>

                          {/* STATUS */}
                          <div className="text-right">
                             <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                p.evaluations[0]?.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                p.evaluations[0]?.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                p.evaluations[0]?.status === 'Growth' ? 'bg-rc-teal/10 text-rc-teal border-rc-teal/10' :
                                'bg-rose-500/10 text-rose-500 border-rose-500/20'
                             }`}>
                                {t(`status.${(p.evaluations[0]?.status || 'stable').toLowerCase().replace(' ', '')}`)}
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
    </div>
  );
};

export default Dashboard;
