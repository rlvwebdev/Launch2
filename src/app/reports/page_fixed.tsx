'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BarChart, FileText, Download, DollarSign, CheckCircle, AlertTriangle, Clock, RefreshCw, Container, Users, User, UserCheck, Truck, Package, MapPin, FileUser, ParkingCircle, DollarSign as Dollar, Pause } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Load } from '@/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function ReportsPage() {
  const { drivers, trucks, loads } = useData();
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  
  const today = new Date();
  const isToday = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toDateString() === today.toDateString();
  };

  // Filter data based on selected date range
  const getFilteredData = () => {
    const currentDate = new Date();
    let filteredLoads = loads;

    switch (selectedDateRange) {
      case 'today':
        filteredLoads = loads.filter(load => 
          isToday(load.pickupDate) || isToday(load.deliveryDate)
        );
        break;
      case 'tomorrow':
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = (date: Date | string) => {
          const dateObj = typeof date === 'string' ? new Date(date) : date;
          return dateObj.toDateString() === tomorrow.toDateString();
        };
        filteredLoads = loads.filter(load => 
          isTomorrow(load.pickupDate) || isTomorrow(load.deliveryDate)
        );
        break;
      case 'week':
        const weekAgo = new Date(currentDate);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredLoads = loads.filter(load => {
          const pickupDate = typeof load.pickupDate === 'string' ? new Date(load.pickupDate) : load.pickupDate;
          const deliveryDate = typeof load.deliveryDate === 'string' ? new Date(load.deliveryDate) : load.deliveryDate;
          return (pickupDate >= weekAgo && pickupDate <= currentDate) || 
                 (deliveryDate >= weekAgo && deliveryDate <= currentDate);
        });
        break;
      case 'month':
        const monthAgo = new Date(currentDate);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filteredLoads = loads.filter(load => {
          const pickupDate = typeof load.pickupDate === 'string' ? new Date(load.pickupDate) : load.pickupDate;
          const deliveryDate = typeof load.deliveryDate === 'string' ? new Date(load.deliveryDate) : load.deliveryDate;
          return (pickupDate >= monthAgo && pickupDate <= currentDate) || 
                 (deliveryDate >= monthAgo && deliveryDate <= currentDate);
        });
        break;
      default:
        filteredLoads = loads;
    }

    return filteredLoads;
  };

  const filteredLoads = getFilteredData();

  // Current status metrics (always show current status)
  const presentDrivers = drivers.filter(driver => driver.status === 'active').length;
  const trainingDrivers = drivers.filter(driver => driver.status === 'in-training').length;
  const oosDrivers = drivers.filter(driver => driver.status === 'oos').length;

  const assignedTrucks = trucks.filter(truck => truck.status === 'in-use').length;
  const unseatedTrucks = trucks.filter(truck => truck.status === 'available').length;
  const oosTrucks = trucks.filter(truck => truck.status === 'maintenance' || truck.status === 'out-of-service').length;

  const trailersAtTerminal = trucks.filter(truck => truck.status === 'available').length;
  const oosTrailers = trucks.filter(truck => truck.status === 'maintenance' || truck.status === 'out-of-service').length;
  
  // Load metrics based on filtered data  
  const displayLoadsShipping = filteredLoads.filter((load: Load) => load.status === 'picked-up' || load.status === 'in-transit').length;
  const displayOpenLoads = filteredLoads.filter((load: Load) => load.status === 'pending' || load.status === 'assigned').length;
  const displayRevenue = filteredLoads.filter((load: Load) => load.status === 'delivered').reduce((sum: number, load: Load) => sum + (load.rate || 0), 0);

  // Today's loads for activity section
  const todayLoads = loads.filter(load => 
    isToday(load.pickupDate) || isToday(load.deliveryDate)
  );

  // Generate mock historical data based on selected date range
  const generateHistoricalData = () => {
    const currentDate = new Date();
    let startDate, endDate, totalDays;
    
    switch (selectedDateRange) {
      case 'today':
        // 3 days before and 3 days after (7 days total)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 3);
        endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 3);
        totalDays = 7;
        break;
      case 'tomorrow':
        // 1 day before and 5 days after (7 days total)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 5);
        totalDays = 7;
        break;
      case 'week':
        // Sunday through Saturday of current week
        startDate = new Date(currentDate);
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek); // Go to Sunday
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // Go to Saturday
        totalDays = 7;
        break;
      case 'month':
      default:
        // 30 days
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 29);
        endDate = new Date(currentDate);
        totalDays = 30;
        break;
    }
    
    const data = [];
    
    // Starting values
    let oosTrucks = 3;
    let oosTrailers = 2;
    let drivers = 15;
    let dailyLoads = 8;
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate gradual changes with variance ≤ 4
      const oosTracksChange = (Math.random() - 0.5) * 8; // -4 to +4
      const oosTrailersChange = (Math.random() - 0.5) * 8; // -4 to +4
      const driversChange = (Math.random() - 0.5) * 8; // -4 to +4
      const dailyLoadsChange = (Math.random() - 0.5) * 8; // -4 to +4
      
      // Apply changes and ensure values stay within reasonable bounds
      oosTrucks = Math.max(0, Math.min(10, oosTrucks + oosTracksChange));
      oosTrailers = Math.max(0, Math.min(8, oosTrailers + oosTrailersChange));
      drivers = Math.max(5, Math.min(25, drivers + driversChange));
      dailyLoads = Math.max(2, Math.min(20, dailyLoads + dailyLoadsChange));
      
      data.push({
        date: date.toISOString().split('T')[0],
        oosTrucks: Math.round(oosTrucks),
        oosTrailers: Math.round(oosTrailers),
        drivers: Math.round(drivers),
        dailyLoads: Math.round(dailyLoads)
      });
    }
    return data;
  };

  const historicalData = generateHistoricalData();

  // Chart configuration for Shadcn
  const chartConfig = {
    drivers: {
      label: "Drivers",
      color: "#22c55e",
    },
    oosTrucks: {
      label: "OOS Trucks", 
      color: "#ef4444",
    },
    oosTrailers: {
      label: "OOS Trailers",
      color: "#a855f7", 
    },
    dailyLoads: {
      label: "Load Counts",
      color: "#f97316",
    },
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart className="h-8 w-8 text-blue-600" />
            Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Track performance and monitor daily operations
          </p>
        </div>
        <Button className="flex items-center gap-2" variant="primary">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Date Range Selector */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-lg">
        {[
          { key: 'today', label: 'Today' },
          { key: 'tomorrow', label: 'Tomorrow' },
          { key: 'week', label: 'This Week' },
          { key: 'month', label: 'This Month' }
        ].map((range) => (
          <button
            key={range.key}
            onClick={() => setSelectedDateRange(range.key)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              selectedDateRange === range.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* LSW Reporting */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Container className="h-5 w-5 text-blue-600" />
              LSW Reporting
              <Badge className="bg-blue-100 text-blue-800">
                {today.toLocaleDateString()}
              </Badge>
            </h2>
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700">
              <Clock className="h-4 w-4" />
              Submit LSW
              <Badge className="bg-green-100 text-green-800 ml-2">
                {today.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </Badge>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart Section - Shadcn Multiple Line Chart */}
          <div className="mb-6">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart
                data={historicalData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { 
                      month: '2-digit', 
                      day: '2-digit' 
                    });
                  }}
                  fontSize={12}
                  stroke="#6b7280"
                  interval="preserveStartEnd"
                />
                <YAxis 
                  fontSize={12} 
                  stroke="#6b7280"
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
                  dataKey="oosTrucks"
                  stroke={chartConfig.oosTrucks.color}
                  strokeWidth={2}
                  dot={false}
                  name={chartConfig.oosTrucks.label}
                />
                <Line
                  type="monotone"
                  dataKey="oosTrailers"
                  stroke={chartConfig.oosTrailers.color}
                  strokeWidth={2}
                  dot={false}
                  name={chartConfig.oosTrailers.label}
                />
                <Line
                  type="monotone"
                  dataKey="dailyLoads"
                  stroke={chartConfig.dailyLoads.color}
                  strokeWidth={2}
                  dot={false}
                  name={chartConfig.dailyLoads.label}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Stats Cards - Lists of Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Drivers Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Drivers
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Present</span>
                  </div>
                  <span className="font-semibold text-gray-900">{presentDrivers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Training</span>
                  </div>
                  <span className="font-semibold text-gray-900">{trainingDrivers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileUser className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Applications</span>
                  </div>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Out of Service</span>
                  </div>
                  <span className="font-semibold text-gray-900">{oosDrivers}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="font-bold text-gray-900">{presentDrivers + trainingDrivers + 3 + oosDrivers}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trucks Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                Trucks
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Seated</span>
                  </div>
                  <span className="font-semibold text-gray-900">{assignedTrucks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ParkingCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Unseated</span>
                  </div>
                  <span className="font-semibold text-gray-900">{unseatedTrucks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">OOS</span>
                  </div>
                  <span className="font-semibold text-gray-900">{oosTrucks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Dollar className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">For Sale</span>
                  </div>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="font-bold text-gray-900">{assignedTrucks + unseatedTrucks + oosTrucks + 2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trailers Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-lg font-semibold text-purple-600 mb-3 flex items-center gap-2">
                <Container className="h-5 w-5 text-purple-600" />
                Trailers
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">At Terminal</span>
                  </div>
                  <span className="font-semibold text-gray-900">{trailersAtTerminal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">In Transit</span>
                  </div>
                  <span className="font-semibold text-gray-900">{Math.floor(trailersAtTerminal * 0.6)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Out of Service</span>
                  </div>
                  <span className="font-semibold text-gray-900">{oosTrailers}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="font-bold text-gray-900">{trailersAtTerminal + Math.floor(trailersAtTerminal * 0.6) + oosTrailers}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loads Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Loads ({selectedDateRange})
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Shipping</span>
                  </div>
                  <span className="font-semibold text-gray-900">{Math.floor(displayLoadsShipping * 0.6)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Delivering</span>
                  </div>
                  <span className="font-semibold text-gray-900">{Math.floor(displayLoadsShipping * 0.4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Open</span>
                  </div>
                  <span className="font-semibold text-gray-900">{displayOpenLoads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Pause className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Shutdown</span>
                  </div>
                  <span className="font-semibold text-gray-900">1</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="font-bold text-gray-900">{Math.floor(displayLoadsShipping * 0.6) + Math.floor(displayLoadsShipping * 0.4) + displayOpenLoads + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue and Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-gray-900">Revenue ({selectedDateRange})</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${displayRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Today&apos;s Scheduled Activity
            </h3>
          </CardHeader>
          <CardContent>
            {todayLoads.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No loads scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayLoads.slice(0, 5).map((load) => (
                  <div key={load.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{load.loadNumber}</div>
                      <div className="text-sm text-gray-600">
                        {load.pickupLocation.city}, {load.pickupLocation.state} → {load.deliveryLocation.city}, {load.deliveryLocation.state}
                      </div>
                    </div>
                    <Badge className={
                      load.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      load.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {load.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
                {todayLoads.length > 5 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    And {todayLoads.length - 5} more loads...
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Alerts & Maintenance
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trucks.filter(truck => new Date(truck.nextMaintenanceDue) < new Date()).length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-900">Maintenance Due</div>
                    <div className="text-sm text-red-700">
                      {trucks.filter(truck => new Date(truck.nextMaintenanceDue) < new Date()).length} trucks need maintenance
                    </div>
                  </div>
                </div>
              )}

              {trucks.filter(truck => {
                const expiryDate = new Date(truck.registrationExpiry);
                const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                return expiryDate < thirtyDaysFromNow;
              }).length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-900">Registration Expiring</div>
                    <div className="text-sm text-yellow-700">
                      {trucks.filter(truck => {
                        const expiryDate = new Date(truck.registrationExpiry);
                        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                        return expiryDate < thirtyDaysFromNow;
                      }).length} trucks have registrations expiring soon
                    </div>
                  </div>
                </div>
              )}

              {trucks.filter(truck => new Date(truck.nextMaintenanceDue) < new Date()).length === 0 &&
               trucks.filter(truck => {
                 const expiryDate = new Date(truck.registrationExpiry);
                 const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                 return expiryDate < thirtyDaysFromNow;
               }).length === 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">All Clear</div>
                    <div className="text-sm text-green-700">
                      No maintenance or registration alerts
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future features note */}
      <Card>
        <CardContent className="text-center py-8">
          <BarChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">More Reports Coming Soon</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We&apos;re working on additional reporting features including detailed analytics, 
            performance trends, financial reports, and custom dashboard configurations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
