/**
 * Native Database Connection Test
 * Tests database connectivity using native pg client
 */

import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  try {
    // Test environment variables
    const connectionString = process.env.POSTGRES_URL;
    
    if (!connectionString) {
      return NextResponse.json(
        { 
          success: false, 
          connected: false,
          error: 'No POSTGRES_URL environment variable found',
          env: {
            POSTGRES_URL: !!process.env.POSTGRES_URL,
            SUPABASE_URL: !!process.env.SUPABASE_URL,
            NODE_ENV: process.env.NODE_ENV
          }
        },
        { status: 500 }
      );
    }    // Test connection using native postgres
    const client = new Client({ connectionString });
    
    await client.connect();
    const result = await client.query('SELECT NOW() as current_time');
    await client.end();
    
    return NextResponse.json({ 
      success: true, 
      connected: true,
      currentTime: result.rows[0].current_time,
      message: 'Database connection successful with pg client',
      connectionHost: connectionString.split('@')[1]?.split(':')[0] || 'unknown'
    });
  } catch (error) {
    console.error('Native database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        env: {
          POSTGRES_URL: !!process.env.POSTGRES_URL,
          SUPABASE_URL: !!process.env.SUPABASE_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      },
      { status: 500 }
    );
  }
}
