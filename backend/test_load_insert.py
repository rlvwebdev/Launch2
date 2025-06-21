#!/usr/bin/env python3
import psycopg2

# Test simple load insertion
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'launch_tms',
    'user': 'postgres',
    'password': 'postgres'
}

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()    # Simple test insert
    cursor.execute("""
        INSERT INTO loads (
            id, load_number, customer_name, 
            origin_name, destination_name,
            company_id, is_active, is_deleted
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        "550e8400-e29b-41d4-a716-446655440001", "4000001", "Test Customer",
        "Test Origin", "Test Destination", 
        "0fbc81c8-4378-4b42-adba-8eca3c7b0831", True, False
    ))
    
    conn.commit()
    print("✅ Test load inserted successfully!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
