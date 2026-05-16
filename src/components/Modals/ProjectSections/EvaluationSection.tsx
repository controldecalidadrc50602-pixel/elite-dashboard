import React from 'react';
import { motion } from 'framer-motion';
import { QuarterlyAssessment } from '../../../types/project';

interface Props {
  quarterlyAssessment?: QuarterlyAssessment;
  onUpdate: (updates: Partial<QuarterlyAssessment>) => void;
}

const EvaluationSection: React.FC<Props> = ({ quarterlyAssessment, onUpdate }) => {
  const pillars = [
    { id: 'sla', label: 'SLA' },
    { id: 'comunicacion', label: 'Comunicación' },
    { id: 'resolucion', label: 'Resolución' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'continuidad', label: 'Continuidad' },
    { id: 'orden', label: 'Orden' },
    { id: 'conversion', label: 'Conversión' },
    { id: 'adaptacion', label: 'Adaptación' },
    { id: 'cultura', label: 'Cultura' },
    { id: 'valor', label: 'Valor' }
  ] as const;

  const handleRating = (pillarId: keyof QuarterlyAssessment, value: number) => {
    onUpdate({ [pillarId]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-16 py-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.4em] group-hover:text-rc-teal transition-colors">
                {pillar.label}
              </span>
              <p className="text-[9px] text-slate-700 font-medium uppercase tracking-widest opacity-40">Métrica Estratégica</p>
            </div>

            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRating(pillar.id, value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-500 ${
                    (quarterlyAssessment?.[pillar.id] || 0) >= value
                      ? 'bg-rc-teal border-rc-teal shadow-[0_0_15px_rgba(59,188,169,0.4)] scale-110'
                      : 'bg-transparent border-white/10 hover:border-rc-teal/30'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-12 bg-black/40 border border-white/5 rounded-[48px] text-center space-y-6">
        <h4 className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.6em]">Consolidado de Inteligencia</h4>
        <div className="flex items-center justify-center gap-10">
          <div className="text-center">
            <span className="block text-5xl font-light text-white tracking-tighter">
              {Math.round(
                Object.values(quarterlyAssessment || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / 10
              ) || 0}
            </span>
            <span className="text-[9px] font-medium text-rc-teal uppercase tracking-[0.3em] mt-2 block">Promedio General</span>
          </div>
          <div className="w-px h-16 bg-white/5" />
          <div className="text-center">
             <span className="block text-5xl font-light text-slate-600 tracking-tighter">10</span>
             <span className="text-[9px] font-medium text-slate-700 uppercase tracking-[0.3em] mt-2 block">Pilares Activos</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationSection;
