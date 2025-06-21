'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/BadgeLegacy';
import { Users, UserPlus, Search, Filter, Phone, CreditCard, MapPin, Truck as TruckIcon, Grid3X3, List, Eye, Edit, Settings, Building, Navigation, Globe, Award, TrendingUp } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { useData } from '@/context/DataContext';
import { DriverStatus, ResourceType, OrganizationType, DriverTier } from '@/types';
import { PermissionChecker } from '@/utils/permissions';
import { enhanceDriverWithTierInfo, getTierDisplayName, getTierColor, getPromotionMessage } from '@/utils/driverUtils';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

type OrganizationLevel = 'terminal' | 'department' | 'division';

export default function DriversPage() {
  const { currentOrganization, currentUser, getOrganizationalFilter, getOrganizationsByType, setCurrentOrganization } = useOrganizational();
  const { drivers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list
  const [activeTab, setActiveTab] = useState<OrganizationLevel>('terminal');
  // Get organizational data
  const terminals = getOrganizationsByType(OrganizationType.TERMINAL);
  const departments = getOrganizationsByType(OrganizationType.DEPARTMENT);
  const divisions = getOrganizationsByType(OrganizationType.DIVISION);

  // Get organizational filter for current context
  const organizationalFilter = getOrganizationalFilter();

  // Tab configuration based on available organizations and user permissions
  const tabs = [
    ...(terminals.length > 0 ? [{
      id: 'terminal' as OrganizationLevel,
      label: 'Terminal',
      icon: Building,
      description: 'View drivers by terminal location'
    }] : []),
    ...(departments.length > 0 ? [{
      id: 'department' as OrganizationLevel,
      label: 'Department',
      icon: Navigation,
      description: 'View drivers by department function'
    }] : []),
    ...(divisions.length > 0 ? [{
      id: 'division' as OrganizationLevel,
      label: 'Division',
      icon: Globe,
      description: 'View drivers by business division'
    }] : [])
  ];

  const getCurrentLevelName = () => {
    switch (activeTab) {
      case 'terminal':
        const currentTerminal = terminals.find(t => t.id === organizationalFilter.terminalId);
        return currentTerminal?.name || 'Terminal';
      case 'department':
        const currentDepartment = departments.find(d => d.id === organizationalFilter.departmentId);
        return currentDepartment?.name || 'Department';
      case 'division':
        const currentDivision = divisions.find(d => d.id === organizationalFilter.divisionId);
        return currentDivision?.name || 'Division';
      default:
        return 'Organization';
    }
  };

  // Handle tab change and switch organizational context
  const handleTabChange = (newTab: OrganizationLevel) => {
    setActiveTab(newTab);
    
    // Switch to the appropriate organizational level
    switch (newTab) {
      case 'terminal':
        if (terminals.length > 0) {
          setCurrentOrganization(terminals[0].id);
        }
        break;
      case 'department':
        if (departments.length > 0) {
          setCurrentOrganization(departments[0].id);
        }
        break;
      case 'division':
        if (divisions.length > 0) {
          setCurrentOrganization(divisions[0].id);
        }
        break;
    }
  };  // Filter data by selected terminal/organization first
  const organizationFilteredDrivers = drivers.filter(driver => {
    if (!driver.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return driver.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return driver.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return driver.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return driver.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true; // Show all if no filter
  }).map(driver => enhanceDriverWithTierInfo(driver)); // Enhance with tier info

  // Permission checking
  const permissionChecker = new PermissionChecker(currentUser);
  const canEdit = permissionChecker.canUpdate(ResourceType.DRIVERS, currentOrganization?.id);
  const canDelete = permissionChecker.canDelete(ResourceType.DRIVERS, currentOrganization?.id);
  
  const activeDrivers = organizationFilteredDrivers.filter(d => d.status === DriverStatus.ACTIVE).length;
  const totalDrivers = organizationFilteredDrivers.length;
  const inactiveDrivers = organizationFilteredDrivers.filter(d => d.status === DriverStatus.INACTIVE).length;
  const onLeaveDrivers = organizationFilteredDrivers.filter(d => d.status === DriverStatus.ON_LEAVE).length;
  const inTrainingDrivers = organizationFilteredDrivers.filter(d => d.status === DriverStatus.IN_TRAINING).length;

  const filteredDrivers = organizationFilteredDrivers.filter(driver =>
    searchTerm === '' ||
    driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phoneNumber.includes(searchTerm) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const headerActions = (
    <div className="flex items-center gap-4">
      {/* Organizational Level Tabs - only show if we have multiple options */}
      {tabs.length > 1 && (
        <div className="inline-flex rounded-lg border border-[var(--color-neutral)]/30 bg-[var(--color-surface)] p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md",
                  activeTab === tab.id
                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]"
                )}
                title={tab.description}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
      
      {canEdit && (
        <Link href="/drivers/add">
          <Button variant="primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </Link>
      )}
    </div>
  );  return (
    <div className="space-y-6">
      {/* Page Header with Terminal Selector */}
      <PageHeader 
        title="Drivers"
        icon={<Users className="h-8 w-8 text-blue-600" />}
        actions={headerActions}
        showTerminalSelector={false}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Driver Overview Container */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Driver Overview
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Current driver roster and status breakdown
            </p>
          </CardHeader>
          <CardContent className="space-y-4">{/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Drivers */}
              <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                    <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Badge variant="default" className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    Total
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Total Drivers
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                    {totalDrivers}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    all drivers
                  </p>
                </div>
              </div>

              {/* Active Drivers */}
              <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <Badge variant="status" className="text-xs">
                    {totalDrivers > 0 ? ((activeDrivers / totalDrivers) * 100).toFixed(0) : 0}%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                    {activeDrivers}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    ready to drive
                  </p>
                </div>
              </div>

              {/* In Training */}
              <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="status" status="in_training" className="text-xs">
                    Training
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    In Training
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                    {inTrainingDrivers}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    learning skills
                  </p>
                </div>
              </div>

              {/* Other Status (Inactive + On Leave) */}
              <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Badge variant="status" status="inactive" className="text-xs">
                    Other
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Other Status
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                    {inactiveDrivers + onLeaveDrivers}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    inactive & leave
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Quick Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[var(--color-neutral)]/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Inactive
                  </span>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {inactiveDrivers}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    On Leave
                  </span>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {onLeaveDrivers}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TruckIcon className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Assignments
                  </span>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {activeDrivers}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Utilization
                  </span>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {totalDrivers > 0 ? ((activeDrivers / totalDrivers) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>
            
            {/* Search and Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[var(--color-neutral)]/20">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search drivers by name, ID, phone..."
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-neutral)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex border border-[var(--color-neutral)]/30 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                  className={`p-2 rounded-l-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--color-accent)] text-white' 
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List view"
                  className={`p-2 border-l border-[var(--color-neutral)]/30 rounded-r-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[var(--color-accent)] text-white' 
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>            </div>
          </CardContent>
        </Card>

        {/* Drivers List */}
        {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {driver.firstName} {driver.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {driver.id}</p>
                  </div>
                  <Badge variant="status" status={driver.status}>
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {driver.phoneNumber}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Fuel Card: {driver.fuelCard}
                  </div>                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    License: {driver.licenseNumber}
                  </div>
                  {driver.tier && (
                    <div className="flex items-center text-sm">
                      <Award className="h-4 w-4 mr-2 text-[var(--color-accent)]" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(driver.tier)}`}>
                        {getTierDisplayName(driver.tier)}
                      </span>
                    </div>
                  )}
                  {driver.assignedTruckId && (
                    <div className="flex items-center text-sm text-gray-600">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Assigned: {driver.assignedTruckId}
                    </div>
                  )}
                </div>                <div className="pt-2 border-t border-gray-200">
                  {driver.isEligibleForPromotion && (
                    <div className="mb-2">
                      <Button size="sm" variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Recommend Promotion
                      </Button>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Hired: {new Date(driver.hireDate).toLocaleDateString()}
                      {driver.yearsOfExperience && (
                        <span className="block">Experience: {driver.yearsOfExperience} years</span>
                      )}
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/drivers/${driver.id}`}>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </Link>                      {canEdit && (
                        <Link href={`/drivers/${driver.id}`}>
                          <Button size="sm" variant="outline" className="border-theme-primary text-theme-primary hover:bg-theme-accent">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tier</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fuel Card</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">License</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Truck</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (                  <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Hired: {new Date(driver.hireDate).toLocaleDateString()}
                        {driver.yearsOfExperience && (
                          <span className="ml-2">({driver.yearsOfExperience} years)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.id}</td>
                    <td className="py-3 px-4">
                      {driver.tier ? (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(driver.tier)}`}>
                            {getTierDisplayName(driver.tier)}
                          </span>
                          {driver.isEligibleForPromotion && (
                            <Button size="sm" variant="outline" className="text-xs border-green-300 text-green-600 hover:bg-green-50 py-1 px-2">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Promote
                            </Button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No tier</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.phoneNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.fuelCard}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.licenseNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {driver.assignedTruckId ? (
                        <span className="flex items-center">
                          <TruckIcon className="h-4 w-4 mr-1" />
                          {driver.assignedTruckId}
                        </span>                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="status" status={driver.status} size="sm">
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">                        <Link href={`/drivers/${driver.id}`}>
                          <Button size="sm" variant="outline" className="border-theme-primary text-theme-primary hover:bg-theme-accent">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        {canEdit && (
                          <Link href={`/drivers/${driver.id}`}>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Driver Actions - Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Driver Recruitment */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center py-12">
            <div className="text-green-700">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Driver Recruitment</h3>              <p className="text-sm mb-4">
                Manage recruitment pipeline and attract new drivers to join your fleet.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Recruitment Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Driver Management */}
        <Card className="bg-theme-accent border-theme-accent">
          <CardContent className="text-center py-12">
            <div className="text-blue-700">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Driver Management</h3>              <p className="text-sm mb-4">
                Access HR services, training programs, and driver support tools.
              </p>              <Button className="bg-theme-primary hover:bg-theme-secondary text-white">
                <Settings className="h-4 w-4 mr-2" />
                Management Dashboard
              </Button>
            </div>
          </CardContent>        </Card>
      </div>
      </div>
    </div>
  );
}
