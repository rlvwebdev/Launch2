'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Layers,
  Smartphone,
  Monitor,
  Palette,
  Zap,
  Package
} from 'lucide-react';

export default function FrontendPage() {
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
            <h1 className="text-3xl font-bold text-white mb-2">Frontend Guide</h1>
            <p className="text-slate-300">Next.js application architecture</p>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Technology Stack */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-400" />
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Core Framework</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• <strong>Next.js 15</strong> - App Router with SSR/SSG</li>
                  <li>• <strong>React 19</strong> - Modern React features</li>
                  <li>• <strong>TypeScript</strong> - Type safety throughout</li>
                  <li>• <strong>Tailwind CSS v4</strong> - Utility-first styling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Key Libraries</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• <strong>React Hook Form</strong> - Form management</li>
                  <li>• <strong>Zod</strong> - Schema validation</li>
                  <li>• <strong>Lucide React</strong> - Icon library</li>
                  <li>• <strong>clsx</strong> - Conditional styling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Architecture */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-green-400" />
              Application Architecture
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">File Structure</h4>
                <pre className="text-slate-300 text-sm">
{`src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── drivers/           # Driver management
│   ├── trucks/            # Vehicle management  
│   ├── loads/             # Load management
│   ├── reports/           # Analytics & reports
│   └── settings/          # User settings
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── forms/             # Form components
│   └── navigation/        # Navigation components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions`}
                </pre>
              </div>
            </div>
          </div>

          {/* Mobile-First Design */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-purple-400" />
              Mobile-First Design
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Responsive Breakpoints</h4>
                <div className="space-y-2 text-slate-300 text-sm">
                  <div className="flex justify-between">
                    <span>Mobile</span>
                    <code className="text-blue-400">320px - 767px</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Tablet</span>
                    <code className="text-blue-400">768px - 1023px</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Desktop</span>
                    <code className="text-blue-400">1024px+</code>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Mobile Features</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Touch-optimized interface</li>
                  <li>• Bottom navigation on mobile</li>
                  <li>• Swipe gestures support</li>
                  <li>• PWA capabilities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Theme System */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-yellow-400" />
              Theme System
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Available Themes</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-slate-900 font-medium">Launch Light</span>
                  </div>
                  <div className="flex items-center p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="w-4 h-4 bg-yellow-400 rounded mr-3"></div>
                    <span className="text-white font-medium">Launch Dark</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Theme Features</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• CSS custom properties</li>
                  <li>• Automatic dark mode detection</li>
                  <li>• User preference persistence</li>
                  <li>• Smooth theme transitions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* State Management */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">State Management</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Context Providers</h4>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li>• <code className="text-blue-400">AuthContext</code> - User authentication state</li>
                    <li>• <code className="text-blue-400">ThemeContext</code> - Theme preferences</li>
                    <li>• <code className="text-blue-400">DataContext</code> - Application data</li>
                    <li>• <code className="text-blue-400">OrganizationalContext</code> - Company/terminal data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-green-400" />
              Performance Optimizations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Next.js Features</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Automatic code splitting</li>
                  <li>• Image optimization</li>
                  <li>• Server-side rendering</li>
                  <li>• Static generation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">React Optimizations</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Component memoization</li>
                  <li>• Lazy loading</li>
                  <li>• Virtual scrolling for large lists</li>
                  <li>• Debounced search inputs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Development Setup */}
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-green-400" />
              Development Setup
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Quick Start</h4>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <pre className="text-slate-300 text-sm">
{`# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start`}
                  </pre>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Environment Variables</h4>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <pre className="text-slate-300 text-sm">
{`# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Launch TMS
NEXT_PUBLIC_VERSION=1.0.0`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
