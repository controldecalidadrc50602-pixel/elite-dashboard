import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award } from 'lucide-react';
import { ClientEvaluation } from '../../../types/project';

interface Props {
  clientEvaluation?: ClientEvaluation;
  onUpdate: (updates: Partial<ClientEvaluation>) => void;
}

const EvaluationSection: React.FC<Props> = ({ clientEvaluation, onUpdate }) => {
  const items = [
    { id: 'projectLeader', label: 'Líder de Proyecto Definido', desc: 'El cliente asignó un responsable único.' },
    { id: 'timelyDocumentation', label: 'Documentación a Tiempo', desc: 'Cumplimiento en la entrega de insumos.' },
    { id: 'advisoryReceptivity', label: 'Receptivo a Asesoría', desc: 'Aceptación de sugerencias técnicas.' },
    { id: 'effectiveServiceUse', label: 'Uso Efectivo del Servicio', desc: 'Aprovechamiento de las funcionalidades.' },
    { id: 'serviceContinuity', label: 'Continuidad Operativa', desc: 'Uso constante sin interrupciones.' },
    { id: 'reportValuation', label: 'Valoración de Informes', desc: 'El cliente analiza los KPIs entregados.' },
    { id: 'paymentPunctuality', label: 'Puntualidad en Pagos', desc: 'Cumplimiento de compromisos financieros.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="section-container"
    >
      <header className="flex items-start justify-between mb-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Perfil de Compromiso</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Evaluación del Perfil de Cliente</p>
          </div>
        </div>
        <div className="max-w-[340px] p-6 bg-rc-teal/5 border border-rc-teal/10 rounded-[32px]">
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Mida el grado de madurez y compromiso del cliente para prever riesgos comerciales y optimizar la relación.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item) => {
          const isChecked = clientEvaluation?.[item.id as keyof ClientEvaluation];
          return (
            <div 
              key={item.id}
              onClick={() => onUpdate({ [item.id]: !isChecked })}
              className={`p-8 rounded-[40px] border transition-all duration-500 cursor-pointer flex items-center justify-between group shadow-lg ${
                isChecked 
                ? 'bg-rc-teal/[0.08] border-rc-teal/40' 
                : 'bg-black/20 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <span className={`text-[12px] font-black uppercase tracking-[0.15em] transition-colors ${isChecked ? 'text-rc-teal' : 'text-slate-400 group-hover:text-white'}`}>
                  {item.label}
                </span>
                <p className="text-[10px] text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
                  {item.desc}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-[20px] border-2 flex items-center justify-center transition-all duration-500 shrink-0 ${
                isChecked 
                ? 'bg-rc-teal border-rc-teal text-black shadow-[0_10px_20px_rgba(59,188,169,0.3)] rotate-[360deg]' 
                : 'border-white/10 text-transparent'
              }`}>
                <CheckCircle size={24} strokeWidth={3} />
              </div>
            </div>
          );
        })}
        
        <div className="p-10 bg-rc-teal/5 border border-rc-teal/20 rounded-[48px] flex flex-col items-center justify-center text-center space-y-4 md:col-span-2 mt-8">
           <div className="w-16 h-16 bg-rc-teal/20 rounded-full flex items-center justify-center text-rc-teal">
              <Award size={32} />
           </div>
           <div className="space-y-1">
             <p className="text-[11px] font-black text-rc-teal uppercase tracking-[0.4em]">Índice de Madurez</p>
             <p className="text-[24px] font-black text-white">{(Object.values(clientEvaluation || {}).filter(v => v === true).length / items.length * 100).toFixed(0)}%</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationSection;
