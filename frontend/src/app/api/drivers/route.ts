/**
 * API Route: Drivers
 * Handles CRUD operations for drivers using the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseManager } from '@/lib/database';
import { DriverStatus } from '@/types';

export async function GET() {
  try {
    const drivers = await DatabaseManager.getDrivers();
    // Return in Django REST Framework paginated format expected by frontend
    return NextResponse.json({
      count: drivers.length,
      next: null,
      previous: null,
      results: drivers
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const driverData = await request.json();
    
    // Validate required fields
    if (!driverData.firstName || !driverData.lastName || !driverData.licenseNumber) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Set defaults
    const driver = {
      ...driverData,
      status: driverData.status || DriverStatus.ACTIVE,
      hireDate: driverData.hireDate ? new Date(driverData.hireDate) : new Date(),
      licenseExpiry: new Date(driverData.licenseExpiry),
      emergencyContact: driverData.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      organizationalContext: driverData.organizationalContext || {
        companyId: 'default-company',
        terminalId: 'default-terminal'
      },
      accessLevel: driverData.accessLevel || 'DRIVER'
    };

    const newDriver = await DatabaseManager.createDriver(driver);
    return NextResponse.json({ driver: newDriver, success: true });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: 'Failed to create driver', success: false },
      { status: 500 }
    );
  }
}
