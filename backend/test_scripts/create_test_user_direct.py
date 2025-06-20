#!/usr/bin/env python3
"""
Test database connection and create test user directly
"""
import os
import sys
import uuid
from datetime import datetime, timezone

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

import psycopg2
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_test_user_direct():
    """Create test user directly in database"""
    try:
        # Connect to database
        conn = psycopg2.connect(
            host="localhost",
            database="launch_tms",
            user="postgres",
            password="password"
        )
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
          # Create test company
        company_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO companies (id, name, code, address_street, address_city, address_state, address_zip, contact_phone, contact_email, is_active, created_at, updated_at, is_deleted)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (code) DO NOTHING
        """, (
            company_id, "Test Company", "TEST", "123 Test St", "Test City", "TX", "12345",
            "555-123-4567", "test@testcompany.com", True, datetime.now(timezone.utc), datetime.now(timezone.utc), False
        ))
        
        # Get company ID if it already exists
        cur.execute("SELECT id FROM companies WHERE code = %s", ("TEST",))
        company_result = cur.fetchone()
        if company_result:
            company_id = company_result['id']        # Create user role
        role_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO user_roles (id, name, code, description, is_system_role, is_active, created_at, updated_at, is_deleted)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (code) DO NOTHING
        """, (
            role_id, "Administrator", "admin", "Full system access", True, True, datetime.now(timezone.utc), datetime.now(timezone.utc), False
        ))
        
        # Get role ID if it already exists
        cur.execute("SELECT id FROM user_roles WHERE code = %s", ("admin",))
        role_result = cur.fetchone()
        if role_result:
            role_id = role_result['id']
          # Create test user
        user_id = str(uuid.uuid4())
        password_hash = get_password_hash("password")
        
        cur.execute("""
            INSERT INTO users (id, email, password_hash, first_name, last_name, phone, company_id, role_id, is_active, is_verified, created_at, updated_at, is_deleted)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (email) DO UPDATE SET
                password_hash = EXCLUDED.password_hash,
                updated_at = EXCLUDED.updated_at
        """, (
            user_id, "test@launch.com", password_hash, "Test", "User", "555-123-4567",
            company_id, role_id, True, True, datetime.now(timezone.utc), datetime.now(timezone.utc), False
        ))
        
        conn.commit()
        
        print("✅ Test data created successfully!")
        print("\n📋 Test credentials:")
        print(f"   Email: test@launch.com")
        print(f"   Password: password")
        print(f"   Company: Test Company (TEST)")
        
        # Verify the user was created
        cur.execute("""
            SELECT u.email, u.first_name, u.last_name, c.name as company_name, r.name as role_name
            FROM users u
            JOIN companies c ON u.company_id = c.id
            JOIN user_roles r ON u.role_id = r.id
            WHERE u.email = %s
        """, ("test@launch.com",))
        
        user_info = cur.fetchone()
        if user_info:
            print(f"\n✅ User verification:")
            print(f"   User: {user_info['first_name']} {user_info['last_name']}")
            print(f"   Email: {user_info['email']}")
            print(f"   Company: {user_info['company_name']}")
            print(f"   Role: {user_info['role_name']}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_test_user_direct()
