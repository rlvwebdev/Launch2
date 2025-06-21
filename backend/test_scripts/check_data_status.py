#!/usr/bin/env python
"""
Check the data that was created
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
from vehicles.models import Truck, Trailer
from loads.models import Load

def check_data():
    """Check what data was created"""
    print("📊 Current TMS Data Status")
    print("=" * 50)
    
    # Organizational data
    print(f"🏢 Companies: {Company.objects.count()}")
    print(f"🏛️  Divisions: {Division.objects.count()}")
    print(f"🏬 Departments: {Department.objects.count()}")
    print(f"🏭 Terminals: {Terminal.objects.count()}")
    
    # Fleet data
    print(f"🚛 Trucks: {Truck.objects.count()}")
    print(f"🚚 Trailers: {Trailer.objects.count()}")
    
    # Load data
    print(f"📦 Loads: {Load.objects.count()}")
    
    print("\n🏭 Terminals by Department:")
    for dept in Department.objects.all():
        terminal_count = Terminal.objects.filter(department=dept).count()
        truck_count = Truck.objects.filter(department=dept).count()
        load_count = Load.objects.filter(origin_terminal__department=dept).count()
        print(f"  {dept.name}: {terminal_count} terminals, {truck_count} trucks, {load_count} loads")
    
    print("\n🚛 Trucks by Terminal (first 10):")
    for terminal in Terminal.objects.all()[:10]:
        truck_count = Truck.objects.filter(home_terminal=terminal).count()
        load_count = Load.objects.filter(origin_terminal=terminal).count()
        print(f"  {terminal.name}: {truck_count} trucks, {load_count} loads")

if __name__ == '__main__':
    check_data()
