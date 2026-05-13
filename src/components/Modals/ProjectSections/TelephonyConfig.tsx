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
      <div className="form-group">
        <label className="form-label !text-[10px]">Cantidad de Extensiones</label>
        <input 
          type="number"
          value={service.extensionCount || 0}
          onChange={e => onUpdate(index, { extensionCount: parseInt(e.target.value) || 0 })}
          className="w-full"
        />
      </div>
      <div className="form-group">
        <label className="form-label !text-[10px]">Especificaciones Técnicas</label>
        <input 
          value={service.otherDetails || ''}
          onChange={e => onUpdate(index, { otherDetails: e.target.value })}
          className="w-full"
          placeholder="Ej: Licencias remotas, IVR personalizado..."
        />
      </div>
    </div>
  );
};

export default TelephonyConfig;
