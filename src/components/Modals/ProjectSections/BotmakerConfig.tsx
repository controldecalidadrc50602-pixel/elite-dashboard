import React from 'react';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const BotmakerConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  return (
    <div className="space-y-6">
      <label className="form-label !text-[10px]">Arquitectura de Inteligencia</label>
      <div className="grid grid-cols-1 gap-4">
        {[
          'Agentes Humanos + Chatbots', 
          'Agentes Humanos + Chatbots + Agente IA', 
          'Chatbots + Agente IA'
        ].map(opt => (
          <button
            key={opt} type="button"
            onClick={() => onUpdate(index, { botmakerType: opt as any })}
            className={`py-5 px-8 rounded-3xl text-[11px] font-black uppercase tracking-[0.1em] border transition-all duration-300 text-left flex items-center justify-between group ${
              service.botmakerType === opt 
              ? 'bg-rc-teal text-black border-rc-teal shadow-[0_10px_30px_rgba(59,188,169,0.3)]' 
              : 'bg-black/40 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <span>{opt}</span>
            {service.botmakerType === opt && (
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BotmakerConfig;
