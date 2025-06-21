import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.LOCAL_DB_HOST || 'localhost',
  port: parseInt(process.env.LOCAL_DB_PORT || '5432'),
  database: process.env.LOCAL_DB_NAME || 'launch_tms',
  user: process.env.LOCAL_DB_USER || 'launch_user',
  password: process.env.LOCAL_DB_PASSWORD || 'launch_password',
});

export async function GET() {
  const client = await pool.connect();
  
  try {
    // Check what tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    // Check if divisions table has data
    let divisionsData = [];
    let departmentsData = [];
    
    if (tables.includes('divisions')) {
      const divisionsResult = await client.query('SELECT * FROM divisions LIMIT 5');
      divisionsData = divisionsResult.rows;
    }
    
    if (tables.includes('departments')) {
      const departmentsResult = await client.query('SELECT * FROM departments LIMIT 5');
      departmentsData = departmentsResult.rows;
    }
    
    return NextResponse.json({
      success: true,
      tables,
      divisionsCount: divisionsData.length,
      departmentsCount: departmentsData.length,
      sampleDivisions: divisionsData,
      sampleDepartments: departmentsData
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    client.release();
  }
}
