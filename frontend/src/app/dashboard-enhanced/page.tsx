'use client';

import React, { useState, useMemo } from 'react';
import { DashboardTemplate, KPICard } from '@/components/ui';
import type { 
  QuickActionConfig, 
  AlertConfig, 
  ActivityConfig 
} from '@/components/ui/DashboardTemplate';
import { useData } from '@/context/DataContext';
import { useOrganizational } from '@/context/OrganizationalContext';
import useOrganizationalData from '@/hooks/useOrganizationalData';
import { DriverStatus, TruckStatus, LoadStatus } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Truck, 
  Package, 
  DollarSign, 
  UserPlus, 
  TruckIcon, 
  FileText, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function EnhancedDashboard() {
  const { drivers, trucks, loads } = useData();
  const { currentOrganization } = useOrganizational();
  const organizationalData = useOrganizationalData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const activeDrivers = drivers?.filter(d => d.status === DriverStatus.ACTIVE)?.length || 0;
    const availableTrucks = trucks?.filter(t => t.status === TruckStatus.AVAILABLE)?.length || 0;
    const totalLoads = loads?.length || 0;
    const completedLoads = loads?.filter(l => l.status === 'delivered')?.length || 0;
    const inTransitLoads = loads?.filter(l => ['in_transit', 'picked_up', 'in_progress'].includes(l.status))?.length || 0;
      const totalRevenue = loads?.reduce((sum, load) => {
      if (!load.rate) return sum;
      const rate = typeof load.rate === 'number' ? load.rate : parseFloat(String(load.rate) || '0');
      return sum + (isNaN(rate) ? 0 : rate);
    }, 0) || 0;

    const completionRate = totalLoads > 0 ? (completedLoads / totalLoads) * 100 : 0;

    return {
      activeDrivers,
      availableTrucks,
      totalLoads,
      completedLoads,
      inTransitLoads,
      totalRevenue,
      completionRate
    };
  }, [drivers, trucks, loads]);

  // KPI Cards Configuration
  const kpiCards = [
    {
      title: 'Active Drivers',
      value: kpiMetrics.activeDrivers,
      icon: Users,
      iconColor: 'blue' as const,
      change: {
        value: 8,
        period: 'last week',
        direction: 'up' as const
      },
      status: 'success' as const,
      onClick: () => console.log('Navigate to drivers')
    },
    {
      title: 'Available Trucks',
      value: kpiMetrics.availableTrucks,
      icon: Truck,
      iconColor: 'emerald' as const,
      change: {
        value: 3,
        period: 'last week', 
        direction: 'up' as const
      },
      status: 'success' as const,
      onClick: () => console.log('Navigate to trucks')
    },
    {
      title: 'Active Loads',
      value: kpiMetrics.inTransitLoads,
      icon: Package,
      iconColor: 'amber' as const,
      change: {
        value: 12,
        period: 'last week',
        direction: 'up' as const
      },
      status: 'info' as const,
      onClick: () => console.log('Navigate to loads')
    },
    {
      title: 'Revenue',
      value: `$${kpiMetrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconColor: 'purple' as const,
      change: {
        value: 15,
        period: 'last month',
        direction: 'up' as const
      },
      status: 'success' as const,
      variant: 'detailed' as const,
      onClick: () => console.log('Navigate to reports')
    }
  ];

  // Quick Actions Configuration
  const quickActions: QuickActionConfig[] = [
    {
      id: 'add-driver',
      label: 'Add Driver',
      icon: UserPlus,
      onClick: () => console.log('Add driver'),
      variant: 'primary'
    },
    {
      id: 'add-truck',
      label: 'Add Truck',
      icon: TruckIcon,
      onClick: () => console.log('Add truck'),
      variant: 'primary'
    },
    {
      id: 'create-load',
      label: 'Create Load',
      icon: Package,
      onClick: () => console.log('Create load'),
      variant: 'primary'
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: FileText,
      onClick: () => console.log('Generate report'),
      variant: 'secondary'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: Download,
      onClick: () => console.log('Export data'),
      variant: 'outline'
    }
  ];

  // Sample Alerts
  const alerts: AlertConfig[] = [
    {
      id: '1',
      title: 'Driver License Expiring',
      message: 'John Smith\'s CDL expires in 15 days',
      severity: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: 'compliance',
      action: {
        label: 'Review',
        onClick: () => console.log('Review license')
      }
    },
    {
      id: '2',
      title: 'Truck Maintenance Due',
      message: 'Truck #456 is due for scheduled maintenance',
      severity: 'medium',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      type: 'operational'
    },
    {
      id: '3',
      title: 'Load Delayed',
      message: 'Load #789 is running 2 hours behind schedule',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      type: 'operational'
    }
  ];

  // Sample Recent Activity
  const recentActivity: ActivityConfig[] = [
    {
      id: '1',
      title: 'Load Completed',
      description: 'Load #123 delivered successfully to Dallas, TX',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      type: 'load',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Driver Check-in',
      description: 'Mike Johnson checked in at Phoenix terminal',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      type: 'driver',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Truck Assignment',
      description: 'Truck #789 assigned to Sarah Williams',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      type: 'truck',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Load Created',
      description: 'New load from Los Angeles to Seattle created',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: 'load',
      status: 'pending'
    }
  ];

  const handleRefresh = async () => {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Dashboard refreshed');
  };

  return (
    <DashboardTemplate
      title="Launch TMS Dashboard"
      subtitle={`Welcome back! Here's what's happening at ${currentOrganization?.name || 'your terminal'}`}
      kpiCards={kpiCards}
      quickActions={quickActions}
      alerts={alerts}
      recentActivity={recentActivity}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onRefresh={handleRefresh}
      refreshable={true}
      className="p-6"
    >
      {/* Additional Custom Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Performance Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Trends
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart will be integrated here
          </div>
        </div>

        {/* Fleet Status Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fleet Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fleet Utilization</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {kpiMetrics.completionRate.toFixed(0)}%
              </span>
            </div>            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={cn(
                  "bg-blue-600 h-2 rounded-full transition-all duration-300",
                  kpiMetrics.completionRate >= 100 ? "w-full" :
                  kpiMetrics.completionRate >= 90 ? "w-[90%]" :
                  kpiMetrics.completionRate >= 80 ? "w-4/5" :
                  kpiMetrics.completionRate >= 75 ? "w-3/4" :
                  kpiMetrics.completionRate >= 60 ? "w-3/5" :
                  kpiMetrics.completionRate >= 50 ? "w-1/2" :
                  kpiMetrics.completionRate >= 40 ? "w-2/5" :
                  kpiMetrics.completionRate >= 25 ? "w-1/4" :
                  kpiMetrics.completionRate >= 20 ? "w-1/5" :
                  "w-1/12"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
}
