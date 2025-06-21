#!/usr/bin/env python
"""
Simple test to verify Django setup and create basic data
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

try:
    from companies.models import Company, Division, Department, Terminal
    print("✅ Django setup successful")
    print(f"📊 Current data:")
    print(f"  Companies: {Company.objects.count()}")
    print(f"  Divisions: {Division.objects.count()}")
    print(f"  Departments: {Department.objects.count()}")
    print(f"  Terminals: {Terminal.objects.count()}")
    
    # Get the company
    company = Company.objects.first()
    if company:
        print(f"  Company found: {company.name}")
    else:
        print("  ❌ No company found!")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
