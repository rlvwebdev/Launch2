'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Package, Search, Filter, MapPin, AlertTriangle, FileText, ArrowUpDown, Grid3X3, List, ChevronDown, Eye, Video, Truck, DollarSign, MessageSquare, UserCheck, Plus } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { LoadStatus, Load } from '@/types';

type SortField = 'loadNumber' | 'shipper' | 'pickupDate' | 'deliveryDate' | 'status' | 'rate';
type SortDirection = 'asc' | 'desc';

export default function LoadsPage() {
  const { loads } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('loadNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const getFilteredLoads = () => {
    let filtered = loads; // Use loads from DataContext

    // Filter by status
    if (statusFilter === 'pending') {
      filtered = loads.filter((load: Load) => load.status === LoadStatus.PENDING);
    } else if (statusFilter === 'assigned') {
      filtered = loads.filter((load: Load) => load.status === LoadStatus.ASSIGNED);
    } else if (statusFilter === 'in-transit') {
      filtered = loads.filter((load: Load) => 
        load.status === LoadStatus.IN_TRANSIT || load.status === LoadStatus.PICKED_UP
      );
    } else if (statusFilter === 'delivered') {
      filtered = loads.filter((load: Load) => load.status === LoadStatus.DELIVERED);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((load: Load) =>
        load.loadNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (load.bolNumber && load.bolNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (load.cargoDescription && load.cargoDescription.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort loads
    return filtered.sort((a: Load, b: Load) => {
      let aValue: any = a[sortField as keyof Load];
      let bValue: any = b[sortField as keyof Load];

      if (sortField === 'pickupDate' || sortField === 'deliveryDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredLoads = getFilteredLoads();

  const getStatusColor = (status: LoadStatus) => {
    switch (status) {
      case LoadStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case LoadStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case LoadStatus.IN_TRANSIT:
        return 'bg-purple-100 text-purple-800';
      case LoadStatus.PICKED_UP:
        return 'bg-orange-100 text-orange-800';
      case LoadStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600" />
            Loads
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage your freight operations
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Load
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-yellow-600">
              {loads.filter(l => l.status === LoadStatus.PENDING).length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-purple-600">
              {loads.filter(l => l.status === LoadStatus.IN_TRANSIT || l.status === LoadStatus.PICKED_UP).length}
            </div>
            <div className="text-sm text-gray-600">In Transit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-green-600">
              {loads.filter(l => l.status === LoadStatus.DELIVERED).length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-2xl font-bold text-gray-900">
              {loads.length}
            </div>
            <div className="text-sm text-gray-600">Total Loads</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search loads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 $\{viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 $\{viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loads Display */}
      {filteredLoads.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No loads found</h3>
            <p className="text-gray-600">
              {statusFilter !== 'all' 
                ? `No loads with ${statusFilter} status` 
                : searchTerm 
                ? 'No loads match your search' 
                : 'No loads available'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {filteredLoads.map((load: Load) => (
            <Card key={load.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{load.loadNumber}</h3>
                  <Badge className={getStatusColor(load.status)}>
                    {load.status.replace('_', ' ').replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Shipper:</span>
                    <span className="text-gray-600">{load.shipper}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">From:</span>
                    <span className="text-gray-600">
                      {load.pickupLocation.city}, {load.pickupLocation.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">To:</span>
                    <span className="text-gray-600">
                      {load.deliveryLocation.city}, {load.deliveryLocation.state}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="font-medium text-green-600">
                      ${load.rate?.toLocaleString() || 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
