#!/usr/bin/env python3
"""
Launch Transportation Management Platform
Load Data Generator

Generates realistic load data for all 27 terminals with:
- Load/PRO numbers starting at 4000000 (7+ digits)
- BOL numbers format: 9000000000-001
- October 1, 2025 through October 2026
- 20-45 loads per day per terminal
- Minimal open loads (only for high-volume terminals)
"""

import psycopg2
import random
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

# Database connection
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'launch_tms',
    'user': 'postgres',
    'password': 'postgres'
}

# Load generation parameters
START_DATE = datetime(2025, 10, 1)
END_DATE = datetime(2026, 10, 31)  # Through October 2026
MIN_LOADS_PER_DAY = 20
MAX_LOADS_PER_DAY = 45
STARTING_PRO_NUMBER = 4000000
STARTING_BOL_NUMBER = 9000000000

# Load statuses with weights (keeping open loads minimal)
LOAD_STATUSES = [
    ('delivered', 70),      # 70% delivered
    ('in_transit', 15),     # 15% in transit
    ('picked_up', 8),       # 8% picked up
    ('assigned', 4),        # 4% assigned
    ('planned', 2),         # 2% planned
    ('cancelled', 1),       # 1% cancelled
]

# Equipment types
EQUIPMENT_TYPES = [
    'dry_van', 'refrigerated', 'flatbed', 'step_deck', 'lowboy', 
    'tanker', 'hopper', 'container', 'car_carrier', 'heavy_haul'
]

# Cargo types
CARGO_TYPES = [
    'general_freight', 'food_grade', 'hazmat', 'automotive_parts',
    'machinery', 'electronics', 'textiles', 'pharmaceuticals',
    'construction_materials', 'chemicals', 'paper_products',
    'consumer_goods', 'raw_materials', 'finished_goods'
]

# US Cities for origin/destination
US_CITIES = [
    ("New York", "NY"), ("Los Angeles", "CA"), ("Chicago", "IL"),
    ("Houston", "TX"), ("Phoenix", "AZ"), ("Philadelphia", "PA"),
    ("San Antonio", "TX"), ("San Diego", "CA"), ("Dallas", "TX"),
    ("San Jose", "CA"), ("Austin", "TX"), ("Jacksonville", "FL"),
    ("Fort Worth", "TX"), ("Columbus", "OH"), ("Charlotte", "NC"),
    ("San Francisco", "CA"), ("Indianapolis", "IN"), ("Seattle", "WA"),
    ("Denver", "CO"), ("Washington", "DC"), ("Boston", "MA"),
    ("El Paso", "TX"), ("Nashville", "TN"), ("Detroit", "MI"),
    ("Oklahoma City", "OK"), ("Portland", "OR"), ("Las Vegas", "NV"),
    ("Memphis", "TN"), ("Louisville", "KY"), ("Baltimore", "MD"),
    ("Milwaukee", "WI"), ("Albuquerque", "NM"), ("Tucson", "AZ"),
    ("Fresno", "CA"), ("Sacramento", "CA"), ("Mesa", "AZ"),
    ("Kansas City", "MO"), ("Atlanta", "GA"), ("Long Beach", "CA"),
    ("Colorado Springs", "CO"), ("Raleigh", "NC"), ("Miami", "FL"),
    ("Virginia Beach", "VA"), ("Omaha", "NE"), ("Oakland", "CA"),
    ("Minneapolis", "MN"), ("Tulsa", "OK"), ("Arlington", "TX"),
    ("Tampa", "FL"), ("New Orleans", "LA"), ("Wichita", "KS")
]

def generate_pro_number(counter):
    """Generate PRO number starting from 4000000"""
    return STARTING_PRO_NUMBER + counter

