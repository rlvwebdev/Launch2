'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Users, UserPlus, Search, Filter, Phone, CreditCard, MapPin, Truck as TruckIcon, Grid3X3, List, MoreVertical, Eye, Edit, Settings } from 'lucide-react';

// Mock driver data with updated structure
const mockDrivers = [
  {
    id: '01320',
    firstName: 'John',
    lastName: 'Smith',
    licenseNumber: 'CDL-123456',
    licenseExpiry: '2025-12-15',
    phoneNumber: '(555) 123-4567',
    fuelCard: 'FC-001-7845',
    assignedTruckId: 'TRK-001',
    status: 'active' as const,
    hireDate: '2022-03-15',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    }
  },
  {
    id: '15847',
    firstName: 'Maria',
    lastName: 'Garcia',
    licenseNumber: 'CDL-789012',
    licenseExpiry: '2026-08-22',
    phoneNumber: '(555) 234-5678',
    fuelCard: 'FC-002-9321',
    assignedTruckId: 'TRK-002',
    status: 'active' as const,
    hireDate: '2021-07-10',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '(555) 876-5432',
      relationship: 'Brother'
    }
  },
  {
    id: '23456',
    firstName: 'Robert',
    lastName: 'Johnson',
    licenseNumber: 'CDL-345678',
    licenseExpiry: '2025-04-30',
    phoneNumber: '(555) 345-6789',
    fuelCard: 'FC-003-5678',
    assignedTruckId: undefined,
    status: 'in-training' as const,
    hireDate: '2020-11-05',
    emergencyContact: {
      name: 'Mary Johnson',
      phone: '(555) 765-4321',
      relationship: 'Wife'
    }
  },
  {
    id: '45789',
    firstName: 'Sarah',
    lastName: 'Davis',
    licenseNumber: 'CDL-901234',
    licenseExpiry: '2024-10-18',
    phoneNumber: '(555) 456-7890',
    fuelCard: 'FC-004-1234',
    assignedTruckId: 'TRK-004',
    status: 'active' as const,
    hireDate: '2023-01-20',
    emergencyContact: {
      name: 'Tom Davis',
      phone: '(555) 654-3210',
      relationship: 'Husband'
    }
  },
  {
    id: '56234',
    firstName: 'Michael',
    lastName: 'Brown',
    licenseNumber: 'CDL-567890',
    licenseExpiry: '2025-09-12',
    phoneNumber: '(555) 567-8901',
    fuelCard: 'FC-005-4567',
    assignedTruckId: 'TRK-005',
    status: 'active' as const,
    hireDate: '2022-08-14',
    emergencyContact: {
      name: 'Lisa Brown',
      phone: '(555) 543-2109',
      relationship: 'Wife'
    }
  },
  {
    id: '62890',
    firstName: 'Jennifer',
    lastName: 'Wilson',
    licenseNumber: 'CDL-678901',
    licenseExpiry: '2026-03-25',
    phoneNumber: '(555) 678-9012',
    fuelCard: 'FC-006-7890',
    assignedTruckId: undefined,
    status: 'oos' as const,
    hireDate: '2021-05-30',
    emergencyContact: {
      name: 'David Wilson',
      phone: '(555) 432-1098',
      relationship: 'Husband'
    }
  },
  // Additional drivers to reach 23 total (20 active, 1 more in-training)
  {
    id: '78901',
    firstName: 'David',
    lastName: 'Martinez',
    licenseNumber: 'CDL-234567',
    licenseExpiry: '2025-11-30',
    phoneNumber: '(555) 789-0123',
    fuelCard: 'FC-007-2345',
    assignedTruckId: 'TRK-007',
    status: 'active' as const,
    hireDate: '2023-04-12',
    emergencyContact: {
      name: 'Rosa Martinez',
      phone: '(555) 321-0987',
      relationship: 'Wife'
    }
  },
  {
    id: '89012',
    firstName: 'Kevin',
    lastName: 'Thompson',
    licenseNumber: 'CDL-345678',
    licenseExpiry: '2026-01-15',
    phoneNumber: '(555) 890-1234',
    fuelCard: 'FC-008-3456',
    assignedTruckId: 'TRK-008',
    status: 'active' as const,
    hireDate: '2022-12-08',
    emergencyContact: {
      name: 'Amy Thompson',
      phone: '(555) 210-9876',
      relationship: 'Wife'
    }
  },
  {
    id: '90123',
    firstName: 'James',
    lastName: 'Anderson',
    licenseNumber: 'CDL-456789',
    licenseExpiry: '2025-07-20',
    phoneNumber: '(555) 901-2345',
    fuelCard: 'FC-009-4567',
    assignedTruckId: 'TRK-009',
    status: 'active' as const,
    hireDate: '2023-02-28',
    emergencyContact: {
      name: 'Linda Anderson',
      phone: '(555) 109-8765',
      relationship: 'Wife'
    }
  },
  {
    id: '01234',
    firstName: 'Lisa',
    lastName: 'Taylor',
    licenseNumber: 'CDL-567890',
    licenseExpiry: '2026-05-10',
    phoneNumber: '(555) 012-3456',
    fuelCard: 'FC-010-5678',
    assignedTruckId: 'TRK-010',
    status: 'active' as const,
    hireDate: '2021-09-15',
    emergencyContact: {
      name: 'Mark Taylor',
      phone: '(555) 098-7654',
      relationship: 'Husband'
    }
  },
  {
    id: '12345',
    firstName: 'Christopher',
    lastName: 'White',
    licenseNumber: 'CDL-678901',
    licenseExpiry: '2025-08-25',
    phoneNumber: '(555) 123-4567',
    fuelCard: 'FC-011-6789',
    assignedTruckId: 'TRK-011',
    status: 'active' as const,
    hireDate: '2022-06-03',
    emergencyContact: {
      name: 'Michelle White',
      phone: '(555) 987-6543',
      relationship: 'Wife'
    }
  },
  {
    id: '23456',
    firstName: 'Amanda',
    lastName: 'Harris',
    licenseNumber: 'CDL-789012',
    licenseExpiry: '2026-02-14',
    phoneNumber: '(555) 234-5678',
    fuelCard: 'FC-012-7890',
    assignedTruckId: 'TRK-012',
    status: 'active' as const,
    hireDate: '2023-01-10',
    emergencyContact: {
      name: 'Steve Harris',
      phone: '(555) 876-5432',
      relationship: 'Husband'
    }
  },
  {
    id: '34567',
    firstName: 'Daniel',
    lastName: 'Clark',
    licenseNumber: 'CDL-890123',
    licenseExpiry: '2025-12-05',
    phoneNumber: '(555) 345-6789',
    fuelCard: 'FC-013-8901',
    assignedTruckId: 'TRK-013',
    status: 'active' as const,
    hireDate: '2022-10-22',
    emergencyContact: {
      name: 'Rebecca Clark',
      phone: '(555) 765-4321',
      relationship: 'Wife'
    }
  },
  {
    id: '45678',
    firstName: 'Patricia',
    lastName: 'Lewis',
    licenseNumber: 'CDL-901234',
    licenseExpiry: '2026-04-18',
    phoneNumber: '(555) 456-7890',
    fuelCard: 'FC-014-9012',
    assignedTruckId: 'TRK-014',
    status: 'active' as const,
    hireDate: '2021-12-07',
    emergencyContact: {
      name: 'Robert Lewis',
      phone: '(555) 654-3210',
      relationship: 'Husband'
    }
  },
  {
    id: '56789',
    firstName: 'Thomas',
    lastName: 'Walker',
    licenseNumber: 'CDL-012345',
    licenseExpiry: '2025-10-30',
    phoneNumber: '(555) 567-8901',
    fuelCard: 'FC-015-0123',
    assignedTruckId: 'TRK-015',
    status: 'active' as const,
    hireDate: '2023-03-14',
    emergencyContact: {
      name: 'Susan Walker',
      phone: '(555) 543-2109',
      relationship: 'Wife'
    }
  },
  {
    id: '67890',
    firstName: 'Nancy',
    lastName: 'Hall',
    licenseNumber: 'CDL-123456',
    licenseExpiry: '2026-06-12',
    phoneNumber: '(555) 678-9012',
    fuelCard: 'FC-016-1234',
    assignedTruckId: 'TRK-016',
    status: 'active' as const,
    hireDate: '2022-05-18',
    emergencyContact: {
      name: 'Paul Hall',
      phone: '(555) 432-1098',
      relationship: 'Husband'
    }
  },
  {
    id: '78901',
    firstName: 'Steven',
    lastName: 'Allen',
    licenseNumber: 'CDL-234567',
    licenseExpiry: '2025-09-08',
    phoneNumber: '(555) 789-0123',
    fuelCard: 'FC-017-2345',
    assignedTruckId: 'TRK-017',
    status: 'active' as const,
    hireDate: '2021-11-25',
    emergencyContact: {
      name: 'Karen Allen',
      phone: '(555) 321-0987',
      relationship: 'Wife'
    }
  },
  {
    id: '89012',
    firstName: 'Betty',
    lastName: 'Young',
    licenseNumber: 'CDL-345678',
    licenseExpiry: '2026-01-22',
    phoneNumber: '(555) 890-1234',
    fuelCard: 'FC-018-3456',
    assignedTruckId: 'TRK-018',
    status: 'active' as const,
    hireDate: '2023-07-11',
    emergencyContact: {
      name: 'William Young',
      phone: '(555) 210-9876',
      relationship: 'Husband'
    }
  },
  {
    id: '90123',
    firstName: 'Edward',
    lastName: 'King',
    licenseNumber: 'CDL-456789',
    licenseExpiry: '2025-11-16',
    phoneNumber: '(555) 901-2345',
    fuelCard: 'FC-019-4567',
    assignedTruckId: 'TRK-019',
    status: 'active' as const,
    hireDate: '2022-08-29',
    emergencyContact: {
      name: 'Dorothy King',
      phone: '(555) 109-8765',
      relationship: 'Wife'
    }
  },
  {
    id: '01234',
    firstName: 'Helen',
    lastName: 'Wright',
    licenseNumber: 'CDL-567890',
    licenseExpiry: '2026-03-04',
    phoneNumber: '(555) 012-3456',
    fuelCard: 'FC-020-5678',
    assignedTruckId: 'TRK-020',
    status: 'active' as const,
    hireDate: '2021-10-13',
    emergencyContact: {
      name: 'Charles Wright',
      phone: '(555) 098-7654',
      relationship: 'Husband'
    }
  },
  {
    id: '12345',
    firstName: 'Gary',
    lastName: 'Lopez',
    licenseNumber: 'CDL-678901',
    licenseExpiry: '2025-12-20',
    phoneNumber: '(555) 123-4567',
    fuelCard: 'FC-021-6789',
    assignedTruckId: undefined,
    status: 'in-training' as const,
    hireDate: '2024-01-08',
    emergencyContact: {
      name: 'Maria Lopez',
      phone: '(555) 987-6543',
      relationship: 'Wife'
    }
  },
  {
    id: '23456',
    firstName: 'Sandra',
    lastName: 'Hill',
    licenseNumber: 'CDL-789012',
    licenseExpiry: '2026-07-15',
    phoneNumber: '(555) 234-5678',
    fuelCard: 'FC-022-7890',
    assignedTruckId: 'TRK-022',
    status: 'active' as const,
    hireDate: '2022-04-26',
    emergencyContact: {
      name: 'Richard Hill',
      phone: '(555) 876-5432',
      relationship: 'Husband'
    }
  },
  {
    id: '34567',
    firstName: 'Kenneth',
    lastName: 'Green',
    licenseNumber: 'CDL-890123',
    licenseExpiry: '2025-08-11',
    phoneNumber: '(555) 345-6789',
    fuelCard: 'FC-023-8901',
    assignedTruckId: 'TRK-023',
    status: 'active' as const,
    hireDate: '2023-06-17',
    emergencyContact: {
      name: 'Brenda Green',
      phone: '(555) 765-4321',
      relationship: 'Wife'
    }
  }
];

