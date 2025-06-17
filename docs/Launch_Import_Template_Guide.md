# Launch Transportation Management - Excel Import Template

## Overview
This Excel workbook template is designed for importing data into the Launch Transportation Management Platform. The workbook contains multiple sheets for different data types, allowing managers to organize and import their existing transportation data efficiently.

## Workbook Structure

### Sheet 1: Drivers
Contains all driver information including personal details, licensing, and emergency contacts.

### Sheet 2: Trucks
Contains truck/vehicle information including specifications, maintenance records, and registration details.

### Sheet 3: Trailers
Contains trailer information including specifications, maintenance records, and registration details.

### Sheet 4: Loads
Contains load/shipment information including pickup/delivery details, cargo information, and assignments.

### Sheet 5: Settings
Contains company settings, default values, and configuration options.

### Sheet 6: Instructions
Contains detailed instructions for completing each sheet and data import guidelines.

## Data Import Instructions

### General Guidelines
1. **Do not modify column headers** - The system relies on exact column names for import
2. **Required fields** are marked with an asterisk (*) in the header
3. **Date format** should be MM/DD/YYYY
4. **Phone numbers** should include area code (e.g., 555-123-4567)
5. **IDs** should be unique within each sheet
6. **Status values** must match exactly (case-sensitive)

### Data Validation Rules
- All required fields must be completed
- Dates must be valid and in the future where applicable
- Phone numbers must be 10 digits
- Email addresses must be valid format
- License plates must be unique
- VIN numbers must be 17 characters
- Load numbers must be unique

### Import Process
1. Complete all relevant sheets with your data
2. Validate data using the provided validation tools
3. Save the workbook as Excel format (.xlsx)
4. Upload through the Launch platform import feature
5. Review import summary and resolve any errors
6. Confirm import to add data to your system

## Column Definitions

### Drivers Sheet Columns
- **Driver ID*** - Unique identifier for the driver
- **First Name*** - Driver's first name
- **Last Name*** - Driver's last name
- **License Number*** - Commercial driver's license number
- **License Expiry*** - CDL expiration date
- **Phone Number*** - Primary contact number
- **Email** - Email address
- **Fuel Card Number** - Company fuel card number
- **Assigned Truck ID** - ID of assigned truck (if any)
- **Status*** - active, in-training, or oos
- **Hire Date*** - Date of employment
- **Emergency Contact Name*** - Emergency contact person
- **Emergency Contact Phone*** - Emergency contact number
- **Emergency Contact Relationship*** - Relationship to driver

### Trucks Sheet Columns
- **Truck ID*** - Unique identifier for the truck
- **Make*** - Vehicle manufacturer
- **Model*** - Vehicle model
- **Year*** - Manufacturing year
- **License Plate*** - Vehicle license plate
- **VIN*** - Vehicle identification number
- **Color** - Vehicle color
- **Assigned Driver ID** - ID of assigned driver (if any)
- **Status*** - available, in-use, maintenance, or out-of-service
- **Mileage*** - Current odometer reading
- **Last Maintenance Date** - Date of last maintenance
- **Next Maintenance Due** - Date next maintenance is due
- **Registration Expiry*** - Vehicle registration expiration
- **Insurance Expiry*** - Insurance policy expiration

### Trailers Sheet Columns
- **Trailer ID*** - Unique identifier for the trailer
- **Make*** - Trailer manufacturer
- **Model*** - Trailer model
- **Year*** - Manufacturing year
- **License Plate*** - Trailer license plate
- **VIN*** - Trailer identification number
- **Type*** - Trailer type (flatbed, dry-van, refrigerated, etc.)
- **Capacity*** - Weight capacity in pounds
- **Length*** - Trailer length in feet
- **Assigned Truck ID** - ID of assigned truck (if any)
- **Status*** - available, in-use, maintenance, or out-of-service
- **Last Maintenance Date** - Date of last maintenance
- **Next Maintenance Due** - Date next maintenance is due
- **Registration Expiry*** - Trailer registration expiration
- **Insurance Expiry*** - Insurance policy expiration

### Loads Sheet Columns
- **Load ID*** - Unique identifier for the load
- **Load Number*** - Customer load number
- **BOL Number** - Bill of lading number
- **Shipper*** - Shipper company name
- **Pickup Address*** - Pickup street address
- **Pickup City*** - Pickup city
- **Pickup State*** - Pickup state (2-letter code)
- **Pickup Zip Code*** - Pickup ZIP code
- **Delivery Address*** - Delivery street address
- **Delivery City*** - Delivery city
- **Delivery State*** - Delivery state (2-letter code)
- **Delivery Zip Code*** - Delivery ZIP code
- **Assigned Driver ID** - ID of assigned driver
- **Assigned Truck ID** - ID of assigned truck
- **Assigned Trailer ID** - ID of assigned trailer
- **Status*** - pending, assigned, picked-up, in-transit, delivered, or cancelled
- **Cargo Description*** - Description of cargo
- **Weight*** - Cargo weight in pounds
- **Pickup Date*** - Scheduled pickup date
- **Delivery Date*** - Scheduled delivery date
- **Rate*** - Payment rate for the load
- **Notes** - Additional notes or instructions

### Settings Sheet Columns
- **Setting Name*** - Configuration setting name
- **Setting Value*** - Configuration value
- **Description** - Description of the setting
- **Category** - Setting category (company, system, notifications, etc.)

## Status Value Reference

### Driver Status Options
- **active** - Driver is actively working
- **in-training** - Driver is in training period
- **oos** - Driver is out of service

### Truck/Trailer Status Options
- **available** - Vehicle is available for assignment
- **in-use** - Vehicle is currently assigned/in use
- **maintenance** - Vehicle is undergoing maintenance
- **out-of-service** - Vehicle is out of service

### Load Status Options
- **pending** - Load is awaiting assignment
- **assigned** - Load has been assigned to driver/truck
- **picked-up** - Load has been picked up
- **in-transit** - Load is en route to destination
- **delivered** - Load has been delivered
- **cancelled** - Load has been cancelled

## Sample Data
Each sheet includes sample data in the first few rows to demonstrate proper formatting and data entry.

## Technical Notes
- Maximum file size: 10MB
- Supported format: .xlsx (Excel 2007+)
- Maximum rows per sheet: 1,000,000
- Import processing time: 1-5 minutes depending on data volume
- Partial imports are supported if some data has validation errors

## Support
For assistance with data import or template usage, contact your system administrator or refer to the Launch platform documentation.
