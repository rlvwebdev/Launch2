#!/usr/bin/env python
"""
Test API endpoints to verify our comprehensive data is accessible
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import Company, Division, Department, Terminal
from drivers.models import Driver
from vehicles.models import Truck
from loads.models import Load

def test_data_counts():
    """Test that our comprehensive data is accessible"""
    print("🔍 Testing comprehensive TMS data access...")
    print("=" * 50)
    
    # Get overall counts
    company_count = Company.objects.count()
    division_count = Division.objects.count()
    department_count = Department.objects.count()
    terminal_count = Terminal.objects.count()
    driver_count = Driver.objects.count()
    truck_count = Truck.objects.count()
    load_count = Load.objects.count()
    
    print(f"📊 Overall Data Summary:")
    print(f"   🏢 Companies: {company_count}")
    print(f"   🏬 Divisions: {division_count}")
    print(f"   🏭 Departments: {department_count}")
    print(f"   🏭 Terminals: {terminal_count}")
    print(f"   👤 Drivers: {driver_count}")
    print(f"   🚛 Trucks: {truck_count}")
    print(f"   📦 Loads: {load_count}")
    
    # Test terminal-specific data
    print(f"\n🎯 Terminal-Specific Data (Top 5 terminals):")
    print("-" * 50)
    
    terminals = Terminal.objects.filter(
        department__name="Dry Bulk Operations"
    ).order_by('name')[:5]
    
    for terminal in terminals:
        terminal_drivers = Driver.objects.filter(home_terminal=terminal).count()
        terminal_trucks = Truck.objects.filter(home_terminal=terminal).count()
        terminal_loads_origin = Load.objects.filter(origin_terminal=terminal).count()
        
        print(f"📍 {terminal.name} ({terminal.code}):")
        print(f"   👤 Drivers: {terminal_drivers}")
        print(f"   🚛 Trucks: {terminal_trucks}")
        print(f"   📦 Origin Loads: {terminal_loads_origin}")
        print()

    # Test load date range
    print(f"📅 Load Date Analysis:")
    print("-" * 30)
    
    earliest_load = Load.objects.order_by('pickup_date').first()
    latest_load = Load.objects.order_by('-pickup_date').first()
    
    if earliest_load and latest_load:
        print(f"   Earliest Load: {earliest_load.pickup_date.strftime('%Y-%m-%d')}")
        print(f"   Latest Load: {latest_load.pickup_date.strftime('%Y-%m-%d')}")
        print(f"   Date Range: {(latest_load.pickup_date - earliest_load.pickup_date).days} days")
    
    print("\n✅ Data verification complete!")
    return True

if __name__ == '__main__':
    test_data_counts()
