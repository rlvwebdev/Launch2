"""
Load and shipment models for Launch TMS
"""
from django.db import models
from companies.models import BaseModel, Company, Division, Department, Terminal
from decimal import Decimal
import uuid


class Load(BaseModel):
    """Load/Shipment model"""
    
    # Load identification
    load_number = models.CharField(max_length=50)
    bol_number = models.CharField(max_length=50, blank=True)  # Bill of Lading
    
    # Companies
    shipper = models.CharField(max_length=255)
    receiver = models.CharField(max_length=255, blank=True)
    
    # Locations
    pickup_address = models.TextField()
    pickup_city = models.CharField(max_length=100)
    pickup_state = models.CharField(max_length=50)
    pickup_zip = models.CharField(max_length=20)
    pickup_lat = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    pickup_lng = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=100)
    delivery_state = models.CharField(max_length=50)
    delivery_zip = models.CharField(max_length=20)
    delivery_lat = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    delivery_lng = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    # Assignments
    assigned_driver = models.ForeignKey('drivers.Driver', on_delete=models.SET_NULL, null=True, blank=True, related_name='loads')
    assigned_truck = models.ForeignKey('vehicles.Truck', on_delete=models.SET_NULL, null=True, blank=True, related_name='loads')
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ], default='pending')
    
    # Cargo information
    cargo_description = models.TextField()
    weight = models.IntegerField(help_text="Weight in pounds")
    distance = models.IntegerField(null=True, blank=True, help_text="Distance in miles")
    estimated_transit_time = models.IntegerField(null=True, blank=True, help_text="Time in hours")
    
    # Dates
    pickup_date = models.DateTimeField()
    delivery_date = models.DateTimeField()
    
    # Financial
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Additional information
    notes = models.TextField(blank=True)
    special_instructions = models.TextField(blank=True)
    hazmat = models.BooleanField(default=False)
    
    # Organizational context
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='loads')
    division = models.ForeignKey(Division, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    origin_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True, related_name='origin_loads')
    destination_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True, related_name='destination_loads')
    
    # Tracking
    customer_id = models.CharField(max_length=100, blank=True)
    dispatched_by = models.CharField(max_length=255, blank=True)
    
    class Meta:
        unique_together = ['company', 'load_number']
        ordering = ['-pickup_date']
    
    def __str__(self):
        return f"Load {self.load_number} - {self.shipper} to {self.receiver}"
    
    @property
    def pickup_location_full(self):
        return f"{self.pickup_address}, {self.pickup_city}, {self.pickup_state} {self.pickup_zip}"
    
    @property
    def delivery_location_full(self):
        return f"{self.delivery_address}, {self.delivery_city}, {self.delivery_state} {self.delivery_zip}"


class LoadEvent(BaseModel):
    """Load event/tracking model"""
    load = models.ForeignKey(Load, on_delete=models.CASCADE, related_name='events')
    
    event_type = models.CharField(max_length=20, choices=[
        ('pickup', 'Pickup'),
        ('delivery', 'Delivery'),
        ('delay', 'Delay'),
        ('issue', 'Issue'),
        ('update', 'Update'),
        ('spill', 'Spill'),
        ('contamination', 'Contamination'),
        ('ncr', 'Non-Conformance Report'),
    ])
    
    description = models.TextField()
    timestamp = models.DateTimeField()
    
    # Location information
    location_address = models.TextField(blank=True)
    location_city = models.CharField(max_length=100, blank=True)
    location_state = models.CharField(max_length=50, blank=True)
    location_zip = models.CharField(max_length=20, blank=True)
    location_lat = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    location_lng = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    # Reporting
    reported_by = models.CharField(max_length=255)
    severity = models.CharField(max_length=10, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], default='low')
    
    resolved = models.BooleanField(default=False)
    resolution_notes = models.TextField(blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.CharField(max_length=255, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.load.load_number} - {self.event_type} at {self.timestamp}"
    
    @property
    def location_full(self):
        if self.location_address:
            return f"{self.location_address}, {self.location_city}, {self.location_state} {self.location_zip}"
        return ""


class LoadDocument(BaseModel):
    """Load document model"""
    load = models.ForeignKey(Load, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50, choices=[
        ('bol', 'Bill of Lading'),
        ('invoice', 'Invoice'),
        ('receipt', 'Receipt'),
        ('photo', 'Photo'),
        ('other', 'Other'),
    ])
    document_name = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='load_documents/')
    uploaded_by = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.load.load_number} - {self.document_name}"
