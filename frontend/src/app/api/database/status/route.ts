import { NextRequest, NextResponse } from 'next/server';
import { DatabaseHealth } from '@/lib/database-status';

export async function GET(request: NextRequest) {
  try {
    const status = await DatabaseHealth.checkStatus();
    
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Database status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check database status'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'initialize') {
      const result = await DatabaseHealth.initializeTables();
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Database tables initialized successfully'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize database'
    }, { status: 500 });
  }
}
