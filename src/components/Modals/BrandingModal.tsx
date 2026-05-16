import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Check, Trash2, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandingService, BrandingConfig } from '../../services/brandingService';

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: BrandingConfig) => void;
  currentConfig: BrandingConfig;
}

const BrandingModal: React.FC<BrandingModalProps> = ({ isOpen, onClose, onSave, currentConfig }) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<BrandingConfig>(currentConfig);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // ~800KB Limit for Base64 efficiency
         alert('El logo es muy pesado. Intenta con uno menor a 800KB.');
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await brandingService.updateBranding(config);
    onSave(config);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-light text-[var(--text-primary)] tracking-tight uppercase">Configuración de Marca</h3>
                <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-60">Elite Identity Management</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-[var(--text-secondary)]">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
            {/* Logo Section */}
            <div className="space-y-6">
              <label className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-40">Logo Corporativo</label>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-black/20 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                  {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload size={24} className="mx-auto mb-2 text-slate-500" />
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Sin Logo</span>
                    </div>
                  )}
                  {config.logoUrl && (
                    <button 
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, logoUrl: '' }))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-500 transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic">
                      Sube el logo de tu empresa en formato PNG o SVG con fondo transparente. 
                      Recomendado: 512x512px.
                    </p>
                    <label className="inline-flex items-center gap-4 px-8 py-4 bg-rc-teal/5 text-rc-teal rounded-full cursor-pointer hover:bg-rc-teal/10 transition-all font-medium text-[10px] uppercase tracking-[0.3em] border border-rc-teal/10">
                      <Upload size={16} strokeWidth={1.5} /> Seleccionar Archivo
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-6">
              <label className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-40">Nombre de la Compañía</label>
              <input 
                type="text"
                value={config.companyName}
                onChange={e => setConfig(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-rc-teal/40 transition-all text-sm font-medium"
                placeholder="Ej. Rc506 Solutions"
                required
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-5 rounded-full text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-[2] bg-white text-black px-10 py-5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : <><Check size={18} strokeWidth={2.5} /> Guardar Identidad</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BrandingModal;
