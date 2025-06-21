'use client';

import React from 'react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { OrganizationType } from '@/types';
import { Building, Globe, Navigation, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrganizationalSelectorGroupProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function OrganizationalSelectorGroup({ 
  className,
  size = 'md' 
}: OrganizationalSelectorGroupProps) {
  const { 
    currentOrganization, 
    getOrganizationsByType, 
    getOrganizationalFilter,
    setCurrentOrganization 
  } = useOrganizational();

  const terminals = getOrganizationsByType(OrganizationType.TERMINAL);
  const regions = getOrganizationsByType(OrganizationType.REGION);
  const departments = getOrganizationsByType(OrganizationType.DEPARTMENT);
  const filter = getOrganizationalFilter();

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleTerminalChange = (terminalId: string) => {
    setCurrentOrganization(terminalId);
  };

  const handleRegionChange = (regionId: string) => {
    setCurrentOrganization(regionId);
  };

  const handleDepartmentChange = (departmentId: string) => {
    setCurrentOrganization(departmentId);
  };

  const getCurrentTerminal = () => {
    return terminals.find(t => t.id === filter.terminalId) || terminals[0];
  };

  const getCurrentRegion = () => {
    return regions.find(r => r.id === filter.divisionId) || regions[0];
  };

  const getCurrentDepartment = () => {
    return departments.find(d => d.id === filter.departmentId) || departments[0];
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Terminal Selector */}
      <div className="flex items-center gap-1">
        <Building className={cn("text-[var(--color-accent)]", iconSizes[size])} />
        <span className={cn("text-[var(--color-text-secondary)]", sizeClasses[size])}>
          Terminal:
        </span>
        <div className="relative">
          <select
            value={getCurrentTerminal()?.id || ''}
            onChange={(e) => handleTerminalChange(e.target.value)}
            aria-label="Select Terminal"
            className={cn(
              "appearance-none bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-neutral)] rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]",
              sizeClasses[size]
            )}
          >
            {terminals.map((terminal) => (
              <option key={terminal.id} value={terminal.id}>
                {terminal.name}
              </option>
            ))}
          </select>
          <ChevronDown className={cn("absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none", iconSizes[size])} />
        </div>
      </div>

      {/* Separator */}
      <span className="text-[var(--color-neutral)]">→</span>

      {/* Region Selector */}
      <div className="flex items-center gap-1">
        <Globe className={cn("text-[var(--color-accent)]", iconSizes[size])} />
        <span className={cn("text-[var(--color-text-secondary)]", sizeClasses[size])}>
          Region:
        </span>
        <div className="relative">
          <select
            value={getCurrentRegion()?.id || ''}
            onChange={(e) => handleRegionChange(e.target.value)}
            aria-label="Select Region"
            className={cn(
              "appearance-none bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-neutral)] rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]",
              sizeClasses[size]
            )}
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          <ChevronDown className={cn("absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none", iconSizes[size])} />
        </div>
      </div>

      {/* Separator */}
      <span className="text-[var(--color-neutral)]">→</span>

      {/* Division Selector */}
      <div className="flex items-center gap-1">
        <Navigation className={cn("text-[var(--color-accent)]", iconSizes[size])} />
        <span className={cn("text-[var(--color-text-secondary)]", sizeClasses[size])}>
          Division:
        </span>
        <div className="relative">
          <select
            value={getCurrentDepartment()?.id || ''}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            aria-label="Select Division"
            className={cn(
              "appearance-none bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-neutral)] rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]",
              sizeClasses[size]
            )}
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <ChevronDown className={cn("absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none", iconSizes[size])} />
        </div>
      </div>
    </div>
  );
}
