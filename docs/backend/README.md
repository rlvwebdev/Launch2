# 🖥️ Backend Documentation

## Django REST API

### Overview

The Launch TMS backend is built using Django 5.0.4 with Django REST Framework, providing a robust API for the transportation management platform. The backend follows a multi-tenant architecture with company-based data isolation and hierarchical organizational structure.

### Architecture

```
backend/
├── launch_tms/          # Django project settings
├── companies/           # Company and user management
├── drivers/            # Driver management
├── vehicles/           # Trucks and trailers
├── loads/              # Load management
├── api/                # API routing and configuration
└── requirements.txt    # Python dependencies
```

### Framework & Dependencies

- **Django 5.0.4** - Core web framework
- **Django REST Framework** - API framework
- **djangorestframework-simplejwt** - JWT authentication
- **drf-spectacular** - OpenAPI/Swagger documentation
- **corsheaders** - CORS handling for frontend communication
- **python-decouple** - Environment configuration

### Database Design

The system uses PostgreSQL in production with a hierarchical organizational structure:

```
Company
└── Division
    └── Department
        └── Terminal
```

## Core Models

### 1. Company Management (`companies` app)

#### BaseModel (Abstract)
- **Fields:** `id` (UUID), `created_at`, `updated_at`
- **Purpose:** Common fields for all models

#### Company
- **Fields:** `name`, `code`, address fields, `phone`, `email`, `is_active`, `timezone`
- **Purpose:** Root organization entity for multi-tenancy

#### Division
- **Fields:** `company` (FK), `name`, `code`, `manager_email`, `is_active`
- **Purpose:** Major business divisions within a company

#### Department
- **Fields:** `division` (FK), `name`, `code`, `manager_email`, `is_active`
- **Purpose:** Operational departments within divisions

#### Terminal
- **Fields:** `department` (FK), `name`, `code`, address fields, `phone`, `manager_email`, `is_active`
- **Purpose:** Physical locations/terminals

#### CustomUser (Extended User)
- **Extends:** Django's AbstractUser
- **Fields:** `id` (UUID), `company` (FK), organizational assignments, role, access level
- **Purpose:** Multi-tenant user management

### 2. Driver Management (`drivers` app)

#### Driver
- **Personal Info:** `first_name`, `last_name`, `email`, `phone_number`, `address`
- **Employment:** `hire_date`, `status` (active/inactive/on_leave/terminated/in_training)
- **Training:** `training_status`, `training_start_date`, `training_completion_date`, `training_supervisor`, `training_notes`
- **License:** `license_number`, `license_expiry`
- **Emergency Contact:** `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relationship`
- **Organization:** `company`, `division`, `department`, `home_terminal`
- **Assignments:** `assigned_truck`, `supervisor`
- **Access:** `access_level` (read_only/department/division/company)

#### DriverDocument
- **Fields:** `driver` (FK), `document_type`, `document_name`, `file_path`, `expiry_date`, `is_active`
- **Purpose:** Store driver-related documents (license, medical certificates, etc.)

### 3. Vehicle Management (`vehicles` app)

#### Truck
- **Basic Info:** `make`, `model`, `year`, `license_plate`, `vin`, `color`
- **Status:** `status` (available/assigned/maintenance/out_of_service)
- **Assignment:** `assigned_driver` (OneToOne)
- **Maintenance:** `mileage`, `last_maintenance`, `next_maintenance_due`, `registration_expiry`, `insurance_expiry`, `maintenance_notes`
- **Organization:** `company`, `division`, `department`, `home_terminal`, `assigned_terminal`
- **Current Load:** `current_load`

#### Trailer
- **Basic Info:** `trailer_number`, `make`, `model`, `year`, `vin`
- **Specifications:** `trailer_type`, `capacity`, `length`
- **Status:** `status`, `assigned_truck`
- **Organization:** Same as Truck

### 4. Load Management (`loads` app)

#### Load
- **Identification:** `load_number`, `bol_number`
- **Companies:** `shipper`, `receiver`
- **Pickup Location:** `pickup_address`, `pickup_city`, `pickup_state`, `pickup_zip`, `pickup_lat`, `pickup_lng`
- **Delivery Location:** `delivery_address`, `delivery_city`, `delivery_state`, `delivery_zip`, `delivery_lat`, `delivery_lng`
- **Assignments:** `assigned_driver`, `assigned_truck`
- **Status:** `status` (pending/assigned/in_transit/delivered/cancelled)
- **Cargo:** `cargo_description`, `weight`, `distance`, `estimated_transit_time`
- **Schedule:** `pickup_date`, `delivery_date`
- **Financial:** `rate`
- **Organization:** `company`, `division`, `department`, `origin_terminal`, `destination_terminal`

