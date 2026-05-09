import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Plus, Upload, Activity, Globe, Layers, Headphones, Settings, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ClientService, OperationPulse, TechDNA, HardwareAsset } from '../../types/project';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project | null;
}

type TabType = 'basic' | 'ops' | 'tech' | 'services' | 'assets';

const ProjectModal: React.FC<Props> = ({ isOpen, onClose, onSave, project }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  
  const [formData, setFormData] = useState<Partial<Project>>({
    client: '',
    startDate: new Date().toISOString().split('T')[0],
    services: [],
    evaluations: [],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', shifts: [] },
    techDNA: { operationMode: 'REMOTE', isp: '', phoneLine: '' },
    assets: []
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        opsPulse: project.opsPulse || { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', shifts: [] },
        techDNA: project.techDNA || { operationMode: 'REMOTE', isp: '', phoneLine: '' },
        assets: project.assets || []
      });
    } else {
      setFormData({
        client: '',
        startDate: new Date().toISOString().split('T')[0],
        services: [],
        evaluations: [],
        healthFlag: 'Verde',
        opsPulse: { hcContracted: 0, hcReal: 0, backupStatus: 'Disponible', shifts: [] },
        techDNA: { operationMode: 'REMOTE', isp: '', phoneLine: '' },
        assets: []
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
      client: formData.client.trim(),
      logoUrl: formData.logoUrl,
      startDate: formData.startDate!,
      services: cleanServices,
      evaluations: formData.evaluations || [],
      healthFlag: formData.healthFlag as any || 'Verde',
      opsPulse: formData.opsPulse as OperationPulse,
      techDNA: formData.techDNA as TechDNA,
      assets: formData.assets as HardwareAsset[]
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
                        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">Identidad</h2>
                        <p className="text-[var(--text-secondary)] text-xs font-medium">Configuración base del cliente y nivel de salud estratégica.</p>
                      </header>

                      <div className="flex items-center gap-8 p-8 bg-black/10 rounded-[40px] border border-white/5">
                        <div className="w-32 h-32 bg-black/20 rounded-[32px] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group shrink-0">
                          {formData.logoUrl ? (
                            <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                          ) : (
                            <div className="text-center p-2 opacity-40">
                              <Upload size={32} className="mx-auto mb-2" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Logo</span>
                            </div>
                          )}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <Upload size={24} className="text-white" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          </label>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-rc-teal uppercase tracking-widest ml-1">Nombre del Cliente</label>
                            <input 
                              required value={formData.client}
                              onChange={e => setFormData({...formData, client: e.target.value})}
                              placeholder="Ej: Rc506 Solutions"
                              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal transition-all text-[var(--text-primary)]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Bandera de Salud</label>
                          <select 
                            value={formData.healthFlag}
                            onChange={e => setFormData({...formData, healthFlag: e.target.value as any})}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-rc-teal/20 transition-all text-[var(--text-primary)] appearance-none cursor-pointer"
                          >
                            <option value="Verde">🟢 Óptimo (Verde)</option>
                            <option value="Amarilla">🟡 Preventivo (Amarilla)</option>
                            <option value="Roja">🔴 Riesgo (Roja)</option>
                            <option value="Negra">⚫ Crítico (Negra)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Fecha de Onboarding</label>
                          <input 
                            type="date" required value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-rc-teal/20 transition-all text-[var(--text-primary)]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'ops' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header>
                        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">Operaciones</h2>
                        <p className="text-[var(--text-secondary)] text-xs font-medium">Pulso operativo y capacidad instalada (HC).</p>
                      </header>

                      <div className="grid grid-cols-2 gap-8 p-8 bg-black/10 rounded-[40px] border border-white/5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-rc-teal uppercase tracking-widest ml-1">HC Contratado</label>
                          <input 
                            type="number" value={formData.opsPulse?.hcContracted}
                            onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcContracted: parseInt(e.target.value) || 0 }})}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-lg font-black outline-none focus:ring-2 focus:ring-rc-teal/20 transition-all text-[var(--text-primary)]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-rc-teal uppercase tracking-widest ml-1">HC Real (Asignado)</label>
                          <input 
                            type="number" value={formData.opsPulse?.hcReal}
                            onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcReal: parseInt(e.target.value) || 0 }})}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-lg font-black outline-none focus:ring-2 focus:ring-rc-teal/20 transition-all text-[var(--text-primary)]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Estatus de Backup (Contingencia)</label>
                        <div className="flex gap-4">
                          {['Disponible', 'En Uso', 'Crítico'].map(status => (
                            <button
                              key={status} type="button"
                              onClick={() => setFormData({...formData, opsPulse: { ...formData.opsPulse!, backupStatus: status as any }})}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                formData.opsPulse?.backupStatus === status 
                                ? 'bg-rc-teal/10 border-rc-teal text-rc-teal shadow-inner' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'tech' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header>
                        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">Tech DNA</h2>
                        <p className="text-[var(--text-secondary)] text-xs font-medium">Infraestructura, conectividad y modalidad de operación.</p>
                      </header>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-rc-teal uppercase tracking-widest ml-1">Modalidad de Operación</label>
                        <div className="flex gap-4">
                          {['REMOTE', 'WIP', 'HÍBRIDO'].map(mode => (
                            <button
                              key={mode} type="button"
                              onClick={() => setFormData({...formData, techDNA: { ...formData.techDNA!, operationMode: mode as any }})}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                formData.techDNA?.operationMode === mode 
                                ? 'bg-rc-teal text-white border-rc-teal shadow-lg shadow-rc-teal/20' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)]'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Proveedor de Internet (ISP)</label>
                          <input 
                            value={formData.techDNA?.isp}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, isp: e.target.value }})}
                            placeholder="Ej: Liberty / Telecable"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-rc-teal/20 transition-all text-[var(--text-primary)]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Línea Telefónica / Troncal</label>
                          <input 
                            value={formData.techDNA?.phoneLine}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, phoneLine: e.target.value }})}
                            placeholder="Ej: Sip Trunk / Análoga"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-rc-teal/20 transition-all text-[var(--text-primary)]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'services' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <header className="flex justify-between items-end">
                        <div>
                          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">Servicios</h2>
                          <p className="text-[var(--text-secondary)] text-xs font-medium">Portafolio de soluciones activas.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({
                            ...formData, 
                            services: [...(formData.services || []), { 
                              id: Math.random().toString(36).substr(2, 9), 
                              name: '', description: '', startDate: new Date().toISOString().split('T')[0], score: 0 
                            }]
                          })}
                          className="bg-rc-teal/10 text-rc-teal px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rc-teal/20 transition-all flex items-center gap-2"
                        >
                          <Plus size={16} /> Añadir
                        </button>
                      </header>

                      <div className="grid grid-cols-1 gap-4">
                        {formData.services?.map((service, index) => (
                          <div key={service.id} className="p-6 bg-black/10 border border-white/5 rounded-3xl relative group">
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, services: formData.services?.filter(s => s.id !== service.id)})}
                              className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/10 rounded-xl"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input 
                                required placeholder="Nombre del Servicio (Ej: Contact Center)"
                                value={service.name}
                                onChange={e => {
                                  const s = [...(formData.services || [])];
                                  s[index].name = e.target.value;
                                  setFormData({...formData, services: s});
                                }}
                                className="w-full bg-transparent border-b border-white/10 py-2 text-xs font-black uppercase tracking-widest outline-none focus:border-rc-teal transition-all text-[var(--text-primary)]"
                              />
                              <input 
                                placeholder="Descripción breve"
                                value={service.description}
                                onChange={e => {
                                  const s = [...(formData.services || [])];
                                  s[index].description = e.target.value;
                                  setFormData({...formData, services: s});
                                }}
                                className="w-full bg-transparent border-b border-white/10 py-2 text-[10px] font-medium outline-none focus:border-rc-teal transition-all text-[var(--text-primary)]"
                              />
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
                          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">Activos</h2>
                          <p className="text-[var(--text-secondary)] text-xs font-medium">Registro de Hardware y tangibles (Headsets).</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({
                            ...formData, 
                            assets: [...(formData.assets || []), { 
                              id: Math.random().toString(36).substr(2, 9), 
                              model: '', quantity: 1, purchaseDate: new Date().toISOString().split('T')[0]
                            }]
                          })}
                          className="bg-rc-teal/10 text-rc-teal px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rc-teal/20 transition-all flex items-center gap-2"
                        >
                          <Plus size={16} /> Registrar Hardware
                        </button>
                      </header>

                      <div className="grid grid-cols-1 gap-4">
                        {formData.assets?.map((asset, index) => (
                          <div key={asset.id} className="p-6 bg-black/10 border border-white/5 rounded-3xl grid grid-cols-3 gap-6 relative group">
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, assets: formData.assets?.filter(a => a.id !== asset.id)})}
                              className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity scale-90"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Modelo</label>
                              <input 
                                value={asset.model}
                                onChange={e => {
                                  const a = [...(formData.assets || [])];
                                  a[index].model = e.target.value;
                                  setFormData({...formData, assets: a});
                                }}
                                className="w-full bg-white/5 rounded-xl px-4 py-2 text-xs font-bold outline-none border border-white/5"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Cantidad</label>
                              <input 
                                type="number" value={asset.quantity}
                                onChange={e => {
                                  const a = [...(formData.assets || [])];
                                  a[index].quantity = parseInt(e.target.value) || 0;
                                  setFormData({...formData, assets: a});
                                }}
                                className="w-full bg-white/5 rounded-xl px-4 py-2 text-xs font-bold outline-none border border-white/5"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Compra</label>
                              <input 
                                type="date" value={asset.purchaseDate}
                                onChange={e => {
                                  const a = [...(formData.assets || [])];
                                  a[index].purchaseDate = e.target.value;
                                  setFormData({...formData, assets: a});
                                }}
                                className="w-full bg-white/5 rounded-xl px-4 py-2 text-xs font-bold outline-none border border-white/5"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-12 border-t border-white/5 flex gap-4 bg-black/20">
                <button 
                  type="button" onClick={onClose}
                  className="px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-rc-teal text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-rc-teal/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} /> {project ? 'Actualizar Cliente' : 'Crear Cliente Elite'}
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
