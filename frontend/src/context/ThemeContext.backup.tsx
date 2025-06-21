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
    },
    isCustom: false,
    isDark: false,
    category: 'business',
  },
  // Launch Dark Theme  
  {
    id: 'launch-dark',
    name: 'Launch Dark',
    colors: {
      primary: '#0f172a',    // Slate-900 for navigation/main elements
      secondary: '#1e293b',  // Slate-800 for cards and secondary surfaces  
      neutral: '#64748b',    // Slate-500 for borders and neutral elements
      accent: '#0891b2',     // Cyan-600 for highlights, buttons, accents
      background: '#020617', // Slate-950 dark page background
      surface: '#0f172a',    // Slate-900 for card backgrounds
      text: '#f8fafc',       // Slate-50 for primary text
      textSecondary: '#94a3b8', // Slate-400 for secondary text
    },
    isCustom: false,
    isDark: true,
    category: 'business',  },
];
  
  // Finance Indigo Light & Dark
  {
    id: 'finance-indigo-light',
    name: 'Finance Indigo',
    colors: {
      primary: '#312e81',    // Indigo-800
      secondary: '#6366f1',  // Indigo-500
      neutral: '#6b7280',    // Gray-500
      accent: '#8b5cf6',     // Violet-500
      background: '#ffffff', // White
      surface: '#faf5ff',    // Violet-50 for subtle purple tint
      text: '#312e81',       // Dark indigo text
      textSecondary: '#6b7280', // Gray-500
    },
    isCustom: false,
    isDark: false,
    category: 'business',
  },
  {
    id: 'finance-indigo-dark',
    name: 'Finance Indigo (Dark)',
    colors: {
      primary: '#312e81',    // Indigo-800 for navigation
      secondary: '#6366f1',  // Indigo-500 for accents
      neutral: '#a1a1aa',    // Zinc-400 for borders
      accent: '#a78bfa',     // Violet-400 for headings and highlights
      background: '#18181b', // Zinc-900 page background
      surface: '#27272a',    // Zinc-800 for cards (lighter than background)
      text: '#faf5ff',       // Light violet tint (violet-50)
      textSecondary: '#a1a1aa', // Medium gray (zinc-400)
    },
    isCustom: false,
    isDark: true,
    category: 'business',
  },
  
  // ===== MODERN THEMES =====
  
  // Modern Orange Light & Dark
  {
    id: 'modern-orange-light',
    name: 'Modern Orange',
    colors: {
      primary: '#ea580c',    // Orange-600
      secondary: '#f97316',  // Orange-500
      neutral: '#78716c',    // Stone-500
      accent: '#fb923c',     // Orange-400
      background: '#ffffff', // White
      surface: '#fff7ed',    // Orange-50 for warm card backgrounds
      text: '#9a3412',       // Orange-800 for dark text
      textSecondary: '#78716c', // Stone-500
    },
    isCustom: false,
    isDark: false,
    category: 'modern',
  },
  {
    id: 'modern-orange-dark',
    name: 'Modern Orange (Dark)',
    colors: {
      primary: '#ea580c',    // Orange-600 for navigation
      secondary: '#f97316',  // Orange-500 for accents
      neutral: '#a8a29e',    // Stone-400 for borders
      accent: '#fed7aa',     // Orange-200 for headings and highlights
      background: '#1c1917', // Stone-900 page background
      surface: '#292524',    // Stone-800 for cards (lighter than background)
      text: '#fff7ed',       // Light orange tint (orange-50)
      textSecondary: '#a8a29e', // Stone-400
    },
    isCustom: false,
    isDark: true,
    category: 'modern',
  },
  
  // Tech Purple Light & Dark
  {
    id: 'tech-purple-light',
    name: 'Tech Purple',
    colors: {
      primary: '#7c3aed',    // Violet-600
      secondary: '#a855f7',  // Purple-500
      neutral: '#6b7280',    // Gray-500
      accent: '#c084fc',     // Purple-400
      background: '#ffffff', // White
      surface: '#faf5ff',    // Violet-50 for subtle purple card backgrounds
      text: '#581c87',       // Purple-900 for dark text
      textSecondary: '#6b7280', // Gray-500
    },
    isCustom: false,
    isDark: false,
    category: 'modern',
  },
  {
    id: 'tech-purple-dark',
    name: 'Tech Purple (Dark)',
    colors: {
      primary: '#7c3aed',    // Violet-600 for navigation
      secondary: '#a855f7',  // Purple-500 for accents
      neutral: '#9ca3af',    // Gray-400 for borders
      accent: '#ddd6fe',     // Violet-200 for headings and highlights
      background: '#111827', // Gray-900 page background
      surface: '#1f2937',    // Gray-800 for cards (lighter than background)
      text: '#f5f3ff',       // Light violet tint (violet-50)
      textSecondary: '#9ca3af', // Gray-400
    },
    isCustom: false,
    isDark: true,
    category: 'modern',
  },
  
  // Cyber Teal Light & Dark
  {
    id: 'cyber-teal-light',
    name: 'Cyber Teal',
    colors: {
      primary: '#0d9488',    // Teal-600
      secondary: '#14b8a6',  // Teal-500
      neutral: '#6b7280',    // Gray-500
      accent: '#2dd4bf',     // Teal-400
      background: '#ffffff', // White
      surface: '#f0fdfa',    // Teal-50 for subtle teal card backgrounds
      text: '#134e4a',       // Teal-900 for dark text
      textSecondary: '#6b7280', // Gray-500
    },
    isCustom: false,
    isDark: false,
    category: 'modern',
  },
  {
    id: 'cyber-teal-dark',
    name: 'Cyber Teal (Dark)',
    colors: {
      primary: '#0d9488',    // Teal-600 for navigation
      secondary: '#14b8a6',  // Teal-500 for accents
      neutral: '#9ca3af',    // Gray-400 for borders
      accent: '#5eead4',     // Teal-300 for headings and highlights
      background: '#0f172a', // Slate-900 page background
      surface: '#1e293b',    // Slate-800 for cards (lighter than background)
      text: '#f0fdfa',       // Light teal tint (teal-50)
      textSecondary: '#9ca3af', // Gray-400
    },
    isCustom: false,
    isDark: true,
    category: 'modern',
  },
  
  // ===== CREATIVE THEMES =====
  
  // Monokai Theme (Dark coding theme inspired)
  {
    id: 'monokai-dark',
    name: 'Monokai',
    colors: {
      primary: '#272822',    // Monokai background dark
      secondary: '#3e3d32',  // Lighter monokai variant
      neutral: '#75715e',    // Monokai comment gray
      accent: '#a6e22e',     // Monokai green for highlights
      background: '#1e1f1c', // Very dark monokai background
      surface: '#2f3129',    // Slightly lighter for cards
      text: '#f8f8f2',       // Monokai foreground (light)
      textSecondary: '#75715e', // Monokai comment color
    },
    isCustom: false,
    isDark: true,
    category: 'creative',
  },
  
  // Monokai Light (for fun contrast)
  {
    id: 'monokai-light',
    name: 'Monokai Light',
    colors: {
      primary: '#272822',    // Dark monokai for contrast
      secondary: '#3e3d32',  // Monokai accent
      neutral: '#75715e',    // Monokai comment
      accent: '#a6e22e',     // Monokai green
      background: '#fafafa', // Light background
      surface: '#f5f5f5',    // Slightly darker for cards
      text: '#272822',       // Dark monokai text
      textSecondary: '#75715e', // Monokai comment for secondary
    },
    isCustom: false,
    isDark: false,
    category: 'creative',
  },
  
  // Sunset Gradient Theme
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    colors: {
      primary: '#dc2626',    // Red-600
      secondary: '#ea580c',  // Orange-600
      neutral: '#78716c',    // Stone-500
      accent: '#f59e0b',     // Amber-500
      background: '#fffbeb', // Amber-50
      surface: '#fff7ed',    // Orange-50 for warm cards
      text: '#7c2d12',       // Orange-900
      textSecondary: '#78716c', // Stone-500
    },
    isCustom: false,
    isDark: false,
    category: 'creative',
  },
  
  // Ocean Deep Theme
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    colors: {
      primary: '#1e3a8a',    // Blue-800
      secondary: '#1e40af',  // Blue-700
      neutral: '#64748b',    // Slate-500
      accent: '#06b6d4',     // Cyan-500
      background: '#0c1426', // Very dark blue
      surface: '#1e293b',    // Slate-800 for cards
      text: '#e0f2fe',       // Cyan-50
      textSecondary: '#94a3b8', // Slate-400
    },
    isCustom: false,
    isDark: true,
    category: 'creative',
  },
];

