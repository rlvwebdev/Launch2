"""
API views for drivers app
"""
from rest_framework import viewsets, permissions
from .models import Driver
from .serializers import DriverSerializer


class DriverViewSet(viewsets.ModelViewSet):
    """ViewSet for managing drivers"""
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        """Return all drivers for now (no company filtering during testing)"""
        return Driver.objects.all()
    
    def perform_create(self, serializer):
        """Save driver without company requirement for now"""
        serializer.save()
