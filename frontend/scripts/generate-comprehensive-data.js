#!/usr/bin/env node

/**
 * Comprehensive Fake Data Generation Script
 * Generates 700 trucks, 650 drivers, 1100 trailers, loads, etc.
 * Run with: node scripts/generate-comprehensive-data.js
 */

const { Pool } = require('pg');

// Database configuration
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

// Data Generation Functions
class DataGenerator {
  static companyNames = [
    "TransCore Logistics", "Highway Express", "FreightMaster Inc"
  ];

  static terminals = [
    "Atlanta, GA", "Chicago, IL", "Dallas, TX", "Los Angeles, CA", "Memphis, TN",
    "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "Detroit, MI",
    "Jacksonville, FL", "Columbus, OH", "Fort Worth, TX", "Charlotte, NC", "Seattle, WA",
    "Denver, CO", "Boston, MA", "Nashville, TN", "Baltimore, MD", "Louisville, KY",
    "Portland, OR", "Las Vegas, NV", "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ",
    "Fresno, CA", "Sacramento, CA"
  ];

  static truckData = {
    peterbilt: ["379", "389", "579", "567", "520", "359"],
    freightliner: ["Cascadia", "Columbia", "Century Class", "Coronado", "Argosy"],
    volvo: ["VNL", "VN", "VAH", "VHD", "VNM"],
    mack: ["Anthem", "Granite", "Pinnacle", "TerraPro", "LR"]
  };

  static firstNames = [
    "James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Charles",
    "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Joshua", "Kenneth",
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"
  ];

