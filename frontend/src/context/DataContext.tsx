/**
 * Launch Transportation Management Platform - Data Context
 * Copyright (c) 2024 Launch Transportation Management. All rights reserved.
 * 
 * This context manages application state and data fetching from the Django REST API backend.
 * It replaces the previous Excel/JSON-based data system with live API integration.
 */
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Driver, Truck, Trailer, Load, DriverStatus, TruckStatus, LoadStatus } from '@/types';
import { apiClient } from '@/lib/api-client';

interface DataContextType {
  // Data state
  drivers: Driver[];
  trucks: Truck[];
  trailers: Trailer[];
  loads: Load[];
  
  // Loading states
  loading: {
    drivers: boolean;
    trucks: boolean;
    trailers: boolean;
    loads: boolean;
  };
  
  // Error states
  errors: {
    drivers: string | null;
    trucks: string | null;
    trailers: string | null;
    loads: string | null;
  };
    // CRUD operations
  refreshData: () => Promise<void>;
  refreshDrivers: () => Promise<void>;
  refreshTrucks: () => Promise<void>;
  refreshTrailers: () => Promise<void>;
  refreshLoads: () => Promise<void>;
  
  // Driver operations
  createDriver: (driver: Omit<Driver, 'id'>) => Promise<Driver>;
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<Driver>;
  deleteDriver: (id: string) => Promise<void>;
  
  // Truck operations
  createTruck: (truck: Omit<Truck, 'id'>) => Promise<Truck>;
  updateTruck: (id: string, updates: Partial<Truck>) => Promise<Truck>;
  deleteTruck: (id: string) => Promise<void>;
  
  // Trailer operations
  createTrailer: (trailer: Omit<Trailer, 'id'>) => Promise<Trailer>;
  updateTrailer: (id: string, updates: Partial<Trailer>) => Promise<Trailer>;
  deleteTrailer: (id: string) => Promise<void>;
  
  // Load operations
  createLoad: (load: Omit<Load, 'id'>) => Promise<Load>;
  updateLoad: (id: string, updates: Partial<Load>) => Promise<Load>;
  deleteLoad: (id: string) => Promise<void>;
  
