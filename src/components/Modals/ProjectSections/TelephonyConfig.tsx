import React from 'react';
import { ClientService } from '../../../types/project';

interface Props {
  service: ClientService;
  index: number;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
}

const TelephonyConfig: React.FC<Props> = ({ service, index, onUpdate }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase">Extensiones</label>
        <input 
          type="number"
          value={service.extensionCount || 0}
          onChange={e => onUpdate(index, { extensionCount: parseInt(e.target.value) || 0 })}
          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs font-black"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase">Otros Detalles</label>
        <input 
          value={service.otherDetails || ''}
          onChange={e => onUpdate(index, { otherDetails: e.target.value })}
          className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs font-bold"
          placeholder="..."
        />
      </div>
    </div>
  );
};

export default TelephonyConfig;
