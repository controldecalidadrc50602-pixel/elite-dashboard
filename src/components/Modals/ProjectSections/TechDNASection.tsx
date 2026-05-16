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
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-16 font-light"
    >
      {/* Trellis Design Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* Región y Conectividad */}
        <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-rc-teal mb-2">
            <Globe size={28} />
          </div>
          <div className="space-y-6 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em]">Ubicación Geográfica</label>
              <select 
                value={techDNA?.country || ''}
                onChange={e => onUpdate({ country: e.target.value as Country })}
                className="bg-transparent border-none p-0 text-xl font-light text-white focus:ring-0 w-full text-center appearance-none"
              >
                <option value="" className="bg-[#0A0A0C]">País</option>
                <option value="Costa Rica" className="bg-[#0A0A0C]">Costa Rica</option>
                <option value="Venezuela" className="bg-[#0A0A0C]">Venezuela</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em]">Proveedor ISP</label>
              <input 
                value={techDNA?.isp || ''}
                onChange={e => onUpdate({ isp: e.target.value })}
                placeholder="LIBERTY / TIGO"
                className="bg-transparent border-none p-0 text-xl font-light text-rc-teal focus:ring-0 w-full text-center placeholder:text-rc-teal/20"
              />
            </div>
          </div>
        </div>

        {/* Infraestructura de Red */}
        <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-rc-teal mb-2">
            <Wifi size={28} />
          </div>
          <div className="space-y-6 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em]">Ancho de Banda (Mbps)</label>
              <input 
                type="number"
                value={techDNA?.internetSpeed || ''}
                onChange={e => onUpdate({ internetSpeed: e.target.value })}
                className="bg-transparent border-none p-0 text-4xl font-light text-white focus:ring-0 w-full text-center tracking-tighter"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em]">Tecnología de Enlace</label>
              <select 
                value={techDNA?.connectivityType || ''}
                onChange={e => onUpdate({ connectivityType: e.target.value as any })}
                className="bg-transparent border-none p-0 text-sm font-medium text-slate-400 uppercase tracking-widest focus:ring-0 w-full text-center appearance-none"
              >
                <option value="Fibra Óptica" className="bg-[#0A0A0C]">Fibra Óptica</option>
                <option value="Radiofrecuencia" className="bg-[#0A0A0C]">Radiofrecuencia</option>
                <option value="Cobre" className="bg-[#0A0A0C]">HFC / Cobre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seguridad y Telefonía */}
        <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-rc-teal mb-2">
            <Shield size={28} />
          </div>
          <div className="space-y-6 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em]">Línea SIP / Telefonía</label>
              <select 
                value={techDNA?.sipTrunkVirtual || 'N/A.'}
                onChange={e => onUpdate({ sipTrunkVirtual: e.target.value as SipTrunkVirtual })}
                className="bg-transparent border-none p-0 text-xl font-light text-white focus:ring-0 w-full text-center appearance-none"
              >
                <option value="N/A." className="bg-[#0A0A0C]">N/A.</option>
                <option value="Navegalo" className="bg-[#0A0A0C]">Navegalo</option>
                <option value="Vocex" className="bg-[#0A0A0C]">Vocex</option>
                <option value="ICE" className="bg-[#0A0A0C]">ICE</option>
                <option value="Call My Way" className="bg-[#0A0A0C]">Call My Way</option>
              </select>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="space-y-1">
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Redundancia</p>
                <button 
                  type="button"
                  onClick={() => onUpdate({ redundancy: !techDNA?.redundancy })}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    techDNA?.redundancy ? 'text-rc-teal' : 'text-slate-700'
                  }`}
                >
                  {techDNA?.redundancy ? 'ACTIVA' : 'INACTIVA'}
                </button>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="space-y-1">
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Identificador</p>
                <input 
                  value={techDNA?.phoneLine || ''}
                  onChange={e => onUpdate({ phoneLine: e.target.value })}
                  placeholder="LINE #"
                  className="bg-transparent border-none p-0 text-[10px] font-bold text-white focus:ring-0 w-20 text-center placeholder:text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modelo Operativo - Highlight */}
      <div className="max-w-2xl mx-auto p-12 bg-white/[0.01] border border-white/5 rounded-[50px] flex flex-col items-center text-center space-y-6">
        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em]">Arquitectura del Modelo Operativo</label>
        <select 
          value={techDNA?.operationMode || 'RC506'}
          onChange={e => onUpdate({ operationMode: e.target.value as any })}
          className="bg-transparent border-none p-0 text-3xl font-light text-white focus:ring-0 text-center appearance-none cursor-pointer hover:text-rc-teal transition-colors"
        >
          <option value="RC506" className="bg-[#0A0A0C]">Infraestructura Propia RC506</option>
          <option value="WYP" className="bg-[#0A0A0C]">Work Your Place (WYP)</option>
          <option value="IPBX" className="bg-[#0A0A0C]">Central IPBX Virtual</option>
          <option value="HÍBRIDO" className="bg-[#0A0A0C]">Ecosistema Híbrido</option>
        </select>
        <div className="h-px w-24 bg-rc-teal/30" />
      </div>
    </motion.div>
  );
};

export default TechDNASection;
