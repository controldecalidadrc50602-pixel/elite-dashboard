import React from 'react';
import { motion } from 'framer-motion';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const TrainingConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  const options = ['Disney', 'Calidad de Servicio', 'A medidas'];

  return (
    <div className="space-y-8">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Módulos Académicos</p>
      <div className="flex flex-wrap gap-4">
        {options.map(opt => (
          <button
            key={opt} type="button"
            onClick={() => onUpdate(index, { trainingType: opt as any })}
            className={`py-5 px-10 rounded-[28px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 relative overflow-hidden group ${
              service.trainingType === opt 
              ? 'text-black' 
              : 'text-slate-500 hover:text-white border border-white/5 hover:border-rc-teal/20'
            }`}
          >
            {service.trainingType === opt && (
              <motion.div 
                layoutId={`trainingType-${index}`}
                className="absolute inset-0 bg-rc-teal shadow-[0_10px_30px_rgba(59,188,169,0.3)]"
              />
            )}
            <span className="relative z-10">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrainingConfig;
