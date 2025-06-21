/**
 * API Route: Trucks
 * Handles CRUD operations for trucks using the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseManager } from '@/lib/database';
import { TruckStatus } from '@/types';

export async function GET() {
  try {
    const trucks = await DatabaseManager.getTrucks();
    // Return in Django REST Framework paginated format expected by frontend
    return NextResponse.json({
      count: trucks.length,
      next: null,
      previous: null,
      results: trucks
    });
  } catch (error) {
    console.error('Error fetching trucks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trucks', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const truckData = await request.json();
    
    // Validate required fields
    if (!truckData.make || !truckData.model || !truckData.licensePlate) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Set defaults
    const truck = {
      ...truckData,
      year: truckData.year || new Date().getFullYear(),
      status: truckData.status || TruckStatus.AVAILABLE,
      mileage: truckData.mileage || 0,
      lastMaintenance: truckData.lastMaintenance ? new Date(truckData.lastMaintenance) : new Date(),
      nextMaintenanceDue: truckData.nextMaintenanceDue ? new Date(truckData.nextMaintenanceDue) : new Date(),
      registrationExpiry: truckData.registrationExpiry ? new Date(truckData.registrationExpiry) : new Date(),
      insuranceExpiry: truckData.insuranceExpiry ? new Date(truckData.insuranceExpiry) : new Date(),
      organizationalContext: truckData.organizationalContext || {
        companyId: 'default-company',
        terminalId: 'default-terminal'
      }
    };

    const newTruck = await DatabaseManager.createTruck(truck);
    return NextResponse.json({ truck: newTruck, success: true });
  } catch (error) {
    console.error('Error creating truck:', error);
    return NextResponse.json(
      { error: 'Failed to create truck', success: false },
      { status: 500 }
    );
  }
}
