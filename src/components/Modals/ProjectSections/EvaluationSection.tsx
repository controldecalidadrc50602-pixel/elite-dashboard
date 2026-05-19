import React from 'react';
import { motion } from 'framer-motion';
import { QuarterlyAssessment } from '../../../types/project';
import HelpTooltip from '../../common/HelpTooltip';

interface Props {
  quarterlyAssessment?: QuarterlyAssessment;
  onUpdate: (updates: Partial<QuarterlyAssessment>) => void;
}

const EvaluationSection: React.FC<Props> = ({ quarterlyAssessment, onUpdate }) => {
  const pillars = [
    { 
      id: 'sla', 
      label: 'SLA', 
      description: 'Mide el cumplimiento estricto de los tiempos de respuesta y resolución pactados en los acuerdos de nivel de servicio.', 
      example: 'Puntaje 5: Cumplimiento >99% en todos los tickets. Puntaje 1: Incumplimiento sistemático de entregas y plazos.'
    },
    { 
      id: 'comunicacion', 
      label: 'Comunicación', 
      description: 'Evalúa la claridad, proactividad, oportunidad y formalidad en la canalización de interacciones diarias con el cliente.', 
      example: 'Puntaje 5: Minutas inmediatas, reportes automatizados y respuesta en <2h. Puntaje 1: Silencios prolongados o desatención.'
    },
    { 
      id: 'resolucion', 
      label: 'Resolución', 
      description: 'Grado de efectividad al solucionar incidentes y requerimientos complejos en el primer contacto o con mínima iteración.', 
      example: 'Puntaje 5: Cero incidencias reabiertas y soluciones definitivas de raíz. Puntaje 1: Parches temporales y fallas repetitivas.'
    },
    { 
      id: 'experiencia', 
      label: 'Experiencia', 
      description: 'Calidad percibida por el usuario final (CSAT/NPS) respecto a la empatía, profesionalismo y valor de la atención.', 
      example: 'Puntaje 5: CSAT de 4.9+ o NPS >80. Sentimiento del cliente altamente positivo. Puntaje 1: Quejas formales reiteradas.'
    },
    { 
      id: 'continuidad', 
      label: 'Continuidad', 
      description: 'Estabilidad operativa de sistemas, redundancia de procesos y retención de talento clave para evitar interrupciones de negocio.', 
      example: 'Puntaje 5: Plan de contingencia probado, 100% de uptime de servicios y rotación cero. Puntaje 1: Interrupciones severas.'
    },
    { 
      id: 'orden', 
      label: 'Orden', 
      description: 'Organización metodológica de la documentación, bitácoras de control, entregables firmados y repositorio compartido.', 
      example: 'Puntaje 5: Repositorio impecable, minutas al día y tareas al corriente. Puntaje 1: Pérdida de archivos o sin trazabilidad.'
    },
    { 
      id: 'conversion', 
      label: 'Conversión', 
      description: 'Capacidad de capitalizar oportunidades de mejora operativa o de valor comercial para expandir la cuenta y su eficiencia.', 
      example: 'Puntaje 5: Detección y adopción proactiva de servicios adicionales de alto impacto. Puntaje 1: Relación estática e inerte.'
    },
    { 
      id: 'adaptacion', 
      label: 'Adaptación', 
      description: 'Flexibilidad y velocidad de respuesta del equipo ante redefinición de requerimientos, crisis del cliente o nuevas normativas.', 
      example: 'Puntaje 5: Re-priorización estratégica y ejecución impecable en <24 horas. Puntaje 1: Rigidez u obstaculización al cambio.'
    },
    { 
      id: 'cultura', 
      label: 'Cultura', 
      description: 'Alineación con valores corporativos, ética intachable, trabajo en equipo y promoción activa de un ambiente colaborativo.', 
      example: 'Puntaje 5: Colaboración ejemplar, iniciativa constante y clima óptimo. Puntaje 1: Fricciones constantes o baja ética.'
    },
    { 
      id: 'valor', 
      label: 'Valor', 
      description: 'Retorno de inversión (ROI) aportado al cliente mediante consultoría estratégica de negocios, overdelivery e innovación.', 
      example: 'Puntaje 5: Generación demostrada de ahorros u optimización en comités directivos. Puntaje 1: Relación puramente transaccional.'
    }
  ] as const;

  const handleRating = (pillarId: keyof QuarterlyAssessment, value: number) => {
    onUpdate({ [pillarId]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-16 py-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.4em] group-hover:text-rc-teal transition-colors flex items-center">
                {pillar.label}
                <HelpTooltip 
                  title={pillar.label} 
                  description={pillar.description} 
                  example={pillar.example}
                  position="top"
                />
              </span>
              <p className="text-[9px] text-slate-700 font-medium uppercase tracking-widest opacity-40">Métrica Estratégica</p>
            </div>

            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRating(pillar.id, value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-500 ${
                    (quarterlyAssessment?.[pillar.id] || 0) >= value
                      ? 'bg-rc-teal border-rc-teal shadow-[0_0_15px_rgba(59,188,169,0.4)] scale-110'
                      : 'bg-transparent border-white/10 hover:border-rc-teal/30'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-12 bg-black/40 border border-white/5 rounded-[48px] text-center space-y-6">
        <h4 className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.6em]">Consolidado de Inteligencia</h4>
        <div className="flex items-center justify-center gap-10">
          <div className="text-center">
            <span className="block text-5xl font-light text-white tracking-tighter">
              {Math.round(
                Object.values(quarterlyAssessment || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / 10
              ) || 0}
            </span>
            <span className="text-[9px] font-medium text-rc-teal uppercase tracking-[0.3em] mt-2 block">Promedio General</span>
          </div>
          <div className="w-px h-16 bg-white/5" />
          <div className="text-center">
             <span className="block text-5xl font-light text-slate-600 tracking-tighter">10</span>
             <span className="text-[9px] font-medium text-slate-700 uppercase tracking-[0.3em] mt-2 block">Pilares Activos</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationSection;
