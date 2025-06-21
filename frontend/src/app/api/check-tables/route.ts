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
    
    // Check structure of specific tables
    const tableStructures: any = {};
    
    for (const tableName of ['companies', 'divisions', 'departments', 'terminals']) {
      if (tables.includes(tableName)) {
        const columnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [tableName]);
        
        tableStructures[tableName] = {
          exists: true,
          columns: columnsResult.rows
        };
        
        // Get row count
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        tableStructures[tableName].rowCount = parseInt(countResult.rows[0].count);
      } else {
        tableStructures[tableName] = { exists: false };
      }
    }
    
    return NextResponse.json({
      success: true,
      allTables: tables,
      tableStructures
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    client.release();
  }
}
