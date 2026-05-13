import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Layers, Sparkles, Calendar, Settings2 } from 'lucide-react';
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
      className="space-y-16"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 px-1 bg-rc-teal rounded-full shadow-[0_0_20px_rgba(59,188,169,0.5)]" />
            <h2 className="text-5xl font-black tracking-tighter text-white uppercase glow-text">Servicios</h2>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[11px] ml-16">Ecosistema de Soluciones Activas</p>
        </div>
        <button 
          type="button" onClick={onAdd}
          className="px-12 py-6 bg-rc-teal text-black rounded-[32px] text-[12px] font-black uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_20px_40px_rgba(59,188,169,0.3)] group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Nueva Solución
        </button>
      </header>

      {isOverCapacity && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 bg-rose-500/[0.03] border border-rose-500/20 rounded-[64px] flex items-center gap-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[100px]" />
          <div className="w-20 h-20 bg-rose-500/10 rounded-[32px] flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-2xl shrink-0">
             <Sparkles size={40} className="animate-pulse" />
          </div>
          <div className="space-y-3 relative z-10">
             <p className="text-[14px] font-black text-rose-500 uppercase tracking-[0.3em]">Sobrecarga de Capacidad Detectada</p>
             <p className="text-[12px] text-slate-400 font-medium leading-relaxed max-w-2xl">
                Se requieren <b>{totalCCPositions} posiciones</b>, superando el personal real de <b>{hcReal}</b>. La excelencia operativa está en riesgo.
              </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-12">
        <AnimatePresence>
          {services.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-40 flex flex-col items-center justify-center space-y-8"
            >
              <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-slate-700">
                <Layers size={48} />
              </div>
              <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[12px]">Catálogo Vacío</p>
            </motion.div>
          ) : (
            services.map((service, index) => (
              <motion.div 
                layout
                key={service.id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="premium-card-v4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                  <div className="lg:col-span-5 space-y-12">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-rc-teal uppercase tracking-[0.4em] flex items-center gap-3">
                        <Settings2 size={14} /> Denominación
                      </label>
                      <input 
                        value={service.name}
                        onChange={e => onUpdate(index, { name: e.target.value })}
                        placeholder="NOMBRE DEL SERVICIO"
                        className="organic-input w-full text-2xl font-black uppercase tracking-tighter"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Alcance Operativo</label>
                      <textarea 
                        value={service.description}
                        onChange={e => onUpdate(index, { description: e.target.value })}
                        placeholder="Defina los entregables técnicos y el impacto del servicio..."
                        className="organic-input w-full h-56 resize-none leading-relaxed pt-8"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Categoría</label>
                        <select 
                          value={service.type}
                          onChange={e => onUpdate(index, { type: e.target.value as any })}
                          className="organic-input w-full font-black uppercase tracking-[0.2em] text-rc-teal appearance-none cursor-pointer"
                        >
                          <option value="Botmaker">Botmaker (IA / WA)</option>
                          <option value="Yeastar">Central Yeastar</option>
                          <option value="IPBX">Central IPBX</option>
                          <option value="Contact Center">Contact Center</option>
                          <option value="Servicios Web">Servicios Web</option>
                          <option value="Capacitaciones">Capacitaciones</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                          <Calendar size={14} /> Go-Live
                        </label>
                        <input 
                          type="date" 
                          value={service.startDate}
                          onChange={e => onUpdate(index, { startDate: e.target.value })}
                          className="organic-input w-full font-bold uppercase tracking-widest text-rc-teal"
                        />
                      </div>
                    </div>

                    <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[48px] backdrop-blur-3xl relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 right-0 p-8">
                         <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal border border-rc-teal/20 animate-pulse">
                            <Zap size={20} />
                         </div>
                      </div>
                      <div className="space-y-10">
                        <p className="text-[11px] font-black text-rc-teal uppercase tracking-[0.5em] glow-text">Especificaciones Técnicas</p>
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                      className="w-full py-6 text-rose-500/40 hover:text-rose-500 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 hover:bg-rose-500/5 rounded-[32px]"
                    >
                      <Trash2 size={20} /> Eliminar Solución Técnica
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Zap: React.FC<{ size: number, className?: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default ServicesSection;
