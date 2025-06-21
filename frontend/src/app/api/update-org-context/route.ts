/**
 * API Route: Update Organizational Context
 * Updates existing data to have proper organizational context
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

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Updating organizational context for existing data...');
    
    // Get all terminals with their organizational relationships
    const terminalsResult = await client.query(`
      SELECT 
        t.id as terminal_id,
        t.name as terminal_name,
        d.id as department_id,
        div.id as division_id,
        c.id as company_id
      FROM terminals t
      LEFT JOIN departments d ON t.department_id = d.id
      LEFT JOIN divisions div ON d.division_id = div.id
      LEFT JOIN companies c ON div.company_id = c.id
      WHERE t.department_id IS NOT NULL
      ORDER BY t.id
    `);
    
    const terminals = terminalsResult.rows;
    console.log(`📋 Found ${terminals.length} terminals with organizational context`);
    
    if (terminals.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No terminals with organizational context found. Run organizational setup first.' 
      });
    }
    
    // Update drivers
    const driversResult = await client.query('SELECT COUNT(*) as count FROM drivers WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
    const driversToUpdate = parseInt(driversResult.rows[0].count);
    
    console.log(`👥 Updating ${driversToUpdate} drivers...`);
    
    if (driversToUpdate > 0) {
      // Get all drivers that need updating
      const driversListResult = await client.query('SELECT id FROM drivers WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
      
      for (let i = 0; i < driversListResult.rows.length; i++) {
        const driverId = driversListResult.rows[i].id;
        const terminal = terminals[i % terminals.length]; // Round-robin assignment
        
        const orgContext = {
          companyId: terminal.company_id.toString(),
          divisionId: terminal.division_id.toString(),
          departmentId: terminal.department_id.toString(),
          terminalId: terminal.terminal_id.toString()
        };
        
        await client.query(
          'UPDATE drivers SET organizational_context = $1 WHERE id = $2',
          [JSON.stringify(orgContext), driverId]
        );
      }
    }
    
    // Update trucks
    const trucksResult = await client.query('SELECT COUNT(*) as count FROM trucks WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
    const trucksToUpdate = parseInt(trucksResult.rows[0].count);
    
    console.log(`🚛 Updating ${trucksToUpdate} trucks...`);
    
    if (trucksToUpdate > 0) {
      const trucksListResult = await client.query('SELECT id FROM trucks WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
      
      for (let i = 0; i < trucksListResult.rows.length; i++) {
        const truckId = trucksListResult.rows[i].id;
        const terminal = terminals[i % terminals.length];
        
        const orgContext = {
          companyId: terminal.company_id.toString(),
          divisionId: terminal.division_id.toString(),
          departmentId: terminal.department_id.toString(),
          terminalId: terminal.terminal_id.toString()
        };
        
        await client.query(
          'UPDATE trucks SET organizational_context = $1 WHERE id = $2',
          [JSON.stringify(orgContext), truckId]
        );
      }
    }
    
    // Update trailers (if table exists)
    try {
      const trailersResult = await client.query('SELECT COUNT(*) as count FROM trailers WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
      const trailersToUpdate = parseInt(trailersResult.rows[0].count);
      
      console.log(`🚌 Updating ${trailersToUpdate} trailers...`);
      
      if (trailersToUpdate > 0) {
        const trailersListResult = await client.query('SELECT id FROM trailers WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
        
        for (let i = 0; i < trailersListResult.rows.length; i++) {
          const trailerId = trailersListResult.rows[i].id;
          const terminal = terminals[i % terminals.length];
          
          const orgContext = {
            companyId: terminal.company_id.toString(),
            divisionId: terminal.division_id.toString(),
            departmentId: terminal.department_id.toString(),
            terminalId: terminal.terminal_id.toString()
          };
          
          await client.query(
            'UPDATE trailers SET organizational_context = $1 WHERE id = $2',
            [JSON.stringify(orgContext), trailerId]
          );
        }
      }
    } catch (error) {
      console.log('⚠️ Trailers table not found, skipping...');
    }
    
    // Update loads
    const loadsResult = await client.query('SELECT COUNT(*) as count FROM loads WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
    const loadsToUpdate = parseInt(loadsResult.rows[0].count);
    
    console.log(`📦 Updating ${loadsToUpdate} loads...`);
    
    if (loadsToUpdate > 0) {
      const loadsListResult = await client.query('SELECT id FROM loads WHERE organizational_context = \'{"companyId":"","divisionId":"","departmentId":"","terminalId":""}\'');
      
      for (let i = 0; i < loadsListResult.rows.length; i++) {
        const loadId = loadsListResult.rows[i].id;
        const terminal = terminals[i % terminals.length];
        
        const orgContext = {
          companyId: terminal.company_id.toString(),
          divisionId: terminal.division_id.toString(),
          departmentId: terminal.department_id.toString(),
          terminalId: terminal.terminal_id.toString()
        };
        
        await client.query(
          'UPDATE loads SET organizational_context = $1 WHERE id = $2',
          [JSON.stringify(orgContext), loadId]
        );
      }
    }
    
    console.log('✅ Organizational context update completed!');
    
    return NextResponse.json({
      success: true,
      message: 'Organizational context updated successfully',
      details: {
        terminals: terminals.length,
        driversUpdated: driversToUpdate,
        trucksUpdated: trucksToUpdate,
        loadsUpdated: loadsToUpdate
      }
    });
      } catch (error) {
    console.error('❌ Error updating organizational context:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
