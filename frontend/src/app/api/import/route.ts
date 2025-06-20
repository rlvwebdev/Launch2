import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { Driver, Truck, Load, DriverStatus, TruckStatus, LoadStatus } from '@/types';

// Interface definitions for Excel row parsing
interface ExcelDriverRow {
  'Driver ID': string | number;
  'First Name': string;
  'Last Name': string;
  'License Number'?: string;
  'License Expiry'?: string | Date;
  'Phone Number'?: string;
  'Emergency Contact Name'?: string;
  'Emergency Contact Phone'?: string;
  'Emergency Contact Relationship'?: string;
  'Fuel Card'?: string;
  'Assigned Truck ID'?: string | number;
  'Status'?: string;
  'Hire Date'?: string | Date;
}

interface ExcelTruckRow {
  'Truck ID': string | number;
  'Make': string;
  'Model': string;
  'Year'?: number;
  'License Plate'?: string;
  'VIN'?: string;
  'Color'?: string;
  'Assigned Driver ID'?: string | number;
  'Status'?: string;
  'Mileage'?: number;
  'Last Maintenance'?: string | Date;
  'Next Maintenance Due'?: string | Date;
  'Registration Expiry'?: string | Date;
  'Insurance Expiry'?: string | Date;
}

interface ExcelLoadRow {
  'Load ID': string | number;
  'Load Number': string;
  'BOL Number'?: string;
  'Shipper': string;
  'Pickup Address'?: string;
  'Pickup City'?: string;
  'Pickup State'?: string;
  'Pickup Zip'?: string;
  'Delivery Address'?: string;
  'Delivery City'?: string;
  'Delivery State'?: string;
  'Delivery Zip'?: string;
  'Assigned Driver ID'?: string | number;
  'Assigned Truck ID'?: string | number;
  'Status'?: string;
  'Cargo Description'?: string;
  'Weight'?: number;
  'Pickup Date'?: string | Date;
  'Delivery Date'?: string | Date;
  'Rate'?: number;
  'Notes'?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an Excel file (.xlsx)' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const result = {
      drivers: [] as Driver[],
      trucks: [] as Truck[],
      loads: [] as Load[],
      errors: [] as string[],
      summary: {
        driversImported: 0,
        trucksImported: 0,
        loadsImported: 0,
        errorsCount: 0
      }
    };

    // Helper function to clean column names (remove asterisks and extra spaces)
    const cleanColumnName = (name: string): string => {
      if (!name || typeof name !== 'string') return '';
      return name.replace(/\*/g, '').trim();
    };    // Helper function to find header row and clean data
    const parseSheetWithHeaders = (sheet: XLSX.WorkSheet, expectedHeaders: string[]) => {
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
      let headerRowIndex = -1;
      const cleanedData: Record<string, unknown>[] = [];

      // Find the row that contains the headers
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        if (row && row.length > 0) {
          const cleanedRow = row.map(cell => cleanColumnName(String(cell || '')));
          const matchingHeaders = expectedHeaders.filter(header => 
            cleanedRow.some(col => col.toLowerCase().includes(header.toLowerCase().replace(/\s+/g, ' ')))
          );
          
          if (matchingHeaders.length >= Math.min(3, expectedHeaders.length)) {
            headerRowIndex = i;
            break;
          }
        }
      }

      if (headerRowIndex === -1) {
        return { headers: [], data: [] };
      }

      // Get headers and create mapping
      const headerRow = rawData[headerRowIndex];
      const cleanedHeaders = headerRow.map((cell: unknown) => cleanColumnName(String(cell || '')));
      
      // Convert remaining rows to objects
      for (let i = headerRowIndex + 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
          const rowObj: Record<string, unknown> = {};
          cleanedHeaders.forEach((header: string, index: number) => {
            if (header && row[index] !== undefined) {
              rowObj[header] = row[index];
            }
          });
          cleanedData.push(rowObj);
        }
      }

      return { headers: cleanedHeaders, data: cleanedData };
    };

    // Parse Drivers sheet
    if (workbook.SheetNames.includes('Drivers')) {
      try {        const driversSheet = workbook.Sheets['Drivers'];
        const expectedHeaders = ['Driver ID', 'First Name', 'Last Name', 'License Number', 'Status'];
        const { data: driversData } = parseSheetWithHeaders(driversSheet, expectedHeaders);
          driversData.forEach((row: Record<string, unknown>, index: number) => {
          try {
            // Map the cleaned column names to our expected format
            const driverId = row['Driver ID'] || row['DriverID'] || row['ID'];
            const firstName = row['First Name'] || row['FirstName'] || row['Name'];
            const lastName = row['Last Name'] || row['LastName'] || row['Surname'];
            
            if (!driverId || !firstName || !lastName) {
              result.errors.push(`Row ${index + 1} in Drivers sheet: Missing required fields (ID: ${driverId}, First: ${firstName}, Last: ${lastName})`);
              return;
            }            const driver: Driver = {
              id: String(driverId),
              firstName: String(firstName),
              lastName: String(lastName),
              licenseNumber: String(row['License Number'] || row['LicenseNumber'] || ''),
              licenseExpiry: row['License Expiry'] || row['LicenseExpiry'] ? new Date(String(row['License Expiry'] || row['LicenseExpiry'])) : new Date(),
              phoneNumber: String(row['Phone Number'] || row['PhoneNumber'] || row['Phone'] || ''),
              emergencyContact: {
                name: String(row['Emergency Contact Name'] || row['EmergencyContactName'] || row['Emergency Name'] || ''),
                phone: String(row['Emergency Contact Phone'] || row['EmergencyContactPhone'] || row['Emergency Phone'] || ''),
                relationship: String(row['Emergency Contact Relationship'] || row['EmergencyContactRelationship'] || row['Emergency Relationship'] || '')
              },
              fuelCard: String(row['Fuel Card Number'] || row['FuelCard'] || row['Fuel Card'] || ''),
              assignedTruckId: row['Assigned Truck ID'] || row['AssignedTruckID'] || row['Truck ID'] ? String(row['Assigned Truck ID'] || row['AssignedTruckID'] || row['Truck ID']) : undefined,
              status: parseDriverStatus(String(row['Status'] || '')),
              hireDate: row['Hire Date'] || row['HireDate'] ? new Date(String(row['Hire Date'] || row['HireDate'])) : new Date(),
              // Add required organizational context properties
              organizationalContext: {
                companyId: 'default-company',
                terminalId: 'default-terminal'
              },
              accessLevel: 'TERMINAL' as any,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            result.drivers.push(driver);
          } catch (error) {
            result.errors.push(`Row ${index + 2} in Drivers sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });
      } catch (error) {
        result.errors.push(`Error parsing Drivers sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Parse Trucks sheet
    if (workbook.SheetNames.includes('Trucks')) {
      try {        const trucksSheet = workbook.Sheets['Trucks'];
        const expectedHeaders = ['Truck ID', 'Make', 'Model', 'Status'];
        const { data: trucksData } = parseSheetWithHeaders(trucksSheet, expectedHeaders);
        
        trucksData.forEach((row: Record<string, unknown>, index: number) => {
          try {
            const truckId = row['Truck ID'] || row['TruckID'] || row['ID'];
            const make = row['Make'] || row['Manufacturer'];
            const model = row['Model'];
            
            if (!truckId || !make || !model) {
              result.errors.push(`Row ${index + 1} in Trucks sheet: Missing required fields (ID: ${truckId}, Make: ${make}, Model: ${model})`);
              return;
            }            const truck: Truck = {
              id: String(truckId),
              make: String(make),
              model: String(model),
              year: Number(row['Year']) || new Date().getFullYear(),
              licensePlate: String(row['License Plate'] || row['LicensePlate'] || ''),
              vin: String(row['VIN'] || ''),
              color: String(row['Color'] || ''),
              assignedDriverId: row['Assigned Driver ID'] || row['AssignedDriverID'] ? String(row['Assigned Driver ID'] || row['AssignedDriverID']) : undefined,
              status: parseTruckStatus(String(row['Status'] || '')),
              mileage: Number(row['Mileage']) || 0,
              lastMaintenance: row['Last Maintenance'] || row['LastMaintenance'] ? new Date(String(row['Last Maintenance'] || row['LastMaintenance'])) : new Date(),
              nextMaintenanceDue: row['Next Maintenance Due'] || row['NextMaintenanceDue'] ? new Date(String(row['Next Maintenance Due'] || row['NextMaintenanceDue'])) : new Date(),
              registrationExpiry: row['Registration Expiry'] || row['RegistrationExpiry'] ? new Date(String(row['Registration Expiry'] || row['RegistrationExpiry'])) : new Date(),
              insuranceExpiry: row['Insurance Expiry'] || row['InsuranceExpiry'] ? new Date(String(row['Insurance Expiry'] || row['InsuranceExpiry'])) : new Date(),
              // Add required organizational context
              organizationalContext: {
                companyId: 'default-company',
                terminalId: 'default-terminal'
              },
              createdAt: new Date(),
              updatedAt: new Date()
            };

            result.trucks.push(truck);
          } catch (error) {
            result.errors.push(`Row ${index + 2} in Trucks sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });
      } catch (error) {
        result.errors.push(`Error parsing Trucks sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Parse Loads sheet
    if (workbook.SheetNames.includes('Loads')) {
      try {        const loadsSheet = workbook.Sheets['Loads'];
        const expectedHeaders = ['Load ID', 'Load Number', 'Shipper'];
        const { data: loadsData } = parseSheetWithHeaders(loadsSheet, expectedHeaders);
        
        loadsData.forEach((row: Record<string, unknown>, index: number) => {
          try {
            const loadId = row['Load ID'] || row['LoadID'] || row['ID'];
            const loadNumber = row['Load Number'] || row['LoadNumber'] || row['Number'];
            const shipper = row['Shipper'] || row['Shipper Name'];
            
            if (!loadId || !loadNumber || !shipper) {
              result.errors.push(`Row ${index + 1} in Loads sheet: Missing required fields (ID: ${loadId}, Number: ${loadNumber}, Shipper: ${shipper})`);
              return;
            }            const load: Load = {
              id: String(loadId),
              loadNumber: String(loadNumber),
              bolNumber: String(row['BOL Number'] || row['BOLNumber'] || row['BOL'] || ''),
              shipper: String(shipper),
              pickupLocation: {
                address: String(row['Pickup Address'] || ''),
                city: String(row['Pickup City'] || ''),
                state: String(row['Pickup State'] || ''),
                zipCode: String(row['Pickup Zip'] || '')
              },
              deliveryLocation: {
                address: String(row['Delivery Address'] || ''),
                city: String(row['Delivery City'] || ''),
                state: String(row['Delivery State'] || ''),
                zipCode: String(row['Delivery Zip'] || '')
              },
              assignedDriverId: row['Assigned Driver ID'] ? String(row['Assigned Driver ID']) : undefined,
              assignedTruckId: row['Assigned Truck ID'] ? String(row['Assigned Truck ID']) : undefined,
              status: parseLoadStatus(String(row['Status'] || '')),
              cargoDescription: String(row['Cargo Description'] || ''),
              weight: Number(row['Weight']) || 0,
              pickupDate: row['Pickup Date'] ? new Date(String(row['Pickup Date'])) : new Date(),
              deliveryDate: row['Delivery Date'] ? new Date(String(row['Delivery Date'])) : new Date(),
              rate: Number(row['Rate']) || 0,
              notes: row['Notes'] ? String(row['Notes']) : undefined,
              events: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              // Add required organizational context
              organizationalContext: {
                companyId: 'default-company',
                terminalId: 'default-terminal'
              }
            };

            result.loads.push(load);
          } catch (error) {
            result.errors.push(`Row ${index + 2} in Loads sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });
      } catch (error) {
        result.errors.push(`Error parsing Loads sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update summary
    result.summary.driversImported = result.drivers.length;
    result.summary.trucksImported = result.trucks.length;
    result.summary.loadsImported = result.loads.length;
    result.summary.errorsCount = result.errors.length;

    return NextResponse.json(result);

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function parseDriverStatus(status: string): DriverStatus {
  const statusLower = String(status || '').toLowerCase();
  switch (statusLower) {
    case 'active':
      return DriverStatus.ACTIVE;
    case 'in-training':
    case 'in training':
      return DriverStatus.IN_TRAINING;
    case 'oos':
    case 'out-of-service':
    case 'out of service':
    case 'terminated':
      return DriverStatus.TERMINATED;
    case 'inactive':
      return DriverStatus.INACTIVE;
    case 'on-leave':
    case 'on leave':
      return DriverStatus.ON_LEAVE;
    default:
      return DriverStatus.ACTIVE;
  }
}

function parseTruckStatus(status: string): TruckStatus {
  const statusLower = String(status || '').toLowerCase();
  switch (statusLower) {
    case 'available':
      return TruckStatus.AVAILABLE;
    case 'in-use':
    case 'in use':
    case 'assigned':
      return TruckStatus.ASSIGNED;
    case 'maintenance':
      return TruckStatus.MAINTENANCE;
    case 'out-of-service':
    case 'out of service':
    case 'oos':
      return TruckStatus.OUT_OF_SERVICE;
    default:
      return TruckStatus.AVAILABLE;
  }
}

function parseLoadStatus(status: string): LoadStatus {
  const statusLower = String(status || '').toLowerCase();
  switch (statusLower) {
    case 'pending':
      return LoadStatus.PENDING;
    case 'assigned':
      return LoadStatus.ASSIGNED;
    case 'picked-up':
    case 'picked up':
      return LoadStatus.PICKED_UP;
    case 'in-transit':
    case 'in transit':
      return LoadStatus.IN_TRANSIT;
    case 'delivered':
      return LoadStatus.DELIVERED;
    case 'cancelled':
      return LoadStatus.CANCELLED;
    default:
      return LoadStatus.PENDING;
  }
}