def generate_bol_number(counter):
    """Generate BOL number in format 9000000000-001"""
    base_number = STARTING_BOL_NUMBER + (counter // 999)
    sequence = (counter % 999) + 1
    return f"{base_number}-{sequence:03d}"

def get_weighted_status(terminal_daily_load_count):
    """Get load status with minimal open loads unless high volume"""
    # If terminal has very high load count (>35 per day), allow more open loads
    if terminal_daily_load_count > 35:
        # High volume terminal - slightly more open loads
        statuses = [
            ('delivered', 65),
            ('in_transit', 18),
            ('picked_up', 10),
            ('assigned', 5),
            ('planned', 2)
        ]
    else:
        # Normal volume - minimal open loads
        statuses = [
            ('delivered', 75),
            ('in_transit', 12),
            ('picked_up', 8),
            ('assigned', 3),
            ('planned', 2)
        ]
    
    total_weight = sum(weight for _, weight in statuses)
    rand = random.randint(1, total_weight)
    
    cumulative_weight = 0
    for status, weight in statuses:
        cumulative_weight += weight
        if rand <= cumulative_weight:
            return status
    
    return 'delivered'  # fallback

def generate_dates(status, base_date):
    """Generate pickup and delivery dates based on status"""
    if status == 'planned':
        pickup_date = base_date + timedelta(days=random.randint(1, 7))
        delivery_date = pickup_date + timedelta(days=random.randint(1, 5))
        return pickup_date, delivery_date, None, None
    
    elif status == 'assigned':
        pickup_date = base_date + timedelta(days=random.randint(0, 3))
        delivery_date = pickup_date + timedelta(days=random.randint(1, 5))
        return pickup_date, delivery_date, None, None
    
    elif status == 'picked_up':
        pickup_date = base_date - timedelta(days=random.randint(0, 2))
        delivery_date = pickup_date + timedelta(days=random.randint(1, 4))
        actual_pickup = pickup_date + timedelta(hours=random.randint(0, 12))
        return pickup_date, delivery_date, actual_pickup, None
    
    elif status == 'in_transit':
        pickup_date = base_date - timedelta(days=random.randint(0, 3))
        delivery_date = pickup_date + timedelta(days=random.randint(1, 5))
        actual_pickup = pickup_date + timedelta(hours=random.randint(0, 12))
        return pickup_date, delivery_date, actual_pickup, None
    
    elif status == 'delivered':
        pickup_date = base_date - timedelta(days=random.randint(1, 14))
        delivery_date = pickup_date + timedelta(days=random.randint(1, 5))
        actual_pickup = pickup_date + timedelta(hours=random.randint(0, 12))
        actual_delivery = delivery_date + timedelta(hours=random.randint(-12, 12))
        return pickup_date, delivery_date, actual_pickup, actual_delivery
    
    elif status == 'cancelled':
        pickup_date = base_date + timedelta(days=random.randint(-7, 7))
        delivery_date = pickup_date + timedelta(days=random.randint(1, 5))
        return pickup_date, delivery_date, None, None
    
    return base_date, base_date + timedelta(days=1), None, None

def generate_load_data():
    """Generate comprehensive load data"""
    conn = None
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()        # Get terminals with their organizational structure (using the terminals table for now)
        cursor.execute("""
            SELECT t.id, t.name, t.code, t.department_id, cd.division_id 
            FROM terminals t
            LEFT JOIN companies_department cd ON t.department_id = cd.id
            ORDER BY t.id
        """)
        terminals = cursor.fetchall()
          # Get drivers
        cursor.execute("SELECT id FROM drivers_driver ORDER BY id")
        drivers = [row[0] for row in cursor.fetchall()]
        
        # Get trucks
        cursor.execute("SELECT id FROM vehicles_truck ORDER BY id")
        trucks = [row[0] for row in cursor.fetchall()]
        
        # Get trailers
        cursor.execute("SELECT id FROM vehicles_trailer ORDER BY id")
        trailers = [row[0] for row in cursor.fetchall()]
        
        print(f"Found {len(terminals)} terminals, {len(drivers)} drivers, {len(trucks)} trucks, {len(trailers)} trailers")
        
        load_counter = 0
        total_loads = 0
        
        # Generate loads for each day in the date range
        current_date = START_DATE
        while current_date <= END_DATE:
            print(f"Generating loads for {current_date.strftime('%Y-%m-%d')}")
            
            for terminal_id, terminal_name, terminal_code, department_id, division_id in terminals:
                # Determine daily load count for this terminal (20-45)
                daily_load_count = random.randint(MIN_LOADS_PER_DAY, MAX_LOADS_PER_DAY)
                
                # Generate loads for this terminal on this day
                for _ in range(daily_load_count):
                    load_counter += 1
                    total_loads += 1
                    
                    # Generate load details
                    pro_number = str(generate_pro_number(load_counter))
                    bol_number = generate_bol_number(load_counter)
                    status = get_weighted_status(daily_load_count)
                    
                    # Generate dates based on status
                    pickup_date, delivery_date, actual_pickup, actual_delivery = generate_dates(status, current_date)
                    
                    # Generate origin and destination
                    origin_city, origin_state = random.choice(US_CITIES)
                    dest_city, dest_state = random.choice(US_CITIES)
                    while dest_city == origin_city:  # Ensure different destination
                        dest_city, dest_state = random.choice(US_CITIES)
                    
                    # Generate cargo details
                    equipment_type = random.choice(EQUIPMENT_TYPES)
                    cargo_type = random.choice(CARGO_TYPES)
                    weight = random.randint(5000, 80000)  # 5k to 80k lbs
                    pieces = random.randint(1, 50)
                    
                    # Generate financial data
                    revenue = Decimal(str(random.uniform(800, 5000))).quantize(Decimal('0.01'))
                    fuel_cost = Decimal(str(random.uniform(200, 800))).quantize(Decimal('0.01'))
                    driver_pay = Decimal(str(random.uniform(300, 1200))).quantize(Decimal('0.01'))
                    
                    # Assign equipment (not all loads need all equipment)
                    assigned_driver = random.choice(drivers) if random.random() > 0.1 else None
                    assigned_truck = random.choice(trucks) if random.random() > 0.1 else None
                    assigned_trailer = random.choice(trailers) if random.random() > 0.15 else None                    # Insert load record
                    load_id = str(uuid.uuid4())
                    terminal_uuid = str(uuid.uuid4())  # Generate UUID for terminal
                    cursor.execute("""
                        INSERT INTO loads (
                            id, load_number, reference_number, customer_name, customer_contact,
                            customer_phone, customer_email,
                            origin_name, origin_address_city, origin_address_state, origin_address_zip,
                            destination_name, destination_address_city, destination_address_state, destination_address_zip,
                            pickup_date, delivery_date, picked_up_at, delivered_at,
                            commodity, weight, pieces, equipment_type, special_requirements,
                            rate, fuel_surcharge, total_amount,                            assigned_driver_id, assigned_truck_id, assigned_trailer_id,
                            terminal_id, status, company_id, is_active, is_deleted
                        ) VALUES (
                            %s, %s, %s, %s, %s,
                            %s, %s,
                            %s, %s, %s, %s,
                            %s, %s, %s, %s,
                            %s, %s, %s, %s,
                            %s, %s, %s, %s, %s,
                            %s, %s, %s,                            %s, %s, %s,
                            %s, %s, %s, %s, %s
                        )
                    """, (
                        load_id, pro_number, bol_number, f"Customer {load_counter % 100 + 1}", f"Contact Person {load_counter % 50 + 1}",
                        f"555-{random.randint(100,999)}-{random.randint(1000,9999)}", f"contact{load_counter % 100 + 1}@company.com",
                        f"{origin_city} Shipper", origin_city, origin_state, f"{random.randint(10000, 99999)}",
                        f"{dest_city} Receiver", dest_city, dest_state, f"{random.randint(10000, 99999)}",
                        pickup_date, delivery_date, actual_pickup, actual_delivery,
                        f"{cargo_type.replace('_', ' ').title()}", weight, pieces, equipment_type,
                        f"Handle with care - {equipment_type.replace('_', ' ').title()}",
                        revenue, fuel_cost, revenue + fuel_cost,                        assigned_driver, assigned_truck, assigned_trailer,
                        terminal_uuid, status, "0fbc81c8-4378-4b42-adba-8eca3c7b0831", True, False
                    ))
                    
                    # Commit every 100 loads for performance
                    if total_loads % 100 == 0:
                        conn.commit()
                        print(f"  Generated {total_loads} loads...")
            
            current_date += timedelta(days=1)
        
        # Final commit
        conn.commit()
        
        # Generate summary
        cursor.execute("""
            SELECT status, COUNT(*) as count 
            FROM loads 
            GROUP BY status 
            ORDER BY count DESC
        """)
        status_counts = cursor.fetchall()
        
        print(f"\n✅ Load Generation Complete!")
        print(f"Total loads generated: {total_loads:,}")
        print(f"Date range: {START_DATE.strftime('%Y-%m-%d')} to {END_DATE.strftime('%Y-%m-%d')}")
        print(f"PRO numbers: {STARTING_PRO_NUMBER:,} to {STARTING_PRO_NUMBER + load_counter:,}")
        print(f"BOL numbers: {generate_bol_number(1)} to {generate_bol_number(load_counter)}")
        
        print(f"\nLoad Status Distribution:")
        for status, count in status_counts:
            percentage = (count / total_loads) * 100
            print(f"  {status.replace('_', ' ').title()}: {count:,} ({percentage:.1f}%)")
        
        # Terminal distribution
        cursor.execute("""
            SELECT t.name, t.code, COUNT(l.id) as load_count
            FROM terminals t
            LEFT JOIN loads l ON t.id = l.terminal_id
            GROUP BY t.id, t.name, t.code
            ORDER BY load_count DESC
            LIMIT 10
        """)
        terminal_counts = cursor.fetchall()
        
        print(f"\nTop 10 Terminals by Load Count:")
        for name, code, count in terminal_counts:
            print(f"  {name} ({code}): {count:,} loads")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error generating loads: {e}")
        if conn:
            try:
                conn.rollback()
                conn.close()
            except:
                pass

if __name__ == "__main__":
    print("🚛 Launch TMS - Load Data Generator")
    print("=" * 50)
    
    # Confirm before generating large dataset
    response = input(f"Generate loads for {len(US_CITIES)} cities across 27 terminals from Oct 2025 to Oct 2026? (y/N): ")
    if response.lower() != 'y':
        print("Load generation cancelled.")
        exit()
    
    generate_load_data()
