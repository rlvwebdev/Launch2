'use client';

import { useState, useEffect } from 'react';

export default function LoadTestPage() {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Testing direct fetch...');
        const response = await fetch('/comprehensive_loads_data.json');
        console.log('Response status:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Data loaded successfully:', data.length, 'loads');
          setLoads(data);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const shipperCounts = loads.reduce((acc: Record<string, number>, load) => {
    const shipper = load.shipper || 'Unknown';
    acc[shipper] = (acc[shipper] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Load Data Test</h1>
      <p className="mb-4">Successfully loaded {loads.length} loads</p>
      
      {loads.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sample Loads:</h2>
          {loads.slice(0, 5).map((load, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded">
              <p><strong>ID:</strong> {load.id}</p>
              <p><strong>Shipper:</strong> {load.shipper}</p>
              <p><strong>Status:</strong> {load.status}</p>
              <p><strong>Pickup Date:</strong> {load.pickupDate}</p>
            </div>
          ))}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Shipper Distribution (Top 10):</h3>
            <div className="bg-gray-100 p-4 rounded">
              {Object.entries(shipperCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([shipper, count]) => (
                  <div key={shipper} className="flex justify-between py-1">
                    <span>{shipper}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Testing direct fetch...');
        const response = await fetch('/comprehensive_loads_data.json');
        console.log('Response status:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Data loaded successfully:', data.length, 'loads');
          setLoads(data);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Load Data Test</h1>
      <p className="mb-4">Successfully loaded {loads.length} loads</p>
      
      {loads.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sample Loads:</h2>
          {loads.slice(0, 5).map((load, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded">
              <p><strong>ID:</strong> {load.id}</p>
              <p><strong>Shipper:</strong> {load.shipper}</p>
              <p><strong>Status:</strong> {load.status}</p>
              <p><strong>Pickup Date:</strong> {load.pickupDate}</p>
            </div>
          ))}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Shipper Distribution:</h3>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm overflow-auto">
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
          </div>
        </div>
      )}
    </div>
  );
}
