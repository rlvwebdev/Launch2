# 🚀 Launch TMS - Documentation

**Launch Transportation Management System**  
*Propelling the logistics industry forward*

## 📁 Documentation Structure

### 🎯 [Project Overview](./project/)
- Project Requirements and Specifications
- Architecture Overview and Design Decisions
- Development Setup and Guidelines
- Git Workflow and Contribution Guide

### 🖥️ [Backend Documentation](./backend/)
- [Complete Backend Guide](./backend/README.md) - Django API, models, authentication, and deployment
- Django 5.0.4 REST API with multi-tenant architecture
- PostgreSQL database with hierarchical organization structure
- JWT authentication and role-based permissions

### 🌐 [Frontend Documentation](./frontend/)
- [Complete Frontend Guide](./frontend/README.md) - Next.js app, components, and state management
- Next.js 15.3.3 with React 19 and TypeScript
- Mobile-first responsive design with Tailwind CSS
- Context-based state management and API integration

### 🔌 [API Documentation](./api.md)
- [Complete API Reference](./api.md) - All endpoints, authentication, and usage examples
- RESTful API endpoints with full CRUD operations
- Authentication flows and token management
- Request/response examples and error handling

### 🚀 [Deployment](./deployment/)
- Frontend Deployment (Vercel)
- Backend Deployment Guide
- Database Setup and Configuration
- Environment Variables and Security

## 🏗️ Tech Stack

### Backend
- **Framework:** Django 5.0.4 with Django REST Framework
- **Database:** PostgreSQL
- **Authentication:** JWT (djangorestframework-simplejwt)
- **API Documentation:** DRF Spectacular (OpenAPI/Swagger)

### Frontend
- **Framework:** Next.js 15.3.3 with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Headless UI, Lucide React
- **Charts:** Recharts

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Launch2
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   ```bash
   docker-compose up -d  # Start PostgreSQL
   cd backend
   python manage.py migrate
   python create_django_test_data.py
   ```

## 📞 Support

For questions or issues, please refer to the specific documentation sections or create an issue in the repository.

---

**Last Updated:** December 19, 2024  
**Version:** 1.0.0
