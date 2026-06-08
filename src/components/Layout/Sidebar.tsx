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
import { brandingService, BrandingConfig } from '../../services/brandingService';
import SettingsModal from '../Modals/SettingsModal';
import { NAV_ITEMS } from '../../config/navigation.config';

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user, isAdmin } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>(brandingService.defaultConfig);

  React.useEffect(() => {
    const loadBranding = async () => {
      const config = await brandingService.getBranding();
      setBrandingConfig(config);
    };
    loadBranding();

    const handleBrandingChange = (e: Event) => {
      const customEvent = e as CustomEvent<BrandingConfig>;
      setBrandingConfig(customEvent.detail);
    };

    document.addEventListener('elite-branding-changed', handleBrandingChange);
    return () => {
      document.removeEventListener('elite-branding-changed', handleBrandingChange);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <aside className="w-64 flex-shrink-0 h-full flex flex-col py-6 gap-6 relative z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto transition-colors duration-300">
      {/* Branding Logo */}
      <div className="flex items-center gap-3 px-6 mb-2">
        <div className="w-10 h-10 flex-shrink-0 bg-blue-50 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden">
          {brandingConfig.logoUrl ? (
            <img src={brandingConfig.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <Star size={20} fill="currentColor" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-800 dark:text-white text-base tracking-tight leading-tight">
            CRM Gestión Rc506
          </span>
          <span className="text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">
             {brandingConfig.companyName || 'Rc506'}
          </span>
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
                  flex items-center px-4 py-3.5 rounded-xl gap-3 transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white font-semibold'}
                `}
              >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap tracking-wide">
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
      <div className="mt-auto flex flex-col gap-1 pb-4 px-3 w-full border-t border-slate-200 dark:border-slate-800 pt-4">
         {isAdmin && (
           <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center px-4 py-3.5 rounded-xl gap-3 transition-colors duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white w-full text-left"
           >
            <Settings size={18} strokeWidth={2} className="flex-shrink-0" />
            <span className="font-semibold text-sm whitespace-nowrap tracking-wide">
               Configuración SLA
            </span>
           </button>
         )}

         <button 
            onClick={toggleTheme}
            className="flex items-center px-4 py-3.5 rounded-xl gap-3 transition-colors duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white w-full text-left"
         >
          {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          <span className="font-semibold text-sm whitespace-nowrap tracking-wide">
             {theme === 'dark' ? 'Tema Claro' : 'Tema Oscuro'}
          </span>
         </button>

         <button 
            onClick={logout}
            className="flex items-center px-4 py-3.5 rounded-xl gap-3 transition-colors duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 w-full text-left"
         >
          <LogOut size={18} strokeWidth={2} className="flex-shrink-0" />
          <span className="font-semibold text-sm whitespace-nowrap tracking-wide">
             Cerrar Sesión
          </span>
         </button>

         <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl mx-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
               <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'Marilyn'}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
               />
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.displayName || 'Usuario'}</span>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Online</span>
               </div>
            </div>
         </div>
      </div>

      {/* Configuration Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
};

export default Sidebar;
