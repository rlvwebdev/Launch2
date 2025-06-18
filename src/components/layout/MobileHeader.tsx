'use client';

import { useState } from 'react';
import { Building, ChevronDown, Check } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { cn } from '@/lib/utils';

export default function MobileHeader() {
  const { currentOrganization, getAccessibleOrganizations, switchOrganization } = useOrganizational();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentOrganization) return null;

  const accessibleOrganizations = getAccessibleOrganizations();

  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-gray-500" />
          <div>
            <div className="font-medium text-gray-900 text-sm">
              {currentOrganization.name}
            </div>
            <div className="text-xs text-gray-500">
              {currentOrganization.type}
            </div>
          </div>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isDropdownOpen && "rotate-180"
          )} 
        />
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="py-2">
              {accessibleOrganizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org.id);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {org.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {org.type}
                      </div>
                    </div>
                  </div>
                  {currentOrganization.id === org.id && (
                    <Check className="h-4 w-4 text-blue-600" />
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
