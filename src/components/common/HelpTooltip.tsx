import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpTooltipProps {
  title: string;
  description: string;
  example?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  title, 
  description, 
  example,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-3 left-1/2 -translate-x-1/2 origin-top';
      case 'left':
        return 'right-full mr-3 top-1/2 -translate-y-1/2 origin-right';
      case 'right':
        return 'left-full ml-3 top-1/2 -translate-y-1/2 origin-left';
      case 'top':
      default:
        return 'bottom-full mb-3 left-1/2 -translate-x-1/2 origin-bottom';
    }
  };

  return (
    <div 
      className="relative inline-block ml-2 shrink-0 select-none"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {/* Target Trigger Icon with Cinematic Pulsing Hover */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.2, rotate: 15 }}
        className="w-5 h-5 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-rc-teal/40 hover:bg-rc-teal/5 text-slate-500 hover:text-rc-teal transition-all duration-300 focus:outline-none cursor-help shadow-lg"
      >
        <Info size={11} strokeWidth={2.5} />
      </motion.button>

      {/* Flotante Glassmorphic Tooltip Card */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 250 }}
            className={`absolute z-[120] w-64 p-5 bg-[#090D16]/95 backdrop-blur-2xl border border-rc-teal/30 rounded-2xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] text-left ${getPositionClasses()}`}
          >
            {/* Visual Header Indicator glow */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-rc-teal/50 to-transparent" />
            
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
              {title}
            </h4>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-light mb-2.5">
              {description}
            </p>
            
            {example && (
              <div className="pt-2 border-t border-white/5">
                <span className="text-[8px] font-bold text-rc-teal uppercase tracking-widest block mb-1">
                  Criterio de Aplicación
                </span>
                <p className="text-[9px] text-slate-500 italic leading-snug">
                  {example}
                </p>
              </div>
            )}
            
            {/* Decorative arrow or glow border */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#090D16] border-r border-b border-rc-teal/30 rotate-45 pointer-events-none hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpTooltip;
