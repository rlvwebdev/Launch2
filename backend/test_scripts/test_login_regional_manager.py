#!/usr/bin/env python3
"""
Script to test login for regional manager user and get JWT token
"""

import requests
import json
import sys

def test_login():
    """Test login for regional manager user"""
    
    # Login credentials
    login_data = {
        'email': 'regional.manager@launchtransport.com',
        'password': 'password123'
    }
    
    try:
        print("🔐 Testing login for regional manager...")
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Login response status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Login successful!")
            print(f"Access token: {token_data.get('access', 'Not found')[:50]}...")
            print(f"Refresh token: {token_data.get('refresh', 'Not found')[:50]}...")
            
            # Test the token with user info endpoint
            access_token = token_data.get('access')
            if access_token:
                print("\n👤 Testing user info endpoint...")
                user_response = requests.get(
                    'http://localhost:8000/api/users/me/',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                
                print(f"User info response status: {user_response.status_code}")
                if user_response.status_code == 200:
                    user_data = user_response.json()
                    print("✅ User info retrieved!")
                    print(f"User: {user_data.get('first_name')} {user_data.get('last_name')}")
                    print(f"Email: {user_data.get('email')}")
                    print(f"Role: {user_data.get('role')}")
                    print(f"Company: {user_data.get('company_name')}")
                    print(f"Division: {user_data.get('division_name')}")
                    print(f"Department: {user_data.get('department_name')}")
                    print(f"Terminal: {user_data.get('terminal_name')}")
                else:
                    print(f"❌ User info failed: {user_response.text}")
                
                # Test terminals endpoint
                print("\n🏢 Testing terminals endpoint...")
                terminals_response = requests.get(
                    'http://localhost:8000/api/terminals/',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                
                print(f"Terminals response status: {terminals_response.status_code}")
                if terminals_response.status_code == 200:
                    terminals_data = terminals_response.json()
                    print(f"✅ Terminals retrieved! Count: {len(terminals_data)}")
                    for i, terminal in enumerate(terminals_data, 1):
                        print(f"  {i}. {terminal.get('name')} ({terminal.get('code')})")
                        dept = terminal.get('department', {})
                        if isinstance(dept, dict):
                            print(f"     Department: {dept.get('name')}")
                            div = dept.get('division', {})
                            if isinstance(div, dict):
                                print(f"     Division: {div.get('name')}")
                        else:
                            print(f"     Department ID: {dept}")
                else:
                    print(f"❌ Terminals failed: {terminals_response.text}")
            
            return token_data
            
        else:
            print(f"❌ Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during login test: {e}")
        return None

if __name__ == "__main__":
    test_login()
