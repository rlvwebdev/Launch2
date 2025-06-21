/**
 * Database utility functions for Launch TMS
 * Using Local PostgreSQL database
 */

import { LocalDatabaseManager } from './local-database';
import { Driver, Truck } from '@/types';

export class DatabaseManager {
  static async initializeDatabase() {
    return await LocalDatabaseManager.initializeDatabase();
  }

  static async getDrivers(): Promise<Partial<Driver>[]> {
    return await LocalDatabaseManager.getDrivers();
  }

  static async createDriver(driver: Partial<Driver>): Promise<Partial<Driver>> {
    return await LocalDatabaseManager.createDriver(driver);
  }

  static async getTrucks(): Promise<Partial<Truck>[]> {
    return await LocalDatabaseManager.getTrucks();
  }

  static async getTrailers(): Promise<any[]> {
    return await LocalDatabaseManager.getTrailers();
  }

  static async getLoads(): Promise<any[]> {
    return await LocalDatabaseManager.getLoads();
  }

  static async createTruck(truck: Partial<Truck>): Promise<Partial<Truck>> {
    return await LocalDatabaseManager.createTruck(truck);
  }

  static async testConnection() {
    return await LocalDatabaseManager.testConnection();
  }
}
