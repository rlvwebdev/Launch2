# 📊 Launch Transportation Management - Excel Import Template

## 🚀 Overview

The Launch Excel Import Template is a comprehensive workbook designed to help transportation managers easily import their existing data into the Launch platform. This template supports bulk data import for drivers, trucks, trailers, loads, and company settings.

## 📋 Workbook Structure

### 📑 Sheet 1: Instructions
- Comprehensive import guidelines
- Step-by-step process instructions
- Data validation rules
- Status value references
- Contact information for support

### 👨‍💼 Sheet 2: Drivers
**Contains driver information including:**
- Personal details (name, contact information)
- Commercial license information and expiry dates
- Emergency contact details
- Current truck assignments
- Employment status and hire dates
- Fuel card assignments

**Key Fields:**
- `Driver ID*` - Unique identifier (e.g., DRV001)
- `License Number*` - CDL number
- `License Expiry*` - Format: MM/DD/YYYY
- `Status*` - Values: active, in-training, oos

### 🚛 Sheet 3: Trucks
**Contains truck/vehicle information including:**
- Vehicle specifications (make, model, year)
- Registration and VIN details
- Maintenance records and schedules
- Current driver assignments
- Insurance and registration expiry dates

**Key Fields:**
- `Truck ID*` - Unique identifier (e.g., TRK001)
- `VIN*` - 17-character vehicle identification number
- `Status*` - Values: available, in-use, maintenance, out-of-service
- `Mileage*` - Current odometer reading

### 🚚 Sheet 4: Trailers
**Contains trailer information including:**
- Trailer specifications and capacity
- Registration and identification details
- Maintenance schedules
- Current truck assignments
- Type and capacity information

**Key Fields:**
- `Trailer ID*` - Unique identifier (e.g., TRL001)
- `Type*` - Values: dry-van, flatbed, refrigerated, hopper, tanker, etc.
- `Capacity*` - Weight capacity in pounds
- `Length*` - Trailer length in feet

### 📦 Sheet 5: Loads
**Contains load/shipment information including:**
- Pickup and delivery locations
- Cargo descriptions and weights
- Driver and equipment assignments
- Scheduling and rate information
- Bill of lading details

**Key Fields:**
- `Load ID*` - Unique identifier (e.g., LD001)
- `Load Number*` - Customer reference number
- `Status*` - Values: pending, assigned, picked-up, in-transit, delivered, cancelled
- `Weight*` - Cargo weight in pounds

### ⚙️ Sheet 6: Settings
**Contains company configuration including:**
- Company information
- System preferences
- Default values and prefixes
- Notification settings
- Regional settings

### 🔍 Sheet 7: Validation
**Reference sheet containing:**
- Valid status values for all entities
- Data format requirements
- Field validation rules
- Common error prevention tips

## 📝 Data Entry Guidelines

### Required Fields
- Fields marked with an asterisk (*) are required
- All required fields must be completed for successful import
- Unique IDs must not be duplicated within each sheet

### Data Formats
- **Dates**: MM/DD/YYYY format (e.g., 12/31/2025)
- **Phone Numbers**: Include area code (e.g., 555-123-4567)
- **Email**: Valid email format required
- **VIN Numbers**: Exactly 17 characters
- **Status Values**: Must match exactly (case-sensitive)

### Status Value Reference

#### Driver Status
- `active` - Driver is actively working
- `in-training` - Driver is in training period
- `oos` - Driver is out of service (Out of Service)

#### Truck/Trailer Status
- `available` - Vehicle is available for assignment
- `in-use` - Vehicle is currently assigned/in use
- `maintenance` - Vehicle is undergoing maintenance
- `out-of-service` - Vehicle is out of service

#### Load Status
- `pending` - Load is awaiting assignment
- `assigned` - Load has been assigned to driver/truck
- `picked-up` - Load has been picked up
- `in-transit` - Load is en route to destination
- `delivered` - Load has been delivered
- `cancelled` - Load has been cancelled

## 🔄 Import Process

### Step 1: Download Template
1. Access Launch platform settings
2. Navigate to "Excel Data Import" section
3. Click "Download Excel Template"
4. Save the template to your computer

### Step 2: Prepare Your Data
1. Open the downloaded template in Microsoft Excel or compatible software
2. Review the Instructions sheet thoroughly
3. Fill in data on appropriate sheets:
   - Start with Settings (company information)
   - Add Drivers information
   - Add Trucks and Trailers
   - Add Loads with proper assignments
4. Use the sample data as a reference for formatting
5. Validate your data using the Validation sheet

### Step 3: Upload and Import
1. Save your completed workbook as .xlsx format
2. Return to Launch platform settings
3. Click "Upload Data File" in the Excel Data Import section
4. Select your completed template file
5. Review the import summary
6. Resolve any validation errors
7. Confirm the import to add data to your system

## ⚠️ Important Notes

### File Requirements
- **Format**: Excel (.xlsx) format only
- **Size Limit**: Maximum 10MB file size
- **Compatibility**: Excel 2007+ or compatible software

### Data Validation
- System performs comprehensive validation before import
- Invalid data will be flagged with specific error messages
- Partial imports are supported if some data has errors
- All relationships (driver-truck assignments, etc.) are validated

### Best Practices
1. **Backup First**: Always backup existing data before importing
2. **Test Small**: Start with a small dataset to test the process
3. **Unique IDs**: Ensure all IDs are unique within each sheet
4. **Data Consistency**: Verify assigned relationships are valid
5. **Date Formats**: Double-check all date formats match requirements

## 🛠️ Troubleshooting

### Common Issues
1. **Date Format Errors**: Ensure dates are in MM/DD/YYYY format
2. **Invalid Status Values**: Check spelling and case of status fields
3. **Duplicate IDs**: Remove or modify duplicate ID values
4. **Missing Required Fields**: Complete all fields marked with (*)
5. **Invalid Assignments**: Verify assigned IDs exist in related sheets

### Getting Help
- Review the Instructions sheet in the template
- Check the Validation sheet for reference data
- Contact your system administrator for additional support
- Refer to Launch platform documentation

## 📞 Support

For technical assistance with data import:
- Email: support@launch.com
- Documentation: Launch Platform User Guide
- In-app support available through settings page

---

**Generated by Launch Transportation Management Platform**  
*Version 1.0.0 - Built for the modern logistics industry*
