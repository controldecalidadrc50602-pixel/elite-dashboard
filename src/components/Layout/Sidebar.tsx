import React, { useState } from 'react';
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
  Archive,
  Settings
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import SettingsModal from '../Modals/SettingsModal';

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user, isAdmin } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    <aside className={`group h-full flex flex-col py-8 gap-8 border-r relative z-50 transition-all duration-300 overflow-hidden ${
      theme === 'light' 
      ? 'w-[88px] hover:w-[260px] bg-[var(--sidebar-bg)] border-transparent shadow-xl' 
      : 'w-[88px] glass-panel items-center border-white/5 bg-black/20 backdrop-blur-3xl'
    }`}>
      {/* Branding Logo */}
      <div className={`flex items-center gap-4 px-8 ${theme === 'dark' ? 'justify-center w-full px-0' : ''}`}>
        <div className="w-11 h-11 flex-shrink-0 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-xl shadow-rc-teal/5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group/logo">
          <Star size={22} fill="currentColor" className="group-hover/logo:rotate-12 transition-transform" />
        </div>
        {theme === 'light' && (
          <span className="font-bold text-white text-lg tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Elite Dashboard
          </span>
        )}
      </div>
      
      {/* Navigation Links */}
      <nav className={`flex flex-col gap-2 ${theme === 'dark' ? 'gap-5 items-center' : 'px-4'}`}>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center transition-all duration-300 relative premium-button
                ${theme === 'light' 
                  ? `h-12 px-3 rounded-lg gap-4 ${isActive ? 'bg-[var(--sidebar-active)] text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]'}`
                  : `w-13 h-13 rounded-xl flex-col justify-center gap-1.5 ${isActive ? 'bg-rc-teal text-black shadow-lg shadow-rc-teal/20 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`${theme === 'light' ? 'w-6 flex justify-center' : ''}`}>
                     <Icon size={19} strokeWidth={isActive ? 2.5 : 1.5} className="flex-shrink-0" />
                  </div>
                  <span className={`whitespace-nowrap transition-all duration-300 ${
                    theme === 'light' 
                    ? `font-medium text-sm opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0 ${isActive ? 'text-white' : ''}`
                    : `text-[7px] font-medium uppercase tracking-[0.2em] text-center px-1 ${isActive ? 'opacity-100' : 'opacity-40'}`
                  }`}>
                    {item.label}
                  </span>
                  {isActive && theme === 'dark' && (
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
      <div className={`mt-auto flex flex-col gap-2 pb-4 ${theme === 'dark' ? 'items-center gap-5' : 'px-4 w-full'}`}>
         {isAdmin && (
           <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center transition-all duration-300 relative premium-button ${
                theme === 'light' 
                  ? 'h-12 px-3 rounded-lg gap-4 text-[var(--text-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] w-full'
                  : 'w-11 h-11 rounded-xl glass-card justify-center text-slate-500 hover:text-rc-teal'
              }`}
              title="Configuración de Sistema"
           >
              <div className={`${theme === 'light' ? 'w-6 flex justify-center' : ''}`}>
                 <Settings size={18} strokeWidth={1.5} className="flex-shrink-0" />
              </div>
              <span className={`whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                 theme === 'light' ? 'opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0' : 'hidden'
              }`}>
                 Ajustes
              </span>
           </button>
         )}

         <button 
            onClick={toggleTheme}
            className={`flex items-center transition-all duration-300 relative premium-button ${
              theme === 'light' 
                ? 'h-12 px-3 rounded-lg gap-4 text-[var(--text-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] w-full'
                : 'w-11 h-11 rounded-xl glass-card justify-center text-slate-500 hover:text-rc-teal'
            }`}
         >
            <div className={`${theme === 'light' ? 'w-6 flex justify-center' : ''}`}>
               {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} className="flex-shrink-0" /> : <Moon size={18} strokeWidth={1.5} className="flex-shrink-0" />}
            </div>
            <span className={`whitespace-nowrap transition-all duration-300 font-medium text-sm ${
               theme === 'light' ? 'opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0' : 'hidden'
            }`}>
               Tema Oscuro
            </span>
         </button>
         
         <button 
            onClick={toggleLanguage}
            className={`flex items-center transition-all duration-300 relative premium-button ${
              theme === 'light' 
                ? 'h-12 px-3 rounded-lg gap-4 text-[var(--text-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] w-full'
                : 'w-11 h-11 rounded-xl glass-card justify-center text-slate-500 hover:text-rc-teal'
            }`}
         >
            <div className={`${theme === 'light' ? 'w-6 flex justify-center' : ''}`}>
               <Languages size={18} strokeWidth={1.5} className="flex-shrink-0" />
            </div>
            <span className={`whitespace-nowrap transition-all duration-300 font-medium text-sm ${
               theme === 'light' ? 'opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0' : 'hidden'
            }`}>
               Idioma
            </span>
         </button>

         <button 
            onClick={logout}
            className={`flex items-center transition-all duration-300 relative premium-button ${
              theme === 'light' 
                ? 'h-12 px-3 rounded-lg gap-4 text-[var(--danger-color)] hover:bg-[var(--sidebar-hover)] w-full'
                : 'w-11 h-11 rounded-xl glass-card justify-center text-slate-500 hover:text-rose-500'
            }`}
         >
            <div className={`${theme === 'light' ? 'w-6 flex justify-center' : ''}`}>
               <LogOut size={18} strokeWidth={1.5} className="flex-shrink-0" />
            </div>
            <span className={`whitespace-nowrap transition-all duration-300 font-medium text-sm ${
               theme === 'light' ? 'opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0' : 'hidden'
            }`}>
               Cerrar Sesión
            </span>
         </button>

         <div className={`mt-4 w-11 h-11 rounded-full overflow-hidden border border-white/10 p-0.5 hover:border-rc-teal transition-all duration-200 cursor-pointer ring-2 ring-transparent hover:ring-rc-teal/30 ${theme === 'light' ? 'mx-auto border-transparent shadow-md' : ''}`}>
            <img 
               src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'Marilyn'}`} 
               alt="Profile" 
               className="w-full h-full rounded-full object-cover"
            />
         </div>
      </div>

      {/* Configuration Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
};

export default Sidebar;
