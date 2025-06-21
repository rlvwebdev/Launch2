/**
 * Database API Client for Launch TMS
 * This replaces the mock data with real database connectivity
 */

import { Driver, Truck, Trailer, Load } from '@/types';

export class DatabaseApiClient {
  
  // Driver operations
  static async getDrivers(): Promise<Driver[]> {
    try {
      const response = await fetch('/api/drivers');
      if (!response.ok) {
        throw new Error(`Failed to fetch drivers: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        return data.drivers.map((driver: any) => ({
          ...driver,
          licenseExpiry: new Date(driver.licenseExpiry),
          hireDate: new Date(driver.hireDate),
          createdAt: new Date(driver.createdAt),
          updatedAt: new Date(driver.updatedAt),
        }));
      } else {
        throw new Error(data.error || 'Failed to load drivers');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  static async createDriver(driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver> {
    try {
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driver)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create driver: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        return {
          ...data.driver,
          licenseExpiry: new Date(data.driver.licenseExpiry),
          hireDate: new Date(data.driver.hireDate),
          createdAt: new Date(data.driver.createdAt),
          updatedAt: new Date(data.driver.updatedAt),
        };
      } else {
        throw new Error(data.error || 'Failed to create driver');
      }
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }

  // Truck operations
  static async getTrucks(): Promise<Truck[]> {
    try {
      const response = await fetch('/api/trucks');
      if (!response.ok) {
        throw new Error(`Failed to fetch trucks: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        return data.trucks.map((truck: any) => ({
          ...truck,
          lastMaintenance: new Date(truck.lastMaintenance),
          nextMaintenanceDue: new Date(truck.nextMaintenanceDue),
          registrationExpiry: new Date(truck.registrationExpiry),
          insuranceExpiry: new Date(truck.insuranceExpiry),
          createdAt: new Date(truck.createdAt),
          updatedAt: new Date(truck.updatedAt),
        }));
      } else {
        throw new Error(data.error || 'Failed to load trucks');
      }
    } catch (error) {
      console.error('Error fetching trucks:', error);
      throw error;
    }
  }

  static async createTruck(truck: Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Truck> {
    try {
      const response = await fetch('/api/trucks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(truck)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create truck: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        return {
          ...data.truck,
          lastMaintenance: new Date(data.truck.lastMaintenance),
          nextMaintenanceDue: new Date(data.truck.nextMaintenanceDue),
          registrationExpiry: new Date(data.truck.registrationExpiry),
          insuranceExpiry: new Date(data.truck.insuranceExpiry),
          createdAt: new Date(data.truck.createdAt),
          updatedAt: new Date(data.truck.updatedAt),
        };
      } else {
        throw new Error(data.error || 'Failed to create truck');
      }
    } catch (error) {
      console.error('Error creating truck:', error);
      throw error;
    }
  }

  // Database initialization
  static async initializeDatabase(): Promise<void> {
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to initialize database: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize database');
      }
      
      console.log('✅ Database initialized successfully:', data);
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // Health check
  static async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/drivers');
      return response.ok;
    } catch (error) {
      console.error('Database connection check failed:', error);
      return false;
    }
  }
}
