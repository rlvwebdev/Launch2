import { User, Permission, ResourceType, ActionType, PermissionScope } from '@/types';

export class PermissionChecker {
  private user: User | null;

  constructor(user: User | null) {
    this.user = user;
  }

  /**
   * Check if the user has permission to perform an action on a resource
   */  hasPermission(
    resourceType: ResourceType,
    action: ActionType,
    scope: PermissionScope = PermissionScope.COMPANY,
    organizationId?: string
  ): boolean {
    if (!this.user) return false;

    // System admins have all permissions
    if (this.user.roles.some(role => role.level === 'system_admin')) return true;

    // Check if user has organizational access for the given organization
    if (organizationId) {
      const hasOrgAccess = this.user.organizationAccess?.some(
        access => access.organizationId === organizationId
      );
      if (!hasOrgAccess) return false;
    }

    // Check specific permissions
    return this.user.permissions.some(permission => {
      const matchesResource = permission.resource === resourceType;
      const matchesAction = permission.actions.includes(action);
      const matchesScope = this.checkScopePermission(permission.scope, scope);

      return matchesResource && matchesAction && matchesScope;
    });
  }
  /**
   * Check if the user can read resources
   */
  canRead(resourceType: ResourceType, organizationId?: string): boolean {
    return this.hasPermission(resourceType, ActionType.READ, PermissionScope.COMPANY, organizationId);
  }

  /**
   * Check if the user can create resources
   */
  canCreate(resourceType: ResourceType, organizationId?: string): boolean {
    return this.hasPermission(resourceType, ActionType.CREATE, PermissionScope.COMPANY, organizationId);
  }

  /**
   * Check if the user can update resources
   */
  canUpdate(resourceType: ResourceType, organizationId?: string): boolean {
    return this.hasPermission(resourceType, ActionType.UPDATE, PermissionScope.COMPANY, organizationId);
  }

  /**
   * Check if the user can delete resources
   */
  canDelete(resourceType: ResourceType, organizationId?: string): boolean {
    return this.hasPermission(resourceType, ActionType.DELETE, PermissionScope.COMPANY, organizationId);
  }

  /**
   * Check if the user can manage organizations
   */
  canManageOrganizations(): boolean {
    return this.hasPermission(ResourceType.SETTINGS, ActionType.UPDATE, PermissionScope.SYSTEM);
  }

  /**
   * Check if the user can manage users
   */
  canManageUsers(): boolean {
    return this.hasPermission(ResourceType.USERS, ActionType.UPDATE, PermissionScope.COMPANY);
  }
  /**
   * Check scope permission hierarchy
   */
  private checkScopePermission(userScope: PermissionScope, requiredScope: PermissionScope): boolean {
    const scopeHierarchy: Record<PermissionScope, number> = {
      [PermissionScope.SYSTEM]: 5,
      [PermissionScope.COMPANY]: 4,
      [PermissionScope.DIVISION]: 3,
      [PermissionScope.DEPARTMENT]: 2,
      [PermissionScope.TERMINAL]: 1,
      [PermissionScope.OWN]: 0
    };

    return scopeHierarchy[userScope] >= scopeHierarchy[requiredScope];
  }

  /**
   * Get accessible organization IDs for the user
   */
  getAccessibleOrganizationIds(): string[] {
    if (!this.user?.organizationAccess) return [];
    return this.user.organizationAccess.map(access => access.organizationId);
  }

  /**
   * Check if user has access to specific organization
   */
  hasOrganizationAccess(organizationId: string): boolean {
    if (!this.user?.organizationAccess) return false;
    return this.user.organizationAccess.some(access => access.organizationId === organizationId);
  }
}

/**
 * React hook for permission checking
 */
export function usePermissions(user: User | null) {
  const checker = new PermissionChecker(user);

  return {
    hasPermission: checker.hasPermission.bind(checker),
    canRead: checker.canRead.bind(checker),
    canCreate: checker.canCreate.bind(checker),
    canUpdate: checker.canUpdate.bind(checker),
    canDelete: checker.canDelete.bind(checker),
    canManageOrganizations: checker.canManageOrganizations.bind(checker),
    canManageUsers: checker.canManageUsers.bind(checker),
    getAccessibleOrganizationIds: checker.getAccessibleOrganizationIds.bind(checker),
    hasOrganizationAccess: checker.hasOrganizationAccess.bind(checker)
  };
}
