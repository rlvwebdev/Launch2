'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Package, Search, Filter, MapPin, AlertTriangle, FileText, ArrowUpDown, Grid3X3, List, ChevronDown, Video, Truck, DollarSign, MessageSquare, UserCheck, Plus, Settings } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { LoadStatus } from '@/types';

type SortField = 'loadNumber' | 'shipper' | 'pickupDate' | 'deliveryDate' | 'status' | 'rate';
type SortDirection = 'asc' | 'desc';

export default function LoadsPage() {
  const { loads } = useData();
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'all' | 'events'>('today');
  const [sortField, setSortField] = useState<SortField>('pickupDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'rows'>('grid');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Helper functions for date filtering
  const isToday = (date: Date | string) => {
    const today = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return false;
    return dateObj.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date | string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return false;
    return dateObj.toDateString() === tomorrow.toDateString();
  };
  // Filter loads based on active tab
  const getFilteredLoads = () => {
    let filtered = loads;    // Filter by tab
    if (activeTab === 'today') {
      filtered = loads.filter(load => 
        isToday(load.pickupDate) || 
        isToday(load.deliveryDate) ||
        (load.status === LoadStatus.IN_TRANSIT || load.status === LoadStatus.PICKED_UP)
      );
    } else if (activeTab === 'tomorrow') {
      filtered = loads.filter(load => 
        isTomorrow(load.pickupDate) || 
        isTomorrow(load.deliveryDate)
      );    } else if (activeTab === 'events') {
      // For events tab, show loads with specific statuses that might need attention
      filtered = loads.filter(load => 
        load.status === LoadStatus.PENDING || 
        load.events.length > 0
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(load =>
        load.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.bolNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.shipper.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${load.pickupLocation.city}, ${load.pickupLocation.state}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${load.deliveryLocation.city}, ${load.deliveryLocation.state}`.toLowerCase().includes(searchQuery.toLowerCase())
      );    }    // Sort loads
    return filtered.sort((a, b) => {
      let aValue = a[sortField as keyof typeof a] as any;
      let bValue = b[sortField as keyof typeof b] as any;

      if (sortField === 'pickupDate' || sortField === 'deliveryDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };  const filteredLoads = getFilteredLoads();

  // New metrics as requested
  const totalLoadsAvailable = loads.filter(l => l.status === LoadStatus.PENDING || l.status === LoadStatus.ASSIGNED).length;
  const totalLoadsShippingToday = loads.filter(l => 
    isToday(l.pickupDate) && (l.status === LoadStatus.PICKED_UP || l.status === LoadStatus.IN_TRANSIT)
  ).length;
  const totalLoadsDeliveringToday = loads.filter(l => 
    isToday(l.deliveryDate) && l.status === LoadStatus.IN_TRANSIT
  ).length;
  const totalOpenToday = loads.filter(l => 
    (isToday(l.pickupDate) || isToday(l.deliveryDate)) && 
    (l.status === LoadStatus.PENDING || l.status === LoadStatus.ASSIGNED)
  ).length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">      {/* Header with Add Button */}
      <div className="flex justify-between items-center">        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600" />
            Loads
          </h1>
          <p className="text-gray-600 mt-1">
            Manage shipments and track delivery status
          </p>
        </div>        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Load
        </Button>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalLoadsAvailable}</div>
            <div className="text-sm text-gray-600">Total Loads Available</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{totalLoadsShippingToday}</div>
            <div className="text-sm text-gray-600">Total Loads Shipping Today</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalLoadsDeliveringToday}</div>
            <div className="text-sm text-gray-600">Total Loads Delivering Today</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalOpenToday}</div>
            <div className="text-sm text-gray-600">Total Open Today</div>
          </div>
        </Card>
      </div>{/* Search and Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search loads by number, BOL, shipper, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="primary">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid view"
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('rows')}
                title="List view"
                className={`p-2 border-l border-gray-300 ${viewMode === 'rows' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button variant="primary">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </CardContent>
      </Card>{/* Tabs - Responsive (Desktop tabs, Mobile dropdown) */}
      <div className="border-b border-gray-200">
        {/* Desktop Tabs */}
        <nav className="hidden sm:flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'today'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Today (26)
          </button>
          <button
            onClick={() => setActiveTab('tomorrow')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tomorrow'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tomorrow (32)
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Loads (98)
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'events'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Events
          </button>
        </nav>

        {/* Mobile Dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 flex items-center justify-between"
          >
            <span className="font-medium text-sm">
              {activeTab === 'today' && 'Today (26)'}
              {activeTab === 'tomorrow' && 'Tomorrow (32)'}
              {activeTab === 'all' && 'All Loads (98)'}
              {activeTab === 'events' && 'Events'}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('today');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    activeTab === 'today' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  }`}
                >
                  Today (26)
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tomorrow');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    activeTab === 'tomorrow' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  }`}
                >
                  Tomorrow (32)
                </button>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    activeTab === 'all' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  }`}
                >
                  All Loads (98)
                </button>
                <button
                  onClick={() => {
                    setActiveTab('events');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    activeTab === 'events' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  }`}
                >
                  Events
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 py-2">Sort by:</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSort('pickupDate')}
          className={sortField === 'pickupDate' ? 'bg-blue-50 border-blue-300' : ''}
        >
          Pickup Date
          {sortField === 'pickupDate' && (
            <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSort('deliveryDate')}
          className={sortField === 'deliveryDate' ? 'bg-blue-50 border-blue-300' : ''}
        >
          Delivery Date
          {sortField === 'deliveryDate' && (
            <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSort('shipper')}
          className={sortField === 'shipper' ? 'bg-blue-50 border-blue-300' : ''}
        >
          Shipper
          {sortField === 'shipper' && (
            <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSort('status')}
          className={sortField === 'status' ? 'bg-blue-50 border-blue-300' : ''}
        >
          Status
          {sortField === 'status' && (
            <ArrowUpDown className={`h-3 w-3 ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          )}
        </Button>
      </div>

      {/* Loads List */}
      <div className="space-y-4">
        {filteredLoads.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No loads found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search criteria.' : `No loads scheduled for ${activeTab === 'today' ? 'today' : activeTab === 'tomorrow' ? 'tomorrow' : 'this period'}.`}
                </p>
              </div>
            </CardContent>
          </Card>        ) : (
          filteredLoads.map((load) => {
            return (
              <Card key={load.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    {/* Load Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Load #: {load.loadNumber}
                          </h3>
                          <Badge variant="status" status={load.status}>
                            {load.status.charAt(0).toUpperCase() + load.status.slice(1).replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        {/* BOL and Shipper */}
                        <div className="text-sm text-gray-600 mb-3">
                          <div><strong>BOL #:</strong> {load.bolNumber}</div>
                          <div><strong>Shipper:</strong> {load.shipper}</div>
                        </div>

                        {/* Route */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">Route:</div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{load.pickupLocation.city}, {load.pickupLocation.state}</span>
                            <span className="text-gray-400">→</span>
                            <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <span>{load.deliveryLocation.city}, {load.deliveryLocation.state}</span>
                          </div>
                        </div>
                        
                        {/* Dates */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <span className="font-medium">Pickup:</span>
                            </div>
                            <div className="text-sm text-gray-900">
                              {load.pickupDate.toLocaleDateString()} at {load.pickupDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <span className="font-medium">Delivery:</span>
                            </div>
                            <div className="text-sm text-gray-900">
                              {load.deliveryDate.toLocaleDateString()} at {load.deliveryDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      </div>                      <div className="text-right sm:text-left">                        <select 
                          title="Change load status"
                          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          defaultValue=""
                        >
                          <option value="" disabled>Change Status</option>
                          <option value="delay">Delay</option>
                          <option value="detention">Detention</option>
                          <option value="late">Late</option>
                          <option value="open">Open</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Product:</span>
                        <span className="ml-1 font-medium">{load.cargoDescription}</span>
                      </div>                      {load.assignedDriverId && (
                        <div>
                          <span className="text-gray-500">Driver:</span>
                          <span className="ml-1 font-medium">{load.assignedDriverId}</span>
                        </div>
                      )}
                      {load.assignedTruckId && (
                        <div>
                          <span className="text-gray-500">Truck:</span>
                          <span className="ml-1 font-medium">{load.assignedTruckId}</span>
                        </div>
                      )}
                    </div>                    <div className="pt-2 border-t border-gray-200">
                      {/* Desktop View - Show all buttons */}
                      <div className="hidden sm:flex sm:flex-wrap gap-1">
                        <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                          <Video className="h-3 w-3 mr-1" />
                          View Lytx
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                          <Truck className="h-3 w-3 mr-1" />
                          View in Transflo
                        </Button>
                        <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Misc Pay
                        </Button>
                        <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Report Event
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                          <FileText className="h-3 w-3 mr-1" />
                          Documents
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Comms
                        </Button>
                        {!load.assignedDriverId && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </div>

                      {/* Mobile View - Dropdown Menu */}
                      <div className="sm:hidden relative">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Toggle dropdown functionality could be added here
                          }}
                          className="w-full justify-center border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Actions
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                        {/* Dropdown menu would be implemented here when needed */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Events Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Recent Load Events
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Track spills, contamination, NCR reports, and other incidents across all loads.
            Use the Reports button above to generate detailed event histories.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
