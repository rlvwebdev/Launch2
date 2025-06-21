'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code, 
  Database, 
  Globe, 
  Server, 
  Users, 
  Truck, 
  Package, 
  FileText,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Settings,
  Shield,
  Activity,
  ArrowLeft,
  Book,
  Rocket,
  Key,
  Terminal,
  Layout,
  Zap,
  Lock,
  Layers,
  Monitor,
  Smartphone,
  Cloud,
  GitBranch
} from 'lucide-react';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  params?: string[];
  body?: string;
  response?: string;
}

interface ApiSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  endpoints: ApiEndpoint[];
}

interface DataType {
  name: string;
  description: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabData[] = [
  { id: 'overview', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
  { id: 'backend', label: 'Backend API', icon: <Database className="w-4 h-4" /> },
  { id: 'frontend', label: 'Frontend', icon: <Layout className="w-4 h-4" /> },
  { id: 'auth', label: 'Authentication', icon: <Shield className="w-4 h-4" /> },
  { id: 'types', label: 'Data Types', icon: <Code className="w-4 h-4" /> },
];

const apiSections: ApiSection[] = [
  {
    title: 'Authentication',
    description: 'User authentication and authorization endpoints',
    icon: <Shield className="w-5 h-5 text-blue-400" />,
    endpoints: [
      {
        method: 'POST',
        path: '/auth/login/',
        description: 'User login with username/password',
        auth: false,
        body: '{ "username": "string", "password": "string" }',
        response: '{ "access": "jwt_token", "refresh": "refresh_token", "user": {...} }'
      },
      {
        method: 'POST',
        path: '/auth/refresh/',
        description: 'Refresh JWT access token',
        auth: false,
        body: '{ "refresh": "refresh_token" }',
        response: '{ "access": "new_jwt_token" }'
      },
      {
        method: 'POST',
        path: '/auth/register/',
        description: 'User registration',
        auth: false,
        body: '{ "email": "string", "password": "string", "first_name": "string", "last_name": "string", "company": "uuid" }',
        response: '{ "user": {...}, "access": "jwt_token", "refresh": "refresh_token" }'
      },
      {
        method: 'GET',
        path: '/users/me/',
        description: 'Get current user information',
        auth: true,
        response: '{ "id": "uuid", "username": "string", "email": "string", "company": {...} }'
      },
      {
        method: 'POST',
        path: '/auth/logout/',
        description: 'User logout',
        auth: true,
        body: '{ "refresh": "refresh_token" }'
      }
    ]
  },
  {
    title: 'Companies',
    description: 'Company and organizational structure management',
    icon: <Users className="w-5 h-5 text-green-400" />,
    endpoints: [
      {
        method: 'GET',
        path: '/companies/',
        description: 'List companies (filtered by user permissions)',
        auth: true,
        response: '[{ "id": "uuid", "name": "string", "code": "string", "is_active": true }]'
      },
      {
        method: 'GET',
        path: '/companies/public/',
        description: 'Public company list for registration',
        auth: false,
        response: '[{ "id": "uuid", "name": "string", "code": "string" }]'
      },
      {
        method: 'POST',
        path: '/companies/',
        description: 'Create new company (system admin only)',
        auth: true,
        body: '{ "name": "string", "code": "string", "address_street": "string", "phone": "string" }'
      },
      {
        method: 'GET',
        path: '/users/',
        description: 'List users in company',
        auth: true,
        response: '[{ "id": "uuid", "username": "string", "email": "string", "role": "string" }]'
      }
    ]
  },
  {
    title: 'Drivers',
    description: 'Driver management and licensing',
    icon: <Users className="w-5 h-5 text-purple-400" />,
    endpoints: [
      {
        method: 'GET',
        path: '/drivers/',
        description: 'List all drivers',
        auth: true,
        response: '[{ "id": "uuid", "firstName": "string", "lastName": "string", "licenseNumber": "string", "status": "active" }]'
      },
      {
        method: 'GET',
        path: '/drivers/{id}/',
        description: 'Get driver details',
        auth: true,
        params: ['id (UUID)'],
        response: '{ "id": "uuid", "firstName": "string", "emergencyContact": {...}, "organizationalContext": {...} }'
      },
      {
        method: 'POST',
        path: '/drivers/',
        description: 'Create new driver',
        auth: true,
        body: '{ "firstName": "string", "lastName": "string", "licenseNumber": "string", "licenseExpiry": "date", "phoneNumber": "string" }'
      },
      {
        method: 'PATCH',
        path: '/drivers/{id}/',
        description: 'Update driver information',
        auth: true,
        params: ['id (UUID)'],
        body: '{ "status": "active|inactive|suspended", "assignedTruckId": "uuid" }'
      },
      {
        method: 'DELETE',
        path: '/drivers/{id}/',
        description: 'Delete driver',
        auth: true,
        params: ['id (UUID)']
      }
    ]
  },
  {
    title: 'Vehicles',
    description: 'Truck and trailer fleet management',
    icon: <Truck className="w-5 h-5 text-orange-400" />,
    endpoints: [
      {
        method: 'GET',
        path: '/trucks/',
        description: 'List all trucks',
        auth: true,
        response: '[{ "id": "uuid", "make": "string", "model": "string", "year": 2024, "licensePlate": "string", "status": "available" }]'
      },
      {
        method: 'GET',
        path: '/trucks/{id}/',
        description: 'Get truck details',
        auth: true,
        params: ['id (UUID)'],
        response: '{ "id": "uuid", "vin": "string", "mileage": 50000, "assignedDriverId": "uuid", "organizationalContext": {...} }'
      },
      {
        method: 'POST',
        path: '/trucks/',
        description: 'Add new truck to fleet',
        auth: true,
        body: '{ "make": "string", "model": "string", "year": 2024, "licensePlate": "string", "vin": "string" }'
      },
      {
        method: 'GET',
        path: '/trailers/',
        description: 'List all trailers',
        auth: true,
        response: '[{ "id": "uuid", "make": "string", "type": "dry_van", "capacity": 53, "licensePlate": "string" }]'
      },
      {
        method: 'POST',
        path: '/trailers/',
        description: 'Add new trailer',
        auth: true,
        body: '{ "make": "string", "model": "string", "type": "dry_van|flatbed|refrigerated", "capacity": 53 }'
      }
    ]
  },
  {
    title: 'Loads',
    description: 'Load and shipment management',
    icon: <Package className="w-5 h-5 text-red-400" />,
    endpoints: [
      {
        method: 'GET',
        path: '/loads/',
        description: 'List all loads',
        auth: true,
        response: '[{ "id": "uuid", "loadNumber": "string", "status": "pending", "pickupLocation": {...}, "deliveryLocation": {...} }]'
      },
      {
        method: 'GET',
        path: '/loads/{id}/',
        description: 'Get load details',
        auth: true,
        params: ['id (UUID)'],
        response: '{ "id": "uuid", "bolNumber": "string", "assignedDriverId": "uuid", "events": [...] }'
      },
      {
        method: 'POST',
        path: '/loads/',
        description: 'Create new load',
        auth: true,
        body: '{ "loadNumber": "string", "shipper": "string", "receiver": "string", "pickupDate": "datetime", "deliveryDate": "datetime" }'
      },
      {
        method: 'PATCH',
        path: '/loads/{id}/',
        description: 'Update load status or assignment',
        auth: true,
        params: ['id (UUID)'],
        body: '{ "status": "assigned|in_transit|delivered", "assignedDriverId": "uuid", "assignedTruckId": "uuid" }'
      }
    ]
  },
  {
    title: 'System',
    description: 'Health checks and system information',
    icon: <Activity className="w-5 h-5 text-cyan-400" />,
    endpoints: [
      {
        method: 'GET',
        path: '/health/',
        description: 'Backend health check',
        auth: false,
        response: '{ "status": "healthy", "message": "Django backend is running", "version": "1.0.0" }'
      },
      {
        method: 'GET',
        path: '/schema/',
        description: 'OpenAPI schema',
        auth: false,
        response: 'OpenAPI 3.0 schema document'
      },
      {
        method: 'GET',
        path: '/docs/',
        description: 'Swagger UI documentation',
        auth: false,
        response: 'Interactive API documentation'
      }
    ]
  }
];

const dataTypes: DataType[] = [
  {
    name: 'Driver',
    description: 'Driver profile and licensing information',
    fields: [
      { name: 'id', type: 'string (UUID)', required: true, description: 'Unique driver identifier' },
      { name: 'firstName', type: 'string', required: true, description: 'Driver first name' },
      { name: 'lastName', type: 'string', required: true, description: 'Driver last name' },
      { name: 'licenseNumber', type: 'string', required: true, description: 'CDL license number' },
      { name: 'licenseExpiry', type: 'Date', required: true, description: 'License expiration date' },
      { name: 'phoneNumber', type: 'string', required: true, description: 'Contact phone number' },
      { name: 'email', type: 'string', required: false, description: 'Email address' },
      { name: 'status', type: 'DriverStatus', required: true, description: 'Employment status' },
      { name: 'assignedTruckId', type: 'string (UUID)', required: false, description: 'Currently assigned truck' },
      { name: 'emergencyContact', type: 'EmergencyContact', required: true, description: 'Emergency contact information' },
      { name: 'organizationalContext', type: 'OrganizationalContext', required: true, description: 'Company hierarchy assignment' }
    ]
  },
  {
    name: 'Truck',
    description: 'Fleet vehicle information and status',
    fields: [
      { name: 'id', type: 'string (UUID)', required: true, description: 'Unique truck identifier' },
      { name: 'make', type: 'string', required: true, description: 'Truck manufacturer' },
      { name: 'model', type: 'string', required: true, description: 'Truck model' },
      { name: 'year', type: 'number', required: true, description: 'Manufacturing year' },
      { name: 'licensePlate', type: 'string', required: true, description: 'License plate number' },
      { name: 'vin', type: 'string', required: true, description: 'Vehicle identification number' },
      { name: 'status', type: 'VehicleStatus', required: true, description: 'Current availability status' },
      { name: 'assignedDriverId', type: 'string (UUID)', required: false, description: 'Currently assigned driver' },
      { name: 'mileage', type: 'number', required: true, description: 'Current odometer reading' },
      { name: 'organizationalContext', type: 'OrganizationalContext', required: true, description: 'Company hierarchy assignment' }
    ]
  },
  {
    name: 'Load',
    description: 'Shipment and delivery information',
    fields: [
      { name: 'id', type: 'string (UUID)', required: true, description: 'Unique load identifier' },
      { name: 'loadNumber', type: 'string', required: true, description: 'Load reference number' },
      { name: 'bolNumber', type: 'string', required: false, description: 'Bill of lading number' },
      { name: 'status', type: 'LoadStatus', required: true, description: 'Current load status' },
      { name: 'pickupLocation', type: 'Location', required: true, description: 'Pickup address and coordinates' },
      { name: 'deliveryLocation', type: 'Location', required: true, description: 'Delivery address and coordinates' },
      { name: 'assignedDriverId', type: 'string (UUID)', required: false, description: 'Assigned driver' },
      { name: 'assignedTruckId', type: 'string (UUID)', required: false, description: 'Assigned truck' },
      { name: 'cargoDescription', type: 'string', required: true, description: 'Description of cargo' },
      { name: 'weight', type: 'number', required: false, description: 'Cargo weight in pounds' },
      { name: 'rate', type: 'number', required: false, description: 'Payment rate for load' }
    ]
  },
  {
    name: 'Company',
    description: 'Company and organizational information',
    fields: [
      { name: 'id', type: 'string (UUID)', required: true, description: 'Unique company identifier' },
      { name: 'name', type: 'string', required: true, description: 'Company name' },
      { name: 'code', type: 'string', required: true, description: 'Company code/abbreviation' },
      { name: 'address_street', type: 'string', required: false, description: 'Street address' },
      { name: 'address_city', type: 'string', required: false, description: 'City' },
      { name: 'address_state', type: 'string', required: false, description: 'State/province' },
      { name: 'phone', type: 'string', required: false, description: 'Main phone number' },
      { name: 'email', type: 'string', required: false, description: 'Main email address' },
      { name: 'is_active', type: 'boolean', required: true, description: 'Company active status' }
    ]
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>('auth');

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  const renderMethodBadge = (method: string) => {
    const colors = {
      GET: 'bg-green-500/20 text-green-400 border-green-500/30',
      POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      PATCH: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      PUT: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${colors[method as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {method}
      </span>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Launch Transportation Management System
        </h2>
        <p className="text-xl text-slate-300 leading-relaxed mb-8">
          Complete documentation for the full-stack TMS platform built with Django REST Framework and Next.js
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-yellow-400" />
          System Architecture
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Backend (Django)</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Django 5.0.4 + REST Framework</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />PostgreSQL database</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />JWT authentication</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Multi-tenant architecture</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />OpenAPI/Swagger docs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Frontend (Next.js)</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Next.js 15 + App Router</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />TypeScript & Tailwind CSS</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Mobile-first responsive design</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Real-time API integration</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Progressive Web App features</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <a 
          href="http://localhost:8000/api/schema/swagger-ui/" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center mb-3">
            <Activity className="w-6 h-6 text-blue-400 mr-3" />
            <h4 className="font-semibold text-white">Swagger UI</h4>
            <ExternalLink className="w-4 h-4 ml-auto text-slate-400 group-hover:text-blue-400" />
          </div>
          <p className="text-slate-300 text-sm">Interactive API testing interface</p>
        </a>

        <a 
          href="http://localhost:8000/api/schema/" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-green-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center mb-3">
            <FileText className="w-6 h-6 text-green-400 mr-3" />
            <h4 className="font-semibold text-white">OpenAPI Schema</h4>
            <ExternalLink className="w-4 h-4 ml-auto text-slate-400 group-hover:text-green-400" />
          </div>
          <p className="text-slate-300 text-sm">Raw API schema definition</p>
        </a>

        <a 
          href="http://localhost:8000/admin/" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-purple-400/30 transition-all duration-300 group"
        >
          <div className="flex items-center mb-3">
            <Settings className="w-6 h-6 text-purple-400 mr-3" />
            <h4 className="font-semibold text-white">Django Admin</h4>
            <ExternalLink className="w-4 h-4 ml-auto text-slate-400 group-hover:text-purple-400" />
          </div>
          <p className="text-slate-300 text-sm">Database administration interface</p>
        </a>
      </div>

      {/* Environment Setup */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-300/5 border border-yellow-400/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Terminal className="w-5 h-5 mr-2 text-yellow-400" />
          Quick Start
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Backend Setup</h4>
            <div className="bg-slate-900/50 rounded-lg p-4 text-sm">
              <pre className="text-slate-300">
{`cd backend
python -m venv venv
venv\\Scripts\\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver`}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Frontend Setup</h4>
            <div className="bg-slate-900/50 rounded-lg p-4 text-sm">
              <pre className="text-slate-300">
{`cd frontend
npm install
npm run dev

# Access at http://localhost:3000`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackendApi = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Backend API Reference</h2>
        <p className="text-slate-300">Django REST Framework endpoints with request/response examples</p>
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-white mb-2">Base URL</h3>
        <code className="text-yellow-400 bg-slate-900/50 px-3 py-1 rounded">http://localhost:8000/api/</code>
      </div>

      {apiSections.map((section) => (
        <div key={section.title} className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center">
              {section.icon}
              <h3 className="text-lg font-semibold text-white ml-3">{section.title}</h3>
              <span className="ml-3 text-slate-400 text-sm">{section.description}</span>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-slate-400 transition-transform ${
                expandedSection === section.title ? 'rotate-90' : ''
              }`} 
            />
          </button>
          
          {expandedSection === section.title && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {section.endpoints.map((endpoint, index) => (
                  <div key={index} className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {renderMethodBadge(endpoint.method)}
                        <code className="text-cyan-400">{endpoint.path}</code>
                        {endpoint.auth && (
                          <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                            🔒 Auth Required
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 mb-3">{endpoint.description}</p>
                    
                    {endpoint.params && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-slate-200 mb-1">Parameters:</h5>
                        <ul className="text-sm text-slate-400">
                          {endpoint.params.map((param, i) => (
                            <li key={i} className="ml-4">• {param}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {endpoint.body && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-slate-200 mb-1">Request Body:</h5>
                        <pre className="text-xs bg-slate-800/50 rounded p-2 text-green-400 overflow-x-auto">
                          {endpoint.body}
                        </pre>
                      </div>
                    )}
                    
                    {endpoint.response && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-1">Response:</h5>
                        <pre className="text-xs bg-slate-800/50 rounded p-2 text-blue-400 overflow-x-auto">
                          {endpoint.response}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderFrontend = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Frontend Architecture</h2>
        <p className="text-slate-300">Next.js application structure and key features</p>
      </div>

      {/* Technology Stack */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2 text-blue-400" />
          Technology Stack
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Core Framework</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Next.js 15.3.3 with App Router</li>
              <li>• React 19 with TypeScript</li>
              <li>• Tailwind CSS v4 for styling</li>
              <li>• Lucide React icons</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Key Features</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Mobile-first responsive design</li>
              <li>• Real-time API integration</li>
              <li>• JWT authentication with auto-refresh</li>
              <li>• Progressive Web App features</li>
            </ul>
          </div>
        </div>
      </div>

      {/* File Structure */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-green-400" />
          Project Structure
        </h3>
        <div className="bg-slate-900/50 rounded-lg p-4 text-sm">
          <pre className="text-slate-300">
{`frontend/src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── drivers/           # Driver management
│   ├── trucks/            # Vehicle management
│   ├── loads/             # Load management
│   └── docs/              # This documentation
├── components/            # Reusable UI components
│   ├── ui/                # Base components
│   ├── layout/            # Layout components
│   └── forms/             # Form components
├── lib/                   # Utilities and configurations
│   └── api-client.ts      # API client with auth
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions`}
          </pre>
        </div>
      </div>

      {/* API Integration */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          API Integration
        </h3>
        <p className="text-slate-300 mb-4">
          The frontend uses a custom API client class that handles authentication, token refresh, and error handling.
        </p>
        <div className="bg-slate-900/50 rounded-lg p-4 text-sm">
          <pre className="text-slate-300">
{`// Example API usage
import { apiClient } from '@/lib/api-client';

// Get drivers with authentication
const drivers = await apiClient.getDrivers();

// Create new driver
const newDriver = await apiClient.createDriver({
  firstName: 'John',
  lastName: 'Doe',
  licenseNumber: 'CDL123456',
  // ... other fields
});`}
          </pre>
        </div>
      </div>

      {/* Mobile Features */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-purple-400" />
          Mobile-First Design
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Responsive Features</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Touch-optimized navigation</li>
              <li>• Swipe gestures for actions</li>
              <li>• Optimized for 320px+ screens</li>
              <li>• Progressive loading states</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">PWA Features</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Offline capability</li>
              <li>• App-like experience</li>
              <li>• Push notifications</li>
              <li>• Home screen installation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuth = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Authentication & Security</h2>
        <p className="text-slate-300">JWT-based authentication with automatic token refresh</p>
      </div>

      {/* Auth Flow */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-green-400" />
          Authentication Flow
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
            <div>
              <h4 className="font-semibold text-white">Login Request</h4>
              <p className="text-slate-300 text-sm">User submits username/password to <code className="text-yellow-400">/auth/login/</code></p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
            <div>
              <h4 className="font-semibold text-white">Token Generation</h4>
              <p className="text-slate-300 text-sm">Backend returns access token (24h) and refresh token (7d)</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
            <div>
              <h4 className="font-semibold text-white">Token Storage</h4>
              <p className="text-slate-300 text-sm">Tokens stored in localStorage/sessionStorage</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">4</div>
            <div>
              <h4 className="font-semibold text-white">Automatic Refresh</h4>
              <p className="text-slate-300 text-sm">Client automatically refreshes expired tokens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-red-400" />
          Security Features
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Backend Security</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />JWT token-based authentication</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />CORS protection</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />SQL injection prevention</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Input validation & sanitization</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Multi-tenant data isolation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Frontend Security</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Secure token storage</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Automatic token refresh</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />Route protection</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />XSS protection</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-400" />HTTPS enforcement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2 text-cyan-400" />
          Implementation Examples
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Login Implementation</h4>
            <div className="bg-slate-900/50 rounded-lg p-4 text-sm">
              <pre className="text-slate-300">
{`// Frontend login
const handleLogin = async (username: string, password: string) => {
  try {
    const response = await apiClient.login(username, password);
    // Tokens automatically stored
    router.push('/dashboard');
  } catch (error) {
    setError('Invalid credentials');
  }
};`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Protected API Request</h4>
            <div className="bg-slate-900/50 rounded-lg p-4 text-sm">
              <pre className="text-slate-300">
{`// API client automatically handles auth headers
const drivers = await apiClient.getDrivers();

// Equivalent to:
fetch('/api/drivers/', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  }
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Levels */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-orange-400" />
          User Roles & Permissions
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded">
            <div>
              <span className="font-medium text-white">System Admin</span>
              <p className="text-slate-400 text-sm">Full system access, multi-company management</p>
            </div>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">HIGHEST</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded">
            <div>
              <span className="font-medium text-white">Company Admin</span>
              <p className="text-slate-400 text-sm">Company-wide management and configuration</p>
            </div>
            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">HIGH</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded">
            <div>
              <span className="font-medium text-white">Dispatcher</span>
              <p className="text-slate-400 text-sm">Load and driver assignment, fleet coordination</p>
            </div>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">MEDIUM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded">
            <div>
              <span className="font-medium text-white">Driver</span>
              <p className="text-slate-400 text-sm">View assignments, update load status, personal profile</p>
            </div>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">BASIC</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypes = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Data Types & Models</h2>
        <p className="text-slate-300">TypeScript interfaces and Django model definitions</p>
      </div>

      {dataTypes.map((type) => (
        <div key={type.name} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{type.name}</h3>
          <p className="text-slate-300 mb-4">{type.description}</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-200">Field</th>
                  <th className="text-left py-2 text-slate-200">Type</th>
                  <th className="text-left py-2 text-slate-200">Required</th>
                  <th className="text-left py-2 text-slate-200">Description</th>
                </tr>
              </thead>
              <tbody>
                {type.fields.map((field) => (
                  <tr key={field.name} className="border-b border-slate-800">
                    <td className="py-2 text-cyan-400 font-mono">{field.name}</td>
                    <td className="py-2 text-yellow-400 font-mono">{field.type}</td>
                    <td className="py-2">
                      {field.required ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Required</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">Optional</span>
                      )}
                    </td>
                    <td className="py-2 text-slate-300">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Enums */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Common Enums</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">DriverStatus</h4>            <div className="bg-slate-900/30 rounded p-3 text-sm">
              <ul className="space-y-1 text-slate-300">
                <li><code className="text-green-400">&lsquo;active&rsquo;</code> - Available for assignments</li>
                <li><code className="text-yellow-400">&lsquo;inactive&rsquo;</code> - Temporarily unavailable</li>
                <li><code className="text-red-400">&lsquo;suspended&rsquo;</code> - Suspended from duty</li>
                <li><code className="text-blue-400">&lsquo;training&rsquo;</code> - In training period</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">LoadStatus</h4>            <div className="bg-slate-900/30 rounded p-3 text-sm">
              <ul className="space-y-1 text-slate-300">
                <li><code className="text-gray-400">&lsquo;pending&rsquo;</code> - Awaiting assignment</li>
                <li><code className="text-blue-400">&lsquo;assigned&rsquo;</code> - Assigned to driver/truck</li>
                <li><code className="text-yellow-400">&lsquo;in_transit&rsquo;</code> - Currently being transported</li>
                <li><code className="text-green-400">&lsquo;delivered&rsquo;</code> - Successfully delivered</li>
                <li><code className="text-red-400">&lsquo;cancelled&rsquo;</code> - Load cancelled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'backend':
        return renderBackendApi();
      case 'frontend':
        return renderFrontend();
      case 'auth':
        return renderAuth();
      case 'types':
        return renderTypes();
      default:
        return renderOverview();
    }
  };

  return (    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/auth" 
            className="inline-flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 bg-clip-text text-transparent tracking-wider">
              LAUNCH TMS
            </h1>
            <p className="text-slate-300">API Documentation</p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium
                  ${activeTab === tab.id 
                    ? 'bg-yellow-400 text-slate-900' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }
                `}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>

        {/* Quick Links Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Access</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="http://localhost:8000/api/health/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm border border-green-600/30"
              >
                <Activity className="w-4 h-4 mr-2" />
                Health Check
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
              <a 
                href="http://localhost:8000/api/schema/swagger-ui/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm border border-blue-600/30"
              >
                <FileText className="w-4 h-4 mr-2" />
                Swagger UI
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
              <a 
                href="http://localhost:8000/admin/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm border border-purple-600/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                Django Admin
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </div>
          </div>
          <p className="text-center text-slate-400 text-sm">
            Launch Transportation Management System - Complete API Documentation
          </p>
        </div>
      </div>
    </div>
  );
}
