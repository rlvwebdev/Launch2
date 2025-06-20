"""
Serializers for vehicles app
"""
from rest_framework import serializers
from .models import Truck, Trailer, MaintenanceRecord


class TruckSerializer(serializers.ModelSerializer):
    """Serializer for Truck model"""
    
    # CamelCase field names to match frontend
    licensePlate = serializers.CharField(source='license_plate')
    assignedDriverId = serializers.CharField(source='assigned_driver_id', allow_null=True, required=False)
    lastMaintenance = serializers.DateField(source='last_maintenance')
    nextMaintenanceDue = serializers.DateField(source='next_maintenance_due')
    registrationExpiry = serializers.DateField(source='registration_expiry')
    insuranceExpiry = serializers.DateField(source='insurance_expiry')
    maintenanceNotes = serializers.CharField(source='maintenance_notes', allow_blank=True, required=False)
    currentLoad = serializers.CharField(source='current_load_id', allow_null=True, required=False)
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')
    
    # Organizational context as nested object
    organizationalContext = serializers.SerializerMethodField()
    
    is_maintenance_due = serializers.ReadOnlyField()
    is_registration_expired = serializers.ReadOnlyField()
    is_insurance_expired = serializers.ReadOnlyField()
    
    def get_organizationalContext(self, obj):
        return {
            'companyId': str(obj.company.id) if obj.company else None,
            'divisionId': str(obj.division.id) if obj.division else None,
            'departmentId': str(obj.department.id) if obj.department else None,
            'terminalId': str(obj.home_terminal.id) if obj.home_terminal else None
        }
    
    class Meta:
        model = Truck
        fields = [
            'id', 'make', 'model', 'year', 'licensePlate', 'vin', 'color',
            'status', 'assignedDriverId', 'mileage', 'lastMaintenance',
            'nextMaintenanceDue', 'registrationExpiry', 'insuranceExpiry',
            'maintenanceNotes', 'currentLoad', 'organizationalContext',
            'is_maintenance_due', 'is_registration_expired', 'is_insurance_expired',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class TrailerSerializer(serializers.ModelSerializer):
    """Serializer for Trailer model"""
    
    # Map Django snake_case fields to frontend camelCase
    licensePlate = serializers.CharField(source='trailer_number')  # Map trailer_number to licensePlate
    type = serializers.CharField(source='trailer_type')
    assignedTruckId = serializers.CharField(source='assigned_truck_id', allow_null=True, required=False)
    lastMaintenance = serializers.DateField(source='last_inspection', allow_null=True, required=False)
    nextMaintenanceDue = serializers.DateField(source='next_inspection_due', allow_null=True, required=False)
    registrationExpiry = serializers.DateField(source='registration_expiry', allow_null=True, required=False)
    insuranceExpiry = serializers.DateField(source='insurance_expiry', allow_null=True, required=False)
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')
    
    # Organizational context as nested object
    organizationalContext = serializers.SerializerMethodField()
    
    def get_organizationalContext(self, obj):
        return {
            'companyId': str(obj.company.id) if obj.company else None,
            'divisionId': str(obj.division.id) if obj.division else None,
            'departmentId': str(obj.department.id) if obj.department else None,
            'terminalId': str(obj.home_terminal.id) if obj.home_terminal else None
        }
    
    class Meta:
        model = Trailer
        fields = [
            'id', 'make', 'model', 'year', 'licensePlate', 'vin', 'type',
            'capacity', 'length', 'assignedTruckId', 'status',
            'lastMaintenance', 'nextMaintenanceDue', 'registrationExpiry',
            'insuranceExpiry', 'organizationalContext', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for MaintenanceRecord model"""
    
    class Meta:
        model = MaintenanceRecord
        fields = [
            'id', 'truck', 'trailer', 'maintenance_type', 'description',
            'cost', 'performed_by', 'performed_date', 'mileage_at_service',
            'parts_cost', 'labor_cost', 'labor_hours', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
