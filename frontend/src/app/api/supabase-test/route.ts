/**
 * Supabase Database Connection Test
 * Tests database connectivity using Supabase client
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          success: false, 
          connected: false,
          error: 'Missing Supabase environment variables',
          env: {
            SUPABASE_URL: !!supabaseUrl,
            SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey
          }
        },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      connected: true,
      message: 'Supabase connection successful',
      testQuery: 'SELECT table_name FROM information_schema.tables LIMIT 1',
      result: data
    });
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  }
}
