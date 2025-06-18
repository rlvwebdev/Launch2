'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Container, ArrowLeft, Edit, Save, X, Trash2, Calendar, Wrench, AlertTriangle, User, FileText } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { useData } from '@/context/DataContext';

// Trailer status enum (similar to TruckStatus)
enum TrailerStatus {
  AT_TERMINAL = 'at-terminal',
  IN_TRANSIT = 'in-transit',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out-of-service',
  FOR_SALE = 'for-sale'
}

// Mock trailer interface based on the trailers page structure
interface Trailer {
  id: string;
  type: string;
  length: string;
  licensePlate: string;
  vin: string;
  year: number;
  assignedDriverId?: string;
  assignedTruckId?: string;
  status: TrailerStatus;
  lastMaintenance: Date;
  nextMaintenanceDue: Date;
  registrationExpiry: Date;
  insuranceExpiry: Date;
  maintenanceNotes?: string;
  currentLoad?: string;
}

export default function TrailerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentOrganization } = useOrganizational();
  const { drivers, trucks } = useOrganizationalData();
  const { updateTrailer, deleteTrailer } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Trailer>>({});

  const trailerId = params.id as string;
  
  // Mock trailer data (in real app, this would come from your data context)
  const trailer: Trailer = {
    id: trailerId,
    type: 'Dry Van',
    length: '53ft',
    licensePlate: 'TRL-001',
    vin: '1234567890ABCDEF',
    year: 2021,
    assignedDriverId: 'D001',
    assignedTruckId: 'T001',
    status: TrailerStatus.IN_TRANSIT,
    lastMaintenance: new Date('2024-10-15'),
    nextMaintenanceDue: new Date('2025-04-15'),
    registrationExpiry: new Date('2025-12-31'),
    insuranceExpiry: new Date('2025-06-30'),
    maintenanceNotes: 'Regular maintenance schedule. Check tires and brakes monthly.',
    currentLoad: 'L001'
  };

  const assignedDriver = trailer.assignedDriverId ? drivers.find(d => d.id === trailer.assignedDriverId) : null;
  const assignedTruck = trailer.assignedTruckId ? trucks.find(t => t.id === trailer.assignedTruckId) : null;

  if (!trailer) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Trailer Not Found</h2>
            <p className="text-gray-600 mb-4">The trailer you're looking for doesn't exist or may have been removed.</p>
            <Button onClick={() => router.push('/trailers')} variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trailers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(trailer);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (Object.keys(formData).length > 0) {
      updateTrailer(trailer.id, formData);
    }
    setIsEditing(false);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete trailer ${trailer.id}? This action cannot be undone.`)) {
      deleteTrailer(trailer.id);
      router.push('/trailers');
    }
  };

  const handleInputChange = (field: keyof Trailer, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const displayValue = (field: keyof Trailer) => {
    return formData[field] !== undefined ? formData[field] : trailer[field];
  };

  // Helper functions for status checks
  const isMaintenanceOverdue = () => {
    return new Date(trailer.nextMaintenanceDue) < new Date();
  };

  const isRegistrationExpiringSoon = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(trailer.registrationExpiry) < thirtyDaysFromNow;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/trailers')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Container className="h-8 w-8 text-blue-600" />
              Trailer {trailer.id}
            </h1>
            <p className="text-gray-600">{trailer.year} {trailer.type} - {trailer.length}</p>
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

      {/* Alert Cards */}
      {(isMaintenanceOverdue() || isRegistrationExpiringSoon()) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-900">Attention Required</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="mt-1 text-sm text-orange-700 space-y-1">
                {isMaintenanceOverdue() && (
                  <p>• Maintenance is overdue (due: {new Date(trailer.nextMaintenanceDue).toLocaleDateString()})</p>
                )}
                {isRegistrationExpiringSoon() && (
                  <p>• Registration expires soon ({new Date(trailer.registrationExpiry).toLocaleDateString()})</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Trailer Information</h2>
              <Badge variant="status" status={displayValue('status') as TrailerStatus}>
                {(displayValue('status') as string).charAt(0).toUpperCase() + (displayValue('status') as string).slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trailer ID</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  {trailer.id}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('type') as string}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 text-gray-900">{trailer.type}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('length') as string}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 text-gray-900">{trailer.length}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={displayValue('year') as number}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 text-gray-900">{trailer.year}</div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              {isEditing ? (
                <select
                  value={displayValue('status') as string}
                  onChange={(e) => handleInputChange('status', e.target.value as TrailerStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={TrailerStatus.AT_TERMINAL}>At Terminal</option>
                  <option value={TrailerStatus.IN_TRANSIT}>In Transit</option>
                  <option value={TrailerStatus.MAINTENANCE}>Maintenance</option>
                  <option value={TrailerStatus.OUT_OF_SERVICE}>Out of Service</option>
                  <option value={TrailerStatus.FOR_SALE}>For Sale</option>
                </select>
              ) : (
                <Badge variant="status" status={trailer.status}>
                  {trailer.status.charAt(0).toUpperCase() + trailer.status.slice(1).replace('-', ' ')}
                </Badge>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayValue('licensePlate') as string}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900">{trailer.licensePlate}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayValue('vin') as string}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900 font-mono text-sm">{trailer.vin}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration & Insurance */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Registration & Insurance</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(displayValue('registrationExpiry') as Date).toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('registrationExpiry', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className={`px-3 py-2 ${isRegistrationExpiringSoon() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                  {new Date(trailer.registrationExpiry).toLocaleDateString()}
                  {isRegistrationExpiringSoon() && (
                    <span className="ml-2 text-sm">(Expires Soon)</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(displayValue('insuranceExpiry') as Date).toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('insuranceExpiry', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900">
                  {new Date(trailer.insuranceExpiry).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Maintenance</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(displayValue('lastMaintenance') as Date).toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('lastMaintenance', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-3 py-2 text-gray-900">
                  {new Date(trailer.lastMaintenance).toLocaleDateString()}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance Due</label>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(displayValue('nextMaintenanceDue') as Date).toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('nextMaintenanceDue', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className={`px-3 py-2 ${isMaintenanceOverdue() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                  {new Date(trailer.nextMaintenanceDue).toLocaleDateString()}
                  {isMaintenanceOverdue() && (
                    <span className="ml-2 text-sm">(Overdue)</span>
                  )}
                </div>
              )}
            </div>

            {trailer.maintenanceNotes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Notes</label>
                {isEditing ? (
                  <textarea
                    value={displayValue('maintenanceNotes') as string || ''}
                    onChange={(e) => handleInputChange('maintenanceNotes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm">{trailer.maintenanceNotes}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Assignment Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Truck</label>
              {assignedTruck ? (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 flex items-center">
                    <Container className="h-4 w-4 mr-2" />
                    {assignedTruck.id} - {assignedTruck.make} {assignedTruck.model}
                  </p>
                  <p className="text-sm text-blue-700">License: {assignedTruck.licensePlate}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/trucks/${assignedTruck.id}`)}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      View Truck Details
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic flex items-center">
                  <Container className="h-4 w-4 mr-2" />
                  No truck assigned
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Driver</label>
              {assignedDriver ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {assignedDriver.firstName} {assignedDriver.lastName}
                  </p>
                  <p className="text-sm text-green-700">ID: {assignedDriver.id}</p>
                  <p className="text-sm text-green-700">Phone: {assignedDriver.phoneNumber}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/drivers/${assignedDriver.id}`)}
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      View Driver Details
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  No driver assigned
                </p>
              )}
            </div>

            {trailer.currentLoad && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Load</label>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="font-medium text-purple-900">Load #{trailer.currentLoad}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/loads/${trailer.currentLoad}`)}
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      View Load Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
