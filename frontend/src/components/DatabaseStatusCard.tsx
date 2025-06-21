/**
 * Database Status Component
 * Shows current database connection status and provides initialization controls
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Database, CheckCircle, AlertCircle, RefreshCw, Plus } from 'lucide-react';

interface DatabaseStatus {
  connected: boolean;
  initialized: boolean;
  driverCount: number;
  truckCount: number;
  loadCount: number;
  error?: string;
}

export default function DatabaseStatusCard() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const checkDatabaseStatus = async () => {
    setIsLoading(true);
    try {
      // Check drivers to verify connection
      const driversResponse = await fetch('/api/drivers');
      const trucksResponse = await fetch('/api/trucks');
      
      if (driversResponse.ok && trucksResponse.ok) {
        const drivers = await driversResponse.json();
        const trucks = await trucksResponse.json();
        
        setStatus({
          connected: true,
          initialized: true,
          driverCount: drivers.length || 0,
          truckCount: trucks.length || 0,
          loadCount: 0, // TODO: Implement loads endpoint
        });
      } else {
        setStatus({
          connected: false,
          initialized: false,
          driverCount: 0,
          truckCount: 0,
          loadCount: 0,
          error: 'Failed to connect to database'
        });
      }
    } catch (error) {
      setStatus({
        connected: false,
        initialized: false,
        driverCount: 0,
        truckCount: 0,
        loadCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Database initialization result:', result);
        
        // Refresh status after initialization
        await checkDatabaseStatus();
      } else {
        const error = await response.json();
        console.error('Database initialization failed:', error);
        setStatus(prev => prev ? { ...prev, error: 'Initialization failed' } : null);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      setStatus(prev => prev ? { ...prev, error: 'Initialization error' } : null);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  if (!status && isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Checking database status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Database Status
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <>
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Connection:</span>
              {status.connected ? (
                <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="default" className="bg-red-100 text-red-800 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Disconnected
                </Badge>
              )}
            </div>

            {/* Data Counts */}
            {status.connected && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Drivers:</span>
                  <span className="text-sm font-medium">{status.driverCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trucks:</span>
                  <span className="text-sm font-medium">{status.truckCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Loads:</span>
                  <span className="text-sm font-medium">{status.loadCount}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {status.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{status.error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={checkDatabaseStatus}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {!status.initialized && (
                <Button
                  size="sm"
                  onClick={initializeDatabase}
                  disabled={isInitializing}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {isInitializing ? 'Initializing...' : 'Initialize DB'}
                </Button>
              )}
            </div>

            {/* Environment Info */}
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div>Environment: {process.env.NEXT_PUBLIC_APP_ENV || 'development'}</div>
              <div>API URL: {process.env.NEXT_PUBLIC_API_URL || '/api'}</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
