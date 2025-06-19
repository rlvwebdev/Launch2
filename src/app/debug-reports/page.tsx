'use client';

import { useData } from '@/context/DataContext';

export default function DebugReportsPage() {
  const { drivers, trucks, loads } = useData();
  
  console.log('🔍 Debug Reports Page - Data loaded:', {
    drivers: drivers.length,
    trucks: trucks.length,
    loads: loads.length,
    firstLoad: loads[0] ? {
      id: loads[0].id,
      shipper: loads[0].shipper,
      status: loads[0].status,
      pickupDate: loads[0].pickupDate,
      deliveryDate: loads[0].deliveryDate,
      rate: loads[0].rate
    } : null
  });
  
  // Test date filtering
  const today = new Date();
  const safeDate = (dateInput: any): Date => {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in debug:', dateInput);
        return new Date();
      }
      return date;
    }
    console.warn('Unexpected date type in debug:', typeof dateInput, dateInput);
    return new Date();
  };
  
  // Test filtering for today
  const todayStart = new Date(today);
  todayStart.setDate(todayStart.getDate() - 1); // Yesterday
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 4); // +4 days forward
  
  const filteredLoads = loads.filter(load => {
    const pickupDate = safeDate(load.pickupDate);
    const deliveryDate = safeDate(load.deliveryDate);
    return (pickupDate >= todayStart && pickupDate <= todayEnd) || 
           (deliveryDate >= todayStart && deliveryDate <= todayEnd);
  });
  
  console.log('🔍 Debug Reports Page - Filtered loads:', {
    total: loads.length,
    filtered: filteredLoads.length,
    todayStart: todayStart.toISOString(),
    todayEnd: todayEnd.toISOString(),
    sampleFiltered: filteredLoads.slice(0, 3).map(load => ({
      id: load.id,
      shipper: load.shipper,
      status: load.status,
      pickupDate: load.pickupDate.toISOString(),
      deliveryDate: load.deliveryDate.toISOString()
    }))
  });
  
  // Test shipper distribution
  const shipperCounts: Record<string, number> = {};
  filteredLoads.forEach(load => {
    const shipper = load.shipper || 'Unknown';
    shipperCounts[shipper] = (shipperCounts[shipper] || 0) + 1;
  });
  
  const sortedShippers = Object.entries(shipperCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  console.log('🔍 Debug Reports Page - Shipper distribution:', {
    totalShippers: Object.keys(shipperCounts).length,
    top10: sortedShippers
  });
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Reports Data</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Drivers</h2>
          <p className="text-2xl font-bold">{drivers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Trucks</h2>
          <p className="text-2xl font-bold">{trucks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Loads</h2>
          <p className="text-2xl font-bold">{loads.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Filtered Loads (Today Range)</h2>
          <p className="text-2xl font-bold">{filteredLoads.length}</p>
          <p className="text-sm text-gray-600 mt-2">
            Date range: {todayStart.toLocaleDateString()} - {todayEnd.toLocaleDateString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Top Shippers</h2>
          <div className="space-y-1">
            {sortedShippers.slice(0, 5).map(([shipper, count]) => (
              <div key={shipper} className="flex justify-between text-sm">
                <span className="truncate">{shipper}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Load Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {Object.entries(
            loads.reduce((acc, load) => {
              acc[load.status] = (acc[load.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([status, count]) => (
            <div key={status} className="flex justify-between">
              <span className="capitalize">{status.replace('-', ' ')}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Check the browser console for detailed logging output.</p>
      </div>
    </div>
  );
}
