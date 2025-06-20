/**
 * Launch Transportation Management Platform - Type Definitions
 * Copyright (c) 2025 Robert Vassallo. All rights reserved.
 * This software is proprietary and confidential.
 */

// Core data types for the Launch transportation management application

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseExpiry: Date;
  phoneNumber: string;
  email?: string;
  address?: string;
  fuelCard: string;
  assignedTruckId?: string;
  status: DriverStatus;
  hireDate: Date;
  // Training information
  trainingStatus?: TrainingStatus;
  trainingStartDate?: Date;
  trainingCompletionDate?: Date;
  trainingSupervisorId?: string;
  trainingNotes?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  // ORGANIZATIONAL CONTEXT
  organizationalContext: OrganizationalContext;
  homeTerminalId?: string;
  supervisorId?: string;
  accessLevel: PermissionScope;
  // API metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Truck {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  assignedDriverId?: string;
  status: TruckStatus;
  mileage: number;
  lastMaintenance: Date;
  nextMaintenanceDue: Date;  registrationExpiry: Date;  insuranceExpiry: Date;
  maintenanceNotes?: string;
  currentLoad?: string; // Current load ID
  // ORGANIZATIONAL CONTEXT
  organizationalContext: OrganizationalContext;
  homeTerminalId?: string;
  assignedTerminalId?: string;
  // API metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Load {
  id: string;
  loadNumber: string;
  bolNumber: string; // Bill of Lading number
  shipper: string;   // Shipper company name
  receiver?: string; // Receiver company name
  pickupLocation: Location;
  deliveryLocation: Location;
  assignedDriverId?: string;
  assignedTruckId?: string;
  status: LoadStatus;
  cargoDescription: string;  weight: number; // in pounds
  distance?: number; // in miles
  origin?: string; // Origin address string
  destination?: string; // Destination address string
  estimatedTransitTime?: number; // in hours
  pickupDate: Date;
  deliveryDate: Date;  rate: number;  notes?: string;
  specialInstructions?: string;
  hazmat?: boolean;
  events: LoadEvent[]; // Historic events (spills, contamination, NCR, etc.)
  createdAt: Date;
  updatedAt: Date;
  // ORGANIZATIONAL CONTEXT
  organizationalContext: OrganizationalContext;
  originTerminalId?: string;
  destinationTerminalId?: string;
  customerId?: string;
  dispatchedBy?: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LoadEvent {
  id: string;
  loadId: string;
  type: LoadEventType;
  description: string;
  timestamp: Date;
  location?: Location;
  reportedBy: string;
  severity: EventSeverity;
  resolved: boolean;
  resolvedAt?: Date;
  notes?: string;
}

export interface Trailer {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;  // Maps to trailer_number in backend
  vin: string;
  type: TrailerType;
  capacity: number; // in pounds
  length: number; // in feet
  assignedTruckId?: string;
  status: TrailerStatus;
  lastMaintenance: Date;
  nextMaintenanceDue: Date;
  registrationExpiry: Date;
  insuranceExpiry?: Date;
  // ORGANIZATIONAL CONTEXT
  organizationalContext: OrganizationalContext;
  // API metadata
  createdAt: Date;
  updatedAt: Date;
}

// Status Enums
export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive', 
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  IN_TRAINING = 'in_training'
}

export enum TrainingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SUSPENDED = 'suspended'
}

export enum TruckStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum LoadStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked-up',
  IN_TRANSIT = 'in-transit',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum LoadEventType {
  SPILL = 'spill',
  CONTAMINATION = 'contamination',
  NCR = 'ncr', // Non-Conformance Report
  ACCIDENT = 'accident',
  DELAY = 'delay',
  DAMAGE = 'damage',
  INSPECTION = 'inspection',
  OTHER = 'other'
}

export enum EventSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TrailerStatus {
  AT_TERMINAL = 'at-terminal',
  IN_TRANSIT = 'in-transit',
  OUT_OF_SERVICE = 'out-of-service',
  DEDICATED = 'dedicated'
}

export enum TrailerType {
  DRY_VAN = 'dry-van',
  FLATBED = 'flatbed',
  REFRIGERATED = 'refrigerated',
  HOPPER = 'hopper',
  TANKER = 'tanker',
  LOWBOY = 'lowboy',
  STEP_DECK = 'step-deck',
  CONTAINER = 'container',
  OTHER = 'other'
}

// UI Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  active?: boolean;
}

