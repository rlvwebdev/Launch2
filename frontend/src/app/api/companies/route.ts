import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.LOCAL_DB_HOST || 'localhost',
  port: parseInt(process.env.LOCAL_DB_PORT || '5432'),
  database: process.env.LOCAL_DB_NAME || 'launch_tms',
  user: process.env.LOCAL_DB_USER || 'launch_user',
  password: process.env.LOCAL_DB_PASSWORD || 'launch_password',
});

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      // Try to get companies from the database
      const result = await client.query(`
        SELECT 
          id,
          name,
          code,
          address,
          phone,
          email,
          created_at,
          updated_at
        FROM companies 
        ORDER BY name
      `);

      const companies = result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        code: row.code,
        address: row.address,
        phone: row.phone,
        email: row.email,
        type: 'company',
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return NextResponse.json({
        success: true,
        count: companies.length,
        results: companies
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error, returning static companies:', error);
    
    // If database query fails, return static company data
    const staticCompanies = [
      {
        id: '1',
        name: 'TransCore Logistics',
        code: 'TRANS',
        address: '1000 Commerce St, Houston, TX 77002',
        phone: '(713) 555-0001',
        email: 'info@transcore.com',
        type: 'company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2', 
        name: 'Highway Express',
        code: 'HWEXPR',
        address: '2500 Interstate Dr, Dallas, TX 75201',
        phone: '(214) 555-0002',
        email: 'contact@highwayexpress.com',
        type: 'company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'FreightMaster Inc',
        code: 'FMAST',
        address: '3800 Logistics Blvd, Atlanta, GA 30309',
        phone: '(404) 555-0003',
        email: 'support@freightmaster.com',
        type: 'company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      count: staticCompanies.length,
      results: staticCompanies,
      note: 'Returned static company data due to database unavailability'
    });
  }
}
