import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface Props {
  quarterlyAssessment: any | null;
  brandColor?: string;
}

const PortalTrendChart: React.FC<Props> = ({ quarterlyAssessment, brandColor = '#ffffff' }) => {
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
    <div className="w-full h-full min-h-[150px] relative overflow-hidden group rounded-3xl">
      {/* Glow effects detrás del chart */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl transition-opacity duration-1000 group-hover:opacity-30"
        style={{ background: brandColor }}
      />
      
      <ResponsiveContainer width="99%" height={200}>
        <AreaChart data={data}>
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
            isAnimationActive={false} // Deshabilitado para evitar conflictos con React 19 y Framer Motion
            dot={false}
            activeDot={{ r: 6, fill: brandColor, stroke: '#000', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortalTrendChart;
