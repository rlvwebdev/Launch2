'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  MapPin, 
  Calendar,
  DollarSign,
  Save,
  X,
  User,
  Truck as TruckIcon,
  Weight,
  Route,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { useData } from '@/context/DataContext';
import { Load, LoadStatus } from '@/types';
import MobileActionBar from '@/components/ui/MobileActionBar';

export default function LoadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { loads, drivers, trucks } = useOrganizationalData();
  const { updateLoad, deleteLoad } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Load>>({});

  // Helper function to map LoadStatus to Badge status
  const getLoadBadgeStatus = (status: LoadStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'active' => {
    switch (status) {
      case LoadStatus.PENDING:
        return 'pending';
      case LoadStatus.ASSIGNED:
        return 'info';
      case LoadStatus.PICKED_UP:
        return 'active';
      case LoadStatus.IN_TRANSIT:
        return 'active';
      case LoadStatus.DELIVERING:
        return 'warning';
      case LoadStatus.DELIVERED:
        return 'success';
      case LoadStatus.CANCELLED:
        return 'error';
      default:
        return 'neutral';
    }
  };

  const loadId = params.id as string;
  const load = loads.find(l => l.id === loadId);
  const assignedDriver = load?.assignedDriverId ? drivers.find(d => d.id === load.assignedDriverId) : null;
  const assignedTruck = load?.assignedTruckId ? trucks.find(t => t.id === load.assignedTruckId) : null;

  if (!load) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Load Not Found</h2>
            <p className="text-gray-600 mb-4">The load you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
            <Button onClick={() => router.push('/loads')} variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Loads
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(load);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (Object.keys(formData).length > 0) {
      updateLoad(load.id, formData);
    }
    setIsEditing(false);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete load ${load.id}? This action cannot be undone.`)) {
      deleteLoad(load.id);
      router.push('/loads');
    }
  };

  const handleInputChange = (field: keyof Load, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const displayValue = (field: keyof Load) => {
    return isEditing && formData[field] !== undefined ? formData[field] : load[field];
  };

  const isOverdue = () => {
    const deliveryDate = new Date(load.deliveryDate);
    return deliveryDate < new Date() && load.status !== LoadStatus.DELIVERED;
  };

  const getStatusColor = (status: LoadStatus) => {
    switch (status) {
      case LoadStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case LoadStatus.ASSIGNED: return 'bg-blue-100 text-blue-800';
      case LoadStatus.PICKED_UP: return 'bg-purple-100 text-purple-800';
      case LoadStatus.IN_TRANSIT: return 'bg-indigo-100 text-indigo-800';
      case LoadStatus.DELIVERING: return 'bg-orange-100 text-orange-800';
      case LoadStatus.DELIVERED: return 'bg-green-100 text-green-800';
      case LoadStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="p-4 md:p-6 space-y-6 mobile-content-spacing">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/loads')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              Load #{load.id}
            </h1>
            <p className="text-gray-600">{load.shipper} → {load.deliveryLocation.city}, {load.deliveryLocation.state}</p>
          </div>
        </div>
          {/* Desktop action buttons - hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
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
              <Button variant="danger" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Overdue Alert */}
      {isOverdue() && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Load Overdue</h3>
                <p className="mt-1 text-sm text-red-700">
                  This load was scheduled for delivery on {new Date(load.deliveryDate).toLocaleDateString()} and is now overdue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Load Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Load Information</h2>              <Badge status={getLoadBadgeStatus(displayValue('status') as LoadStatus)}>
                {(displayValue('status') as string).charAt(0).toUpperCase() + (displayValue('status') as string).slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              {isEditing ? (
                <select
                  value={displayValue('status') as string}
                  onChange={(e) => handleInputChange('status', e.target.value as LoadStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={LoadStatus.PENDING}>Pending</option>
                  <option value={LoadStatus.ASSIGNED}>Assigned</option>
                  <option value={LoadStatus.PICKED_UP}>Picked Up</option>
                  <option value={LoadStatus.IN_TRANSIT}>In Transit</option>
                  <option value={LoadStatus.DELIVERING}>Delivering</option>
                  <option value={LoadStatus.DELIVERED}>Delivered</option>
                  <option value={LoadStatus.CANCELLED}>Cancelled</option>
                </select>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(load.status)}`}>
                  {load.status.charAt(0).toUpperCase() + load.status.slice(1).replace('-', ' ')}
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipper</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('shipper') as string}
                    onChange={(e) => handleInputChange('shipper', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{load.shipper}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('receiver') as string}
                    onChange={(e) => handleInputChange('receiver', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{load.receiver}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Description</label>
              {isEditing ? (
                <textarea
                  value={displayValue('cargoDescription') as string || ''}
                  onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-900 flex items-start">
                  <Package className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  {load.cargoDescription || 'No description provided'}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={displayValue('weight') as number || ''}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Weight className="h-4 w-4 mr-2 text-gray-500" />
                    {load.weight?.toLocaleString()} lbs
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={displayValue('distance') as number || ''}
                    onChange={(e) => handleInputChange('distance', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Route className="h-4 w-4 mr-2 text-gray-500" />
                    {load.distance} miles
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={displayValue('rate') as number || ''}
                  onChange={(e) => handleInputChange('rate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center text-lg font-semibold text-green-600">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {load.rate?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Locations */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Schedule & Locations</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={new Date(displayValue('pickupDate') as Date).toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange('pickupDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(load.pickupDate).toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={new Date(displayValue('deliveryDate') as Date).toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange('deliveryDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className={`text-gray-900 flex items-center ${isOverdue() ? 'text-red-600 font-medium' : ''}`}>
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(load.deliveryDate).toLocaleString()}
                  {isOverdue() && (
                    <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              {isEditing ? (
                <textarea
                  value={displayValue('origin') as string}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-900 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  {load.origin}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              {isEditing ? (
                <textarea
                  value={displayValue('destination') as string}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-900 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                  {load.destination}
                </p>
              )}
            </div>

            {load.estimatedTransitTime && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Transit Time</label>
                <p className="text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {load.estimatedTransitTime} hours
                </p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Driver</label>
              {assignedDriver ? (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {assignedDriver.firstName} {assignedDriver.lastName}
                  </p>
                  <p className="text-sm text-blue-700">ID: {assignedDriver.id}</p>
                  <p className="text-sm text-blue-700">Phone: {assignedDriver.phoneNumber}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/drivers/${assignedDriver.id}`)}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Truck</label>
              {assignedTruck ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900 flex items-center">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Truck {assignedTruck.id}
                  </p>
                  <p className="text-sm text-green-700">{assignedTruck.year} {assignedTruck.make} {assignedTruck.model}</p>
                  <p className="text-sm text-green-700">License: {assignedTruck.licensePlate}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/trucks/${assignedTruck.id}`)}
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      View Truck Details
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  No truck assigned
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {load.specialInstructions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                {isEditing ? (
                  <textarea
                    value={displayValue('specialInstructions') as string || ''}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-sm">{load.specialInstructions}</p>
                  </div>
                )}
              </div>
            )}

            {load.hazmat && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hazmat Information</label>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-red-800 text-sm font-medium">⚠️ Hazardous Materials</p>
                  <p className="text-red-700 text-sm mt-1">This load contains hazardous materials and requires special handling.</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <p className="text-gray-900 text-sm">
                  {load.createdAt ? new Date(load.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900 text-sm">
                  {load.updatedAt ? new Date(load.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>      {/* Mobile Action Bar */}
      <MobileActionBar>
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleEdit} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        )}
      </MobileActionBar>
    </div>
  );
}
