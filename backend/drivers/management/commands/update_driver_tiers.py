"""
Management command to update driver tiers based on their experience
"""
from django.core.management.base import BaseCommand
from drivers.models import Driver


class Command(BaseCommand):
    help = 'Update all driver tiers based on their years of experience'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        drivers = Driver.objects.all()
        updated_count = 0
        
        self.stdout.write(f"Processing {drivers.count()} drivers...")
        
        for driver in drivers:
            recommended_tier = driver.recommended_tier
            current_tier = driver.tier
            
            if current_tier != recommended_tier:
                if dry_run:
                    self.stdout.write(
                        f"[DRY RUN] Would update {driver.full_name}: "
                        f"{current_tier or 'None'} -> {recommended_tier} "
                        f"({driver.years_of_experience} years experience)"
                    )
                else:
                    driver.tier = recommended_tier
                    driver.save(update_fields=['tier'])
                    self.stdout.write(
                        f"Updated {driver.full_name}: "
                        f"{current_tier or 'None'} -> {recommended_tier} "
                        f"({driver.years_of_experience} years experience)"
                    )
                updated_count += 1
            else:
                if not dry_run:
                    self.stdout.write(
                        f"No change needed for {driver.full_name}: "
                        f"already {current_tier} ({driver.years_of_experience} years)"
                    )
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(f"DRY RUN: Would update {updated_count} drivers")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f"Successfully updated {updated_count} drivers")
            )
