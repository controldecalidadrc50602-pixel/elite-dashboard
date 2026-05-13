import React from 'react';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const ContactCenterConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase">Posiciones</label>
        <input 
          type="number"
          value={service.positionsCount || 0}
          onChange={e => onUpdate(index, { positionsCount: parseInt(e.target.value) || 0 })}
          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs font-black"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase">Horario</label>
        <input 
          value={service.workSchedule || ''}
          onChange={e => onUpdate(index, { workSchedule: e.target.value })}
          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs font-bold"
          placeholder="Ej: 24/7"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase">Tipo Atención</label>
        <input 
          value={service.attentionType || ''}
          onChange={e => onUpdate(index, { attentionType: e.target.value })}
          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs font-bold"
          placeholder="Ej: Multicanal"
        />
      </div>
    </div>
  );
};

export default ContactCenterConfig;
