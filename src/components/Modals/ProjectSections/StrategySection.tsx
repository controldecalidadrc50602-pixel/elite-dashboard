import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Target, Calendar, CheckSquare } from 'lucide-react';
import { StrategySLA, RecurringTask } from '../../../types/project';

interface Props {
  strategy?: StrategySLA;
  onUpdate: (updates: Partial<StrategySLA>) => void;
}

const StrategySection: React.FC<Props> = ({ strategy, onUpdate }) => {
  const addTask = () => {
    const tasks = [...(strategy?.recurringTasks || [])];
    tasks.push({ 
      id: Math.random().toString(36).substr(2, 9), 
      task: '', 
      frequency: 'Semanal' 
    });
    onUpdate({ recurringTasks: tasks });
  };

  const updateTask = (id: string, task: string) => {
    onUpdate({ 
      recurringTasks: strategy?.recurringTasks?.map((t: RecurringTask) => t.id === id ? { ...t, task } : t) 
    });
  };

  const removeTask = (id: string) => {
    onUpdate({ 
      recurringTasks: strategy?.recurringTasks?.filter((t: RecurringTask) => t.id !== id) 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-12"
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-0.5 px-1 bg-rc-teal rounded-full shadow-[0_0_15px_rgba(59,188,169,0.5)]" />
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase glow-text">Estrategia</h2>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[9px] ml-11">Acuerdos y Compromisos de Servicio</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 premium-card-v4">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-rc-teal uppercase tracking-[0.4em] flex items-center gap-2.5">
              <Target size={12} /> Niveles de Servicio (SLA)
            </label>
            <textarea 
              value={strategy?.slaRequirements || ''}
              onChange={e => onUpdate({ slaRequirements: e.target.value })}
              placeholder="Defina los KPIs y tiempos de respuesta comprometidos..."
              className="organic-input w-full h-40 resize-none leading-relaxed pt-6"
            />
          </div>

          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[36px] space-y-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2.5">
              <Calendar size={12} /> Próximo QBR (Quarterly Business Review)
            </label>
            <input 
              type="date"
              value={strategy?.nextReviewDate || ''}
              onChange={e => onUpdate({ nextReviewDate: e.target.value })}
              className="organic-input w-full font-bold uppercase tracking-widest text-rc-teal"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter glow-text flex items-center gap-3">
              <CheckSquare size={18} className="text-rc-teal" /> Tareas Recurrentes
            </h3>
            <button 
              type="button" onClick={addTask}
              className="w-10 h-10 flex items-center justify-center bg-rc-teal/10 text-rc-teal rounded-xl hover:bg-rc-teal hover:text-black transition-all duration-500"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {strategy?.recurringTasks?.map((task: RecurringTask) => (
                <motion.div 
                  layout
                  key={task.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-white/[0.02] border border-white/5 rounded-[24px] flex items-center gap-6 group hover:border-rc-teal/20 transition-all duration-500"
                >
                  <input 
                    value={task.task}
                    onChange={e => updateTask(task.id, e.target.value)}
                    placeholder="Ej: Reporte de Calidad Mensual"
                    className="bg-transparent border-none p-0 text-[13px] font-medium text-white focus:ring-0 w-full"
                  />
                  <button 
                    type="button" onClick={() => removeTask(task.id)}
                    className="text-rose-500/30 hover:text-rose-500 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategySection;
