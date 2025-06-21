'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

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
  accentScale: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  isCustom: boolean;
  category?: 'business' | 'custom';
}

export const defaultThemes: CustomTheme[] = [
  // Blue Business Theme - Professional and trustworthy
  {
    id: 'blue-business',
    name: 'Professional Blue',
    colors: {
      primary: '#1e40af',    // Deep blue for navigation/main elements
      secondary: '#2563eb',  // Professional blue for cards and secondary surfaces
      neutral: '#64748b',    // Cool gray for borders and neutral elements
      accent: '#3b82f6',     // Vibrant blue accent for CTAs and highlights
      background: '#ffffff', // Clean white page background
      surface: '#f8fafc',    // Subtle blue tint for card backgrounds
      text: '#0f172a',       // Dark slate for primary text
      textSecondary: '#475569', // Medium slate for secondary text
    },
    accentScale: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    isCustom: false,
    category: 'business',
  },
  
  // Gray Business Theme - Professional and neutral
  {
    id: 'gray-business',
    name: 'Professional Gray',
    colors: {
      primary: '#374151',    // Medium gray for navigation/main elements
      secondary: '#4b5563',  // Darker gray for cards and secondary surfaces
      neutral: '#9ca3af',    // Light gray for borders and neutral elements
      accent: '#6b7280',     // Medium gray accent for highlights
      background: '#ffffff', // Pure white page background
      surface: '#f9fafb',    // Very light gray for card backgrounds
      text: '#111827',       // Very dark gray for primary text
      textSecondary: '#6b7280', // Medium gray for secondary text
    },
    accentScale: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    isCustom: false,
    category: 'business',
  },
  
  // Black Business Theme - Sophisticated and modern
  {
    id: 'black-business',
    name: 'Executive Black',
    colors: {
      primary: '#1e293b',    // Deep slate for navigation/main elements
      secondary: '#334155',  // Medium slate for cards and secondary surfaces
      neutral: '#64748b',    // Neutral slate for borders
      accent: '#475569',     // Slate accent for highlights
      background: '#ffffff', // Clean white page background
      surface: '#f8fafc',    // Very light slate for card backgrounds
      text: '#0f172a',       // Very dark slate for primary text
      textSecondary: '#475569', // Medium slate for secondary text
    },
    accentScale: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    isCustom: false,
    category: 'business',
  },
  
  // Green Business Theme - Growth and sustainability focused
  {
    id: 'green-business',
    name: 'Growth Green',
    colors: {
      primary: '#166534',    // Deep green for navigation/main elements
      secondary: '#15803d',  // Rich green for cards and secondary surfaces
      neutral: '#64748b',    // Cool gray for borders and neutral elements
      accent: '#22c55e',     // Vibrant green accent for CTAs and highlights
      background: '#ffffff', // Clean white page background
      surface: '#f0fdf4',    // Subtle green tint for card backgrounds
      text: '#0f172a',       // Dark text for primary text
      textSecondary: '#475569', // Medium gray for secondary text
    },
    accentScale: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    isCustom: false,
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
  availableThemes: CustomTheme[];
  // Dark/Light mode functionality
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultThemes[0]);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get all available themes (default + custom)
  const availableThemes = [...defaultThemes, ...customThemes];

  // Apply theme to CSS variables with enhanced accent scale and dark mode support
  const applyTheme = useCallback((theme: CustomTheme) => {
    const root = document.documentElement;
    
    // Create dark mode versions of colors
    const getThemeColors = (baseTheme: CustomTheme, isDark: boolean) => {
      if (!isDark) {
        return baseTheme.colors;
      }
      
      // Dark mode color transformations
      return {
        primary: baseTheme.colors.primary,
        secondary: baseTheme.colors.secondary,
        neutral: '#64748b',
        accent: baseTheme.colors.accent,
        background: '#0f172a',       // Dark background
        surface: '#1e293b',          // Dark surface
        text: '#f8fafc',             // Light text
        textSecondary: '#cbd5e1'     // Light secondary text
      };
    };
    
    const themeColors = getThemeColors(theme, isDarkMode);
    
    // Set main theme colors
    root.style.setProperty('--color-primary', themeColors.primary);
    root.style.setProperty('--color-secondary', themeColors.secondary);
    root.style.setProperty('--color-neutral', themeColors.neutral);
    root.style.setProperty('--color-accent', themeColors.accent);
    root.style.setProperty('--color-background', themeColors.background);
    root.style.setProperty('--color-surface', themeColors.surface);
    root.style.setProperty('--color-text', themeColors.text);
    root.style.setProperty('--color-text-secondary', themeColors.textSecondary);
    
    // Set theme- prefixed variables for navigation components
    root.style.setProperty('--theme-primary', themeColors.primary);
    root.style.setProperty('--theme-secondary', themeColors.secondary);
    root.style.setProperty('--theme-neutral', themeColors.neutral);
    root.style.setProperty('--theme-accent', themeColors.accent);
    root.style.setProperty('--theme-background', themeColors.background);
    root.style.setProperty('--theme-surface', themeColors.surface);
    root.style.setProperty('--theme-text', themeColors.text);
    root.style.setProperty('--theme-text-secondary', themeColors.textSecondary);
    
    // Set enhanced accent scale
    Object.entries(theme.accentScale).forEach(([key, value]) => {
      root.style.setProperty(`--accent-${key}`, value);
    });
    
    // Set primary scale based on primary color (simplified scale)
    const primary = theme.colors.primary;
    root.style.setProperty('--primary-50', theme.colors.surface);
    root.style.setProperty('--primary-100', theme.colors.surface);
    root.style.setProperty('--primary-200', theme.colors.neutral + '20');
    root.style.setProperty('--primary-300', theme.colors.neutral + '40');
    root.style.setProperty('--primary-400', theme.colors.neutral);
    root.style.setProperty('--primary-500', primary);
    root.style.setProperty('--primary-600', primary);
    root.style.setProperty('--primary-700', primary);
    root.style.setProperty('--primary-800', primary);
    root.style.setProperty('--primary-900', theme.colors.text);
    root.style.setProperty('--primary-950', theme.colors.text);
    
    // Set secondary scale based on secondary color
    const secondary = theme.colors.secondary;
    root.style.setProperty('--secondary-50', theme.colors.surface);
    root.style.setProperty('--secondary-100', theme.colors.surface);
    root.style.setProperty('--secondary-200', theme.colors.neutral + '20');
    root.style.setProperty('--secondary-300', theme.colors.neutral + '40');
    root.style.setProperty('--secondary-400', theme.colors.neutral);    root.style.setProperty('--secondary-500', secondary);
    root.style.setProperty('--secondary-600', secondary);
    root.style.setProperty('--secondary-700', secondary);
    root.style.setProperty('--secondary-800', secondary);
    root.style.setProperty('--secondary-900', theme.colors.text);
    root.style.setProperty('--secondary-950', theme.colors.text);
  }, [isDarkMode]);

  // Load saved theme and custom themes on mount
  useEffect(() => {
    let loadedCustomThemes: CustomTheme[] = [];
    
    try {
      const savedCustomThemes = localStorage.getItem('customThemes');
      if (savedCustomThemes) {
        loadedCustomThemes = JSON.parse(savedCustomThemes);
        setCustomThemes(loadedCustomThemes);
      }

      // Load dark mode preference
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode) {
        const isDark = JSON.parse(savedDarkMode);
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
      } else {
        // Check system preference
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemDark);
        document.documentElement.classList.toggle('dark', systemDark);
      }

      const savedThemeId = localStorage.getItem('currentThemeId');
      if (savedThemeId) {
        const allThemes = [...defaultThemes, ...loadedCustomThemes];
        const savedTheme = allThemes.find(t => t.id === savedThemeId);
        if (savedTheme) {
          setCurrentTheme(savedTheme);
          applyTheme(savedTheme);
          return;
        }
      }

      // Fallback to default theme
      applyTheme(defaultThemes[0]);
    } catch (error) {
      console.error('Error loading themes:', error);
      // Fallback to default theme
      applyTheme(defaultThemes[0]);
    }
  }, [applyTheme]);

  // Reapply theme when dark mode changes
  useEffect(() => {
    if (currentTheme) {
      applyTheme(currentTheme);
    }
  }, [isDarkMode, currentTheme, applyTheme]);
  const handleSetCurrentTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('currentThemeId', theme.id);
  };
  // Dark mode functions
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    // Reapply current theme with new dark mode setting
    applyTheme(currentTheme);
  };
  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    // Reapply current theme with new dark mode setting
    applyTheme(currentTheme);
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
    availableThemes,
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
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
