import React from 'react';
import { motion } from 'framer-motion';
import { TechDNA } from '../../../types/project';

interface Props {
  techDNA?: TechDNA;
  onUpdate: (updates: Partial<TechDNA>) => void;
}

const TechDNASection: React.FC<Props> = ({ techDNA, onUpdate }) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="section-title text-white">Tech DNA</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ADN Tecnológico.</p>
          </div>
        </div>
        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
          <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
            Registra la infraestructura de red, conectividad y redundancia que soporta la operación del cliente.
          </p>
        </div>
      </header>

      <div className="space-y-2">
        <label>Modalidad de Operación</label>
        <div className="flex gap-4">
          {['RC506', 'WYP', 'IPBX', 'HÍBRIDO'].map(mode => (
            <button
              key={mode} type="button"
              onClick={() => onUpdate({ operationMode: mode as any })}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                techDNA?.operationMode === mode 
                ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)] shadow-lg' 
                : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <label>Proveedor de Internet (ISP)</label>
          <input 
            value={techDNA?.isp || ''}
            onChange={e => onUpdate({ isp: e.target.value })}
            placeholder="Ej: Liberty / Telecable"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label>Velocidad Contratada (Mbps)</label>
          <input 
            value={techDNA?.internetSpeed || ''}
            onChange={e => onUpdate({ internetSpeed: e.target.value })}
            placeholder="Ej: 500/500 symmetrical"
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <label>Tipo de Conectividad</label>
          <select 
            value={techDNA?.connectivityType || 'Fibra Óptica'}
            onChange={e => onUpdate({ connectivityType: e.target.value as any })}
            className="w-full font-black uppercase tracking-widest cursor-pointer"
          >
            <option value="Fibra Óptica">Fibra Óptica</option>
            <option value="Radiofrecuencia">Radiofrecuencia</option>
            <option value="Cobre">Cobre</option>
          </select>
        </div>
        <div className="space-y-2">
          <label>Redundancia de Proveedor</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onUpdate({ redundancy: true })}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                techDNA?.redundancy 
                ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)]' 
                : 'bg-white/5 border-white/5 text-[var(--text-secondary)]'
              }`}
            >
              Sí, Tiene
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ redundancy: false })}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                !techDNA?.redundancy 
                ? 'bg-slate-800 text-white border-white/10' 
                : 'bg-white/5 border-white/5 text-[var(--text-secondary)]'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 p-8 bg-black/10 rounded-[32px] border border-white/5">
        <div className="space-y-2">
          <label>País de Operación</label>
          <select 
            value={techDNA?.country || 'Costa Rica'}
            onChange={e => onUpdate({ country: e.target.value as any })}
            className="w-full font-black uppercase tracking-widest cursor-pointer"
          >
            <option value="Costa Rica">Costa Rica</option>
            <option value="Venezuela">Venezuela</option>
          </select>
        </div>
        <div className="space-y-2">
          <label>SIP Trunk Virtual</label>
          <select 
            value={techDNA?.sipTrunkVirtual || 'N/A.'}
            onChange={e => onUpdate({ sipTrunkVirtual: e.target.value as any })}
            className="w-full font-black uppercase tracking-widest cursor-pointer"
          >
            {['Navegalo', 'Vocex', 'ICE', 'Call My Way', 'Callcentric', 'Voip.ms', 'Movistar Vzla.', 'N/A.'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 p-8 bg-black/10 rounded-[32px] border border-white/5">
        <label>Línea Telefónica / Troncal (ID Físico)</label>
        <input 
          value={techDNA?.phoneLine || ''}
          onChange={e => onUpdate({ phoneLine: e.target.value })}
          placeholder="Ej: Sip Trunk / Análoga / Cloud"
          className="w-full"
        />
      </div>
    </motion.div>
  );
};

export default TechDNASection;
