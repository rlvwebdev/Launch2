/**
 * Local PostgreSQL Database utility for Launch TMS
 * Connects to local PostgreSQL instance
 */

import { Pool } from 'pg';
import { Driver, Truck } from '@/types';

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

export class LocalDatabaseManager {
  static async testConnection() {
    try {
      console.log('🔌 Testing local PostgreSQL connection...');
      
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
      client.release();
      
      console.log('✅ Local PostgreSQL connection successful');
      return {
        success: true,
        connected: true,
        currentTime: result.rows[0].current_time,
        postgresVersion: result.rows[0].postgres_version,
        message: 'Local PostgreSQL connection successful'
      };
    } catch (error) {
      console.error('❌ Local PostgreSQL connection test failed:', error);
      return {
        success: false,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Local PostgreSQL connection failed'
      };
    }
  }

  static async initializeDatabase() {
    try {
      console.log('🔧 Creating tables in local PostgreSQL...');
      const client = await pool.connect();
      
      // Create drivers table
      await client.query(`
        CREATE TABLE IF NOT EXISTS drivers (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          license_number VARCHAR(50),
          status VARCHAR(20) DEFAULT 'available',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create trucks table
      await client.query(`
        CREATE TABLE IF NOT EXISTS trucks (
          id SERIAL PRIMARY KEY,
          truck_number VARCHAR(50) UNIQUE NOT NULL,
          make VARCHAR(100),
          model VARCHAR(100),
          year INTEGER,
          vin VARCHAR(17),
          status VARCHAR(20) DEFAULT 'available',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create loads table
      await client.query(`
        CREATE TABLE IF NOT EXISTS loads (
          id SERIAL PRIMARY KEY,
          load_number VARCHAR(50) UNIQUE NOT NULL,
          shipper VARCHAR(255),
          consignee VARCHAR(255),
          pickup_location VARCHAR(255),
          delivery_location VARCHAR(255),
          pickup_date TIMESTAMP,
          delivery_date TIMESTAMP,
          rate DECIMAL(10,2),
          miles INTEGER,
          status VARCHAR(20) DEFAULT 'planned',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      client.release();
      console.log('✅ Tables created successfully in local PostgreSQL');
      return { success: true, message: 'Database initialized successfully' };
    } catch (error) {
      console.error('❌ Error initializing local PostgreSQL database:', error);
      throw error;
    }
  }
  static async getDrivers(): Promise<Partial<Driver>[]> {
    try {
      console.log('📋 Fetching drivers from local PostgreSQL...');
      
      const client = await pool.connect();
      const result = await client.query(`
        SELECT 
          d.*,
          t.department_id,
          dept.division_id,
          div.company_id as org_company_id
        FROM drivers d
        LEFT JOIN terminals t ON d.terminal_id = t.id
        LEFT JOIN departments dept ON t.department_id = dept.id
        LEFT JOIN divisions div ON dept.division_id = div.id
        ORDER BY d.id
      `);
      client.release();

      return result.rows.map((row: any) => ({
        id: row.id.toString(),
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phoneNumber: row.phone || '',
        licenseNumber: row.license_number || '',
        status: row.status as any,
        // Fill required fields with defaults
        licenseExpiry: new Date(),
        fuelCard: '',
        hireDate: new Date(row.created_at),
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        organizationalContext: {
          companyId: row.org_company_id ? row.org_company_id.toString() : (row.company_id ? row.company_id.toString() : ''),
          divisionId: row.division_id ? row.division_id.toString() : '',
          departmentId: row.department_id ? row.department_id.toString() : '',
          terminalId: row.terminal_id ? row.terminal_id.toString() : ''
        },
        accessLevel: 'driver' as any,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('❌ Error fetching drivers from local PostgreSQL, returning mock data:', error);
      // Return mock data when database connection fails
      return [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '555-123-4567',
          licenseNumber: 'CDL123456',
          status: 'available' as any,
          licenseExpiry: new Date('2025-12-31'),
          fuelCard: 'FC001',
          hireDate: new Date('2024-01-15'),
          emergencyContact: {
            name: 'Jane Doe',
            phone: '555-987-6543',
            relationship: 'Spouse'
          },
          organizationalContext: {
            companyId: 'company-1',
            divisionId: 'division-1',
            departmentId: 'department-1',
            terminalId: 'terminal-1'
          },
          accessLevel: 'driver' as any,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }
  }

  static async createDriver(driver: Partial<Driver>): Promise<Partial<Driver>> {
    try {
      const client = await pool.connect();
      const result = await client.query(
        `INSERT INTO drivers (first_name, last_name, email, phone, license_number, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [driver.firstName, driver.lastName, driver.email, driver.phoneNumber, driver.licenseNumber, driver.status]
      );
      
      client.release();
      const newDriver = result.rows[0];
      
      return {
        id: newDriver.id.toString(),
        firstName: newDriver.first_name,
        lastName: newDriver.last_name,
        email: newDriver.email,
        phoneNumber: newDriver.phone || '',
        licenseNumber: newDriver.license_number || '',
        status: newDriver.status as any,
        licenseExpiry: new Date(),
        fuelCard: '',
        hireDate: new Date(newDriver.created_at),
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        organizationalContext: {
          companyId: '',
          divisionId: '',
          departmentId: '',
          terminalId: ''
        },
        accessLevel: 'driver' as any,
        createdAt: new Date(newDriver.created_at),
        updatedAt: new Date(newDriver.updated_at)
      };
    } catch (error) {
      console.error('❌ Error creating driver in local PostgreSQL:', error);
      throw error;
    }
  }
  static async getTrucks(): Promise<Partial<Truck>[]> {
    try {
      console.log('📋 Fetching trucks from local PostgreSQL...');
      
      const client = await pool.connect();
      const result = await client.query(`
        SELECT 
          t.*,
          term.department_id,
          dept.division_id,
          div.company_id as org_company_id
        FROM trucks t
        LEFT JOIN terminals term ON t.terminal_id = term.id
        LEFT JOIN departments dept ON term.department_id = dept.id
        LEFT JOIN divisions div ON dept.division_id = div.id
        ORDER BY t.id
      `);
      client.release();

      return result.rows.map((row: any) => ({
        id: row.id.toString(),
        make: row.make || '',
        model: row.model || '',
        year: row.year || 2020,
        vin: row.vin || '',
        status: row.status as any,
        licensePlate: row.truck_number || '',
        color: '',
        mileage: 0,
        lastMaintenance: new Date(),
        nextMaintenanceDue: new Date(),
        registrationExpiry: new Date(),
        insuranceExpiry: new Date(),
        organizationalContext: {
          companyId: row.org_company_id ? row.org_company_id.toString() : (row.company_id ? row.company_id.toString() : ''),
          divisionId: row.division_id ? row.division_id.toString() : '',
          departmentId: row.department_id ? row.department_id.toString() : '',
          terminalId: row.terminal_id ? row.terminal_id.toString() : ''
        },
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('❌ Error fetching trucks from local PostgreSQL, returning mock data:', error);
      // Return mock data when database connection fails
      return [
        {
          id: '1',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2022,
          vin: '1FUJGHDV8NLSH1234',
          status: 'available' as any,
          licensePlate: 'T001',
          color: 'White',
          mileage: 125000,
          lastMaintenance: new Date('2024-11-15'),
          nextMaintenanceDue: new Date('2025-02-15'),
          registrationExpiry: new Date('2025-12-31'),
          insuranceExpiry: new Date('2025-10-30'),
          organizationalContext: {
            companyId: 'company-1',
            divisionId: 'division-1',
            departmentId: 'department-1',
            terminalId: 'terminal-1'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }
  }

  static async createTruck(truck: Partial<Truck>): Promise<Partial<Truck>> {
    try {
      const client = await pool.connect();
      const result = await client.query(
        `INSERT INTO trucks (truck_number, make, model, year, vin, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [truck.licensePlate, truck.make, truck.model, truck.year, truck.vin, truck.status]
      );
      
      client.release();
      const newTruck = result.rows[0];
      
      return {
        id: newTruck.id.toString(),
        make: newTruck.make || '',
        model: newTruck.model || '',
        year: newTruck.year || 2020,
        vin: newTruck.vin || '',
        status: newTruck.status as any,
        licensePlate: newTruck.truck_number || '',
        color: '',
        mileage: 0,
        lastMaintenance: new Date(),
        nextMaintenanceDue: new Date(),
        registrationExpiry: new Date(),
        insuranceExpiry: new Date(),
        organizationalContext: {
          companyId: '',
          divisionId: '',
          departmentId: '',
          terminalId: ''
        },
        createdAt: new Date(newTruck.created_at),
        updatedAt: new Date(newTruck.updated_at)
      };
    } catch (error) {
      console.error('❌ Error creating truck in local PostgreSQL:', error);
      throw error;
    }
  }

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

        // Update drivers table to include more fields
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

        // Update trucks table to include more fields
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

        // Update loads table to include more fields
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

  static async bulkInsertCompanies(companies: any[]) {
    const client = await pool.connect();
    try {
      const values = companies.map((company, index) => 
        `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`
      ).join(', ');
      
      const params = companies.flatMap(company => [
        company.name, company.code, company.address, company.phone, company.email
      ]);

      await client.query(`
        INSERT INTO companies (name, code, address, phone, email)
        VALUES ${values}
      `, params);
    } finally {
      client.release();
    }
  }

  static async bulkInsertTerminals(terminals: any[]) {
    const client = await pool.connect();
    try {
      const values = terminals.map((_, index) => 
        `($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${index * 8 + 4}, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${index * 8 + 8})`
      ).join(', ');
      
      const params = terminals.flatMap(terminal => [
        terminal.name, terminal.code, terminal.address, terminal.city, terminal.state, terminal.zip, terminal.phone, terminal.company_id
      ]);

      await client.query(`
        INSERT INTO terminals (name, code, address, city, state, zip, phone, company_id)
        VALUES ${values}
      `, params);
    } finally {
      client.release();
    }
  }

  static async bulkInsertDivisions(divisions: any[]) {
    const client = await pool.connect();
    try {
      const values = divisions.map((_, index) => 
        `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
      ).join(', ');
      
      const params = divisions.flatMap(division => [
        division.name, division.code, division.company_id
      ]);

      await client.query(`
        INSERT INTO divisions (name, code, company_id)
        VALUES ${values}
      `, params);
    } finally {
      client.release();
    }
  }

  static async bulkInsertDepartments(departments: any[]) {
    const client = await pool.connect();
    try {
      const values = departments.map((_, index) => 
        `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
      ).join(', ');
      
      const params = departments.flatMap(dept => [
        dept.name, dept.code, dept.division_id
      ]);

      await client.query(`
        INSERT INTO departments (name, code, division_id)
        VALUES ${values}
      `, params);
    } finally {
      client.release();
    }
  }

  static async bulkInsertDrivers(drivers: any[]) {
    const client = await pool.connect();
    try {
      const batchSize = 100;
      for (let i = 0; i < drivers.length; i += batchSize) {
        const batch = drivers.slice(i, i + batchSize);
        
        const values = batch.map((_, index) => 
          `($${index * 13 + 1}, $${index * 13 + 2}, $${index * 13 + 3}, $${index * 13 + 4}, $${index * 13 + 5}, $${index * 13 + 6}, $${index * 13 + 7}, $${index * 13 + 8}, $${index * 13 + 9}, $${index * 13 + 10}, $${index * 13 + 11}, $${index * 13 + 12}, $${index * 13 + 13})`
        ).join(', ');
        
        const params = batch.flatMap(driver => [
          driver.first_name, driver.last_name, driver.email, driver.phone, driver.license_number,
          driver.license_expiry, driver.status, driver.driver_type, driver.hire_date,
          driver.emergency_contact_name, driver.emergency_contact_phone, driver.emergency_contact_relationship,
          driver.terminal_id
        ]);

        await client.query(`
          INSERT INTO drivers (first_name, last_name, email, phone, license_number, license_expiry, status, driver_type, hire_date, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, terminal_id)
          VALUES ${values}
        `, params);
      }
    } finally {
      client.release();
    }
  }

  static async bulkInsertTrucks(trucks: any[]) {
    const client = await pool.connect();
    try {
      const batchSize = 100;
      for (let i = 0; i < trucks.length; i += batchSize) {
        const batch = trucks.slice(i, i + batchSize);
        
        const values = batch.map((_, index) => 
          `($${index * 12 + 1}, $${index * 12 + 2}, $${index * 12 + 3}, $${index * 12 + 4}, $${index * 12 + 5}, $${index * 12 + 6}, $${index * 12 + 7}, $${index * 12 + 8}, $${index * 12 + 9}, $${index * 12 + 10}, $${index * 12 + 11}, $${index * 12 + 12})`
        ).join(', ');
        
        const params = batch.flatMap(truck => [
          truck.truck_number, truck.make, truck.model, truck.year, truck.vin, truck.status,
          truck.mileage, truck.last_maintenance, truck.next_maintenance_due, truck.registration_expiry,
          truck.insurance_expiry, truck.terminal_id
        ]);

        await client.query(`
          INSERT INTO trucks (truck_number, make, model, year, vin, status, mileage, last_maintenance, next_maintenance_due, registration_expiry, insurance_expiry, terminal_id)
          VALUES ${values}
        `, params);
      }
    } finally {
      client.release();
    }
  }

  static async bulkInsertTrailers(trailers: any[]) {
    const client = await pool.connect();
    try {
      const batchSize = 100;
      for (let i = 0; i < trailers.length; i += batchSize) {
        const batch = trailers.slice(i, i + batchSize);
        
        const values = batch.map((_, index) => 
          `($${index * 10 + 1}, $${index * 10 + 2}, $${index * 10 + 3}, $${index * 10 + 4}, $${index * 10 + 5}, $${index * 10 + 6}, $${index * 10 + 7}, $${index * 10 + 8}, $${index * 10 + 9}, $${index * 10 + 10})`
        ).join(', ');
        
        const params = batch.flatMap(trailer => [
          trailer.trailer_number, trailer.type, trailer.length, trailer.capacity, trailer.year,
          trailer.status, trailer.last_inspection, trailer.next_inspection_due, trailer.terminal_id, trailer.company_id
        ]);

        await client.query(`
          INSERT INTO trailers (trailer_number, type, length, capacity, year, status, last_inspection, next_inspection_due, terminal_id, company_id)
          VALUES ${values}
        `, params);
      }
    } finally {
      client.release();
    }
  }

  static async bulkInsertLoads(loads: any[]) {
    const client = await pool.connect();
    try {
      const batchSize = 100;
      for (let i = 0; i < loads.length; i += batchSize) {
        const batch = loads.slice(i, i + batchSize);
        
        const values = batch.map((_, index) => 
          `($${index * 14 + 1}, $${index * 14 + 2}, $${index * 14 + 3}, $${index * 14 + 4}, $${index * 14 + 5}, $${index * 14 + 6}, $${index * 14 + 7}, $${index * 14 + 8}, $${index * 14 + 9}, $${index * 14 + 10}, $${index * 14 + 11}, $${index * 14 + 12}, $${index * 14 + 13}, $${index * 14 + 14})`
        ).join(', ');
        
        const params = batch.flatMap(load => [
          load.load_number, load.shipper, load.consignee, load.pickup_location, load.delivery_location,
          load.commodity, load.pickup_date, load.delivery_date, load.rate, load.miles,
          load.weight, load.status, load.terminal_id, load.company_id
        ]);

        await client.query(`
          INSERT INTO loads (load_number, shipper, consignee, pickup_location, delivery_location, commodity, pickup_date, delivery_date, rate, miles, weight, status, terminal_id, company_id)
          VALUES ${values}
        `, params);
      }
    } finally {
      client.release();
    }
  }

  static async getCompanies() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM companies ORDER BY id');
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getTerminals() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM terminals ORDER BY id');
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getTrailers(): Promise<any[]> {
    try {
      console.log('📋 Fetching trailers from local PostgreSQL...');
      
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM trailers ORDER BY id');
      client.release();

      return result.rows.map((row: any) => ({
        id: row.id.toString(),
        trailerNumber: row.trailer_number || '',
        type: row.type || 'dry_van',
        status: row.status || 'available',
        company: row.company_id || '',
        capacity: row.capacity || 48000,
        length: row.length || 53,
        year: row.year || 2020,
        lastInspection: new Date(row.last_inspection || Date.now()),
        nextInspectionDue: new Date(row.next_inspection_due || Date.now()),
        organizationalContext: {
          companyId: row.company_id || '',
          terminalId: row.terminal_id || ''
        },
        createdAt: new Date(row.created_at || Date.now()),
        updatedAt: new Date(row.updated_at || Date.now())
      }));
    } catch (error) {
      console.error('❌ Error fetching trailers from local PostgreSQL, returning empty array:', error);
      return [];
    }
  }

  static async getLoads(): Promise<any[]> {
    try {
      console.log('📋 Fetching loads from local PostgreSQL...');
      
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM loads ORDER BY id');
      client.release();

      return result.rows.map((row: any) => ({
        id: row.id.toString(),
        loadNumber: row.load_number || '',
        status: row.status || 'planned',
        shipper: row.shipper || '',
        consignee: row.consignee || '',
        pickupLocation: row.pickup_location || '',
        deliveryLocation: row.delivery_location || '',
        commodity: row.commodity || '',
        pickupDate: new Date(row.pickup_date || Date.now()),
        deliveryDate: new Date(row.delivery_date || Date.now()),
        rate: parseFloat(row.rate || '0'),
        miles: parseInt(row.miles || '0'),
        weight: parseInt(row.weight || '0'),
        organizationalContext: {
          companyId: row.company_id || '',
          terminalId: row.terminal_id || ''
        },
        createdAt: new Date(row.created_at || Date.now()),
        updatedAt: new Date(row.updated_at || Date.now())
      }));
    } catch (error) {
      console.error('❌ Error fetching loads from local PostgreSQL, returning empty array:', error);
      return [];
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
}
