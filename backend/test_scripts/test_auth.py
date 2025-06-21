#!/usr/bin/env python3
"""
Test API authentication and endpoints
"""
import requests
import json

API_BASE_URL = 'http://localhost:8000/api'

def test_login():
    """Test user login"""
    print("🔐 Testing user login...")
    
    login_data = {
        "email": "admin@launch.com",
        "password": "admin123"
    }    
    response = requests.post(f"{API_BASE_URL}/auth/login/", json=login_data)
    
    if response.status_code == 200:
        token_data = response.json()
        print("✅ Login successful!")
        print(f"   Response: {json.dumps(token_data, indent=2)}")
        
        # Check what key contains the token
        if 'access' in token_data:
            token = token_data['access']
            print(f"   Token: {token[:20]}...")
        elif 'access_token' in token_data:
            token = token_data['access_token']
            print(f"   Token: {token[:20]}...")
        else:
            print("   No token found in response")
            return None
            
        return token
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return None

def test_authenticated_endpoints(token):
    """Test authenticated endpoints"""
    print("\n🔒 Testing authenticated endpoints...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
      # Test /me endpoint
    print("\n1. Testing /users/me endpoint...")
    response = requests.get(f"{API_BASE_URL}/users/me/", headers=headers)
    if response.status_code == 200:
        user_info = response.json()
        print("✅ /users/me successful!")
        print(f"   User: {user_info['first_name']} {user_info['last_name']}")
        print(f"   Email: {user_info['email']}")
        print(f"   Role: {user_info['role']}")
        print(f"   Company: {user_info['company']}")
    else:
        print(f"❌ /users/me failed: {response.status_code}")
        print(f"   Error: {response.text}")
    
    # Test trucks endpoint
    print("\n2. Testing /trucks endpoint...")
    response = requests.get(f"{API_BASE_URL}/trucks/", headers=headers)
    if response.status_code == 200:
        trucks = response.json()
        print("✅ /trucks successful!")
        print(f"   Number of trucks: {len(trucks)}")
    else:
        print(f"❌ /trucks failed: {response.status_code}")
        print(f"   Error: {response.text}")
      # Test drivers endpoint
    print("\n3. Testing /drivers endpoint...")
    response = requests.get(f"{API_BASE_URL}/drivers/", headers=headers)
    if response.status_code == 200:
        drivers = response.json()
        print("✅ /drivers successful!")
        print(f"   Number of drivers: {len(drivers)}")
    else:
        print(f"❌ /drivers failed: {response.status_code}")
        print(f"   Error: {response.text}")
    
    # Test organizations endpoint
    print("\n4. Testing /organizations/hierarchy endpoint...")
    response = requests.get(f"{API_BASE_URL}/organizations/hierarchy/", headers=headers)
    if response.status_code == 200:
        organizations = response.json()
        print("✅ /organizations/hierarchy successful!")
        print(f"   Number of organizations: {len(organizations)}")
        if len(organizations) > 0:
            print(f"   First org: {organizations[0]['name']} ({organizations[0]['type']})")
    else:
        print(f"❌ /organizations/hierarchy failed: {response.status_code}")
        print(f"   Error: {response.text}")

def main():
    """Main test function"""
    print("🚀 Launch TMS API Authentication Test")
    print("="*50)
    
    # Test login
    token = test_login()
    
    if token:
        # Test authenticated endpoints
        test_authenticated_endpoints(token)
        
        print("\n✅ API authentication test completed successfully!")
    else:
        print("\n❌ API authentication test failed!")

if __name__ == "__main__":
    main()
