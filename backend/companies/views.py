"""
API views for companies app
"""
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Company, CustomUser
from .serializers import CompanySerializer, UserSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for managing companies"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter companies based on user's permissions"""
        user = self.request.user
        if user.role == 'system_admin':
            return Company.objects.all()
        else:
            return Company.objects.filter(id=user.company_id)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for managing users"""
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter users based on user's permissions"""
        user = self.request.user
        if user.role == 'system_admin':
            return CustomUser.objects.all()
        else:
            return CustomUser.objects.filter(company=user.company)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's information"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
