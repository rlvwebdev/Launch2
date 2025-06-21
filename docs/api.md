# 🌐 API Documentation

**Launch Transportation Management System - API Reference**  
*Complete REST API Documentation for Django Backend*

## 📋 Overview

The Launch TMS API provides comprehensive REST endpoints for managing all aspects of transportation operations. Built with Django REST Framework, it offers robust authentication, data validation, and organizational multi-tenancy.

### Base URL
```
Production: https://api.launchtms.com/api/
Development: http://localhost:8000/api/
```

### API Version
Current Version: **v1**  
All endpoints are prefixed with `/api/` for the current version.

## 🔐 Authentication

### JWT Token Authentication
The API uses JSON Web Tokens (JWT) for authentication with access/refresh token pattern.

#### POST /auth/login/
Authenticate user and receive JWT tokens.

**Request:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "company": {
      "id": "uuid",
      "name": "Acme Transportation",
      "code": "ACME"
    }
  }
}
```

#### POST /auth/refresh/
Refresh expired access token using refresh token.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### POST /auth/register/
Register a new user account.

**Request:**
```json
{
  "username": "new_user",
  "password": "secure_password",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "company_id": "uuid"
}
```

#### POST /auth/logout/
Invalidate refresh token and logout user.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Authorization Header
Include JWT access token in all authenticated requests:
```
Authorization: Bearer <access_token>
```

## 🏢 Company Management

### GET /companies/
List all companies (public endpoint for registration).

**Response:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Launch Transportation Solutions",
      "code": "LTS",
      "address_street": "123 Industrial Blvd",
      "address_city": "Houston",
      "address_state": "TX",
      "address_zip": "77001",
      "phone": "(713) 555-0100",
      "email": "info@launchtransport.com",
      "is_active": true,
      "timezone": "America/Chicago",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-06-21T00:00:00Z"
    }
  ]
}
```

### GET /companies/{id}/
Retrieve specific company details.

### POST /companies/
Create a new company (admin only).

### PATCH /companies/{id}/
Update company information.

### DELETE /companies/{id}/
Deactivate company (soft delete).

## 👥 User Management

### GET /users/
List company users with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)
- `search`: Search by username, email, or name
- `is_active`: Filter by active status
- `role`: Filter by user role

**Response:**
```json
{
  "count": 15,
  "next": "http://localhost:8000/api/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_active": true,
      "role": "manager",
      "company": {
        "id": "uuid",
        "name": "Launch Transportation",
        "code": "LTS"
      },
      "division": {
        "id": "uuid",
        "name": "Operations",
        "code": "OPS"
      },
      "last_login": "2024-06-20T15:30:00Z",
      "created_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### GET /users/{id}/
Retrieve specific user details.

### GET /users/me/
Get current authenticated user information.

### POST /users/
Create new user account.

### PATCH /users/{id}/
Update user information.

### POST /auth/change-password/
Change user password.

**Request:**
```json
{
  "old_password": "current_password",
  "new_password": "new_secure_password"
}
```

## 🚚 Driver Management

### GET /drivers/
List drivers with filtering and pagination.

**Query Parameters:**
- `status`: Filter by driver status (`active`, `inactive`, `on_leave`, `terminated`, `in_training`)
- `division_id`: Filter by division
- `department_id`: Filter by department
- `assigned_truck_id`: Filter by assigned truck
- `license_expiry_soon`: Boolean, drivers with licenses expiring within 30 days
- `search`: Search by name, license number, or phone

**Response:**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/drivers/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "firstName": "Michael",
      "lastName": "Johnson",
      "email": "mjohnson@launchtrans.com",
      "phoneNumber": "(713) 555-0234",
      "licenseNumber": "TX123456789",
      "licenseExpiry": "2025-12-31",
      "hireDate": "2023-03-15",
      "status": "active",
      "assignedTruckId": "truck-uuid",
      "trainingStatus": "completed",
      "trainingStartDate": "2023-03-15",
      "trainingCompletionDate": "2023-04-15",
      "fuelCard": "FC789012",
      "emergencyContact": {
        "name": "Sarah Johnson",
        "phone": "(713) 555-0235",
        "relationship": "Spouse"
      },
      "organizationalContext": {
        "companyId": "company-uuid",
        "divisionId": "division-uuid",
        "departmentId": "department-uuid",
        "terminalId": "terminal-uuid"
      },
      "accessLevel": "department",
      "createdAt": "2023-03-15T00:00:00Z",
      "updatedAt": "2024-06-21T00:00:00Z"
    }
  ]
}
```

### GET /drivers/{id}/
Retrieve specific driver details including documents and performance metrics.

