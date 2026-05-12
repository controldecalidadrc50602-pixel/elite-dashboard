import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  ShieldCheck, 
  Activity,
  FileBarChart,
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
  setActiveTab: (tab: 'overview' | 'clients' | 'services' | 'tasks' | 'settings' | 'audits' | 'reports' | 'ai-copilot' | 'archive') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();

  const menuSections = [
    {
      title: 'General',
      items: [
        { id: 'overview', icon: LayoutGrid, label: 'Dashboard' }
      ]
    },
    {
      title: 'Cartera',
      items: [
        { id: 'clients', icon: Users, label: 'Clientes' },
        { id: 'services', icon: Monitor, label: 'Servicios' },
        { id: 'archive', icon: Archive, label: 'Bóveda' }
      ]
    },
    {
      title: 'Operaciones',
      items: [
        { id: 'audits', icon: Activity, label: 'Auditorías' },
        { id: 'reports', icon: FileBarChart, label: 'Reportes IA' }
      ]
    },
    {
      title: 'Analytics',
      items: [
        { id: 'ai-copilot', icon: BrainCircuit, label: 'IA Copilot' }
      ]
    }
  ];

  return (
    <aside className="w-[240px] h-full bg-[#0a0a0c] border-r border-white/5 flex flex-col py-8 px-4 relative z-50 overflow-y-auto scrollbar-hide">
      {/* Branding */}
      <div className="px-4 mb-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-2xl shadow-rc-teal/20">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h2 className="text-sm font-black text-white leading-none uppercase tracking-tighter">RC506 | GESTIÓN</h2>
              <span className="text-[9px] font-black text-rc-teal uppercase tracking-[0.2em]">Elite V3.6</span>
           </div>
        </div>
      </div>
      
      {/* Navigation Groups */}
      <nav className="flex-1 space-y-8">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full h-11 px-4 rounded-xl flex items-center justify-between transition-all group ${
                      isActive 
                        ? 'bg-rc-teal/10 text-rc-teal' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-rc-teal' : 'group-hover:text-white transition-colors'} />
                      <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && <ChevronRight size={14} className="opacity-50" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Settings */}
      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        <button 
          onClick={() => setActiveTab('settings' as any)}
          className="w-full h-11 px-4 rounded-xl flex items-center gap-3 text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={18} />
          <span className="text-[11px] font-bold tracking-tight">Configuración</span>
        </button>

        <div className="px-4 py-4 bg-white/[0.02] rounded-2xl flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-rc-teal/20 flex items-center justify-center text-rc-teal font-black text-xs uppercase">
              {user?.email?.substring(0, 2) || 'AD'}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white truncate uppercase">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-[8px] font-bold text-rc-teal uppercase">RC506 Specialist</p>
           </div>
           <button onClick={logout} className="text-slate-600 hover:text-rose-500 transition-colors">
              <LogOut size={16} />
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
