import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Monitor, Cpu, Server } from 'lucide-react';
import { HardwareAsset } from '../../../types/project';

interface Props {
  assets?: HardwareAsset[];
  onUpdate: (assets: HardwareAsset[]) => void;
}

const AssetsSection: React.FC<Props> = ({ assets = [], onUpdate }) => {
  const addAsset = () => {
    onUpdate([
      ...assets,
      { id: Math.random().toString(36).substr(2, 9), category: 'HA', model: '', quantity: 1, assignedPosition: '', notes: '' }
    ]);
  };

  const updateAsset = (index: number, updates: Partial<HardwareAsset>) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], ...updates };
    onUpdate(newAssets);
  };

  const removeAsset = (id: string) => {
    onUpdate(assets.filter(a => a.id !== id));
  };

  const getIcon = (category?: string) => {
    switch (category) {
      case 'HA': return <Monitor size={24} />;
      case 'SW': return <Cpu size={24} />;
      case 'SR': return <Server size={24} />;
      default: return <Monitor size={24} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="section-container"
    >
      <header className="flex items-start justify-between mb-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Activos y Sistemas</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Gestión de Recursos de Hardware y Software</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={addAsset}
          className="px-10 py-5 bg-rc-teal text-black rounded-[24px] text-[12px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_15px_40px_rgba(59,188,169,0.2)]"
        >
          <Plus size={20} /> Registrar Nuevo Activo
        </button>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {assets.length === 0 ? (
          <div className="p-24 bg-black/20 border border-dashed border-white/5 rounded-[56px] text-center space-y-6">
            <div className="w-20 h-20 bg-slate-900/50 rounded-[32px] flex items-center justify-center mx-auto text-slate-700">
              <Monitor size={40} />
            </div>
            <div className="space-y-2">
              <p className="text-white font-black uppercase tracking-[0.2em] text-[14px]">Inventario Vacío</p>
              <p className="text-slate-500 text-[11px] font-medium max-w-sm mx-auto">Registre los activos críticos, licencias o infraestructura necesaria para la operación.</p>
            </div>
          </div>
        ) : (
          assets.map((asset, index) => (
            <div key={asset.id} className="premium-card-v4 flex flex-col lg:flex-row gap-12 relative group overflow-hidden">
              <div className="w-24 h-24 bg-rc-teal/10 rounded-[32px] flex items-center justify-center text-rc-teal shrink-0 border border-rc-teal/20 self-start shadow-inner">
                {getIcon(asset.category)}
              </div>

              <div className="flex-1 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-3 form-group">
                    <label className="form-label">Categoría</label>
                    <select 
                      value={asset.category || 'HA'}
                      onChange={e => updateAsset(index, { category: e.target.value })}
                      className="w-full font-black uppercase tracking-widest text-rc-teal"
                    >
                      <option value="HA">🖥️ Hardware</option>
                      <option value="SW">💿 Software / Licencias</option>
                      <option value="SR">🛡️ Seguridad / VPN</option>
                      <option value="OT">📦 Otros Recursos</option>
                    </select>
                  </div>
                  <div className="md:col-span-6 form-group">
                    <label className="form-label">Identificación / Nombre del Activo</label>
                    <input 
                      value={asset.model}
                      onChange={e => updateAsset(index, { model: e.target.value })}
                      placeholder="Ej: CRM INTERNO / WORKSTATION HP G9"
                      className="w-full font-black uppercase tracking-[0.1em]"
                    />
                  </div>
                  <div className="md:col-span-3 form-group">
                    <label className="form-label">Cantidad / Licencias</label>
                    <input 
                      type="number"
                      value={asset.quantity}
                      onChange={e => updateAsset(index, { quantity: parseInt(e.target.value) || 0 })}
                      className="w-full text-center font-black text-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="form-group">
                    <label className="form-label">Ubicación / VPN / Acceso Remoto</label>
                    <input 
                      value={asset.assignedPosition || ''}
                      onChange={e => updateAsset(index, { assignedPosition: e.target.value })}
                      placeholder="Ej: Cloud Server / Oficina Central / VPN Forticlient"
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Detalles Operativos y Notas</label>
                    <input 
                      value={asset.notes || ''}
                      onChange={e => updateAsset(index, { notes: e.target.value })}
                      placeholder="Escriba especificaciones técnicas adicionales..."
                      className="w-full text-sm italic opacity-80"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => removeAsset(asset.id)}
                className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-500/10 rounded-2xl"
              >
                <X size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default AssetsSection;
