import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Circle,
  MoreVertical,
  Flag,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { taskService } from '../services/taskService';
import TaskModal from './Modals/TaskModal';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  area: string;
  startTime: string; // ISO
  endTime?: string; // ISO (Target)
  subtasks: SubTask[];
  createdAt: string;
}




const TaskManager = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(new Date());

  // Timer update every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async (task: Task) => {
    let updated;
    if (editingTask) {
      updated = await taskService.updateTask(task, tasks);
    } else {
      updated = await taskService.addTask(task, tasks);
    }
    setTasks(updated);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta tarea definitivamente?')) {
       const updated = await taskService.deleteTask(id, tasks);
       setTasks(updated);
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const updatedTask = { ...task, subtasks: updatedSubtasks };
    const newTasks = await taskService.updateTask(updatedTask, tasks);
    setTasks(newTasks);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-[var(--text-secondary)]';
    }
  };

  const getElapsedTime = (startTime: string) => {
    const start = new Date(startTime);
    const diff = now.getTime() - start.getTime();
    if (diff < 0) return 'Por iniciar';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h transcurridas`;
  };

  const isOverdue = (endTime?: string) => {
    if (!endTime) return false;
    return new Date(endTime) < now;
  };

  const filteredTasks = tasks.filter(t => 
    (t.title?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (t.area?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (t.assignedTo?.toLowerCase() || '').includes(search.toLowerCase())
  );


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">{t('tasks.title')}</h1>
          <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            {tasks.length} {t('tasks.active_assignments')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-rc-teal transition-colors" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl py-3 pl-12 pr-6 text-xs font-medium focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all outline-none md:w-64 w-full"
              placeholder={t('tasks.search_placeholder')}
            />
          </div>
          <button 
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/20 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus size={18} /> {t('tasks.new_task')}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden border border-[var(--glass-border)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--glass-border)]">
                <th className="p-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">{t('tasks.table_state')}</th>
                <th className="p-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Tarea / Responsable</th>
                <th className="p-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Departamento</th>
                <th className="p-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Prioridad</th>
                <th className="p-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] text-center">Tiempo / Progreso</th>
                <th className="p-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] text-right">{t('tasks.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredTasks.map((task, idx) => (
                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <td className="p-6">
                    <button 
                      onClick={() => {
                        const newStatus = task.status === 'Closed' ? 'Open' : 'Closed';
                        handleSave({ ...task, status: newStatus });
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        task.status === 'Closed' 
                          ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20' 
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:bg-rc-teal/10 hover:text-rc-teal transition-colors'
                      }`}
                    >
                      {task.status === 'Closed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                  </td>
                  <td className="p-6">
                    <div className="font-black text-[var(--text-primary)] text-sm tracking-tight group-hover:text-rc-teal transition-colors uppercase cursor-pointer" onClick={() => { setEditingTask(task); setIsModalOpen(true); }}>
                      {task.title}
                    </div>
                    <div className="text-[10px] font-bold text-[var(--text-secondary)] mt-1 flex items-center gap-2 uppercase tracking-tight">
                      <span className="w-4 h-[1px] bg-rc-teal/30" /> {task.assignedTo || 'Sin asignar'}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-rc-teal uppercase tracking-widest">{task.area}</span>
                      <span className="text-[9px] font-bold text-[var(--text-secondary)] tracking-tight opacity-60 uppercase">{task.projectName}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center w-fit gap-2 border ${getPriorityColor(task.priority)}`}>
                      <Flag size={10} /> {task.priority}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col items-center gap-2">
                       {task.status !== 'Closed' ? (
                         <div className={`px-4 py-1.5 rounded-2xl flex items-center gap-2 ${isOverdue(task.endTime) ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-rc-teal/10 text-rc-teal'}`}>
                            <Clock size={12} />
                            <span className="text-[10px] font-black tabular-nums">{getElapsedTime(task.startTime)}</span>
                         </div>
                       ) : (
                         <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-2xl uppercase tracking-widest italic">Finalizada</span>
                       )}
                       {task.subtasks.length > 0 && (
                         <div className="w-32 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rc-teal transition-all duration-1000" 
                              style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                            />
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                        className="text-[var(--text-secondary)] hover:text-rc-teal p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                      >
                        <Tag size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                        className="text-rose-500/50 hover:text-rose-500 p-3 rounded-xl hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center opacity-30">
                     <Search size={40} className="mx-auto mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em]">No se encontraron tareas profesionales</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
};


export default TaskManager;
