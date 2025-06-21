#!/usr/bin/env python
"""
Create a test user assigned to multiple terminals across a region
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import Company, Division, Department, Terminal, CustomUser
from django.contrib.auth.hashers import make_password


def create_multi_terminal_test_user():
    """Create a test user with access to multiple terminals in a region"""
    
    # Get or create company
    company, created = Company.objects.get_or_create(
        code='LAUNCH',
        defaults={
            'name': 'Launch Transport',
            'address_street': '123 Transport Way',
            'address_city': 'Atlanta',
            'address_state': 'GA',
            'address_zip': '30309',
            'phone': '404-555-0100',
            'email': 'info@launchtransport.com',
            'is_active': True,
            'timezone': 'America/New_York'
        }
    )
    print(f"{'Created' if created else 'Found'} company: {company}")

    # Create Southeast Division (Region)
    southeast_division, created = Division.objects.get_or_create(
        company=company,
        code='SE',
        defaults={
            'name': 'Southeast Region',
            'manager_email': 'southeast.manager@launchtransport.com',
            'is_active': True
        }
    )
    print(f"{'Created' if created else 'Found'} division: {southeast_division}")

    # Create departments for different areas
    departments = []
    
    # Georgia Operations Department
    ga_dept, created = Department.objects.get_or_create(
        division=southeast_division,
        code='GA-OPS',
        defaults={
            'name': 'Georgia Operations',
            'manager_email': 'ga.ops@launchtransport.com',
            'is_active': True
        }
    )
    departments.append(ga_dept)
    print(f"{'Created' if created else 'Found'} department: {ga_dept}")

    # Florida Operations Department
    fl_dept, created = Department.objects.get_or_create(
        division=southeast_division,
        code='FL-OPS',
        defaults={
            'name': 'Florida Operations',
            'manager_email': 'fl.ops@launchtransport.com',
            'is_active': True
        }
    )
    departments.append(fl_dept)
    print(f"{'Created' if created else 'Found'} department: {fl_dept}")

    # Create terminals across the region
    terminals = []
    
    # Atlanta Terminal (GA)
    atlanta_terminal, created = Terminal.objects.get_or_create(
        department=ga_dept,
        code='ATL01',
        defaults={
            'name': 'Atlanta Main Terminal',
            'address_street': '1000 Logistics Blvd',
            'address_city': 'Atlanta',
            'address_state': 'GA',
            'address_zip': '30309',
            'phone': '404-555-0101',
            'manager_email': 'atlanta.manager@launchtransport.com',
            'is_active': True
        }
    )
    terminals.append(atlanta_terminal)
    print(f"{'Created' if created else 'Found'} terminal: {atlanta_terminal}")

    # Savannah Terminal (GA)
    savannah_terminal, created = Terminal.objects.get_or_create(
        department=ga_dept,
        code='SAV01',
        defaults={
            'name': 'Savannah Port Terminal',
            'address_street': '500 Port Authority Dr',
            'address_city': 'Savannah',
            'address_state': 'GA',
            'address_zip': '31401',
            'phone': '912-555-0102',
            'manager_email': 'savannah.manager@launchtransport.com',
            'is_active': True
        }
    )
    terminals.append(savannah_terminal)
    print(f"{'Created' if created else 'Found'} terminal: {savannah_terminal}")

    # Jacksonville Terminal (FL)
    jacksonville_terminal, created = Terminal.objects.get_or_create(
        department=fl_dept,
        code='JAX01',
        defaults={
            'name': 'Jacksonville Distribution Center',
            'address_street': '750 Industrial Pkwy',
            'address_city': 'Jacksonville',
            'address_state': 'FL',
            'address_zip': '32218',
            'phone': '904-555-0103',
            'manager_email': 'jacksonville.manager@launchtransport.com',
            'is_active': True
        }
    )
    terminals.append(jacksonville_terminal)
    print(f"{'Created' if created else 'Found'} terminal: {jacksonville_terminal}")

    # Create regional manager user with access to all terminals in the region
    username = 'regional.manager'
    email = 'regional.manager@launchtransport.com'
    
    # Delete existing user if exists
    CustomUser.objects.filter(username=username).delete()
    
    regional_manager = CustomUser.objects.create(
        username=username,
        email=email,
        first_name='Sarah',
        last_name='Thompson',
        password=make_password('password123'),
        company=company,
        division=southeast_division,  # Assigned to Southeast Region
        department=None,  # Not tied to specific department - has regional access
        terminal=atlanta_terminal,  # Home terminal is Atlanta
        phone='404-555-0200',
        role='department_manager',  # Regional manager role
        theme='light',
        language='en',
        timezone='America/New_York',        is_staff=False,
        is_active=True
    )
    
    print(f"\nCreated regional manager user:")
    print(f"  Username: {regional_manager.username}")
    print(f"  Email: {regional_manager.email}")
    print(f"  Full Name: {regional_manager.first_name} {regional_manager.last_name}")
    print(f"  Company: {regional_manager.company.name if regional_manager.company else 'None'}")
    print(f"  Division: {regional_manager.division.name if regional_manager.division else 'None'}")
    print(f"  Home Terminal: {regional_manager.terminal.name if regional_manager.terminal else 'None'}")
    print(f"  Role: {regional_manager.role}")
    print(f"  Password: password123")
    
    print(f"\nTerminals accessible to this user:")
    for terminal in terminals:
        print(f"  - {terminal.name} ({terminal.code}) - {terminal.address_city}, {terminal.address_state}")
        print(f"    Department: {terminal.department.name}")
        print(f"    Division: {terminal.department.division.name}")
    
    print(f"\nTotal terminals in region: {len(terminals)}")
    print(f"User should be able to select from all {len(terminals)} terminals")
    
    print(f"\nLogin credentials:")
    print(f"  Username: {username}")
    print(f"  Password: password123")
    
    return regional_manager, terminals


if __name__ == '__main__':
    print("Creating multi-terminal test user...")
    try:
        user, terminals = create_multi_terminal_test_user()
        print(f"\n✅ Successfully created test user with access to {len(terminals)} terminals!")
        print(f"\nYou can now login with:")
        print(f"  Username: regional.manager")
        print(f"  Password: password123")
        print(f"\nThe user should see all {len(terminals)} terminals in the terminal selector.")
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        import traceback
        traceback.print_exc()
