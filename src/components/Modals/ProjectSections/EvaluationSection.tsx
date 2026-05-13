import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ClientEvaluation } from '../../../types/project';

interface Props {
  clientEvaluation?: ClientEvaluation;
  onUpdate: (updates: Partial<ClientEvaluation>) => void;
}

const EvaluationSection: React.FC<Props> = ({ clientEvaluation, onUpdate }) => {
  const items = [
    { id: 'projectLeader', label: 'Líder de Proyecto Definido' },
    { id: 'timelyDocumentation', label: 'Entrega Documentación a Tiempo' },
    { id: 'advisoryReceptivity', label: 'Receptivo a Asesoría' },
    { id: 'effectiveServiceUse', label: 'Uso Efectivo del Servicio' },
    { id: 'serviceContinuity', label: 'Continuidad en el Uso' },
    { id: 'reportValuation', label: 'Valora Informes de Gestión' },
    { id: 'paymentPunctuality', label: 'Puntualidad en Pagos' }
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="section-title text-white">Evaluación del Cliente</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salud de la Relación.</p>
          </div>
        </div>
        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
          <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
            Evalúa el compromiso mutuo mediante rúbricas clave para detectar riesgos comerciales de forma temprana.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => {
              const currentVal = clientEvaluation?.[item.id as keyof ClientEvaluation];
              onUpdate({ [item.id]: !currentVal });
            }}
            className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all"
          >
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              clientEvaluation?.[item.id as keyof ClientEvaluation] 
              ? 'bg-rc-teal border-rc-teal text-black shadow-lg shadow-rc-teal/20' 
              : 'border-white/10 text-transparent'
            }`}>
              <CheckCircle size={18} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EvaluationSection;
