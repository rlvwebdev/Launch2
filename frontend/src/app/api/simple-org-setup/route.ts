import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.LOCAL_DB_HOST || 'localhost',
  port: parseInt(process.env.LOCAL_DB_PORT || '5432'),
  database: process.env.LOCAL_DB_NAME || 'launch_tms',
  user: process.env.LOCAL_DB_USER || 'launch_user',
  password: process.env.LOCAL_DB_PASSWORD || 'launch_password',
});

export async function POST() {
  const client = await pool.connect();
  
  try {
    console.log('🏢 Creating simple organizational structure...');
    
    // Get companies
    const companiesResult = await client.query('SELECT id, name FROM companies ORDER BY id');
    const companies = companiesResult.rows;
    
    if (companies.length === 0) {
      return NextResponse.json({ success: false, error: 'No companies found' });
    }
    
    // Create Transportation division for each company
    for (const company of companies) {
      // Create Transportation division
      const divResult = await client.query(
        'INSERT INTO divisions (name, code, company_id) VALUES ($1, $2, $3) RETURNING id',
        ['Transportation', 'TRANS', company.id]
      );
      const divisionId = divResult.rows[0].id;
      
      // Create Dry Bulk department
      await client.query(
        'INSERT INTO departments (name, code, division_id) VALUES ($1, $2, $3)',
        ['Dry Bulk', 'DRYBULK', divisionId]
      );
      
      console.log(`✅ Created Transportation > Dry Bulk for ${company.name}`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Created organizational structure for ${companies.length} companies`
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    client.release();
  }
}
