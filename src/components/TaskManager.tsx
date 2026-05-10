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
  Trash2,
  CheckSquare
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
  description?: string;
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-[var(--rc-turquoise)]/5 rounded-3xl flex items-center justify-center text-[var(--rc-turquoise)] border border-[var(--rc-turquoise)]/10">
              <CheckSquare size={32} strokeWidth={1.5} />
           </div>
           <div>
              <h1 className="text-4xl font-light tracking-tighter text-[var(--text-primary)] leading-none">{t('tasks.title')}</h1>
              <p className="text-[var(--text-secondary)] font-medium text-[11px] uppercase tracking-widest mt-2 opacity-60">
                {tasks.length} {t('tasks.active_assignments')}
              </p>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--rc-turquoise)] transition-colors" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl py-3 pl-12 pr-6 text-[13px] font-medium focus:ring-2 focus:ring-[var(--rc-turquoise)]/20 focus:border-[var(--rc-turquoise)] transition-all outline-none md:w-72 w-full"
              placeholder={t('tasks.search_placeholder')}
            />
          </div>
          <button 
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-[var(--rc-turquoise)] hover:bg-[var(--rc-turquoise)]/90 text-[var(--bg-primary)] px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center gap-3 transition-all shadow-lg shadow-[var(--rc-turquoise)]/20 active:scale-[0.98]"
          >
            <Plus size={20} strokeWidth={2.5} /> {t('tasks.new_task')}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[40px] overflow-hidden border border-[var(--glass-border)] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-[var(--glass-border)]">
                <th className="px-10 py-6 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-[120px]">{t('tasks.table_state')}</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Tarea / Responsable</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Área / Proyecto</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-[180px]">Prioridad</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center w-[220px]">Tiempo</th>
                <th className="px-10 py-6 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right w-[140px]">{t('tasks.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredTasks.map((task, idx) => (
                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all group cursor-pointer elite-accent-line"
                  onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                >
                  <td className="px-10 py-6">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newStatus = task.status === 'Closed' ? 'Open' : 'Closed';
                        handleSave({ ...task, status: newStatus });
                      }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        task.status === 'Closed' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border border-[var(--glass-border)] group-hover:border-[var(--rc-turquoise)]/40'
                      }`}
                    >
                      {task.status === 'Closed' ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <Circle size={16} strokeWidth={2.5} />}
                    </button>
                  </td>
                  <td className="px-10 py-6">
                    <div className="font-semibold text-[var(--text-primary)] text-[14px] tracking-tight group-hover:text-[var(--rc-turquoise)] transition-colors">
                      {task.title}
                    </div>
                    <div className="text-[11px] font-medium text-[var(--rc-turquoise)] mt-1 opacity-60 flex items-center gap-2 uppercase tracking-wider">
                       {task.assignedTo || 'Sin asignar'}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-semibold text-[var(--text-primary)] tracking-tight">{task.area}</span>
                      <span className="text-[10px] font-medium text-[var(--text-secondary)] tracking-wide opacity-50 uppercase truncate max-w-[180px]">{task.projectName}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col items-center gap-1.5">
                       <SlaTimer 
                          startTime={task.startTime} 
                          endTime={task.endTime} 
                          status={task.status} 
                       />
                       {task.status !== 'Closed' && task.subtasks.length > 0 && (
                          <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest opacity-40">
                             Progreso: {task.progress}%
                          </span>
                       )}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         className="p-2 text-[var(--text-secondary)] hover:text-[var(--rc-turquoise)] transition-colors"
                         onClick={(e) => { e.stopPropagation(); setEditingTask(task); setIsModalOpen(true); }}
                      >
                        <Tag size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                        className="p-2 text-rose-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-24 text-center opacity-30">
                     <div className="flex flex-col items-center gap-4">
                        <Search size={48} strokeWidth={1} />
                        <p className="text-[12px] font-medium uppercase tracking-widest">No se encontraron tareas</p>
                     </div>
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
