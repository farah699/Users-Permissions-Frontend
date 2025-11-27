// Mock Data Service for Demo Mode
import { User, Role, Permission, AuditLog } from '../types/api';

// Demo Mode Flag
export const isDemoMode = true; // Set to false when backend is working

// Mock Permissions
export const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'users:read',
    description: 'View users',
    resource: 'users',
    action: 'read',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '2',
    name: 'users:write',
    description: 'Create and edit users',
    resource: 'users',
    action: 'write',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '3',
    name: 'users:delete',
    description: 'Delete users',
    resource: 'users',
    action: 'delete',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '4',
    name: 'roles:read',
    description: 'View roles',
    resource: 'roles',
    action: 'read',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '5',
    name: 'roles:write',
    description: 'Create and edit roles',
    resource: 'roles',
    action: 'write',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '6',
    name: 'permissions:read',
    description: 'View permissions',
    resource: 'permissions',
    action: 'read',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '7',
    name: 'audit:read',
    description: 'View audit logs',
    resource: 'audit',
    action: 'read',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  }
];

// Mock Roles
export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: mockPermissions,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access',
    permissions: mockPermissions.filter(p => !p.name.includes('delete')),
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '3',
    name: 'User Manager',
    description: 'User management access',
    permissions: mockPermissions.filter(p => p.resource === 'users'),
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: mockPermissions.filter(p => p.action === 'read'),
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Farah',
    lastName: 'Admin',
    email: 'admin@demo.com',
    role: mockRoles[0],
    isActive: true,
    lastLogin: new Date('2024-11-27T10:30:00Z').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-11-27').toISOString()
  },
  {
    id: '2',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@demo.com',
    role: mockRoles[1],
    isActive: true,
    lastLogin: new Date('2024-11-26T15:45:00Z').toISOString(),
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-11-26').toISOString()
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Dubois',
    email: 'pierre.dubois@demo.com',
    role: mockRoles[2],
    isActive: true,
    lastLogin: new Date('2024-11-25T09:20:00Z').toISOString(),
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-11-25').toISOString()
  },
  {
    id: '4',
    firstName: 'Marie',
    lastName: 'Leroy',
    email: 'marie.leroy@demo.com',
    role: mockRoles[3],
    isActive: true,
    lastLogin: new Date('2024-11-24T14:10:00Z').toISOString(),
    createdAt: new Date('2024-04-20').toISOString(),
    updatedAt: new Date('2024-11-24').toISOString()
  },
  {
    id: '5',
    firstName: 'Lucas',
    lastName: 'Moreau',
    email: 'lucas.moreau@demo.com',
    role: mockRoles[3],
    isActive: false,
    lastLogin: new Date('2024-10-15T11:30:00Z').toISOString(),
    createdAt: new Date('2024-05-12').toISOString(),
    updatedAt: new Date('2024-11-20').toISOString()
  },
  {
    id: '6',
    firstName: 'Emma',
    lastName: 'Rousseau',
    email: 'emma.rousseau@demo.com',
    role: mockRoles[2],
    isActive: true,
    lastLogin: new Date('2024-11-27T08:15:00Z').toISOString(),
    createdAt: new Date('2024-06-08').toISOString(),
    updatedAt: new Date('2024-11-27').toISOString()
  }
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'login',
    resource: 'auth',
    resourceId: '1',
    userId: '1',
    userEmail: 'admin@demo.com',
    metadata: { ip: '192.168.1.100', userAgent: 'Chrome/119.0' },
    timestamp: new Date('2024-11-27T10:30:00Z').toISOString()
  },
  {
    id: '2',
    action: 'create',
    resource: 'user',
    resourceId: '6',
    userId: '1',
    userEmail: 'admin@demo.com',
    metadata: { targetUser: 'emma.rousseau@demo.com' },
    timestamp: new Date('2024-11-27T09:45:00Z').toISOString()
  },
  {
    id: '3',
    action: 'update',
    resource: 'user',
    resourceId: '5',
    userId: '2',
    userEmail: 'sophie.martin@demo.com',
    metadata: { changes: ['isActive'], previousValue: 'true', newValue: 'false' },
    timestamp: new Date('2024-11-26T16:20:00Z').toISOString()
  },
  {
    id: '4',
    action: 'login',
    resource: 'auth',
    resourceId: '2',
    userId: '2',
    userEmail: 'sophie.martin@demo.com',
    metadata: { ip: '192.168.1.105', userAgent: 'Firefox/120.0' },
    timestamp: new Date('2024-11-26T15:45:00Z').toISOString()
  },
  {
    id: '5',
    action: 'create',
    resource: 'role',
    resourceId: '4',
    userId: '1',
    userEmail: 'admin@demo.com',
    metadata: { roleName: 'Viewer', permissions: ['users:read', 'roles:read'] },
    timestamp: new Date('2024-11-25T14:30:00Z').toISOString()
  },
  {
    id: '6',
    action: 'update',
    resource: 'role',
    resourceId: '3',
    userId: '1',
    userEmail: 'admin@demo.com',
    metadata: { changes: ['permissions'], addedPermissions: ['users:delete'] },
    timestamp: new Date('2024-11-25T11:15:00Z').toISOString()
  },
  {
    id: '7',
    action: 'logout',
    resource: 'auth',
    resourceId: '3',
    userId: '3',
    userEmail: 'pierre.dubois@demo.com',
    metadata: { sessionDuration: '2h 15m' },
    timestamp: new Date('2024-11-25T11:35:00Z').toISOString()
  },
  {
    id: '8',
    action: 'login',
    resource: 'auth',
    resourceId: '3',
    userId: '3',
    userEmail: 'pierre.dubois@demo.com',
    metadata: { ip: '192.168.1.110', userAgent: 'Safari/17.0' },
    timestamp: new Date('2024-11-25T09:20:00Z').toISOString()
  }
];

// Demo login credentials
export const demoCredentials = {
  email: 'admin@demo.com',
  password: 'demo123'
};

// Helper functions to simulate API delays
export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApiResponse = <T>(data: T, success: boolean = true) => ({
  success,
  data,
  message: success ? 'Operation successful' : 'Operation failed'
});

export const mockPaginatedResponse = <T>(data: T[], page: number = 1, limit: number = 10) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total: Array.isArray(data) ? data.length : 0,
    pages: Array.isArray(data) ? Math.ceil(data.length / limit) : 1
  }
});