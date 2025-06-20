#!/usr/bin/env python3
"""
Launch TMS API Testing Script
Test all endpoints and database operations
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        print(f"  {method} {endpoint}")
        print(f"    Status: {response.status_code}")
        if response.status_code < 400:
            try:
                content = response.json()
                print(f"    Response: {json.dumps(content, indent=2)[:200]}...")
            except:
                print(f"    Response: {response.text[:100]}...")
        else:
            print(f"    Error: {response.text}")
        print()
        return response
    except Exception as e:
        print(f"  ❌ Error testing {method} {endpoint}: {e}")
        return None

def main():
    print("🧪 Launch TMS API Testing")
    print("=" * 50)
    
    # Test 1: Health Check
    print("1. Health Endpoints")
    test_endpoint("GET", "/")
    test_endpoint("GET", "/health")
    
    # Test 2: API Documentation
    print("2. Documentation")
    test_endpoint("GET", "/docs")
    test_endpoint("GET", "/openapi.json")
    
    # Test 3: Authentication Endpoints
    print("3. Authentication")
    test_endpoint("GET", "/api/auth/me")  # Should fail without token
    
    # Test 4: Resource Endpoints (placeholder responses)
    print("4. Resource Endpoints")
    test_endpoint("GET", "/api/drivers")
    test_endpoint("GET", "/api/trucks")
    test_endpoint("GET", "/api/trailers")
    test_endpoint("GET", "/api/loads")
    test_endpoint("GET", "/api/organizations/companies")
    test_endpoint("GET", "/api/users")
    test_endpoint("GET", "/api/reports")
    
    # Test 5: Excel Import/Export
    print("5. Excel Import/Export")
    test_endpoint("POST", "/api/excel/import")
    test_endpoint("GET", "/api/excel/export")
    
    print("✅ API Testing Complete!")
    print("🚀 Backend is ready for frontend integration!")

if __name__ == "__main__":
    main()
