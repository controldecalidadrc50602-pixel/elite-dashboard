import React from 'react';
import { createPortal } from 'react-dom';
import { X, Activity, Layers, Headphones, Settings, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types/project';
import { useProjectForm } from '../../hooks/useProjectForm';

// Importar Sub-Secciones Refactorizadas
import IdentitySection from './ProjectSections/IdentitySection';
import OpsPulseSection from './ProjectSections/OpsPulseSection';
import ServicesSection from './ProjectSections/ServicesSection';
import TechDNASection from './ProjectSections/TechDNASection';
import AssetsSection from './ProjectSections/AssetsSection';
import StrategySection from './ProjectSections/StrategySection';
import EvaluationSection from './ProjectSections/EvaluationSection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project | null;
}

const ProjectModal: React.FC<Props> = ({ isOpen, onClose, onSave, project }) => {
  const {
    formData,
    activeTab,
    setActiveTab,
    updateFormData,
    updateService,
    addService,
    removeService,
    handleFileChange,
    handleSubmit
  } = useProjectForm({ project, isOpen, onSave, onClose });

  const tabs = [
    { id: 'basic', label: 'Identidad', icon: Settings },
    { id: 'ops', label: 'Operaciones', icon: Activity },
    { id: 'tech', label: 'Tech DNA', icon: Shield },
    { id: 'services', label: 'Servicios', icon: Layers },
    { id: 'assets', label: 'Activos', icon: Headphones },
    { id: 'strategy', label: 'Estrategia', icon: Shield },
    { id: 'evaluation', label: 'Evaluación', icon: Activity },
  ];

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#020203]/80 backdrop-blur-[100px]" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-6xl bg-white/[0.02] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[60px] overflow-hidden flex h-[88vh] backdrop-blur-3xl"
        >
          {/* Decorative Lights */}
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-rc-teal/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-rc-turquoise/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Sidebar Tabs - Organic Layout */}
          <div className="w-72 bg-white/[0.01] p-10 flex flex-col gap-3 shrink-0 relative z-10">
            <div className="mb-10 px-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rc-teal shadow-[0_0_10px_rgba(59,188,169,0.8)]" />
                <h3 className="text-rc-teal font-black text-xs uppercase tracking-[0.4em] glow-text">Elite V4.0</h3>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Operations Command</p>
            </div>
            
            <nav className="flex flex-col gap-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-4 px-6 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative ${
                    activeTab === tab.id 
                    ? 'text-black translate-x-3' 
                    : 'text-slate-500 hover:text-white hover:translate-x-2'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-rc-teal rounded-[24px] shadow-[0_10px_30px_rgba(59,188,169,0.4)]"
                    />
                  )}
                  <tab.icon size={18} className={`relative z-10 transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto p-6 bg-white/[0.03] border border-white/5 rounded-[32px] backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-rc-teal" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Matrix</span>
                </div>
                <span className={`text-[9px] font-black uppercase ${
                  formData.healthFlag === 'Verde' ? 'text-emerald-400' :
                  formData.healthFlag === 'Amarilla' ? 'text-amber-400' : 'text-rose-400'
                }`}>{formData.healthFlag}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: formData.healthFlag === 'Verde' ? '100%' : formData.healthFlag === 'Amarilla' ? '60%' : '30%' }}
                  className={`h-full shadow-[0_0_10px_rgba(59,188,169,0.3)] ${
                    formData.healthFlag === 'Verde' ? 'bg-emerald-400' :
                    formData.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Content Area - Floating Feel */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-transparent relative z-10">
            <div className="absolute top-8 right-10 z-20">
              <button 
                type="button" onClick={onClose} 
                className="w-12 h-12 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] rounded-[20px] transition-all duration-300 group"
              >
                <X size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  {activeTab === 'basic' && (
                    <IdentitySection 
                      formData={formData} 
                      onUpdate={updateFormData} 
                      onFileChange={handleFileChange} 
                    />
                  )}

                  {activeTab === 'ops' && (
                    <OpsPulseSection 
                      opsPulse={formData.opsPulse} 
                      onUpdate={(updates) => updateFormData({ opsPulse: { ...formData.opsPulse!, ...updates } })} 
                    />
                  )}

                  {activeTab === 'tech' && (
                    <TechDNASection 
                      techDNA={formData.techDNA} 
                      onUpdate={(updates) => updateFormData({ techDNA: { ...formData.techDNA!, ...updates } })} 
                    />
                  )}

                  {activeTab === 'services' && (
                    <ServicesSection 
                      services={formData.services} 
                      opsPulse={formData.opsPulse}
                      onUpdate={updateService}
                      onAdd={addService}
                      onRemove={removeService}
                    />
                  )}

                  {activeTab === 'assets' && (
                    <AssetsSection 
                      assets={formData.assets} 
                      onUpdate={(assets) => updateFormData({ assets })} 
                    />
                  )}

                  {activeTab === 'strategy' && (
                    <StrategySection 
                      strategy={formData.strategy} 
                      onUpdate={(updates) => updateFormData({ strategy: { ...formData.strategy!, ...updates } })} 
                    />
                  )}

                  {activeTab === 'evaluation' && (
                    <EvaluationSection 
                      clientEvaluation={formData.clientEvaluation} 
                      onUpdate={(updates) => updateFormData({ clientEvaluation: { ...formData.clientEvaluation!, ...updates } })} 
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between backdrop-blur-3xl rounded-b-[60px]">
              <button 
                type="button" onClick={onClose} 
                className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
              >
                Descartar Cambios
              </button>
              <button 
                type="submit"
                className="px-12 py-4 bg-rc-teal text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-[24px] shadow-[0_15px_30px_rgba(59,188,169,0.3)] hover:scale-105 active:scale-95 transition-all duration-500"
              >
                {project ? 'Guardar Cambios Operativos' : 'Inicializar Nueva Cuenta'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
