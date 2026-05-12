import React, { useState } from 'react';
import { initialProjects, initialTasks } from '../lib/mockData';
import { 
  Activity, TrendingUp, Users, AlertCircle, Clock, CheckCircle, 
  ShieldCheck, Zap, Globe, MessageSquare, BrainCircuit, Search, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const IntelligenceDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [projects] = useState(initialProjects);
  const [tasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState<'global' | 'rc506'>('rc506');

  const activeAccounts = projects.filter(p => p.adminStatus === 'Activo').length;
  const criticalAccounts = projects.filter(p => p.healthFlag === 'Roja').length;
  const globalQuality = 94; // Score estático para la visual según captura

  return (
    <div className="flex h-full gap-8">
      {/* Main Intelligence Center (Left) */}
      <div className="flex-1 space-y-12">
        
        {/* Header Ejecutivo */}
        <header className="flex justify-between items-center">
           <div>
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-1">RESUMEN EJECUTIVO V3.5</h2>
              <div className="flex items-center gap-6 mt-6">
                 <button 
                    onClick={() => setViewMode('global')}
                    className={`flex flex-col items-center gap-3 transition-all ${viewMode === 'global' ? 'opacity-100 scale-110' : 'opacity-30 grayscale hover:opacity-50'}`}
                 >
                    <div className="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center p-3">
                       <Globe size={24} className="text-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Global</span>
                 </button>
                 <button 
                    onClick={() => setViewMode('rc506')}
                    className={`flex flex-col items-center gap-3 transition-all ${viewMode === 'rc506' ? 'opacity-100 scale-110' : 'opacity-30 grayscale hover:opacity-50'}`}
                 >
                    <div className="w-14 h-14 rounded-full border-2 border-rc-teal flex items-center justify-center p-3 bg-rc-teal/10 shadow-[0_0_20px_rgba(59,188,169,0.3)]">
                       <ShieldCheck size={24} className="text-rc-teal" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">RC506</span>
                 </button>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-500 hover:text-white transition-all"><Bell size={20} /></button>
              <button className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-500 hover:text-white transition-all"><Search size={20} /></button>
           </div>
        </header>

        {/* Intelligence Title & Health Index */}
        <div className="flex justify-between items-end pt-4">
           <div>
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none mb-4">CENTRO DE INTELIGENCIA</h1>
              <p className="text-rc-teal text-sm font-black uppercase tracking-[0.4em]">CALIDAD GLOBAL DE CARTERA RC506</p>
           </div>
           <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] flex items-center gap-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-rc-teal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-rc-teal/10 rounded-[32px] flex items-center justify-center text-rc-teal shadow-2xl shadow-rc-teal/20">
                 <BrainCircuit size={40} />
              </div>
              <div className="text-right">
                 <div className="flex items-center gap-3 justify-end mb-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HEALTH INDEX</span>
                    <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
                 </div>
                 <h3 className="text-6xl font-black text-white leading-none">{globalQuality}%</h3>
              </div>
           </div>
        </div>

        {/* Charts Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Matrix of Excellence (Radar) */}
           <div className="bg-white/[0.02] border border-white/5 rounded-[56px] p-12 relative overflow-hidden group hover:border-rc-teal/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">MATRIZ DE EXCELENCIA</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atributos de Valor Global</p>
                 </div>
                 <div className="p-5 bg-rc-teal/10 rounded-3xl text-rc-teal shadow-xl">
                    <Activity size={28} />
                 </div>
              </div>
              
              {/* Radar Chart Visual */}
              <div className="aspect-square flex items-center justify-center relative p-8">
                 {[0.2, 0.4, 0.6, 0.8, 1].map(scale => (
                    <div key={scale} className="absolute border-[0.5px] border-white/5 rounded-full" style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }} />
                 ))}
                 
                 {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(deg => (
                    <div key={deg} className="absolute w-[0.5px] h-full bg-white/5" style={{ transform: `rotate(${deg}deg)` }} />
                 ))}

                 <div className="absolute top-0 text-[9px] font-black text-slate-400 uppercase tracking-widest">T. Respuesta</div>
                 <div className="absolute top-[15%] right-[5%] text-[9px] font-black text-slate-400 uppercase tracking-widest">Comunicación</div>
                 <div className="absolute top-[45%] right-0 text-[9px] font-black text-slate-400 uppercase tracking-widest">Resolución</div>
                 <div className="absolute bottom-[15%] right-[10%] text-[9px] font-black text-slate-400 uppercase tracking-widest">Proactividad</div>
                 <div className="absolute bottom-0 text-[9px] font-black text-slate-400 uppercase tracking-widest">Tech DNA</div>
                 <div className="absolute bottom-[15%] left-[10%] text-[9px] font-black text-slate-400 uppercase tracking-widest">Confiabilidad</div>
                 <div className="absolute top-[45%] left-0 text-[9px] font-black text-slate-400 uppercase tracking-widest">Flexibilidad</div>
                 <div className="absolute top-[15%] left-[5%] text-[9px] font-black text-slate-400 uppercase tracking-widest">Innovación</div>

                 <svg className="w-full h-full relative z-10 drop-shadow-[0_0_30px_rgba(59,188,169,0.4)]">
                    <path 
                      d="M150,60 L210,100 L240,160 L200,220 L130,240 L70,210 L50,140 L90,80 Z" 
                      fill="rgba(59,188,169,0.15)" 
                      stroke="#3BC7AA" 
                      strokeWidth="3"
                    />
                 </svg>
              </div>
           </div>

           {/* Quarterly Evolution */}
           <div className="bg-white/[0.02] border border-white/5 rounded-[56px] p-12 relative overflow-hidden flex flex-col group hover:border-rc-teal/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">EVOLUCIÓN TRIMESTRAL</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Satisfacción del Cliente Proyectada</p>
                 </div>
                 <div className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Tendencia al Alza</span>
                 </div>
              </div>

              <div className="flex-1 flex flex-col justify-end gap-2">
                 <div className="w-full h-64 bg-gradient-to-t from-rc-teal/20 to-transparent border-b border-rc-teal/30 relative overflow-hidden rounded-t-[40px]">
                    <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                       <path d="M0,160 Q100,150 200,130 T400,90 T600,70 L600,200 L0,200 Z" fill="rgba(59,188,169,0.1)" />
                       <path d="M0,160 Q100,150 200,130 T400,90 T600,70" fill="none" stroke="#3BC7AA" strokeWidth="4" />
                    </svg>
                 </div>
                 <div className="flex justify-between px-6 pt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    {['Feb', 'Mar', 'Abr', 'May', 'Jun'].map(m => <span key={m}>{m}</span>)}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Right Column: Live Health Panel */}
      <div className="w-[400px] space-y-8 h-full overflow-y-auto pr-2 custom-scrollbar">
         <div className="bg-white/[0.02] border border-white/5 rounded-[48px] p-10 flex flex-col min-h-full shadow-2xl backdrop-blur-3xl">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-lg font-black text-white uppercase tracking-tighter">LIVE HEALTH</h3>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">REAL-TIME</span>
               </div>
            </div>

            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 border-b border-white/5 pb-4">ESTADO OPERATIVO DE CUENTAS</p>

            <div className="grid grid-cols-2 gap-6 mb-12">
               {[
                  { label: 'Cuentas', value: activeAccounts, icon: Users, color: 'text-white' },
                  { label: 'Críticas', value: criticalAccounts, icon: AlertCircle, color: 'text-rose-500' },
                  { label: 'Calidad', value: `${globalQuality}%`, icon: TrendingUp, color: 'text-rc-teal' },
                  { label: 'Pendientes', value: tasks.length, icon: Clock, color: 'text-amber-500' }
               ].map(stat => (
                  <div key={stat.label} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex flex-col gap-4 group hover:border-white/10 transition-all">
                     <div className="flex justify-between items-center">
                        <stat.icon size={18} className={stat.color} />
                        <h4 className="text-2xl font-black text-white leading-none">{stat.value}</h4>
                     </div>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
               ))}
            </div>

            <div className="space-y-8">
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  ALERTAS ESTRATÉGICAS <div className="p-1 bg-rose-500/20 text-rose-500 rounded-md"><AlertCircle size={10} /></div>
               </h3>
               
               <div className="h-24 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center">
                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Sin alertas críticas</span>
               </div>

               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 pt-6">
                  ESTADO DEL EQUIPO <div className="p-1 bg-rc-teal/20 text-rc-teal rounded-md"><Activity size={10} /></div>
               </h3>
               
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-rc-teal transition-colors uppercase">
                           AD
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center">
                              <p className="text-[10px] font-black text-slate-300 uppercase">Analista Técnico {i}</p>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-rc-teal w-3/4 shadow-[0_0_8px_#3BC7AA]" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default IntelligenceDashboard;
