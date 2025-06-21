#!/usr/bin/env python
"""
Update the regional.manager user with email for login
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from companies.models import CustomUser


def update_regional_manager_email():
    """Update the regional.manager user with email"""
    
    try:
        # Get the test user
        user = CustomUser.objects.get(username='regional.manager')
        print(f"Found user: {user.username}")
        print(f"Current email: {user.email}")
        
        # Update the email
        user.email = 'regional.manager@launchtransport.com'
        user.save()
        
        print(f"Updated email to: {user.email}")
        print(f"\nLogin credentials:")
        print(f"  Email: {user.email}")
        print(f"  Username: {user.username}")
        print(f"  Password: password123")
        
        return user
        
    except CustomUser.DoesNotExist:
        print("❌ User 'regional.manager' not found!")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == '__main__':
    print("Updating regional.manager user email...")
    user = update_regional_manager_email()
    if user:
        print(f"\n✅ Successfully updated user email!")
        print(f"\nYou can now login with either:")
        print(f"  Email: {user.email}")
        print(f"  Username: {user.username}")
        print(f"  Password: password123")
    else:
        print(f"\n❌ Failed to update user email")
