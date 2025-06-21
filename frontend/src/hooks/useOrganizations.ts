/**
 * Organizations API hooks for fetching real data from backend
 */

import { useState, useEffect, useCallback } from 'react';

// Organization interface to match backend data
export interface Organization {
  id: string;
  name: string;
  code: string;
  type: 'company' | 'division' | 'department' | 'terminal';
  parentId?: string;
  isActive: boolean;
  address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  stats: {
    employees: number;
    vehicles: number;
    revenue: number;
    activeLoads: number;
  };
  manager?: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UseOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOrganizations = (): UseOrganizationsResult => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);      // Get auth token from localStorage
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8000/api/organizations/hierarchy/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {          // Token might be expired, try to refresh
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const refreshResponse = await fetch('http://localhost:8000/api/auth/refresh/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem('auth_token', refreshData.access);
              
              // Retry the original request
              const retryResponse = await fetch('http://localhost:8000/api/organizations/hierarchy/', {
                headers: {
                  'Authorization': `Bearer ${refreshData.access}`,
                  'Content-Type': 'application/json',
                },
              });

              if (!retryResponse.ok) {
                throw new Error(`Failed to fetch organizations: ${retryResponse.status}`);
              }

              const data = await retryResponse.json();
              setOrganizations(data);
              return;
            }
          }
            // If refresh failed, redirect to login
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          window.location.href = '/auth';
          return;
        }
        
        throw new Error(`Failed to fetch organizations: ${response.status}`);
      }

      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const refetch = useCallback(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    refetch,
  };
};

// Hook for creating/updating organizations
export const useOrganizationMutations = () => {
  const [loading, setLoading] = useState(false);
  const createOrganization = async (organizationData: Partial<Organization>) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = '';
      switch (organizationData.type) {
        case 'company':
          endpoint = 'companies';
          break;
        case 'division':
          endpoint = 'divisions';
          break;
        case 'department':
          endpoint = 'departments';
          break;
        case 'terminal':
          endpoint = 'terminals';
          break;
        default:
          throw new Error('Invalid organization type');
      }

      const response = await fetch(`http://localhost:8000/api/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create organization: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const updateOrganization = async (id: string, organizationData: Partial<Organization>) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = '';
      switch (organizationData.type) {
        case 'company':
          endpoint = 'companies';
          break;
        case 'division':
          endpoint = 'divisions';
          break;
        case 'department':
          endpoint = 'departments';
          break;
        case 'terminal':
          endpoint = 'terminals';
          break;
        default:
          throw new Error('Invalid organization type');
      }

      const response = await fetch(`http://localhost:8000/api/${endpoint}/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update organization: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const deleteOrganization = async (id: string, type: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = '';
      switch (type) {
        case 'company':
          endpoint = 'companies';
          break;
        case 'division':
          endpoint = 'divisions';
          break;
        case 'department':
          endpoint = 'departments';
          break;
        case 'terminal':
          endpoint = 'terminals';
          break;
        default:
          throw new Error('Invalid organization type');
      }

      const response = await fetch(`http://localhost:8000/api/${endpoint}/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete organization: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrganization,
    updateOrganization,
    deleteOrganization,
    loading,
  };
};
