// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  threshold: number;
  itemsPerPage: number;
  setThreshold: (value: number) => void;
  setItemsPerPage: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [threshold, setThreshold] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(0);

  return (
    <SettingsContext.Provider value={{ threshold, itemsPerPage, setThreshold, setItemsPerPage }}>
      {children}
    </SettingsContext.Provider>
  );
};
