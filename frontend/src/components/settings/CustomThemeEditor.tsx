'use client';

import React, { useState } from 'react';
import { CustomTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Save, X, Palette, Eye } from 'lucide-react';

interface CustomThemeEditorProps {
  theme?: CustomTheme;
  onSave: (theme: CustomTheme) => void;
  onCancel: () => void;
}

export default function CustomThemeEditor({ theme, onSave, onCancel }: CustomThemeEditorProps) {
  const [themeName, setThemeName] = useState(theme?.name || 'New Theme');  const [colors, setColors] = useState(theme?.colors || {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    neutral: '#64748B',
    accent: '#0891B2',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    textSecondary: '#64748B'
  });
  
  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };
  const handleSave = () => {
    const newTheme: CustomTheme = {
      id: theme?.id || `custom-${Date.now()}`,
      name: themeName,
      colors,
      accentScale: {
        50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
        500: colors.accent, 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617'
      },
      isCustom: true,
      category: 'custom'
    };
    onSave(newTheme);
  };
  const colorFields = [
    { key: 'primary' as const, label: 'Primary Color', description: 'Main brand color for navigation and buttons' },
    { key: 'secondary' as const, label: 'Secondary Color', description: 'Accent color for highlights and links' },
    { key: 'neutral' as const, label: 'Neutral Color', description: 'Text and border colors' },
    { key: 'accent' as const, label: 'Accent Color', description: 'Headlines, highlights, and active states' },
    { key: 'background' as const, label: 'Background Color', description: 'Page background' },
    { key: 'surface' as const, label: 'Surface Color', description: 'Card and component backgrounds' },
    { key: 'text' as const, label: 'Text Color', description: 'Primary text color' },
    { key: 'textSecondary' as const, label: 'Secondary Text', description: 'Secondary text and labels' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <h3 className="text-lg font-semibold">
                {theme ? 'Edit Theme' : 'Create New Theme'}
              </h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme Name
            </label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter theme name"
            />
          </div>

          {/* Color Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorFields.map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <div className="flex items-center gap-2">                  <input
                    type="color"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    title={`Select ${label}`}
                    aria-label={`Select ${label}`}
                  />
                  <input
                    type="text"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            ))}
          </div>          {/* Preview Section */}
          {previewMode && (
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium" style={{ color: colors.text }}>Theme Preview</h4>
              <div 
                className="p-4 rounded-lg space-y-3" 
                style={{ backgroundColor: colors.background }}
              >
                <div 
                  className="p-3 rounded border" 
                  style={{ backgroundColor: colors.surface, borderColor: colors.neutral }}
                >
                  <h5 
                    className="font-semibold mb-2" 
                    style={{ color: colors.accent }}
                  >
                    Sample Card Title
                  </h5>
                  <p 
                    className="text-sm mb-3" 
                    style={{ color: colors.textSecondary }}
                  >
                    This is how your theme will look with sample content and secondary text.
                  </p>
                  <p 
                    className="text-sm mb-3" 
                    style={{ color: colors.text }}
                  >
                    Primary text content uses the main text color for readability.
                  </p>
                  <div className="flex gap-2">
                    <div 
                      className="px-3 py-1 rounded text-sm text-white" 
                      style={{ backgroundColor: colors.primary }}
                    >
                      Primary Button
                    </div>
                    <div 
                      className="px-3 py-1 rounded text-sm text-white" 
                      style={{ backgroundColor: colors.secondary }}
                    >
                      Secondary Button
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Theme
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
