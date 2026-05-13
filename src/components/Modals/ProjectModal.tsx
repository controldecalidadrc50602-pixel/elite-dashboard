import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Plus, Upload, Activity, Globe, Layers, Headphones, Settings, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ClientService, OperationPulse, TechDNA, HardwareAsset, StrategySLA } from '../../types/project';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project | null;
}

type TabType = 'basic' | 'ops' | 'tech' | 'services' | 'assets' | 'strategy' | 'evaluation' | 'quality';

const ProjectModal: React.FC<Props> = ({ isOpen, onClose, onSave, project }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  
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
      alert(t('projects.name_required'));
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

  const tabs = [
    { id: 'basic', label: 'Identidad', icon: Settings },
    { id: 'ops', label: 'Operaciones', icon: Activity },
    { id: 'tech', label: 'Tech DNA', icon: Globe },
    { id: 'services', label: 'Servicios', icon: Layers },
    { id: 'assets', label: 'Activos', icon: Headphones },
    { id: 'strategy', label: 'Estrategia', icon: Shield },
    { id: 'evaluation', label: 'Evaluación', icon: Activity },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-[var(--bg-secondary)] border border-white/5 shadow-2xl z-[110] rounded-[48px] overflow-hidden flex h-[85vh]"
          >
            {/* Sidebar Tabs */}
            <div className="w-64 bg-black/20 border-r border-white/5 p-8 flex flex-col gap-2">
              <div className="mb-8 px-2">
                <h3 className="text-rc-teal font-semibold text-xs uppercase tracking-[0.3em] mb-1">Elite V4.0</h3>
                <p className="label-executive opacity-50">Gestión de Cuenta</p>
              </div>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
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
                <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-[var(--text-secondary)]">
                  <X size={20} />
                </button>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
                <AnimatePresence mode="wait">
                  {activeTab === 'basic' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Identidad</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración base de la cuenta.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Define la imagen corporativa, los responsables estratégicos y el pulso inicial de salud del cliente.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-[1fr,2fr] gap-12 p-10 bg-black/10 rounded-[48px] border border-white/5">
                        <div className="space-y-6">
                           <div className="w-full aspect-square bg-slate-900/40 rounded-[32px] border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden relative group transition-all hover:border-[var(--rc-turquoise)]/30">
                              {formData.logoUrl ? (
                                <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-contain p-6" />
                              ) : (
                                <div className="text-center p-4 opacity-40">
                                  <Upload size={40} className="mx-auto mb-3 text-rc-teal" />
                                  <span className="text-[10px] font-black uppercase tracking-widest block">Logo Cliente</span>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-[var(--rc-turquoise)]/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all backdrop-blur-sm">
                                <Upload size={32} className="text-[var(--bg-primary)] mb-2" />
                                <span className="text-[10px] font-black text-[var(--bg-primary)] uppercase">Cambiar Imagen</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                              </label>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 uppercase text-center px-4">Arrastra o haz clic para subir el logo corporativo</p>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label>Nombre del Cliente</label>
                            <input 
                              required value={formData.client}
                              onChange={e => setFormData({...formData, client: e.target.value})}
                              placeholder="Ej: Rc506 Solutions"
                              className="w-full text-lg font-black uppercase tracking-widest"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                               <label>Account Manager (Rc506)</label>
                               <input 
                                 value={formData.accountManager}
                                 onChange={e => setFormData({...formData, accountManager: e.target.value})}
                                 placeholder="Nombre del Responsable"
                                 className="w-full"
                               />
                             </div>
                             <div className="space-y-2">
                               <label>Bandera de Salud</label>
                               <select 
                                 value={formData.healthFlag}
                                 onChange={e => setFormData({...formData, healthFlag: e.target.value as any})}
                                 className="w-full font-black uppercase tracking-widest appearance-none cursor-pointer"
                               >
                                 <option value="Verde">🟢 Óptimo (Verde)</option>
                                 <option value="Amarilla">🟡 Preventivo (Amarilla)</option>
                                 <option value="Roja">🔴 Riesgo (Roja)</option>
                                 <option value="Negra">⚫ Crítico (Negra)</option>
                               </select>
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label>Colaborador Enlace (Cliente)</label>
                          <div className="grid grid-cols-2 gap-4">
                             <input 
                               placeholder="Nombre"
                               value={formData.partnerLiaison?.name}
                               onChange={e => setFormData({...formData, partnerLiaison: { ...formData.partnerLiaison!, name: e.target.value }})}
                               className="w-full"
                             />
                             <input 
                               placeholder="Correo"
                               value={formData.partnerLiaison?.email}
                               onChange={e => setFormData({...formData, partnerLiaison: { ...formData.partnerLiaison!, email: e.target.value }})}
                               className="w-full"
                             />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label>Fecha de Onboarding</label>
                          <input 
                            type="date" required value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                            className="w-full font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label>Objetivo Estratégico (Éxito del Cliente)</label>
                        <textarea 
                          value={formData.strategicObjective}
                          onChange={e => setFormData({...formData, strategicObjective: e.target.value})}
                          placeholder="Define qué éxito busca el cliente con esta operación..."
                          className="w-full h-24 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'ops' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Operaciones</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Capacidad Instalada y HC.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Gestiona el personal, planes de contingencia y la matriz de turnos para asegurar la continuidad del servicio.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label>Tipo de Operación (Mandatorio)</label>
                               <select 
                                 value={formData.opsPulse?.operationType}
                                 onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, operationType: e.target.value as any }})}
                                 className="w-full font-black uppercase tracking-widest cursor-pointer"
                               >
                                 <option value="Servicio al Cliente">Servicio al Cliente</option>
                                 <option value="Ventas">Ventas</option>
                                 <option value="Cobranza">Cobranza</option>
                                 <option value="Soporte Técnico">Soporte Técnico</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                 <label>Personal Contratado (Plan)</label>
                                 <input 
                                   type="number" value={formData.opsPulse?.hcContracted}
                                   onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcContracted: parseInt(e.target.value) || 0 }})}
                                   className="w-full text-lg font-black"
                                   placeholder="Cant. según contrato"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label>Personal Real (En Piso)</label>
                                 <input 
                                   type="number" value={formData.opsPulse?.hcReal}
                                   onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcReal: parseInt(e.target.value) || 0 }})}
                                   className="w-full text-lg font-black"
                                   placeholder="Cant. actual"
                                 />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6 p-8 bg-black/10 rounded-[40px] border border-white/5">
                            <label>Estatus de Backup (Contingencia)</label>
                            <div className="flex flex-col gap-3">
                              {['Disponible', 'En Uso', 'Crítico'].map(status => (
                                <button
                                  key={status} type="button"
                                  onClick={() => setFormData({...formData, opsPulse: { ...formData.opsPulse!, backupStatus: status as any }})}
                                  className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                    formData.opsPulse?.backupStatus === status 
                                    ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)] shadow-lg' 
                                    : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <label>Matriz de Horarios y Turnos</label>
                            <button 
                              type="button"
                              onClick={() => {
                                const newShifts = [...(formData.opsPulse?.shifts || [])];
                                newShifts.push({ id: Math.random().toString(36).substr(2, 9), name: `Turno ${String.fromCharCode(65 + newShifts.length)}`, timeRange: '08:00 - 17:00', peopleCount: 0 });
                                setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: newShifts }});
                              }}
                              className="text-[var(--rc-turquoise)] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-[var(--rc-turquoise)]/10 rounded-xl hover:bg-[var(--rc-turquoise)]/20 transition-all"
                            >
                               <Plus size={14} /> Configurar Turnos
                            </button>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.opsPulse?.shifts?.map((shift, idx) => (
                               <div key={shift.id} className="p-6 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-between gap-6 relative group">
                                  <div className="flex-1 grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{shift.name}</span>
                                        <input 
                                          value={shift.timeRange}
                                          onChange={e => {
                                             const s = [...(formData.opsPulse?.shifts || [])];
                                             s[idx].timeRange = e.target.value;
                                             setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: s }});
                                          }}
                                          className="bg-transparent border-none p-0 text-xs font-black uppercase tracking-widest focus:ring-0 w-full"
                                        />
                                     </div>
                                     <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Personal</span>
                                        <input 
                                          type="number" value={shift.peopleCount}
                                          onChange={e => {
                                             const s = [...(formData.opsPulse?.shifts || [])];
                                             s[idx].peopleCount = parseInt(e.target.value) || 0;
                                             setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: s }});
                                          }}
                                          className="bg-transparent border-none p-0 text-xs font-black focus:ring-0 w-full"
                                        />
                                     </div>
                                  </div>
                                  <button 
                                     type="button"
                                     onClick={() => setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: formData.opsPulse?.shifts?.filter(s => s.id !== shift.id) }})}
                                     className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 rounded-lg"
                                  >
                                     <X size={14} />
                                  </button>
                               </div>
                            ))}
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'tech' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Tech DNA</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ADN Tecnológico.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Registra la infraestructura de red, conectividad y redundancia que soporta la operación del cliente.
                           </p>
                        </div>
                      </header>

                      <div className="space-y-2">
                        <label>Modalidad de Operación</label>
                        <div className="flex gap-4">
                          {['RC506', 'WYP', 'IPBX', 'HÍBRIDO'].map(mode => (
                            <button
                              key={mode} type="button"
                              onClick={() => setFormData({...formData, techDNA: { ...formData.techDNA!, operationMode: mode as any }})}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                formData.techDNA?.operationMode === mode 
                                ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)] shadow-lg' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label>Proveedor de Internet (ISP)</label>
                          <input 
                            value={formData.techDNA?.isp}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, isp: e.target.value }})}
                            placeholder="Ej: Liberty / Telecable"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label>Velocidad Contratada (Mbps)</label>
                          <input 
                            value={formData.techDNA?.internetSpeed}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, internetSpeed: e.target.value }})}
                            placeholder="Ej: 500/500 symmetrical"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label>Tipo de Conectividad</label>
                          <select 
                            value={formData.techDNA?.connectivityType}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, connectivityType: e.target.value as any }})}
                            className="w-full font-black uppercase tracking-widest cursor-pointer"
                          >
                            <option value="Fibra Óptica">Fibra Óptica</option>
                            <option value="Radiofrecuencia">Radiofrecuencia</option>
                            <option value="Cobre">Cobre</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label>Redundancia de Proveedor</label>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, techDNA: { ...formData.techDNA!, redundancy: true }})}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                formData.techDNA?.redundancy 
                                ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)]' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)]'
                              }`}
                            >
                              Sí, Tiene
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, techDNA: { ...formData.techDNA!, redundancy: false }})}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                !formData.techDNA?.redundancy 
                                ? 'bg-slate-800 text-white border-white/10' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)]'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>

                       <div className="grid grid-cols-2 gap-8 p-8 bg-black/10 rounded-[32px] border border-white/5">
                         <div className="space-y-2">
                           <label>País de Operación</label>
                           <select 
                             value={formData.techDNA?.country}
                             onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, country: e.target.value as any }})}
                             className="w-full font-black uppercase tracking-widest cursor-pointer"
                           >
                             <option value="Costa Rica">Costa Rica</option>
                             <option value="Venezuela">Venezuela</option>
                           </select>
                         </div>
                         <div className="space-y-2">
                           <label>SIP Trunk Virtual</label>
                           <select 
                             value={formData.techDNA?.sipTrunkVirtual}
                             onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, sipTrunkVirtual: e.target.value as any }})}
                             className="w-full font-black uppercase tracking-widest cursor-pointer"
                           >
                             {['Navegalo', 'Vocex', 'ICE', 'Call My Way', 'Callcentric', 'Voip.ms', 'Movistar Vzla.', 'N/A.'].map(opt => (
                               <option key={opt} value={opt}>{opt}</option>
                             ))}
                           </select>
                         </div>
                      </div>

                      <div className="space-y-2 p-8 bg-black/10 rounded-[32px] border border-white/5">
                         <label>Línea Telefónica / Troncal (ID Físico)</label>
                         <input 
                           value={formData.techDNA?.phoneLine}
                           onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, phoneLine: e.target.value }})}
                           placeholder="Ej: Sip Trunk / Análoga / Cloud"
                           className="w-full"
                         />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'evaluation' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Evaluación del Cliente</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salud de la Relación.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Evalúa el compromiso mutuo mediante rúbricas clave para detectar riesgos comerciales de forma temprana.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-1 gap-4">
                         {[
                           { id: 'projectLeader', label: 'Asignación de un líder de proyecto' },
                           { id: 'documentation', label: 'Entrega oportuna de documentación e información' },
                           { id: 'receptivity', label: 'Apertura y receptividad a la asesoría brindada' },
                           { id: 'continuity', label: 'Uso efectivo y continuidad en el servicio' },
                           { id: 'reportValuation', label: 'Recepción y valoración del informe de gestión' },
                           { id: 'paymentPunctuality', label: 'Puntualidad en el pago del servicio' },
                         ].map(rubric => (
                           <div key={rubric.id} className="p-6 bg-black/10 border border-white/5 rounded-[32px] flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-widest">{rubric.label}</span>
                              <div 
                                onClick={() => {
                                  const evalObj = (formData.clientEvaluation || { 
                                     projectLeader: false, timelyDocumentation: false, advisoryReceptivity: false, 
                                     effectiveServiceUse: false, serviceContinuity: false, reportValuation: false, 
                                     paymentPunctuality: false, status: 'Verde' 
                                  }) as any;
                                  const newVal = !evalObj[rubric.id];
                                  const newEval = { ...evalObj, [rubric.id]: newVal };
                                  
                                  // Recalculate status
                                  const keys = ['projectLeader', 'timelyDocumentation', 'advisoryReceptivity', 'effectiveServiceUse', 'serviceContinuity', 'reportValuation', 'paymentPunctuality'];
                                  const trueCount = keys.filter(k => newEval[k]).length;
                                  
                                  let status = 'Verde';
                                  if (trueCount <= 2) status = 'Negra';
                                  else if (trueCount <= 3) status = 'Roja';
                                  else if (trueCount <= 5) status = 'Amarilla';
                                  
                                  newEval.status = status;
                                  setFormData({...formData, clientEvaluation: newEval});
                                }}
                                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${formData.clientEvaluation?.[rubric.id as keyof typeof formData.clientEvaluation] ? 'bg-rc-teal' : 'bg-white/10'}`}
                              >
                                 <motion.div 
                                   animate={{ x: formData.clientEvaluation?.[rubric.id as keyof typeof formData.clientEvaluation] ? 28 : 4 }}
                                   className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                                 />
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="p-8 bg-rc-teal/5 border border-rc-teal/20 rounded-[40px] flex items-center justify-between">
                         <div>
                            <h4 className="text-sm font-black uppercase tracking-tighter">Estado de la Evaluación</h4>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Basado en el cumplimiento de las rúbricas anteriores</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                              formData.clientEvaluation?.status === 'Verde' ? 'bg-emerald-500 text-[var(--bg-primary)] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                              formData.clientEvaluation?.status === 'Amarilla' ? 'bg-amber-500 text-[var(--bg-primary)] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' :
                              formData.clientEvaluation?.status === 'Roja' ? 'bg-rose-500 text-[var(--bg-primary)] border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' :
                              'bg-slate-900 text-white border-white/10'
                            }`}>
                              {formData.clientEvaluation?.status}
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'services' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Servicios</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portafolio de soluciones.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Detalla los servicios activos y sus especificaciones técnicas para un seguimiento granular de la operación.
                           </p>
                        </div>
                      </header>
                        <button 
                          type="button"
                          onClick={() => setFormData({
                            ...formData, 
                            services: [...(formData.services || []), { 
                              id: Math.random().toString(36).substr(2, 9), 
                              name: '', description: '', startDate: new Date().toISOString().split('T')[0], score: 0,
                              type: 'Other'
                            }]
                          })}
                          className="bg-[var(--rc-turquoise)]/10 text-[var(--rc-turquoise)] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--rc-turquoise)]/20 transition-all flex items-center gap-2"
                        >
                          <Plus size={16} /> Añadir Servicio
                        </button>
                      </header>

                      <div className="grid grid-cols-1 gap-6">
                        {formData.services?.map((service, index) => (
                          <div key={service.id} className="p-8 bg-black/10 border border-white/5 rounded-[40px] relative group space-y-6">
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, services: formData.services?.filter(s => s.id !== service.id)})}
                              className="absolute top-6 right-6 text-rose-500 opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                            
                            <div className="grid grid-cols-[1.5fr,1fr] gap-8">
                               <div className="space-y-4">
                                  <div className="space-y-1">
                                     <label>Nombre del Servicio</label>
                                     <input 
                                       required placeholder="Ej: Plataforma de IA / Telefonía Cloud"
                                       value={service.name}
                                       onChange={e => {
                                         const s = [...(formData.services || [])];
                                         s[index].name = e.target.value;
                                         setFormData({...formData, services: s});
                                       }}
                                       className="w-full text-sm font-black uppercase tracking-widest border-none p-0 focus:ring-0 bg-transparent"
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label>Categoría Técnica</label>
                                     <select 
                                       value={service.type}
                                       onChange={e => {
                                          const s = [...(formData.services || [])];
                                          s[index].type = e.target.value as any;
                                          // Reset fields based on type
                                          if (s[index].type === 'Botmaker') s[index].botmakerType = 'Plataforma';
                                          if (s[index].type === 'Servicios Web') s[index].webServiceType = 'Onepage';
                                          if (s[index].type === 'Capacitaciones') s[index].trainingType = 'Free';
                                          setFormData({...formData, services: s});
                                       }}
                                       className="w-full text-[10px] font-black uppercase tracking-widest"
                                     >
                                        <option value="Other">Estándar</option>
                                        <option value="Botmaker">Botmaker</option>
                                        <option value="Yeastar">Yeastar</option>
                                        <option value="IPBX">IPBX</option>
                                        <option value="Contact Center">Contact Center</option>
                                        <option value="Servicios Web">Servicios Web</option>
                                        <option value="Capacitaciones">Capacitaciones</option>
                                     </select>
                                  </div>
                               </div>
                               <div className="space-y-1">
                                  <label>Breve Descripción</label>
                                  <textarea 
                                    placeholder="Detalles clave del servicio..."
                                    value={service.description}
                                    onChange={e => {
                                      const s = [...(formData.services || [])];
                                      s[index].description = e.target.value;
                                      setFormData({...formData, services: s});
                                    }}
                                    className="w-full h-20 text-[10px] font-medium leading-relaxed bg-transparent border-none p-0 focus:ring-0 resize-none"
                                  />
                               </div>
                            </div>

                            {/* Ficha Técnica Dinámica */}
                            <div className="p-6 bg-slate-900/40 rounded-[32px] border border-white/5 space-y-4">
                               <div className="flex items-center gap-2 mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--rc-turquoise)] shadow-[0_0_8px_var(--rc-turquoise)]" />
                                  <span className="text-[9px] font-black uppercase text-white tracking-widest">Configuración Técnica</span>
                               </div>

                               {service.type === 'Botmaker' && (
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Tipo de Solución Plataforma</label>
                                        <select 
                                          value={service.botmakerType}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].botmakerType = e.target.value as any;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        >
                                           <option value="Plataforma">Plataforma</option>
                                           <option value="Plataforma+Bots(Intenciones)">Plataforma+Bots(Intenciones)</option>
                                           <option value="Plataforma+ Agente IA">Plataforma+ Agente IA</option>
                                           <option value="Plataforma+ Bots+Agente IA">Plataforma+ Bots+Agente IA</option>
                                        </select>
                                     </div>
                                  </div>
                               )}

                               {(service.type === 'Yeastar' || service.type === 'IPBX') && (
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Cantidad Extensiones</label>
                                        <input 
                                          type="number"
                                          placeholder="Ej: 50"
                                          value={service.extensionCount || ''}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].extensionCount = parseInt(e.target.value) || 0;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Fecha de Inicio</label>
                                        <input 
                                          type="date"
                                          value={service.setupDate || ''}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].setupDate = e.target.value;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        />
                                     </div>
                                  </div>
                               )}

                               {service.type === 'Servicios Web' && (
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Tipo de Desarrollo</label>
                                        <select 
                                          value={service.webServiceType}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].webServiceType = e.target.value as any;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        >
                                           <option value="Onepage">Onepage</option>
                                           <option value="Pagina a la medida">Página a la medida</option>
                                        </select>
                                     </div>
                                  </div>
                               )}

                               {service.type === 'Capacitaciones' && (
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Modalidad</label>
                                        <select 
                                          value={service.trainingType}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].trainingType = e.target.value as any;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        >
                                           <option value="Free">Free</option>
                                           <option value="Costo">Costo</option>
                                        </select>
                                     </div>
                                  </div>
                               )}

                               {service.type === 'Contact Center' && (
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Cantidad de Posiciones</label>
                                        <input 
                                          type="number"
                                          placeholder="Ej: 12"
                                          value={service.positionsCount || ''}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].positionsCount = parseInt(e.target.value) || 0;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Horarios de Posiciones</label>
                                        <input 
                                          placeholder="Ej: 24/7 o L-V 08:00-17:00"
                                          value={service.shiftMatrix || ''}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].shiftMatrix = e.target.value;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        />
                                     </div>
                                  </div>
                               )}

                               {service.type === 'Other' && (
                                  <p className="text-[9px] font-medium text-slate-500 italic">No se requiere configuración técnica adicional para esta categoría.</p>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'assets' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Activos</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestión de Hardware.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Controla el inventario de equipos asignados a la operación para asegurar el cumplimiento de herramientas de trabajo.
                           </p>
                        </div>
                      </header>
                        <button 
                          type="button"
                          onClick={() => setFormData({
                            ...formData, 
                            assets: [...(formData.assets || []), { 
                              id: Math.random().toString(36).substr(2, 9), 
                              model: '', quantity: 1, purchaseDate: new Date().toISOString().split('T')[0],
                              assignedPosition: ''
                            }]
                          })}
                          className="bg-rc-teal/10 text-rc-teal px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rc-teal/20 transition-all flex items-center gap-2"
                        >
                          <Plus size={16} /> Registrar Activo
                        </button>
                      </header>

                      <div className="grid grid-cols-1 gap-4">
                        {formData.assets?.map((asset, index) => (
                          <div key={asset.id} className="p-6 bg-black/10 border border-white/5 rounded-[32px] relative group flex items-center gap-6">
                            <div className="w-12 h-12 bg-[var(--rc-turquoise)]/10 rounded-2xl flex items-center justify-center text-[var(--rc-turquoise)]">
                               <Headphones size={24} />
                            </div>
                            <div className="flex-1 grid grid-cols-4 gap-6">
                               <div className="space-y-1">
                                  <label className="text-[8px] opacity-60">Modelo / Serial</label>
                                  <input 
                                    placeholder="Ej: Jabra Biz 2300"
                                    value={asset.model}
                                    onChange={e => {
                                      const a = [...(formData.assets || [])];
                                      a[index].model = e.target.value;
                                      setFormData({...formData, assets: a});
                                    }}
                                    className="w-full text-xs font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0"
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[8px] opacity-60">Cantidad</label>
                                  <input 
                                    type="number" value={asset.quantity}
                                    onChange={e => {
                                      const a = [...(formData.assets || [])];
                                      a[index].quantity = parseInt(e.target.value) || 0;
                                      setFormData({...formData, assets: a});
                                    }}
                                    className="w-full text-xs font-black bg-transparent border-none p-0 focus:ring-0"
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[8px] opacity-60">Posición Asignada</label>
                                  <input 
                                    placeholder="Ej: POS-01"
                                    value={asset.assignedPosition}
                                    onChange={e => {
                                      const a = [...(formData.assets || [])];
                                      a[index].assignedPosition = e.target.value;
                                      setFormData({...formData, assets: a});
                                    }}
                                    className="w-full text-xs font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0"
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[8px] opacity-60">Adquisición</label>
                                  <input 
                                    type="date" value={asset.purchaseDate}
                                    onChange={e => {
                                      const a = [...(formData.assets || [])];
                                      a[index].purchaseDate = e.target.value;
                                      setFormData({...formData, assets: a});
                                    }}
                                    className="w-full text-xs font-medium bg-transparent border-none p-0 focus:ring-0"
                                  />
                               </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, assets: formData.assets?.filter(a => a.id !== asset.id)})}
                              className="text-rose-500 opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'strategy' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Estrategia</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calidad y SLA.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Configura los tiempos de respuesta y las tareas recurrentes que definen el éxito y cumplimiento del proyecto.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-[1.5fr,2fr] gap-12">
                         <div className="p-8 bg-black/10 border border-white/5 rounded-[40px] space-y-8">
                            <div className="space-y-2">
                               <div className="flex justify-between items-center">
                                  <label>Parámetros Globales de SLA</label>
                                  <span className="text-2xl font-black text-rc-teal">{formData.strategy?.defaultTaskWeight}/10</span>
                               </div>
                               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">Importancia promedio de las tareas</p>
                               <input 
                                 type="range" min="1" max="10" step="1"
                                 value={formData.strategy?.defaultTaskWeight}
                                 onChange={e => setFormData({...formData, strategy: { ...formData.strategy!, defaultTaskWeight: parseInt(e.target.value) }})}
                                 className="w-full accent-rc-teal"
                               />
                            </div>
                            <div className="space-y-4 pt-6 border-t border-white/5">
                               <label>SLA de Respuesta (Horas)</label>
                               <div className="relative">
                                  <input 
                                    type="number" value={formData.strategy?.responseSla}
                                    onChange={e => setFormData({...formData, strategy: { ...formData.strategy!, responseSla: parseInt(e.target.value) || 0 }})}
                                    className="w-full pl-6 pr-20 py-4 text-xl font-black"
                                  />
                                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Horas</span>
                               </div>
                               <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">Tiempo máximo prometido al cliente para resolver incidencias técnicas.</p>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <label>Tareas Recurrentes (Base)</label>
                               <button 
                                 type="button"
                                 onClick={() => {
                                    const tasks = [...(formData.strategy?.recurringTasks || [])];
                                    tasks.push('');
                                    setFormData({...formData, strategy: { ...formData.strategy!, recurringTasks: tasks }});
                                 }}
                                 className="p-2 text-[var(--rc-turquoise)] hover:bg-[var(--rc-turquoise)]/10 rounded-lg transition-all"
                               >
                                  <Plus size={20} />
                                </button>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                               {formData.strategy?.recurringTasks?.map((task, idx) => (
                                  <div key={idx} className="flex items-center gap-3 group">
                                     <div className="w-2 h-2 rounded-full bg-[var(--rc-turquoise)] shrink-0" />
                                     <input 
                                       placeholder="Ej: Reporte de Calidad Semanal"
                                       value={task}
                                       onChange={e => {
                                          const t = [...(formData.strategy?.recurringTasks || [])];
                                          t[idx] = e.target.value;
                                          setFormData({...formData, strategy: { ...formData.strategy!, recurringTasks: t }});
                                       }}
                                       className="flex-1 bg-white/5 border-none py-3 px-4 rounded-xl text-[11px] font-bold text-white placeholder:text-slate-600 focus:bg-white/10"
                                     />
                                     <button 
                                       type="button"
                                       onClick={() => {
                                          const t = (formData.strategy?.recurringTasks || []).filter((_, i) => i !== idx);
                                          setFormData({...formData, strategy: { ...formData.strategy!, recurringTasks: t }});
                                       }}
                                       className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <X size={14} />
                                     </button>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-10 bg-black/40 border-t border-white/5 flex items-center justify-between backdrop-blur-3xl">
                <button type="button" onClick={onClose} className="px-10 py-5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
                <button 
                  type="submit"
                  className="px-12 py-5 bg-rc-teal text-black text-[11px] font-semibold uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(59,188,169,0.2)] hover:scale-105 active:scale-95 transition-all"
                >
                  Actualizar Cuenta de Cliente
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
