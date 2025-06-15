import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Users, Plus, Search, Filter, Phone, Mail, MapPin, Truck as TruckIcon } from 'lucide-react';

// Mock driver data
const mockDrivers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    licenseNumber: 'CDL-123456',
    licenseExpiry: '2025-12-15',
    phoneNumber: '(555) 123-4567',
    email: 'john.smith@email.com',
    assignedTruckId: 'TRK-001',
    status: 'active' as const,
    hireDate: '2022-03-15',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    }
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Garcia',
    licenseNumber: 'CDL-789012',
    licenseExpiry: '2026-08-22',
    phoneNumber: '(555) 234-5678',
    email: 'maria.garcia@email.com',
    assignedTruckId: 'TRK-002',
    status: 'active' as const,
    hireDate: '2021-07-10',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '(555) 876-5432',
      relationship: 'Brother'
    }
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    licenseNumber: 'CDL-345678',
    licenseExpiry: '2025-04-30',
    phoneNumber: '(555) 345-6789',
    email: 'robert.johnson@email.com',
    assignedTruckId: undefined,
    status: 'on-break' as const,
    hireDate: '2020-11-05',
    emergencyContact: {
      name: 'Mary Johnson',
      phone: '(555) 765-4321',
      relationship: 'Wife'
    }
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Davis',
    licenseNumber: 'CDL-901234',
    licenseExpiry: '2024-10-18',
    phoneNumber: '(555) 456-7890',
    email: 'sarah.davis@email.com',
    assignedTruckId: 'TRK-004',
    status: 'active' as const,
    hireDate: '2023-01-20',
    emergencyContact: {
      name: 'Tom Davis',
      phone: '(555) 654-3210',
      relationship: 'Husband'
    }
  }
];

export default function DriversPage() {
  const activeDrivers = mockDrivers.filter(d => d.status === 'active').length;
  const totalDrivers = mockDrivers.length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Drivers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your driver roster and assignments
          </p>
        </div>
        <Button className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalDrivers}</div>
            <div className="text-sm text-gray-600">Total Drivers</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeDrivers}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-sm text-gray-600">On Break</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search drivers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drivers List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockDrivers.map((driver) => (
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
                  <Mail className="h-4 w-4 mr-2" />
                  {driver.email}
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
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Empty State for demonstration */}
      <Card className="text-center py-12">
        <div className="text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No more drivers to show</h3>
          <p className="text-sm mb-4">You've reached the end of your driver roster.</p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New Driver
          </Button>
        </div>
      </Card>
    </div>
  );
}
