/**
 * API Route: Debug Database Tables
 * Quick debugging endpoint to check table counts
 */

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.LOCAL_DB_HOST || 'localhost',
  port: parseInt(process.env.LOCAL_DB_PORT || '5432'),
  database: process.env.LOCAL_DB_NAME || 'launch_tms',
  user: process.env.LOCAL_DB_USER || 'postgres',
  password: process.env.LOCAL_DB_PASSWORD || 'postgres',
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    const results = {
      companies: 0,
      terminals: 0,
      divisions: 0,
      departments: 0,
      drivers: 0,
      trucks: 0,
      trailers: 0,
      loads: 0
    };

    // Get count for each table
    const tables = Object.keys(results);
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        results[table as keyof typeof results] = parseInt(result.rows[0].count);
      } catch (error) {
        console.error(`Error counting ${table}:`, error);
        results[table as keyof typeof results] = -1; // -1 indicates error
      }
    }
    
    client.release();
    
    return NextResponse.json({
      success: true,
      tableCounts: results
    });
  } catch (error) {
    console.error('Error checking database tables:', error);
    return NextResponse.json(
      { error: 'Failed to check database tables', success: false },
      { status: 500 }
    );
  }
}
