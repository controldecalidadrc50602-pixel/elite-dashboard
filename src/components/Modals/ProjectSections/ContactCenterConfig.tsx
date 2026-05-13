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
      <div className="form-group">
        <label className="form-label !text-[10px]">Posiciones HC</label>
        <input 
          type="number"
          value={service.positionsCount || 0}
          onChange={e => onUpdate(index, { positionsCount: parseInt(e.target.value) || 0 })}
          className="w-full text-center"
        />
      </div>
      <div className="form-group">
        <label className="form-label !text-[10px]">Franja Horaria</label>
        <input 
          value={service.workSchedule || ''}
          onChange={e => onUpdate(index, { workSchedule: e.target.value })}
          className="w-full"
          placeholder="Ej: 24/7 / L-V 08:00-17:00"
        />
      </div>
      <div className="form-group">
        <label className="form-label !text-[10px]">Modelo de Atención</label>
        <input 
          value={service.attentionType || ''}
          onChange={e => onUpdate(index, { attentionType: e.target.value })}
          className="w-full"
          placeholder="Ej: Multicanal / Omnicanal"
        />
      </div>
    </div>
  );
};

export default ContactCenterConfig;
