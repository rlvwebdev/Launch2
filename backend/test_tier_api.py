"""
Quick test script to verify driver tier API functionality
"""
import requests
import json

# Test the drivers API endpoint
def test_drivers_api():
    url = "http://localhost:8000/api/drivers/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Total drivers returned: {len(data.get('results', []))}")
            
            # Check first few drivers for tier information
            drivers = data.get('results', [])[:5]
            
            print("\nDriver Tier Information (First 5 drivers):")
            print("-" * 60)
            
            for driver in drivers:
                name = f"{driver.get('firstName', '')} {driver.get('lastName', '')}"
                tier = driver.get('tier', 'None')
                years_exp = driver.get('yearsOfExperience', 'N/A')
                recommended = driver.get('recommendedTier', 'N/A')
                eligible = driver.get('isEligibleForPromotion', False)
                tier_display = driver.get('tierDisplayName', 'N/A')
                
                print(f"Name: {name}")
                print(f"  Current Tier: {tier}")
                print(f"  Display Name: {tier_display}")
                print(f"  Experience: {years_exp} years")
                print(f"  Recommended: {recommended}")
                print(f"  Promotion Eligible: {eligible}")
                print()
                
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
        print("Make sure Django server is running on port 8000")

if __name__ == "__main__":
    test_drivers_api()
