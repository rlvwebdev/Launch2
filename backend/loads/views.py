"""
API views for loads app
"""
from rest_framework import viewsets, permissions
from .models import Load, LoadEvent, LoadDocument
from .serializers import LoadSerializer, LoadEventSerializer, LoadDocumentSerializer


class LoadViewSet(viewsets.ModelViewSet):
    """ViewSet for managing loads"""
    queryset = Load.objects.all()
    serializer_class = LoadSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        """Return all loads for now (no company filtering during testing)"""
        return Load.objects.all()
    
    def perform_create(self, serializer):
        """Save load without company requirement for now"""
        serializer.save()


class LoadEventViewSet(viewsets.ModelViewSet):
    """ViewSet for managing load events"""
    queryset = LoadEvent.objects.all()
    serializer_class = LoadEventSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        """Return all load events for now"""
        return LoadEvent.objects.all()


class LoadDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing load documents"""
    queryset = LoadDocument.objects.all()
    serializer_class = LoadDocumentSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        """Return all load documents for now"""
        return LoadDocument.objects.all()
