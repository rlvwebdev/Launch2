#!/usr/bin/env python
"""
Check driver data status across all terminals
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
    print("🔍 COMPREHENSIVE TMS DATA STATUS CHECK")
    print("=" * 60)
    
    # Get the company
    company = Company.objects.first()
    if not company:
        print("❌ No company found!")
        return
    
    print(f"🏢 Company: {company.name}")
    
    # Get Dry Bulk department
    try:
        department = Department.objects.get(name="Dry Bulk Operations")
        print(f"🏭 Department: {department.name}")
    except Department.DoesNotExist:
        print("❌ Dry Bulk Operations department not found!")
        return
    
    # Get all terminals under the department
    terminals = Terminal.objects.filter(department=department)
    print(f"🌐 Terminals: {terminals.count()}")
    
    # Count totals
    total_trucks = Truck.objects.filter(department=department).count()
    total_drivers = Driver.objects.filter(department=department).count()
    total_loads = Load.objects.filter(department=department).count()
    
    print(f"🚛 Total Trucks: {total_trucks}")
    print(f"👤 Total Drivers: {total_drivers}")
    print(f"📦 Total Loads: {total_loads}")
    
    print("\n📊 TERMINAL BREAKDOWN:")
    print("-" * 60)
    print(f"{'Terminal':<30} {'Trucks':<8} {'Drivers':<8} {'Loads':<8}")
    print("-" * 60)
    
    for terminal in terminals:
        truck_count = Truck.objects.filter(home_terminal=terminal).count()
        driver_count = Driver.objects.filter(home_terminal=terminal).count()
        load_count = Load.objects.filter(origin_terminal=terminal).count()
        
        print(f"{terminal.name[:29]:<30} {truck_count:<8} {driver_count:<8} {load_count:<8}")
    
    print("-" * 60)
    
    # Driver tier distribution
    print("\n👤 DRIVER TIER DISTRIBUTION:")
    print("-" * 30)
    for tier_code, tier_name in Driver.TIER_CHOICES:
        count = Driver.objects.filter(department=department, tier=tier_code).count()
        percentage = (count / total_drivers * 100) if total_drivers > 0 else 0
        print(f"{tier_name:<25} {count:>4} ({percentage:>5.1f}%)")
    
    print("=" * 60)
    print("✅ DATA STATUS CHECK COMPLETE!")

if __name__ == '__main__':
    main()
