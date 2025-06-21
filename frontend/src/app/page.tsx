/**
 * Dashboard - Professional TMS command center
 * Redesigned with compact layout and enterprise-grade UX
 */

'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { useOrganizational } from '@/context/OrganizationalContext';
import { useTerminal } from '@/context/TerminalContext';
import ProfessionalPage from '@/components/layout/ProfessionalPage';
import { 
  UserGroupIcon,
  TruckIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PlusIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { DriverStatus, TruckStatus, TrailerStatus, LoadStatus } from '@/types';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
  badge?: string;
}

function QuickActionCard({ title, description, icon: Icon, color, onClick, badge }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 text-left rounded-lg border border-neutral-200 bg-white",
        "hover:shadow-md hover:border-neutral-300 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-600 mt-0.5">{description}</p>
          </div>
        </div>
        {badge && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-700">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  type: 'load' | 'driver' | 'truck' | 'alert';
  status?: 'success' | 'warning' | 'error' | 'info';
}

function ActivityItem({ title, description, time, type, status = 'info' }: ActivityItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'load': return DocumentTextIcon;
      case 'driver': return UserGroupIcon;
      case 'truck': return TruckIcon;
      case 'alert': return ExclamationTriangleIcon;
      default: return DocumentTextIcon;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-success-600 bg-success-50';
      case 'warning': return 'text-warning-600 bg-warning-50';
      case 'error': return 'text-error-600 bg-error-50';
      default: return 'text-primary-600 bg-primary-50';
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
      <div className={cn("p-1.5 rounded-lg flex-shrink-0", getStatusColor())}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{title}</p>
        <p className="text-xs text-neutral-600 mt-0.5">{description}</p>
        <p className="text-xs text-neutral-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { drivers, trucks, trailers, loads } = useData();
  const { currentOrganization } = useOrganizational();
  const { selectedTerminal, getTerminalDisplayName } = useTerminal();  // Filter data based on selected terminal (if terminal is selected)
  const filteredDrivers = selectedTerminal ? 
    drivers.filter(d => d.homeTerminalId === selectedTerminal.id || d.organizationalContext?.terminalId === selectedTerminal.id) : 
    drivers;
  const filteredTrucks = selectedTerminal ? 
    trucks.filter(t => t.homeTerminalId === selectedTerminal.id || t.assignedTerminalId === selectedTerminal.id || t.organizationalContext?.terminalId === selectedTerminal.id) : 
    trucks;
  const filteredTrailers = selectedTerminal ? 
    trailers.filter(t => t.organizationalContext?.terminalId === selectedTerminal.id) : 
    trailers;
  const filteredLoads = selectedTerminal ? 
    loads.filter(l => l.originTerminalId === selectedTerminal.id || l.destinationTerminalId === selectedTerminal.id || l.organizationalContext?.terminalId === selectedTerminal.id) : 
    loads;

  // Calculate metrics based on filtered data
  const metrics = {
    activeDrivers: filteredDrivers.filter(d => d.status === DriverStatus.ACTIVE).length,
    availableDrivers: filteredDrivers.filter(d => d.status === DriverStatus.ACTIVE).length, // Active means available for work
    activeTrucks: filteredTrucks.filter(t => t.status === TruckStatus.ASSIGNED).length,
    availableTrucks: filteredTrucks.filter(t => t.status === TruckStatus.AVAILABLE).length,
    availableTrailers: filteredTrailers.filter(t => t.status === TrailerStatus.AT_TERMINAL).length,
    activeLoads: filteredLoads.filter(l => [LoadStatus.IN_TRANSIT, LoadStatus.PICKED_UP].includes(l.status)).length,
    pendingLoads: filteredLoads.filter(l => [LoadStatus.PENDING, LoadStatus.ASSIGNED].includes(l.status)).length,
    completedLoads: filteredLoads.filter(l => l.status === LoadStatus.DELIVERED).length,
    totalRevenue: filteredLoads.reduce((sum, load) => {
      const rate = typeof load.rate === 'number' ? load.rate : parseFloat(load.rate || '0');
      return sum + (isNaN(rate) ? 0 : rate);
    }, 0)
  };

  // KPI data for the page header
  const kpis = [
    {
      id: 'active-loads',
      label: 'Active Loads',
      value: metrics.activeLoads,
      icon: DocumentTextIcon,
      change: { value: 12, type: 'increase' as const, period: 'vs yesterday' },
      color: 'bg-primary-100 text-primary-600'
    },
    {
      id: 'available-trucks',
      label: 'Available Fleet',
      value: metrics.availableTrucks,
      icon: TruckIcon,
      change: { value: 5, type: 'decrease' as const, period: 'vs yesterday' },
      color: 'bg-success-100 text-success-600'
    },
    {
      id: 'active-drivers',
      label: 'Active Drivers',
      value: metrics.activeDrivers,
      icon: UserGroupIcon,
      change: { value: 8, type: 'increase' as const, period: 'vs yesterday' },
      color: 'bg-warning-100 text-warning-600'
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: `$${(metrics.totalRevenue / 1000).toFixed(0)}K`,
      icon: ChartBarIcon,
      change: { value: 15, type: 'increase' as const, period: 'this week' },
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Page actions
  const actions = [
    {
      id: 'add-load',
      label: 'Add Load',
      icon: PlusIcon,
      onClick: () => console.log('Add load'),
      variant: 'primary' as const
    },
    {
      id: 'view-alerts',
      label: 'View Alerts',
      icon: BellIcon,
      onClick: () => console.log('View alerts'),
      variant: 'outline' as const
    }
  ];

  const quickActions = [
    {
      title: 'Assign Load',
      description: 'Quick load assignment to available drivers',
      icon: DocumentTextIcon,
      color: 'bg-primary-100 text-primary-600',
      onClick: () => console.log('Assign load')
    },
    {
      title: 'Driver Check-in',
      description: 'Review driver status and availability',
      icon: UserGroupIcon,
      color: 'bg-success-100 text-success-600',
      onClick: () => console.log('Driver check-in')
    },
    {
      title: 'Fleet Status',
      description: 'Monitor vehicle maintenance and location',
      icon: TruckIcon,
      color: 'bg-warning-100 text-warning-600',
      onClick: () => console.log('Fleet status')
    },
    {
      title: 'Critical Alerts',
      description: 'Address urgent operational issues',
      icon: ExclamationTriangleIcon,
      color: 'bg-error-100 text-error-600',
      onClick: () => console.log('Critical alerts'),
      badge: '3'
    }
  ];

  const recentActivity = [
    {
      title: 'Load #L-2025-0156 Picked Up',
      description: 'Driver John Smith picked up cargo in Phoenix, AZ',
      time: '2 minutes ago',
      type: 'load' as const,
      status: 'success' as const
    },
    {
      title: 'Truck T-401 Maintenance Due',
      description: 'Scheduled maintenance required within 3 days',
      time: '15 minutes ago',
      type: 'truck' as const,
      status: 'warning' as const
    },
    {
      title: 'Driver Sarah Johnson Available',
      description: 'Completed delivery and marked available for new assignment',
      time: '1 hour ago',
      type: 'driver' as const,
      status: 'success' as const
    },
    {
      title: 'Load #L-2025-0155 Delayed',
      description: 'Traffic delay reported, ETA updated to 3:30 PM',
      time: '2 hours ago',
      type: 'alert' as const,
      status: 'warning' as const
    },
    {
      title: 'New Load #L-2025-0157 Created',
      description: 'Route: Los Angeles, CA → Denver, CO',
      time: '3 hours ago',
      type: 'load' as const,
      status: 'info' as const
    }
  ];  return (
    <ProfessionalPage
      title={selectedTerminal ? getTerminalDisplayName(selectedTerminal) : "Terminal Operations"}
      subtitle={selectedTerminal ? 
        `${selectedTerminal?.address?.city || 'Unknown'}, ${selectedTerminal?.address?.state || 'Unknown'} • ${selectedTerminal?.department?.division?.name || 'Unknown Division'}` :
        `Command center for ${currentOrganization?.name || 'Launch Transport'}`
      }
      actions={actions}
      kpis={kpis}
      showKPIs={true}
    >
      <div className="space-y-6">
        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet Status Overview */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-primary-600" />
              Fleet Status
            </h2>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
              {/* Status Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TruckIcon className="h-4 w-4 text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-600 uppercase">Trucks</span>
                  </div>                  <div className="text-xl font-bold text-neutral-900">{metrics.activeTrucks}</div>
                  <div className="text-xs text-neutral-500">of {filteredTrucks.length} active</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ArchiveBoxIcon className="h-4 w-4 text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-600 uppercase">Trailers</span>
                  </div>
                  <div className="text-xl font-bold text-neutral-900">{metrics.availableTrailers}</div>
                  <div className="text-xs text-neutral-500">available</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserGroupIcon className="h-4 w-4 text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-600 uppercase">Drivers</span>
                  </div>
                  <div className="text-xl font-bold text-neutral-900">{metrics.activeDrivers}</div>
                  <div className="text-xs text-neutral-500">on duty</div>
                </div>
              </div>

              {/* Load Status Bar */}
              <div className="bg-white p-4 rounded-lg border border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Load Pipeline</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-warning-600">{metrics.pendingLoads}</div>
                    <div className="text-xs text-neutral-600">Pending</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary-600">{metrics.activeLoads}</div>
                    <div className="text-xs text-neutral-600">In Transit</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-success-600">{metrics.completedLoads}</div>
                    <div className="text-xs text-neutral-600">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-primary-600" />
              Recent Activity
            </h2>
            <div className="bg-white border border-neutral-200 rounded-lg">
              <div className="divide-y divide-neutral-100">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
              <div className="p-3 border-t border-neutral-200">
                <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalPage>
  );
}
