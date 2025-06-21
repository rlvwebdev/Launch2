'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Truck, ArrowLeft, Save } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { TruckStatus } from '@/types';
import MobileActionBar from '@/components/ui/MobileActionBar';

export default function AddTruckPage() {
  const router = useRouter();
  // const { addTrucks } = useData(); // TODO: Implement addTrucks method
  
  const [formData, setFormData] = useState({
    id: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    color: '',
    assignedDriverId: '',
    status: TruckStatus.AVAILABLE,
    mileage: 0,
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextMaintenanceDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    registrationExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    insuranceExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) newErrors.id = 'Truck ID is required';
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!formData.vin.trim()) newErrors.vin = 'VIN is required';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {      const newTruck = {
        ...formData,
        assignedDriverId: formData.assignedDriverId || undefined,
        lastMaintenance: new Date(formData.lastMaintenance),
        nextMaintenanceDue: new Date(formData.nextMaintenanceDue),
        registrationExpiry: new Date(formData.registrationExpiry),
        insuranceExpiry: new Date(formData.insuranceExpiry),
        organizationalContext: {
          companyId: 'launch-transport-company',
          divisionId: 'southwest-division',
          departmentId: 'operations-department',
          terminalId: 'houston-terminal',
          createdBy: 'demo.user',
          createdAt: new Date(),
          updatedBy: 'demo.user',
          updatedAt: new Date()        }
      };

      // addTrucks([newTruck]); // TODO: Implement addTrucks method
      console.log('New truck added:', newTruck);
      router.push('/trucks');
    } catch (error) {
      console.error('Error adding truck:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  return (
    <div className="p-4 md:p-6 space-y-6 mobile-content-spacing">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            Add New Truck
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new truck to your fleet
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Truck ID *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., TRK001"
                />
                {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate *
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.licensePlate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ABC123"
                />
                {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make *
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.make ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Freightliner"
                />
                {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.model ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Cascadia"
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.year ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., White"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIN *
                </label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.vin ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="17-character VIN"
                />
                {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as TruckStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >                  <option value={TruckStatus.AVAILABLE}>Available</option>
                  <option value={TruckStatus.ASSIGNED}>Assigned</option>
                  <option value={TruckStatus.MAINTENANCE}>Maintenance</option>
                  <option value={TruckStatus.OUT_OF_SERVICE}>Out of Service</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Operational Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Mileage
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Driver ID
                </label>
                <input
                  type="text"
                  value={formData.assignedDriverId}
                  onChange={(e) => handleInputChange('assignedDriverId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DRV001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Maintenance Date
                </label>
                <input
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Maintenance Due
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDue}
                  onChange={(e) => handleInputChange('nextMaintenanceDue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Expiry
                </label>
                <input
                  type="date"
                  value={formData.registrationExpiry}
                  onChange={(e) => handleInputChange('registrationExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>        {/* Desktop Submit Buttons - hidden on mobile */}
        <div className="hidden md:flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              'Adding...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Add Truck
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Mobile Action Bar */}
      <MobileActionBar>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            'Adding...'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Add Truck
            </>
          )}
        </Button>
      </MobileActionBar>
    </div>
  );
}
