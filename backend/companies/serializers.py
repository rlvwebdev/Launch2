"""
Serializers for companies app
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Company, Division, Department, Terminal, CustomUser


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company model"""
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'code', 'address_street', 'address_city', 
            'address_state', 'address_zip', 'phone', 'email',
            'is_active', 'timezone', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DivisionSerializer(serializers.ModelSerializer):
    """Serializer for Division model"""
    
    class Meta:
        model = Division
        fields = [
            'id', 'company', 'name', 'code', 'manager_email',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    
    class Meta:
        model = Department
        fields = [
            'id', 'division', 'name', 'code', 'manager_email',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TerminalSerializer(serializers.ModelSerializer):
    """Serializer for Terminal model with nested department/division/company info"""
    department = serializers.SerializerMethodField()
    
    class Meta:
        model = Terminal
        fields = [
            'id', 'department', 'name', 'code', 'address_street',
            'address_city', 'address_state', 'address_zip', 'phone',
            'manager_email', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_department(self, obj):
        """Return nested department/division/company information"""
        if not obj.department:
            return None
        
        department = obj.department
        division = department.division if department else None
        company = division.company if division else None
        
        return {
            'id': str(department.id),
            'name': department.name,
            'code': department.code,
            'division': {
                'id': str(division.id) if division else None,
                'name': division.name if division else None,
                'code': division.code if division else None,
                'company': {
                    'id': str(company.id) if company else None,
                    'name': company.name if company else None,
                    'code': company.code if company else None,
                }
            } if division else None
        }


class UserSerializer(serializers.ModelSerializer):
    """Serializer for CustomUser model"""
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'company', 'division', 'department', 'terminal',
            'role', 'theme', 'language', 'timezone', 'is_active',
            'is_staff', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        """Create user with encrypted password"""
        password = validated_data.pop('password', None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        """Update user with encrypted password"""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'phone', 'company', 'division', 'department', 'terminal', 'role'
        ]
    
    def validate(self, attrs):
        """Validate registration data"""
        password = attrs.get('password')
        password_confirm = attrs.pop('password_confirm', None)
        
        # Check password confirmation
        if password != password_confirm:
            raise serializers.ValidationError("Passwords do not match")
        
        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        
        # Validate email uniqueness
        email = attrs.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists"})
        
        # Validate company exists
        company = attrs.get('company')
        if company and not Company.objects.filter(id=company.id, is_active=True).exists():
            raise serializers.ValidationError({"company": "Invalid company"})
        
        return attrs
    
    def create(self, validated_data):
        """Create new user account"""
        password = validated_data.pop('password')
        
        # Set username to email if not provided
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']
        
        # Create user
        user = CustomUser.objects.create_user(
            password=password,
            **validated_data
        )
        
        return user
