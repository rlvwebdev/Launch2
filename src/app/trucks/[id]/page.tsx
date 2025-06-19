'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Truck as TruckIcon, 
  User, 
  Calendar,
  FileText,
  Save,
  X,
  Wrench,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { useData } from '@/context/DataContext';
import { Truck, TruckStatus } from '@/types';
import MobileActionBar from '@/components/ui/MobileActionBar';

export default function TruckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { trucks, drivers } = useOrganizationalData();
  const { updateTruck, deleteTruck } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Truck>>({});

  const truckId = params.id as string;
  const truck = trucks.find(t => t.id === truckId);
  const assignedDriver = truck?.assignedDriverId ? drivers.find(d => d.id === truck.assignedDriverId) : null;

  if (!truck) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Truck Not Found</h2>
            <p className="text-gray-600 mb-4">The truck you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
            <Button onClick={() => router.push('/trucks')} variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trucks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(truck);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (Object.keys(formData).length > 0) {
      updateTruck(truck.id, formData);
    }
    setIsEditing(false);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete truck ${truck.id}? This action cannot be undone.`)) {
      deleteTruck(truck.id);
      router.push('/trucks');
    }
  };

  const handleInputChange = (field: keyof Truck, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const displayValue = (field: keyof Truck) => {
    return isEditing && formData[field] !== undefined ? formData[field] : truck[field];
  };

  const isMaintenanceOverdue = () => {
    const nextMaintenance = new Date(truck.nextMaintenanceDue);
    return nextMaintenance < new Date();
  };

  const isRegistrationExpiringSoon = () => {
    const expiry = new Date(truck.registrationExpiry);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry < thirtyDaysFromNow;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 mobile-content-spacing">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/trucks')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TruckIcon className="h-8 w-8 text-blue-600" />
              Truck {truck.id}
            </h1>
            <p className="text-gray-600">{truck.year} {truck.make} {truck.model}</p>
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

      {/* Alerts */}
      {(isMaintenanceOverdue() || isRegistrationExpiringSoon()) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">Attention Required</h3>
                <div className="mt-1 text-sm text-orange-700 space-y-1">
                  {isMaintenanceOverdue() && (
                    <p>• Maintenance is overdue (due: {new Date(truck.nextMaintenanceDue).toLocaleDateString()})</p>
                  )}
                  {isRegistrationExpiringSoon() && (
                    <p>• Registration expires soon ({new Date(truck.registrationExpiry).toLocaleDateString()})</p>
                  )}
                </div>
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
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Information</h2>
              <Badge variant="status" status={displayValue('status') as TruckStatus}>
                {(displayValue('status') as string).charAt(0).toUpperCase() + (displayValue('status') as string).slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('make') as string}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{truck.make}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('model') as string}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{truck.model}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
                  <p className="text-gray-900">{truck.year}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('color') as string}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{truck.color}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              {isEditing ? (
                <select
                  value={displayValue('status') as string}
                  onChange={(e) => handleInputChange('status', e.target.value as TruckStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={TruckStatus.AVAILABLE}>Available</option>
                  <option value={TruckStatus.IN_USE}>In Use</option>
                  <option value={TruckStatus.MAINTENANCE}>Maintenance</option>
                  <option value={TruckStatus.OUT_OF_SERVICE}>Out of Service</option>
                  <option value={TruckStatus.FOR_SALE}>For Sale</option>
                </select>
              ) : (
                <Badge variant="status" status={truck.status}>
                  {truck.status.charAt(0).toUpperCase() + truck.status.slice(1).replace('-', ' ')}
                </Badge>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
              {isEditing ? (
                <input
                  type="number"
                  value={displayValue('mileage') as number}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{truck.mileage?.toLocaleString()} miles</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration & Documentation */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Registration & Documentation</h2>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <p className="text-gray-900 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  {truck.licensePlate}
                </p>
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
                <p className="text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  {truck.vin}
                </p>
              )}
            </div>

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
                <p className={`text-gray-900 flex items-center ${isRegistrationExpiringSoon() ? 'text-orange-600 font-medium' : ''}`}>
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(truck.registrationExpiry).toLocaleDateString()}
                  {isRegistrationExpiringSoon() && (
                    <AlertTriangle className="h-4 w-4 ml-2 text-orange-500" />
                  )}
                </p>
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
                <p className="text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(truck.insuranceExpiry).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Maintenance Information</h2>
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
                <p className="text-gray-900 flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(truck.lastMaintenance).toLocaleDateString()}
                </p>
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
                <p className={`text-gray-900 flex items-center ${isMaintenanceOverdue() ? 'text-red-600 font-medium' : ''}`}>
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(truck.nextMaintenanceDue).toLocaleDateString()}
                  {isMaintenanceOverdue() && (
                    <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />
                  )}
                </p>
              )}
            </div>

            {truck.maintenanceNotes && (
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
                    <p className="text-gray-700 text-sm">{truck.maintenanceNotes}</p>
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

            {truck.currentLoad && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Load</label>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900">Load #{truck.currentLoad}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/loads/${truck.currentLoad}`)}
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      View Load Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
