/**
 * Environment Variables Test
 * Just checks if environment variables are set correctly
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const env = {
      POSTGRES_URL: process.env.POSTGRES_URL || 'NOT SET',
      POSTGRES_USER: process.env.POSTGRES_USER || 'NOT SET',
      POSTGRES_HOST: process.env.POSTGRES_HOST || 'NOT SET',
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? '***SET***' : 'NOT SET',
      POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'NOT SET',
      SUPABASE_URL: process.env.SUPABASE_URL || 'NOT SET',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '***SET***' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    };
    
    return NextResponse.json({ 
      success: true, 
      environment: env,
      message: 'Environment variables check'
    });
  } catch (error) {
    console.error('Environment test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
