/**
 * Extended Local Database Manager with bulk operations
 * Handles comprehensive data generation for Launch TMS
 */

import { Pool } from 'pg';

// Local PostgreSQL connection pool
const pool = new Pool({
  user: process.env.LOCAL_POSTGRES_USER || 'postgres',
  host: process.env.LOCAL_POSTGRES_HOST || 'localhost',
  database: process.env.LOCAL_POSTGRES_DB || 'launch_tms',
  password: process.env.LOCAL_POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.LOCAL_POSTGRES_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export class BulkDataManager {
  static async initializeExtendedDatabase() {
    try {
      console.log('🔧 Creating extended database schema...');
      const client = await pool.connect();
      
      try {
        // Create companies table
        await client.query(`
          CREATE TABLE IF NOT EXISTS companies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            address TEXT,
            phone VARCHAR(20),
            email VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `);

        // Create terminals table
        await client.query(`
          CREATE TABLE IF NOT EXISTS terminals (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            address TEXT,
            city VARCHAR(100),
            state VARCHAR(50),
            zip VARCHAR(20),
            phone VARCHAR(20),
            company_id INTEGER REFERENCES companies(id),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `);

        // Create divisions table
        await client.query(`
          CREATE TABLE IF NOT EXISTS divisions (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50),
            company_id INTEGER REFERENCES companies(id),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `);

        // Create departments table
        await client.query(`
          CREATE TABLE IF NOT EXISTS departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50),
            division_id INTEGER REFERENCES divisions(id),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `);

        // Create trailers table
        await client.query(`
          CREATE TABLE IF NOT EXISTS trailers (
            id SERIAL PRIMARY KEY,
            trailer_number VARCHAR(50) UNIQUE NOT NULL,
            type VARCHAR(50) DEFAULT 'dry_van',
            length INTEGER,
            capacity INTEGER,
            year INTEGER,
            status VARCHAR(20) DEFAULT 'available',
            last_inspection DATE,
            next_inspection_due DATE,
            terminal_id INTEGER,
            company_id INTEGER,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `);

        // Extend existing tables
        await client.query(`
          ALTER TABLE drivers 
          ADD COLUMN IF NOT EXISTS license_expiry DATE,
          ADD COLUMN IF NOT EXISTS driver_type VARCHAR(50) DEFAULT 'company_driver',
          ADD COLUMN IF NOT EXISTS hire_date DATE,
          ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
          ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20),
          ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(50),
          ADD COLUMN IF NOT EXISTS terminal_id INTEGER,
          ADD COLUMN IF NOT EXISTS company_id INTEGER
        `);

        await client.query(`
          ALTER TABLE trucks 
          ADD COLUMN IF NOT EXISTS mileage INTEGER DEFAULT 0,
          ADD COLUMN IF NOT EXISTS last_maintenance DATE,
          ADD COLUMN IF NOT EXISTS next_maintenance_due DATE,
          ADD COLUMN IF NOT EXISTS registration_expiry DATE,
          ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
          ADD COLUMN IF NOT EXISTS terminal_id INTEGER,
          ADD COLUMN IF NOT EXISTS company_id INTEGER
        `);

        await client.query(`
          ALTER TABLE loads 
          ADD COLUMN IF NOT EXISTS commodity VARCHAR(255),
          ADD COLUMN IF NOT EXISTS weight INTEGER,
          ADD COLUMN IF NOT EXISTS terminal_id INTEGER,
          ADD COLUMN IF NOT EXISTS company_id INTEGER
        `);

        console.log('✅ Extended database schema created successfully');
        return { 
          success: true, 
          message: 'Extended database schema initialized successfully' 
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('❌ Error initializing extended database schema:', error);
      throw error;
    }
  }

  static async clearAllData() {
    const client = await pool.connect();
    try {
      await client.query('TRUNCATE TABLE loads, trailers, trucks, drivers, departments, divisions, terminals, companies RESTART IDENTITY CASCADE');
      console.log('✅ All data cleared successfully');
    } finally {
      client.release();
    }
  }

  static async bulkInsertCompanies(companies: any[]) {
    const client = await pool.connect();
    try {
      for (const company of companies) {
        await client.query(
          'INSERT INTO companies (name, code, address, phone, email) VALUES ($1, $2, $3, $4, $5)',
          [company.name, company.code, company.address, company.phone, company.email]
        );
      }
      console.log(`✅ Inserted ${companies.length} companies`);
    } finally {
      client.release();
    }
  }

  static async bulkInsertTerminals(terminals: any[]) {
    const client = await pool.connect();
    try {
      for (const terminal of terminals) {
        await client.query(
          'INSERT INTO terminals (name, code, address, city, state, zip, phone, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [terminal.name, terminal.code, terminal.address, terminal.city, terminal.state, terminal.zip, terminal.phone, terminal.company_id]
        );
      }
      console.log(`✅ Inserted ${terminals.length} terminals`);
    } finally {
      client.release();
    }
  }

  static async bulkInsertDivisions(divisions: any[]) {
    const client = await pool.connect();
    try {
      for (const division of divisions) {
        await client.query(
          'INSERT INTO divisions (name, code, company_id) VALUES ($1, $2, $3)',
          [division.name, division.code, division.company_id]
        );
      }
      console.log(`✅ Inserted ${divisions.length} divisions`);
    } finally {
      client.release();
    }
  }

  static async bulkInsertDepartments(departments: any[]) {
    const client = await pool.connect();
    try {
      for (const dept of departments) {
        await client.query(
          'INSERT INTO departments (name, code, division_id) VALUES ($1, $2, $3)',
          [dept.name, dept.code, dept.division_id]
        );
      }
      console.log(`✅ Inserted ${departments.length} departments`);
    } finally {
      client.release();
    }
  }

  static async bulkInsertDrivers(drivers: any[]) {
    const client = await pool.connect();
    try {
      for (const driver of drivers) {
        await client.query(`
          INSERT INTO drivers (
            first_name, last_name, email, phone, license_number, license_expiry, 
            status, driver_type, hire_date, emergency_contact_name, 
            emergency_contact_phone, emergency_contact_relationship, 
            terminal_id, company_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          driver.first_name, driver.last_name, driver.email, driver.phone, 
          driver.license_number, driver.license_expiry, driver.status, driver.driver_type,
          driver.hire_date, driver.emergency_contact_name, driver.emergency_contact_phone,
          driver.emergency_contact_relationship, driver.terminal_id, driver.company_id
        ]);
      }
      console.log(`✅ Inserted ${drivers.length} drivers`);
    } finally {
      client.release();
    }
  }

  static async bulkInsertTrucks(trucks: any[]) {
    const client = await pool.connect();
    try {
      for (const truck of trucks) {
        await client.query(`
          INSERT INTO trucks (
            truck_number, make, model, year, vin, status, mileage, 
            last_maintenance, next_maintenance_due, registration_expiry, 
            insurance_expiry, terminal_id, company_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          truck.truck_number, truck.make, truck.model, truck.year, truck.vin, 
          truck.status, truck.mileage, truck.last_maintenance, truck.next_maintenance_due,
          truck.registration_expiry, truck.insurance_expiry, truck.terminal_id, truck.company_id
        ]);
      }
      console.log(`✅ Inserted ${trucks.length} trucks`);
    } finally {
      client.release();
    }
  }

  static async bulkInsertTrailers(trailers: any[]) {
    const client = await pool.connect();
    try {
      for (const trailer of trailers) {
        await client.query(`
          INSERT INTO trailers (
            trailer_number, type, length, capacity, year, status, 
            last_inspection, next_inspection_due, terminal_id, company_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          trailer.trailer_number, trailer.type, trailer.length, trailer.capacity, 
          trailer.year, trailer.status, trailer.last_inspection, trailer.next_inspection_due,
          trailer.terminal_id, trailer.company_id
        ]);
      }
      console.log(`✅ Inserted ${trailers.length} trailers`);
    } finally {
      client.release();
    }
  }

  static async bulkInsertLoads(loads: any[]) {
    const client = await pool.connect();
    try {
      console.log(`📦 Starting to insert ${loads.length} loads...`);
      let insertedCount = 0;
      
      for (const load of loads) {
        await client.query(`
          INSERT INTO loads (
            load_number, shipper, consignee, pickup_location, delivery_location,
            commodity, pickup_date, delivery_date, rate, miles, weight, 
            status, terminal_id, company_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          load.load_number, load.shipper, load.consignee, load.pickup_location, 
          load.delivery_location, load.commodity, load.pickup_date, load.delivery_date,
          load.rate, load.miles, load.weight, load.status, load.terminal_id, load.company_id
        ]);
        
        insertedCount++;
        if (insertedCount % 1000 === 0) {
          console.log(`📦 Inserted ${insertedCount}/${loads.length} loads...`);
        }
      }
      console.log(`✅ Inserted ${loads.length} loads`);
    } finally {
      client.release();
    }
  }
}
