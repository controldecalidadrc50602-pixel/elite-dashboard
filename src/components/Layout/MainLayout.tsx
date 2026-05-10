import React from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] overflow-hidden selection:bg-rc-teal/30">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden pb-20 md:pb-0">
        {/* Universal Backdrop Blur for the whole content area */}
        <div className="absolute inset-0 bg-gradient-to-br from-rc-teal/[0.02] to-transparent pointer-events-none" />
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 h-full overflow-hidden"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 z-[90]">
         {[
           { id: 'overview', icon: LayoutGrid, label: 'Feed' },
           { id: 'clients', icon: Users, label: 'Clientes' },
           { id: 'tasks', icon: CheckSquare, label: 'Tareas' },
           { id: 'status', icon: ShieldCheck, label: 'Auditoría' },
         ].map(tab => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.id;
           return (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-rc-teal scale-110' : 'text-slate-500 opacity-50'}`}
             >
               <Icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 1.5} />
               <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
               {isActive && (
                 <motion.div layoutId="mobile-tab-pill" className="w-1 h-1 bg-rc-teal rounded-full mt-1" />
               )}
             </button>
           );
         })}
      </div>
    </div>
  );
};

// Internal imports needed for the mobile tab bar icons if not present
import { LayoutGrid, Users, CheckSquare, ShieldCheck } from 'lucide-react';

export default MainLayout;

