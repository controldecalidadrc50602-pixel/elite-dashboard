import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Laptop, User, Tag } from 'lucide-react';
import { HardwareAsset } from '../../../types/project';

interface Props {
  assets?: HardwareAsset[];
  onUpdate: (assets: HardwareAsset[]) => void;
}

const AssetsSection: React.FC<Props> = ({ assets = [], onUpdate }) => {
  const addAsset = () => {
    onUpdate([...assets, { 
      id: Math.random().toString(36).substr(2, 9), 
      model: '', 
      assignedPosition: '', 
      status: 'Operativo' 
    }]);
  };

  const updateAsset = (id: string, updates: Partial<HardwareAsset>) => {
    onUpdate(assets.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAsset = (id: string) => {
    onUpdate(assets.filter(a => a.id !== id));
  };

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
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase glow-text">Activos</h2>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[9px] ml-11">Control de Inventario de Hardware</p>
        </div>
        <button 
          type="button" onClick={addAsset}
          className="px-8 py-4 bg-rc-teal text-black rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-lg"
        >
          <Plus size={16} /> Registrar Activo
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {assets.map((asset) => (
            <motion.div 
              layout
              key={asset.id} 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] hover:border-rc-teal/20 transition-all duration-500 group"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal">
                    <Laptop size={20} />
                  </div>
                  <button 
                    type="button" onClick={() => removeAsset(asset.id)}
                    className="text-rose-500/30 hover:text-rose-500 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={10} /> Modelo / Serie
                    </label>
                    <input 
                      value={asset.model}
                      onChange={e => updateAsset(asset.id, { model: e.target.value })}
                      placeholder="Ej: Dell Latitude 5420"
                      className="organic-input w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <User size={10} /> Posición Asignada
                    </label>
                    <input 
                      value={asset.assignedPosition}
                      onChange={e => updateAsset(asset.id, { assignedPosition: e.target.value })}
                      placeholder="Ej: Estación A-01"
                      className="organic-input w-full"
                    />
                  </div>

                  <select 
                    value={asset.status}
                    onChange={e => updateAsset(asset.id, { status: e.target.value as any })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rc-teal appearance-none cursor-pointer"
                  >
                    <option value="Operativo">Operativo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AssetsSection;
