import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  startTime: string;
  endTime: string;
  status: 'Open' | 'In Progress' | 'Closed';
}

const SlaTimer: React.FC<Props> = ({ startTime, endTime, status }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [color, setColor] = useState<string>('text-[var(--rc-turquoise)]');

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const total = end - start;
      const elapsed = now - start;
      const remaining = end - now;

      const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
      setPercentage(pct);
      setTimeLeft(remaining);

      if (remaining < 0) {
        setColor('text-slate-500'); // Expired
      } else if (remaining < 1800000) { // < 30 min (Rojo Parpadeante)
        setColor('text-rose-600 font-black');
      } else if (pct > 75) { // 75% (Naranja)
        setColor('text-orange-500');
      } else if (pct > 50) { // 50% (Amarillo)
        setColor('text-yellow-400');
      } else { // Óptimo (Turquesa)
        setColor('text-[var(--rc-turquoise)]');
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return 'SLA BREACHED';
    const totalSecs = Math.floor(ms / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const getRiskLevel = () => {
    if (status === 'Closed') return null;
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const elapsed = now - start;
    const total = end - start;
    const timePct = (elapsed / total) * 100;

    if (timePct > 90 || timeLeft < 1800000) return { label: 'CRÍTICO', color: 'text-rose-600' };
    if (timePct > 75) return { label: 'ALTO', color: 'text-orange-500' };
    if (timePct > 50) return { label: 'MEDIO', color: 'text-yellow-400' };
    return { label: 'ÓPTIMO', color: 'text-[var(--rc-turquoise)]' };
  };

  const risk = getRiskLevel();

  if (status === 'Closed') {
    return (
      <div className="flex items-center gap-2 text-[var(--rc-turquoise)] opacity-60">
        <CheckCircle2 size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">SLA Cumplido</span>
      </div>
    );
  }

  const isCritical = timeLeft < 1800000 && timeLeft > 0;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flex items-center gap-2 ${color} transition-colors duration-500`}>
        <motion.div
          animate={isCritical ? { 
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
            rotate: [0, -10, 10, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {isCritical ? <ShieldAlert size={16} /> : <Clock size={14} />}
        </motion.div>
        <span className={`text-[15px] font-black tracking-tighter tabular-nums whitespace-nowrap ${isCritical ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]' : ''}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      {risk && (
        <div className="flex flex-col items-center gap-1 w-full min-w-[100px]">
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000 shadow-[0_0_10px_rgba(var(--rc-turquoise-rgb),0.3)]`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${risk.color}`}>
            {risk.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default SlaTimer;

