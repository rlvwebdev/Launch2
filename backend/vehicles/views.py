"""
API views for vehicles app
"""
from rest_framework import viewsets, permissions
from .models import Truck, Trailer, MaintenanceRecord
from .serializers import TruckSerializer, TrailerSerializer, MaintenanceRecordSerializer


class TruckViewSet(viewsets.ModelViewSet):
    """ViewSet for managing trucks"""
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        """Return all trucks for now (no company filtering during testing)"""
        return Truck.objects.all()
    
    def perform_create(self, serializer):
        """Save truck without company requirement for now"""
        serializer.save()


class TrailerViewSet(viewsets.ModelViewSet):
    """ViewSet for managing trailers"""
    queryset = Trailer.objects.all()
    serializer_class = TrailerSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        """Return all trailers for now (no company filtering during testing)"""
        return Trailer.objects.all()
    
    def perform_create(self, serializer):
        """Save trailer without company requirement for now"""
        serializer.save()


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for managing maintenance records"""
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        """Return all maintenance records for now"""
        return MaintenanceRecord.objects.all()
