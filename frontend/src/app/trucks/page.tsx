'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { TrucksDataTable } from '@/components/ui/TrucksDataTable';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { 
  TruckIcon, 
  CalendarIcon, 
  WrenchScrewdriverIcon,
  UserIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { 
  TruckIcon as TruckIconSolid,
  UserIcon as UserIconSolid,
  WrenchScrewdriverIcon as WrenchIconSolid,
  ExclamationTriangleIcon as AlertIconSolid
} from '@heroicons/react/24/solid';
import { useOrganizational } from '@/context/OrganizationalContext';
import { useData } from '@/context/DataContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { TruckStatus } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

// Modern stat card component with Tailwind UI design
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: React.ReactNode;
  iconColor: string;
  href?: string;
}

function StatCard({ title, value, subtitle, change, icon, iconColor, href }: StatCardProps) {
  const CardWrapper = href ? 'button' : 'div';
  
  return (
    <Card className={cn(
      'transition-all duration-200',
      href && 'hover:shadow-md hover:scale-[1.02] cursor-pointer'
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
            {change && (
              <div className="mt-2 flex items-center text-sm">
                <span className={cn(
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  change.trend === 'up' && 'bg-green-100 text-green-800',
                  change.trend === 'down' && 'bg-red-100 text-red-800',
                  change.trend === 'neutral' && 'bg-gray-100 text-gray-800'
                )}>
                  {change.value}
                </span>
              </div>
            )}
          </div>
          <div className={cn('flex-shrink-0 p-3 rounded-lg', iconColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Truck card component with Tailwind UI design
interface TruckCardProps {
  truck: any;
  onEdit?: () => void;
  onAssign?: () => void;
  onViewDocuments?: () => void;
}

function TruckCard({ truck, onEdit, onAssign, onViewDocuments }: TruckCardProps) {
  const needsMaintenance = new Date(truck.nextMaintenanceDue) < new Date();
  const registrationExpiring = new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const getStatusColor = (status: TruckStatus) => {
    switch (status) {
      case TruckStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case TruckStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case TruckStatus.MAINTENANCE:
        return 'bg-orange-100 text-orange-800';
      case TruckStatus.OUT_OF_SERVICE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/trucks/${truck.id}`}>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
        {/* Status indicator stripe */}
        <div className={cn(
          'absolute inset-x-0 top-0 h-1',
          truck.status === TruckStatus.AVAILABLE && 'bg-green-500',
          truck.status === TruckStatus.ASSIGNED && 'bg-blue-500',
          truck.status === TruckStatus.MAINTENANCE && 'bg-orange-500',
          truck.status === TruckStatus.OUT_OF_SERVICE && 'bg-red-500'
        )} />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                truck.status === TruckStatus.AVAILABLE && 'bg-green-100',
                truck.status === TruckStatus.ASSIGNED && 'bg-blue-100',
                truck.status === TruckStatus.MAINTENANCE && 'bg-orange-100',
                truck.status === TruckStatus.OUT_OF_SERVICE && 'bg-red-100'
              )}>
                <TruckIconSolid className={cn(
                  'h-6 w-6',
                  truck.status === TruckStatus.AVAILABLE && 'text-green-600',
                  truck.status === TruckStatus.ASSIGNED && 'text-blue-600',
                  truck.status === TruckStatus.MAINTENANCE && 'text-orange-600',
                  truck.status === TruckStatus.OUT_OF_SERVICE && 'text-red-600'
                )} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {truck.id}
                </h3>
                <p className="text-sm text-gray-600">{truck.make} {truck.model} • {truck.year}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(truck.status)}>
                {truck.status.charAt(0).toUpperCase() + truck.status.slice(1).replace(/_/g, ' ')}
              </Badge>
              {(needsMaintenance || registrationExpiring) && (
                <Badge className="bg-red-100 text-red-800">
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  Alert
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">          {/* Vehicle Details Grid */}
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">License Plate</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{truck.licensePlate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Color</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{truck.color}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Mileage</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{truck.mileage.toLocaleString()} mi</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">VIN</dt>
              <dd className="mt-1 text-xs font-mono text-gray-900">{truck.vin.slice(-8)}</dd>
            </div>
          </dl>

          {/* Driver Assignment */}
          {truck.assignedDriverId && (
            <div className="flex items-center space-x-2 rounded-lg bg-blue-50 p-3">
              <UserIconSolid className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Assigned Driver</p>
                <p className="text-sm text-blue-700">Driver {truck.assignedDriverId}</p>
              </div>
            </div>
          )}

          {/* Maintenance & Registration Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <WrenchScrewdriverIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Next Maintenance</span>
              </div>
              <span className={cn(
                'text-sm font-medium',
                needsMaintenance ? 'text-red-600' : 'text-gray-900'
              )}>
                {new Date(truck.nextMaintenanceDue).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Registration</span>
              </div>
              <span className={cn(
                'text-sm font-medium',
                registrationExpiring ? 'text-red-600' : 'text-gray-900'
              )}>
                {new Date(truck.registrationExpiry).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              Last Service: {new Date(truck.lastMaintenance).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit?.();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PencilIcon className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  onAssign?.();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CheckIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Truck table row component
function TruckTableRow({ truck }: { truck: any }) {
  const getStatusColor = (status: TruckStatus) => {
    switch (status) {
      case TruckStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case TruckStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case TruckStatus.MAINTENANCE:
        return 'bg-orange-100 text-orange-800';
      case TruckStatus.OUT_OF_SERVICE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <TruckIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{truck.id}</div>
            <div className="text-gray-500">{truck.make} {truck.model} • {truck.year}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
        {truck.licensePlate}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <Badge className={getStatusColor(truck.status)}>
          {truck.status.charAt(0).toUpperCase() + truck.status.slice(1).replace(/_/g, ' ')}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
        {truck.assignedDriverId ? (
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
            Driver {truck.assignedDriverId}
          </div>
        ) : (
          <span className="text-gray-400">Unassigned</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
        {truck.mileage.toLocaleString()} mi
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <PencilIcon className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <CheckIcon className="h-3 w-3 mr-1" />
            Assign
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function TrucksPage() {
  const { currentOrganization, getOrganizationalFilter, getOrganizationsByType } = useOrganizational();
  const { trucks } = useData(); // Use updated DataContext
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [makeFilter, setMakeFilter] = useState<string>('all');
  const [terminalFilter, setTerminalFilter] = useState<string>('all');

  // Get organizational data and filter options
  const terminals = getOrganizationsByType('TERMINAL');
  const availableTerminals = Array.from(new Set(trucks.map(t => t.homeTerminalId).filter(Boolean)));
  const terminalOptions = terminals.filter(t => availableTerminals.includes(t.id));
  
  // Get unique makes for filtering
  const availableMakes = Array.from(new Set(trucks.map(t => t.make).filter(Boolean))).sort();

  // Advanced filtering with multiple criteria
  const filteredTrucks = trucks.filter(truck => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = 
        truck.truckNumber?.toLowerCase().includes(searchLower) ||
        truck.make?.toLowerCase().includes(searchLower) ||
        truck.model?.toLowerCase().includes(searchLower) ||
        truck.plateNumber?.toLowerCase().includes(searchLower) ||
        truck.vin?.toLowerCase().includes(searchLower);
      
      if (!searchMatch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && truck.status !== statusFilter) {
      return false;
    }

    // Make filter
    if (makeFilter !== 'all' && truck.make !== makeFilter) {
      return false;
    }

    // Terminal filter
    if (terminalFilter !== 'all') {
      const truckTerminalId = truck.homeTerminalId || truck.organizationalContext?.terminalId;
      if (truckTerminalId !== terminalFilter) {
        return false;
      }
    }

    return true;
  });
  
  // Calculate comprehensive statistics
  const stats = {
    total: filteredTrucks.length,
    available: filteredTrucks.filter(t => t.status === TruckStatus.AVAILABLE).length,
    assigned: filteredTrucks.filter(t => t.status === TruckStatus.ASSIGNED).length,
    maintenance: filteredTrucks.filter(t => t.status === TruckStatus.MAINTENANCE).length,
    outOfService: filteredTrucks.filter(t => t.status === TruckStatus.OUT_OF_SERVICE).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">      <PageHeader
        title="Fleet Management"
        subtitle="Manage your truck fleet and vehicle assignments"
        actions={
          <div className="flex items-center space-x-3">
            <div className="flex rounded-md shadow-sm">
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Squares2X2Icon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <ListBulletIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Link href="/trucks/add">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Truck
              </Button>
            </Link>
          </div>
        }
      />      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search trucks by number, make, model, plate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by truck status"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>

              {/* Make Filter */}
              <select
                value={makeFilter}
                onChange={(e) => setMakeFilter(e.target.value)}
                aria-label="Filter by truck make"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Makes</option>
                {availableMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
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
                <ListBulletIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Showing {filteredTrucks.length} of {trucks.length} trucks</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                Status: {statusFilter.replace('_', ' ')}
              </span>
            )}
            {makeFilter !== 'all' && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Make: {makeFilter}
              </span>
            )}
            {terminalFilter !== 'all' && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                Terminal: {terminalOptions.find(t => t.id === terminalFilter)?.name}
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
          <StatCard
            title="Total"
            value={stats.total}
            subtitle="Fleet vehicles"
            icon={<TruckIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-gray-500"
          />
          <StatCard
            title="Available"
            value={stats.available}
            subtitle="Ready for dispatch"
            icon={<TruckIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-green-500"
          />
          <StatCard
            title="Assigned"
            value={stats.assigned}
            subtitle="Currently deployed"
            icon={<UserIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Maintenance"
            value={stats.maintenance}
            subtitle="Under maintenance"
            icon={<WrenchIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-yellow-500"
          />
          <StatCard
            title="Out of Service"
            value={stats.outOfService}
            subtitle="Not operational"
            icon={<AlertIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-red-500"          />
        </div>

        {/* Trucks Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrucks.map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onEdit={() => router.push(`/trucks/${truck.id}/edit`)}
                onAssign={() => console.log('Assign driver to truck', truck.id)}
                onViewDocuments={() => console.log('View documents for truck', truck.id)}
              />
            ))}
          </div>
        ) : (
          <TrucksDataTable 
            trucks={filteredTrucks}
            onView={(truck) => router.push(`/trucks/${truck.id}`)}
            onEdit={(truck) => router.push(`/trucks/${truck.id}/edit`)}
            onAssignDriver={(truck) => console.log('Assign driver to truck', truck.id)}
          />
        )}

        {/* Maintenance Alerts Section */}
        {(maintenanceTrucks > 0 || filteredTrucks.some(truck => 
          new Date(truck.nextMaintenanceDue) < new Date() || 
          new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        )) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                <span>Maintenance & Compliance Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTrucks
                  .filter(truck => 
                    new Date(truck.nextMaintenanceDue) < new Date() ||
                    new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  )
                  .map((truck) => {
                    const needsMaintenance = new Date(truck.nextMaintenanceDue) < new Date();
                    const registrationExpiring = new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <div
                        key={truck.id}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg',
                          needsMaintenance ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <AlertIconSolid className={cn(
                            'h-5 w-5',
                            needsMaintenance ? 'text-red-600' : 'text-yellow-600'
                          )} />
                          <div>
                            <p className={cn(
                              'font-medium',
                              needsMaintenance ? 'text-red-900' : 'text-yellow-900'
                            )}>
                              {truck.id} - {truck.make} {truck.model}
                            </p>
                            <p className={cn(
                              'text-sm',
                              needsMaintenance ? 'text-red-700' : 'text-yellow-700'
                            )}>
                              {needsMaintenance 
                                ? `Maintenance overdue since ${new Date(truck.nextMaintenanceDue).toLocaleDateString()}`
                                : `Registration expires ${new Date(truck.registrationExpiry).toLocaleDateString()}`
                              }
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          {needsMaintenance ? 'Schedule Service' : 'Renew Registration'}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
