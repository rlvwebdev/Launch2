<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 🚀 Launch - Transportation Management Platform

## Project Context
Launch is a comprehensive transportation management system (TMS) designed for trucking companies to manage their fleet operations. The platform provides end-to-end solutions for driver management, vehicle tracking, load scheduling, and operational reporting. Built as a modern full-stack application with a Django REST API backend and Next.js frontend, the system is architected for scalability, multi-tenancy, and mobile-first usage patterns.

**Target Users**: Fleet managers, dispatchers, drivers, and company administrators
**Primary Use Cases**: Fleet operations, load management, driver coordination, compliance tracking, financial reporting

## Project Structure
```
Launch2/
├── frontend/                    # Next.js 15 React Application
│   ├── src/
│   │   ├── app/                # App Router pages and layouts
│   │   │   ├── drivers/        # Driver management pages
│   │   │   ├── trucks/         # Vehicle management pages
│   │   │   ├── loads/          # Load management pages
│   │   │   ├── reports/        # Reporting and analytics pages
│   │   │   └── settings/       # Application settings
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/             # Base UI components (buttons, forms, etc.)
│   │   │   ├── layout/         # Layout components (headers, navigation)
│   │   │   ├── forms/          # Form components with validation
│   │   │   └── reports/        # Report-specific components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries and configurations
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Helper functions and utilities
│   ├── public/                 # Static assets
│   ├── .env.local              # Frontend environment variables
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── next.config.ts          # Next.js configuration
├── backend/                     # Django 5.0.4 REST API
│   ├── launch_tms/             # Django project settings
│   │   ├── settings/           # Environment-specific settings
│   │   ├── urls.py             # Root URL configuration
│   │   └── wsgi.py             # WSGI application
│   ├── apps/                   # Django applications
│   │   ├── companies/          # Company and tenant management
│   │   ├── users/              # User authentication and profiles
│   │   ├── drivers/            # Driver management and licensing
│   │   ├── vehicles/           # Truck and trailer management
│   │   ├── loads/              # Load and shipment management
│   │   ├── reports/            # Reporting and analytics
│   │   └── core/               # Shared models and utilities
│   ├── api/                    # API routing and versioning
│   ├── tests/                  # Test suites
│   ├── requirements/           # Python dependencies by environment
│   └── manage.py               # Django management script
├── docs/                       # Comprehensive documentation
│   ├── api/                    # API documentation
│   ├── deployment/             # Deployment guides
│   ├── frontend/               # Frontend documentation
│   ├── backend/                # Backend documentation
│   └── project/                # Project management docs
├── docker-compose.yml          # Local development database
├── .github/                    # GitHub workflows and templates
│   ├── workflows/              # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── pull_request_template.md
└── .gitignore                  # Git ignore patterns
```

## Architecture Guidelines

### Backend (Django)
- **Framework**: Django 5.0.4 with Django REST Framework
- **Database**: PostgreSQL for production, SQLite for development
- **Authentication**: JWT tokens with djangorestframework-simplejwt
- **Multi-tenancy**: Company-based data isolation with proper filtering
- **API Documentation**: DRF Spectacular for OpenAPI/Swagger docs
- **Serializers**: Use ModelSerializer with proper field validation
- **ViewSets**: Implement proper CRUD operations with permissions
- **Pagination**: Use PageNumberPagination for large datasets
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Logging**: Comprehensive logging for debugging and monitoring
- **Testing**: Unit tests with Django TestCase and pytest

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS v4 with custom component system
- **State Management**: React Context for global state, local state for components
- **Forms**: React Hook Form with Zod validation schemas
- **API Calls**: Custom hooks with error handling and loading states
- **Routing**: File-based routing with proper layouts and loading states
- **Components**: Functional components with proper TypeScript interfaces
- **Performance**: Next.js Image optimization, code splitting, lazy loading
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels
- **PWA**: Progressive Web App features for mobile users
- **Testing**: Jest and React Testing Library for component tests

## Core Features

### Driver Management
- **Driver Profiles**: Personal information, contact details, emergency contacts
- **Licensing**: CDL validation, endorsements, expiration tracking
- **Assignments**: Truck assignments, route assignments, availability status
- **Performance**: Driving scores, safety records, completion rates
- **Documents**: License scans, medical certificates, training records

