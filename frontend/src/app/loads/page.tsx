'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  VideoCameraIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import {
  ArchiveBoxIcon as ArchiveBoxIconSolid,
  TruckIcon as TruckIconSolid,
  CurrencyDollarIcon as DollarIconSolid,
  ExclamationTriangleIcon as AlertIconSolid
} from '@heroicons/react/24/solid';
import { useOrganizational } from '@/context/OrganizationalContext';
import { useData } from '@/context/DataContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import PageHeader from '@/components/layout/PageHeader';
import { LoadStatus } from '@/types';
import { cn } from '@/lib/utils';

type SortField = 'loadNumber' | 'shipper' | 'pickupDate' | 'deliveryDate' | 'status' | 'rate';
type SortDirection = 'asc' | 'desc';

// Modern stat card component
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
}

function StatCard({ title, value, subtitle, change, icon, iconColor }: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
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

// Load card component
interface LoadCardProps {
  load: any;
  drivers: any[];
  trucks: any[];
}

function LoadCard({ load, drivers, trucks }: LoadCardProps) {
  const getStatusColor = (status: LoadStatus) => {
    switch (status) {
      case LoadStatus.PENDING:
        return 'bg-gray-100 text-gray-800';
      case LoadStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case LoadStatus.IN_TRANSIT:
        return 'bg-purple-100 text-purple-800';
      case LoadStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case LoadStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: LoadStatus) => {
    switch (status) {
      case LoadStatus.PENDING:
        return <DocumentTextIcon className="h-4 w-4" />;
      case LoadStatus.ASSIGNED:
        return <TruckIcon className="h-4 w-4" />;
      case LoadStatus.IN_TRANSIT:
        return <MapPinIcon className="h-4 w-4" />;
      case LoadStatus.DELIVERED:
        return <CheckIcon className="h-4 w-4" />;
      case LoadStatus.CANCELLED:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const assignedDriver = drivers.find(d => d.id === load.assignedDriverId);
  const assignedTruck = trucks.find(t => t.id === load.assignedTruckId);

  return (
    <Link href={`/loads/${load.id}`}>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">        {/* Status indicator stripe */}
        <div className={cn(
          'absolute inset-x-0 top-0 h-1',
          load.status === LoadStatus.PENDING && 'bg-gray-500',
          load.status === LoadStatus.ASSIGNED && 'bg-blue-500',
          load.status === LoadStatus.IN_TRANSIT && 'bg-purple-500',
          load.status === LoadStatus.DELIVERED && 'bg-green-500',
          load.status === LoadStatus.CANCELLED && 'bg-red-500'
        )} />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                load.status === LoadStatus.PENDING && 'bg-gray-100',
                load.status === LoadStatus.ASSIGNED && 'bg-blue-100',
                load.status === LoadStatus.IN_TRANSIT && 'bg-purple-100',
                load.status === LoadStatus.DELIVERED && 'bg-green-100',
                load.status === LoadStatus.CANCELLED && 'bg-red-100'
              )}>
                <ArchiveBoxIconSolid className={cn(
                  'h-6 w-6',
                  load.status === LoadStatus.PENDING && 'text-gray-600',
                  load.status === LoadStatus.ASSIGNED && 'text-blue-600',
                  load.status === LoadStatus.IN_TRANSIT && 'text-purple-600',
                  load.status === LoadStatus.DELIVERED && 'text-green-600',
                  load.status === LoadStatus.CANCELLED && 'text-red-600'
                )} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {load.loadNumber}
                </h3>
                <p className="text-sm text-gray-600">{load.shipper}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(load.status)}>
                <span className="flex items-center space-x-1">
                  {getStatusIcon(load.status)}
                  <span>{load.status.charAt(0).toUpperCase() + load.status.slice(1).replace(/_/g, ' ')}</span>
                </span>
              </Badge>
              {load.rate && (
                <span className="text-sm font-semibold text-green-600">
                  ${typeof load.rate === 'number' ? load.rate.toLocaleString() : load.rate}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Route Information */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="h-8 w-0.5 mx-auto bg-gray-300 mt-1"></div>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{load.origin}</p>
                  <p className="text-xs text-gray-500">
                    Pickup: {load.pickupDate instanceof Date 
                      ? load.pickupDate.toLocaleDateString() 
                      : typeof load.pickupDate === 'string' 
                        ? new Date(load.pickupDate).toLocaleDateString()
                        : 'TBD'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{load.destination}</p>
                  <p className="text-xs text-gray-500">
                    Delivery: {load.deliveryDate instanceof Date 
                      ? load.deliveryDate.toLocaleDateString() 
                      : typeof load.deliveryDate === 'string' 
                        ? new Date(load.deliveryDate).toLocaleDateString()
                        : 'TBD'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          {(assignedDriver || assignedTruck) && (
            <div className="space-y-2">
              {assignedDriver && (
                <div className="flex items-center space-x-2 rounded-lg bg-blue-50 p-2">
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    Driver: {assignedDriver.firstName} {assignedDriver.lastName}
                  </span>
                </div>
              )}
              {assignedTruck && (
                <div className="flex items-center space-x-2 rounded-lg bg-green-50 p-2">
                  <TruckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-900">
                    Truck: {assignedTruck.id}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Load Details */}
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Distance</dt>
              <dd className="text-gray-900">{load.distance} mi</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Weight</dt>
              <dd className="text-gray-900">{load.weight?.toLocaleString()} lbs</dd>
            </div>
          </dl>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              Created: {load.createdAt instanceof Date 
                ? load.createdAt.toLocaleDateString() 
                : new Date().toLocaleDateString()
              }
            </span>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Edit load', load.id);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Assign load', load.id);
                }}
              >
                Assign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Load table row component
function LoadTableRow({ load, drivers, trucks }: { load: any; drivers: any[]; trucks: any[] }) {
  const getStatusColor = (status: LoadStatus) => {
    switch (status) {
      case LoadStatus.PENDING:
        return 'bg-gray-100 text-gray-800';
      case LoadStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case LoadStatus.IN_TRANSIT:
        return 'bg-purple-100 text-purple-800';
      case LoadStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case LoadStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const assignedDriver = drivers.find(d => d.id === load.assignedDriverId);
  const assignedTruck = trucks.find(t => t.id === load.assignedTruckId);

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <ArchiveBoxIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{load.loadNumber}</div>
            <div className="text-gray-500">{load.shipper}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <div className="text-gray-900">{load.origin}</div>
        <div className="text-gray-500">to {load.destination}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
        {load.pickupDate instanceof Date 
          ? load.pickupDate.toLocaleDateString() 
          : typeof load.pickupDate === 'string' 
            ? new Date(load.pickupDate).toLocaleDateString()
            : 'TBD'
        }
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
        {load.deliveryDate instanceof Date 
          ? load.deliveryDate.toLocaleDateString() 
          : typeof load.deliveryDate === 'string' 
            ? new Date(load.deliveryDate).toLocaleDateString()
            : 'TBD'
        }
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <Badge className={getStatusColor(load.status)}>
          {load.status.charAt(0).toUpperCase() + load.status.slice(1).replace(/_/g, ' ')}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-semibold">
        {load.rate ? `$${typeof load.rate === 'number' ? load.rate.toLocaleString() : load.rate}` : 'TBD'}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            Edit
          </Button>
          <Button size="sm" variant="outline">
            Assign
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function LoadsPage() {
  const { currentOrganization, getOrganizationalFilter, getOrganizationsByType } = useOrganizational();
  const { loads, drivers, trucks } = useData(); // Use updated DataContext
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [terminalFilter, setTerminalFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('pickupDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Get organizational data and filter options
  const terminals = getOrganizationsByType('TERMINAL');
  const availableTerminals = Array.from(new Set(loads.map(l => l.organizationalContext?.terminalId).filter(Boolean)));
  const terminalOptions = terminals.filter(t => availableTerminals.includes(t.id));

  // Advanced filtering with multiple criteria
  const filteredLoads = loads.filter(load => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = 
        load.loadNumber?.toLowerCase().includes(searchLower) ||
        load.shipper?.toLowerCase().includes(searchLower) ||
        load.consignee?.toLowerCase().includes(searchLower) ||
        load.pickupAddress?.toLowerCase().includes(searchLower) ||
        load.deliveryAddress?.toLowerCase().includes(searchLower) ||
        load.commodity?.toLowerCase().includes(searchLower);
      
      if (!searchMatch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && load.status !== statusFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const pickupDate = new Date(load.pickupDate);
      
      switch (dateFilter) {
        case 'today':
          if (pickupDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'this_week':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          if (pickupDate < weekStart) return false;
          break;
        case 'this_month':
          if (pickupDate.getMonth() !== now.getMonth() || pickupDate.getFullYear() !== now.getFullYear()) return false;
          break;
      }
    }

    // Terminal filter
    if (terminalFilter !== 'all') {
      const loadTerminalId = load.organizationalContext?.terminalId;
      if (loadTerminalId !== terminalFilter) {
        return false;
      }
    }

    return true;
  });

  // Calculate comprehensive statistics
  const stats = {
    total: filteredLoads.length,
    pending: filteredLoads.filter(l => l.status === LoadStatus.PENDING).length,
    assigned: filteredLoads.filter(l => l.status === LoadStatus.ASSIGNED).length,
    inTransit: filteredLoads.filter(l => [LoadStatus.IN_TRANSIT, LoadStatus.PICKED_UP].includes(l.status)).length,
    delivered: filteredLoads.filter(l => l.status === LoadStatus.DELIVERED).length,
    totalRevenue: filteredLoads
      .filter(l => l.status === LoadStatus.DELIVERED)
      .reduce((sum, l) => sum + (typeof l.rate === 'number' ? l.rate : parseFloat(l.rate || '0')), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Load Management"
        subtitle="Manage shipments and freight operations"
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
            <Link href="/loads/add">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Load
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
                  placeholder="Search loads by number, shipper, destination..."
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
                aria-label="Filter by load status"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="picked-up">Picked Up</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                aria-label="Filter by date range"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
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
            <span>Showing {filteredLoads.length} of {loads.length} loads</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                Status: {statusFilter.replace('-', ' ')}
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Date: {dateFilter.replace('_', ' ')}
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
            subtitle="All loads"
            icon={<ArchiveBoxIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-gray-500"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting assignment"
            icon={<DocumentTextIcon className="h-5 w-5 text-white" />}
            iconColor="bg-yellow-500"
          />
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            subtitle="Currently moving"
            icon={<TruckIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            subtitle="Completed"
            icon={<CheckIcon className="h-5 w-5 text-white" />}
            iconColor="bg-green-500"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            subtitle="From delivered loads"
            icon={<DollarIconSolid className="h-5 w-5 text-white" />}
            iconColor="bg-emerald-500"          />
        </div>

        {/* Loads Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLoads.map((load) => (
              <LoadCard
                key={load.id}
                load={load}
                drivers={drivers}
                trucks={trucks}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Load List View
              </h3>
              <div className="space-y-4">
                {filteredLoads.map((load) => (
                  <div key={load.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{load.loadNumber}</h4>
                        <p className="text-sm text-gray-600">{load.shipper} → {load.consignee}</p>
                      </div>
                      <Badge>{load.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>        )}
      </div>
    </div>
  );
}
