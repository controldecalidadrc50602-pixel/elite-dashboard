import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-primary)]">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rc-teal/20 border-t-rc-teal rounded-full animate-spin" />
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.4em] animate-pulse">Cargando Elite...</span>
       </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar />
      <main className="flex-1 h-full relative overflow-hidden flex flex-col p-8 overflow-y-auto">
        <div className="flex-1 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
