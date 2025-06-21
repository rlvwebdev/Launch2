/**
 * API Route: Generate Comprehensive Fake Data
 * Creates 700 trucks, 650 drivers, 1100 trailers, 3 companies, divisions, departments, 27 terminals, and loads
 */

import { NextResponse } from 'next/server';
import { DataGenerator } from '@/lib/data-generator';
import { BulkDataManager } from '@/lib/bulk-data-manager';

export async function POST() {
  try {
    console.log('🚀 Starting comprehensive data generation...');
      // Step 1: Initialize extended database schema
    console.log('📊 Setting up extended database schema...');
    await BulkDataManager.initializeExtendedDatabase();
    
    // Step 2: Clear existing data
    console.log('🧹 Clearing existing data...');
    await BulkDataManager.clearAllData();
    
    // Step 3: Create companies
    console.log('🏢 Creating 3 companies...');
    const companies = [
      {
        name: 'TransCore Logistics',
        code: 'TCL',
        address: '123 Transportation Way, Atlanta, GA 30309',
        phone: '404-555-0100',
        email: 'info@transcore.com'
      },
      {
        name: 'Highway Express',
        code: 'HEX',
        address: '456 Freight Blvd, Chicago, IL 60601',
        phone: '312-555-0200',
        email: 'contact@highwayexpress.com'
      },
      {
        name: 'FreightMaster Inc',
        code: 'FMI',
        address: '789 Logistics Lane, Dallas, TX 75201',
        phone: '214-555-0300',
        email: 'support@freightmaster.com'
      }
    ];
    await BulkDataManager.bulkInsertCompanies(companies);
    
    // Step 4: Create 27 terminals (9 per company)
    console.log('🏭 Creating 27 terminals...');
    const terminals = [];
    let terminalIndex = 0;
    for (let companyIndex = 0; companyIndex < 3; companyIndex++) {
      for (let i = 0; i < 9; i++) {
        const location = DataGenerator.terminals[terminalIndex % DataGenerator.terminals.length];
        const [city, state] = location.split(', ');
        terminals.push({
          name: `${companies[companyIndex].name} - ${city}`,
          code: `${companies[companyIndex].code}${String(i + 1).padStart(2, '0')}`,
          address: `${Math.floor(Math.random() * 9999) + 1000} Industrial Pkwy`,
          city,
          state,
          zip: `${Math.floor(Math.random() * 90000) + 10000}`,
          phone: DataGenerator.generatePhone(),
          company_id: companyIndex + 1
        });
        terminalIndex++;
      }
    }
    await BulkDataManager.bulkInsertTerminals(terminals);
      // Step 5: Create divisions
    console.log('🏗️ Creating divisions...');
    const divisionNames = ['Transport', 'Safety', 'Quality', 'Human Resources', 'Finance', 'Marketing', 'Legal'];
    const divisions: any[] = [];
    for (let companyIndex = 0; companyIndex < 3; companyIndex++) {
      divisionNames.forEach((divName, divIndex) => {
        divisions.push({
          name: divName,
          code: `${companies[companyIndex].code}_${divName.toUpperCase().replace(' ', '_')}`,
          company_id: companyIndex + 1
        });
      });
    }
    await BulkDataManager.bulkInsertDivisions(divisions);
    
    // Step 6: Create departments (only for Transport division)
    console.log('🏢 Creating departments...');
    const departments: any[] = [];
    const departmentNames = ['Liquid', 'Bulk'];
    for (let companyIndex = 0; companyIndex < 3; companyIndex++) {
      const transportDivisionId = (companyIndex * 7) + 1; // Transport is first division for each company
      departmentNames.forEach((deptName) => {
        departments.push({
          name: deptName,
          code: `${companies[companyIndex].code}_TRANSPORT_${deptName.toUpperCase()}`,
          division_id: transportDivisionId
        });
      });
    }
    await BulkDataManager.bulkInsertDepartments(departments);
    
    // Step 7: Generate 700 trucks (distributed evenly across terminals)
    console.log('🚛 Generating 700 trucks...');
    const trucks = [];
    const trucksPerTerminal = Math.floor(700 / 27);
    const extraTrucks = 700 % 27;
    
    let truckCount = 0;
    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9); // 9 terminals per company
      const trucksForThisTerminal = trucksPerTerminal + (terminalId <= extraTrucks ? 1 : 0);
      
      for (let i = 0; i < trucksForThisTerminal; i++) {
        trucks.push(DataGenerator.generateTruck(terminalId.toString(), companyId.toString()));
        truckCount++;
      }
    }
    await BulkDataManager.bulkInsertTrucks(trucks);
    
    // Step 8: Generate 650 drivers (distributed evenly across terminals)
    console.log('👥 Generating 650 drivers...');
    const drivers = [];
    const driversPerTerminal = Math.floor(650 / 27);
    const extraDrivers = 650 % 27;
    
    let driverCount = 0;
    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const driversForThisTerminal = driversPerTerminal + (terminalId <= extraDrivers ? 1 : 0);
      
      for (let i = 0; i < driversForThisTerminal; i++) {
        drivers.push(DataGenerator.generateDriver(terminalId.toString(), companyId.toString()));
        driverCount++;
      }
    }
    await BulkDataManager.bulkInsertDrivers(drivers);
    
    // Step 9: Generate 1100 trailers (distributed evenly across terminals)
    console.log('🚚 Generating 1100 trailers...');
    const trailers = [];
    const trailersPerTerminal = Math.floor(1100 / 27);
    const extraTrailers = 1100 % 27;
    
    let trailerCount = 0;
    for (let terminalId = 1; terminalId <= 27; terminalId++) {
      const companyId = Math.ceil(terminalId / 9);
      const trailersForThisTerminal = trailersPerTerminal + (terminalId <= extraTrailers ? 1 : 0);
      
      for (let i = 0; i < trailersForThisTerminal; i++) {
        trailers.push(DataGenerator.generateTrailer(terminalId.toString(), companyId.toString()));
        trailerCount++;
      }
    }
    await BulkDataManager.bulkInsertTrailers(trailers);
    
    // Step 10: Generate loads from Jan 1, 2025 to Jan 1, 2027
    console.log('📦 Generating loads for 2025-2027...');
    const loads = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2027-01-01');
    
    // Generate loads for each terminal for each month
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
          // Create a random date within the current month
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
          
          loads.push(load);
        }
      }
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    console.log(`📦 Generated ${loads.length} loads total`);
    await BulkDataManager.bulkInsertLoads(loads);
    
    console.log('✅ Comprehensive data generation completed successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Comprehensive fake data generated successfully',
      summary: {
        companies: 3,
        terminals: 27,
        divisions: 21, // 7 divisions × 3 companies
        departments: 6, // 2 departments × 3 companies
        trucks: truckCount,
        drivers: driverCount,
        trailers: trailerCount,
        loads: loads.length,
        timespan: '2025-01-01 to 2027-01-01'
      }
    });
  } catch (error) {
    console.error('❌ Comprehensive data generation failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Comprehensive data generation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
