/**
 * API Route: Generate Sample Loads
 * Creates a small number of sample loads for testing
 */

import { NextResponse } from 'next/server';
import { DataGenerator } from '@/lib/data-generator';
import { LocalDatabaseManager } from '@/lib/local-database';

export async function POST() {
  try {
    console.log('🚚 Generating sample loads...');
    
    const sampleLoads: any[] = [];
    
    // Generate 10 sample loads for testing
    for (let i = 0; i < 10; i++) {
      const loadDate = new Date();
      loadDate.setDate(loadDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
      
      const load = DataGenerator.generateLoad('1', '1', loadDate);
      sampleLoads.push(load);
    }
    
    // Insert loads into database
    await LocalDatabaseManager.bulkInsertLoads(sampleLoads);
    
    console.log(`✅ Generated ${sampleLoads.length} sample loads`);
    
    return NextResponse.json({
      success: true,
      message: `Generated ${sampleLoads.length} sample loads`,
      count: sampleLoads.length
    });
  } catch (error) {
    console.error('❌ Error generating sample loads:', error);
    return NextResponse.json(
      { error: 'Failed to generate sample loads', success: false },
      { status: 500 }
    );
  }
}
