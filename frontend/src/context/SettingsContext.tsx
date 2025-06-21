'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserPreferences {
  // UI/UX Preferences
  mobileMenuLayout: 'list' | 'grid';
  sidebarCollapsed: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
  highContrastMode: boolean;
  largeText: boolean;
  
  // Account/Regional Settings
  language: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  
  // Notification Preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  loadUpdateNotifications: boolean;
  maintenanceAlertNotifications: boolean;
  driverCheckinNotifications: boolean;
  emergencyAlertNotifications: boolean;
  
  // Security Settings
  sessionTimeout: string;
  twoFactorEnabled: boolean;
  
  // Data Management Settings
  autoBackup: boolean;
  dataRetention: string;
}

export const defaultPreferences: UserPreferences = {
  // UI/UX Preferences
  mobileMenuLayout: 'list',
  sidebarCollapsed: false,
  showTooltips: true,
  animationsEnabled: true,
  highContrastMode: false,
  largeText: false,
  
  // Account/Regional Settings
  language: 'en-US',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12',
  timezone: 'America/New_York',
  
  // Notification Preferences
  emailNotifications: true,
  pushNotifications: true,
  soundEnabled: true,
  loadUpdateNotifications: true,
  maintenanceAlertNotifications: true,
  driverCheckinNotifications: false,
  emergencyAlertNotifications: true,
  
  // Security Settings
  sessionTimeout: '1 hour',
  twoFactorEnabled: false,
  
  // Data Management Settings
  autoBackup: true,
  dataRetention: '2 Years',
};

interface SettingsContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('launch-user-preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('launch-user-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2);
  };

  const importPreferences = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      // Validate that all required keys exist
      const validatedPreferences = { ...defaultPreferences, ...parsed };
      setPreferences(validatedPreferences);
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{
      preferences,
      updatePreferences,
      resetPreferences,
      exportPreferences,
      importPreferences,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
