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

type TabType = 'basic' | 'ops' | 'tech' | 'services' | 'assets' | 'strategy';

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
    opsPulse: { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', operationType: 'Servicio al Cliente', shifts: [] },
    techDNA: { operationMode: 'REMOTE', isp: '', phoneLine: '', internetSpeed: '', connectivityType: 'Fibra Óptica', redundancy: false },
    assets: [],
    strategy: { recurringTasks: [], defaultTaskWeight: 5, responseSla: 24 }
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        opsPulse: project.opsPulse || { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', operationType: 'Servicio al Cliente', shifts: [] },
        techDNA: project.techDNA || { operationMode: 'REMOTE', isp: '', phoneLine: '', internetSpeed: '', connectivityType: 'Fibra Óptica', redundancy: false },
        assets: project.assets || [],
        strategy: project.strategy || { recurringTasks: [], defaultTaskWeight: 5, responseSla: 24 }
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
        techDNA: { operationMode: 'REMOTE', isp: '', phoneLine: '', internetSpeed: '', connectivityType: 'Fibra Óptica', redundancy: false },
        assets: [],
        strategy: { recurringTasks: [], defaultTaskWeight: 5, responseSla: 24 }
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
      strategy: formData.strategy as StrategySLA
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
                <h3 className="text-rc-teal font-black text-xs uppercase tracking-[0.3em] mb-1">Elite V3.5</h3>
                <p className="text-[var(--text-secondary)] text-[9px] font-bold uppercase opacity-50">Gestión de Cuenta</p>
              </div>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                    ? 'bg-rc-teal text-white shadow-lg shadow-rc-teal/20' 
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
                      <header>
                        <h2 className="section-title">Identidad</h2>
                        <p className="text-[var(--text-secondary)] text-xs font-medium">Configuración base del cliente y nivel de salud estratégica.</p>
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
                      <header>
                        <h2 className="section-title">Operaciones</h2>
                        <p className="text-[var(--text-secondary)] text-xs font-medium">Pulso operativo y capacidad instalada (HC).</p>
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
                                 <label>HC Contratado</label>
                                 <input 
                                   type="number" value={formData.opsPulse?.hcContracted}
                                   onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcContracted: parseInt(e.target.value) || 0 }})}
                                   className="w-full text-lg font-black"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label>HC Real (Asignado)</label>
                                 <input 
                                   type="number" value={formData.opsPulse?.hcReal}
                                   onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcReal: parseInt(e.target.value) || 0 }})}
                                   className="w-full text-lg font-black"
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
                      <header>
                        <h2 className="section-title">Tech DNA</h2>
                        <p className="text-[var(--text-secondary)] text-xs font-medium">Infraestructura, conectividad y modalidad de operación.</p>
                      </header>

                      <div className="space-y-2">
                        <label>Modalidad de Operación</label>
                        <div className="flex gap-4">
                          {['REMOTE', 'WIP', 'HÍBRIDO'].map(mode => (
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

                      <div className="space-y-2">
                         <label>Línea Telefónica / Troncal</label>
                         <input 
                           value={formData.techDNA?.phoneLine}
                           onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, phoneLine: e.target.value }})}
                           placeholder="Ej: Sip Trunk / Análoga"
                           className="w-full"
                         />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'services' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <header className="flex justify-between items-end">
                        <div>
                          <h2 className="section-title">Servicios</h2>
                          <p className="text-[var(--text-secondary)] text-xs font-medium">Portafolio de soluciones activas y bitácora técnica.</p>
                        </div>
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
                                          setFormData({...formData, services: s});
                                       }}
                                       className="w-full text-[10px] font-black uppercase tracking-widest"
                                     >
                                        <option value="Other">Estandar</option>
                                        <option value="Platform">Plataforma (Bot)</option>
                                        <option value="Telephony">Telefonía (Yeastar/Gstar)</option>
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
                                  <span className="text-[9px] font-black uppercase text-white tracking-widest">Ficha Técnica (Logbook)</span>
                               </div>

                               {service.type === 'Platform' && (
                                  <div className="grid grid-cols-3 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Tipo de Bot</label>
                                        <select 
                                          value={service.botType}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].botType = e.target.value as any;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        >
                                           <option value="IA Generativa">IA Generativa</option>
                                           <option value="Flujos">Flujos</option>
                                           <option value="Híbrido">Híbrido</option>
                                        </select>
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Propósito</label>
                                        <select 
                                          value={service.purpose}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].purpose = e.target.value as any;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        >
                                           <option value="Generar Leads">Generar Leads</option>
                                           <option value="Resolver dudas">Resolver dudas</option>
                                           <option value="Autogestión">Autogestión</option>
                                        </select>
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Última Actualización</label>
                                        <input 
                                          type="date" value={service.lastUpdate}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].lastUpdate = e.target.value;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        />
                                     </div>
                                  </div>
                               )}

                               {service.type === 'Telephony' && (
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">ID de Troncal / PBX</label>
                                        <input 
                                          placeholder="Ej: SIP-TRUNK-01"
                                          value={service.trunkId}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].trunkId = e.target.value;
                                             setFormData({...formData, services: s});
                                          }}
                                          className="w-full py-2 px-3 text-[10px]"
                                        />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[8px] opacity-60">Último Acceso Admin</label>
                                        <input 
                                          type="date" value={service.lastAdminAccess}
                                          onChange={e => {
                                             const s = [...(formData.services || [])];
                                             s[index].lastAdminAccess = e.target.value;
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
                      <header className="flex justify-between items-end">
                        <div>
                          <h2 className="section-title">Activos</h2>
                          <p className="text-[var(--text-secondary)] text-xs font-medium">Inventario de hardware y trazabilidad por posición.</p>
                        </div>
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
                          className="bg-[var(--rc-turquoise)]/10 text-[var(--rc-turquoise)] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--rc-turquoise)]/20 transition-all flex items-center gap-2"
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
                      <header>
                        <h2 className="section-title">Estrategia</h2>
                        <p className="text-[var(--text-secondary)] text-xs font-medium">Configuración de SLA y automatización de tareas base.</p>
                      </header>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="p-8 bg-black/10 border border-white/5 rounded-[40px] space-y-6">
                            <label>Parámetros Globales de SLA</label>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peso Default Tarea</span>
                                     <span className="text-xl font-black text-[var(--rc-turquoise)]">{formData.strategy?.defaultTaskWeight}/10</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="10" step="1"
                                    value={formData.strategy?.defaultTaskWeight}
                                    onChange={e => setFormData({...formData, strategy: { ...formData.strategy!, defaultTaskWeight: parseInt(e.target.value) }})}
                                    className="w-full accent-[var(--rc-turquoise)]"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label>SLA de Respuesta (Horas)</label>
                                  <input 
                                    type="number" value={formData.strategy?.responseSla}
                                    onChange={e => setFormData({...formData, strategy: { ...formData.strategy!, responseSla: parseInt(e.target.value) || 0 }})}
                                    className="w-full text-lg font-black"
                                  />
                                  <p className="text-[9px] text-slate-500 font-medium italic">Tiempo máximo esperado para la resolución de tickets de soporte.</p>
                               </div>
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

              <div className="p-10 border-t border-white/5 bg-black/20 flex justify-end gap-6 items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-premium px-12 py-4 rounded-2xl text-[11px] flex items-center gap-3"
                >
                  <Save size={18} /> {project ? 'Guardar Cambios' : 'Crear Proyecto Estratégico'}
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
