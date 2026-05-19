import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Check, Trash2, Building2, Database, Sliders, Sparkles, Link as LinkIcon, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandingService, BrandingConfig } from '../../services/brandingService';
import { useDemoMode } from '../../context/DemoModeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { demoMode, setDemoMode } = useDemoMode();
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>(brandingService.defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const inviteUrl = `${origin}/login?invite=guest-access`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  useEffect(() => {
    const loadBranding = async () => {
      const config = await brandingService.getBranding();
      setBrandingConfig(config);
    };
    if (isOpen) {
      loadBranding();
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // ~800KB Limit
         alert('El logo es muy pesado. Intenta con uno menor a 800KB.');
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandingConfig(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await brandingService.updateBranding(brandingConfig);
      
      // Dispatch custom event to notify external listeners of branding updates
      const event = new CustomEvent('elite-branding-changed', { detail: brandingConfig });
      document.dispatchEvent(event);
      
      setIsSaving(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col bg-[#0D111A]/95 backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-[0_0_15px_rgba(59,188,169,0.15)]">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="text-xl font-light text-white tracking-tight uppercase">Configuración de Sistema</h3>
                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.4em] mt-1 opacity-70">Console & Identity Panel</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
            
            {/* 1. Environment Section */}
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] block">
                Ambiente de Ejecución (Data Engine)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Simulation Mode (Demo) */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDemoMode(true)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between h-40 relative overflow-hidden ${
                    demoMode 
                      ? 'bg-amber-500/5 border-amber-500/30 text-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.05)]' 
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  {demoMode && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />
                  )}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${demoMode ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-slate-500'}`}>
                      <Sparkles size={20} />
                    </div>
                    {demoMode && (
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                        Activo
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-1">Modo Simulación (Demo)</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                      Utiliza expedientes simulados de alta fidelidad. Ideal para demostraciones analíticas.
                    </p>
                  </div>
                </motion.div>

                {/* Real Mode (Firestore) */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDemoMode(false)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between h-40 relative overflow-hidden ${
                    !demoMode 
                      ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.05)]' 
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  {!demoMode && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />
                  )}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${!demoMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                      <Database size={20} />
                    </div>
                    {!demoMode && (
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                        Activo
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-1">Modo Real (Firestore)</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                      Sincroniza en tiempo real con Google Cloud Firestore para gestionar expedientes reales.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full my-6" />

            {/* 2. Corporate Identity (Branding) Section */}
            <div className="space-y-6">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] block">
                Identidad Corporativa & Branding
              </label>

              {/* Logo Upload */}
              <div className="flex flex-col md:flex-row items-center gap-8 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                <div className="w-28 h-28 bg-black/30 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group shrink-0">
                  {brandingConfig.logoUrl ? (
                    <img src={brandingConfig.logoUrl} alt="Preview" className="w-full h-full object-contain p-3" />
                  ) : (
                    <div className="text-center p-3">
                      <Upload size={20} className="mx-auto mb-1 text-slate-500" />
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Sin Logo</span>
                    </div>
                  )}
                  {brandingConfig.logoUrl && (
                    <button 
                      type="button"
                      onClick={() => setBrandingConfig(prev => ({ ...prev, logoUrl: '' }))}
                      className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-500 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <h5 className="text-xs font-semibold text-white uppercase tracking-wider">Logo Corporativo</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Sube el logotipo de tu compañía en formato PNG o SVG con fondo transparente. 
                    Recomendado: Menor a 800 KB para asegurar rendimiento estelar.
                  </p>
                  <label className="inline-flex items-center gap-3 px-6 py-3 bg-rc-teal/5 text-rc-teal rounded-full cursor-pointer hover:bg-rc-teal/10 transition-all font-semibold text-[9px] uppercase tracking-[0.2em] border border-rc-teal/15">
                    <Upload size={14} strokeWidth={1.5} /> Cargar Logotipo
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-3">
                <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Nombre de la Compañía</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Building2 size={16} strokeWidth={1.5} />
                  </div>
                  <input 
                    type="text"
                    value={brandingConfig.companyName}
                    onChange={e => setBrandingConfig(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white text-xs font-medium focus:outline-none focus:border-rc-teal/40 focus:ring-1 focus:ring-rc-teal/30 transition-all placeholder:text-slate-700"
                    placeholder="Ej. Rc506 Solutions"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full my-6" />

            {/* 3. Invitation Link Section */}
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] block">
                Control de Accesos Externos (Invitaciones)
              </label>
              
              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rc-teal font-semibold uppercase tracking-wider text-xs">
                    <LinkIcon size={14} />
                    <span>Enlace de Invitado de Sólo Lectura</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                    Genera una URL directa que inicia sesión automáticamente como <strong className="text-white">Invitado Especial</strong> con acceso restringido de sólo lectura.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-6 py-4 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center cursor-pointer shrink-0 ${
                    copiedLink 
                      ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                      : 'bg-white text-black hover:bg-slate-200 active:scale-95'
                  }`}
                >
                  {copiedLink ? (
                    <><Check size={14} strokeWidth={3} /> ¡Copiado!</>
                  ) : (
                    <><Copy size={14} strokeWidth={1.5} /> Copiar Enlace</>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-6 flex gap-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-[2] bg-white text-black hover:bg-slate-200 active:scale-95 px-8 py-4 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Guardando...' : <><Check size={16} strokeWidth={2.5} /> Guardar Cambios</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
