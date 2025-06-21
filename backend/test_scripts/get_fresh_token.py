#!/usr/bin/env python3
"""
Simple test to see exact terminal data structure and get fresh token
"""

import requests
import json

def test_terminals_data():
    """Get and display exact terminal data"""
    
    # First login
    login_data = {
        'email': 'regional.manager@launchtransport.com',
        'password': 'password123'
    }
    
    login_response = requests.post(
        'http://localhost:8000/api/auth/login/',
        json=login_data
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.text}")
        return
    
    token_data = login_response.json()
    access_token = token_data.get('access')
    
    print(f"✅ Access token: {access_token}")
    
    # Get terminals data
    terminals_response = requests.get(
        'http://localhost:8000/api/terminals/',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    print(f"Status: {terminals_response.status_code}")
    
    if terminals_response.status_code == 200:
        terminals_data = terminals_response.json()
        print(f"Raw response type: {type(terminals_data)}")
        print(f"Terminal count: {terminals_data.get('count', 'unknown')}")
        print(f"Results array length: {len(terminals_data.get('results', []))}")
    else:
        print(f"Error: {terminals_response.text}")

if __name__ == "__main__":
    test_terminals_data()
