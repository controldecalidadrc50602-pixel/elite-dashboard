import React, { useState } from 'react';
import { RefreshCw, FileText, CheckCircle2, AlertTriangle, AlertCircle, Info, Calendar, Briefcase, Globe } from 'lucide-react';
import { KpiCard } from '../components/UI/KpiCard';
import { FilterSelect } from '../components/UI/FilterSelect';
import { Tabs } from '../components/UI/Tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data from the user's App Script image
const mockChartData = [
  { name: 'Enero', score: 92 },
  { name: 'Febrero', score: 86 },
  { name: 'Marzo', score: 91 },
  { name: 'Abril', score: 85 },
  { name: 'Mayo', score: 88 },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [ciclo, setCiclo] = useState('Todos');
  const [portafolio, setPortafolio] = useState('Todas (Global)');
  const [canal, setCanal] = useState('Todos');

  const filterOptions = [{ value: 'Todos', label: 'Todos' }];
  const portafolioOptions = [{ value: 'Todas (Global)', label: 'Todas (Global)' }];

  const tabs = [
    { id: 'insights', label: 'Insights & KPIs' },
    { id: 'tendencia', label: 'Tendencia Temporal' },
    { id: 'distribucion', label: 'Distribución de Calidad' },
    { id: 'adn', label: 'ADN Tecnológico (Data)' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Status Operativo Elite</h1>
          <p className="text-sm text-slate-500 mt-1">Monitoreo Histórico y Capacidad de Servicios en Tiempo Real</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 shadow-sm">
            <RefreshCw size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 shadow-sm text-sm font-medium">
            <RefreshCw size={16} /> Sincronizar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 shadow-sm text-sm font-medium">
            <FileText size={16} /> Reporte PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-6 mb-6">
        <div className="w-64">
          <FilterSelect label="Ciclo Temporal" icon={Calendar} options={filterOptions} value={ciclo} onChange={setCiclo} />
        </div>
        <div className="w-64">
          <FilterSelect label="Portafolio" icon={Briefcase} options={portafolioOptions} value={portafolio} onChange={setPortafolio} />
        </div>
        <div className="w-64">
          <FilterSelect label="Canal Origen" icon={Globe} options={filterOptions} value={canal} onChange={setCanal} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard 
              title="Health Score (Óptimo)" 
              value="89,06%" 
              icon={CheckCircle2} 
              iconBgClass="bg-emerald-100" 
              iconColorClass="text-emerald-600"
              valueColorClass="text-emerald-500"
              prediction={<span className="text-amber-500 font-medium">Predicción (Mes Sig.): 88.4% ↓</span>}
            />
            <KpiCard 
              title="Área de Mejora (Aceptable)" 
              value="9,26%" 
              subtitle="Total: 299 Interacciones"
              icon={AlertTriangle} 
              iconBgClass="bg-amber-100" 
              iconColorClass="text-amber-600"
              valueColorClass="text-amber-500"
            />
            <KpiCard 
              title="Riesgo Operativo (Deficiente)" 
              value="1,36%" 
              subtitle="Total: 44 Interacciones"
              icon={AlertCircle} 
              iconBgClass="bg-rose-100" 
              iconColorClass="text-rose-600"
              valueColorClass="text-rose-500"
            />
            <KpiCard 
              title="Volumen Auditado" 
              value="3.228" 
              subtitle="Interacciones totales procesadas"
              icon={Info} 
              iconBgClass="bg-blue-100" 
              iconColorClass="text-blue-600"
            />
          </div>

          {/* Insights Alert */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <AlertCircle size={18} />
                <h3>Insights Operativos (Reglas Duras)</h3>
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20">
                Generar Análisis IA
              </button>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-600 flex gap-3 shadow-sm">
              <div className="text-amber-500"><Zap size={18} /></div>
              <p>VISIÓN GLOBAL ACTIVA: Ecosistema bajo parámetros normales. Aplique filtros granulares (Mes/Proyecto) para aislar riesgos operativos o activar el motor predictivo.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tendencia' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-slate-800">Tendencia Temporal</h3>
              <p className="text-xs text-slate-500 mt-1">La línea indica el porcentaje de calidad (Óptimo). Las barras de fondo representan el volumen total de interacciones.</p>
            </div>
            <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full hover:bg-slate-200 transition-colors">
              Historial de Calidad
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Distribution Placeholder */}
      {activeTab === 'distribucion' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400">
          Gráfico de barras horizontales (En desarrollo)
        </div>
      )}
    </div>
  );
};

export default Dashboard;
