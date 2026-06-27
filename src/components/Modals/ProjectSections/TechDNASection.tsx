import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Wifi, Radio, Zap, Server, Network, Layers, Laptop, PhoneCall, Cpu, Cloud } from 'lucide-react';
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
      className="space-y-10 font-light"
    >
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
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">País Sede</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'Costa Rica', label: 'Costa Rica', icon: Globe },
                  { id: 'Venezuela', label: 'Venezuela', icon: Globe }
                ].map(country => (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => onUpdate({ country: country.id as Country })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                      techDNA?.country === country.id
                        ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <country.icon size={14} /> {country.label}
                  </button>
                ))}
              </div>
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
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tecnología de Enlace</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'Fibra Óptica', label: 'Fibra', icon: Network },
                  { id: 'Radiofrecuencia', label: 'Radio', icon: Radio },
                  { id: 'Cobre', label: 'HFC', icon: Zap }
                ].map(conn => (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => onUpdate({ connectivityType: conn.id as any })}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                      techDNA?.connectivityType === conn.id
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <conn.icon size={12} /> {conn.label}
                  </button>
                ))}
              </div>
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
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Proveedor Troncal SIP</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'N/A.', label: 'N/A' },
                  { id: 'Navegalo', label: 'Navegalo' },
                  { id: 'Vocex', label: 'Vocex' },
                  { id: 'ICE', label: 'ICE' },
                  { id: 'Call My Way', label: 'CMW' }
                ].map(sip => (
                  <button
                    key={sip.id}
                    type="button"
                    onClick={() => onUpdate({ sipTrunkVirtual: sip.id as SipTrunkVirtual })}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                      techDNA?.sipTrunkVirtual === sip.id
                        ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <PhoneCall size={12} /> {sip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block text-center">Failover</label>
                <button 
                  type="button"
                  onClick={() => onUpdate({ redundancy: !techDNA?.redundancy })}
                  className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    techDNA?.redundancy 
                      ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm' 
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
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

      {/* Modelo Operativo - Pills Grid */}
      <div className="max-w-4xl mx-auto mt-12 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col space-y-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-2">
             <Server size={24} strokeWidth={2} />
           </div>
           <div>
             <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Arquitectura de Operaciones</h3>
             <p className="text-[10px] text-slate-500 uppercase tracking-widest">Modelo de Despliegue Tecnológico</p>
           </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
              { id: 'RC506', label: 'Rc506', icon: Cpu, desc: 'Nube Privada Elite' },
              { id: 'WYP', label: 'WYP', icon: Cloud, desc: 'WorkYourPitch' },
              { id: 'IPBX', label: 'IPBX Central', icon: PhoneCall, desc: 'PBX Local' },
              { id: 'HÍBRIDO', label: 'Híbrido', icon: Layers, desc: 'Multi-Cluster' }
           ].map(opt => (
              <button
                 key={opt.id}
                 type="button"
                 onClick={() => onUpdate({ operationMode: opt.id as any })}
                 className={`p-6 rounded-3xl transition-all border text-left flex flex-col gap-4 group ${
                   techDNA?.operationMode === opt.id
                   ? 'bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-500/20'
                   : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                 }`}
              >
                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                   techDNA?.operationMode === opt.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-200 text-slate-500 group-hover:text-indigo-500 group-hover:bg-indigo-100'
                 } transition-colors`}>
                    <opt.icon size={20} />
                 </div>
                 <div>
                    <span className={`text-xs font-bold uppercase tracking-wider block ${
                       techDNA?.operationMode === opt.id ? 'text-indigo-900' : 'text-slate-700'
                    }`}>{opt.label}</span>
                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mt-1 block">{opt.desc}</span>
                 </div>
              </button>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TechDNASection;
