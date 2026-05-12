import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from '../../pages/Dashboard';
import ServiceMonitor from '../../pages/ServiceMonitor';
import ArchiveVault from '../../pages/ArchiveVault';
import AiCopilot from '../../pages/AiCopilot';

type TabType = 'overview' | 'clients' | 'services' | 'tasks' | 'settings' | 'audits' | 'reports' | 'ai-copilot' | 'archive';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="p-10 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'services' ? (
                <ServiceMonitor />
              ) : activeTab === 'archive' ? (
                <ArchiveVault />
              ) : activeTab === 'ai-copilot' ? (
                <AiCopilot />
              ) : (
                <Dashboard activeTab={activeTab as any} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
