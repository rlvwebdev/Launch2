"""
Serializers for companies app
"""
from rest_framework import serializers
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
    """Serializer for Terminal model"""
    
    class Meta:
        model = Terminal
        fields = [
            'id', 'department', 'name', 'code', 'address_street',
            'address_city', 'address_state', 'address_zip', 'phone',
            'manager_email', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


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
