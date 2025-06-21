'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Database, CheckCircle, AlertCircle, RefreshCw, Play } from 'lucide-react';
import { DatabaseApiClient } from '@/lib/database-api';

export default function DatabaseSetupPage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [setupResults, setSetupResults] = useState<any>(null);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const isConnected = await DatabaseApiClient.checkConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch (error) {
      setConnectionStatus('disconnected');
      return false;
    }
  };

  const initializeDatabase = async () => {
    setIsInitializing(true);
    setInitStatus('Initializing database tables and sample data...');
    
    try {
      await DatabaseApiClient.initializeDatabase();
      setInitStatus('✅ Database initialized successfully!');
      
      // Fetch some sample data to verify
      const drivers = await DatabaseApiClient.getDrivers();
      const trucks = await DatabaseApiClient.getTrucks();
      
      setSetupResults({
        drivers: drivers.length,
        trucks: trucks.length,
        sampleDrivers: drivers.slice(0, 3),
        sampleTrucks: trucks.slice(0, 3)
      });
      
      await checkConnection();
    } catch (error) {
      console.error('Database initialization error:', error);
      setInitStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
          Database Setup
        </h1>
        <p className="text-gray-600 mt-1">
          Initialize your Launch TMS database with tables and sample data
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Database Connection
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Connection Status</div>
              <div className="text-xs text-gray-500">Vercel Postgres Database</div>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === 'checking' && (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Checking...
                </Badge>
              )}
              {connectionStatus === 'connected' && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
              {connectionStatus === 'disconnected' && (
                <Badge variant="default" className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={connectionStatus === 'checking'}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Test Connection
          </Button>
        </CardContent>
      </Card>

      {/* Database Initialization */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            Initialize Database
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🗄️ What this will create:</h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
              <li><strong>drivers</strong> table with sample CDL drivers</li>
              <li><strong>trucks</strong> table with sample fleet vehicles</li>
              <li><strong>loads</strong> table for shipment management</li>
              <li>Sample data to get you started</li>
            </ul>
          </div>

          {/* Environment Variables Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">📋 Prerequisites:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>1. <strong>Vercel Postgres</strong> database added to your project</div>
              <div>2. Environment variables configured:</div>
              <div className="ml-4 font-mono text-xs bg-gray-100 p-2 rounded">
                POSTGRES_URL<br/>
                POSTGRES_PRISMA_URL<br/>
                POSTGRES_URL_NON_POOLING<br/>
                POSTGRES_USER<br/>
                POSTGRES_HOST<br/>
                POSTGRES_PASSWORD<br/>
                POSTGRES_DATABASE
              </div>
            </div>
          </div>

          <Button 
            onClick={initializeDatabase}
            disabled={isInitializing || connectionStatus !== 'connected'}
            className="w-full"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Initialize Database
              </>
            )}
          </Button>

          {/* Status Message */}
          {initStatus && (
            <div className={`p-4 rounded-lg text-sm ${
              initStatus.includes('Error') || initStatus.includes('❌') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : initStatus.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <pre className="whitespace-pre-wrap font-sans">{initStatus}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Results */}
      {setupResults && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Setup Results
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{setupResults.drivers}</div>
                <div className="text-sm text-blue-700">Drivers Created</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{setupResults.trucks}</div>
                <div className="text-sm text-green-700">Trucks Created</div>
              </div>
            </div>

            {setupResults.sampleDrivers && setupResults.sampleDrivers.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sample Drivers:</h4>
                <div className="space-y-2">
                  {setupResults.sampleDrivers.map((driver: any) => (
                    <div key={driver.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <span>{driver.firstName} {driver.lastName}</span>
                      <span className="text-gray-500">{driver.licenseNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/drivers'}>
                View Drivers
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/trucks'}>
                View Trucks
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
