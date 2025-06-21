#!/usr/bin/env python
"""
Fixed data generation script for existing terminals
"""
import os
import sys
import django
from datetime import datetime, timedelta
import random
from decimal import Decimal

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import Company, Division, Department, Terminal
from drivers.models import Driver
from vehicles.models import Truck, Trailer
from loads.models import Load

# Truck manufacturers and models for dry bulk
TRUCK_MODELS = [
    ('Peterbilt', '389'),
    ('Peterbilt', '579'),
    ('Kenworth', 'W900'),
    ('Kenworth', 'T680'),
    ('Freightliner', 'Cascadia'),
    ('Volvo', 'VNL'),
    ('Mack', 'Anthem'),
    ('International', 'LT'),
]

# Load types for dry bulk operations
LOAD_TYPES = [
    'Grain - Corn',
    'Grain - Wheat', 
    'Grain - Soybeans',
    'Sand - Construction',
    'Sand - Frac Sand',
    'Cement - Portland',
    'Cement - Fly Ash',
    'Salt - Road Salt',
    'Salt - Food Grade',
    'Plastic Pellets',
    'Sugar - Granulated',
    'Flour - Wheat',
    'Feed - Livestock',
    'Fertilizer - Granular',
    'Coal - Bituminous'
]

def create_trucks_for_terminal(terminal):
    """Create 24-50 trucks (plus 2 spare) for each terminal"""
    # Check if terminal already has trucks
    existing_trucks = Truck.objects.filter(home_terminal=terminal).count()
    if existing_trucks > 0:
        print(f"  📁 Terminal {terminal.name} already has {existing_trucks} trucks, skipping...")
        return []
    
    truck_count = random.randint(24, 50)
    spare_count = 2
    total_trucks = truck_count + spare_count
    
    print(f"  🚛 Creating {total_trucks} trucks for {terminal.name} ({truck_count} active + {spare_count} spare)")
    
    trucks = []
    
    for i in range(total_trucks):
        manufacturer, model = random.choice(TRUCK_MODELS)
        
        # Last 2 trucks are spares
        is_spare = i >= truck_count
        
        # Generate a proper 17-character VIN
        vin = f"1{manufacturer[:2].upper()}{str(random.randint(10000000000000, 99999999999999))}"
        
        truck = Truck.objects.create(
            make=manufacturer,
            model=model,
            year=random.randint(2018, 2024),
            vin=vin,
            license_plate=f"{terminal.address_state}{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            color=random.choice(['White', 'Blue', 'Red', 'Black', 'Silver']),
            status='available' if not is_spare else 'out_of_service',
            home_terminal=terminal,
            assigned_terminal=terminal,
            company=terminal.department.division.company,
            division=terminal.department.division,
            department=terminal.department,
            mileage=random.randint(50000, 300000),
            last_maintenance=datetime.now().date() - timedelta(days=random.randint(30, 90)),
            next_maintenance_due=datetime.now().date() + timedelta(days=random.randint(30, 90)),
            registration_expiry=datetime.now().date() + timedelta(days=random.randint(365, 730)),
            insurance_expiry=datetime.now().date() + timedelta(days=random.randint(365, 730)),
            maintenance_notes=f"Dry bulk hauler - {'Spare unit' if is_spare else 'Active fleet'}"
        )
        trucks.append(truck)
    
    return trucks