// Form and UI Types
export interface FormError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: FormError[];
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  assignedDriver?: string;
  assignedTruck?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

// ===== ORGANIZATIONAL HIERARCHY TYPES =====
export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  parentId?: string; // For hierarchical structure
  code: string; // Unique identifier/abbreviation
  address?: Location;
  contactInfo: ContactInfo;
  settings: OrganizationSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company extends Organization {
  type: OrganizationType.COMPANY;
  taxId: string;
  licenseNumbers: string[];
  industryType: string;
  timezone: string;
  operatingHours: OperatingHours;
}

export interface Division extends Organization {
  type: OrganizationType.DIVISION;
  companyId: string;
  region: string;
  manager: UserReference;
}

export interface Department extends Organization {
  type: OrganizationType.DEPARTMENT;
  divisionId: string;
  companyId: string;
  function: DepartmentFunction;
  supervisor: UserReference;
}

export interface Terminal extends Organization {
  type: OrganizationType.TERMINAL;
  departmentId: string;
  divisionId: string;
  companyId: string;
  terminalCode: string;
  dockCount: number;
  capacity: TerminalCapacity;
  operationalStatus: TerminalStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// ===== USER MANAGEMENT & ROLES =====
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  organizationAccess: OrganizationAccess[];
  currentOrganizationId: string; // Active organization context
  roles: UserRole[];
  permissions: Permission[];
  preferences: UserPreferences;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationAccess {
  organizationId: string;
  organizationType: OrganizationType;
  roles: UserRole[];
  permissions: Permission[];
  isDefault: boolean;
  assignedAt: Date;
  assignedBy: string;
}

export interface UserRole {
  id: string;
  name: string;
  code: string;
  description: string;
  level: RoleLevel;
  organizationType?: OrganizationType[];
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: ResourceType;
  actions: ActionType[];
  scope: PermissionScope;
}

// ===== ORGANIZATIONAL CONTEXT FOR EXISTING ENTITIES =====
export interface OrganizationalContext {
  companyId: string;
  divisionId?: string;
  departmentId?: string;
  terminalId?: string;
}

// ===== NEW ORGANIZATIONAL ENUMS =====
export enum OrganizationType {
  COMPANY = 'company',
  DIVISION = 'division',
  DEPARTMENT = 'department',
  TERMINAL = 'terminal'
}

export enum DepartmentFunction {
  OPERATIONS = 'operations',
  MAINTENANCE = 'maintenance',
  DISPATCH = 'dispatch',
  SAFETY = 'safety',
  HR = 'hr',
  FINANCE = 'finance',
  SALES = 'sales',
  ADMIN = 'admin'
}

export enum TerminalStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed',
  LIMITED = 'limited'
}

export enum RoleLevel {
  SYSTEM_ADMIN = 'system_admin',
  COMPANY_ADMIN = 'company_admin',
  DIVISION_MANAGER = 'division_manager',
  DEPARTMENT_SUPERVISOR = 'department_supervisor',
  TERMINAL_MANAGER = 'terminal_manager',
  DISPATCHER = 'dispatcher',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

export enum ResourceType {
  DRIVERS = 'drivers',
  TRUCKS = 'trucks',
  TRAILERS = 'trailers',
  LOADS = 'loads',
  MAINTENANCE = 'maintenance',
  REPORTS = 'reports',
  USERS = 'users',
  SETTINGS = 'settings',
  BILLING = 'billing'
}

export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  ASSIGN = 'assign',
  EXPORT = 'export',
  IMPORT = 'import'
}

export enum PermissionScope {
  OWN = 'own', // Only own records
  TERMINAL = 'terminal', // Terminal level
  DEPARTMENT = 'department', // Department level
  DIVISION = 'division', // Division level
  COMPANY = 'company', // Company level
  SYSTEM = 'system' // System wide
}

// ===== SUPPORTING INTERFACES =====
export interface ContactInfo {
  email: string;
  phone: string;
  address: Location;
  website?: string;
}

export interface OrganizationSettings {
  branding: BrandingSettings;
  operational: OperationalSettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
}

export interface BrandingSettings {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export interface OperationalSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: '12' | '24';
  currency: string;
  weightUnit: 'lbs' | 'kg';
  distanceUnit: 'miles' | 'km';
  defaultLoadCapacity: number;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  maintenanceAlerts: boolean;
  loadStatusUpdates: boolean;
  emergencyAlerts: boolean;
}

