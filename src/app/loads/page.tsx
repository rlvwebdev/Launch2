import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Package, Plus, Search, Filter, MapPin, Calendar, AlertTriangle, Clock, FileText } from 'lucide-react';

// Mock loads data with events
const mockLoads = [
  {
    id: 'LD-001',
    loadNumber: 'LOAD-2024-001',
    pickupLocation: {
      address: '1234 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    deliveryLocation: {
      address: '5678 Commerce Ave',
      city: 'Detroit',
      state: 'MI', 
      zipCode: '48201'
    },
    assignedDriverId: '1',
    assignedDriverName: 'John Smith',
    assignedTruckId: 'TRK-001',
    status: 'in-transit' as const,
    cargoDescription: 'Electronic Equipment',
    weight: 42000,
    pickupDate: '2024-06-14T08:00:00',
    deliveryDate: '2024-06-15T16:00:00',
    rate: 2500,
    events: [
      {
        id: 'EVT-001',
        type: 'inspection' as const,
        description: 'DOT inspection completed successfully',
        timestamp: '2024-06-14T10:30:00',
        severity: 'low' as const,
        resolved: true
      }
    ]
  },
  {
    id: 'LD-002',
    loadNumber: 'LOAD-2024-002', 
    pickupLocation: {
      address: '9876 Harbor Dr',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001'
    },
    deliveryLocation: {
      address: '2468 Distribution Way',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201'
    },
    assignedDriverId: '2',
    assignedDriverName: 'Maria Garcia',
    assignedTruckId: 'TRK-002',
    status: 'delivered' as const,
    cargoDescription: 'Food Products',
    weight: 38500,
    pickupDate: '2024-06-13T06:00:00',
    deliveryDate: '2024-06-13T18:00:00',
    rate: 1800,
    events: []
  },
  {
    id: 'LD-003',
    loadNumber: 'LOAD-2024-003',
    pickupLocation: {
      address: '1357 Port Rd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    },
    deliveryLocation: {
      address: '8642 Logistics Pkwy',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301'
    },
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    assignedTruckId: undefined,
    status: 'pending' as const,
    cargoDescription: 'Medical Supplies',
    weight: 15000,
    pickupDate: '2024-06-16T07:00:00',
    deliveryDate: '2024-06-16T20:00:00',
    rate: 3200,
    events: []
  },
  {
    id: 'LD-004',
    loadNumber: 'LOAD-2024-004',
    pickupLocation: {
      address: '4321 Factory St',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001'
    },
    deliveryLocation: {
      address: '7890 Warehouse Ln',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: '89101'
    },
    assignedDriverId: '4',
    assignedDriverName: 'Sarah Davis',
    assignedTruckId: 'TRK-004',
    status: 'picked-up' as const,
    cargoDescription: 'Construction Materials',
    weight: 47500,
    pickupDate: '2024-06-15T05:00:00',
    deliveryDate: '2024-06-15T22:00:00',
    rate: 2100,
    events: [
      {
        id: 'EVT-002',
        type: 'delay' as const,
        description: 'Traffic delay due to road construction',
        timestamp: '2024-06-15T14:30:00',
        severity: 'medium' as const,
        resolved: true
      }
    ]
  }
];

export default function LoadsPage() {
  const pendingLoads = mockLoads.filter(l => l.status === 'pending').length;
  const inTransitLoads = mockLoads.filter(l => l.status === 'in-transit').length;
  const deliveredLoads = mockLoads.filter(l => l.status === 'delivered').length;
  const totalLoads = mockLoads.length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-purple-600" />
            Loads
          </h1>
          <p className="text-gray-600 mt-1">
            Manage shipments and track delivery status
          </p>
        </div>
        <Button className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Load
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalLoads}</div>
            <div className="text-sm text-gray-600">Total Loads</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{pendingLoads}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{inTransitLoads}</div>
            <div className="text-sm text-gray-600">In Transit</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{deliveredLoads}</div>
            <div className="text-sm text-gray-600">Delivered</div>
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
                placeholder="Search loads by number, origin, destination..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loads List */}
      <div className="space-y-4">
        {mockLoads.map((load) => {
          const hasEvents = load.events.length > 0;
          const hasAlerts = load.events.some(e => e.severity === 'high' || e.severity === 'critical');
          
          return (
            <Card key={load.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {load.loadNumber}
                      </h3>
                      <Badge variant="status" status={load.status}>
                        {load.status.charAt(0).toUpperCase() + load.status.slice(1).replace('-', ' ')}
                      </Badge>
                      {hasAlerts && (
                        <Badge variant="default" className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alert
                        </Badge>
                      )}
                      {hasEvents && !hasAlerts && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Events
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Pickup */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1 text-green-600" />
                          <span className="font-medium">Pickup:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">
                          {load.pickupLocation.city}, {load.pickupLocation.state}
                        </div>
                        <div className="text-xs text-gray-500 ml-5">
                          {new Date(load.pickupDate).toLocaleDateString()} at {new Date(load.pickupDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      
                      {/* Delivery */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1 text-red-600" />
                          <span className="font-medium">Delivery:</span>
                        </div>
                        <div className="text-sm text-gray-900 ml-5">
                          {load.deliveryLocation.city}, {load.deliveryLocation.state}
                        </div>
                        <div className="text-xs text-gray-500 ml-5">
                          {new Date(load.deliveryDate).toLocaleDateString()} at {new Date(load.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right sm:text-left">
                    <div className="text-lg font-bold text-green-600">
                      ${load.rate.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(load.weight / 1000).toFixed(1)}k lbs
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Cargo:</span>
                      <span className="ml-1 font-medium">{load.cargoDescription}</span>
                    </div>
                    {load.assignedDriverName && (
                      <div>
                        <span className="text-gray-500">Driver:</span>
                        <span className="ml-1 font-medium">{load.assignedDriverName}</span>
                      </div>
                    )}
                    {load.assignedTruckId && (
                      <div>
                        <span className="text-gray-500">Truck:</span>
                        <span className="ml-1 font-medium">{load.assignedTruckId}</span>
                      </div>
                    )}
                  </div>

                  {/* Events Section */}
                  {hasEvents && (
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Events:</h4>
                      <div className="space-y-2">
                        {load.events.map((event) => (
                          <div key={event.id} className="flex items-start gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              event.severity === 'critical' ? 'bg-red-600' :
                              event.severity === 'high' ? 'bg-orange-600' :
                              event.severity === 'medium' ? 'bg-yellow-600' :
                              'bg-blue-600'
                            }`} />
                            <div className="flex-1">
                              <div className="text-gray-900">{event.description}</div>
                              <div className="text-gray-500 text-xs">
                                {new Date(event.timestamp).toLocaleString()}
                              </div>
                            </div>
                            {event.resolved && (
                              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                Resolved
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Load ID: {load.id}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Track</Button>
                      {!load.assignedDriverId && (
                        <Button size="sm">Assign</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Events Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Recent Load Events
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Track spills, contamination, NCR reports, and other incidents across all loads.
            Use the Reports button above to generate detailed event histories.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
