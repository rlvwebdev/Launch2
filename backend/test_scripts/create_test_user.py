#!/usr/bin/env python3
"""
Create a test user for API development and testing
"""
import os
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

# Add the app directory to the path
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.models.user import User, UserRole
from app.models.company import Company
from app.routers.auth import get_password_hash

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/launch_tms')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_test_data():
    """Create test user and company data"""
    db = SessionLocal()
    
    try:
        # Create test company
        test_company = db.query(Company).filter(Company.code == "TEST").first()
        if not test_company:
            test_company = Company(
                id=str(uuid.uuid4()),
                name="Test Company",
                code="TEST",
                address_street="123 Test St",
                address_city="Test City",
                address_state="TX",
                address_zip="12345",
                phone="555-123-4567",
                email="test@testcompany.com",
                is_active=True
            )
            db.add(test_company)
            db.commit()
            db.refresh(test_company)
            print(f"✅ Created test company: {test_company.name}")
        else:
            print(f"📋 Test company already exists: {test_company.name}")
        
        # Create user role
        user_role = db.query(UserRole).filter(UserRole.code == "admin").first()
        if not user_role:
            user_role = UserRole(
                id=str(uuid.uuid4()),
                name="Administrator",
                code="admin",
                description="Full system access",
                permissions=["*"]
            )
            db.add(user_role)
            db.commit()
            db.refresh(user_role)
            print(f"✅ Created admin role: {user_role.name}")
        else:
            print(f"📋 Admin role already exists: {user_role.name}")
        
        # Create test user
        test_user = db.query(User).filter(User.email == "test@launch.com").first()
        if not test_user:
            test_user = User(
                id=str(uuid.uuid4()),
                email="test@launch.com",
                password_hash=get_password_hash("password"),
                first_name="Test",
                last_name="User",
                phone="555-123-4567",
                company_id=test_company.id,
                role_id=user_role.id,
                is_active=True,
                is_verified=True
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✅ Created test user: {test_user.email}")
        else:
            print(f"📋 Test user already exists: {test_user.email}")
        
        print("\n🚀 Test data created successfully!")
        print("\n📋 Test credentials:")
        print(f"   Email: test@launch.com")
        print(f"   Password: password")
        print(f"   Company: {test_company.name} ({test_company.code})")
        
    except Exception as e:
        print(f"❌ Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
