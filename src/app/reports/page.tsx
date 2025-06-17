'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BarChart, FileText, Download, DollarSign, CheckCircle, AlertTriangle, Clock, RefreshCw, Users, UserCheck, Truck, Package, MapPin, FileUser, ParkingCircle, Pause } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Load } from '@/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart, Bar, Area, AreaChart } from 'recharts';

export default function ReportsPage() {  const { drivers, trucks, loads } = useData();
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  
  const today = new Date();
  const isToday = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toDateString() === today.toDateString();
  };  // Filter data based on selected date range
  const getFilteredData = () => {
    const currentDate = new Date();
    let filteredLoads = loads;

    switch (selectedDateRange) {
      case 'today':
        // Today: yesterday + today + 4 days forward (6 days total)
        const todayStart = new Date(currentDate);
        todayStart.setDate(todayStart.getDate() - 1); // Yesterday
        const todayEnd = new Date(currentDate);
        todayEnd.setDate(todayEnd.getDate() + 4); // +4 days forward
        filteredLoads = loads.filter(load => {
          const pickupDate = typeof load.pickupDate === 'string' ? new Date(load.pickupDate) : load.pickupDate;
          const deliveryDate = typeof load.deliveryDate === 'string' ? new Date(load.deliveryDate) : load.deliveryDate;
          return (pickupDate >= todayStart && pickupDate <= todayEnd) || 
                 (deliveryDate >= todayStart && deliveryDate <= todayEnd);
        });
        break;
      case 'tomorrow':
        // Tomorrow: yesterday + tomorrow + 4 days forward (6 days total)
        const tomorrowStart = new Date(currentDate);
        tomorrowStart.setDate(tomorrowStart.getDate() - 1); // Yesterday
        const tomorrowEnd = new Date(currentDate);
        tomorrowEnd.setDate(tomorrowEnd.getDate() + 5); // +5 days forward (tomorrow + 4 more)
        filteredLoads = loads.filter(load => {
          const pickupDate = typeof load.pickupDate === 'string' ? new Date(load.pickupDate) : load.pickupDate;
          const deliveryDate = typeof load.deliveryDate === 'string' ? new Date(load.deliveryDate) : load.deliveryDate;
          return (pickupDate >= tomorrowStart && pickupDate <= tomorrowEnd) || 
                 (deliveryDate >= tomorrowStart && deliveryDate <= tomorrowEnd);
        });
        break;
      case 'week':
        // This Week: Sunday through Saturday of current week
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Go to Sunday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Go to Saturday
        filteredLoads = loads.filter(load => {
          const pickupDate = typeof load.pickupDate === 'string' ? new Date(load.pickupDate) : load.pickupDate;
          const deliveryDate = typeof load.deliveryDate === 'string' ? new Date(load.deliveryDate) : load.deliveryDate;
          return (pickupDate >= weekStart && pickupDate <= weekEnd) || 
                 (deliveryDate >= weekStart && deliveryDate <= weekEnd);
        });
        break;
      case 'month':
        // This Month: First day to last day of current month
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        filteredLoads = loads.filter(load => {
          const pickupDate = typeof load.pickupDate === 'string' ? new Date(load.pickupDate) : load.pickupDate;
          const deliveryDate = typeof load.deliveryDate === 'string' ? new Date(load.deliveryDate) : load.deliveryDate;
          return (pickupDate >= monthStart && pickupDate <= monthEnd) || 
                 (deliveryDate >= monthStart && deliveryDate <= monthEnd);
        });
        break;
      default:
        filteredLoads = loads;
    }

    return filteredLoads;
  };

  const filteredLoads = getFilteredData();

  // Current status metrics
  const presentDrivers = drivers.filter(driver => driver.status === 'active').length;
  const trainingDrivers = drivers.filter(driver => driver.status === 'in-training').length;
  const oosDrivers = drivers.filter(driver => driver.status === 'oos').length;

  const assignedTrucks = trucks.filter(truck => truck.status === 'in-use').length;
  const unseatedTrucks = trucks.filter(truck => truck.status === 'available').length;
  const oosTrucks = trucks.filter(truck => truck.status === 'maintenance' || truck.status === 'out-of-service').length;

  // Load metrics based on filtered data
  const displayLoadsShipping = filteredLoads.filter((load: Load) => load.status === 'picked-up' || load.status === 'in-transit').length;
  const displayOpenLoads = filteredLoads.filter((load: Load) => load.status === 'pending' || load.status === 'assigned').length;
  const displayRevenue = filteredLoads.filter((load: Load) => load.status === 'delivered').reduce((sum: number, load: Load) => sum + (load.rate || 0), 0);

  // Today's loads for activity section
  const todayLoads = loads.filter(load => 
    isToday(load.pickupDate) || isToday(load.deliveryDate)
  );
  // Generate mock historical data for charts based on selected date range
  const generateHistoricalData = () => {
    const data = [];
    const currentDate = new Date();
    
    let startDate, daysToGenerate;
    
    switch (selectedDateRange) {
      case 'today':
        // Yesterday + today + 4 days forward (6 days total)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 1);
        daysToGenerate = 6;
        break;
      case 'tomorrow':
        // Yesterday + tomorrow + 4 days forward (6 days total)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 1);
        daysToGenerate = 6;
        break;
      case 'week':
        // Sunday through Saturday of current week (7 days)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Go to Sunday
        daysToGenerate = 7;
        break;
      case 'month':
        // Current month - generate data for each day of the month
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        daysToGenerate = lastDay.getDate();
        break;
      default:
        // Default to 7 days
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 6);
        daysToGenerate = 7;
    }
    
    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Format date based on range
      let dateLabel;
      if (selectedDateRange === 'month') {
        dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        dateLabel = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      data.push({
        date: dateLabel,
        loads: Math.floor(Math.random() * 20) + 10,
        revenue: Math.floor(Math.random() * 50000) + 20000,
        delivered: Math.floor(Math.random() * 15) + 8,
        pending: Math.floor(Math.random() * 10) + 5
      });
    }
    
    return data;
  };
  const chartData = generateHistoricalData();
  // Generate operations data for the area chart based on selected date range
  const generateOperationsData = () => {
    const data = [];
    const currentDate = new Date();
    
    let startDate, daysToGenerate;
    
    switch (selectedDateRange) {
      case 'today':
        // Yesterday + today + 4 days forward (6 days total)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 1);
        daysToGenerate = 6;
        break;
      case 'tomorrow':
        // Yesterday + tomorrow + 4 days forward (6 days total)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 1);
        daysToGenerate = 6;
        break;
      case 'week':
        // Sunday through Saturday of current week (7 days)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Go to Sunday
        daysToGenerate = 7;
        break;
      case 'month':
        // Current month - generate data for each day of the month
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        daysToGenerate = lastDay.getDate();
        break;
      default:
        // Default to 7 days
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 6);
        daysToGenerate = 7;
    }
    
    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Generate realistic data based on current metrics with some variation
      const baseOOSTrucks = oosTrucks;
      const baseOOSTrailers = Math.floor(oosTrucks * 0.8); // Assume 80% correlation
      const baseLoadsCount = loads.length;
      const basePresentDrivers = presentDrivers;
      
      data.push({
        date: date.toISOString().split('T')[0],
        oosTrucks: Math.max(0, baseOOSTrucks + Math.floor(Math.random() * 6) - 3),
        oosTrailers: Math.max(0, baseOOSTrailers + Math.floor(Math.random() * 4) - 2),
        loadsCount: Math.max(0, baseLoadsCount + Math.floor(Math.random() * 20) - 10),
        presentDrivers: Math.max(0, basePresentDrivers + Math.floor(Math.random() * 8) - 4),
      });
    }
    
    return data;
  };
  const operationsData = generateOperationsData();
  const operationsChartConfig = {
    oosTrucks: {
      label: "OOS Trucks",
      color: "#dc2626", // red-600 to match AlertTriangle icon
    },
    oosTrailers: {
      label: "OOS Trailers", 
      color: "#ea580c", // orange-600 to differentiate from trucks
    },
    loadsCount: {
      label: "Total Loads",
      color: "#9333ea", // purple-600 to match Package icon
    },
    presentDrivers: {
      label: "Present Drivers",
      color: "#2563eb", // blue-600 to match Users icon
    },
  };

  const chartConfig = {
    loads: {
      label: "Loads",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
    delivered: {
      label: "Delivered",
      color: "hsl(var(--chart-3))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-4))",
    },
  };

  const downloadReport = () => {
    const reportData = {
      dateRange: selectedDateRange,
      drivers: { present: presentDrivers, training: trainingDrivers, oos: oosDrivers },
      trucks: { assigned: assignedTrucks, unseated: unseatedTrucks, oos: oosTrucks },
      loads: { shipping: displayLoadsShipping, open: displayOpenLoads },
      revenue: displayRevenue,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `launch-report-${selectedDateRange}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your transportation operations
          </p>
        </div>
          <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={downloadReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>      {/* Operations Overview with Status Cards */}
      <Card>        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-900">LSW Reporting</h2>
            <p className="text-sm text-gray-500">
              Last submitted: {new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
            {/* Date Range Tabs */}
          <div className="flex flex-wrap gap-1 mt-4 p-1 bg-gray-100 rounded-lg">
            {[
              { value: 'today', label: 'Today' },
              { value: 'tomorrow', label: 'Tomorrow' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' }
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
        </CardHeader>
        <CardContent className="px-2 pt-6 sm:px-6">
          {/* Operations Chart */}
          <div className="mb-8">
            <ChartContainer
              config={operationsChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={operationsData}>
                <defs>
                  <linearGradient id="fillOOSTrucks" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-oosTrucks)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-oosTrucks)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillOOSTrailers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-oosTrailers)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-oosTrailers)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillLoadsCount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-loadsCount)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-loadsCount)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillPresentDrivers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-presentDrivers)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-presentDrivers)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />                <Area
                  dataKey="oosTrucks"
                  type="natural"
                  fill="url(#fillOOSTrucks)"
                  stroke="var(--color-oosTrucks)"
                />
                <Area
                  dataKey="oosTrailers"
                  type="natural"
                  fill="url(#fillOOSTrailers)"
                  stroke="var(--color-oosTrailers)"
                />
                <Area
                  dataKey="loadsCount"
                  type="natural"
                  fill="url(#fillLoadsCount)"
                  stroke="var(--color-loadsCount)"
                />
                <Area
                  dataKey="presentDrivers"
                  type="natural"
                  fill="url(#fillPresentDrivers)"
                  stroke="var(--color-presentDrivers)"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Current Status Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Drivers Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                Driver Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Present</span>
                  </div>
                  <Badge variant="status" status="active">{presentDrivers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileUser className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Training</span>
                  </div>
                  <Badge variant="status" status="in-training">{trainingDrivers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pause className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">OOS</span>
                  </div>
                  <Badge variant="status" status="oos">{oosDrivers}</Badge>
                </div>
              </div>
            </div>

            {/* Trucks Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-green-600" />
                Truck Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Assigned</span>
                  </div>
                  <Badge variant="status" status="in-use">{assignedTrucks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ParkingCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Unseated</span>
                  </div>
                  <Badge variant="default">{unseatedTrucks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">OOS</span>
                  </div>
                  <Badge variant="status" status="maintenance">{oosTrucks}</Badge>
                </div>
              </div>
            </div>

            {/* Load Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-purple-600" />
                Load Summary
                <Badge variant="default" className="ml-auto">
                  {selectedDateRange}
                </Badge>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Shipping</span>
                  </div>
                  <Badge variant="status" status="in-transit">{displayLoadsShipping}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Open</span>
                  </div>
                  <Badge variant="status" status="pending">{displayOpenLoads}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <Badge variant="status" status="delivered">
                    ${displayRevenue.toLocaleString()}
                  </Badge>
                </div>              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View Reports
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Submit Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LSW Reporting Section with Shadcn Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Load Trends Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Load Trends</h3>
            <p className="text-sm text-gray-600">Daily load volume over the past week</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart data={chartData} width={400} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="loads" 
                  stroke="var(--color-loads)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <p className="text-sm text-gray-600">Daily revenue over the past week</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <RechartsBarChart data={chartData} width={400} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  cursor={false} 
                  content={<ChartTooltipContent 
                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />} 
                />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--color-revenue)" 
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Load Status Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Load Status Distribution</h3>
          <p className="text-sm text-gray-600">Breakdown of load statuses over the past week</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <RechartsBarChart data={chartData} layout="horizontal" width={600} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis 
                type="category"
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar 
                dataKey="delivered" 
                fill="var(--color-delivered)" 
                radius={[0, 4, 4, 0]}
                stackId="status"
              />
              <Bar 
                dataKey="pending" 
                fill="var(--color-pending)" 
                radius={[0, 4, 4, 0]}
                stackId="status"
              />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Today's Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Today&apos;s Pickups
            </h3>
          </CardHeader>
          <CardContent>
            {todayLoads.filter(load => isToday(load.pickupDate)).length > 0 ? (
              <div className="space-y-3">
                {todayLoads.filter(load => isToday(load.pickupDate)).slice(0, 5).map((load) => (
                  <div key={load.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{load.loadNumber}</p>
                      <p className="text-sm text-gray-600">{load.shipper}</p>                      <p className="text-xs text-gray-500">
                        {load.pickupLocation.city}, {load.pickupLocation.state}
                      </p>
                    </div>
                    <Badge variant="status" status={load.status}>
                      {load.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pickups scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Today&apos;s Deliveries
            </h3>
          </CardHeader>
          <CardContent>
            {todayLoads.filter(load => isToday(load.deliveryDate)).length > 0 ? (
              <div className="space-y-3">
                {todayLoads.filter(load => isToday(load.deliveryDate)).slice(0, 5).map((load) => (
                  <div key={load.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{load.loadNumber}</p>
                      <p className="text-sm text-gray-600">{load.shipper}</p>
                      <p className="text-xs text-gray-500">
                        {load.deliveryLocation.city}, {load.deliveryLocation.state}
                      </p>
                    </div>                    <Badge variant="status" status={load.status}>
                      {load.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No deliveries scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Future features note */}
      <Card>
        <CardContent className="text-center py-8">
          <BarChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">More Analytics Coming Soon</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We&apos;re working on advanced analytics including driver performance metrics, 
            fuel efficiency reports, and predictive maintenance insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}