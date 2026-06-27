import { useState, useEffect } from 'react';
import { Project, ClientService, OperationPulse, TechDNA, HardwareAsset, StrategySLA, ClientEvaluation } from '../types/project';
import { useDebounce } from './useDebounce';
import { deepEqual } from '../utils/compare';
import { storageService } from '../services/storageService';

interface UseProjectFormProps {
  project?: Project | null;
  isOpen: boolean;
  onSave: (project: Project) => void;
  onClose: () => void;
}

export const useProjectForm = ({ project, isOpen, onSave, onClose }: UseProjectFormProps) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  const initialData: Partial<Project> = {
    client: '',
    startDate: new Date().toISOString().split('T')[0],
    accountManager: '',
    partnerLiaison: { name: '', email: '' },
    strategicObjective: '',
    services: [],
    evaluations: [],
    healthFlag: 'Verde',
    adminStatus: 'En Proceso',
    opsPulse: { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', operationType: 'Servicio al Cliente', shifts: [] },
    techDNA: { operationMode: 'RC506', isp: '', phoneLine: '', internetSpeed: '', connectivityType: 'Fibra Óptica', redundancy: false, sipTrunkVirtual: 'N/A.', country: 'Costa Rica' },
    assets: [],
    strategy: { slaRequirements: '', nextReviewDate: '', recurringTasks: [] },
    clientEvaluation: { 
      satisfactionLevel: 100, 
      maturityIndex: 'Nivel 1: Inicial', 
      growthPotential: '',
      status: 'Verde' 
    },
    quarterlyAssessment: {
      sla: 5,
      comunicacion: 5,
      resolucion: 5,
      experiencia: 5,
      continuidad: 5,
      orden: 5,
      conversion: 5,
      adaptacion: 5,
      cultura: 5,
      valor: 5
    }
  };

  const [formData, setFormData] = useState<Partial<Project>>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const debouncedFormData = useDebounce(formData, 1500);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        services: project.services || [],
        opsPulse: project.opsPulse || initialData.opsPulse,
        techDNA: project.techDNA || initialData.techDNA,
        assets: project.assets || initialData.assets,
        strategy: project.strategy || initialData.strategy,
        adminStatus: project.adminStatus || 'En Proceso',
        clientEvaluation: project.clientEvaluation || initialData.clientEvaluation,
        quarterlyAssessment: project.quarterlyAssessment || initialData.quarterlyAssessment
      });
    } else {
      setFormData(initialData);
    }
    setActiveTab('basic');
  }, [project, isOpen]);

  const updateFormData = (updates: Partial<Project>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Autosave Effect
  useEffect(() => {
    if (!project || !isOpen) return;
    
    // Convert current project to similar structure for comparison
    const baseProject = {
      ...project,
      services: project.services || [],
      opsPulse: project.opsPulse || initialData.opsPulse,
      techDNA: project.techDNA || initialData.techDNA,
      assets: project.assets || initialData.assets,
      strategy: project.strategy || initialData.strategy,
      adminStatus: project.adminStatus || 'En Proceso',
      clientEvaluation: project.clientEvaluation || initialData.clientEvaluation,
      quarterlyAssessment: project.quarterlyAssessment || initialData.quarterlyAssessment
    };

    if (!deepEqual(debouncedFormData, baseProject)) {
      if (!debouncedFormData.client?.trim()) return; // Don't autosave if no client name
      setIsSaving(true);
      
      const cleanServices = (debouncedFormData.services || []).filter((s: ClientService) => s.name?.trim() !== '');
      const finalProject: Project = {
        ...debouncedFormData,
        id: project.id,
        client: debouncedFormData.client.trim(),
        services: cleanServices,
        healthFlag: debouncedFormData.healthFlag as any || 'Verde',
        adminStatus: debouncedFormData.adminStatus as any || 'En Proceso'
      } as Project;

      onSave(finalProject);
      setTimeout(() => setIsSaving(false), 800);
    }
  }, [debouncedFormData, project, isOpen]);

  const updateService = (index: number, updates: Partial<ClientService>) => {
    const s = [...(formData.services || [])];
    s[index] = { ...s[index], ...updates };
    setFormData(prev => ({ ...prev, services: s }));
  };

  const addService = () => {
    const newServices = [...(formData.services || [])];
    newServices.push({ 
      id: Math.random().toString(36).substr(2, 9), 
      name: '', 
      description: '', 
      startDate: new Date().toISOString().split('T')[0], 
      score: 5,
      type: 'Contact Center'
    });
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const removeService = (id: string) => {
    const s = (formData.services || []).filter(item => item.id !== id);
    setFormData(prev => ({ ...prev, services: s }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        alert('El logo es muy pesado. Intenta con uno menor a 2MB.');
        return;
      }
      setLogoUploading(true);
      try {
        const clientId = project?.id || formData.client?.replace(/\s+/g, '-').toLowerCase() || 'new';
        const url = await storageService.uploadLogo(file, clientId);
        setFormData(prev => ({ ...prev, logoUrl: url }));
      } catch (err) {
        console.error('Error uploading logo', err);
        alert('Hubo un error al subir el logotipo.');
      } finally {
        setLogoUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client?.trim()) {
      alert('El nombre del cliente es requerido');
      return;
    }

    const cleanServices = (formData.services || []).filter((s: ClientService) => s.name?.trim() !== '');
    
    const finalProject: Project = {
      id: project?.id || Math.random().toString(36).substr(2, 9),
      client: formData.client?.trim() || '',
      logoUrl: formData.logoUrl,
      startDate: formData.startDate!,
      accountManager: formData.accountManager,
      partnerLiaison: formData.partnerLiaison,
      strategicObjective: formData.strategicObjective,
      services: cleanServices,
      evaluations: formData.evaluations || [],
      healthFlag: formData.healthFlag as any || 'Verde',
      opsPulse: formData.opsPulse as OperationPulse,
      techDNA: formData.techDNA as TechDNA,
      assets: formData.assets as HardwareAsset[],
      strategy: formData.strategy as StrategySLA,
      adminStatus: formData.adminStatus as any || 'En Proceso',
      clientEvaluation: formData.clientEvaluation as ClientEvaluation,
      quarterlyAssessment: formData.quarterlyAssessment as any
    };

    onSave(finalProject);
    onClose();
  };

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    updateFormData,
    updateService,
    addService,
    removeService,
    handleFileChange,
    handleSubmit,
    isSaving,
    logoUploading
  };
};
