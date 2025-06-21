'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BadgeLegacy from '@/components/ui/BadgeLegacy';

const Badge = BadgeLegacy;
import { Truck, Calendar, Wrench, User, AlertTriangle, FileText, Edit, UserCheck, Building, Truck as TruckIcon } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { useData } from '@/context/DataContext';
import { TruckStatus } from '@/types';
import PageHeader from '@/components/layout/PageHeader';

export default function TrucksPage() {
  const { currentOrganization, getOrganizationalFilter } = useOrganizational();
  const { trucks } = useData();
  const router = useRouter();  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  // Handle local search functionality
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // Handle view mode changes
  const handleViewChange = (view: 'list' | 'grid') => {
    setViewMode(view);
  };

  // Handle filter functionality
  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked');
  };

  // Get organizational filter for current context
  const organizationalFilter = getOrganizationalFilter();

  // Filter data by selected terminal/organization first
  const organizationFilteredTrucks = trucks.filter(truck => {
    if (!truck.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return truck.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return truck.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return truck.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return truck.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true; // Show all if no filter
  });
  
  const availableTrucks = organizationFilteredTrucks.filter(t => t.status === TruckStatus.AVAILABLE).length;
  const inUseTrucks = organizationFilteredTrucks.filter(t => t.status === TruckStatus.ASSIGNED).length;
  const maintenanceTrucks = organizationFilteredTrucks.filter(t => t.status === TruckStatus.MAINTENANCE).length;
  const totalTrucks = organizationFilteredTrucks.length;

  const filteredTrucks = organizationFilteredTrucks.filter(truck =>
    searchTerm === '' ||
    truck.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );  return (
    <div className="space-y-6">      {/* Page Header with Terminal Selector */}      <PageHeader
        title="Trucks"
        subtitle="Manage your fleet and vehicle assignments"
        icon={<Truck className="h-8 w-8 text-blue-600" />}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/trucks/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Add Truck
            </Link>
          </div>
        }
      />

      <div className="p-4 md:p-6 pt-0">      {/* Truck Overview Container */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
              <TruckIcon className="w-5 h-5" />
              Fleet Overview
            </h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Current truck fleet status and availability
          </p>
        </CardHeader>
          <CardContent className="space-y-4">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Trucks */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                  <TruckIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <Badge variant="default" className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  Total
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Total Trucks
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  {totalTrucks}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  entire fleet
                </p>
              </div>
            </div>

            {/* Available */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <TruckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Badge variant="status" status="available" className="text-xs">
                  {totalTrucks > 0 ? ((availableTrucks / totalTrucks) * 100).toFixed(0) : 0}%
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Available
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  {availableTrucks}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  ready for dispatch
                </p>
              </div>
            </div>

            {/* In Use */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TruckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="status" status="in_use" className="text-xs">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  In Use
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  {inUseTrucks}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  currently deployed
                </p>
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <TruckIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge variant="status" status="maintenance" className="text-xs">
                  Service
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Maintenance
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  {maintenanceTrucks}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  under service
                </p>              </div>
            </div>
          </div>

          {/* Additional Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[var(--color-neutral)]/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <User className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Assigned
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {inUseTrucks}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wrench className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Service Due
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {maintenanceTrucks}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TruckIcon className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Fleet Size
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {totalTrucks}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TruckIcon className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Utilization
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {totalTrucks > 0 ? (((inUseTrucks + maintenanceTrucks) / totalTrucks) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>{/* Trucks List */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrucks.map((truck) => {
            const needsMaintenance = new Date(truck.nextMaintenanceDue) < new Date();
            const registrationExpiring = new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            
            return (
              <Link key={truck.id} href={`/trucks/${truck.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer"><CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {truck.id}
                    </h3>
                    <p className="text-sm text-gray-600">{truck.make} {truck.model} • {truck.year}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="status" status={truck.status}>
                      {truck.status.charAt(0).toUpperCase() + truck.status.slice(1).replace('-', ' ')}
                    </Badge>
                    {(needsMaintenance || registrationExpiring) && (
                      <Badge variant="default" className="bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Alert
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">License:</span>
                    <div className="font-medium">{truck.licensePlate}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Color:</span>
                    <div className="font-medium">{truck.color}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Mileage:</span>
                    <div className="font-medium">{truck.mileage.toLocaleString()} mi</div>
                  </div>
                  <div>
                    <span className="text-gray-500">VIN:</span>
                    <div className="font-medium text-xs">{truck.vin.slice(-6)}</div>
                  </div>
                </div>

                {truck.assignedDriverId && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <User className="h-4 w-4 mr-2" />
                    Assigned to: Driver {truck.assignedDriverId}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Wrench className="h-4 w-4 mr-1" />
                      Next Maintenance:
                    </span>
                    <span className={needsMaintenance ? 'text-red-600 font-medium' : 'text-gray-700'}>
                      {new Date(truck.nextMaintenanceDue).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Registration:
                    </span>
                    <span className={registrationExpiring ? 'text-red-600 font-medium' : 'text-gray-700'}>
                      {new Date(truck.registrationExpiry).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Last Service: {new Date(truck.lastMaintenance).toLocaleDateString()}
                    </span>                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Assign
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                        <FileText className="h-3 w-3 mr-1" />
                        Documents
                      </Button>
                    </div>
                  </div>                </div>
              </CardContent>            </Card>
              </Link>
          );
        })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Truck</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">License</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Mileage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrucks.map((truck) => (
                  <tr key={truck.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {truck.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {truck.make} {truck.model} • {truck.year}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{truck.licensePlate}</td>
                    <td className="py-3 px-4">
                      <Badge variant="status" status={truck.status} size="sm">
                        {truck.status.charAt(0).toUpperCase() + truck.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {truck.assignedDriverId ? (
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Driver {truck.assignedDriverId}
                        </span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{truck.mileage.toLocaleString()} mi</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Maintenance Alerts
          </h3>
        </CardHeader>
        <CardContent>          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-orange-800">2814 - Kenworth T680</p>
                <p className="text-sm text-orange-600">Scheduled maintenance overdue by 5 days</p>
              </div>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">2813A - Peterbilt 579</p>
                <p className="text-sm text-yellow-600">Registration expires in 15 days</p>
              </div>
              <Button size="sm" variant="outline">
                Renew
              </Button>
            </div>
          </div>        </CardContent>
      </Card>
      </div>
    </div>
  );
}
