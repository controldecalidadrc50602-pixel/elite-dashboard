import React from 'react';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const ContactCenterConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Posiciones HC</label>
        <input 
          type="number"
          value={service.positionsCount || 0}
          onChange={e => onUpdate(index, { positionsCount: parseInt(e.target.value) || 0 })}
          className="organic-input w-full text-xl font-black uppercase tracking-tighter text-center text-rc-teal"
        />
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Franja Horaria</label>
        <input 
          value={service.workSchedule || ''}
          onChange={e => onUpdate(index, { workSchedule: e.target.value })}
          className="organic-input w-full text-[11px] font-black uppercase tracking-widest"
          placeholder="Ej: 24/7 / L-V"
        />
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Modelo de Atención</label>
        <input 
          value={service.attentionType || ''}
          onChange={e => onUpdate(index, { attentionType: e.target.value })}
          className="organic-input w-full text-[11px] font-black uppercase tracking-widest"
          placeholder="Ej: Multicanal"
        />
      </div>
    </div>
  );
};

export default ContactCenterConfig;
