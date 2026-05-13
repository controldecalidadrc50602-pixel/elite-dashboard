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
      exit={{ opacity: 0, x: -20 }} 
      className="section-container"
    >
      <header className="flex items-start justify-between mb-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Tech DNA</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Infraestructura y Conectividad Crítica</p>
          </div>
        </div>
        <div className="max-w-[340px] p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[32px]">
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Defina el ecosistema tecnológico que soporta la operación, asegurando redundancia y estabilidad de red.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 premium-card-v4">
        <div className="space-y-10">
          <div className="form-group">
            <label className="form-label">Región / País de Operación</label>
            <div className="relative">
              <select 
                value={techDNA?.country || ''}
                onChange={e => onUpdate({ country: e.target.value as Country })}
                className="w-full text-lg font-black uppercase tracking-widest pl-16 appearance-none cursor-pointer"
              >
                <option value="">Seleccione País</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Venezuela">Venezuela</option>
              </select>
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-rc-teal" size={24} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Proveedor de Internet (ISP)</label>
            <div className="relative">
              <input 
                value={techDNA?.isp || ''}
                onChange={e => onUpdate({ isp: e.target.value })}
                placeholder="Ej: Liberty Business / Tigo"
                className="w-full text-lg font-black uppercase tracking-widest pl-16"
              />
              <Wifi className="absolute left-6 top-1/2 -translate-y-1/2 text-rc-teal" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="form-group">
              <label className="form-label">Ancho de Banda (Mbps)</label>
              <input 
                value={techDNA?.internetSpeed || ''}
                onChange={e => onUpdate({ internetSpeed: e.target.value })}
                placeholder="Ej: 500/500"
                className="w-full text-center text-xl font-black"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de Conectividad</label>
              <select 
                value={techDNA?.connectivityType || ''}
                onChange={e => onUpdate({ connectivityType: e.target.value as any })}
                className="w-full font-black uppercase tracking-widest"
              >
                <option value="Fibra Óptica">Fibra Óptica</option>
                <option value="Radiofrecuencia">Radiofrecuencia</option>
                <option value="Cobre">Cobre / HFC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="form-group">
            <label className="form-label">Modalidad de Operación</label>
            <select 
              value={techDNA?.operationMode || 'RC506'}
              onChange={e => onUpdate({ operationMode: e.target.value as any })}
              className="w-full font-black uppercase tracking-[0.1em] text-rc-teal py-6"
            >
              <option value="RC506">Infraestructura RC506</option>
              <option value="WYP">Work Your Place (WYP)</option>
              <option value="IPBX">Central IPBX</option>
              <option value="HÍBRIDO">Modelo Híbrido</option>
            </select>
          </div>

          <div className="p-10 bg-black/40 border border-white/10 rounded-[48px] space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[12px] font-black text-white uppercase tracking-widest">Esquema de Redundancia</p>
                <p className="text-[10px] text-slate-500 font-medium">¿Cuenta con enlace de respaldo activo?</p>
              </div>
              <button 
                type="button"
                onClick={() => onUpdate({ redundancy: !techDNA?.redundancy })}
                className={`w-20 h-10 rounded-full p-1 transition-all duration-500 border ${
                  techDNA?.redundancy 
                  ? 'bg-rc-teal border-rc-teal' 
                  : 'bg-white/5 border-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full bg-white transition-all duration-500 transform ${techDNA?.redundancy ? 'translate-x-10' : 'translate-x-0'} shadow-xl`} />
              </button>
            </div>

            <div className="flex items-center gap-6 p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[32px]">
              <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal">
                <Shield size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-rc-teal uppercase tracking-widest">Seguridad de Enlace</p>
                <p className="text-[12px] font-bold text-white uppercase">{techDNA?.redundancy ? 'Nivel de Resiliencia: ALTO' : 'Nivel de Resiliencia: ESTÁNDAR'}</p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sip Trunk / Telefonía Virtual</label>
            <select 
              value={techDNA?.sipTrunkVirtual || 'N/A.'}
              onChange={e => onUpdate({ sipTrunkVirtual: e.target.value as SipTrunkVirtual })}
              className="w-full text-sm font-bold uppercase tracking-widest"
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
    </motion.div>
  );
};

export default TechDNASection;
