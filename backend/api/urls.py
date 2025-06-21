"""
API URLs for Launch TMS
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Import ViewSets (we'll create these next)
from companies.views import CompanyViewSet, DivisionViewSet, DepartmentViewSet, TerminalViewSet, UserViewSet, public_companies
from companies.auth_views import (
    login_view,
    register_user,
    logout_user,
    verify_token,
    update_profile,
    change_password,
    reset_password_request,
    reset_password_confirm,
    user_permissions,
)
from drivers.views import DriverViewSet
from vehicles.views import TruckViewSet, TrailerViewSet
from loads.views import LoadViewSet

# Import API views
from .views import health_check

# Create router and register viewsets
router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'divisions', DivisionViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'terminals', TerminalViewSet)
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trucks', TruckViewSet)
router.register(r'trailers', TrailerViewSet)
router.register(r'loads', LoadViewSet)

urlpatterns = [
    # Health check
    path('health/', health_check, name='health_check'),
    
    # Public endpoints (no authentication required)
    path('companies/public/', public_companies, name='public_companies'),
    
    # Authentication
    path('auth/login/', login_view, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', register_user, name='register'),
    path('auth/logout/', logout_user, name='logout'),
    path('auth/verify/', verify_token, name='verify_token'),
    path('auth/profile/', update_profile, name='update_profile'),
    path('auth/change-password/', change_password, name='change_password'),
    path('auth/reset-password/', reset_password_request, name='reset_password_request'),
    path('auth/reset-password/confirm/', reset_password_confirm, name='reset_password_confirm'),
    path('auth/permissions/', user_permissions, name='user_permissions'),
    
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # API endpoints
    path('', include(router.urls)),
]
