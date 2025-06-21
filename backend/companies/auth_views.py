"""
Authentication views for Launch TMS
"""
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
import logging

from .models import CustomUser, Company
from .serializers import UserSerializer, UserRegistrationSerializer


logger = logging.getLogger(__name__)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer that includes user data and supports email login"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['user_id'] = str(user.id)
        token['email'] = user.email
        token['company_id'] = str(user.company.id) if user.company else None
        token['role'] = user.role
        
        return token
    
    def validate(self, attrs):
        from typing import Any, Dict
        from django.contrib.auth import authenticate
        
        email = attrs.get('email')
        password = attrs.get('password')
        username = attrs.get('username')
        
        # If email is provided, try to find the user by email
        if email and not username:
            try:
                user = CustomUser.objects.get(email=email)
                attrs['username'] = user.username
            except CustomUser.DoesNotExist:
                pass
        
        data: Dict[str, Any] = super().validate(attrs)
        
        # Add user data to response
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        
        return data


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Custom login view that supports email authentication
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to find user by email first, then by username
        user = None
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            try:
                user = CustomUser.objects.get(username=email)
            except CustomUser.DoesNotExist:
                pass
        
        if user and user.check_password(password) and user.is_active:
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Add custom claims to tokens
            refresh['user_id'] = str(user.id)
            refresh['email'] = user.email
            refresh['company_id'] = str(user.company.id) if user.company else None
            refresh['role'] = user.role
            
            # Return user data with tokens
            user_serializer = UserSerializer(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response({
            'error': 'Login failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Return user data with tokens
            user_serializer = UserSerializer(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': user_serializer.data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': 'Registration failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response({
            'error': 'Registration failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    Logout user by blacklisting the refresh token
    """
    try:
        refresh_token = request.data.get('refresh_token')
        
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            
        return Response({
            'message': 'Successfully logged out'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return Response({
            'error': 'Logout failed',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """
    Verify token and return user data
    """
    try:
        user_serializer = UserSerializer(request.user)
        return Response({
            'valid': True,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return Response({
            'valid': False,
            'error': 'Invalid token'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update user profile
    """
    try:
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Profile update failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Profile update error: {str(e)}")
        return Response({
            'error': 'Profile update failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user password
    """
    try:
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({
                'error': 'Both current and new passwords are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify current password
        if not user.check_password(current_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({
                'error': 'New password validation failed',
                'details': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Password change error: {str(e)}")
        return Response({
            'error': 'Password change failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_request(request):
    """
    Request password reset
    """
    try:
        email = request.data.get('email')
        
        if not email:
            return Response({
                'error': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email, is_active=True)
        except CustomUser.DoesNotExist:
            # Don't reveal if email exists for security
            return Response({
                'message': 'If this email exists, you will receive reset instructions'
            }, status=status.HTTP_200_OK)
        
        # Generate reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # TODO: Send email with reset link
        # For now, return the reset data (in production, only send email)
        reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?uid={uid}&token={token}"
        
        logger.info(f"Password reset requested for {email}. Reset URL: {reset_url}")
        
        return Response({
            'message': 'If this email exists, you will receive reset instructions',
            'reset_url': reset_url  # Remove this in production
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Password reset request error: {str(e)}")
        return Response({
            'error': 'Password reset request failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request):
    """
    Confirm password reset
    """
    try:
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([uid, token, new_password]):
            return Response({
                'error': 'UID, token, and new password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response({
                'error': 'Invalid reset link'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_token_generator.check_token(user, token):
            return Response({
                'error': 'Invalid or expired reset token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({
                'error': 'New password validation failed',
                'details': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password reset successful'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Password reset confirm error: {str(e)}")
        return Response({
            'error': 'Password reset failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_permissions(request):
    """
    Get user permissions and capabilities
    """
    try:
        user = request.user
        
        # Calculate permissions based on role and organizational structure
        permissions = []
        
        # Base permissions for all authenticated users
        permissions.extend([
            'view_dashboard',
            'view_profile',
            'update_profile',
        ])
        
        # Role-based permissions
        if user.role in ['system_admin']:
            permissions.extend([
                'manage_companies',
                'manage_users',
                'view_all_data',
                'manage_system_settings',
            ])
        elif user.role in ['company_admin']:
            permissions.extend([
                'manage_company_users',
                'view_company_data',
                'manage_company_settings',
                'manage_drivers',
                'manage_vehicles',
                'manage_loads',
            ])
        elif user.role in ['department_manager']:
            permissions.extend([
                'view_department_data',
                'manage_department_drivers',
                'manage_department_vehicles',
                'manage_department_loads',
            ])
        elif user.role in ['user']:
            permissions.extend([
                'view_assigned_data',
                'update_assigned_loads',
            ])
        
        # Department-specific permissions
        if user.department:
            permissions.append(f'access_department_{user.department.id}')
        
        # Terminal-specific permissions
        if user.terminal:
            permissions.append(f'access_terminal_{user.terminal.id}')
        
        return Response({
            'permissions': permissions,
            'role': user.role,
            'company_id': str(user.company.id) if user.company else None,
            'department_id': str(user.department.id) if user.department else None,
            'terminal_id': str(user.terminal.id) if user.terminal else None,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"User permissions error: {str(e)}")
        return Response({
            'error': 'Failed to get user permissions',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
