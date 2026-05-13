import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { OperationPulse } from '../../../types/project';

interface Props {
  opsPulse?: OperationPulse;
  onUpdate: (updates: Partial<OperationPulse>) => void;
}

const OpsPulseSection: React.FC<Props> = ({ opsPulse, onUpdate }) => {
  const addShift = () => {
    const newShifts = [...(opsPulse?.shifts || [])];
    newShifts.push({ 
      id: Math.random().toString(36).substr(2, 9), 
      name: `Turno ${String.fromCharCode(65 + newShifts.length)}`, 
      timeRange: '08:00 - 17:00', 
      peopleCount: 0 
    });
    onUpdate({ shifts: newShifts });
  };

  const updateShift = (index: number, updates: any) => {
    const s = [...(opsPulse?.shifts || [])];
    s[index] = { ...s[index], ...updates };
    onUpdate({ shifts: s });
  };

  const removeShift = (id: string) => {
    onUpdate({ shifts: opsPulse?.shifts?.filter(s => s.id !== id) });
  };

  const toggleOperationType = (type: string) => {
    const currentTypes = (opsPulse?.operationType || '').split(',').map(t => t.trim()).filter(Boolean);
    let newTypes;
    if (currentTypes.includes(type)) {
      newTypes = currentTypes.filter(t => t !== type);
    } else {
      newTypes = [...currentTypes, type];
    }
    onUpdate({ operationType: newTypes.join(', ') });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="section-title text-white">Pulso Operativo</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado y Recursos.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Operación</label>
            <div className="grid grid-cols-2 gap-3">
              {['Servicio al Cliente', 'Ventas', 'Cobranza', 'Soporte Técnico'].map(type => {
                const isSelected = (opsPulse?.operationType || '').includes(type);
                return (
                  <button
                    key={type} type="button"
                    onClick={() => toggleOperationType(type)}
                    className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      isSelected 
                      ? 'bg-rc-teal text-black border-rc-teal shadow-lg shadow-rc-teal/20' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            <div className="p-4 bg-rc-teal/5 border border-rc-teal/20 rounded-2xl">
              <p className="text-[10px] font-black text-rc-teal uppercase tracking-widest mb-1">Resumen de Operación</p>
              <p className="text-[11px] font-bold text-white">{(opsPulse?.operationType || 'No especificado')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label>Personal Contratado (Plan)</label>
              <input 
                type="number" value={opsPulse?.hcContracted || 0}
                onChange={e => onUpdate({ hcContracted: parseInt(e.target.value) || 0 })}
                className="w-full text-lg font-black"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label>Personal Real (En Piso)</label>
              <input 
                type="number" value={opsPulse?.hcReal || 0}
                onChange={e => onUpdate({ hcReal: parseInt(e.target.value) || 0 })}
                className="w-full text-lg font-black"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 p-8 bg-black/10 rounded-[40px] border border-white/5">
          <label>Estatus de Backup (Contingencia)</label>
          <div className="flex flex-col gap-3">
            {['Disponible', 'En Uso', 'Crítico'].map(status => (
              <button
                key={status} type="button"
                onClick={() => onUpdate({ backupStatus: status as any })}
                className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  opsPulse?.backupStatus === status 
                  ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)] shadow-lg' 
                  : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label>Matriz de Horarios y Turnos</label>
          <button 
            type="button"
            onClick={addShift}
            className="text-[var(--rc-turquoise)] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-[var(--rc-turquoise)]/10 rounded-xl hover:bg-[var(--rc-turquoise)]/20 transition-all"
          >
            <Plus size={14} /> Configurar Turnos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opsPulse?.shifts?.map((shift, idx) => (
            <div key={shift.id} className="p-6 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-between gap-6 relative group">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{shift.name}</span>
                  <input 
                    value={shift.timeRange}
                    onChange={e => updateShift(idx, { timeRange: e.target.value })}
                    className="bg-transparent border-none p-0 text-xs font-black uppercase tracking-widest focus:ring-0 w-full"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Personal</span>
                  <input 
                    type="number" value={shift.peopleCount}
                    onChange={e => updateShift(idx, { peopleCount: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none p-0 text-xs font-black focus:ring-0 w-full"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={() => removeShift(shift.id)}
                className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OpsPulseSection;
