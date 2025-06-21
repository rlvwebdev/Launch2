/**
 * API Route: Test Small Data Generation  
 * Creates a small sample to test the approach
 */

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST() {
  let pool: Pool | null = null;
  
  try {
    console.log('🧪 Starting small test data generation...');
    
    // Import DataGenerator
    const { DataGenerator } = await import('@/lib/data-generator');
    
    // Create database pool
    pool = new Pool({
      user: process.env.LOCAL_POSTGRES_USER || 'postgres',
      host: process.env.LOCAL_POSTGRES_HOST || 'localhost',
      database: process.env.LOCAL_POSTGRES_DB || 'launch_tms',
      password: process.env.LOCAL_POSTGRES_PASSWORD || 'postgres',
      port: parseInt(process.env.LOCAL_POSTGRES_PORT || '5432'),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Helper function for database operations
    const runSQL = async (sql: string, params: any[] = []) => {
      const client = await pool!.connect();
      try {
        return await client.query(sql, params);
      } finally {
        client.release();
      }
    };

    // Create companies table if not exists
    await runSQL(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Clear and insert 1 test company
    await runSQL('TRUNCATE TABLE companies RESTART IDENTITY CASCADE');
    await runSQL(
      'INSERT INTO companies (name, code, address, phone, email) VALUES ($1, $2, $3, $4, $5)',
      ['Test Company', 'TEST', '123 Test St', '555-0100', 'test@example.com']
    );

    // Generate 5 test trucks
    const trucks = [];
    for (let i = 0; i < 5; i++) {
      trucks.push(DataGenerator.generateTruck('1', '1'));
    }

    // Generate 3 test drivers
    const drivers = [];
    for (let i = 0; i < 3; i++) {
      drivers.push(DataGenerator.generateDriver('1', '1'));
    }

    console.log('✅ Small test data generation completed');

    return NextResponse.json({
      success: true,
      message: 'Small test data generation completed',
      summary: {
        companies: 1,
        trucks: trucks.length,
        drivers: drivers.length,
        sampleTruck: trucks[0],
        sampleDriver: drivers[0]
      }
    });
  } catch (error) {
    console.error('❌ Small test data generation failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Small test data generation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}
