import React from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Project } from '../../../types/project';

interface Props {
  formData: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentitySection: React.FC<Props> = ({ formData, onUpdate, onFileChange }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="section-container"
    >
      <header className="flex items-start justify-between mb-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Identidad Corporativa</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Configuración Global de la Cuenta</p>
          </div>
        </div>
        <div className="max-w-[340px] p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[32px]">
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Establezca la imagen de marca y los responsables estratégicos que gobernarán esta operación en el ecosistema Elite.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,2fr] gap-16 premium-card-v4">
        <div className="space-y-8">
          <div className="w-full aspect-square bg-black/40 rounded-[48px] border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden relative group transition-all hover:border-rc-teal/40 hover:bg-black/60 shadow-inner">
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-contain p-10" />
            ) : (
              <div className="text-center p-6 opacity-30 group-hover:opacity-60 transition-opacity">
                <Upload size={56} className="mx-auto mb-4 text-rc-teal" />
                <span className="text-[12px] font-black uppercase tracking-[0.2em] block text-white">Cargar Logo</span>
              </div>
            )}
            <label className="absolute inset-0 bg-rc-teal/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-md">
              <Upload size={48} className="text-black mb-3" />
              <span className="text-[12px] font-black text-black uppercase tracking-widest">Actualizar Imagen</span>
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center px-8 leading-relaxed">
            Formato recomendado: PNG o SVG con fondo transparente (máx. 800KB)
          </p>
        </div>

        <div className="space-y-10 py-4">
          <div className="form-group">
            <label className="form-label">Razón Social / Nombre Comercial</label>
            <input 
              required 
              value={formData.client || ''}
              onChange={e => onUpdate({ client: e.target.value })}
              placeholder="Ej: CORPORACIÓN MULTINACIONAL S.A."
              className="w-full text-xl font-black uppercase tracking-[0.1em] placeholder:opacity-20"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="form-group">
              <label className="form-label">Account Manager Senior</label>
              <input 
                value={formData.accountManager || ''}
                onChange={e => onUpdate({ accountManager: e.target.value })}
                placeholder="Nombre del Responsable Rc506"
                className="w-full"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nivel de Salud Operativa</label>
              <div className="relative">
                <select 
                  value={formData.healthFlag || 'Verde'}
                  onChange={e => onUpdate({ healthFlag: e.target.value as any })}
                  className="w-full font-black uppercase tracking-[0.15em] appearance-none cursor-pointer pr-12"
                >
                  <option value="Verde">🟢 Estatus Óptimo</option>
                  <option value="Amarilla">🟡 Atención Preventiva</option>
                  <option value="Roja">🔴 Alerta de Riesgo</option>
                  <option value="Negra">⚫ Estado Crítico</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-white rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        <div className="form-group">
          <label className="form-label">Contraparte Estratégica (Cliente)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              placeholder="Nombre y Apellido"
              value={formData.partnerLiaison?.name || ''}
              onChange={e => onUpdate({ partnerLiaison: { ...formData.partnerLiaison!, name: e.target.value, email: formData.partnerLiaison?.email || '' } })}
              className="w-full"
            />
            <input 
              placeholder="Correo Corporativo"
              value={formData.partnerLiaison?.email || ''}
              onChange={e => onUpdate({ partnerLiaison: { ...formData.partnerLiaison!, email: e.target.value, name: formData.partnerLiaison?.name || '' } })}
              className="w-full"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Fecha de Inicio de Relación</label>
          <input 
            type="date" 
            required 
            value={formData.startDate || ''}
            onChange={e => onUpdate({ startDate: e.target.value })}
            className="w-full font-bold uppercase tracking-widest text-rc-teal"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Visión y Objetivos del Proyecto</label>
        <textarea 
          value={formData.strategicObjective || ''}
          onChange={e => onUpdate({ strategicObjective: e.target.value })}
          placeholder="Describa el impacto que el cliente espera lograr con nuestra intervención..."
          className="w-full h-40 resize-none leading-relaxed pt-6"
        />
      </div>
    </motion.div>
  );
};

export default IdentitySection;
