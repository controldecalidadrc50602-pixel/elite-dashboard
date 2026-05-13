import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { StrategySLA } from '../../../types/project';

interface Props {
  strategy?: StrategySLA;
  onUpdate: (updates: Partial<StrategySLA>) => void;
}

const StrategySection: React.FC<Props> = ({ strategy, onUpdate }) => {
  const addRecurringTask = () => {
    const tasks = [...(strategy?.recurringTasks || [])];
    tasks.push('');
    onUpdate({ recurringTasks: tasks });
  };

  const updateRecurringTask = (index: number, value: string) => {
    const tasks = [...(strategy?.recurringTasks || [])];
    tasks[index] = value;
    onUpdate({ recurringTasks: tasks });
  };

  const removeRecurringTask = (index: number) => {
    const tasks = (strategy?.recurringTasks || []).filter((_, i) => i !== index);
    onUpdate({ recurringTasks: tasks });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="section-title text-white">Estrategia</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calidad y SLA.</p>
          </div>
        </div>
        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
          <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
            Configura los tiempos de respuesta y las tareas recurrentes que definen el éxito y cumplimiento del proyecto.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,2fr] gap-12">
        <div className="p-8 bg-black/10 border border-white/5 rounded-[40px] space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label>Parámetros Globales de SLA</label>
              <span className="text-2xl font-black text-rc-teal">{strategy?.defaultTaskWeight || 5}/10</span>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">Importancia promedio de las tareas</p>
            <input 
              type="range" min="1" max="10" step="1"
              value={strategy?.defaultTaskWeight || 5}
              onChange={e => onUpdate({ defaultTaskWeight: parseInt(e.target.value) })}
              className="w-full accent-rc-teal"
            />
          </div>
          <div className="space-y-4 pt-6 border-t border-white/5">
            <label>SLA de Respuesta (Horas)</label>
            <div className="relative">
              <input 
                type="number" value={strategy?.responseSla || 0}
                onChange={e => onUpdate({ responseSla: parseInt(e.target.value) || 0 })}
                className="w-full pl-6 pr-20 py-4 text-xl font-black"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Horas</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">Tiempo máximo prometido al cliente para resolver incidencias técnicas.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label>Tareas Recurrentes (Base)</label>
            <button 
              type="button"
              onClick={addRecurringTask}
              className="p-2 text-[var(--rc-turquoise)] hover:bg-[var(--rc-turquoise)]/10 rounded-lg transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {strategy?.recurringTasks?.map((task, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-[var(--rc-turquoise)] shrink-0" />
                <input 
                  placeholder="Ej: Reporte de Calidad Semanal"
                  value={task}
                  onChange={e => updateRecurringTask(idx, e.target.value)}
                  className="flex-1 bg-white/5 border-none py-3 px-4 rounded-xl text-[11px] font-bold text-white placeholder:text-slate-600 focus:bg-white/10"
                />
                <button 
                  type="button"
                  onClick={() => removeRecurringTask(idx)}
                  className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategySection;
