/**
 * API Route: Comprehensive Fake Data Generation
 * Creates 700 trucks, 650 drivers, 1100 trailers, 3 companies, divisions, 27 terminals
 * Generates loads from Jan 2025 to Jan 2027 with max 10 open loads per month per terminal
 */

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST() {
  let pool: Pool | null = null;
  
  try {
    console.log('🚀 Starting comprehensive fake data generation...');
    
    // Import DataGenerator
    const { DataGenerator } = await import('@/lib/data-generator');
    
    // Create database pool
    pool = new Pool({
      user: process.env.LOCAL_POSTGRES_USER || 'postgres',
      host: process.env.LOCAL_POSTGRES_HOST || 'localhost',
      database: process.env.LOCAL_POSTGRES_DB || 'launch_tms',
      password: process.env.LOCAL_POSTGRES_PASSWORD || 'postgres',
      port: parseInt(process.env.LOCAL_POSTGRES_PORT || '5432'),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Helper function for database operations
    const runSQL = async (sql: string, params: any[] = []) => {
      const client = await pool!.connect();
      try {
        return await client.query(sql, params);
      } finally {
        client.release();
      }
    };

    // Step 1: Create extended database schema
    console.log('📊 Creating extended database schema...');
    
    await runSQL(`
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

    await runSQL(`
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

    await runSQL(`
      CREATE TABLE IF NOT EXISTS divisions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        company_id INTEGER REFERENCES companies(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await runSQL(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        division_id INTEGER REFERENCES divisions(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await runSQL(`
      CREATE TABLE IF NOT EXISTS trailers (
        id SERIAL PRIMARY KEY,
        trailer_number VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50) DEFAULT 'dry_bulk',
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
    try {
      await runSQL(`
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
    } catch (e) {
      console.log('Drivers table columns may already exist');
    }

    try {
      await runSQL(`
        ALTER TABLE trucks 
        ADD COLUMN IF NOT EXISTS mileage INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_maintenance DATE,
        ADD COLUMN IF NOT EXISTS next_maintenance_due DATE,
        ADD COLUMN IF NOT EXISTS registration_expiry DATE,
        ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
        ADD COLUMN IF NOT EXISTS terminal_id INTEGER,
        ADD COLUMN IF NOT EXISTS company_id INTEGER
      `);
    } catch (e) {
      console.log('Trucks table columns may already exist');
    }

    try {
      await runSQL(`
        ALTER TABLE loads 
        ADD COLUMN IF NOT EXISTS commodity VARCHAR(255),
        ADD COLUMN IF NOT EXISTS weight INTEGER,
        ADD COLUMN IF NOT EXISTS terminal_id INTEGER,
        ADD COLUMN IF NOT EXISTS company_id INTEGER
      `);
    } catch (e) {
      console.log('Loads table columns may already exist');
    }

    console.log('✅ Extended database schema created');

    // Step 2: Clear existing data
    console.log('🧹 Clearing existing data...');
    await runSQL('TRUNCATE TABLE loads, trailers, trucks, drivers, departments, divisions, terminals, companies RESTART IDENTITY CASCADE');

    // Step 3: Create 3 companies
    console.log('🏢 Creating 3 companies...');
    const companies = [
      { name: 'TransCore Logistics', code: 'TCL', address: '123 Transportation Way, Atlanta, GA 30309', phone: '404-555-0100', email: 'info@transcore.com' },
      { name: 'Highway Express', code: 'HEX', address: '456 Freight Blvd, Chicago, IL 60601', phone: '312-555-0200', email: 'contact@highwayexpress.com' },
      { name: 'FreightMaster Inc', code: 'FMI', address: '789 Logistics Lane, Dallas, TX 75201', phone: '214-555-0300', email: 'support@freightmaster.com' }
    ];

    for (const company of companies) {
      await runSQL(
        'INSERT INTO companies (name, code, address, phone, email) VALUES ($1, $2, $3, $4, $5)',
        [company.name, company.code, company.address, company.phone, company.email]
      );
    }

    // Step 4: Create 27 terminals (9 per company)
    console.log('🏭 Creating 27 terminals...');
    const terminalCities = [
      "Atlanta, GA", "Chicago, IL", "Dallas, TX", "Los Angeles, CA", "Memphis, TN",
      "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "Detroit, MI",
      "Jacksonville, FL", "Columbus, OH", "Fort Worth, TX", "Charlotte, NC", "Seattle, WA",
      "Denver, CO", "Boston, MA", "Nashville, TN", "Baltimore, MD", "Louisville, KY",
      "Portland, OR", "Las Vegas, NV", "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ",
      "Fresno, CA", "Sacramento, CA"
    ];

    for (let i = 0; i < 27; i++) {
      const companyId = Math.ceil((i + 1) / 9); // 9 terminals per company
      const city = terminalCities[i];
      const [cityName, state] = city.split(', ');
      
      await runSQL(
        'INSERT INTO terminals (name, code, address, city, state, zip, phone, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          `${cityName} Terminal`,
          `T${String(i + 1).padStart(3, '0')}`,
          `${1000 + i} Terminal Blvd`,
          cityName,
          state,
          `${10000 + i}`,
          `${Math.floor(Math.random() * 900) + 100}-555-${String(i).padStart(4, '0')}`,
          companyId
        ]
      );
    }

    // Step 5: Create divisions for each company
    console.log('🏢 Creating divisions...');
    const divisionNames = ['Transport', 'Safety', 'Quality', 'Human Resources', 'Finance', 'Marketing', 'Legal'];
    
    for (let companyId = 1; companyId <= 3; companyId++) {
      for (const divisionName of divisionNames) {
        await runSQL(
          'INSERT INTO divisions (name, code, company_id) VALUES ($1, $2, $3)',
          [divisionName, divisionName.substring(0, 3).toUpperCase(), companyId]
        );
      }
    }

    // Step 6: Create departments for Transport divisions
    console.log('🏢 Creating departments...');
    const transportDivisionResult = await runSQL('SELECT id FROM divisions WHERE name = $1', ['Transport']);
    
    for (const division of transportDivisionResult.rows) {
      await runSQL(
        'INSERT INTO departments (name, code, division_id) VALUES ($1, $2, $3)',
        ['Liquid', 'LIQ', division.id]
      );
      await runSQL(
        'INSERT INTO departments (name, code, division_id) VALUES ($1, $2, $3)',
        ['Bulk', 'BLK', division.id]
      );
    }    // Step 7: Generate 700 trucks (distributed across terminals)
    console.log('🚛 Generating 700 trucks...');
    const trucksPerTerminal = Math.floor(700 / 27);
    const extraTrucks = 700 % 27;
    let totalTrucks = 0;
    let globalPurchaseNumber = 1; // Global counter for purchase numbers

    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const trucksForTerminal = trucksPerTerminal + (terminalId <= extraTrucks ? 1 : 0);
      
      for (let i = 0; i < trucksForTerminal; i++) {
        const truck = DataGenerator.generateTruck(terminalId.toString(), companyId.toString(), globalPurchaseNumber);
        
        await runSQL(
          'INSERT INTO trucks (truck_number, make, model, year, vin, status, mileage, last_maintenance, next_maintenance_due, registration_expiry, insurance_expiry, terminal_id, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
          [truck.truck_number, truck.make, truck.model, truck.year, truck.vin, truck.status, truck.mileage, truck.last_maintenance, truck.next_maintenance_due, truck.registration_expiry, truck.insurance_expiry, truck.terminal_id, truck.company_id]
        );
        totalTrucks++;
        globalPurchaseNumber++;
      }
    }

    // Step 8: Generate 650 drivers (distributed across terminals)
    console.log('👥 Generating 650 drivers...');
    const driversPerTerminal = Math.floor(650 / 27);
    const extraDrivers = 650 % 27;
    let totalDrivers = 0;

    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const driversForTerminal = driversPerTerminal + (terminalId <= extraDrivers ? 1 : 0);
      
      for (let i = 0; i < driversForTerminal; i++) {
        const driver = DataGenerator.generateDriver(terminalId.toString(), companyId.toString());
        
        await runSQL(
          'INSERT INTO drivers (first_name, last_name, email, phone, license_number, license_expiry, status, driver_type, hire_date, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, terminal_id, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
          [driver.first_name, driver.last_name, driver.email, driver.phone, driver.license_number, driver.license_expiry, driver.status, driver.driver_type, driver.hire_date, driver.emergency_contact_name, driver.emergency_contact_phone, driver.emergency_contact_relationship, driver.terminal_id, driver.company_id]
        );
        totalDrivers++;
      }
    }

    // Step 9: Generate 1100 trailers (distributed across terminals)
    console.log('🚚 Generating 1100 trailers...');
    const trailersPerTerminal = Math.floor(1100 / 27);
    const extraTrailers = 1100 % 27;
    let totalTrailers = 0;

    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const trailersForTerminal = trailersPerTerminal + (terminalId <= extraTrailers ? 1 : 0);
      
      for (let i = 0; i < trailersForTerminal; i++) {
        const trailer = DataGenerator.generateTrailer(terminalId.toString(), companyId.toString());
        
        await runSQL(
          'INSERT INTO trailers (trailer_number, type, length, capacity, year, status, last_inspection, next_inspection_due, terminal_id, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          [trailer.trailer_number, trailer.type, trailer.length, trailer.capacity, trailer.year, trailer.status, trailer.last_inspection, trailer.next_inspection_due, trailer.terminal_id, trailer.company_id]
        );
        totalTrailers++;
      }
    }

    // Step 10: Generate loads from Jan 1, 2025 to Jan 1, 2027
    console.log('📦 Generating loads from Jan 2025 to Jan 2027...');
    let totalLoads = 0;
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2027-01-01');
    
    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      for (let terminalId = 1; terminalId <= 27; terminalId++) {
        const companyId = Math.ceil(terminalId / 9);
        
        // Generate 20-50 loads per terminal per month
        const loadsThisMonth = Math.floor(Math.random() * 31) + 20;
        let openLoadsThisMonth = 0;
        
        for (let i = 0; i < loadsThisMonth; i++) {
          const loadDate = new Date(year, month, Math.floor(Math.random() * 28) + 1);
          const load = DataGenerator.generateLoad(terminalId.toString(), companyId.toString(), loadDate);
          
          // Ensure no more than 10 open loads per month per terminal
          if (load.status === 'open') {
            if (openLoadsThisMonth < 10) {
              openLoadsThisMonth++;
            } else {
              load.status = 'covered';
            }
          }
          
          await runSQL(
            'INSERT INTO loads (load_number, shipper, consignee, pickup_location, delivery_location, pickup_date, delivery_date, rate, miles, status, commodity, weight, terminal_id, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
            [load.load_number, load.shipper, load.consignee, load.pickup_location, load.delivery_location, load.pickup_date, load.delivery_date, load.rate, load.miles, load.status, load.commodity, load.weight, load.terminal_id, load.company_id]
          );
          totalLoads++;
        }
      }
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    console.log('✅ Comprehensive data generation completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Comprehensive fake data generated successfully',
      summary: {
        companies: 3,
        terminals: 27,
        divisions: 21, // 7 divisions × 3 companies
        departments: 6, // 2 departments × 3 companies
        trucks: totalTrucks,
        drivers: totalDrivers,
        trailers: totalTrailers,
        loads: totalLoads,
        timespan: '2025-01-01 to 2027-01-01',
        truckDistribution: {
          peterbilt: '80%',
          freightliner: '10%',
          volvo: '5%',
          mack: '5%'
        },
        driverDistribution: {
          company_drivers: '90%',
          owner_operators: '10%'
        }
      }
    });
  } catch (error) {
    console.error('❌ Comprehensive data generation failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Comprehensive data generation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    // Clean up database connection
    if (pool) {
      await pool.end();
    }
  }
}
