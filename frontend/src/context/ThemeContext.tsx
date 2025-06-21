'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;    // Main brand color - navigation, headers, primary buttons
    secondary: string;  // Secondary accent color - active states, links, highlights
    neutral: string;    // Neutral color for regular text and borders
    accent: string;     // Accent color - headings, highlights, active states
    background: string; // Page background color
    surface: string;    // Card/surface background color
    text: string;       // Primary text color
    textSecondary: string; // Secondary text color
  };
  isCustom: boolean;
  isDark?: boolean;
  category?: 'business' | 'modern' | 'creative' | 'custom';
}

export const defaultThemes: CustomTheme[] = [
  // Launch Light Theme
  {
    id: 'launch-light',
    name: 'Launch Light',
    colors: {
      primary: '#0f172a',    // Slate-900 for navigation/main elements
      secondary: '#1e293b',  // Slate-800 for cards and secondary surfaces
      neutral: '#64748b',    // Slate-500 for borders and neutral elements
      accent: '#0891b2',     // Cyan-600 for highlights, buttons, accents
      background: '#ffffff', // White page background
      surface: '#f8fafc',    // Slate-50 for card backgrounds
      text: '#0f172a',       // Slate-900 for primary text
      textSecondary: '#64748b', // Slate-500 for secondary text
    },    isCustom: false,
    isDark: false,
    category: 'business',
  },
  // Launch Dark Theme  
  {
    id: 'launch-dark',
    name: 'Launch Dark',
    colors: {
      primary: '#1e293b',    // Slate-800 for navigation/main elements (lighter for visibility)
      secondary: '#334155',  // Slate-700 for cards and secondary surfaces  
      neutral: '#64748b',    // Slate-500 for borders and neutral elements
      accent: '#22d3ee',     // Cyan-400 for highlights, buttons, accents (brighter for dark mode)
      background: '#0f172a', // Slate-900 dark page background (not as extreme)
      surface: '#1e293b',    // Slate-800 for card backgrounds (good contrast with background)
      text: '#f1f5f9',       // Slate-100 for primary text (high contrast)
      textSecondary: '#cbd5e1', // Slate-300 for secondary text (better visibility)
    },
    isCustom: false,
    isDark: true,
    category: 'business',
  },
];

interface ThemeContextType {
  currentTheme: CustomTheme;
  customThemes: CustomTheme[];
  setCurrentTheme: (theme: CustomTheme) => void;
  addCustomTheme: (theme: Omit<CustomTheme, 'id' | 'isCustom'>) => CustomTheme;
  updateCustomTheme: (id: string, updates: Partial<CustomTheme>) => void;
  deleteCustomTheme: (id: string) => void;
  applyTheme: (theme: CustomTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultThemes[0]);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  // Load saved theme and custom themes on mount
  useEffect(() => {
    let loadedCustomThemes: CustomTheme[] = [];
    
    try {
      const savedCustomThemes = localStorage.getItem('customThemes');
      if (savedCustomThemes) {
        loadedCustomThemes = JSON.parse(savedCustomThemes);
        setCustomThemes(loadedCustomThemes);
      }

      const savedThemeId = localStorage.getItem('currentThemeId');
      if (savedThemeId) {
        const allThemes = [...defaultThemes, ...loadedCustomThemes];
        const savedTheme = allThemes.find(t => t.id === savedThemeId);
        if (savedTheme) {
          setCurrentTheme(savedTheme);
          applyTheme(savedTheme);
        } else {
          // Fallback to first default theme if saved theme not found
          applyTheme(defaultThemes[0]);
        }
      } else {
        // Apply default theme
        applyTheme(defaultThemes[0]);
      }
    } catch (error) {
      console.error('Error loading themes:', error);
      // Fallback to default theme
      applyTheme(defaultThemes[0]);
    }
  }, []);
  // Apply theme to CSS variables
  const applyTheme = (theme: CustomTheme) => {
    const root = document.documentElement;
    
    // Set both naming conventions for compatibility
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-neutral', theme.colors.neutral);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    
    // Set theme- prefixed variables for navigation components
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-neutral', theme.colors.neutral);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    
    // Set dark mode class
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSetCurrentTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('currentThemeId', theme.id);
  };

  const addCustomTheme = (themeData: Omit<CustomTheme, 'id' | 'isCustom'>): CustomTheme => {
    const newTheme: CustomTheme = {
      ...themeData,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };

    const updatedCustomThemes = [...customThemes, newTheme];
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));

    return newTheme;
  };

  const updateCustomTheme = (id: string, updates: Partial<CustomTheme>) => {
    setCustomThemes(prev =>
      prev.map(theme =>
        theme.id === id ? { ...theme, ...updates } : theme
      )
    );

    // If updating the current theme, apply it
    if (currentTheme.id === id) {
      const updatedTheme = { ...currentTheme, ...updates };
      setCurrentTheme(updatedTheme);
      applyTheme(updatedTheme);
    }
  };

  const deleteCustomTheme = (id: string) => {
    setCustomThemes(prev => prev.filter(theme => theme.id !== id));

    // If deleting the current theme, switch to default
    if (currentTheme.id === id) {
      handleSetCurrentTheme(defaultThemes[0]);
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    customThemes,
    setCurrentTheme: handleSetCurrentTheme,
    addCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}