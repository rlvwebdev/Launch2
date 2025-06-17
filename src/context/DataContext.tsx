// Data context for managing application state
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Driver, Truck, Load, DriverStatus, TruckStatus, LoadStatus } from '@/types';

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
    loadNumber: 'LD240001',
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
    pickupDate: new Date('2024-06-16'),
    deliveryDate: new Date('2024-06-17'),
    rate: 2500,
    events: [],
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-16')
  },
  // Add more initial loads as needed
];

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [loads, setLoads] = useState<Load[]>(initialLoads);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDrivers = localStorage.getItem('launch-drivers');
    const savedTrucks = localStorage.getItem('launch-trucks');
    const savedLoads = localStorage.getItem('launch-loads');

    if (savedDrivers) {
      try {
        setDrivers(JSON.parse(savedDrivers));
      } catch (error) {
        console.error('Error loading drivers from localStorage:', error);
      }
    }

    if (savedTrucks) {
      try {
        setTrucks(JSON.parse(savedTrucks));
      } catch (error) {
        console.error('Error loading trucks from localStorage:', error);
      }
    }

    if (savedLoads) {
      try {
        const parsedLoads = JSON.parse(savedLoads);
        // Convert date strings back to Date objects
        const loadsWithDates = parsedLoads.map((load: Load) => ({
          ...load,
          pickupDate: new Date(load.pickupDate),
          deliveryDate: new Date(load.deliveryDate),
          createdAt: new Date(load.createdAt),
          updatedAt: new Date(load.updatedAt)
        }));
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

  const addDrivers = (newDrivers: Driver[]) => {
    setDrivers(prev => [...prev, ...newDrivers]);
  };

  const addTrucks = (newTrucks: Truck[]) => {
    setTrucks(prev => [...prev, ...newTrucks]);
  };

  const addLoads = (newLoads: Load[]) => {
    setLoads(prev => [...prev, ...newLoads]);
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
        setDrivers,
        setTrucks,
        setLoads,
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
