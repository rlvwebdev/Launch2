"""
Script to create test organizational data for Launch TMS
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import Company, Division, Department, Terminal

def create_test_organizations():
    """Create test organizational structure"""
    
    # Get or create a company
    company, created = Company.objects.get_or_create(
        code='DEMO',
        defaults={
            'name': 'Demo Trucking Company',
            'address_street': '123 Main St',
            'address_city': 'Denver',
            'address_state': 'CO',
            'address_zip': '80202',
            'phone': '555-123-4567',
            'email': 'info@demotruck.com',
            'timezone': 'America/Denver'
        }
    )
    
    if created:
        print(f"Created company: {company}")
    else:
        print(f"Found existing company: {company}")
    
    # Create division
    division, created = Division.objects.get_or_create(
        company=company,
        code='WEST',
        defaults={
            'name': 'Western Division',
            'manager_email': 'west.manager@demotruck.com'
        }
    )
    
    if created:
        print(f"Created division: {division}")
    else:
        print(f"Found existing division: {division}")
    
    # Create department
    department, created = Department.objects.get_or_create(
        division=division,
        code='OPS',
        defaults={
            'name': 'Operations Department',
            'manager_email': 'ops.manager@demotruck.com'
        }
    )
    
    if created:
        print(f"Created department: {department}")
    else:
        print(f"Found existing department: {department}")
    
    # Create terminals
    terminals_data = [
        {
            'code': 'DEN',
            'name': 'Denver Terminal',
            'address_street': '456 Industrial Blvd',
            'address_city': 'Denver',
            'address_state': 'CO',
            'address_zip': '80202',
            'phone': '555-123-4568',
            'manager_email': 'denver.manager@demotruck.com'
        },
        {
            'code': 'SLC',
            'name': 'Salt Lake City Terminal',
            'address_street': '789 Freight Way',
            'address_city': 'Salt Lake City',
            'address_state': 'UT',
            'address_zip': '84101',
            'phone': '555-123-4569',
            'manager_email': 'slc.manager@demotruck.com'
        },
        {
            'code': 'PHX',
            'name': 'Phoenix Terminal',
            'address_street': '321 Logistics Dr',
            'address_city': 'Phoenix',
            'address_state': 'AZ',
            'address_zip': '85001',
            'phone': '555-123-4570',
            'manager_email': 'phoenix.manager@demotruck.com'
        }
    ]
    
    for terminal_data in terminals_data:
        terminal, created = Terminal.objects.get_or_create(
            department=department,
            code=terminal_data['code'],
            defaults=terminal_data
        )
        
        if created:
            print(f"Created terminal: {terminal}")
        else:
            print(f"Found existing terminal: {terminal}")
    
    print(f"\nTotal terminals in database: {Terminal.objects.count()}")
    print(f"Total departments in database: {Department.objects.count()}")
    print(f"Total divisions in database: {Division.objects.count()}")
    print(f"Total companies in database: {Company.objects.count()}")

if __name__ == '__main__':
    create_test_organizations()