export interface IntegrationSettings {
  gpsProvider?: string;
  eldProvider?: string;
  accountingSystem?: string;
  dispatchSystem?: string;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:mm format
  closeTime?: string; // HH:mm format
}

export interface TerminalCapacity {
  maxTrucks: number;
  maxTrailers: number;
  loadingBays: number;
  parkingSpaces: number;
}

export interface UserReference {
  userId: string;
  name: string;
  role: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: 'grid' | 'list';
    refreshInterval: number;
    showWeather: boolean;
  };
}

// ===== UPDATED EXISTING INTERFACES WITH ORGANIZATIONAL CONTEXT =====
export interface DriverWithContext extends Driver {
  organizationalContext: OrganizationalContext;
  homeTerminalId?: string;
  supervisorId?: string;
  accessLevel: PermissionScope;
}

export interface TruckWithContext extends Truck {
  organizationalContext: OrganizationalContext;
  homeTerminalId?: string;
  assignedTerminalId?: string;
}

export interface LoadWithContext extends Load {
  organizationalContext: OrganizationalContext;
  originTerminalId?: string;
  destinationTerminalId?: string;
  customerId?: string;
  dispatchedBy?: string;
}

// ===== LSW DAILY REPORTING SYSTEM =====
export interface DailyReport {
  id: string;
  date: string; // YYYY-MM-DD format
  submissionTime?: Date;
  submittedBy?: string;
  status: 'draft' | 'submitted' | 'overdue' | 'cancelled';
  dueTime: string; // HH:mm format (default: 09:30)
  
  // Core operational data
  driversPresent: number;
  driversOnLeave: number;
  driversOOS: number;
  driversInTraining: number;
  driversApplications: number;
  
  trucksAssigned: number;
  trucksUnseated: number;
  trucksOOS: number;
  trucksForSale: number;
  
  trailersAtTerminal: number;
  trailersInTransit: number;
  trailersOOS: number;
  trailersDedicated: number;
  
  loadsPickedUp: number;
  loadsInTransit: number;
  loadsDelivered: number;
  loadsPending: number;
  
  // Event and compliance tracking
  eventsReported: LoadEvent[];
  complianceIssues: string[];
  insuranceClaims: string[];
  
  // Outlook and forecasting
  todaysOutlook: string;
  tomorrowsForecast: string;
  yesterdaysEventsSummary: string;
  
  // Additional notes
  notes?: string;
  attachments?: string[];
  
  // Metadata
  lastModified: Date;
  autoSavedAt?: Date;
  submissionHistory: ReportSubmissionHistory[];
}

export interface ReportSubmissionHistory {
  timestamp: Date;
  action: 'created' | 'updated' | 'submitted' | 'auto-saved' | 'reminder-sent';
  userId?: string;
  notes?: string;
}

export interface DailyReportTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  sections: ReportSection[];
  dueTime: string;
  reminderTimes: string[]; // HH:mm format
  notificationConfig: NotificationConfig;
}

export interface ReportSection {
  id: string;
  title: string;
  fields: ReportField[];
  required: boolean;
  order: number;
}

export interface ReportField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'textarea' | 'select' | 'multi-select' | 'date' | 'time';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface NotificationConfig {
  enabled: boolean;
  channels: ('email' | 'sms' | 'push')[];
  recipients: string[];
  reminderTimes: string[]; // e.g., ['09:00', '09:15', '09:30', '10:00']
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  delayMinutes: number;
  action: 'remind' | 'escalate' | 'auto-submit';
  recipients?: string[];
  message?: string;
}

export interface ReportMetrics {
  totalReports: number;
  submittedOnTime: number;
  submittedLate: number;
  overdue: number;
  averageSubmissionTime: string; // HH:mm format
  complianceRate: number; // percentage
  lastSevenDays: DailyReportSummary[];
}

export interface DailyReportSummary {
  date: string;
  status: 'submitted' | 'late' | 'overdue' | 'pending';
  submissionTime?: string;
  driversPresent: number;
  trucksActive: number;
  loadsCompleted: number;
  eventsCount: number;
}

// Report generation and analysis
export interface ReportAnalytics {
  trends: {
    drivers: TrendData;
    trucks: TrendData;
    loads: TrendData;
    events: TrendData;
  };
  alerts: ReportAlert[];
  insights: string[];
  recommendations: string[];
}

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ReportAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  category: 'compliance' | 'operational' | 'safety' | 'performance';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

