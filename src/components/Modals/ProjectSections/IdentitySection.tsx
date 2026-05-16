import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Crown, Users, Target } from 'lucide-react';
import { Project } from '../../../types/project';

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
      className="space-y-16 font-light"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-16">
        <div className="space-y-8">
          <div className="relative group">
            <div className="relative aspect-square bg-white/[0.02] rounded-[40px] border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-700 shadow-2xl">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-contain p-12" />
              ) : (
                <div className="text-center p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Upload size={40} className="mx-auto mb-4 text-white" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] block text-white">Logotipo</span>
                </div>
              )}
              <label className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-xl">
                <Upload size={24} className="text-black mb-2" />
                <span className="text-[9px] font-bold text-black uppercase tracking-[0.2em]">Cargar imagen</span>
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
            </div>
          </div>
          <p className="text-[10px] text-slate-700 uppercase tracking-widest text-center leading-relaxed">
            Identidad visual corporativa validada.
          </p>
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.4em] block">
              Nombre de la Corporación / Cliente
            </label>
            <input 
              required 
              value={formData.client || ''}
              onChange={e => onUpdate({ client: e.target.value })}
              placeholder="CLIENTE ESTRATÉGICO"
              className="bg-transparent border-none p-0 text-5xl font-light text-white focus:ring-0 w-full tracking-tighter placeholder:text-white/5"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
            <div className="space-y-6">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] block">
                Responsable de Cuenta
              </label>
              <input 
                value={formData.accountManager || ''}
                onChange={e => onUpdate({ accountManager: e.target.value })}
                placeholder="Nombre del Auditor / Lead"
                className="bg-transparent border-none p-0 text-xl font-light text-white focus:ring-0 w-full tracking-tight"
              />
            </div>
            <div className="space-y-6">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] block">Nivel de Alerta Operativa</label>
              <select 
                value={formData.healthFlag || 'Verde'}
                onChange={e => onUpdate({ healthFlag: e.target.value as any })}
                className="bg-transparent border-none p-0 text-xl font-light text-rc-teal focus:ring-0 w-full appearance-none cursor-pointer uppercase tracking-wide"
              >
                <option value="Verde" className="bg-[#0A0A0C]">Estatus Óptimo</option>
                <option value="Amarilla" className="bg-[#0A0A0C]">Atención Preventiva</option>
                <option value="Roja" className="bg-[#0A0A0C]">Alerta de Riesgo</option>
              </select>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-white/5">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] block">
              Propósito y Objetivo de Negocio
            </label>
            <textarea 
              value={formData.strategicObjective || ''}
              onChange={e => onUpdate({ strategicObjective: e.target.value })}
              placeholder="Defina la visión de éxito para esta cuenta..."
              className="bg-transparent border-none p-0 text-lg font-light text-white/80 focus:ring-0 w-full h-32 resize-none leading-relaxed placeholder:text-white/5"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IdentitySection;
