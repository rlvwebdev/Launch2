'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Book,
  Code,
  Database,
  Shield,
  Layers,
  Activity,
  FileText,
  ExternalLink,
  Rocket,
  Terminal,
  GitBranch,
  Settings,
  Users,
  Monitor,
  Cloud,
  Smartphone,
  Menu,
  X,
  Truck,
  Package
} from 'lucide-react';

const docsSections = [
  {
    id: 'overview',
    title: 'Project Overview',
    icon: Rocket,
    sections: [
      { id: 'introduction', title: 'Introduction', href: '#introduction' },
      { id: 'architecture', title: 'Architecture', href: '#architecture' },
      { id: 'features', title: 'Core Features', href: '#features' },
      { id: 'tech-stack', title: 'Technology Stack', href: '#tech-stack' }
    ]
  },
  {
    id: 'backend',
    title: 'Backend Guide',
    icon: Database,
    sections: [
      { id: 'django-setup', title: 'Django Setup', href: '#django-setup' },
      { id: 'models', title: 'Data Models', href: '#models' },
      { id: 'api-endpoints', title: 'API Endpoints', href: '#api-endpoints' },
      { id: 'authentication', title: 'Authentication', href: '#authentication' }
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend Guide',
    icon: Monitor,
    sections: [
      { id: 'nextjs-setup', title: 'Next.js Setup', href: '#nextjs-setup' },
      { id: 'components', title: 'Components', href: '#components' },
      { id: 'routing', title: 'Routing & Navigation', href: '#routing' },
      { id: 'styling', title: 'Styling & Themes', href: '#styling' }
    ]
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code,
    sections: [
      { id: 'rest-api', title: 'REST API', href: '#rest-api' },
      { id: 'endpoints', title: 'Endpoints', href: '#endpoints' },
      { id: 'schemas', title: 'Data Schemas', href: '#schemas' },
      { id: 'examples', title: 'Examples', href: '#examples' }
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: Cloud,
    sections: [
      { id: 'production', title: 'Production Setup', href: '#production' },
      { id: 'docker', title: 'Docker Configuration', href: '#docker' },
      { id: 'ci-cd', title: 'CI/CD Pipeline', href: '#ci-cd' },
      { id: 'monitoring', title: 'Monitoring', href: '#monitoring' }
    ]
  }
];

const quickLinks = [
  {
    title: 'Swagger UI',
    description: 'Interactive API testing interface',
    href: 'http://localhost:8000/api/schema/swagger-ui/',
    icon: Activity,
    color: 'blue'
  },
  {
    title: 'OpenAPI Schema',
    description: 'Raw API schema definition',
    href: 'http://localhost:8000/api/schema/',
    icon: FileText,
    color: 'green'
  },
  {
    title: 'Django Admin',
    description: 'Database administration interface',
    href: 'http://localhost:8000/admin/',
    icon: Database,
    color: 'purple'
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSidebar = () => (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Book className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Documentation</h1>
            <p className="text-sm text-gray-500">Launch TMS Guides</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {docsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{section.title}</span>
              </button>
              
              {activeSection === section.id && (
                <div className="ml-8 mt-2 space-y-1">
                  {section.sections.map((subsection) => (
                    <a
                      key={subsection.id}
                      href={subsection.href}
                      className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-25 rounded transition-colors"
                    >
                      {subsection.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <section id="introduction">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🚀 Launch TMS</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  Launch is a comprehensive Transportation Management System (TMS) designed for modern trucking companies. 
                  Built with scalability, multi-tenancy, and mobile-first principles in mind.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">🎯 Target Users</h3>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Fleet Managers</li>
                      <li>• Dispatchers</li>
                      <li>• Drivers</li>
                      <li>• Company Administrators</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">✨ Key Features</h3>
                    <ul className="text-green-800 space-y-1">
                      <li>• Driver Management</li>
                      <li>• Fleet Operations</li>
                      <li>• Load Scheduling</li>
                      <li>• Real-time Tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="architecture">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Architecture Overview</h3>
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      Backend (Django 5.0.4)
                    </h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Django REST Framework</li>
                      <li>• PostgreSQL Database</li>
                      <li>• JWT Authentication</li>
                      <li>• Multi-tenant Architecture</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-green-600" />
                      Frontend (Next.js 15.3.3)
                    </h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• React 19 with TypeScript</li>
                      <li>• Tailwind CSS v4</li>
                      <li>• Mobile-first Design</li>
                      <li>• PWA Capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="features">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Features</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Users, title: 'Driver Management', desc: 'CDL tracking, assignments, performance' },
                  { icon: Truck, title: 'Fleet Operations', desc: 'Vehicle tracking, maintenance, assignments' },
                  { icon: Package, title: 'Load Management', desc: 'Scheduling, tracking, documentation' },
                  { icon: Activity, title: 'Analytics', desc: 'Reports, KPIs, performance metrics' }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <Icon className="h-8 w-8 text-blue-600 mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="tech-stack">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Backend</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Django 5.0.4</li>
                      <li>• Django REST Framework</li>
                      <li>• PostgreSQL</li>
                      <li>• JWT Authentication</li>
                      <li>• DRF Spectacular</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Frontend</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Next.js 15.3.3</li>
                      <li>• React 19</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS v4</li>
                      <li>• Lucide React Icons</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">DevOps</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Docker</li>
                      <li>• GitHub Actions</li>
                      <li>• Vercel Deployment</li>
                      <li>• ESLint & Prettier</li>
                      <li>• Jest Testing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case 'backend':
        return (
          <div className="space-y-8">
            <section id="django-setup">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Backend Development Guide</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  The Launch TMS backend is built with Django 5.0.4 and Django REST Framework, providing a robust API for the transportation management system.
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Quick Start</h3>
                  <div className="bg-white p-4 rounded border font-mono text-sm">
                    <div className="text-gray-800">
                      cd backend<br/>
                      pip install -r requirements.txt<br/>
                      python manage.py migrate<br/>
                      python manage.py runserver
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="models">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Models</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Driver', desc: 'Personal info, licensing, assignments, performance metrics' },
                  { title: 'Truck', desc: 'Vehicle details, maintenance records, GPS location' },
                  { title: 'Trailer', desc: 'Trailer specifications, maintenance, load capacity' },
                  { title: 'Load', desc: 'Origin/destination, cargo details, status tracking' },
                  { title: 'Company', desc: 'Organization structure, settings, billing' },
                  { title: 'User', desc: 'Authentication, roles, permissions, preferences' }
                ].map((model, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{model.title}</h4>
                    <p className="text-sm text-gray-600">{model.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="api-endpoints">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  {[
                    { method: 'GET', path: '/api/v1/drivers/', desc: 'List all drivers' },
                    { method: 'POST', path: '/api/v1/drivers/', desc: 'Create new driver' },
                    { method: 'GET', path: '/api/v1/trucks/', desc: 'List all trucks' },
                    { method: 'GET', path: '/api/v1/loads/', desc: 'List all loads' },
                    { method: 'POST', path: '/api/v1/auth/login/', desc: 'User authentication' }
                  ].map((endpoint, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded border">
                      <span className={`px-2 py-1 text-xs font-mono rounded ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm">{endpoint.path}</code>
                      <span className="text-gray-600 text-sm">{endpoint.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="authentication">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h3>
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3">JWT Token Authentication</h4>
                <p className="text-yellow-800 mb-4">
                  The API uses JWT tokens for authentication. Include the token in the Authorization header for all protected endpoints.
                </p>
                <div className="bg-white p-4 rounded border font-mono text-sm">
                  Authorization: Bearer &lt;your-jwt-token&gt;
                </div>
              </div>
            </section>
          </div>
        );

      case 'frontend':
        return (
          <div className="space-y-8">
            <section id="nextjs-setup">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frontend Development Guide</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  The Launch TMS frontend is built with Next.js 15.3.3, React 19, and TypeScript, providing a modern and responsive user interface.
                </p>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                  <h3 className="font-semibold text-green-900 mb-3">Quick Start</h3>
                  <div className="bg-white p-4 rounded border font-mono text-sm">
                    <div className="text-gray-800">
                      cd frontend<br/>
                      npm install<br/>
                      npm run dev
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="components">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Component Architecture</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { folder: 'ui/', desc: 'Base UI components (buttons, forms, cards)' },
                  { folder: 'layout/', desc: 'Layout components (headers, navigation)' },
                  { folder: 'forms/', desc: 'Form components with validation' },
                  { folder: 'reports/', desc: 'Report-specific components' }
                ].map((component, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 font-mono">{component.folder}</h4>
                    <p className="text-sm text-gray-600">{component.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="routing">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Routing & Navigation</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">
                  Uses Next.js App Router with file-based routing and mobile-first navigation patterns.
                </p>
                <div className="space-y-2">
                  {[
                    { path: '/drivers', desc: 'Driver management pages' },
                    { path: '/trucks', desc: 'Vehicle management pages' },
                    { path: '/loads', desc: 'Load management pages' },
                    { path: '/reports', desc: 'Reporting and analytics' }
                  ].map((route, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded border">
                      <code className="font-mono text-sm">{route.path}</code>
                      <span className="text-gray-600 text-sm">{route.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="styling">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Styling & Themes</h3>
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">Tailwind CSS v4</h4>
                <p className="text-purple-800 mb-4">
                  Custom theme system with CSS variables for consistent branding and mobile-optimized components.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Primary', class: 'bg-blue-600', hex: '#002333' },
                    { name: 'Secondary', class: 'bg-teal-500', hex: '#159A9C' },
                    { name: 'Accent', class: 'bg-cyan-600', hex: '#0891b2' },
                    { name: 'Background', class: 'bg-white border', hex: '#ffffff' }
                  ].map((color, index) => (
                    <div key={index} className="text-center">
                      <div className={`h-12 w-full ${color.class} rounded mb-2`}></div>
                      <div className="text-xs text-gray-600">
                        <div className="font-medium">{color.name}</div>
                        <div className="font-mono">{color.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-8">
            <section id="rest-api">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">API Reference</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  Complete REST API documentation with endpoints, authentication, and usage examples.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-${link.color}-50`}>
                            <Icon className={`h-5 w-5 text-${link.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                              {link.title}
                              <ExternalLink className="inline h-4 w-4 ml-1" />
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>

            <section id="endpoints">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Endpoints</h3>
              <div className="space-y-6">
                {[
                  {
                    title: 'Authentication',
                    endpoints: [
                      { method: 'POST', path: '/api/v1/auth/login/', desc: 'User login' },
                      { method: 'POST', path: '/api/v1/auth/refresh/', desc: 'Refresh token' },
                      { method: 'POST', path: '/api/v1/auth/logout/', desc: 'User logout' }
                    ]
                  },
                  {
                    title: 'Drivers',
                    endpoints: [
                      { method: 'GET', path: '/api/v1/drivers/', desc: 'List drivers' },
                      { method: 'POST', path: '/api/v1/drivers/', desc: 'Create driver' },
                      { method: 'GET', path: '/api/v1/drivers/{id}/', desc: 'Get driver details' },
                      { method: 'PUT', path: '/api/v1/drivers/{id}/', desc: 'Update driver' }
                    ]
                  },
                  {
                    title: 'Vehicles',
                    endpoints: [
                      { method: 'GET', path: '/api/v1/trucks/', desc: 'List trucks' },
                      { method: 'GET', path: '/api/v1/trailers/', desc: 'List trailers' },
                      { method: 'POST', path: '/api/v1/trucks/', desc: 'Create truck' },
                      { method: 'GET', path: '/api/v1/trucks/{id}/', desc: 'Get truck details' }
                    ]
                  }
                ].map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">{group.title}</h4>
                    <div className="space-y-2">
                      {group.endpoints.map((endpoint, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded border">
                          <span className={`px-2 py-1 text-xs font-mono rounded ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="font-mono text-sm flex-1">{endpoint.path}</code>
                          <span className="text-gray-600 text-sm">{endpoint.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="schemas">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Schemas</h3>
              <div className="bg-gray-50 p-6 rounded-lg border">
                <p className="text-gray-700 mb-4">
                  For complete data schemas and models, visit the{' '}
                  <a href="http://localhost:8000/api/schema/swagger-ui/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Swagger UI documentation
                  </a>
                  {' '}where you can explore all models and their fields interactively.
                </p>
              </div>
            </section>
          </div>
        );

      case 'deployment':
        return (
          <div className="space-y-8">
            <section id="production">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Deployment Guide</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  Production deployment instructions for both frontend and backend components of Launch TMS.
                </p>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                  <h3 className="font-semibold text-green-900 mb-3">Production Checklist</h3>
                  <ul className="text-green-800 space-y-1">
                    <li>✅ Environment variables configured</li>
                    <li>✅ Database migrations applied</li>
                    <li>✅ Static files collected</li>
                    <li>✅ SSL certificates installed</li>
                    <li>✅ Monitoring and logging setup</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="docker">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Docker Configuration</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">
                  The project includes Docker configuration for easy development and deployment.
                </p>
                <div className="bg-gray-50 p-4 rounded border font-mono text-sm">
                  <div className="text-gray-800">
                    # Start development database<br/>
                    docker-compose up -d<br/><br/>
                    # Check container status<br/>
                    docker-compose ps
                  </div>
                </div>
              </div>
            </section>

            <section id="ci-cd">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">CI/CD Pipeline</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">GitHub Actions</h4>
                  <ul className="text-blue-800 space-y-1 text-sm">
                    <li>• Automated testing</li>
                    <li>• Code quality checks</li>
                    <li>• Security scanning</li>
                    <li>• Deployment automation</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">Vercel Deployment</h4>
                  <ul className="text-purple-800 space-y-1 text-sm">
                    <li>• Automatic deployments</li>
                    <li>• Preview branches</li>
                    <li>• Performance monitoring</li>
                    <li>• CDN optimization</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="monitoring">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Monitoring</h3>
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3">Key Metrics to Monitor</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="text-yellow-800 space-y-1 text-sm">
                    <li>• Application performance</li>
                    <li>• Error rates and logs</li>
                    <li>• Database performance</li>
                  </ul>
                  <ul className="text-yellow-800 space-y-1 text-sm">
                    <li>• User experience metrics</li>
                    <li>• Security events</li>
                    <li>• Infrastructure health</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block w-80 flex-shrink-0`}>
          {renderSidebar()}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-4xl">
            {/* Desktop Back Button */}
            <div className="hidden lg:block mb-6">
              <Link href="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}