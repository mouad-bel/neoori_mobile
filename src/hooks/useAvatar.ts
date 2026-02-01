import { useEffect, useState } from 'react';
import { useAuth } from '../store/AuthContext';
import apiClient from '../services/api/apiClient';
import API_CONFIG from '../config/api';

/**
 * Custom hook to load and manage avatar images with authentication
 * Automatically reloads when user avatar changes
 */
export const useAvatar = () => {
  const { user } = useAuth();
  const [avatarDataUri, setAvatarDataUri] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);

  // Helper function to fix localhost URLs
  const fixAvatarUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.includes('localhost')) {
      try {
        const apiBaseUrl = API_CONFIG.BASE_URL;
        const apiUrlObj = new URL(apiBaseUrl);
        const urlObj = new URL(url);
        urlObj.host = apiUrlObj.host;
        urlObj.protocol = apiUrlObj.protocol;
        return urlObj.toString();
      } catch (error) {
        return url;
      }
    }
    return url;
  };

  // Helper to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Load authenticated avatar image
  const loadAvatarImage = async (url: string) => {
    try {
      if (url.startsWith('file://')) {
        setAvatarDataUri(url);
        return;
      }

      const urlObj = new URL(url);
      const fullPath = urlObj.pathname;
      const apiPath = fullPath.startsWith('/api/') 
        ? fullPath.substring(4)
        : fullPath.startsWith('/')
        ? fullPath.substring(1)
        : fullPath;
      
      // Add cache-busting query parameter - use current timestamp
      const cacheBust = Date.now();
      const response = await apiClient.getClient().get(apiPath, {
        responseType: 'arraybuffer',
        params: { t: cacheBust }, // Add cache-busting as query parameter
      });

      const base64 = arrayBufferToBase64(response.data);
      const contentType = response.headers['content-type'] || 'image/jpeg';
      const dataUri = `data:${contentType};base64,${base64}`;
      setAvatarDataUri(dataUri);
    } catch (error: any) {
      console.error('Error loading avatar image:', error);
      setAvatarDataUri(null);
    }
  };

  useEffect(() => {
    // Clear old data URI first to force reload
    setAvatarDataUri(null);
    // Increment version to force Image component re-render
    setAvatarVersion(prev => prev + 1);
    
    if (user?.avatar) {
      // Add cache-busting parameter to force reload - use timestamp to ensure fresh load
      const fixedUrl = fixAvatarUrl(user.avatar);
      if (fixedUrl && fixedUrl.startsWith('http')) {
        // Always reload with fresh cache-busting
        const cacheBust = Date.now();
        try {
          const urlObj = new URL(fixedUrl);
          urlObj.searchParams.set('t', cacheBust.toString());
          const cacheBustedUrl = urlObj.toString();
          loadAvatarImage(cacheBustedUrl);
        } catch (error) {
          // If URL parsing fails, still try to load with cache-busting in API call
          loadAvatarImage(fixedUrl);
        }
      } else if (fixedUrl && fixedUrl.startsWith('file://')) {
        setAvatarDataUri(fixedUrl);
      } else {
        setAvatarDataUri(null);
      }
    } else {
      setAvatarDataUri(null);
    }
  }, [user?.avatar, user?.id, user?.updatedAt]); // Watch avatar, id, and updatedAt to catch any changes

  return {
    avatarDataUri,
    avatarVersion,
    avatarUrl: user?.avatar || null,
  };
};

