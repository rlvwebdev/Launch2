/**
 * Database Connection Test using createClient
 * Tests the alternative connection approach
 */

import { NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';

export async function GET() {
  try {
    console.log('Testing database connection with createClient...');
    
    // Create client with explicit connection string
    const client = createClient({
      connectionString: process.env.POSTGRES_URL!
    });
    
    // Simple connection test
    const result = await client.sql`SELECT NOW() as current_time`;
    
    return NextResponse.json({ 
      success: true, 
      connected: true,
      currentTime: result.rows[0].current_time,
      message: 'Database connection successful with createClient'
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    // More detailed error information
    const errorInfo = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code || 'NO_CODE'
    };

    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: errorInfo.message,
        errorName: errorInfo.name,
        errorCode: errorInfo.code,
        postgresUrl: process.env.POSTGRES_URL ? 'EXISTS' : 'MISSING'
      },
      { status: 500 }
    );
  }
}