// ===== LSW DAILY STATUS REPORT TYPES =====
export interface DailyStatusReport {
  id: string;
  reportDate: Date;
  terminalId: string;
  submittedBy: string;
  submittedAt: Date;
  status: ReportStatus;
  reportData: LSWReportData;
  notifications: ReportNotification[];
  lastEditedAt?: Date;
  lastEditedBy?: string;
  isLateSubmission: boolean;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface ReportNotification {
  id: string;
  reportId: string;
  type: NotificationType;
  message: string;
  sentAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

export interface LSWReportData {
  date: string;
  terminal: {
    id: string;
    name: string;
    code: string;
  };
  drivers: {
    present: number;
    onLeave: number;
    oos: number;
    training: number;
    applications: number;
    details: DriverStatusDetail[];
  };
  trucks: {
    assigned: number;
    unseated: number;
    oos: number;
    forSale: number;
    details: TruckStatusDetail[];
  };
  trailers: {
    atTerminal: number;
    inTransit: number;
    oos: number;
    dedicated: number;
    details: TrailerStatusDetail[];
  };
  loads: {
    pickedUp: number;
    inTransit: number;
    delivered: number;
    pending: number;
    revenue: number;
    details: LoadStatusDetail[];
  };
  events: TodayEventSummary[];
  outlook: {
    today: OutlookSection;
    tomorrow: OutlookSection;
    yesterday: OutlookSection;
  };
  compliance: ComplianceSection;
  notes?: string;
  attachments?: ReportAttachment[];
}

export interface DriverStatusDetail {
  driverId: string;
  name: string;
  status: DriverStatus;
  assignedTruckId?: string;
  notes?: string;
}

export interface TruckStatusDetail {
  truckId: string;
  identifier: string;
  status: TruckStatus;
  assignedDriverId?: string;
  maintenanceNotes?: string;
  estimatedReturnDate?: Date;
}

export interface TrailerStatusDetail {
  trailerId: string;
  identifier: string;
  status: TrailerStatus;
  location?: string;
  assignedTruckId?: string;
  notes?: string;
}

export interface LoadStatusDetail {
  loadId: string;
  loadNumber: string;
  status: LoadStatus;
  assignedDriverId?: string;
  pickupLocation: string;
  deliveryLocation: string;
  estimatedDelivery?: Date;
  rate: number;
}

export interface TodayEventSummary {
  eventId: string;
  type: LoadEventType;
  description: string;
  loadId?: string;
  driverId?: string;
  severity: EventSeverity;
  timestamp: Date;
  resolved: boolean;
}

export interface OutlookSection {
  date: Date;
  expectedPickups: number;
  expectedDeliveries: number;
  driversScheduled: number;
  trucksDeployed: number;
  estimatedRevenue: number;
  notes: string;
  concerns?: string[];
  opportunities?: string[];
}

export interface ComplianceSection {
  dotInspections: {
    scheduled: number;
    completed: number;
    violations: number;
  };
  driverCompliance: {
    hosViolations: number;
    medicalCertsExpiring: number;
    licenseExpirations: number;
  };
  vehicleCompliance: {
    maintenanceOverdue: number;
    registrationExpirations: number;
    insuranceExpirations: number;
  };
  safetyIncidents: {
    accidents: number;
    nearMisses: number;
    spills: number;
  };
}

export interface ReportAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
  purpose: AttachmentPurpose;
}

export enum ReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  OVERDUE = 'overdue'
}

export enum NotificationType {
  REMINDER_09_00 = 'reminder-09-00',
  REMINDER_09_15 = 'reminder-09-15',
  REMINDER_09_30 = 'reminder-09-30',
  OVERDUE_10_00 = 'overdue-10-00',
  SUBMISSION_CONFIRMED = 'submission-confirmed',
  APPROVAL_REQUIRED = 'approval-required',
  REPORT_APPROVED = 'report-approved',
  REPORT_REJECTED = 'report-rejected'
}

export enum AttachmentPurpose {
  INCIDENT_DOCUMENTATION = 'incident-documentation',
  MAINTENANCE_RECORD = 'maintenance-record',
  COMPLIANCE_DOCUMENT = 'compliance-document',
  DRIVER_DOCUMENTATION = 'driver-documentation',
  LOAD_DOCUMENTATION = 'load-documentation',
  OTHER = 'other'
}

// ===== EXISTING LSW TYPES (UPDATED) =====
// Updated existing LSWReportData interface is now above with more comprehensive structure
