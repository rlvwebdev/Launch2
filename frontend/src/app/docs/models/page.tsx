'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Database,
  User,
  Truck,
  Package,
  Building
} from 'lucide-react';

const models = [
  {
    name: 'User',
    icon: User,
    color: 'blue',
    description: 'User accounts and authentication',
    fields: [
      { name: 'id', type: 'number', description: 'Unique identifier' },
      { name: 'username', type: 'string', description: 'Login username' },
      { name: 'email', type: 'string', description: 'Email address' },
      { name: 'firstName', type: 'string', description: 'First name' },
      { name: 'lastName', type: 'string', description: 'Last name' },
      { name: 'isActive', type: 'boolean', description: 'Account status' },
      { name: 'role', type: 'string', description: 'User role (admin, manager, driver)' },
      { name: 'company', type: 'Company', description: 'Associated company' }
    ]
  },
  {
    name: 'Company',
    icon: Building,
    color: 'purple',
    description: 'Multi-tenant organization structure',
    fields: [
      { name: 'id', type: 'number', description: 'Unique identifier' },
      { name: 'name', type: 'string', description: 'Company name' },
      { name: 'address', type: 'string', description: 'Business address' },
      { name: 'phone', type: 'string', description: 'Contact phone' },
      { name: 'email', type: 'string', description: 'Business email' },
      { name: 'dotNumber', type: 'string', description: 'DOT number' },
      { name: 'mcNumber', type: 'string', description: 'MC number' },
      { name: 'isActive', type: 'boolean', description: 'Company status' }
    ]
  },
  {
    name: 'Driver',
    icon: User,
    color: 'green',
    description: 'Driver profiles and licensing information',
    fields: [
      { name: 'id', type: 'number', description: 'Unique identifier' },
      { name: 'employeeId', type: 'string', description: 'Employee ID' },
      { name: 'firstName', type: 'string', description: 'First name' },
      { name: 'lastName', type: 'string', description: 'Last name' },
      { name: 'phone', type: 'string', description: 'Contact phone' },
      { name: 'email', type: 'string', description: 'Email address' },
      { name: 'licenseNumber', type: 'string', description: 'CDL number' },
      { name: 'licenseExpiry', type: 'Date', description: 'License expiration' },
      { name: 'hireDate', type: 'Date', description: 'Employment start date' },
      { name: 'status', type: 'string', description: 'Active, inactive, terminated' },
      { name: 'currentTruck', type: 'Truck', description: 'Assigned truck' },
      { name: 'company', type: 'Company', description: 'Employer company' }
    ]
  },
  {
    name: 'Truck',
    icon: Truck,
    color: 'orange',
    description: 'Fleet vehicle information and assignments',
    fields: [
      { name: 'id', type: 'number', description: 'Unique identifier' },
      { name: 'truckNumber', type: 'string', description: 'Fleet number' },
      { name: 'make', type: 'string', description: 'Vehicle make' },
      { name: 'model', type: 'string', description: 'Vehicle model' },
      { name: 'year', type: 'number', description: 'Model year' },
      { name: 'vin', type: 'string', description: 'Vehicle identification number' },
      { name: 'licensePlate', type: 'string', description: 'License plate' },
      { name: 'status', type: 'string', description: 'Available, assigned, maintenance' },
      { name: 'currentDriver', type: 'Driver', description: 'Assigned driver' },
      { name: 'company', type: 'Company', description: 'Owner company' }
    ]
  },
  {
    name: 'Trailer',
    icon: Package,
    color: 'yellow',
    description: 'Trailer assets and specifications',
    fields: [
      { name: 'id', type: 'number', description: 'Unique identifier' },
      { name: 'trailerNumber', type: 'string', description: 'Fleet number' },
      { name: 'type', type: 'string', description: 'Dry van, reefer, flatbed, etc.' },
      { name: 'make', type: 'string', description: 'Trailer make' },
      { name: 'model', type: 'string', description: 'Trailer model' },
      { name: 'year', type: 'number', description: 'Model year' },
      { name: 'licensePlate', type: 'string', description: 'License plate' },
      { name: 'status', type: 'string', description: 'Available, assigned, maintenance' },
      { name: 'company', type: 'Company', description: 'Owner company' }
    ]
  },
  {
    name: 'Load',
    icon: Package,
    color: 'red',
    description: 'Shipment and load management',
    fields: [
      { name: 'id', type: 'number', description: 'Unique identifier' },
      { name: 'loadNumber', type: 'string', description: 'Load reference number' },
      { name: 'customer', type: 'string', description: 'Customer name' },
      { name: 'origin', type: 'string', description: 'Pickup location' },
      { name: 'destination', type: 'string', description: 'Delivery location' },
      { name: 'pickupDate', type: 'Date', description: 'Scheduled pickup' },
      { name: 'deliveryDate', type: 'Date', description: 'Scheduled delivery' },
      { name: 'status', type: 'string', description: 'Assigned, in transit, delivered' },
      { name: 'rate', type: 'number', description: 'Load rate' },
      { name: 'weight', type: 'number', description: 'Cargo weight' },
      { name: 'assignedDriver', type: 'Driver', description: 'Assigned driver' },
      { name: 'assignedTruck', type: 'Truck', description: 'Assigned truck' },
      { name: 'assignedTrailer', type: 'Trailer', description: 'Assigned trailer' },
      { name: 'company', type: 'Company', description: 'Company managing load' }
    ]
  }
];

