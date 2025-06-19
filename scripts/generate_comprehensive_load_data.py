#!/usr/bin/env python3
"""
Generate comprehensive load data for Launch Transportation Management Platform
Creates realistic load data spanning 5 weeks with proper status distributions
"""

import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Configuration
WEEKS_PAST = 2
WEEKS_FUTURE = 2
LOADS_PER_DAY_MIN = 8
LOADS_PER_DAY_MAX = 15

# Shipper companies (realistic mix of small, medium, large customers)
SHIPPERS = [
    # Large customers (frequent loads)
    "Walmart Distribution", "Amazon Logistics", "Target Supply Chain", "Home Depot Freight", 
    "Costco Wholesale", "FedEx Ground", "UPS Supply Chain", "Sysco Food Services",
    
    # Medium customers (regular loads)
    "ABC Manufacturing", "Delta Electronics", "Summit Automotive", "Pacific Foods Inc",
    "Metro Building Supply", "Central Chemical Co", "Riverside Metals", "Highland Plastics",
    "Crown Packaging", "Atlas Materials", "Phoenix Industries", "Apex Distribution",
    
    # Small customers (occasional loads)
    "City Hardware Store", "Regional Auto Parts", "Local Food Distributors", "Corner Market Chain",
    "Valley Equipment Rental", "Suburban Furniture Co", "County Supply House", "District Electronics",
    "Township Materials", "Borough Tool & Die", "Village Appliance Center", "Hamlet Industries"
]

# Major cities and states for realistic routes
LOCATIONS = [
    {"city": "Los Angeles", "state": "CA", "zipCode": "90210"},
    {"city": "Chicago", "state": "IL", "zipCode": "60601"},
    {"city": "Houston", "state": "TX", "zipCode": "77001"},
    {"city": "Phoenix", "state": "AZ", "zipCode": "85001"},
    {"city": "Philadelphia", "state": "PA", "zipCode": "19101"},
    {"city": "San Antonio", "state": "TX", "zipCode": "78201"},
    {"city": "San Diego", "state": "CA", "zipCode": "92101"},
    {"city": "Dallas", "state": "TX", "zipCode": "75201"},
    {"city": "San Jose", "state": "CA", "zipCode": "95101"},
    {"city": "Austin", "state": "TX", "zipCode": "73301"},
    {"city": "Jacksonville", "state": "FL", "zipCode": "32099"},
    {"city": "Fort Worth", "state": "TX", "zipCode": "76101"},
    {"city": "Columbus", "state": "OH", "zipCode": "43085"},
    {"city": "Charlotte", "state": "NC", "zipCode": "28202"},
    {"city": "San Francisco", "state": "CA", "zipCode": "94102"},
    {"city": "Indianapolis", "state": "IN", "zipCode": "46201"},
    {"city": "Seattle", "state": "WA", "zipCode": "98101"},
    {"city": "Denver", "state": "CO", "zipCode": "80014"},
    {"city": "Boston", "state": "MA", "zipCode": "02108"},
    {"city": "Nashville", "state": "TN", "zipCode": "37011"},
]

# Cargo types
CARGO_TYPES = [
    "General Freight", "Electronics", "Food Products", "Automotive Parts", "Building Materials",
    "Chemicals", "Machinery", "Textiles", "Paper Products", "Metal Products", "Pharmaceuticals",
    "Consumer Goods", "Industrial Equipment", "Agricultural Products", "Plastics"
]

# Driver and truck IDs (from existing demo data)
DRIVER_IDS = [
    "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10",
    "d11", "d12", "d13", "d14", "d15", "d16", "d17", "d18", "d19", "d20"
]

TRUCK_IDS = [
    "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10",
    "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20",
    "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30"
]

def get_load_status_for_date(load_date: datetime, pickup_date: datetime, delivery_date: datetime) -> str:
    """Determine realistic load status based on dates"""
    now = datetime.now()
    
    # Past loads (delivered or in transit if very recent)
    if delivery_date < now - timedelta(days=1):
        return "delivered"
    elif pickup_date < now - timedelta(days=1) and delivery_date > now - timedelta(days=1):
        return random.choice(["delivered", "in-transit", "delivering"])
    
    # Current week loads
    elif now - timedelta(days=7) <= pickup_date <= now + timedelta(days=7):
        if pickup_date < now:
            # Already picked up
            if delivery_date < now:
                return "delivered"
            else:
                return random.choice(["in-transit", "delivering", "delivered"])
        else:
            # Future pickup in current week
            # Very few open loads (1-2 per day max)
            if random.random() < 0.15:  # 15% chance of being open
                return random.choice(["pending", "assigned"])
            else:
                return "assigned"
    
    # Future loads (beyond current week) - should be pending, not open
    else:
        return "pending"

