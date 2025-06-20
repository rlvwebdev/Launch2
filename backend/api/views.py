"""
API Views for Launch TMS
"""
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint to verify backend connectivity
    """
    return Response({
        'status': 'healthy',
        'message': 'Django backend is running',
        'version': '1.0.0',
        'debug': settings.DEBUG,
        'api_endpoints': [
            '/api/auth/login/',
            '/api/drivers/',
            '/api/trucks/',
            '/api/trailers/',
            '/api/loads/',
            '/api/companies/',
        ]
    }, status=status.HTTP_200_OK)
