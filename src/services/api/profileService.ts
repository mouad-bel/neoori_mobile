import apiClient from './apiClient';
import {
  ApiResponse,
  UserProfile,
  UserEducation,
  UserExperience,
  UserSkill,
  UserDocument,
  UserPreferences,
} from '../../types';

class ProfileService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/users/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(
    data: Partial<Pick<UserProfile, 'bio' | 'location' | 'careerPath' | 'phone'>>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/users/profile', data);
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/users/change-password', {
      currentPassword,
      newPassword,
    });
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/users/profile/preferences', { preferences });
  }

  // Education
  /**
   * Add education entry
   */
  async addEducation(education: Omit<UserEducation, 'id' | 'createdAt'>): Promise<ApiResponse<UserProfile>> {
    return apiClient.post<UserProfile>('/users/profile/education', education);
  }

  /**
   * Update education entry
   */
  async updateEducation(
    id: string,
    education: Partial<Omit<UserEducation, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>(`/users/profile/education/${id}`, education);
  }

  /**
   * Delete education entry
   */
  async deleteEducation(id: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.delete<UserProfile>(`/users/profile/education/${id}`);
  }

  // Experiences
  /**
   * Add experience entry
   */
  async addExperience(
    experience: Omit<UserExperience, 'id' | 'createdAt'>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.post<UserProfile>('/users/profile/experiences', experience);
  }

  /**
   * Update experience entry
   */
  async updateExperience(
    id: string,
    experience: Partial<Omit<UserExperience, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>(`/users/profile/experiences/${id}`, experience);
  }

  /**
   * Delete experience entry
   */
  async deleteExperience(id: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.delete<UserProfile>(`/users/profile/experiences/${id}`);
  }

  // Skills
  /**
   * Add skill
   */
  async addSkill(skill: Omit<UserSkill, 'id' | 'createdAt'>): Promise<ApiResponse<UserProfile>> {
    return apiClient.post<UserProfile>('/users/profile/skills', skill);
  }

  /**
   * Update skill
   */
  async updateSkill(
    id: string,
    skill: Partial<Omit<UserSkill, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>(`/users/profile/skills/${id}`, skill);
  }

  /**
   * Delete skill
   */
  async deleteSkill(id: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.delete<UserProfile>(`/users/profile/skills/${id}`);
  }

  // Documents
  /**
   * Upload document
   */
  async uploadDocument(
    file: any, // File object from document picker
    category: string = 'other',
    onUploadProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ document: UserDocument }>> {
    const formData = new FormData();
    formData.append('document', {
      uri: file.uri,
      type: file.mimeType || 'application/octet-stream',
      name: file.name || 'document',
    } as any);
    formData.append('category', category);

    return apiClient.upload<{ document: UserDocument }>(
      '/users/profile/documents',
      formData,
      onUploadProgress
    );
  }

  /**
   * Delete document
   */
  async deleteDocument(id: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.delete<UserProfile>(`/users/profile/documents/${id}`);
  }

  /**
   * Get document URL (for viewing/downloading)
   */
  getDocumentUrl(document: UserDocument): string {
    // The URL is already stored in the document object
    return document.url;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(
    file: any, // File object from image picker
    onUploadProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ avatar: string; user: any }>> {
    const formData = new FormData();
    formData.append('avatar', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'avatar.jpg',
    } as any);

    return apiClient.upload<{ avatar: string; user: any }>(
      '/users/profile/avatar',
      formData,
      onUploadProgress
    );
  }
}

export default new ProfileService();

