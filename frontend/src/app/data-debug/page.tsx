'use client';

import { useData } from '@/context/DataContext';

export default function DataDebugPage() {
  const { drivers, trucks, trailers, loads, loading, errors } = useData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Debug Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Drivers</h2>
          <p><strong>Count:</strong> {drivers.length}</p>
          <p><strong>Loading:</strong> {loading.drivers ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {errors.drivers || 'None'}</p>
          {drivers.length > 0 && (
            <div className="mt-2">
              <p><strong>First driver:</strong> {drivers[0].firstName} {drivers[0].lastName}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Trucks</h2>
          <p><strong>Count:</strong> {trucks.length}</p>
          <p><strong>Loading:</strong> {loading.trucks ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {errors.trucks || 'None'}</p>
          {trucks.length > 0 && (
            <div className="mt-2">
              <p><strong>First truck:</strong> {trucks[0].make} {trucks[0].model}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Trailers</h2>
          <p><strong>Count:</strong> {trailers.length}</p>
          <p><strong>Loading:</strong> {loading.trailers ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {errors.trailers || 'None'}</p>
          {trailers.length > 0 && (
            <div className="mt-2">
              <p><strong>First trailer:</strong> {trailers[0].make} {trailers[0].model}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Loads</h2>
          <p><strong>Count:</strong> {loads.length}</p>
          <p><strong>Loading:</strong> {loading.loads ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {errors.loads || 'None'}</p>
          {loads.length > 0 && (
            <div className="mt-2">
              <p><strong>First load:</strong> {loads[0].loadNumber}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Raw API URLs</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p>API Base: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}</p>
          <ul className="mt-2 space-y-1">
            <li>Drivers: <a href="http://localhost:8000/api/drivers/" target="_blank" className="text-blue-600 underline">http://localhost:8000/api/drivers/</a></li>
            <li>Trucks: <a href="http://localhost:8000/api/trucks/" target="_blank" className="text-blue-600 underline">http://localhost:8000/api/trucks/</a></li>
            <li>Trailers: <a href="http://localhost:8000/api/trailers/" target="_blank" className="text-blue-600 underline">http://localhost:8000/api/trailers/</a></li>
            <li>Loads: <a href="http://localhost:8000/api/loads/" target="_blank" className="text-blue-600 underline">http://localhost:8000/api/loads/</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