### Vehicle Management (Trucks & Trailers)
- **Fleet Inventory**: Truck and trailer registration and specifications
- **Maintenance**: Scheduled maintenance, repairs, inspection records
- **Assignments**: Driver assignments, load assignments, availability
- **Compliance**: DOT inspections, registration renewals, insurance
- **Tracking**: GPS integration, fuel efficiency, utilization metrics

### Load Management
- **Load Planning**: Origin/destination, cargo details, special requirements
- **Scheduling**: Pickup/delivery windows, route optimization
- **Status Tracking**: Real-time updates, milestone events, delays
- **Documentation**: BOL, POD, invoicing, customer communications
- **Analytics**: On-time performance, profitability, customer satisfaction

### Reporting & Analytics
- **Operational Reports**: Fleet utilization, driver performance, load metrics
- **Financial Reports**: Revenue tracking, cost analysis, profit margins
- **Compliance Reports**: DOT compliance, safety scores, audit trails
- **Custom Dashboards**: KPI monitoring, trend analysis, alerts
- **Data Export**: CSV, PDF, Excel formats for external analysis

## Mobile-First Design Requirements
- **Navigation**: Bottom navigation with 4 main sections: Drivers, Trucks, Loads, Reports
- **Touch Targets**: Minimum 44px touch targets for all interactive elements
- **Responsive Design**: Scales from mobile (320px) to desktop (1920px+)
- **Performance**: Optimized for 3G networks and slower devices
- **Offline Support**: Critical features work without internet connection
- **PWA Features**: App-like experience with push notifications
- **Accessibility**: Screen reader support, keyboard navigation, color contrast
- **Quick Actions**: Swipe gestures, floating action buttons, voice input

## Data Models
Use the TypeScript interfaces defined in `frontend/src/types/index.ts` for:
- **Driver**: Personal info, licensing, assignments, status, performance metrics
- **Truck**: Vehicle details, maintenance records, assignments, GPS location
- **Trailer**: Trailer specifications, maintenance, load capacity, status
- **Load**: Origin/destination, cargo details, status, event history, financials
- **Company**: Organization structure, settings, billing, compliance
- **User**: Authentication, roles, permissions, preferences
- **Route**: Planned routes, waypoints, estimated times, actual performance
- **Document**: File attachments, signatures, certifications, compliance docs

Ensure frontend types match Django model serializers for API consistency.

### Database Relationships
- Companies have many Drivers, Trucks, Trailers, and Loads
- Drivers can be assigned to Trucks (one-to-one active assignment)
- Trucks can pull Trailers (many-to-many through assignments)
- Loads are assigned to Driver/Truck/Trailer combinations
- All entities belong to a Company for multi-tenancy

## Code Style

