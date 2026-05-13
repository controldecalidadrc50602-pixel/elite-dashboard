import React from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertTriangle, Trash2 } from 'lucide-react';
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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="section-title text-white">Servicios</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Catálogo de Servicios Activos.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={onAdd}
          className="px-6 py-3 bg-rc-teal/10 border border-rc-teal/20 text-rc-teal rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rc-teal/20 transition-all"
        >
          <Plus size={16} /> Agregar Servicio
        </button>
      </header>

      {isOverCapacity && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[32px] flex items-center gap-6 mb-8"
        >
          <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
             <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
             <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Alerta de Capacidad Excedida</p>
             <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                El total de posiciones configuradas ({totalCCPositions}) supera el personal real disponible en piso ({hcReal}). 
                Por favor, revise el HC en la pestaña de Operaciones o ajuste las posiciones de servicio.
              </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-10">
        {services.map((service, index) => (
          <div key={service.id} className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] relative group hover:border-rc-teal/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Servicio</label>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                    <input 
                      value={service.name}
                      onChange={e => onUpdate(index, { name: e.target.value })}
                      placeholder="Ej: Atención VIP / Soporte N1"
                      className="w-full text-sm font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 text-white placeholder:text-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción del Alcance</label>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                    <textarea 
                      value={service.description}
                      onChange={e => onUpdate(index, { description: e.target.value })}
                      placeholder="Defina el alcance técnico y operativo..."
                      className="w-full h-24 resize-none text-xs font-medium bg-transparent border-none p-0 focus:ring-0 text-slate-300 placeholder:text-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Category & Specific Config */}
              <div className="lg:col-span-7 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría Técnica</label>
                    <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                      <select 
                        value={service.type}
                        onChange={e => onUpdate(index, { type: e.target.value as any })}
                        className="w-full text-xs font-bold uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 text-rc-teal cursor-pointer"
                      >
                        <option value="Botmaker">Botmaker (IA & WhatsApp)</option>
                        <option value="Yeastar">Telefonía Yeastar</option>
                        <option value="IPBX">Telefonía IPBX</option>
                        <option value="Contact Center">Contact Center (Humano)</option>
                        <option value="Servicios Web">Servicios Web</option>
                        <option value="Capacitaciones">Capacitaciones</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inicio de Operación</label>
                    <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                      <input 
                        type="date" value={service.startDate}
                        onChange={e => onUpdate(index, { startDate: e.target.value })}
                        className="w-full text-xs font-medium bg-transparent border-none p-0 focus:ring-0 text-white invert-[0.8] brightness-150"
                      />
                    </div>
                  </div>
                </div>

                {/* Conditional Specific Config Section */}
                <div className="p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[32px] space-y-6">
                  <p className="text-[9px] font-black text-rc-teal uppercase tracking-[0.2em]">Configuración Específica: {service.type}</p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {service.type === 'Botmaker' && <BotmakerConfig service={service} index={index} onUpdate={onUpdate} />}
                    {(service.type === 'Yeastar' || service.type === 'IPBX') && <TelephonyConfig service={service} index={index} onUpdate={onUpdate} />}
                    {service.type === 'Contact Center' && <ContactCenterConfig service={service} index={index} onUpdate={onUpdate} />}
                    {service.type === 'Servicios Web' && <WebServiceConfig service={service} index={index} onUpdate={onUpdate} />}
                    {service.type === 'Capacitaciones' && <TrainingConfig service={service} index={index} onUpdate={onUpdate} />}
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => onRemove(service.id)}
                  className="w-full py-4 bg-rose-500/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Eliminar este Servicio
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServicesSection;
