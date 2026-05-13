import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Star, TrendingUp } from 'lucide-react';
import { ClientEvaluation } from '../../../types/project';

interface Props {
  clientEvaluation?: ClientEvaluation;
  onUpdate: (updates: Partial<ClientEvaluation>) => void;
}

const EvaluationSection: React.FC<Props> = ({ clientEvaluation, onUpdate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-12"
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-0.5 px-1 bg-rc-teal rounded-full shadow-[0_0_15px_rgba(59,188,169,0.5)]" />
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase glow-text">Evaluación</h2>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[9px] ml-11">Índice de Madurez y Satisfacción</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8 premium-card-v4">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-rc-teal uppercase tracking-[0.4em] flex items-center gap-2.5">
              <Star size={12} /> NPS / CSAT Estimado
            </label>
            <input 
              type="number"
              max="100"
              min="0"
              value={clientEvaluation?.satisfactionLevel || 0}
              onChange={e => onUpdate({ satisfactionLevel: parseInt(e.target.value) || 0 })}
              className="bg-transparent border-none p-0 text-5xl font-black text-white focus:ring-0 w-full tracking-tighter"
            />
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${clientEvaluation?.satisfactionLevel || 0}%` }}
                className="h-full bg-rc-teal shadow-[0_0_15px_rgba(59,188,169,0.5)]"
              />
            </div>
          </div>

          <div className="p-8 bg-black/20 rounded-[32px] border border-white/5 space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2.5">
              <TrendingUp size={12} /> Índice de Madurez
            </label>
            <select 
              value={clientEvaluation?.maturityIndex || 'Nivel 1: Inicial'}
              onChange={e => onUpdate({ maturityIndex: e.target.value as any })}
              className="organic-input w-full font-black uppercase tracking-widest text-rc-teal"
            >
              <option value="Nivel 1: Inicial">Nivel 1: Inicial</option>
              <option value="Nivel 2: Gestionado">Nivel 2: Gestionado</option>
              <option value="Nivel 3: Definido">Nivel 3: Definido</option>
              <option value="Nivel 4: Medido">Nivel 4: Medido</option>
              <option value="Nivel 5: Optimizado">Nivel 5: Optimizado</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-4 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <Activity size={24} className="text-rc-teal opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Análisis de Crecimiento</label>
            <textarea 
              value={clientEvaluation?.growthPotential || ''}
              onChange={e => onUpdate({ growthPotential: e.target.value })}
              placeholder="Identifique oportunidades de Upselling o Cross-selling..."
              className="organic-input w-full h-48 resize-none leading-relaxed pt-6"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationSection;
