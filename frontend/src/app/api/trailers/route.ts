/**
 * API Route: Trailers
 * Handles CRUD operations for trailers using the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseManager } from '@/lib/database';

export async function GET() {
  try {
    const trailers = await DatabaseManager.getTrailers();
    // Return in Django REST Framework paginated format expected by frontend
    return NextResponse.json({
      count: trailers.length,
      next: null,
      previous: null,
      results: trailers
    });
  } catch (error) {
    console.error('Error fetching trailers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trailers', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const trailerData = await request.json();
    
    // Validate required fields
    if (!trailerData.trailerNumber || !trailerData.type) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Set defaults
    const trailer = {
      ...trailerData,
      status: trailerData.status || 'available',
      capacity: trailerData.capacity || 48000,
      length: trailerData.length || 53,
      year: trailerData.year || new Date().getFullYear(),
      lastInspection: trailerData.lastInspection ? new Date(trailerData.lastInspection) : new Date(),
      nextInspectionDue: trailerData.nextInspectionDue ? new Date(trailerData.nextInspectionDue) : new Date(),
      organizationalContext: trailerData.organizationalContext || {
        companyId: 'default-company',
        terminalId: 'default-terminal'
      }
    };

    // TODO: Implement createTrailer in DatabaseManager
    return NextResponse.json({ trailer, success: true });
  } catch (error) {
    console.error('Error creating trailer:', error);
    return NextResponse.json(
      { error: 'Failed to create trailer', success: false },
      { status: 500 }
    );
  }
}
