// Complete Mock API replacement - bypasses real API entirely in demo mode
import { isDemoMode } from './mockData';
import * as demoApi from './demoApi';
import * as realApi from './api';

// Export the appropriate API based on demo mode
export const authApi = isDemoMode ? demoApi.authApi : realApi.authApi;
export const usersApi = isDemoMode ? demoApi.usersApi : realApi.usersApi;
export const rolesApi = isDemoMode ? demoApi.rolesApi : realApi.rolesApi;
export const permissionsApi = isDemoMode ? demoApi.permissionsApi : realApi.permissionsApi;
export const auditApi = isDemoMode ? demoApi.auditApi : realApi.auditApi;

// Export API client for any direct usage
export const apiClient = isDemoMode ? null : realApi.apiClient;
export { default as api } from './api';