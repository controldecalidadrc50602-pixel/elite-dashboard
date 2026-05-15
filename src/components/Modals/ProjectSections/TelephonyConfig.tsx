import React from 'react';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const TelephonyConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Cantidad de Extensiones</label>
        <input 
          type="number"
          value={service.extensionCount || 0}
          onChange={e => onUpdate(index, { extensionCount: parseInt(e.target.value) || 0 })}
          className="organic-input w-full text-xl font-black uppercase tracking-tighter text-rc-teal"
        />
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Especificaciones Técnicas</label>
        <input 
          value={service.otherDetails || ''}
          onChange={e => onUpdate(index, { otherDetails: e.target.value })}
          className="organic-input w-full text-xs font-black uppercase tracking-[0.1em]"
          placeholder="Ej: Licencias remotas, IVR..."
        />
      </div>
    </div>
  );
};

export default TelephonyConfig;
