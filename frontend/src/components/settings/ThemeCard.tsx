'use client';

import React from 'react';
import { CustomTheme } from '@/context/ThemeContext';
import { Check, Edit3, Trash2, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeCardProps {
  theme: CustomTheme;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  showActions?: boolean;
}

export function ThemeCard({ 
  theme, 
  isActive, 
  onSelect, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onExport, 
  showActions = true 
}: ThemeCardProps) {
  return (    <div 
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all hover:shadow-lg',
        'border rounded-lg group bg-[var(--color-surface)]',
        isActive 
          ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30 shadow-md' 
          : 'border-[var(--color-neutral)]/10 hover:border-[var(--color-accent)]/30'
      )}
      onClick={onSelect}
    >{/* Theme Preview Demo */}
      <div 
        className="h-32 relative"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Header Bar */}
        <div 
          className="h-8 flex items-center px-3"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div className="text-xs font-medium text-white">Launch TMS</div>
          </div>
          <div className="ml-auto">
            {isActive && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-3 space-y-2">          {/* Card */}
          <div 
            className="rounded border p-2 space-y-1"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.neutral + '40'
            }}
          >
            <div 
              className="h-2 w-16 rounded"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <div 
              className="h-1 w-12 rounded"
              style={{ backgroundColor: theme.colors.textSecondary }}
            />
          </div>
          
          {/* Button */}
          <div 
            className="h-6 w-14 rounded text-xs flex items-center justify-center"
            style={{ backgroundColor: theme.colors.secondary }}
          >
            <span className="text-white text-[10px]">Button</span>
          </div>
          
          {/* Accent Elements */}
          <div className="flex space-x-1">
            <div 
              className="w-2 h-2 rounded"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <div 
              className="w-2 h-2 rounded"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <div 
              className="w-2 h-2 rounded"
              style={{ backgroundColor: theme.colors.accent + '60' }}
            />
          </div>
        </div>
      </div>      {/* Theme Info */}
      <div className="p-3 bg-[var(--color-surface)] border-t border-[var(--color-neutral)]/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm text-[var(--color-primary)]">
            {theme.name}
          </h3>          <div className="flex gap-1">
            {theme.category && (
              <span className="text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-0.5 rounded capitalize">
                {theme.category}
              </span>
            )}
            {theme.isCustom && (
              <span className="text-xs bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] px-2 py-0.5 rounded">
                Custom
              </span>
            )}
          </div>
        </div>
        
        {/* Color Palette */}
        <div className="flex space-x-1 mb-2">
          <div 
            className="w-4 h-4 rounded border border-white/50"
            style={{ backgroundColor: theme.colors.primary }}
            title={`Primary: ${theme.colors.primary}`}
          />
          <div 
            className="w-4 h-4 rounded border border-white/50"
            style={{ backgroundColor: theme.colors.secondary }}
            title={`Secondary: ${theme.colors.secondary}`}
          />
          <div 
            className="w-4 h-4 rounded border border-white/50"
            style={{ backgroundColor: theme.colors.neutral }}
            title={`Neutral: ${theme.colors.neutral}`}
          />
          <div 
            className="w-4 h-4 rounded border border-white/50"
            style={{ backgroundColor: theme.colors.accent }}
            title={`Accent: ${theme.colors.accent}`}
          />
          <div 
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: theme.colors.background }}
            title={`Background: ${theme.colors.background}`}
          />
        </div>        <p className="text-xs text-[var(--color-neutral)] line-clamp-2">
          Professional theme optimized for transportation management with excellent contrast and accessibility.
        </p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1 bg-[var(--color-background)]/95 backdrop-blur-sm rounded p-1 border border-[var(--color-neutral)]/10">
            {onDuplicate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="p-1 hover:bg-[var(--color-background)] text-[var(--color-neutral)] hover:text-[var(--color-primary)] transition-colors rounded"
                title="Duplicate theme"
              >
                <Copy className="h-3 w-3" />
              </button>
            )}
            {onExport && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExport();
                }}
                className="p-1 hover:bg-[var(--color-background)] text-[var(--color-neutral)] hover:text-[var(--color-primary)] transition-colors rounded"
                title="Export theme"
              >
                <Download className="h-3 w-3" />
              </button>
            )}
            {theme.isCustom && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 hover:bg-[var(--color-background)] text-[var(--color-neutral)] hover:text-[var(--color-primary)] transition-colors rounded"
                title="Edit theme"
              >
                <Edit3 className="h-3 w-3" />
              </button>
            )}
            {theme.isCustom && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 hover:bg-[var(--color-background)] text-red-500/70 hover:text-red-600 transition-colors rounded"
                title="Delete theme"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
