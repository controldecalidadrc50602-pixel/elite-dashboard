import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Star,
  LogOut,
  Sun,
  Moon,
  Languages,
  Settings
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import SettingsModal from '../Modals/SettingsModal';
import { NAV_ITEMS } from '../../config/navigation.config';

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user, isAdmin } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <aside className="group h-full flex flex-col py-8 gap-8 relative z-50 transition-all duration-300 overflow-hidden w-[88px] hover:w-[260px] sidebar-container">
      {/* Branding Logo */}
      <div className="flex items-center gap-4 px-8">
        <div className="w-11 h-11 flex-shrink-0 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-xl shadow-rc-teal/5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group/logo">
          <Star size={22} fill="currentColor" className="group-hover/logo:rotate-12 transition-transform" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Elite Dashboard
        </span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 px-4">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center transition-all duration-300 relative premium-button h-12 px-3 rounded-lg gap-4
                ${isActive ? 'sidebar-btn-active' : 'sidebar-btn'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="w-6 flex justify-center">
                     <Icon size={19} strokeWidth={isActive ? 2.5 : 1.5} className="flex-shrink-0" />
                  </div>
                  <span className={`whitespace-nowrap transition-all duration-300 font-medium text-sm opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0 ${isActive && theme === 'light' ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && theme === 'dark' && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-rc-teal rounded-r-full shadow-[2px_0_10px_rgba(59,188,169,0.5)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Action Buttons & Profile */}
      <div className="mt-auto flex flex-col gap-2 pb-4 px-4 w-full">
         {isAdmin && (
           <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center transition-all duration-300 relative premium-button h-12 px-3 rounded-lg gap-4 w-full sidebar-btn"
              title="Configuración de Sistema"
           >
              <div className="w-6 flex justify-center">
                 <Settings size={18} strokeWidth={1.5} className="flex-shrink-0" />
              </div>
              <span className="whitespace-nowrap transition-all duration-300 font-medium text-sm opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0">
                 Ajustes
              </span>
           </button>
         )}

         <button 
            onClick={toggleTheme}
            className="flex items-center transition-all duration-300 relative premium-button h-12 px-3 rounded-lg gap-4 w-full sidebar-btn"
         >
            <div className="w-6 flex justify-center">
               {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} className="flex-shrink-0" /> : <Moon size={18} strokeWidth={1.5} className="flex-shrink-0" />}
            </div>
            <span className="whitespace-nowrap transition-all duration-300 font-medium text-sm opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0">
               {theme === 'dark' ? 'Tema Claro' : 'Tema Oscuro'}
            </span>
         </button>
         
         <button 
            onClick={toggleLanguage}
            className="flex items-center transition-all duration-300 relative premium-button h-12 px-3 rounded-lg gap-4 w-full sidebar-btn"
         >
            <div className="w-6 flex justify-center">
               <Languages size={18} strokeWidth={1.5} className="flex-shrink-0" />
            </div>
            <span className="whitespace-nowrap transition-all duration-300 font-medium text-sm opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0">
               Idioma
            </span>
         </button>

         <button 
            onClick={logout}
            className="flex items-center transition-all duration-300 relative premium-button h-12 px-3 rounded-lg gap-4 w-full sidebar-btn-danger"
         >
            <div className="w-6 flex justify-center">
               <LogOut size={18} strokeWidth={1.5} className="flex-shrink-0" />
            </div>
            <span className="whitespace-nowrap transition-all duration-300 font-medium text-sm opacity-0 group-hover:opacity-100 overflow-hidden group-hover:w-auto w-0">
               Cerrar Sesión
            </span>
         </button>

         <div className={`mt-4 w-11 h-11 rounded-full overflow-hidden border p-0.5 transition-all duration-200 cursor-pointer ring-2 ring-transparent mx-auto ${
            theme === 'light' ? 'border-transparent shadow-md hover:ring-blue-300' : 'border-white/10 hover:border-rc-teal hover:ring-rc-teal/30'
         }`}>
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
