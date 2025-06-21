/**
 * Simple Database Connection Test
 * Tests basic database connectivity with proper timeout handling
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test environment variables first
    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const hasSupabaseUrl = !!process.env.SUPABASE_URL;
    
    if (!hasPostgresUrl && !hasSupabaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'No database configuration found',
        details: 'Missing POSTGRES_URL and SUPABASE_URL environment variables'
      });
    }

    // Try a very simple connection test with short timeout
    const connectionTest = async () => {
      try {
        const { createClient } = await import('@vercel/postgres');
        const client = createClient();
        
        // Simple query with very short timeout
        const result = await Promise.race([
          client.sql`SELECT 1 as test`,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout (3s)')), 3000)
          )
        ]);
        
        return { success: true, result };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          type: 'connection_error'
        };
      }
    };

    const testResult = await connectionTest();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment_variables: {
        postgres_url: hasPostgresUrl,
        supabase_url: hasSupabaseUrl
      },
      connection_test: testResult
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
