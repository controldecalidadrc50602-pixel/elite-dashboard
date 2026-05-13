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
          className="relative w-full max-w-7xl bg-white/[0.02] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[80px] overflow-hidden flex h-[92vh] backdrop-blur-3xl"
        >
          {/* Decorative Lights */}
          <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-rc-teal/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-rc-turquoise/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Sidebar Tabs - Organic Layout */}
          <div className="w-80 bg-white/[0.01] p-12 flex flex-col gap-4 shrink-0 relative z-10">
            <div className="mb-14 px-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-rc-teal shadow-[0_0_15px_rgba(59,188,169,0.8)]" />
                <h3 className="text-rc-teal font-black text-sm uppercase tracking-[0.4em] glow-text">Elite V4.0</h3>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Operations Command</p>
            </div>
            
            <nav className="flex flex-col gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-5 px-8 py-5 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative ${
                    activeTab === tab.id 
                    ? 'text-black translate-x-4' 
                    : 'text-slate-500 hover:text-white hover:translate-x-2'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-rc-teal rounded-[32px] shadow-[0_15px_40px_rgba(59,188,169,0.4)]"
                    />
                  )}
                  <tab.icon size={20} className={`relative z-10 transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto p-8 bg-white/[0.03] border border-white/5 rounded-[48px] backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-rc-teal" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Matrix</span>
                </div>
                <span className={`text-[10px] font-black uppercase ${
                  formData.healthFlag === 'Verde' ? 'text-emerald-400' :
                  formData.healthFlag === 'Amarilla' ? 'text-amber-400' : 'text-rose-400'
                }`}>{formData.healthFlag}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: formData.healthFlag === 'Verde' ? '100%' : formData.healthFlag === 'Amarilla' ? '60%' : '30%' }}
                  className={`h-full shadow-[0_0_15px_rgba(59,188,169,0.3)] ${
                    formData.healthFlag === 'Verde' ? 'bg-emerald-400' :
                    formData.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Content Area - Floating Feel */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-transparent relative z-10">
            <div className="absolute top-10 right-12 z-20">
              <button 
                type="button" onClick={onClose} 
                className="w-14 h-14 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] rounded-[24px] transition-all duration-300 group"
              >
                <X size={24} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            <div className="p-16 overflow-y-auto custom-scrollbar flex-1">
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

            <div className="p-12 bg-white/[0.01] border-t border-white/5 flex items-center justify-between backdrop-blur-3xl rounded-b-[80px]">
              <button 
                type="button" onClick={onClose} 
                className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
              >
                Descartar Cambios
              </button>
              <button 
                type="submit"
                className="px-16 py-6 bg-rc-teal text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-[32px] shadow-[0_20px_40px_rgba(59,188,169,0.3)] hover:scale-105 active:scale-95 transition-all duration-500"
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
