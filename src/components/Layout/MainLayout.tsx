import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0B0E14]">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rc-teal/20 border-t-rc-teal rounded-full animate-spin" />
          <span className="text-[10px] font-medium text-rc-teal uppercase tracking-[0.4em] opacity-40 animate-pulse">Initializing HC V4</span>
       </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen w-full bg-[#0B0E14] overflow-hidden">
      {/* Sidebar Compacto */}
      <div className="hidden md:block w-[88px] h-full flex-shrink-0 z-50">
        <Sidebar />
      </div>

      <main className="flex-1 h-full relative overflow-hidden">
        {/* Universal Backdrop Blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-rc-teal/[0.02] to-transparent pointer-events-none" />
        
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
