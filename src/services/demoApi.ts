// Demo API Service - wraps real API with mock data fallback
import { 
  isDemoMode, 
  mockUsers, 
  mockRoles, 
  mockPermissions, 
  mockAuditLogs,
  delay,
  mockApiResponse,
  mockPaginatedResponse,
  demoCredentials
} from './mockData';
import { 
  UserFilters,
  RoleFilters,
  PermissionFilters,
  AuditFilters,
  CreateUserData,
  UpdateUserData,
  CreateRoleData,
  UpdateRoleData,
  CreatePermissionData,
  UpdatePermissionData,
  User,
  Role,
  Permission,
  AuditLog
} from '../types/api';

// Original API imports
import { 
  authApi as realAuthApi,
  usersApi as realUsersApi,
  rolesApi as realRolesApi,
  permissionsApi as realPermissionsApi,
  auditApi as realAuditApi
} from './api';

// Demo Auth API
export const authApi = {
  login: async (credentials: any) => {
    if (isDemoMode) {
      await delay(800);
      if (credentials.email === demoCredentials.email && 
          credentials.password === demoCredentials.password) {
        const demoUser = mockUsers[0];
        return mockApiResponse({
          user: demoUser,
          accessToken: 'demo_access_token_' + Date.now(),
          refreshToken: 'demo_refresh_token_' + Date.now()
        });
      } else {
        throw new Error('Invalid demo credentials. Use: admin@demo.com / demo123');
      }
    }
    return realAuthApi.login(credentials);
  },

  logout: async (data: any) => {
    if (isDemoMode) {
      await delay(300);
      return mockApiResponse(null);
    }
    return realAuthApi.logout(data);
  },

  logoutAll: async () => {
    if (isDemoMode) {
      await delay(300);
      return mockApiResponse(null);
    }
    return realAuthApi.logoutAll();
  },

  refreshToken: async (data: any) => {
    if (isDemoMode) {
      await delay(300);
      return mockApiResponse({
        accessToken: 'demo_access_token_refreshed_' + Date.now()
      });
    }
    return realAuthApi.refreshToken(data);
  },

  getProfile: async () => {
    if (isDemoMode) {
      await delay(300);
      return mockApiResponse(mockUsers[0]);
    }
    return realAuthApi.getProfile();
  },

  changePassword: async (data: any) => {
    if (isDemoMode) {
      await delay(500);
      return mockApiResponse(null);
    }
    return realAuthApi.changePassword(data);
  },

  forgotPassword: async (email: string) => {
    if (isDemoMode) {
      await delay(500);
      return mockApiResponse(null);
    }
    return realAuthApi.forgotPassword(email);
  },

  resetPassword: async (data: any) => {
    if (isDemoMode) {
      await delay(500);
      return mockApiResponse(null);
    }
    return realAuthApi.resetPassword(data);
  }
};

