import React from 'react';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const BotmakerConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-bold text-slate-400 uppercase">Modalidad de Servicio</label>
      <div className="grid grid-cols-1 gap-2">
        {['Agentes Humanos + Chatbots', 'Agentes Humanos + Chatbots + Agente IA', 'Chatbots + Agente IA'].map(opt => (
          <button
            key={opt} type="button"
            onClick={() => onUpdate(index, { botmakerType: opt as any })}
            className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all text-left ${
              service.botmakerType === opt 
              ? 'bg-rc-teal text-black border-rc-teal shadow-lg shadow-rc-teal/20' 
              : 'bg-black/20 border-white/5 text-slate-400 hover:bg-white/5'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BotmakerConfig;
