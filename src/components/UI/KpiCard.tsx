import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  valueColorClass?: string;
  prediction?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass,
  iconBgClass,
  valueColorClass = 'text-slate-800',
  prediction
}) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgClass}`}>
          <Icon className={iconColorClass} size={20} />
        </div>
      </div>
      <div>
        <div className={`text-3xl font-bold ${valueColorClass}`}>
          {value}
        </div>
        <div className="flex items-center justify-between mt-2">
          {subtitle && <span className="text-xs text-slate-400 font-medium">{subtitle}</span>}
          {prediction && <div className="text-xs">{prediction}</div>}
        </div>
      </div>
    </div>
  );
};
