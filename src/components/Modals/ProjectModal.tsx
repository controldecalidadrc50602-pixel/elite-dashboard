import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ClientService } from '../../types/project';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project | null;
}

const ProjectModal: React.FC<Props> = ({ isOpen, onClose, onSave, project }) => {
  const { t } = useTranslation();
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
    if (!formData.client?.trim()) {
      alert(t('projects.name_required'));
      return;
    }

    // Filter out services with empty names
    const cleanServices = (formData.services || []).filter((s: ClientService) => s.name?.trim() !== '');
    
    if (cleanServices.length === 0 && formData.services && formData.services.length > 0) {
       alert(t('projects.services_required'));
       return;
    }

    const finalProject: Project = {
      id: project?.id || Math.random().toString(36).substr(2, 9),
      client: formData.client.trim(),
      startDate: formData.startDate!,
      services: cleanServices,
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
            <div className="p-8 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--bg-secondary)] relative z-10">
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tighter uppercase">
                {project ? t('common.edit') : t('projects.newProject')}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-[var(--text-secondary)]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
              <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                {/* Datos Básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t('projects.client_name')}</label>
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
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t('audit.status')}</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all text-[var(--text-primary)] appearance-none cursor-pointer"
                    >
                      <option value="Óptimo">🍏 {t('status.stable')}</option>
                      <option value="Aceptable">🔷 {t('status.growth')}</option>
                      <option value="Mejorable">⚠️ {t('status.risk')}</option>
                      <option value="Deficiente">🚨 {t('status.critical')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t('projects.start_date')}</label>
                  <input 
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all text-[var(--text-primary)]"
                  />
                </div>

                {/* Sección de Servicios */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t('projects.services_contracted')}</label>
                    <button 
                      type="button"
                      onClick={() => setFormData({
                        ...formData, 
                        services: [...(formData.services || []), { 
                          id: Math.random().toString(36).substr(2, 9), 
                          name: '', 
                          description: '', 
                          startDate: new Date().toISOString().split('T')[0], 
                          score: 0 
                        }]
                      })}
                      className="text-[10px] font-black text-rc-teal uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> {t('projects.add_service')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.services?.map((service: ClientService, index: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={service.id} 
                        className="p-5 bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-[24px] space-y-3 relative group"
                      >
                        <button 
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            services: formData.services?.filter((s: ClientService) => s.id !== service.id)
                          })}
                          className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <input 
                          required
                          placeholder={t('projects.service_name_placeholder')}
                          value={service.name}
                          onChange={e => {
                            const newServices = [...(formData.services || [])];
                            newServices[index].name = e.target.value;
                            setFormData({...formData, services: newServices});
                          }}
                          className="w-full bg-transparent border-b border-[var(--glass-border)] py-1 text-xs font-black uppercase tracking-tight outline-none focus:border-rc-teal transition-all text-[var(--text-primary)]"
                        />
                        <input 
                          placeholder={t('projects.service_desc_placeholder')}
                          value={service.description}
                          onChange={e => {
                            const newServices = [...(formData.services || [])];
                            newServices[index].description = e.target.value;
                            setFormData({...formData, services: newServices});
                          }}
                          className="w-full bg-transparent text-[10px] font-medium outline-none opacity-60 text-[var(--text-primary)]"
                        />
                      </motion.div>
                    ))}
                    {(formData.services?.length === 0) && (
                      <div className="py-8 text-center border-2 border-dashed border-[var(--glass-border)] rounded-3xl opacity-40">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{t('projects.no_services')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-[var(--glass-border)] flex gap-3 bg-[var(--bg-secondary)] relative z-10">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-black/5 transition-all text-center"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-rc-teal text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rc-teal/20 hover:scale-[1.14] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Save size={16} /> {project ? t('common.save') : t('common.create')}
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
