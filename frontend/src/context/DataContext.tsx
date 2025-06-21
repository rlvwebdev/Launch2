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
  
  // Refresh operations
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
  getFilteredTrailers: (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => Trailer[];
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

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // State management
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
  const setLoadingState = useCallback((key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  // Helper function to update error state
  const setErrorState = useCallback((key: keyof typeof errors, value: string | null) => {
    setErrors(prev => ({ ...prev, [key]: value }));
  }, []);

  // Data fetching functions
  const refreshDrivers = useCallback(async () => {
    setLoadingState('drivers', true);
    setErrorState('drivers', null);
      try {
      console.log('🚀 DataContext: Fetching drivers from API');
      
      // Ensure API client has latest tokens
      apiClient.reloadTokens();
      
      const response = await apiClient.getDrivers();
      console.log('✅ DataContext: Received drivers data:', response);
        if (response.results && response.results.length > 0) {
        const processedDrivers = response.results.map((driver: any, index: number) => {
          // Generate ID if not present
          const driverId = driver.id || `driver-${index + 1}`;
          
          return {
            ...driver,
            id: driverId,
            status: driver.status || 'available',
            // Ensure required fields have defaults
            firstName: driver.firstName || driver.first_name || 'Unknown',
            lastName: driver.lastName || driver.last_name || 'Driver',
            email: driver.email || `${driverId}@example.com`,
            phone: driver.phone || '000-000-0000',
            licenseNumber: driver.licenseNumber || driver.license_number || 'N/A',
          };
        });
        
        setDrivers(processedDrivers);
        console.log('✅ DataContext: Processed and set drivers:', processedDrivers);
      } else {
        console.warn('⚠️ DataContext: Invalid drivers response:', response);
        setDrivers([]);
      }
    } catch (error) {
      console.error('❌ DataContext: Error fetching drivers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch drivers';
      setErrorState('drivers', errorMessage);    } finally {
      setLoadingState('drivers', false);
    }
  }, [setErrorState, setLoadingState]);

  const refreshTrucks = useCallback(async () => {
    setLoadingState('trucks', true);
    setErrorState('trucks', null);
    
    try {
      console.log('� DataContext: Fetching trucks from API');
      const response = await apiClient.getTrucks();
      console.log('✅ DataContext: Received trucks data:', response);
        if (response.results && response.results.length >= 0) {
        const processedTrucks = response.results.map((truck: any, index: number) => {
          // Generate ID if not present
          const truckId = truck.id || `truck-${index + 1}`;
          
          return {
            ...truck,
            id: truckId,
            status: truck.status || 'available',
            // Ensure required fields have defaults
            truckNumber: truck.truckNumber || truck.truck_number || `T${String(index + 1).padStart(3, '0')}`,
            make: truck.make || 'Unknown',
            model: truck.model || 'Unknown',
            year: truck.year || 2020,
          };
        });
        
        setTrucks(processedTrucks);
        console.log('✅ DataContext: Processed and set trucks:', processedTrucks);
      } else {
        console.warn('⚠️ DataContext: Invalid trucks response:', response);
        setTrucks([]);
      }
    } catch (error) {
      console.error('❌ DataContext: Error fetching trucks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trucks';
      setErrorState('trucks', errorMessage);    } finally {
      setLoadingState('trucks', false);
    }
  }, [setErrorState, setLoadingState]);
  const refreshTrailers = useCallback(async () => {
    setLoadingState('trailers', true);
    setErrorState('trailers', null);
    
    try {
      console.log('� DataContext: Fetching trailers from API');
      const response = await apiClient.getTrailers();
      console.log('✅ DataContext: Received trailers data:', response);
      
      if (response.results && response.results.length >= 0) {
        const processedTrailers = response.results.map((trailer: any, index: number) => {
          // Generate ID if not present
          const trailerId = trailer.id || `trailer-${index + 1}`;
          
          return {
            ...trailer,
            id: trailerId,
            status: trailer.status || 'available',
            // Ensure required fields have defaults
            trailerNumber: trailer.trailerNumber || trailer.trailer_number || `TR${String(index + 1).padStart(3, '0')}`,
            type: trailer.type || 'dry_van',
            capacity: trailer.capacity || 48000,
            company: trailer.company || 'Unknown Company',
          };
        });
        
        setTrailers(processedTrailers);
        console.log('✅ DataContext: Processed and set trailers:', processedTrailers);
      } else {
        console.warn('⚠️ DataContext: Invalid trailers response:', response);
        setTrailers([]);
      }
    } catch (error) {
      console.error('❌ DataContext: Error fetching trailers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trailers';
      setErrorState('trailers', errorMessage);    } finally {
      setLoadingState('trailers', false);
    }
  }, [setErrorState, setLoadingState]);
  const refreshLoads = useCallback(async () => {
    setLoadingState('loads', true);
    setErrorState('loads', null);
    
    try {
      console.log('� DataContext: Fetching loads from API');
      const response = await apiClient.getLoads();
      console.log('✅ DataContext: Received loads data:', response);
      
      if (response.results && response.results.length >= 0) {
        const processedLoads = response.results.map((load: any, index: number) => {
          // Generate ID if not present
          const loadId = load.id || `load-${index + 1}`;
          
          return {
            ...load,
            id: loadId,
            status: load.status || 'planned',
            // Ensure required fields have defaults
            loadNumber: load.loadNumber || load.load_number || `L${String(index + 1).padStart(3, '0')}`,
            shipper: load.shipper || 'Unknown Shipper',
            destination: load.consignee || load.destination || 'Unknown Destination',
            pickupLocation: load.pickupLocation || load.pickup_location || 'Unknown',
            deliveryLocation: load.deliveryLocation || load.delivery_location || 'Unknown',
            pickupDate: new Date(load.pickupDate || load.pickup_date || Date.now()),
            deliveryDate: new Date(load.deliveryDate || load.delivery_date || Date.now()),
            rate: parseFloat(load.rate || '0'),
            miles: parseInt(load.miles || '0'),
          };
        });
        
        setLoads(processedLoads);
        console.log('✅ DataContext: Processed and set loads:', processedLoads);
      } else {
        console.warn('⚠️ DataContext: No loads found, setting empty array');
        setLoads([]);
      }
    } catch (error) {
      console.error('❌ DataContext: Error fetching loads:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch loads';
      setErrorState('loads', errorMessage);    } finally {
      setLoadingState('loads', false);
    }
  }, [setErrorState, setLoadingState]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    console.log('� DataContext: Refreshing all data');
    await Promise.all([
      refreshDrivers(),
      refreshTrucks(),
      refreshTrailers(),
      refreshLoads(),
    ]);
    console.log('✅ DataContext: All data refreshed');
  }, [refreshDrivers, refreshTrucks, refreshTrailers, refreshLoads]);

  // CRUD Operations (placeholder implementations)
  const createDriver = async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
    // TODO: Implement real API call
    const newDriver: Driver = {
      ...driver,
      id: `driver-${Date.now()}`,
    };
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

  const updateDriver = async (id: string, updates: Partial<Driver>): Promise<Driver> => {
    // TODO: Implement real API call
    const updatedDriver = { ...drivers.find(d => d.id === id)!, ...updates };
    setDrivers(prev => prev.map(d => d.id === id ? updatedDriver : d));
    return updatedDriver;
  };

  const deleteDriver = async (id: string): Promise<void> => {
    // TODO: Implement real API call
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  const createTruck = async (truck: Omit<Truck, 'id'>): Promise<Truck> => {
    // TODO: Implement real API call
    const newTruck: Truck = {
      ...truck,
      id: `truck-${Date.now()}`,
    };
    setTrucks(prev => [...prev, newTruck]);
    return newTruck;
  };

  const updateTruck = async (id: string, updates: Partial<Truck>): Promise<Truck> => {
    // TODO: Implement real API call
    const updatedTruck = { ...trucks.find(t => t.id === id)!, ...updates };
    setTrucks(prev => prev.map(t => t.id === id ? updatedTruck : t));
    return updatedTruck;
  };

  const deleteTruck = async (id: string): Promise<void> => {
    // TODO: Implement real API call
    setTrucks(prev => prev.filter(t => t.id !== id));
  };

  const createTrailer = async (trailer: Omit<Trailer, 'id'>): Promise<Trailer> => {
    // TODO: Implement real API call
    const newTrailer: Trailer = {
      ...trailer,
      id: `trailer-${Date.now()}`,
    };
    setTrailers(prev => [...prev, newTrailer]);
    return newTrailer;
  };

  const updateTrailer = async (id: string, updates: Partial<Trailer>): Promise<Trailer> => {
    // TODO: Implement real API call
    const updatedTrailer = { ...trailers.find(t => t.id === id)!, ...updates };
    setTrailers(prev => prev.map(t => t.id === id ? updatedTrailer : t));
    return updatedTrailer;
  };

  const deleteTrailer = async (id: string): Promise<void> => {
    // TODO: Implement real API call
    setTrailers(prev => prev.filter(t => t.id !== id));
  };

  const createLoad = async (load: Omit<Load, 'id'>): Promise<Load> => {
    // TODO: Implement real API call
    const newLoad: Load = {
      ...load,
      id: `load-${Date.now()}`,
    };
    setLoads(prev => [...prev, newLoad]);
    return newLoad;
  };

  const updateLoad = async (id: string, updates: Partial<Load>): Promise<Load> => {
    // TODO: Implement real API call
    const updatedLoad = { ...loads.find(l => l.id === id)!, ...updates };
    setLoads(prev => prev.map(l => l.id === id ? updatedLoad : l));
    return updatedLoad;
  };

  const deleteLoad = async (id: string): Promise<void> => {
    // TODO: Implement real API call
    setLoads(prev => prev.filter(l => l.id !== id));
  };  // Organizational filtering methods
  const getFilteredDrivers = (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => {
    if (!orgFilter) return drivers;
    
    return drivers.filter(driver => {
      if (!driver.organizationalContext) return true;
      
      if (orgFilter.terminalId) {
        return driver.organizationalContext.terminalId === orgFilter.terminalId;
      }
      if (orgFilter.departmentId) {
        return driver.organizationalContext.departmentId === orgFilter.departmentId;
      }
      if (orgFilter.divisionId) {
        return driver.organizationalContext.divisionId === orgFilter.divisionId;
      }
      if (orgFilter.companyId) {
        return driver.organizationalContext.companyId === orgFilter.companyId;
      }
      return true; // Show all if no filter
    });
  };

  const getFilteredTrucks = (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => {
    if (!orgFilter) return trucks;
    
    return trucks.filter(truck => {
      if (!truck.organizationalContext) return true;
      
      if (orgFilter.terminalId) {
        return truck.organizationalContext.terminalId === orgFilter.terminalId;
      }
      if (orgFilter.departmentId) {
        return truck.organizationalContext.departmentId === orgFilter.departmentId;
      }
      if (orgFilter.divisionId) {
        return truck.organizationalContext.divisionId === orgFilter.divisionId;
      }
      if (orgFilter.companyId) {
        return truck.organizationalContext.companyId === orgFilter.companyId;
      }
      return true; // Show all if no filter
    });
  };

  const getFilteredTrailers = (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => {
    if (!orgFilter) return trailers;
    
    return trailers.filter(trailer => {
      if (!trailer.organizationalContext) return true;
      
      if (orgFilter.terminalId) {
        return trailer.organizationalContext.terminalId === orgFilter.terminalId;
      }
      if (orgFilter.departmentId) {
        return trailer.organizationalContext.departmentId === orgFilter.departmentId;
      }
      if (orgFilter.divisionId) {
        return trailer.organizationalContext.divisionId === orgFilter.divisionId;
      }
      if (orgFilter.companyId) {
        return trailer.organizationalContext.companyId === orgFilter.companyId;
      }
      return true; // Show all if no filter
    });
  };

  const getFilteredLoads = (orgFilter?: Partial<{companyId: string; divisionId: string; departmentId: string; terminalId: string}>) => {
    if (!orgFilter) return loads;
    
    return loads.filter(load => {
      if (!load.organizationalContext) return true;
      
      if (orgFilter.terminalId) {
        return load.organizationalContext.terminalId === orgFilter.terminalId;
      }
      if (orgFilter.departmentId) {
        return load.organizationalContext.departmentId === orgFilter.departmentId;
      }
      if (orgFilter.divisionId) {
        return load.organizationalContext.divisionId === orgFilter.divisionId;
      }
      if (orgFilter.companyId) {
        return load.organizationalContext.companyId === orgFilter.companyId;
      }
      return true; // Show all if no filter
    });
  };

  // Utility function to clear all data (for testing/reset)
  const clearAllData = () => {
    setDrivers([]);
    setTrucks([]);
    setTrailers([]);
    setLoads([]);
    setErrors({ drivers: null, trucks: null, trailers: null, loads: null });
  };

  // Load initial data on mount
  useEffect(() => {
    console.log('� DataProvider: Initializing with database API');
    refreshData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: DataContextType = {
    // Data state
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
    getFilteredTrailers,
    getFilteredLoads,
    
    // Utility methods
    clearAllData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};