interface ThemeContextType {
  currentTheme: CustomTheme;
  customThemes: CustomTheme[];
  setCurrentTheme: (theme: CustomTheme) => void;
  addCustomTheme: (theme: Omit<CustomTheme, 'id' | 'isCustom'>) => CustomTheme;
  updateCustomTheme: (id: string, theme: Partial<CustomTheme>) => void;
  deleteCustomTheme: (id: string) => void;
  applyTheme: (theme: CustomTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultThemes[0]);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  // Load saved theme and custom themes from localStorage
  useEffect(() => {
    const savedThemeId = localStorage.getItem('launch-theme-id');
    const savedCustomThemes = localStorage.getItem('launch-custom-themes');

    let loadedCustomThemes: CustomTheme[] = [];
    if (savedCustomThemes) {
      try {
        loadedCustomThemes = JSON.parse(savedCustomThemes);
        setCustomThemes(loadedCustomThemes);
      } catch (error) {
        console.error('Failed to parse custom themes:', error);
      }
    }

    if (savedThemeId) {
      const allThemes = [...defaultThemes, ...loadedCustomThemes];
      const foundTheme = allThemes.find(theme => theme.id === savedThemeId);
      if (foundTheme) {
        setCurrentTheme(foundTheme);
        applyTheme(foundTheme);
      } else {
        // Theme not found, use default
        applyTheme(defaultThemes[0]);
      }
    } else {
      // Apply default theme
      applyTheme(defaultThemes[0]);
    }
  }, []);

