import React from 'react';
import { motion } from 'framer-motion';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const BotmakerConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  const options = [
    'Agentes Humanos + Chatbots', 
    'Agentes Humanos + Chatbots + Agente IA', 
    'Chatbots + Agente IA'
  ];

  return (
    <div className="space-y-8">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Arquitectura Operativa</p>
      <div className="flex flex-col gap-3">
        {options.map(opt => (
          <button
            key={opt} type="button"
            onClick={() => onUpdate(index, { botmakerType: opt as any })}
            className={`py-5 px-8 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 text-left relative overflow-hidden group ${
              service.botmakerType === opt 
              ? 'text-black' 
              : 'text-slate-500 hover:text-white border border-white/5 hover:border-rc-teal/20'
            }`}
          >
            {service.botmakerType === opt && (
              <motion.div 
                layoutId={`botmakerType-${index}`}
                className="absolute inset-0 bg-rc-teal shadow-[0_10px_30px_rgba(59,188,169,0.3)]"
              />
            )}
            <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-2 block">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BotmakerConfig;
