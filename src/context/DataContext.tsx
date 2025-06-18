// Data context for managing application state
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Driver, Truck, Load, DriverStatus, TruckStatus, LoadStatus, LoadEventType, EventSeverity } from '@/types';

interface DataContextType {
  drivers: Driver[];
  trucks: Truck[];
  loads: Load[];
  setDrivers: (drivers: Driver[]) => void;
  setTrucks: (trucks: Truck[]) => void;
  setLoads: (loads: Load[]) => void;
  addDrivers: (newDrivers: Driver[]) => void;
  addTrucks: (newTrucks: Truck[]) => void;
  addLoads: (newLoads: Load[]) => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initial mock data - we'll import the existing mock data here
const initialDrivers: Driver[] = [
  {
    id: 'D001',
    firstName: 'John',
    lastName: 'Smith',
    licenseNumber: 'CDL123456',
    licenseExpiry: new Date('2025-12-31'),
    phoneNumber: '(555) 123-4567',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    fuelCard: 'FC001',
    assignedTruckId: 'T001',
    status: DriverStatus.ACTIVE,
    hireDate: new Date('2023-01-15')
  },
  // Add more initial drivers as needed
];

const initialTrucks: Truck[] = [
  {
    id: 'T001',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2022,
    licensePlate: 'TRK-2812',
    vin: '1FUJGBDV1NLAA1234',
    color: 'White',
    assignedDriverId: 'D001',
    status: TruckStatus.IN_USE,
    mileage: 45000,
    lastMaintenance: new Date('2024-05-15'),
    nextMaintenanceDue: new Date('2024-08-15'),
    registrationExpiry: new Date('2025-06-30'),
    insuranceExpiry: new Date('2025-03-31')
  },
  // Add more initial trucks as needed
];

const initialLoads: Load[] = [
  {
    id: 'L001',
    loadNumber: 'LD250001',
    bolNumber: 'BOL123456',
    shipper: 'ABC Manufacturing',
    pickupLocation: {
      address: '123 Industrial Blvd',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001'
    },
    deliveryLocation: {
      address: '456 Warehouse St',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201'
    },
    assignedDriverId: 'D001',
    assignedTruckId: 'T001',
    status: LoadStatus.IN_TRANSIT,
    cargoDescription: 'Steel coils',
    weight: 42000,
    pickupDate: new Date(),
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    rate: 2500,
    events: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'L002',
    loadNumber: 'LD250002',
    bolNumber: 'BOL234567',
    shipper: 'XYZ Logistics',
    pickupLocation: {
      address: '789 Factory Ave',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301'
    },
    deliveryLocation: {
      address: '321 Distribution Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    },
    assignedDriverId: undefined,
    assignedTruckId: undefined,
    status: LoadStatus.PENDING,
    cargoDescription: 'Electronics',
    weight: 28000,
    pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    rate: 3200,
    events: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'L003',
    loadNumber: 'LD250003',
    bolNumber: 'BOL345678',
    shipper: 'Global Supply Co',
    pickupLocation: {
      address: '555 Port Rd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    deliveryLocation: {
      address: '777 Commerce St',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001'
    },
    assignedDriverId: 'D001',
    assignedTruckId: 'T001',
    status: LoadStatus.PICKED_UP,
    cargoDescription: 'Auto parts',
    weight: 35000,
    pickupDate: new Date(),
    deliveryDate: new Date(),
    rate: 1800,
    events: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'L004',
    loadNumber: 'LD250004',
    bolNumber: 'BOL456789',
    shipper: 'Prime Materials',
    pickupLocation: {
      address: '111 Cargo Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    deliveryLocation: {
      address: '999 Delivery Way',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201'
    },
    assignedDriverId: undefined,
    assignedTruckId: undefined,
    status: LoadStatus.ASSIGNED,
    cargoDescription: 'Machinery',
    weight: 48000,
    pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    rate: 2200,
    events: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'L005',
    loadNumber: 'LD250005',
    bolNumber: 'BOL567890',
    shipper: 'Fresh Foods Inc',
    pickupLocation: {
      address: '222 Farm Rd',
      city: 'Fresno',
      state: 'CA',
      zipCode: '93701'
    },
    deliveryLocation: {
      address: '888 Market St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    assignedDriverId: undefined,
    assignedTruckId: undefined,
    status: LoadStatus.PENDING,
    cargoDescription: 'Produce',
    weight: 25000,
    pickupDate: new Date(),
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    rate: 2800,
    events: [
      {
        id: 'E001',
        loadId: 'L005',
        type: LoadEventType.DELAY,
        description: 'Weather delay at pickup location',
        timestamp: new Date(),
        reportedBy: 'dispatch',
        severity: EventSeverity.MEDIUM,
        resolved: false,
        resolvedAt: undefined
      }
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'L006',
    loadNumber: 'LD250006',
    bolNumber: 'BOL678901',
    shipper: 'Tech Solutions Corp',
    pickupLocation: {
      address: '101 Innovation Dr',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    },
    deliveryLocation: {
      address: '202 Tech Park Blvd',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95101'
    },
    assignedDriverId: 'D001',
    assignedTruckId: 'T001',
    status: LoadStatus.DELIVERED,
    cargoDescription: 'Computer equipment',
    weight: 18000,
    pickupDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    rate: 3500,
    events: [],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 'L007',
    loadNumber: 'LD250007',
    bolNumber: 'BOL789012',
    shipper: 'Mountain Lumber Co',
    pickupLocation: {
      address: '500 Mill Rd',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201'
    },
    deliveryLocation: {
      address: '300 Construction Ave',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201'
    },
    assignedDriverId: undefined,
    assignedTruckId: undefined,
    status: LoadStatus.PENDING,
    cargoDescription: 'Lumber and building materials',
    weight: 44000,
    pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
    rate: 2400,
    events: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'L008',
    loadNumber: 'LD250008',
    bolNumber: 'BOL890123',
    shipper: 'Midwest Chemical',
    pickupLocation: {
      address: '700 Industrial Way',
      city: 'Cleveland',
      state: 'OH',
      zipCode: '44101'
    },
    deliveryLocation: {
      address: '800 Chemical Plant Rd',
      city: 'Buffalo',
      state: 'NY',
      zipCode: '14201'
    },
    assignedDriverId: 'D001',
    assignedTruckId: 'T001',
    status: LoadStatus.DELIVERING,
    cargoDescription: 'Chemical supplies',
    weight: 39000,
    pickupDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    deliveryDate: new Date(),
    rate: 2900,
    events: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [loads, setLoads] = useState<Load[]>(initialLoads);

  // Helper function to ensure dates are Date objects
  const convertDriverDates = (driver: Driver): Driver => ({
    ...driver,
    licenseExpiry: new Date(driver.licenseExpiry),
    hireDate: new Date(driver.hireDate)
  });

  const convertTruckDates = (truck: Truck): Truck => ({
    ...truck,
    lastMaintenance: new Date(truck.lastMaintenance),
    nextMaintenanceDue: new Date(truck.nextMaintenanceDue),
    registrationExpiry: new Date(truck.registrationExpiry),
    insuranceExpiry: new Date(truck.insuranceExpiry)
  });

  const convertLoadDates = (load: Load): Load => ({
    ...load,
    pickupDate: new Date(load.pickupDate),
    deliveryDate: new Date(load.deliveryDate),
    createdAt: new Date(load.createdAt),
    updatedAt: new Date(load.updatedAt),
    events: load.events.map(event => ({
      ...event,
      timestamp: new Date(event.timestamp),
      resolvedAt: event.resolvedAt ? new Date(event.resolvedAt) : undefined
    }))
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDrivers = localStorage.getItem('launch-drivers');
    const savedTrucks = localStorage.getItem('launch-trucks');
    const savedLoads = localStorage.getItem('launch-loads');

    if (savedDrivers) {
      try {
        const parsedDrivers = JSON.parse(savedDrivers);
        const driversWithDates = parsedDrivers.map(convertDriverDates);
        setDrivers(driversWithDates);
      } catch (error) {
        console.error('Error loading drivers from localStorage:', error);
      }
    }

    if (savedTrucks) {
      try {
        const parsedTrucks = JSON.parse(savedTrucks);
        const trucksWithDates = parsedTrucks.map(convertTruckDates);
        setTrucks(trucksWithDates);
      } catch (error) {
        console.error('Error loading trucks from localStorage:', error);
      }
    }

    if (savedLoads) {
      try {
        const parsedLoads = JSON.parse(savedLoads);
        const loadsWithDates = parsedLoads.map(convertLoadDates);
        setLoads(loadsWithDates);
      } catch (error) {
        console.error('Error loading loads from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('launch-drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('launch-trucks', JSON.stringify(trucks));
  }, [trucks]);

  useEffect(() => {
    localStorage.setItem('launch-loads', JSON.stringify(loads));
  }, [loads]);

  // Custom setters that ensure date conversion
  const setDriversWithDateConversion = (drivers: Driver[]) => {
    const driversWithDates = drivers.map(convertDriverDates);
    setDrivers(driversWithDates);
  };

  const setTrucksWithDateConversion = (trucks: Truck[]) => {
    const trucksWithDates = trucks.map(convertTruckDates);
    setTrucks(trucksWithDates);
  };

  const setLoadsWithDateConversion = (loads: Load[]) => {
    const loadsWithDates = loads.map(convertLoadDates);
    setLoads(loadsWithDates);
  };

  const addDrivers = (newDrivers: Driver[]) => {
    const driversWithDates = newDrivers.map(convertDriverDates);
    setDrivers(prev => [...prev, ...driversWithDates]);
  };

  const addTrucks = (newTrucks: Truck[]) => {
    const trucksWithDates = newTrucks.map(convertTruckDates);
    setTrucks(prev => [...prev, ...trucksWithDates]);
  };

  const addLoads = (newLoads: Load[]) => {
    const loadsWithDates = newLoads.map(convertLoadDates);
    setLoads(prev => [...prev, ...loadsWithDates]);
  };

  const clearAllData = () => {
    setDrivers([]);
    setTrucks([]);
    setLoads([]);
    localStorage.removeItem('launch-drivers');
    localStorage.removeItem('launch-trucks');
    localStorage.removeItem('launch-loads');
  };

  return (
    <DataContext.Provider
      value={{
        drivers,
        trucks,
        loads,
        setDrivers: setDriversWithDateConversion,
        setTrucks: setTrucksWithDateConversion,
        setLoads: setLoadsWithDateConversion,
        addDrivers,
        addTrucks,
        addLoads,
        clearAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
