'use client';

import { useData } from '@/context/DataContext';
import { useOrganizational } from '@/context/OrganizationalContext';

export default function DataDebugPage() {
  const { drivers, trucks, trailers, loads, loading, errors } = useData();
  const { currentOrganization, getOrganizationalFilter } = useOrganizational();

  const orgFilter = getOrganizationalFilter();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Data Debug Page</h1>
      
      {/* Loading States */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Loading States</h2>
        <pre>{JSON.stringify(loading, null, 2)}</pre>
      </div>

      {/* Error States */}
      <div className="bg-red-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Error States</h2>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>

      {/* Current Organization */}
      <div className="bg-blue-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Current Organization</h2>
        <pre>{JSON.stringify(currentOrganization, null, 2)}</pre>
      </div>

      {/* Organization Filter */}
      <div className="bg-green-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Organization Filter</h2>
        <pre>{JSON.stringify(orgFilter, null, 2)}</pre>
      </div>

      {/* Data Counts */}
      <div className="bg-yellow-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Data Counts</h2>
        <ul>
          <li>Drivers: {drivers.length}</li>
          <li>Trucks: {trucks.length}</li>
          <li>Trailers: {trailers.length}</li>
          <li>Loads: {loads.length}</li>
        </ul>
      </div>

      {/* Sample Data */}
      <div className="bg-purple-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Sample Drivers (first 3)</h2>
        <pre>{JSON.stringify(drivers.slice(0, 3), null, 2)}</pre>
      </div>

      <div className="bg-indigo-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Sample Trucks (first 3)</h2>
        <pre>{JSON.stringify(trucks.slice(0, 3), null, 2)}</pre>
      </div>
    </div>
  );
}
