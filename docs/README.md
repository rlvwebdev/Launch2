# 🚀 Launch TMS - Documentation

**Launch Transportation Management System**  
*Propelling the logistics industry forward*

## 📁 Documentation Structure

### 🎯 [Project Overview](./project/)
- [Project Requirements](./project/requirements.md)
- [Architecture Overview](./project/architecture.md)
- [Development Setup](./project/development-setup.md)
- [Git Workflow](./project/git-workflow.md)

### 🖥️ [Backend Documentation](./backend/)
- [Django API Documentation](./backend/api.md)
- [Database Models](./backend/models.md)
- [Authentication & Authorization](./backend/auth.md)
- [API Endpoints](./backend/endpoints.md)
- [Testing](./backend/testing.md)

### 🌐 [Frontend Documentation](./frontend/)
- [Next.js Application](./frontend/nextjs.md)
- [Component Library](./frontend/components.md)
- [Data Models & Types](./frontend/data-models.md)
- [State Management](./frontend/state-management.md)
- [UI/UX Guidelines](./frontend/ui-guidelines.md)

### 🚀 [Deployment](./deployment/)
- [Frontend Deployment (Vercel)](./deployment/frontend.md)
- [Backend Deployment](./deployment/backend.md)
- [Database Setup](./deployment/database.md)
- [Environment Configuration](./deployment/environment.md)

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

**Last Updated:** June 19, 2025  
**Version:** 1.0.0