  // Organizational filtering methods
  getFilteredDrivers: (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => Driver[];
  getFilteredTrucks: (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => Truck[];
  getFilteredLoads: (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => Load[];
  
  // Utility methods
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

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {  // State management
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loads, setLoads] = useState<Load[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    drivers: false,
    trucks: false,
    trailers: false,
    loads: false,
  });
  
  // Error states
  const [errors, setErrors] = useState({
    drivers: null as string | null,
    trucks: null as string | null,
    trailers: null as string | null,
    loads: null as string | null,
  });

  // Helper function to update loading state
  const setLoadingState = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // Helper function to update error state
  const setErrorState = (key: keyof typeof errors, value: string | null) => {
    setErrors(prev => ({ ...prev, [key]: value }));  };
  
  // Data fetching functions
  const refreshDrivers = async () => {
    setLoadingState('drivers', true);
    setErrorState('drivers', null);
      try {
      console.log('🔄 Fetching drivers from API...');
      const driversResponse = await apiClient.getDrivers();
      console.log('📦 Raw drivers response:', driversResponse);
      // Handle paginated response
      const driversData = driversResponse.results || [];
      console.log('📊 Drivers data array:', driversData.length, 'items');
      
      // Convert date strings to Date objects to match TypeScript interface
      const processedDrivers = driversData.map((driver, index) => {
        try {
          return {
            ...driver,
            licenseExpiry: new Date(driver.licenseExpiry),
            hireDate: new Date(driver.hireDate),
            createdAt: new Date(driver.createdAt),
            updatedAt: new Date(driver.updatedAt),
          };
        } catch (dateError) {
          console.error(`❌ Error processing driver ${index}:`, driver, dateError);
          throw dateError;
        }
      });
      
      setDrivers(processedDrivers);
      console.log('✅ Successfully loaded', processedDrivers.length, 'drivers');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load drivers';
      console.error('❌ Error loading drivers:', error);
      setErrorState('drivers', errorMessage);
    } finally {
      setLoadingState('drivers', false);
    }
  };
  const refreshTrucks = async () => {
    setLoadingState('trucks', true);
    setErrorState('trucks', null);
      try {
      console.log('🔄 Fetching trucks from API...');
      const trucksResponse = await apiClient.getTrucks();
      console.log('📦 Raw trucks response:', trucksResponse);
      // Handle paginated response
      const trucksData = trucksResponse.results || [];
      console.log('📊 Trucks data array:', trucksData.length, 'items');
      
      // Convert date strings to Date objects to match TypeScript interface
      const processedTrucks = trucksData.map((truck, index) => {
        try {
          return {
            ...truck,
            lastMaintenance: truck.lastMaintenance ? new Date(truck.lastMaintenance) : new Date(),
            nextMaintenanceDue: truck.nextMaintenanceDue ? new Date(truck.nextMaintenanceDue) : new Date(),
            registrationExpiry: truck.registrationExpiry ? new Date(truck.registrationExpiry) : new Date(),
            insuranceExpiry: truck.insuranceExpiry ? new Date(truck.insuranceExpiry) : new Date(),
            createdAt: new Date(truck.createdAt),
            updatedAt: new Date(truck.updatedAt),
          };
        } catch (dateError) {
          console.error(`❌ Error processing truck ${index}:`, truck, dateError);
          throw dateError;
        }
      });
      
      setTrucks(processedTrucks);
      console.log('✅ Successfully loaded', processedTrucks.length, 'trucks');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load trucks';
      console.error('❌ Error loading trucks:', error);
      setErrorState('trucks', errorMessage);} finally {
      setLoadingState('trucks', false);
    }
  };

  const refreshTrailers = async () => {
    setLoadingState('trailers', true);
    setErrorState('trailers', null);
    
    try {
      console.log('🔄 Fetching trailers from API...');
      const trailersResponse = await apiClient.getTrailers();
      // Handle paginated response
      const trailersData = trailersResponse.results || [];
        // Convert date strings to Date objects to match TypeScript interface
      const processedTrailers = trailersData.map(trailer => ({
        ...trailer,
        lastMaintenance: trailer.lastMaintenance ? new Date(trailer.lastMaintenance) : new Date(),
        nextMaintenanceDue: trailer.nextMaintenanceDue ? new Date(trailer.nextMaintenanceDue) : new Date(),
        registrationExpiry: trailer.registrationExpiry ? new Date(trailer.registrationExpiry) : new Date(),
        insuranceExpiry: trailer.insuranceExpiry ? new Date(trailer.insuranceExpiry) : undefined,
        createdAt: new Date(trailer.createdAt),
        updatedAt: new Date(trailer.updatedAt),
      }));
      
      setTrailers(processedTrailers);
      console.log('✅ Successfully loaded', processedTrailers.length, 'trailers');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load trailers';
      console.error('❌ Error loading trailers:', errorMessage);
      setErrorState('trailers', errorMessage);
    } finally {
      setLoadingState('trailers', false);
    }
  };

  const refreshLoads = async () => {
    setLoadingState('loads', true);
    setErrorState('loads', null);
    
    try {
      console.log('🔄 Fetching loads from API...');
      const loadsResponse = await apiClient.getLoads();
      // Handle paginated response
      const loadsData = loadsResponse.results || [];
      
      // Convert date strings to Date objects to match TypeScript interface
      const processedLoads = loadsData.map(load => ({
        ...load,
        pickupDate: new Date(load.pickupDate),
        deliveryDate: new Date(load.deliveryDate),
        createdAt: new Date(load.createdAt),
        updatedAt: new Date(load.updatedAt),
      }));
      
      setLoads(processedLoads);
      console.log('✅ Successfully loaded', processedLoads.length, 'loads');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load loads';
      console.error('❌ Error loading loads:', errorMessage);
      setErrorState('loads', errorMessage);
    } finally {
      setLoadingState('loads', false);
    }
  };  const refreshData = async () => {
    console.log('🔄 Refreshing all data from API...');
    await Promise.all([
      refreshDrivers(),
      refreshTrucks(),
      refreshTrailers(),
      refreshLoads()
    ]);
    console.log('✅ All data refreshed');
  };

  // CRUD operations for drivers
  const createDriver = async (driverData: Omit<Driver, 'id'>): Promise<Driver> => {
    try {
      const newDriver = await apiClient.createDriver(driverData);
      setDrivers(prev => [...prev, newDriver]);
      return newDriver;
    } catch (error) {
      console.error('❌ Error creating driver:', error);
      throw error;
    }
  };

  const updateDriver = async (id: string, updates: Partial<Driver>): Promise<Driver> => {
    try {
      const updatedDriver = await apiClient.updateDriver(id, updates);
      setDrivers(prev => prev.map(driver => 
        driver.id === id ? updatedDriver : driver
      ));
      return updatedDriver;
    } catch (error) {
      console.error('❌ Error updating driver:', error);
      throw error;
    }
  };

  const deleteDriver = async (id: string): Promise<void> => {
    try {
      await apiClient.deleteDriver(id);
      setDrivers(prev => prev.filter(driver => driver.id !== id));
    } catch (error) {
      console.error('❌ Error deleting driver:', error);
      throw error;
    }
  };

  // CRUD operations for trucks
  const createTruck = async (truckData: Omit<Truck, 'id'>): Promise<Truck> => {
    try {
      const newTruck = await apiClient.createTruck(truckData);
      setTrucks(prev => [...prev, newTruck]);
      return newTruck;
    } catch (error) {
      console.error('❌ Error creating truck:', error);
      throw error;
    }
  };

  const updateTruck = async (id: string, updates: Partial<Truck>): Promise<Truck> => {
    try {
      const updatedTruck = await apiClient.updateTruck(id, updates);
      setTrucks(prev => prev.map(truck => 
        truck.id === id ? updatedTruck : truck
      ));
      return updatedTruck;
    } catch (error) {
      console.error('❌ Error updating truck:', error);
      throw error;
    }
  };
  const deleteTruck = async (id: string): Promise<void> => {
    try {
      await apiClient.deleteTruck(id);
      setTrucks(prev => prev.filter(truck => truck.id !== id));
    } catch (error) {
      console.error('❌ Error deleting truck:', error);
      throw error;
    }
  };

  // CRUD operations for trailers
  const createTrailer = async (trailer: Omit<Trailer, 'id'>): Promise<Trailer> => {
    try {
      const newTrailer = await apiClient.createTrailer(trailer);
      setTrailers(prev => [...prev, newTrailer]);
      return newTrailer;
    } catch (error) {
      console.error('❌ Error creating trailer:', error);
      throw error;
    }
  };

  const updateTrailer = async (id: string, updates: Partial<Trailer>): Promise<Trailer> => {
    try {
      const updatedTrailer = await apiClient.updateTrailer(id, updates);
      setTrailers(prev => prev.map(trailer =>
        trailer.id === id ? { ...trailer, ...updatedTrailer } : trailer
      ));
      return updatedTrailer;
    } catch (error) {
      console.error('❌ Error updating trailer:', error);
      throw error;
    }
  };

  const deleteTrailer = async (id: string): Promise<void> => {
    try {
      await apiClient.deleteTrailer(id);
      setTrailers(prev => prev.filter(trailer => trailer.id !== id));
    } catch (error) {
      console.error('❌ Error deleting trailer:', error);
      throw error;
    }
  };

  // CRUD operations for loads
  const createLoad = async (loadData: Omit<Load, 'id'>): Promise<Load> => {
    try {
      const newLoad = await apiClient.createLoad(loadData);
      setLoads(prev => [...prev, newLoad]);
      return newLoad;
    } catch (error) {
      console.error('❌ Error creating load:', error);
      throw error;
    }
  };

  const updateLoad = async (id: string, updates: Partial<Load>): Promise<Load> => {
    try {
      const updatedLoad = await apiClient.updateLoad(id, updates);
      setLoads(prev => prev.map(load => 
        load.id === id ? updatedLoad : load
      ));
      return updatedLoad;
    } catch (error) {
      console.error('❌ Error updating load:', error);
      throw error;
    }
  };

  const deleteLoad = async (id: string): Promise<void> => {
    try {
      await apiClient.deleteLoad(id);
      setLoads(prev => prev.filter(load => load.id !== id));
    } catch (error) {
      console.error('❌ Error deleting load:', error);
      throw error;
    }
  };
  // Organizational filtering methods
  const getFilteredDrivers = (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>): Driver[] => {
    if (!orgFilter) return drivers;
    
    return drivers.filter(driver => {
      const driverOrg = driver.organizationalContext || {};
      return (!orgFilter?.companyId || driverOrg.companyId === orgFilter.companyId) &&
             (!orgFilter?.divisionId || driverOrg.divisionId === orgFilter.divisionId) &&
             (!orgFilter?.departmentId || driverOrg.departmentId === orgFilter.departmentId) &&
             (!orgFilter?.terminalId || driverOrg.terminalId === orgFilter.terminalId);
    });
  };

  const getFilteredTrucks = (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>): Truck[] => {
    if (!orgFilter) return trucks;
    
    return trucks.filter(truck => {
      const truckOrg = truck.organizationalContext || {};
      return (!orgFilter?.companyId || truckOrg.companyId === orgFilter.companyId) &&
             (!orgFilter?.divisionId || truckOrg.divisionId === orgFilter.divisionId) &&
             (!orgFilter?.departmentId || truckOrg.departmentId === orgFilter.departmentId) &&
             (!orgFilter?.terminalId || truckOrg.terminalId === orgFilter.terminalId);
    });
  };

  const getFilteredLoads = (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>): Load[] => {
    if (!orgFilter) return loads;
    
    return loads.filter(load => {
      const loadOrg = load.organizationalContext || {};
      return (!orgFilter?.companyId || loadOrg.companyId === orgFilter.companyId) &&
             (!orgFilter?.divisionId || loadOrg.divisionId === orgFilter.divisionId) &&
             (!orgFilter?.departmentId || loadOrg.departmentId === orgFilter.departmentId) &&
             (!orgFilter?.terminalId || loadOrg.terminalId === orgFilter.terminalId);
    });
  };
  // Utility function to clear all data (for testing/reset)
  const clearAllData = () => {
    setDrivers([]);
    setTrucks([]);
    setTrailers([]);
    setLoads([]);
    setErrors({ drivers: null, trucks: null, trailers: null, loads: null });
  };  // Load initial data on mount
  useEffect(() => {
    console.log('🚀 DataProvider: Initializing with Django backend API');
    refreshData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: DataContextType = {    // Data state
    drivers,
    trucks,
    trailers,
    loads,
    
    // Loading states
    loading,
    
    // Error states
    errors,
      // Refresh functions
    refreshData,
    refreshDrivers,
    refreshTrucks,
    refreshTrailers,
    refreshLoads,
    
    // CRUD operations
    createDriver,
    updateDriver,
    deleteDriver,
    createTruck,
    updateTruck,
    deleteTruck,
    createTrailer,
    updateTrailer,
    deleteTrailer,
    createLoad,
    updateLoad,
    deleteLoad,
    
    // Organizational filtering methods
    getFilteredDrivers,
    getFilteredTrucks,
    getFilteredLoads,
    
    // Utility methods
    clearAllData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
