/**
 * API Route: Get Terminal Hierarchy
 * Returns the organizational hierarchy for a specific terminal
 */

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const terminalId = searchParams.get('terminalId');
  
  if (!terminalId) {
    return NextResponse.json(
      { success: false, error: 'Terminal ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const client = await pool.connect();
    
    try {      // Get the full organizational hierarchy for the terminal
      const result = await client.query(`
        SELECT 
          t.id as terminal_id,
          t.name as terminal_name,
          t.code as terminal_code,
          t.address,
          t.city,
          t.state,
          t.zip as zip_code,
          
          d.id as department_id,
          d.name as department_name,
          d.code as department_code,
          
          div.id as division_id,
          div.name as division_name,
          div.code as division_code,
          
          c.id as company_id,
          c.name as company_name
          
        FROM terminals t
        LEFT JOIN companies_department d ON t.department_id = d.id
        LEFT JOIN companies_division div ON d.division_id = div.id
        LEFT JOIN companies_company c ON div.company_id = c.id
        WHERE t.id = $1
      `, [terminalId]);
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Terminal not found' },
          { status: 404 }
        );
      }
      
      const row = result.rows[0];
        // Structure the hierarchy data
      const hierarchy = {
        company: {
          id: row.company_id,
          name: row.company_name,
          code: 'LAUNCH'
        },
        division: {
          id: row.division_id,
          name: row.division_name,
          code: row.division_code
        },
        department: {
          id: row.department_id,
          name: row.department_name,
          code: row.department_code
        },
        terminal: {
          id: row.terminal_id,
          name: row.terminal_name,
          code: row.terminal_code,
          address: row.address,
          city: row.city,
          state: row.state,
          zipCode: row.zip_code
        }
      };
      
      return NextResponse.json({
        success: true,
        hierarchy
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error getting terminal hierarchy:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
