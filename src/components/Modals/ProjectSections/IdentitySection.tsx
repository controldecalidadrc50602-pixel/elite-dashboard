import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Crown, Users, Target } from 'lucide-react';
import { Project } from '../../../types/project';
import ImageWithFallback from '../../common/ImageWithFallback';
import HelpTooltip from '../../common/HelpTooltip';

interface Props {
  formData: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentitySection: React.FC<Props> = ({ formData, onUpdate, onFileChange }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 font-light"
    >
      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Logo Uploader - Compact 140x140 */}
        <div className="shrink-0">
          <div className="relative group">
            <div className="relative w-[140px] h-[140px] bg-white/[0.01] rounded-[32px] border border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all duration-500 hover:border-rc-teal/30">
              <ImageWithFallback 
                src={formData.logoUrl} 
                className="w-full h-full object-contain p-6" 
                alt="Preview"
                fallbackIcon={
                  <div className="text-center p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Upload size={28} className="mx-auto mb-2 text-white" />
                    <span className="text-[8px] font-medium uppercase tracking-[0.2em] block text-white text-center">Asset</span>
                  </div>
                }
              />
              <label className="absolute inset-0 bg-[#0D1117] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-md">
                <Upload size={20} className="text-rc-teal mb-1" />
                <span className="text-[8px] font-bold text-rc-teal uppercase tracking-[0.1em]">Cambiar</span>
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
            </div>
          </div>
        </div>

        {/* Primary Info Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] flex items-center">
              Corporación / Cliente
              <HelpTooltip 
                title="Corporación / Cliente" 
                description="Nombre comercial o razón social oficial de la empresa o cliente estratégico a auditar en este expediente." 
                example="Ejemplo: Coca-Cola FEMSA, Walmart de México, o P&G Latam."
                position="top"
              />
            </label>
            <input 
              required 
              value={formData.client || ''}
              onChange={e => onUpdate({ client: e.target.value })}
              placeholder="CLIENTE ESTRATÉGICO"
              className="bg-transparent border-none p-0 text-3xl font-light text-white focus:ring-0 w-full tracking-tighter placeholder:text-white/5"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] flex items-center">
              Responsable de Cuenta
              <HelpTooltip 
                title="Responsable de Cuenta" 
                description="Auditor principal, consultor de calidad o Business Manager asignado a la supervisión operativa y analítica de este cliente." 
                example="Ejemplo: Marilyn Calderón, Ing. José Arrieta, etc."
                position="top"
              />
            </label>
            <input 
              value={formData.accountManager || ''}
              onChange={e => onUpdate({ accountManager: e.target.value })}
              placeholder="Nombre del Auditor"
              className="bg-transparent border-none p-0 text-2xl font-light text-rc-teal focus:ring-0 w-full tracking-tight"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-medium text-slate-500 uppercase tracking-[0.4em] flex items-center">
              Alerta Operativa
              <HelpTooltip 
                title="Alerta Operativa" 
                description="Métrica visual de estatus crítico. Verde para óptimo, Amarilla para desvíos leves que requieren prevención, y Roja para riesgo de abandono." 
                example="La bandera semántica se sincroniza de inmediato en el mapa de control corporativo."
                position="top"
              />
            </label>
            <select 
              value={formData.healthFlag || 'Verde'}
              onChange={e => onUpdate({ healthFlag: e.target.value as any })}
              className="bg-transparent border-none p-0 text-lg font-light text-white/60 focus:ring-0 w-full appearance-none cursor-pointer uppercase tracking-widest"
            >
              <option value="Verde" className="bg-[#0D1117]">Estatus Óptimo</option>
              <option value="Amarilla" className="bg-[#0D1117]">Atención Preventiva</option>
              <option value="Roja" className="bg-[#0D1117]">Alerta de Riesgo</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-medium text-slate-500 uppercase tracking-[0.4em] flex items-center">
              Fecha de Inicio
              <HelpTooltip 
                title="Fecha de Inicio" 
                description="Fecha oficial de inicio de operaciones del servicio, firma del contrato o alta en nuestro ecosistema." 
                example="Sirve de punto de partida para los cálculos de SLA de retención y tiempo de vida (LTV)."
                position="top"
              />
            </label>
            <input 
              type="date"
              value={formData.startDate || ''}
              onChange={e => onUpdate({ startDate: e.target.value })}
              className="bg-transparent border-none p-0 text-lg font-light text-white/60 focus:ring-0 w-full uppercase tracking-widest"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-white/5">
        <label className="text-[9px] font-medium text-slate-500 uppercase tracking-[0.3em] flex items-center">
          Propósito y Objetivo Estratégico
          <HelpTooltip 
            title="Objetivo Estratégico" 
            description="La meta SMART de éxito para la cuenta en el ciclo actual. Defina el qué, cómo y cuándo de manera accionable." 
            example="Ejemplo: Incrementar el SLA al 98.5% mediante optimización de la cola virtual y automatizaciones en el chatbot."
            position="top"
          />
        </label>
        <textarea 
          value={formData.strategicObjective || ''}
          onChange={e => onUpdate({ strategicObjective: e.target.value })}
          placeholder="Defina la visión de éxito para esta cuenta..."
          className="bg-transparent border-none p-0 text-base font-light text-white/60 focus:ring-0 w-full max-h-24 resize-none leading-relaxed placeholder:text-white/5"
        />
      </div>
    </motion.div>
  );
};

export default IdentitySection;
