'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Palette, Check } from 'lucide-react';

export function ThemeSelector() {
  const { currentTheme, availableThemes, setCurrentTheme } = useTheme();

  return (
    <div className="card-base p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-5 h-5 text-accent-600" />
        <h3 className="text-lg font-semibold text-gray-900">Choose Theme</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setCurrentTheme(theme)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${currentTheme.id === theme.id 
                ? 'border-accent-500 shadow-accent-glow' 
                : 'border-gray-200 hover:border-accent-300 card-hover'
              }
            `}
          >
            {/* Theme Preview Colors */}
            <div className="flex gap-2 mb-3">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.secondary }}
              />
            </div>
            
            {/* Theme Name */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{theme.name}</h4>
                <p className="text-sm text-gray-500 capitalize">{theme.category}</p>
              </div>
              
              {/* Current Theme Indicator */}
              {currentTheme.id === theme.id && (
                <Check className="w-5 h-5 text-accent-600" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Current Theme Info */}
      <div className="mt-6 p-4 card-accent">
        <h4 className="font-medium text-accent-900 mb-2">Active Theme: {currentTheme.name}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-accent-700">Primary:</span>
            <div className="flex items-center gap-2 mt-1">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <code className="text-xs text-accent-800">{currentTheme.colors.primary}</code>
            </div>
          </div>
          <div>
            <span className="text-accent-700">Accent:</span>
            <div className="flex items-center gap-2 mt-1">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
              <code className="text-xs text-accent-800">{currentTheme.colors.accent}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
