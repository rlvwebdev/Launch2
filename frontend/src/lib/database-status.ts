/**
 * Database status and health check utilities
 */

import { sql } from '@vercel/postgres';

export interface DatabaseHealthStatus {
  connected: boolean;
  tablesExist: boolean;
  error?: string;
  connectionUrl?: string;
}

export class DatabaseHealth {
  static async checkStatus(): Promise<DatabaseHealthStatus> {
    try {
      // Test basic connection
      const connectionTest = await sql`SELECT 1 as test`;
      
      if (!connectionTest.rows || connectionTest.rows.length === 0) {
        return {
          connected: false,
          tablesExist: false,
          error: 'No response from database'
        };
      }

      // Check if our tables exist
      const tablesCheck = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('drivers', 'trucks', 'trailers', 'loads')
      `;

      const existingTables = tablesCheck.rows.map(row => row.table_name);
      const requiredTables = ['drivers', 'trucks', 'trailers', 'loads'];
      const tablesExist = requiredTables.every(table => existingTables.includes(table));

      return {
        connected: true,
        tablesExist,
        connectionUrl: process.env.POSTGRES_URL ? 
          process.env.POSTGRES_URL.replace(/:[^:@]*@/, ':****@') : 'Not configured'
      };

    } catch (error) {
      console.error('Database status check failed:', error);
      return {
        connected: false,
        tablesExist: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async initializeTables(): Promise<{ success: boolean; error?: string }> {
    try {
      // Create drivers table
      await sql`
        CREATE TABLE IF NOT EXISTS drivers (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          license_number VARCHAR(255) UNIQUE NOT NULL,
          license_expiry DATE NOT NULL,
          phone_number VARCHAR(255),
          email VARCHAR(255),
          fuel_card VARCHAR(255),
          assigned_truck_id INTEGER,
          status VARCHAR(50) DEFAULT 'available',
          hire_date DATE,
          emergency_contact JSONB,
          organizational_context VARCHAR(255),
          access_level VARCHAR(50) DEFAULT 'driver',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;

      // Create trucks table
      await sql`
        CREATE TABLE IF NOT EXISTS trucks (
          id SERIAL PRIMARY KEY,
          truck_number VARCHAR(255) UNIQUE NOT NULL,
          make VARCHAR(255),
          model VARCHAR(255),
          year INTEGER,
          vin VARCHAR(255) UNIQUE,
          license_plate VARCHAR(255),
          fuel_type VARCHAR(50),
          fuel_capacity DECIMAL(10,2),
          assigned_driver_id INTEGER,
          status VARCHAR(50) DEFAULT 'available',
          mileage INTEGER DEFAULT 0,
          last_maintenance_date DATE,
          next_maintenance_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;

      // Create trailers table
      await sql`
        CREATE TABLE IF NOT EXISTS trailers (
          id SERIAL PRIMARY KEY,
          trailer_number VARCHAR(255) UNIQUE NOT NULL,
          type VARCHAR(50),
          length_feet DECIMAL(5,2),
          weight_capacity DECIMAL(10,2),
          assigned_truck_id INTEGER,
          status VARCHAR(50) DEFAULT 'available',
          last_inspection_date DATE,
          next_inspection_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;

      // Create loads table
      await sql`
        CREATE TABLE IF NOT EXISTS loads (
          id SERIAL PRIMARY KEY,
          load_number VARCHAR(255) UNIQUE NOT NULL,
          customer VARCHAR(255),
          pickup_location VARCHAR(500),
          delivery_location VARCHAR(500),
          pickup_date DATE,
          delivery_date DATE,
          weight DECIMAL(10,2),
          rate DECIMAL(10,2),
          assigned_driver_id INTEGER,
          assigned_truck_id INTEGER,
          assigned_trailer_id INTEGER,
          status VARCHAR(50) DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;

      // Create indexes for better performance
      await sql`CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_trailers_status ON trailers(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_loads_pickup_date ON loads(pickup_date)`;

      return { success: true };
    } catch (error) {
      console.error('Failed to initialize tables:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