### POST /drivers/
Create new driver record.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "jsmith@example.com",
  "phoneNumber": "(555) 123-4567",
  "licenseNumber": "TX987654321",
  "licenseExpiry": "2025-12-31",
  "hireDate": "2024-06-21",
  "emergencyContact": {
    "name": "Jane Smith",
    "phone": "(555) 123-4568",
    "relationship": "Spouse"
  },
  "organizationalContext": {
    "companyId": "company-uuid",
    "divisionId": "division-uuid"
  }
}
```

### PATCH /drivers/{id}/
Update driver information.

### DELETE /drivers/{id}/
Deactivate driver (soft delete).

## 🚛 Vehicle Management

### Trucks

#### GET /trucks/
List trucks with filtering and pagination.

**Query Parameters:**
- `status`: Filter by truck status (`available`, `assigned`, `maintenance`, `out_of_service`)
- `make`: Filter by manufacturer
- `year_min`, `year_max`: Filter by year range
- `maintenance_due`: Boolean, trucks due for maintenance
- `registration_expiring`: Boolean, trucks with registration expiring soon
- `assigned_driver_id`: Filter by assigned driver

**Response:**
```json
{
  "count": 30,
  "results": [
    {
      "id": "uuid",
      "make": "Freightliner",
      "model": "Cascadia",
      "year": 2022,
      "licensePlate": "TX123ABC",
      "vin": "1FUJGHDV8NLXXXXXX",
      "color": "White",
      "status": "assigned",
      "assignedDriverId": "driver-uuid",
      "mileage": 125000,
      "lastMaintenance": "2024-05-15",
      "nextMaintenanceDue": "2024-08-15",
      "registrationExpiry": "2025-03-31",
      "insuranceExpiry": "2025-01-15",
      "maintenanceNotes": "Recent brake inspection completed",
      "currentLoad": "load-uuid",
      "organizationalContext": {
        "companyId": "company-uuid",
        "divisionId": "division-uuid",
        "homeTerminalId": "terminal-uuid"
      },
      "is_maintenance_due": false,
      "is_registration_expired": false,
      "is_insurance_expired": false,
      "createdAt": "2022-01-15T00:00:00Z",
      "updatedAt": "2024-06-21T00:00:00Z"
    }
  ]
}
```

#### GET /trucks/{id}/
Retrieve specific truck details with maintenance history.

#### POST /trucks/
Create new truck record.

#### PATCH /trucks/{id}/
Update truck information.

#### DELETE /trucks/{id}/
Remove truck from fleet.

### Trailers

#### GET /trailers/
List trailers with filtering and pagination.

**Response:**
```json
{
  "count": 45,
  "results": [
    {
      "id": "uuid",
      "licensePlate": "TR789XYZ",
      "make": "Great Dane",
      "model": "Super Seal",
      "year": 2021,
      "vin": "1GRAA0626XXXXXXX",
      "type": "dry_van",
      "capacity": 48000,
      "length": 53,
      "status": "assigned",
      "assignedTruckId": "truck-uuid",
      "lastMaintenance": "2024-04-20",
      "nextMaintenanceDue": "2024-07-20",
      "registrationExpiry": "2025-02-28",
      "insuranceExpiry": "2025-01-15",
      "organizationalContext": {
        "companyId": "company-uuid",
        "homeTerminalId": "terminal-uuid"
      },
      "createdAt": "2021-03-10T00:00:00Z",
      "updatedAt": "2024-06-21T00:00:00Z"
    }
  ]
}
```

#### GET /trailers/{id}/
#### POST /trailers/
#### PATCH /trailers/{id}/
#### DELETE /trailers/{id}/

## 📦 Load Management

### GET /loads/
List loads with comprehensive filtering.

**Query Parameters:**
- `status`: Filter by load status (`pending`, `assigned`, `in_transit`, `delivered`, `cancelled`)
- `assigned_driver_id`: Filter by assigned driver
- `assigned_truck_id`: Filter by assigned truck
- `pickup_date_after`, `pickup_date_before`: Date range filters
- `delivery_date_after`, `delivery_date_before`: Date range filters
- `shipper`: Filter by shipper name
- `origin_state`, `destination_state`: Filter by states
- `search`: Search load number, BOL, shipper, or receiver

**Response:**
```json
{
  "count": 150,
  "results": [
    {
      "id": "uuid",
      "loadNumber": "L202500123",
      "bolNumber": "BOL789456",
      "shipper": "ABC Manufacturing",
      "receiver": "XYZ Distribution",
      "pickupLocation": {
        "address": "123 Industrial Blvd",
        "city": "Houston",
        "state": "TX",
        "zipCode": "77001",
        "latitude": 29.7604,
        "longitude": -95.3698
      },
      "deliveryLocation": {
        "address": "456 Commerce St",
        "city": "Dallas",
        "state": "TX",
        "zipCode": "75201",
        "latitude": 32.7767,
        "longitude": -96.7970
      },
      "assignedDriverId": "driver-uuid",
      "assignedTruckId": "truck-uuid",
      "status": "in_transit",
      "cargoDescription": "Electronic Components",
      "weight": 35000,
      "distance": 240,
      "estimatedTransitTime": 5,
      "pickupDate": "2024-06-22T08:00:00Z",
      "deliveryDate": "2024-06-22T17:00:00Z",
      "rate": 1200.00,
      "specialInstructions": "Handle with care - fragile electronics",
      "hazmat": false,
      "events": [
        {
          "id": "event-uuid",
          "type": "pickup",
          "description": "Load picked up successfully",
          "timestamp": "2024-06-22T08:15:00Z",
          "location": "Houston, TX"
        }
      ],
      "organizationalContext": {
        "companyId": "company-uuid",
        "originTerminalId": "terminal-uuid"
      },
      "createdAt": "2024-06-20T00:00:00Z",
      "updatedAt": "2024-06-22T08:15:00Z"
    }
  ]
}
```

### GET /loads/{id}/
Retrieve specific load with complete event history.

### POST /loads/
Create new load assignment.

**Request:**
```json
{
  "loadNumber": "L202500124",
  "bolNumber": "BOL789457",
  "shipper": "Industrial Supplies Co",
  "receiver": "Warehouse Solutions Inc",
  "pickupLocation": {
    "address": "789 Manufacturing Dr",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701"
  },
  "deliveryLocation": {
    "address": "321 Distribution Way",
    "city": "San Antonio",
    "state": "TX",
    "zipCode": "78201"
  },
  "cargoDescription": "Building Materials",
  "weight": 42000,
  "pickupDate": "2024-06-23T09:00:00Z",
  "deliveryDate": "2024-06-23T15:00:00Z",
  "rate": 850.00
}
```

### PATCH /loads/{id}/
Update load information and status.

### DELETE /loads/{id}/
Cancel load (updates status to cancelled).

## 📊 Health Check & System Status

### GET /health/
System health check endpoint (public).

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-06-21T12:00:00Z",
  "database": "connected",
  "services": {
    "authentication": "operational",
    "api": "operational"
  }
}
```

