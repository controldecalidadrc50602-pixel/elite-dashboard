import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { AreaChart, Area } from 'recharts';

interface Props {
  quarterlyAssessment: any | null;
  brandColor?: string;
}

const PortalTrendChart: React.FC<Props> = ({ quarterlyAssessment, brandColor = '#ffffff' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [chartWidth, setChartWidth] = useState(300);

  // Fase 1: Esperamos a que el componente esté montado en el DOM
  useEffect(() => {
    // Delay para asegurar que Framer Motion terminó la animación de entrada
    const timer = setTimeout(() => {
      setMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fase 2: Solo medimos cuando ya está montado
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        if (w > 0) setChartWidth(w);
      }
    };

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  // Procesamos los datos para Recharts
  const data = useMemo(() => {
    if (!quarterlyAssessment) return [];
    
    const values = Object.entries(quarterlyAssessment)
      .map(([key, value]) => ({
        name: key,
        value: typeof value === 'number' ? value : 0,
      }))
      .filter(item => item.value > 0);
    
    if (values.length < 3) {
       const baseVal = values.length > 0 ? values[0].value : 80;
       return [
         { name: 'Start', value: baseVal * 0.8 },
         { name: 'Mid', value: baseVal * 0.9 },
         ...values
       ];
    }
    return values;
  }, [quarterlyAssessment]);

  // Usamos un gradientId único por instancia para evitar colisiones de SVG
  const gradientId = useRef(`brandGrad-${Math.random().toString(36).slice(2, 9)}`);

  return (
    <div 
      ref={containerRef} 
      className="w-full relative overflow-hidden group rounded-3xl"
      style={{ height: '200px' }}
    >
      {/* Glow sutil */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl transition-opacity duration-1000 group-hover:opacity-30"
        style={{ background: brandColor }}
      />
      
      {mounted && chartWidth > 0 && data.length > 0 && (
        <AreaChart width={chartWidth} height={200} data={data}>
          <defs>
            <linearGradient id={gradientId.current} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={brandColor} stopOpacity={0.6} />
              <stop offset="100%" stopColor={brandColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          
          <Area
            type="monotone"
            dataKey="value"
            stroke={brandColor}
            strokeWidth={4}
            fillOpacity={1}
            fill={`url(#${gradientId.current})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      )}
    </div>
  );
};

export default PortalTrendChart;
