/**
 * ProfessionalPage - Compact, responsive page layout component
 * Enterprise-grade page shell with adaptive header and content areas
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

interface PageAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface FilterPill {
  id: string;
  label: string;
  value: string;
  active: boolean;
  removable?: boolean;
}

interface KPICard {
  id: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface ProfessionalPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: PageAction[];
  kpis?: KPICard[];
  filters?: FilterPill[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
  className?: string;
  showFilters?: boolean;
  showKPIs?: boolean;
  compact?: boolean;
}

export default function ProfessionalPage({
  title,
  subtitle,
  breadcrumbs,
  actions = [],
  kpis = [],
  filters = [],
  onSearch,
  searchPlaceholder = "Search...",
  children,
  className,
  showFilters = false,
  showKPIs = false,
  compact = false
}: ProfessionalPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const formatKPIValue = (value: string | number) => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase': return 'text-success-600';
      case 'decrease': return 'text-error-600';
      default: return 'text-neutral-500';
    }
  };

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase': return '↗';
      case 'decrease': return '↘';
      default: return '→';
    }
  };
  return (
    <div className={cn("space-y-4", className)}>
      {/* Page Header */}
      <div className="space-y-4">
        {/* Breadcrumbs (Desktop only) */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="hidden lg:flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronDownIcon className="h-4 w-4 text-neutral-400 rotate-[-90deg] mx-2" />
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-neutral-900 font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-neutral-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-600 line-clamp-2 lg:line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                      action.variant === 'primary' && "bg-primary-600 text-white hover:bg-primary-700",
                      action.variant === 'secondary' && "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                      (!action.variant || action.variant === 'outline') && "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    {action.icon && <action.icon className="h-4 w-4" />}
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Mobile Action Menu */}
              <div className="lg:hidden">                <button 
                  title="More actions"
                  className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      {(onSearch || showFilters) && (
        <div className="space-y-3">
          {/* Search Bar */}
          {onSearch && (
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className={cn(
                  "block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg",
                  "placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  "text-sm bg-white"
                )}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}

          {/* Filter Pills */}
          {showFilters && filters.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full"
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
              </button>
              
              <div className={cn(
                "flex items-center gap-2",
                "lg:flex", // Always visible on desktop
                showMobileFilters ? "flex" : "hidden lg:flex" // Conditional on mobile
              )}>
                {filters.map((filter) => (
                  <span
                    key={filter.id}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap",
                      filter.active
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    )}
                  >
                    {filter.label}
                    {filter.removable && (
                      <button className="ml-1 hover:text-error-600">×</button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}      {/* KPI Cards */}
      {showKPIs && kpis.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="bg-white p-4 lg:p-5 rounded-lg border border-neutral-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                {kpi.icon && (
                  <div className={cn(
                    "p-2 rounded-lg",
                    kpi.color || "bg-primary-100"
                  )}>
                    <kpi.icon className={cn(
                      "h-5 w-5",
                      kpi.color ? "text-current" : "text-primary-600"
                    )} />
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatKPIValue(kpi.value)}
                </p>
                {kpi.change && (
                  <p className={cn(
                    "text-xs mt-1 flex items-center gap-1",
                    getChangeColor(kpi.change.type)
                  )}>
                    <span>{getChangeIcon(kpi.change.type)}</span>
                    {Math.abs(kpi.change.value)}% {kpi.change.period}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}      {/* Main Content */}
      <div className={cn(
        "bg-white rounded-lg border border-neutral-200",
        compact ? "p-4 lg:p-5 xl:p-6" : "p-6 lg:p-7 xl:p-8 2xl:p-10"
      )}>
        {children}
      </div>
    </div>
  );
}
