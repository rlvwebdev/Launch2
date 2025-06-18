'use client';

import { useState } from 'react';
import { Organization, OrganizationType } from '@/types';
import Button from '@/components/ui/Button';
import { X, Save, Building, MapPin, Phone, Mail, Globe } from 'lucide-react';

interface OrganizationFormProps {
  organization?: Organization;
  parentId?: string;
  onSave: (organization: Partial<Organization>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function OrganizationForm({
  organization,
  parentId,
  onSave,
  onCancel,
  isEditing = false
}: OrganizationFormProps) {
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    type: organization?.type || OrganizationType.TERMINAL,
    code: organization?.code || '',
    parentId: organization?.parentId || parentId || '',
    address: {
      address: organization?.address?.address || '',
      city: organization?.address?.city || '',
      state: organization?.address?.state || '',
      zipCode: organization?.address?.zipCode || ''
    },    contactInfo: {
      email: organization?.contactInfo?.email || '',
      phone: organization?.contactInfo?.phone || '',
      website: organization?.contactInfo?.website || '',
      address: organization?.contactInfo?.address || {
        address: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    isActive: organization?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.code.trim()) newErrors.code = 'Organization code is required';
    if (!formData.address.address.trim()) newErrors.address = 'Address is required';
    if (!formData.address.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.state.trim()) newErrors.state = 'State is required';
    if (!formData.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.contactInfo.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contactInfo.phone.trim()) newErrors.phone = 'Phone number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactInfo.email && !emailRegex.test(formData.contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const organizationData: Partial<Organization> = {
        ...formData,
        id: organization?.id || `ORG${Date.now()}`,
        createdAt: organization?.createdAt || new Date(),
        updatedAt: new Date()
      };

      onSave(organizationData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    const errorKey = parent === 'address' ? field : field;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            {isEditing ? 'Edit Organization' : 'Add New Organization'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization code"
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as OrganizationType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={OrganizationType.COMPANY}>Company</option>
                <option value={OrganizationType.DIVISION}>Division</option>
                <option value={OrganizationType.DEPARTMENT}>Department</option>
                <option value={OrganizationType.TERMINAL}>Terminal</option>
              </select>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.address.address}
                onChange={(e) => handleNestedInputChange('address', 'address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter street address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="City"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.state ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="State"
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.zipCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ZIP"
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website (Optional)
              </label>
              <input
                type="url"
                value={formData.contactInfo.website}
                onChange={(e) => handleNestedInputChange('contactInfo', 'website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter website URL"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Status</h3>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Organization is active
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isEditing ? 'Update Organization' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
