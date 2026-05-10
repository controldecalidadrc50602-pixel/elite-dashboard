import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutGrid, 
  Users, 
  CheckSquare, 
  ShieldCheck,
  Star,
  LogOut,
  Sun,
  Moon,
  Languages
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <aside className="w-[88px] h-full glass-panel flex flex-col items-center py-8 gap-8 border-r relative z-50 transition-all duration-300">
      {/* Branding Logo */}
      <div className="w-11 h-11 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-xl shadow-rc-teal/5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group">
        <Star size={22} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
      </div>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-5">
        {[
          { id: 'overview', icon: LayoutGrid, label: 'Feed' },
          { id: 'clients', icon: Users, label: 'Clientes' },
          { id: 'tasks', icon: CheckSquare, label: 'Tareas' },
          { id: 'status', icon: ShieldCheck, label: 'Audit' },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-13 h-13 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 group relative premium-button ${
                isActive 
                  ? 'bg-rc-teal text-black shadow-lg shadow-rc-teal/20 scale-105' 
                  : 'text-slate-500 hover:text-[var(--text-primary)] hover:bg-white/5'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[7.5px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute -right-1 w-1 h-6 bg-rc-teal rounded-l-full shadow-[2px_0_10px_rgba(59,188,169,0.5)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Buttons & Profile */}
      <div className="mt-auto flex flex-col gap-5 items-center pb-4">
         <button 
            onClick={toggleTheme}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-rc-teal transition-all duration-200 hover:shadow-[0_0_15px_rgba(59,188,169,0.3)] premium-button"
         >
            {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
         </button>
         
         <button 
            onClick={toggleLanguage}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-rc-teal transition-all duration-200 hover:shadow-[0_0_15px_rgba(59,188,169,0.3)] premium-button"
         >
            <Languages size={18} strokeWidth={1.5} />
         </button>

         <button 
            onClick={logout}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all duration-200 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] premium-button"
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

