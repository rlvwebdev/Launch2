'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Organization, 
  User, 
  OrganizationType, 
  PermissionScope, 
  ResourceType, 
  ActionType,
  Company,
  Division,
  Department,
  Terminal
} from '@/types';

interface OrganizationalContextType {
  // Current user and organization
  currentUser: User | null;
  currentOrganization: Organization | null;
  organizationHierarchy: Organization[];
  
  // Organization management
  setCurrentOrganization: (orgId: string) => void;
  switchOrganization: (orgId: string) => Promise<boolean>;
  
  // Hierarchy navigation
  getParentOrganizations: (orgId: string) => Organization[];
  getChildOrganizations: (orgId: string) => Organization[];
  getOrganizationsByType: (type: OrganizationType) => Organization[];
  
  // Permission checking
  hasPermission: (resource: ResourceType, action: ActionType, scope?: PermissionScope) => boolean;
  canAccessOrganization: (orgId: string) => boolean;
  getAccessibleOrganizations: () => Organization[];
  
  // Data filtering
  getDataScope: () => PermissionScope;
  shouldFilterByOrganization: (resource: ResourceType) => boolean;
  getOrganizationalFilter: () => { companyId?: string; divisionId?: string; departmentId?: string; terminalId?: string };
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const OrganizationalContext = createContext<OrganizationalContextType | undefined>(undefined);

export const useOrganizational = () => {
  const context = useContext(OrganizationalContext);
  if (context === undefined) {
    throw new Error('useOrganizational must be used within an OrganizationalProvider');
  }
  return context;
};

// Demo data for organizations
const demoOrganizations: Organization[] = [
  // Company
  {
    id: 'ORG001',
    name: 'Launch Transportation Solutions',
    type: OrganizationType.COMPANY,
    code: 'LTS',
    address: {
      address: '123 Industrial Blvd',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001'
    },
    contactInfo: {
      email: 'info@launchtransport.com',
      phone: '(713) 555-0100',
      address: {
        address: '123 Industrial Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001'
      },
      website: 'https://launchtransport.com'
    },
    settings: {
      branding: {
        logoUrl: '/favicon.svg',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        theme: 'light'
      },
      operational: {
        timezone: 'America/Chicago',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
        currency: 'USD',
        weightUnit: 'lbs',
        distanceUnit: 'miles',
        defaultLoadCapacity: 80000
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        maintenanceAlerts: true,
        loadStatusUpdates: true,
        emergencyAlerts: true
      },
      integrations: {
        gpsProvider: 'Fleet Complete',
        eldProvider: 'Samsara',
        accountingSystem: 'QuickBooks',
        dispatchSystem: 'McLeod'
      }
    },
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  },
  // Divisions
  {
    id: 'ORG002',
    name: 'Southwest Division',
    type: OrganizationType.DIVISION,
    parentId: 'ORG001',
    code: 'SW',
    address: {
      address: '123 Industrial Blvd',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001'
    },
    contactInfo: {
      email: 'southwest@launchtransport.com',
      phone: '(713) 555-0200',
      address: {
        address: '123 Industrial Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001'
      }
    },
    settings: {
      branding: {},
      operational: {
        timezone: 'America/Chicago',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
        currency: 'USD',
        weightUnit: 'lbs',
        distanceUnit: 'miles',
        defaultLoadCapacity: 80000
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        maintenanceAlerts: true,
        loadStatusUpdates: true,
        emergencyAlerts: true
      },
      integrations: {}
    },
    isActive: true,
    createdAt: new Date('2020-02-01'),
    updatedAt: new Date()
  },
  // Departments
  {
    id: 'ORG003',
    name: 'Operations Department',
    type: OrganizationType.DEPARTMENT,
    parentId: 'ORG002',
    code: 'OPS',
    address: {
      address: '123 Industrial Blvd',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001'
    },
    contactInfo: {
      email: 'operations@launchtransport.com',
      phone: '(713) 555-0300',
      address: {
        address: '123 Industrial Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001'
      }
    },
    settings: {
      branding: {},
      operational: {
        timezone: 'America/Chicago',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
        currency: 'USD',
        weightUnit: 'lbs',
        distanceUnit: 'miles',
        defaultLoadCapacity: 80000
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        maintenanceAlerts: true,
        loadStatusUpdates: true,
        emergencyAlerts: true
      },
      integrations: {}
    },
    isActive: true,
    createdAt: new Date('2020-02-15'),
    updatedAt: new Date()
  },
  // Terminals
  {
    id: 'ORG004',
    name: 'Houston Main Terminal',
    type: OrganizationType.TERMINAL,
    parentId: 'ORG003',
    code: 'HOU01',
    address: {
      address: '123 Industrial Blvd',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      coordinates: {
        lat: 29.7604,
        lng: -95.3698
      }
    },
    contactInfo: {
      email: 'houston@launchtransport.com',
      phone: '(713) 555-0400',
      address: {
        address: '123 Industrial Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001'
      }
    },
    settings: {
      branding: {},
      operational: {
        timezone: 'America/Chicago',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
        currency: 'USD',
        weightUnit: 'lbs',
        distanceUnit: 'miles',
        defaultLoadCapacity: 80000
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        maintenanceAlerts: true,
        loadStatusUpdates: true,
        emergencyAlerts: true
      },
      integrations: {}
    },
    isActive: true,
    createdAt: new Date('2020-03-01'),
    updatedAt: new Date()
  },
  {
    id: 'ORG005',
    name: 'Dallas Terminal',
    type: OrganizationType.TERMINAL,
    parentId: 'ORG003',
    code: 'DAL01',
    address: {
      address: '456 Logistics Way',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      coordinates: {
        lat: 32.7767,
        lng: -96.7970
      }
    },
    contactInfo: {
      email: 'dallas@launchtransport.com',
      phone: '(214) 555-0500',
      address: {
        address: '456 Logistics Way',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201'
      }
    },
    settings: {
      branding: {},
      operational: {
        timezone: 'America/Chicago',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
        currency: 'USD',
        weightUnit: 'lbs',
        distanceUnit: 'miles',
        defaultLoadCapacity: 80000
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        maintenanceAlerts: true,
        loadStatusUpdates: true,
        emergencyAlerts: true
      },
      integrations: {}
    },
    isActive: true,
    createdAt: new Date('2020-04-01'),
    updatedAt: new Date()
  }
];

// Demo user with organizational access
const demoUser: User = {
  id: 'USER001',
  username: 'demo.user',
  email: 'demo@launchtransport.com',
  firstName: 'Demo',
  lastName: 'User',
  phoneNumber: '(713) 555-0001',
  organizationAccess: [
    {
      organizationId: 'ORG001',
      organizationType: OrganizationType.COMPANY,
      roles: [
        {
          id: 'ROLE001',
          name: 'Company Admin',
          code: 'COMPANY_ADMIN',
          description: 'Full access to company resources',
          level: 'company_admin' as any,
          permissions: [
            {
              id: 'PERM001',
              name: 'All Resources Access',
              resource: ResourceType.DRIVERS,
              actions: [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE],
              scope: PermissionScope.COMPANY
            }
          ]
        }
      ],
      permissions: [],
      isDefault: true,
      assignedAt: new Date('2020-01-01'),
      assignedBy: 'SYSTEM'
    }
  ],
  currentOrganizationId: 'ORG001',
  roles: [],
  permissions: [],
  preferences: {
    language: 'en-US',
    timezone: 'America/Chicago',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    dashboard: {
      defaultView: 'grid',
      refreshInterval: 30000,
      showWeather: true
    }
  },
  lastLogin: new Date(),
  isActive: true,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date()
};

interface OrganizationalProviderProps {
  children: ReactNode;
}

export const OrganizationalProvider: React.FC<OrganizationalProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(demoUser);
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [organizationHierarchy, setOrganizationHierarchy] = useState<Organization[]>(demoOrganizations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize current organization
  useEffect(() => {
    if (currentUser && !currentOrganization) {
      const defaultOrg = organizationHierarchy.find(org => org.id === currentUser.currentOrganizationId);
      if (defaultOrg) {
        setCurrentOrganizationState(defaultOrg);
      }
    }
  }, [currentUser, currentOrganization, organizationHierarchy]);

  const setCurrentOrganization = (orgId: string) => {
    const org = organizationHierarchy.find(o => o.id === orgId);
    if (org && canAccessOrganization(orgId)) {
      setCurrentOrganizationState(org);
      if (currentUser) {
        setCurrentUser({ ...currentUser, currentOrganizationId: orgId });
      }
    }
  };

  const switchOrganization = async (orgId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (canAccessOrganization(orgId)) {
        setCurrentOrganization(orgId);
        return true;
      } else {
        setError('Access denied to this organization');
        return false;
      }
    } catch (err) {
      setError('Failed to switch organization');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getParentOrganizations = (orgId: string): Organization[] => {
    const parents: Organization[] = [];
    let current = organizationHierarchy.find(org => org.id === orgId);
    
    while (current && current.parentId) {
      const parent = organizationHierarchy.find(org => org.id === current!.parentId);
      if (parent) {
        parents.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }
    
    return parents;
  };

  const getChildOrganizations = (orgId: string): Organization[] => {
    return organizationHierarchy.filter(org => org.parentId === orgId);
  };

  const getOrganizationsByType = (type: OrganizationType): Organization[] => {
    return organizationHierarchy.filter(org => org.type === type);
  };

  const hasPermission = (resource: ResourceType, action: ActionType, scope?: PermissionScope): boolean => {
    if (!currentUser || !currentOrganization) return false;
    
    // For demo purposes, admin users have all permissions
    const hasAdminAccess = currentUser.organizationAccess.some(access => 
      access.roles.some(role => role.code === 'COMPANY_ADMIN')
    );
    
    if (hasAdminAccess) return true;
    
    // Check specific permissions (implement based on your business logic)
    return currentUser.organizationAccess.some(access => 
      access.permissions.some(permission => 
        permission.resource === resource &&
        permission.actions.includes(action) &&
        (!scope || permission.scope === scope || permission.scope === PermissionScope.SYSTEM)
      )
    );
  };

  const canAccessOrganization = (orgId: string): boolean => {
    if (!currentUser) return false;
    return currentUser.organizationAccess.some(access => access.organizationId === orgId);
  };

  const getAccessibleOrganizations = (): Organization[] => {
    if (!currentUser) return [];
    
    const accessibleOrgIds = currentUser.organizationAccess.map(access => access.organizationId);
    return organizationHierarchy.filter(org => accessibleOrgIds.includes(org.id));
  };

  const getDataScope = (): PermissionScope => {
    if (!currentUser || !currentOrganization) return PermissionScope.OWN;
    
    // Determine scope based on organization type and user role
    switch (currentOrganization.type) {
      case OrganizationType.COMPANY:
        return PermissionScope.COMPANY;
      case OrganizationType.DIVISION:
        return PermissionScope.DIVISION;
      case OrganizationType.DEPARTMENT:
        return PermissionScope.DEPARTMENT;
      case OrganizationType.TERMINAL:
        return PermissionScope.TERMINAL;
      default:
        return PermissionScope.OWN;
    }
  };

  const shouldFilterByOrganization = (resource: ResourceType): boolean => {
    // All resources should be filtered by organization in a multi-tenant system
    return true;
  };

  const getOrganizationalFilter = () => {
    if (!currentOrganization) return {};
    
    const filter: any = {};
    
    // Build filter based on current organization hierarchy
    const parents = getParentOrganizations(currentOrganization.id);
    const company = parents.find(org => org.type === OrganizationType.COMPANY) || 
                   (currentOrganization.type === OrganizationType.COMPANY ? currentOrganization : null);
    const division = parents.find(org => org.type === OrganizationType.DIVISION) || 
                    (currentOrganization.type === OrganizationType.DIVISION ? currentOrganization : null);
    const department = parents.find(org => org.type === OrganizationType.DEPARTMENT) || 
                      (currentOrganization.type === OrganizationType.DEPARTMENT ? currentOrganization : null);
    const terminal = currentOrganization.type === OrganizationType.TERMINAL ? currentOrganization : null;
    
    if (company) filter.companyId = company.id;
    if (division) filter.divisionId = division.id;
    if (department) filter.departmentId = department.id;
    if (terminal) filter.terminalId = terminal.id;
    
    return filter;
  };

  const contextValue: OrganizationalContextType = {
    currentUser,
    currentOrganization,
    organizationHierarchy,
    setCurrentOrganization,
    switchOrganization,
    getParentOrganizations,
    getChildOrganizations,
    getOrganizationsByType,
    hasPermission,
    canAccessOrganization,
    getAccessibleOrganizations,
    getDataScope,
    shouldFilterByOrganization,
    getOrganizationalFilter,
    isLoading,
    error
  };

  return (
    <OrganizationalContext.Provider value={contextValue}>
      {children}
    </OrganizationalContext.Provider>
  );
};
