import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Plus,
  Search,
  Bell,
  Activity,
  Zap,
  TrendingUp,
  LayoutGrid,
  Users,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../services/projectService';
import ArchiveVault from './ArchiveVault';
import { Project } from '../types/project';
import StoriesBar from '../components/Dashboard/StoriesBar';
import AuditDashboard from '../components/Dashboard/AuditDashboard';
import StatCard from '../components/common/StatCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import ProjectModal from '../components/Modals/ProjectModal';

const Dashboard: React.FC<{ activeTab: 'overview' | 'clients' | 'status' | 'archive' }> = ({ activeTab }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return p.adminStatus !== 'Archivado' && matchesSearch;
    });
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
    <div className="flex h-full overflow-hidden bg-[#0B0E14]">
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Intelligence Header */}
        <div className="pt-8 px-12 pb-6 border-b border-white/5 bg-black/20 backdrop-blur-xl">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[14px] font-black text-white tracking-[0.2em] uppercase">
                  App HC <span className="text-rc-teal">Rc506</span>
                </h2>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 opacity-50 italic">Inteligencia de Negocios & Gestión de Cartera</p>
              </div>
              <div className="flex items-center gap-4">
                 <button className="text-slate-500 hover:text-rc-teal transition-all p-3 rounded-2xl glass-card"><Bell size={20} strokeWidth={1.5} /></button>
                 <div className="h-8 w-px bg-white/5 mx-2" />
                 <button 
                  onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                  className="bg-rc-teal/10 hover:bg-rc-teal text-rc-teal hover:text-black border border-rc-teal/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 premium-button"
                 >
                    <Plus size={16} strokeWidth={3} /> Nuevo Expediente
                 </button>
              </div>
           </div>
           
           <StoriesBar projects={projects} selectedProjectId={selectedProjectId} onSelectProject={(id) => { setSelectedProjectId(id); setIsSlideoverOpen(true); }} />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-12 pt-10 pb-20">
           <div className="max-w-7xl mx-auto">
              
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                   <AuditDashboard projects={projects} isSingleProject={false} />
                </div>
              )}

              {activeTab === 'clients' && (
                 <div className="space-y-12 animate-in fade-in duration-1000 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                       <div>
                          <h1 className="text-title text-5xl tracking-tighter">Expedientes de Clientes</h1>
                          <p className="text-meta mt-2 text-rc-teal">Gestión de Cartera Estratégica</p>
                       </div>
                       <div className="relative w-96">
                          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="text"
                            placeholder="Buscar en la bóveda..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-sm focus:border-rc-teal/30 outline-none transition-all font-medium backdrop-blur-xl"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8 pb-10">
                       {filteredProjects.map((project) => (
                          <motion.div 
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, y: -8 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setSelectedProjectId(project.id); setIsSlideoverOpen(true); }}
                            className="cursor-pointer group flex flex-col items-center gap-5"
                          >
                             <div className={`w-full aspect-square rounded-[40px] bg-[#161B22] backdrop-blur-3xl border border-white/5 flex items-center justify-center p-8 shadow-2xl transition-all duration-700 relative overflow-hidden group-hover:border-rc-teal/40 ${
                                project.healthFlag === 'Verde' ? 'shadow-emerald-500/0 hover:shadow-emerald-500/10' : 
                                project.healthFlag === 'Amarilla' ? 'shadow-amber-500/0 hover:shadow-amber-500/10' : 
                                'shadow-rose-500/0 hover:shadow-rose-500/10'
                             }`}>
                                {project.logoUrl ? (
                                   <img src={project.logoUrl} className="w-full h-full object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100" alt={project.client} />
                                ) : (
                                   <Users className="text-rc-teal opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
                                )}
                                
                                <div className={`absolute top-5 right-5 w-2.5 h-2.5 rounded-full ${
                                   project.healthFlag === 'Verde' ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 
                                   project.healthFlag === 'Amarilla' ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 
                                   'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                                }`} />
                             </div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center group-hover:text-white transition-colors duration-500">
                                {project.client}
                             </span>
                          </motion.div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'status' && (
                <div className="animate-in fade-in duration-1000 flex flex-col items-center justify-center h-[60vh] text-center">
                   <div className="w-24 h-24 bg-rc-teal/5 rounded-[40px] flex items-center justify-center mb-8 text-rc-teal border border-rc-teal/10 shadow-2xl shadow-rc-teal/5">
                      <TrendingUp size={48} strokeWidth={1.5} />
                   </div>
                   <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">Cierre Trimestral</h1>
                   <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] max-w-md leading-relaxed opacity-60">Motor de Evaluación HC Rc506 V4.0<br/>Analítica de los 10 Pilares Estratégicos</p>
                </div>
              )}

              {activeTab === 'archive' && (
                <div className="animate-in fade-in duration-1000">
                   <ArchiveVault projects={projects} setProjects={setProjects} />
                </div>
              )}

           </div>
        </div>
      </div>

      <ProjectDetailsModal 
         project={projects.find(p => p.id === selectedProjectId) || null}
         isOpen={isSlideoverOpen}
         onClose={() => setIsSlideoverOpen(false)}
         onUpdate={async (p) => setProjects(await projectService.updateProject(p, projects))}
         onArchive={async (p) => {
            const archived = { ...p, adminStatus: 'Archivado' as any };
            setProjects(await projectService.updateProject(archived, projects));
            setIsSlideoverOpen(false);
         }}
         onEditRequest={(p) => { setEditingProject(p); setIsProjectModalOpen(true); setIsSlideoverOpen(false); }}
         onDelete={async (id) => { if(confirm('¿Eliminar permanentemente?')) setProjects(await projectService.deleteProject(id, projects)); setIsSlideoverOpen(false); }}
      />

      <ProjectModal 
         isOpen={isProjectModalOpen}
         onClose={() => setIsProjectModalOpen(false)}
         onSave={async (p) => setProjects(editingProject ? await projectService.updateProject(p, projects) : await projectService.addProject(p, projects))}
         project={editingProject}
      />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 bg-black/90 backdrop-blur-3xl border border-white/5 rounded-[40px] flex items-center gap-6 shadow-2xl"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-rc-teal/10 text-rc-teal' : 'bg-blue-500/10 text-blue-400'}`}>
               <Activity size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