// Demo Users API
export const usersApi = {
  getUsers: async (filters: UserFilters) => {
    if (isDemoMode) {
      await delay(400);
      let filteredUsers = [...mockUsers];
      
      // Apply filters
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.role?.name.toLowerCase().includes(search)
        );
      }
      
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role?.id === filters.role);
      }
      
      if (filters.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }
      
      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      return {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        pages: Math.ceil(filteredUsers.length / limit)
      };
    }
    return realUsersApi.getUsers(filters);
  },

  getUser: async (id: string) => {
    if (isDemoMode) {
      await delay(300);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return mockApiResponse(user);
    }
    return realUsersApi.getUser(id);
  },

  createUser: async (data: CreateUserData) => {
    if (isDemoMode) {
      await delay(600);
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: mockRoles.find(r => r.id === data.roleId) || mockRoles[0],
        isActive: true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return mockApiResponse(newUser);
    }
    return realUsersApi.createUser(data);
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    if (isDemoMode) {
      await delay(500);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      const updatedUser = {
        ...mockUsers[userIndex],
        ...data,
        role: data.roleId ? mockRoles.find(r => r.id === data.roleId) : mockUsers[userIndex].role,
        updatedAt: new Date().toISOString()
      };
      mockUsers[userIndex] = updatedUser;
      return mockApiResponse(updatedUser);
    }
    return realUsersApi.updateUser(id, data);
  },

  deleteUser: async (id: string) => {
    if (isDemoMode) {
      await delay(400);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      mockUsers.splice(userIndex, 1);
      return mockApiResponse(null);
    }
    return realUsersApi.deleteUser(id);
  },

  activateUser: async (id: string) => {
    if (isDemoMode) {
      await delay(300);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      user.isActive = true;
      user.updatedAt = new Date().toISOString();
      return mockApiResponse(user);
    }
    return realUsersApi.activateUser(id);
  },

  updateUserRoles: async (id: string, roles: string[]) => {
    if (isDemoMode) {
      await delay(400);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      user.role = mockRoles.find(r => r.id === roles[0]) || user.role;
      user.updatedAt = new Date().toISOString();
      return mockApiResponse(user);
    }
    return realUsersApi.updateUserRoles(id, roles);
  },

  toggleUserStatus: async (id: string, isActive: boolean) => {
    if (isDemoMode) {
      await delay(300);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      user.isActive = isActive;
      user.updatedAt = new Date().toISOString();
      return mockApiResponse(user);
    }
    return realUsersApi.toggleUserStatus(id, isActive);
  }
};

