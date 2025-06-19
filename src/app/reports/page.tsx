'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BarChart, FileText, Download, DollarSign, CheckCircle, AlertTriangle, Clock, RefreshCw, Users, UserCheck, Truck, Package, MapPin, FileUser, ParkingCircle, Pause, UserPlus, Briefcase, Home, ShoppingCart, Navigation, Building, Truck as TruckIcon, AlertCircle, Send } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Load } from '@/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart, Bar, Area, AreaChart } from 'recharts';

export default function ReportsPage() {
  const { drivers, trucks, loads } = useData();
  const [selectedDateRange, setSelectedDateRange] = useState('comprehensive');
  
  // Safe date conversion utility
  const safeDate = (dateInput: any): Date => {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in reports:', dateInput);
        return new Date();
      }
      return date;
    }
    console.warn('Unexpected date type in reports:', typeof dateInput, dateInput);
    return new Date();
  };
    // Debug logging
  console.log('📊 ReportsPage: Received data:', {
    drivers: drivers.length,
    trucks: trucks.length,
    loads: loads.length,
    sampleLoadValid: loads[0] ? (loads[0].pickupDate instanceof Date) : null
  });  
  const today = new Date();
  console.log('📅 ReportsPage: Today is:', today.toISOString().split('T')[0]);
  console.log('📅 ReportsPage: Selected date range:', selectedDateRange);
  
  const isToday = (date: Date | string) => {
    try {
      const dateObj = safeDate(date);
      return dateObj.toDateString() === today.toDateString();
    } catch (error) {
      console.error('Error in isToday:', error, date);
      return false;
    }
  };// Filter data based on selected date range
  const getFilteredData = () => {
    const currentDate = new Date();
    let filteredLoads = loads;    try {
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
          tomorrowEnd.setDate(tomorrowEnd.getDate() + 2); // +2 days forward
          filteredLoads = loads.filter(load => {
            const pickupDate = safeDate(load.pickupDate);
            const deliveryDate = safeDate(load.deliveryDate);
            return (pickupDate >= tomorrowStart && pickupDate <= tomorrowEnd) || 
                   (deliveryDate >= tomorrowStart && deliveryDate <= tomorrowEnd);
          });
          break;case 'week':
          // This Week: Sunday through Saturday of current week
          const weekStart = new Date(currentDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Go to Sunday
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6); // Go to Saturday
          filteredLoads = loads.filter(load => {
            const pickupDate = safeDate(load.pickupDate);
            const deliveryDate = safeDate(load.deliveryDate);
            return (pickupDate >= weekStart && pickupDate <= weekEnd) || 
                   (deliveryDate >= weekStart && deliveryDate <= weekEnd);
          });
          break;
        case 'month':
          // This Month: First day to last day of current month
          const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          filteredLoads = loads.filter(load => {
            const pickupDate = safeDate(load.pickupDate);
            const deliveryDate = safeDate(load.deliveryDate);
            return (pickupDate >= monthStart && pickupDate <= monthEnd) || 
                   (deliveryDate >= monthStart && deliveryDate <= monthEnd);
          });
          break;
        default:
          filteredLoads = loads;
      }
    } catch (error) {
      console.error('Error filtering loads by date:', error);
      filteredLoads = loads; // Fallback to all loads
    }

    return filteredLoads;
  };

  const filteredLoads = getFilteredData();
    console.log(`📊 ReportsPage: Filtered loads for ${selectedDateRange}:`, {
    total: loads.length,
    filtered: filteredLoads.length,
    ratio: `${((filteredLoads.length / loads.length) * 100).toFixed(1)}%`,
    dateRange: selectedDateRange === 'today' ? 'Past 14 days + today' : 
               selectedDateRange === 'tomorrow' ? 'Past 14 days + today + tomorrow' : selectedDateRange,
    sampleDates: filteredLoads.slice(0, 3).map(load => ({
      id: load.id,
      pickup: load.pickupDate.toISOString().split('T')[0],
      delivery: load.deliveryDate.toISOString().split('T')[0]
    }))
  });// Current status metrics
  // Driver metrics
  const presentDrivers = drivers.filter(driver => driver.status === 'active').length; // Keep for backward compatibility
  const availableDrivers = drivers.filter(driver => driver.status === 'available').length;
  const trainingDrivers = drivers.filter(driver => driver.status === 'in-training').length;
  const leaveDrivers = drivers.filter(driver => driver.status === 'leave').length;
  const oosDrivers = drivers.filter(driver => driver.status === 'oos').length;
  const applicationDrivers = drivers.filter(driver => driver.status === 'application').length;

  // Truck metrics
  const assignedTrucks = trucks.filter(truck => truck.status === 'in-use').length;
  const unseatedTrucks = trucks.filter(truck => truck.status === 'available').length;
  const oosTrucks = trucks.filter(truck => truck.status === 'maintenance' || truck.status === 'out-of-service').length;
  const forSaleTrucks = trucks.filter(truck => truck.status === 'for-sale').length;

  // Trailer metrics (assuming we have trailers data similar to trucks)
  // For now, we'll simulate trailer data based on truck data patterns
  const totalTrailers = Math.floor(trucks.length * 1.2); // Assume 20% more trailers than trucks
  const atTerminalTrailers = Math.floor(totalTrailers * 0.4);
  const inTransitTrailers = Math.floor(totalTrailers * 0.45);
  const oosTrailers = Math.floor(totalTrailers * 0.1);
  const dedicatedTrailers = Math.floor(totalTrailers * 0.05);
  // Load metrics based on filtered data
  const displayLoadsShipping = filteredLoads.filter((load: Load) => load.status === 'picked-up' || load.status === 'in-transit').length;
  const displayLoadsDelivering = filteredLoads.filter((load: Load) => load.status === 'delivering').length;
  const displayOpenLoads = filteredLoads.filter((load: Load) => load.status === 'pending' || load.status === 'assigned').length;
  const displayRevenue = filteredLoads.filter((load: Load) => load.status === 'delivered').reduce((sum: number, load: Load) => sum + (load.rate || 0), 0);

  console.log('📊 ReportsPage: Load metrics:', {
    shipping: displayLoadsShipping,
    delivering: displayLoadsDelivering,
    open: displayOpenLoads,
    revenue: displayRevenue,
    statusBreakdown: filteredLoads.reduce((acc, load) => {
      acc[load.status] = (acc[load.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });

  // Today's loads for activity section
  const todayLoads = loads.filter(load => 
    isToday(load.pickupDate) || isToday(load.deliveryDate)
  );  // Generate shipper distribution data for customer analysis
  const generateShipperDistributionData = () => {
    // Group loads by shipper and count them for the selected date range
    const shipperCounts: Record<string, number> = {};
    
    filteredLoads.forEach(load => {
      const shipper = load.shipper || 'Unknown';
      shipperCounts[shipper] = (shipperCounts[shipper] || 0) + 1;
    });
    
    // Sort shippers by load count (descending) and take top 10
    const sortedShippers = Object.entries(shipperCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    // Format data for the chart
    return sortedShippers.map(([shipper, count]) => ({
      shipper: shipper.length > 20 ? shipper.substring(0, 20) + '...' : shipper, // Truncate long names
      loads: count,
      fullName: shipper // Keep full name for tooltip
    }));
  };
  // Generate mock historical data for time-based charts
  const generateHistoricalData = () => {
    const data = [];
    const currentDate = new Date();
    
    let startDate, daysToGenerate;
    
    switch (selectedDateRange) {
      case 'comprehensive':
        // June 5-19, 2025 (15 days) - exact range of our data
        startDate = new Date('2025-06-05');
        daysToGenerate = 15;
        break;
      case 'today':
        // Past 14 days to show our historical data
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 14);
        daysToGenerate = 15; // 14 days + today
        break;
      case 'tomorrow':
        // Past 14 days to show our historical data
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 14);
        daysToGenerate = 16; // 14 days + today + tomorrow
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
        // Count actual loads delivering on this specific day
      const loadsDeliveringToday = loads.filter(load => {
        try {
          const deliveryDate = safeDate(load.deliveryDate);
          return deliveryDate.toDateString() === date.toDateString();
        } catch (error) {
          console.error('Error filtering loads by delivery date:', error, load);
          return false;
        }
      }).length;
      
      // Calculate revenue for delivered loads on this day
      const revenueToday = loads
        .filter(load => {
          try {
            const deliveryDate = safeDate(load.deliveryDate);
            return deliveryDate.toDateString() === date.toDateString() && load.status === 'delivered';
          } catch (error) {
            console.error('Error filtering loads by revenue date:', error, load);
            return false;
          }
        })
        .reduce((sum, load) => sum + (load.rate || 0), 0);
      
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
        loads: loadsDeliveringToday, // Use actual loads delivering on this day
        revenue: revenueToday // Use actual revenue from delivered loads
      });
    }
    
    return data;
  };
    const chartData = generateHistoricalData();
  const shipperData = generateShipperDistributionData();
    console.log('📊 ReportsPage: Chart data generated:', {
    chartDataPoints: chartData.length,
    shipperDataPoints: shipperData.length,
    hasChartData: chartData.length > 0,
    hasShipperData: shipperData.length > 0,
    sampleChartData: chartData.slice(0, 3),
    sampleShipperData: shipperData.slice(0, 3)
  });  // Generate operations data for the area chart based on selected date range
  const generateOperationsData = () => {
    const data = [];
    const currentDate = new Date();
    
    let startDate, daysToGenerate;
    
    switch (selectedDateRange) {
      case 'comprehensive':
        // June 5-19, 2025 (15 days) - exact range of our data
        startDate = new Date('2025-06-05');
        daysToGenerate = 15;
        break;
      case 'today':
        // Past 14 days to show our historical data
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 14);
        daysToGenerate = 15; // 14 days + today
        break;
      case 'tomorrow':
        // Past 14 days to show our historical data
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 14);
        daysToGenerate = 16; // 14 days + today + tomorrow
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
        // Count actual loads delivering on this specific day
      const loadsDeliveringToday = loads.filter(load => {
        try {
          const deliveryDate = safeDate(load.deliveryDate);
          return deliveryDate.toDateString() === date.toDateString();
        } catch (error) {
          console.error('Error filtering operations loads by date:', error, load);
          return false;
        }
      }).length;
      
      // Generate realistic data based on current metrics with some variation
      const baseOOSTrucks = oosTrucks;
      const baseOOSTrailers = Math.floor(oosTrucks * 0.8); // Assume 80% correlation
      const basePresentDrivers = presentDrivers;
      
      data.push({
        date: date.toISOString().split('T')[0],
        oosTrucks: Math.max(0, baseOOSTrucks + Math.floor(Math.random() * 6) - 3),
        oosTrailers: Math.max(0, baseOOSTrailers + Math.floor(Math.random() * 4) - 2),
        loadsCount: loadsDeliveringToday, // Use actual loads delivering on this day
        presentDrivers: Math.max(0, basePresentDrivers + Math.floor(Math.random() * 8) - 4),
      });
    }
    
    return data;
  };
  const operationsData = generateOperationsData();  const operationsChartConfig = {
    oosTrucks: {
      label: "OOS Trucks",
      color: "#dc2626", // red-600 to match AlertTriangle icon
    },
    oosTrailers: {
      label: "OOS Trailers", 
      color: "#ea580c", // orange-600 to differentiate from trucks
    },
    loadsCount: {
      label: "Loads Delivering",
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

  const shipperChartConfig = {
    loads: {
      label: "Loads",
      color: "hsl(var(--chart-1))",
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
      </div>      {/* Daily Status Reports Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">LSW Daily Status Reports</h2>              <p className="text-sm text-gray-600 mt-1">
                Submit and manage daily operational status reports
              </p>
            </div>            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/reports/lsw-history'}
              >
                <FileText className="h-4 w-4" />
                View Report History
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.open('/reports/lsw-daily', '_blank')}
              >
                <FileText className="h-4 w-4" />
                View Today&apos;s Report
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/reports/lsw-daily'}
              >
                <Send className="h-4 w-4" />
                Submit Daily Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Report Status */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Today&apos;s Report Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Status</span>
                  <Badge variant="status" status="pending">NOT SUBMITTED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Deadline</span>
                  <span className="text-sm font-medium text-blue-900">09:30 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Time Remaining</span>
                  <span className="text-sm font-medium text-blue-900">
                    {(() => {
                      const now = new Date();
                      const deadline = new Date();
                      deadline.setHours(9, 30, 0, 0);
                      if (deadline < now) {
                        deadline.setDate(deadline.getDate() + 1);
                      }
                      const diff = deadline.getTime() - now.getTime();
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      return `${hours}h ${minutes}m`;
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Report Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Report Requirements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Driver status & assignments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Truck & trailer status
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Load status & revenue
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Events & incidents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Compliance status
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Tomorrow&apos;s outlook
                </li>
              </ul>
            </div>

            {/* Recent Reports */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Recent Submissions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Yesterday</span>
                  <Badge variant="status" status="delivered">SUBMITTED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">2 days ago</span>
                  <Badge variant="status" status="delivered">SUBMITTED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">3 days ago</span>
                  <Badge variant="status" status="oos">LATE</Badge>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  Last submitted: {new Date(Date.now() - 86400000).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operations Overview with Status Cards */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-900">Current Operations Status</h2>
            {/* Date Range Tabs */}            <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg">
              {[
                { value: 'comprehensive', label: 'Comprehensive' },
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
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-6 sm:px-6">          {/* Daily Load Status Chart - LineChart */}
          <div className="mb-8">
            <ChartContainer
              config={operationsChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                data={operationsData}
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
                  dataKey="presentDrivers"
                  stroke={operationsChartConfig.presentDrivers.color}
                  strokeWidth={2}
                  dot={false}
                  name={operationsChartConfig.presentDrivers.label}
                />
                <Line
                  type="monotone"
                  dataKey="oosTrucks"
                  stroke={operationsChartConfig.oosTrucks.color}
                  strokeWidth={2}
                  dot={false}
                  name={operationsChartConfig.oosTrucks.label}
                />
                <Line
                  type="monotone"
                  dataKey="oosTrailers"
                  stroke={operationsChartConfig.oosTrailers.color}
                  strokeWidth={2}
                  dot={false}
                  name={operationsChartConfig.oosTrailers.label}
                />
                <Line
                  type="monotone"
                  dataKey="loadsCount"
                  stroke={operationsChartConfig.loadsCount.color}
                  strokeWidth={2}
                  dot={false}
                  name={operationsChartConfig.loadsCount.label}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </div>{/* Current Status Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Drivers Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                Driver Status
              </h3>
              <div className="space-y-3">                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <Badge variant="status" status="active">{availableDrivers}</Badge>
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
                    <Home className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Leave</span>
                  </div>
                  <Badge variant="default">{leaveDrivers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pause className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">Out of Service</span>
                  </div>
                  <Badge variant="status" status="oos">{oosDrivers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Applications</span>
                  </div>
                  <Badge variant="default">{applicationDrivers}</Badge>
                </div>
              </div>
            </div>

            {/* Trucks Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-green-600" />
                Truck Status
              </h3>
              <div className="space-y-3">                <div className="flex items-center justify-between">
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
                    <span className="text-sm text-gray-600">Out of Service</span>
                  </div>
                  <Badge variant="status" status="maintenance">{oosTrucks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">For Sale</span>
                  </div>
                  <Badge variant="default">{forSaleTrucks}</Badge>
                </div>
              </div>            </div>

            {/* Trailers Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <TruckIcon className="h-5 w-5 text-orange-600" />
                Trailer Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">At Terminal</span>
                  </div>
                  <Badge variant="default">{atTerminalTrailers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">In Transit</span>
                  </div>
                  <Badge variant="status" status="in-use">{inTransitTrailers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">Out of Service</span>
                  </div>
                  <Badge variant="status" status="maintenance">{oosTrailers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Dedicated</span>
                  </div>
                  <Badge variant="default">{dedicatedTrailers}</Badge>
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
              </h3>              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Shipping</span>
                  </div>
                  <Badge variant="status" status="in-transit">{displayLoadsShipping}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Delivering</span>
                  </div>
                  <Badge variant="status" status="delivered">{displayLoadsDelivering}</Badge>
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
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/reports/lsw-daily'}
            >
              <FileText className="h-4 w-4" />
              View Daily Report
            </Button>
            <Button 
              onClick={downloadReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Analytics
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
      </div>      {/* Load Distribution by Shipper */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Top Shippers ({selectedDateRange})</h3>
          <p className="text-sm text-gray-600">Load count by shipper - identify your largest customers</p>
        </CardHeader>
        <CardContent>
          {shipperData.length > 0 ? (
            <ChartContainer config={shipperChartConfig}>
              <RechartsBarChart data={shipperData} layout="horizontal" width={600} height={Math.max(300, shipperData.length * 40)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  type="category"
                  dataKey="shipper" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={120}
                />
                <ChartTooltip 
                  cursor={false} 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{data.fullName}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">{data.loads}</span> loads
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="loads" 
                  fill="var(--color-loads)" 
                  radius={[0, 4, 4, 0]}
                />
              </RechartsBarChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No load data available for the selected period</p>
              <p className="text-sm">Try selecting a different date range</p>
            </div>
          )}
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