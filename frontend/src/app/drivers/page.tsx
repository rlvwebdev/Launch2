'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DriversDataTable } from '@/components/ui/DriversDataTable';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { 
  UserGroupIcon,
  UserPlusIcon,
  PhoneIcon,
  CreditCardIcon,
  MapPinIcon,
  TruckIcon,
  EyeIcon,
  PencilIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  UserGroupIcon as UserGroupIconSolid,
  TrophyIcon as TrophyIconSolid
} from '@heroicons/react/24/solid';
import { useOrganizational } from '@/context/OrganizationalContext';
import { useData } from '@/context/DataContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { DriverStatus, ResourceType, OrganizationType, DriverTier } from '@/types';
import { PermissionChecker } from '@/utils/permissions';
import { enhanceDriverWithTierInfo, getTierDisplayName, getTierColor, getPromotionMessage } from '@/utils/driverUtils';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

type OrganizationLevel = 'all' | 'terminal' | 'department' | 'division';

// Modern stat card component for drivers
interface DriverStatCardProps {
  title: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

function DriverStatCard({ title, value, total, icon, color, description }: DriverStatCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <div className="mt-2 flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">of {total}</p>
            </div>            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <ProgressBar 
                    value={value} 
                    max={total} 
                    barClassName={color.replace('bg-', 'bg-')}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{percentage}%</span>
              </div>
            </div>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div className={cn("flex-shrink-0 p-3 rounded-lg", color.replace('bg-', 'bg-').replace('-500', '-100'))}>
            <div className={cn("text-white", color.replace('bg-', 'text-').replace('-100', '-600'))}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Modern driver card component for grid view
interface DriverCardProps {
  driver: any;
  onView: (driver: any) => void;
  onEdit: (driver: any) => void;
}

function DriverCard({ driver, onView, onEdit }: DriverCardProps) {
  const enhancedDriver = enhanceDriverWithTierInfo(driver);
  const tierColor = getTierColor(enhancedDriver.tier || DriverTier.TIER_1);
  const isEligibleForPromotion = enhancedDriver.isEligibleForPromotion;

  const getStatusIcon = (status: DriverStatus) => {
    switch (status) {
      case DriverStatus.ACTIVE:
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case DriverStatus.INACTIVE:
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case DriverStatus.TERMINATED:
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-gray-900 truncate">
                {enhancedDriver.firstName} {enhancedDriver.lastName}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(enhancedDriver.status)}
                <span className="text-sm text-gray-600 capitalize">
                  {enhancedDriver.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onView(driver)}
              className="h-8 w-8 p-0"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(driver)}
              className="h-8 w-8 p-0"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {/* Contact Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <PhoneIcon className="h-4 w-4" />
            <span>{enhancedDriver.phoneNumber}</span>
          </div>
          
          {/* License */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CreditCardIcon className="h-4 w-4" />
            <span>License: {enhancedDriver.licenseNumber}</span>
          </div>          {/* Tier Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="h-4 w-4 text-gray-400" />
              <Badge className={cn('text-xs', tierColor)}>
                {getTierDisplayName(enhancedDriver.tier || DriverTier.TIER_1)}
              </Badge>
            </div>
            <span className="text-xs text-gray-500">
              {enhancedDriver.yearsOfExperience?.toFixed(1)} years
            </span>
          </div>

          {/* Promotion Eligibility */}
          {isEligibleForPromotion && (
            <div className="pt-3 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                Recommend Promotion
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Modern driver row component for list view
function DriverRow({ driver, onView, onEdit }: DriverCardProps) {
  const enhancedDriver = enhanceDriverWithTierInfo(driver);
  const tierColor = getTierColor(enhancedDriver.tier || DriverTier.TIER_1);
  const isEligibleForPromotion = enhancedDriver.isEligibleForPromotion;

  const getStatusBadge = (status: DriverStatus) => {
    const baseClasses = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";
    switch (status) {
      case DriverStatus.ACTIVE:
        return `${baseClasses} bg-green-100 text-green-800`;
      case DriverStatus.INACTIVE:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case DriverStatus.TERMINATED:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
              <UserGroupIcon className="h-5 w-5 text-accent-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {enhancedDriver.firstName} {enhancedDriver.lastName}
            </div>
            <div className="text-sm text-gray-500">{enhancedDriver.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getStatusBadge(enhancedDriver.status)}>
          {enhancedDriver.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {enhancedDriver.phoneNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {enhancedDriver.licenseNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">          <Badge className={cn('text-xs', tierColor)}>
            {getTierDisplayName(enhancedDriver.tier || DriverTier.TIER_1)}
          </Badge>
          <span className="text-xs text-gray-500">
            ({enhancedDriver.yearsOfExperience?.toFixed(1)}y)
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isEligibleForPromotion ? (
          <Button 
            variant="outline" 
            size="xs"
            className="text-amber-700 border-amber-300 hover:bg-amber-50"
          >
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            Promote
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onView(driver)}
            className="text-accent-600 hover:text-accent-900"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(driver)}
            className="text-accent-600 hover:text-accent-900"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function DriversPage() {
  const { currentOrganization, currentUser, getOrganizationalFilter, getOrganizationsByType, setCurrentOrganization } = useOrganizational();
  const { drivers } = useData(); // Use the updated DataContext
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [terminalFilter, setTerminalFilter] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Get organizational data
  const terminals = getOrganizationsByType(OrganizationType.TERMINAL);
  const departments = getOrganizationsByType(OrganizationType.DEPARTMENT);
  const divisions = getOrganizationsByType(OrganizationType.DIVISION);
  
  // Get unique terminals from drivers for filtering
  const availableTerminals = Array.from(new Set(drivers.map(d => d.homeTerminalId).filter(Boolean)));
  const terminalOptions = terminals.filter(t => availableTerminals.includes(t.id));
  // Advanced filtering with multiple criteria
  const filteredDrivers = drivers.filter(driver => {
    // Search filter - check name, phone, license, email
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = 
        driver.firstName?.toLowerCase().includes(searchLower) ||
        driver.lastName?.toLowerCase().includes(searchLower) ||
        driver.phoneNumber?.includes(searchTerm) ||
        driver.licenseNumber?.toLowerCase().includes(searchLower) ||
        (driver.email && driver.email.toLowerCase().includes(searchLower));
      
      if (!searchMatch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && driver.status !== statusFilter) {
      return false;
    }

    // Tier filter
    if (tierFilter !== 'all' && driver.tier !== tierFilter) {
      return false;
    }

    // Terminal filter
    if (terminalFilter !== 'all') {
      const driverTerminalId = driver.homeTerminalId || driver.organizationalContext?.terminalId;
      if (driverTerminalId !== terminalFilter) {
        return false;
      }
    }

    return true;
  });

  // Calculate comprehensive statistics
  const stats = {
    total: filteredDrivers.length,
    active: filteredDrivers.filter(d => d.status === DriverStatus.ACTIVE).length,
    inactive: filteredDrivers.filter(d => d.status === DriverStatus.INACTIVE).length,
    onLeave: filteredDrivers.filter(d => d.status === DriverStatus.ON_LEAVE).length,
    training: filteredDrivers.filter(d => d.trainingStatus === 'in_progress').length,
    eligible: filteredDrivers.filter(d => d.isEligibleForPromotion).length,
    tier1: filteredDrivers.filter(d => d.tier === 'tier_1').length,
    tier2: filteredDrivers.filter(d => d.tier === 'tier_2').length,
    tier3: filteredDrivers.filter(d => d.tier === 'tier_3').length,
    tier4: filteredDrivers.filter(d => d.tier === 'tier_4').length,
  };

  const handleViewDriver = (driver: any) => {
    setSelectedDriver(driver);
    setIsViewModalOpen(true);
  };

  const handleEditDriver = (driver: any) => {
    // Navigate to edit page or open edit modal
    window.location.href = `/drivers/${driver.id}/edit`;
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleFilter = () => {
    // Open filter modal
    console.log('Filter clicked');
  };

  const handleViewChange = (view: 'list' | 'grid') => {
    setViewMode(view);
  };

  return (
    <div className="space-y-8">      <PageHeader
        title="Drivers"
        subtitle={`Managing ${stats.total} drivers across the organization`}
        icon={<UserGroupIconSolid className="h-6 w-6" />}
        showTerminalSelector={true}
        actions={
          <Button>
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        }
      />      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search drivers by name, phone, license..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by driver status"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
                <option value="terminated">Terminated</option>
                <option value="in_training">In Training</option>
              </select>

              {/* Tier Filter */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                aria-label="Filter by driver tier"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Tiers</option>
                <option value="tier_1">Tier 1 (0-2 years)</option>
                <option value="tier_2">Tier 2 (2-4 years)</option>
                <option value="tier_3">Tier 3 (5-8 years)</option>
                <option value="tier_4">Tier 4 (8+ years)</option>
              </select>

              {/* Terminal Filter */}
              <select
                value={terminalFilter}
                onChange={(e) => setTerminalFilter(e.target.value)}
                aria-label="Filter by terminal"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Terminals</option>
                {terminalOptions.map((terminal) => (
                  <option key={terminal.id} value={terminal.id}>
                    {terminal.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Showing {filteredDrivers.length} of {drivers.length} drivers</span>            {searchTerm && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                Status: {statusFilter.replace('_', ' ')}
              </span>
            )}
            {tierFilter !== 'all' && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {tierFilter.replace('_', ' ').toUpperCase()}
              </span>
            )}
            {terminalFilter !== 'all' && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                Terminal: {terminalOptions.find(t => t.id === terminalFilter)?.name}
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
          <DriverStatCard
            title="Total"
            value={stats.total}
            total={stats.total}
            icon={<UserGroupIcon className="h-5 w-5" />}
            color="bg-blue-500"
          />
          <DriverStatCard
            title="Active"
            value={stats.active}
            total={stats.total}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            color="bg-green-500"
          />
          <DriverStatCard
            title="Tier 1"
            value={stats.tier1}
            total={stats.total}
            icon={<TrophyIcon className="h-5 w-5" />}
            color="bg-gray-500"
          />
          <DriverStatCard
            title="Tier 2"
            value={stats.tier2}
            total={stats.total}
            icon={<TrophyIcon className="h-5 w-5" />}
            color="bg-bronze-500"
          />
          <DriverStatCard
            title="Tier 3"
            value={stats.tier3}
            total={stats.total}
            icon={<TrophyIcon className="h-5 w-5" />}
            color="bg-silver-500"
          />
          <DriverStatCard
            title="Tier 4"
            value={stats.tier4}
            total={stats.total}
            icon={<TrophyIconSolid className="h-5 w-5" />}
            color="bg-amber-500"
          />
        </div>{/* Drivers Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onView={handleViewDriver}
                onEdit={handleEditDriver}
              />
            ))}
          </div>
        ) : (
          <DriversDataTable 
            drivers={filteredDrivers}
            onView={(driver) => handleViewDriver(driver)}
            onEdit={(driver) => handleEditDriver(driver)}
          />
        )}

        {filteredDrivers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No drivers found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first driver.'}
              </p>
              <div className="mt-6">
                <Button>
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Driver Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedDriver ? `${selectedDriver.firstName} ${selectedDriver.lastName}` : ''}
        size="lg"
      >
        <ModalBody>
          {selectedDriver && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDriver.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDriver.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDriver.licenseNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedDriver.status.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          <Button onClick={() => handleEditDriver(selectedDriver)}>
            Edit Driver
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
