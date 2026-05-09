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
  // Mapeo de colores refinado
  const colorMap: Record<string, { bg: string, text: string }> = {
    'rc-teal': { bg: 'bg-[#3BBCA9]/10', text: 'text-[#3BBCA9]' },
    'emerald': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    'rose': { bg: 'bg-rose-500/10', text: 'text-rose-500' },
    'amber': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  };

  const style = colorMap[color] || colorMap['rc-teal'];

  return (
    <motion.div 
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass-card p-8 rounded-[32px] relative overflow-hidden group border border-[var(--glass-border)]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center shrink-0`}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 1.5 } as any)}
          </div>
          {trend && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.1em]">{title}</span>
          <h4 className="large-value text-[var(--text-primary)]">{value}</h4>
        </div>
      </div>
      
      {/* Sutil gradiente de fondo en hover */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${style.bg} rounded-full blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-700`} />
    </motion.div>
  );
};


export default StatCard;
