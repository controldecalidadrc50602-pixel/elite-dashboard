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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Región y Conectividad */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Globe size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Ubicación</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Región Operativa</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">País Sede</label>
              <select 
                value={techDNA?.country || ''}
                onChange={e => onUpdate({ country: e.target.value as Country })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Seleccionar País</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Venezuela">Venezuela</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ISP Provider Principal</label>
              <input 
                value={techDNA?.isp || ''}
                onChange={e => onUpdate({ isp: e.target.value })}
                placeholder="Ej. LIBERTY / TIGO"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Infraestructura de Red */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Wifi size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Conectividad</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Infraestructura Base</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ancho de Banda (Mbps)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={techDNA?.internetSpeed || ''}
                  onChange={e => onUpdate({ internetSpeed: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xl font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-right pr-14"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">MB</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tecnología de Enlace</label>
              <select 
                value={techDNA?.connectivityType || ''}
                onChange={e => onUpdate({ connectivityType: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="Fibra Óptica">Fibra Óptica (FO)</option>
                <option value="Radiofrecuencia">Radiofrecuencia (RF)</option>
                <option value="Cobre">HFC / Cobre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seguridad y Telefonía */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Shield size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Telecom</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Seguridad & Telefonía</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Proveedor Troncal SIP</label>
              <select 
                value={techDNA?.sipTrunkVirtual || 'N/A.'}
                onChange={e => onUpdate({ sipTrunkVirtual: e.target.value as SipTrunkVirtual })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="N/A.">No Aplica (N/A)</option>
                <option value="Navegalo">Navegalo</option>
                <option value="Vocex">Vocex</option>
                <option value="ICE">ICE</option>
                <option value="Call My Way">Call My Way</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block text-center">Failover</label>
                <button 
                  type="button"
                  onClick={() => onUpdate({ redundancy: !techDNA?.redundancy })}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    techDNA?.redundancy 
                      ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:border-purple-500/30' 
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  {techDNA?.redundancy ? 'Activo' : 'Ninguno'}
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block text-center">Pilot ID</label>
                <input 
                  value={techDNA?.phoneLine || ''}
                  onChange={e => onUpdate({ phoneLine: e.target.value })}
                  placeholder="LINE #"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-3 text-sm font-bold text-center text-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modelo Operativo - Zoho Style Custom Dropdown */}
      <div className="max-w-3xl mx-auto mt-12 p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col items-center text-center space-y-6">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-2">
          <Shield size={24} strokeWidth={2} />
        </div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arquitectura de Operaciones</label>
        
        <div className="relative w-full max-w-sm">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full py-4 px-6 text-2xl font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl transition-all flex items-center justify-between group ${isDropdownOpen ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
          >
            {currentOption.label}
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              className={`${isDropdownOpen ? 'text-indigo-500' : 'text-slate-400'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 left-0 right-0 mt-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden"
              >
                {options.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onUpdate({ operationMode: option.value as any });
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-6 py-4 text-sm font-bold text-left transition-all border-b border-slate-100 dark:border-slate-700 last:border-0 ${
                      techDNA?.operationMode === option.value 
                      ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
