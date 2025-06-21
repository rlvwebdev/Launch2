"""
API views for companies app
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Company, Division, Department, Terminal, CustomUser
from .serializers import CompanySerializer, DivisionSerializer, DepartmentSerializer, TerminalSerializer, UserSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_companies(request):
    """Public endpoint to get companies for registration"""
    companies = Company.objects.all()
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for managing companies"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter companies based on user's permissions"""
        user = self.request.user
        if isinstance(user, CustomUser) and user.role == 'system_admin':
            return Company.objects.all()
        elif isinstance(user, CustomUser) and user.company:
            return Company.objects.filter(id=user.company.id)
        return Company.objects.none()


class DivisionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing divisions"""
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter divisions based on user's permissions"""
        user = self.request.user
        if isinstance(user, CustomUser) and user.role == 'system_admin':
            return Division.objects.all()
        elif isinstance(user, CustomUser) and user.company:
            return Division.objects.filter(company=user.company)
        return Division.objects.none()


class DepartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing departments"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter departments based on user's permissions"""
        user = self.request.user
        if isinstance(user, CustomUser) and user.role == 'system_admin':
            return Department.objects.all()
        elif isinstance(user, CustomUser) and user.company:
            return Department.objects.filter(division__company=user.company)
        return Department.objects.none()


class TerminalViewSet(viewsets.ModelViewSet):
    """ViewSet for managing terminals"""
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter terminals based on user's permissions"""
        user = self.request.user
        if isinstance(user, CustomUser) and user.role == 'system_admin':
            return Terminal.objects.all()
        elif isinstance(user, CustomUser) and user.company:
            return Terminal.objects.filter(department__division__company=user.company)
        return Terminal.objects.none()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for managing users"""
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter users based on user's permissions"""
        user = self.request.user
        if isinstance(user, CustomUser) and user.role == 'system_admin':
            return CustomUser.objects.all()
        elif isinstance(user, CustomUser) and user.company:
            return CustomUser.objects.filter(company=user.company)
        return CustomUser.objects.none()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's information"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
