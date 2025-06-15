import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Settings, User, Bell, Shield, Database, Palette, Globe, Download, Upload } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-8 w-8 text-gray-600" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your application preferences and configuration
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Account Settings
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  defaultValue="TMOps Trucking Solutions"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  defaultValue="admin@tmops.com"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="(555) 123-4567"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Update Account
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              Notifications
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Load Updates</div>
                  <div className="text-xs text-gray-500">Get notified when load status changes</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Maintenance Alerts</div>
                  <div className="text-xs text-gray-500">Receive truck maintenance reminders</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Driver Check-ins</div>
                  <div className="text-xs text-gray-500">Alerts for driver status updates</div>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Emergency Alerts</div>
                  <div className="text-xs text-gray-500">Critical incidents and emergencies</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Two-Factor Authentication</div>
                  <div className="text-xs text-gray-500">Add extra security to your account</div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Session Timeout</div>
                  <div className="text-xs text-gray-500">Auto-logout after inactivity</div>
                </div>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>8 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Password Requirements</div>
                  <div className="text-xs text-gray-500">Minimum password complexity</div>
                </div>
                <Badge variant="default">Strong</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Change Password</Button>
              <Button variant="outline" size="sm">View Login History</Button>
            </div>
          </CardContent>
        </Card>

        {/* Application Preferences */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Appearance
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Theme</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Language</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date Format</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Time Format</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>12 Hour (AM/PM)</option>
                  <option>24 Hour</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600" />
              Data Management
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Auto Backup</div>
                  <div className="text-xs text-gray-500">Automatic daily data backups</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Data Retention</div>
                  <div className="text-xs text-gray-500">Keep records for compliance</div>
                </div>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>5 Years</option>
                  <option>Indefinite</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Import Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-600" />
              System Information
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span className="font-medium">June 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Database:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Uptime:</span>
                <span className="font-medium">99.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">License:</span>
                <span className="font-medium">Enterprise</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Check Updates</Button>
              <Button variant="outline" size="sm">Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <Button>Save All Changes</Button>
        <Button variant="outline">Reset to Defaults</Button>
        <Button variant="danger" className="sm:ml-auto">
          Reset Application
        </Button>
      </div>
    </div>
  );
}
