/**
 * Organizations Page - Modern organizational structure management
 * Professional interface for managing company hierarchy and structure
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfessionalPage from '@/components/layout/ProfessionalPage';
import { useOrganizations, useOrganizationMutations, Organization } from '@/hooks/useOrganizations';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  MapPinIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  BuildingOffice2Icon,
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BanknotesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  BuildingOffice2Icon as BuildingOffice2IconSolid,
  MapPinIcon as MapPinIconSolid,
  UsersIcon as UsersIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

const OrganizationsPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      router.push('/auth');
      return;
    }
  }, [router]);

  // Fetch real organization data
  const { organizations, loading, error, refetch } = useOrganizations();
  const { createOrganization, updateOrganization, deleteOrganization, loading: mutationLoading } = useOrganizationMutations();

  // Auto-expand top-level organizations on data load
  React.useEffect(() => {
    if (organizations.length > 0) {
      const topLevelOrgs = organizations.filter(org => !org.parentId);
      setExpandedItems(new Set(topLevelOrgs.map(org => org.id)));
    }
  }, [organizations]);

  // KPI calculations from real data
  const kpis = useMemo(() => {
    if (loading || organizations.length === 0) {
      return [
        {
          id: 'total-orgs',
          label: 'Total Organizations',
          value: '...',
          change: { value: 0, type: 'increase' as const, period: 'loading...' },
          icon: BuildingOfficeIcon,
          color: 'text-primary-600'
        },
        {
          id: 'total-employees',
          label: 'Total Employees',
          value: '...',
          change: { value: 0, type: 'increase' as const, period: 'loading...' },
          icon: UserGroupIcon,
          color: 'text-success-600'
        },
        {
          id: 'total-vehicles',
          label: 'Fleet Size',
          value: '...',
          change: { value: 0, type: 'increase' as const, period: 'loading...' },
          icon: MapPinIcon,
          color: 'text-info-600'
        },
        {
          id: 'total-revenue',
          label: 'Annual Revenue',
          value: '...',
          change: { value: 0, type: 'increase' as const, period: 'loading...' },
          icon: BanknotesIcon,
          color: 'text-warning-600'
        }
      ];
    }

    const activeOrgs = organizations.filter(org => org.isActive);
    const totalEmployees = activeOrgs.reduce((sum, org) => sum + org.stats.employees, 0);
    const totalVehicles = activeOrgs.reduce((sum, org) => sum + org.stats.vehicles, 0);
    const totalRevenue = activeOrgs.reduce((sum, org) => sum + org.stats.revenue, 0);
    const totalActiveLoads = activeOrgs.reduce((sum, org) => sum + org.stats.activeLoads, 0);

    return [
      {
        id: 'total-orgs',
        label: 'Total Organizations',
        value: activeOrgs.length.toString(),
        change: { value: 2, type: 'increase' as const, period: 'from last month' },
        icon: BuildingOfficeIcon,
        color: 'text-primary-600'
      },
      {
        id: 'total-employees',
        label: 'Total Employees',
        value: totalEmployees.toLocaleString(),
        change: { value: 45, type: 'increase' as const, period: 'from last month' },
        icon: UserGroupIcon,
        color: 'text-success-600'
      },
      {
        id: 'total-vehicles',
        label: 'Fleet Size',
        value: totalVehicles.toString(),
        change: { value: 8, type: 'increase' as const, period: 'from last month' },
        icon: MapPinIcon,
        color: 'text-info-600'
      },
      {
        id: 'total-revenue',
        label: 'Annual Revenue',
        value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
        change: { value: 12, type: 'increase' as const, period: 'from last year' },
        icon: BanknotesIcon,
        color: 'text-warning-600'
      }
    ];
  }, [organizations, loading]);

  // Filter and search organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || org.type === selectedType;
      const matchesStatus = showInactive || org.isActive;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, showInactive, organizations]);

  // Build organization hierarchy
  const buildHierarchy = (organizations: Organization[], parentId?: string): Organization[] => {
    return organizations
      .filter(org => org.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const getOrgIcon = (type: string, isActive: boolean = true) => {
    const iconClass = cn('h-5 w-5', {
      'text-primary-600': type === 'company',
      'text-success-600': type === 'division',
      'text-warning-600': type === 'department',
      'text-info-600': type === 'terminal',
      'text-neutral-400': !isActive
    });

    switch (type) {
      case 'company':
        return <BuildingOfficeIcon className={iconClass} />;
      case 'division':
        return <BuildingOffice2Icon className={iconClass} />;
      case 'department':
        return <UsersIcon className={iconClass} />;
      case 'terminal':
        return <MapPinIcon className={iconClass} />;
      default:
        return <BuildingOfficeIcon className={iconClass} />;
    }
  };

  const toggleExpanded = (orgId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedItems(newExpanded);
  };
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const handleEditOrganization = async (org: Organization) => {
    // TODO: Implement edit form
    console.log('Edit organization:', org);
    setSelectedOrg(null);
  };

  const handleDeleteOrganization = async (org: Organization) => {
    if (window.confirm(`Are you sure you want to delete "${org.name}"? This action cannot be undone.`)) {
      try {
        await deleteOrganization(org.id, org.type);
        refetch(); // Refresh the data
        setSelectedOrg(null);
      } catch (error) {
        console.error('Failed to delete organization:', error);
        alert('Failed to delete organization. Please try again.');
      }
    }
  };

  const renderOrganizationCard = (org: Organization, level: number = 0) => {
    const children = buildHierarchy(filteredOrganizations, org.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedItems.has(org.id);

    return (
      <div key={org.id} className="space-y-2">
        <div
          className={cn(
            'bg-theme-surface border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-all duration-fast',
            level > 0 && 'ml-6 border-l-4 border-l-primary-200'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(org.id)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors duration-fast"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-neutral-500" />
                  )}
                </button>
              )}
              
              {getOrgIcon(org.type, org.isActive)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 truncate">{org.name}</h3>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    org.isActive 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-neutral-100 text-neutral-600'
                  )}>
                    {org.code}
                  </span>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full capitalize',
                    {
                      'bg-primary-100 text-primary-800': org.type === 'company',
                      'bg-success-100 text-success-800': org.type === 'division',
                      'bg-warning-100 text-warning-800': org.type === 'department',
                      'bg-info-100 text-info-800': org.type === 'terminal'
                    }
                  )}>
                    {org.type}
                  </span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">
                  {org.address.city}, {org.address.state} • {org.stats.employees} employees
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-neutral-900">
                  {formatCurrency(org.stats.revenue)}
                </div>
                <div className="text-xs text-neutral-500">Annual Revenue</div>
              </div>
              
              <button
                onClick={() => setSelectedOrg(org)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors duration-fast"
                title="View details"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">{org.stats.employees}</div>
              <div className="text-xs text-neutral-500">Employees</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">{org.stats.vehicles}</div>
              <div className="text-xs text-neutral-500">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">{org.stats.activeLoads}</div>
              <div className="text-xs text-neutral-500">Active Loads</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">
                {org.isActive ? 'Active' : 'Inactive'}
              </div>
              <div className="text-xs text-neutral-500">Status</div>
            </div>
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {children.map(child => renderOrganizationCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  return (
    <ProfessionalPage
      title="Organizations"
      subtitle="Manage your organizational structure and hierarchy"
      kpis={kpis}
    >
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              title="Filter by organization type"
            >
              <option value="all">All Types</option>
              <option value="company">Companies</option>
              <option value="division">Divisions</option>
              <option value="department">Departments</option>
              <option value="terminal">Terminals</option>
            </select>
            
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-fast flex items-center gap-2',
                showInactive
                  ? 'bg-neutral-100 text-neutral-700'
                  : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              {showInactive ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              {showInactive ? 'Hide Inactive' : 'Show Inactive'}
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-fast flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Organization
            </button>
          </div>
        </div>        {/* Organization Hierarchy */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-neutral-600">Loading organizations...</span>
          </div>
        ) : error ? (
          <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-error-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-error-900 mb-2">Failed to load organizations</h3>
            <p className="text-error-700 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors duration-fast"
            >
              Try Again
            </button>
          </div>
        ) : organizations.length === 0 ? (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-12 text-center">
            <BuildingOfficeIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No organizations found</h3>
            <p className="text-neutral-600 mb-6">
              Get started by creating your first organization.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-fast"
            >
              Create Organization
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {buildHierarchy(filteredOrganizations).map(org => renderOrganizationCard(org))}
          </div>
        )}

        {/* Organization Details Modal */}
        {selectedOrg && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop">
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    {getOrgIcon(selectedOrg.type)}
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900">{selectedOrg.name}</h2>
                      <p className="text-sm text-neutral-500">{selectedOrg.code}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrg(null)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors duration-fast"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-700">{selectedOrg.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-700">{selectedOrg.contactInfo.email}</span>
                      </div>
                      {selectedOrg.contactInfo.website && (
                        <div className="flex items-center gap-3">
                          <GlobeAltIcon className="h-4 w-4 text-neutral-400" />
                          <a 
                            href={selectedOrg.contactInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            {selectedOrg.contactInfo.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">Address</h3>
                    <div className="text-sm text-neutral-700">
                      <div>{selectedOrg.address.address}</div>
                      <div>{selectedOrg.address.city}, {selectedOrg.address.state} {selectedOrg.address.zipCode}</div>
                      <div>{selectedOrg.address.country}</div>
                    </div>
                  </div>

                  {/* Manager */}
                  {selectedOrg.manager && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Manager</h3>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-neutral-900">{selectedOrg.manager.name}</div>
                        <div className="flex items-center gap-3">
                          <EnvelopeIcon className="h-4 w-4 text-neutral-400" />
                          <span className="text-sm text-neutral-700">{selectedOrg.manager.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="h-4 w-4 text-neutral-400" />
                          <span className="text-sm text-neutral-700">{selectedOrg.manager.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{selectedOrg.stats.employees}</div>
                        <div className="text-xs text-neutral-500">Employees</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{selectedOrg.stats.vehicles}</div>
                        <div className="text-xs text-neutral-500">Vehicles</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{formatCurrency(selectedOrg.stats.revenue)}</div>
                        <div className="text-xs text-neutral-500">Annual Revenue</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{selectedOrg.stats.activeLoads}</div>
                        <div className="text-xs text-neutral-500">Active Loads</div>
                      </div>
                    </div>
                  </div>
                </div>                {/* Actions */}
                <div className="p-6 border-t border-neutral-200 flex gap-3">
                  <button 
                    onClick={() => handleEditOrganization(selectedOrg)}
                    disabled={mutationLoading}
                    className="flex-1 px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-fast flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteOrganization(selectedOrg)}
                    disabled={mutationLoading}
                    className="flex-1 px-4 py-2 text-error-600 border border-error-600 rounded-lg hover:bg-error-50 transition-colors duration-fast flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>        )}
      </ProfessionalPage>
  );
};

export default OrganizationsPage;