  // Save current theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('launch-theme-id', currentTheme.id);
    localStorage.setItem('launch-custom-themes', JSON.stringify(customThemes));
  }, [currentTheme, customThemes]);

  const applyTheme = (theme: CustomTheme) => {
    const root = document.documentElement;
    
    // Debug logging
    console.log('Applying theme:', theme.name, theme.colors);
    
    // Update CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-neutral', theme.colors.neutral);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    
    // Also set theme-specific variables for navigation and components
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-neutral', theme.colors.neutral);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);

    // Update Tailwind CSS custom properties for our theme colors
    root.style.setProperty('--launch-navy', theme.colors.primary);
    root.style.setProperty('--launch-teal', theme.colors.secondary);
    root.style.setProperty('--launch-gray', theme.colors.neutral);
    root.style.setProperty('--launch-mint', theme.colors.accent);
    root.style.setProperty('--launch-white', theme.colors.background);
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', theme.isDark ? 'dark' : 'light');
  };

  const handleSetCurrentTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const addCustomTheme = (themeData: Omit<CustomTheme, 'id' | 'isCustom'>): CustomTheme => {
    const newTheme: CustomTheme = {
      ...themeData,
      id: `custom-${Date.now()}`,
      isCustom: true,
      category: 'custom',
    };

    setCustomThemes(prev => [...prev, newTheme]);
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
