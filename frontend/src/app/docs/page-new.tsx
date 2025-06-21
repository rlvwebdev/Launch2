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
  ArrowLeft
} from 'lucide-react';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  params?: string[];
  body?: string;
}

interface ApiSection {
  title: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'backend' | 'frontend' | 'auth' | 'types'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['auth']));

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const apiSections: ApiSection[] = [
    {
      title: 'Authentication',
      description: 'JWT-based authentication system for secure API access',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/login/',
          description: 'User login with credentials',
          auth: false,
          body: '{ "username": "string", "password": "string" }'
        },
        {
          method: 'POST',
          path: '/api/auth/refresh/',
          description: 'Refresh JWT access token',
          auth: false,
          body: '{ "refresh": "string" }'
        },
        {
          method: 'POST',
          path: '/api/auth/register/',
          description: 'Register new user account',
          auth: false,
          body: '{ "username": "string", "email": "string", "password": "string", "company": "string" }'
        },
        {
          method: 'POST',
          path: '/api/auth/logout/',
          description: 'Logout and invalidate tokens',
          auth: true,
          body: '{ "refresh": "string" }'
        },
        {
          method: 'GET',
          path: '/api/auth/verify/',
          description: 'Verify token validity',
          auth: true
        }
      ]
    },
    {
      title: 'Driver Management',
      description: 'Complete CRUD operations for driver records and documentation',
      endpoints: [
        {
          method: 'GET',
          path: '/api/drivers/',
          description: 'List all drivers (paginated, company-filtered)',
          auth: true,
          params: ['page', 'page_size', 'search', 'status']
        },
        {
          method: 'POST',
          path: '/api/drivers/',
          description: 'Create new driver record',
          auth: true,
          body: 'Driver object with required fields'
        },
        {
          method: 'GET',
          path: '/api/drivers/{id}/',
          description: 'Get specific driver details',
          auth: true,
          params: ['id']
        },
        {
          method: 'PUT',
          path: '/api/drivers/{id}/',
          description: 'Update driver record',
          auth: true,
          params: ['id'],
          body: 'Partial driver object'
        },
        {
          method: 'DELETE',
          path: '/api/drivers/{id}/',
          description: 'Delete driver record',
          auth: true,
          params: ['id']
        }
      ]
    },
    {
      title: 'Vehicle Management',
      description: 'Truck and trailer fleet management with maintenance tracking',
      endpoints: [
        {
          method: 'GET',
          path: '/api/trucks/',
          description: 'List all trucks (paginated, company-filtered)',
          auth: true,
          params: ['page', 'page_size', 'search', 'status']
        },
        {
          method: 'POST',
          path: '/api/trucks/',
          description: 'Add new truck to fleet',
          auth: true,
          body: 'Truck object with specifications'
        },
        {
          method: 'GET',
          path: '/api/trailers/',
          description: 'List all trailers (paginated, company-filtered)',
          auth: true,
          params: ['page', 'page_size', 'search', 'status']
        },
        {
          method: 'POST',
          path: '/api/trailers/',
          description: 'Add new trailer to fleet',
          auth: true,
          body: 'Trailer object with specifications'
        },
        {
          method: 'GET',
          path: '/api/maintenance/',
          description: 'List maintenance records',
          auth: true,
          params: ['vehicle_type', 'vehicle_id', 'date_range']
        }
      ]
    },
    {
      title: 'Load Management',
      description: 'Shipment and cargo management with real-time tracking',
      endpoints: [
        {
          method: 'GET',
          path: '/api/loads/',
          description: 'List all loads (paginated, company-filtered)',
          auth: true,
          params: ['page', 'page_size', 'search', 'status', 'date_range']
        },
        {
          method: 'POST',
          path: '/api/loads/',
          description: 'Create new load/shipment',
          auth: true,
          body: 'Load object with pickup/delivery details'
        },
        {
          method: 'GET',
          path: '/api/loads/{id}/events/',
          description: 'Get load event history',
          auth: true,
          params: ['id']
        },
        {
          method: 'POST',
          path: '/api/loads/{id}/events/',
          description: 'Add load event (pickup, delivery, delay, etc.)',
          auth: true,
          params: ['id'],
          body: 'LoadEvent object'
        },
        {
          method: 'GET',
          path: '/api/loads/{id}/documents/',
          description: 'Get load documents (BOL, POD, etc.)',
          auth: true,
          params: ['id']
        }
      ]
    },
    {
      title: 'Company & Organization',
      description: 'Multi-tenant company management and organizational hierarchy',
      endpoints: [
        {
          method: 'GET',
          path: '/api/companies/',
          description: 'List companies (admin only)',
          auth: true
        },
        {
          method: 'GET',
          path: '/api/companies/public/',
          description: 'Public company list for registration',
          auth: false
        },
        {
          method: 'GET',
          path: '/api/divisions/',
          description: 'List company divisions',
          auth: true
        },
        {
          method: 'GET',
          path: '/api/departments/',
          description: 'List departments within divisions',
          auth: true
        },
        {
          method: 'GET',
          path: '/api/terminals/',
          description: 'List terminals/locations',
          auth: true
        }
      ]
    },
    {
      title: 'Health & Monitoring',
      description: 'System health checks and monitoring endpoints',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health/',
          description: 'Backend health check',
          auth: false
        },
        {
          method: 'GET',
          path: '/api/schema/',
          description: 'OpenAPI schema definition',
          auth: false
        },
        {
          method: 'GET',
          path: '/api/docs/',
          description: 'Interactive Swagger UI documentation',
          auth: false
        }
      ]
    }
  ];

  const frontendFeatures = [
    {
      title: 'Authentication System',
      description: 'JWT-based auth with automatic token refresh',
      components: ['LoginForm', 'RegisterForm', 'AuthContext'],
      features: ['Auto token refresh', 'Secure storage', 'Route protection']
    },
    {
      title: 'Driver Management',
      description: 'Complete driver lifecycle management',
      components: ['DriverList', 'DriverForm', 'DriverDetails'],
      features: ['CDL validation', 'Training tracking', 'Document management']
    },
    {
      title: 'Fleet Management',
      description: 'Truck and trailer management with maintenance',
      components: ['TruckList', 'TrailerList', 'MaintenanceTracker'],
      features: ['Real-time status', 'Maintenance alerts', 'Assignment tracking']
    },
    {
      title: 'Load Operations',
      description: 'Shipment tracking and management',
      components: ['LoadList', 'LoadForm', 'LoadTracking'],
      features: ['Route optimization', 'Status updates', 'Document handling']
    },
    {
      title: 'Reporting & Analytics',
      description: 'Business intelligence and reporting',
      components: ['Dashboard', 'ReportBuilder', 'Analytics'],
      features: ['Real-time metrics', 'Custom reports', 'Data visualization']
    }
  ];

  const techStack = {
    frontend: [
      { name: 'Next.js 15.3.3', version: '15.3.3', description: 'React framework with App Router' },
      { name: 'React 19', version: '19.0', description: 'UI library with latest features' },
      { name: 'TypeScript', version: '5.x', description: 'Type-safe JavaScript' },
      { name: 'Tailwind CSS', version: '4.x', description: 'Utility-first CSS framework' },
      { name: 'Lucide React', version: 'latest', description: 'Icon library' }
    ],
    backend: [
      { name: 'Django', version: '5.0.4', description: 'Python web framework' },
      { name: 'Django REST Framework', version: 'latest', description: 'API framework' },
      { name: 'SimpleJWT', version: 'latest', description: 'JWT authentication' },
      { name: 'PostgreSQL', version: '15+', description: 'Primary database' },
      { name: 'DRF Spectacular', version: 'latest', description: 'API documentation' }
    ]
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-black text-[var(--color-text)]">
                L<span className="text-[var(--color-accent)]">A</span>UNCH
              </h1>
              <span className="text-[var(--color-accent)] font-medium">API Documentation</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Link>
              <a 
                href="http://localhost:8000/api/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Interactive API</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[var(--color-surface)] mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'backend', label: 'Backend API', icon: Server },
              { id: 'frontend', label: 'Frontend', icon: Globe },
              { id: 'auth', label: 'Authentication', icon: Shield },
              { id: 'types', label: 'Data Types', icon: Code }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* System Overview */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
                Launch Transportation Management Platform
              </h2>
              <p className="text-[var(--color-text)] opacity-80 mb-6">
                A comprehensive transportation management system (TMS) designed for trucking companies to manage 
                their fleet operations. Built with modern web technologies and designed for scalability, multi-tenancy, 
                and mobile-first usage patterns.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center">
                    <Server className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
                    Backend Architecture
                  </h3>
                  <ul className="space-y-2 text-sm text-[var(--color-text)] opacity-80">
                    <li>• Django 5.0.4 REST API with PostgreSQL</li>
                    <li>• Multi-tenant architecture with company isolation</li>
                    <li>• JWT authentication with automatic refresh</li>
                    <li>• OpenAPI/Swagger documentation</li>
                    <li>• Role-based access control (RBAC)</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
                    Frontend Architecture
                  </h3>
                  <ul className="space-y-2 text-sm text-[var(--color-text)] opacity-80">
                    <li>• Next.js 15 with App Router and TypeScript</li>
                    <li>• Mobile-first responsive design</li>
                    <li>• Context-based state management</li>
                    <li>• Progressive Web App (PWA) features</li>
                    <li>• Real-time UI updates</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[var(--color-surface)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
                  Frontend Stack
                </h3>
                <div className="space-y-3">
                  {techStack.frontend.map((tech, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-[var(--color-surface)] last:border-0">
                      <div>
                        <div className="font-medium text-[var(--color-text)]">{tech.name}</div>
                        <div className="text-sm text-[var(--color-text)] opacity-70">{tech.description}</div>
                      </div>
                      <span className="text-[var(--color-accent)] text-sm font-mono">{tech.version}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--color-surface)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center">
                  <Server className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
                  Backend Stack
                </h3>
                <div className="space-y-3">
                  {techStack.backend.map((tech, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-[var(--color-surface)] last:border-0">
                      <div>
                        <div className="font-medium text-[var(--color-text)]">{tech.name}</div>
                        <div className="text-sm text-[var(--color-text)] opacity-70">{tech.description}</div>
                      </div>
                      <span className="text-[var(--color-accent)] text-sm font-mono">{tech.version}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Links</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <a 
                  href="http://localhost:8000/api/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded border border-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors group"
                >
                  <ExternalLink className="w-5 h-5 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent)]">Swagger UI</span>
                </a>
                <a 
                  href="http://localhost:8000/api/schema/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded border border-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors group"
                >
                  <Code className="w-5 h-5 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent)]">OpenAPI Schema</span>
                </a>
                <a 
                  href="http://localhost:8000/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded border border-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors group"
                >
                  <Settings className="w-5 h-5 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent)]">Django Admin</span>
                </a>
                <a 
                  href="http://localhost:8000/api/health/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded border border-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors group"
                >
                  <Activity className="w-5 h-5 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent)]">Health Check</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backend' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Backend API Reference</h2>
              <p className="text-[var(--color-text)] opacity-80 mb-4">
                RESTful API endpoints for the Launch TMS platform. All endpoints use JSON for request/response data.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-[var(--color-text)]">Base URL: http://localhost:8000/api</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-text)]">JWT Authentication Required</span>
                </span>
              </div>
            </div>

            {apiSections.map((section, index) => (
              <div key={index} className="bg-[var(--color-surface)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--color-background)] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ChevronRight 
                      className={`w-5 h-5 text-[var(--color-accent)] transition-transform ${
                        expandedSections.has(section.title) ? 'rotate-90' : ''
                      }`}
                    />
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">{section.title}</h3>
                  </div>
                  <span className="text-sm text-[var(--color-text)] opacity-70">
                    {section.endpoints.length} endpoints
                  </span>
                </button>
                
                {expandedSections.has(section.title) && (
                  <div className="px-6 pb-6">
                    <p className="text-[var(--color-text)] opacity-80 mb-4">{section.description}</p>
                    <div className="space-y-3">
                      {section.endpoints.map((endpoint, endpointIndex) => (
                        <div key={endpointIndex} className="border border-[var(--color-surface)] rounded-lg p-4">
                          <div className="flex items-center space-x-4 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                              endpoint.method === 'GET' ? 'bg-blue-500' :
                              endpoint.method === 'POST' ? 'bg-green-500' :
                              endpoint.method === 'PUT' ? 'bg-yellow-500' :
                              endpoint.method === 'PATCH' ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-[var(--color-text)] font-mono text-sm bg-[var(--color-background)] px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                            {endpoint.auth ? (
                              <Check className="w-4 h-4 text-green-500" title="Authentication required" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" title="No authentication required" />
                            )}
                          </div>
                          <p className="text-[var(--color-text)] opacity-80 text-sm mb-2">{endpoint.description}</p>
                          
                          {endpoint.params && (
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-[var(--color-text)] opacity-70">Parameters:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {endpoint.params.map((param, paramIndex) => (
                                  <code key={paramIndex} className="text-xs bg-[var(--color-background)] px-1 py-0.5 rounded text-[var(--color-accent)]">
                                    {param}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {endpoint.body && (
                            <div>
                              <span className="text-xs font-semibold text-[var(--color-text)] opacity-70">Request Body:</span>
                              <code className="block text-xs bg-[var(--color-background)] p-2 rounded mt-1 text-[var(--color-accent)]">
                                {endpoint.body}
                              </code>
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
        )}

        {activeTab === 'frontend' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Frontend Architecture</h2>
              <p className="text-[var(--color-text)] opacity-80 mb-4">
                Next.js 15 application with TypeScript, featuring a component-based architecture and modern React patterns.
              </p>
            </div>

            <div className="grid gap-6">
              {frontendFeatures.map((feature, index) => (
                <div key={index} className="bg-[var(--color-surface)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{feature.title}</h3>
                  <p className="text-[var(--color-text)] opacity-80 mb-4">{feature.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2">Components</h4>
                      <div className="flex flex-wrap gap-2">
                        {feature.components.map((component, componentIndex) => (
                          <code key={componentIndex} className="text-xs bg-[var(--color-background)] px-2 py-1 rounded text-[var(--color-accent)]">
                            {component}
                          </code>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2">Features</h4>
                      <ul className="text-sm text-[var(--color-text)] opacity-80 space-y-1">
                        {feature.features.map((feat, featIndex) => (
                          <li key={featIndex}>• {feat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* File Structure */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Project Structure</h3>
              <pre className="text-sm text-[var(--color-text)] opacity-80 bg-[var(--color-background)] p-4 rounded overflow-x-auto">
{`frontend/src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── drivers/           # Driver management pages
│   ├── trucks/            # Vehicle management pages
│   ├── loads/             # Load management pages
│   ├── reports/           # Reporting and analytics
│   └── settings/          # Application settings
├── components/            # Reusable React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── navigation/        # Navigation components
│   ├── forms/             # Form components
│   └── reports/           # Report-specific components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Authentication System</h2>
              <p className="text-[var(--color-text)] opacity-80 mb-4">
                JWT-based authentication system with automatic token refresh and multi-tenant support.
              </p>
            </div>

            {/* Auth Flow */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Authentication Flow</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)]">User Login</h4>
                    <p className="text-[var(--color-text)] opacity-80 text-sm">User submits credentials to <code>/api/auth/login/</code></p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)]">Token Generation</h4>
                    <p className="text-[var(--color-text)] opacity-80 text-sm">Backend validates credentials and returns access + refresh tokens</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)]">Token Storage</h4>
                    <p className="text-[var(--color-text)] opacity-80 text-sm">Frontend stores tokens securely and includes in API requests</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)]">Auto Refresh</h4>
                    <p className="text-[var(--color-text)] opacity-80 text-sm">System automatically refreshes expired tokens</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Security Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-[var(--color-text)]">Backend Security</h4>
                  <ul className="text-sm text-[var(--color-text)] opacity-80 space-y-1">
                    <li>• JWT token-based authentication</li>
                    <li>• Automatic token expiration</li>
                    <li>• Refresh token rotation</li>
                    <li>• Company-based data isolation</li>
                    <li>• Role-based access control</li>
                    <li>• CORS protection</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-[var(--color-text)]">Frontend Security</h4>
                  <ul className="text-sm text-[var(--color-text)] opacity-80 space-y-1">
                    <li>• Secure token storage</li>
                    <li>• Automatic logout on token expiry</li>
                    <li>• Route protection</li>
                    <li>• XSS protection</li>
                    <li>• Input validation</li>
                    <li>• HTTPS enforcement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Example Usage */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Example Usage</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">Login Request</h4>
                  <pre className="text-sm bg-[var(--color-background)] p-4 rounded overflow-x-auto text-[var(--color-text)]">
{`POST /api/auth/login/
Content-Type: application/json

{
  "username": "user@company.com",
  "password": "securepassword"
}`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">Login Response</h4>
                  <pre className="text-sm bg-[var(--color-background)] p-4 rounded overflow-x-auto text-[var(--color-text)]">
{`{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "user@company.com",
    "email": "user@company.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Data Types & Models</h2>
              <p className="text-[var(--color-text)] opacity-80 mb-4">
                TypeScript interfaces and data models used throughout the Launch TMS platform.
              </p>
            </div>

            {/* Core Types */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Core Data Models</h3>
              <div className="grid gap-4">
                <div className="border border-[var(--color-surface)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-[var(--color-accent)]" />
                    Driver
                  </h4>
                  <pre className="text-xs bg-[var(--color-background)] p-3 rounded overflow-x-auto text-[var(--color-text)]">
{`interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseExpiry: Date;
  phoneNumber: string;
  email?: string;
  status: DriverStatus;
  hireDate: Date;
  trainingStatus?: TrainingStatus;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  organizationalContext: OrganizationalContext;
  // ... additional fields
}`}
                  </pre>
                </div>

                <div className="border border-[var(--color-surface)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-2 flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-[var(--color-accent)]" />
                    Truck
                  </h4>
                  <pre className="text-xs bg-[var(--color-background)] p-3 rounded overflow-x-auto text-[var(--color-text)]">
{`interface Truck {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: TruckStatus;
  assignedDriverId?: string;
  mileage: number;
  lastMaintenance: Date;
  nextMaintenanceDue: Date;
  organizationalContext: OrganizationalContext;
  // ... additional fields
}`}
                  </pre>
                </div>

                <div className="border border-[var(--color-surface)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-[var(--color-accent)]" />
                    Load
                  </h4>
                  <pre className="text-xs bg-[var(--color-background)] p-3 rounded overflow-x-auto text-[var(--color-text)]">
{`interface Load {
  id: string;
  loadNumber: string;
  bolNumber: string;
  shipper: string;
  receiver?: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  assignedDriverId?: string;
  assignedTruckId?: string;
  status: LoadStatus;
  cargoDescription: string;
  weight: number;
  pickupDate: Date;
  deliveryDate: Date;
  rate: number;
  events: LoadEvent[];
  // ... additional fields
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Enums */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Status Enums</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-[var(--color-surface)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">DriverStatus</h4>
                  <pre className="text-xs bg-[var(--color-background)] p-3 rounded text-[var(--color-text)]">
{`enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  IN_TRAINING = 'in_training'
}`}
                  </pre>
                </div>

                <div className="border border-[var(--color-surface)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">TruckStatus</h4>
                  <pre className="text-xs bg-[var(--color-background)] p-3 rounded text-[var(--color-text)]">
{`enum TruckStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}`}
                  </pre>
                </div>

                <div className="border border-[var(--color-surface)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">LoadStatus</h4>
                  <pre className="text-xs bg-[var(--color-background)] p-3 rounded text-[var(--color-text)]">
{`enum LoadStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}`}
                  </pre>
                </div>

                <div className="border border-[var(--color-surface)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">TrainingStatus</h4>
                  <pre className="text-xs bg-[var(--color-background)] p-3 rounded text-[var(--color-text)]">
{`enum TrainingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Organizational Context */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Organizational Structure</h3>
              <div className="border border-[var(--color-surface)] rounded-lg p-4">
                <h4 className="font-semibold text-[var(--color-text)] mb-2">OrganizationalContext</h4>
                <pre className="text-sm bg-[var(--color-background)] p-4 rounded overflow-x-auto text-[var(--color-text)]">
{`interface OrganizationalContext {
  companyId: string;
  divisionId?: string;
  departmentId?: string;
  terminalId?: string;
}

// Hierarchical structure:
Company
└── Division
    └── Department
        └── Terminal`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
