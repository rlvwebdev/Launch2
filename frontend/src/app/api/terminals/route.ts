/**
 * API Route: Terminals
 * Handles terminal data operations using the database
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
    const result = await client.query('SELECT * FROM terminals ORDER BY id');
    client.release();

    const terminals = result.rows.map((row: any) => ({
      id: row.id.toString(),
      name: row.name || '',
      code: row.code || '',
      type: 'terminal',
      terminalCode: row.code || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      zipCode: row.zip_code || '',
      phone: row.phone || '',
      email: row.email || '',
      operationalStatus: 'operational', // Default status
      dockCount: parseInt(row.dock_count || '0'),
      capacity: {
        trucks: parseInt(row.capacity_trucks || '100'),
        trailers: parseInt(row.capacity_trailers || '150'),
        drivers: parseInt(row.capacity_drivers || '80')
      },
      coordinates: {
        lat: parseFloat(row.latitude || '0'),
        lng: parseFloat(row.longitude || '0')
      },
      companyId: row.company_id || '',
      divisionId: row.division_id || '',
      departmentId: row.department_id || '',
      createdAt: new Date(row.created_at || Date.now()),
      updatedAt: new Date(row.updated_at || Date.now())
    }));

    // Return in Django REST Framework paginated format expected by frontend
    return NextResponse.json({
      count: terminals.length,
      next: null,
      previous: null,
      results: terminals
    });
  } catch (error) {
    console.error('Error fetching terminals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch terminals', success: false },
      { status: 500 }
    );
  }
}
