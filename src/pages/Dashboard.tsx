import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useDemoMode } from '../context/DemoModeContext';
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
import SkeletonDashboard from '../components/SkeletonDashboard';
import { EliteClientCard } from '../components/Dashboard/EliteClientCard';
import { exportService } from '../services/exportService';
import ImageWithFallback from '../components/common/ImageWithFallback';
import CRMDataGrid from '../components/Dashboard/CRMDataGrid';
import { List, Grid as GridIcon } from 'lucide-react';

const Dashboard: React.FC<{ activeTab: 'overview' | 'clients' | 'status' | 'archive' }> = ({ activeTab }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { demoMode } = useDemoMode();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');

  useEffect(() => {
    const unsubscribe = projectService.subscribeToProjects((projectsData) => {
      setProjects(projectsData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setSelectedProjectId(e.detail.id);
      setIsSlideoverOpen(true);
    };
    document.addEventListener('open-client-modal', handleOpenModal);
    return () => document.removeEventListener('open-client-modal', handleOpenModal);
  }, []);

  const activeProjects = useMemo(() => {
    return projects.filter(p => p.adminStatus !== 'Archivado' && p.adminStatus !== 'Inactivo');
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return activeProjects.filter(p => {
      const matchesSearch = p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (p.services && p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesSearch;
    });
  }, [activeProjects, searchQuery]);

  if (loading) return (
    <div className="flex-1 overflow-y-auto px-16 pt-12 pb-24 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <SkeletonDashboard />
      </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden bg-[var(--bg-primary)] font-light">
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Intelligence Header */}
        <div className="pt-10 px-16 pb-8 bg-white z-30 sticky top-0 border-b border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  Status Operativo Elite <span className="text-blue-500 font-normal">Rc506</span>
                </h2>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-2">Monitoreo Histórico y Capacidad de Servicios</p>
              </div>
              <div className="flex items-center gap-6">
                 <button 
                     onClick={() => exportService.exportGlobalQualityPDF(activeProjects)}
                    className="flex items-center gap-3 px-6 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-full text-blue-600 transition-all group cursor-pointer"
                  >
                     <ShieldCheck size={16} strokeWidth={2} />
                     <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">Inteligencia Global</span>
                  </button>
                 <div className="h-8 w-px bg-slate-200" />
                  {isAdmin && (
                    <button 
                     onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                     className="bg-blue-600 text-white px-8 py-3 rounded-full text-[11px] font-medium uppercase tracking-[0.1em] transition-all hover:bg-blue-700 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer animate-in fade-in zoom-in duration-300"
                    >
                       <Plus size={16} /> Nuevo Expediente
                    </button>
                  )}
              </div>
           </div>
           
           <StoriesBar projects={activeProjects} selectedProjectId={selectedProjectId} onSelectProject={(id) => { 
             setSelectedProjectId(id); 
             if (activeTab !== 'overview') {
               navigate('/dashboard');
             }
           }} />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-16 pt-12 pb-24">
           <div className="max-w-7xl mx-auto">
              
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                   {(() => {
                      const selected = projects.find(p => p.id === selectedProjectId);
                      return selected ? (
                        <EliteClientCard 
                          project={selected} 
                          onEdit={() => setIsSlideoverOpen(true)} 
                        />
                      ) : (
                        <AuditDashboard 
                          projects={activeProjects} 
                          demoMode={demoMode}
                          onSelectClient={(id) => setSelectedProjectId(id)}
                        />
                      );
                   })()}
                </div>
              )}

              {activeTab === 'clients' && (
                 <div className="space-y-16 animate-in fade-in duration-700">
                    <div className="flex items-end justify-between">
                       <div>
                          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Expedientes</h1>
                          <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] mt-4 font-medium">Gestión de Cartera</p>
                       </div>
                       <div className="relative w-80">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text"
                            placeholder="Buscar en la bóveda..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                          />
                       </div>
                       <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm ml-6">
                         <button 
                           onClick={() => setViewMode('cards')}
                           className={`p-2 rounded-lg transition-colors flex items-center justify-center ${viewMode === 'cards' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                           title="Vista Cuadrícula (Elite)"
                         >
                           <GridIcon size={18} />
                         </button>
                         <button 
                           onClick={() => setViewMode('grid')}
                           className={`p-2 rounded-lg transition-colors flex items-center justify-center ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                           title="Vista Lista (CRM Clásico)"
                         >
                           <List size={18} />
                         </button>
                       </div>
                    </div>

                    {viewMode === 'cards' ? (
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
                             <div className={`w-full aspect-square rounded-[32px] bg-white border shadow-sm flex items-center justify-center p-8 relative overflow-hidden transition-all duration-300 ${
                                project.healthFlag === 'Verde' ? 'group-hover:border-emerald-300 group-hover:shadow-emerald-100 border-slate-100' : 
                                project.healthFlag === 'Amarilla' ? 'group-hover:border-amber-300 group-hover:shadow-amber-100 border-slate-100' : 
                                'group-hover:border-rose-300 group-hover:shadow-rose-100 border-slate-100'
                             }`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                <ImageWithFallback 
                                  src={project.logoUrl} 
                                  className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" 
                                  alt={project.client}
                                  fallbackIcon={<Users className="text-slate-300 group-hover:opacity-100 transition-opacity" size={32} />}
                                />
                                
                                <div className={`absolute top-6 right-6 w-1.5 h-1.5 rounded-full ${
                                   project.healthFlag === 'Verde' ? 'bg-emerald-400' : 
                                   project.healthFlag === 'Amarilla' ? 'bg-amber-400' : 
                                   'bg-rose-500'
                                } shadow-[0_0_10px_currentColor]`} />
                             </div>
                             <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.1em] text-center group-hover:text-slate-900 transition-colors duration-300">
                                {project.client}
                             </span>
                          </motion.div>
                       ))}
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CRMDataGrid projects={projects.filter(p => p.adminStatus !== 'Archivado')} />
                      </div>
                    )}
                 </div>
              )}

              {activeTab === 'status' && (
                 <div className="animate-in fade-in duration-700 flex flex-col items-center justify-center h-[50vh] text-center">
                    <div className="w-20 h-20 bg-white border border-slate-200 shadow-sm rounded-[32px] flex items-center justify-center mb-8 text-blue-500">
                       <TrendingUp size={32} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-4">Cierre Trimestral</h1>
                    <p className="text-slate-500 text-[11px] font-medium uppercase tracking-[0.2em] max-w-md leading-relaxed">Motor de Evaluación HC Rc506 V4.0<br/>Analítica de los 10 Pilares Estratégicos</p>
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
         onUpdate={async (p) => setProjects(await projectService.updateProject(p, projects, user?.displayName || user?.email || 'Administrador'))}
         onArchive={async (p) => {
            const archived = { ...p, adminStatus: 'Archivado' as any };
            setProjects(await projectService.updateProject(archived, projects, user?.displayName || user?.email || 'Administrador'));
            setIsSlideoverOpen(false);
         }}
         onEditRequest={(p) => { setEditingProject(p); setIsProjectModalOpen(true); setIsSlideoverOpen(false); }}
         onDelete={async (id) => { if(confirm('¿Eliminar permanentemente?')) setProjects(await projectService.deleteProject(id, projects)); setIsSlideoverOpen(false); }}
      />

      <ProjectModal 
         isOpen={isProjectModalOpen}
         onClose={() => setIsProjectModalOpen(false)}
         onSave={async (p) => setProjects(editingProject ? await projectService.updateProject(p, projects, user?.displayName || user?.email || 'Administrador') : await projectService.addProject(p, projects, user?.displayName || user?.email || 'Administrador'))}
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
