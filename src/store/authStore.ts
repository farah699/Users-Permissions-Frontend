import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { AuthStore, LoginCredentials, User, AuthTokens } from '../types';
import { authApi } from '../services/apiWrapper';
import { isDemoMode, mockUsers, demoCredentials, delay, mockApiResponse } from '../services/mockData';
import toast from 'react-hot-toast';

const TOKEN_COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: false, // Set to true in production
  sameSite: 'strict' as const,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          
          if (isDemoMode) {
            // Force demo mode - never call real API
            console.log('🚀 DEMO MODE: Using mock authentication');
            await delay(800);
            
            if (credentials.email === demoCredentials.email && 
                credentials.password === demoCredentials.password) {
              const demoUser = mockUsers[0]; // Admin user
              const mockTokens = {
                accessToken: 'demo_access_token_' + Date.now(),
                refreshToken: 'demo_refresh_token_' + Date.now()
              };
              
              // Store tokens in cookies
              Cookies.set('accessToken', mockTokens.accessToken, TOKEN_COOKIE_OPTIONS);
              Cookies.set('refreshToken', mockTokens.refreshToken, TOKEN_COOKIE_OPTIONS);
              
              set({
                user: demoUser,
                accessToken: mockTokens.accessToken,
                refreshToken: mockTokens.refreshToken,
                isAuthenticated: true,
                isLoading: false,
              });
              
              toast.success('🚀 Connexion démo réussie!');
              return;
            } else {
              throw new Error('Identifiants démo incorrects. Utilisez: admin@demo.com / demo123');
            }
          } else {
            // Real API call
            const response = await authApi.login(credentials);
            
            if (response.success && response.data) {
              const { user, accessToken, refreshToken } = response.data;
              
              // Store tokens in cookies
              Cookies.set('accessToken', accessToken, TOKEN_COOKIE_OPTIONS);
              Cookies.set('refreshToken', refreshToken, TOKEN_COOKIE_OPTIONS);
              
              set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
              });
              
              toast.success('Connexion réussie!');
            } else {
              throw new Error(response.message || 'Login failed');
            }
          }
        } catch (error: any) {
          set({ isLoading: false });
          const errorMessage = error.message || 'Échec de la connexion';
          toast.error(errorMessage);
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          const { refreshToken } = get();
          
          // Call logout API if we have a refresh token
          if (refreshToken) {
            await authApi.logout({ refreshToken });
          }
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          // Clear local storage and cookies regardless of API call success
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          toast.success('Logged out successfully');
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setTokens: (tokens: AuthTokens) => {
        const { accessToken, refreshToken } = tokens;
        
        // Update cookies
        Cookies.set('accessToken', accessToken, TOKEN_COOKIE_OPTIONS);
        Cookies.set('refreshToken', refreshToken, TOKEN_COOKIE_OPTIONS);
        
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await authApi.refreshToken({ refreshToken });
          
          if (response.success && response.data?.accessToken) {
            const newAccessToken = response.data.accessToken;
            
            // Update access token in cookie
            Cookies.set('accessToken', newAccessToken, TOKEN_COOKIE_OPTIONS);
            
            set({
              accessToken: newAccessToken,
              isAuthenticated: true,
            });
            
            return true;
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          
          // Clear tokens and redirect to login
          get().logout();
          return false;
        }
      },

      checkAuth: () => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        
        if (accessToken && refreshToken) {
          // Get user data from localStorage/store
          const storedUser = get().user;
          
          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
            user: storedUser,
          });
        } else {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user data, not tokens (they're in cookies)
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Initialize auth state from cookies on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}
