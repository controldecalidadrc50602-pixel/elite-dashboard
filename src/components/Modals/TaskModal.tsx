import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, SubTask } from '../TaskManager';
import { projectService } from '../../services/projectService';
import { Project } from '../../types/project';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task | null;
}

const AREAS = [
  'Plataforma',
  'Gestion de Calidad',
  'Administracion',
  'Contact Center',
  'Inteligencia de negocios',
  'Otro'
];

const TaskModal: React.FC<Props> = ({ isOpen, onClose, onSave, task }) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [useCustomArea, setUseCustomArea] = useState(false);
  const [customArea, setCustomArea] = useState('');
  
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    projectId: '',
    projectName: '',
    status: 'Open',
    priority: 'Medium',
    assignedTo: '',
    responsibleEmail: '',
    area: AREAS[0],
    operationalValue: 1,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: '',
    subtasks: [],
    progress: 0,
    createdAt: new Date().toISOString()
  });

  useEffect(() => {
    projectService.getProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (task) {
      setFormData(task);
      if (!AREAS.includes(task.area)) {
        setUseCustomArea(true);
        setCustomArea(task.area);
      }
    } else {
      setFormData({
        title: '',
        projectId: '',
        projectName: '',
        status: 'Open',
        priority: 'Medium',
        assignedTo: '',
        responsibleEmail: '',
        area: AREAS[0],
        operationalValue: 1,
        startTime: new Date().toISOString().slice(0, 16),
        endTime: '',
        subtasks: [],
        progress: 0,
        createdAt: new Date().toISOString()
      });
      setUseCustomArea(false);
      setCustomArea('');
    }
  }, [task, isOpen]);

  const addSubtask = () => {
    const newSubtask: SubTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      completed: false
    };
    setFormData({ ...formData, subtasks: [...(formData.subtasks || []), newSubtask] });
  };

  const updateSubtask = (id: string, title: string) => {
    const newSubtasks = (formData.subtasks || []).map(st => 
      st.id === id ? { ...st, title } : st
    );
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const removeSubtask = (id: string) => {
    setFormData({ ...formData, subtasks: (formData.subtasks || []).filter(st => st.id !== id) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const selectedProject = projects.find(p => p.id === formData.projectId);
    
    const finalTask: Task = {
      id: task?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title.trim(),
      projectId: formData.projectId || 'none',
      projectName: selectedProject?.client || 'Sin Proyecto',
      status: formData.status as any || 'Open',
      priority: formData.priority as any || 'Medium',
      assignedTo: formData.assignedTo || '',
      responsibleEmail: formData.responsibleEmail || '',
      area: useCustomArea ? customArea : (formData.area || AREAS[0]),
      operationalValue: formData.operationalValue || 1,
      startTime: formData.startTime || new Date().toISOString(),
      endTime: formData.endTime || '',
      subtasks: (formData.subtasks || []).filter(st => st.title.trim() !== ''),
      progress: (formData.subtasks || []).length > 0 
        ? Math.round(((formData.subtasks || []).filter(st => st.completed).length / (formData.subtasks || []).length) * 100)
        : 0,
      createdAt: formData.createdAt || new Date().toISOString()
    };

    onSave(finalTask);
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-thin)] shadow-2xl z-[110] rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-[var(--border-thin)] flex items-center justify-between bg-[var(--bg-card)] shrink-0">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {task ? 'Editar Tarea' : 'Nueva Tarea Profesional'}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 p-8 space-y-8 scrollbar-hide">
              {/* Info Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Título de la Tarea</label>
                  <input 
                    autoFocus
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Auditoría de infraestructura crítica"
                    className="w-full glass-input px-5 py-4 text-sm font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Proyecto Cliente</label>
                  <select 
                    value={formData.projectId}
                    onChange={e => setFormData({...formData, projectId: e.target.value})}
                    className="w-full glass-input px-5 py-3.5 text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar Cliente</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Prioridad</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full glass-input px-5 py-3.5 text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer"
                  >
                    <option value="High">🚨 Alta</option>
                    <option value="Medium">⚡ Media</option>
                    <option value="Low">🟢 Baja</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-rc-teal uppercase tracking-widest ml-1">Valor Operativo (Peso 1-10)</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={formData.operationalValue}
                    onChange={e => setFormData({...formData, operationalValue: parseInt(e.target.value) || 1})}
                    className="w-full bg-[var(--bg-input)] border border-rc-teal/30 rounded-2xl px-5 py-3.5 text-xs font-bold outline-none focus:border-rc-teal transition-all text-white"
                  />
                </div>
              </div>

              {/* Asignación y Áreas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Responsable Directo</label>
                  <input 
                    value={formData.assignedTo}
                    onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                    placeholder="Nombre del encargado"
                    className="w-full glass-input px-5 py-3.5 text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email del Responsable</label>
                  <input 
                    type="email"
                    value={formData.responsibleEmail}
                    onChange={e => setFormData({...formData, responsibleEmail: e.target.value})}
                    placeholder="ejemplo@rc506.com"
                    className="w-full glass-input px-5 py-3.5 text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Área / Departamento</label>
                  {!useCustomArea ? (
                    <select 
                      value={formData.area}
                      onChange={e => {
                        if (e.target.value === 'Otro') {
                           setUseCustomArea(true);
                        } else {
                           setFormData({...formData, area: e.target.value});
                        }
                      }}
                      className="w-full glass-input px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer"
                    >
                      {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  ) : (
                    <div className="relative">
                      <input 
                        value={customArea}
                        onChange={e => setCustomArea(e.target.value)}
                        placeholder="Especificar área..."
                        className="w-full bg-[var(--bg-input)] border border-rc-teal rounded-2xl px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest outline-none transition-all text-white pr-10"
                      />
                      <button 
                        type="button"
                        onClick={() => setUseCustomArea(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-rc-teal"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tiempos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">T-Inicio (Apertura)</label>
                  <input 
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className="w-full glass-input px-5 py-3.5 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-1">T-Fin (Límite SLA)</label>
                  <input 
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    className="w-full bg-[var(--bg-input)] border border-rose-500/30 rounded-2xl px-5 py-3.5 text-xs font-bold outline-none focus:border-rose-500 transition-all text-white"
                  />
                </div>
              </div>

              {/* Subtareas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Subtareas / Checklist</label>
                  <button 
                    type="button" 
                    onClick={addSubtask}
                    className="text-[10px] font-bold text-rc-teal uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.subtasks?.map((st) => (
                    <motion.div 
                       layout
                       key={st.id} 
                       className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group"
                    >
                      <CheckCircle2 size={16} className={st.completed ? "text-rc-teal" : "text-slate-600"} />
                      <input 
                        value={st.title}
                        onChange={e => updateSubtask(st.id, e.target.value)}
                        placeholder="Descripción de la subtarea..."
                        className="flex-1 bg-transparent border-none text-[11px] font-bold outline-none text-white"
                      />
                      <button 
                        type="button"
                        onClick={() => removeSubtask(st.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                  {(!formData.subtasks || formData.subtasks.length === 0) && (
                    <div className="py-6 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                       <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Sin subtareas asignadas</p>
                    </div>
                  )}
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-[var(--border-thin)] flex gap-4 bg-[var(--bg-card)] shrink-0">
               <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-[2] bg-rc-teal text-[#060910] py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-rc-teal/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} /> Guardar Cambios
              </button>
            </div>
          </motion.div>

        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TaskModal;
