#!/usr/bin/env python
"""
Verify terminal access for the test user
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


def verify_user_terminal_access():
    """Verify what terminals the test user has access to"""
    
    try:
        # Get the test user
        user = CustomUser.objects.get(username='regional.manager')
        print(f"Found user: {user.username} ({user.email})")
        print(f"Role: {user.role}")
        print(f"Company: {user.company.name if user.company else 'None'}")
        print(f"Division: {user.division.name if user.division else 'None'}")
        print(f"Department: {user.department.name if user.department else 'None'}")
        print(f"Home Terminal: {user.terminal.name if user.terminal else 'None'}")
        
        # Check what terminals they should have access to based on TerminalViewSet logic
        if user.role == 'system_admin':
            accessible_terminals = Terminal.objects.all()
            print(f"\nAs system_admin, user has access to ALL terminals:")
        elif user.company:
            accessible_terminals = Terminal.objects.filter(department__division__company=user.company)
            print(f"\nAs company user, user has access to terminals in company '{user.company.name}':")
        else:
            accessible_terminals = Terminal.objects.none()
            print(f"\nUser has no terminal access:")
        
        print(f"\nAccessible terminals ({accessible_terminals.count()}):")
        for i, terminal in enumerate(accessible_terminals, 1):
            print(f"  {i}. {terminal.name} ({terminal.code})")
            print(f"     Location: {terminal.address_city}, {terminal.address_state}")
            print(f"     Department: {terminal.department.name}")
            print(f"     Division: {terminal.department.division.name}")
            print(f"     Company: {terminal.department.division.company.name}")
            print(f"     Active: {terminal.is_active}")
            print()
        
        return accessible_terminals.count()
        
    except CustomUser.DoesNotExist:
        print("❌ User 'regional.manager' not found!")
        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 0


if __name__ == '__main__':
    print("Verifying terminal access for test user...")
    terminal_count = verify_user_terminal_access()
    print(f"\n✅ User should see {terminal_count} terminals in the selector")
