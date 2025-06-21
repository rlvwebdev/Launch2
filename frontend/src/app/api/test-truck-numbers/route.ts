/**
 * API Route: Test New Truck Numbers
 * Tests the new truck numbering scheme
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Testing new truck numbering scheme...');
    
    // Import DataGenerator
    const { DataGenerator } = await import('@/lib/data-generator');
    
    // Generate some sample trucks with the new numbering
    const sampleTrucks = [];
    for (let i = 1; i <= 10; i++) {
      const truck = DataGenerator.generateTruck('1', '1', i);
      sampleTrucks.push({
        truck_number: truck.truck_number,
        year: truck.year,
        make: truck.make,
        model: truck.model,
        transmission: truck.transmission
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'New truck numbering scheme test',
      explanation: {
        format: "First 2 digits = year (e.g., 24 for 2024), next 2 digits = purchase number, 'A' suffix for automatic transmission",
        examples: "2401 = 2024 truck, purchase #1, manual; 2402A = 2024 truck, purchase #2, automatic"
      },
      sampleTrucks
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
