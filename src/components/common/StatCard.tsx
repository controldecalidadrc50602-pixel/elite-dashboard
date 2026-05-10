import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  const colorMap: Record<string, { bg: string, text: string }> = {
    'rc-teal': { bg: 'bg-[#3BBCA9]/10', text: 'text-[#3BBCA9]' },
    'emerald': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    'rose': { bg: 'bg-rose-500/10', text: 'text-rose-500' },
    'amber': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  };

  const style = colorMap[color] || colorMap['rc-teal'];

  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
      className="glass-card p-6 rounded-[32px] relative overflow-hidden group border border-[var(--glass-border)] premium-button"
    >
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 shadow-lg shadow-black/20`}>
            {React.cloneElement(icon, { size: 20, strokeWidth: 2 } as any)}
          </div>
          {trend && (
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/10 animate-neon">
              {trend}
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
          <h4 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter leading-none">{value}</h4>
        </div>
      </div>
      
      <div className={`absolute -right-2 -bottom-2 w-20 h-20 ${style.bg} rounded-full blur-[30px] opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
    </motion.div>
  );
};

export default StatCard;

