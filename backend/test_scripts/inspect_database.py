#!/usr/bin/env python3
"""
Inspect database tables to understand the schema
"""
import psycopg2
from psycopg2.extras import RealDictCursor

def inspect_database():
    """Inspect database tables"""
    try:
        # Connect to database
        conn = psycopg2.connect(
            host="localhost",
            database="launch_tms",
            user="postgres",
            password="password"
        )
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get all tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        tables = cur.fetchall()
        print("📋 Database Tables:")
        for table in tables:
            print(f"   - {table['table_name']}")
        
        # Check companies table structure
        print("\n📋 Companies Table Structure:")
        cur.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'companies'
            ORDER BY ordinal_position
        """)
        
        columns = cur.fetchall()
        for col in columns:
            nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
            print(f"   - {col['column_name']}: {col['data_type']} {nullable}")
        
        # Check users table structure
        print("\n📋 Users Table Structure:")
        cur.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
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
    inspect_database()
