'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { 
  Users, 
  Truck, 
  Package, 
  Activity,
  AlertTriangle,
  FileText,
  UserPlus,
  Clock,
  CheckCircle
} from 'lucide-react';
import { DriverStatus, TruckStatus, LoadStatus } from '@/types';

export default function HomePage() {
  const { drivers, trucks, loads } = useData();

  // Calculate stats from live data
  const activeDrivers = drivers.filter(d => d.status === DriverStatus.ACTIVE).length;
  const availableTrucks = trucks.filter(t => t.status === TruckStatus.AVAILABLE || t.status === TruckStatus.IN_USE).length;
  const activeLoads = loads.filter(l => 
    l.status === LoadStatus.ASSIGNED || 
    l.status === LoadStatus.PICKED_UP || 
    l.status === LoadStatus.IN_TRANSIT
  ).length;
  const inTransitLoads = loads.filter(l => l.status === LoadStatus.IN_TRANSIT).length;

  // Get recent loads and events
  const recentLoads = loads
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const recentDrivers = drivers
    .filter(d => d.status === DriverStatus.ACTIVE)
    .slice(0, 5);

  // Get load events for the Load Events section
  const allLoadEvents = loads.flatMap(load => 
    load.events?.map(event => ({ ...event, loadNumber: load.loadNumber })) || []
  );
  const recentEvents = allLoadEvents
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <span className="text-4xl">🚀</span>
          Launch Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to your transportation management platform - propelling your operations forward
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Active Drivers</p>
              <p className="text-lg font-semibold text-gray-700">{activeDrivers}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Available Trucks</p>
              <p className="text-lg font-semibold text-gray-700">{availableTrucks}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Active Loads</p>
              <p className="text-lg font-semibold text-gray-700">{activeLoads}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">In Transit</p>
              <p className="text-lg font-semibold text-gray-700">{inTransitLoads}</p>
            </div>
          </div>
        </Card>
      </div>      {/* New Dashboard Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Load Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Load Events
              </h3>
              <Badge variant="default" className="text-xs">
                {recentEvents.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded border-l-2 border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{event.type.toUpperCase()}</p>
                      <p className="text-xs text-gray-600">{event.loadNumber}</p>
                    </div>
                    <Badge 
                      variant="status" 
                      status={event.resolved ? 'delivered' : 'pending'}
                      className="text-xs"
                    >
                      {event.resolved ? 'Resolved' : 'Open'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No recent events</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Event */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Report Event
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Report an incident or open load issue
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Report Open Load
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Report Incident
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Driver Recruitment */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              Recruitment
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Manage driver recruitment requests
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Request Driver
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                View Applications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Upcoming Tasks
            </h3>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            <div className="p-3 hover:bg-gray-50 rounded border-l-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">Daily Inspection</p>
                  <p className="text-xs text-gray-600">Due Today</p>
                </div>
                <Badge variant="status" status="pending" className="text-xs">Daily</Badge>
              </div>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded border-l-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">Weekly Report</p>
                  <p className="text-xs text-gray-600">Due in 2 days</p>
                </div>
                <Badge variant="status" status="in-transit" className="text-xs">Weekly</Badge>
              </div>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded border-l-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">Monthly Review</p>
                  <p className="text-xs text-gray-600">Due in 1 week</p>
                </div>
                <Badge variant="status" status="delivered" className="text-xs">Monthly</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Loads</h2>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            {recentLoads.length > 0 ? (
              recentLoads.map((load) => (
                <div key={load.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{load.loadNumber}</p>
                    <p className="text-sm text-gray-600">
                      {load.pickupLocation.city}, {load.pickupLocation.state} → {load.deliveryLocation.city}, {load.deliveryLocation.state}
                    </p>
                  </div>
                  <Badge variant="status" status={load.status}>{load.status}</Badge>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No recent loads</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Driver Status</h2>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            {recentDrivers.length > 0 ? (
              recentDrivers.map((driver) => {
                const assignedTruck = trucks.find(t => t.id === driver.assignedTruckId);
                const currentLoad = loads.find(l => l.assignedDriverId === driver.id && 
                  (l.status === LoadStatus.IN_TRANSIT || l.status === LoadStatus.PICKED_UP));
                
                return (
                  <div key={driver.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{driver.firstName} {driver.lastName}</p>
                      <p className="text-sm text-gray-600">
                        {assignedTruck ? `Truck #${assignedTruck.licensePlate}` : 'No truck assigned'}
                        {currentLoad ? ` - Load ${currentLoad.loadNumber}` : ' - Available'}
                      </p>
                    </div>
                    <Badge variant="status" status={driver.status}>{driver.status}</Badge>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No active drivers</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Add New Load</Button>
          <Button variant="outline">Assign Driver</Button>
          <Button variant="outline">Schedule Maintenance</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>
    </div>
  );
}
