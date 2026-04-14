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
  // Mapeo robusto de colores para evitar problemas con clases dinámicas de Tailwind
  const colorMap: Record<string, { bg: string, text: string, ring: string }> = {
    'rc-teal': { bg: 'bg-[#3BC7AA]/10', text: 'text-[#3BC7AA]', ring: 'border-[#3BC7AA]/20' },
    'emerald': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', ring: 'border-emerald-500/20' },
    'rose': { bg: 'bg-rose-500/10', text: 'text-rose-500', ring: 'border-rose-500/20' },
    'amber': { bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'border-amber-500/20' },
  };

  const style = colorMap[color] || colorMap['rc-teal'];

  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-6 rounded-[32px] relative overflow-hidden group transition-all flex items-center gap-5 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
    >
      <div className={`w-14 h-14 rounded-[1.25rem] ${style.bg} ${style.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner`}>
        {React.cloneElement(icon, { size: 26, strokeWidth: 2.5 } as any)}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">{title}</span>
        <div className="flex items-baseline gap-2">
           <h4 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter leading-none">{value}</h4>
           {trend && (
             <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">
               {trend}
             </span>
           )}
        </div>
      </div>
      
      {/* Sutil gradiente de fondo en hover */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${style.bg} rounded-full blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-700`} />
    </motion.div>

  );
};

export default StatCard;