// Demo Roles API
export const rolesApi = {
  getRoles: async (filters: RoleFilters) => {
    if (isDemoMode) {
      await delay(400);
      let filteredRoles = [...mockRoles];
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredRoles = filteredRoles.filter(role =>
          role.name.toLowerCase().includes(search) ||
          role.description.toLowerCase().includes(search)
        );
      }
      
      if (filters.isActive !== undefined) {
        filteredRoles = filteredRoles.filter(role => role.isActive === filters.isActive);
      }
      
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
      
      return {
        roles: paginatedRoles,
        total: filteredRoles.length,
        page,
        pages: Math.ceil(filteredRoles.length / limit)
      };
    }
    return realRolesApi.getRoles(filters);
  },

  getRole: async (id: string) => {
    if (isDemoMode) {
      await delay(300);
      const role = mockRoles.find(r => r.id === id);
      if (!role) throw new Error('Role not found');
      return mockApiResponse(role);
    }
    return realRolesApi.getRole(id);
  },

  createRole: async (data: CreateRoleData) => {
    if (isDemoMode) {
      await delay(600);
      const newRole: Role = {
        id: (mockRoles.length + 1).toString(),
        name: data.name,
        description: data.description,
        permissions: data.permissionIds ? 
          mockPermissions.filter(p => data.permissionIds!.includes(p.id)) : [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRoles.push(newRole);
      return mockApiResponse(newRole);
    }
    return realRolesApi.createRole(data);
  },

  updateRole: async (id: string, data: UpdateRoleData) => {
    if (isDemoMode) {
      await delay(500);
      const roleIndex = mockRoles.findIndex(r => r.id === id);
      if (roleIndex === -1) throw new Error('Role not found');
      
      const updatedRole = {
        ...mockRoles[roleIndex],
        ...data,
        permissions: data.permissionIds ? 
          mockPermissions.filter(p => data.permissionIds!.includes(p.id)) : 
          mockRoles[roleIndex].permissions,
        updatedAt: new Date().toISOString()
      };
      mockRoles[roleIndex] = updatedRole;
      return mockApiResponse(updatedRole);
    }
    return realRolesApi.updateRole(id, data);
  },

  deleteRole: async (id: string) => {
    if (isDemoMode) {
      await delay(400);
      const roleIndex = mockRoles.findIndex(r => r.id === id);
      if (roleIndex === -1) throw new Error('Role not found');
      mockRoles.splice(roleIndex, 1);
      return mockApiResponse(null);
    }
    return realRolesApi.deleteRole(id);
  },

  updateRolePermissions: async (id: string, permissions: string[]) => {
    if (isDemoMode) {
      await delay(400);
      const role = mockRoles.find(r => r.id === id);
      if (!role) throw new Error('Role not found');
      role.permissions = mockPermissions.filter(p => permissions.includes(p.id));
      role.updatedAt = new Date().toISOString();
      return mockApiResponse(role);
    }
    return realRolesApi.updateRolePermissions(id, permissions);
  },

  getRoleUsers: async (id: string) => {
    if (isDemoMode) {
      await delay(400);
      const role = mockRoles.find(r => r.id === id);
      if (!role) throw new Error('Role not found');
      const users = mockUsers.filter(u => u.role?.id === id);
      return mockApiResponse({
        role,
        users,
        userCount: users.length
      });
    }
    return realRolesApi.getRoleUsers(id);
  }
};

// Demo Permissions API
export const permissionsApi = {
  getPermissions: async (filters: PermissionFilters) => {
    if (isDemoMode) {
      await delay(400);
      let filteredPermissions = [...mockPermissions];
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredPermissions = filteredPermissions.filter(permission =>
          permission.name.toLowerCase().includes(search) ||
          permission.description.toLowerCase().includes(search) ||
          permission.resource.toLowerCase().includes(search)
        );
      }
      
      if (filters.resource) {
        filteredPermissions = filteredPermissions.filter(p => p.resource === filters.resource);
      }
      
      if (filters.action) {
        filteredPermissions = filteredPermissions.filter(p => p.action === filters.action);
      }
      
      if (filters.isActive !== undefined) {
        filteredPermissions = filteredPermissions.filter(p => p.isActive === filters.isActive);
      }
      
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex);
      
      return {
        permissions: paginatedPermissions,
        total: filteredPermissions.length,
        page,
        pages: Math.ceil(filteredPermissions.length / limit)
      };
    }
    return realPermissionsApi.getPermissions(filters);
  },

  getGroupedPermissions: async () => {
    if (isDemoMode) {
      await delay(300);
      const grouped = mockPermissions.reduce((acc, permission) => {
        if (!acc[permission.resource]) {
          acc[permission.resource] = [];
        }
        acc[permission.resource].push(permission);
        return acc;
      }, {} as any);
      return mockApiResponse(grouped);
    }
    return realPermissionsApi.getGroupedPermissions();
  },

  getPermission: async (id: string) => {
    if (isDemoMode) {
      await delay(300);
      const permission = mockPermissions.find(p => p.id === id);
      if (!permission) throw new Error('Permission not found');
      const roles = mockRoles.filter(r => 
        r.permissions.some(p => p.id === id)
      );
      return mockApiResponse({ permission, roles });
    }
    return realPermissionsApi.getPermission(id);
  },

  createPermission: async (data: CreatePermissionData) => {
    if (isDemoMode) {
      await delay(600);
      const newPermission: Permission = {
        id: (mockPermissions.length + 1).toString(),
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockPermissions.push(newPermission);
      return mockApiResponse(newPermission);
    }
    return realPermissionsApi.createPermission(data);
  },

  createPermissionsBulk: async (permissions: CreatePermissionData[]) => {
    if (isDemoMode) {
      await delay(800);
      const newPermissions = permissions.map((data, index) => ({
        id: (mockPermissions.length + index + 1).toString(),
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      mockPermissions.push(...newPermissions);
      return mockApiResponse(newPermissions);
    }
    return realPermissionsApi.createPermissionsBulk(permissions);
  },

  updatePermission: async (id: string, data: UpdatePermissionData) => {
    if (isDemoMode) {
      await delay(500);
      const permissionIndex = mockPermissions.findIndex(p => p.id === id);
      if (permissionIndex === -1) throw new Error('Permission not found');
      
      const updatedPermission = {
        ...mockPermissions[permissionIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      mockPermissions[permissionIndex] = updatedPermission;
      return mockApiResponse(updatedPermission);
    }
    return realPermissionsApi.updatePermission(id, data);
  },

  deletePermission: async (id: string) => {
    if (isDemoMode) {
      await delay(400);
      const permissionIndex = mockPermissions.findIndex(p => p.id === id);
      if (permissionIndex === -1) throw new Error('Permission not found');
      mockPermissions.splice(permissionIndex, 1);
      return mockApiResponse(null);
    }
    return realPermissionsApi.deletePermission(id);
  },

  getResources: async () => {
    if (isDemoMode) {
      await delay(200);
      const resources = [...new Set(mockPermissions.map(p => p.resource))];
      return mockApiResponse(resources);
    }
    return realPermissionsApi.getResources();
  },

  getActions: async () => {
    if (isDemoMode) {
      await delay(200);
      const actions = [...new Set(mockPermissions.map(p => p.action))];
      return mockApiResponse(actions);
    }
    return realPermissionsApi.getActions();
  }
};

// Demo Audit API
export const auditApi = {
  getAuditLogs: async (filters: AuditFilters) => {
    if (isDemoMode) {
      await delay(500);
      let filteredLogs = [...mockAuditLogs];
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log =>
          log.action.toLowerCase().includes(search) ||
          log.resource.toLowerCase().includes(search) ||
          log.userEmail.toLowerCase().includes(search)
        );
      }
      
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      
      if (filters.resource) {
        filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
      }
      
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate);
      }
      
      // Sort by timestamp (newest first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
      
      return {
        logs: paginatedLogs,
        total: filteredLogs.length,
        page,
        pages: Math.ceil(filteredLogs.length / limit)
      };
    }
    return realAuditApi.getAuditLogs(filters);
  },

  getRecentActivity: async (limit = 5) => {
    if (isDemoMode) {
      await delay(300);
      const recentLogs = mockAuditLogs
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      return mockApiResponse(recentLogs);
    }
    return realAuditApi.getRecentActivity(limit);
  },

  getUserActivity: async (userId: string, limit = 10) => {
    if (isDemoMode) {
      await delay(400);
      const userLogs = mockAuditLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      return mockApiResponse(userLogs);
    }
    return realAuditApi.getUserActivity(userId, limit);
  },

  getAuditStats: async (days = 7) => {
    if (isDemoMode) {
      await delay(400);
      const now = new Date();
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      const recentLogs = mockAuditLogs.filter(log => 
        new Date(log.timestamp) >= startDate
      );
      
      const stats = {
        totalActions: recentLogs.length,
        uniqueUsers: new Set(recentLogs.map(log => log.userId)).size,
        actionsByType: recentLogs.reduce((acc, log) => {
          acc[log.action] = (acc[log.action] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        actionsByResource: recentLogs.reduce((acc, log) => {
          acc[log.resource] = (acc[log.resource] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        dailyActivity: Array.from({ length: days }, (_, i) => {
          const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dayStart = new Date(day.setHours(0, 0, 0, 0));
          const dayEnd = new Date(day.setHours(23, 59, 59, 999));
          const count = recentLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= dayStart && logDate <= dayEnd;
          }).length;
          return {
            date: dayStart.toISOString().split('T')[0],
            count
          };
        }).reverse()
      };
      
      return mockApiResponse(stats);
    }
    return realAuditApi.getAuditStats(days);
  },

  exportLogs: async (filters: any) => {
    if (isDemoMode) {
      await delay(1000);
      // Create a simple CSV blob for demo
      const csvContent = 'Timestamp,Action,Resource,User,Details\n' +
        mockAuditLogs.map(log => 
          `${log.timestamp},${log.action},${log.resource},${log.userEmail},"${JSON.stringify(log.metadata)}"`
        ).join('\n');
      return new Blob([csvContent], { type: 'text/csv' });
    }
    return realAuditApi.exportLogs(filters);
  }
};