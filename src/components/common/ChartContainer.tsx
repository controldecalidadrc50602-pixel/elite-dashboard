import React, { useState, useEffect, useRef } from 'react';

/**
 * Reemplazo de fuerza bruta para ResponsiveContainer de Recharts.
 * Evita el React 19 Minified Error #310 aislando la medición del DOM.
 */
interface Props {
  children: React.ReactElement;
  width?: string | number;
  height?: string | number;
}

export const ChartContainer: React.FC<Props> = ({ children, width = '100%', height = '100%' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay inicial para evadir el ciclo de renderizado estricto de React 19 + Framer Motion
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight;
        if (w > 0 && h > 0) {
          setSize({ width: w, height: h });
        }
      }
    };

    measure();
    const observer = new ResizeObserver(() => {
      // Usamos requestAnimationFrame para no saturar el main thread
      requestAnimationFrame(measure);
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div ref={containerRef} style={{ width, height, minHeight: '100px' }}>
      {size.width > 0 && size.height > 0 
        ? React.cloneElement(children as React.ReactElement<any>, { 
            width: size.width, 
            height: size.height 
          }) 
        : null}
    </div>
  );
};

export default ChartContainer;
