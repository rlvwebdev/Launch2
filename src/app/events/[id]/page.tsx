'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { AlertTriangle, ArrowLeft, Edit, Save, X, Trash2, MapPin, Clock, User, Truck, Package, FileText, Camera } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { useData } from '@/context/DataContext';

// Event status and type enums
enum EventStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

enum EventType {
  SPILL = 'spill',
  CONTAMINATION = 'contamination',
  NCR = 'ncr',
  ACCIDENT = 'accident',
  BREAKDOWN = 'breakdown',
  DELAY = 'delay',
  THEFT = 'theft',
  OTHER = 'other'
}

enum EventSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Event interface
interface LoadEvent {
  id: string;
  type: EventType;
  status: EventStatus;
  severity: EventSeverity;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  timestamp: Date;
  reportedBy: string;
  loadId?: string;
  driverId?: string;
  truckId?: string;
  estimatedCost?: number;
  resolutionNotes?: string;
  attachments?: string[];
  followUpRequired: boolean;
  reportedToAuthorities: boolean;
  insuranceClaim?: {
    claimNumber: string;
    status: string;
    amount: number;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentOrganization } = useOrganizational();
  const { drivers, trucks, loads } = useOrganizationalData();
  const { updateEvent, deleteEvent } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<LoadEvent>>({});

  const eventId = params.id as string;
  
  // Mock event data (in real app, this would come from your data context)
  const event: LoadEvent = {
    id: eventId,
    type: EventType.SPILL,
    status: EventStatus.INVESTIGATING,
    severity: EventSeverity.HIGH,
    title: 'Chemical Spill During Loading',
    description: 'Small chemical spill occurred during loading process at customer facility. Approximately 2 gallons of product spilled on loading dock. Immediate cleanup initiated.',
    location: {
      address: '1234 Industrial Way',
      city: 'Houston',
      state: 'TX',
      coordinates: { lat: 29.7604, lng: -95.3698 }
    },
    timestamp: new Date('2024-12-15T10:30:00'),
    reportedBy: 'John Smith (Driver)',
    loadId: 'L001',
    driverId: 'D001',
    truckId: 'T001',
    estimatedCost: 2500,
    followUpRequired: true,
    reportedToAuthorities: true,
    insuranceClaim: {
      claimNumber: 'INS-2024-001',
      status: 'Under Review',
      amount: 2500
    },
    attachments: ['spill_photo_1.jpg', 'cleanup_receipt.pdf']
  };

  const associatedLoad = event.loadId ? loads.find(l => l.id === event.loadId) : null;
  const associatedDriver = event.driverId ? drivers.find(d => d.id === event.driverId) : null;
  const associatedTruck = event.truckId ? trucks.find(t => t.id === event.truckId) : null;

  if (!event) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or may have been removed.</p>
            <Button onClick={() => router.push('/events')} variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(event);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (Object.keys(formData).length > 0) {
      updateEvent(event.id, formData);
    }
    setIsEditing(false);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete this event? This action cannot be undone.`)) {
      deleteEvent(event.id);
      router.push('/events');
    }
  };

  const handleInputChange = (field: keyof LoadEvent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const displayValue = (field: keyof LoadEvent) => {
    return formData[field] !== undefined ? formData[field] : event[field];
  };

  const getSeverityColor = (severity: EventSeverity) => {
    switch (severity) {
      case EventSeverity.LOW: return 'bg-green-100 text-green-800';
      case EventSeverity.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case EventSeverity.HIGH: return 'bg-orange-100 text-orange-800';
      case EventSeverity.CRITICAL: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.OPEN: return 'bg-red-100 text-red-800';
      case EventStatus.INVESTIGATING: return 'bg-yellow-100 text-yellow-800';
      case EventStatus.RESOLVED: return 'bg-blue-100 text-blue-800';
      case EventStatus.CLOSED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/events')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              Event #{event.id}
            </h1>
            <p className="text-gray-600">{event.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDelete} className="border-red-300 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Event Overview</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Badge className={getStatusColor(event.status)}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <Badge className={getSeverityColor(event.severity)}>
                {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
              </Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Badge variant="default">
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <div className="text-sm text-gray-900">
                {event.timestamp.toLocaleDateString()} at {event.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayValue('title') as string}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900 font-medium">{event.title}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              {isEditing ? (
                <textarea
                  value={displayValue('description') as string}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">{event.description}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
              <div className="px-3 py-2 text-gray-900">{event.reportedBy}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <div>{event.location.address}</div>
                    <div>{event.location.city}, {event.location.state}</div>
                  </div>
                </div>
              </div>
            </div>

            {event.estimatedCost && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                <div className="px-3 py-2 text-gray-900 font-medium">
                  ${event.estimatedCost.toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Associated Records */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Associated Records</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {associatedLoad && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Load</label>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="font-medium text-purple-900 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Load #{associatedLoad.loadNumber}
                  </p>
                  <p className="text-sm text-purple-700">
                    {associatedLoad.pickupLocation.city}, {associatedLoad.pickupLocation.state} → {associatedLoad.deliveryLocation.city}, {associatedLoad.deliveryLocation.state}
                  </p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/loads/${associatedLoad.id}`)}
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      View Load Details
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {associatedDriver && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {associatedDriver.firstName} {associatedDriver.lastName}
                  </p>
                  <p className="text-sm text-green-700">ID: {associatedDriver.id}</p>
                  <p className="text-sm text-green-700">Phone: {associatedDriver.phoneNumber}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/drivers/${associatedDriver.id}`)}
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      View Driver Details
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {associatedTruck && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Truck</label>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    {associatedTruck.id} - {associatedTruck.make} {associatedTruck.model}
                  </p>
                  <p className="text-sm text-blue-700">License: {associatedTruck.licensePlate}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/trucks/${associatedTruck.id}`)}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      View Truck Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insurance & Claims */}
        {event.insuranceClaim && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Insurance Claim</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Number</label>
                <div className="px-3 py-2 text-gray-900 font-mono">{event.insuranceClaim.claimNumber}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Status</label>
                <Badge variant="default">{event.insuranceClaim.status}</Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Amount</label>
                <div className="px-3 py-2 text-gray-900 font-medium">
                  ${event.insuranceClaim.amount.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compliance & Follow-up */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Compliance & Follow-up</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Reported to Authorities</label>
              <Badge className={event.reportedToAuthorities ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {event.reportedToAuthorities ? 'Yes' : 'No'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Follow-up Required</label>
              <Badge className={event.followUpRequired ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                {event.followUpRequired ? 'Required' : 'Not Required'}
              </Badge>
            </div>

            {event.resolutionNotes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700 text-sm">{event.resolutionNotes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attachments */}
      {event.attachments && event.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  {attachment.includes('.jpg') || attachment.includes('.png') ? (
                    <Camera className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{attachment}</p>
                    <p className="text-xs text-gray-500">
                      {attachment.includes('.jpg') || attachment.includes('.png') ? 'Image' : 'Document'}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
