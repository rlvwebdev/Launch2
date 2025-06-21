/**
 * TerminalSelector - Dropdown for selecting user's accessible terminals
 * Shows terminal hierarchy and handles dashboard context switching
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTerminal } from '@/context/TerminalContext';
import {
  ChevronDownIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  MapPinIcon as MapPinIconSolid
} from '@heroicons/react/24/solid';

interface TerminalSelectorProps {
  isCollapsed?: boolean;
  className?: string;
}

export function TerminalSelector({ isCollapsed = false, className }: TerminalSelectorProps) {
  const {
    selectedTerminal,
    setSelectedTerminal,
    availableTerminals,
    loading,
    error,
    getTerminalDisplayName,
    getTerminalHierarchy
  } = useTerminal();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTerminalSelect = (terminal: typeof selectedTerminal) => {
    setSelectedTerminal(terminal);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent" />
          {!isCollapsed && <span className="text-sm text-neutral-600">Loading terminals...</span>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-4 w-4 text-error-500" />
          {!isCollapsed && (
            <span className="text-sm text-error-600 truncate">Error loading terminals</span>
          )}
        </div>
      </div>
    );
  }

  if (availableTerminals.length === 0) {
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <MapPinIcon className="h-4 w-4 text-neutral-400" />
          {!isCollapsed && (
            <span className="text-sm text-neutral-500">No terminals available</span>
          )}
        </div>
      </div>
    );
  }
  // Single terminal - no dropdown needed
  if (availableTerminals.length === 1 && !isCollapsed) {
    const terminal = availableTerminals[0];
    return (
      <div className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <MapPinIconSolid className="h-4 w-4 text-primary-600" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-neutral-900 truncate">
              {getTerminalDisplayName(terminal)}
            </div>
            <div className="text-xs text-neutral-500 truncate">
              {terminal ? getTerminalHierarchy(terminal) : 'Unknown Organization'}
            </div>
          </div>
        </div>
      </div>
    );
  }  // Collapsed state - show icon with dropdown
  if (isCollapsed) {
    return (
      <div className={cn("flex justify-center py-4 relative", className)} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-fast relative"
          title={selectedTerminal ? 
            `${getTerminalDisplayName(selectedTerminal)} (${availableTerminals.length} terminals available)` : 
            `Select Terminal (${availableTerminals.length} available)`
          }
        >
          <MapPinIconSolid className="h-5 w-5 text-primary-600" />
          {availableTerminals.length > 1 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {availableTerminals.length > 9 ? '9+' : availableTerminals.length}
              </span>
            </div>
          )}
        </button>
          {/* Collapsed Dropdown */}
        {isOpen && availableTerminals.length > 1 && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 min-w-64 max-w-sm max-h-64 md:max-h-80 overflow-y-auto">
            {/* Header showing total count */}
            <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200 rounded-t-lg">
              <div className="text-xs font-medium text-neutral-600 text-center">
                {availableTerminals.length} terminals available
              </div>
            </div>
            
            {availableTerminals.map((terminal) => (
              <button
                key={terminal.id}
                onClick={() => handleTerminalSelect(terminal)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-50 transition-colors duration-fast first:rounded-t-lg last:rounded-b-lg",
                  selectedTerminal?.id === terminal.id && "bg-primary-50 text-primary-700"
                )}
              >
                <MapPinIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">
                    {getTerminalDisplayName(terminal)}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {terminal ? getTerminalHierarchy(terminal) : 'Unknown Organization'}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {terminal?.address?.city || 'Unknown'}, {terminal?.address?.state || 'Unknown'}
                  </div>
                </div>

                {!terminal.isActive && (
                  <div className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded">
                    Inactive
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }  return (
    <div className={cn("p-4", className)} ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors duration-fast",
            isOpen && "ring-2 ring-primary-500 border-primary-500"
          )}
        >
          <MapPinIconSolid className="h-4 w-4 text-primary-600 flex-shrink-0" />
            <div className="flex-1 min-w-0 text-left">
            {selectedTerminal ? (              <>
                <div className="text-sm font-medium text-neutral-900 truncate">
                  {getTerminalDisplayName(selectedTerminal)}
                </div>
                <div className="text-xs text-neutral-500 truncate">
                  {selectedTerminal?.address?.city || 'Unknown'}, {selectedTerminal?.address?.state || 'Unknown'}
                  {availableTerminals.length > 1 && (
                    <span className="ml-2 text-primary-600">
                      • {availableTerminals.length} available
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-neutral-500">
                Select Terminal {availableTerminals.length > 0 && `(${availableTerminals.length} available)`}
              </div>
            )}
          </div>
          
          {availableTerminals.length > 1 && (
            <ChevronDownIcon 
              className={cn(
                "h-4 w-4 text-neutral-400 transition-transform duration-fast",
                isOpen && "rotate-180"
              )} 
            />
          )}
        </button>        {/* Dropdown */}
        {isOpen && availableTerminals.length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-64 md:max-h-80 overflow-y-auto">
            {/* Header showing total count */}
            <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200 rounded-t-lg">
              <div className="text-xs font-medium text-neutral-600">
                {availableTerminals.length} terminals available
              </div>
            </div>
            
            {availableTerminals.map((terminal) => (
              <button
                key={terminal.id}
                onClick={() => handleTerminalSelect(terminal)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-50 transition-colors duration-fast first:rounded-t-lg last:rounded-b-lg",
                  selectedTerminal?.id === terminal.id && "bg-primary-50 text-primary-700"
                )}
              >
                <MapPinIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">
                    {getTerminalDisplayName(terminal)}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {terminal ? getTerminalHierarchy(terminal) : 'Unknown Organization'}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {terminal?.address?.city || 'Unknown'}, {terminal?.address?.state || 'Unknown'}
                  </div>
                </div>

                {!terminal.isActive && (
                  <div className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded">
                    Inactive
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>      {/* Terminal info for expanded single terminal */}
      {availableTerminals.length === 1 && selectedTerminal && (
        <div className="mt-2 text-xs text-neutral-500">
          <div className="truncate">{selectedTerminal ? getTerminalHierarchy(selectedTerminal) : 'Unknown Organization'}</div>
          <div className="truncate">{selectedTerminal?.address?.city || 'Unknown'}, {selectedTerminal?.address?.state || 'Unknown'}</div>
        </div>
      )}
    </div>
  );
}

export default TerminalSelector;
