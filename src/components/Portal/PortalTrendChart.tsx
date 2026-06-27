import React, { useMemo, useState, useEffect, useRef } from 'react';
import { AreaChart, Area } from 'recharts';

interface Props {
  quarterlyAssessment: any | null;
  brandColor?: string;
}

const PortalTrendChart: React.FC<Props> = ({ quarterlyAssessment, brandColor = '#ffffff' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 200 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Fallback inicial
    setSize({ 
      width: containerRef.current.offsetWidth, 
      height: containerRef.current.offsetHeight || 200 
    });

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height > 0 ? entry.contentRect.height : 200
          });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Procesamos los datos para Recharts
  const data = useMemo(() => {
    if (!quarterlyAssessment) return [];
    
    // Convertimos el objeto en un array de valores (Data Art)
    const values = Object.entries(quarterlyAssessment)
      .map(([key, value]) => ({
        name: key,
        value: typeof value === 'number' ? value : 0,
      }))
      .filter(item => item.value > 0);
    
    // Si hay muy pocos datos, inventamos una pequeña rampa inicial para el efecto estético
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

  return (
    <div ref={containerRef} className="w-full h-full min-h-[150px] relative overflow-hidden group rounded-3xl">
      {/* Glow effects detrás del chart */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl transition-opacity duration-1000 group-hover:opacity-30"
        style={{ background: brandColor }}
      />
      
      {size.width > 0 && (
        <AreaChart width={size.width} height={size.height} data={data}>
          <defs>
            <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
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
            fill="url(#colorBrand)"
            animationEasing="ease-in-out"
            isAnimationActive={false} // Deshabilitado temporalmente para estabilidad
            dot={false}
            activeDot={{ r: 6, fill: brandColor, stroke: '#000', strokeWidth: 2 }}
          />
        </AreaChart>
      )}
    </div>
  );
};

export default PortalTrendChart;
