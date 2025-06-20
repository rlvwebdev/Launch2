'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Settings, User, Bell, Shield, Database, Palette, Globe, Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useData } from '@/context/DataContext';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [lastImportInfo, setLastImportInfo] = useState<{
    date: string;
    fileSize: string;
    fileName: string;
  } | null>(null);
  const [theme, setTheme] = useState<string>('light');
  const [language, setLanguage] = useState<string>('en-US');
  const [dateFormat, setDateFormat] = useState<string>('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState<string>('12');
  // const { addDrivers, addTrucks, addLoads, clearAllData } = useData(); // TODO: Implement bulk operations
  const handleDownloadTemplate = () => {
    // Create a link to download the template file
    const link = document.createElement('a');
    link.href = '/Launch_Import_Template.xlsx';
    link.download = 'Launch_Import_Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadDemo = () => {
    // Create a link to download the demo data file
    const link = document.createElement('a');
    link.href = '/Launch_Demo_Import_Data.xlsx';
    link.download = 'Launch_Demo_Import_Data.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setUploadStatus('Error: Please select an Excel file (.xlsx)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('Error: File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading and processing file...');

    try {      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Send to API
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        setUploadStatus(`❌ Error: ${result.error}`);
        return;
      }      // Add imported data to context
      if (result.drivers && result.drivers.length > 0) {
        // addDrivers(result.drivers); // TODO: Implement bulk driver import
        console.log('Imported drivers:', result.drivers.length);
      }
      if (result.trucks && result.trucks.length > 0) {
        // addTrucks(result.trucks); // TODO: Implement bulk truck import
        console.log('Imported trucks:', result.trucks.length);
      }
      if (result.loads && result.loads.length > 0) {
        // addLoads(result.loads); // TODO: Implement bulk load import
        console.log('Imported loads:', result.loads.length);
      }

      // Update the import info
      setLastImportInfo({
        date: new Date().toLocaleDateString(),
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileName: file.name,
      });

      // Show success message with summary
      const summary = result.summary;
      let successMessage = `✅ Import completed successfully!\n`;
      successMessage += `• Drivers: ${summary.driversImported}\n`;
      successMessage += `• Trucks: ${summary.trucksImported}\n`;
      successMessage += `• Loads: ${summary.loadsImported}`;
      
      if (summary.errorsCount > 0) {
        successMessage += `\n⚠️ ${summary.errorsCount} rows had errors`;
      }

      setUploadStatus(successMessage);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('❌ Upload failed. Please try again.');    } finally {
      setIsUploading(false);
    }
  };
  const handleClearDataConfirm = () => {
    // clearAllData(); // TODO: Implement clear all data functionality
    console.log('Clear all data requested');
    setLastImportInfo(null);
    setShowClearDataModal(false);
    setUploadStatus('Clear data functionality not yet implemented');
  };
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
          <CardContent className="space-y-4">            <div className="space-y-3">
              <div>
                <label htmlFor="company-name" className="text-sm font-medium text-gray-700">Company Name</label>
                <input
                  id="company-name"
                  type="text"
                  defaultValue="Launch Transportation Solutions"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  id="contact-email"
                  type="email"
                  defaultValue="admin@launch.com"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="phone-number" className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phone-number"
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
            <div className="space-y-4">              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Load Updates</div>
                  <div className="text-xs text-gray-500">Get notified when load status changes</div>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded" 
                    title="Enable load update notifications"
                  />
                  <span className="sr-only">Enable load update notifications</span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Maintenance Alerts</div>
                  <div className="text-xs text-gray-500">Receive truck maintenance reminders</div>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded" 
                    title="Enable maintenance alert notifications"
                  />
                  <span className="sr-only">Enable maintenance alert notifications</span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Driver Check-ins</div>
                  <div className="text-xs text-gray-500">Alerts for driver status updates</div>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    title="Enable driver check-in notifications"
                  />
                  <span className="sr-only">Enable driver check-in notifications</span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Emergency Alerts</div>
                  <div className="text-xs text-gray-500">Critical incidents and emergencies</div>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded" 
                    title="Enable emergency alert notifications"
                  />
                  <span className="sr-only">Enable emergency alert notifications</span>
                </label>
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
              </div>              <div className="flex items-center justify-between">
                <label htmlFor="session-timeout" className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Session Timeout</div>
                  <div className="text-xs text-gray-500">Auto-logout after inactivity</div>
                </label>
                <select 
                  id="session-timeout"
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                  title="Select session timeout duration"
                >
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
          </CardHeader>          <CardContent className="space-y-4">            <div className="space-y-3">
              <div>
                <label htmlFor="theme-select" className="text-sm font-medium text-gray-700">Theme</label>
                <select 
                  id="theme-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label htmlFor="language-select" className="text-sm font-medium text-gray-700">Language</label>
                <select 
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-UK">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label htmlFor="date-format-select" className="text-sm font-medium text-gray-700">Date Format</label>
                <select 
                  id="date-format-select"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label htmlFor="time-format-select" className="text-sm font-medium text-gray-700">Time Format</label>
                <select 
                  id="time-format-select"
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="12">12 Hour (AM/PM)</option>
                  <option value="24">24 Hour</option>
                </select>
              </div>
              <Button variant="primary" size="sm">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>        {/* Data Management */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600" />
              Data Management
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Import Information */}
            {lastImportInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📊 Last Import Information</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div><strong>Date:</strong> {lastImportInfo.date}</div>
                  <div><strong>File:</strong> {lastImportInfo.fileName}</div>
                  <div><strong>Size:</strong> {lastImportInfo.fileSize}</div>
                </div>
              </div>
            )}

            {/* Microsoft 365 Integration Placeholder */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Microsoft 365 Integration
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect to Microsoft 365 to automatically sync data from SharePoint or OneDrive files.
              </p>
              <Button variant="outline" size="sm" disabled>
                <Globe className="h-4 w-4 mr-1" />
                Connect to Microsoft 365
              </Button>
              <div className="text-xs text-gray-500 mt-2">
                Feature coming soon
              </div>
            </div>

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
                </div>                <select className="text-sm border border-gray-300 rounded px-2 py-1" title="Data Retention Period">
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowClearDataModal(true)}
                className="bg-red-600 text-white hover:bg-red-700 hover:text-white border-red-600"
              >
                <Database className="h-4 w-4 mr-1" />
                Clear All Data
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
        </Card>      </div>

      {/* Data Import Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Excel Data Import
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Import your existing transportation data using our Excel template
          </p>
        </CardHeader>
        <CardContent className="space-y-4">          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📋 Import Process</h4>
            <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
              <li>Download the Excel template (empty or with demo data)</li>
              <li>Fill in your data on the appropriate sheets (Drivers, Trucks, Trailers, Loads, Settings)</li>
              <li>Save the file and upload it using the import button</li>
              <li>Review the import summary and resolve any errors</li>
              <li>Confirm the import to add data to your system</li>
            </ol>
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
              💡 <strong>Tip:</strong> Download the demo data file to see realistic examples of how to structure your data.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Template Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Multiple Sheets:</strong> Drivers, Trucks, Trailers, Loads, Settings</li>
                <li>• <strong>Sample Data:</strong> Pre-filled examples for guidance</li>
                <li>• <strong>Data Validation:</strong> Built-in validation rules</li>
                <li>• <strong>Instructions:</strong> Detailed guidance included</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Supported Data</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Drivers:</strong> Personal info, licenses, contacts</li>
                <li>• <strong>Trucks:</strong> Vehicle specs, maintenance records</li>
                <li>• <strong>Trailers:</strong> Trailer details, capacity info</li>
                <li>• <strong>Loads:</strong> Shipments, routes, assignments</li>
              </ul>
            </div>
          </div>          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button 
              className="flex items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-4 w-4" />
              Download Empty Template
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleDownloadDemo}
            >
              <Download className="h-4 w-4" />
              Download Demo Data
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Data File'}
            </Button>
            <div className="text-xs text-gray-500 sm:ml-auto sm:self-center">
              Supports .xlsx files up to 10MB
            </div>
          </div>
            {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx"
            className="hidden"
            aria-label="Upload Excel file"
          />
            {/* Upload Status */}
          {uploadStatus && (
            <div className={`p-4 rounded-lg text-sm ${
              uploadStatus.includes('Error') || uploadStatus.includes('❌') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : uploadStatus.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <pre className="whitespace-pre-wrap font-sans">{uploadStatus}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <Button>Save All Changes</Button>
        <Button variant="outline">Reset to Defaults</Button>        <Button variant="danger" className="sm:ml-auto">
          Reset Application
        </Button>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Clear All Data
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to clear all data? This action cannot be undone and will permanently delete:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>All driver information</li>
              <li>All truck records</li>
              <li>All load data</li>
              <li>Import history</li>
            </ul>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowClearDataModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleClearDataConfirm}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
