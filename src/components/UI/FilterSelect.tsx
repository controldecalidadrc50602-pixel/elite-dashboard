import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FilterSelectProps {
  label: string;
  icon: LucideIcon;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  icon: Icon,
  options,
  value,
  onChange
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 ml-1">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-slate-100 border border-transparent hover:border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
