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
import { exportService } from '../services/exportService';

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

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setSelectedProjectId(e.detail.id);
      setIsSlideoverOpen(true);
    };
    document.addEventListener('open-client-modal', handleOpenModal);
    return () => document.removeEventListener('open-client-modal', handleOpenModal);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return p.adminStatus !== 'Archivado' && matchesSearch;
    });
  }, [projects, searchQuery]);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-[#0B0E14]">
       <div className="flex flex-col items-center gap-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border border-white/5 border-t-rc-teal rounded-full" 
          />
          <span className="text-[10px] font-light text-slate-500 uppercase tracking-[0.5em] animate-pulse">Iniciando Ecosistema</span>
       </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden bg-[#0B0E14] font-light">
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Intelligence Header */}
        <div className="pt-10 px-16 pb-8 border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-3xl z-30">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-light text-white tracking-tight">
                  Elite Dashboard <span className="text-rc-teal font-normal opacity-80">Rc506</span>
                </h2>
                <p className="text-[9px] font-light text-slate-500 uppercase tracking-[0.4em] mt-2 opacity-40">Business Intelligence & Strategic Portfolio</p>
              </div>
              <div className="flex items-center gap-6">
                 <button 
                    onClick={() => exportService.exportGlobalQualityPDF(projects)}
                    className="flex items-center gap-3 px-6 py-3 bg-rc-teal/5 hover:bg-rc-teal/10 border border-rc-teal/20 rounded-full text-rc-teal transition-all group"
                  >
                     <ShieldCheck size={16} strokeWidth={1.5} />
                     <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Inteligencia Global</span>
                  </button>
                 <div className="h-8 w-px bg-white/5" />
                 <button 
                  onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                  className="bg-white text-black px-8 py-3 rounded-full text-[11px] font-medium uppercase tracking-[0.1em] transition-all hover:bg-slate-200 active:scale-95 shadow-xl flex items-center gap-2"
                 >
                    <Plus size={16} /> Nuevo Expediente
                 </button>
              </div>
           </div>
           
           <StoriesBar projects={projects} selectedProjectId={selectedProjectId} onSelectProject={(id) => { setSelectedProjectId(id); setIsSlideoverOpen(true); }} />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-16 pt-12 pb-24">
           <div className="max-w-7xl mx-auto">
              
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                   <AuditDashboard 
                    projects={projects} 
                    isSingleProject={false} 
                    selectedProjectId={selectedProjectId}
                    onSelectProject={(id) => setSelectedProjectId(id)}
                   />
                </div>
              )}

              {activeTab === 'clients' && (
                 <div className="space-y-16 animate-in fade-in duration-700">
                    <div className="flex items-end justify-between">
                       <div>
                          <h1 className="text-6xl font-light text-white tracking-tighter">Expedientes</h1>
                          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] mt-4">Gestión de Cartera de Alto Nivel</p>
                       </div>
                       <div className="relative w-80">
                          <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input 
                            type="text"
                            placeholder="Buscar en la bóveda..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-white/5 py-3 pl-8 pr-4 text-sm font-light text-white focus:border-rc-teal focus:ring-0 outline-none transition-all placeholder:text-slate-800"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-10">
                       {filteredProjects.map((project) => (
                          <motion.div 
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            onClick={() => { setSelectedProjectId(project.id); setIsSlideoverOpen(true); }}
                            className="cursor-pointer group flex flex-col items-center gap-6"
                          >
                             <div className={`w-full aspect-square rounded-[48px] bg-white/[0.01] border border-white/5 flex items-center justify-center p-10 transition-all duration-700 relative overflow-hidden group-hover:border-rc-teal/30 ${
                                project.healthFlag === 'Verde' ? 'group-hover:shadow-[0_20px_50px_rgba(16,185,129,0.05)]' : 
                                project.healthFlag === 'Amarilla' ? 'group-hover:shadow-[0_20px_50px_rgba(245,158,11,0.05)]' : 
                                'group-hover:shadow-[0_20px_50px_rgba(244,63,94,0.05)]'
                             }`}>
                                {project.logoUrl ? (
                                   <img src={project.logoUrl} className="w-full h-full object-contain filter grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" alt={project.client} />
                                ) : (
                                   <Users className="text-white opacity-10 group-hover:opacity-40 transition-opacity" size={32} />
                                )}
                                
                                <div className={`absolute top-6 right-6 w-1.5 h-1.5 rounded-full ${
                                   project.healthFlag === 'Verde' ? 'bg-emerald-400' : 
                                   project.healthFlag === 'Amarilla' ? 'bg-amber-400' : 
                                   'bg-rose-500'
                                } shadow-[0_0_10px_currentColor]`} />
                             </div>
                             <span className="text-[10px] font-light text-slate-500 uppercase tracking-[0.25em] text-center group-hover:text-white transition-colors duration-500">
                                {project.client}
                             </span>
                          </motion.div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'status' && (
                <div className="animate-in fade-in duration-700 flex flex-col items-center justify-center h-[50vh] text-center">
                   <div className="w-20 h-20 bg-white/[0.01] border border-white/5 rounded-[40px] flex items-center justify-center mb-10 text-rc-teal shadow-2xl">
                      <TrendingUp size={32} strokeWidth={1} />
                   </div>
                   <h1 className="text-5xl font-light text-white tracking-tighter mb-6">Cierre Trimestral</h1>
                   <p className="text-slate-500 text-[10px] font-light uppercase tracking-[0.5em] max-w-md leading-relaxed opacity-40">Motor de Evaluación HC Rc506 V4.0<br/>Analítica de los 10 Pilares Estratégicos</p>
                </div>
              )}

              {activeTab === 'archive' && (
                <div className="animate-in fade-in duration-700">
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
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 bg-[#0D1117] border border-white/5 rounded-full flex items-center gap-6 shadow-2xl shadow-black/80"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-rc-teal/10 text-rc-teal' : 'bg-blue-500/10 text-blue-400'}`}>
               <Activity size={16} strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-light text-white uppercase tracking-[0.2em]">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
