'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  ExternalLink,
  Code,
  Shield,
  Database,
  Truck,
  Package,
  Users
} from 'lucide-react';

const apiEndpoints = [
  {
    section: 'Authentication',
    description: 'JWT-based authentication endpoints',
    color: 'blue',
    endpoints: [
      { method: 'POST', path: '/api/auth/login/', description: 'User login' },
      { method: 'POST', path: '/api/auth/refresh/', description: 'Token refresh' },
      { method: 'POST', path: '/api/auth/register/', description: 'User registration' },
      { method: 'POST', path: '/api/auth/logout/', description: 'User logout' },
      { method: 'GET', path: '/api/auth/verify/', description: 'Token verification' }
    ]
  },
  {
    section: 'Companies & Organizations',
    description: 'Multi-tenant organization management',
    color: 'purple',
    endpoints: [
      { method: 'GET', path: '/api/companies/', description: 'List companies' },
      { method: 'GET', path: '/api/terminals/', description: 'List terminals/divisions' },
      { method: 'GET', path: '/api/companies/{id}/', description: 'Company details' }
    ]
  },
  {
    section: 'Driver Management',
    description: 'Driver profiles, licensing, and assignments',
    color: 'green',
    endpoints: [
      { method: 'GET', path: '/api/drivers/', description: 'List drivers' },
      { method: 'POST', path: '/api/drivers/', description: 'Create driver' },
      { method: 'GET', path: '/api/drivers/{id}/', description: 'Driver details' },
      { method: 'PUT', path: '/api/drivers/{id}/', description: 'Update driver' },
      { method: 'DELETE', path: '/api/drivers/{id}/', description: 'Delete driver' }
    ]
  },
  {
    section: 'Vehicle Management',
    description: 'Truck and trailer fleet management',
    color: 'orange',
    endpoints: [
      { method: 'GET', path: '/api/vehicles/trucks/', description: 'List trucks' },
      { method: 'POST', path: '/api/vehicles/trucks/', description: 'Create truck' },
      { method: 'GET', path: '/api/vehicles/trailers/', description: 'List trailers' },
      { method: 'POST', path: '/api/vehicles/trailers/', description: 'Create trailer' },
      { method: 'GET', path: '/api/vehicles/{id}/', description: 'Vehicle details' }
    ]
  },
  {
    section: 'Load Management',
    description: 'Shipment and load tracking',
    color: 'red',
    endpoints: [
      { method: 'GET', path: '/api/loads/', description: 'List loads' },
      { method: 'POST', path: '/api/loads/', description: 'Create load' },
      { method: 'GET', path: '/api/loads/{id}/', description: 'Load details' },
      { method: 'PUT', path: '/api/loads/{id}/status/', description: 'Update load status' },
      { method: 'GET', path: '/api/loads/{id}/events/', description: 'Load event history' }
    ]
  }
];

const methodColors = {
  GET: 'bg-green-500/20 text-green-400 border-green-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export default function ApiPage() {
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
            <h1 className="text-3xl font-bold text-white mb-2">API Reference</h1>
            <p className="text-slate-300">REST API endpoints documentation</p>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Quick Links */}
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="http://localhost:8000/api/schema/swagger-ui/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-blue-400/30 hover:border-blue-400/50 bg-blue-500/10 rounded-lg p-4 transition-all duration-300 group flex items-center"
              >
                <Code className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-white">Interactive Swagger UI</h3>
                  <p className="text-slate-300 text-sm">Test API endpoints directly</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-slate-400 group-hover:text-blue-400" />
              </a>
              <a 
                href="http://localhost:8000/api/schema/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-400/30 hover:border-green-400/50 bg-green-500/10 rounded-lg p-4 transition-all duration-300 group flex items-center"
              >
                <Database className="w-5 h-5 text-green-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-white">OpenAPI Schema</h3>
                  <p className="text-slate-300 text-sm">Raw JSON schema definition</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-slate-400 group-hover:text-green-400" />
              </a>
            </div>
          </div>

          {/* API Sections */}
          <div className="space-y-8">
            {apiEndpoints.map((section) => {
              const colorClasses = {
                blue: 'border-blue-400/30 bg-blue-500/5',
                purple: 'border-purple-400/30 bg-purple-500/5',
                green: 'border-green-400/30 bg-green-500/5',
                orange: 'border-orange-400/30 bg-orange-500/5',
                red: 'border-red-400/30 bg-red-500/5'
              };

              return (
                <div 
                  key={section.section}
                  className={`border rounded-lg p-6 ${colorClasses[section.color as keyof typeof colorClasses]}`}
                >
                  <h2 className="text-xl font-bold text-white mb-2">{section.section}</h2>
                  <p className="text-slate-300 mb-4">{section.description}</p>
                  
                  <div className="space-y-3">
                    {section.endpoints.map((endpoint, index) => (
                      <div 
                        key={index}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex items-center"
                      >
                        <span className={`px-3 py-1 rounded text-xs font-mono border ${methodColors[endpoint.method as keyof typeof methodColors]} mr-4`}>
                          {endpoint.method}
                        </span>
                        <code className="text-slate-300 font-mono mr-4 flex-1">{endpoint.path}</code>
                        <span className="text-slate-400 text-sm">{endpoint.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Authentication Note */}
          <div className="mt-8 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-yellow-400" />
              Authentication
            </h3>
            <p className="text-slate-300 mb-3">
              Most endpoints require JWT authentication. Include the access token in the Authorization header:
            </p>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <code className="text-slate-300 text-sm">
                Authorization: Bearer &lt;your_access_token&gt;
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
