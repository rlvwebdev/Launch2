# 🖥️ Backend Documentation

## Django REST API

### Overview

The Launch TMS backend is built with Django 5.0.4 and Django REST Framework, providing a robust and scalable API for the transportation management system.

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

### Key Features

- **RESTful API**: Full CRUD operations for all entities
- **JWT Authentication**: Secure token-based authentication
- **Company-based Multi-tenancy**: Data isolation by company
- **Role-based Permissions**: Different access levels for users
- **OpenAPI Documentation**: Auto-generated API docs with Swagger UI

### Models

#### Company Structure
- **Company**: Main organization entity
- **Division**: Organizational subdivisions
- **Department**: Departmental structure
- **Terminal**: Physical locations

#### Transportation Entities
- **Driver**: Driver information and licensing
- **Truck**: Vehicle details and maintenance
- **Trailer**: Trailer information
- **Load**: Shipment details and tracking

### API Endpoints

Base URL: `http://localhost:8000/api/`

#### Authentication
- `POST /auth/login/` - Obtain JWT token
- `POST /auth/refresh/` - Refresh JWT token

#### Core Resources
- `GET/POST /companies/` - Company management
- `GET/POST /users/` - User management
- `GET /users/me/` - Current user info
- `GET/POST /drivers/` - Driver management
- `GET/POST /trucks/` - Truck management
- `GET/POST /trailers/` - Trailer management
- `GET/POST /loads/` - Load management

### Database

- **Engine**: PostgreSQL
- **Migrations**: Django ORM migrations
- **Test Data**: Available via `create_django_test_data.py`

### Development

#### Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### Database Setup
```bash
python manage.py migrate
python create_django_test_data.py
```

#### Running the Server
```bash
python manage.py runserver
```

### Testing

#### Test User Credentials
- **Username**: `testuser`
- **Email**: `test@launch.com`
- **Password**: `password`
- **Role**: `company_admin`

### Environment Variables

Required environment variables (`.env`):
```bash
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/launch_tms
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```
