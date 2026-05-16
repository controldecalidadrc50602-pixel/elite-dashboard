import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Activity, Zap, Shield } from 'lucide-react';
import { OperationPulse } from '../../../types/project';

interface Props {
  opsPulse?: OperationPulse;
  onUpdate: (updates: Partial<OperationPulse>) => void;
}

const OpsPulseSection: React.FC<Props> = ({ opsPulse, onUpdate }) => {
  // ... (funciones omitidas para brevedad, asumiendo que el buscador de reemplazo manejará el contexto)
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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-16 font-light"
    >
      {/* Operaciones - Métricas de Capacidad */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 pb-12 border-b border-white/5">
        <div className="w-full md:w-1/3 space-y-6">
          <label className="text-sm font-light text-slate-500 uppercase tracking-[0.3em] block mb-4">
            HC Contratado
          </label>
          <div className="flex items-baseline gap-4">
            <input 
              type="number" 
              value={opsPulse?.hcContracted || 0}
              onChange={e => onUpdate({ hcContracted: parseInt(e.target.value) || 0 })}
              className="bg-transparent border-none p-0 text-6xl font-light text-white focus:ring-0 w-32 tracking-tighter"
            />
            <span className="text-slate-600 text-sm uppercase tracking-widest">Posiciones</span>
          </div>
          <p className="text-[10px] text-slate-700 uppercase tracking-widest font-medium">Capacidad teórica en presupuesto</p>
        </div>

        <div className="hidden md:block w-px h-24 bg-white/5" />

        <div className="w-full md:w-1/3 space-y-6">
          <label className="text-sm font-light text-slate-500 uppercase tracking-[0.3em] block mb-4">
            HC Real (Activo)
          </label>
          <div className="flex items-baseline gap-4">
            <input 
              type="number" 
              value={opsPulse?.hcReal || 0}
              onChange={e => onUpdate({ hcReal: parseInt(e.target.value) || 0 })}
              className="bg-transparent border-none p-0 text-6xl font-light text-rc-teal focus:ring-0 w-32 tracking-tighter glow-text"
            />
            <span className="text-rc-teal/40 text-sm uppercase tracking-widest font-medium">Efectivo</span>
          </div>
          <p className="text-[10px] text-slate-700 uppercase tracking-widest font-medium">Personal validado en producción</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-16">
        <div className="space-y-12">
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-light text-white tracking-tight">Matriz de Turnos</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Distribución horaria de la carga</p>
              </div>
              <button 
                type="button" onClick={addShift}
                className="px-6 py-2 bg-white/5 text-white rounded-full hover:bg-white/10 border border-white/10 transition-all text-xs font-light tracking-wide"
              >
                + Añadir Turno
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opsPulse?.shifts?.map((shift, idx) => (
                <motion.div 
                  layout
                  key={shift.id} 
                  className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6 hover:bg-white/[0.04] transition-all duration-500 group relative"
                >
                  <button 
                    type="button" onClick={() => removeShift(shift.id)}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-rose-500/20 hover:text-rose-500 transition-all"
                  >
                    <X size={14} />
                  </button>

                  <div className="space-y-2">
                    <input 
                      value={shift.name}
                      onChange={e => updateShift(idx, { name: e.target.value })}
                      className="bg-transparent border-none p-0 text-xs font-medium text-rc-teal uppercase tracking-[0.2em] focus:ring-0 w-full"
                    />
                    <input 
                      value={shift.timeRange}
                      onChange={e => updateShift(idx, { timeRange: e.target.value })}
                      className="bg-transparent border-none p-0 text-xl font-light text-white focus:ring-0 w-full tracking-tight"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">Headcount</span>
                    <input 
                      type="number" value={shift.peopleCount}
                      onChange={e => updateShift(idx, { peopleCount: parseInt(e.target.value) || 0 })}
                      className="bg-transparent border-none p-0 text-2xl font-light text-white focus:ring-0 w-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] block text-center">Estado de Contingencia</label>
            <div className="flex justify-center gap-4">
              {['Disponible', 'En Uso', 'Crítico'].map(status => (
                <button
                  key={status} type="button"
                  onClick={() => onUpdate({ backupStatus: status as any })}
                  className={`px-6 py-3 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ${
                    opsPulse?.backupStatus === status 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] flex flex-col items-center justify-center space-y-4">
             <p className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.3em]">Eficiencia Operativa</p>
             <div className="flex items-baseline gap-2">
                <span className="text-5xl font-light text-rc-teal glow-text">{( (opsPulse?.hcReal || 0) / (opsPulse?.hcContracted || 1) * 100).toFixed(0)}%</span>
                <span className="text-slate-600 text-sm uppercase tracking-widest">Capacidad</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OpsPulseSection;
