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
    { id: 'overview', icon: <LayoutGrid size={22} />, label: t('nav.dashboard') },
    { id: 'clients', icon: <Users size={22} />, label: t('nav.clients') },
    { id: 'status', icon: <Star size={22} />, label: t('nav.projects') },
    { id: 'tasks', icon: <CheckSquare size={22} />, label: t('nav.tasks') },
  ];

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="glass-panel h-screen sticky top-0 z-40 flex flex-col transition-all duration-300"
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 min-w-[40px] bg-gradient-to-br from-rc-teal to-rc-teal/60 rounded-xl flex items-center justify-center shadow-lg shadow-rc-teal/20 border border-white/10 group overflow-hidden"
          >
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-7 h-7 object-contain" />
            ) : (
              <span className="text-white font-black text-xs uppercase tracking-tighter group-hover:scale-110 transition-transform">Rc</span>
            )}
          </motion.div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-xl font-black tracking-tighter text-[var(--text-primary)] leading-none italic uppercase truncate max-w-[160px]">
                {branding.companyName.split(' ')[0]}
              </span>
              <span className="text-[10px] font-bold text-rc-teal uppercase tracking-[0.2em]">Elite Panel</span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all group relative ${
                activeTab === item.id 
                  ? 'bg-rc-teal text-white shadow-lg shadow-rc-teal/20' 
                  : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-sm tracking-tight"
                >
                  {item.label}
                </motion.span>
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* User Information & Settings */}
        <div className="p-4 space-y-2 border-t border-[var(--glass-border)] px-4 py-6">
          {/* Admin Tools */}
          {isAdmin && (
            <button 
              onClick={() => setIsBrandingModalOpen(true)}
              className="w-full flex items-center gap-4 p-3 text-rc-teal hover:bg-rc-teal/10 transition-all rounded-xl mb-4 border border-rc-teal/20"
            >
              <Palette size={20} />
              {!isCollapsed && <span className="text-xs font-black uppercase tracking-wider">Identidad Visual</span>}
            </button>
          )}

          {/* User Identity Section */}
          <div className={`flex items-center gap-3 p-3 mb-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] transition-all ${isCollapsed ? 'justify-center' : ''}`}>
             {user?.photoURL ? (
               <img 
                 src={user.photoURL} 
                 alt={user.displayName || 'User'} 
                 className="w-8 h-8 rounded-full border-2 border-rc-teal/30 object-cover"
               />
             ) : (
               <div className="w-8 h-8 rounded-full bg-rc-teal/20 flex items-center justify-center border-2 border-rc-teal/30">
                  <span className="text-[10px] font-black text-rc-teal">
                    {(user?.displayName || 'U').charAt(0).toUpperCase()}
                  </span>
               </div>
             )}
             {!isCollapsed && (
               <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-[var(--text-primary)] truncate uppercase tracking-tight">
                    {user?.displayName || 'Elite User'}
                  </span>
                  <span className="text-[9px] font-bold text-rc-teal truncate tracking-widest uppercase opacity-60">
                    {isAdmin ? 'Administrador' : 'Ejecutivo'}
                  </span>
               </div>
             )}
          </div>

          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 p-3 text-[var(--text-secondary)] hover:text-rc-teal transition-colors rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>}
          </button>

          <button 
            onClick={toggleLanguage}
            className="w-full flex items-center gap-4 p-3 text-[var(--text-secondary)] hover:text-rc-teal transition-colors rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Languages size={20} />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">{i18n.language === 'es' ? 'English' : 'Español'}</span>}
          </button>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 text-rose-500 hover:bg-rose-500/10 transition-all rounded-xl mt-4"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">{t('nav.logout')}</span>}
          </button>

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

