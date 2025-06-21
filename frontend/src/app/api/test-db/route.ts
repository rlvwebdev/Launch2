/**
 * Database Connection Test
 * Simple test to verify database connectivity
 */

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout (5s)')), 5000)
    );
    
    const dbPromise = sql`SELECT NOW() as current_time, version() as postgres_version`;
    
    const { rows } = await Promise.race([dbPromise, timeoutPromise]) as any;
    
    console.log('✅ Database connection successful');
    return NextResponse.json({ 
      success: true, 
      connected: true,
      currentTime: rows[0].current_time,
      postgresVersion: rows[0].postgres_version,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Database connection failed - check logs for details'
      },
      { status: 200 } // Return 200 instead of 500 to prevent client errors
    );
  }
}
