"""
API URLs for Launch TMS
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Import ViewSets (we'll create these next)
from companies.views import CompanyViewSet, UserViewSet
from drivers.views import DriverViewSet
from vehicles.views import TruckViewSet, TrailerViewSet
from loads.views import LoadViewSet

# Import API views
from .views import health_check

# Create router and register viewsets
router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trucks', TruckViewSet)
router.register(r'trailers', TrailerViewSet)
router.register(r'loads', LoadViewSet)

urlpatterns = [
    # Health check
    path('health/', health_check, name='health_check'),
    
    # Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # API endpoints
    path('', include(router.urls)),
]
