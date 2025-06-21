#!/usr/bin/env python
"""
Delete all loads to regenerate with proper daily volume
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'launch_tms.settings')
django.setup()

from loads.models import Load

def main():
    count = Load.objects.count()
    print(f'🗑️  Deleting {count} existing loads...')
    Load.objects.all().delete()
    print('✅ All loads deleted successfully!')

if __name__ == '__main__':
    main()
