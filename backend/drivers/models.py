"""
Driver models for Launch TMS
"""
from django.db import models
from companies.models import BaseModel, Company, Division, Department, Terminal
import uuid


class Driver(BaseModel):
    """Driver model"""
    
    # Personal information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(blank=True)
      # Employment information
    hire_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
        ('terminated', 'Terminated'),
        ('in_training', 'In Training'),
    ], default='active')
      # Training information
    training_status = models.CharField(max_length=20, choices=[
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('suspended', 'Suspended'),
    ], default='not_started', blank=True)
    training_start_date = models.DateField(null=True, blank=True)
    training_completion_date = models.DateField(null=True, blank=True)
    training_supervisor = models.ForeignKey('companies.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='training_supervised_drivers')
    training_notes = models.TextField(blank=True, default='')
    
    # License information
    license_number = models.CharField(max_length=50, unique=True)
    license_expiry = models.DateField()
    
    # Fuel card
    fuel_card = models.CharField(max_length=50, blank=True)
    
    # Emergency contact
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=20)
    emergency_contact_relationship = models.CharField(max_length=50)
    
    # Organizational context
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='drivers')
    division = models.ForeignKey(Division, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    home_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Assignments
    assigned_truck = models.ForeignKey('vehicles.Truck', on_delete=models.SET_NULL, null=True, blank=True)
    supervisor = models.ForeignKey('companies.CustomUser', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Access level
    access_level = models.CharField(max_length=20, choices=[
        ('read_only', 'Read Only'),
        ('department', 'Department'),
        ('division', 'Division'),
        ('company', 'Company'),
    ], default='read_only')
    
    class Meta:
        unique_together = ['company', 'license_number']
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.license_number})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_license_expired(self):
        from django.utils import timezone
        return self.license_expiry < timezone.now().date()


class DriverDocument(BaseModel):
    """Driver document model"""
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50, choices=[
        ('license', 'Driver License'),
        ('medical', 'Medical Certificate'),
        ('insurance', 'Insurance Card'),
        ('other', 'Other'),
    ])
    document_name = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='driver_documents/')
    expiry_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.driver.full_name} - {self.document_name}"
