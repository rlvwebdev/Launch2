#!/usr/bin/env python
"""
Debug terminal API response for regional.manager user
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import Terminal, CustomUser
from companies.serializers import TerminalSerializer
from rest_framework.test import APIRequestFactory, force_authenticate
from companies.views import TerminalViewSet


def debug_terminal_api():
    """Debug what terminals the API returns for regional.manager"""
    
    try:
        # Get the test user
        user = CustomUser.objects.get(username='regional.manager')
        print(f"User: {user.username} ({user.email})")
        print(f"Role: {user.role}")
        print(f"Company: {user.company.name if user.company else 'None'}")
        print(f"Division: {user.division.name if user.division else 'None'}")
        print(f"Department: {user.department.name if user.department else 'None'}")
        print(f"Terminal: {user.terminal.name if user.terminal else 'None'}")
          # Test the ViewSet directly
        factory = APIRequestFactory()
        request = factory.get('/api/terminals/')
        request.user = user  # Set the user directly on the request
        
        # Create viewset and get queryset
        viewset = TerminalViewSet()
        viewset.request = request
        queryset = viewset.get_queryset()
        
        print(f"\nTerminals from ViewSet queryset ({queryset.count()}):")
        for terminal in queryset:
            print(f"  - {terminal.name} ({terminal.code})")
            print(f"    Department: {terminal.department.name}")
            print(f"    Division: {terminal.department.division.name}")
            print(f"    Company: {terminal.department.division.company.name}")
            print(f"    Active: {terminal.is_active}")
            print()
        
        # Test serialization
        serializer = TerminalSerializer(queryset, many=True)
        serialized_data = serializer.data
        
        print(f"Serialized terminal data:")
        print(f"Count: {len(serialized_data)}")
        for i, terminal_data in enumerate(serialized_data):
            print(f"\nTerminal {i+1}:")
            print(f"  ID: {terminal_data.get('id')}")
            print(f"  Name: {terminal_data.get('name')}")
            print(f"  Code: {terminal_data.get('code')}")
            print(f"  Department ID: {terminal_data.get('department')}")
            print(f"  Address City: {terminal_data.get('address_city')}")
            print(f"  Address State: {terminal_data.get('address_state')}")
            print(f"  Is Active: {terminal_data.get('is_active')}")
        
        return len(serialized_data)
        
    except CustomUser.DoesNotExist:
        print("❌ User 'regional.manager' not found!")
        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 0


if __name__ == '__main__':
    print("Debugging terminal API for regional.manager...")
    terminal_count = debug_terminal_api()
    print(f"\n✅ API should return {terminal_count} terminals")
