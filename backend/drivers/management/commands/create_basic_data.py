"""
Simple management command to create basic sample data for Launch TMS
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from companies.models import Company, Division, Department, Terminal
from drivers.models import Driver
from vehicles.models import Truck, Trailer
from loads.models import Load
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create basic sample data for Launch TMS'

    def handle(self, *args, **options):
        self.stdout.write('Creating basic sample data...')
        
        # Create company
        company, created = Company.objects.get_or_create(
            name='Launch Transportation',
            code='LAUNCH',
            defaults={
                'email': 'info@launchtms.com',
                'phone': '555-LAUNCH'
            }
        )
        
        # Create organizational structure
        division, created = Division.objects.get_or_create(
            name='Operations', 
            code='OPS',
            company=company
        )
        
        department, created = Department.objects.get_or_create(
            name='Fleet',
            code='FLEET', 
            division=division
        )
        
        terminal, created = Terminal.objects.get_or_create(
            name='Main Terminal',
            code='MAIN',
            department=department
        )
        
        # Create a few drivers
        driver_names = [
            ('John', 'Smith'), ('Sarah', 'Johnson'), ('Mike', 'Williams'),
            ('Lisa', 'Brown'), ('David', 'Davis')
        ]
        
        for i, (first, last) in enumerate(driver_names):
            Driver.objects.get_or_create(
                license_number=f'DL{1000 + i:06d}',
                defaults={
                    'first_name': first,
                    'last_name': last,
                    'email': f'{first.lower()}.{last.lower()}@launchtms.com',
                    'phone_number': f'555-{1000 + i:04d}',
                    'hire_date': date.today() - timedelta(days=random.randint(30, 365)),
                    'license_expiry': date.today() + timedelta(days=365),
                    'emergency_contact_name': f'{first} Contact',
                    'emergency_contact_phone': f'555-{2000 + i:04d}',
                    'emergency_contact_relationship': 'Spouse',
                    'company': company,
                    'home_terminal': terminal,
                }
            )
        
        # Create a few trucks
        for i in range(5):
            Truck.objects.get_or_create(
                vin=f'1FUJGLDR{12345678 + i}',
                defaults={
                    'make': 'Peterbilt',
                    'model': '579',
                    'year': 2022,
                    'license_plate': f'TX{2812 + i}',
                    'color': 'White',
                    'last_maintenance': date.today() - timedelta(days=30),
                    'next_maintenance_due': date.today() + timedelta(days=60),
                    'registration_expiry': date.today() + timedelta(days=365),
                    'insurance_expiry': date.today() + timedelta(days=365),
                    'company': company,
                    'home_terminal': terminal,
                }
            )
        
        # Create a few trailers
        for i in range(5):
            Trailer.objects.get_or_create(
                trailer_number=f'T{3000 + i}',
                defaults={
                    'make': 'Great Dane',
                    'model': 'Dry Van',
                    'year': 2020,
                    'vin': f'1GRAA0626{1234567 + i}',
                    'trailer_type': 'dry_van',
                    'company': company,
                    'home_terminal': terminal,
                }
            )
        
        # Create a few loads
        for i in range(5):
            Load.objects.get_or_create(
                load_number=f'L{202400 + i:06d}',
                defaults={
                    'shipper': 'ABC Company',
                    'receiver': 'XYZ Corp',
                    'pickup_address': f'{100 + i} Industrial Blvd',
                    'pickup_city': 'Dallas',
                    'pickup_state': 'TX',
                    'pickup_zip': '75201',
                    'delivery_address': f'{200 + i} Commerce St',
                    'delivery_city': 'Houston',
                    'delivery_state': 'TX',
                    'delivery_zip': '77001',
                    'pickup_date': date.today() + timedelta(days=i),
                    'delivery_date': date.today() + timedelta(days=i + 2),
                    'weight': 25000,
                    'cargo_description': 'General Freight',
                    'rate': 1500.00,
                    'company': company,
                    'origin_terminal': terminal,
                }
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                'Successfully created basic sample data:\n'
                '- Company structure\n'
                '- 5 Drivers\n'
                '- 5 Trucks\n'
                '- 5 Trailers\n'
                '- 5 Loads'
            )
        )
