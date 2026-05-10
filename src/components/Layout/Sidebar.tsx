import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutGrid, 
  Users, 
  CheckSquare, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Sun, 
  Moon, 
  Languages,
  Star,
  Palette
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { brandingService, BrandingConfig } from '../../services/brandingService';
import BrandingModal from '../Modals/BrandingModal';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [branding, setBranding] = useState<BrandingConfig>(brandingService.defaultConfig);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);

  useEffect(() => {
    const unsub = brandingService.subscribeToBranding(setBranding);
    return unsub;
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const navItems = [
    { id: 'overview', icon: <LayoutGrid size={22} strokeWidth={1} />, label: t('nav.dashboard') },
    { id: 'clients', icon: <Users size={22} strokeWidth={1} />, label: t('nav.clients') },
    { id: 'status', icon: <Star size={22} strokeWidth={1} />, label: t('nav.projects') },
    { id: 'tasks', icon: <CheckSquare size={22} strokeWidth={1} />, label: t('nav.tasks') },
  ];

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="glass-panel h-screen sticky top-0 z-40 flex flex-col transition-all duration-300 border-r border-white/5"
      >
        {/* Logo Section */}
        <div className="p-8 mb-4 flex items-center gap-4 overflow-hidden">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 min-w-[40px] bg-rc-teal rounded-full flex items-center justify-center shadow-lg shadow-rc-teal/20 border border-white/10 group overflow-hidden"
          >
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-white font-bold text-[10px] uppercase tracking-tighter">RC</span>
            )}
          </motion.div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-[16px] font-medium tracking-tight text-[var(--text-primary)] leading-none">
                {branding.companyName.split(' ')[0]}
              </span>
              <span className="text-[9px] font-medium text-rc-teal uppercase tracking-widest mt-1 opacity-50">v3.5 Elite</span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group relative ${
                activeTab === item.id 
                  ? 'bg-rc-teal/10 text-rc-teal' 
                  : 'text-[var(--rc-slate)] hover:text-rc-teal'
              }`}
            >
              <div className={`transition-all duration-300 ${activeTab === item.id ? 'text-rc-teal' : 'text-[var(--rc-slate)] group-hover:text-rc-teal'}`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`font-medium text-[14px] tracking-tight ${activeTab === item.id ? 'text-rc-teal' : 'text-[var(--rc-slate)] group-hover:text-rc-teal'}`}
                >
                  {item.label}
                </motion.span>
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute left-0 w-1 h-5 bg-rc-teal rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* User Information & Settings */}
        <div className="p-6 space-y-2">
          {!isCollapsed && (
             <div className="px-4 py-2">
                <span className="text-[10px] font-bold text-[var(--rc-slate)] uppercase tracking-[0.2em] opacity-40">Preferencias</span>
             </div>
          )}
          
          <div className="flex flex-col gap-0.5">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-4 p-3.5 text-[var(--rc-slate)] hover:text-rc-teal transition-colors rounded-xl hover:bg-rc-teal/5"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={1} /> : <Moon size={18} strokeWidth={1} />}
              {!isCollapsed && <span className="text-[13px] font-medium tracking-tight">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>}
            </button>

            <button 
              onClick={toggleLanguage}
              className="w-full flex items-center gap-4 p-3.5 text-[var(--rc-slate)] hover:text-rc-teal transition-colors rounded-xl hover:bg-rc-teal/5"
            >
              <Languages size={18} strokeWidth={1} />
              {!isCollapsed && <span className="text-[13px] font-medium tracking-tight">{i18n.language === 'es' ? 'English' : 'Español'}</span>}
            </button>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 p-3.5 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded-xl mt-4"
            >
              <LogOut size={18} strokeWidth={1} />
              {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{t('nav.logout')}</span>}
            </button>
          </div>

          {/* User Identity Section */}
          <div className={`flex items-center gap-3 p-3 mt-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
             {user?.photoURL ? (
               <img 
                 src={user.photoURL} 
                 alt={user.displayName || 'User'} 
                 className="w-7 h-7 rounded-full object-cover grayscale opacity-70"
               />
             ) : (
               <div className="w-7 h-7 rounded-full bg-rc-teal/10 flex items-center justify-center border border-rc-teal/20">
                  <span className="text-[10px] font-semibold text-rc-teal">
                    {(user?.displayName || 'U').charAt(0).toUpperCase()}
                  </span>
               </div>
             )}
             {!isCollapsed && (
               <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-medium text-[var(--text-primary)] truncate tracking-tight">
                    {user?.displayName || 'Elite User'}
                  </span>
                  <span className="text-[9px] font-medium text-rc-teal/60 truncate tracking-widest uppercase mt-0.5">
                    {isAdmin ? 'Admin' : 'Executive'}
                  </span>
               </div>
             )}
          </div>

          {/* Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-24 w-6 h-6 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-full items-center justify-center shadow-xl border border-white/10 z-50 hover:text-rc-teal transition-colors"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>
      </motion.aside>

      {/* Branding Modal */}
      <BrandingModal 
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        currentConfig={branding}
        onSave={setBranding}
      />
    </>
  );
};

export default Sidebar;

