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
    <div className="flex h-screen app-container text-white overflow-hidden font-inter bg-[var(--bg-main)]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative scrollbar-hide bg-[var(--bg-main)]">
        <div className="p-8 max-w-[1700px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
