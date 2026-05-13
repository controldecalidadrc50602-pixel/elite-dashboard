import { useState, useEffect } from 'react';
import { Project, ClientService, OperationPulse, TechDNA, HardwareAsset, StrategySLA } from '../types/project';

interface UseProjectFormProps {
  project?: Project | null;
  isOpen: boolean;
  onSave: (project: Project) => void;
  onClose: () => void;
}

export const useProjectForm = ({ project, isOpen, onSave, onClose }: UseProjectFormProps) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [formData, setFormData] = useState<Partial<Project>>({
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
    strategy: { recurringTasks: [], defaultTaskWeight: 5, responseSla: 24 },
    clientEvaluation: { 
      projectLeader: false, timelyDocumentation: false, advisoryReceptivity: false, 
      effectiveServiceUse: false, serviceContinuity: false, reportValuation: false, 
      paymentPunctuality: false, status: 'Verde' 
    }
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        opsPulse: project.opsPulse || { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', operationType: 'Servicio al Cliente', shifts: [] },
        techDNA: project.techDNA || { operationMode: 'RC506', isp: '', phoneLine: '', internetSpeed: '', connectivityType: 'Fibra Óptica', redundancy: false, sipTrunkVirtual: 'N/A.', country: 'Costa Rica' },
        assets: project.assets || [],
        strategy: project.strategy || { recurringTasks: [], defaultTaskWeight: 5, responseSla: 24 },
        adminStatus: project.adminStatus || 'En Proceso',
        clientEvaluation: project.clientEvaluation || { 
          projectLeader: false, timelyDocumentation: false, advisoryReceptivity: false, 
          effectiveServiceUse: false, serviceContinuity: false, reportValuation: false, 
          paymentPunctuality: false, status: 'Verde' 
        }
      });
    } else {
      setFormData({
        client: '',
        startDate: new Date().toISOString().split('T')[0],
        accountManager: '',
        partnerLiaison: { name: '', email: '' },
        strategicObjective: '',
        services: [],
        evaluations: [],
        healthFlag: 'Verde',
        opsPulse: { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', operationType: 'Servicio al Cliente', shifts: [] },
        techDNA: { operationMode: 'RC506', isp: '', phoneLine: '', internetSpeed: '', connectivityType: 'Fibra Óptica', redundancy: false, sipTrunkVirtual: 'N/A.', country: 'Costa Rica' },
        assets: [],
        strategy: { recurringTasks: [], defaultTaskWeight: 5, responseSla: 24 },
        adminStatus: 'En Proceso',
        clientEvaluation: { 
          projectLeader: false, timelyDocumentation: false, advisoryReceptivity: false, 
          effectiveServiceUse: false, serviceContinuity: false, reportValuation: false, 
          paymentPunctuality: false, status: 'Verde' 
        }
      });
    }
    setActiveTab('basic');
  }, [project, isOpen]);

  const updateFormData = (updates: Partial<Project>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        alert('El logo es muy pesado. Intenta con uno menor a 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
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
      clientEvaluation: formData.clientEvaluation as any
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
    handleSubmit
  };
};
