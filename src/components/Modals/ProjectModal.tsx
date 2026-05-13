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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-[var(--bg-secondary)] border border-white/5 shadow-2xl rounded-[48px] overflow-hidden flex h-[90vh] max-h-[900px]"
        >
          {/* Sidebar Tabs */}
          <div className="w-64 bg-black/20 border-r border-white/5 p-8 flex flex-col gap-2 shrink-0">
            <div className="mb-8 px-2">
              <h3 className="text-rc-teal font-semibold text-xs uppercase tracking-[0.3em] mb-1">Elite V4.0</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-50">Gestión de Cuenta</p>
            </div>
            
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-rc-teal text-black shadow-lg shadow-rc-teal/30' 
                  : 'text-[var(--text-secondary)] hover:bg-white/5'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}

            <div className="mt-auto p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-3xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-rc-teal" />
                <span className="text-[9px] font-black text-rc-teal uppercase">Matriz de Riesgo</span>
              </div>
              <div className={`h-1.5 w-full rounded-full bg-black/20 overflow-hidden`}>
                <div 
                  className={`h-full transition-all duration-500 ${
                    formData.healthFlag === 'Verde' ? 'bg-emerald-500' :
                    formData.healthFlag === 'Amarilla' ? 'bg-amber-500' :
                    formData.healthFlag === 'Roja' ? 'bg-rose-500' : 'bg-slate-900'
                  }`}
                  style={{ width: formData.healthFlag === 'Verde' ? '100%' : formData.healthFlag === 'Amarilla' ? '60%' : '30%' }}
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-[var(--bg-secondary)] relative">
            <div className="absolute top-8 right-8 z-20">
              <button type="button" onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-[var(--text-secondary)]">
                <X size={20} />
              </button>
            </div>

            <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
              <AnimatePresence mode="wait">
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
              </AnimatePresence>
            </div>

            <div className="p-10 bg-black/40 border-t border-white/5 flex items-center justify-between backdrop-blur-3xl">
              <button type="button" onClick={onClose} className="px-10 py-5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
              <button 
                type="submit"
                className="px-12 py-5 bg-rc-teal text-black text-[11px] font-semibold uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(59,188,169,0.2)] hover:scale-105 active:scale-95 transition-all"
              >
                {project ? 'Actualizar Cuenta' : 'Crear Nueva Cuenta'}
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
