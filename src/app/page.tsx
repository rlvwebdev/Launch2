import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Users, Truck, Package, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          TMOps Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to your trucking management operations center
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Drivers</p>
              <p className="text-lg font-semibold text-gray-700">12</p>
            </div>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Trucks</p>
              <p className="text-lg font-semibold text-gray-700">8</p>
            </div>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Active Loads</p>
              <p className="text-lg font-semibold text-gray-700">15</p>
            </div>
          </div>
        </Card>
        
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">In Transit</p>
              <p className="text-lg font-semibold text-gray-700">7</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Loads</h2>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">Load #1001</p>
                <p className="text-sm text-gray-600">Chicago → Detroit</p>
              </div>
              <Badge variant="status" status="in-transit">In Transit</Badge>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">Load #1002</p>
                <p className="text-sm text-gray-600">Houston → Dallas</p>
              </div>
              <Badge variant="status" status="delivered">Delivered</Badge>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">Load #1003</p>
                <p className="text-sm text-gray-600">Miami → Atlanta</p>
              </div>
              <Badge variant="status" status="pending">Pending</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Driver Status</h2>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">John Smith</p>
                <p className="text-sm text-gray-600">Truck #101 - Load #1001</p>
              </div>
              <Badge variant="status" status="active">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">Maria Garcia</p>
                <p className="text-sm text-gray-600">Truck #102 - Available</p>
              </div>
              <Badge variant="status" status="active">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">Robert Johnson</p>
                <p className="text-sm text-gray-600">Maintenance break</p>
              </div>
              <Badge variant="status" status="on-break">On Break</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Add New Load</Button>
          <Button variant="outline">Assign Driver</Button>
          <Button variant="outline">Schedule Maintenance</Button>
        </div>
      </div>
    </div>
  );
}
