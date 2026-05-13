import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Activity } from 'lucide-react';
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
      name: `TURNO ${String.fromCharCode(65 + newShifts.length)}`, 
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
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="section-container"
    >
      <header className="flex items-start justify-between mb-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Pulso Operativo</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Estado de Recursos y HC</p>
          </div>
        </div>
        <div className="max-w-[340px] p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[32px]">
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Supervise la capacidad instalada y la matriz de turnos para asegurar la continuidad del servicio contratado.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-16 premium-card-v4">
        <div className="space-y-10">
          <div className="form-group">
            <label className="form-label">Modelo de Negocio / Tipo de Operación</label>
            <div className="grid grid-cols-2 gap-4">
              {['Servicio al Cliente', 'Ventas', 'Cobranza', 'Soporte Técnico'].map(type => {
                const isSelected = (opsPulse?.operationType || '').includes(type);
                return (
                  <button
                    key={type} type="button"
                    onClick={() => toggleOperationType(type)}
                    className={`py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      isSelected 
                      ? 'bg-rc-teal text-black border-rc-teal shadow-lg shadow-rc-teal/20' 
                      : 'bg-black/40 border-white/5 text-slate-400 hover:bg-black/60 hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            <div className="p-6 bg-rc-teal/5 border border-rc-teal/20 rounded-[32px] mt-6 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-rc-teal/10 flex items-center justify-center text-rc-teal">
                <Activity size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-rc-teal uppercase tracking-widest">Enfoque Seleccionado</p>
                <p className="text-[14px] font-black text-white uppercase">{(opsPulse?.operationType || 'Pendiente de Definir')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="form-group">
              <label className="form-label">HC Contratado (Presupuesto)</label>
              <input 
                type="number" 
                value={opsPulse?.hcContracted || 0}
                onChange={e => onUpdate({ hcContracted: parseInt(e.target.value) || 0 })}
                className="w-full text-2xl font-black text-center py-8"
              />
            </div>
            <div className="form-group">
              <label className="form-label">HC Real (Producción)</label>
              <input 
                type="number" 
                value={opsPulse?.hcReal || 0}
                onChange={e => onUpdate({ hcReal: parseInt(e.target.value) || 0 })}
                className="w-full text-2xl font-black text-center py-8 text-rc-teal"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8 p-10 bg-black/40 rounded-[48px] border border-white/10 shadow-2xl">
          <label className="form-label text-center">Protocolo de Contingencia</label>
          <div className="flex flex-col gap-4">
            {['Disponible', 'En Uso', 'Crítico'].map(status => (
              <button
                key={status} type="button"
                onClick={() => onUpdate({ backupStatus: status as any })}
                className={`py-5 rounded-[28px] text-[11px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  opsPulse?.backupStatus === status 
                  ? 'bg-rc-turquoise text-black border-rc-turquoise shadow-[0_10px_30px_rgba(79,209,197,0.2)]' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Cronograma de Turnos</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distribución Horaria del Talento</p>
          </div>
          <button 
            type="button"
            onClick={addShift}
            className="px-8 py-4 bg-rc-teal/10 border border-rc-teal/20 text-rc-teal rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-rc-teal/20 transition-all shadow-lg"
          >
            <Plus size={18} /> Añadir Turno
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {opsPulse?.shifts?.map((shift, idx) => (
            <div key={shift.id} className="p-8 bg-black/40 border border-white/10 rounded-[40px] flex items-center justify-between gap-10 relative group hover:border-rc-teal/30 transition-all">
              <div className="flex-1 grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{shift.name}</span>
                  <input 
                    value={shift.timeRange}
                    onChange={e => updateShift(idx, { timeRange: e.target.value })}
                    className="bg-transparent border-none p-0 text-base font-black uppercase tracking-widest focus:ring-0 w-full text-white"
                  />
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Dotación (Pax)</span>
                  <input 
                    type="number" 
                    value={shift.peopleCount}
                    onChange={e => updateShift(idx, { peopleCount: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none p-0 text-base font-black focus:ring-0 w-full text-rc-teal"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={() => removeShift(shift.id)}
                className="w-12 h-12 flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-500/10 rounded-2xl"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OpsPulseSection;
