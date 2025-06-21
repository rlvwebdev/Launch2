'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'manager' | 'viewer';
  companyId: string;
  divisionId?: string;
  departmentId?: string;
  terminalId?: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  profilePicture?: string;
  phone?: string;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
    timezone: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyId: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  
  // Permissions
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  canAccessTerminal: (terminalId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize authentication state from localStorage/sessionStorage
  useEffect(() => {
    initializeAuth();
  }, []);
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (token) {
        // Validate token and get user data
        const response = await fetch('http://localhost:8000/api/v1/auth/verify/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            user: data.user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to initialize authentication',
      });
    }
  };
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthState({
            user: userData.user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Token is invalid, clear it
          clearAuthTokens();
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to initialize authentication',
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const { user, token, refreshToken } = data;
        
        // Store tokens
        if (credentials.rememberMe) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);
        } else {
          sessionStorage.setItem('auth_token', token);
          sessionStorage.setItem('refresh_token', refreshToken);
        }

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Login failed',
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error during login',
      }));
    }
  };

  const register = async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const { user, token, refreshToken } = result;
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message || 'Registration failed',
        }));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error during registration',
      }));
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state regardless of API call result
      clearAuthTokens();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const { token, refreshToken: newRefreshToken } = await response.json();
        
        // Update stored tokens
        if (localStorage.getItem('auth_token')) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', newRefreshToken);
        } else {
          sessionStorage.setItem('auth_token', token);
          sessionStorage.setItem('refresh_token', newRefreshToken);
        }
      } else {
        // Refresh failed, logout user
        await logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;

    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to update profile',
      }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!authState.user) return;

    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const clearAuthTokens = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
  };

  // Permission checking functions
  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    return authState.user.permissions.includes(permission) || authState.user.role === 'admin';
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!authState.user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(authState.user.role);
  };

  const canAccessTerminal = (terminalId: string): boolean => {
    if (!authState.user) return false;
    if (authState.user.role === 'admin') return true;
    return authState.user.terminalId === terminalId;
  };

  const contextValue: AuthContextType = {
    // State
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    resetPassword,
    changePassword,
    clearError,
    
    // Permissions
    hasPermission,
    hasRole,
    canAccessTerminal,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
