/**
 * API Route: Test Corrected Truck Numbering
 * Tests the corrected truck numbering for years 2000-2009
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🧪 Testing corrected truck numbering for 2000-2009...');
    
    // Import DataGenerator
    const { DataGenerator } = await import('@/lib/data-generator');
    
    // Test truck numbering for years 2000-2009
    const testTrucks = [];
    
    // Test years 2000-2009 (should show 20-29)
    for (let year = 2000; year <= 2009; year++) {
      const truck = DataGenerator.generateTruck('1', '1', year - 1999); // Use year-1999 as purchase number
      testTrucks.push({
        year,
        truck_number: truck.truck_number,
        make: truck.make,
        model: truck.model
      });
    }
    
    // Test a few other years for comparison
    const truck2010 = DataGenerator.generateTruck('1', '1', 15);
    const truck2024 = DataGenerator.generateTruck('1', '1', 16);
    
    testTrucks.push({
      year: 2010,
      truck_number: truck2010.truck_number,
      make: truck2010.make,
      model: truck2010.model
    });
    
    testTrucks.push({
      year: 2024,
      truck_number: truck2024.truck_number,
      make: truck2024.make,
      model: truck2024.model
    });
    
    return NextResponse.json({
      success: true,
      message: 'Corrected truck numbering test completed',
      explanation: 'Years 2000-2009 should show 20-29, other years show last two digits',
      testTrucks
    });
  } catch (error) {
    console.error('❌ Truck numbering test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Truck numbering test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
