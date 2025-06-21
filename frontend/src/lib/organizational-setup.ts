/**
 * Organizational Hierarchy Setup
 * Creates divisions and departments for the 3 companies based on division-structure.md
 */

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

// Division structure from division-structure.md
const DIVISIONS = [
  {
    name: 'Managed Solutions',
    code: 'MGDSOL',
    departments: []
  },
  {
    name: 'Transportation',
    code: 'TRANS',
    departments: [
      { name: 'Dry Bulk', code: 'DRYBULK' },
      { name: 'Liquid', code: 'LIQUID' },
      { name: 'Packaged', code: 'PACKAGE' },
      { name: 'Intermodal', code: 'INTERMOD' }
    ]
  },
  {
    name: 'Enhanced Services',
    code: 'ENHSVC',
    departments: []
  },
  {
    name: 'Distribution Centers',
    code: 'DISTCTR',
    departments: []
  },
  {
    name: 'Export/Import',
    code: 'EXPIMP',
    departments: []
  },
  {
    name: 'Human Resources',
    code: 'HR',
    departments: [
      { name: 'Employee Recruitment', code: 'EMPREC' },
      { name: 'Driver Recruitment', code: 'DRVREC' },
      { name: 'Benefits', code: 'BENEFITS' }
    ]
  },
  {
    name: 'EHSS (Environmental Health Safety & Security)',
    code: 'EHSS',
    departments: [
      { name: 'Environmental', code: 'ENV' },
      { name: 'Health', code: 'HEALTH' },
      { name: 'Safety', code: 'SAFETY' },
      { name: 'Security', code: 'SECURITY' }
    ]
  },
  {
    name: 'Quality Assurance',
    code: 'QA',
    departments: []
  },
  {
    name: 'Finance',
    code: 'FINANCE',
    departments: [
      { name: 'Billing', code: 'BILLING' },
      { name: 'Settlements', code: 'SETTLE' },
      { name: 'Accounts Payable', code: 'AP' }
    ]
  }
];

async function createOrganizationalHierarchy() {
  const client = await pool.connect();
  
  try {
    console.log('🏢 Creating organizational hierarchy...');
    
    // First, add department_id column to terminals table if it doesn't exist
    try {
      await client.query(`
        ALTER TABLE terminals 
        ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id)
      `);
      console.log('✅ Added department_id column to terminals table');
    } catch (error) {
      console.log('⚠️ Department_id column may already exist:', error);
    }
    
    // Get existing companies
    const companiesResult = await client.query('SELECT id, name FROM companies ORDER BY id');
    const companies = companiesResult.rows;
    
    if (companies.length === 0) {
      console.log('❌ No companies found. Please create companies first.');
      return;
    }
    
    console.log(`📋 Found ${companies.length} companies:`, companies.map(c => c.name));
    
    // For each company, create all divisions and departments
    for (const company of companies) {
      console.log(`\n🏢 Creating divisions for ${company.name} (ID: ${company.id})`);
      
      for (const division of DIVISIONS) {
        // Insert division
        const divisionResult = await client.query(
          'INSERT INTO divisions (name, code, company_id) VALUES ($1, $2, $3) RETURNING id',
          [division.name, division.code, company.id]
        );
        const divisionId = divisionResult.rows[0].id;
        console.log(`  📁 Created division: ${division.name} (ID: ${divisionId})`);
          // Insert departments for this division
        for (const department of division.departments) {
          const deptResult = await client.query(
            'INSERT INTO departments (name, code, division_id) VALUES ($1, $2, $3) RETURNING id',
            [department.name, department.code, divisionId]
          );
          const deptId = deptResult.rows[0].id;
          console.log(`    📂 Created department: ${department.name} (ID: ${deptId})`);
        }
      }
    }
    
    // Now assign all terminals to the "Dry Bulk" department within "Transportation"
    console.log('\n🏭 Assigning terminals to Dry Bulk department...');
      // Find the Dry Bulk departments
    const dryBulkDepts = await client.query(`
      SELECT d.id, d.name, c.name as company_name, div.name as division_name, div.company_id
      FROM departments d
      JOIN divisions div ON d.division_id = div.id  
      JOIN companies c ON div.company_id = c.id
      WHERE d.code = 'DRYBULK'
    `);
    
    console.log(`📋 Found ${dryBulkDepts.rows.length} Dry Bulk departments`);
    
    // Get all terminals
    const terminalsResult = await client.query('SELECT id, name FROM terminals');
    const terminals = terminalsResult.rows;
    
    console.log(`📋 Found ${terminals.length} terminals to assign`);
    
    // Distribute terminals evenly across the Dry Bulk departments
    for (let i = 0; i < terminals.length; i++) {
      const terminal = terminals[i];
      const deptIndex = i % dryBulkDepts.rows.length; // Round-robin assignment
      const dryBulkDept = dryBulkDepts.rows[deptIndex];
        // Update terminal with department and company assignment
      await client.query(
        'UPDATE terminals SET department_id = $1, company_id = $2 WHERE id = $3',
        [dryBulkDept.id, dryBulkDept.company_id, terminal.id]
      );
      
      console.log(`  🏭 Assigned ${terminal.name} to ${dryBulkDept.company_name} - ${dryBulkDept.division_name} - ${dryBulkDept.name}`);
    }
    
    console.log('\n✅ Organizational hierarchy created successfully!');
    
    // Display final structure
    console.log('\n📊 Final organizational structure:');
    const structureResult = await client.query(`
      SELECT 
        c.name as company,
        div.name as division,
        d.name as department,
        COUNT(t.id) as terminal_count
      FROM companies c
      LEFT JOIN divisions div ON c.id = div.company_id
      LEFT JOIN departments d ON div.id = d.division_id
      LEFT JOIN terminals t ON d.id = t.department_id
      GROUP BY c.id, c.name, div.id, div.name, d.id, d.name
      ORDER BY c.name, div.name, d.name
    `);
    
    for (const row of structureResult.rows) {
      const terminalInfo = row.terminal_count > 0 ? ` (${row.terminal_count} terminals)` : '';
      console.log(`${row.company} > ${row.division} > ${row.department || 'No departments'}${terminalInfo}`);
    }
    
  } catch (error) {
    console.error('❌ Error creating organizational hierarchy:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Export for use in API routes
export { createOrganizationalHierarchy, DIVISIONS };

// Run if called directly
if (require.main === module) {
  createOrganizationalHierarchy()
    .then(() => {
      console.log('🎉 Organizational hierarchy setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}
