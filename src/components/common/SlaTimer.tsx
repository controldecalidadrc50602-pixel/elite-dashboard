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
      } else if (remaining < 1800000) { // 30 min
        setColor('text-rose-600 font-black animate-pulse');
      } else if (pct > 75) {
        setColor('text-rose-500');
      } else if (pct > 50) {
        setColor('text-amber-500');
      } else if (pct > 33) {
        setColor('text-yellow-400');
      } else {
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
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  const getRiskLevel = () => {
    if (status === 'Closed') return null;
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const elapsed = now - start;
    const total = end - start;
    const timePct = (elapsed / total) * 100;

    // Simple heuristic: If time spent > 50% but progress is low, or time is almost up
    if (timePct > 80) return { label: 'CRÍTICO', color: 'text-rose-600' };
    if (timePct > 50) return { label: 'ALTO', color: 'text-rose-400' };
    return { label: 'BAJO', color: 'text-[var(--rc-turquoise)]' };
  };

  const risk = getRiskLevel();

  if (status === 'Closed') {
    return <span className="text-[10px] font-black text-[var(--rc-turquoise)] uppercase tracking-widest opacity-60">Finalizado</span>;
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flex items-center gap-2 ${color} transition-colors duration-500`}>
        <motion.div
          animate={timeLeft < 1800000 ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {timeLeft < 1800000 ? <AlertTriangle size={14} /> : <Clock size={14} />}
        </motion.div>
        <span className="text-sm font-black tracking-tighter tabular-nums whitespace-nowrap">
          {formatTime(timeLeft)}
        </span>
      </div>
      
      {risk && (
        <div className="flex flex-col items-center gap-1">
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`text-[7px] font-black uppercase tracking-widest ${risk.color}`}>
            Riesgo: {risk.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default SlaTimer;
