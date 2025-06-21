'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BadgeLegacy from '@/components/ui/BadgeLegacy';

const Badge = BadgeLegacy;
import { 
  ArrowLeft, 
  Save, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Truck, 
  Package, 
  FileText,
  Plus,
  Edit3,
  Calendar,
  MapPin,
  DollarSign,
  Activity,
  Shield,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Bell,
  BellOff
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { lswNotificationService } from '@/utils/lswNotificationService';
import { 
  DailyStatusReport, 
  LSWReportData, 
  ReportStatus, 
  DriverStatus,
  TruckStatus,
  TrailerStatus,
  LoadStatus,
  LoadEventType,
  EventSeverity,
  ReportNotification
} from '@/types';

interface LSWDailyReportPageProps {
  reportId?: string;
}

export default function LSWDailyReportPage({ reportId }: LSWDailyReportPageProps) {
  const router = useRouter();
  const { drivers, trucks, loads } = useData();
  
  // Mock data for trailers and events since they're not in DataContext yet
  const mockTrailers = [
    { id: 'T001', status: 'at-terminal', year: 2020, make: 'Great Dane', model: 'Dry Van', licensePlate: 'TRL001', assignedTruckId: undefined },
    { id: 'T002', status: 'in-transit', year: 2019, make: 'Utility', model: 'Reefer', licensePlate: 'TRL002', assignedTruckId: 'T001' },
    { id: 'T003', status: 'out-of-service', year: 2018, make: 'Wabash', model: 'Dry Van', licensePlate: 'TRL003', assignedTruckId: undefined },
    { id: 'T004', status: 'dedicated', year: 2021, make: 'Great Dane', model: 'Flatbed', licensePlate: 'TRL004', assignedTruckId: 'T002' }
  ];

  const mockEvents = [
    {
      id: 'E001',
      loadId: 'L001',
      type: 'delay',
      description: 'Traffic delay on I-95',
      timestamp: new Date(),
      reportedBy: 'D001',
      severity: 'low',
      resolved: true
    },
    {
      id: 'E002',
      loadId: 'L002',
      type: 'inspection',
      description: 'DOT inspection passed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reportedBy: 'D002',
      severity: 'low',
      resolved: true
    }
  ];
    // State management
  const [reportData, setReportData] = useState<LSWReportData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [reportStatus, setReportStatus] = useState<ReportStatus>(ReportStatus.DRAFT);
  const [notes, setNotes] = useState('');
  const [isLateSubmission, setIsLateSubmission] = useState(false);
  const [notifications, setNotifications] = useState<ReportNotification[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const currentDate = new Date();
  const isReportOverdue = currentDate.getHours() >= 10 && currentDate.getMinutes() >= 30;
  const terminalId = 'terminal-1'; // This would come from user context

  // Initialize notifications and check permission
  useEffect(() => {
    const initializeNotifications = async () => {
      const hasPermission = await lswNotificationService.requestNotificationPermission();
      setNotificationsEnabled(hasPermission);
      
      if (hasPermission) {
        lswNotificationService.initializeDailySchedule(terminalId);
      }
      
      // Load existing notifications
      const existingNotifications = lswNotificationService.getNotifications(terminalId);
      setNotifications(existingNotifications);
    };

    initializeNotifications();

    // Listen for new notifications
    const handleNotification = (event: CustomEvent<ReportNotification>) => {
      setNotifications(prev => [...prev, event.detail]);
    };

    window.addEventListener('lsw-notification', handleNotification as EventListener);

    return () => {
      window.removeEventListener('lsw-notification', handleNotification as EventListener);
    };
  }, [terminalId]);  // Initialize report data
  useEffect(() => {
    if (reportId) {
      // Load existing report
      loadExistingReport(reportId);
    } else {
      // Generate new report with current data
      generateReportData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId, drivers, trucks, loads]);

  const loadExistingReport = async (id: string) => {
    // TODO: Load from API/storage
    // For now, generate fresh data
    generateReportData();
  };
  const generateReportData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Filter today's events
    const todayEvents = mockEvents.filter((event: any) => {
      const eventDate = new Date(event.timestamp);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });    // Generate driver status summary
    const driverSummary = {
      present: drivers.filter(d => d.status === DriverStatus.ACTIVE).length,
      onLeave: drivers.filter(d => d.status === DriverStatus.ON_LEAVE).length,
      oos: drivers.filter(d => d.status === DriverStatus.TERMINATED).length, // Use TERMINATED for OOS
      training: drivers.filter(d => d.status === DriverStatus.IN_TRAINING).length,
      applications: drivers.filter(d => d.status === DriverStatus.INACTIVE).length, // Use INACTIVE for applications
      details: drivers.map(driver => ({
        driverId: driver.id,
        name: `${driver.firstName} ${driver.lastName}`,
        status: driver.status,
        assignedTruckId: driver.assignedTruckId,
        notes: ''
      }))
    };    // Generate truck status summary
    const truckSummary = {
      assigned: trucks.filter(t => t.status === TruckStatus.ASSIGNED).length,
      unseated: trucks.filter(t => t.status === TruckStatus.AVAILABLE).length,
      oos: trucks.filter(t => t.status === TruckStatus.OUT_OF_SERVICE || t.status === TruckStatus.MAINTENANCE).length,
      forSale: trucks.filter(t => t.status === TruckStatus.OUT_OF_SERVICE).length, // Use OUT_OF_SERVICE for for-sale
      details: trucks.map(truck => ({
        truckId: truck.id,
        identifier: `${truck.year} ${truck.make} ${truck.model} - ${truck.licensePlate}`,
        status: truck.status,
        assignedDriverId: truck.assignedDriverId,
        maintenanceNotes: truck.status === TruckStatus.MAINTENANCE ? 'Scheduled maintenance' : undefined,
        estimatedReturnDate: truck.status === TruckStatus.MAINTENANCE ? truck.nextMaintenanceDue : undefined
      }))
    };

    // Generate trailer status summary
    const trailerSummary = {
      atTerminal: mockTrailers.filter((t: any) => t.status === 'at-terminal').length,
      inTransit: mockTrailers.filter((t: any) => t.status === 'in-transit').length,
      oos: mockTrailers.filter((t: any) => t.status === 'out-of-service').length,
      dedicated: mockTrailers.filter((t: any) => t.status === 'dedicated').length,
      details: mockTrailers.map((trailer: any) => ({
        trailerId: trailer.id,
        identifier: `${trailer.year} ${trailer.make} ${trailer.model} - ${trailer.licensePlate}`,
        status: trailer.status,
        location: trailer.status === 'at-terminal' ? 'Terminal' : 'In Transit',
        assignedTruckId: trailer.assignedTruckId,
        notes: ''
      }))
    };

    // Generate load status summary
    const loadSummary = {
      pickedUp: loads.filter(l => l.status === LoadStatus.PICKED_UP).length,
      inTransit: loads.filter(l => l.status === LoadStatus.IN_TRANSIT).length,
      delivered: loads.filter(l => l.status === LoadStatus.DELIVERED).length,
      pending: loads.filter(l => l.status === LoadStatus.PENDING || l.status === LoadStatus.ASSIGNED).length,
      revenue: loads.filter(l => l.status === LoadStatus.DELIVERED).reduce((sum, load) => sum + (load.rate || 0), 0),
      details: loads.map(load => ({
        loadId: load.id,
        loadNumber: load.loadNumber,
        status: load.status,
        assignedDriverId: load.assignedDriverId,
        pickupLocation: `${load.pickupLocation.city}, ${load.pickupLocation.state}`,
        deliveryLocation: `${load.deliveryLocation.city}, ${load.deliveryLocation.state}`,
        estimatedDelivery: load.deliveryDate,
        rate: load.rate
      }))
    };

    // Generate outlook data
    const generateOutlook = (date: Date) => ({
      date,
      expectedPickups: loads.filter(l => {
        const pickupDate = new Date(l.pickupDate);
        pickupDate.setHours(0, 0, 0, 0);
        return pickupDate.getTime() === date.getTime();
      }).length,
      expectedDeliveries: loads.filter(l => {
        const deliveryDate = new Date(l.deliveryDate);
        deliveryDate.setHours(0, 0, 0, 0);
        return deliveryDate.getTime() === date.getTime();
      }).length,
      driversScheduled: driverSummary.present,
      trucksDeployed: truckSummary.assigned,
      estimatedRevenue: loads.filter(l => {
        const deliveryDate = new Date(l.deliveryDate);
        deliveryDate.setHours(0, 0, 0, 0);
        return deliveryDate.getTime() === date.getTime();
      }).reduce((sum, load) => sum + (load.rate || 0), 0),
      notes: '',
      concerns: [],
      opportunities: []
    });

    const newReportData: LSWReportData = {
      date: today.toISOString().split('T')[0],
      terminal: {
        id: 'terminal-1',
        name: 'Main Terminal',
        code: 'MT01'
      },
      drivers: driverSummary,
      trucks: truckSummary,
      trailers: trailerSummary,
      loads: loadSummary,
      events: todayEvents.map((event: any) => ({
        eventId: event.id,
        type: event.type,
        description: event.description,
        loadId: event.loadId,
        driverId: undefined, // Add this field to LoadEvent if needed
        severity: event.severity,
        timestamp: event.timestamp,
        resolved: event.resolved
      })),
      outlook: {
        today: generateOutlook(today),
        tomorrow: generateOutlook(tomorrow),
        yesterday: generateOutlook(yesterday)
      },
      compliance: {
        dotInspections: {
          scheduled: 2,
          completed: 1,
          violations: 0
        },
        driverCompliance: {
          hosViolations: 0,
          medicalCertsExpiring: drivers.filter(d => {
            // Check if medical cert expires within 30 days
            // This would require adding medicalCertExpiry to Driver interface
            return false;
          }).length,
          licenseExpirations: drivers.filter(d => {
            const expiryDate = new Date(d.licenseExpiry);
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            return expiryDate <= thirtyDaysFromNow;
          }).length
        },
        vehicleCompliance: {
          maintenanceOverdue: trucks.filter(t => {
            const nextMaintenance = new Date(t.nextMaintenanceDue);
            return nextMaintenance <= new Date();
          }).length,
          registrationExpirations: trucks.filter(t => {
            const expiryDate = new Date(t.registrationExpiry);
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            return expiryDate <= thirtyDaysFromNow;
          }).length,
          insuranceExpirations: trucks.filter(t => {
            const expiryDate = new Date(t.insuranceExpiry);
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            return expiryDate <= thirtyDaysFromNow;
          }).length
        },
        safetyIncidents: {
          accidents: todayEvents.filter((e: any) => e.type === 'accident').length,
          nearMisses: 0, // Would need to add this event type
          spills: todayEvents.filter((e: any) => e.type === 'spill').length
        }
      },
      notes: notes,
      attachments: []
    };

    setReportData(newReportData);
    setIsLateSubmission(isReportOverdue);
  };

  const handleSaveReport = async () => {
    if (!reportData) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Save to API/storage
      console.log('Saving report...', reportData);
      setLastSaved(new Date());
      setReportStatus(ReportStatus.DRAFT);
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmitReport = async () => {
    if (!reportData) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Submit to API/storage
      console.log('Submitting report...', reportData);
      setReportStatus(ReportStatus.SUBMITTED);
      setLastSaved(new Date());
      
      // Mark report as submitted in notification service
      const reportDate = new Date(reportData.date);
      lswNotificationService.markReportSubmitted(terminalId, reportDate);
      
      // Show success message and redirect
      alert('Daily status report submitted successfully!');
      router.push('/reports');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const hasPermission = await lswNotificationService.requestNotificationPermission();
      if (hasPermission) {
        setNotificationsEnabled(true);
        lswNotificationService.initializeDailySchedule(terminalId);
      } else {
        alert('Notification permission denied. Please enable notifications in your browser settings.');
      }
    } else {
      setNotificationsEnabled(false);
      // Note: We can't actually disable browser notifications, but we can stop scheduling new ones
    }
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    if (reportData) {
      setReportData({
        ...reportData,
        notes: newNotes
      });
    }
  };

  if (!reportData) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-gray-600">Loading report data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              LSW Daily Status Report
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(reportData.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {reportData.terminal.name} ({reportData.terminal.code})
              </div>
              <Badge variant="status" status={reportStatus}>
                {reportStatus.replace('-', ' ').toUpperCase()}
              </Badge>
              {isLateSubmission && (
                <Badge variant="status" status="oos">
                  LATE SUBMISSION
                </Badge>
              )}
            </div>
          </div>
        </div>
          <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={toggleNotifications}
            className="flex items-center gap-2"
          >
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveReport}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            onClick={handleSubmitReport}
            disabled={isSubmitting || reportStatus === ReportStatus.SUBMITTED}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      {lastSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {isLateSubmission && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">
              This report is being submitted after the 09:30 deadline. Late submission noted.
            </span>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Recent Notifications
              {notifications.filter(n => !n.acknowledged).length > 0 && (
                <Badge variant="status" status="pending">
                  {notifications.filter(n => !n.acknowledged).length} New
                </Badge>
              )}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {notifications.slice(-5).reverse().map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border ${
                    notification.acknowledged ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm ${notification.acknowledged ? 'text-gray-600' : 'text-blue-800'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.sentAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          lswNotificationService.acknowledgeNotification(notification.id);
                          setNotifications(prev => 
                            prev.map(n => n.id === notification.id ? {...n, acknowledged: true, acknowledgedAt: new Date()} : n)
                          );
                        }}
                        className="ml-2 text-xs"
                      >
                        Dismiss
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Status Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Driver Status */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Driver Status
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Present</span>
                <Badge variant="status" status="active">{reportData.drivers.present}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Training</span>
                <Badge variant="status" status="in-training">{reportData.drivers.training}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">On Leave</span>
                <Badge variant="default">{reportData.drivers.onLeave}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Out of Service</span>
                <Badge variant="status" status="oos">{reportData.drivers.oos}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Applications</span>
                <Badge variant="default">{reportData.drivers.applications}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Truck Status */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              Truck Status
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assigned</span>
                <Badge variant="status" status="in-use">{reportData.trucks.assigned}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unseated</span>
                <Badge variant="default">{reportData.trucks.unseated}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Out of Service</span>
                <Badge variant="status" status="maintenance">{reportData.trucks.oos}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">For Sale</span>
                <Badge variant="default">{reportData.trucks.forSale}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Load Summary */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Load Summary
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Picked Up</span>
                <Badge variant="status" status="in-transit">{reportData.loads.pickedUp}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Transit</span>
                <Badge variant="status" status="in-transit">{reportData.loads.inTransit}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivered</span>
                <Badge variant="status" status="delivered">{reportData.loads.delivered}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <Badge variant="status" status="pending">{reportData.loads.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <Badge variant="status" status="delivered">
                  ${reportData.loads.revenue.toLocaleString()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Safety */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Compliance & Safety
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">HOS Violations</span>
                <Badge variant={reportData.compliance.driverCompliance.hosViolations > 0 ? "status" : "default"} 
                       status={reportData.compliance.driverCompliance.hosViolations > 0 ? "oos" : undefined}>
                  {reportData.compliance.driverCompliance.hosViolations}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Safety Incidents</span>
                <Badge variant={reportData.compliance.safetyIncidents.accidents > 0 ? "status" : "default"}
                       status={reportData.compliance.safetyIncidents.accidents > 0 ? "oos" : undefined}>
                  {reportData.compliance.safetyIncidents.accidents}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Licenses Expiring</span>
                <Badge variant={reportData.compliance.driverCompliance.licenseExpirations > 0 ? "status" : "default"}
                       status={reportData.compliance.driverCompliance.licenseExpirations > 0 ? "oos" : undefined}>
                  {reportData.compliance.driverCompliance.licenseExpirations}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overdue Maintenance</span>
                <Badge variant={reportData.compliance.vehicleCompliance.maintenanceOverdue > 0 ? "status" : "default"}
                       status={reportData.compliance.vehicleCompliance.maintenanceOverdue > 0 ? "oos" : undefined}>
                  {reportData.compliance.vehicleCompliance.maintenanceOverdue}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Events */}
      {reportData.events.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Today&apos;s Events & Incidents
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.events.map((event) => (
                <div key={event.eventId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${
                      event.severity === EventSeverity.CRITICAL ? 'text-red-600' :
                      event.severity === EventSeverity.HIGH ? 'text-orange-600' :
                      event.severity === EventSeverity.MEDIUM ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{event.type.toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="status" status={event.severity === EventSeverity.CRITICAL ? "oos" : 
                                                    event.severity === EventSeverity.HIGH ? "maintenance" :
                                                    "pending"}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    {event.resolved && (
                      <Badge variant="status" status="delivered">
                        RESOLVED
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outlook Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Yesterday */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Yesterday Summary
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pickups</span>
                <Badge variant="default">{reportData.outlook.yesterday.expectedPickups}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Deliveries</span>
                <Badge variant="default">{reportData.outlook.yesterday.expectedDeliveries}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <Badge variant="default">${reportData.outlook.yesterday.estimatedRevenue.toLocaleString()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Today&apos;s Outlook
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expected Pickups</span>
                <Badge variant="status" status="pending">{reportData.outlook.today.expectedPickups}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expected Deliveries</span>
                <Badge variant="status" status="delivered">{reportData.outlook.today.expectedDeliveries}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Drivers Scheduled</span>
                <Badge variant="status" status="active">{reportData.outlook.today.driversScheduled}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trucks Deployed</span>
                <Badge variant="status" status="in-use">{reportData.outlook.today.trucksDeployed}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Est. Revenue</span>
                <Badge variant="status" status="delivered">${reportData.outlook.today.estimatedRevenue.toLocaleString()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tomorrow */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Tomorrow&apos;s Outlook
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expected Pickups</span>
                <Badge variant="default">{reportData.outlook.tomorrow.expectedPickups}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expected Deliveries</span>
                <Badge variant="default">{reportData.outlook.tomorrow.expectedDeliveries}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Est. Revenue</span>
                <Badge variant="default">${reportData.outlook.tomorrow.estimatedRevenue.toLocaleString()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-purple-600" />
            Report Notes & Comments
          </h3>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add any additional notes, concerns, or observations for today's operations..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={reportStatus === ReportStatus.SUBMITTED}
          />
          <p className="text-xs text-gray-500 mt-2">
            Include any operational challenges, staffing changes, equipment issues, or other relevant information.
          </p>
        </CardContent>
      </Card>

      {/* Submit Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Report Requirements:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Daily reports must be submitted NLT 09:30 each day</li>
                <li>Reports can be edited throughout the day until submitted</li>
                <li>Late submissions are automatically flagged</li>
                <li>Automatic reminders sent at 09:00, 09:15, 09:30, and 10:00</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleSaveReport}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmitReport}
                disabled={isSubmitting || reportStatus === ReportStatus.SUBMITTED}
                className="flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
