import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, Zap, Search,
  Database, ArrowUpRight, Star,
  LayoutGrid, LayoutList, Calendar,
  ChevronDown, Filter, Archive, Activity, Users,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TabType } from '../types/navigation';

interface DashboardProps {
  activeTab: TabType;
  title: string;
}

// Mini sparkline SVG puro — sin dependencia de recharts para evitar problemas de render
const Sparkline: React.FC<{ color: string }> = ({ color }) => (
  <svg width="80" height="32" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 24 L13 18 L26 22 L40 10 L53 14 L66 6 L80 2"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0 24 L13 18 L26 22 L40 10 L53 14 L66 6 L80 2 L80 32 L0 32Z"
      fill={`url(#sg-${color.replace('#', '')})`}
    />
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ activeTab, title }) => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'history'>('inbox');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stats = useMemo(() => [
    {
      label: 'TOTAL TRANSACCIONES',
      value: '12',
      change: '+12%',
      icon: Zap,
      color: '#3BC7AA',
      textColor: 'text-[#3BC7AA]',
    },
    {
      label: 'SCORE CALIDAD',
      value: '0%',
      change: '+2.4%',
      icon: TrendingUp,
      color: '#60A5FA',
      textColor: 'text-blue-400',
    },
    {
      label: 'CSAT INDEX',
      value: '0.0',
      change: '+0.5',
      icon: Star,
      color: '#FBBF24',
      textColor: 'text-amber-400',
    },
  ], []);

  const taxonomy = useMemo(() => [
    { label: 'NECESITA COACHING',    dot: 'bg-orange-500' },
    { label: 'ALERTA CRÍTICA',       dot: 'bg-red-500' },
    { label: 'MANEJO CLIENTE',       dot: 'bg-blue-500' },
    { label: 'NO RELEVANTE',         dot: 'bg-slate-400' },
    { label: 'OFRECIMIENTO ADICIONAL', dot: 'bg-sky-400' },
    { label: 'NO USO EMOJIS',        dot: 'bg-emerald-500' },
    { label: 'APOYO VISUAL',         dot: 'bg-yellow-400' },
    { label: 'RIESGO CHURN',         dot: 'bg-rose-500' },
    { label: 'UPSELL/VENTA',         dot: 'bg-purple-500' },
    { label: 'WOW MOMENT',           dot: 'bg-orange-400' },
    { label: 'ERROR TÉCNICO',        dot: 'bg-yellow-600' },
    { label: 'ESCALAMIENTO',         dot: 'bg-blue-600' },
    { label: 'MEJORA PROCESO',       dot: 'bg-indigo-500' },
    { label: 'SOLICITUD EMPLEO',     dot: 'bg-violet-500' },
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Left: title */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Database size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white leading-none">{title}</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3BC7AA] animate-pulse" />
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Sincronización ACPIA activa
              </span>
            </div>
          </div>
        </div>

        {/* Right: pills nav */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-2xl p-1">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-[11px] font-bold tracking-wide">
            <ShieldCheck size={13} className="text-[#3BC7AA]" />
            AUDITORÍAS
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-white text-[11px] font-bold tracking-wide transition-colors">
            <Users size={13} />
            AGENTES
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-white text-[11px] font-bold tracking-wide transition-colors">
            <Archive size={13} />
            PROYECTOS
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D1321] p-6 flex items-center justify-between group hover:border-white/10 transition-colors cursor-pointer"
            >
              {/* left */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-400">
                    <ArrowUpRight size={11} />
                    {stat.change}
                  </span>
                </div>
              </div>
              {/* right: sparkline + icon */}
              <div className="flex flex-col items-end gap-2">
                <Icon size={16} className={`${stat.textColor} opacity-40 group-hover:opacity-100 transition-opacity`} />
                <Sparkline color={stat.color} />
              </div>
              {/* top gradient line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${stat.color}44, transparent)` }}
              />
            </div>
          );
        })}
      </div>

      {/* ── FILTER PANEL ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0D1321] p-6 flex flex-col gap-6">

        {/* Row 1: search + tabs + view toggle */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por ID, Agente o Proyecto..."
              className="w-full h-11 pl-10 pr-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#3BC7AA]/50 transition-colors"
            />
          </div>

          {/* Inbox / Historial tabs */}
          <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-xl p-0.5">
            <button
              onClick={() => setActiveSubTab('inbox')}
              className={`px-5 py-2 rounded-[10px] text-[11px] font-bold tracking-wide transition-all ${
                activeSubTab === 'inbox'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              INBOX
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-5 py-2 rounded-[10px] text-[11px] font-bold tracking-wide transition-all ${
                activeSubTab === 'history'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              HISTORIAL
            </button>
          </div>

          {/* View mode */}
          <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-xl p-0.5">
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
              <LayoutList size={15} />
            </button>
          </div>
        </div>

        {/* Row 2: date filters */}
        <div className="grid grid-cols-4 gap-3">
          {/* Mes operativo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              MES OPERATIVO
            </label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors">
              <span className="text-xs text-slate-600">---------- de ----</span>
              <Calendar size={13} className="text-slate-600" />
            </div>
          </div>

          {/* Estado transacción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              ESTADO TRANSACCIÓN
            </label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors">
              <span className="text-xs font-semibold text-white uppercase">TODOS LOS ESTADOS</span>
              <ChevronDown size={13} className="text-slate-600" />
            </div>
          </div>

          {/* Rango de fechas — desde */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              RANGO DE FECHAS (AUDITORÍA)
            </label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors">
              <span className="text-xs text-slate-600">dd/mm/aaaa</span>
              <Calendar size={13} className="text-slate-600" />
            </div>
          </div>

          {/* Rango de fechas — hasta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-0 pointer-events-none">
              —
            </label>
            <div className="h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors">
              <span className="text-xs text-slate-600">dd/mm/aaaa</span>
              <Calendar size={13} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Row 3: taxonomy chips */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            TAXONOMÍA DE INTELIGENCIA
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {taxonomy.map((item, i) => (
              <button
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10 transition-all"
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-300">
                  {item.label}
                </span>
              </button>
            ))}

            {/* Filter button pushed to the right */}
            <button className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all text-[9px] font-bold uppercase tracking-wide">
              <Filter size={11} />
              FILTRAR HALLAZGOS CRÍTICOS
            </button>
          </div>
        </div>
      </div>

      {/* ── EMPTY STATE ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0D1321] min-h-[300px] flex flex-col items-center justify-center gap-4 p-12">
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
