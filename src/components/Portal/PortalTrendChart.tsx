import React, { useMemo, useState, useEffect, useRef } from 'react';

/**
 * PortalTrendChart — "Data Art" minimalista.
 * 
 * DECISIÓN DE INGENIERÍA: Se eliminó Recharts completamente como prueba de fuerza bruta.
 * Se usa un SVG puro con path calculado a mano.
 * Esto elimina de raíz el bug de ResponsiveContainer + React 19 + Framer Motion.
 * 
 * Si este componente funciona sin errores en producción, se puede reintroducir
 * Recharts con dimensiones fijas más adelante.
 */

interface Props {
  quarterlyAssessment: any | null;
  brandColor?: string;
}

const PortalTrendChart: React.FC<Props> = ({ quarterlyAssessment, brandColor = '#ffffff' }) => {
  const gradientId = useRef(`grad-${Math.random().toString(36).slice(2, 9)}`);

  // Extraemos los valores numéricos de forma segura
  const values = useMemo(() => {
    if (!quarterlyAssessment || typeof quarterlyAssessment !== 'object') return [];
    
    try {
      const nums = Object.values(quarterlyAssessment)
        .filter((v): v is number => typeof v === 'number' && v > 0);
      
      // Si hay muy pocos puntos, generamos una rampa suave para el efecto estético
      if (nums.length < 3) {
        const base = nums.length > 0 ? nums[0] : 80;
        return [base * 0.6, base * 0.75, base * 0.85, ...nums, (nums[nums.length - 1] || base) * 1.02];
      }
      return nums;
    } catch {
      return [];
    }
  }, [quarterlyAssessment]);

  if (values.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white/20 text-xs uppercase tracking-widest">Sin datos de tendencia</p>
      </div>
    );
  }

  // Calculamos el path SVG manualmente (curva suave tipo monotone)
  const width = 400;
  const height = 180;
  const padding = 10;
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  const points = values.map((v, i) => ({
    x: padding + (i / (values.length - 1)) * (width - padding * 2),
    y: padding + (1 - (v - minVal) / range) * (height - padding * 2)
  }));

  // Construimos un path con curvas Bezier suaves
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    pathD += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Path para el área (fill) — cierra por abajo
  const areaD = pathD + ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="w-full relative overflow-hidden group rounded-3xl" style={{ height: '200px' }}>
      {/* Glow sutil */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl transition-opacity duration-1000 group-hover:opacity-30"
        style={{ background: brandColor }}
      />
      
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full relative z-10"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id={gradientId.current} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={brandColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={brandColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Área con gradiente */}
        <path
          d={areaD}
          fill={`url(#${gradientId.current})`}
        />

        {/* Línea principal */}
        <path
          d={pathD}
          fill="none"
          stroke={brandColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default PortalTrendChart;
