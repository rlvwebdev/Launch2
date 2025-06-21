#!/usr/bin/env python
"""
Comprehensive data generation script for Launch TMS
- Creates Dry Bulk department if it doesn't exist
- Generates 27 terminals under Dry Bulk department
- Creates 24-50 trucks per terminal (with 2 spare trucks each)
- Generates 12 weeks of loads starting June 1, 2025
"""
import os
import sys
import django
from datetime import datetime, timedelta
import random
from decimal import Decimal
from django.utils import timezone

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import Company, Division, Department, Terminal
from drivers.models import Driver
from vehicles.models import Truck, Trailer
from loads.models import Load

# US Cities for terminal locations
TERMINAL_CITIES = [
    ('Atlanta', 'GA', '30309', 'ATL'),
    ('Birmingham', 'AL', '35203', 'BHM'),
    ('Charlotte', 'NC', '28202', 'CLT'),
    ('Charleston', 'SC', '29401', 'CHS'),
    ('Columbia', 'SC', '29201', 'CAE'),
    ('Jacksonville', 'FL', '32202', 'JAX'),
    ('Miami', 'FL', '33101', 'MIA'),
    ('Orlando', 'FL', '32801', 'MCO'),
    ('Tampa', 'FL', '33602', 'TPA'),
    ('Nashville', 'TN', '37201', 'BNA'),
    ('Memphis', 'TN', '38103', 'MEM'),
    ('Knoxville', 'TN', '37902', 'TYS'),
    ('Louisville', 'KY', '40202', 'SDF'),
    ('Lexington', 'KY', '40507', 'LEX'),
    ('Richmond', 'VA', '23219', 'RIC'),
    ('Norfolk', 'VA', '23510', 'ORF'),
    ('Raleigh', 'NC', '27601', 'RDU'),
    ('Greensboro', 'NC', '27401', 'GSO'),
    ('Greenville', 'SC', '29601', 'GSP'),
    ('Savannah', 'GA', '31401', 'SAV'),
    ('Augusta', 'GA', '30901', 'AGS'),
    ('Macon', 'GA', '31201', 'MCN'),
    ('Mobile', 'AL', '36602', 'MOB'),
    ('Montgomery', 'AL', '36104', 'MGM'),
    ('Huntsville', 'AL', '35801', 'HSV'),
    ('Pensacola', 'FL', '32501', 'PNS'),
    ('Tallahassee', 'FL', '32301', 'TLH')
]

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

# Common first and last names for realistic driver data
FIRST_NAMES = [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Charles', 'Joseph', 'Thomas',
    'Christopher', 'Daniel', 'Paul', 'Mark', 'Donald', 'Steven', 'Kenneth', 'Andrew', 'Brian', 'Joshua',
    'Kevin', 'Justin', 'Jason', 'Matthew', 'Gary', 'Timothy', 'Jose', 'Larry', 'Jeffrey', 'Frank',
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle'
]

LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'AdAMS', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
]

def create_dry_bulk_department():
    """Create or get the Dry Bulk department"""
    print("🏢 Setting up Dry Bulk Department...")
    
    # Get the company
    company = Company.objects.first()
    if not company:
        print("❌ No company found! Please create a company first.")
        return None
      # Get or create Southeast Region division
    division, created = Division.objects.get_or_create(
        company=company,
        name="Southeast Region",
        defaults={
            'code': 'SE',
            'manager_email': 'southeast.manager@launchtransport.com'
        }
    )
    
    if created:
        print(f"✅ Created division: {division.name}")
    else:
        print(f"📁 Found existing division: {division.name}")
      # Get or create Dry Bulk department
    department, created = Department.objects.get_or_create(
        division=division,
        name="Dry Bulk Operations", 
        defaults={
            'code': 'DRY-BULK',
            'manager_email': 'drybulk.manager@launchtransport.com'
        }
    )
    
    if created:
        print(f"✅ Created department: {department.name}")
    else:
        print(f"📁 Found existing department: {department.name}")
    
    return department

def create_terminals(department):
    """Create 27 terminals under the Dry Bulk department"""
    print(f"\n🏭 Creating 27 terminals for {department.name}...")
    
    terminals = []
    
    for i, (city, state, zip_code, code) in enumerate(TERMINAL_CITIES):
        terminal_code = f"DB{code}"
        terminal_name = f"{city} Dry Bulk Terminal"
        
        terminal, created = Terminal.objects.get_or_create(
            department=department,
            code=terminal_code,
            defaults={
                'name': terminal_name,
                'address_street': f"{1000 + i * 100} Industrial Blvd",
                'address_city': city,
                'address_state': state,
                'address_zip': zip_code,
                'phone': f"{random.randint(200, 999)}-555-{random.randint(1000, 9999)}",
                'manager_email': f"{city.lower().replace(' ', '')}.manager@launchtransport.com",
                'is_active': True
            }
        )
        
        if created:
            print(f"  ✅ Created: {terminal.name} ({terminal.code})")
        else:
            print(f"  📁 Found: {terminal.name} ({terminal.code})")
        
        terminals.append(terminal)
    
    print(f"🎯 Total terminals: {len(terminals)}")
    return terminals

