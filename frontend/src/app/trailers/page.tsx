'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Container, Search, Filter, Edit, Eye, Truck, Calendar, Wrench, AlertTriangle, Building } from 'lucide-react';
import { useOrganizational } from '@/context/OrganizationalContext';
import { useData } from '@/context/DataContext';
import { TrailerStatus } from '@/types';
import PageHeader from '@/components/layout/PageHeader';

export default function TrailersPage() {
  const { currentOrganization, getOrganizationalFilter } = useOrganizational();
  const { trailers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get organizational filter for current context
  const organizationalFilter = getOrganizationalFilter();

  // Filter data by selected terminal/organization first
  const organizationFilteredTrailers = trailers.filter(trailer => {
    if (!trailer.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return trailer.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return trailer.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return trailer.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return trailer.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true; // Show all if no filter
  });

  const availableTrailers = organizationFilteredTrailers.filter(t => t.status === TrailerStatus.AT_TERMINAL).length;
  const inUseTrailers = organizationFilteredTrailers.filter(t => t.status === TrailerStatus.IN_TRANSIT).length;
  const maintenanceTrailers = organizationFilteredTrailers.filter(t => t.status === TrailerStatus.OUT_OF_SERVICE).length;
  const totalTrailers = organizationFilteredTrailers.length;
  const filteredTrailers = organizationFilteredTrailers.filter(trailer =>
    searchTerm === '' ||
    trailer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrailerTypeIcon = (type: string) => {
    switch (type) {
      case 'dry_van':
        return <Container className="h-4 w-4" />;
      case 'reefer':
        return <Container className="h-4 w-4 text-blue-500" />;
      case 'flatbed':
        return <Container className="h-4 w-4 text-orange-500" />;
      case 'tank':
        return <Container className="h-4 w-4 text-purple-500" />;
      case 'lowboy':
        return <Container className="h-4 w-4 text-red-500" />;
      default:
        return <Container className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'in_use':
        return 'text-blue-600 bg-blue-100';
      case 'maintenance':
        return 'text-orange-600 bg-orange-100';
      case 'out_of_service':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  return (
    <div className="space-y-6">
      {/* Page Header with Terminal Selector */}
      <PageHeader 
        title="Trailers"
        subtitle="Manage your trailer fleet and assignments"
        icon={<Container className="h-8 w-8 text-blue-600" />}
      />

      <div className="p-4 md:p-6 space-y-6">

      {/* Stats and Search */}
      <Card>
        <CardContent className="p-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalTrailers}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availableTrailers}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{inUseTrailers}</div>
              <div className="text-sm text-gray-600">In Use</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{maintenanceTrailers}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search trailers by ID, make, model, type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="primary">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trailers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrailers.map((trailer) => {
          const needsMaintenance = new Date(trailer.nextMaintenanceDue) < new Date();
          const registrationExpiring = new Date(trailer.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            return (
            <Link key={trailer.id} href={`/trailers/${trailer.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {getTrailerTypeIcon(trailer.type)}
                        {trailer.id}
                      </h3>
                      <p className="text-sm text-gray-600">{trailer.make} {trailer.model} • {trailer.year}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant="status" 
                        status={trailer.status}
                        className={getStatusColor(trailer.status)}
                      >
                        {trailer.status.charAt(0).toUpperCase() + trailer.status.slice(1).replace('_', ' ')}
                      </Badge>
                      {(needsMaintenance || registrationExpiring) && (
                        <Badge variant="default" className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alert
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium capitalize">{trailer.type.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">License:</span>
                      <div className="font-medium">{trailer.licensePlate}</div>
                    </div>                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <div className="font-medium">{trailer.capacity.toLocaleString()} lbs</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Length:</span>
                      <div className="font-medium">{trailer.length}&apos;</div>
                    </div>
                  </div>

                  {trailer.assignedTruckId && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <Truck className="h-4 w-4 mr-2" />
                      Assigned to: {trailer.assignedTruckId}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Next Maintenance: {new Date(trailer.nextMaintenanceDue).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );        })}
      </div>
      </div>
    </div>
  );
}