const typeColors = {
  'string': 'text-blue-400',
  'number': 'text-green-400',
  'boolean': 'text-purple-400',
  'Date': 'text-yellow-400',
  'User': 'text-blue-300',
  'Company': 'text-purple-300',
  'Driver': 'text-green-300',
  'Truck': 'text-orange-300',
  'Trailer': 'text-yellow-300'
};

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/docs" 
            className="inline-flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Docs
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Data Models</h1>
            <p className="text-slate-300">TypeScript interfaces and schemas</p>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Overview */}
          <div className="text-center mb-8">
            <p className="text-xl text-slate-300 leading-relaxed">
              Complete TypeScript type definitions for all data models used in the Launch TMS platform
            </p>
          </div>

          {/* Models Grid */}
          <div className="space-y-8">
            {models.map((model) => {
              const Icon = model.icon;
              const colorClasses = {
                blue: 'border-blue-400/30 bg-blue-500/5',
                purple: 'border-purple-400/30 bg-purple-500/5',
                green: 'border-green-400/30 bg-green-500/5',
                orange: 'border-orange-400/30 bg-orange-500/5',
                yellow: 'border-yellow-400/30 bg-yellow-500/5',
                red: 'border-red-400/30 bg-red-500/5'
              };

              return (
                <div 
                  key={model.name}
                  className={`border rounded-lg p-6 ${colorClasses[model.color as keyof typeof colorClasses]}`}
                >
                  <div className="flex items-center mb-4">
                    <Icon className={`w-6 h-6 mr-3 text-${model.color}-400`} />
                    <h2 className="text-xl font-bold text-white">{model.name}</h2>
                  </div>
                  <p className="text-slate-300 mb-6">{model.description}</p>

                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Interface Definition</h4>
                    <div className="space-y-1 text-sm font-mono">
                      <div className="text-slate-300">
                        <span className="text-purple-400">interface</span>{' '}
                        <span className="text-white">{model.name}</span>{' '}
                        <span className="text-slate-300">{'{'}</span>
                      </div>
                      {model.fields.map((field, index) => (
                        <div key={index} className="pl-4 flex items-center">
                          <span className="text-blue-300">{field.name}</span>
                          <span className="text-slate-400">:</span>
                          <span className={`ml-2 ${typeColors[field.type as keyof typeof typeColors] || 'text-slate-300'}`}>
                            {field.type}
                          </span>
                          <span className="text-slate-400">;</span>
                          <span className="ml-4 text-slate-500 text-xs">{`// ${field.description}`}</span>
                        </div>
                      ))}
                      <div className="text-slate-300">{'}'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Relationships */}
          <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-400" />
              Data Relationships
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Primary Relationships</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Company → Users (one-to-many)</li>
                  <li>• Company → Drivers (one-to-many)</li>
                  <li>• Company → Trucks (one-to-many)</li>
                  <li>• Company → Trailers (one-to-many)</li>
                  <li>• Company → Loads (one-to-many)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Assignment Relationships</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Driver ↔ Truck (one-to-one assignment)</li>
                  <li>• Load → Driver (many-to-one)</li>
                  <li>• Load → Truck (many-to-one)</li>
                  <li>• Load → Trailer (many-to-one)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Type Usage */}
          <div className="mt-8 bg-green-500/10 border border-green-400/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Usage in Components</h3>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <pre className="text-slate-300 text-sm">
{`import { Driver, Truck, Load } from '@/types';

// Component props
interface DriverListProps {
  drivers: Driver[];
  onDriverSelect: (driver: Driver) => void;
}

// API response types
interface DriversResponse {
  results: Driver[];
  count: number;
  next: string | null;
  previous: string | null;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
