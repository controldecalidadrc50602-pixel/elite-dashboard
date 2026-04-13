import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../pages/Dashboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project | null;
}

const ProjectModal: React.FC<Props> = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    client: '',
    startDate: new Date().toISOString().split('T')[0],
    services: [],
    evaluations: [],
    status: 'Óptimo'
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        client: '',
        startDate: new Date().toISOString().split('T')[0],
        services: [],
        evaluations: [],
        status: 'Óptimo'
      });
    }
  }, [project, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client) return;

    const finalProject: Project = {
      id: project?.id || Math.random().toString(36).substr(2, 9),
      client: formData.client!,
      startDate: formData.startDate!,
      services: formData.services || [],
      evaluations: formData.evaluations || [],
      status: formData.status as any || 'Óptimo'
    };

    onSave(finalProject);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--glass-border)] shadow-2xl z-[110] rounded-[40px] overflow-hidden"
          >
            <div className="p-8 border-b border-[var(--glass-border)] flex items-center justify-between">
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tighter uppercase">
                {project ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-[var(--text-secondary)]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Nombre del Cliente / Empresa</label>
                <input 
                  autoFocus
                  required
                  value={formData.client}
                  onChange={e => setFormData({...formData, client: e.target.value})}
                  placeholder="Ej: Rc506 Solutions"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Fecha de Inicio de Relación</label>
                <input 
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all text-[var(--text-primary)]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-black/5 transition-all text-center"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-rc-teal text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rc-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Save size={16} /> {project ? 'Guardar Cambios' : 'Crear Proyecto'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
