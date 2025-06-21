/**
 * API Route: Loads
 * Handles CRUD operations for loads using the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseManager } from '@/lib/database';

export async function GET() {
  try {
    const loads = await DatabaseManager.getLoads();
    // Return in Django REST Framework paginated format expected by frontend
    return NextResponse.json({
      count: loads.length,
      next: null,
      previous: null,
      results: loads
    });
  } catch (error) {
    console.error('Error fetching loads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loads', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const loadData = await request.json();
    
    // Validate required fields
    if (!loadData.loadNumber || !loadData.shipper || !loadData.consignee) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Set defaults
    const load = {
      ...loadData,
      status: loadData.status || 'planned',
      pickupDate: loadData.pickupDate ? new Date(loadData.pickupDate) : new Date(),
      deliveryDate: loadData.deliveryDate ? new Date(loadData.deliveryDate) : new Date(),
      rate: loadData.rate || 0,
      miles: loadData.miles || 0,
      weight: loadData.weight || 0,
      organizationalContext: loadData.organizationalContext || {
        companyId: 'default-company',
        terminalId: 'default-terminal'
      }
    };

    // TODO: Implement createLoad in DatabaseManager
    return NextResponse.json({ load, success: true });
  } catch (error) {
    console.error('Error creating load:', error);
    return NextResponse.json(
      { error: 'Failed to create load', success: false },
      { status: 500 }
    );
  }
}
