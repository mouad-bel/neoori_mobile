import apiClient from './apiClient';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ApiResponse,
  User,
  RefreshTokenResponse,
} from '../../types';

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/register', data);
  }

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  }

  /**
   * Login with OAuth (Google/Apple)
   */
  async loginWithOAuth(
    provider: 'google' | 'apple',
    token: string
  ): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(`/auth/oauth/${provider}`, { token });
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
  }

  /**
   * Logout (invalidate tokens on server)
   */
  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/logout');
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/password-reset/request', { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/password-reset/reset', { token, newPassword });
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/verify-email', { token });
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/verify-email/resend');
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me');
  }
}

export default new AuthService();

