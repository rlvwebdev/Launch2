"""
Serializers for loads app
"""
from rest_framework import serializers
from .models import Load, LoadEvent, LoadDocument


class LoadEventSerializer(serializers.ModelSerializer):
    """Serializer for LoadEvent model"""
    
    # CamelCase field names to match frontend
    loadId = serializers.CharField(source='load_id')
    type = serializers.CharField(source='event_type')
    reportedBy = serializers.CharField(source='reported_by', required=False, allow_blank=True)
    resolutionNotes = serializers.CharField(source='resolution_notes', required=False, allow_blank=True)
    resolvedAt = serializers.DateTimeField(source='resolved_at', required=False, allow_null=True)
    resolvedBy = serializers.CharField(source='resolved_by', required=False, allow_blank=True)
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')
    
    class Meta:
        model = LoadEvent
        fields = [
            'id', 'loadId', 'type', 'description', 'timestamp',
            'severity', 'resolved', 'resolutionNotes', 'resolvedAt',
            'resolvedBy', 'reportedBy', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class LoadSerializer(serializers.ModelSerializer):
    """Serializer for Load model"""
    
    # Nested location objects to match frontend expectations
    pickupLocation = serializers.SerializerMethodField()
    deliveryLocation = serializers.SerializerMethodField()
    events = serializers.SerializerMethodField()
    
    # CamelCase field names to match frontend
    loadNumber = serializers.CharField(source='load_number')
    bolNumber = serializers.CharField(source='bol_number')
    assignedDriverId = serializers.CharField(source='assigned_driver_id', required=False, allow_null=True)
    assignedTruckId = serializers.CharField(source='assigned_truck_id', required=False, allow_null=True)
    cargoDescription = serializers.CharField(source='cargo_description')
    estimatedTransitTime = serializers.IntegerField(source='estimated_transit_time', required=False, allow_null=True)
    pickupDate = serializers.DateTimeField(source='pickup_date')
    deliveryDate = serializers.DateTimeField(source='delivery_date')
    specialInstructions = serializers.CharField(source='special_instructions', required=False, allow_blank=True)
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')
    
    def get_pickupLocation(self, obj):
        """Return pickup location as nested object"""
        return {
            'address': obj.pickup_address or '',
            'city': obj.pickup_city or '',
            'state': obj.pickup_state or '',
            'zipCode': obj.pickup_zip or '',
            'coordinates': {
                'lat': obj.pickup_lat,
                'lng': obj.pickup_lng
            } if obj.pickup_lat and obj.pickup_lng else None
        }
    
    def get_deliveryLocation(self, obj):
        """Return delivery location as nested object"""
        return {
            'address': obj.delivery_address or '',
            'city': obj.delivery_city or '',
            'state': obj.delivery_state or '',
            'zipCode': obj.delivery_zip or '',
            'coordinates': {
                'lat': obj.delivery_lat,
                'lng': obj.delivery_lng
            } if obj.delivery_lat and obj.delivery_lng else None
        }
    
    def get_events(self, obj):
        """Return load events as nested objects"""
        events = obj.events.all() if hasattr(obj, 'events') else []
        return LoadEventSerializer(events, many=True).data
    
    class Meta:
        model = Load
        fields = [
            'id', 'loadNumber', 'bolNumber', 'shipper', 'receiver',
            'pickupLocation', 'deliveryLocation',
            'assignedDriverId', 'assignedTruckId', 'status', 'cargoDescription',
            'weight', 'distance', 'estimatedTransitTime', 'pickupDate',
            'deliveryDate', 'rate', 'notes', 'specialInstructions', 'hazmat',
            'events', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class LoadDocumentSerializer(serializers.ModelSerializer):
    """Serializer for LoadDocument model"""
    
    class Meta:
        model = LoadDocument
        fields = [
            'id', 'load', 'document_type', 'document_name',
            'file_path', 'uploaded_by', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
