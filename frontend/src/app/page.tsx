'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { useOrganizational } from '@/context/OrganizationalContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
import { 
  Users, 
  Truck, 
  Package, 
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  Container,
  GraduationCap
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { DriverStatus, TruckStatus, TrailerStatus, LoadStatus, OrganizationType } from '@/types';

export default function HomePage() {
  const { drivers, trucks, trailers, loads } = useData();
  const { currentOrganization, getOrganizationsByType, getOrganizationalFilter } = useOrganizational();
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
    return true; // Show all if no filter
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
    return true; // Show all if no filter
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
    return true; // Show all if no filter
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
    return true; // Show all if no filter
  });

  // Get the current terminal name
  const getTerminalName = () => {
    if (currentOrganization?.type === OrganizationType.TERMINAL) {
      return currentOrganization.name;
    }
    
    // If not in terminal context, look for first terminal
    const terminals = getOrganizationsByType(OrganizationType.TERMINAL);
    if (terminals.length > 0) {
      return terminals[0].name;
    }
    
    // Fallback to company name or default
    return currentOrganization?.name || 'Launch Terminal';
  };  // Calculate stats from filtered data (using correct backend enum values)
  const activeDrivers = filteredDrivers.filter(d => d.status === DriverStatus.ACTIVE).length;
  const inactiveDrivers = filteredDrivers.filter(d => d.status === DriverStatus.INACTIVE).length;
  const onLeaveDrivers = filteredDrivers.filter(d => d.status === DriverStatus.ON_LEAVE).length;
  const inTrainingDrivers = filteredDrivers.filter(d => d.status === DriverStatus.IN_TRAINING).length;
  const terminatedDrivers = filteredDrivers.filter(d => d.status === DriverStatus.TERMINATED).length;
  
  const availableTrucks = filteredTrucks.filter(t => t.status === TruckStatus.AVAILABLE).length;
  const assignedTrucks = filteredTrucks.filter(t => t.status === TruckStatus.ASSIGNED).length;
  const maintenanceTrucks = filteredTrucks.filter(t => t.status === TruckStatus.MAINTENANCE).length;
  const oosTrucks = filteredTrucks.filter(t => t.status === TruckStatus.OUT_OF_SERVICE).length;
  
  const activeTrailers = filteredTrailers.length; // Total trailers count
  const activeLoads = filteredLoads.filter(l => 
    l.status === LoadStatus.ASSIGNED || 
    l.status === LoadStatus.PICKED_UP || 
    l.status === LoadStatus.IN_TRANSIT
  ).length;
  const inTransitLoads = filteredLoads.filter(l => l.status === LoadStatus.IN_TRANSIT).length;

  // Safe date conversion utility
  const safeDate = (dateInput: any): Date => {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in dashboard:', dateInput);
        return new Date();
      }
      return date;
    }
    console.warn('Unexpected date type in dashboard:', typeof dateInput, dateInput);
    return new Date();
  };
  // Training metrics (using filtered data)
  const trainingDrivers = filteredDrivers.filter(d => d.status === DriverStatus.IN_TRAINING);
  const completedTrainingThisMonth = filteredDrivers.filter(d => {
    if (d.trainingCompletionDate) {
      const completionDate = safeDate(d.trainingCompletionDate);
      const currentDate = new Date();
      return completionDate.getMonth() === currentDate.getMonth() && 
             completionDate.getFullYear() === currentDate.getFullYear();
    }
    return false;  }).length;
  // Generate chart data based on selected date range
  const generateChartData = () => {
    const data = [];
    const currentDate = new Date();
    
    let startDate, daysToGenerate;
    
    switch (selectedDateRange) {
      case 'today':
        // 3 days with today in the middle
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 1);
        daysToGenerate = 3;
        break;
      case 'tomorrow':
        // 3 days with tomorrow in the middle
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate());
        daysToGenerate = 3;
        break;
      case 'week':
        // Current week (Sunday to Saturday)
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay());
        daysToGenerate = 7;
        break;
      case 'month':
        // Current month
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        daysToGenerate = lastDay.getDate();
        break;
      default:
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 1);
        daysToGenerate = 3;
    }
    
    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Count loads for this specific day
      const loadsForDay = loads.filter(load => {
        try {
          const deliveryDate = safeDate(load.deliveryDate);
          return deliveryDate.toDateString() === date.toDateString();
        } catch (error) {
          console.error('Error filtering loads by date:', error, load);
          return false;
        }
      }).length;

      // Count open loads (pending status) for this day
      const openLoadsForDay = loads.filter(load => {
        try {
          const deliveryDate = safeDate(load.deliveryDate);
          return deliveryDate.toDateString() === date.toDateString() && 
                 load.status === LoadStatus.PENDING;
        } catch (error) {
          console.error('Error filtering open loads by date:', error, load);
          return false;
        }
      }).length;
      
      // Generate realistic data with some variation based on current metrics
      const variation = Math.floor(Math.random() * 4) - 2; // -2 to +2 variation for other metrics
      
      // Check if this day is a weekend (Saturday = 6, Sunday = 0)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      data.push({
        date: date.toISOString().split('T')[0],
        loads: loadsForDay, // Use actual loads for the day
        openLoads: openLoadsForDay, // Add open loads data
        drivers: Math.max(0, activeDrivers + inactiveDrivers + Math.floor(Math.random() * 4) - 2),
        trucks: Math.max(0, availableTrucks + Math.floor(Math.random() * 4) - 2),
        trailers: Math.max(0, activeTrailers + Math.floor(Math.random() * 4) - 2),
        isWeekend: isWeekend,
      });
    }
    
    return data;
  };const chartData = generateChartData();
  
  // Debug: Log chart data to see weekend detection
  console.log('Chart data with weekend detection:', chartData.map(d => ({
    date: d.date,
    dayOfWeek: new Date(d.date).getDay(),
    isWeekend: d.isWeekend
  })));const chartConfig = {
    loads: {
      label: "Loads",
      color: "#9333ea", // purple-600 - matches Loads card
    },
    openLoads: {
      label: "Open Loads",
      color: "#dc2626", // red-600 - for open/pending loads
    },
    drivers: {
      label: "Drivers",
      color: "#2563eb", // blue-600 - matches Drivers card
    },
    trucks: {
      label: "Trucks",
      color: "#16a34a", // green-600 - matches Trucks card
    },
    trailers: {
      label: "Trailers",
      color: "#ea580c", // orange-600 - matches Trailers card
    },
  };// Get expiring items (within 90 days)
  const getExpiringItems = () => {
    const today = new Date();
    const ninetyDaysFromNow = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
    
    const expiringItems: Array<{
      id: string;
      type: 'license' | 'registration' | 'insurance';
      name: string;
      description: string;
      expiryDate: Date;
      daysUntilExpiry: number;
    }> = [];

    // Check driver license expirations
    drivers.forEach(driver => {
      const expiryDate = safeDate(driver.licenseExpiry);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 90 && daysUntilExpiry >= 0) {
        expiringItems.push({
          id: driver.id,
          type: 'license',
          name: `${driver.firstName} ${driver.lastName}`,
          description: 'Driver License',
          expiryDate,
          daysUntilExpiry
        });
      }
    });

    // Check truck registrations and insurance
    trucks.forEach(truck => {
      const regExpiryDate = safeDate(truck.registrationExpiry);
      const insExpiryDate = safeDate(truck.insuranceExpiry);
      
      const regDaysUntilExpiry = Math.ceil((regExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const insDaysUntilExpiry = Math.ceil((insExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (regDaysUntilExpiry <= 90 && regDaysUntilExpiry >= 0) {
        expiringItems.push({
          id: `${truck.id}-reg`,
          type: 'registration',
          name: `${truck.make} ${truck.model}`,
          description: `Registration - ${truck.licensePlate}`,
          expiryDate: regExpiryDate,
          daysUntilExpiry: regDaysUntilExpiry
        });
      }
      
      if (insDaysUntilExpiry <= 90 && insDaysUntilExpiry >= 0) {
        expiringItems.push({
          id: `${truck.id}-ins`,
          type: 'insurance',
          name: `${truck.make} ${truck.model}`,
          description: `Insurance - ${truck.licensePlate}`,
          expiryDate: insExpiryDate,
          daysUntilExpiry: insDaysUntilExpiry
        });
      }
    });

    // Sort by days until expiry (most urgent first)
    return expiringItems.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry).slice(0, 5);
  };

  const expiringItems = getExpiringItems();

  const recentDrivers = drivers
    .filter(d => d.status === DriverStatus.ACTIVE)
    .slice(0, 5);
  // Get load events for the Load Events section - using stable sort to prevent hydration mismatch
  const allLoadEvents = loads.flatMap(load => 
    load.events?.map(event => ({ ...event, loadNumber: load.loadNumber, loadId: load.id })) || []
  );
  const recentEvents = allLoadEvents
    .sort((a, b) => {
      // Sort by resolved status first (unresolved events first)
      if (a.resolved !== b.resolved) {
        return a.resolved ? 1 : -1;
      }
      // Then by load ID for stable sorting (prevents hydration mismatch)
      return b.loadId.localeCompare(a.loadId);
    })
    .slice(0, 5);  return (
    <div className="min-h-screen">
      {/* Page Header with Terminal Selector */}
      <PageHeader
        title="Dashboard"
        subtitle="Operations overview and key metrics"
        icon={<Activity className="h-8 w-8 text-blue-600" />}
        actions={
          <button 
            onClick={() => window.location.href = '/reports'}
            className="bg-theme-primary hover:bg-theme-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Submit Status
          </button>
        }
      />
      
      {/* Main Content */}
      <div className="p-4 md:p-6 pt-0">{/* Operations Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{getTerminalName().replace(' Terminal', '')}&apos;s Outlook</h2>
              <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { value: 'today', label: 'Today' },
                { value: 'tomorrow', label: 'Tomorrow' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedDateRange(tab.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedDateRange === tab.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>        <CardContent className="px-0 pt-4">
          <div className="w-full">
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-full [&_.recharts-text]:fill-gray-900 [&_.recharts-cartesian-axis-tick_text]:fill-gray-900 [&_.recharts-legend-item-text]:fill-gray-900"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />                  {/* Weekend Background Areas */}
                  {chartData.map((data, index) => 
                    data.isWeekend ? (
                      <ReferenceLine
                        key={`weekend-${index}`}
                        x={data.date}
                        stroke="#e2e8f0"
                        strokeWidth={20}
                        strokeOpacity={0.3}
                      />
                    ) : null
                  ).filter(Boolean)}
                  
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      if (selectedDateRange === 'month') {
                        // For month view, show fewer labels
                        const day = date.getDate();
                        return day % 5 === 1 || day === 1 ? date.toLocaleDateString('en-US', { 
                          month: '2-digit', 
                          day: '2-digit' 
                        }) : '';
                      }
                      return date.toLocaleDateString('en-US', { 
                        month: '2-digit', 
                        day: '2-digit' 
                      });
                    }}
                    fontSize={12}
                    stroke="#374151"
                    tick={{ fill: '#111827' }}
                    interval={selectedDateRange === 'month' ? 'preserveStartEnd' : 0}
                  />
                  <YAxis 
                    fontSize={12} 
                    stroke="#374151"
                    tick={{ fill: '#111827' }}
                    domain={[0, 'dataMax + 2']}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          });
                        }}
                      />
                    }
                  />                  <Line
                    type="monotone"
                    dataKey="loads"
                    stroke={chartConfig.loads.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.loads.label}
                  />
                  <Line
                    type="monotone"
                    dataKey="openLoads"
                    stroke={chartConfig.openLoads.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name={chartConfig.openLoads.label}
                  />
                  <Line
                    type="monotone"
                    dataKey="drivers"
                    stroke={chartConfig.drivers.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.drivers.label}
                  />
                  <Line
                    type="monotone"
                    dataKey="trucks"
                    stroke={chartConfig.trucks.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.trucks.label}
                  />
                  <Line
                    type="monotone"
                    dataKey="trailers"
                    stroke={chartConfig.trailers.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.trailers.label}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>      {/* Fleet Status Cards */}
      <div className="mb-6">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">          {/* Loads Overview */}
          <Card className="!bg-purple-50 border-purple-100" padding="sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-600" />
                  Loads
                </h3>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-700">{activeLoads}</p>
                  <p className="text-xs text-purple-600">Active</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">In Transit</span>
                  <Badge variant="status" status="in-transit">{inTransitLoads}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Delivered</span>
                  <Badge variant="status" status="delivered">
                    {loads.filter(l => l.status === LoadStatus.DELIVERED).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Pending</span>
                  <Badge variant="status" status="pending">
                    {loads.filter(l => l.status === LoadStatus.PENDING).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Driver Status */}
          <Card className="!bg-theme-accent border-theme-accent" padding="sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Drivers
                </h3>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-700">{activeDrivers}</p>
                  <p className="text-xs text-blue-600">Active</p>
                </div>
              </div>
            </CardHeader>            <CardContent>              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">In Training</span>
                  <Badge variant="status" status="pending" className="bg-theme-accent text-theme-primary">
                    {inTrainingDrivers}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Inactive</span>
                  <Badge variant="status" status="pending">
                    {inactiveDrivers}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">On Leave</span>
                  <Badge variant="default">
                    {onLeaveDrivers}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Terminated</span>
                  <Badge variant="status" status="oos">
                    {terminatedDrivers}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Truck Status */}
          <Card className="!bg-green-50 border-green-100" padding="sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  Trucks
                </h3>                <div className="text-right">
                  <p className="text-xl font-bold text-green-700">{availableTrucks}</p>
                  <p className="text-xs text-green-600">Available</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Assigned</span>
                  <Badge variant="status" status="in-use">
                    {assignedTrucks}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Maintenance</span>
                  <Badge variant="status" status="maintenance">
                    {maintenanceTrucks}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Out of Service</span>
                  <Badge variant="status" status="oos">
                    {oosTrucks}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Trailer Status */}
          <Card className="!bg-orange-50 border-orange-100" padding="sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Container className="h-4 w-4 text-orange-600" />
                  Trailers
                </h3>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-700">{activeTrailers}</p>
                  <p className="text-xs text-orange-600">Total</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">In Transit</span>
                  <Badge variant="status" status="in-transit">
                    {trailers.filter(t => t.status === TrailerStatus.IN_TRANSIT).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">At Terminal</span>
                  <Badge variant="default">
                    {trailers.filter(t => t.status === TrailerStatus.AT_TERMINAL).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Dedicated</span>
                  <Badge variant="status" status="assigned">
                    {trailers.filter(t => t.status === TrailerStatus.DEDICATED).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Out of Service</span>
                  <Badge variant="status" status="oos">
                    {trailers.filter(t => t.status === TrailerStatus.OUT_OF_SERVICE).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div></div>

      {/* New Dashboard Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Load Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Load Events
              </h3>
              <Badge variant="default" className="text-xs">
                {recentEvents.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded border-l-2 border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{event.type.toUpperCase()}</p>
                      <p className="text-xs text-gray-600">{event.loadNumber}</p>
                    </div>
                    <Badge 
                      variant="status" 
                      status={event.resolved ? 'delivered' : 'pending'}
                      className="text-xs"
                    >
                      {event.resolved ? 'Resolved' : 'Open'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No recent events</p>
              </div>
            )}
          </CardContent>        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Upcoming Tasks
            </h3>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            <div className="p-3 hover:bg-gray-50 rounded border-l-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">Daily Inspection</p>
                  <p className="text-xs text-gray-600">Due Today</p>
                </div>
                <Badge variant="status" status="pending" className="text-xs">Daily</Badge>
              </div>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded border-l-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">Weekly Report</p>
                  <p className="text-xs text-gray-600">Due in 2 days</p>
                </div>
                <Badge variant="status" status="in-transit" className="text-xs">Weekly</Badge>
              </div>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded border-l-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">Monthly Review</p>
                  <p className="text-xs text-gray-600">Due in 1 week</p>
                </div>
                <Badge variant="status" status="delivered" className="text-xs">Monthly</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Expirations
              </h2>
              <Badge variant="default" className="text-xs">
                {expiringItems.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            {expiringItems.length > 0 ? (
              expiringItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border-l-2 border-orange-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="status" 
                      status={item.daysUntilExpiry <= 7 ? 'pending' : item.daysUntilExpiry <= 14 ? 'assigned' : 'available'}
                      className="text-xs"
                    >
                      {item.daysUntilExpiry === 0 ? 'Today' : 
                       item.daysUntilExpiry === 1 ? '1 day' : 
                       `${item.daysUntilExpiry} days`}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No upcoming expirations</p>
              </div>
            )}
          </CardContent>
        </Card>        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Training Progress
              </h2>
              <Badge variant="default" className="text-xs">
                {trainingDrivers.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            {trainingDrivers.length > 0 ? (
              trainingDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border-l-2 border-blue-200">
                  <div>
                    <p className="font-medium text-gray-900">{driver.firstName} {driver.lastName}</p>
                    <p className="text-sm text-gray-600">
                      {driver.trainingStartDate ? 
                        `Started: ${safeDate(driver.trainingStartDate).toLocaleDateString()}` : 
                        'Start date not set'
                      }
                    </p>
                  </div>
                  <div className="text-right">                    <Badge 
                      variant="status" 
                      status={driver.trainingStatus === 'in_progress' ? 'assigned' : 
                             driver.trainingStatus === 'suspended' ? 'pending' : 'available'}
                      className="text-xs"
                    >
                      {driver.trainingStatus ? 
                        (driver.trainingStatus.charAt(0).toUpperCase() + 
                         driver.trainingStatus.slice(1).replace('_', ' ')) : 
                        'Not Started'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm">No drivers in training</p>
                {completedTrainingThisMonth > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    {completedTrainingThisMonth} completed this month
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
