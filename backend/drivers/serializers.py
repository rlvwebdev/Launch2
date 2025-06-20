"""
Serializers for drivers app
"""
from rest_framework import serializers
from .models import Driver, DriverDocument


class DriverSerializer(serializers.ModelSerializer):
    """Serializer for Driver model"""    # Map Django snake_case fields to frontend camelCase
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    phoneNumber = serializers.CharField(source='phone_number')
    licenseNumber = serializers.CharField(source='license_number')
    licenseExpiry = serializers.DateField(source='license_expiry')
    hireDate = serializers.DateField(source='hire_date')
    fuelCard = serializers.CharField(source='fuel_card', allow_blank=True)
    assignedTruckId = serializers.CharField(source='assigned_truck_id', allow_null=True, required=False)
    homeTerminalId = serializers.CharField(source='home_terminal_id', allow_null=True, required=False)
    supervisorId = serializers.CharField(source='supervisor_id', allow_null=True, required=False)
    accessLevel = serializers.CharField(source='access_level', default='driver')
    
    # Training fields
    trainingStatus = serializers.CharField(source='training_status', allow_blank=True, required=False)
    trainingStartDate = serializers.DateField(source='training_start_date', allow_null=True, required=False)
    trainingCompletionDate = serializers.DateField(source='training_completion_date', allow_null=True, required=False)
    trainingSupervisorId = serializers.CharField(source='training_supervisor_id', allow_null=True, required=False)
    trainingNotes = serializers.CharField(source='training_notes', allow_blank=True, required=False)
    
    # Emergency contact as nested object
    emergencyContact = serializers.SerializerMethodField()
    
    # Organizational context as nested object
    organizationalContext = serializers.SerializerMethodField()
    
    full_name = serializers.ReadOnlyField()
    is_license_expired = serializers.ReadOnlyField()
    
    def get_emergencyContact(self, obj):
        return {
            'name': obj.emergency_contact_name or '',
            'phone': obj.emergency_contact_phone or '',
            'relationship': obj.emergency_contact_relationship or ''
        }
    
    def get_organizationalContext(self, obj):
        return {
            'companyId': str(obj.company.id) if obj.company else None,
            'divisionId': str(obj.division.id) if obj.division else None,
            'departmentId': str(obj.department.id) if obj.department else None,
            'terminalId': str(obj.home_terminal.id) if obj.home_terminal else None        }
    
    class Meta:
        model = Driver
        fields = [
            'id', 'firstName', 'lastName', 'full_name', 'email', 'phoneNumber',
            'address', 'hireDate', 'status', 'licenseNumber', 'licenseExpiry',
            'is_license_expired', 'fuelCard', 'emergencyContact',
            'trainingStatus', 'trainingStartDate', 'trainingCompletionDate',
            'trainingSupervisorId', 'trainingNotes',
            'assignedTruckId', 'homeTerminalId', 'supervisorId', 'accessLevel',
            'organizationalContext', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DriverDocumentSerializer(serializers.ModelSerializer):
    """Serializer for DriverDocument model"""
    
    class Meta:
        model = DriverDocument
        fields = [
            'id', 'driver', 'document_type', 'document_name',
            'file_path', 'expiry_date', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
