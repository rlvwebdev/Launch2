#!/usr/bin/env python
"""
Script to check current data and optionally regenerate loads with new distribution
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

def main():
    """Check current data and regenerate loads if needed"""
    print("🔍 Checking current TMS data...")
    print("=" * 60)
    
    # Get company and department
    company = Company.objects.first()
    if not company:
        print("❌ No company found!")
        return
    
    department = Department.objects.filter(name="Dry Bulk Operations").first()
    if not department:
        print("❌ No Dry Bulk department found!")
        return
    
    terminals = Terminal.objects.filter(department=department)
    
    print(f"🏢 Company: {company.name}")
    print(f"🏭 Department: {department.name}")
    print(f"📍 Terminals: {terminals.count()}")
    
    total_trucks = 0
    total_drivers = 0 
    total_loads = 0
    
    print("\n📊 Current Data by Terminal:")
    print("-" * 80)
    print(f"{'Terminal':<35} {'Trucks':<8} {'Drivers':<8} {'Loads':<8} {'Size':<8}")
    print("-" * 80)
    
    for terminal in terminals:
        truck_count = Truck.objects.filter(home_terminal=terminal).count()
        driver_count = Driver.objects.filter(home_terminal=terminal).count()
        load_count = Load.objects.filter(origin_terminal=terminal).count()
        
        # Determine terminal size based on truck count
        if truck_count <= 30:
            terminal_size = "Small"
        elif truck_count <= 45:
            terminal_size = "Medium"
        else:
            terminal_size = "Large"
        
        print(f"{terminal.name:<35} {truck_count:<8} {driver_count:<8} {load_count:<8} {terminal_size:<8}")
        
        total_trucks += truck_count
        total_drivers += driver_count
        total_loads += load_count
    
    print("-" * 80)
    print(f"{'TOTALS':<35} {total_trucks:<8} {total_drivers:<8} {total_loads:<8}")
    print("=" * 60)
    
    # Ask if user wants to regenerate loads
    regenerate = input("\n🔄 Do you want to delete existing loads and regenerate them with new distribution? (y/N): ")
    
    if regenerate.lower() == 'y':
        print("\n🗑️  Deleting existing loads...")
        deleted_count = Load.objects.filter(
            origin_terminal__department=department
        ).delete()[0]
        print(f"✅ Deleted {deleted_count} loads")
        
        print("\n🔄 Now run create_comprehensive_tms_data.py to regenerate loads with new distribution")
    else:
        print("\n✅ No changes made")

if __name__ == '__main__':
    main()
