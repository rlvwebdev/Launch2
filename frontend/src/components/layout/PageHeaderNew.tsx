/**
 * PageHeader - Streamlined page header component with focus on content and navigation
 * Professional header for TMS pages with title, subtitle, terminal selector, and actions
 */

'use client';

import React, { ReactNode } from 'react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { OrganizationType } from '@/types';
import TerminalSelector from '@/components/ui/TerminalSelector';
import { Card } from '@/components/ui/Card';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  showTerminalSelector?: boolean;
  variant?: 'default' | 'minimal' | 'dashboard';
  className?: string;
  children?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  showTerminalSelector = true,
  variant = 'default',
  className = '',
  children
}) => {
  const { currentOrganization, getOrganizationsByType } = useOrganizational();

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
  };

  if (variant === 'minimal') {
    return (
      <div className={`border-b bg-[var(--color-background)] border-[var(--color-neutral)]/20 ${className}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {icon && (
                <div className="flex-shrink-0 text-[var(--color-accent)]">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-xl font-semibold truncate text-[var(--color-text)]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm mt-1 truncate text-[var(--color-text-secondary)]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex-shrink-0 ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <Card className={`mb-6 ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-3 min-w-0">
                {icon && (
                  <div className="flex-shrink-0 p-3 rounded-lg bg-[var(--color-accent)]/10">
                    <div className="text-[var(--color-accent)]">
                      {icon}
                    </div>
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold truncate text-[var(--color-accent)]">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm mt-2 text-[var(--color-text-secondary)] leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Terminal Selector for Dashboard */}
              {showTerminalSelector && (
                <div className="hidden lg:block ml-auto mr-4">
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

            {actions && (
              <div className="flex-shrink-0 ml-4">
                {actions}
              </div>
            )}
          </div>

          {/* Mobile Terminal Selector for Dashboard */}
          {showTerminalSelector && (
            <div className="lg:hidden mt-6 pt-4 border-t border-[var(--color-neutral)]/20">
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

          {children && (
            <div className="mt-6 pt-4 border-t border-[var(--color-neutral)]/20">
              {children}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={`border-b bg-[var(--color-background)] border-[var(--color-neutral)]/20 ${className}`}>
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Page Icon and Title */}
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div className="flex-shrink-0 p-2 rounded-lg bg-[var(--color-accent)]/10">
                  <div className="text-[var(--color-accent)]">
                    {icon}
                  </div>
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold truncate text-[var(--color-accent)]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm mt-2 text-[var(--color-text-secondary)] leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Terminal Selector */}
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
        </div>

        {/* Mobile Terminal Selector */}
        {showTerminalSelector && (
          <div className="md:hidden mt-6 pt-4 border-t border-[var(--color-neutral)]/20">
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

        {/* Additional Content */}
        {children && (
          <div className="mt-6 pt-4 border-t border-[var(--color-neutral)]/20">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
