/**
 * PageHeader - Reusable page header component with terminal selector
 * Displays page title, breadcrumbs, and terminal context selector
 */

'use client';

import React, { ReactNode } from 'react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { OrganizationType } from '@/types';
import TerminalSelector from '@/components/ui/TerminalSelector';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  showTerminalSelector?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  showTerminalSelector = true,
  className = ''
}) => {  const { currentOrganization, getOrganizationsByType } = useOrganizational();

  // Get current terminal name for display
  const getTerminalName = () => {
    if (currentOrganization?.type === OrganizationType.TERMINAL) {
      return currentOrganization.name;
    }
    
    // If not in terminal context, look for first terminal
    const terminals = getOrganizationsByType(OrganizationType.TERMINAL);
    if (terminals.length > 0) {
      return terminals[0].name;
    }
    
    // Fallback
    return currentOrganization?.name || 'Launch Terminal';
  };  return (
    <div 
      className={`sticky top-0 z-10 border-b pb-4 bg-[var(--color-background)] border-[var(--color-neutral)] p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Page Icon and Title */}
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="flex-shrink-0 text-[var(--color-accent)]">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold truncate text-[var(--color-accent)]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm mt-1 truncate text-[var(--color-text-secondary)]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>          {/* Terminal Selector */}
          {showTerminalSelector && (
            <div className="hidden md:block ml-auto mr-4">
              <div className="flex items-center gap-3">
                <span className="text-sm whitespace-nowrap text-[var(--color-text-secondary)] font-medium">
                  Terminal:
                </span>
                <TerminalSelector 
                  variant="header" 
                  className="min-w-64"
                  showLocation={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {actions && (
          <div className="flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>      {/* Mobile Terminal Selector */}
      {showTerminalSelector && (
        <div className="md:hidden mt-4 pt-4 border-t border-[var(--color-neutral)]">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-secondary)] font-medium">
              Terminal:
            </span>
            <TerminalSelector 
              variant="header" 
              className="flex-1"
              showLocation={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
