# 🚀 Launch - Transportation Management Platform

A modern, full-stack transportation management system with a **Django REST API backend** and **Next.js frontend**. Built with mobile-first design principles and featuring a sophisticated authentication system, comprehensive theme management, and responsive design that adapts from mobile to desktop seamlessly.

![Launch Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Django](https://img.shields.io/badge/Django-5.0.4-092e20)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)

## 🌟 Recent Major Updates (June 2025)

### ✅ **Production Build Success**

- **🔧 Build System Excellence**: Resolved all compilation errors and achieved successful production build
- **📦 Optimized Bundles**: 62 routes generated with 4.0s build time and optimized code splitting
- **🔍 Type Safety**: 100% TypeScript coverage with strict mode compliance
- **🧹 Codebase Cleanup**: Removed problematic backup files and legacy code

### 🎨 Enhanced Authentication Experience

- **🚀 WELCOME BACK Design**: Bold, uppercase welcome message with rocket emoji
- **🚛 Join the Launch Fleet**: Engaging registration form with transportation theming
- **Responsive Layout Animation**: Dynamic width adjustment between login/registration modes
- **Two-Column Registration**: Elegant side-by-side layout for desktop users with smooth transitions
- **Theme-Aware Styling**: Complete integration with CSS custom properties and accent colors
- **Background Enhancements**: Professional highway interchange imagery with gradient overlays
- **Mobile-First Typography**: Optimized text sizing and spacing for all device sizes
- **Triangle Removal**: Clean branding with simple accent-colored "A" in LAUNCH

### 🎭 Advanced Theme System

- **CSS Variable Architecture**: Complete theme system with `--color-accent`, `--color-text`, `--color-background`
- **Consistent Accent Colors**: All headings, buttons, and interactive elements use theme variables
- **Custom Theme Editor**: Full theme creation and editing capabilities
- **Theme Persistence**: User preferences saved across sessions
- **Professional Color Schemes**: Transportation industry-focused color palettes
- **Dark/Light Mode Support**: Seamless theme switching with proper contrast

### 📱 Mobile Experience Improvements

- **Navigation Reorganization**: Organizations moved to Settings → Organization tab for cleaner UI
- **Enhanced Settings Page**: 
  - Account section with user info, roles, permissions, and company details
  - Organization section with current context and hierarchy
  - Professional demo user card styling
- **Improved Forms**: Better error visibility with legible colors and theme-consistent styling
- **Touch-Optimized**: Proper spacing and sizing for mobile interaction
- **Responsive Typography**: LAUNCH text scales properly across all screen sizes

### 🎯 UI/UX Refinements

- **Report Headings**: All h3 headings use accent color with contextual icons
- **Error Message Legibility**: Improved contrast and visibility for form validation
- **Hydration Error Fixes**: Resolved table whitespace issues in drivers page
- **Professional Branding**: Consistent Launch branding with transportation theme
- **Icon Integration**: Meaningful icons throughout the interface for better UX

### 🏆 **Production Ready Status**

- **✅ Frontend Excellence**: Modern Next.js 15 + TypeScript 5 + React 19 architecture
- **✅ Build Success**: All 62 routes compile successfully with optimization
- **✅ Performance**: Fast 4.0s build times with optimal bundle sizes
- **✅ Mobile-First**: Perfect responsive design across all devices  
- **✅ Professional UX**: Engaging authentication and intuitive navigation
- **✅ Code Quality**: Clean, maintainable, and well-structured codebase

## 🚀 Live Demo

Experience Launch in action:

### 🌟 **Live Application**

[![Deploy with Vercel](https://vercel.com/button)](https://launch2-chi.vercel.app)

- **📱 Demo Application**: [launch2-chi.vercel.app](https://launch2-chi.vercel.app) (Frontend only)
- **📂 GitHub Repository**: [https://github.com/rlvwebdev/Launch2](https://github.com/rlvwebdev/Launch2)
- **📖 Demo Guide**: [DEMO_GUIDE.md](./DEMO_GUIDE.md)
- **🎬 Demo Showcase**: [DEMO_SHOWCASE.md](./DEMO_SHOWCASE.md)

### 🎯 **Quick Deploy Options**

```bash
# Option 1: One-click Vercel deployment (Frontend only)
# Click the "Deploy with Vercel" button above

# Option 2: Full-stack local development
git clone https://github.com/rlvwebdev/Launch2.git
cd Launch2

# Start database
docker-compose up -d

# Start backend (Django)
cd backend && python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt && python manage.py migrate
python manage.py runserver

# Start frontend (Next.js) - in new terminal
cd frontend && npm install && npm run dev

# Option 3: Use deployment scripts (frontend only)
cd frontend
./deploy.ps1    # Windows PowerShell
./deploy.sh     # Linux/Mac Bash
```

## 📱 Features

### Core Functionality
- **📋 Driver Management** - Complete roster management with 23 drivers
  - Real-time status tracking (Active, In Training, OOS)
  - Search and filtering capabilities
  - Grid and list view options
  - Detailed driver profiles with contact information
  - Import/export capabilities with Excel templates

- **🚛 Fleet Management** - Comprehensive truck tracking
  - Professional numbering system (2812-2856A format)
  - Maintenance scheduling and alerts
  - Assignment management
  - Document management system
  - Add/edit truck functionality with validation
  - Grid and list view with detailed truck cards

- **� Trailer Management** - Complete trailer tracking
  - Trailer numbering and identification
  - Assignment and availability tracking
  - Maintenance scheduling
  - Status monitoring

- **�📦 Load Management** - Advanced load tracking
  - Tabbed interface (Today, Tomorrow, All Loads, Events)
  - Status monitoring and updates (Scheduled, In Transit, Delivered, etc.)
  - Action buttons for operations (Lytx, Transflo, etc.)
  - Comprehensive load information display
  - Search and filtering by status, customer, or route
  - Load statistics and performance metrics

- **📊 Reports & Analytics** - Comprehensive reporting dashboard
  - Real-time performance metrics and KPIs
  - Interactive charts and visualizations
  - Load status distribution analysis
  - Truck utilization reports
  - Driver performance tracking
  - Export functionality for data analysis

- **⚙️ Settings & Configuration** - User preferences
  - Profile management
  - Notification preferences
  - Application settings
  - Import/export templates and data management

### Import/Export System
- **📥 Excel Import** - Bulk data import capabilities
  - Support for Drivers, Trucks, Trailers, Loads, and Settings
  - Template-based import with validation
  - Error handling and data mapping
  - Demo data files for testing and development

- **📤 Excel Export** - Data export functionality
  - Export all entity types to Excel format
  - Template generation for easy data entry
  - Batch operations for bulk data management

### Design & UX
- **📱 Mobile-First Design** - Optimized for mobile devices with desktop scalability
- **🎨 Modern UI** - Clean, professional interface with consistent design system
- **⚡ Responsive Navigation** - Bottom navigation for mobile (6 items: Home, Drivers, Trucks, Loads, Reports, Settings), collapsible sidebar for desktop
- **📊 Mobile Reports Access** - Full analytics and reporting functionality accessible from mobile navigation
- **🔍 Advanced Search** - Powerful search and filtering across all modules
- **📈 Real-time Stats** - Live dashboard with key performance indicators

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.0.4 with Django REST Framework
- **Database**: PostgreSQL with psycopg2-binary
- **Authentication**: JWT tokens with djangorestframework-simplejwt
- **API Documentation**: DRF Spectacular (OpenAPI/Swagger)
- **CORS**: django-cors-headers for frontend integration
- **Security**: Django OAuth Toolkit for advanced authentication

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library with Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and Context API with localStorage persistence
- **API Integration**: Custom API client with JWT authentication

### Database & Infrastructure
- **Database**: PostgreSQL 14+ with Docker Compose
- **Authentication**: JWT-based with refresh tokens
- **API Architecture**: RESTful API with proper serialization
- **Development Environment**: Docker Compose for database
- **Production Ready**: Environment-based configuration

### Development Tools
- **Backend Package Manager**: pip with virtual environments
- **Frontend Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Testing**: pytest-django and factory-boy for backend testing
- **Git Workflow**: Feature branch workflow with main/develop branches
- **Code Style**: TypeScript strict mode, Django best practices

## 🚦 Getting Started

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **PostgreSQL 14+** (or use Docker Compose)
- **Git** for version control

### Quick Start (Full Stack)

1. **Clone the repository**
   ```bash
   git clone https://github.com/rlvwebdev/Launch2.git
   cd Launch2
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Setup backend (Django)**
   ```bash
   cd backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

4. **Setup frontend (Next.js)**
   ```bash
   # In a new terminal
   cd frontend
   npm install
   npm run dev
   ```

5. **Open your browser**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
   - **API Docs**: [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)

### Available Scripts

#### Frontend (Next.js)
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### Backend (Django)
```bash
cd backend
python manage.py runserver        # Start development server
python manage.py migrate          # Run database migrations
python manage.py createsuperuser  # Create admin user
python manage.py test             # Run tests
```

#### Database
```bash
docker-compose up -d    # Start PostgreSQL database
docker-compose down     # Stop database
```

## 📋 Project Structure

```
Launch2/
├── frontend/                 # Next.js 15 Application
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── api/              # API routes (if needed)
│   │   │   ├── drivers/          # Driver management pages
│   │   │   ├── trucks/           # Fleet management pages
│   │   │   ├── loads/            # Load management pages
│   │   │   ├── reports/          # Analytics and reporting
│   │   │   ├── settings/         # Settings and configuration
│   │   │   ├── layout.tsx        # Root layout component
│   │   │   └── page.tsx          # Home page
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/              # Base UI components
│   │   │   ├── navigation/      # Navigation components
│   │   │   ├── layout/          # Layout components
│   │   │   └── forms/           # Form components
│   │   ├── context/             # React Context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions & API client
│   │   └── types/               # TypeScript type definitions
│   ├── public/                  # Static assets
│   ├── scripts/                 # Frontend utilities
│   ├── templates/               # CSV templates
│   └── package.json             # Frontend dependencies
├── backend/                  # Django 5.0.4 REST API
│   ├── launch_tms/              # Django project settings
│   │   ├── settings.py          # Django configuration
│   │   ├── urls.py              # URL routing
│   │   └── wsgi.py              # WSGI application
│   ├── companies/               # Company management app
│   ├── drivers/                 # Driver management app
│   ├── vehicles/                # Vehicle management app
│   ├── loads/                   # Load management app
│   ├── api/                     # API routing app
│   ├── manage.py                # Django management script
│   └── requirements.txt         # Backend dependencies
├── docs/                     # Comprehensive documentation
│   ├── backend/                 # Backend documentation
│   ├── frontend/                # Frontend documentation
│   ├── deployment/              # Deployment guides
│   └── project/                 # Project documentation
├── docker-compose.yml        # PostgreSQL database setup
├── .env                      # Backend environment variables
└── README.md                 # This file
```

## 🏗️ Architecture Overview

### Full-Stack Architecture

**Launch** is built with a modern, scalable architecture:

- **Frontend**: Next.js 15 with TypeScript for type-safe React development
- **Backend**: Django 5.0.4 with Django REST Framework for robust API development
- **Database**: PostgreSQL for reliable, scalable data storage
- **Authentication**: JWT-based authentication with refresh tokens
- **API Communication**: RESTful API with proper serialization and validation

### Key Features

#### Frontend Features
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **Component Architecture**: Reusable, type-safe React components
- **Context Management**: Efficient state management with React Context
- **API Integration**: Custom API client with JWT authentication
- **Real-time UI Updates**: Dynamic data updates with proper error handling

#### Backend Features
- **RESTful API**: Comprehensive API endpoints for all operations
- **JWT Authentication**: Secure authentication with refresh token support
- **Django Admin**: Administrative interface for data management
- **API Documentation**: Automatic API documentation with DRF Spectacular
- **Database Models**: Comprehensive data models for transportation management
- **CORS Support**: Proper CORS configuration for frontend integration

#### Data Management
- **Multi-entity Support**: Drivers, Trucks, Trailers, Loads, Companies
- **Organizational Hierarchy**: Company → Division → Department → Terminal structure
- **Permission System**: Role-based access control with organizational scoping
- **Data Validation**: Comprehensive validation on both frontend and backend
- **Import/Export**: Excel-based data import and export capabilities

## 💡 Key Implementation Highlights

### Mobile-First Architecture

- **Bottom Navigation**: Touch-friendly navigation optimized for mobile users
- **Responsive Cards**: Unified card design that scales across all screen sizes
- **Touch Targets**: All interactive elements meet accessibility guidelines (44px minimum)
- **Progressive Enhancement**: Desktop features enhance the mobile experience

### Full-Stack Integration

- **API-First Design**: Clean separation between frontend and backend
- **Type Safety**: Shared TypeScript interfaces between frontend and backend
- **Authentication**: JWT-based authentication with proper token management
- **Real-time Communication**: RESTful API with efficient data synchronization

### Performance Optimizations

- **Next.js 15**: Latest framework with optimized rendering and routing
- **Django ORM**: Efficient database queries with proper indexing
- **Component Architecture**: Reusable components for consistent performance
- **Code Splitting**: Automatic code splitting for optimal loading

## 🗂️ Current Data Overview

### Drivers (23 Total)
- **20 Active** drivers currently assigned to routes
- **2 In Training** drivers completing certification
- **1 OOS** (Out of Service) driver

### Fleet Management
- **Truck Numbering**: Professional system (2812-2856A)
- **Automatic Transmission**: Trucks marked with 'A' suffix
- **Maintenance Tracking**: Scheduled maintenance alerts
- **Assignment Management**: Driver-truck assignment tracking

### Load Operations
- **Today's Loads**: 26 active loads requiring attention
- **Tomorrow's Schedule**: 32 scheduled loads
- **Total Load Database**: 98 loads in system
- **Event Tracking**: Comprehensive event logging

## 🔄 Git Workflow

This project follows a feature branch workflow:

```bash
# For new features
git checkout master
git pull origin master
git checkout -b feature/your-feature-name
# ... develop feature ...
git checkout master
git merge feature/your-feature-name
git push origin master

# For quick fixes
git checkout master
# ... make changes ...
git commit -m "fix: describe the fix"
git push origin master
```

## 📚 Documentation

### Architecture & Setup

- **[Backend Documentation](./docs/backend/)** - Django API, models, and authentication
- **[Frontend Documentation](./docs/frontend/)** - Next.js application and components
- **[Deployment Guide](./docs/deployment/)** - Production deployment instructions
- **[Development Setup](./docs/project/development-setup.md)** - Local development environment

### API & Integration

- **[API Documentation](http://localhost:8000/api/schema/swagger-ui/)** - Interactive API documentation
- **[Authentication Guide](./docs/backend/auth.md)** - JWT authentication setup
- **[Database Models](./docs/backend/models.md)** - Django model definitions
- **[Frontend Integration](./docs/frontend/api-integration.md)** - API client usage

### Project Management

- **[Git Workflow](./docs/project/git-workflow.md)** - Branching strategy and development workflow
- **[Project Requirements](./docs/project/requirements.md)** - Original project specifications
- **[Architecture Overview](./docs/project/architecture.md)** - System architecture documentation

## 🚀 Future Enhancements

### Planned Features

- **Real-time Updates**: WebSocket integration for live status updates
- **PWA Capabilities**: Offline functionality and push notifications
- **Advanced Analytics**: Machine learning-powered insights and predictions
- **Mobile App**: React Native deployment option
- **Multi-tenant Support**: SaaS platform capabilities
- **Role-based Access**: Enhanced user authentication and permissions

### Integration Opportunities

- **Fleet Management Systems**: Integration with existing trucking software
- **GPS Tracking**: Real-time vehicle location tracking
- **Electronic Logging**: DOT compliance and logging integration
- **Route Optimization**: AI-powered route planning
- **Document Management**: Digital document storage and retrieval
- **Third-party APIs**: Weather, traffic, and logistics providers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the copyright holder.

**Copyright (c) 2025 Robert Vassallo. All rights reserved.**

For licensing inquiries, please see the [LICENSE](LICENSE) file or contact the copyright holder.


### 👨‍💻 Development Team

- **rlvwebdev** - Lead Developer & System Architect - [GitHub Profile](https://github.com/rlvwebdev)
- **GitHub Copilot** - AI Pair Programming Assistant - Code generation, optimization, and documentation

### 🛠️ Core Technologies

- **Next.js Team** - For the excellent React framework
- **Django Software Foundation** - For the robust backend framework
- **Tailwind Labs** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Vercel** - For hosting and deployment platform
- **PostgreSQL Global Development Group** - For the reliable database system

---

## Built with ❤️ for coffee and ;'s

*Launch represents the future of transportation management - mobile-first, user-friendly, and built to propel the modern logistics industry forward.*
