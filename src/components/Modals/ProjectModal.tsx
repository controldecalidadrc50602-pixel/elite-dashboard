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
    { id: 'basic', label: 'Identidad/Administración' },
    { id: 'tech', label: 'Infraestructura/Tecnología' },
    { id: 'evaluation', label: 'Inteligencia/Calidad' },
  ];

  const averagePillars = Math.round(
    Object.values(formData.quarterlyAssessment || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / 10
  ) || 0;

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#000000]/95 backdrop-blur-[60px]" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-6xl bg-[#050505] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[48px] overflow-hidden flex flex-col h-[80vh] backdrop-blur-3xl"
        >
          {/* Header Estático - Zoho Elite Style */}
          <header className="relative z-20 bg-black/40 backdrop-blur-xl border-b border-white/5 shrink-0">
            <div className="px-12 pt-10 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-10">
                <div className="w-16 h-16 rounded-[28px] bg-white/[0.02] border border-white/10 flex items-center justify-center shadow-2xl">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                  ) : (
                    <Settings className="text-rc-teal" size={32} strokeWidth={1.5} />
                  )}
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-light tracking-tighter text-white uppercase">
                    {formData.client || 'Nuevo Expediente'}
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-rc-teal/5 rounded-full border border-rc-teal/20">
                      <Activity className="text-rc-teal" size={14} />
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.4em]">
                        Salud General: <span className="text-rc-teal ml-2 font-bold">{averagePillars} / 5</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Shield className="text-slate-700" size={14} />
                       <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">{formData.accountManager || 'Sin Auditor'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="button" onClick={onClose} 
                className="w-12 h-12 flex items-center justify-center bg-white/[0.03] hover:bg-white/10 rounded-full transition-all duration-500 group"
              >
                <X size={20} className="text-slate-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex px-12 mt-10 overflow-x-auto no-scrollbar">
              <div className="flex gap-12">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative pb-6 text-[11px] font-medium uppercase tracking-[0.5em] transition-all duration-500 ${
                      activeTab === tab.id 
                      ? 'text-rc-teal' 
                      : 'text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-rc-teal shadow-[0_0_20px_rgba(59,188,169,0.8)]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </nav>
          </header>

          {/* Content Area - Scroll Esmerilado */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-6xl mx-auto space-y-20"
                >
                  {activeTab === 'basic' && (
                    <div className="space-y-20">
                      <IdentitySection 
                        formData={formData} 
                        onUpdate={updateFormData} 
                        onFileChange={handleFileChange} 
                      />
                      <OpsPulseSection 
                        opsPulse={formData.opsPulse} 
                        onUpdate={(updates) => updateFormData({ opsPulse: { ...formData.opsPulse!, ...updates } })} 
                      />
                    </div>
                  )}

                  {activeTab === 'tech' && (
                    <div className="space-y-20">
                      <TechDNASection 
                        techDNA={formData.techDNA} 
                        onUpdate={(updates) => updateFormData({ techDNA: { ...formData.techDNA!, ...updates } })} 
                      />
                      <ServicesSection 
                        services={formData.services} 
                        opsPulse={formData.opsPulse}
                        onUpdate={updateService}
                        onAdd={addService}
                        onRemove={removeService}
                      />
                      <AssetsSection 
                        assets={formData.assets} 
                        onUpdate={(assets) => updateFormData({ assets })} 
                      />
                    </div>
                  )}

                  {activeTab === 'evaluation' && (
                    <div className="space-y-20">
                      <EvaluationSection 
                        quarterlyAssessment={formData.quarterlyAssessment} 
                        onUpdate={(updates) => updateFormData({ quarterlyAssessment: { ...formData.quarterlyAssessment!, ...updates } })} 
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="px-12 py-8 bg-black/40 border-t border-white/5 flex items-center justify-between shrink-0">
              <button 
                type="button" onClick={onClose} 
                className="text-[10px] font-medium text-slate-700 hover:text-white transition-colors tracking-[0.4em] uppercase"
              >
                Cerrar Panel
              </button>
              <button 
                type="submit"
                className="px-10 py-4 bg-white text-black text-[12px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-slate-200 transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
              >
                {project ? 'Sincronizar Cambios' : 'Finalizar Alta'}
              </button>
            </footer>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
