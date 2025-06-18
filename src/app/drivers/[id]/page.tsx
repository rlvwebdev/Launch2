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
  Phone, 
  Mail, 
  CreditCard, 
  MapPin, 
  Truck as TruckIcon, 
  Calendar,
  FileText,
  Save,
  X
} from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { useData } from '@/context/DataContext';
import { Driver, DriverStatus } from '@/types';

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { drivers } = useOrganizationalData();
  const { updateDriver, deleteDriver } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Driver>>({});

  const driverId = params.id as string;
  const driver = drivers.find(d => d.id === driverId);

  if (!driver) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Driver Not Found</h2>
            <p className="text-gray-600 mb-4">The driver you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
            <Button onClick={() => router.push('/drivers')} variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drivers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(driver);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (Object.keys(formData).length > 0) {
      updateDriver(driver.id, formData);
    }
    setIsEditing(false);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete driver ${driver.firstName} ${driver.lastName}? This action cannot be undone.`)) {
      deleteDriver(driver.id);
      router.push('/drivers');
    }
  };

  const handleInputChange = (field: keyof Driver, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const displayValue = (field: keyof Driver) => {
    return isEditing && formData[field] !== undefined ? formData[field] : driver[field];
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/drivers')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {driver.firstName} {driver.lastName}
            </h1>
            <p className="text-gray-600">Driver ID: {driver.id}</p>
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
              <Button variant="danger" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <Badge variant="status" status={displayValue('status') as DriverStatus}>
                {(displayValue('status') as string).charAt(0).toUpperCase() + (displayValue('status') as string).slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('firstName') as string}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{driver.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayValue('lastName') as string}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{driver.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              {isEditing ? (
                <select
                  value={displayValue('status') as string}
                  onChange={(e) => handleInputChange('status', e.target.value as DriverStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={DriverStatus.ACTIVE}>Active</option>
                  <option value={DriverStatus.AVAILABLE}>Available</option>
                  <option value={DriverStatus.IN_TRAINING}>In Training</option>
                  <option value={DriverStatus.LEAVE}>On Leave</option>
                  <option value={DriverStatus.OOS}>Out of Service</option>
                  <option value={DriverStatus.APPLICATION}>Application</option>
                </select>
              ) : (
                <Badge variant="status" status={driver.status}>
                  {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                </Badge>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(displayValue('hireDate') as Date).toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('hireDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(driver.hireDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={displayValue('phoneNumber') as string}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {driver.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={displayValue('email') as string || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {driver.email || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={displayValue('address') as string || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-900 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  {driver.address || 'Not provided'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* License & Credentials */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">License & Credentials</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayValue('licenseNumber') as string}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  {driver.licenseNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(displayValue('licenseExpiry') as Date).toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('licenseExpiry', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {new Date(driver.licenseExpiry).toLocaleDateString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Card</label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayValue('fuelCard') as string}
                  onChange={(e) => handleInputChange('fuelCard', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  {driver.fuelCard}
                </p>
              )}
            </div>
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
              {driver.assignedTruckId ? (
                <p className="text-gray-900 flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2 text-gray-500" />
                  {driver.assignedTruckId}
                </p>
              ) : (
                <p className="text-gray-500 italic">No truck assigned</p>
              )}
            </div>

            {driver.emergencyContact && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{driver.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600">{driver.emergencyContact.relationship}</p>
                  <p className="text-sm text-gray-600">{driver.emergencyContact.phone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
