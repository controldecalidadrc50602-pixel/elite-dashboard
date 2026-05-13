import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Headphones } from 'lucide-react';
import { HardwareAsset } from '../../../types/project';

interface Props {
  assets?: HardwareAsset[];
  onUpdate: (assets: HardwareAsset[]) => void;
}

const AssetsSection: React.FC<Props> = ({ assets, onUpdate }) => {
  const addAsset = () => {
    const newAssets = [...(assets || [])];
    newAssets.push({ id: Math.random().toString(36).substr(2, 9), model: '', quantity: 0, category: 'Hardware', notes: '', assignedPosition: '' });
    onUpdate(newAssets);
  };

  const updateAsset = (index: number, updates: Partial<HardwareAsset>) => {
    const newAssets = [...(assets || [])];
    newAssets[index] = { ...newAssets[index], ...updates };
    onUpdate(newAssets);
  };

  const removeAsset = (index: number) => {
    const newAssets = [...(assets || [])];
    newAssets.splice(index, 1);
    onUpdate(newAssets);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="section-title text-white">Activos y Sistemas</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestión de Activos y Sistemas.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={addAsset}
          className="px-6 py-3 bg-rc-teal text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-rc-teal/20"
        >
          <Plus size={16} /> Registrar Activo
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 pb-12">
        {assets?.map((asset, index) => (
          <div key={asset.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] relative group flex flex-col gap-8 hover:border-rc-teal/30 transition-all">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-rc-teal/10 rounded-[20px] flex items-center justify-center text-rc-teal group-hover:scale-110 transition-transform shadow-xl shadow-black/20">
                <Headphones size={28} />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                    <select 
                      value={asset.category || 'Hardware'}
                      onChange={e => updateAsset(index, { category: e.target.value as any })}
                      className="w-full text-xs font-black uppercase bg-transparent border-none p-0 focus:ring-0 text-white cursor-pointer"
                    >
                      <option value="Hardware" className="bg-[#121212]">Hardware</option>
                      <option value="Sistema" className="bg-[#121212]">Sistema</option>
                      <option value="Conectividad" className="bg-[#121212]">Conectividad</option>
                      <option value="Licencia" className="bg-[#121212]">Licencia</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Modelo / Nombre del Activo</label>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                    <input 
                      placeholder="Ej: CRM Interno / Auriculares Jabra"
                      value={asset.model}
                      onChange={e => updateAsset(index, { model: e.target.value })}
                      className="w-full text-xs font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 text-white placeholder:text-white/10"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Cantidad</label>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                    <input 
                      type="number" 
                      value={asset.quantity}
                      onChange={e => updateAsset(index, { quantity: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs font-black bg-transparent border-none p-0 focus:ring-0 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Posición / VPN / Acceso</label>
                <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                  <input 
                    placeholder="Ej: Posición 45 / GlobalProtect VPN"
                    value={asset.assignedPosition}
                    onChange={e => updateAsset(index, { assignedPosition: e.target.value })}
                    className="w-full text-xs font-black bg-transparent border-none p-0 focus:ring-0 text-white placeholder:text-white/10"
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Notas y Detalles Operativos</label>
                <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                  <input 
                    placeholder="Escriba aquí cualquier detalle adicional..."
                    value={asset.notes || ''}
                    onChange={e => updateAsset(index, { notes: e.target.value })}
                    className="w-full text-[11px] font-medium bg-transparent border-none p-0 focus:ring-0 text-slate-300 italic placeholder:text-white/10"
                  />
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => removeAsset(index)}
              className="absolute top-6 right-6 p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AssetsSection;
