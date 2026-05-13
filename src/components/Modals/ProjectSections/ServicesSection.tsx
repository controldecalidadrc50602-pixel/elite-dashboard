import React from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertTriangle, Trash2, Layers } from 'lucide-react';
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
      exit={{ opacity: 0, x: -20 }} 
      className="section-container"
    >
      <header className="flex items-start justify-between mb-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Ecosistema de Servicios</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Portafolio de Soluciones Activas</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={onAdd}
          className="px-10 py-5 bg-rc-teal text-black rounded-[24px] text-[12px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_15px_40px_rgba(59,188,169,0.2)]"
        >
          <Plus size={20} /> Agregar Nueva Solución
        </button>
      </header>

      {isOverCapacity && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-10 bg-rose-500/10 border border-rose-500/30 rounded-[48px] flex items-center gap-8 mb-12 shadow-[0_20px_50px_rgba(244,63,94,0.1)]"
        >
          <div className="w-16 h-16 bg-rose-500/20 rounded-[24px] flex items-center justify-center text-rose-500 shrink-0 border border-rose-500/20">
             <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
             <p className="text-[12px] font-black text-rose-500 uppercase tracking-[0.25em]">Alerta Crítica: Déficit de Capacidad</p>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-2xl">
                El despliegue técnico requiere <b>{totalCCPositions} posiciones</b>, pero el personal real disponible es de <b>{hcReal}</b>. 
                Esta discrepancia compromete la calidad del servicio. Por favor, incremente el HC o ajuste el alcance del servicio.
              </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-16">
        {services.length === 0 ? (
          <div className="p-20 bg-black/20 border border-dashed border-white/5 rounded-[56px] text-center space-y-4">
            <Layers size={48} className="mx-auto text-slate-700" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-[11px]">No se han registrado servicios aún</p>
          </div>
        ) : (
          services.map((service, index) => (
            <div key={service.id} className="premium-card-v4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Column: Essential Definition */}
                <div className="lg:col-span-5 space-y-10">
                  <div className="form-group">
                    <label className="form-label">Denominación del Servicio</label>
                    <input 
                      value={service.name}
                      onChange={e => onUpdate(index, { name: e.target.value })}
                      placeholder="Ej: MESA DE AYUDA NIVEL 1"
                      className="w-full text-lg font-black uppercase tracking-[0.1em]"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alcance y Propuesta de Valor</label>
                    <textarea 
                      value={service.description}
                      onChange={e => onUpdate(index, { description: e.target.value })}
                      placeholder="Especifique el core de la operación y los entregables técnicos..."
                      className="w-full h-44 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Right Column: Intelligence & Config */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="form-group">
                      <label className="form-label">Categoría de Inteligencia</label>
                      <select 
                        value={service.type}
                        onChange={e => onUpdate(index, { type: e.target.value as any })}
                        className="w-full font-black uppercase tracking-[0.15em] text-rc-teal"
                      >
                        <option value="Botmaker">🤖 Botmaker (IA / WA)</option>
                        <option value="Yeastar">📞 Central Yeastar</option>
                        <option value="IPBX">☎️ Central IPBX</option>
                        <option value="Contact Center">🎧 Contact Center</option>
                        <option value="Servicios Web">🌐 Servicios Web</option>
                        <option value="Capacitaciones">🎓 Capacitaciones</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fecha de Go-Live</label>
                      <input 
                        type="date" 
                        value={service.startDate}
                        onChange={e => onUpdate(index, { startDate: e.target.value })}
                        className="w-full font-bold uppercase tracking-widest text-rc-teal"
                      />
                    </div>
                  </div>

                  {/* Technical Deep Dive Container */}
                  <div className="p-10 bg-rc-teal/[0.03] border border-rc-teal/10 rounded-[48px] space-y-10 shadow-inner">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black text-rc-teal uppercase tracking-[0.3em]">Módulo Técnico: {service.type}</p>
                      <div className="h-[1px] flex-1 bg-rc-teal/10 mx-6" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-10">
                      {service.type === 'Botmaker' && <BotmakerConfig service={service} index={index} onUpdate={onUpdate} />}
                      {(service.type === 'Yeastar' || service.type === 'IPBX') && <TelephonyConfig service={service} index={index} onUpdate={onUpdate} />}
                      {service.type === 'Contact Center' && <ContactCenterConfig service={service} index={index} onUpdate={onUpdate} />}
                      {service.type === 'Servicios Web' && <WebServiceConfig service={service} index={index} onUpdate={onUpdate} />}
                      {service.type === 'Capacitaciones' && <TrainingConfig service={service} index={index} onUpdate={onUpdate} />}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="button"
                      onClick={() => onRemove(service.id)}
                      className="w-full py-6 bg-rose-500/5 text-rose-500 rounded-[28px] text-[11px] font-black uppercase tracking-[0.25em] border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Trash2 size={18} /> Discontinuar Solución Técnico
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ServicesSection;
