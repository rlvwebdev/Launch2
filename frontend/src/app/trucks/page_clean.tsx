'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Truck, Plus, Search, Filter, Calendar, Wrench, User, AlertTriangle, FileText, Edit, List, Grid3X3 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { TruckStatus, Truck as TruckType } from '@/types';

export default function TrucksPage() {
  const router = useRouter();
  const { trucks } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  const availableTrucks = trucks.filter(t => t.status === TruckStatus.AVAILABLE).length;
  const inUseTrucks = trucks.filter(t => t.status === TruckStatus.IN_USE).length;
  const maintenanceTrucks = trucks.filter(t => t.status === TruckStatus.MAINTENANCE).length;
  const totalTrucks = trucks.length;

  // Filter trucks based on search term
  const filteredTrucks = trucks.filter((truck: TruckType) =>
    truck.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeProps = (status: TruckStatus) => {
    return { variant: 'status' as const, status: status };
  };

  const getStatusLabel = (status: TruckStatus) => {
    switch (status) {
      case TruckStatus.AVAILABLE:
        return 'Available';
      case TruckStatus.IN_USE:
        return 'In Use';
      case TruckStatus.MAINTENANCE:
        return 'Maintenance';
      case TruckStatus.OUT_OF_SERVICE:
        return 'Out of Service';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with Add Button and View Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            Trucks
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your fleet and vehicle assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'} rounded-l-lg`}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'} rounded-r-lg`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push('/trucks/add')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Truck
          </Button>
        </div>
      </div>

      {/* Compact Stats and Search */}
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
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trucks List/Grid */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrucks.map((truck) => {
            const needsMaintenance = new Date(truck.nextMaintenanceDue) < new Date();
            const registrationExpiring = new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            
            return (
              <Card key={truck.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                        {truck.id}
                      </h3>
                      <p className="text-sm text-gray-600">{truck.make} {truck.model} • {truck.year}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge {...getStatusBadgeProps(truck.status)}>
                        {getStatusLabel(truck.status)}
                      </Badge>
                      {needsMaintenance && (
                        <Badge variant="status" status="maintenance" size="sm">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Maintenance Due
                        </Badge>
                      )}
                      {registrationExpiring && (
                        <Badge variant="default" size="sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Reg. Expiring
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">License Plate:</span>
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
                        <span className="text-gray-500">Driver:</span>
                        <div className="font-medium">
                          {truck.assignedDriverId ? (
                            <span className="flex items-center text-blue-600">
                              <User className="h-3 w-3 mr-1" />
                              {truck.assignedDriverId}
                            </span>
                          ) : (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Button variant="outline" size="sm" className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200">
                        <Wrench className="h-4 w-4 mr-1" />
                        Maintenance
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-900">Truck ID</th>
                    <th className="text-left p-4 font-medium text-gray-900">Vehicle</th>
                    <th className="text-left p-4 font-medium text-gray-900">License Plate</th>
                    <th className="text-left p-4 font-medium text-gray-900">Driver</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Mileage</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrucks.map((truck) => (
                    <tr key={truck.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                          {truck.id}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{truck.make} {truck.model}</div>
                        <div className="text-sm text-gray-500">{truck.year} • {truck.color}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{truck.licensePlate}</div>
                      </td>
                      <td className="p-4">
                        {truck.assignedDriverId ? (
                          <span className="flex items-center text-blue-600">
                            <User className="h-4 w-4 mr-1" />
                            {truck.assignedDriverId}
                          </span>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge {...getStatusBadgeProps(truck.status)}>
                          {getStatusLabel(truck.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{truck.mileage.toLocaleString()} mi</div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Wrench className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredTrucks.length === 0 && (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trucks found</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? `No trucks match "${searchTerm}"`
                    : 'Get started by adding your first truck'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
