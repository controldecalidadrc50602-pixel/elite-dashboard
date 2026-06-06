import React from 'react';
import { Activity, LayoutDashboard, LineChart, Target, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Resumen de Gestión' },
    { id: 'analitica', path: '/trimestre', icon: LineChart, label: 'Analítica Avanzada' },
    { id: 'pareto', path: '/archive', icon: Target, label: 'Análisis Pareto' },
    { id: 'config', path: '/config', icon: Settings, label: 'Configuración SLA' },
  ];

  return (
    <aside className="w-[280px] h-full bg-[#1E293B] text-white flex flex-col shadow-xl z-20 flex-shrink-0">
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
          <Activity size={24} color="white" />
        </div>
        <h2 className="font-bold text-lg leading-tight tracking-tight">
          Elite Dashboard<br />
          <span className="text-blue-400 font-medium">Rc506</span>
        </h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 translate-x-1'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 flex flex-col gap-4">
        <div className="text-xs text-slate-400 font-mono tracking-wider space-y-1">
          <p>Motor: WebSockets & AI</p>
          <p className="text-green-400 font-semibold animate-pulse">LIVE DATA</p>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