  static lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
  ];

  static cities = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
    "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"
  ];

  static commodities = [
    "Steel Coils", "Aluminum Ingots", "Copper Wire", "Paper Rolls", "Plastic Pellets",
    "Chemical Drums", "Food Grade Liquid", "Machinery Parts", "Construction Materials"
  ];

  static generateVIN() {
    const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
    let vin = "";
    for (let i = 0; i < 17; i++) {
      vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }    return vin;
  }

  static generateTruckNumber(year, purchaseNumber, isAutomatic) {
    // Format: first two digits = year, last two digits = purchase number, A suffix for automatic
    // Special handling for 2000-2009: use 20-29 instead of 00-09
    let yearSuffix;
    if (year >= 2000 && year <= 2009) {
      // For 2000-2009, use 20-29 instead of 00-09
      yearSuffix = (year - 1980).toString();
    } else {
      // For other years, use last two digits
      yearSuffix = year.toString().slice(-2);
    }
    
    const purchaseNumStr = String(purchaseNumber).padStart(2, '0');
    const automaticSuffix = isAutomatic ? 'A' : '';
    return `${yearSuffix}${purchaseNumStr}${automaticSuffix}`;
  }

  static generateTrailerNumber() {
    // Use timestamp and random number to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 9999);
    return `TRL${timestamp}${random}`;
  }

  static generateLoadNumber() {
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const seq = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
    return `LD${date}${seq}`;
  }

  static generatePhone() {
    const area = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `${area}-${exchange}-${number}`;
  }

  static generateEmail(firstName, lastName) {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  }

  static randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  static generateTruck(terminalId, companyId, purchaseNumber) {
    const rand = Math.random();
    let make, model;

    if (rand < 0.8) {
      make = "Peterbilt";
      model = this.randomElement(this.truckData.peterbilt);
    } else if (rand < 0.85) {
      make = "Volvo";
      model = this.randomElement(this.truckData.volvo);
    } else if (rand < 0.9) {
      make = "Mack";
      model = this.randomElement(this.truckData.mack);
    } else {
      make = "Freightliner";
      model = this.randomElement(this.truckData.freightliner);
    }

    const year = Math.floor(Math.random() * (2025 - 2008 + 1)) + 2008;
    const mileage = Math.floor(Math.random() * 800000) + 50000;

    // Determine if truck is automatic (70% chance for newer trucks, 30% for older)
    const isAutomatic = year >= 2015 ? Math.random() < 0.7 : Math.random() < 0.3;
    
    // Generate purchase number if not provided
    const truckPurchaseNumber = purchaseNumber || Math.floor(Math.random() * 99) + 1;

    return {
      truck_number: this.generateTruckNumber(year, truckPurchaseNumber, isAutomatic),
      make,
      model,
      year,
      vin: this.generateVIN(),
      status: this.randomElement(['available', 'in_transit', 'maintenance', 'assigned']),
      mileage,
      last_maintenance: this.randomDate(new Date('2024-01-01'), new Date()),
      next_maintenance_due: this.randomDate(new Date(), new Date('2025-12-31')),
      registration_expiry: this.randomDate(new Date(), new Date('2026-12-31')),
      insurance_expiry: this.randomDate(new Date(), new Date('2026-12-31')),
      terminal_id: terminalId,
      company_id: companyId,
      transmission: isAutomatic ? 'Automatic' : 'Manual'
    };
  }

  static generateDriver(terminalId, companyId) {
    const firstName = this.randomElement(this.firstNames);
    const lastName = this.randomElement(this.lastNames);
    const isOwnerOperator = Math.random() < 0.1; // 10% owner operators

    return {
      first_name: firstName,
      last_name: lastName,
      email: this.generateEmail(firstName, lastName),
      phone: this.generatePhone(),
      license_number: `${this.randomElement(["CA", "TX", "FL", "NY", "PA"])}${Math.floor(Math.random() * 9000000) + 1000000}`,
      license_expiry: this.randomDate(new Date(), new Date('2027-12-31')),
      status: this.randomElement(['available', 'on_duty', 'off_duty', 'driving']),
      driver_type: isOwnerOperator ? 'owner_operator' : 'company_driver',
      hire_date: this.randomDate(new Date('2020-01-01'), new Date()),
      emergency_contact_name: `${this.randomElement(this.firstNames)} ${this.randomElement(this.lastNames)}`,
      emergency_contact_phone: this.generatePhone(),
      emergency_contact_relationship: this.randomElement(['spouse', 'parent', 'sibling', 'friend']),
      terminal_id: terminalId,
      company_id: companyId
    };
  }

  static generateTrailer(terminalId, companyId) {
    return {
      trailer_number: this.generateTrailerNumber(),
      type: 'dry_bulk',
      length: 53,
      capacity: Math.floor(Math.random() * 20000) + 30000,
      year: Math.floor(Math.random() * (2025 - 2010 + 1)) + 2010,
      status: this.randomElement(['available', 'assigned', 'maintenance', 'loading']),
      last_inspection: this.randomDate(new Date('2024-01-01'), new Date()),
      next_inspection_due: this.randomDate(new Date(), new Date('2025-12-31')),
      terminal_id: terminalId,
      company_id: companyId
    };
  }

  static generateLoad(terminalId, companyId, loadDate) {
    const origin = this.randomElement(this.cities);
    const destination = this.randomElement(this.cities.filter(city => city !== origin));
    const commodity = this.randomElement(this.commodities);
    
    const pickupDate = new Date(loadDate);
    const deliveryDate = new Date(pickupDate);
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 1);
    
    const miles = Math.floor(Math.random() * 2000) + 100;
    const rate = (miles * (Math.random() * 1.5 + 1.8)) + Math.random() * 500;
    
    return {
      load_number: this.generateLoadNumber(),
      shipper: 'ABC Corp',
      consignee: 'XYZ Distribution',
      pickup_location: origin,
      delivery_location: destination,
      commodity,
      pickup_date: pickupDate,
      delivery_date: deliveryDate,
      rate: Math.round(rate * 100) / 100,
      miles,
      weight: Math.floor(Math.random() * 40000) + 10000,
      status: Math.random() < 0.9 ? 'covered' : 'open',
      terminal_id: terminalId,
      company_id: companyId
    };
  }
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive fake data generation...');
    
    const runSQL = async (sql, params = []) => {
      const client = await pool.connect();
      try {
        return await client.query(sql, params);
      } finally {
        client.release();
      }
    };    // Create all necessary tables with correct schema
    console.log('📊 Creating database schema...');    // Drop and recreate all tables to ensure correct schema
    await runSQL('DROP TABLE IF EXISTS trucks CASCADE');
    await runSQL('DROP TABLE IF EXISTS drivers CASCADE');
    await runSQL('DROP TABLE IF EXISTS companies CASCADE');
    await runSQL('DROP TABLE IF EXISTS terminals CASCADE');
    await runSQL('DROP TABLE IF EXISTS trailers CASCADE');
    
    await runSQL(`CREATE TABLE companies (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    await runSQL(`CREATE TABLE terminals (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(50),
      zip VARCHAR(20),
      phone VARCHAR(20),
      company_id INTEGER REFERENCES companies(id),
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    await runSQL(`CREATE TABLE trailers (
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
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    // Create trucks and drivers tables with extensions
    await runSQL(`CREATE TABLE trucks (
      id SERIAL PRIMARY KEY,
      truck_number VARCHAR(50) UNIQUE NOT NULL,
      make VARCHAR(50),
      model VARCHAR(50),
      year INTEGER,
      vin VARCHAR(50),
      status VARCHAR(20) DEFAULT 'available',
      terminal_id INTEGER,
      company_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    await runSQL(`CREATE TABLE drivers (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      license_number VARCHAR(50),
      status VARCHAR(20) DEFAULT 'available',
      terminal_id INTEGER,
      company_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    console.log('✅ Database schema created successfully');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await runSQL('TRUNCATE TABLE companies RESTART IDENTITY CASCADE');

    // Generate companies
    console.log('🏢 Creating 3 companies...');
    const companies = [
      { name: 'TransCore Logistics', code: 'TCL', address: '123 Transportation Way, Atlanta, GA', phone: '404-555-0100', email: 'info@transcore.com' },
      { name: 'Highway Express', code: 'HEX', address: '456 Freight Blvd, Chicago, IL', phone: '312-555-0200', email: 'contact@highway.com' },
      { name: 'FreightMaster Inc', code: 'FMI', address: '789 Logistics Lane, Dallas, TX', phone: '214-555-0300', email: 'support@freight.com' }
    ];

    for (const company of companies) {
      await runSQL('INSERT INTO companies (name, code, address, phone, email) VALUES ($1, $2, $3, $4, $5)',
        [company.name, company.code, company.address, company.phone, company.email]);
    }

    // Generate terminals
    console.log('🏭 Creating 27 terminals...');
    for (let i = 0; i < 27; i++) {
      const companyId = Math.ceil((i + 1) / 9);
      const city = DataGenerator.terminals[i];
      const [cityName, state] = city.split(', ');
      
      await runSQL('INSERT INTO terminals (name, code, address, city, state, zip, phone, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [`${cityName} Terminal`, `T${String(i + 1).padStart(3, '0')}`, `${1000 + i} Terminal Blvd`, cityName, state, `${10000 + i}`, DataGenerator.generatePhone(), companyId]);
    }    let totalTrucks = 0, totalDrivers = 0, totalTrailers = 0;
    let globalPurchaseNumber = 1; // Global counter for purchase numbers

    // Generate trucks in batches
    console.log('🚛 Generating 700 trucks...');
    const trucksPerTerminal = Math.floor(700 / 27);
    const extraTrucks = 700 % 27;

    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const trucksForTerminal = trucksPerTerminal + (terminalId <= extraTrucks ? 1 : 0);
      
      for (let i = 0; i < trucksForTerminal; i++) {
        const truck = DataGenerator.generateTruck(terminalId, companyId, globalPurchaseNumber);
        
        await runSQL(`INSERT INTO trucks (truck_number, make, model, year, vin, status, terminal_id, company_id) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [truck.truck_number, truck.make, truck.model, truck.year, truck.vin, truck.status, truck.terminal_id, truck.company_id]);
        totalTrucks++;
        globalPurchaseNumber++;
      }
      
      if (terminalId % 5 === 0) {
        console.log(`  Generated trucks for ${terminalId}/27 terminals (${totalTrucks} trucks so far)`);
      }
    }

    // Generate drivers
    console.log('👥 Generating 650 drivers...');
    const driversPerTerminal = Math.floor(650 / 27);
    const extraDrivers = 650 % 27;

    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const driversForTerminal = driversPerTerminal + (terminalId <= extraDrivers ? 1 : 0);
      
      for (let i = 0; i < driversForTerminal; i++) {
        const driver = DataGenerator.generateDriver(terminalId, companyId);
        
        await runSQL(`INSERT INTO drivers (first_name, last_name, email, phone, license_number, status, terminal_id, company_id) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [driver.first_name, driver.last_name, driver.email, driver.phone, driver.license_number, driver.status, driver.terminal_id, driver.company_id]);
        totalDrivers++;
      }
      
      if (terminalId % 5 === 0) {
        console.log(`  Generated drivers for ${terminalId}/27 terminals (${totalDrivers} drivers so far)`);
      }
    }

    // Generate trailers
    console.log('🚚 Generating 1100 trailers...');
    const trailersPerTerminal = Math.floor(1100 / 27);
    const extraTrailers = 1100 % 27;

    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const trailersForTerminal = trailersPerTerminal + (terminalId <= extraTrailers ? 1 : 0);
      
      for (let i = 0; i < trailersForTerminal; i++) {
        const trailer = DataGenerator.generateTrailer(terminalId, companyId);
        
        await runSQL(`INSERT INTO trailers (trailer_number, type, length, capacity, year, status, last_inspection, next_inspection_due, terminal_id, company_id) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [trailer.trailer_number, trailer.type, trailer.length, trailer.capacity, trailer.year, trailer.status, trailer.last_inspection, trailer.next_inspection_due, trailer.terminal_id, trailer.company_id]);
        totalTrailers++;
      }
      
      if (terminalId % 5 === 0) {
        console.log(`  Generated trailers for ${terminalId}/27 terminals (${totalTrailers} trailers so far)`);
      }
    }

    console.log('✅ Data generation completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Companies: 3`);
    console.log(`   Terminals: 27`);
    console.log(`   Trucks: ${totalTrucks} (80% Peterbilt, 10% Freightliner, 5% Volvo, 5% Mack)`);
    console.log(`   Drivers: ${totalDrivers} (90% company drivers, 10% owner operators)`);
    console.log(`   Trailers: ${totalTrailers} (all dry bulk)`);
    console.log(`   Load generation can be added separately due to volume`);

  } catch (error) {
    console.error('❌ Data generation failed:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { DataGenerator };
