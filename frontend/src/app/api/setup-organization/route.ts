import { NextResponse } from 'next/server';
import { createOrganizationalHierarchy } from '@/lib/organizational-setup';

export async function POST() {
  try {
    await createOrganizationalHierarchy();
    
    return NextResponse.json({
      success: true,
      message: 'Organizational hierarchy created successfully'
    });
  } catch (error) {
    console.error('Error creating organizational hierarchy:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create organizational hierarchy',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
