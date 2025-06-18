'use client';

import React, { useState } from 'react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import OrganizationSelector from '@/components/ui/OrganizationSelector';
import OrganizationForm from '@/components/forms/OrganizationForm';
import { 
  Building, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  ChevronRight,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { Organization, OrganizationType, PermissionScope } from '@/types';

interface FormState {
  isOpen: boolean;
  isEditing: boolean;
  organization?: Organization;
  parentId?: string;
}

export default function OrganizationManagementPage() {
  const {
    currentUser,
    currentOrganization,
    organizationHierarchy,
    getParentOrganizations,
    getChildOrganizations,
    getOrganizationsByType,
    hasPermission,
    getDataScope
  } = useOrganizational();

  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [formState, setFormState] = useState<FormState>({ isOpen: false, isEditing: false });

  const getOrganizationIcon = (type: OrganizationType) => {
    switch (type) {
      case OrganizationType.COMPANY:
        return <Building className="h-5 w-5 text-blue-600" />;
      case OrganizationType.DIVISION:
        return <Building className="h-5 w-5 text-green-600" />;
      case OrganizationType.DEPARTMENT:
        return <Building className="h-5 w-5 text-orange-600" />;
      case OrganizationType.TERMINAL:
        return <MapPin className="h-5 w-5 text-purple-600" />;
      default:
        return <Building className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (org: Organization) => {
    return (      <Badge 
        variant="status"
        status={org.isActive ? 'active' : 'inactive'}
        className={org.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
      >
        {org.isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getBreadcrumbs = (org: Organization) => {
    const parents = getParentOrganizations(org.id);
    const hierarchy = [...parents, org];
    
    return (
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        {hierarchy.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            <span className={index === hierarchy.length - 1 ? 'text-gray-900 font-medium' : ''}>
              {item.name}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };
  const canManageOrganizations = hasPermission('settings' as any, 'update' as any, PermissionScope.COMPANY);
  const filteredOrganizations = organizationHierarchy.filter(org => 
    showInactive || org.isActive
  );

  const openAddForm = (parentId?: string) => {
    setFormState({ isOpen: true, isEditing: false, parentId });
  };

  const openEditForm = (organization: Organization) => {
    setFormState({ isOpen: true, isEditing: true, organization });
  };

  const closeForm = () => {
    setFormState({ isOpen: false, isEditing: false });
  };

  const handleSave = (organizationData: Partial<Organization>) => {
    // Here you would typically save to your backend
    console.log('Saving organization:', organizationData);
    closeForm();
  };

  const handleDelete = (organizationId: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      // Here you would typically delete from your backend
      console.log('Deleting organization:', organizationId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your organizational hierarchy and structure
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrganizationSelector className="w-64" />          {canManageOrganizations && (
            <Button 
              className="flex items-center gap-2"
              onClick={() => openAddForm()}
            >
              <Plus className="h-4 w-4" />
              Add Organization
            </Button>
          )}
        </div>
      </div>

      {/* Current Organization Info */}
      {currentOrganization && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getOrganizationIcon(currentOrganization.type)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentOrganization.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {getBreadcrumbs(currentOrganization)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(currentOrganization)}                <Badge variant="default">
                  {currentOrganization.type.charAt(0).toUpperCase() + currentOrganization.type.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Code</div>
                <div className="text-gray-900">{currentOrganization.code}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Contact</div>
                <div className="flex items-center gap-1 text-gray-900">
                  <Phone className="h-3 w-3" />
                  {currentOrganization.contactInfo.phone}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="flex items-center gap-1 text-gray-900">
                  <Mail className="h-3 w-3" />
                  {currentOrganization.contactInfo.email}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-gray-500">Address</div>
                <div className="flex items-center gap-1 text-gray-900">
                  <MapPin className="h-3 w-3" />
                  {currentOrganization.address?.address}, {currentOrganization.address?.city}, {currentOrganization.address?.state} {currentOrganization.address?.zipCode}
                </div>
              </div>
              {currentOrganization.contactInfo.website && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Website</div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Globe className="h-3 w-3" />
                    <a href={currentOrganization.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {currentOrganization.contactInfo.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organization Hierarchy */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Hierarchy
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showInactive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showInactive ? 'Hide Inactive' : 'Show Inactive'}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getOrganizationsByType(OrganizationType.COMPANY)
                  .filter(org => showInactive || org.isActive)
                  .map(company => (
                  <div key={company.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getOrganizationIcon(company.type)}
                        <span className="font-medium">{company.name}</span>                        <Badge variant="default" className="text-xs">
                          {company.code}
                        </Badge>
                      </div>
                      {getStatusBadge(company)}
                    </div>
                    
                    {/* Divisions */}
                    {getChildOrganizations(company.id)
                      .filter(org => showInactive || org.isActive)
                      .map(division => (
                      <div key={division.id} className="ml-6 border-l-2 border-gray-200 pl-3 mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getOrganizationIcon(division.type)}
                            <span className="text-sm font-medium">{division.name}</span>
                            <Badge variant="default" className="text-xs">
                              {division.code}
                            </Badge>
                          </div>
                          {getStatusBadge(division)}
                        </div>
                        
                        {/* Departments */}
                        {getChildOrganizations(division.id)
                          .filter(org => showInactive || org.isActive)
                          .map(department => (
                          <div key={department.id} className="ml-6 border-l-2 border-gray-200 pl-3 mt-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {getOrganizationIcon(department.type)}
                                <span className="text-sm">{department.name}</span>
                                <Badge variant="default" className="text-xs">
                                  {department.code}
                                </Badge>
                              </div>
                              {getStatusBadge(department)}
                            </div>
                            
                            {/* Terminals */}
                            <div className="ml-6 space-y-1">
                              {getChildOrganizations(department.id)
                                .filter(org => showInactive || org.isActive)
                                .map(terminal => (
                                <div key={terminal.id} className="flex items-center justify-between py-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    {getOrganizationIcon(terminal.type)}
                                    <span>{terminal.name}</span>
                                    <Badge variant="default" className="text-xs">
                                      {terminal.code}
                                    </Badge>
                                  </div>
                                  {getStatusBadge(terminal)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Access & Permissions */}
        <div>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access & Permissions
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Current User</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{currentUser?.firstName} {currentUser?.lastName}</div>
                    <div className="text-sm text-gray-500">{currentUser?.email}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Access Level</div>
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {getDataScope().charAt(0).toUpperCase() + getDataScope().slice(1)} Level
                </Badge>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Organization Access</div>
                <div className="space-y-1">
                  {currentUser?.organizationAccess.map(access => {
                    const org = organizationHierarchy.find(o => o.id === access.organizationId);
                    return (
                      <div key={access.organizationId} className="flex items-center justify-between text-sm">
                        <span>{org?.name}</span>
                        <Badge variant="default" className="text-xs">
                          {access.roles[0]?.name || 'User'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {canManageOrganizations && (
                <div className="pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>        </div>
      </div>

      {/* Organization Form Modal */}
      {formState.isOpen && (
        <OrganizationForm
          organization={formState.organization}
          parentId={formState.parentId}
          onSave={handleSave}
          onCancel={closeForm}
          isEditing={formState.isEditing}
        />
      )}
    </div>
  );
}
