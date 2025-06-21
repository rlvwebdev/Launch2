'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
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
import { TrailerStatus } from '@/types';
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

// Trailer card component with Tailwind UI design
interface TrailerCardProps {
  trailer: any;
  onEdit?: () => void;
  onAssign?: () => void;
  onViewDocuments?: () => void;
}

function TrailerCard({ trailer, onEdit, onAssign, onViewDocuments }: TrailerCardProps) {
  const needsMaintenance = new Date(trailer.nextMaintenanceDue) < new Date();
  const registrationExpiring = new Date(trailer.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const getStatusColor = (status: TrailerStatus) => {
    switch (status) {
      case TrailerStatus.AT_TERMINAL:
        return 'bg-green-100 text-green-800';
      case TrailerStatus.IN_TRANSIT:
        return 'bg-blue-100 text-blue-800';
      case TrailerStatus.OUT_OF_SERVICE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrailerTypeIcon = (type: string) => {
    switch (type) {
      case 'dry_van':
        return <TruckIconSolid className="h-6 w-6" />;
      case 'reefer':
        return <TruckIconSolid className="h-6 w-6 text-blue-600" />;
      case 'flatbed':
        return <TruckIconSolid className="h-6 w-6 text-orange-600" />;
      case 'tank':
        return <TruckIconSolid className="h-6 w-6 text-purple-600" />;
      case 'lowboy':
        return <TruckIconSolid className="h-6 w-6 text-red-600" />;
      default:
        return <TruckIconSolid className="h-6 w-6" />;
    }
  };

  return (
    <Link href={`/trailers/${trailer.id}`}>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
        {/* Status indicator stripe */}
        <div className={cn(
          'absolute inset-x-0 top-0 h-1',
          trailer.status === TrailerStatus.AT_TERMINAL && 'bg-green-500',
          trailer.status === TrailerStatus.IN_TRANSIT && 'bg-blue-500',
          trailer.status === TrailerStatus.OUT_OF_SERVICE && 'bg-red-500'
        )} />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                trailer.status === TrailerStatus.AT_TERMINAL && 'bg-green-100',
                trailer.status === TrailerStatus.IN_TRANSIT && 'bg-blue-100',
                trailer.status === TrailerStatus.OUT_OF_SERVICE && 'bg-red-100'
              )}>
                {getTrailerTypeIcon(trailer.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {trailer.id}
                </h3>
                <p className="text-sm text-gray-600">{trailer.make} {trailer.model} • {trailer.year}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(trailer.status)}>
                {trailer.status.charAt(0).toUpperCase() + trailer.status.slice(1).replace(/_/g, ' ')}
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
        
        <CardContent className="space-y-4">
          {/* Trailer Details Grid */}
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">License Plate</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{trailer.licensePlate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 capitalize">{trailer.type.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Capacity</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{trailer.capacity.toLocaleString()} lbs</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Length</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{trailer.length}&apos;</dd>
            </div>
          </dl>

          {/* Truck Assignment */}
          {trailer.assignedTruckId && (
            <div className="flex items-center space-x-2 rounded-lg bg-blue-50 p-3">
              <TruckIconSolid className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Assigned to</p>
                <p className="text-sm text-blue-700">{trailer.assignedTruckId}</p>
              </div>
            </div>
          )}

          {/* Maintenance Alert */}
          {needsMaintenance && (
            <div className="flex items-center space-x-2 rounded-lg bg-orange-50 p-3">
              <WrenchIconSolid className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900">Maintenance Due</p>
                <p className="text-sm text-orange-700">
                  {new Date(trailer.nextMaintenanceDue).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex space-x-2 pt-3 border-t border-gray-200">
            <button className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <DocumentTextIcon className="h-4 w-4 inline mr-2" />
              Documents
            </button>
            <button className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <WrenchScrewdriverIcon className="h-4 w-4 inline mr-2" />
              Maintenance
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}export default function TrailersPage() {
  const router = useRouter();
  const { currentOrganization, getOrganizationalFilter } = useOrganizational();
  const { trailers } = useOrganizationalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get organizational filter for current context
  const organizationalFilter = getOrganizationalFilter();

  // Filter data by selected terminal/organization first
  const organizationFilteredTrailers = trailers.filter(trailer => {
    if (!trailer.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return trailer.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return trailer.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return trailer.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return trailer.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true; // Show all if no filter
  });

  // Calculate metrics
  const availableTrailers = organizationFilteredTrailers.filter(t => t.status === TrailerStatus.AT_TERMINAL).length;
  const inUseTrailers = organizationFilteredTrailers.filter(t => t.status === TrailerStatus.IN_TRANSIT).length;
  const maintenanceTrailers = organizationFilteredTrailers.filter(t => t.status === TrailerStatus.OUT_OF_SERVICE).length;
  const totalTrailers = organizationFilteredTrailers.length;

  // Apply search filter
  const filteredTrailers = organizationFilteredTrailers.filter(trailer =>
    searchTerm === '' ||
    trailer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title="Trailers"
        subtitle="Manage your trailer fleet and assignments"
        icon={<TruckIcon className="h-8 w-8" />}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/trailers/import')}
              className="hidden sm:flex"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              onClick={() => router.push('/trailers/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Trailer
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Trailers"
            value={totalTrailers}
            subtitle="All trailers in fleet"
            icon={<TruckIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Available"
            value={availableTrailers}
            subtitle="Ready for assignment"
            icon={<CheckIcon className="h-6 w-6 text-white" />}
            iconColor="bg-green-500"
          />
          <StatCard
            title="In Transit"
            value={inUseTrailers}
            subtitle="Currently on delivery"
            icon={<TruckIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Out of Service"
            value={maintenanceTrailers}
            subtitle="Maintenance required"
            icon={<WrenchIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-orange-500"
          />
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search trailers by ID, make, model, type, or license plate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-all',
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-all',
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Filters Button */}
              <Button variant="outline">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredTrailers.length} of {totalTrailers} trailers
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trailers Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrailers.map((trailer) => (
              <TrailerCard key={trailer.id} trailer={trailer} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trailer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTrailers.map((trailer) => (
                      <tr key={trailer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <TruckIconSolid className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {trailer.id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {trailer.make} {trailer.model}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {trailer.type.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={cn(
                            trailer.status === TrailerStatus.AT_TERMINAL && 'bg-green-100 text-green-800',
                            trailer.status === TrailerStatus.IN_TRANSIT && 'bg-blue-100 text-blue-800',
                            trailer.status === TrailerStatus.OUT_OF_SERVICE && 'bg-red-100 text-red-800'
                          )}>
                            {trailer.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trailer.assignedTruckId || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trailer.capacity.toLocaleString()} lbs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/trailers/${trailer.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredTrailers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">No trailers found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm
                  ? `No trailers match your search "${searchTerm}".`
                  : 'Get started by adding your first trailer to the fleet.'}
              </p>
              <div className="mt-6">
                {searchTerm ? (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push('/trailers/add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Trailer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
