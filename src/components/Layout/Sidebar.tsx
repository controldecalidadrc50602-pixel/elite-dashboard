import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  ShieldCheck, 
  Activity,
  BrainCircuit,
  Settings,
  LogOut,
  ChevronRight,
  Monitor,
  Archive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: 'overview' | 'clients' | 'services' | 'tasks' | 'settings' | 'audits' | 'reports' | 'ai-copilot' | 'archive';
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();

  const menuSections = [
    {
      title: 'General',
      items: [
        { id: 'overview', icon: LayoutGrid, label: 'Dashboard' },
        { id: 'morning', icon: Clock, label: 'Mañana Ejecutiva' }
      ]
    },
    {
      title: 'Soporte',
      items: [
        { id: 'audits', icon: ShieldCheck, label: 'CRM Auditorías' },
        { id: 'reports-ia', icon: BrainCircuit, label: 'Reportes IA' }
      ]
    },
    {
      title: 'History',
      items: [
        { id: 'operations', icon: Activity, label: 'Operaciones' }
      ]
    },
    {
      title: 'Analytics',
      items: [
        { id: 'ai-copilot', icon: BrainCircuit, label: 'IA Copilot' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'settings', icon: Settings, label: 'Configuración' }
      ]
    }
  ];

  return (
    <aside className="w-[280px] h-full bg-[var(--bg-side)] border-r border-[var(--border-thin)] flex flex-col py-6 px-4 relative z-50">
      {/* Branding */}
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-rc-teal/10 rounded-2xl flex items-center justify-center text-rc-teal shadow-lg shadow-rc-teal/5">
              <ShieldCheck size={28} />
           </div>
           <div>
              <h2 className="text-sm font-bold text-white leading-none uppercase tracking-tight">RC506 | GESTIÓN DE CAL...</h2>
              <span className="text-[10px] font-medium text-rc-teal uppercase tracking-widest mt-1 block">Elite V3</span>
           </div>
        </div>
      </div>
      
      {/* Navigation Groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{section.title}</h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full h-10 px-4 rounded-xl flex items-center justify-between transition-all group ${
                      isActive 
                        ? 'bg-rc-teal/10 text-rc-teal border border-rc-teal/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? 'text-rc-teal' : 'group-hover:text-white transition-colors'} />
                      <span className={`text-[12px] font-medium tracking-tight ${isActive ? 'text-white' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Bottom Controls */}
      <div className="mt-auto pt-6 space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-inner">
              {user?.email?.substring(0, 2).toUpperCase() || 'BR'}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-white truncate">{user?.email?.split('@')[0] || 'Braily Rodríguez'}</p>
              <p className="text-[10px] font-medium text-rc-teal uppercase tracking-widest">Rc506</p>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex-1 h-10 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-all text-xs">
              <Settings size={14} />
           </button>
           <button 
             onClick={logout}
             className="px-4 h-10 bg-white/5 hover:bg-rose-500/10 border border-white/5 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-rose-500 transition-all text-[11px] font-bold"
           >
              <LogOut size={14} />
              Cerrar Sesión
           </button>
        </div>
      </div>
    </aside>

  );
};

export default Sidebar;
