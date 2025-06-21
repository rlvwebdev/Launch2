'use client';

import React, { useState } from 'react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { Organization, OrganizationType } from '@/types';
import { Building, ChevronDown, Check } from 'lucide-react';

interface OrganizationSelectorProps {
  className?: string;
  showFullHierarchy?: boolean;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ 
  className = '', 
  showFullHierarchy = true 
}) => {
  const {
    currentOrganization,
    getAccessibleOrganizations,
    switchOrganization,
    getParentOrganizations,
    isLoading
  } = useOrganizational();

  const [isOpen, setIsOpen] = useState(false);
  const accessibleOrganizations = getAccessibleOrganizations();

  const getOrganizationIcon = (type: OrganizationType) => {
    switch (type) {
      case OrganizationType.COMPANY:
        return '🏢';
      case OrganizationType.DIVISION:
        return '🏬';
      case OrganizationType.DEPARTMENT:
        return '🏪';
      case OrganizationType.TERMINAL:
        return '🚛';
      default:
        return '🏢';
    }
  };

  const getOrganizationDisplayName = (org: Organization) => {
    if (!showFullHierarchy) return org.name;
    
    const parents = getParentOrganizations(org.id);
    const hierarchy = [...parents, org];
    
    return hierarchy.map(o => o.name).join(' › ');
  };

  const handleOrganizationSwitch = async (orgId: string) => {
    setIsOpen(false);
    await switchOrganization(orgId);
  };

  if (!currentOrganization) {
    return (      <div className={`flex items-center px-3 py-2 text-sm text-launch-navy/70 ${className}`}>
        <Building className="h-4 w-4 mr-2" />
        No organization selected
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-launch-navy bg-white border border-launch-gray rounded-lg hover:bg-launch-mint/10 focus:outline-none focus:ring-2 focus:ring-launch-teal focus:border-transparent disabled:opacity-50"
      >
        <div className="flex items-center">
          <span className="mr-2 text-base">
            {getOrganizationIcon(currentOrganization.type)}
          </span>
          <div className="text-left">
            <div className="font-medium truncate max-w-48">
              {currentOrganization.name}
            </div>            {showFullHierarchy && currentOrganization.type !== OrganizationType.COMPANY && (
              <div className="text-xs text-launch-navy/50 truncate max-w-48">
                {getOrganizationDisplayName(currentOrganization)}
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute z-20 w-full mt-1 bg-white border border-launch-gray rounded-lg shadow-lg max-h-80 overflow-y-auto">
            <div className="p-2">              <div className="text-xs font-medium text-launch-navy/70 px-2 py-1 mb-1">
                Available Organizations
              </div>
              
              {accessibleOrganizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrganizationSwitch(org.id)}
                  className="flex items-center justify-between w-full px-2 py-2 text-sm text-left text-launch-navy hover:bg-launch-mint/20 rounded focus:outline-none focus:bg-launch-mint/20"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="mr-2 text-base flex-shrink-0">
                      {getOrganizationIcon(org.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {org.name}
                      </div>
                      <div className="text-xs text-launch-navy/50 truncate">
                        {org.type.charAt(0).toUpperCase() + org.type.slice(1)} • {org.code}
                      </div>
                    </div>
                  </div>
                  
                  {currentOrganization.id === org.id && (
                    <Check className="h-4 w-4 text-launch-teal flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
              
              {accessibleOrganizations.length === 0 && (
                <div className="px-2 py-3 text-sm text-launch-navy/50 text-center">
                  No organizations available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizationSelector;
