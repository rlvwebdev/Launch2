#!/usr/bin/env python
"""
Test the actual /api/terminals/ endpoint as the frontend would call it
"""
import os
import sys
import django
import json

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from django.test import Client
from companies.models import CustomUser
from rest_framework_simplejwt.tokens import AccessToken


def test_terminals_endpoint():
    """Test the /api/terminals/ endpoint as the frontend would call it"""
    
    try:
        # Get the test user
        user = CustomUser.objects.get(username='regional.manager')
        print(f"Testing API endpoint for user: {user.username}")
        
        # Generate a JWT token for the user
        token = AccessToken.for_user(user)
        print(f"Generated token: {str(token)[:50]}...")
        
        # Create a test client and make the API call
        client = Client()
        response = client.get(
            '/api/terminals/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        print(f"\nAPI Response:")
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.get('Content-Type', 'Not set')}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Response JSON:")
                print(f"Count: {len(data) if isinstance(data, list) else 'Not a list'}")
                
                if isinstance(data, list) and len(data) > 0:
                    print(f"\nFirst terminal structure:")
                    first_terminal = data[0]
                    print(json.dumps(first_terminal, indent=2, default=str))
                    
                    print(f"\nAll terminals:")
                    for i, terminal in enumerate(data):
                        print(f"{i+1}. {terminal.get('name')} ({terminal.get('code')})")
                        dept = terminal.get('department', {})
                        if isinstance(dept, dict):
                            print(f"   Department: {dept.get('name')}")
                            div = dept.get('division', {})
                            if isinstance(div, dict):
                                print(f"   Division: {div.get('name')}")
                                comp = div.get('company', {})
                                if isinstance(comp, dict):
                                    print(f"   Company: {comp.get('name')}")
                else:
                    print("No terminal data returned")
                    
            except json.JSONDecodeError as e:
                print(f"❌ Failed to parse JSON: {e}")
                print(f"Raw response: {response.content[:500]}")
        else:
            print(f"❌ API call failed")
            print(f"Response content: {response.content}")
        
        return response.status_code == 200
        
    except CustomUser.DoesNotExist:
        print("❌ User 'regional.manager' not found!")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    print("Testing /api/terminals/ endpoint...")
    success = test_terminals_endpoint()
    print(f"\n{'✅ Success' if success else '❌ Failed'}")
