import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Layers, Sparkles, Calendar, Settings2, Zap } from 'lucide-react';
import { ClientService, OperationPulse } from '../../../types/project';
import BotmakerConfig from './BotmakerConfig';
import TelephonyConfig from './TelephonyConfig';
import ContactCenterConfig from './ContactCenterConfig';
import WebServiceConfig from './WebServiceConfig';
import TrainingConfig from './TrainingConfig';

interface Props {
  services?: ClientService[];
  opsPulse?: OperationPulse;
  onUpdate: (index: number, updates: Partial<ClientService>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const ServicesSection: React.FC<Props> = ({ services = [], opsPulse, onUpdate, onAdd, onRemove }) => {
  const totalCCPositions = services.reduce((acc, s) => acc + (s.positionsCount || 0), 0) || 0;
  const hcReal = opsPulse?.hcReal || 0;
  const isOverCapacity = totalCCPositions > hcReal;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-12"
    >
      <header className="flex items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 px-1 bg-rc-teal rounded-full shadow-[0_0_15px_rgba(59,188,169,0.5)]" />
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase glow-text">Servicios</h2>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[9px] ml-11">Ecosistema de Soluciones</p>
        </div>
        <button 
          type="button" onClick={onAdd}
          className="px-8 py-4 bg-rc-teal text-black rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-500 shadow-lg group"
        >
          <Plus size={16} /> Nueva Solución
        </button>
      </header>

      {isOverCapacity && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-rose-500/[0.03] border border-rose-500/10 rounded-[40px] flex items-center gap-8 relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-rose-500/10 rounded-[24px] flex items-center justify-center text-rose-500 border border-rose-500/10 shrink-0">
             <Sparkles size={24} className="animate-pulse" />
          </div>
          <div className="space-y-1 relative z-10">
             <p className="text-[12px] font-black text-rose-500 uppercase tracking-[0.2em]">Exceso de Capacidad</p>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-xl">
                Se requieren <b>{totalCCPositions} posiciones</b> (Capacidad Real: <b>{hcReal}</b>).
              </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence>
          {services.map((service, index) => (
            <motion.div 
              layout
              key={service.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="premium-card-v4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-rc-teal uppercase tracking-[0.4em] flex items-center gap-2.5">
                      <Settings2 size={12} /> Denominación
                    </label>
                    <input 
                      value={service.name}
                      onChange={e => onUpdate(index, { name: e.target.value })}
                      placeholder="NOMBRE DEL SERVICIO"
                      className="organic-input w-full text-xl font-black uppercase tracking-tighter"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Alcance</label>
                    <textarea 
                      value={service.description}
                      onChange={e => onUpdate(index, { description: e.target.value })}
                      placeholder="Descripción operativa..."
                      className="organic-input w-full h-40 resize-none leading-relaxed pt-6"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Categoría</label>
                      <select 
                        value={service.type}
                        onChange={e => onUpdate(index, { type: e.target.value as any })}
                        className="organic-input w-full font-black uppercase tracking-[0.2em] text-rc-teal"
                      >
                        <option value="Botmaker">Botmaker (IA / WA)</option>
                        <option value="Yeastar">Central Yeastar</option>
                        <option value="IPBX">Central IPBX</option>
                        <option value="Contact Center">Contact Center</option>
                        <option value="Servicios Web">Servicios Web</option>
                        <option value="Capacitaciones">Capacitaciones</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2.5">
                        <Calendar size={12} /> Go-Live
                      </label>
                      <input 
                        type="date" 
                        value={service.startDate}
                        onChange={e => onUpdate(index, { startDate: e.target.value })}
                        className="organic-input w-full font-bold uppercase tracking-widest text-rc-teal"
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[36px] backdrop-blur-3xl relative overflow-hidden">
                    <div className="space-y-8">
                      <p className="text-[10px] font-black text-rc-teal uppercase tracking-[0.4em] glow-text flex items-center gap-2.5">
                         <Zap size={12} /> Especificaciones
                      </p>
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {service.type === 'Botmaker' && <BotmakerConfig service={service} index={index} onUpdate={onUpdate} />}
                        {(service.type === 'Yeastar' || service.type === 'IPBX') && <TelephonyConfig service={service} index={index} onUpdate={onUpdate} />}
                        {service.type === 'Contact Center' && <ContactCenterConfig service={service} index={index} onUpdate={onUpdate} />}
                        {service.type === 'Servicios Web' && <WebServiceConfig service={service} index={index} onUpdate={onUpdate} />}
                        {service.type === 'Capacitaciones' && <TrainingConfig service={service} index={index} onUpdate={onUpdate} />}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button" onClick={() => onRemove(service.id)}
                    className="w-full py-4 text-rose-500/30 hover:text-rose-500 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 hover:bg-rose-500/5 rounded-[24px]"
                  >
                    <Trash2 size={16} /> Eliminar Solución
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ServicesSection;
