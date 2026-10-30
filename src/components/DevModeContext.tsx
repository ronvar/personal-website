'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DevModeContextType {
  devMode: boolean;
  setDevMode: (value: boolean) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [devMode, setDevMode] = useState(false);

  // Set on <html> so portaled modals pick up the dev mode tokens too.
  useEffect(() => {
    document.documentElement.dataset.devMode = devMode ? 'true' : 'false';
  }, [devMode]);

  return (
    <DevModeContext.Provider value={{ devMode, setDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
}
