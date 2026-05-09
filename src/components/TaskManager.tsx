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
import SlaTimer from './common/SlaTimer';

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
  responsibleEmail?: string;
  area: string;
  operationalValue: number; // Peso/Valor de la tarea (1-10)
  startTime: string; // ISO
  endTime: string; // ISO (Target)
  firstResponseTime?: string; // ISO (When status changed to In Progress)
  completionTime?: string; // ISO (When status changed to Closed)
  subtasks: SubTask[];
  progress: number; // 0-100
  effectivenessScore?: number; // 0-100 (Calculated on completion)
  createdAt: string;
  slaNotified?: {
    p33?: boolean;
    p50?: boolean;
    p75?: boolean;
    m30?: boolean;
  };
}




interface TaskManagerProps {
  projectId?: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ projectId }) => {
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

    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const progress = updatedSubtasks.length > 0 
      ? Math.round((completedCount / updatedSubtasks.length) * 100) 
      : 0;

    const updatedTask: Task = { 
      ...task, 
      subtasks: updatedSubtasks, 
      progress,
      status: progress === 100 ? 'Closed' : task.status
    };
    
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

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = (t.title?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (t.area?.toLowerCase() || '').includes(search.toLowerCase()) ||
                          (t.assignedTo?.toLowerCase() || '').includes(search.toLowerCase());
    
    if (projectId) {
      return matchesSearch && t.projectId === projectId;
    }
    return matchesSearch;
  });


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

      <div className="glass-card rounded-[24px] overflow-hidden border border-[var(--glass-border)] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/10 dark:bg-white/5 border-b border-[var(--glass-border)]">
                <th className="px-6 py-3 text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] w-[80px]">{t('tasks.table_state')}</th>
                <th className="px-6 py-3 text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Tarea / Responsable</th>
                <th className="px-6 py-3 text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Departamento / Proyecto</th>
                <th className="px-6 py-3 text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] w-[140px]">Prioridad</th>
                <th className="px-6 py-3 text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-center w-[180px]">Tiempo</th>
                <th className="px-6 py-3 text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-right w-[100px]">{t('tasks.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredTasks.map((task, idx) => (                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer elite-accent-line"
                  onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                >
                  <td className="px-6 py-2.5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newStatus = task.status === 'Closed' ? 'Open' : 'Closed';
                        handleSave({ ...task, status: newStatus });
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        task.status === 'Closed' 
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border border-white/5 group-hover:border-rc-teal/30'
                      }`}
                    >
                      {task.status === 'Closed' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    </button>
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="font-black text-[var(--text-primary)] text-[11px] tracking-widest uppercase truncate max-w-[280px] group-hover:text-rc-teal transition-colors">
                      {task.title}
                    </div>
                    <div className="text-[9px] font-bold text-rc-teal mt-0.5 opacity-60 flex items-center gap-2 uppercase tracking-tight">
                       {task.assignedTo || 'Sin asignar'}
                    </div>
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest opacity-80">{task.area}</span>
                      <span className="text-[8px] font-bold text-[var(--text-secondary)] tracking-tight opacity-40 uppercase truncate max-w-[150px]">{task.projectName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="flex flex-col items-center gap-1">
                       <SlaTimer 
                          startTime={task.startTime} 
                          endTime={task.endTime} 
                          status={task.status} 
                       />
                       {task.status !== 'Closed' && task.subtasks.length > 0 && (
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                             Progreso: {task.progress}%
                          </span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-2.5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         className="p-1.5 text-[var(--text-secondary)] hover:text-rc-teal"
                         onClick={(e) => { e.stopPropagation(); setEditingTask(task); setIsModalOpen(true); }}
                      >
                        <Tag size={12} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                        className="p-1.5 text-rose-500/40 hover:text-rose-500"
                      >
                        <Trash2 size={12} />
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
