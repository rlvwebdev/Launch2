/**
 * Fake Data Generation Utilities for Launch TMS
 * Generates realistic transportation industry data
 */

export class DataGenerator {
  // US Transportation Company Names
  static companyNames = [
    "TransCore Logistics", "Highway Express", "FreightMaster Inc"
  ];

  // US Terminal Cities (27 major transportation hubs)
  static terminals = [
    "Atlanta, GA", "Chicago, IL", "Dallas, TX", "Los Angeles, CA", "Memphis, TN",
    "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "Detroit, MI",
    "Jacksonville, FL", "Columbus, OH", "Fort Worth, TX", "Charlotte, NC", "Seattle, WA",
    "Denver, CO", "Boston, MA", "Nashville, TN", "Baltimore, MD", "Louisville, KY",
    "Portland, OR", "Las Vegas, NV", "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ",
    "Fresno, CA", "Sacramento, CA"
  ];

  // Truck manufacturers with models
  static truckData = {
    peterbilt: ["379", "389", "579", "567", "520", "359"],
    freightliner: ["Cascadia", "Columbia", "Century Class", "Coronado", "Argosy"],
    volvo: ["VNL", "VN", "VAH", "VHD", "VNM"],
    mack: ["Anthem", "Granite", "Pinnacle", "TerraPro", "LR"]
  };

  // Driver names (realistic US names)
  static firstNames = [
    "James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Charles",
    "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Joshua", "Kenneth",
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Lisa", "Nancy", "Betty", "Dorothy", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Margaret"
  ];

  static lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
  ];

  // Load origins and destinations
  static cities = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
    "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
    "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
    "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Boston, MA",
    "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK", "Portland, OR",
    "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI"
  ];

  static commodities = [
    "Steel Coils", "Aluminum Ingots", "Copper Wire", "Paper Rolls", "Plastic Pellets",
    "Chemical Drums", "Food Grade Liquid", "Machinery Parts", "Construction Materials",
    "Electronics", "Automotive Parts", "Pharmaceuticals", "Textiles", "Agricultural Products"
  ];

  static generateVIN(): string {
    const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
    let vin = "";
    for (let i = 0; i < 17; i++) {
      vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return vin;
  }

  static generateLicenseNumber(): string {
    const state = ["CA", "TX", "FL", "NY", "PA", "IL", "OH", "GA", "NC", "MI"][Math.floor(Math.random() * 10)];
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `${state}${number}`;
  }  static generateTruckNumber(year: number, purchaseNumber: number, isAutomatic: boolean): string {
    // Format: first two digits = year, last two digits = purchase number, A suffix for automatic
    // Special handling for 2000-2009: use 20-29 instead of 00-09
    let yearSuffix: string;
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

  static generateTrailerNumber(): string {
    return `TRL${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
  }

  static generateLoadNumber(): string {
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `LD${date}${seq}`;
  }

  static generatePhone(): string {
    const area = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `${area}-${exchange}-${number}`;
  }

  static generateEmail(firstName: string, lastName: string): string {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "email.com"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  }

  static randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  static generateTruck(terminalId: string, companyId: string, purchaseNumber?: number): any {
    const rand = Math.random();
    let make: string, model: string;

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
    const lastMaintenance = this.randomDate(new Date('2024-01-01'), new Date());
    const nextMaintenance = new Date(lastMaintenance);
    nextMaintenance.setDate(nextMaintenance.getDate() + (Math.floor(Math.random() * 90) + 30));

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
      last_maintenance: lastMaintenance,
      next_maintenance_due: nextMaintenance,
      registration_expiry: this.randomDate(new Date(), new Date('2026-12-31')),
      insurance_expiry: this.randomDate(new Date(), new Date('2026-12-31')),
      terminal_id: terminalId,
      company_id: companyId,
      transmission: isAutomatic ? 'Automatic' : 'Manual'
    };
  }

  static generateDriver(terminalId: string, companyId: string): any {
    const firstName = this.randomElement(this.firstNames);
    const lastName = this.randomElement(this.lastNames);
    const isOwnerOperator = Math.random() < 0.1; // 10% owner operators

    const hireDate = this.randomDate(new Date('2020-01-01'), new Date());
    const licenseExpiry = this.randomDate(new Date(), new Date('2027-12-31'));

    return {
      first_name: firstName,
      last_name: lastName,
      email: this.generateEmail(firstName, lastName),
      phone: this.generatePhone(),
      license_number: this.generateLicenseNumber(),
      license_expiry: licenseExpiry,
      status: this.randomElement(['available', 'on_duty', 'off_duty', 'driving']),
      driver_type: isOwnerOperator ? 'owner_operator' : 'company_driver',
      hire_date: hireDate,
      emergency_contact_name: `${this.randomElement(this.firstNames)} ${this.randomElement(this.lastNames)}`,
      emergency_contact_phone: this.generatePhone(),
      emergency_contact_relationship: this.randomElement(['spouse', 'parent', 'sibling', 'friend']),
      terminal_id: terminalId,
      company_id: companyId
    };
  }

  static generateTrailer(terminalId: string, companyId: string): any {
    const trailerTypes = ['dry_van', 'flatbed', 'refrigerated', 'tanker', 'bulk'];
    const type = 'bulk'; // As requested - all dry bulk trailers
    
    return {
      trailer_number: this.generateTrailerNumber(),
      type,
      length: 53, // Standard length
      capacity: Math.floor(Math.random() * 20000) + 30000, // 30-50k lbs capacity
      year: Math.floor(Math.random() * (2025 - 2010 + 1)) + 2010,
      status: this.randomElement(['available', 'assigned', 'maintenance', 'loading', 'unloading']),
      last_inspection: this.randomDate(new Date('2024-01-01'), new Date()),
      next_inspection_due: this.randomDate(new Date(), new Date('2025-12-31')),
      terminal_id: terminalId,
      company_id: companyId
    };
  }

  static generateLoad(terminalId: string, companyId: string, loadDate: Date): any {
    const origin = this.randomElement(this.cities);
    const destination = this.randomElement(this.cities.filter(city => city !== origin));
    const commodity = this.randomElement(this.commodities);
    
    const pickupDate = new Date(loadDate);
    pickupDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    const deliveryDate = new Date(pickupDate);
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 1); // 1-5 days transit
    
    const miles = Math.floor(Math.random() * 2000) + 100; // 100-2100 miles
    const rate = (miles * (Math.random() * 1.5 + 1.8)) + Math.random() * 500; // $1.80-$3.30/mile + extras
    
    // 90% covered, 10% open (within monthly limit)
    const status = Math.random() < 0.9 ? 'covered' : 'open';
    
    return {
      load_number: this.generateLoadNumber(),
      shipper: `${this.randomElement(['ABC Corp', 'XYZ Industries', 'Global Supply', 'Premier Logistics', 'National Freight'])}`,
      consignee: `${this.randomElement(['Metro Distribution', 'City Warehouse', 'Regional Depot', 'Central Hub', 'Local Terminal'])}`,
      pickup_location: origin,
      delivery_location: destination,
      commodity,
      pickup_date: pickupDate,
      delivery_date: deliveryDate,
      rate: Math.round(rate * 100) / 100,
      miles,
      weight: Math.floor(Math.random() * 40000) + 10000, // 10-50k lbs
      status,
      terminal_id: terminalId,
      company_id: companyId
    };
  }
}
