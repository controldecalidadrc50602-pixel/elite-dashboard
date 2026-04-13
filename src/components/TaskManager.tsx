import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Circle,
  MoreVertical,
  Flag
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  project: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Auditoría de Seguridad - Fase 1', project: 'Finanzas Globales', status: 'In Progress', priority: 'High', dueDate: '2024-04-15' },
  { id: '2', title: 'Mantenimiento de Servidores Cloud', project: 'Industrias Norte', status: 'Open', priority: 'Medium', dueDate: '2024-04-20' },
  { id: '3', title: 'Actualización de Middleware V3', project: 'Finanzas Globales', status: 'Closed', priority: 'Low', dueDate: '2024-04-10' },
];

const TaskManager = () => {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-[var(--text-secondary)]';
    }
  };

  return (
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
              className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl py-3 pl-12 pr-6 text-xs font-medium focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all outline-none md:w-64 w-full"
              placeholder={t('tasks.search_placeholder')}
            />
          </div>
          <button className="bg-rc-teal hover:shadow-xl hover:shadow-rc-teal/20 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
            <Plus size={18} /> {t('tasks.new_task')}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden border border-[var(--glass-border)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--glass-border)]">
                <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t('tasks.table_state')}</th>
                <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t('tasks.table_task_project')}</th>
                <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t('tasks.table_priority')}</th>
                <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest text-center">{t('tasks.table_due_date')}</th>
                <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest text-right">{t('tasks.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {tasks.map((task, idx) => (
                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <td className="p-6">
                    {task.status === 'Closed' ? (
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-[var(--text-secondary)]">
                        <Circle size={18} />
                      </div>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="font-black text-[var(--text-primary)] text-sm tracking-tight group-hover:text-rc-teal transition-colors uppercase">
                      {task.title}
                    </div>
                    <div className="text-[10px] font-bold text-[var(--text-secondary)] mt-1 flex items-center gap-1 uppercase tracking-tight">
                      <Tag size={12} className="text-rc-teal" /> {task.project}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center w-fit gap-2 border ${getPriorityColor(task.priority)} transition-all`}>
                      <Flag size={10} /> {t(`tasks.priority_${task.priority.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)] text-[11px] font-bold">
                      <Clock size={14} className="text-rc-teal" /> {task.dueDate}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
