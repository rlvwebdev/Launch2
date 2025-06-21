'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Database, CheckCircle, XCircle, RefreshCw, Settings } from 'lucide-react';

interface DatabaseHealthStatus {
  connected: boolean;
  tablesExist: boolean;
  error?: string;
  connectionUrl?: string;
}

export default function DatabaseStatusCard() {
  const [status, setStatus] = useState<DatabaseHealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/status');
      const result = await response.json();
      
      if (result.success) {
        setStatus(result.data);
      } else {
        setStatus({
          connected: false,
          tablesExist: false,
          error: result.error
        });
      }
    } catch (error) {
      setStatus({
        connected: false,
        tablesExist: false,
        error: 'Failed to connect to database'
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setInitializing(true);
    try {
      const response = await fetch('/api/database/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'initialize' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh status after initialization
        await checkStatus();
      } else {
        console.error('Database initialization failed:', result.error);
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);
  const getConnectionBadge = () => {
    if (loading) return <Badge variant="default">Checking...</Badge>;
    if (!status) return <Badge variant="default" className="bg-gray-100 text-gray-800">Unknown</Badge>;
    
    if (status.connected && status.tablesExist) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Ready</Badge>;
    } else if (status.connected) {
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Setup Needed</Badge>;
    } else {
      return <Badge variant="default" className="bg-red-100 text-red-800">Disconnected</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Database Status
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Connection</div>
              <div className="text-xs text-gray-500">Database connectivity status</div>
            </div>
            {getConnectionBadge()}
          </div>

          {status && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {status.connected ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    Database Connection
                  </div>
                  <div className="text-xs text-gray-500">
                    {status.connectionUrl || 'Not configured'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {status.tablesExist ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    Tables Setup
                  </div>
                  <div className="text-xs text-gray-500">
                    Required database tables
                  </div>
                </div>
              </div>

              {status.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-sm text-red-800">
                    <strong>Error:</strong> {status.error}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkStatus}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {status && status.connected && !status.tablesExist && (
            <Button 
              size="sm"
              onClick={initializeDatabase}
              disabled={initializing}
              className="flex items-center gap-1"
            >
              <Settings className={`h-4 w-4 ${initializing ? 'animate-spin' : ''}`} />
              {initializing ? 'Setting up...' : 'Setup Tables'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
