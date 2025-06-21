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
    console.log('🔧 Ensuring organizational tables exist...');
    
    // Create divisions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS divisions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        company_id INTEGER REFERENCES companies(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Divisions table ensured');
    
    // Create departments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        division_id INTEGER REFERENCES divisions(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Departments table ensured');
    
    // Add department_id to terminals if it doesn't exist
    await client.query(`
      ALTER TABLE terminals 
      ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id)
    `);
    console.log('✅ Department_id column added to terminals');
    
    // Now create organizational structure
    const companiesResult = await client.query('SELECT id, name FROM companies ORDER BY id');
    const companies = companiesResult.rows;
    
    console.log(`📋 Found ${companies.length} companies`);
    
    for (const company of companies) {
      // Create Transportation division
      const divResult = await client.query(
        `INSERT INTO divisions (name, code, company_id) VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING RETURNING id`,
        ['Transportation', 'TRANS', company.id]
      );
      
      let divisionId;
      if (divResult.rows.length > 0) {
        divisionId = divResult.rows[0].id;
        console.log(`✅ Created Transportation division for ${company.name}`);
      } else {
        // Division already exists, get its ID
        const existingDiv = await client.query(
          'SELECT id FROM divisions WHERE code = $1 AND company_id = $2',
          ['TRANS', company.id]
        );
        divisionId = existingDiv.rows[0].id;
        console.log(`ℹ️ Transportation division already exists for ${company.name}`);
      }
      
      // Create Dry Bulk department
      await client.query(
        `INSERT INTO departments (name, code, division_id) VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`,
        ['Dry Bulk', 'DRYBULK', divisionId]
      );
      console.log(`✅ Created Dry Bulk department for ${company.name}`);
    }
    
    // Count terminals and assign them to Dry Bulk departments
    const terminalsResult = await client.query('SELECT COUNT(*) as count FROM terminals');
    const terminalCount = parseInt(terminalsResult.rows[0].count);
    
    console.log(`📋 Found ${terminalCount} terminals to assign`);
    
    if (terminalCount > 0) {
      // Get Dry Bulk departments
      const dryBulkDepts = await client.query(`
        SELECT d.id, c.name as company_name, div.company_id
        FROM departments d
        JOIN divisions div ON d.division_id = div.id  
        JOIN companies c ON div.company_id = c.id
        WHERE d.code = 'DRYBULK'
      `);
      
      console.log(`📋 Found ${dryBulkDepts.rows.length} Dry Bulk departments`);
      
      // Get all terminals
      const terminals = await client.query('SELECT id, name FROM terminals');
      
      // Assign terminals to departments
      for (let i = 0; i < terminals.rows.length; i++) {
        const terminal = terminals.rows[i];
        const deptIndex = i % dryBulkDepts.rows.length;
        const dryBulkDept = dryBulkDepts.rows[deptIndex];
        
        await client.query(
          'UPDATE terminals SET department_id = $1, company_id = $2 WHERE id = $3',
          [dryBulkDept.id, dryBulkDept.company_id, terminal.id]
        );
        
        console.log(`🏭 Assigned ${terminal.name} to ${dryBulkDept.company_name} - Dry Bulk`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Organizational structure created for ${companies.length} companies with ${terminalCount} terminals assigned`
    });
    
  } catch (error) {
    console.error('Error creating organizational structure:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    client.release();
  }
}
