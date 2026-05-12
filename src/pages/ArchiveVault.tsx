import React from 'react';
import { Archive, RotateCcw, ShieldAlert, Search, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';

interface ArchiveVaultProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

const ArchiveVault: React.FC<ArchiveVaultProps> = ({ projects, setProjects }) => {
  const archivedProjects = projects.filter(p => p.adminStatus === 'Archivado');

  const handleRestore = async (project: Project) => {
    const restored = { ...project, adminStatus: 'Activo' as any };
    const updatedProjects = await projectService.updateProject(restored, projects);
    setProjects(updatedProjects);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar permanentemente de la bóveda? Esta acción no se puede deshacer.')) {
      const updatedProjects = await projectService.deleteProject(id, projects);
      setProjects(updatedProjects);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-semibold text-white tracking-tight uppercase mb-2">Bóveda de Histórico</h1>
          <p className="label-executive">Repositorio de Clientes Inactivos y Proyectos Finalizados</p>
        </div>
        <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
           <Search size={16} className="text-slate-500" />
           <input 
              type="text" 
              placeholder="Buscar en el archivo..." 
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-white focus:ring-0 w-48 placeholder:text-slate-700"
           />
        </div>
      </header>

      {archivedProjects.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[48px] bg-white/[0.02] backdrop-blur-sm">
           <Archive size={48} className="text-slate-800 mb-6" />
           <h3 className="text-xl font-semibold text-slate-600 uppercase tracking-tight">Bóveda Vacía</h3>
           <p className="label-executive mt-2">No hay clientes archivados en este momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedProjects.map((project, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={project.id} 
              className="glass-card p-8 relative overflow-hidden group grayscale hover:grayscale-0 transition-all duration-500 border border-white/5 hover:border-rc-teal/30"
            >
              {/* Archive Seal */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center rotate-12 opacity-20 group-hover:opacity-40 transition-opacity">
                 <ShieldAlert size={40} className="text-slate-400" />
              </div>

              <div className="flex items-center gap-5 mb-8">
                 <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center grayscale">
                    {project.logoUrl ? (
                       <img src={project.logoUrl} className="w-8 h-8 object-contain opacity-50" />
                    ) : (
                       <Archive className="text-slate-600" size={20} />
                    )}
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-300 uppercase tracking-tighter">{project.client}</h4>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Archivado</span>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                    <span>Última Salud</span>
                    <span className="text-white">{project.healthFlag}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                    <span>Servicios Totales</span>
                    <span className="text-white">{project.services.length}</span>
                 </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5">
                 <button 
                   onClick={() => handleRestore(project)}
                   className="flex-1 py-4 bg-white/5 hover:bg-rc-teal text-slate-400 hover:text-black rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-rc-teal/30"
                 >
                    <RotateCcw size={14} /> Restaurar
                 </button>
                 <button 
                   onClick={() => handleDelete(project.id)}
                   className="p-4 bg-rose-500/10 hover:bg-rose-500 rounded-2xl text-rose-500 hover:text-white transition-all border border-rose-500/20"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

       {/* Info Card */}
      <div className="p-10 bg-rc-teal/5 border border-rc-teal/10 rounded-[48px] flex items-center gap-8 backdrop-blur-md">
         <div className="w-16 h-16 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal shadow-[0_0_20px_rgba(59,188,169,0.2)]">
            <Archive size={32} />
         </div>
         <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-tight mb-2">Política de Conservación</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-medium">
               Los clientes en la bóveda conservan todo su historial de auditorías, ADN técnico y configuraciones de servicios. Restaurar un cliente reactivará automáticamente sus paneles en el Dashboard y Monitor de Servicios.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ArchiveVault;
