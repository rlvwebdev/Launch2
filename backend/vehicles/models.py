"""
Vehicle models for Launch TMS
"""
from django.db import models
from companies.models import BaseModel, Company, Division, Department, Terminal
import uuid


class Truck(BaseModel):
    """Truck model"""
    
    # Basic information
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    license_plate = models.CharField(max_length=20)
    vin = models.CharField(max_length=17, unique=True)
    color = models.CharField(max_length=50)
    
    # Status and assignments
    status = models.CharField(max_length=20, choices=[
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('maintenance', 'In Maintenance'),
        ('out_of_service', 'Out of Service'),
    ], default='available')
    
    assigned_driver = models.OneToOneField(
        'drivers.Driver', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_truck_rel'
    )
    
    # Maintenance information
    mileage = models.IntegerField(default=0)
    last_maintenance = models.DateField()
    next_maintenance_due = models.DateField()
    registration_expiry = models.DateField()
    insurance_expiry = models.DateField()
    maintenance_notes = models.TextField(blank=True)
    
    # Current assignment
    current_load = models.CharField(max_length=100, blank=True)  # Load ID
    
    # Organizational context
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='trucks')
    division = models.ForeignKey(Division, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    home_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True)
    assigned_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_trucks')
    
    class Meta:
        unique_together = ['company', 'license_plate']
        ordering = ['make', 'model', 'year']
    
    def __str__(self):
        return f"{self.year} {self.make} {self.model} ({self.license_plate})"
    
    @property
    def is_maintenance_due(self):
        from django.utils import timezone
        return self.next_maintenance_due <= timezone.now().date()
    
    @property
    def is_registration_expired(self):
        from django.utils import timezone
        return self.registration_expiry < timezone.now().date()
    
    @property
    def is_insurance_expired(self):
        from django.utils import timezone
        return self.insurance_expiry < timezone.now().date()


class Trailer(BaseModel):
    """Trailer model"""
    
    # Basic information
    trailer_number = models.CharField(max_length=50)
    make = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    year = models.IntegerField(null=True, blank=True)
    vin = models.CharField(max_length=17, unique=True, blank=True)
    
    # Specifications
    trailer_type = models.CharField(max_length=50, choices=[
        ('dry_van', 'Dry Van'),
        ('flatbed', 'Flatbed'),
        ('refrigerated', 'Refrigerated'),
        ('tanker', 'Tanker'),
        ('other', 'Other'),
    ], default='dry_van')
    
    capacity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # in tons
    length = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # in feet
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('maintenance', 'In Maintenance'),
        ('out_of_service', 'Out of Service'),
    ], default='available')
    
    # Maintenance
    last_inspection = models.DateField(null=True, blank=True)
    next_inspection_due = models.DateField(null=True, blank=True)
    registration_expiry = models.DateField(null=True, blank=True)
    
    # Organizational context
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='trailers')
    division = models.ForeignKey(Division, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    home_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        unique_together = ['company', 'trailer_number']
        ordering = ['trailer_number']
    
    def __str__(self):
        return f"Trailer {self.trailer_number}"


class MaintenanceRecord(BaseModel):
    """Maintenance record for vehicles"""
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE, related_name='maintenance_records', null=True, blank=True)
    trailer = models.ForeignKey(Trailer, on_delete=models.CASCADE, related_name='maintenance_records', null=True, blank=True)
    
    maintenance_type = models.CharField(max_length=50, choices=[
        ('routine', 'Routine Maintenance'),
        ('repair', 'Repair'),
        ('inspection', 'Inspection'),
        ('emergency', 'Emergency Repair'),
    ])
    
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    performed_by = models.CharField(max_length=255)  # Shop or mechanic name
    performed_date = models.DateField()
    mileage_at_service = models.IntegerField(null=True, blank=True)
    
    # Parts and labor
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    labor_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    def __str__(self):
        vehicle = self.truck or self.trailer
        return f"{vehicle} - {self.maintenance_type} on {self.performed_date}"
