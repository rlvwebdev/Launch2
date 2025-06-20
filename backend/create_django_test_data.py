#!/usr/bin/env python3
"""
Create test data for Django Launch TMS
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import Company, Division, Department, Terminal, CustomUser
from django.contrib.auth.hashers import make_password
from datetime import datetime, date

def create_test_data():
    """Create test company and user data"""
    try:
        # Create test company
        company, created = Company.objects.get_or_create(
            code="TEST",
            defaults={
                'name': "Test Company",
                'address_street': "123 Test St",
                'address_city': "Test City",
                'address_state': "TX",
                'address_zip': "12345",
                'phone': "555-123-4567",
                'email': "test@testcompany.com",
                'is_active': True
            }
        )
        
        if created:
            print(f"✅ Created test company: {company.name}")
        else:
            print(f"📋 Test company already exists: {company.name}")
        
        # Create division
        division, created = Division.objects.get_or_create(
            company=company,
            code="DIV1",
            defaults={
                'name': "Test Division",
                'manager_email': "manager@testcompany.com",
                'is_active': True
            }
        )
        
        if created:
            print(f"✅ Created division: {division.name}")
        
        # Create department
        department, created = Department.objects.get_or_create(
            division=division,
            code="DEPT1",
            defaults={
                'name': "Test Department",
                'manager_email': "dept@testcompany.com",
                'is_active': True
            }
        )
        
        if created:
            print(f"✅ Created department: {department.name}")
        
        # Create terminal
        terminal, created = Terminal.objects.get_or_create(
            department=department,
            code="TERM1",
            defaults={
                'name': "Test Terminal",
                'address_street': "456 Terminal Ave",
                'address_city': "Terminal City",
                'address_state': "TX",
                'address_zip': "12346",
                'phone': "555-123-4568",
                'manager_email': "terminal@testcompany.com",
                'is_active': True
            }
        )
        
        if created:
            print(f"✅ Created terminal: {terminal.name}")
        
        # Create test user
        user, created = CustomUser.objects.get_or_create(
            username="testuser",
            email="test@launch.com",
            defaults={
                'first_name': "Test",
                'last_name': "User",
                'phone': "555-123-4567",
                'company': company,
                'division': division,
                'department': department,
                'terminal': terminal,
                'role': 'company_admin',
                'is_active': True,
                'is_staff': True,
                'is_superuser': True,
                'password': make_password('password')
            }
        )
        
        if created:
            print(f"✅ Created test user: {user.email}")
        else:
            print(f"📋 Test user already exists: {user.email}")
        
        print("\n🚀 Django test data created successfully!")
        print("\n📋 Test credentials:")
        print(f"   Username: testuser")
        print(f"   Email: test@launch.com")
        print(f"   Password: password")
        print(f"   Company: {company.name} ({company.code})")
        print(f"   Role: {user.role}")
        
    except Exception as e:
        print(f"❌ Error creating test data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_test_data()
