'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { AlertTriangle, Plus, Search, Filter, Eye, Edit, Clock, MapPin, User, Truck, Package, Building } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';

// Event interface
interface Event {
  id: string;
  type: 'maintenance' | 'incident' | 'delay' | 'delivery' | 'pickup' | 'inspection' | 'violation' | 'emergency';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  dueDate?: Date;
  location?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  relatedEntities: {
    driverId?: string;
    truckId?: string;
    trailerId?: string;
    loadId?: string;
  };
  reportedBy: string;
  assignedTo?: string;
  organizationalContext: {
    companyId: string;
    divisionId: string;
    departmentId: string;
    terminalId: string;
  };
}

// Demo events data
const demoEvents: Event[] = [
  {
    id: 'EVT001',
    type: 'maintenance',
    title: 'Scheduled Brake Inspection',
    description: 'Routine brake system inspection for truck T001',
    severity: 'medium',
    status: 'open',
    createdAt: new Date('2024-06-15T08:00:00'),
    updatedAt: new Date('2024-06-15T08:00:00'),
    dueDate: new Date('2024-06-20T17:00:00'),
    relatedEntities: {
      truckId: 'T001',
      driverId: 'D001'
    },
    reportedBy: 'Maintenance Scheduler',
    assignedTo: 'Shop Foreman',
    organizationalContext: {
      companyId: 'comp-001',
      divisionId: 'div-001',
      departmentId: 'dept-002',
      terminalId: 'term-001'
    }
  },
  {
    id: 'EVT002',
    type: 'delay',
    title: 'Weather Delay - Load LD250005',
    description: 'Severe weather conditions causing pickup delay at origin',
    severity: 'high',
    status: 'in_progress',
    createdAt: new Date('2024-06-18T06:30:00'),
    updatedAt: new Date('2024-06-18T10:15:00'),
    location: {
      address: '222 Farm Rd',
      city: 'Fresno',
      state: 'CA',
      zipCode: '93701'
    },
    relatedEntities: {
      loadId: 'L005',
      driverId: 'D002',
      truckId: 'T002'
    },
    reportedBy: 'Driver',
    assignedTo: 'Dispatch Manager',
    organizationalContext: {
      companyId: 'comp-001',
      divisionId: 'div-001',
      departmentId: 'dept-001',
      terminalId: 'term-002'
    }
  },
  {
    id: 'EVT003',
    type: 'incident',
    title: 'Minor Vehicle Damage',
    description: 'Minor scrape on trailer during backing maneuver at customer facility',
    severity: 'medium',
    status: 'resolved',
    createdAt: new Date('2024-06-17T14:22:00'),
    updatedAt: new Date('2024-06-18T09:00:00'),
    resolvedAt: new Date('2024-06-18T09:00:00'),
    location: {
      address: '456 Warehouse St',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201'
    },
    relatedEntities: {
      driverId: 'D001',
      truckId: 'T001',
      trailerId: 'TR001',
      loadId: 'L001'
    },
    reportedBy: 'Driver',
    assignedTo: 'Safety Manager',
    organizationalContext: {
      companyId: 'comp-001',
      divisionId: 'div-001',
      departmentId: 'dept-001',
      terminalId: 'term-001'
    }
  },
  {
    id: 'EVT004',
    type: 'violation',
    title: 'DOT Inspection Citation',
    description: 'Citation issued for minor logbook discrepancy during roadside inspection',
    severity: 'high',
    status: 'open',
    createdAt: new Date('2024-06-16T11:45:00'),
    updatedAt: new Date('2024-06-16T11:45:00'),
    dueDate: new Date('2024-06-30T23:59:59'),
    location: {
      address: 'I-35 Mile Marker 234',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    },
    relatedEntities: {
      driverId: 'D003',
      truckId: 'T003'
    },
    reportedBy: 'DOT Inspector',
    assignedTo: 'Compliance Manager',
    organizationalContext: {
      companyId: 'comp-001',
      divisionId: 'div-001',
      departmentId: 'dept-001',
      terminalId: 'term-001'
    }
  },
  {
    id: 'EVT005',
    type: 'delivery',
    title: 'Successful On-Time Delivery',
    description: 'Load LD250006 delivered on schedule to customer facility',
    severity: 'low',
    status: 'closed',
    createdAt: new Date('2024-06-17T16:30:00'),
    updatedAt: new Date('2024-06-17T16:30:00'),
    resolvedAt: new Date('2024-06-17T16:30:00'),
    location: {
      address: '202 Tech Park Blvd',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95101'
    },
    relatedEntities: {
      loadId: 'L006',
      driverId: 'D001',
      truckId: 'T001'
    },
    reportedBy: 'Driver',
    organizationalContext: {
      companyId: 'comp-001',
      divisionId: 'div-001',
      departmentId: 'dept-001',
      terminalId: 'term-001'
    }
  }
];

export default function EventsPage() {
  const { currentOrganization } = useOrganizational();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const openEvents = demoEvents.filter(e => e.status === 'open').length;
  const inProgressEvents = demoEvents.filter(e => e.status === 'in_progress').length;
  const criticalEvents = demoEvents.filter(e => e.severity === 'critical').length;
  const totalEvents = demoEvents.length;

  const filteredEvents = demoEvents.filter(event => {
    const matchesSearch = searchTerm === '' ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'incident':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'delay':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'delivery':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'pickup':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'inspection':
        return <Eye className="h-4 w-4 text-purple-600" />;
      case 'violation':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-800" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-600 bg-red-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-blue-600" />
            Events
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">
              Monitor and manage operational events and incidents
            </p>            {currentOrganization && (
              <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
                <Building className="h-4 w-4" />
                <span>{currentOrganization.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Report Event
          </Button>
        </div>
      </div>

      {/* Stats and Filters */}
      <Card>
        <CardContent className="p-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalEvents}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{openEvents}</div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{inProgressEvents}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{criticalEvents}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events by title, description, type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getEventTypeIcon(event.type)}
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <Badge 
                        variant="status" 
                        status={event.severity}
                        className={getSeverityColor(event.severity)}
                      >
                        {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                      </Badge>
                      <Badge 
                        variant="status" 
                        status={event.status}
                        className={getStatusColor(event.status)}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Event ID:</span>
                        <div className="font-medium">{event.id}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="font-medium capitalize">{event.type}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <div className="font-medium">{event.createdAt.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Reported By:</span>
                        <div className="font-medium">{event.reportedBy}</div>
                      </div>
                    </div>

                    {/* Related Entities */}
                    {(event.relatedEntities.driverId || event.relatedEntities.truckId || event.relatedEntities.loadId) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.relatedEntities.driverId && (
                          <Badge variant="default" className="bg-blue-50 text-blue-700">
                            <User className="h-3 w-3 mr-1" />
                            Driver: {event.relatedEntities.driverId}
                          </Badge>
                        )}
                        {event.relatedEntities.truckId && (
                          <Badge variant="default" className="bg-green-50 text-green-700">
                            <Truck className="h-3 w-3 mr-1" />
                            Truck: {event.relatedEntities.truckId}
                          </Badge>
                        )}
                        {event.relatedEntities.loadId && (
                          <Badge variant="default" className="bg-purple-50 text-purple-700">
                            <Package className="h-3 w-3 mr-1" />
                            Load: {event.relatedEntities.loadId}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Location */}
                    {event.location && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location.city}, {event.location.state}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
