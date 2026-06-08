import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/project';
import { Shield, Zap, TrendingUp, Clock, Activity, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { qualityDataService, QualityRecord } from '../../services/qualityDataService';

interface Props {
  project: Project;
  onEdit: () => void;
}

export const EliteClientCard: React.FC<Props> = ({ project, onEdit }) => {
  const [qualityData, setQualityData] = useState<QualityRecord[]>([]);

  useEffect(() => {
    const loadQuality = async () => {
      const allData = await qualityDataService.fetchQualityData();
      // Búsqueda insensible a mayúsculas
      const clientKey = Object.keys(allData).find(k => k.toLowerCase() === project.client.toLowerCase());
      if (clientKey) {
        setQualityData(allData[clientKey]);
      } else {
        setQualityData([]);
      }
    };
    loadQuality();
  }, [project.client]);

  // Transformar datos de App Script agrupando chats y llamadas por mes
  const evolutionData = useMemo(() => {
    if (qualityData.length > 0) {
      const groupedByMonth = qualityData.reduce((acc, curr) => {
        if (!acc[curr.mes]) {
          acc[curr.mes] = { optimo: 0, total: 0 };
        }
        // Asegurarse de convertir a números en caso de que vengan como strings
        acc[curr.mes].optimo += Number(curr.optimo) || 0;
        acc[curr.mes].total += Number(curr.total) || 0;
        return acc;
      }, {} as Record<string, { optimo: number, total: number }>);

      const monthsOrder = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      return Object.entries(groupedByMonth)
        .sort(([mesA], [mesB]) => monthsOrder.indexOf(mesA) - monthsOrder.indexOf(mesB))
        .map(([mes, stats]) => {
          const score = stats.total > 0 ? Math.round((stats.optimo / stats.total) * 100) : 0;
          return {
            name: mes.substring(0, 3), // Ene, Feb, Mar...
            score: score
          };
        });
    }

    // Fallback a historial existente o dummy data si no hay API
    return project.history?.length ? project.history.map(h => ({
      name: `${h.month}/${h.year}`,
      score: Math.round((Object.values(h.assessment).filter(v => typeof v === 'number') as number[]).reduce((a, b) => a + b, 0) / 10)
    })) : [
      { name: 'Ene', score: 65 },
      { name: 'Feb', score: 70 },
      { name: 'Mar', score: 85 },
      { name: 'Abr', score: 78 },
      { name: 'May', score: 92 },
    ];
  }, [qualityData, project.history]);

  // Calculate current score based on API or Fallback
  const currentScore = useMemo(() => {
    if (evolutionData.length > 0 && qualityData.length > 0) {
      return evolutionData[evolutionData.length - 1].score;
    }
    return project.quarterlyAssessment 
      ? Math.round((Object.values(project.quarterlyAssessment).filter(v => typeof v === 'number') as number[]).reduce((a, b) => a + b, 0) / 50 * 100)
      : 0;
  }, [evolutionData, qualityData.length, project.quarterlyAssessment]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Header & Identity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[var(--card-bg)] rounded-[32px] flex items-center justify-center p-3 border border-[var(--glass-border)] shadow-xl">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt={project.client} className="w-full h-full object-contain" />
            ) : (
              <span className="text-3xl font-black text-rc-teal uppercase">{project.client.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-4xl font-light text-[var(--text-primary)] tracking-tighter uppercase">
              {project.client}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  project.healthFlag === 'Verde' ? 'bg-emerald-500' : 
                  project.healthFlag === 'Amarilla' ? 'bg-amber-500' : 'bg-rose-500'
                } shadow-[0_0_10px_currentColor]`} />
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em]">
                  {project.healthFlag === 'Verde' ? 'ÓPTIMO' : 
                   project.healthFlag === 'Amarilla' ? 'ATENCIÓN' : 'CRÍTICO'}
                </span>
              </div>
              <div className="h-4 w-px bg-[var(--glass-border)]" />
              <div className="flex items-center gap-1.5 text-slate-500">
                <Shield size={12} />
                <span className="text-[10px] uppercase tracking-[0.2em]">{project.accountManager || 'Sin Auditor'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onEdit}
            className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rc-teal hover:text-black transition-all shadow-lg active:scale-95"
          >
            Ajustar Expediente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Actividad y Servicios (1/3) */}
        <div className="space-y-6">
           {/* Resumen Completo de Ecosistema */}
           <div className="card p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                 <Zap size={16} className="text-rc-teal" />
                 <h3 className="text-[11px] font-medium text-[var(--text-primary)] uppercase tracking-widest">Ecosistema Activo</h3>
              </div>
              
              {/* Servicios Contratados */}
              {project.services && project.services.length > 0 && (
                 <div className="space-y-2">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Portafolio de Servicios</span>
                   {project.services.map(service => (
                      <div key={service.id} className="p-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl flex items-center justify-between">
                         <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{service.name}</span>
                         <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest bg-[var(--bg-primary)] px-2 py-1 rounded">
                            {service.type || 'Servicio'}
                         </span>
                      </div>
                   ))}
                 </div>
              )}

              {/* Pulso Operativo */}
              {project.opsPulse && (
                 <div className="space-y-2 mt-2">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Dimensión Operativa</span>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl">
                         <span className="block text-[8px] text-slate-500 uppercase tracking-wider mb-1">Headcount Total</span>
                         <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase">{project.opsPulse.hcContracted} Asignados</span>
                      </div>
                      <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl">
                         <span className="block text-[8px] text-slate-500 uppercase tracking-wider mb-1">Operación</span>
                         <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase">{project.opsPulse.operationType}</span>
                      </div>
                   </div>
                 </div>
              )}

              {/* ADN Técnico */}
              {project.techDNA && (
                 <div className="space-y-2 mt-2">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Infraestructura Base</span>
                   <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--glass-border)] px-3 py-1.5 rounded-lg uppercase tracking-wider">
                        {project.techDNA.operationMode}
                      </span>
                      <span className="text-[9px] font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--glass-border)] px-3 py-1.5 rounded-lg uppercase tracking-wider">
                        Redundancia: {project.techDNA.redundancy ? 'Activa' : 'N/A'}
                      </span>
                      <span className="text-[9px] font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--glass-border)] px-3 py-1.5 rounded-lg uppercase tracking-wider">
                        {project.techDNA.country}
                      </span>
                   </div>
                 </div>
              )}

              {(!project.services?.length && !project.opsPulse && !project.techDNA) && (
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center py-4">Sin datos de ecosistema</p>
              )}
           </div>

           {/* Activity Log (Timeline) */}
           <div className="card p-6 flex flex-col h-[400px]">
              <div className="flex items-center gap-3 mb-6">
                 <Clock size={16} className="text-rc-teal" />
                 <h3 className="text-[11px] font-medium text-[var(--text-primary)] uppercase tracking-widest">Registro de Actividad</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--glass-border)] before:to-transparent">
                 
                 {project.activityLogs?.map((log) => (
                    <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       {/* Icon */}
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border border-rc-teal bg-[var(--bg-primary)] text-rc-teal shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          {log.type === 'Comment' ? <MessageSquare size={10} /> : <Activity size={10} />}
                       </div>
                       {/* Content */}
                       <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] shadow">
                          <div className="flex items-center justify-between mb-1">
                             <span className="font-bold text-[var(--text-primary)] text-[10px] uppercase tracking-wider">{log.user}</span>
                             <span className="text-[8px] text-slate-500 font-medium">{log.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 leading-relaxed">{log.details}</p>
                       </div>
                    </div>
                 )) || (
                    <div className="relative flex items-center justify-center h-full">
                       <span className="text-[10px] text-slate-500 uppercase tracking-widest">Aún no hay actividad registrada</span>
                    </div>
                 )}
                 
              </div>
           </div>
        </div>

        {/* Columna Derecha: Evolución y Evaluación (2/3) */}
        <div className="lg:col-span-2 space-y-6">
           {/* Health Score actual y gráfico */}
           <div className="card p-8 flex flex-col gap-8 h-full">
              <div className="flex items-start justify-between">
                 <div>
                    <h3 className="text-2xl font-light text-[var(--text-primary)] uppercase tracking-tighter">Evolución Estratégica</h3>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-2">Monitoreo de Calidad Mensual</p>
                 </div>
                 <div className="px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl flex flex-col items-end">
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.3em]">Health Score</span>
                    <span className="text-3xl font-light text-[var(--text-primary)] mt-1">{currentScore}%</span>
                 </div>
              </div>

              {/* Chart */}
              <div className="w-full flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--text-muted)" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="var(--text-muted)" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3bbca9" 
                      strokeWidth={3}
                      dot={{ fill: '#3bbca9', strokeWidth: 2, r: 4, stroke: 'var(--bg-primary)' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[var(--glass-border)]">
                 <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-slate-500" />
                    <span className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.2em]">Crecimiento Proyectado: +12%</span>
                 </div>
                 <button className="text-[10px] font-bold text-rc-teal uppercase tracking-[0.2em] hover:text-[var(--text-primary)] transition-colors">
                    Ver Historial Completo
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
