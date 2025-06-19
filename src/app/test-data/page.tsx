'use client';

import { useData } from '@/context/DataContext';

export default function DataTestPage() {
  const { loads, drivers, trucks } = useData();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Data Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Drivers</h2>
          <p className="text-3xl font-bold text-blue-600">{drivers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Trucks</h2>
          <p className="text-3xl font-bold text-green-600">{trucks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Loads</h2>
          <p className="text-3xl font-bold text-orange-600">{loads.length}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Sample Load Data</h3>
        {loads.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm">
{JSON.stringify({
  id: loads[0].id,
  shipper: loads[0].shipper,
  status: loads[0].status,
  pickupDate: loads[0].pickupDate?.toISOString(),
  loadNumber: loads[0].loadNumber
}, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No loads found</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Shipper Distribution</h3>
        {loads.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm">
{JSON.stringify(
  loads.reduce((acc: Record<string, number>, load) => {
    const shipper = load.shipper || 'Unknown';
    acc[shipper] = (acc[shipper] || 0) + 1;
    return acc;
  }, {}),
  null,
  2
)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No load data for shipper analysis</p>
        )}
      </div>
    </div>
  );
}
