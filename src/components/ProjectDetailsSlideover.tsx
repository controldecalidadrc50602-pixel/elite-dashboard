import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Calendar, Star, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ClientService, Evaluation } from '../pages/Dashboard';

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (project: Project) => void;
}

const ProjectDetailsSlideover: React.FC<Props> = ({ project, isOpen, onClose, onUpdate }) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'services' | 'evaluations'>('services');
  const [newService, setNewService] = useState({ name: '', description: '', score: 5 });
  const [newEvaluation, setNewEvaluation] = useState<Evaluation>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    quantitative: 5,
    qualitative: '',
    status: 'Stable'
  });

  const handleAddService = () => {
    if (!newService.name) return;
    const service: ClientService = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name,
      description: newService.description,
      startDate: new Date().toISOString().split('T')[0],
      score: newService.score
    };
    onUpdate({ ...project, services: [...project.services, service] });
    setNewService({ name: '', description: '', score: 5 });
  };

  const handleAddEvaluation = () => {
    onUpdate({ ...project, evaluations: [newEvaluation, ...project.evaluations] });
    setNewEvaluation({ ...newEvaluation, qualitative: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#020617] border-l border-white/10 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{project.client}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                   <Calendar size={12} /> Cliente desde: {project.startDate}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-2 bg-slate-950/50 border-b border-white/5">
               <TabNavItem active={activeTab === 'services'} onClick={() => setActiveTab('services')} label="Portafolio de Servicios" />
               <TabNavItem active={activeTab === 'evaluations'} onClick={() => setActiveTab('evaluations')} label="Auditoría Mensual" />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {activeTab === 'services' ? (
                <div className="space-y-6">
                  {/* List Services */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Servicios Contratados</h4>
                    {project.services.map(s => (
                      <div key={s.id} className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex justify-between items-start group">
                        <div>
                           <div className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{s.name}</div>
                           <p className="text-xs text-slate-500 leading-relaxed mb-2">{s.description}</p>
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < s.score ? 'text-cyan-400 fill-cyan-400' : 'text-slate-800'} />
                               ))}
                           </div>
                        </div>
                        <button className="text-slate-700 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                           <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Service Initializer */}
                  <div className="bg-slate-950/40 rounded-3xl p-6 border border-white/5 border-dashed">
                     <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-cyan-500" /> Incorporar Nuevo Servicio
                     </h4>
                     <div className="space-y-4">
                        <input 
                           placeholder="Nombre del servicio (ej. Central Telefónica)" 
                           value={newService.name}
                           onChange={e => setNewService({...newService, name: e.target.value})}
                           className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                        <textarea 
                           placeholder="Descripción técnica del despliegue..." 
                           value={newService.description}
                           onChange={e => setNewService({...newService, description: e.target.value})}
                           className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-cyan-500 outline-none h-20"
                        />
                        <button 
                           onClick={handleAddService}
                           className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all"
                        >
                           Actualizar Contrato
                        </button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                   {/* Create Evaluation */}
                   <div className="bg-gradient-to-br from-slate-900 to-[#020617] p-6 rounded-3xl border border-white/10 shadow-xl">
                      <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                         <Star size={18} className="text-amber-400" /> Registrar Nueva Auditoría
                      </h4>
                      <div className="space-y-5">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 ml-1">Score Cuantitativo (1-5)</label>
                               <input 
                                  type="number" min="1" max="5" 
                                  value={newEvaluation.quantitative}
                                  onChange={e => setNewEvaluation({...newEvaluation, quantitative: parseInt(e.target.value)})}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-cyan-400 font-bold"
                               />
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 ml-1">Estatus Estratégico</label>
                               <select 
                                  value={newEvaluation.status}
                                  onChange={e => setNewEvaluation({...newEvaluation, status: e.target.value as any})}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300"
                               >
                                  <option value="Stable">Stable</option>
                                  <option value="Growth">Growth</option>
                                  <option value="At Risk">At Risk</option>
                                  <option value="Critical">Critical</option>
                               </select>
                            </div>
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 ml-1">Feedback Cualitativo (Narrativa CEO)</label>
                            <textarea 
                               placeholder="Describa el estado real de la cuenta. ¿Hay riesgos? ¿Qué se espera del cliente?" 
                               value={newEvaluation.qualitative}
                               onChange={e => setNewEvaluation({...newEvaluation, qualitative: e.target.value})}
                               className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm h-32 outline-none focus:border-cyan-500/50"
                            />
                         </div>
                         <button 
                            onClick={handleAddEvaluation}
                            className="w-full bg-white text-slate-950 font-black py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-400 transition-colors"
                         >
                            Firmar Evaluación
                         </button>
                      </div>
                   </div>

                   {/* History List */}
                   <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Histórico de Evaluaciones</h4>
                      {project.evaluations.map((ev, idx) => (
                        <div key={idx} className="bg-slate-900/20 border border-white/5 p-4 rounded-2xl relative">
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-slate-500 uppercase">Mes {ev.month} / {ev.year}</span>
                              <div className="flex items-center gap-1">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={8} className={i < ev.quantitative ? 'text-amber-400 fill-amber-400' : 'text-slate-800'} />
                                 ))}
                              </div>
                           </div>
                           <p className="text-xs text-slate-400 leading-relaxed italic">"{ev.qualitative}"</p>
                           <div className={`mt-3 text-[9px] font-black uppercase tracking-tighter w-fit px-1.5 py-0.5 rounded border ${
                              ev.status === 'Stable' ? 'text-emerald-500 border-emerald-500/20' : 
                              ev.status === 'At Risk' ? 'text-amber-500 border-amber-500/20' : 'text-rose-500 border-rose-500/20'
                           }`}>
                              {ev.status}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/5 bg-slate-900/40 flex items-center justify-end gap-3">
               <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-white transition-colors">Cerrar</button>
               <button className="px-6 py-2.5 rounded-xl bg-cyan-600/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 flex items-center gap-2">
                  <Save size={14} /> Guardar Cambios
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TabNavItem = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${active ? 'text-cyan-400 border-cyan-400' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
  >
    {label}
  </button>
);

export default ProjectDetailsSlideover;
