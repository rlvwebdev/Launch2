/**
 * OrganizationalHierarchyCard - Shows the organizational hierarchy for the selected terminal
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useOrganizational } from '@/context/OrganizationalContext';
import { OrganizationType } from '@/types';
import { Building2, Building, Users, MapPin, Loader2 } from 'lucide-react';

interface HierarchyData {
  company: {
    id: string;
    name: string;
    code: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
  };
  division: {
    id: string;
    name: string;
    code: string;
  };
  department: {
    id: string;
    name: string;
    code: string;
  };
  terminal: {
    id: string;
    name: string;
    code: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

const OrganizationalHierarchyCard: React.FC = () => {
  const { currentOrganization } = useOrganizational();
  const [hierarchy, setHierarchy] = useState<HierarchyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHierarchy = async () => {
      // Only fetch if we have a terminal selected
      if (!currentOrganization || currentOrganization.type !== OrganizationType.TERMINAL) {
        setHierarchy(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/terminal-hierarchy?terminalId=${currentOrganization.id}`);
        const data = await response.json();

        if (data.success) {
          setHierarchy(data.hierarchy);
        } else {
          setError(data.error || 'Failed to load hierarchy');
        }
      } catch (err) {
        setError('Failed to fetch organizational hierarchy');
        console.error('Error fetching hierarchy:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHierarchy();
  }, [currentOrganization]);

  const formatLocation = (address?: string, city?: string, state?: string, zip?: string) => {
    const parts = [address, city, state, zip].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  if (!currentOrganization || currentOrganization.type !== OrganizationType.TERMINAL) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Organizational Hierarchy
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            Select a terminal from the page header to view the organizational hierarchy
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Organizational Hierarchy
        </h3>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading hierarchy...</span>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 py-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}        {hierarchy && !isLoading && !error && (
          <div className="space-y-1">
            {/* Division */}
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">{hierarchy.division.name}</span>
              <span className="text-sm text-gray-500">({hierarchy.division.code})</span>
            </div>

            {/* Department */}
            <div className="flex items-center gap-2 ml-6">
              <span className="text-gray-400">----</span>
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-lg font-semibold text-gray-900">{hierarchy.department.name}</span>
              <span className="text-sm text-gray-500">({hierarchy.department.code})</span>
            </div>

            {/* Terminal */}
            <div className="flex items-center gap-2 ml-12">
              <span className="text-gray-400">-------</span>
              <MapPin className="h-4 w-4 text-purple-600" />
              <span className="text-lg font-semibold text-gray-900">{hierarchy.terminal.name}</span>
              <span className="text-sm text-gray-500">({hierarchy.terminal.code})</span>
            </div>

            {/* Terminal location details */}
            {(hierarchy.terminal.address || hierarchy.terminal.city) && (
              <div className="ml-12 mt-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3 inline mr-1" />
                {formatLocation(
                  hierarchy.terminal.address,
                  hierarchy.terminal.city,
                  hierarchy.terminal.state,
                  hierarchy.terminal.zipCode
                )}
              </div>
            )}

            {/* Company info at the bottom */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-3 w-3" />
                <span>Company: {hierarchy.company.name}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationalHierarchyCard;
