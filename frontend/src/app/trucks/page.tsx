'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Truck, Search, Filter, Calendar, Wrench, User, AlertTriangle, FileText, Edit, UserCheck, List, Grid3X3, Building } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { TruckStatus } from '@/types';

export default function TrucksPage() {
  const { currentOrganization } = useOrganizational();
  const { trucks } = useOrganizationalData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  const availableTrucks = trucks.filter(t => t.status === TruckStatus.AVAILABLE).length;
  const inUseTrucks = trucks.filter(t => t.status === TruckStatus.ASSIGNED).length;
  const maintenanceTrucks = trucks.filter(t => t.status === TruckStatus.MAINTENANCE).length;
  const totalTrucks = trucks.length;

  const filteredTrucks = trucks.filter(truck =>
    searchTerm === '' ||
    truck.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with Add Button and View Toggle */}
      <div className="flex justify-between items-center">
        <div>          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            Trucks
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">
              Manage your fleet and vehicle assignments
            </p>            {currentOrganization && (
              <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
                <Building className="h-4 w-4" />
                <span>{currentOrganization.name}</span>
              </div>
            )}
          </div>        </div>        <div className="flex items-center gap-2">
        </div>
      </div>      {/* Compact Stats and Search */}
      <Card>
        <CardContent className="p-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalTrucks}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availableTrucks}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{inUseTrucks}</div>
              <div className="text-sm text-gray-600">In Use</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{maintenanceTrucks}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </div>
          </div>
            {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search trucks by ID, make, model..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>            <Button variant="primary">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid view"
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List view"
                className={`p-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>      {/* Trucks List */}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
