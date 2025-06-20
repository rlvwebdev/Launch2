"""
Management command to create sample data for Launch TMS
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from companies.models import Company, Division, Department, Terminal
from drivers.models import Driver
from vehicles.models import Truck, Trailer
from loads.models import Load
import random


class Command(BaseCommand):
    help = 'Create sample data for Launch TMS'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before creating new data',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            Load.objects.all().delete()
            Truck.objects.all().delete()
            Trailer.objects.all().delete()
            Driver.objects.all().delete()
            Terminal.objects.all().delete()
            Department.objects.all().delete()
            Division.objects.all().delete()
            Company.objects.all().delete()        # Create company structure
        self.stdout.write('Creating company structure...')
        company = Company.objects.create(
            name='Launch Transportation',
            code='LAUNCH',
            email='info@launchtms.com',
            phone='555-LAUNCH',
            address_street='123 Transportation Blvd',
            address_city='Trucking City',
            address_state='TX',            address_zip='75001'
        )

        division = Division.objects.create(
            name='Operations Division',
            code='OPS',
            company=company
        )

        department = Department.objects.create(
            name='Fleet Operations',
            code='FLEET',
            division=division
        )

        terminal = Terminal.objects.create(
            name='Main Terminal',
            code='MAIN',
            department=department,
            address_street='123 Transportation Blvd',
            address_city='Trucking City',
            address_state='TX',
            address_zip='75001'
        )

        # Create drivers
        self.stdout.write('Creating drivers...')
        driver_names = [
            ('John', 'Smith'), ('Sarah', 'Johnson'), ('Mike', 'Williams'),
            ('Lisa', 'Brown'), ('David', 'Davis'), ('Jennifer', 'Miller'),
            ('Robert', 'Wilson'), ('Mary', 'Moore'), ('James', 'Taylor'),
            ('Patricia', 'Anderson'), ('Michael', 'Thomas'), ('Linda', 'Jackson'),            ('William', 'White'), ('Barbara', 'Harris'), ('Richard', 'Martin'),
            ('Susan', 'Thompson'), ('Joseph', 'Garcia'), ('Jessica', 'Martinez'),
            ('Thomas', 'Robinson'), ('Karen', 'Clark'), ('Daniel', 'Rodriguez'),
            ('Nancy', 'Lewis'), ('Matthew', 'Lee')
        ]
        
        drivers = []
        for i, (first_name, last_name) in enumerate(driver_names):
            # Create varied status distribution including training
            if i < len(driver_names) * 0.7:  # 70% active
                status = 'active'
            elif i < len(driver_names) * 0.8:  # 10% in training
                status = 'in_training'
            elif i < len(driver_names) * 0.9:  # 10% inactive
                status = 'inactive'
            else:  # 10% on leave
                status = 'on_leave'
              # Training fields for drivers in training
            training_status = 'not_started'  # Default for all drivers
            training_start_date = None
            training_completion_date = None
            training_notes = ''  # Default empty string
            
            if status == 'in_training':
                training_status = random.choice(['in_progress', 'in_progress', 'suspended'])
                training_start_date = date.today() - timedelta(days=random.randint(1, 60))
                if training_status == 'completed':
                    training_completion_date = training_start_date + timedelta(days=random.randint(14, 90))
                training_notes = f'Training in progress for {first_name}. Making good progress on road skills.'
            
            driver = Driver.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=f'{first_name.lower()}.{last_name.lower()}@launchtms.com',
                phone_number=f'555-{1000 + i:04d}',
                hire_date=date.today() - timedelta(days=random.randint(30, 1000)),
                license_number=f'DL{1000 + i:06d}',
                license_expiry=date.today() + timedelta(days=random.randint(30, 365)),
                status=status,
                training_status=training_status,
                training_start_date=training_start_date,
                training_completion_date=training_completion_date,
                training_notes=training_notes,
                company=company,
                home_terminal=terminal,
                emergency_contact_name=f'{first_name} Emergency Contact',
                emergency_contact_phone=f'555-{2000 + i:04d}',
                emergency_contact_relationship='Spouse'
            )
            drivers.append(driver)

        # Create trucks
        self.stdout.write('Creating trucks...')
        truck_numbers = [f'28{12 + i}{"A" if i % 3 == 0 else ""}' for i in range(30)]
        trucks = []
        
        for i, truck_number in enumerate(truck_numbers):
            truck = Truck.objects.create(
                make=random.choice(['Peterbilt', 'Kenworth', 'Freightliner', 'Volvo']),
                model=random.choice(['579', '389', 'Cascadia', 'VNL']),
                year=random.randint(2018, 2024),
                license_plate=f'TX{truck_number}',
                vin=f'1FUJGLDR{random.randint(10000000, 99999999)}',
                color=random.choice(['White', 'Blue', 'Red', 'Black']),
                status=random.choice(['available', 'assigned', 'maintenance']),
                last_maintenance=date.today() - timedelta(days=random.randint(30, 180)),
                next_maintenance_due=date.today() + timedelta(days=random.randint(30, 90)),
                registration_expiry=date.today() + timedelta(days=random.randint(90, 365)),
                insurance_expiry=date.today() + timedelta(days=random.randint(90, 365)),
                company=company,
                home_terminal=terminal
            )
            trucks.append(truck)

        # Assign some drivers to trucks
        for i, driver in enumerate(drivers[:20]):  # Assign first 20 drivers
            if i < len(trucks):
                truck = trucks[i]
                truck.assigned_driver = driver
                truck.status = 'assigned'
                truck.save()

        # Create trailers
        self.stdout.write('Creating trailers...')
        trailer_numbers = [f'T{3000 + i:04d}' for i in range(35)]
        trailers = []
        
        for i, trailer_number in enumerate(trailer_numbers):
            trailer = Trailer.objects.create(
                trailer_number=trailer_number,
                make=random.choice(['Great Dane', 'Utility', 'Wabash', 'Hyundai']),
                model=random.choice(['Dry Van', 'Reefer', 'Flatbed']),
                year=random.randint(2015, 2023),
                vin=f'1GRAA0626{random.randint(1000000, 9999999)}',
                trailer_type=random.choice(['dry_van', 'refrigerated', 'flatbed']),
                status=random.choice(['available', 'assigned', 'maintenance']),
                company=company,
                home_terminal=terminal
            )
            trailers.append(trailer)

        # Create loads
        self.stdout.write('Creating loads...')
        cities = [
            ('Dallas', 'TX', '75201'),
            ('Houston', 'TX', '77001'),
            ('Austin', 'TX', '78701'),
            ('San Antonio', 'TX', '78201'),
            ('Atlanta', 'GA', '30301'),
            ('Phoenix', 'AZ', '85001'),
            ('Los Angeles', 'CA', '90001'),
            ('Chicago', 'IL', '60601'),
            ('New York', 'NY', '10001'),
            ('Miami', 'FL', '33101')
        ]

        companies = [
            'Walmart', 'Amazon', 'Target', 'Home Depot', 'Costco',
            'FedEx', 'UPS', 'Sysco', 'Pepsi', 'Coca-Cola'
        ]

        statuses = [
            'pending', 'assigned', 'in_transit', 'delivered', 'cancelled',
            'pending', 'assigned', 'pending'  # More likely to be pending/assigned
        ]

        for i in range(50):
            pickup_city = random.choice(cities)
            delivery_city = random.choice([city for city in cities if city != pickup_city])
            
            pickup_date = timezone.now() + timedelta(days=random.randint(-5, 5))
            delivery_date = pickup_date + timedelta(days=random.randint(1, 5))
            
            load = Load.objects.create(
                load_number=f'L{2024000 + i:06d}',
                bol_number=f'BOL{random.randint(100000, 999999)}',
                shipper=random.choice(companies),
                receiver=random.choice(companies),
                pickup_address=f'{random.randint(100, 9999)} Industrial Blvd',
                pickup_city=pickup_city[0],
                pickup_state=pickup_city[1],
                pickup_zip=pickup_city[2],
                delivery_address=f'{random.randint(100, 9999)} Commerce St',
                delivery_city=delivery_city[0],
                delivery_state=delivery_city[1],
                delivery_zip=delivery_city[2],
                pickup_date=pickup_date,
                delivery_date=delivery_date,
                weight=random.randint(1000, 45000),
                cargo_description=random.choice([
                    'General Freight', 'Electronics', 'Food Products', 
                    'Automotive Parts', 'Machinery', 'Textiles'
                ]),
                rate=random.randint(1000, 5000),
                status=random.choice(statuses),
                company=company,
                origin_terminal=terminal
            )
            
            # Assign some loads to trucks and drivers
            if random.choice([True, False, False]):  # 1/3 chance of assignment
                available_trucks = [t for t in trucks if t.assigned_driver and t.status == 'assigned']
                if available_trucks:
                    truck = random.choice(available_trucks)
                    load.assigned_truck = truck
                    load.assigned_driver = truck.assigned_driver
                    load.save()

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created sample data:\n'
                f'- 1 Company with divisions, departments, and terminals\n'
                f'- {len(drivers)} Drivers\n'
                f'- {len(trucks)} Trucks\n'
                f'- {len(trailers)} Trailers\n'
                f'- 50 Loads'
            )
        )