def generate_load_number(date: datetime, sequence: int) -> str:
    """Generate realistic load number"""
    return f"LD{date.strftime('%y%m%d')}{sequence:03d}"

def generate_bol_number() -> str:
    """Generate realistic BOL number"""
    return f"BOL{random.randint(100000, 999999)}"

def calculate_rate(distance_miles: float) -> float:
    """Calculate realistic rate based on distance"""
    base_rate = 2.50  # Base rate per mile
    min_rate = 500    # Minimum load rate
    
    rate = distance_miles * base_rate
    # Add some variance
    variance = random.uniform(0.8, 1.3)
    rate *= variance
    
    return max(min_rate, round(rate, 2))

def calculate_distance(pickup: Dict, delivery: Dict) -> float:
    """Rough distance calculation (simplified)"""
    # This is a very rough approximation for demo purposes
    lat_diff = abs(hash(pickup["city"]) % 50 - hash(delivery["city"]) % 50)
    lng_diff = abs(hash(pickup["state"]) % 50 - hash(delivery["state"]) % 50)
    
    # Rough distance in miles
    distance = ((lat_diff ** 2 + lng_diff ** 2) ** 0.5) * 25
    return max(100, min(2500, distance))  # Keep between 100-2500 miles

def generate_load_events(load_id: str, status: str, pickup_date: datetime) -> List[Dict]:
    """Generate realistic load events"""
    events = []
    
    # Only add events for loads that have started
    if pickup_date > datetime.now():
        return events
      # Occasional events (10% chance)
    if random.random() < 0.1:
        event_types = ["delay", "inspection", "other"]
        if random.random() < 0.05:  # 5% chance of serious events
            event_types.extend(["accident", "damage"])
        
        event_type = random.choice(event_types)
        severities = ["low", "medium"] if event_type in ["delay", "inspection", "other"] else ["medium", "high"]
        
        events.append({
            "id": f"evt_{load_id}_{random.randint(1000, 9999)}",
            "loadId": load_id,
            "type": event_type,
            "description": f"Load event: {event_type}",
            "timestamp": (pickup_date + timedelta(hours=random.randint(1, 48))).isoformat(),
            "reportedBy": random.choice(DRIVER_IDS),
            "severity": random.choice(severities),
            "resolved": random.choice([True, False]) if event_type != "other" else True,
            "resolvedAt": (pickup_date + timedelta(hours=random.randint(2, 72))).isoformat() if random.random() > 0.3 else None,
            "notes": f"Event reported during transit - {event_type}"
        })
    
    return events

