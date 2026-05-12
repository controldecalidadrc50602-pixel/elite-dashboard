import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, Zap, Search,
  Database, ArrowUpRight, Star,
  LayoutGrid, List, Calendar,
  ChevronDown, Filter, Archive,
  Activity, Users, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TabType } from '../types/navigation';

interface DashboardProps {
  activeTab: TabType;
  title: string;
}

// Sparkline SVG inline — sin dependencias externas
const Sparkline: React.FC<{ color: string }> = ({ color }) => (
  <svg width="72" height="28" viewBox="0 0 72 28" fill="none">
    <defs>
      <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 22 L12 16 L24 19 L36 8 L48 12 L60 4 L72 1"
      stroke={color} strokeWidth="1.5" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M0 22 L12 16 L24 19 L36 8 L48 12 L60 4 L72 1 L72 28 L0 28Z"
      fill={`url(#g${color.replace('#','')})`}
    />
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ title }) => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'history'>('inbox');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stats = useMemo(() => [
    { label: 'TOTAL TRANSACCIONES', value: '12',  change: '+12%', Icon: Zap,        color: '#3BC7AA' },
    { label: 'SCORE CALIDAD',       value: '0%',  change: '+2.4%', Icon: TrendingUp, color: '#60A5FA' },
    { label: 'CSAT INDEX',          value: '0.0', change: '+0.5',  Icon: Star,       color: '#FBBF24' },
  ], []);

  const taxonomy = useMemo(() => [
    { label: 'NECESITA COACHING',     dot: '#F97316' },
    { label: 'ALERTA CRÍTICA',        dot: '#EF4444' },
    { label: 'MANEJO CLIENTE',        dot: '#3B82F6' },
    { label: 'NO RELEVANTE',          dot: '#94A3B8' },
    { label: 'OFRECIMIENTO ADICIONAL',dot: '#38BDF8' },
    { label: 'NO USO EMOJIS',         dot: '#10B981' },
    { label: 'APOYO VISUAL',          dot: '#FACC15' },
    { label: 'RIESGO CHURN',          dot: '#F43F5E' },
    { label: 'UPSELL/VENTA',          dot: '#A855F7' },
    { label: 'WOW MOMENT',            dot: '#FB923C' },
    { label: 'ERROR TÉCNICO',         dot: '#CA8A04' },
    { label: 'ESCALAMIENTO',          dot: '#2563EB' },
    { label: 'MEJORA PROCESO',        dot: '#6366F1' },
    { label: 'SOLICITUD EMPLEO',      dot: '#7C3AED' },
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      {/* ── HEADER ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
            <Database size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-white leading-none tracking-tight">{title}</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3BC7AA] animate-pulse inline-block" />
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Sincronización ACPIA activa
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-1 gap-1 bg-white/[0.04] rounded-2xl border border-white/[0.06]">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-[11px] font-bold tracking-wide">
            <ShieldCheck size={13} className="text-[#3BC7AA]" /> AUDITORÍAS
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-white text-[11px] font-bold tracking-wide transition-colors">
            <Users size={13} /> AGENTES
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-white text-[11px] font-bold tracking-wide transition-colors">
            <Archive size={13} /> PROYECTOS
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, change, Icon, color }, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D1321] px-7 py-6 flex items-center justify-between group hover:border-white/10 transition-all duration-200 cursor-pointer"
          >
            {/* shimmer top line */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${color}55, transparent)` }}
            />

            {/* Left: metric */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-bold text-white leading-none">{value}</span>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-400">
                  <ArrowUpRight size={11} /> {change}
                </span>
              </div>
            </div>

            {/* Right: icon + sparkline */}
            <div className="flex flex-col items-end gap-2">
              <Icon
                size={16}
                style={{ color }}
                className="opacity-40 group-hover:opacity-100 transition-opacity"
              />
              <Sparkline color={color} />
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTER PANEL ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0D1321] p-6 flex flex-col gap-5">

        {/* Row 1: search + tabs + view toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por ID, Agente o Proyecto..."
              className="w-full h-11 pl-10 pr-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#3BC7AA]/40 transition-colors"
            />
          </div>

          <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-xl p-0.5 shrink-0">
            {(['inbox','history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-5 py-2 rounded-[10px] text-[11px] font-bold tracking-wide transition-all ${
                  activeSubTab === tab ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {tab === 'inbox' ? 'INBOX' : 'HISTORIAL'}
              </button>
            ))}
          </div>

          <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-xl p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-all ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-all ${
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Row 2: date / status filters */}
        <div className="grid grid-cols-4 gap-3">
          {/* Mes operativo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MES OPERATIVO</label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-[#3BC7AA]/30 transition-colors">
              <span className="text-[11px] text-slate-600">---------- de ----</span>
              <Calendar size={13} className="text-slate-600" />
            </div>
          </div>

          {/* Estado transacción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ESTADO TRANSACCIÓN</label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-[#3BC7AA]/30 transition-colors">
              <span className="text-[11px] font-semibold text-white uppercase">TODOS LOS ESTADOS</span>
              <ChevronDown size={13} className="text-slate-600" />
            </div>
          </div>

          {/* Rango desde */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RANGO DE FECHAS (AUDITORÍA)</label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-[#3BC7AA]/30 transition-colors">
              <span className="text-[11px] text-slate-600">dd/mm/aaaa</span>
              <Calendar size={13} className="text-slate-600" />
            </div>
          </div>

          {/* Rango hasta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest invisible">—</label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-[#3BC7AA]/30 transition-colors">
              <span className="text-[11px] text-slate-600">dd/mm/aaaa</span>
              <Calendar size={13} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Row 3: taxonomy chips */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TAXONOMÍA DE INTELIGENCIA</p>
          <div className="flex flex-wrap items-center gap-2">
            {taxonomy.map((item, i) => (
              <button
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition-all"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.dot }}
                />
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  {item.label}
                </span>
              </button>
            ))}
            <button className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all text-[9px] font-bold uppercase tracking-wide shrink-0">
              <Filter size={11} /> FILTRAR HALLAZGOS CRÍTICOS
            </button>
          </div>
        </div>
      </div>

      {/* ── EMPTY STATE ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0D1321] min-h-[280px] flex flex-col items-center justify-center gap-4 p-12">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
          <Archive size={24} className="text-slate-600" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-white mb-1">No hay auditorías registradas</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Intenta ajustar los filtros de búsqueda o el período temporal para visualizar resultados.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
