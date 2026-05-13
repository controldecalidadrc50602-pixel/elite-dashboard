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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="section-title text-white">Identidad</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración base de la cuenta.</p>
          </div>
        </div>
        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
          <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
            Define la imagen corporativa, los responsables estratégicos y el pulso inicial de salud del cliente.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-12 p-10 bg-black/10 rounded-[48px] border border-white/5">
        <div className="space-y-6">
          <div className="w-full aspect-square bg-slate-900/40 rounded-[32px] border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden relative group transition-all hover:border-[var(--rc-turquoise)]/30">
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-contain p-6" />
            ) : (
              <div className="text-center p-4 opacity-40">
                <Upload size={40} className="mx-auto mb-3 text-rc-teal" />
                <span className="text-[10px] font-black uppercase tracking-widest block text-white">Logo Cliente</span>
              </div>
            )}
            <label className="absolute inset-0 bg-[var(--rc-turquoise)]/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all backdrop-blur-sm">
              <Upload size={32} className="text-[var(--bg-primary)] mb-2" />
              <span className="text-[10px] font-black text-[var(--bg-primary)] uppercase">Cambiar Imagen</span>
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase text-center px-4">Arrastra o haz clic para subir el logo corporativo</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Cliente</label>
            <input 
              required value={formData.client || ''}
              onChange={e => onUpdate({ client: e.target.value })}
              placeholder="Ej: Rc506 Solutions"
              className="w-full text-lg font-black uppercase tracking-widest"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Manager (Rc506)</label>
              <input 
                value={formData.accountManager || ''}
                onChange={e => onUpdate({ accountManager: e.target.value })}
                placeholder="Nombre del Responsable"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bandera de Salud</label>
              <select 
                value={formData.healthFlag || 'Verde'}
                onChange={e => onUpdate({ healthFlag: e.target.value as any })}
                className="w-full font-black uppercase tracking-widest appearance-none cursor-pointer"
              >
                <option value="Verde">🟢 Óptimo (Verde)</option>
                <option value="Amarilla">🟡 Preventivo (Amarilla)</option>
                <option value="Roja">🔴 Riesgo (Roja)</option>
                <option value="Negra">⚫ Crítico (Negra)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Colaborador Enlace (Cliente)</label>
          <div className="grid grid-cols-2 gap-4">
            <input 
              placeholder="Nombre"
              value={formData.partnerLiaison?.name || ''}
              onChange={e => onUpdate({ partnerLiaison: { ...formData.partnerLiaison!, name: e.target.value, email: formData.partnerLiaison?.email || '' } })}
              className="w-full"
            />
            <input 
              placeholder="Correo"
              value={formData.partnerLiaison?.email || ''}
              onChange={e => onUpdate({ partnerLiaison: { ...formData.partnerLiaison!, email: e.target.value, name: formData.partnerLiaison?.name || '' } })}
              className="w-full"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha de Onboarding</label>
          <input 
            type="date" required value={formData.startDate || ''}
            onChange={e => onUpdate({ startDate: e.target.value })}
            className="w-full font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objetivo Estratégico (Éxito del Cliente)</label>
        <textarea 
          value={formData.strategicObjective || ''}
          onChange={e => onUpdate({ strategicObjective: e.target.value })}
          placeholder="Define qué éxito busca el cliente con esta operación..."
          className="w-full h-24 resize-none"
        />
      </div>
    </motion.div>
  );
};

export default IdentitySection;
