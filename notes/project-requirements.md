# Trucking Management App - Project Requirements

## Project Overview
Mobile-first web application for managing trucking operations with four main sections accessible via bottom navigation.

## Core Features

### 1. Drivers Management
- Manage driver information
- Assign trucks to drivers
- View driver details and status

### 2. Trucks Management
- Manage truck information and details
- Track truck assignments
- Maintain truck records

### 3. Loads Management
- View list of loads
- Create reports on loads
- Set specific status for loads
- ability to report have a historic record of loads that had an event take place ( spill, contamination, ncr, etc)

### 4. Settings
- Application configuration
- User preferences
- System settings

## Technical Requirements

### UI/UX
- Mobile-first responsive design
- Bottom navigation with 4 buttons: Drivers, Trucks, Loads, Settings
- Modern, clean interface
- Touch-friendly interactions
- dashboard view on wide, desktop screen resolutions

### Technology Stack
- Next.js with TypeScript
- Tailwind CSS for styling
- Mobile-responsive components
- Progressive Web App capabilities

## Navigation Structure
```
Bottom Navigation:
├── Drivers
├── Trucks  
├── Loads
└── Settings
```

## Data Models (Preliminary)
- **Driver**: ID, Name, License Info, Contact, Assigned Truck, Status
- **Truck**: ID, Make/Model, License Plate, VIN, Maintenance Records, Assigned Driver
- **Load**: ID, Origin, Destination, Status, Driver/Truck Assignment, Dates, Weight/Cargo Details

## Development Notes
- Start with Next.js TypeScript template
- Use Tailwind CSS for mobile-first styling
- Implement responsive design patterns
- Consider offline capabilities for mobile use
- Plan for data persistence (local storage initially, database later)
