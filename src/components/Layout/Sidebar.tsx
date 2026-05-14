import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutGrid, 
  Users, 
  ShieldCheck,
  Star,
  LogOut,
  Sun,
  Moon,
  Languages,
  Archive
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Expedientes' },
    { to: '/trimestre', icon: ShieldCheck, label: 'Trimestre' },
    { to: '/archive', icon: Archive, label: 'Bóveda' },
  ];

  return (
    <aside className="w-[88px] h-full glass-panel flex flex-col items-center py-8 gap-8 border-r border-white/5 relative z-50 transition-all duration-300 bg-black/20 backdrop-blur-3xl">
      {/* Branding Logo */}
      <div className="w-11 h-11 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-xl shadow-rc-teal/5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group">
        <Star size={22} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
      </div>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-5">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                w-13 h-13 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group relative premium-button
                ${isActive 
                  ? 'bg-rc-teal text-black shadow-lg shadow-rc-teal/20 scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className={`text-[7px] font-black uppercase tracking-[0.1em] text-center px-1 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute -right-1 w-1 h-6 bg-rc-teal rounded-l-full shadow-[2px_0_10px_rgba(59,188,169,0.5)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Action Buttons & Profile */}
      <div className="mt-auto flex flex-col gap-5 items-center pb-4">
         <button 
            onClick={toggleTheme}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-rc-teal transition-all duration-200 premium-button"
         >
            {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
         </button>
         
         <button 
            onClick={toggleLanguage}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-rc-teal transition-all duration-200 premium-button"
         >
            <Languages size={18} strokeWidth={1.5} />
         </button>

         <button 
            onClick={logout}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all duration-200 premium-button"
         >
            <LogOut size={18} strokeWidth={1.5} />
         </button>

         <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 p-0.5 hover:border-rc-teal transition-all duration-200 cursor-pointer ring-2 ring-transparent hover:ring-rc-teal/30">
            <img 
               src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'Marilyn'}`} 
               alt="Profile" 
               className="w-full h-full rounded-full object-cover"
            />
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
