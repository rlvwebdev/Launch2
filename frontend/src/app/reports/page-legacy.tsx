'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BadgeLegacy from '@/components/ui/BadgeLegacy';

const Badge = BadgeLegacy;
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

type ReportLevel = 'terminal' | 'region' | 'division';

export default function ReportsPage() {
  const { drivers, trucks, loads } = useData();
  const { currentOrganization, getOrganizationsByType, getOrganizationalFilter, setCurrentOrganization } = useOrganizational();  const [activeTab, setActiveTab] = useState<ReportLevel>('terminal');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [showMobileMetrics, setShowMobileMetrics] = useState(false);

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
  const chartData = generateChartData();  const tabs = [
    {
      id: 'terminal' as ReportLevel,
      label: 'Terminal',
      icon: Building,
      description: 'View metrics for individual terminals'
    },
    {
      id: 'region' as ReportLevel,
      label: 'Region',
      icon: Globe,
      description: 'View aggregated metrics by region'
    },
    {
      id: 'division' as ReportLevel,
      label: 'Division',
      icon: Navigation,
      description: 'View metrics by department function'
    }
  ];  const getCurrentLevelName = () => {
    switch (activeTab) {
      case 'terminal':
        return currentOrganization?.name || 'Terminal';
      case 'region':
        // Use divisionId as a fallback for regionId since regionId doesn't exist in the filter
        const currentRegion = regions.find(r => r.id === organizationalFilter.divisionId);
        return currentRegion?.name || 'Region';
      case 'division':
        const currentDepartment = departments.find(d => d.id === organizationalFilter.departmentId);
        return currentDepartment?.name || 'Division';
      default:
        return 'Organization';
    }
  };

  // Handle tab change and switch organizational context
  const handleTabChange = (newTab: ReportLevel) => {
    setActiveTab(newTab);
    
    // Switch to the appropriate organizational level
    switch (newTab) {
      case 'terminal':
        if (terminals.length > 0) {
          setCurrentOrganization(terminals[0].id);
        }
        break;
      case 'region':
        if (regions.length > 0) {
          setCurrentOrganization(regions[0].id);
        }
        break;
      case 'division':
        if (departments.length > 0) {
          setCurrentOrganization(departments[0].id);
        }
        break;
    }
  };

  return (
    <div className="space-y-6">      <PageHeader 
        title="Reports & Analytics"
        subtitle={`Performance metrics and insights for ${getCurrentLevelName()}`}
        showTerminalSelector={false}
      />      {/* Tab Navigation - replaces organizational dropdowns */}
      <Card>        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Report Level
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
        </CardHeader><CardContent>
          <div className="flex mb-4">
            {/* Unified Button Group for Tab Navigation */}
            <div className="inline-flex rounded-lg border border-[var(--color-neutral)]/30 bg-[var(--color-surface)] p-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
                      activeTab === tab.id
                        ? "bg-[var(--color-accent)] text-white shadow-sm"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
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
        </CardHeader>        <CardContent>
          <div className="flex justify-center">
            {/* Unified Button Group for Date Range */}
            <div className="inline-flex rounded-lg border border-[var(--color-neutral)]/30 bg-[var(--color-surface)] p-1">
              {[
                { value: 'comprehensive', label: 'Comprehensive' },
                { value: 'today', label: 'Recent' },
                { value: 'tomorrow', label: 'Tomorrow' },
                { value: 'this-week', label: 'This Week' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedDateRange(range.value)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
                    selectedDateRange === range.value
                      ? "bg-[var(--color-accent)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>      {/* Overview Container with Collapsible Metrics */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-accent)] flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Performance Overview
            </h2>            {/* Mobile toggle button */}
            <button 
              className="md:hidden p-2 rounded-lg border border-[var(--color-neutral)]/30 hover:bg-[var(--color-surface)]"
              onClick={() => setShowMobileMetrics(!showMobileMetrics)}
              aria-label={showMobileMetrics ? "Hide metrics" : "Show metrics"}
              title={showMobileMetrics ? "Hide metrics" : "Show metrics"}
            >
              <BarChart className="w-4 h-4 text-[var(--color-accent)]" />
            </button>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Key performance indicators for {getCurrentLevelName()}
          </p>
        </CardHeader>
        
        {/* Metrics Grid */}
        <CardContent className={cn(
          "transition-all duration-300 ease-in-out",
          "md:block", // Always visible on desktop
          showMobileMetrics ? "block" : "hidden md:block" // Collapsible on mobile
        )}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Completed Loads */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>                <Badge variant="outline" status="success" className="text-xs">
                  {((metrics.completedLoads / metrics.totalLoads) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  {metrics.completedLoads}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  of {metrics.totalLoads} loads
                </p>
              </div>
            </div>

            {/* In Transit */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>                <Badge variant="outline" status="active" className="text-xs">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  In Transit
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  {metrics.inTransitLoads}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  currently moving
                </p>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>                <Badge variant="outline" status="pending" className="text-xs">
                  Pending
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  {metrics.pendingLoads}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  awaiting dispatch
                </p>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="default" className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  Revenue
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                  ${metrics.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  current period
                </p>
              </div>
            </div>
          </div>

          {/* Additional Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[var(--color-neutral)]/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Active Drivers
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {metrics.activeDrivers}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Truck className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Available Trucks
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {metrics.availableTrucks}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Package className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Total Loads
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {metrics.totalLoads}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BarChart className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Efficiency
                </span>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {metrics.totalLoads > 0 ? ((metrics.completedLoads / metrics.totalLoads) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
