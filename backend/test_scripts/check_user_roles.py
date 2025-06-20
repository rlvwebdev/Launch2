#!/usr/bin/env python3
"""
Check user_roles table structure
"""
import psycopg2
from psycopg2.extras import RealDictCursor

def check_user_roles():
    """Check user_roles table structure"""
    try:
        # Connect to database
        conn = psycopg2.connect(
            host="localhost",
            database="launch_tms",
            user="postgres",
            password="password"
        )
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check user_roles table structure
        print("📋 User Roles Table Structure:")
        cur.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'user_roles'
            ORDER BY ordinal_position
        """)
        
        columns = cur.fetchall()
        for col in columns:
            nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
            print(f"   - {col['column_name']}: {col['data_type']} {nullable}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_user_roles()
