"""
Django admin configuration for companies app
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Company, Division, Department, Terminal, CustomUser


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code', 'email']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'company', 'is_active']
    list_filter = ['company', 'is_active']
    search_fields = ['name', 'code', 'company__name']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'division', 'is_active']
    list_filter = ['division__company', 'is_active']
    search_fields = ['name', 'code', 'division__name']


@admin.register(Terminal)
class TerminalAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'department', 'is_active']
    list_filter = ['department__division__company', 'is_active']
    search_fields = ['name', 'code', 'address_city']


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'company', 'role', 'is_active']
    list_filter = ['company', 'role', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Company Information', {
            'fields': ('company', 'division', 'department', 'terminal', 'role')
        }),
        ('Contact Information', {
            'fields': ('phone',)
        }),
        ('Preferences', {
            'fields': ('theme', 'language', 'timezone')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Company Information', {
            'fields': ('company', 'role')
        }),
    )
