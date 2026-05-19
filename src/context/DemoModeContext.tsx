import React, { createContext, useContext, useState } from 'react';

interface DemoModeContextType {
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    return localStorage.getItem('elite_demo_mode') !== 'false';
  });

  const setDemoMode = (val: boolean) => {
    setDemoModeState(val);
    localStorage.setItem('elite_demo_mode', String(val));
    
    // Dispatch custom event to notify external integrations or services if necessary
    const event = new CustomEvent('elite-demo-mode-changed', { detail: { demoMode: val } });
    document.dispatchEvent(event);
  };

  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) throw new Error('useDemoMode must be used within a DemoModeProvider');
  return context;
};
