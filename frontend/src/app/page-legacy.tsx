'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useData } from '@/context/DataContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { useOrganizational } from '@/context/OrganizationalContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { 
  UserGroupIcon,
  TruckIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { 
  UserGroupIcon as UserGroupIconSolid,
  TruckIcon as TruckIconSolid,
  ArchiveBoxIcon as ArchiveBoxIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/react/24/solid';
import PageHeader from '@/components/layout/PageHeader';
import { DriverStatus, TruckStatus, TrailerStatus, LoadStatus } from '@/types';
import { cn } from '@/lib/utils';

// Modern stat card component with Tailwind UI design
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: React.ReactNode;
  iconColor: string;
  href?: string;
}

function StatCard({ title, value, change, icon, iconColor, href }: StatCardProps) {
  const CardWrapper = href ? 'button' : 'div';
  
  return (
    <Card className={cn(
      'transition-all duration-200',
      href && 'hover:shadow-md hover:scale-[1.02] cursor-pointer'
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {value}
            </p>
            {change && (
              <div className="mt-2 flex items-center text-sm">
                <span className={cn(
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  change.trend === 'up' && 'bg-green-100 text-green-800',
                  change.trend === 'down' && 'bg-red-100 text-red-800',
                  change.trend === 'neutral' && 'bg-gray-100 text-gray-800'
                )}>
                  {change.value}
                </span>
              </div>
            )}
          </div>
          <div className={cn('flex-shrink-0 p-3 rounded-lg', iconColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick actions component
function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto p-4 flex-col">
            <UserGroupIcon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Add Driver</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col">
            <TruckIcon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Add Vehicle</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col">
            <DocumentTextIcon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Create Load</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col">
            <ChartBarIcon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">View Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Activity feed component
function ActivityFeed() {
  const activities = [
    {
      id: 1,
      user: 'John Smith',
      action: 'completed load delivery',
      target: 'Load #L-2024-001',
      time: '2 minutes ago',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500'
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      action: 'started route',
      target: 'Route #R-2024-045',
      time: '15 minutes ago',
      icon: TruckIcon,
      iconColor: 'text-blue-500'
    },
    {
      id: 3,
      user: 'Mike Davis',
      action: 'reported maintenance issue',
      target: 'Truck #T-001',
      time: '1 hour ago',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-500'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span 
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" 
                      aria-hidden="true" 
                    />
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <activity.icon className={cn('h-5 w-5', activity.iconColor)} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{activity.user}</span>
                          {' '}
                          <span className="text-gray-500">{activity.action}</span>
                          {' '}
                          <span className="font-medium text-gray-900">{activity.target}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full">
            View all activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { drivers, trucks, trailers, loads } = useOrganizationalData();
  const { currentOrganization, getOrganizationalFilter } = useOrganizational();
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  // Get organizational filter for current context
  const organizationalFilter = getOrganizationalFilter();
  
  // Filter data by selected terminal/organization
  const filteredDrivers = drivers.filter(driver => {
    if (!driver.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return driver.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return driver.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return driver.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return driver.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true;
  });

  const filteredTrucks = trucks.filter(truck => {
    if (!truck.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return truck.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return truck.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return truck.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return truck.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true;
  });

  const filteredTrailers = trailers.filter(trailer => {
    if (!trailer.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return trailer.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return trailer.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return trailer.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return trailer.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true;
  });

  const filteredLoads = loads.filter(load => {
    if (!load.organizationalContext) return true;
    
    if (organizationalFilter.terminalId) {
      return load.organizationalContext.terminalId === organizationalFilter.terminalId;
    }
    if (organizationalFilter.departmentId) {
      return load.organizationalContext.departmentId === organizationalFilter.departmentId;
    }
    if (organizationalFilter.divisionId) {
      return load.organizationalContext.divisionId === organizationalFilter.divisionId;
    }
    if (organizationalFilter.companyId) {
      return load.organizationalContext.companyId === organizationalFilter.companyId;
    }
    return true;
  });
  // Calculate statistics
  const stats = {
    drivers: {
      total: filteredDrivers.length,
      active: filteredDrivers.filter(d => d.status === DriverStatus.ACTIVE).length,
      training: filteredDrivers.filter(d => d.trainingStatus === 'in_progress').length,
    },
    trucks: {
      total: filteredTrucks.length,
      available: filteredTrucks.filter(t => t.status === TruckStatus.AVAILABLE).length,
      maintenance: filteredTrucks.filter(t => t.status === TruckStatus.MAINTENANCE).length,
    },
    trailers: {
      total: filteredTrailers.length,
      available: filteredTrailers.filter(t => t.status === TrailerStatus.AT_TERMINAL).length,
      loaded: filteredTrailers.filter(t => t.status === TrailerStatus.IN_TRANSIT).length,
    },
    loads: {
      total: filteredLoads.length,
      active: filteredLoads.filter(l => [LoadStatus.PICKED_UP, LoadStatus.IN_TRANSIT, LoadStatus.DELIVERING].includes(l.status)).length,
      completed: filteredLoads.filter(l => l.status === LoadStatus.DELIVERED).length,
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">      <PageHeader
        title="Dashboard"
        subtitle="Transportation Management System Overview"
        icon={<ChartBarIconSolid className="h-6 w-6" />}
        showTerminalSelector={true}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Active Drivers"
            value={stats.drivers.active}
            change={{ value: `${stats.drivers.total} total`, trend: 'neutral' }}
            icon={<UserGroupIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-blue-500"
            href="/drivers"
          />
          <StatCard
            title="Available Trucks"
            value={stats.trucks.available}
            change={{ value: `${stats.trucks.total} total`, trend: 'neutral' }}
            icon={<TruckIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-green-500"
            href="/trucks"
          />
          <StatCard
            title="Available Trailers"
            value={stats.trailers.available}
            change={{ value: `${stats.trailers.total} total`, trend: 'neutral' }}
            icon={<ArchiveBoxIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-purple-500"
            href="/trailers"
          />
          <StatCard
            title="Active Loads"
            value={stats.loads.active}
            change={{ value: `${stats.loads.total} total`, trend: 'neutral' }}
            icon={<DocumentTextIcon className="h-6 w-6 text-white" />}
            iconColor="bg-orange-500"
            href="/loads"
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Drivers in Training"
            value={stats.drivers.training}
            icon={<UserGroupIcon className="h-6 w-6 text-white" />}
            iconColor="bg-yellow-500"
          />
          <StatCard
            title="Trucks in Maintenance"
            value={stats.trucks.maintenance}
            icon={<ExclamationTriangleIcon className="h-6 w-6 text-white" />}
            iconColor="bg-red-500"
          />
          <StatCard
            title="Loaded Trailers"
            value={stats.trailers.loaded}
            icon={<ArchiveBoxIcon className="h-6 w-6 text-white" />}
            iconColor="bg-indigo-500"
          />
          <StatCard
            title="Completed Loads"
            value={stats.loads.completed}
            icon={<CheckCircleIcon className="h-6 w-6 text-white" />}
            iconColor="bg-emerald-500"
          />
        </div>

        {/* Action Cards and Activity */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