## 🔍 Pagination

All list endpoints support pagination with consistent parameters:

- `page`: Page number (starts at 1)
- `page_size`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/drivers/?page=3",
  "previous": "http://localhost:8000/api/drivers/?page=1",
  "results": [...]
}
```

## 🔍 Filtering & Search

### Common Query Parameters
- `search`: Full-text search across relevant fields
- `ordering`: Sort results by field name (prefix with `-` for descending)
- `page_size`: Control pagination size

### Date Filtering
Use ISO 8601 format for date parameters:
- `created_after=2024-01-01`
- `updated_before=2024-12-31T23:59:59Z`

### Boolean Filtering
Use standard boolean values:
- `is_active=true`
- `hazmat=false`

## ⚠️ Error Handling

### HTTP Status Codes
- `200 OK`: Successful GET, PATCH requests
- `201 Created`: Successful POST requests
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": "Validation failed",
  "details": {
    "field_name": ["This field is required."],
    "email": ["Enter a valid email address."]
  },
  "code": "validation_error",
  "timestamp": "2024-06-21T12:00:00Z"
}
```

## 🔐 Permissions & Scoping

### Organizational Data Scoping
All data is automatically scoped to the user's organization:
- **Company Level**: Access to all company data
- **Division Level**: Access to division and below
- **Department Level**: Access to department and below
- **Terminal Level**: Access to terminal-specific data

### Permission Levels
- **Read Only**: View access only
- **Department**: CRUD within department
- **Division**: CRUD within division
- **Company**: Full company access
- **Admin**: System administration

## 📝 Interactive Documentation

### Swagger UI
Visit the interactive API documentation at:
```
http://localhost:8000/api/docs/
```

### OpenAPI Schema
Download the complete API schema:
```
http://localhost:8000/api/schema/
```

## 🚀 Rate Limiting

API requests are rate-limited to ensure system stability:
- **Authenticated Users**: 1000 requests/hour
- **Anonymous Users**: 100 requests/hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📱 Mobile API Considerations

### Optimized Endpoints
- Reduced payload sizes for mobile
- Efficient pagination
- Compressed image responses
- Offline capability support

### Mobile-Specific Headers
```
X-Mobile-App: true
X-App-Version: 1.0.0
```

---

*This documentation is automatically updated with API changes. Last updated: June 21, 2025*
