# Data Models and Types

## TypeScript Type Definitions

### Driver Interface
```typescript
interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseExpiry: Date;
  phoneNumber: string;
  email: string;
  assignedTruckId?: string;
  status: 'active' | 'inactive' | 'on-break';
  hireDate: Date;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}
```

### Truck Interface
```typescript
interface Truck {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  assignedDriverId?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  mileage: number;
  lastMaintenance: Date;
  nextMaintenanceDue: Date;
  registrationExpiry: Date;
  insuranceExpiry: Date;
}
```

### Load Interface
```typescript
interface Load {
  id: string;
  loadNumber: string;
  pickupLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number; };
  };
  deliveryLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number; };
  };
  assignedDriverId?: string;
  assignedTruckId?: string;
  status: 'pending' | 'assigned' | 'picked-up' | 'in-transit' | 'delivered' | 'cancelled';
  cargoDescription: string;
  weight: number; // in pounds
  pickupDate: Date;
  deliveryDate: Date;
  rate: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Status Enums
```typescript
enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_BREAK = 'on-break'
}

enum TruckStatus {
  AVAILABLE = 'available',
  IN_USE = 'in-use',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out-of-service'
}

enum LoadStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked-up',
  IN_TRANSIT = 'in-transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
```
