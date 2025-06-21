#!/usr/bin/env python3

import requests
import json

def test_api():    # Login to get a fresh token
    response = requests.post('http://localhost:8000/api/auth/login/', json={
        'email': 'regional.manager@launchtransport.com',
        'password': 'password123'
    })

    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data['access']
        print(f'✅ Login successful')
        print(f'Access token: {access_token[:50]}...')
        
        # Test the drivers API
        headers = {'Authorization': f'Bearer {access_token}'}
        drivers_response = requests.get('http://localhost:8000/api/drivers/', headers=headers)
        
        if drivers_response.status_code == 200:
            drivers_data = drivers_response.json()
            print(f'✅ Drivers API successful')
            print(f'Drivers count: {drivers_data.get("count", 0)}')
            print(f'Results length: {len(drivers_data.get("results", []))}')
            if drivers_data.get('results'):
                print('\n📋 First driver sample:')
                first_driver = drivers_data['results'][0]
                print(json.dumps(first_driver, indent=2))
                
                print('\n🔍 Driver fields analysis:')
                for key, value in first_driver.items():
                    print(f'  {key}: {type(value).__name__} = {value}')
        else:
            print(f'❌ Drivers request failed: {drivers_response.status_code}')
            print(drivers_response.text)
            
        # Test trucks API
        trucks_response = requests.get('http://localhost:8000/api/trucks/', headers=headers)
        
        if trucks_response.status_code == 200:
            trucks_data = trucks_response.json()
            print(f'\n✅ Trucks API successful')
            print(f'Trucks count: {trucks_data.get("count", 0)}')
            print(f'Results length: {len(trucks_data.get("results", []))}')
        else:
            print(f'❌ Trucks request failed: {trucks_response.status_code}')
            
        # Test loads API
        loads_response = requests.get('http://localhost:8000/api/loads/', headers=headers)
        
        if loads_response.status_code == 200:
            loads_data = loads_response.json()
            print(f'\n✅ Loads API successful')
            print(f'Loads count: {loads_data.get("count", 0)}')
            print(f'Results length: {len(loads_data.get("results", []))}')
        else:
            print(f'❌ Loads request failed: {loads_response.status_code}')
            
    else:
        print(f'❌ Login failed: {response.status_code}')
        print(response.text)

if __name__ == '__main__':
    test_api()
