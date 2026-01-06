import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import StorageService from '../storage/StorageService';
import { ApiResponse } from '../../types';
import API_CONFIG from '../../config/api';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    // Log API configuration in development
    if (__DEV__) {
      console.log('🔗 API Client initialized with baseURL:', API_CONFIG.BASE_URL);
    }

    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await StorageService.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await StorageService.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            // Call refresh token endpoint
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}/auth/refresh`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            // Save new tokens
            await StorageService.saveAuthToken(accessToken);
            if (newRefreshToken) {
              await StorageService.saveRefreshToken(newRefreshToken);
            }

            // Update original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            // Process queued requests
            this.processQueue(null, accessToken);

            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            this.processQueue(refreshError, null);
            await StorageService.clearAll();
            // You might want to dispatch a logout action here
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Generic request methods
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      if (__DEV__) {
        console.log(`📤 POST ${url}`, data ? '(with data)' : '(no data)');
      }
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      if (__DEV__) {
        console.log(`📥 POST ${url} - Success`);
      }
      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.error(`❌ POST ${url} - Error:`, error);
      }
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // For file uploads
  async upload<T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    if (error.response) {
      // Server responded with error
      return {
        success: false,
        error: error.response.data?.error || error.response.data?.message || 'An error occurred',
        message: error.response.data?.message,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: 'No response from server. Please check your connection.',
      };
    } else {
      // Error setting up request
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  // Get the axios client instance for direct access (e.g., for file downloads)
  getClient(): AxiosInstance {
    return this.client;
  }
}

export default new ApiClient();

