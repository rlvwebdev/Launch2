/**
 * Local PostgreSQL Database Connection Test
 * Tests connection to local PostgreSQL database
 */

import { NextResponse } from 'next/server';
import { LocalDatabaseManager } from '@/lib/local-database';

export async function GET() {
  try {
    console.log('🔌 Testing local PostgreSQL database connection...');
    
    const result = await LocalDatabaseManager.testConnection();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Local PostgreSQL database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Local PostgreSQL database connection failed - check logs for details'
      },
      { status: 200 }
    );
  }
}
