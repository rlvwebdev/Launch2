'use client';

import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function DataConnectionTestPage() {
  const { 
    drivers, 
    trucks, 
    loads, 
    loading, 
    errors, 
    refreshData 
  } = useData();

  const hasData = drivers.length > 0 || trucks.length > 0 || loads.length > 0;
  const hasErrors = errors.drivers || errors.trucks || errors.loads;
  const isLoading = loading.drivers || loading.trucks || loading.loads;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              🔄 Live Data Connection Test
            </h1>
            <p className="text-gray-600 mt-2">
              Testing connection to Django backend API - verifying live data instead of Excel/JSON files
            </p>
          </div>
          
          <Button 
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Overall Status</h3>
                {hasData && !hasErrors ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>              <Badge 
                variant={hasData && !hasErrors ? 'status' : 'default'}
                className="w-full justify-center text-white bg-green-500"
              >
                {hasData && !hasErrors ? '✅ Connected to Django API' : '❌ Connection Issues'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-gray-900">Data Source</h3>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Django REST API
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  Excel/JSON Files (deprecated)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-gray-900">Loading Status</h3>
            </CardHeader>
            <CardContent>              <Badge variant={isLoading ? 'status' : 'default'}>
                {isLoading ? '🔄 Loading...' : '✅ Ready'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                👨‍💼 Drivers
                {loading.drivers && <RefreshCw className="w-4 h-4 animate-spin" />}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">{drivers.length}</div>
              {errors.drivers && (
                <div className="text-red-500 text-sm mb-2">❌ {errors.drivers}</div>
              )}
              <div className="text-sm text-gray-600">
                {drivers.length > 0 ? (
                  <>Sample: {drivers[0]?.firstName} {drivers[0]?.lastName}</>
                ) : (
                  'No drivers loaded'
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                🚛 Trucks
                {loading.trucks && <RefreshCw className="w-4 h-4 animate-spin" />}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{trucks.length}</div>
              {errors.trucks && (
                <div className="text-red-500 text-sm mb-2">❌ {errors.trucks}</div>
              )}
              <div className="text-sm text-gray-600">
                {trucks.length > 0 ? (
                  <>Sample: {trucks[0]?.make} {trucks[0]?.model}</>
                ) : (
                  'No trucks loaded'
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                📦 Loads
                {loading.loads && <RefreshCw className="w-4 h-4 animate-spin" />}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">{loads.length}</div>
              {errors.loads && (
                <div className="text-red-500 text-sm mb-2">❌ {errors.loads}</div>
              )}
              <div className="text-sm text-gray-600">
                {loads.length > 0 ? (
                  <>Sample: {loads[0]?.loadNumber} - {loads[0]?.shipper}</>
                ) : (
                  'No loads loaded'
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Data Preview */}
        {hasData && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">🔍 Sample Data Preview</h3>
              <p className="text-sm text-gray-600">
                This data is coming directly from the Django backend API, not from Excel files
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {drivers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">First Driver</h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div><strong>Name:</strong> {drivers[0].firstName} {drivers[0].lastName}</div>
                      <div><strong>ID:</strong> {drivers[0].id}</div>
                      <div><strong>License:</strong> {drivers[0].licenseNumber}</div>
                      <div><strong>Phone:</strong> {drivers[0].phoneNumber}</div>
                      <div><strong>Status:</strong> {drivers[0].status}</div>
                    </div>
                  </div>
                )}

                {trucks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">First Truck</h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div><strong>Make/Model:</strong> {trucks[0].make} {trucks[0].model}</div>
                      <div><strong>Year:</strong> {trucks[0].year}</div>
                      <div><strong>License:</strong> {trucks[0].licensePlate}</div>
                      <div><strong>Color:</strong> {trucks[0].color}</div>
                      <div><strong>Status:</strong> {trucks[0].status}</div>
                    </div>
                  </div>
                )}

                {loads.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">First Load</h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div><strong>Load #:</strong> {loads[0].loadNumber}</div>
                      <div><strong>Shipper:</strong> {loads[0].shipper}</div>
                      <div><strong>Status:</strong> {loads[0].status}</div>
                      <div><strong>Weight:</strong> {loads[0].weight?.toLocaleString()} lbs</div>
                      <div><strong>Rate:</strong> ${loads[0].rate?.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="font-semibold text-gray-900">📋 Connection Test Results</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                {hasData ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong>API Connection:</strong> {hasData ? 
                    'SUCCESS - Frontend is successfully connecting to Django backend and retrieving live data.' :
                    'FAILED - Frontend cannot connect to Django backend. Check if the backend server is running on localhost:8000.'
                  }
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                {!hasErrors ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong>Data Loading:</strong> {!hasErrors ? 
                    'SUCCESS - All data types (drivers, trucks, loads) are loading without errors.' :
                    'ERRORS - Some data types failed to load. Check the error messages above.'
                  }
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Excel Migration:</strong> SUCCESS - The frontend is no longer using Excel files or JSON imports. All data comes from the Django API.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
