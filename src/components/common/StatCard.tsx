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
      whileHover={{ y: -4 }}
      className="glass-card p-5 rounded-[28px] relative overflow-hidden group transition-all flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 22 } as any)}
      </div>
      
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{title}</span>
        <div className="flex items-baseline gap-2">
           <h4 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">{value}</h4>
           {trend && (
             <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-lg">
               {trend}
             </span>
           )}
        </div>
      </div>
      
      {/* Sutil gradiente de fondo en hover */}
      <div className={`absolute -right-2 -bottom-2 w-16 h-16 ${style.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </motion.div>
  );
};

export default StatCard;
