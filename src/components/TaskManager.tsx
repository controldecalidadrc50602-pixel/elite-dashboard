import React, { useState } from 'react';
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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-400 bg-rose-400/10';
      case 'Medium': return 'text-amber-400 bg-amber-400/10';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-white font-bold text-2xl flex items-center gap-2">
           Gestión de Tareas
          <span className="text-xs font-normal text-slate-500 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            {tasks.length} Total
          </span>
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              className="bg-slate-950/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
              placeholder="Buscar tareas..."
            />
          </div>
          <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
            <Plus size={18} /> Nueva Tarea
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Tarea / Proyecto</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Prioridad</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Vencimiento</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.map((task, idx) => (
                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-white/5 transition-all group"
                >
                  <td className="p-4">
                    {task.status === 'Closed' ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-slate-700" />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">
                      {task.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Tag size={12} /> {task.project}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center w-fit gap-1 ${getPriorityColor(task.priority)}`}>
                      <Flag size={10} /> {task.priority}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                      <Clock size={14} /> {task.dueDate}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-600 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-all">
                      <MoreVertical size={16} />
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
