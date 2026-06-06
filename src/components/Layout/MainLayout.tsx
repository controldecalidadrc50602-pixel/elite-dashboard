import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-xs font-medium text-blue-500 uppercase tracking-widest animate-pulse">Cargando Elite...</span>
       </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
