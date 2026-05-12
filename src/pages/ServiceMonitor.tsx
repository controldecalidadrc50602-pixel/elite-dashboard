import React from 'react';
import { initialProjects } from '../lib/mockData';
import { Layers, Activity, CheckCircle, Clock, XCircle, Beaker, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceMonitor: React.FC = () => {
  // Extract all services from all projects
  const allServices = initialProjects.flatMap(p => 
    p.services.map(s => ({ ...s, clientName: p.client }))
  );

  const stats = [
    { label: 'Total Servicios', value: allServices.length, icon: Layers, color: 'text-rc-teal' },
    { label: 'Activos', value: initialProjects.filter(p => p.adminStatus === 'Activo').length, icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'En Prueba', value: initialProjects.filter(p => p.adminStatus === 'Prueba').length, icon: Beaker, color: 'text-amber-400' },
    { label: 'En Proceso', value: initialProjects.filter(p => p.adminStatus === 'En Proceso').length, icon: Clock, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-10 bg-[var(--bg-main)]">
      <header>
        <h1 className="text-4xl font-semibold text-white tracking-tight uppercase mb-2">Monitor de Servicios</h1>
        <p className="label-executive">Estado Técnico de Implementaciones Rc506</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="p-8 glass-card flex items-center justify-between group hover:border-rc-teal/30 transition-all shadow-2xl"
          >
            <div>
              <p className="label-executive mb-2 group-hover:text-rc-teal transition-colors">{stat.label}</p>
              <h3 className="text-4xl font-medium text-white">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-ultra-thin)] ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Services Table */}
      <div className="glass-card !p-0 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-[var(--border-ultra-thin)] bg-[var(--bg-input)]/30 flex items-center justify-between">
           <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Inventario de Soluciones</h3>
           <div className="px-4 py-2 bg-[var(--bg-input)] rounded-lg border border-[var(--border-ultra-thin)] text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">
              Live Sync Active
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
             <thead>
              <tr className="border-b border-[var(--border-ultra-thin)]">
                <th className="px-10 py-6 label-executive">Cliente</th>
                <th className="px-10 py-6 label-executive">Servicio</th>
                <th className="px-10 py-6 label-executive">Tipo</th>
                <th className="px-10 py-6 label-executive">Configuración</th>
                <th className="px-10 py-6 label-executive">Estado</th>
                <th className="px-10 py-6 label-executive text-right">Próximo Hito</th>
              </tr>
            </thead>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {initialProjects.map((p) => (
                p.services.map((s, sIdx) => (
                  <tr key={`${p.id}-${s.id}`} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-10 py-6">
                      <span 
                        onClick={() => {
                          const project = initialProjects.find(ip => ip.client === p.client);
                          if (project) {
                             // Aquí se dispararía el evento para abrir el modal
                             // Por ahora aseguramos la visual de interactividad
                             console.log('Opening project:', project.client);
                          }
                        }}
                        className="text-[13px] font-semibold text-white uppercase tracking-tight hover:text-rc-teal transition-colors cursor-pointer border-b border-transparent hover:border-rc-teal"
                      >
                        {p.client}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">{s.name}</span>
                        <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest mt-1">{s.description.substring(0, 40)}...</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-lg text-[9px] font-black text-rc-teal uppercase tracking-widest">
                        {s.type}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        {s.type === 'Botmaker' && <span>{s.botmakerType}</span>}
                        {(s.type === 'Yeastar' || s.type === 'IPBX') && <span>{s.extensionCount} Exts.</span>}
                        {s.type === 'Servicios Web' && <span>{s.webServiceType}</span>}
                        {s.type === 'Capacitaciones' && <span>{s.trainingType}</span>}
                        {s.type === 'Other' && <span className="opacity-30">N/A</span>}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="inline-flex flex-col items-end">
                        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${
                          sIdx % 3 === 0 
                            ? 'bg-[#a855f7]/10 border-[#a855f7]/30 text-[#d8b4fe]' 
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}>
                          <Calendar size={12} className={sIdx % 3 === 0 ? 'text-[#a855f7]' : ''} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {sIdx % 3 === 0 ? 'Renovación: 25 May' : 'Sin pendientes'}
                          </span>
                        </div>
                        {sIdx % 3 === 0 && (
                          <span className="text-[8px] font-black text-[#a855f7] uppercase tracking-widest mt-2 animate-pulse">
                            ¡Acción Requerida!
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceMonitor;
