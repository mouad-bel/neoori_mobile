import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserEducation, UserExperience, UserSkill, UserDocument } from '../types';
import profileService from '../services/api/profileService';
import { useAuth } from '../store/AuthContext';

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<Pick<UserProfile, 'bio' | 'location' | 'careerPath' | 'phone'>>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>;
  // Education
  addEducation: (education: Omit<UserEducation, 'id' | 'createdAt'>) => Promise<void>;
  updateEducation: (id: string, education: Partial<Omit<UserEducation, 'id' | 'createdAt'>>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  // Experiences
  addExperience: (experience: Omit<UserExperience, 'id' | 'createdAt'>) => Promise<void>;
  updateExperience: (id: string, experience: Partial<Omit<UserExperience, 'id' | 'createdAt'>>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  // Skills
  addSkill: (skill: Omit<UserSkill, 'id' | 'createdAt'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Omit<UserSkill, 'id' | 'createdAt'>>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  // Documents
  uploadDocument: (file: any, category?: string, onProgress?: (progress: number) => void) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  uploadAvatar: (file: any) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const { isAuthenticated, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (
    data: Partial<Pick<UserProfile, 'bio' | 'location' | 'careerPath' | 'phone'>>
  ) => {
    try {
      setError(null);
      const response = await profileService.updateProfile(data);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  }, []);

  const updatePreferences = useCallback(async (
    preferences: Partial<UserProfile['preferences']>
  ) => {
    try {
      setError(null);
      const response = await profileService.updatePreferences(preferences);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to update preferences');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      throw err;
    }
  }, []);

  // Education methods
  const addEducation = useCallback(async (
    education: Omit<UserEducation, 'id' | 'createdAt'>
  ) => {
    try {
      setError(null);
      const response = await profileService.addEducation(education);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to add education');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add education');
      throw err;
    }
  }, []);

  const updateEducation = useCallback(async (
    id: string,
    education: Partial<Omit<UserEducation, 'id' | 'createdAt'>>
  ) => {
    try {
      setError(null);
      const response = await profileService.updateEducation(id, education);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to update education');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update education');
      throw err;
    }
  }, []);

  const deleteEducation = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await profileService.deleteEducation(id);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to delete education');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete education');
      throw err;
    }
  }, []);

  // Experience methods
  const addExperience = useCallback(async (
    experience: Omit<UserExperience, 'id' | 'createdAt'>
  ) => {
    try {
      setError(null);
      const response = await profileService.addExperience(experience);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to add experience');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add experience');
      throw err;
    }
  }, []);

  const updateExperience = useCallback(async (
    id: string,
    experience: Partial<Omit<UserExperience, 'id' | 'createdAt'>>
  ) => {
    try {
      setError(null);
      const response = await profileService.updateExperience(id, experience);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to update experience');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update experience');
      throw err;
    }
  }, []);

  const deleteExperience = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await profileService.deleteExperience(id);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to delete experience');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete experience');
      throw err;
    }
  }, []);

  // Skill methods
  const addSkill = useCallback(async (
    skill: Omit<UserSkill, 'id' | 'createdAt'>
  ) => {
    try {
      setError(null);
      const response = await profileService.addSkill(skill);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to add skill');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add skill');
      throw err;
    }
  }, []);

  const updateSkill = useCallback(async (
    id: string,
    skill: Partial<Omit<UserSkill, 'id' | 'createdAt'>>
  ) => {
    try {
      setError(null);
      const response = await profileService.updateSkill(id, skill);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to update skill');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update skill');
      throw err;
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await profileService.deleteSkill(id);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to delete skill');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete skill');
      throw err;
    }
  }, []);

  // Document methods
  const uploadDocument = useCallback(async (
    file: any,
    category: string = 'other',
    onProgress?: (progress: number) => void
  ) => {
    try {
      setError(null);
      const response = await profileService.uploadDocument(file, category, onProgress);
      
      if (response.success && response.data) {
        // Refresh profile to get updated documents list
        await refreshProfile();
      } else {
        throw new Error(response.error || 'Failed to upload document');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
      throw err;
    }
  }, [refreshProfile]);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await profileService.deleteDocument(id);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to delete document');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
      throw err;
    }
  }, []);

  // Avatar upload
  const uploadAvatar = useCallback(async (file: any) => {
    try {
      setError(null);
      const response = await profileService.uploadAvatar(file);
      
      if (response.success && response.data) {
        // Avatar URL is stored in User table, not profile
        // Update the user object in AuthContext directly with the returned user data
        if (response.data.user && updateUser) {
          await updateUser(response.data.user);
        }
        // Don't refresh profile here to avoid infinite loops - the user update is enough
      } else {
        throw new Error(response.error || 'Failed to upload avatar');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
      throw err;
    }
  }, [updateUser]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
    updateProfile,
    updatePreferences,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    updateSkill,
    deleteSkill,
    uploadDocument,
    deleteDocument,
    uploadAvatar,
  };
};

