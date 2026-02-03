'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DevModeContextType {
  devMode: boolean;
  setDevMode: (value: boolean) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [devMode, setDevMode] = useState(false);

  return (
    <DevModeContext.Provider value={{ devMode, setDevMode }}>
      <div
        data-dev-mode={devMode ? 'true' : 'false'}
        style={{
          minHeight: '100vh',
          backgroundColor: devMode ? '#0a0a0a' : undefined,
          transition: 'background-color 0.3s ease',
        }}
      >
        {children}
      </div>
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
