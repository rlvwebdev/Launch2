/**
 * Supabase Database Connection Test
 * Using Supabase JavaScript client instead of @vercel/postgres
 */

import { NextResponse } from 'next/server';
import { SupabaseDatabaseManager } from '@/lib/supabase-database';

export async function GET() {
  try {
    console.log('🔌 Testing Supabase database connection...');
    
    const result = await SupabaseDatabaseManager.testConnection();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Supabase database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Supabase database connection failed - check logs for details'
      },
      { status: 200 }
    );
  }
}