def generate_comprehensive_loads() -> List[Dict[str, Any]]:
    """Generate comprehensive load data for 5 weeks"""
    loads = []
    load_counter = 1
    
    # Generate date range: 2 weeks past + current week + 2 weeks future
    start_date = datetime.now() - timedelta(weeks=WEEKS_PAST)
    end_date = datetime.now() + timedelta(weeks=WEEKS_FUTURE)
    
    current_date = start_date
    
    while current_date <= end_date:
        # Generate 8-15 loads per day
        daily_loads = random.randint(LOADS_PER_DAY_MIN, LOADS_PER_DAY_MAX)
        
        for i in range(daily_loads):
            pickup_location = random.choice(LOCATIONS)
            delivery_location = random.choice([loc for loc in LOCATIONS if loc != pickup_location])
            
            # Pickup and delivery dates
            pickup_date = current_date + timedelta(hours=random.randint(6, 18))
            delivery_date = pickup_date + timedelta(days=random.randint(1, 4), hours=random.randint(1, 12))
            
            # Calculate distance and rate
            distance = calculate_distance(pickup_location, delivery_location)
            rate = calculate_rate(distance)
            
            # Determine status
            status = get_load_status_for_date(current_date, pickup_date, delivery_date)
            
            load_id = f"load_{load_counter:04d}"
            load_number = generate_load_number(current_date, i + 1)
            
            # Weight shipper selection (larger companies get more loads)
            shipper_weights = [3 if i < 8 else 2 if i < 20 else 1 for i in range(len(SHIPPERS))]
            shipper = random.choices(SHIPPERS, weights=shipper_weights)[0]
            
            load = {
                "id": load_id,
                "loadNumber": load_number,
                "bolNumber": generate_bol_number(),
                "shipper": shipper,
                "receiver": random.choice(SHIPPERS),
                "pickupLocation": {
                    "address": f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Pine', 'Center', 'First', 'Second'])} St",
                    "city": pickup_location["city"],
                    "state": pickup_location["state"],
                    "zipCode": pickup_location["zipCode"],
                    "coordinates": {
                        "lat": 40.7128 + random.uniform(-10, 10),
                        "lng": -74.0060 + random.uniform(-20, 20)
                    }
                },
                "deliveryLocation": {
                    "address": f"{random.randint(100, 9999)} {random.choice(['Industrial', 'Commerce', 'Business', 'Trade', 'Logistics'])} Blvd",
                    "city": delivery_location["city"],
                    "state": delivery_location["state"],
                    "zipCode": delivery_location["zipCode"],
                    "coordinates": {
                        "lat": 40.7128 + random.uniform(-10, 10),
                        "lng": -74.0060 + random.uniform(-20, 20)
                    }
                },
                "assignedDriverId": random.choice(DRIVER_IDS) if status != "pending" else None,
                "assignedTruckId": random.choice(TRUCK_IDS) if status != "pending" else None,
                "status": status,
                "cargoDescription": random.choice(CARGO_TYPES),
                "weight": random.randint(5000, 80000),
                "distance": round(distance, 1),
                "pickupDate": pickup_date.isoformat(),
                "deliveryDate": delivery_date.isoformat(),
                "rate": rate,
                "notes": f"Load {load_number} - {random.choice(['Standard freight', 'Priority delivery', 'Express service', 'Regular transport'])}",
                "specialInstructions": random.choice([None, "Handle with care", "Temperature controlled", "Hazmat certified driver required", "Appointment required"]) if random.random() < 0.3 else None,
                "hazmat": random.random() < 0.05,  # 5% hazmat loads
                "events": generate_load_events(load_id, status, pickup_date),
                "createdAt": (current_date - timedelta(days=random.randint(1, 30))).isoformat(),
                "updatedAt": pickup_date.isoformat(),
                "organizationalContext": {
                    "companyId": "comp_001",
                    "divisionId": "div_001", 
                    "departmentId": "dept_logistics"
                }
            }
            
            loads.append(load)
            load_counter += 1
        
        current_date += timedelta(days=1)
    
    return loads

def main():
    """Generate and save comprehensive load data"""
    print("🚀 Generating comprehensive load data for Launch Transportation Platform...")
    print(f"📅 Date range: {WEEKS_PAST} weeks past + current week + {WEEKS_FUTURE} weeks future")
    print(f"📦 Loads per day: {LOADS_PER_DAY_MIN}-{LOADS_PER_DAY_MAX}")
    
    # Generate loads
    loads = generate_comprehensive_loads()
    
    print(f"✅ Generated {len(loads)} loads")
    
    # Calculate statistics
    status_counts = {}
    shipper_counts = {}
    
    for load in loads:
        status = load['status']
        shipper = load['shipper']
        
        status_counts[status] = status_counts.get(status, 0) + 1
        shipper_counts[shipper] = shipper_counts.get(shipper, 0) + 1
    
    print("\n📊 Load Status Distribution:")
    for status, count in sorted(status_counts.items()):
        print(f"  {status}: {count} loads")
    
    print(f"\n🏢 Top 5 Shippers:")
    top_shippers = sorted(shipper_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    for shipper, count in top_shippers:
        print(f"  {shipper}: {count} loads")
    
    # Save to file
    output_file = "comprehensive_loads_data.json"
    with open(output_file, 'w') as f:
        json.dump(loads, f, indent=2)
    
    print(f"\n💾 Data saved to: {output_file}")
    print(f"📁 File size: {len(json.dumps(loads, indent=2)) / 1024:.1f} KB")
    
    print("\n🔧 Next steps:")
    print("1. Copy this data to your DataContext or import mechanism")
    print("2. Test the reports page with the new comprehensive data")
    print("3. Verify chart functionality across different date ranges")
    
    return loads

if __name__ == "__main__":
    main()
