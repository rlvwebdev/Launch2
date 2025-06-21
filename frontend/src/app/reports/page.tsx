'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon, 
  UsersIcon, 
  TruckIcon, 
  ArchiveBoxIcon, 
  MapPinIcon, 
  BuildingStorefrontIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import {
  ChartBarIcon as ChartBarIconSolid,
  CurrencyDollarIcon as DollarIconSolid,
  CheckCircleIcon as CheckIconSolid,
  TruckIcon as TruckIconSolid,
  UsersIcon as UsersIconSolid
} from '@heroicons/react/24/solid';
import { useData } from '@/context/DataContext';
import { useOrganizational } from '@/context/OrganizationalContext';
import { Load, DriverStatus, TruckStatus, OrganizationType, LoadStatus } from '@/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart, Bar, ResponsiveContainer } from 'recharts';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

type ReportLevel = 'terminal' | 'region' | 'division';
type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

// Modern stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: React.ReactNode;
  iconColor: string;
}

function StatCard({ title, value, subtitle, change, icon, iconColor }: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
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

// Report card component
interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  lastUpdated: string;
  onGenerate: () => void;
  onExport: () => void;
}

function ReportCard({ title, description, icon, lastUpdated, onGenerate, onExport }: ReportCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              {icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            <p className="text-xs text-gray-500 mt-2">Last updated: {lastUpdated}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2">
            <Button size="sm" onClick={onGenerate}>
              <PresentationChartLineIcon className="h-4 w-4 mr-2" />
              Generate
            </Button>
            <Button size="sm" variant="outline" onClick={onExport}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { drivers, trucks, loads } = useData();
  const { currentOrganization, getOrganizationsByType, getOrganizationalFilter } = useOrganizational();
  
  const [activeTab, setActiveTab] = useState<ReportLevel>('terminal');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>('week');
  const [searchTerm, setSearchTerm] = useState('');

  // Get organizational filter for current context
  const organizationalFilter = getOrganizationalFilter();

  // Filter data by selected terminal/organization
  const getFilteredData = () => {
    const filterByOrganization = (items: any[]) => {
      return items.filter(item => {
        if (!item.organizationalContext) return true;
        
        if (organizationalFilter.terminalId) {
          return item.organizationalContext.terminalId === organizationalFilter.terminalId;
        }
        if (organizationalFilter.departmentId) {
          return item.organizationalContext.departmentId === organizationalFilter.departmentId;
        }
        if (organizationalFilter.divisionId) {
          return item.organizationalContext.divisionId === organizationalFilter.divisionId;
        }
        if (organizationalFilter.companyId) {
          return item.organizationalContext.companyId === organizationalFilter.companyId;
        }
        return true;
      });
    };

    return {
      drivers: filterByOrganization(drivers),
      trucks: filterByOrganization(trucks),
      loads: filterByOrganization(loads)
    };
  };

  // Calculate metrics
  const calculateMetrics = () => {
    const filteredData = getFilteredData();
    const { drivers: filteredDrivers, trucks: filteredTrucks, loads: filteredLoads } = filteredData;

    const completedLoads = filteredLoads.filter(load => load.status === LoadStatus.DELIVERED).length;
    const inTransitLoads = filteredLoads.filter(load => load.status === LoadStatus.IN_TRANSIT).length;
    const pendingLoads = filteredLoads.filter(load => load.status === LoadStatus.PENDING).length;
    
    const activeDrivers = filteredDrivers.filter(driver => driver.status === DriverStatus.ACTIVE).length;
    const availableTrucks = filteredTrucks.filter(truck => truck.status === TruckStatus.AVAILABLE).length;

    const totalRevenue = filteredLoads
      .filter(load => load.status === LoadStatus.DELIVERED && load.rate)
      .reduce((sum, load) => {
        const rate = typeof load.rate === 'number' ? load.rate : parseFloat(load.rate) || 0;
        return sum + rate;
      }, 0);

    return {
      completedLoads,
      inTransitLoads,
      pendingLoads,
      activeDrivers,
      availableTrucks,
      totalRevenue,
      totalLoads: filteredLoads.length,
      totalDrivers: filteredDrivers.length,
      totalTrucks: filteredTrucks.length
    };
  };

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        loads: Math.floor(Math.random() * 50) + 20,
        revenue: Math.floor(Math.random() * 10000) + 5000,
      });
    }
    
    return data;
  };

  const metrics = calculateMetrics();
  const chartData = generateChartData();

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const reports = [
    {
      title: 'Driver Performance Report',
      description: 'Detailed analysis of driver performance metrics, on-time deliveries, and safety scores.',
      icon: <UsersIcon className="h-6 w-6 text-blue-600" />,
      lastUpdated: 'Today at 2:30 PM'
    },
    {
      title: 'Fleet Utilization Report',
      description: 'Vehicle usage statistics, maintenance schedules, and efficiency metrics.',
      icon: <TruckIcon className="h-6 w-6 text-blue-600" />,
      lastUpdated: 'Today at 1:15 PM'
    },
    {
      title: 'Financial Summary',
      description: 'Revenue, expenses, profit margins, and financial performance analysis.',
      icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />,
      lastUpdated: 'Today at 12:00 PM'
    },
    {
      title: 'Load Analysis Report',
      description: 'Shipment statistics, delivery performance, and customer satisfaction metrics.',
      icon: <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />,
      lastUpdated: 'Yesterday at 6:00 PM'
    },
    {
      title: 'Compliance Report',
      description: 'DOT compliance status, driver certifications, and regulatory requirements.',
      icon: <DocumentTextIcon className="h-6 w-6 text-blue-600" />,
      lastUpdated: 'Yesterday at 4:30 PM'
    },
    {
      title: 'Operational Efficiency',
      description: 'Key performance indicators, productivity metrics, and operational insights.',
      icon: <ChartBarIcon className="h-6 w-6 text-blue-600" />,
      lastUpdated: 'Yesterday at 3:00 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Business intelligence and performance insights"
        actions={
          <div className="flex items-center space-x-3">            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value as DateRange)}
              className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Select date range"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            subtitle="From completed loads"
            change={{ value: '+12.5%', trend: 'up' }}
            icon={<DollarIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-green-500"
          />
          <StatCard
            title="Loads Delivered"
            value={metrics.completedLoads}
            subtitle="Successfully completed"
            change={{ value: '+8.2%', trend: 'up' }}
            icon={<CheckIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Active Drivers"
            value={metrics.activeDrivers}
            subtitle="Currently working"
            change={{ value: '+2.1%', trend: 'up' }}
            icon={<UsersIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-purple-500"
          />
          <StatCard
            title="Fleet Utilization"
            value={`${metrics.totalTrucks > 0 ? Math.round((metrics.totalTrucks - metrics.availableTrucks) / metrics.totalTrucks * 100) : 0}%`}
            subtitle="Trucks in service"
            change={{ value: '+5.3%', trend: 'up' }}
            icon={<TruckIconSolid className="h-6 w-6 text-white" />}
            iconColor="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Loads Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Load Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="loads" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
            <p className="text-sm text-gray-600">Generate detailed reports for business analysis</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports
              .filter(report => 
                searchTerm === '' || 
                report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((report, index) => (
                <ReportCard
                  key={index}
                  title={report.title}
                  description={report.description}
                  icon={report.icon}
                  lastUpdated={report.lastUpdated}
                  onGenerate={() => console.log('Generate report:', report.title)}
                  onExport={() => console.log('Export report:', report.title)}
                />
              ))}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Operations Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg">
                  <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Loads Management</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{metrics.completedLoads}</span> delivered
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{metrics.inTransitLoads}</span> in transit
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{metrics.pendingLoads}</span> pending
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Driver Performance</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{metrics.activeDrivers}</span> active drivers
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{metrics.totalDrivers}</span> total drivers
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">98.5%</span> on-time rate
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Fleet Status</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{metrics.availableTrucks}</span> available
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{metrics.totalTrucks}</span> total trucks
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">95.2%</span> uptime
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
