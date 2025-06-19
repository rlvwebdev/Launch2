'use client';

import { useData } from '@/context/DataContext';

export default function DateTestPage() {
  const { loads } = useData();

  console.log('🧪 DateTest: loads count:', loads.length);
  
  if (loads.length > 0) {
    const sampleLoad = loads[0];
    console.log('🧪 DateTest: sample load:', {
      id: sampleLoad.id,
      pickupDate: sampleLoad.pickupDate,
      pickupDateType: typeof sampleLoad.pickupDate,
      isDate: sampleLoad.pickupDate instanceof Date,
      canFormat: sampleLoad.pickupDate instanceof Date ? 'YES' : 'NO'
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Date Conversion Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Total Loads:</strong> {loads.length}
        </div>
        
        {loads.length > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-semibold mb-2">Sample Load (First Load):</h2>
            <div className="space-y-2 text-sm">
              <div><strong>ID:</strong> {loads[0].id}</div>
              <div><strong>Pickup Date:</strong> {String(loads[0].pickupDate)}</div>
              <div><strong>Pickup Date Type:</strong> {typeof loads[0].pickupDate}</div>
              <div><strong>Is Date Object:</strong> {loads[0].pickupDate instanceof Date ? 'YES' : 'NO'}</div>
              <div><strong>Can Format:</strong> 
                {loads[0].pickupDate instanceof Date 
                  ? loads[0].pickupDate.toLocaleDateString() 
                  : 'Cannot format - not a Date object'
                }
              </div>
            </div>
          </div>
        )}

        {loads.length > 5 && (
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="font-semibold mb-2">Sample of Load Dates (First 5):</h2>
            <div className="space-y-1 text-sm">
              {loads.slice(0, 5).map((load, index) => (
                <div key={load.id} className="border-b pb-1">
                  <strong>Load {index + 1}:</strong> {load.id} - 
                  {load.pickupDate instanceof Date 
                    ? ` ${load.pickupDate.toLocaleDateString()} (Valid Date)`
                    : ` ${String(load.pickupDate)} (${typeof load.pickupDate} - INVALID)`
                  }
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
