import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Activity, Zap, Shield } from 'lucide-react';
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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-16"
    >
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-1 px-1 bg-rc-teal rounded-full shadow-[0_0_20px_rgba(59,188,169,0.5)]" />
          <h2 className="text-5xl font-black tracking-tighter text-white uppercase glow-text">Operaciones</h2>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[11px] ml-16">Monitor de Capacidad y Resiliencia</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-20">
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6 p-10 bg-white/[0.02] border border-white/5 rounded-[48px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rc-teal/5 rounded-full blur-3xl group-hover:bg-rc-teal/10 transition-all duration-700" />
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <Zap size={14} className="text-rc-teal" /> Capacidad Contratada
              </label>
              <input 
                type="number" 
                value={opsPulse?.hcContracted || 0}
                onChange={e => onUpdate({ hcContracted: parseInt(e.target.value) || 0 })}
                className="bg-transparent border-none p-0 text-6xl font-black text-white focus:ring-0 w-full tracking-tighter"
              />
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Headcount en presupuesto</p>
            </div>

            <div className="space-y-6 p-10 bg-white/[0.02] border border-white/5 rounded-[48px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rc-turquoise/5 rounded-full blur-3xl group-hover:bg-rc-turquoise/10 transition-all duration-700" />
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <Activity size={14} className="text-rc-turquoise" /> Capacidad Real
              </label>
              <input 
                type="number" 
                value={opsPulse?.hcReal || 0}
                onChange={e => onUpdate({ hcReal: parseInt(e.target.value) || 0 })}
                className="bg-transparent border-none p-0 text-6xl font-black text-rc-teal focus:ring-0 w-full tracking-tighter glow-text"
              />
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Personal activo en producción</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter glow-text">Matriz de Turnos</h3>
              <button 
                type="button" onClick={addShift}
                className="w-12 h-12 flex items-center justify-center bg-rc-teal/10 text-rc-teal rounded-2xl hover:bg-rc-teal border border-rc-teal/20 hover:text-black transition-all duration-500"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {opsPulse?.shifts?.map((shift, idx) => (
                <motion.div 
                  layout
                  key={shift.id} 
                  className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between gap-10 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                    <span className="text-[12px] font-black text-rc-teal uppercase tracking-[0.3em]">{shift.name}</span>
                    <input 
                      value={shift.timeRange}
                      onChange={e => updateShift(idx, { timeRange: e.target.value })}
                      className="bg-transparent border-none p-0 text-lg font-bold text-white focus:ring-0 uppercase tracking-widest w-full"
                    />
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest shrink-0">Dotación Pax</span>
                      <input 
                        type="number" value={shift.peopleCount}
                        onChange={e => updateShift(idx, { peopleCount: parseInt(e.target.value) || 0 })}
                        className="bg-transparent border-none p-0 text-xl font-black text-rc-teal focus:ring-0 w-full"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" onClick={() => removeShift(shift.id)}
                    className="w-12 h-12 flex items-center justify-center text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[56px] space-y-10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rc-teal/30 to-transparent" />
            <div className="text-center space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center justify-center gap-3 mb-6">
                <Shield size={16} className="text-rc-teal" /> Contingencia
              </label>
            </div>
            <div className="flex flex-col gap-4">
              {['Disponible', 'En Uso', 'Crítico'].map(status => (
                <button
                  key={status} type="button"
                  onClick={() => onUpdate({ backupStatus: status as any })}
                  className={`py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 relative overflow-hidden group/btn ${
                    opsPulse?.backupStatus === status 
                    ? 'text-black' 
                    : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {opsPulse?.backupStatus === status && (
                    <motion.div 
                      layoutId="backupStatus"
                      className={`absolute inset-0 shadow-lg ${
                        status === 'Disponible' ? 'bg-emerald-400 shadow-emerald-400/30' :
                        status === 'En Uso' ? 'bg-amber-400 shadow-amber-400/30' : 'bg-rose-500 shadow-rose-500/30'
                      }`}
                    />
                  )}
                  <span className="relative z-10 transition-transform duration-500 group-hover/btn:scale-110">{status}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-10 bg-rc-teal/5 border border-rc-teal/10 rounded-[48px] space-y-6">
             <p className="text-[11px] font-black text-rc-teal uppercase tracking-[0.3em] text-center">Análisis de Estabilidad</p>
             <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-white glow-text">{( (opsPulse?.hcReal || 0) / (opsPulse?.hcContracted || 1) * 100).toFixed(0)}%</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Eficiencia</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OpsPulseSection;
