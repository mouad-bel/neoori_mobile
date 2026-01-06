import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, LoginRequest, RegisterRequest } from '../types';
import StorageService from '../services/storage/StorageService';
import authService from '../services/api/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await StorageService.getAuthToken();
      const user = await StorageService.getUserData();
      const refreshToken = await StorageService.getRefreshToken();

      if (token && user) {
        // Verify token is still valid by fetching current user
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            // Token is valid, update user data
            await StorageService.saveUserData(response.data);
            setAuthState({
              isAuthenticated: true,
              user: response.data,
              token,
              refreshToken: refreshToken || undefined,
            });
          } else {
            // Token invalid, try to refresh
            if (refreshToken) {
              await refreshAuth();
            } else {
              throw new Error('Invalid token');
            }
          }
        } catch (error) {
          // Token invalid, try to refresh
          if (refreshToken) {
            await refreshAuth();
          } else {
            // No valid auth, clear everything
            await StorageService.clearAll();
            setAuthState({
              isAuthenticated: false,
              user: null,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      await StorageService.clearAll();
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = await StorageService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await authService.refreshToken(refreshToken);
      if (response.success && response.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        await StorageService.saveAuthToken(accessToken);
        if (newRefreshToken) {
          await StorageService.saveRefreshToken(newRefreshToken);
        }

        // Fetch current user
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          await StorageService.saveUserData(userResponse.data);
          setAuthState({
            isAuthenticated: true,
            user: userResponse.data,
            token: accessToken,
            refreshToken: newRefreshToken || refreshToken,
          });
        }
      } else {
        throw new Error(response.error || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      await StorageService.clearAll();
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const loginData: LoginRequest = { email, password };
      const response = await authService.login(loginData);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Save tokens and user data
        await StorageService.saveAuthToken(accessToken);
        if (refreshToken) {
          await StorageService.saveRefreshToken(refreshToken);
        }
        await StorageService.saveUserData(user);

        setAuthState({
          isAuthenticated: true,
          user,
          token: accessToken,
          refreshToken: refreshToken || undefined,
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      
      const response = await authService.register(data);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Save tokens and user data
        await StorageService.saveAuthToken(accessToken);
        if (refreshToken) {
          await StorageService.saveRefreshToken(refreshToken);
        }
        await StorageService.saveUserData(user);

        setAuthState({
          isAuthenticated: true,
          user,
          token: accessToken,
          refreshToken: refreshToken || undefined,
        });
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      // Update user in storage and state without refreshing token
      await StorageService.saveUserData(updatedUser);
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout endpoint to invalidate tokens on server
      try {
        await authService.logout();
      } catch (error) {
        // Even if logout fails on server, clear local storage
        console.warn('Logout API call failed, clearing local storage anyway:', error);
      }
      
      // Clear local storage
      await StorageService.clearAll();
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if there's an error
      await StorageService.clearAll();
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        refreshAuth,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

