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
    <div className="flex min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-screen overflow-y-auto relative">
        {/* Subtle Background Glows (Apple Style) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rc-teal/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-4 md:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;
