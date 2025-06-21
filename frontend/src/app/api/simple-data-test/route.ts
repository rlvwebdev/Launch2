/**
 * API Route: Simple Data Test
 * Minimal test to isolate the issue
 */

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST() {
  try {
    console.log('🧪 Testing PostgreSQL connection directly...');
    
    // Test direct pool connection
    const pool = new Pool({
      user: process.env.LOCAL_POSTGRES_USER || 'postgres',
      host: process.env.LOCAL_POSTGRES_HOST || 'localhost', 
      database: process.env.LOCAL_POSTGRES_DB || 'launch_tms',
      password: process.env.LOCAL_POSTGRES_PASSWORD || 'postgres',
      port: parseInt(process.env.LOCAL_POSTGRES_PORT || '5432'),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    await pool.end();
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Direct PostgreSQL connection works',
        timestamp: result.rows[0].now
      }
    });
  } catch (error) {
    console.error('❌ Direct PostgreSQL test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Direct PostgreSQL test failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
