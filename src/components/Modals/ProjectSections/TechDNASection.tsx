import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Wifi } from 'lucide-react';
import { TechDNA, Country, SipTrunkVirtual } from '../../../types/project';

interface Props {
  techDNA?: TechDNA;
  onUpdate: (updates: Partial<TechDNA>) => void;
}

const TechDNASection: React.FC<Props> = ({ techDNA, onUpdate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  
  const options = [
    { value: 'RC506', label: 'Rc506' },
    { value: 'WYP', label: 'WYP' },
    { value: 'IPBX', label: 'IPBX Central' },
    { value: 'HÍBRIDO', label: 'Híbrido' }
  ];

  const currentOption = options.find(o => o.value === (techDNA?.operationMode || 'RC506')) || options[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10 font-light"
    >
      {/* Trellis Design Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* Región y Conectividad */}
        <div className="p-10 bg-black/40 border border-white/5 rounded-[40px] space-y-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-rc-teal mb-2">
            <Globe size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-6 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em]">Ubicación</label>
              <select 
                value={techDNA?.country || ''}
                onChange={e => onUpdate({ country: e.target.value as Country })}
                className="bg-transparent border-none p-0 text-xl font-light text-white focus:ring-0 w-full text-center appearance-none"
              >
                <option value="" className="bg-[#000000]">Seleccionar País</option>
                <option value="Costa Rica" className="bg-[#000000]">Costa Rica</option>
                <option value="Venezuela" className="bg-[#000000]">Venezuela</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em]">ISP Provider</label>
              <input 
                value={techDNA?.isp || ''}
                onChange={e => onUpdate({ isp: e.target.value })}
                placeholder="LIBERTY / TIGO"
                className="bg-transparent border-none p-0 text-xl font-light text-rc-teal focus:ring-0 w-full text-center placeholder:text-rc-teal/10 uppercase tracking-tight"
              />
            </div>
          </div>
        </div>

        {/* Infraestructura de Red */}
        <div className="p-10 bg-black/40 border border-white/5 rounded-[40px] space-y-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-rc-teal mb-2">
            <Wifi size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-6 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em]">Ancho de Banda</label>
              <input 
                type="number"
                value={techDNA?.internetSpeed || ''}
                onChange={e => onUpdate({ internetSpeed: e.target.value })}
                className="bg-transparent border-none p-0 text-4xl font-light text-white focus:ring-0 w-full text-center tracking-tighter"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em]">Tipo de Enlace</label>
              <select 
                value={techDNA?.connectivityType || ''}
                onChange={e => onUpdate({ connectivityType: e.target.value as any })}
                className="bg-transparent border-none p-0 text-sm font-medium text-slate-500 uppercase tracking-[0.3em] focus:ring-0 w-full text-center appearance-none"
              >
                <option value="Fibra Óptica" className="bg-[#000000]">Fibra Óptica</option>
                <option value="Radiofrecuencia" className="bg-[#000000]">Radiofrecuencia</option>
                <option value="Cobre" className="bg-[#000000]">HFC / Cobre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seguridad y Telefonía */}
        <div className="p-10 bg-black/40 border border-white/5 rounded-[40px] space-y-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-rc-teal mb-2">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-6 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.5em]">Trunk SIP</label>
              <select 
                value={techDNA?.sipTrunkVirtual || 'N/A.'}
                onChange={e => onUpdate({ sipTrunkVirtual: e.target.value as SipTrunkVirtual })}
                className="bg-transparent border-none p-0 text-xl font-light text-white focus:ring-0 w-full text-center appearance-none"
              >
                <option value="N/A." className="bg-[#000000]">N/A.</option>
                <option value="Navegalo" className="bg-[#000000]">Navegalo</option>
                <option value="Vocex" className="bg-[#000000]">Vocex</option>
                <option value="ICE" className="bg-[#000000]">ICE</option>
                <option value="Call My Way" className="bg-[#000000]">Call My Way</option>
              </select>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="space-y-2">
                <p className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.4em] text-center">Redundancia</p>
                <button 
                  type="button"
                  onClick={() => onUpdate({ redundancy: !techDNA?.redundancy })}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                    techDNA?.redundancy ? 'text-rc-teal' : 'text-slate-800'
                  }`}
                >
                  {techDNA?.redundancy ? 'ACTIVE' : 'NONE'}
                </button>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="space-y-2">
                <p className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.4em] text-center">Pilot ID</p>
                <input 
                  value={techDNA?.phoneLine || ''}
                  onChange={e => onUpdate({ phoneLine: e.target.value })}
                  placeholder="LINE #"
                  className="bg-transparent border-none p-0 text-[10px] font-bold text-white focus:ring-0 w-20 text-center placeholder:text-slate-900 tracking-widest"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modelo Operativo - Zoho Style Custom Dropdown */}
      <div className="max-w-2xl mx-auto p-12 bg-[#000000] border border-white/5 rounded-[48px] flex flex-col items-center text-center space-y-6 shadow-2xl">
        <label className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.6em]">Arquitectura del Modelo</label>
        
        <div className="relative w-full max-w-xs">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full py-4 text-3xl font-light text-white transition-all flex items-center justify-center gap-4 group border-b-2 ${isDropdownOpen ? 'border-rc-teal text-rc-teal' : 'border-transparent'}`}
          >
            {currentOption.label}
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              className={`${isDropdownOpen ? 'text-rc-teal' : 'text-slate-700'}`}
            >
              <Shield size={20} strokeWidth={1.5} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 left-1/2 -translate-x-1/2 mt-6 w-64 bg-[#000000] border border-rc-teal/30 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden py-4"
              >
                {options.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onUpdate({ operationMode: option.value as any });
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-8 py-4 text-[13px] font-medium text-center transition-all ${
                      techDNA?.operationMode === option.value 
                      ? 'text-rc-teal bg-rc-teal/5' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TechDNASection;
