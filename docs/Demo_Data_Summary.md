# 🚀 Launch Transportation Management - Demo Import Data

## 📋 Overview

The `Launch_Demo_Import_Data.xlsx` file contains comprehensive, realistic demo data for the Launch Transportation Management Platform. This dataset represents a typical mid-sized transportation operation over a 23-day period from June 1-23, 2025.

## 📊 Data Summary

### 👨‍💼 Drivers (23 Total)
- **20 Active drivers** currently working and available for assignments
- **2 In-training drivers** completing their certification process
- **1 Out-of-service (OOS) driver** temporarily unavailable
- Complete profiles with realistic names, contact information, and licensing
- CDL numbers with expiration dates ranging from 2025-2027
- Emergency contact information for all drivers
- Hire dates spanning 2020-2024 for realistic experience distribution

### 🚛 Trucks (42 Total)
- **Major manufacturers** represented: Freightliner, Peterbilt, Kenworth, Volvo, Mack, International, Western Star
- **Model years** from 2018-2024 for realistic fleet age distribution
- **Fleet status distribution:**
  - ~27 trucks in-use (65%)
  - ~8 trucks available (20%)
  - ~4 trucks in maintenance (10%)
  - ~3 trucks out-of-service (5%)
- Realistic mileage ranges from 50,000 to 500,000 miles
- Current maintenance records and future scheduled maintenance
- Valid registration and insurance expiry dates
- Unique VIN numbers and license plates

### 🚚 Trailers (63 Total)
- **Trailer types** including:
  - Dry vans (most common)
  - Flatbeds
  - Refrigerated units
  - Hoppers
  - Tankers
  - Specialized equipment
- **Capacities** up to 80,000 lbs standard
- **Lengths** ranging from 40-53 feet based on type
- **Major manufacturers:** Great Dane, Utility, Wabash, Hyundai, Stoughton, Wilson
- Proper truck assignments for in-use trailers
- Maintenance schedules and compliance records

### 📦 Loads (119 Total)
- **Date range:** June 1-23, 2025 (23-day operational period)
- **Geographic coverage:** Major US cities and transportation corridors
- **Load status distribution:**
  - ~36 pending loads awaiting assignment
  - ~42 assigned loads ready for pickup
  - ~30 loads picked up and in-transit
  - ~24 loads delivered
  - ~18 loads in various stages of completion
- **Cargo variety:** 26 different cargo types from auto parts to construction materials
- **Weight range:** 15,000 - 80,000 lbs realistic for various cargo types
- **Rate structure:** $1,200 - $3,500 based on distance and cargo type
- Proper driver, truck, and trailer assignments where applicable

### ⚙️ Company Settings (20 Settings)
- **Company information:** Launch Transportation Solutions
- **Location:** Houston, TX (Central time zone)
- **System preferences:** US units, currency, and date formats
- **ID prefixes:** DRV, TRK, TRL, LD for consistent numbering
- **Notification settings:** Maintenance and expiry reminders
- **Regional settings:** Configured for US transportation operations

## 🔗 Data Relationships

### Assignment Logic
- **Driver-Truck Assignments:** Active drivers are assigned to available trucks
- **Truck-Trailer Assignments:** In-use trucks are paired with compatible trailers
- **Load Assignments:** Approximately 70% of loads are assigned to driver-truck-trailer teams
- **Maintenance Coordination:** Vehicles in maintenance are not assigned to loads
- **Status Consistency:** All assignments respect equipment and driver availability

### Realistic Scenarios
- **Training drivers** are not assigned equipment or loads
- **Maintenance vehicles** have realistic service schedules
- **Load routing** follows logical geographic patterns
- **Delivery timeframes** reflect realistic transit times (1-5 days)
- **Equipment utilization** matches industry standards

## 📅 Operational Timeline

### June 1-8, 2025: Week 1
- **High activity period** with multiple load pickups
- **Equipment assignments** established for the period
- **Maintenance schedules** initiated

### June 9-15, 2025: Week 2
- **Peak operational period** with most loads in transit
- **Driver rotations** and reassignments
- **Delivery completions** from week 1 pickups

### June 16-23, 2025: Week 3
- **Load completions** and new assignment cycles
- **Equipment maintenance** windows
- **Month-end operational wrap-up**

## 🎯 Use Cases

### Training & Demonstrations
- **New user onboarding** with realistic data
- **Feature demonstrations** across all modules
- **Workflow training** with complete scenarios
- **Reporting and analytics** with meaningful data

### Testing & Development
- **System performance** testing with substantial data
- **Feature validation** across all entity types
- **Integration testing** with proper relationships
- **Data import validation** and error handling

### Sales & Marketing
- **Customer demonstrations** with professional data
- **Proof of concept** deployments
- **Competitive analysis** scenarios
- **ROI calculations** based on realistic operations

## ⚠️ Important Notes

### Demo Data Characteristics
- **All personal information is fictional** - no real individuals
- **Contact information uses 555 area codes** - non-functional numbers
- **Email addresses use generic domains** - not real email accounts
- **VIN numbers are generated** - not actual vehicle identifiers
- **License plates are fictional** - computer-generated combinations
- **Company names are generic** - representative of industry types

### Data Integrity
- **All required fields are populated** for successful import
- **Status values match system requirements** exactly
- **Date formats follow MM/DD/YYYY** specification
- **Unique IDs are enforced** across all entity types
- **Relationships are validated** for data consistency

### Import Ready
- **No data validation errors** - ready for immediate import
- **Proper formatting** applied throughout
- **Complete documentation** included in Instructions sheet
- **Validation reference** provided for status values
- **File size optimized** for efficient upload

## 📞 Support Information

### File Details
- **Filename:** Launch_Demo_Import_Data.xlsx
- **Format:** Excel 2007+ (.xlsx)
- **Size:** Approximately 2-3 MB
- **Sheets:** 7 (Instructions, Drivers, Trucks, Trailers, Loads, Settings, Validation)
- **Data Volume:** 247 total records across all entity types

### Import Process
1. **Upload** the file through Launch platform import feature
2. **Review** the import summary (should show no validation errors)
3. **Confirm** the import to populate your system
4. **Verify** data appears correctly in all modules
5. **Begin** using the system with realistic operational data

---

**Demo Data Generated:** June 16, 2025  
**Operational Period:** June 1-23, 2025  
**Launch Transportation Management Platform v1.0.0**