### General Principles
- **DRY (Don't Repeat Yourself)**: Extract common functionality into reusable components/functions
- **SOLID Principles**: Single responsibility, proper abstraction, dependency injection
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Type Safety**: Strict TypeScript with no `any` types unless absolutely necessary
- **Documentation**: JSDoc comments for complex functions and components

### Frontend (React/Next.js)
- Use functional components with React hooks exclusively
- Implement proper error boundaries and loading states
- Follow accessibility best practices (WCAG 2.1 AA)
- Use semantic HTML elements and proper ARIA labels
- Custom hooks for data fetching and business logic
- Memoization (useMemo, useCallback) for performance optimization
- Component composition over inheritance
- Props interfaces with proper TypeScript definitions

### Backend (Django)
- Follow Django best practices and PEP 8 style guide
- Use class-based views and ViewSets for consistency
- Implement proper permissions and authentication checks
- Use Django's built-in validation and serialization
- Write comprehensive docstrings for all classes and methods
- Use type hints for function parameters and return values
- Implement proper exception handling with custom exception classes
- Use Django's ORM efficiently with select_related and prefetch_related

## Git Workflow
- **Branching Strategy**: GitFlow with `main`, `develop`, and feature branches
- **Commit Messages**: Follow Conventional Commits specification
- **Feature Branches**: Create from `develop`, name as `feature/description-here`
- **Code Reviews**: Required for all pull requests to `develop` and `main`
- **Pull Requests**: Use the provided PR template for consistent reviews
- **Branch Protection**: `main` and `develop` branches require PR approval
- **Automated Testing**: All tests must pass before merge
- **Documentation**: Update relevant docs with code changes

## API Integration
- **Backend Base URL**: `http://localhost:8000/api/v1/`
- **Authentication**: JWT tokens via `/api/v1/auth/login/`
- **Token Refresh**: Automatic token refresh with refresh tokens
- **Error Handling**: Standardized error responses with proper HTTP codes
- **Versioning**: API versioning with `/v1/` prefix for future compatibility
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Environment Variables**: Configure in `frontend/.env.local` and `backend/.env`
- **CORS**: Properly configured for frontend-backend communication
- **OpenAPI Docs**: Interactive API documentation at `/api/schema/swagger-ui/`

## Development Workflow
- **Frontend**: `cd frontend && npm run dev` (runs on :3000)
- **Backend**: `cd backend && python manage.py runserver` (runs on :8000) 
- **Database**: `docker-compose up -d` (PostgreSQL on :5432)
- **API Docs**: Available at `http://localhost:8000/api/schema/swagger-ui/`
- **Hot Reload**: Both frontend and backend support hot reloading
- **Environment Setup**: Copy `.env.example` files and configure variables
- **Database Migrations**: Run `python manage.py migrate` after model changes
- **Seed Data**: Use management commands for development data

## CI/CD Pipeline
- Automated testing for both frontend and backend
- Vercel deployment for frontend
- GitHub Actions workflows in `.github/workflows/`
- Dependabot for dependency management
- **Testing Requirements**: All tests must pass before deployment
- **Code Quality**: ESLint, Prettier, and Black for code formatting
- **Security Scanning**: Automated security vulnerability scanning
- **Performance Monitoring**: Lighthouse CI for frontend performance

## Testing Strategy
- Write unit tests for utilities and hooks
- Implement integration tests for critical user flows
- Test mobile responsiveness across device sizes
- Validate accessibility with screen readers
- **Backend Testing**: Django TestCase for models, DRF APITestCase for endpoints
- **Frontend Testing**: Jest for unit tests, Cypress for E2E testing
- **Test Coverage**: Maintain >80% test coverage for critical business logic
- **Mock Data**: Use factories for consistent test data generation
- **API Testing**: Automated API testing with Postman/Newman collections

## Performance Considerations
- Optimize for mobile networks and slower devices
- Implement proper loading states and error handling
- Use Next.js image optimization
- Consider offline capabilities for mobile users
- **Database Optimization**: Use database indexes and query optimization
- **Caching Strategy**: Redis for session caching and API response caching
- **CDN**: Use CDN for static assets and images
- **Bundle Optimization**: Code splitting and lazy loading for frontend
- **Monitoring**: Application performance monitoring (APM) integration

## Dependencies
- **Core**: React 19, Next.js 15.3.3, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **UI**: Headless UI components
- **Utilities**: clsx for conditional classes
- **Backend**: Django 5.0.4, Django REST Framework, PostgreSQL
- **Authentication**: djangorestframework-simplejwt
- **Documentation**: DRF Spectacular for API docs
- **Testing**: Jest, React Testing Library, Django TestCase, pytest
- **Development**: ESLint, Prettier, Black, pre-commit hooks

## Security Considerations
- **Authentication**: Secure JWT token implementation with refresh tokens
- **Authorization**: Role-based access control (RBAC) with granular permissions
- **Data Validation**: Input sanitization and validation on both frontend and backend
- **SQL Injection**: Use Django ORM to prevent SQL injection attacks
- **XSS Protection**: Content Security Policy (CSP) and input sanitization
- **CSRF Protection**: Django CSRF middleware and proper token handling
- **HTTPS**: Enforce HTTPS in production with proper SSL configuration
- **Environment Variables**: Secure storage of secrets and API keys
- **Audit Logging**: Track user actions and system changes for compliance

## Business Logic Guidelines
- **Multi-Tenancy**: All data operations must be company-scoped
- **Driver Compliance**: Enforce CDL validation and medical certificate tracking
- **Load Status**: Implement proper state machine for load lifecycle
- **Vehicle Assignments**: Ensure proper driver-truck-trailer assignments
- **DOT Compliance**: Track hours of service, vehicle inspections, driver logs
- **Financial Tracking**: Accurate cost and revenue calculation per load
- **Geolocation**: GPS tracking for vehicles and route optimization
- **Notifications**: Real-time alerts for critical events and deadlines
- **Document Management**: Secure storage and retrieval of compliance documents
- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.
