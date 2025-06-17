'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Users, UserPlus, Search, Filter, Phone, CreditCard, MapPin, Truck as TruckIcon, Grid3X3, List, Eye, Edit, Settings } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function DriversPage() {
  const { drivers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const totalDrivers = drivers.length;
  const inTrainingDrivers = drivers.filter(d => d.status === 'in-training').length;
  const oosDrivers = drivers.filter(d => d.status === 'oos').length;

  const filteredDrivers = drivers.filter(driver =>
    searchTerm === '' ||
    driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phoneNumber.includes(searchTerm) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (    <div className="p-4 md:p-6 space-y-6">
      {/* Header with Add Button and View Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Drivers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your driver roster and assignments
          </p>
        </div>        <div className="flex items-center gap-2">          <Button variant="primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Compact Stats and Search */}
      <Card>
        <CardContent className="p-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalDrivers}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeDrivers}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{inTrainingDrivers}</div>
              <div className="text-sm text-gray-600">In Training</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{oosDrivers}</div>
              <div className="text-sm text-gray-600">OOS</div>
            </div>
          </div>
            {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search drivers by name, ID, phone..."
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
      </Card>{/* Drivers List */}
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
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    License: {driver.licenseNumber}
                  </div>
                  {driver.assignedTruckId && (
                    <div className="flex items-center text-sm text-gray-600">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Assigned: {driver.assignedTruckId}
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Hired: {new Date(driver.hireDate).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fuel Card</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">License</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Truck</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Hired: {new Date(driver.hireDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.phoneNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.fuelCard}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.licenseNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {driver.assignedTruckId ? (
                        <span className="flex items-center">
                          <TruckIcon className="h-4 w-4 mr-1" />
                          {driver.assignedTruckId}
                        </span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="status" status={driver.status} size="sm">
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}{/* Driver Actions - Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Driver Recruitment */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center py-12">
            <div className="text-green-700">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Driver Recruitment</h3>
              <p className="text-sm mb-4">
                Manage recruitment pipeline and attract new drivers to join your fleet.
              </p>              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Recruitment Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Driver Management */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="text-center py-12">
            <div className="text-blue-700">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Driver Management</h3>
              <p className="text-sm mb-4">
                Access HR services, training programs, and driver support tools.
              </p>              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Management Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
