import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Wifi } from 'lucide-react';
import { TechDNA, Country, SipTrunkVirtual } from '../../../types/project';

interface Props {
  techDNA?: TechDNA;
  onUpdate: (updates: Partial<TechDNA>) => void;
}

const TechDNASection: React.FC<Props> = ({ techDNA, onUpdate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-12"
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-0.5 px-1 bg-rc-teal rounded-full shadow-[0_0_15px_rgba(59,188,169,0.5)]" />
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase glow-text">Tech DNA</h2>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[9px] ml-11">Infraestructura y Conectividad</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8 premium-card-v4">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Región / País</label>
            <div className="relative">
              <select 
                value={techDNA?.country || ''}
                onChange={e => onUpdate({ country: e.target.value as Country })}
                className="organic-input w-full pl-12 appearance-none cursor-pointer font-black uppercase tracking-widest"
              >
                <option value="">Seleccione País</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Venezuela">Venezuela</option>
              </select>
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-rc-teal" size={18} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Proveedor (ISP)</label>
            <div className="relative">
              <input 
                value={techDNA?.isp || ''}
                onChange={e => onUpdate({ isp: e.target.value })}
                placeholder="Ej: Liberty / Tigo"
                className="organic-input w-full pl-12 font-bold uppercase tracking-widest"
              />
              <Wifi className="absolute left-5 top-1/2 -translate-y-1/2 text-rc-teal" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Velocidad (Mbps)</label>
              <input 
                value={techDNA?.internetSpeed || ''}
                onChange={e => onUpdate({ internetSpeed: e.target.value })}
                className="organic-input w-full text-center font-black"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Tipo</label>
              <select 
                value={techDNA?.connectivityType || ''}
                onChange={e => onUpdate({ connectivityType: e.target.value as any })}
                className="organic-input w-full font-black uppercase tracking-widest"
              >
                <option value="Fibra Óptica">Fibra Óptica</option>
                <option value="Radiofrecuencia">Radiofrecuencia</option>
                <option value="Cobre">Cobre / HFC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6 backdrop-blur-xl">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Modelo Operativo</label>
            <select 
              value={techDNA?.operationMode || 'RC506'}
              onChange={e => onUpdate({ operationMode: e.target.value as any })}
              className="organic-input w-full font-black uppercase tracking-[0.1em] text-rc-teal"
            >
              <option value="RC506">Infraestructura RC506</option>
              <option value="WYP">Work Your Place (WYP)</option>
              <option value="IPBX">Central IPBX</option>
              <option value="HÍBRIDO">Modelo Híbrido</option>
            </select>

            <div className="flex items-center justify-between p-6 bg-black/20 rounded-[24px] border border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Redundancia</p>
                <p className="text-[8px] text-slate-600 font-medium uppercase tracking-widest">Enlace de respaldo</p>
              </div>
              <button 
                type="button"
                onClick={() => onUpdate({ redundancy: !techDNA?.redundancy })}
                className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${
                  techDNA?.redundancy ? 'bg-rc-teal' : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${techDNA?.redundancy ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[36px] space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Línea Telefónica</label>
              <input 
                value={techDNA?.phoneLine || ''}
                onChange={e => onUpdate({ phoneLine: e.target.value })}
                placeholder="Número o Identificador"
                className="organic-input w-full font-bold text-center"
              />
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[36px] space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Sip Trunk</label>
              <select 
                value={techDNA?.sipTrunkVirtual || 'N/A.'}
                onChange={e => onUpdate({ sipTrunkVirtual: e.target.value as SipTrunkVirtual })}
                className="organic-input w-full text-xs font-bold uppercase tracking-widest"
              >
                <option value="N/A.">N/A.</option>
                <option value="Navegalo">Navegalo</option>
                <option value="Vocex">Vocex</option>
                <option value="ICE">ICE</option>
                <option value="Call My Way">Call My Way</option>
                <option value="Callcentric">Callcentric</option>
                <option value="Voip.ms">Voip.ms</option>
                <option value="Movistar Vzla.">Movistar Vzla.</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TechDNASection;
