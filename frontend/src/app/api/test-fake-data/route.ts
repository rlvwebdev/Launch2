/**
 * API Route: Test Fake Data Generation
 * Tests individual components of data generation
 */

import { NextResponse } from 'next/server';
import { DataGenerator } from '@/lib/data-generator';
import { BulkDataManager } from '@/lib/bulk-data-manager';

export async function POST() {
  try {
    console.log('🧪 Testing fake data generation components...');
    
    // Test 1: Initialize extended database schema
    console.log('📊 Step 1: Testing extended database schema...');
    await BulkDataManager.initializeExtendedDatabase();
    console.log('✅ Extended database schema test passed');
    
    // Test 2: Test data generation
    console.log('🔧 Step 2: Testing data generation...');
    const testTruck = DataGenerator.generateTruck('1', '1');
    const testDriver = DataGenerator.generateDriver('1', '1');
    const testTrailer = DataGenerator.generateTrailer('1', '1');
    const testLoad = DataGenerator.generateLoad('1', '1', new Date());
    
    console.log('✅ Data generation test passed');
    console.log('Sample truck:', testTruck);
    console.log('Sample driver:', testDriver);
    
    // Test 3: Test small bulk insert
    console.log('📦 Step 3: Testing bulk insert...');
    await BulkDataManager.clearAllData();
    
    const companies = [{
      name: 'Test Company',
      code: 'TEST',
      address: '123 Test St',
      phone: '555-0100',
      email: 'test@example.com'
    }];
    
    await BulkDataManager.bulkInsertCompanies(companies);
    console.log('✅ Bulk insert test passed');
    
    return NextResponse.json({
      success: true,
      message: 'All fake data generation tests passed',
      samples: {
        truck: testTruck,
        driver: testDriver,
        trailer: testTrailer,
        load: testLoad
      }
    });
  } catch (error) {
    console.error('❌ Fake data generation test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Fake data generation test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
