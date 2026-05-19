import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Users, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Archive,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { Project, Evaluation, ClientService } from '../../types/project';

interface AnalyticsPanelProps {
  projects: Project[];
  demoMode?: boolean;
}

// Helper para obtener nombres de meses
const MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ projects, demoMode }) => {
  const [activeTab, setActiveTab] = useState<'evolution' | 'services'>('evolution');
  const [evolutionType, setEvolutionType] = useState<'trend' | 'distribution'>('trend');
  const [chartMetric, setChartMetric] = useState<'quality' | 'volume' | 'clients' | 'flow'>('quality');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Determinar si hay alguna evaluación real en Firestore
  const hasRealEvaluations = useMemo(() => {
    return projects.some(p => p.evaluations && p.evaluations.length > 0);
  }, [projects]);

  const [selectedDensity, setSelectedDensity] = useState<number | null>(null);

  // Métrica 3: Estado General de Clientes (Activos, Inactivos, Bóveda, Pruebas)
  const clientStatusStats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let archived = 0;
    let trial = 0;

    projects.forEach(p => {
      if (p.adminStatus === 'Activo') active++;
      else if (p.adminStatus === 'Inactivo') inactive++;
      else if (p.adminStatus === 'Archivado') archived++;
      else if (p.adminStatus === 'Prueba' || p.adminStatus === 'En Proceso') trial++;
    });

    return { active, inactive, archived, trial };
  }, [projects]);

  // Métrica 4: Densidad de Servicios Activos por Cliente (Cross-selling)
  const densityMetrics = useMemo(() => {
    const densityMap: { [key: number]: {
      id: string;
      clientName: string;
      healthFlag: Project['healthFlag'];
      servicesList: string[];
      score: number;
    }[] } = {
      1: [],
      2: [],
      3: [],
      4: [] // 4 o más
    };

    projects.forEach(p => {
      // Excluir inactivos o archivados de la venta cruzada
      if (p.adminStatus === 'Archivado' || p.adminStatus === 'Inactivo') return;

      const servicesCount = p.services?.length || 0;
      if (servicesCount === 0) return;

      const clientInfo = {
        id: p.id,
        clientName: p.client,
        healthFlag: p.healthFlag,
        servicesList: p.services.map(s => s.type || 'Other'),
        score: p.evaluations && p.evaluations.length > 0
          ? p.evaluations[p.evaluations.length - 1].quantitative
          : p.services && p.services.length > 0
            ? Math.round((p.services.reduce((acc, s) => acc + (s.score || 0), 0) / (p.services.length * 5)) * 100)
            : 80
      };

      if (servicesCount === 1) densityMap[1].push(clientInfo);
      else if (servicesCount === 2) densityMap[2].push(clientInfo);
      else if (servicesCount === 3) densityMap[3].push(clientInfo);
      else if (servicesCount >= 4) densityMap[4].push(clientInfo);
    });

    return [
      { id: 1, label: '1 Servicio', 'Clientes': densityMap[1].length, clients: densityMap[1] },
      { id: 2, label: '2 Servicios', 'Clientes': densityMap[2].length, clients: densityMap[2] },
      { id: 3, label: '3 Servicios', 'Clientes': densityMap[3].length, clients: densityMap[3] },
      { id: 4, label: '4+ Servicios', 'Clientes': densityMap[4].length, clients: densityMap[4] }
    ];
  }, [projects]);

  // Autoseleccionar el primer rango de densidad que tenga clientes
  React.useEffect(() => {
    if (!selectedDensity) {
      const activeDensity = densityMetrics.find(d => d['Clientes'] > 0);
      if (activeDensity) {
        setSelectedDensity(activeDensity.id);
      }
    }
  }, [densityMetrics, selectedDensity]);

  const activeDensityData = useMemo(() => {
    return densityMetrics.find(d => d.id === selectedDensity) || null;
  }, [densityMetrics, selectedDensity]);

  // Recuento de Servicios para tarjetas dinámicas superiores
  const serviceStats = useMemo(() => {
    let botmaker = 0;
    let yeastar = 0;
    let ipbx = 0;
    let contactCenter = 0;

    projects.forEach(p => {
      // Solo contar proyectos activos/en prueba para los servicios contratados activos
      if (p.adminStatus === 'Archivado' || p.adminStatus === 'Inactivo') return;

      p.services?.forEach(s => {
        if (s.type === 'Botmaker') botmaker++;
        else if (s.type === 'Yeastar') yeastar++;
        else if (s.type === 'IPBX') ipbx++;
        else if (s.type === 'Contact Center') contactCenter++;
      });
    });

    return { botmaker, yeastar, ipbx, contactCenter };
  }, [projects]);

  // 1. Algoritmo de Generación y Normalización de Datos Históricos (últimos 6 meses)
  const historicalData = useMemo(() => {
    const today = new Date();
    const monthsToShow = 6;
    const periods: { month: number; year: number; label: string }[] = [];

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      periods.push({
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        label: `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`
      });
    }

    // Procesa los datos por mes
    return periods.map(period => {
      let totalQualityScore = 0;
      let countWithQuality = 0;
      let stableCount = 0;
      let riskCount = 0;
      let criticalCount = 0;
      let growthCount = 0;

      let activeClients = 0;
      let activeServices = 0;
      let altas = 0;

      projects.forEach(project => {
        // Cálculo dinámico de clientes activos y servicios operativos en este período
        if (project.startDate) {
          const parts = project.startDate.split('-');
          if (parts.length >= 2) {
            const startYear = parseInt(parts[0], 10);
            const startMonth = parseInt(parts[1], 10);

            // ¿El proyecto ya había iniciado en este mes y año?
            const hasStarted = startYear < period.year || (startYear === period.year && startMonth <= period.month);
            
            // Excluir inactivos o archivados en el estatus actual
            const isCurrentlyActive = project.adminStatus === 'Activo' || project.adminStatus === 'Prueba' || project.adminStatus === 'En Proceso';

            if (hasStarted && isCurrentlyActive) {
              activeClients++;
              activeServices += project.services?.length || 0;
            }

            // Altas: proyectos que iniciaron exactamente en este mes y año
            if (startYear === period.year && startMonth === period.month) {
              altas++;
            }
          }
        } else {
          // Fallback por si no tiene startDate
          if (project.adminStatus === 'Activo' || project.adminStatus === 'Prueba' || project.adminStatus === 'En Proceso') {
            activeClients++;
            activeServices += project.services?.length || 0;
          }
        }

        // Busca si tiene evaluación específica para este mes/año
        let evalForPeriod = project.evaluations?.find(
          ev => ev.month === period.month && ev.year === period.year
        );

        // Fallback inteligente: SOLO si demoMode está activo (es decir, NO es false)
        if (!evalForPeriod && demoMode !== false) {
          let baseScore = 85; // Verde
          let baseStatus: Evaluation['status'] = 'Stable';

          if (project.healthFlag === 'Amarilla') {
            baseScore = 73;
            baseStatus = 'At Risk';
          } else if (project.healthFlag === 'Roja') {
            baseScore = 55;
            baseStatus = 'Critical';
          } else if (project.healthFlag === 'Negra') {
            baseScore = 35;
            baseStatus = 'Critical';
          }

          // Añadir variación orgánica controlada según el mes para que la gráfica no sea plana
          const seed = (project.client.charCodeAt(0) + period.month * 7) % 10;
          const variation = (seed - 5) * 1.5; // Variación entre -7.5 y +7.5
          const finalScore = Math.max(0, Math.min(100, Math.round(baseScore + variation)));

          // Determinar estado basado en puntaje final
          let finalStatus: Evaluation['status'] = baseStatus;
          if (finalScore >= 85) finalStatus = finalScore > 92 ? 'Growth' : 'Stable';
          else if (finalScore >= 70) finalStatus = 'At Risk';
          else finalStatus = 'Critical';

          evalForPeriod = {
            month: period.month,
            year: period.year,
            quantitative: finalScore,
            status: finalStatus,
            qualitative: 'Historial sintetizado operacional'
          };
        }

        // Acumular solo si existe la evaluación para este mes (real o simulada)
        if (evalForPeriod) {
          totalQualityScore += evalForPeriod.quantitative;
          countWithQuality++;

          if (evalForPeriod.status === 'Growth') growthCount++;
          else if (evalForPeriod.status === 'Stable') stableCount++;
          else if (evalForPeriod.status === 'At Risk') riskCount++;
          else if (evalForPeriod.status === 'Critical') criticalCount++;
        }
      });

      const avgQuality = countWithQuality > 0 ? Math.round(totalQualityScore / countWithQuality) : 0;
      
      // Simular bajas controladas orgánicas basadas en un seed mensual (churn controlado)
      const churnSeed = (period.month * 3) % 7;
      const bajas = churnSeed === 2 || churnSeed === 5 ? 1 : 0;

      return {
        name: period.label,
        month: period.month,
        year: period.year,
        'Calidad Promedio': avgQuality,
        'Saludable/Óptimo': stableCount + growthCount,
        'En Atención': riskCount,
        'En Riesgo Crítico': criticalCount,
        totalClients: countWithQuality,
        'Clientes Activos': activeClients,
        'Servicios Operativos': activeServices,
        'Altas': altas,
        'Bajas': bajas
      };
    });
  }, [projects, demoMode]);

  // 2. Mapeo y análisis de Servicios Activos
  const serviceMetrics = useMemo(() => {
    const serviceMap: { 
      [key: string]: { 
        count: number; 
        extensions: number; 
        positions: number;
        avgScore: number;
        totalScore: number;
        clients: {
          id: string;
          clientName: string;
          healthFlag: Project['healthFlag'];
          score: number;
          capacityLabel: string;
          startDate: string;
        }[]
      } 
    } = {
      'Botmaker': { count: 0, extensions: 0, positions: 0, avgScore: 0, totalScore: 0, clients: [] },
      'Yeastar': { count: 0, extensions: 0, positions: 0, avgScore: 0, totalScore: 0, clients: [] },
      'IPBX': { count: 0, extensions: 0, positions: 0, avgScore: 0, totalScore: 0, clients: [] },
      'Contact Center': { count: 0, extensions: 0, positions: 0, avgScore: 0, totalScore: 0, clients: [] },
      'Servicios Web': { count: 0, extensions: 0, positions: 0, avgScore: 0, totalScore: 0, clients: [] },
      'Capacitaciones': { count: 0, extensions: 0, positions: 0, avgScore: 0, totalScore: 0, clients: [] },
      'Other': { count: 0, extensions: 0, positions: 0, avgScore: 0, totalScore: 0, clients: [] }
    };

    projects.forEach(project => {
      project.services?.forEach(service => {
        const type = service.type || 'Other';
        if (serviceMap[type]) {
          serviceMap[type].count++;
          serviceMap[type].extensions += service.extensionCount || 0;
          serviceMap[type].positions += service.positionsCount || 0;
          serviceMap[type].totalScore += service.score || 0;

          // Generar etiqueta de capacidad
          let capacity = '';
          if (service.extensionCount) capacity = `${service.extensionCount} Exts.`;
          else if (service.positionsCount) capacity = `${service.positionsCount} Pos.`;
          else if (service.botmakerType) capacity = 'IA + Agentes';
          else capacity = 'Activo';

          serviceMap[type].clients.push({
            id: project.id,
            clientName: project.client,
            healthFlag: project.healthFlag,
            score: Math.round(((service.score || 0) / 5) * 100), // Normalizar a porcentaje
            capacityLabel: capacity,
            startDate: service.startDate || project.startDate || 'N/D'
          });
        }
      });
    });

    // Calcular promedios y formatear para gráficos
    return Object.keys(serviceMap)
      .map(key => {
        const item = serviceMap[key];
        const avg = item.count > 0 ? Math.round((item.totalScore / (item.count * 5)) * 100) : 0;
        return {
          service: key,
          'Clientes Activos': item.count,
          extensions: item.extensions,
          positions: item.positions,
          'Salud Promedio': avg,
          clients: item.clients
        };
      })
      .filter(s => s['Clientes Activos'] > 0) // Solo mostrar servicios que tengan al menos 1 cliente
      .sort((a, b) => b['Clientes Activos'] - a['Clientes Activos']);
  }, [projects]);

  // Autoseleccionar el primer servicio del gráfico si no hay ninguno seleccionado
  React.useEffect(() => {
    if (serviceMetrics.length > 0 && !selectedService) {
      setSelectedService(serviceMetrics[0].service);
    }
  }, [serviceMetrics, selectedService]);

  const activeServiceData = useMemo(() => {
    return serviceMetrics.find(s => s.service === selectedService) || null;
  }, [serviceMetrics, selectedService]);

  return (
    <div className="glass-panel p-8 md:p-10 rounded-[48px] border border-white/5 bg-black/15 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
      {/* Background soft glow decorators */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rc-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Analítico */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/5 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-2 w-2 rounded-full bg-rc-teal animate-pulse" />
            <span className="text-[9px] font-semibold text-rc-teal uppercase tracking-[0.4em]">Analytics & Intelligence Hub</span>
          </div>
          <h3 className="text-3xl font-light text-white tracking-tight uppercase">Analítica Avanzada de Cartera</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mt-2">Monitoreo histórico y capacidad de servicios en tiempo real</p>
        </div>

        {/* Tabs de Selección */}
        <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5 self-start lg:self-center">
          <button
            onClick={() => setActiveTab('evolution')}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'evolution'
                ? 'bg-white/10 text-white shadow-lg border border-white/5'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp size={14} />
            Evolución Temporal
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'services'
                ? 'bg-white/10 text-white shadow-lg border border-white/5'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Zap size={14} />
            Servicios Activos
          </button>
        </div>
      </div>

      {/* Mini Tarjetas de Estado Dinámicas (Clientes o Servicios) */}
      <div className="relative z-10 mb-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'evolution' ? (
            <motion.div 
              key="client-stats"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-rc-teal/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Clientes Activos</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{clientStatusStats.active}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rc-teal/10 border border-rc-teal/20 text-rc-teal flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,188,169,0.05)] group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-amber-500/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">En Piloto / Pruebas</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{clientStatusStats.trial}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.05)] group-hover:scale-105 transition-transform">
                  <Zap size={16} />
                </div>
              </div>

              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-rose-500/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Clientes Inactivos</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{clientStatusStats.inactive}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.05)] group-hover:scale-105 transition-transform">
                  <XCircle size={16} />
                </div>
              </div>

              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-purple-500/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Clientes en Bóveda</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{clientStatusStats.archived}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.05)] group-hover:scale-105 transition-transform">
                  <Archive size={16} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="service-stats"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-rc-teal/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Botmaker Activos</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{serviceStats.botmaker}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rc-teal/10 border border-rc-teal/20 text-rc-teal flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,188,169,0.05)] group-hover:scale-105 transition-transform">
                  <Activity size={16} />
                </div>
              </div>

              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-amber-500/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Yeastar Activos</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{serviceStats.yeastar}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.05)] group-hover:scale-105 transition-transform">
                  <Zap size={16} />
                </div>
              </div>

              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-purple-500/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">IPBX Activos</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{serviceStats.ipbx}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.05)] group-hover:scale-105 transition-transform">
                  <Layers size={16} />
                </div>
              </div>

              <div className="glass-panel px-6 py-4.5 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.02] hover:border-rose-500/20 transition-all group">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Contact Centers</span>
                  <span className="text-xl font-light text-white mt-1 block leading-none">{serviceStats.contactCenter}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.05)] group-hover:scale-105 transition-transform">
                  <Users size={16} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Panel de Contenido Dinámico */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* TAB 1: EVOLUCIÓN HISTÓRICA */}
          {activeTab === 'evolution' && (
            <motion.div
              key="evolution-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Controles de tipo de gráfico */}
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-white/[0.02] p-6 rounded-3xl border border-[var(--glass-border)]">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">Visualización Operativa & Ecosistema</span>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">Alterna las curvas de calidad (SLA), volumen de cartera o altas/bajas de servicios</p>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                  {/* Selector de Perspectiva (Métrica) */}
                  <div className="flex bg-black/20 p-1.5 rounded-2xl border border-[var(--glass-border)]">
                    {[
                      { id: 'quality', label: 'Calidad (SLA)' },
                      { id: 'volume', label: 'Volumen (Ecosistema)' },
                      { id: 'clients', label: 'Clientes Activos' },
                      { id: 'flow', label: 'Flujo (Altas/Bajas)' }
                    ].map(metric => (
                      <button
                        key={metric.id}
                        onClick={() => setChartMetric(metric.id as any)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                          chartMetric === metric.id
                            ? 'bg-rc-teal text-black font-black shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {metric.label}
                      </button>
                    ))}
                  </div>

                  {/* Selector de Representación (Línea o Barras) */}
                  <div className="flex gap-2 bg-black/10 p-1.5 rounded-2xl border border-[var(--glass-border)] ml-auto xl:ml-0">
                    <button
                      onClick={() => setEvolutionType('trend')}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                        evolutionType === 'trend'
                          ? 'bg-white text-black font-bold'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Tendencia
                    </button>
                    <button
                      onClick={() => setEvolutionType('distribution')}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                        evolutionType === 'distribution'
                          ? 'bg-white text-black font-bold'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Salud
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenedor del Gráfico */}
              <div className="h-[360px] w-full bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-[32px] p-6 relative flex items-center justify-center">
                {demoMode === false && !hasRealEvaluations ? (
                  <div className="text-center max-w-lg mx-auto space-y-4 p-8">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-[0.2em]">Aislamiento de Datos Activo</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                        No hay evaluaciones de calidad mensuales registradas en Firestore
                      </p>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-[0.15em] pt-2">
                      Para poblar este gráfico con datos reales, ingresa una evaluación cualitativa/cuantitativa desde la ficha individual de tus clientes. Si deseas previsualizar los gráficos interactivos de prueba, activa el <span className="text-amber-400 font-black">Modo Demo</span> en la cabecera superior.
                    </p>
                  </div>
                ) : evolutionType === 'trend' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={historicalData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3BBCA9" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#3BBCA9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAltas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBajas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        stroke="#94A3B8" 
                        fontSize={9}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94A3B8" 
                        fontSize={9}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                        tickFormatter={(value) => chartMetric === 'quality' ? `${value}%` : value}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '24px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        }}
                        labelStyle={{ color: 'var(--text-primary)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                      />
                      
                      {chartMetric === 'quality' && (
                        <Area 
                          type="monotone" 
                          dataKey="Calidad Promedio" 
                          stroke="#3BBCA9" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorQuality)" 
                          dot={{ r: 4, stroke: '#3BBCA9', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
                          activeDot={{ r: 6, stroke: '#3BBCA9', strokeWidth: 2, fill: '#3BBCA9' }}
                        />
                      )}

                      {chartMetric === 'clients' && (
                        <Area 
                          type="monotone" 
                          name="Clientes Activos"
                          dataKey="Clientes Activos" 
                          stroke="#6366F1" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorClients)" 
                          dot={{ r: 4, stroke: '#6366F1', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
                          activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2, fill: '#6366F1' }}
                        />
                      )}

                      {chartMetric === 'volume' && (
                        <>
                          <Area 
                            type="monotone" 
                            name="Servicios Operativos"
                            dataKey="Servicios Operativos"
                            stroke="#F59E0B" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorServices)" 
                            dot={{ r: 4, stroke: '#F59E0B', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
                          />
                          <Area 
                            type="monotone" 
                            name="Clientes Activos"
                            dataKey="Clientes Activos" 
                            stroke="#6366F1" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorClients)" 
                            dot={{ r: 4, stroke: '#6366F1', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
                          />
                        </>
                      )}

                      {chartMetric === 'flow' && (
                        <>
                          <Area 
                            type="monotone" 
                            name="Nuevas Altas (+)"
                            dataKey="Altas" 
                            stroke="#10B981" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorAltas)" 
                            dot={{ r: 4, stroke: '#10B981', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
                          />
                          <Area 
                            type="monotone" 
                            name="Bajas / Churn (-)"
                            dataKey="Bajas" 
                            stroke="#F43F5E" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorBajas)" 
                            dot={{ r: 4, stroke: '#F43F5E', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
                          />
                        </>
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={historicalData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <XAxis 
                        dataKey="name" 
                        stroke="#94A3B8" 
                        fontSize={9}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94A3B8" 
                        fontSize={9}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '24px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        }}
                        labelStyle={{ color: 'var(--text-primary)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                      />

                      {chartMetric === 'quality' && (
                        <>
                          <Bar dataKey="Saludable/Óptimo" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} maxBarSize={35} />
                          <Bar dataKey="En Atención" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} maxBarSize={35} />
                          <Bar dataKey="En Riesgo Crítico" stackId="a" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={35} />
                        </>
                      )}

                      {chartMetric === 'clients' && (
                        <Bar dataKey="Clientes Activos" name="Clientes Activos" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      )}

                      {chartMetric === 'volume' && (
                        <>
                          <Bar dataKey="Clientes Activos" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={25} />
                          <Bar dataKey="Servicios Operativos" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={25} />
                        </>
                      )}

                      {chartMetric === 'flow' && (
                        <>
                          <Bar dataKey="Altas" name="Altas (+)" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={25} />
                          <Bar dataKey="Bajas" name="Bajas (-)" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={25} />
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Leyenda y Resumen Informativo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                    <ShieldCheck size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Calidad Meta</span>
                    <span className="text-xl font-light text-white mt-0.5">85% - 100%</span>
                  </div>
                </div>
                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-rc-teal/10 flex items-center justify-center text-rc-teal border border-rc-teal/20 shrink-0">
                    <Activity size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Estado de Salud</span>
                    <span className="text-xl font-light text-white mt-0.5">Sostenible</span>
                  </div>
                </div>
                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/5 shrink-0">
                    <Calendar size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Período Auditado</span>
                    <span className="text-xl font-light text-white mt-0.5">Semestre Móvil</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SERVICIOS ACTIVOS (INTERACTIVO) */}
          {activeTab === 'services' && (
            <motion.div
              key="services-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Gráfico y Selección de Servicios (Izquierda) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Servicios Contratados</span>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                    Distribución de servicios activos en la cartera. Haz clic en una barra para auditar clientes específicos.
                  </p>
                </div>

                <div className="h-[280px] bg-black/25 border border-white/5 rounded-[32px] p-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={serviceMetrics}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
                      onClick={(state) => {
                        if (state && state.activeLabel) {
                          setSelectedService(String(state.activeLabel));
                        }
                      }}
                    >
                      <XAxis 
                        type="number" 
                        stroke="#475569" 
                        fontSize={9}
                        fontWeight={500}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        dataKey="service" 
                        type="category" 
                        stroke="#94A3B8" 
                        fontSize={10}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0D1117',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '16px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}
                        formatter={(value: any) => [`${value} Clientes Activos`, 'Servicio']}
                      />
                      <Bar 
                        dataKey="Clientes Activos" 
                        fill="#3BBCA9" 
                        radius={[0, 8, 8, 0]}
                        maxBarSize={22}
                        cursor="pointer"
                      >
                        {serviceMetrics.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.service === selectedService ? '#3BBCA9' : 'rgba(59,188,169,0.15)'}
                            stroke={entry.service === selectedService ? '#3BBCA9' : 'rgba(59,188,169,0.3)'}
                            strokeWidth={1}
                            className="transition-all duration-300"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Métricas Agregadas del Servicio Seleccionado */}
                {activeServiceData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Capacidad Activa</span>
                      <span className="text-xl font-light text-rc-teal mt-1">
                        {activeServiceData.extensions > 0 && `${activeServiceData.extensions} Exts.`}
                        {activeServiceData.positions > 0 && `${activeServiceData.positions} Pos.`}
                        {activeServiceData.extensions === 0 && activeServiceData.positions === 0 && 'Activo N/A'}
                      </span>
                    </div>
                    <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest block">Calidad Operativa Promedio</span>
                      <span className="text-xl font-light text-white mt-1">{activeServiceData['Salud Promedio']}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista Detallada de Clientes (Derecha) */}
              <div className="lg:col-span-6 flex flex-col h-[400px] border border-white/5 rounded-[32px] bg-black/20 p-6 overflow-hidden">
                <div className="pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div>
                    <span className="text-[9px] font-black text-rc-teal uppercase tracking-widest block">Desglose Detallado</span>
                    <h4 className="text-sm font-semibold text-white mt-1 uppercase tracking-wider">
                      Clientes: <span className="text-rc-teal">{selectedService}</span>
                    </h4>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] text-slate-400 font-bold uppercase tracking-widest border border-white/5">
                    {activeServiceData?.clients.length || 0} Activos
                  </div>
                </div>

                {/* Lista scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 space-y-3.5 pr-1">
                  {activeServiceData && activeServiceData.clients.length > 0 ? (
                    activeServiceData.clients.map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-rc-teal/30 hover:bg-white/[0.03] transition-all"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Flag circular de salud */}
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            client.healthFlag === 'Verde' ? 'bg-emerald-500' :
                            client.healthFlag === 'Amarilla' ? 'bg-amber-500' : 'bg-rose-500'
                          } shadow-[0_0_8px_currentColor]`} />
                          
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-white group-hover:text-rc-teal transition-colors uppercase tracking-wider block truncate">
                              {client.clientName}
                            </span>
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1 block">
                              Inicio: {client.startDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                          {/* Capacidad */}
                          {client.capacityLabel && (
                            <span className="text-[9px] font-bold text-rc-teal/55 bg-rc-teal/5 border border-rc-teal/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              {client.capacityLabel}
                            </span>
                          )}
                          
                          {/* Calidad del servicio */}
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-light text-white tracking-tighter leading-none">
                              {client.score}%
                            </span>
                            <span className="text-[7px] text-slate-600 uppercase tracking-widest mt-1">Calidad</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <Layers size={32} className="text-slate-600 mb-4" />
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Selecciona un servicio para auditar</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Separador Elegante */}
              <div className="h-px w-full bg-white/5 my-10 shrink-0 lg:col-span-12" />

              {/* Bloque B: Densidad de Venta Cruzada (Servicios por Cliente) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Densidad de Venta Cruzada (Cross-selling)</span>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                    Cantidad de clientes agrupados por número de servicios contratados. Haz clic en una barra para ver la cartera correspondiente.
                  </p>
                </div>

                <div className="h-[280px] bg-black/25 border border-white/5 rounded-[32px] p-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={densityMetrics}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      onClick={(state) => {
                        if (state && state.activeLabel) {
                          // Buscar el id según la etiqueta seleccionada
                          const match = densityMetrics.find(d => d.label === state.activeLabel);
                          if (match) setSelectedDensity(match.id);
                        }
                      }}
                    >
                      <XAxis 
                        dataKey="label" 
                        stroke="#475569" 
                        fontSize={9}
                        fontWeight={500}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={9}
                        fontWeight={500}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0D1117',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '16px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}
                        formatter={(value: any) => [`${value} Clientes`, 'Venta Cruzada']}
                      />
                      <Bar 
                        dataKey="Clientes" 
                        fill="#8B5CF6" 
                        radius={[8, 8, 0, 0]}
                        maxBarSize={35}
                        cursor="pointer"
                      >
                        {densityMetrics.map((entry, index) => (
                          <Cell 
                            key={`cell-density-${index}`} 
                            fill={entry.id === selectedDensity ? '#8B5CF6' : 'rgba(139,92,246,0.15)'}
                            stroke={entry.id === selectedDensity ? '#8B5CF6' : 'rgba(139,92,246,0.3)'}
                            strokeWidth={1}
                            className="transition-all duration-300"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Lista Detallada de Clientes y sus Múltiples Servicios (Derecha) */}
              <div className="lg:col-span-6 flex flex-col h-[360px] border border-white/5 rounded-[32px] bg-black/20 p-6 overflow-hidden">
                <div className="pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div>
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Expedientes Filtrados</span>
                    <h4 className="text-sm font-semibold text-white mt-1 uppercase tracking-wider">
                      Clientes con <span className="text-purple-400">{activeDensityData?.label}</span>
                    </h4>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] text-slate-400 font-bold uppercase tracking-widest border border-white/5">
                    {activeDensityData?.clients.length || 0} Clientes
                  </div>
                </div>

                {/* Lista scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 space-y-3.5 pr-1">
                  {activeDensityData && activeDensityData.clients.length > 0 ? (
                    activeDensityData.clients.map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3 group hover:border-purple-500/30 hover:bg-white/[0.03] transition-all"
                      >
                        <div className="flex items-center justify-between min-w-0">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Flag circular de salud */}
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              client.healthFlag === 'Verde' ? 'bg-emerald-500' :
                              client.healthFlag === 'Amarilla' ? 'bg-amber-500' : 'bg-rose-500'
                            } shadow-[0_0_8px_currentColor]`} />
                            
                            <span className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors uppercase tracking-wider block truncate">
                              {client.clientName}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-light text-white tracking-tighter">
                              {client.score}%
                            </span>
                            <span className="text-[7px] text-slate-600 uppercase tracking-widest">Salud</span>
                          </div>
                        </div>

                        {/* Listado de múltiples servicios contratados */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {client.servicesList.map((service, idx) => (
                            <span 
                              key={idx}
                              className="text-[7px] font-black text-purple-300 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded uppercase tracking-wider"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <Layers size={32} className="text-slate-600 mb-4" />
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">No hay clientes en este rango</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
