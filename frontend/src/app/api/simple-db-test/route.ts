/**
 * Simple Connection Test API Route
 * Tests database connection with minimal query
 */

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
    
    // Simple connection test - just get current time
    const result = await sql`SELECT NOW() as current_time`;
    
    return NextResponse.json({ 
      success: true, 
      connected: true,
      currentTime: result.rows[0].current_time,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    // More detailed error information
    const errorInfo = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };

    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: errorInfo.message,
        errorName: errorInfo.name,
        details: errorInfo
      },
      { status: 500 }
    );
  }
}
