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
    <aside className="w-64 flex-shrink-0 h-full flex flex-col py-6 gap-6 relative z-50 bg-[#1E293B] border-r border-slate-700/50 shadow-xl overflow-y-auto">
      {/* Branding Logo */}
      <div className="flex items-center gap-3 px-6 mb-2">
        <div className="w-10 h-10 flex-shrink-0 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
          <Star size={20} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-base tracking-tight leading-tight">
            Elite Dashboard
          </span>
          <span className="text-blue-400 text-xs font-medium">Rc506</span>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-lg gap-3 transition-colors duration-200
                  ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                </>
              )}
              </NavLink>
            </div>
          );
        })}
      </nav>

      {/* Action Buttons & Profile */}
      <div className="mt-auto flex flex-col gap-1 pb-4 px-3 w-full border-t border-slate-700/50 pt-4">
         {isAdmin && (
           <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center px-4 py-3 rounded-lg gap-3 transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white w-full text-left"
           >
            <Settings size={18} strokeWidth={2} className="flex-shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">
               Configuración SLA
            </span>
           </button>
         )}

         <button 
            onClick={toggleTheme}
            className="flex items-center px-4 py-3 rounded-lg gap-3 transition-colors duration-200 text-slate-400 hover:bg-slate-800 hover:text-white w-full text-left hidden"
         >
          {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          <span className="font-medium text-sm whitespace-nowrap">
             {theme === 'dark' ? 'Tema Claro' : 'Tema Oscuro'}
          </span>
         </button>

         <button 
            onClick={logout}
            className="flex items-center px-4 py-3 rounded-lg gap-3 transition-colors duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left"
         >
          <LogOut size={18} strokeWidth={2} className="flex-shrink-0" />
          <span className="font-medium text-sm whitespace-nowrap">
             Cerrar Sesión
          </span>
         </button>

         <div className="mt-4 flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg mx-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600">
               <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'Marilyn'}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
               />
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-semibold text-white truncate">{user?.displayName || 'Usuario'}</span>
               <span className="text-[10px] text-slate-400 truncate text-emerald-400">● Online</span>
            </div>
         </div>
      </div>

      {/* Configuration Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
};

export default Sidebar;
