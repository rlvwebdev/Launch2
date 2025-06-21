/**
 * TerminalSelector - Component for selecting active terminal
 * Shows only terminals the user has access to based on their roles and permissions
 * Styled to match the sidebar navigation
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { Terminal, OrganizationType, RoleLevel } from '@/types';
import { Building2, ChevronDown, Check, MapPin, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalSelectorProps {
  className?: string;
  showLocation?: boolean;
  variant?: 'full' | 'compact' | 'header';
}

const TerminalSelector: React.FC<TerminalSelectorProps> = ({ 
  className = '', 
  showLocation = true,
  variant = 'full'
}) => {
  const {
    currentOrganization,
    getAccessibleOrganizations,
    switchOrganization,
    isLoading
  } = useOrganizational();

  const [isOpen, setIsOpen] = useState(false);

  // Filter accessible organizations to only show terminals user has access to
  const accessibleTerminals = useMemo(() => {    const allOrganizations = getAccessibleOrganizations();
    
    // Filter for terminals only
    const terminals = allOrganizations.filter(org => 
      org.type === OrganizationType.TERMINAL
    ) as Terminal[];

    // Sort by terminal name for better UX
    return terminals.sort((a, b) => a.name.localeCompare(b.name));
  }, [getAccessibleOrganizations]);

  // Get current terminal if user is viewing a terminal context
  const currentTerminal = useMemo(() => {
    if (currentOrganization?.type === OrganizationType.TERMINAL) {
      return currentOrganization as Terminal;
    }
    return null;
  }, [currentOrganization]);

  const getTerminalStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-400';
      case 'maintenance':
        return 'bg-yellow-400';
      case 'limited':
        return 'bg-orange-400';
      case 'closed':
        return 'bg-red-400';
      default:
        return 'bg-launch-gray/50';
    }
  };

  const getTerminalStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'maintenance':
        return 'Maintenance';
      case 'limited':
        return 'Limited Operations';
      case 'closed':
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

  const handleTerminalSwitch = async (terminalId: string) => {
    setIsOpen(false);
    await switchOrganization(terminalId);
  };
  // Don't show selector if user has no terminal access
  if (accessibleTerminals.length === 0) {
    return null;
  }
  // Header variant for page header - styled like sidebar
  if (variant === 'header') {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-all duration-200",
            "bg-[var(--theme-primary)] text-white border border-white/20 rounded-lg shadow-lg",
            "hover:bg-[var(--theme-secondary)] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent",
            "disabled:opacity-50 min-w-[240px] group"
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            <div className="relative mr-3 flex-shrink-0">
              <Building2 className="h-5 w-5 text-white/90 group-hover:text-white transition-colors" />
              {currentTerminal && (
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--theme-primary)] ${getTerminalStatusColor(currentTerminal.operationalStatus)} shadow-sm`} />
              )}
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="font-medium truncate text-white group-hover:text-white transition-colors">
                {currentTerminal ? currentTerminal.name : 'Select Terminal'}
              </div>
              {currentTerminal && (
                <div className="text-xs text-white/70 truncate group-hover:text-white/80 transition-colors">
                  {currentTerminal.terminalCode} • {getTerminalStatusText(currentTerminal.operationalStatus)}
                </div>
              )}
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-all flex-shrink-0 ml-2 text-white/90 group-hover:text-white",
            isOpen ? 'rotate-180 transform' : ''
          )} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            
            {/* Dropdown */}
            <div className="absolute z-40 w-full mt-2 bg-[var(--theme-primary)] border border-white/20 rounded-lg shadow-2xl max-h-80 overflow-y-auto backdrop-blur-sm">
              <div className="p-2">
                <div className="text-xs font-medium text-white/70 px-3 py-2 mb-1 border-b border-white/10 bg-white/5 rounded-md">
                  <div className="flex items-center gap-2">
                    <Building className="h-3 w-3" />
                    Available Terminals ({accessibleTerminals.length})
                  </div>
                </div>
                
                {accessibleTerminals.map((terminal) => (
                  <button
                    key={terminal.id}
                    onClick={() => handleTerminalSwitch(terminal.id)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-3 text-sm text-left transition-all duration-200 rounded-md group relative",
                      "text-white hover:bg-[var(--theme-secondary)] focus:outline-none focus:bg-[var(--theme-secondary)]",
                      currentTerminal?.id === terminal.id && "bg-[var(--theme-secondary)] border-r-4 border-r-[var(--theme-accent)] shadow-sm"
                    )}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="relative mr-3">
                        <Building2 className="h-4 w-4 text-white/90 group-hover:text-white transition-colors" />
                        <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-[var(--theme-primary)] ${getTerminalStatusColor(terminal.operationalStatus)} shadow-sm`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-white group-hover:text-white transition-colors">
                          {terminal.name}
                        </div>
                        <div className="text-xs text-white/70 truncate flex items-center group-hover:text-white/80 transition-colors">
                          <span>{terminal.terminalCode} • {getTerminalStatusText(terminal.operationalStatus)}</span>
                          {showLocation && terminal.coordinates && (
                            <>
                              <MapPin className="h-3 w-3 ml-2 mr-1" />
                              <span>
                                {terminal.coordinates.lat.toFixed(2)}, {terminal.coordinates.lng.toFixed(2)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {currentTerminal?.id === terminal.id && (
                      <Check className="h-4 w-4 text-[var(--theme-accent)] flex-shrink-0 ml-2 drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Compact variant for collapsed sidebar
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="w-full p-2 rounded-lg hover:bg-launch-mint/20 transition-colors flex items-center justify-center"
          title={currentTerminal ? `${currentTerminal.name} - ${getTerminalStatusText(currentTerminal.operationalStatus)}` : 'Select Terminal'}
        >
          <div className="relative">
            <Building2 className="h-5 w-5 text-launch-navy/70" />
            {currentTerminal && (
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getTerminalStatusColor(currentTerminal.operationalStatus)}`} />
            )}
          </div>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            
            {/* Dropdown positioned to the right */}
            <div className="absolute z-20 left-full ml-2 w-80 bg-white border border-launch-gray rounded-lg shadow-lg max-h-80 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-launch-navy/70 px-2 py-1 mb-1">
                  Available Terminals ({accessibleTerminals.length})
                </div>
                
                {accessibleTerminals.map((terminal) => (
                  <button
                    key={terminal.id}
                    onClick={() => handleTerminalSwitch(terminal.id)}
                    className="flex items-center justify-between w-full px-2 py-2 text-sm text-left text-launch-navy hover:bg-launch-mint/20 rounded focus:outline-none focus:bg-launch-mint/20"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="relative mr-3">
                        <Building2 className="h-4 w-4 text-launch-navy/70" />
                        <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-white ${getTerminalStatusColor(terminal.operationalStatus)}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {terminal.name}
                        </div>
                        <div className="text-xs text-launch-navy/50 truncate">
                          {terminal.terminalCode} • {getTerminalStatusText(terminal.operationalStatus)}
                        </div>
                      </div>
                    </div>
                    
                    {currentTerminal?.id === terminal.id && (
                      <Check className="h-4 w-4 text-launch-teal flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full variant for expanded sidebar
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-launch-navy bg-white border border-launch-gray rounded-lg hover:bg-launch-mint/10 focus:outline-none focus:ring-2 focus:ring-launch-teal focus:border-transparent disabled:opacity-50"
      >        <div className="flex items-center flex-1 min-w-0">
          <div className="relative mr-3 flex-shrink-0">
            <Building2 className="h-4 w-4 text-launch-navy/70" />
            {currentTerminal && (
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getTerminalStatusColor(currentTerminal.operationalStatus)}`} />
            )}
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className="font-medium truncate">
              {currentTerminal ? currentTerminal.name : 'Select Terminal'}
            </div>
            {currentTerminal && (
              <div className="text-xs text-launch-navy/50 truncate">
                {currentTerminal.terminalCode} • {getTerminalStatusText(currentTerminal.operationalStatus)}
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute z-20 w-full mt-1 bg-white border border-launch-gray rounded-lg shadow-lg max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-launch-navy/70 px-2 py-1 mb-1">
                Available Terminals ({accessibleTerminals.length})
              </div>
              
              {accessibleTerminals.map((terminal) => (
                <button
                  key={terminal.id}
                  onClick={() => handleTerminalSwitch(terminal.id)}
                  className="flex items-center justify-between w-full px-2 py-2 text-sm text-left text-launch-navy hover:bg-launch-mint/20 rounded focus:outline-none focus:bg-launch-mint/20"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="relative mr-3">
                      <Building2 className="h-4 w-4 text-launch-navy/70" />
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-white ${getTerminalStatusColor(terminal.operationalStatus)}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {terminal.name}
                      </div>
                      <div className="text-xs text-launch-navy/50 truncate flex items-center">
                        <span>{terminal.terminalCode} • {getTerminalStatusText(terminal.operationalStatus)}</span>
                        {showLocation && terminal.coordinates && (
                          <>
                            <MapPin className="h-3 w-3 ml-2 mr-1" />
                            <span>
                              {terminal.coordinates.lat.toFixed(2)}, {terminal.coordinates.lng.toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {currentTerminal?.id === terminal.id && (
                    <Check className="h-4 w-4 text-launch-teal flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TerminalSelector;
