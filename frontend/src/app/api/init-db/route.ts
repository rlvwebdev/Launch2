/**
 * API Route: Database Initialization
 * Sets up database tables and sample data using Supabase
 */

import { NextResponse } from 'next/server';
import { DatabaseManager } from '@/lib/database';

export async function POST() {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Initialize database tables
    const initResult = await DatabaseManager.initializeDatabase();
    
    console.log('✅ Database initialization completed');
    return NextResponse.json({
      success: true,
      message: 'Database initialization completed',
      details: initResult
    });
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database initialization failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },      { status: 500 }
    );
  }
}
