'use client';

import { useData } from '@/context/DataContext';

export default function ContextTestPage() {
  const { loads, drivers, trucks } = useData();
  
  console.log('=== CONTEXT TEST PAGE ===');
  console.log('Loads:', loads.length, loads.slice(0, 2));
  console.log('Drivers:', drivers.length, drivers.slice(0, 2));
  console.log('Trucks:', trucks.length, trucks.slice(0, 2));
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Context Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Loads</h2>
          <p>Count: {loads.length}</p>
          <pre className="bg-gray-100 p-2 text-xs overflow-x-auto">
            {JSON.stringify(loads.slice(0, 2), null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Drivers</h2>
          <p>Count: {drivers.length}</p>
          <pre className="bg-gray-100 p-2 text-xs overflow-x-auto">
            {JSON.stringify(drivers.slice(0, 2), null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Trucks</h2>
          <p>Count: {trucks.length}</p>
          <pre className="bg-gray-100 p-2 text-xs overflow-x-auto">
            {JSON.stringify(trucks.slice(0, 2), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