def create_trucks_for_terminal(terminal):
    """Create 24-50 trucks (plus 2 spare) for each terminal"""
    
    # Check if trucks already exist for this terminal
    existing_trucks = Truck.objects.filter(home_terminal=terminal).count()
    if existing_trucks > 0:
        print(f"  🚛 Found {existing_trucks} existing trucks for {terminal.name} - skipping creation")
        return Truck.objects.filter(home_terminal=terminal)
    
    truck_count = random.randint(24, 50)
    spare_count = 2
    total_trucks = truck_count + spare_count
    
    print(f"  🚛 Creating {total_trucks} trucks for {terminal.name} ({truck_count} active + {spare_count} spare)")
    
    trucks = []
    
    for i in range(total_trucks):
        manufacturer, model = random.choice(TRUCK_MODELS)
        
        # Generate truck number based on terminal code
        truck_number = f"{terminal.code}-{i+1:03d}"
          # Last 2 trucks are spares
        is_spare = i >= truck_count
        
        truck = Truck.objects.create(
            make=manufacturer,
            model=model,
            year=random.randint(2018, 2024),
            vin=f"1{manufacturer[:2].upper()}{random.randint(10000000000000, 99999999999999)}",
            license_plate=f"{terminal.address_state}{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            color=random.choice(['White', 'Blue', 'Red', 'Black', 'Silver', 'Green']),
            status='available' if not is_spare else 'out_of_service',
            mileage=random.randint(50000, 500000),
            last_maintenance=timezone.now().date() - timedelta(days=random.randint(1, 90)),
            next_maintenance_due=timezone.now().date() + timedelta(days=random.randint(30, 180)),
            registration_expiry=timezone.now().date() + timedelta(days=random.randint(180, 365)),
            insurance_expiry=timezone.now().date() + timedelta(days=random.randint(90, 365)),
            maintenance_notes=f"Dry bulk hauler - {'Spare unit' if is_spare else 'Active fleet'}",
            company=terminal.department.division.company,
            division=terminal.department.division,
            department=terminal.department,
            home_terminal=terminal,
            assigned_terminal=terminal
        )
        trucks.append(truck)
    
    return trucks

def create_loads_for_terminal(terminal, trucks):
    """Create 12 weeks of loads starting June 1, 2025"""
    
    # Check if loads already exist for this terminal
    existing_loads = Load.objects.filter(origin_terminal=terminal).count()
    if existing_loads > 0:
        print(f"  📦 Found {existing_loads} existing loads for {terminal.name} - skipping creation")
        return []
    
    start_date = timezone.make_aware(datetime(2025, 6, 1))
    end_date = start_date + timedelta(weeks=12)  # 12 weeks
    
    loads = []    # Determine terminal size based on truck count and set loads per DAY accordingly
    truck_count = len(trucks)
    if truck_count <= 30:  # Small terminal
        loads_per_day = random.randint(20, 30)
        terminal_size = "Small"
    elif truck_count <= 45:  # Medium terminal
        loads_per_day = random.randint(30, 40)
        terminal_size = "Medium"
    else:  # Large terminal
        loads_per_day = random.randint(40, 45)
        terminal_size = "Large"
    
    total_days = (end_date - start_date).days  # 84 days (12 weeks)
    
    # Calculate total loads (daily volume * number of days)
    # Add some variation (-10% to +15%) to make it more realistic
    variation_factor = random.uniform(0.9, 1.15)
    total_loads = int(loads_per_day * total_days * variation_factor)
    
    print(f"  📦 Creating {total_loads} loads over {total_days} days for {terminal.name} ({terminal_size} terminal - ~{loads_per_day}/day)")
    
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
        destination = random.choice(other_terminals)
        
        # Random load type
        commodity = random.choice(LOAD_TYPES)
          # Generate load details
        weight = random.randint(40000, 80000)  # 20-40 tons typical for dry bulk
        rate = Decimal(str(round(random.uniform(1.50, 3.50) * (weight / 1000), 2)))  # $1.50-3.50 per pound
        
        load = Load.objects.create(
            load_number=f"DB{load_date.strftime('%y%m%d')}-{terminal.code}-{i+1:03d}",
            shipper=f"{commodity.split(' - ')[0]} Corp",
            receiver=f"{destination.address_city} Bulk Storage",
            origin_terminal=terminal,
            destination_terminal=destination,
            pickup_address=f"{terminal.address_street}",
            pickup_city=terminal.address_city,
            pickup_state=terminal.address_state,
            pickup_zip=terminal.address_zip,
            delivery_address=f"{destination.address_street}",
            delivery_city=destination.address_city,
            delivery_state=destination.address_state,
            delivery_zip=destination.address_zip,
            cargo_description=commodity,
            weight=weight,
            rate=rate,
            distance=random.randint(150, 800),
            status='pending',
            pickup_date=load_date,
            delivery_date=load_date + timedelta(days=random.randint(1, 3)),
            special_instructions=f"Dry bulk {commodity.lower()} - requires clean trailer",
            company=terminal.department.division.company,
            division=terminal.department.division,
            department=terminal.department
        )
        loads.append(load)
    
    return loads

