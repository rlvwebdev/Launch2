"""
URL configuration for launch_tms project.
🚀 Launch TMS - Transportation Management System
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Admin site customization
admin.site.site_header = "🚀 Launch TMS Administration"
admin.site.site_title = "Launch TMS Admin"
admin.site.index_title = "Transportation Management System"
