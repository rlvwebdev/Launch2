// Core data types for the TMOps trucking management application

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseExpiry: Date;
  phoneNumber: string;
  email: string;
  assignedTruckId?: string;
  status: DriverStatus;
  hireDate: Date;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
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
  nextMaintenanceDue: Date;
  registrationExpiry: Date;
  insuranceExpiry: Date;
}

export interface Load {
  id: string;
  loadNumber: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  assignedDriverId?: string;
  assignedTruckId?: string;
  status: LoadStatus;
  cargoDescription: string;
  weight: number; // in pounds
  pickupDate: Date;
  deliveryDate: Date;
  rate: number;
  notes?: string;
  events: LoadEvent[]; // Historic events (spills, contamination, NCR, etc.)
  createdAt: Date;
  updatedAt: Date;
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

// Status Enums
export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_BREAK = 'on-break'
}

export enum TruckStatus {
  AVAILABLE = 'available',
  IN_USE = 'in-use',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out-of-service'
}

export enum LoadStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked-up',
  IN_TRANSIT = 'in-transit',
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
