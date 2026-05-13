import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, ShieldCheck, Clock } from 'lucide-react';
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
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="section-container"
    >
      <header className="flex items-start justify-between mb-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Estrategia y SLA</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Métricas de Calidad y Cumplimiento</p>
          </div>
        </div>
        <div className="max-w-[340px] p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[32px]">
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Establezca los parámetros de rendimiento y las tareas críticas que rigen la excelencia operativa de esta cuenta.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,2fr] gap-16 premium-card-v4">
        <div className="space-y-12">
          <div className="form-group">
            <div className="flex justify-between items-end mb-4">
              <label className="form-label">Prioridad Promedio (SLA Weight)</label>
              <span className="text-3xl font-black text-rc-teal tracking-tighter">{strategy?.defaultTaskWeight || 5}/10</span>
            </div>
            <input 
              type="range" min="1" max="10" step="1"
              value={strategy?.defaultTaskWeight || 5}
              onChange={e => onUpdate({ defaultTaskWeight: parseInt(e.target.value) })}
              className="w-full h-3 bg-black/40 rounded-full appearance-none cursor-pointer accent-rc-teal"
            />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">Nivel de criticidad base para las tareas del proyecto</p>
          </div>

          <div className="p-10 bg-black/40 border border-white/10 rounded-[40px] space-y-6 shadow-inner">
            <div className="flex items-center gap-4 text-rc-teal mb-2">
              <Clock size={24} />
              <label className="form-label !m-0">Ventana de Respuesta SLA</label>
            </div>
            <div className="relative">
              <input 
                type="number" value={strategy?.responseSla || 0}
                onChange={e => onUpdate({ responseSla: parseInt(e.target.value) || 0 })}
                className="w-full pl-8 pr-24 py-8 text-3xl font-black text-rc-teal"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[12px] font-black text-slate-500 uppercase tracking-widest">Horas</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
              Tiempo máximo de resolución para incidencias técnicas de prioridad estándar.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="form-label !text-[12px] !text-white">Matriz de Tareas Recurrentes</label>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entregables de Cumplimiento Continuo</p>
            </div>
            <button 
              type="button"
              onClick={addRecurringTask}
              className="w-12 h-12 flex items-center justify-center bg-rc-teal/10 text-rc-teal rounded-2xl hover:bg-rc-teal/20 transition-all shadow-lg border border-rc-teal/20"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {(strategy?.recurringTasks || []).length === 0 ? (
              <div className="py-12 px-6 border-2 border-dashed border-white/5 rounded-[32px] text-center">
                <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">No hay tareas recurrentes definidas</p>
              </div>
            ) : (
              strategy?.recurringTasks?.map((task, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-rc-teal/30 group-hover:bg-rc-teal/5 transition-all">
                    <ShieldCheck size={18} className="text-slate-600 group-hover:text-rc-teal transition-colors" />
                  </div>
                  <input 
                    placeholder="Ej: Auditoría de Calidad Semanal / Backups de BD"
                    value={task}
                    onChange={e => updateRecurringTask(idx, e.target.value)}
                    className="flex-1 text-base font-bold placeholder:opacity-20"
                  />
                  <button 
                    type="button"
                    onClick={() => removeRecurringTask(idx)}
                    className="w-10 h-10 flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/10 rounded-xl"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategySection;
