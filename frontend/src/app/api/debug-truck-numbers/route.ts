/**
 * Simple test to debug truck numbering
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Import DataGenerator
    const { DataGenerator } = await import('@/lib/data-generator');
    
    // Test specific years with known purchase numbers
    const tests = [
      { year: 2000, purchaseNum: 1, expectedPrefix: "20" },
      { year: 2005, purchaseNum: 2, expectedPrefix: "25" },
      { year: 2009, purchaseNum: 3, expectedPrefix: "29" },
      { year: 2010, purchaseNum: 4, expectedPrefix: "10" },
      { year: 2024, purchaseNum: 5, expectedPrefix: "24" }
    ];
    
    const results = tests.map(test => {
      // Test both automatic and manual
      const truckAuto = {
        year: test.year,
        purchase: test.purchaseNum,
        isAutomatic: true,
        truckNumber: DataGenerator.generateTruckNumber(test.year, test.purchaseNum, true),
        expected: `${test.expectedPrefix}${String(test.purchaseNum).padStart(2, '0')}A`
      };
      
      const truckManual = {
        year: test.year,
        purchase: test.purchaseNum + 10,
        isAutomatic: false,
        truckNumber: DataGenerator.generateTruckNumber(test.year, test.purchaseNum + 10, false),
        expected: `${test.expectedPrefix}${String(test.purchaseNum + 10).padStart(2, '0')}`
      };
      
      return {
        automatic: truckAuto,
        manual: truckManual
      };
    });
    
    return NextResponse.json({
      success: true,
      message: 'Truck numbering debug test',
      results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
