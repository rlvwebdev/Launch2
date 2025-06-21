'use client';

import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { 
  Truck, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign
} from 'lucide-react';

export default function ThemeDemoPage() {
  const demoStats = [
    { label: 'Active Drivers', value: '24', icon: Users, trend: '+12%' },
    { label: 'Fleet Vehicles', value: '18', icon: Truck, trend: '+5%' },
    { label: 'Loads This Month', value: '156', icon: Package, trend: '+23%' },
    { label: 'Revenue', value: '$45,280', icon: DollarSign, trend: '+18%' },
  ];

  const demoAlerts = [
    { type: 'warning', title: 'License Expiring', message: 'John Smith - CDL expires in 30 days', icon: AlertTriangle },
    { type: 'success', title: 'Load Delivered', message: 'Load #L-2024-0156 delivered on time', icon: CheckCircle },
    { type: 'info', title: 'Maintenance Due', message: 'Truck T-001 scheduled for service', icon: Clock },
  ];

  return (
    <div className="space-y-6">      <PageHeader
        title="Theme & Style Demo"
        subtitle="Experience the enhanced theme system with stylistic cards and accent variations"
      />

      {/* Theme Selector */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Theme Selection</h2>
        <ThemeSelector />
      </section>

      {/* Stats Cards with Enhanced Styling */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Stats Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-elevated card-hover">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-accent-100 rounded-lg">
                        <Icon className="w-6 h-6 text-accent-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Accent Color Variations */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accent Color Palette</h2>
        <div className="card-base p-6">
          <div className="grid grid-cols-5 lg:grid-cols-11 gap-3">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-16 h-16 rounded-lg shadow-soft mb-2 bg-accent-${shade}`}
                />
                <p className="text-xs font-medium text-gray-700">{shade}</p>
                <p className="text-xs text-gray-500">accent-{shade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Different Card Styles */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Card Style Variations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Base Card */}
          <div className="card-base p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Base Card</h3>
            <p className="text-gray-600">Standard card with subtle shadow and clean borders.</p>
            <button className="btn-accent mt-4">Action Button</button>
          </div>

          {/* Accent Card */}
          <div className="card-accent p-6">
            <h3 className="text-lg font-semibold text-accent-900 mb-2">Accent Card</h3>
            <p className="text-accent-700">Accent-themed card with gradient background and accent glow.</p>
            <button className="btn-accent-outline mt-4">Outline Button</button>
          </div>

          {/* Primary Card */}
          <div className="card-primary p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Primary Card</h3>
            <p className="text-primary-700">Primary-themed card with primary color variations.</p>
            <button className="btn-primary mt-4">Primary Button</button>
          </div>
        </div>
      </section>

      {/* Alert Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Alerts</h2>
        <div className="space-y-4">
          {demoAlerts.map((alert, index) => {
            const Icon = alert.icon;
            const colorClasses = {
              warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
              success: 'bg-green-50 border-green-200 text-green-800',
              info: 'bg-blue-50 border-blue-200 text-blue-800',
            };

            return (
              <div key={index} className={`card-hover p-4 rounded-lg border ${colorClasses[alert.type as keyof typeof colorClasses]}`}>
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm opacity-90">{alert.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Button Variations */}
      <section>
        <h2 className="text-xl font-semibent text-gray-900 mb-4">Button Styles</h2>
        <div className="card-base p-6">
          <div className="flex flex-wrap gap-4">
            <button className="btn-accent">Accent Button</button>
            <button className="btn-accent-outline">Accent Outline</button>
            <button className="btn-primary">Primary Button</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
              Secondary
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg shadow-accent-glow hover:shadow-soft-lg transition-all duration-200">
              Gradient Button
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
