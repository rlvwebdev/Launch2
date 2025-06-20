<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 🚀 Launch - Transportation Management Platform

## Project Context
This is a full-stack transportation management application with a Django REST API backend and Next.js frontend. The project is organized into separate frontend and backend directories for better maintainability.

## Project Structure
```
Launch2/
├── frontend/           # Next.js 15 application
│   ├── src/           # React components and pages
│   ├── public/        # Static assets
│   └── .env.local     # Frontend environment variables
├── backend/           # Django 5.0.4 REST API
│   ├── launch_tms/    # Django project settings
│   ├── companies/     # Company and user management
│   ├── drivers/       # Driver management
│   ├── vehicles/      # Vehicle management (trucks/trailers)
│   ├── loads/         # Load management
│   └── api/          # API routing
├── docs/             # Comprehensive documentation
├── docker-compose.yml # PostgreSQL database
└── .github/          # GitHub workflows and templates
```

## Architecture Guidelines

### Backend (Django)
- Use Django REST Framework for API endpoints
- Implement JWT authentication with djangorestframework-simplejwt
- Follow company-based multi-tenancy for data isolation
- Use PostgreSQL for production database
- Implement proper serializers and viewsets
- Document APIs with DRF Spectacular (OpenAPI/Swagger)

### Frontend (Next.js)
- Use Next.js App Router with TypeScript
- Implement mobile-first responsive design
- Follow component-based architecture
- Use Tailwind CSS v4 for styling
- Implement proper TypeScript interfaces for all data models
- Connect to Django backend via REST API calls

## Core Features
- **Driver Management**: Manage driver information and truck assignments
- **Truck Management**: Track vehicle details and maintenance
- **Load Management**: Monitor loads with status tracking and event history  
- **Settings**: Application configuration and preferences

## Mobile-First Design Requirements
- Bottom navigation with 4 main sections: Drivers, Trucks, Loads, Settings
- Touch-friendly interfaces with minimum 44px touch targets
- Responsive design that scales to desktop with dashboard view
- Progressive Web App capabilities

## Data Models
Use the TypeScript interfaces defined in `frontend/src/types/index.ts` for:
- Driver: Personal info, licensing, assignments, status
- Truck: Vehicle details, maintenance records, assignments  
- Load: Origin/destination, cargo details, status, event history
- Company: Organization structure and settings

Ensure frontend types match Django model serializers for API consistency.

## Code Style
- Use functional components with React hooks
- Implement proper error boundaries and loading states
- Follow accessibility best practices (WCAG 2.1)
- Use semantic HTML elements
- Implement proper TypeScript typing (avoid `any`)

## Git Workflow
- Follow the branching strategy outlined in `docs/project/`
- Use conventional commit messages
- Create feature branches from `develop`
- Require code reviews before merging
- Use the provided PR template for consistent reviews

## API Integration
- **Backend Base URL**: `http://localhost:8000/api/`
- **Authentication**: JWT tokens via `/api/auth/login/`
- **Environment Variables**: Configure in `frontend/.env.local` and root `.env`
- **CORS**: Properly configured for frontend-backend communication

## Development Workflow
- **Frontend**: `cd frontend && npm run dev` (runs on :3000)
- **Backend**: `cd backend && python manage.py runserver` (runs on :8000) 
- **Database**: `docker-compose up -d` (PostgreSQL on :5432)
- **API Docs**: Available at `http://localhost:8000/api/schema/swagger-ui/`

## CI/CD Pipeline
- Automated testing for both frontend and backend
- Vercel deployment for frontend
- GitHub Actions workflows in `.github/workflows/`
- Dependabot for dependency management

## Testing Strategy
- Write unit tests for utilities and hooks
- Implement integration tests for critical user flows
- Test mobile responsiveness across device sizes
- Validate accessibility with screen readers

## Performance Considerations
- Optimize for mobile networks and slower devices
- Implement proper loading states and error handling
- Use Next.js image optimization
- Consider offline capabilities for mobile users

## Dependencies
- **Core**: React 19, Next.js 15.3.3, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **UI**: Headless UI components
- **Utilities**: clsx for conditional classes
- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.
