import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Truck, Plus, Search, Filter, Calendar, Wrench, User, AlertTriangle } from 'lucide-react';

// Mock truck data
const mockTrucks = [
  {
    id: 'TRK-001',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2021,
    licensePlate: 'TMO-001',
    vin: '1FUJGHDV8MLBX4501',
    color: 'White',
    assignedDriverId: '1',
    assignedDriverName: 'John Smith',
    status: 'in-use' as const,
    mileage: 145000,
    lastMaintenance: '2024-05-15',
    nextMaintenanceDue: '2024-08-15',
    registrationExpiry: '2025-06-30',
    insuranceExpiry: '2025-12-31'
  },
  {
    id: 'TRK-002',
    make: 'Peterbilt',
    model: '579',
    year: 2020,
    licensePlate: 'TMO-002',
    vin: '1XPWD40X1ED123456',
    color: 'Blue',
    assignedDriverId: '2',
    assignedDriverName: 'Maria Garcia',
    status: 'in-use' as const,
    mileage: 189000,
    lastMaintenance: '2024-04-20',
    nextMaintenanceDue: '2024-07-20',
    registrationExpiry: '2025-03-15',
    insuranceExpiry: '2025-12-31'
  },
  {
    id: 'TRK-003',
    make: 'Kenworth',
    model: 'T680',
    year: 2019,
    licensePlate: 'TMO-003',
    vin: '1XKWD40X9EJ654321',
    color: 'Red',
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    status: 'maintenance' as const,
    mileage: 234000,
    lastMaintenance: '2024-06-01',
    nextMaintenanceDue: '2024-06-15',
    registrationExpiry: '2025-09-20',
    insuranceExpiry: '2025-12-31'
  },
  {
    id: 'TRK-004',
    make: 'Volvo',
    model: 'VNL 760',
    year: 2022,
    licensePlate: 'TMO-004',
    vin: '4V4NC9EJ5EN123789',
    color: 'Silver',
    assignedDriverId: '4',
    assignedDriverName: 'Sarah Davis',
    status: 'available' as const,
    mileage: 98000,
    lastMaintenance: '2024-05-30',
    nextMaintenanceDue: '2024-08-30',
    registrationExpiry: '2025-11-10',
    insuranceExpiry: '2025-12-31'
  }
];

export default function TrucksPage() {
  const availableTrucks = mockTrucks.filter(t => t.status === 'available').length;
  const inUseTrucks = mockTrucks.filter(t => t.status === 'in-use').length;
  const maintenanceTrucks = mockTrucks.filter(t => t.status === 'maintenance').length;
  const totalTrucks = mockTrucks.length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-8 w-8 text-green-600" />
            Trucks
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your fleet and maintenance schedules
          </p>
        </div>
        <Button className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Truck
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTrucks}</div>
            <div className="text-sm text-gray-600">Total Fleet</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{availableTrucks}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{inUseTrucks}</div>
            <div className="text-sm text-gray-600">In Use</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{maintenanceTrucks}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
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
                placeholder="Search trucks by ID, make, model..."
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

      {/* Trucks List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTrucks.map((truck) => {
          const needsMaintenance = new Date(truck.nextMaintenanceDue) < new Date();
          const registrationExpiring = new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          
          return (
            <Card key={truck.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {truck.make} {truck.model}
                    </h3>
                    <p className="text-sm text-gray-600">{truck.id} • {truck.year}</p>
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

                {truck.assignedDriverName && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <User className="h-4 w-4 mr-2" />
                    Assigned to: {truck.assignedDriverName}
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
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Assign</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Maintenance Alerts
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-orange-800">TRK-003 - Kenworth T680</p>
                <p className="text-sm text-orange-600">Scheduled maintenance overdue by 5 days</p>
              </div>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">TRK-002 - Peterbilt 579</p>
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
