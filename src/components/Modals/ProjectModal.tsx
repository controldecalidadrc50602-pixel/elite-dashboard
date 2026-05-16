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
    { id: 'basic', label: 'Identidad' },
    { id: 'ops', label: 'Operaciones' },
    { id: 'tech', label: 'Tech DNA' },
    { id: 'services', label: 'Servicios' },
    { id: 'assets', label: 'Activos' },
    { id: 'strategy', label: 'Estrategia' },
    { id: 'evaluation', label: 'Evaluación' },
  ];

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#020203]/90 backdrop-blur-[40px]" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-6xl bg-[#0A0A0C] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-[40px] overflow-hidden flex flex-col h-[85vh] backdrop-blur-3xl"
        >
          {/* Header Estático - Apple Business Style */}
          <header className="relative z-20 bg-[#0A0A0C]/50 backdrop-blur-xl border-b border-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] shrink-0">
            <div className="px-10 pt-8 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rc-teal to-rc-turquoise flex items-center justify-center shadow-[0_10px_25px_rgba(59,188,169,0.3)]">
                  <Settings className="text-black" size={28} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-light tracking-tight text-white">
                    {formData.clientName || 'Nuevo Expediente'}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-full border border-white/5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        formData.healthFlag === 'Verde' ? 'bg-emerald-400' :
                        formData.healthFlag === 'Amarilla' ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        Índice de Salud General: <span className="text-white">{formData.healthFlag}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  type="button" onClick={onClose} 
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 group"
                >
                  <X size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Sistema de Pestañas Minimalista */}
            <nav className="flex px-10 mt-6 overflow-x-auto no-scrollbar">
              <div className="flex gap-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative pb-4 text-sm tracking-tight transition-all duration-300 font-light ${
                      activeTab === tab.id 
                      ? 'text-white' 
                      : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-rc-teal shadow-[0_0_10px_rgba(59,188,169,0.5)]"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </nav>
          </header>

          {/* Content Area */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-5xl mx-auto"
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

            {/* Footer */}
            <footer className="px-10 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between shrink-0">
              <button 
                type="button" onClick={onClose} 
                className="text-xs font-light text-slate-500 hover:text-white transition-colors tracking-wide"
              >
                Descartar cambios
              </button>
              <div className="flex items-center gap-4">
                <button 
                  type="submit"
                  className="px-8 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-slate-100 transition-all duration-300 shadow-xl"
                >
                  {project ? 'Actualizar Expediente' : 'Finalizar Alta'}
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
