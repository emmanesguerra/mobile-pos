// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveSetting, getSettingValue } from '@/src/database/settings';
import { useSQLiteContext } from 'expo-sqlite';

interface SettingsContextType {
  threshold: number;
  itemsPerPage: number;
  productRefresh: boolean;
  setThreshold: (value: number) => void;
  setItemsPerPage: (value: number) => void;
  setProductRefresh: (value: boolean) => void;
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
  const database = useSQLiteContext();
  const [threshold, setThreshold] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(0);
  const [productRefresh, setProductRefresh] = useState<boolean>(false); 

  // Function to fetch the current setting values
  const fetchSettings = async () => {
    const rows = await getSettingValue(database, 'tableRows');
    const thresholdValue = await getSettingValue(database, 'lowStockThreshold');

    if (rows) setItemsPerPage(parseInt(rows, 10));
    if (thresholdValue) setThreshold(parseInt(thresholdValue, 10));
  };

  // Fetch settings when the component mounts
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ threshold, itemsPerPage, productRefresh, setThreshold, setItemsPerPage, setProductRefresh }}>
      {children}
    </SettingsContext.Provider>
  );
};
