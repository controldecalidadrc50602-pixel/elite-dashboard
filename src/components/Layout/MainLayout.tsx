import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from '../../pages/Dashboard';
import { LayoutGrid, Users, CheckSquare, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'status' | 'archive'>('overview');

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rc-teal/20 border-t-rc-teal rounded-full animate-spin" />
          <span className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] animate-pulse">Initializing Elite V3.5</span>
       </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen w-full bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidebar Compacto (10% menos - original era ~280px, ahora 240px) */}
      <div className="hidden md:block w-[240px] h-full flex-shrink-0 z-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="flex-1 h-full relative overflow-hidden">
        {/* Universal Backdrop Blur for the whole content area */}
        <div className="absolute inset-0 bg-gradient-to-br from-rc-teal/[0.01] to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="h-full w-full"
          >
            <Dashboard activeTab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-4 z-[90]">
         {[
           { id: 'overview', icon: LayoutGrid, label: 'Audit' },
           { id: 'clients', icon: Users, label: 'Cartera' },
           { id: 'status', icon: ShieldCheck, label: 'Reportes' },
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

export default MainLayout;