def create_drivers_for_terminal(terminal, truck_count):
    """Create drivers for each terminal (similar to truck count minus 2 spares)"""
    
    # Check if drivers already exist for this terminal
    existing_drivers = Driver.objects.filter(home_terminal=terminal).count()
    if existing_drivers > 0:
        print(f"  👤 Found {existing_drivers} existing drivers for {terminal.name} - skipping creation")
        return Driver.objects.filter(home_terminal=terminal)
    
    # Calculate driver count (truck count minus 2 spares, ensuring 16-42 range)
    driver_count = max(16, min(42, truck_count - 2))
    
    print(f"  👤 Creating {driver_count} drivers for {terminal.name}")
    
    drivers = []
    
    for i in range(driver_count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        
        # Generate experience tier based on weighted distribution
        # More newer drivers than experienced ones (realistic)
        tier_weights = [0.4, 0.3, 0.2, 0.1]  # tier_1, tier_2, tier_3, tier_4
        tier = random.choices(['tier_1', 'tier_2', 'tier_3', 'tier_4'], weights=tier_weights)[0]
        
        # Calculate hire date based on tier
        if tier == 'tier_1':
            years_ago = random.uniform(0, 2)
        elif tier == 'tier_2':
            years_ago = random.uniform(2, 4)
        elif tier == 'tier_3':
            years_ago = random.uniform(5, 8)
        else:  # tier_4
            years_ago = random.uniform(8, 15)
        
        hire_date = timezone.now().date() - timedelta(days=int(years_ago * 365))
        
        # Generate unique license number
        license_number = f"{terminal.address_state}{random.randint(100000000, 999999999)}"
        
        driver = Driver.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=f"{first_name.lower()}.{last_name.lower()}@launchtransport.com",
            phone_number=f"{random.randint(200, 999)}-555-{random.randint(1000, 9999)}",
            address=f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Pine', 'Elm', 'Cedar', 'Maple'])} {random.choice(['St', 'Ave', 'Dr', 'Ln', 'Rd'])}, {terminal.address_city}, {terminal.address_state} {random.randint(10000, 99999)}",
            hire_date=hire_date,
            tier=tier,
            status='active',
            training_status='completed',
            training_completion_date=hire_date + timedelta(days=random.randint(30, 90)),
            license_number=license_number,
            license_expiry=timezone.now().date() + timedelta(days=random.randint(180, 1095)),  # 6 months to 3 years
            fuel_card=f"FC{random.randint(1000000, 9999999)}",
            emergency_contact_name=f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
            emergency_contact_phone=f"{random.randint(200, 999)}-555-{random.randint(1000, 9999)}",
            emergency_contact_relationship=random.choice(['Spouse', 'Parent', 'Sibling', 'Child', 'Friend']),
            company=terminal.department.division.company,
            division=terminal.department.division,
            department=terminal.department,
            home_terminal=terminal,
            access_level='read_only'
        )
        drivers.append(driver)
    
    return drivers

def main():
    """Main execution function"""
    print("🚀 Starting comprehensive data generation for Launch TMS")
    print("=" * 60)
    
    # Step 1: Create Dry Bulk department
    department = create_dry_bulk_department()
    if not department:
        return
    
    # Step 2: Create 27 terminals
    terminals = create_terminals(department)
      # Step 3: Create trucks, drivers, and loads for each terminal
    print(f"\n🚛 Creating trucks, drivers, and loads for {len(terminals)} terminals...")
    
    total_trucks = 0
    total_drivers = 0
    total_loads = 0
    
    for i, terminal in enumerate(terminals, 1):
        print(f"\n[{i}/{len(terminals)}] Processing {terminal.name}...")
        
        # Create trucks
        trucks = create_trucks_for_terminal(terminal)
        total_trucks += len(trucks)
        
        # Create drivers
        drivers = create_drivers_for_terminal(terminal, len(trucks))
        total_drivers += len(drivers)
        
        # Create loads
        loads = create_loads_for_terminal(terminal, trucks)
        total_loads += len(loads)
    
    # Final summary
    print("\n" + "=" * 60)
    print("✅ DATA GENERATION COMPLETE!")
    print("=" * 60)
    print(f"🏢 Department: {department.name}")
    print(f"🏭 Terminals: {len(terminals)}")
    print(f"🚛 Total Trucks: {total_trucks}")
    print(f"👤 Total Drivers: {total_drivers}")
    print(f"📦 Total Loads: {total_loads}")
    print(f"📅 Load Date Range: June 1 - August 24, 2025 (12 weeks)")
    print("=" * 60)
    
    # Verify the regional manager can see all terminals
    print("\n🔍 Verifying regional manager access...")
    try:
        from companies.models import CustomUser
        user = CustomUser.objects.get(username='regional.manager')
        accessible_terminals = Terminal.objects.filter(
            department__division__company=user.company
        ).count()
        print(f"✅ Regional manager can access {accessible_terminals} terminals")
    except Exception as e:
        print(f"⚠️  Could not verify regional manager access: {e}")

if __name__ == '__main__':
    main()
