'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  BarChart, 
  FileText, 
  Download, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Truck, 
  Package, 
  MapPin, 
  Building,
  Globe,
  Navigation
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useOrganizational } from '@/context/OrganizationalContext';
import { Load, DriverStatus, TruckStatus, OrganizationType } from '@/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart, Bar, ResponsiveContainer } from 'recharts';
import PageHeader from '@/components/layout/PageHeader';
import OrganizationalSelectorGroup from '@/components/ui/OrganizationalSelectorGroup';
import { cn } from '@/lib/utils';

type ReportLevel = 'terminal' | 'region' | 'department';

export default function ReportsPage() {
  const { drivers, trucks, loads } = useData();
  const { currentOrganization, getOrganizationsByType, getOrganizationalFilter } = useOrganizational();
  const [activeTab, setActiveTab] = useState<ReportLevel>('terminal');
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  // Get organizational data
  const terminals = getOrganizationsByType(OrganizationType.TERMINAL);
  const regions = getOrganizationsByType(OrganizationType.REGION);
  const departments = getOrganizationsByType(OrganizationType.DEPARTMENT);
  const organizationalFilter = getOrganizationalFilter();

  // Safe date conversion utility
  const safeDate = (dateInput: any): Date => {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  // Calculate key metrics
  const calculateMetrics = () => {
    const filteredData = getFilteredData();
    const filteredLoads = filteredData.loads;
    const filteredDrivers = filteredData.drivers;
    const filteredTrucks = filteredData.trucks;    const completedLoads = filteredLoads.filter(load => load.status === 'delivered').length;
    const inTransitLoads = filteredLoads.filter(load => ['in_transit', 'picked_up', 'in_progress'].includes(load.status)).length;
    const pendingLoads = filteredLoads.filter(load => ['pending', 'assigned', 'scheduled'].includes(load.status)).length;
    
    const activeDrivers = filteredDrivers.filter(driver => driver.status === DriverStatus.ACTIVE).length;
    const availableTrucks = filteredTrucks.filter(truck => truck.status === TruckStatus.AVAILABLE).length;    const totalRevenue = filteredLoads.reduce((sum, load) => {
      const rate = load.rate;
      if (typeof rate === 'number') {
        return sum + rate;
      }
      if (typeof rate === 'string') {
        const numericRate = parseFloat(rate);
        return sum + (isNaN(numericRate) ? 0 : numericRate);
      }
      return sum;
    }, 0);

    return {
      completedLoads,
      inTransitLoads,
      pendingLoads,
      activeDrivers,
      availableTrucks,
      totalRevenue,
      totalLoads: filteredLoads.length
    };
  };

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Mock data for demonstration - in real app, this would come from the API
      const loadsForDay = Math.floor(Math.random() * 20) + 5;
      const driversForDay = Math.floor(Math.random() * 10) + metrics.activeDrivers - 5;
      const trucksForDay = Math.floor(Math.random() * 8) + metrics.availableTrucks - 4;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        loads: loadsForDay,
        drivers: Math.max(0, driversForDay),
        trucks: Math.max(0, trucksForDay),
      });
    }
    
    return data;
  };

  // Filter data based on selected date range
  const getFilteredData = () => {
    const currentDate = new Date();
    let filteredLoads = loads;
    
    try {
      switch (selectedDateRange) {
        case 'comprehensive':
          // Show comprehensive data range: June 5-19, 2025 (exact range of our data)
          const comprehensiveStart = new Date('2025-06-05');
          const comprehensiveEnd = new Date('2025-06-19');
          filteredLoads = loads.filter(load => {
            const pickupDate = safeDate(load.pickupDate);
            const deliveryDate = safeDate(load.deliveryDate);
            return (pickupDate >= comprehensiveStart && pickupDate <= comprehensiveEnd) || 
                   (deliveryDate >= comprehensiveStart && deliveryDate <= comprehensiveEnd);
          });
          break;
        case 'today':
          // Today: Show loads from the past 14 days to include our historical data
          const todayStart = new Date(currentDate);
          todayStart.setDate(todayStart.getDate() - 14); // Past 14 days
          const todayEnd = new Date(currentDate);
          todayEnd.setDate(todayEnd.getDate() + 1); // +1 day forward
          filteredLoads = loads.filter(load => {
            const pickupDate = safeDate(load.pickupDate);
            const deliveryDate = safeDate(load.deliveryDate);
            return (pickupDate >= todayStart && pickupDate <= todayEnd) || 
                   (deliveryDate >= todayStart && deliveryDate <= todayEnd);
          });
          break;
        case 'tomorrow':
          // Tomorrow: Show loads from the past 14 days to include our historical data
          const tomorrowStart = new Date(currentDate);
          tomorrowStart.setDate(tomorrowStart.getDate() - 14); // Past 14 days
          const tomorrowEnd = new Date(currentDate);
          tomorrowEnd.setDate(tomorrowEnd.getDate() + 1); // +1 day forward
          filteredLoads = loads.filter(load => {
            const pickupDate = safeDate(load.pickupDate);
            const deliveryDate = safeDate(load.deliveryDate);
            return (pickupDate >= tomorrowStart && pickupDate <= tomorrowEnd) || 
                   (deliveryDate >= tomorrowStart && deliveryDate <= tomorrowEnd);
          });
          break;
        case 'this-week':
          // This week: Show loads from the past 14 days to include our historical data
          const weekStart = new Date(currentDate);
          weekStart.setDate(weekStart.getDate() - 14); // Past 14 days
          const weekEnd = new Date(currentDate);
          weekEnd.setDate(weekEnd.getDate() + 7); // +7 days forward
          filteredLoads = loads.filter(load => {
            const pickupDate = safeDate(load.pickupDate);
            const deliveryDate = safeDate(load.deliveryDate);
            return (pickupDate >= weekStart && pickupDate <= weekEnd) || 
                   (deliveryDate >= weekStart && deliveryDate <= weekEnd);
          });
          break;
        default:
          // Default to comprehensive data
          filteredLoads = loads;
      }
    } catch (error) {
      console.error('Error filtering data:', error);
      filteredLoads = loads; // Fallback to all loads
    }
    
    return {
      loads: filteredLoads,
      drivers: drivers || [],
      trucks: trucks || []
    };
  };

  const metrics = calculateMetrics();
  const chartData = generateChartData();

  const tabs = [
    {
      id: 'terminal' as ReportLevel,
      label: 'Terminal Stats',
      icon: Building,
      description: 'View metrics for individual terminals'
    },
    {
      id: 'region' as ReportLevel,
      label: 'Regional Stats',
      icon: Globe,
      description: 'View aggregated metrics by region'
    },
    {
      id: 'department' as ReportLevel,
      label: 'Department Stats',
      icon: Navigation,
      description: 'View metrics by department function'
    }
  ];
  const getCurrentLevelName = () => {
    switch (activeTab) {
      case 'terminal':
        return currentOrganization?.name || 'Terminal';
      case 'region':
        // Use divisionId as a fallback for regionId since regionId doesn't exist in the filter
        const currentRegion = regions.find(r => r.id === organizationalFilter.divisionId);
        return currentRegion?.name || 'Region';
      case 'department':
        const currentDepartment = departments.find(d => d.id === organizationalFilter.departmentId);
        return currentDepartment?.name || 'Department';
      default:
        return 'Organization';
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports & Analytics"
        subtitle={`Performance metrics and insights for ${getCurrentLevelName()}`}
        showTerminalSelector={false}
        actions={
          <OrganizationalSelectorGroup 
            size="sm"
            className="hidden md:flex"
          />
        }
      />

      {/* Mobile Organizational Selector */}
      <div className="md:hidden">
        <Card>
          <CardContent className="p-4">            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--color-accent)] flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Select Location:
              </h3>
              <OrganizationalSelectorGroup size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>      {/* Tab Navigation */}
      <Card>        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Organizational Reports
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
          <div className="text-center py-2">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Date Range Filter */}
      <Card>        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Date Range
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'comprehensive', label: 'Comprehensive View' },
              { value: 'today', label: 'Recent Activity' },
              { value: 'tomorrow', label: 'Tomorrow' },
              { value: 'this-week', label: 'This Week' }
            ].map((range) => (
              <Button
                key={range.value}
                variant={selectedDateRange === range.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedDateRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Completed Loads</p>
                <p className="text-2xl font-bold text-[var(--color-accent)]">{metrics.completedLoads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[var(--theme-neutral)]">In Transit</p>
                <p className="text-2xl font-bold text-[var(--theme-primary)]">{metrics.inTransitLoads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--theme-background)]">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[var(--theme-neutral)]">Pending</p>
                <p className="text-2xl font-bold text-[var(--theme-primary)]">{metrics.pendingLoads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--theme-background)]">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[var(--theme-neutral)]">Total Revenue</p>
                <p className="text-2xl font-bold text-[var(--theme-primary)]">
                  ${metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        <Card className="bg-[var(--theme-background)]">
          <CardHeader>
            <h3 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Activity Trends
            </h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="loads" stroke="#8884d8" />
                <Line type="monotone" dataKey="drivers" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>        <Card className="bg-[var(--theme-background)]">
          <CardHeader>
            <h3 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Resource Utilization
            </h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="trucks" fill="#8884d8" />
                <Bar dataKey="drivers" fill="#82ca9d" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}      <Card className="bg-[var(--theme-background)]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
            <Package className="w-5 h-5" />
            Quick Actions
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              View Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
