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
    { id: 'overview', icon: <LayoutGrid size={20} strokeWidth={1.5} />, label: t('nav.dashboard') },
    { id: 'clients', icon: <Users size={20} strokeWidth={1.5} />, label: t('nav.clients') },
    { id: 'status', icon: <Star size={20} strokeWidth={1.5} />, label: t('nav.projects') },
    { id: 'tasks', icon: <CheckSquare size={20} strokeWidth={1.5} />, label: t('nav.tasks') },
  ];

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 300 }}
        className="glass-panel h-screen sticky top-0 z-40 flex flex-col transition-all duration-300"
      >
        {/* Logo Section */}
        <div className="p-8 flex items-center gap-4 overflow-hidden">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 min-w-[40px] bg-rc-teal rounded-xl flex items-center justify-center shadow-lg shadow-rc-teal/20 border border-white/10 group overflow-hidden"
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
              <span className="text-[18px] font-semibold tracking-tight text-[var(--text-primary)] leading-none">
                {branding.companyName.split(' ')[0]}
              </span>
              <span className="text-[10px] font-medium text-rc-teal uppercase tracking-widest mt-1 opacity-60">Elite Dashboard</span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-10 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${
                activeTab === item.id 
                  ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] shadow-2xl shadow-[var(--rc-turquoise)]/20' 
                  : 'text-[var(--rc-slate)] hover:bg-[var(--rc-turquoise)]/5 hover:text-[var(--rc-turquoise)]'
              }`}
            >
              <div className={`transition-all duration-300 group-hover:scale-110 ${activeTab === item.id ? 'text-[var(--bg-primary)]' : 'text-[var(--rc-slate)] group-hover:text-[var(--rc-turquoise)]'}`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`font-semibold text-[13px] tracking-tight ${activeTab === item.id ? 'text-[var(--bg-primary)]' : 'text-[var(--rc-slate)] group-hover:text-[var(--rc-turquoise)]'}`}
                >
                  {item.label}
                </motion.span>
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-[var(--bg-primary)]/40 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* User Information & Settings */}
        <div className="p-6 space-y-3 border-t border-[var(--glass-border)]">
          {/* User Identity Section */}
          <div className={`flex items-center gap-4 p-3 mb-4 rounded-2xl bg-white/[0.02] border border-[var(--glass-border)] transition-all ${isCollapsed ? 'justify-center' : ''}`}>
             {user?.photoURL ? (
               <img 
                 src={user.photoURL} 
                 alt={user.displayName || 'User'} 
                 className="w-8 h-8 rounded-full border border-[var(--glass-border)] object-cover"
               />
             ) : (
               <div className="w-8 h-8 rounded-full bg-[var(--rc-turquoise)]/10 flex items-center justify-center border border-[var(--rc-turquoise)]/20">
                  <span className="text-[10px] font-semibold text-[var(--rc-turquoise)]">
                    {(user?.displayName || 'U').charAt(0).toUpperCase()}
                  </span>
               </div>
             )}
             {!isCollapsed && (
               <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-[var(--text-primary)] truncate tracking-tight">
                    {user?.displayName || 'Elite User'}
                  </span>
                  <span className="text-[9px] font-medium text-[var(--rc-turquoise)] truncate tracking-widest uppercase opacity-60 mt-0.5">
                    {isAdmin ? 'Admin' : 'Executive'}
                  </span>
               </div>
             )}
          </div>

          <div className="flex flex-col gap-1">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-4 p-3 text-[var(--rc-slate)] hover:text-[var(--rc-turquoise)] transition-colors rounded-xl hover:bg-[var(--rc-turquoise)]/5"
            >
              <div className="transition-transform hover:rotate-12">
                {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              </div>
              {!isCollapsed && <span className="text-[12px] font-medium tracking-tight">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>}
            </button>

            <button 
              onClick={toggleLanguage}
              className="w-full flex items-center gap-4 p-3 text-[var(--rc-slate)] hover:text-[var(--rc-turquoise)] transition-colors rounded-xl hover:bg-[var(--rc-turquoise)]/5"
            >
              <Languages size={18} strokeWidth={1.5} />
              {!isCollapsed && <span className="text-[12px] font-medium tracking-tight">{i18n.language === 'es' ? 'English' : 'Español'}</span>}
            </button>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 p-3 text-rose-500 hover:bg-rose-500/5 transition-all rounded-xl mt-4 border border-transparent hover:border-rose-500/10"
            >
              <LogOut size={18} strokeWidth={1.5} />
              {!isCollapsed && <span className="text-[12px] font-semibold tracking-tight">{t('nav.logout')}</span>}
            </button>
          </div>

          {/* Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full items-center justify-center shadow-xl border border-[var(--glass-border)] z-50 hover:scale-110 transition-transform"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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