def create_loads_for_terminal(terminal):
    """Create 12 weeks of loads starting June 1, 2025"""
    # Check if terminal already has loads
    existing_loads = Load.objects.filter(origin_terminal=terminal).count()
    if existing_loads > 0:
        print(f"  📁 Terminal {terminal.name} already has {existing_loads} loads, skipping...")
        return []
    
    start_date = datetime(2025, 6, 1)
    end_date = start_date + timedelta(weeks=12)  # 12 weeks
    
    loads = []
    
    # Average 2-4 loads per day per terminal
    total_days = (end_date - start_date).days
    total_loads = random.randint(total_days * 2, total_days * 4)
    
    print(f"  📦 Creating {total_loads} loads over {total_days} days for {terminal.name}")
    
    # Get other terminals as potential destinations
    other_terminals = list(Terminal.objects.exclude(id=terminal.id))
    
    for i in range(total_loads):
        # Random date within the 12-week period
        load_date = start_date + timedelta(
            days=random.randint(0, total_days-1),
            hours=random.randint(6, 18),  # Business hours
            minutes=random.choice([0, 15, 30, 45])
        )
        
        # Pick random destination terminal
        destination = random.choice(other_terminals) if other_terminals else terminal
        
        # Random load type
        cargo_type = random.choice(LOAD_TYPES)
        
        # Generate load details
        weight = random.randint(40000, 80000)  # 20-40 tons typical for dry bulk
        distance_miles = random.randint(150, 800)
        rate = Decimal(str(round(random.uniform(1.50, 3.50) * distance_miles, 2)))  # $1.50-3.50 per mile
        
        # Parse the cargo type for company names
        cargo_base = cargo_type.split(' - ')[0] if ' - ' in cargo_type else cargo_type
        
        load = Load.objects.create(
            load_number=f"DB{load_date.strftime('%y%m%d')}-{terminal.code}-{i+1:03d}",
            shipper=f"{cargo_base} Corp",
            receiver=f"Destination {cargo_base} Ltd",
            pickup_address=terminal.address_street or f"{1000 + i} Industrial Blvd",
            pickup_city=terminal.address_city or "Unknown City",
            pickup_state=terminal.address_state or "TX", 
            pickup_zip=terminal.address_zip or "00000",
            delivery_address=destination.address_street or f"{2000 + i} Delivery Ave",
            delivery_city=destination.address_city or "Unknown City",
            delivery_state=destination.address_state or "TX",
            delivery_zip=destination.address_zip or "00000",
            cargo_description=cargo_type,
            weight=weight,
            distance=distance_miles,
            estimated_transit_time=random.randint(24, 72),  # 1-3 days
            status='pending',
            pickup_date=load_date,
            delivery_date=load_date + timedelta(days=random.randint(1, 3)),
            rate=rate,
            special_instructions=f"Dry bulk {cargo_type.lower()} - requires clean trailer",
            company=terminal.department.division.company,
            division=terminal.department.division,
            department=terminal.department,
            origin_terminal=terminal,
            destination_terminal=destination,
            customer_id=f"CUST-{random.randint(1000, 9999)}",
            dispatched_by="System Generated"
        )
        loads.append(load)
    
    return loads

def main():
    """Main execution function"""
    print("🚀 Creating trucks and loads for existing terminals")
    print("=" * 60)
    
    # Get all existing terminals
    terminals = list(Terminal.objects.all())
    print(f"\n🏭 Found {len(terminals)} existing terminals")
    
    # Create trucks and loads for each terminal
    print(f"\n🚛 Creating trucks and loads for {len(terminals)} terminals...")
    
    total_trucks = 0
    total_loads = 0
    
    for i, terminal in enumerate(terminals, 1):
        print(f"\n[{i}/{len(terminals)}] Processing {terminal.name}...")
        
        # Create trucks
        trucks = create_trucks_for_terminal(terminal)
        total_trucks += len(trucks)
        
        # Create loads
        loads = create_loads_for_terminal(terminal)
        total_loads += len(loads)
    
    # Final summary
    print("\n" + "=" * 60)
    print("✅ DATA GENERATION COMPLETE!")
    print("=" * 60)
    print(f"🏭 Terminals: {len(terminals)}")
    print(f"🚛 Total NEW Trucks: {total_trucks}")
    print(f"📦 Total NEW Loads: {total_loads}")
    print(f"📅 Load Date Range: June 1 - August 24, 2025 (12 weeks)")
    print("=" * 60)

if __name__ == '__main__':
    main()
