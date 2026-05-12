import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Search, Bell, Database, 
  ArrowUpRight, Star, Inbox, History, LayoutGrid, List,
  Calendar, ChevronDown, Filter, Archive
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'history'>('inbox');

  const stats = [
    { label: 'TOTAL TRANSACCIONES', value: '12', change: '+12%', icon: Zap, color: 'text-rc-teal' },
    { label: 'SCORE CALIDAD', value: '0%', change: '+2.4%', icon: Activity, color: 'text-rc-blue' },
    { label: 'CSAT INDEX', value: '0.0', change: '+0.5', icon: Star, color: 'text-amber-400' }
  ];

  const taxonomy = [
    { label: 'NECESITA COACHING', color: 'bg-orange-500' },
    { label: 'ALERTA CRÍTICA', color: 'bg-red-500' },
    { label: 'MANEJO CLIENTE', color: 'bg-blue-500' },
    { label: 'NO RELEVANTE', color: 'bg-slate-400' },
    { label: 'OFRECIMIENTO ADICIONAL', color: 'bg-sky-500' },
    { label: 'NO USO EMOJIS', color: 'bg-emerald-500' },
    { label: 'APOYO VISUAL', color: 'bg-yellow-500' },
    { label: 'RIESGO CHURN', color: 'bg-rose-500' },
    { label: 'UPSELL/VENTA', color: 'bg-purple-500' },
    { label: 'WOW MOMENT', color: 'bg-orange-400' },
    { label: 'ERROR TÉCNICO', color: 'bg-yellow-600' },
    { label: 'ESCALAMIENTO', color: 'bg-blue-600' },
    { label: 'MEJORA PROCESO', color: 'bg-indigo-500' },
    { label: 'SOLICITUD EMPLEO', color: 'bg-violet-500' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 premium-card flex items-center justify-center text-rc-blue">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">CRM de Inteligencia</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sincronización ACPIA activa</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
           <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-bold transition-all">
              <ShieldCheck size={14} className="text-rc-teal" />
              AUDITORÍAS
           </button>
           <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-bold transition-all">
              <Users size={14} />
              AGENTES
           </button>
           <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-bold transition-all">
              <Archive size={14} />
              PROYECTOS
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glow-card p-8 group hover:border-rc-teal/30 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <stat.icon size={18} className={`${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-bold text-white">{stat.value}</h2>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 mb-1">
                <ArrowUpRight size={12} />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Main Filters */}
      <div className="premium-card p-8 space-y-8">
        <div className="flex items-center gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rc-teal transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID, Agente o Proyecto..." 
              className="w-full h-14 pl-12 pr-4 glass-input text-sm font-medium"
            />
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveSubTab('inbox')}
              className={`px-6 py-2.5 rounded-lg text-[11px] font-bold transition-all ${activeSubTab === 'inbox' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              INBOX
            </button>
            <button 
              onClick={() => setActiveSubTab('history')}
              className={`px-6 py-2.5 rounded-lg text-[11px] font-bold transition-all ${activeSubTab === 'history' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              HISTORIAL
            </button>
          </div>
          <div className="flex gap-2">
             <button className="w-12 h-12 premium-card flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <LayoutGrid size={18} />
             </button>
             <button className="w-12 h-12 premium-card flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <List size={18} />
             </button>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">MES OPERATIVO</label>
            <div className="h-12 glass-input px-4 flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-slate-400">---------- de ----</span>
              <Calendar size={14} className="text-slate-500 group-hover:text-rc-teal" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">ESTADO TRANSACCIÓN</label>
            <div className="h-12 glass-input px-4 flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-white font-medium uppercase">Todos los estados</span>
              <ChevronDown size={14} className="text-slate-500 group-hover:text-rc-teal" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">RANGO DE FECHAS (AUDITORÍA)</label>
            <div className="h-12 glass-input px-4 flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-slate-400">dd/mm/aaaa</span>
              <Calendar size={14} className="text-slate-500 group-hover:text-rc-teal" />
            </div>
          </div>
          <div className="space-y-2 pt-6">
            <div className="h-12 glass-input px-4 flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-slate-400">dd/mm/aaaa</span>
              <Calendar size={14} className="text-slate-500 group-hover:text-rc-teal" />
            </div>
          </div>
        </div>

        {/* Taxonomy */}
        <div className="space-y-4 pt-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Taxonomía de Inteligencia</h3>
          <div className="flex flex-wrap gap-2">
            {taxonomy.map((item, i) => (
              <div key={i} className="status-chip group cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-white/10">
                <div className={`status-dot ${item.color}`} />
                <span className="text-[9px] font-bold uppercase">{item.label}</span>
              </div>
            ))}
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700/50 text-[10px] font-bold text-slate-400 hover:text-white transition-all ml-auto">
               <Filter size={12} />
               FILTRAR HALLAZGOS CRÍTICOS
            </button>
          </div>
        </div>
      </div>

      {/* Content Area (Empty State) */}
      <div className="premium-card min-h-[400px] flex flex-col items-center justify-center text-center p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-600 mb-6"
        >
          <Archive size={40} />
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">No hay auditorías registradas</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Intenta ajustar los filtros de búsqueda o el período temporal para visualizar resultados.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

