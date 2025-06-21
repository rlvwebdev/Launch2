"""
Company and organizational models for Launch TMS
"""
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class BaseModel(models.Model):
    """Base model with common fields"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class Company(BaseModel):
    """Company/Organization model"""
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10, unique=True)
    
    # Contact information
    address_street = models.CharField(max_length=255, blank=True)
    address_city = models.CharField(max_length=100, blank=True)
    address_state = models.CharField(max_length=50, blank=True)
    address_zip = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    
    # Settings
    is_active = models.BooleanField(default=True)
    timezone = models.CharField(max_length=50, default='UTC')
    
    class Meta:
        verbose_name_plural = "Companies"
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Division(BaseModel):
    """Division within a company"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='divisions')
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10)
    manager_email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['company', 'code']
    
    def __str__(self):
        return f"{self.company.code}-{self.code}: {self.name}"


class Department(BaseModel):
    """Department within a division"""
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10)
    manager_email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['division', 'code']
    
    def __str__(self):
        return f"{self.division.company.code}-{self.division.code}-{self.code}: {self.name}"


class Terminal(BaseModel):
    """Terminal/Location within a department"""
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='terminals')
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10)
    
    # Location details
    address_street = models.CharField(max_length=255, blank=True)
    address_city = models.CharField(max_length=100, blank=True)
    address_state = models.CharField(max_length=50, blank=True)
    address_zip = models.CharField(max_length=20, blank=True)
    
    # Contact information
    phone = models.CharField(max_length=20, blank=True)
    manager_email = models.EmailField(blank=True)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['department', 'code']
    
    def __str__(self):
        return f"{self.department.division.company.code}-{self.department.division.code}-{self.department.code}-{self.code}: {self.name}"


class CustomUser(AbstractUser):
    """Extended user model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='users', null=True, blank=True)
    division = models.ForeignKey(Division, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Additional fields
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50, choices=[
        ('system_admin', 'System Administrator'),
        ('company_admin', 'Company Administrator'),
        ('department_manager', 'Department Manager'),
        ('user', 'User'),
    ], default='user')
    
    # Settings
    theme = models.CharField(max_length=10, choices=[('light', 'Light'), ('dark', 'Dark')], default='light')
    language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
