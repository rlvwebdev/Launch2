/**
 * Health Check API Route
 * Simple endpoint to test API functionality
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    api_url: process.env.NEXT_PUBLIC_API_URL
  });
}
