"""
API views for companies app
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Company, Division, Department, Terminal, CustomUser
from .serializers import CompanySerializer, DivisionSerializer, DepartmentSerializer, TerminalSerializer, UserSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_companies(request):
    """Public endpoint to get companies for registration"""
    companies = Company.objects.all()
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def organization_hierarchy(request):
    """Get complete organization hierarchy with statistics"""
    user = request.user
    
    # Determine which companies the user can access
    if isinstance(user, CustomUser) and user.role == 'system_admin':
        companies = Company.objects.all()
    elif isinstance(user, CustomUser) and user.company:
        companies = Company.objects.filter(id=user.company.id)
    else:
        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
    
    hierarchy_data = []
    
    for company in companies:
        # Get statistics for the company
        total_users = CustomUser.objects.filter(company=company).count()
        total_divisions = Division.objects.filter(company=company).count()
        total_departments = Department.objects.filter(division__company=company).count()
        total_terminals = Terminal.objects.filter(department__division__company=company).count()
        
        # Simulate vehicle and load counts (you can replace with actual queries)
        from vehicles.models import Truck, Trailer
        from loads.models import Load
        
        try:
            total_trucks = Truck.objects.filter(company=company).count()
            total_trailers = Trailer.objects.filter(company=company).count()
            active_loads = Load.objects.filter(
                company=company, 
                status__in=['assigned', 'in_transit', 'at_pickup', 'at_delivery']
            ).count()
        except:
            # Fallback if models don't exist yet
            total_trucks = 0
            total_trailers = 0
            active_loads = 0
        
        company_data = {
            'id': str(company.id),
            'name': company.name,
            'code': company.code,
            'type': 'company',
            'parentId': None,
            'isActive': company.is_active,
            'address': {
                'address': company.address_street or '',
                'city': company.address_city or '',
                'state': company.address_state or '',
                'zipCode': company.address_zip or '',
                'country': 'USA'
            },
            'contactInfo': {
                'phone': company.phone or '',
                'email': company.email or '',
                'website': f'https://{company.name.lower().replace(" ", "")}.com' if company.name else ''
            },
            'stats': {
                'employees': total_users,
                'vehicles': total_trucks + total_trailers,
                'revenue': 50000000,  # Placeholder - replace with actual revenue calculation
                'activeLoads': active_loads
            },
            'manager': {
                'name': 'System Administrator',
                'email': company.email or '',
                'phone': company.phone or ''
            },
            'createdAt': company.created_at.isoformat() if company.created_at else '',
            'updatedAt': company.updated_at.isoformat() if company.updated_at else ''
        }
        hierarchy_data.append(company_data)
        
        # Get divisions for this company
        divisions = Division.objects.filter(company=company)
        for division in divisions:
            division_users = CustomUser.objects.filter(division=division).count()
            division_departments = Department.objects.filter(division=division).count()
            division_terminals = Terminal.objects.filter(department__division=division).count()
            
            division_data = {
                'id': str(division.id),
                'name': division.name,
                'code': division.code,
                'type': 'division',
                'parentId': str(company.id),
                'isActive': division.is_active,
                'address': {
                    'address': company.address_street or '',
                    'city': company.address_city or '',
                    'state': company.address_state or '',
                    'zipCode': company.address_zip or '',
                    'country': 'USA'
                },
                'contactInfo': {
                    'phone': company.phone or '',
                    'email': division.manager_email or company.email or '',
                    'website': ''
                },
                'stats': {
                    'employees': division_users,
                    'vehicles': total_trucks // max(total_divisions, 1),  # Rough distribution
                    'revenue': 15000000,  # Placeholder
                    'activeLoads': active_loads // max(total_divisions, 1)
                },
                'manager': {
                    'name': 'Division Manager',
                    'email': division.manager_email or '',
                    'phone': company.phone or ''
                },
                'createdAt': division.created_at.isoformat() if division.created_at else '',
                'updatedAt': division.updated_at.isoformat() if division.updated_at else ''
            }
            hierarchy_data.append(division_data)
            
            # Get departments for this division
            departments = Department.objects.filter(division=division)
            for department in departments:
                dept_users = CustomUser.objects.filter(department=department).count()
                dept_terminals = Terminal.objects.filter(department=department).count()
                
                department_data = {
                    'id': str(department.id),
                    'name': department.name,
                    'code': department.code,
                    'type': 'department',
                    'parentId': str(division.id),
                    'isActive': department.is_active,
                    'address': {
                        'address': company.address_street or '',
                        'city': company.address_city or '',
                        'state': company.address_state or '',
                        'zipCode': company.address_zip or '',
                        'country': 'USA'
                    },
                    'contactInfo': {
                        'phone': company.phone or '',
                        'email': department.manager_email or division.manager_email or company.email or '',
                        'website': ''
                    },
                    'stats': {
                        'employees': dept_users,
                        'vehicles': total_trucks // max(total_departments, 1),
                        'revenue': 8000000,  # Placeholder
                        'activeLoads': active_loads // max(total_departments, 1)
                    },
                    'manager': {
                        'name': 'Department Manager',
                        'email': department.manager_email or '',
                        'phone': company.phone or ''
                    },
                    'createdAt': department.created_at.isoformat() if department.created_at else '',
                    'updatedAt': department.updated_at.isoformat() if department.updated_at else ''
                }
                hierarchy_data.append(department_data)
                
                # Get terminals for this department
                terminals = Terminal.objects.filter(department=department)
                for terminal in terminals:
                    terminal_users = CustomUser.objects.filter(terminal=terminal).count()
                    
                    terminal_data = {
                        'id': str(terminal.id),
                        'name': terminal.name,
                        'code': terminal.code,
                        'type': 'terminal',
                        'parentId': str(department.id),
                        'isActive': terminal.is_active,
                        'address': {
                            'address': terminal.address_street or company.address_street or '',
                            'city': terminal.address_city or company.address_city or '',
                            'state': terminal.address_state or company.address_state or '',
                            'zipCode': terminal.address_zip or company.address_zip or '',
                            'country': 'USA'
                        },
                        'contactInfo': {
                            'phone': terminal.phone or company.phone or '',
                            'email': terminal.manager_email or department.manager_email or '',
                            'website': ''
                        },
                        'stats': {
                            'employees': terminal_users,
                            'vehicles': total_trucks // max(total_terminals, 1),
                            'revenue': 3000000,  # Placeholder
                            'activeLoads': active_loads // max(total_terminals, 1)
                        },
                        'manager': {
                            'name': 'Terminal Manager',
                            'email': terminal.manager_email or '',
                            'phone': terminal.phone or ''
                        },
                        'createdAt': terminal.created_at.isoformat() if terminal.created_at else '',
                        'updatedAt': terminal.updated_at.isoformat() if terminal.updated_at else ''
                    }
                    hierarchy_data.append(terminal_data)
    
    return Response(hierarchy_data)


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
