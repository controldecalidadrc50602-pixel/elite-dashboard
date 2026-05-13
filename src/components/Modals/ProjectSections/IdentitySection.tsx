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
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-10"
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-0.5 px-1 bg-rc-teal rounded-full shadow-[0_0_15px_rgba(59,188,169,0.5)]" />
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase glow-text">Identidad</h2>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[9px] ml-11">Ecosistema Corporativo Premium</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-12">
        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rc-teal/50 to-rc-turquoise/50 rounded-[40px] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative aspect-square bg-[#050506] rounded-[36px] border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-700 shadow-xl">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-contain p-10 animate-in fade-in zoom-in duration-700" />
              ) : (
                <div className="text-center p-8 opacity-20 group-hover:opacity-50 transition-opacity duration-700">
                  <Upload size={48} className="mx-auto mb-4 text-rc-teal" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] block text-white">Upload Asset</span>
                </div>
              )}
              <label className="absolute inset-0 bg-rc-teal/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 backdrop-blur-xl">
                <Upload size={32} className="text-black mb-2 animate-bounce" />
                <span className="text-[9px] font-black text-black uppercase tracking-[0.3em]">Cargar Identidad</span>
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
            </div>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[28px] backdrop-blur-sm">
             <p className="text-[9px] text-slate-600 font-medium leading-relaxed uppercase tracking-widest text-center">
               El logo corporativo define la autoridad de la marca.
             </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-rc-teal uppercase tracking-[0.4em] flex items-center gap-2.5">
              <Crown size={12} /> Razón Social Estratégica
            </label>
            <input 
              required 
              value={formData.client || ''}
              onChange={e => onUpdate({ client: e.target.value })}
              placeholder="NOMBRE DE LA CORPORACIÓN"
              className="organic-input w-full text-2xl font-black uppercase tracking-tighter glow-text"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2.5">
                <Users size={12} /> Account Manager
              </label>
              <input 
                value={formData.accountManager || ''}
                onChange={e => onUpdate({ accountManager: e.target.value })}
                placeholder="Nombre del Responsable"
                className="organic-input w-full font-bold uppercase tracking-widest"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Estado Operativo</label>
              <select 
                value={formData.healthFlag || 'Verde'}
                onChange={e => onUpdate({ healthFlag: e.target.value as any })}
                className="organic-input w-full font-black uppercase tracking-[0.2em] text-rc-teal appearance-none cursor-pointer"
              >
                <option value="Verde">Estatus Óptimo</option>
                <option value="Amarilla">Atención Preventiva</option>
                <option value="Roja">Alerta de Riesgo</option>
                <option value="Negra">Estado Crítico</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2.5">
              <Target size={12} /> Objetivo Estratégico
            </label>
            <textarea 
              value={formData.strategicObjective || ''}
              onChange={e => onUpdate({ strategicObjective: e.target.value })}
              placeholder="Defina la visión de éxito para esta cuenta..."
              className="organic-input w-full h-36 resize-none leading-relaxed pt-6"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IdentitySection;
