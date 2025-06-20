#!/usr/bin/env python3
"""
Simple database connection test
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("🔌 Testing PostgreSQL connection...")

try:
    from app.database import engine, Base
    from app.models import *
    
    print("📋 Models imported successfully")
      # Test connection
    from sqlalchemy import text
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.fetchone()[0]
        print(f"✅ Connected to PostgreSQL: {version[:50]}...")
    
    print("🏗️  Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # List tables
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """))
        tables = [row[0] for row in result.fetchall()]
        print(f"📊 Created {len(tables)} tables:")
        for table in tables:
            print(f"   - {table}")
    
    print("\n🎉 Database setup complete!")
    print("🚀 Ready to start the FastAPI server!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
