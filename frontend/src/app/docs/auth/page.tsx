'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Shield,
  Key,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function AuthPage() {
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
            <h1 className="text-3xl font-bold text-white mb-2">Authentication</h1>
            <p className="text-slate-300">JWT authentication and security</p>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-400" />
              Authentication Overview
            </h2>
            <p className="text-slate-300 mb-4">
              Launch TMS uses JWT (JSON Web Tokens) for stateless authentication. This provides secure, 
              scalable access control across the entire platform.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Benefits
                </h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Stateless authentication</li>
                  <li>• Automatic token refresh</li>
                  <li>• Multi-tenant security</li>
                  <li>• Mobile-friendly</li>
                </ul>
              </div>
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-blue-400" />
                  Token Types
                </h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Access Token (15 minutes)</li>
                  <li>• Refresh Token (7 days)</li>
                  <li>• Auto-refresh mechanism</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Login Flow */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Login Flow</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                <div>
                  <h4 className="font-semibold text-white">POST /api/auth/login/</h4>
                  <p className="text-slate-300 text-sm">Send username and password credentials</p>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
                    <code className="text-slate-300 text-sm">
                      {`{
  "username": "user@example.com",
  "password": "your_password"
}`}
                    </code>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                <div>
                  <h4 className="font-semibold text-white">Receive Tokens</h4>
                  <p className="text-slate-300 text-sm">Get access and refresh tokens</p>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
                    <code className="text-slate-300 text-sm">
                      {`{
  "access": "eyJ0eXAiOiJKV1Q...",
  "refresh": "eyJ0eXAiOiJKV1Q...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "company": "ACME Transport"
  }
}`}
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                <div>
                  <h4 className="font-semibold text-white">Use Access Token</h4>
                  <p className="text-slate-300 text-sm">Include in Authorization header for API requests</p>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
                    <code className="text-slate-300 text-sm">
                      Authorization: Bearer eyJ0eXAiOiJKV1Q...
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Token Refresh */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Token Refresh</h2>
            <p className="text-slate-300 mb-4">
              Access tokens expire after 15 minutes. The frontend automatically refreshes them using the refresh token.
            </p>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">POST /api/auth/refresh/</h4>
              <code className="text-slate-300 text-sm">
                {`{
  "refresh": "eyJ0eXAiOiJKV1Q..."
}`}
              </code>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-red-400" />
              Security Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Data Protection</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Multi-tenant data isolation</li>
                  <li>• Role-based access control</li>
                  <li>• Encrypted password storage</li>
                  <li>• HTTPS enforced in production</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Token Security</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Short-lived access tokens</li>
                  <li>• Secure refresh mechanism</li>
                  <li>• Token blacklisting on logout</li>
                  <li>• Automatic token validation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Handling */}
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Common Authentication Errors
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <code className="text-red-400 text-sm">401 Unauthorized</code>
                  <p className="text-slate-300 text-sm">Invalid credentials or expired token</p>
                </div>
              </div>
              <div className="flex items-start">
                <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <code className="text-red-400 text-sm">403 Forbidden</code>
                  <p className="text-slate-300 text-sm">Valid token but insufficient permissions</p>
                </div>
              </div>
              <div className="flex items-start">
                <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <code className="text-red-400 text-sm">422 Validation Error</code>
                  <p className="text-slate-300 text-sm">Missing or invalid login credentials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
