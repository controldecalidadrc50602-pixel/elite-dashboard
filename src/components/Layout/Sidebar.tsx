import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutGrid, 
  Users, 
  CheckSquare, 
  ShieldCheck,
  Star,
  Bell,
  LogOut,
  Sun,
  Moon,
  Languages,
  Palette
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
  const { logout, user, isAdmin } = useAuth();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <aside className="w-24 h-full glass-panel flex flex-col items-center py-10 gap-10 border-r border-white/5 relative z-50">
      {/* Branding Logo */}
      <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal shadow-xl shadow-rc-teal/10 transition-transform hover:scale-110 active:scale-95 cursor-pointer group">
        <Star size={24} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
      </div>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-6">
        {[
          { id: 'overview', icon: LayoutGrid, label: 'Feed' },
          { id: 'clients', icon: Users, label: 'Clientes' },
          { id: 'tasks', icon: CheckSquare, label: 'Tareas' },
          { id: 'status', icon: ShieldCheck, label: 'Auditoría' },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-rc-teal text-black shadow-lg shadow-rc-teal/20 scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute -left-12 w-1.5 h-8 bg-rc-teal rounded-r-full shadow-[4px_0_15px_rgba(59,188,169,0.6)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Buttons & Profile */}
      <div className="mt-auto flex flex-col gap-6 items-center">
         <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-slate-500 hover:text-rc-teal transition-all hover:shadow-[0_0_15px_rgba(59,188,169,0.3)]"
         >
            {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
         </button>
         
         <button 
            onClick={toggleLanguage}
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-slate-500 hover:text-rc-teal transition-all hover:shadow-[0_0_15px_rgba(59,188,169,0.3)]"
         >
            <Languages size={20} strokeWidth={1.5} />
         </button>

         <button 
            onClick={logout}
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
         >
            <LogOut size={20} strokeWidth={1.5} />
         </button>

         <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 p-0.5 hover:border-rc-teal transition-all cursor-pointer ring-2 ring-transparent hover:ring-rc-teal/30">
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