#### LoadEvent
- **Fields:** `load` (FK), `event_type`, `event_time`, `location`, `notes`, `created_by`
- **Purpose:** Track load status changes and events

## API Structure

### Base URL
```
http://localhost:8000/api/
```

### Authentication Endpoints

#### POST /auth/login/
- **Purpose:** User authentication
- **Request:** `{ "username": "user", "password": "pass" }`
- **Response:** `{ "access": "jwt_token", "refresh": "refresh_token", "user": {...} }`

#### POST /auth/refresh/
- **Purpose:** Refresh JWT token
- **Request:** `{ "refresh": "refresh_token" }`
- **Response:** `{ "access": "new_jwt_token" }`

#### POST /auth/register/
- **Purpose:** User registration
- **Request:** User data with company assignment
- **Response:** User object with tokens

### Resource Endpoints

All resource endpoints follow REST conventions:

#### Companies
- `GET /companies/` - List companies
- `POST /companies/` - Create company
- `GET /companies/{id}/` - Get company details
- `PUT /companies/{id}/` - Update company
- `DELETE /companies/{id}/` - Delete company

#### Drivers
- `GET /drivers/` - List drivers (filtered by user's company/access level)
- `POST /drivers/` - Create driver
- `GET /drivers/{id}/` - Get driver details
- `PUT /drivers/{id}/` - Update driver
- `DELETE /drivers/{id}/` - Delete driver

#### Trucks
- `GET /trucks/` - List trucks
- `POST /trucks/` - Create truck
- `GET /trucks/{id}/` - Get truck details
- `PUT /trucks/{id}/` - Update truck
- `DELETE /trucks/{id}/` - Delete truck

#### Trailers
- `GET /trailers/` - List trailers
- `POST /trailers/` - Create trailer
- `GET /trailers/{id}/` - Get trailer details
- `PUT /trailers/{id}/` - Update trailer
- `DELETE /trailers/{id}/` - Delete trailer

#### Loads
- `GET /loads/` - List loads
- `POST /loads/` - Create load
- `GET /loads/{id}/` - Get load details
- `PUT /loads/{id}/` - Update load
- `DELETE /loads/{id}/` - Delete load

### Permissions & Access Control

The system implements role-based access control:

1. **Multi-tenant Data Isolation:** All data is filtered by company
2. **Hierarchical Access:** Users can access data based on their organizational level
3. **Role-based Permissions:** Different access levels (read_only, department, division, company)

### Authentication Flow

1. User logs in with credentials
2. Backend validates and returns JWT tokens
3. Frontend stores tokens and includes access token in API requests
4. Backend validates token and enforces company-based data filtering

## Database Configuration

### Development
- SQLite database for local development
- Automatic migrations

### Production
- PostgreSQL database
- Connection via DATABASE_URL environment variable

## Environment Variables

Required environment variables:

```
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:port/dbname
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Running the Backend

### Development
```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Production
```bash
python manage.py collectstatic
python manage.py migrate
gunicorn launch_tms.wsgi:application
```

## API Documentation

Interactive API documentation is available at:
- **Swagger UI:** `http://localhost:8000/api/schema/swagger-ui/`
- **ReDoc:** `http://localhost:8000/api/schema/redoc/`
- **OpenAPI Schema:** `http://localhost:8000/api/schema/`

## Testing

Run tests with:
```bash
python manage.py test
```

Test coverage includes:
- Model tests
- API endpoint tests
- Authentication tests
- Permission tests

## Security Features

1. **JWT Authentication:** Secure token-based authentication
2. **CORS Protection:** Configured for frontend domain
3. **Multi-tenant Isolation:** Company-based data separation
4. **Input Validation:** DRF serializer validation
5. **SQL Injection Protection:** Django ORM prevents SQL injection
6. **CSRF Protection:** Django middleware protection

## Performance Considerations

1. **Database Indexing:** Proper indexes on frequently queried fields
2. **Query Optimization:** Use of select_related and prefetch_related
3. **Pagination:** All list endpoints support pagination
4. **Caching:** Can be configured with Redis for production

## Monitoring & Logging

1. **Django Logging:** Configured for different environments
2. **Error Tracking:** Can integrate with Sentry
3. **Performance Monitoring:** Can integrate with APM tools
4. **Health Checks:** `/api/health/` endpoint for monitoring

### Key Features

- **RESTful API**: Full CRUD operations for all entities
- **JWT Authentication**: Secure token-based authentication
- **Company-based Multi-tenancy**: Data isolation by company
- **Hierarchical Organization**: Division → Department → Terminal structure
- **Role-based Permissions**: Different access levels for users
- **OpenAPI Documentation**: Auto-generated API docs with Swagger UI
- **Comprehensive Testing**: Unit and integration tests
- **Security Features**: CORS protection, input validation, SQL injection prevention
