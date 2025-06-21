'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function BackendTestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [connectionData, setConnectionData] = useState<any>(null);
  const [drivers, setDrivers] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        // Test basic backend connectivity
        console.log('Testing connection to Django backend...');
        
        const connectionResult = await apiClient.testConnection();
        setConnectionData(connectionResult);

        if (connectionResult.status === 'success') {
          // Try to fetch drivers data
          try {
            const driversData = await apiClient.getDrivers();
            setDrivers(driversData);
            setStatus('success');
          } catch (driverError) {
            console.warn('Driver data fetch failed (may need auth):', driverError);
            setStatus('success'); // Connection is still good, just auth issue
          }
        } else {
          throw new Error(connectionResult.message);
        }
      } catch (err) {
        console.error('Backend connection failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          � Backend Connection Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Django Backend Status</h2>
          
          {status === 'loading' && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Testing connection...</span>
            </div>
          )}          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">✅ Connected successfully!</span>
              </div>
              
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="font-medium text-gray-900 mb-2">Connection Status:</h3>
                <pre className="text-sm text-gray-600 overflow-auto">
                  {JSON.stringify(connectionData, null, 2)}
                </pre>
              </div>

              {drivers && (
                <div className="bg-green-50 rounded-md p-4">
                  <h3 className="font-medium text-green-900 mb-2">Sample Data (Drivers):</h3>
                  <pre className="text-sm text-green-600 overflow-auto max-h-40">
                    {JSON.stringify(drivers, null, 2)}
                  </pre>
                </div>
              )}
              
              {!drivers && (
                <div className="bg-yellow-50 rounded-md p-4">                  <h3 className="font-medium text-yellow-900 mb-2">Note:</h3>
                  <p className="text-sm text-yellow-700">
                    Connection successful but couldn&apos;t fetch data. This may be due to authentication requirements or empty database.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">❌ Connection failed</span>
              </div>
              
              <div className="bg-red-50 rounded-md p-4">
                <h3 className="font-medium text-red-900 mb-2">Error Details:</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-md p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Troubleshooting:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Make sure Django backend is running: <code className="bg-yellow-100 px-1 rounded">python manage.py runserver</code></li>
                  <li>• Check CORS settings in Django</li>
                  <li>• Verify API_URL in .env.local: <code className="bg-yellow-100 px-1 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}</code></li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Configuration:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Frontend URL:</strong> {process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}</p>
              <p><strong>Backend API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            🔄 Test Again
          </button>
        </div>
      </div>
    </div>
  );
}
