'use client';

import React, { useState } from 'react';
import ProfessionalPage from '@/components/layout/ProfessionalPage';
import { 
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ClockIcon,
  TruckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState('divisions');

  const kpis = [
    {
      id: 'divisions',
      label: 'Divisions',
      value: 8,
      icon: BuildingOffice2Icon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'departments',
      label: 'Departments',
      value: 24,
      icon: UserGroupIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'terminals',
      label: 'Terminals',
      value: 15,
      icon: MapPinIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'locations',
      label: 'Total Locations',
      value: 47,
      icon: TruckIcon,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const divisions = [
    {
      id: 1,
      name: 'Northeast Division',
      code: 'NED',
      region: 'Northeast US',
      headquarters: 'New York, NY',
      manager: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@launchtms.com',
      departments: 3,
      terminals: 5,
      employees: 247,
      established: '2018',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Southwest Division',
      code: 'SWD',
      region: 'Southwest US',
      headquarters: 'Phoenix, AZ',
      manager: 'Michael Rodriguez',
      phone: '+1 (555) 234-5678',
      email: 'michael.rodriguez@launchtms.com',
      departments: 4,
      terminals: 6,
      employees: 312,
      established: '2019',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Midwest Division',
      code: 'MWD',
      region: 'Midwest US',
      headquarters: 'Chicago, IL',
      manager: 'Jennifer Chen',
      phone: '+1 (555) 345-6789',
      email: 'jennifer.chen@launchtms.com',
      departments: 3,
      terminals: 4,
      employees: 198,
      established: '2020',
      status: 'Active'
    }
  ];

  const terminals = [
    {
      id: 1,
      name: 'Boston Terminal',
      code: 'BOS-01',
      division: 'Northeast Division',
      address: '123 Harbor Blvd, Boston, MA 02101',
      manager: 'David Wilson',
      phone: '+1 (555) 111-2222',
      email: 'david.wilson@launchtms.com',
      capacity: '50 trucks',
      operatingHours: '24/7',
      services: ['Maintenance', 'Fuel', 'Loading/Unloading'],
      established: '2018'
    },
    {
      id: 2,
      name: 'Phoenix Hub',
      code: 'PHX-01',
      division: 'Southwest Division',
      address: '456 Desert Way, Phoenix, AZ 85001',
      manager: 'Lisa Garcia',
      phone: '+1 (555) 222-3333',
      email: 'lisa.garcia@launchtms.com',
      capacity: '75 trucks',
      operatingHours: '24/7',
      services: ['Maintenance', 'Fuel', 'Loading/Unloading', 'Inspection'],
      established: '2019'
    },
    {
      id: 3,
      name: 'Chicago Distribution Center',
      code: 'CHI-01',
      division: 'Midwest Division',
      address: '789 Industrial Pkwy, Chicago, IL 60601',
      manager: 'Robert Kim',
      phone: '+1 (555) 333-4444',
      email: 'robert.kim@launchtms.com',
      capacity: '60 trucks',
      operatingHours: '5:00 AM - 11:00 PM',
      services: ['Maintenance', 'Fuel', 'Loading/Unloading'],
      established: '2020'
    }
  ];

  const tabs = [
    { id: 'divisions', label: 'Divisions', count: divisions.length },
    { id: 'terminals', label: 'Terminals', count: terminals.length },
    { id: 'departments', label: 'Departments', count: 24 }
  ];

  return (
    <ProfessionalPage
      title="Organization Directory"
      subtitle="Divisions, Departments, Terminals & Location Directory"
      kpis={kpis}
      showKPIs={true}
      breadcrumbs={[
        { label: 'More Apps', href: '#' },
        { label: 'Directory' }
      ]}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="border-b border-neutral-200">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-neutral-100 text-neutral-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divisions Tab */}
        {activeTab === 'divisions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Divisions</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Add Division
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {divisions.map((division) => (
                <div key={division.id} className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900">{division.name}</h4>
                      <p className="text-sm text-neutral-500">{division.code} • {division.region}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {division.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-600">{division.headquarters}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <UserGroupIcon className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-600">{division.manager}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-600">{division.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-600">{division.email}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{division.departments}</div>
                        <div className="text-xs text-neutral-500">Departments</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{division.terminals}</div>
                        <div className="text-xs text-neutral-500">Terminals</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{division.employees}</div>
                        <div className="text-xs text-neutral-500">Employees</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terminals Tab */}
        {activeTab === 'terminals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Terminals</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Add Terminal
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {terminals.map((terminal) => (
                <div key={terminal.id} className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900">{terminal.name}</h4>
                      <p className="text-sm text-neutral-500">{terminal.code} • {terminal.division}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-neutral-900">{terminal.capacity}</div>
                      <div className="text-xs text-neutral-500">Capacity</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-neutral-400 mt-0.5" />
                      <span className="text-neutral-600">{terminal.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <UserGroupIcon className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-600">{terminal.manager}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-600">{terminal.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <ClockIcon className="h-4 w-4 text-neutral-400" />
                      <span className="text-neutral-600">{terminal.operatingHours}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium text-neutral-900 mb-2">Services:</div>
                    <div className="flex flex-wrap gap-2">
                      {terminal.services.map((service, index) => (
                        <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
                      View Terminal Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Departments</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Add Department
              </button>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
              <BuildingOffice2Icon className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">Departments Coming Soon</h4>
              <p className="text-neutral-600 mb-4">
                Department directory and organizational structure will be available in the next update.
              </p>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Request Early Access
              </button>
            </div>
          </div>
        )}
      </div>
    </ProfessionalPage>
  );
}