export default function DriversPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'rows'>('rows');
  
  const activeDrivers = mockDrivers.filter(d => d.status === 'active').length;
  const totalDrivers = mockDrivers.length;
  const inTrainingDrivers = mockDrivers.filter(d => d.status === 'in-training').length;
  const oosDrivers = mockDrivers.filter(d => d.status === 'oos').length;

  return (
    <div className="p-4 md:p-6 space-y-6">      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Drivers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your driver roster and assignments
          </p>
        </div>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm flex items-center gap-1 ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('rows')}
            className={`px-3 py-2 text-sm flex items-center gap-1 border-l border-gray-300 ${
              viewMode === 'rows' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="h-4 w-4" />
            Rows
          </button>
        </div>
      </div>      {/* Stats Cards and Search - Unified layout */}
      <div className="lg:flex lg:gap-0 lg:items-stretch space-y-6 lg:space-y-0">
        {/* Stats Cards Container - Unified design */}
        <div className="lg:bg-white lg:border lg:border-gray-200 lg:rounded-l-lg lg:shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-0 lg:divide-x lg:divide-gray-200">
            <div className="lg:p-6 p-4 text-center bg-white border border-gray-200 rounded-lg lg:border-0 lg:rounded-none">
              <div className="text-2xl font-bold text-blue-600">{totalDrivers}</div>
              <div className="text-sm text-gray-600">Total Drivers</div>
            </div>
            <div className="lg:p-6 p-4 text-center bg-white border border-gray-200 rounded-lg lg:border-0 lg:rounded-none">
              <div className="text-2xl font-bold text-green-600">{activeDrivers}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>            <div className="lg:p-6 p-4 text-center bg-white border border-gray-200 rounded-lg lg:border-0 lg:rounded-none">
              <div className="text-2xl font-bold text-yellow-600">{inTrainingDrivers}</div>
              <div className="text-sm text-gray-600">In Training</div>
            </div>
            <div className="lg:p-6 p-4 text-center bg-white border border-gray-200 rounded-lg lg:border-0 lg:rounded-none">
              <div className="text-2xl font-bold text-red-600">{oosDrivers}</div>
              <div className="text-sm text-gray-600">OOS</div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Unified with stats cards */}
        <div className="lg:bg-white lg:border-t lg:border-r lg:border-b lg:border-gray-200 lg:rounded-r-lg lg:shadow-sm lg:flex-1 lg:flex lg:items-center">
          <div className="w-full p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-4 lg:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent lg:border-0 lg:bg-gray-50 lg:focus:bg-white lg:focus:ring-1"
                />
              </div>
              <div className="flex gap-2 lg:flex-shrink-0">
                <div className="relative">
                  <Button variant="outline" className="lg:border-0 lg:bg-gray-50 lg:hover:bg-gray-100">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  {/* Filter dropdown would go here - for now showing the options you specified */}
                  <div className="hidden absolute right-0 top-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="space-y-2">
                        <div className="font-medium text-sm text-gray-700 mb-2">Driver Type</div>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Company Drivers</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Independent Contractors</span>
                        </label>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="font-medium text-sm text-gray-700 mb-2">Route Type</div>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Local</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Regional</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">System</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Preloaders</span>
                        </label>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="font-medium text-sm text-gray-700 mb-2">Assignment</div>                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Truck</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{/* Drivers List */}
      {viewMode === 'grid' ? (
        <div>
          {/* Mobile View - Shows simplified driver cards */}
          <div className="block sm:hidden space-y-3">
            {mockDrivers.map((driver) => (
              <Card key={driver.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <a 
                        href={`/drivers/${driver.id}`}
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {driver.firstName} {driver.lastName}
                      </a>
                      <div className="flex items-center mt-1">
                        <Badge variant="status" status={driver.status} size="sm">
                          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="p-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop/Tablet View - Shows full driver cards */}
          <div className="hidden sm:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockDrivers.map((driver) => (
              <Card key={driver.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {driver.id}</p>
                    </div>
                    <Badge variant="status" status={driver.status}>
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {driver.phoneNumber}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Fuel Card: {driver.fuelCard}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      License: {driver.licenseNumber}
                    </div>
                    {driver.assignedTruckId && (
                      <div className="flex items-center text-sm text-gray-600">
                        <TruckIcon className="h-4 w-4 mr-2" />
                        Assigned: {driver.assignedTruckId}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">                      <span className="text-xs text-gray-500">
                        Hired: {new Date(driver.hireDate).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fuel Card</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">License</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Truck</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Hired: {new Date(driver.hireDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.phoneNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.fuelCard}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.licenseNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {driver.assignedTruckId ? (
                        <span className="flex items-center">
                          <TruckIcon className="h-4 w-4 mr-1" />
                          {driver.assignedTruckId}
                        </span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="status" status={driver.status} size="sm">
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </td>                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}      {/* Driver Actions - Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Driver Recruitment */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center py-12">
            <div className="text-green-700">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Driver Recruitment</h3>
              <p className="text-sm mb-4">
                Manage recruitment pipeline and attract new drivers to join your fleet.
              </p>              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Recruitment Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Driver Management */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="text-center py-12">
            <div className="text-blue-700">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Driver Management</h3>
              <p className="text-sm mb-4">
                Access HR services, training programs, and driver support tools.
              </p>              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Management Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
