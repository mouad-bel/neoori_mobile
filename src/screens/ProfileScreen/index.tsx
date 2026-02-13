import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import { MainDrawerParamList } from '../../types';
import apiClient from '../../services/api/apiClient';
import StorageService from '../../services/storage/StorageService';
import API_CONFIG from '../../config/api';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

const ProfileScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const { user, refreshAuth } = useAuth();
  const { profile, loading, updateProfile, addEducation, updateEducation, deleteEducation, addExperience, updateExperience, deleteExperience, addSkill, updateSkill, deleteSkill, uploadDocument, deleteDocument, uploadAvatar, refreshProfile } = useProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [addressText, setAddressText] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarDataUri, setAvatarDataUri] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0); // Increment to force Image re-render
  const [isReloadingAvatar, setIsReloadingAvatar] = useState(false); // Hide image during reload
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [educationForm, setEducationForm] = useState({ degree: '', school: '', year: '' });
  const [experienceForm, setExperienceForm] = useState({ title: '', company: '', period: '', description: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [isPickingDocument, setIsPickingDocument] = useState(false);
  const isPickingDocumentRef = useRef(false);
  const [isOpeningDocument, setIsOpeningDocument] = useState(false);
  const isOpeningDocumentRef = useRef(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const scrollPositionRef = useRef(0);
  const [synthesis, setSynthesis] = useState<any>(null);
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [synthesisStatus, setSynthesisStatus] = useState<'idle' | 'cooldown' | 'up_to_date' | 'incomplete'>('idle');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [missingSections, setMissingSections] = useState<string[]>([]);
  const [completenessPercent, setCompletenessPercent] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to fix localhost URLs for iOS
  const fixAvatarUrl = (url: string | null | undefined, addCacheBust: boolean = false): string | null => {
    if (!url) return null;
    
    // If URL contains localhost, replace with API base URL's host
    let fixedUrl = url;
    if (url.includes('localhost')) {
      try {
        const apiBaseUrl = API_CONFIG.BASE_URL; // e.g., http://192.168.1.128:3000/api
        const apiUrlObj = new URL(apiBaseUrl);
        const urlObj = new URL(url);
        
        // Replace localhost with the API host
        urlObj.host = apiUrlObj.host;
        urlObj.protocol = apiUrlObj.protocol;
        
        fixedUrl = urlObj.toString();
        console.log('Fixed avatar URL from', url, 'to', fixedUrl);
      } catch (error) {
        console.error('Error fixing avatar URL:', error);
        fixedUrl = url;
      }
    }
    
    // Add cache-busting query parameter to force image reload
    if (addCacheBust && fixedUrl.startsWith('http')) {
      try {
        const urlObj = new URL(fixedUrl);
        urlObj.searchParams.set('t', Date.now().toString());
        fixedUrl = urlObj.toString();
        console.log('Added cache-bust to avatar URL:', fixedUrl);
      } catch (error) {
        console.error('Error adding cache-bust to avatar URL:', error);
      }
    }
    
    return fixedUrl;
  };

  // Load authenticated avatar image
  const loadAvatarImage = async (url: string) => {
    try {
      // If it's a local file URI, use it directly
      if (url.startsWith('file://')) {
        setAvatarDataUri(url);
        return;
      }

      // Clear old data URI first to force reload
      setAvatarDataUri(null);
      
      // Extract the API path from the full URL (remove query params for API call)
      // URL format: http://192.168.1.128:3000/api/files/avatars/userId/filename?t=123456
      // BASE_URL: http://192.168.1.128:3000/api
      // So we need: /files/avatars/userId/filename (without /api prefix and query params)
      const urlObj = new URL(url);
      const fullPath = urlObj.pathname; // e.g., /api/files/avatars/userId/filename
      
      // Remove /api prefix if present (since apiClient already adds it)
      const apiPath = fullPath.startsWith('/api/') 
        ? fullPath.substring(4) // Remove /api
        : fullPath.startsWith('/')
        ? fullPath.substring(1) // Remove leading /
        : fullPath;
      
      console.log('Loading avatar image from API path:', apiPath, '(full path:', fullPath, ')');
      
      // Fetch image with authentication using apiClient
      // Add cache-busting as a query parameter in the request config, not in the path
      const cacheBust = Date.now();
      const response = await apiClient.getClient().get(apiPath, {
        responseType: 'arraybuffer',
        params: { t: cacheBust }, // Add cache-busting as query parameter
      });

      // Convert ArrayBuffer to base64
      const base64 = arrayBufferToBase64(response.data);
      const contentType = response.headers['content-type'] || 'image/jpeg';
      const dataUri = `data:${contentType};base64,${base64}`;
      
      console.log('Avatar image loaded successfully as data URI');
      setAvatarDataUri(dataUri);
    } catch (error: any) {
      console.error('Error loading avatar image:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      // Don't set fallback - let it show placeholder instead
      setAvatarDataUri(null);
    }
  };

  React.useEffect(() => {
    if (profile?.bio) {
      setBioText(profile.bio);
    }
    if (profile?.location?.address) {
      setAddressText(profile.location.address);
    }
    // Only update avatar from user if it hasn't been changed by the user
    if (!avatarChanged) {
      if (user?.avatar) {
        // Add cache-busting parameter to force image reload after upload
        const fixedAvatarUrl = fixAvatarUrl(user.avatar, true);
        console.log('Setting avatarUri from user.avatar:', user.avatar, 'fixed to:', fixedAvatarUrl);
        // Always update to ensure cache-busting works and image reloads
        setAvatarUri(fixedAvatarUrl);
        
        // Always load HTTP URLs through loadAvatarImage for authentication
        // Only use file:// URIs directly
        if (fixedAvatarUrl && fixedAvatarUrl.startsWith('http')) {
          // Load with authentication - this will set avatarDataUri
          loadAvatarImage(fixedAvatarUrl).catch((error) => {
            console.error('Failed to load avatar image:', error);
            setAvatarDataUri(null);
          });
        } else if (fixedAvatarUrl && fixedAvatarUrl.startsWith('file://')) {
          setAvatarDataUri(fixedAvatarUrl);
        } else {
          setAvatarDataUri(null);
        }
      } else {
        console.log('No user avatar found, user:', user);
        setAvatarDataUri(null);
      }
    } else {
      console.log('🔄 Avatar changed by user, keeping selected image:', avatarUri);
    }
  }, [profile, user?.avatar, avatarChanged]);

  // Restore scroll position after profile updates (e.g., after document upload)
  useEffect(() => {
    if (profile && scrollPositionRef.current > 0 && scrollViewRef.current && !isUploading) {
      // Small delay to ensure DOM has updated after profile refresh
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: scrollPositionRef.current,
          animated: false,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [profile, isUploading]);

  const getDocumentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'document-text';
      case 'doc':
      case 'docx':
        return 'document';
      default:
        return 'document-outline';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Helper function to convert ArrayBuffer to base64 (React Native compatible)
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Use btoa if available (web), otherwise use the polyfill
    if (typeof btoa !== 'undefined') {
      return btoa(binary);
    }
    // React Native polyfill for btoa
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    for (let i = 0; i < binary.length; i += 3) {
      const a = binary.charCodeAt(i);
      const b = i + 1 < binary.length ? binary.charCodeAt(i + 1) : 0;
      const c = i + 2 < binary.length ? binary.charCodeAt(i + 2) : 0;
      const bitmap = (a << 16) | (b << 8) | c;
      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += i + 1 < binary.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      result += i + 2 < binary.length ? chars.charAt(bitmap & 63) : '=';
    }
    return result;
  };

  const handleOpenDocument = async (doc: any) => {
    // Prevent opening if already opening or picking
    if (isOpeningDocumentRef.current || isPickingDocumentRef.current) {
      console.log('⚠️ Document opening blocked - already in progress');
      return;
    }

    console.log('📄 Starting to open document:', doc.name);
    isOpeningDocumentRef.current = true;
    setIsOpeningDocument(true);
    setDownloadingDocumentId(doc.id);
    setDownloadProgress(0);

    // Safety timeout: reset state after 10 seconds if something goes wrong
    const timeoutId = setTimeout(() => {
      if (isOpeningDocumentRef.current) {
        console.warn('⏱️ Document opening timeout - resetting state');
        isOpeningDocumentRef.current = false;
        setIsOpeningDocument(false);
        setDownloadingDocumentId(null);
        setDownloadProgress(0);
      }
    }, 10000);

    try {
      if (!doc.url) {
        Alert.alert('Erreur', 'URL du document non disponible');
        return;
      }

      // Extract the API path from the full URL
      // URL format: http://localhost:3000/api/files/documents/userId/category/filename
      // API base: http://localhost:3000/api
      // So we need: /files/documents/userId/category/filename
      const urlObj = new URL(doc.url);
      const apiPath = urlObj.pathname; // This gives us /api/files/documents/...
      // Remove /api prefix since apiClient already includes it
      const endpoint = apiPath.replace(/^\/api/, '');

      // Get auth token
      const token = await StorageService.getAuthToken();
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté pour ouvrir ce document');
        return;
      }

      // Download file using axios with auth token and progress tracking
      const axiosClient = apiClient.getClient();
      const response = await axiosClient.get(endpoint, {
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadProgress(progress);
            console.log('📥 Download progress:', progress + '%');
          }
        },
      });

      // Convert arraybuffer to base64
      const base64 = arrayBufferToBase64(response.data);

      // Create temporary file path
      const fileExtension = doc.name?.split('.').pop() || doc.type || 'pdf';
      const tempFileName = `${doc.id || Date.now()}.${fileExtension}`;
      const fileUri = `${FileSystem.documentDirectory}${tempFileName}`;

      // Save file to device
      // Use base64 encoding to write binary file
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Verify file was saved
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('File was not saved correctly');
      }

      // Open file with system default app
      // On iOS: Sharing.shareAsync shows share sheet where user can choose app to open
      // On Android: Use IntentLauncher for direct opening
      try {
        if (Platform.OS === 'android') {
          // Android: Use IntentLauncher for direct opening
          try {
            const contentUri = await FileSystem.getContentUriAsync(fileUri);
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: contentUri,
              flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
              type: doc.mimeType || 'application/pdf',
            });
          } catch (intentError: any) {
            // Fallback to Sharing on Android
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
              await Sharing.shareAsync(fileUri, {
                mimeType: doc.mimeType || 'application/pdf',
              });
            } else {
              throw new Error('IntentLauncher and Sharing both failed');
            }
          }
        } else {
          // iOS: Use Sharing - it shows share sheet where user can choose app to open
          // Note: User must select an app from the share sheet to open the file
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(fileUri, {
              mimeType: doc.mimeType || 'application/pdf',
              UTI: doc.type ? `public.${doc.type}` : 'public.data',
            });
          } else {
            throw new Error('Sharing not available on iOS');
          }
        }
      } catch (openError: any) {
        // File was downloaded successfully, but couldn't be opened
        Alert.alert(
          'Document téléchargé',
          'Le document a été téléchargé avec succès mais n\'a pas pu être ouvert automatiquement. Veuillez consulter le fichier depuis votre gestionnaire de fichiers.'
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        'Impossible de télécharger ou d\'ouvrir ce document: ' + (error.response?.data?.error || error.message || 'Erreur inconnue')
      );
    } finally {
      // Clear timeout and reset state after opening document
      clearTimeout(timeoutId);
      console.log('✅ Document opening completed - resetting state');
      isOpeningDocumentRef.current = false;
      setIsOpeningDocument(false);
      setDownloadingDocumentId(null);
      // Reset progress after a short delay
      setTimeout(() => {
        setDownloadProgress(0);
      }, 500);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  };

  const handleSaveBio = async () => {
    try {
      await updateProfile({ bio: bioText });
      setEditingBio(false);
      Alert.alert('Succès', 'Bio mise à jour avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de la mise à jour');
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('ImagePicker result:', JSON.stringify(result, null, 2));
      
      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        console.log('Selected image URI:', selectedUri);
        console.log('Image asset:', JSON.stringify(result.assets[0], null, 2));
        setAvatarUri(selectedUri);
        // For local files, use directly
        setAvatarDataUri(selectedUri);
        // Mark that avatar has changed
        setAvatarChanged(true);
        console.log('✅ Avatar changed - will upload on save');
      } else {
        console.log('Image selection canceled or no asset');
      }
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const handleSaveProfile = async () => {
    console.log('💾 Saving profile...', { 
      avatarChanged, 
      avatarUri, 
      isHttp: avatarUri?.startsWith('http'),
      avatarUriType: typeof avatarUri,
      avatarUriLength: avatarUri?.length
    });
    try {
      // If avatar was changed, upload it first
      // Check if it's a local file (file://, content://, ph://, or expo://)
      const isLocalFile = avatarUri && (
        avatarUri.startsWith('file://') || 
        avatarUri.startsWith('content://') || 
        avatarUri.startsWith('ph://') ||
        avatarUri.startsWith('expo://') ||
        (!avatarUri.startsWith('http') && !avatarUri.startsWith('https') && !avatarUri.startsWith('data:'))
      );
      
      console.log('🔍 Avatar upload check:', { 
        avatarChanged, 
        avatarUri, 
        isLocalFile,
        uriStart: avatarUri?.substring(0, 20)
      });
      
      if (avatarChanged && avatarUri && isLocalFile) {
        console.log('📤 Uploading avatar:', avatarUri);
        try {
          // Get file info - need to detect mime type from URI extension
          // Handle URIs with query parameters: file://path/image.jpg?timestamp=123
          const uriWithoutQuery = avatarUri.split('?')[0];
          const uriParts = uriWithoutQuery.split('.');
          const extension = uriParts.length > 1 ? uriParts[uriParts.length - 1].toLowerCase() : 'jpg';
          const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
          };
          
          // Create file object from URI
          const file = {
            uri: avatarUri,
            type: mimeTypes[extension] || 'image/jpeg',
            name: `avatar.${extension}`,
          };

          console.log('📤 Avatar file object:', file);
          console.log('📤 Extension detected:', extension, 'MIME type:', file.type);
          await uploadAvatar(file);
          console.log('✅ Avatar uploaded successfully');
          // Hide image and clear data URI to force complete reload
          setIsReloadingAvatar(true);
          setAvatarDataUri(null);
          // Increment avatar version to force Image component re-render
          setAvatarVersion(prev => {
            const newVersion = prev + 1;
            console.log(`🔄 Avatar version incremented: ${prev} -> ${newVersion}`);
            return newVersion;
          });
          // Reset the changed flag BEFORE refreshAuth so the useEffect can update to the new HTTP URL
          // This ensures that when refreshAuth updates the user state, the useEffect will pick up the new avatar URL
          setAvatarChanged(false);
          console.log('🔄 Avatar changed flag reset to false');
          // uploadAvatar already updates the user in AuthContext via updateUser
          // Refresh auth to get updated user with new avatar URL
          await refreshAuth();
          console.log('🔄 refreshAuth completed, user state should be updated');
          // Small delay to ensure state updates propagate before reloading image
          await new Promise(resolve => setTimeout(resolve, 200));
          // Re-enable image display after reload
          setIsReloadingAvatar(false);
        } catch (error: any) {
          console.error('❌ Upload error:', error);
          console.error('❌ Error details:', error.response?.data || error.message);
          Alert.alert('Erreur', 'Échec de l\'upload de l\'avatar: ' + (error.message || 'Erreur inconnue'));
          return;
        }
      } else if (avatarChanged && avatarUri && avatarUri.startsWith('http')) {
        // If avatar is already an HTTP URL, it means it's already uploaded, just reset the flag
        console.log('ℹ️ Avatar already uploaded (HTTP URL), skipping upload');
        setAvatarChanged(false);
      } else if (!avatarChanged) {
        console.log('ℹ️ Avatar not changed, skipping upload');
      } else {
        console.log('⚠️ Avatar upload condition not met:', { avatarChanged, avatarUri, isHttp: avatarUri?.startsWith('http') });
      }

      // Update profile data
      const updateData: any = {
        bio: bioText,
        location: {
          ...profile?.location,
          address: addressText,
        },
      };

      await updateProfile(updateData);
      setShowEditProfileModal(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de la mise à jour');
    }
  };

  const handleAddEducation = () => {
    setEditingEducationId(null);
    setEducationForm({ degree: '', school: '', year: '' });
    setShowEducationModal(true);
  };

  const handleEditEducation = (edu: any) => {
    setEditingEducationId(edu.id);
    setEducationForm({ degree: edu.degree || '', school: edu.school || '', year: edu.year || '' });
    setShowEducationModal(true);
  };

  const handleSaveEducation = async () => {
    if (!educationForm.degree || !educationForm.school || !educationForm.year) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      if (editingEducationId) {
        await updateEducation(editingEducationId, educationForm);
        Alert.alert('Succès', 'Formation modifiée avec succès');
      } else {
        await addEducation(educationForm);
        Alert.alert('Succès', 'Formation ajoutée avec succès');
      }
      setShowEducationModal(false);
      setEditingEducationId(null);
      setEducationForm({ degree: '', school: '', year: '' });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de l\'opération');
    }
  };

  const handleAddExperience = () => {
    setEditingExperienceId(null);
    setExperienceForm({ title: '', company: '', period: '', description: '' });
    setShowExperienceModal(true);
  };

  const handleEditExperience = (exp: any) => {
    setEditingExperienceId(exp.id);
    setExperienceForm({ 
      title: exp.title || '', 
      company: exp.company || '', 
      period: exp.period || '', 
      description: exp.description || '' 
    });
    setShowExperienceModal(true);
  };

  const handleSaveExperience = async () => {
    if (!experienceForm.title || !experienceForm.company || !experienceForm.period) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      if (editingExperienceId) {
        await updateExperience(editingExperienceId, experienceForm);
        Alert.alert('Succès', 'Expérience modifiée avec succès');
      } else {
        await addExperience(experienceForm);
        Alert.alert('Succès', 'Expérience ajoutée avec succès');
      }
      setShowExperienceModal(false);
      setEditingExperienceId(null);
      setExperienceForm({ title: '', company: '', period: '', description: '' });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de l\'opération');
    }
  };

  const handleAddSkill = () => {
    setEditingSkillId(null);
    setSkillForm({ name: '', level: '' });
    setShowSkillModal(true);
  };

  const handleEditSkill = (skill: any) => {
    setEditingSkillId(skill.id);
    setSkillForm({ name: skill.name || '', level: skill.level?.toString() || '' });
    setShowSkillModal(true);
  };

  const handleSaveSkill = async () => {
    if (!skillForm.name || !skillForm.level) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    const level = parseInt(skillForm.level, 10);
    if (isNaN(level) || level < 0 || level > 100) {
      Alert.alert('Erreur', 'Le niveau doit être entre 0 et 100');
      return;
    }
    try {
      if (editingSkillId) {
        await updateSkill(editingSkillId, { name: skillForm.name, level });
        Alert.alert('Succès', 'Compétence modifiée avec succès');
      } else {
        await addSkill({ name: skillForm.name, level });
        Alert.alert('Succès', 'Compétence ajoutée avec succès');
      }
      setShowSkillModal(false);
      setEditingSkillId(null);
      setSkillForm({ name: '', level: '' });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de l\'opération');
    }
  };

  const handleUploadDocument = async () => {
    // Prevent multiple simultaneous picker calls using ref for immediate check
    // Also prevent if a document is currently being opened (share sheet is open)
    if (isPickingDocumentRef.current || isOpeningDocumentRef.current) {
      console.log('⚠️ Document upload blocked - isPicking:', isPickingDocumentRef.current, 'isOpening:', isOpeningDocumentRef.current);
      return;
    }

    console.log('📤 Starting document picker');
    // Set both state and ref immediately (synchronously)
    isPickingDocumentRef.current = true;
    setIsPickingDocument(true);

    // Safety timeout: reset state after 30 seconds if something goes wrong
    const timeoutId = setTimeout(() => {
      if (isPickingDocumentRef.current) {
        console.warn('Document picking timeout - resetting state');
        isPickingDocumentRef.current = false;
        setIsPickingDocument(false);
      }
    }, 30000);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        setIsUploading(true);
        setUploadProgress(0);

        try {
          await uploadDocument(file, 'other', (progress) => {
            setUploadProgress(progress);
            console.log('📊 Upload progress:', progress + '%');
          });
          setUploadProgress(100);
          Alert.alert('Succès', 'Document uploadé avec succès');
        } catch (uploadError: any) {
          // Error already shown by uploadDocument
          throw uploadError;
        } finally {
          setIsUploading(false);
          // Reset progress after a short delay to show 100%
          setTimeout(() => {
            setUploadProgress(0);
          }, 1000);
        }
      }
      // If canceled, silently return - no error needed
    } catch (error: any) {
      // Only show error if it's not a cancellation
      if (error.code !== 'E_DOCUMENT_PICKER_CANCELED' && error.message !== 'User canceled document picker') {
        Alert.alert('Erreur', error.message || 'Échec de l\'upload');
      }
    } finally {
      // Clear timeout and reset both state and ref, even if picker was canceled or error occurred
      clearTimeout(timeoutId);
      console.log('✅ Document picker completed - resetting state');
      isPickingDocumentRef.current = false;
      setIsPickingDocument(false);
    }
  };

  // Start cooldown countdown timer
  const startCooldownTimer = (seconds: number) => {
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    setCooldownRemaining(seconds);
    setSynthesisStatus('cooldown');
    cooldownTimerRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          setSynthesisStatus('idle');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Fetch existing synthesis on mount
  useEffect(() => {
    const fetchExistingSynthesis = async () => {
      if (!user?.id) return;
      try {
        const response: any = await apiClient.getClient().get(`/profile/${user.id}/synthesis`);
        const data = response.data;
        if (data?.synthesis) {
          const synthData = typeof data.synthesis === 'string'
            ? JSON.parse(data.synthesis)
            : data.synthesis;
          setSynthesis(synthData);
        }
      } catch {
        // No existing synthesis - that's fine, user can generate one
      }
    };
    fetchExistingSynthesis();

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [user?.id]);

  // Format seconds to "Xm Xs"
  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m}m ${s.toString().padStart(2, '0')}s`;
    return `${s}s`;
  };

  const handleGenerateSynthesis = async () => {
    if (!user?.id) {
      setSynthesisError('Vous devez être connecté pour générer une synthèse.');
      return;
    }

    if (synthesisStatus === 'cooldown' && cooldownRemaining > 0) {
      return; // Button is disabled during cooldown
    }

    setSynthesisLoading(true);
    setSynthesisError(null);
    setSynthesisStatus('idle');

    try {
      const response = await apiClient.getClient().post(`/profile/${user.id}/analyze`);
      const data = response.data;

      switch (data.status) {
        case 'incomplete':
          setSynthesisStatus('incomplete');
          setMissingSections(data.missing_sections || []);
          setCompletenessPercent(data.completeness_percentage || 0);
          break;

        case 'cooldown':
          startCooldownTimer(data.retry_after_seconds || 600);
          if (data.synthesis) {
            setSynthesis(data.synthesis);
          }
          break;

        case 'up_to_date':
          setSynthesisStatus('up_to_date');
          setSynthesis(data.synthesis);
          break;

        case 'generated':
          setSynthesisStatus('idle');
          setSynthesis(data.synthesis);
          break;

        case 'error':
          throw new Error(data.message || 'Erreur lors de la génération');

        default:
          throw new Error('Réponse inattendue du serveur');
      }
    } catch (error: any) {
      console.error('Synthesis generation error:', error);
      const status = error.response?.status;
      let errorMessage: string;

      if (!error.response && error.message?.includes('timeout')) {
        errorMessage = 'La génération a pris trop de temps. Veuillez réessayer.';
      } else if (!error.response && error.message?.includes('Network')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
      } else if (status === 503) {
        errorMessage = 'Le service IA est temporairement indisponible. Réessayez dans quelques instants.';
      } else if (status === 500) {
        errorMessage = 'Erreur interne du serveur. Notre équipe est informée.';
      } else if (status === 429) {
        const retryAfter = error.response?.data?.retry_after_seconds;
        if (retryAfter && retryAfter > 0) {
          startCooldownTimer(retryAfter);
          errorMessage = '';
        } else {
          startCooldownTimer(60);
          errorMessage = 'Trop de requêtes. Veuillez patienter avant de réessayer.';
        }
      } else {
        errorMessage = error.response?.data?.message || error.message || 'Impossible de générer la synthèse. Veuillez réessayer.';
      }

      if (errorMessage) {
        setSynthesisError(errorMessage);
      }
    } finally {
      setSynthesisLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        onProfilePress={() => setShowProfileModal(true)}
        title="Mon Profil"
      />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollPositionRef.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refreshProfile();
              setRefreshing(false);
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.contentWrapper}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: colors.cardBackground }]}>
              {/* Pencil icon in top right */}
              <TouchableOpacity 
                style={styles.editProfileIconButton}
                  onPress={() => {
                    // Reset avatar changed flag when opening modal (fresh start)
                    setAvatarChanged(false);
                    setShowEditProfileModal(true);
                  }}
              >
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
              
              <View style={styles.profileHeaderContent}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatarBorder, { borderColor: colors.primary }]}>
                    {(() => {
                      // Hide image during reload to force fresh render
                      if (isReloadingAvatar) {
                        return (
                          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceBackground }]}>
                            <ActivityIndicator size="small" color={colors.primary} />
                          </View>
                        );
                      }
                      
                      // Use data URI if available (for authenticated images), otherwise use direct URI for local files only
                      // Never use HTTP URLs directly - they need authentication via loadAvatarImage
                      const imageSource = avatarDataUri || (avatarUri && avatarUri.startsWith('file://') ? avatarUri : null);
                      
                      if (imageSource) {
                        return (
                          <Image 
                            key={`avatar-${avatarVersion}-${user?.avatar || avatarUri || Date.now()}`} // Force re-render when avatar changes
                            source={{ uri: imageSource }} 
                            style={styles.avatar}
                            onError={(error) => {
                              console.error('Profile Header - Image load error:', error.nativeEvent.error);
                            }}
                            onLoad={() => {
                              console.log('Profile Header - Image loaded successfully');
                            }}
                          />
                        );
                      } else {
                        return (
                          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceBackground }]}>
                            <Ionicons name="person" size={40} color={colors.textSecondary} />
                          </View>
                        );
                      }
                    })()}
                  </View>
                </View>
                <View style={styles.profileInfoContainer}>
                  <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                    {user?.name || 'Utilisateur'}
                  </Text>
                  <View style={styles.profileDetails}>
                    {profile?.location?.address && (
                      <View style={styles.detailRow}>
                        <Ionicons name="location" size={14} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={2}>
                          {profile.location.address}
                        </Text>
                      </View>
                    )}
                    {profile?.location?.city && (
                      <View style={styles.detailRow}>
                        <Ionicons name="map" size={14} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                          {profile.location.city}{profile.location.country ? `, ${profile.location.country}` : ''}
                        </Text>
                      </View>
                    )}
                    {profile?.careerPath && (
                      <View style={styles.detailRow}>
                        <Ionicons name="briefcase" size={14} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                          {profile.careerPath}
                        </Text>
                      </View>
                    )}
                  </View>
                  {profile?.bio && (
                    <Text style={[styles.bioText, { color: colors.textSecondary }]} numberOfLines={3}>
                      {profile.bio}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Synthèse IA Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={20} color={COLORS.primaryLight} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Synthèse IA
                </Text>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { opacity: (synthesisLoading || synthesisStatus === 'cooldown') ? 0.5 : 1 }
                  ]}
                  onPress={handleGenerateSynthesis}
                  disabled={synthesisLoading || synthesisStatus === 'cooldown'}
                >
                  {synthesisLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name="refresh" size={20} color={synthesisStatus === 'cooldown' ? colors.textSecondary : colors.primary} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Status banner: cooldown */}
              {synthesisStatus === 'cooldown' && cooldownRemaining > 0 && (
                <View style={[styles.synthesisBanner, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="time-outline" size={18} color="#E65100" />
                  <Text style={[styles.synthesisBannerText, { color: '#E65100' }]}>
                    Nouvelle génération disponible dans {formatCooldown(cooldownRemaining)}
                  </Text>
                </View>
              )}

              {/* Status banner: up_to_date */}
              {synthesisStatus === 'up_to_date' && (
                <View style={[styles.synthesisBanner, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#2E7D32" />
                  <Text style={[styles.synthesisBannerText, { color: '#2E7D32' }]}>
                    Votre synthèse est déjà à jour. Modifiez votre profil pour en générer une nouvelle.
                  </Text>
                </View>
              )}

              {/* Status banner: incomplete */}
              {synthesisStatus === 'incomplete' && (
                <View style={[styles.synthesisBanner, { backgroundColor: '#FFF8E1' }]}>
                  <Ionicons name="warning-outline" size={18} color="#F57F17" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.synthesisBannerText, { color: '#F57F17', fontWeight: '600' }]}>
                      Profil incomplet ({completenessPercent}%)
                    </Text>
                    <Text style={[styles.synthesisBannerText, { color: '#F57F17', marginTop: 4 }]}>
                      Ajoutez: {missingSections.map(s =>
                        s === 'education' ? 'Formation' :
                        s === 'experience' ? 'Expérience' :
                        s === 'skills' ? 'Compétences' : s
                      ).join(', ')}
                    </Text>
                  </View>
                </View>
              )}

              {synthesisLoading ? (
                <View style={styles.synthesisLoadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.synthesisLoadingText, { color: colors.textSecondary }]}>
                    Analyse de votre profil en cours...
                  </Text>
                  <Text style={[styles.synthesisLoadingText, { color: colors.textSecondary, fontSize: 12 }]}>
                    Cela peut prendre quelques secondes
                  </Text>
                </View>
              ) : synthesisError ? (
                <View style={styles.synthesisErrorContainer}>
                  <Ionicons name="cloud-offline-outline" size={40} color="#E53935" />
                  <Text style={[styles.synthesisErrorText, { color: '#E53935' }]}>
                    {synthesisError}
                  </Text>
                  <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: colors.primary }]}
                    onPress={handleGenerateSynthesis}
                  >
                    <Ionicons name="refresh-outline" size={16} color="white" />
                    <Text style={styles.retryButtonText}>Réessayer</Text>
                  </TouchableOpacity>
                </View>
              ) : synthesis ? (
                <>
                  {synthesis.forces && (
                    <View style={styles.synthesisItem}>
                      <View style={styles.synthesisHeader}>
                        <View style={styles.greenDot} />
                        <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>Forces</Text>
                      </View>
                      <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                        {synthesis.forces}
                      </Text>
                    </View>
                  )}

                  {synthesis.axes_progression && (
                    <View style={styles.synthesisItem}>
                      <View style={styles.synthesisHeader}>
                        <View style={styles.greenDot} />
                        <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>
                          Axes de progression
                        </Text>
                      </View>
                      <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                        {synthesis.axes_progression}
                      </Text>
                    </View>
                  )}

                  {synthesis.interets_cles && (
                    <View style={styles.synthesisItem}>
                      <View style={styles.synthesisHeader}>
                        <View style={styles.greenDot} />
                        <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>
                          Intérêts clés
                        </Text>
                      </View>
                      <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                        {synthesis.interets_cles}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.synthesisEmptyContainer}>
                  <Ionicons name="bulb-outline" size={40} color={colors.textSecondary} />
                  <Text style={[styles.synthesisEmptyText, { color: colors.textSecondary }]}>
                    Aucune synthèse générée
                  </Text>
                  <TouchableOpacity
                    style={[styles.generateButton, { backgroundColor: colors.primary }]}
                    onPress={handleGenerateSynthesis}
                  >
                    <Ionicons name="sparkles" size={18} color="white" />
                    <Text style={styles.generateButtonText}>Générer la synthèse</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Expériences professionnelles Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Expériences professionnelles
                </Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddExperience}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {profile?.experiences && profile.experiences.length > 0 ? (
                profile.experiences.map((exp) => (
                  <View key={exp.id} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <View style={styles.greenDot} />
                      <View style={styles.experienceInfo}>
                        <Text style={[styles.experienceTitle, { color: colors.textPrimary }]}>
                          {exp.title}
                        </Text>
                        <Text style={[styles.experienceCompany, { color: colors.textSecondary }]}>
                          {exp.company} • {exp.period}
                        </Text>
                      </View>
                      <View style={styles.itemActions}>
                        <TouchableOpacity 
                          onPress={() => handleEditExperience(exp)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="pencil" size={18} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => {
                            Alert.alert('Supprimer', 'Voulez-vous supprimer cette expérience?', [
                              { text: 'Annuler', style: 'cancel' },
                              { text: 'Supprimer', style: 'destructive', onPress: () => deleteExperience(exp.id) },
                            ]);
                          }}
                          style={styles.actionButton}
                        >
                          <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {exp.description && (
                      <Text style={[styles.experienceDescription, { color: colors.textSecondary }]}>
                        {exp.description}
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Aucune expérience ajoutée
                </Text>
              )}
            </View>

            {/* Formation Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Formation
                </Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddEducation}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {profile?.education && profile.education.length > 0 ? (
                profile.education.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <View style={styles.educationInfo}>
                      <Text style={[styles.educationDegree, { color: colors.textPrimary }]}>
                        {edu.degree}
                      </Text>
                      <Text style={[styles.educationSchool, { color: colors.textSecondary }]}>
                        {edu.school}
                      </Text>
                    </View>
                    <View style={styles.educationActions}>
                      <Text style={[styles.educationYear, { color: colors.textSecondary }]}>
                        {edu.year}
                      </Text>
                      <View style={styles.itemActions}>
                        <TouchableOpacity 
                          onPress={() => handleEditEducation(edu)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="pencil" size={18} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => {
                            Alert.alert('Supprimer', 'Voulez-vous supprimer cette formation?', [
                              { text: 'Annuler', style: 'cancel' },
                              { text: 'Supprimer', style: 'destructive', onPress: () => deleteEducation(edu.id) },
                            ]);
                          }}
                          style={styles.actionButton}
                        >
                          <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Aucune formation ajoutée
                </Text>
              )}
            </View>

            {/* Compétences Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Compétences
                </Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddSkill}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <View key={skill.id} style={styles.skillItem}>
                    <View style={styles.skillHeader}>
                      <Text style={[styles.skillName, { color: colors.textPrimary }]}>
                        {skill.name}
                      </Text>
                      <View style={styles.itemActions}>
                        <TouchableOpacity 
                          onPress={() => handleEditSkill(skill)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="pencil" size={18} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => {
                            Alert.alert('Supprimer', 'Voulez-vous supprimer cette compétence?', [
                              { text: 'Annuler', style: 'cancel' },
                              { text: 'Supprimer', style: 'destructive', onPress: () => deleteSkill(skill.id) },
                            ]);
                          }}
                          style={styles.actionButton}
                        >
                          <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.skillProgress}>
                      <View style={[styles.skillProgressBar, { backgroundColor: colors.surfaceBackground }]}>
                        <View style={[styles.skillProgressFill, { width: `${skill.level}%` }]} />
                      </View>
                      <Text style={[styles.skillPercentage, { color: COLORS.primary }]}>
                        {skill.level}%
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Aucune compétence ajoutée
                </Text>
              )}
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Importer des documents Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Importer des documents
              </Text>
              <TouchableOpacity
                style={[
                  styles.uploadArea, 
                  { 
                    borderColor: colors.border,
                    opacity: (isPickingDocument || isOpeningDocument || isUploading) ? 0.5 : 1,
                  }
                ]}
                activeOpacity={0.7}
                onPress={handleUploadDocument}
                disabled={isPickingDocument || isOpeningDocument || isUploading}
              >
                {isUploading ? (
                  <>
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: SPACING.md }} />
                    <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>
                      Upload en cours...
                    </Text>
                    <Text style={[styles.uploadSubtitle, { color: colors.textSecondary, marginTop: SPACING.xs }]}>
                      {uploadProgress}%
                    </Text>
                    {/* Progress Bar */}
                    <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceBackground, marginTop: SPACING.md }]}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${uploadProgress}%`,
                            backgroundColor: colors.primary,
                          }
                        ]} 
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={40} color={colors.textTertiary} />
                    <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>
                      {isPickingDocument ? 'Ouverture...' : isOpeningDocument ? 'Document en cours...' : 'Déposer un document'}
                    </Text>
                    <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                      {(isPickingDocument || isOpeningDocument) ? 'Veuillez patienter' : 'Cliquez pour sélectionner un fichier'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Mes Documents Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="folder-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Mes Documents
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.addButton,
                    { opacity: (isPickingDocument || isOpeningDocument || isUploading) ? 0.5 : 1 }
                  ]} 
                  onPress={handleUploadDocument}
                  disabled={isPickingDocument || isOpeningDocument || isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name="add" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>

              {(() => {
                console.log('Profile documents check:', {
                  hasProfile: !!profile,
                  hasDocuments: !!profile?.documents,
                  documentsType: typeof profile?.documents,
                  isArray: Array.isArray(profile?.documents),
                  length: profile?.documents?.length,
                  documents: profile?.documents
                });
                return profile?.documents && Array.isArray(profile.documents) && profile.documents.length > 0;
              })() ? (
                profile.documents.map((doc) => (
                  <View key={doc.id}>
                    <TouchableOpacity 
                      style={styles.documentItem}
                      onPress={() => handleOpenDocument(doc)}
                      activeOpacity={0.7}
                      disabled={downloadingDocumentId === doc.id}
                    >
                      <View style={[styles.documentIcon, { backgroundColor: '#EF444420' }]}>
                        {downloadingDocumentId === doc.id ? (
                          <ActivityIndicator size="small" color="#FF6B35" />
                        ) : (
                          <Ionicons name={getDocumentIcon(doc.type || '') as any} size={20} color="#EF4444" />
                        )}
                      </View>
                      <View style={styles.documentInfo}>
                        <Text style={[styles.documentName, { color: colors.textPrimary }]}>
                          {doc.name}
                        </Text>
                        <Text style={[styles.documentMeta, { color: colors.textSecondary }]}>
                          {downloadingDocumentId === doc.id 
                            ? `Téléchargement... ${downloadProgress}%`
                            : `${formatFileSize(doc.size || 0)} • ${formatDate(doc.uploadedAt)}`
                          }
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          Alert.alert('Supprimer', 'Voulez-vous supprimer ce document?', [
                            { text: 'Annuler', style: 'cancel' },
                            { text: 'Supprimer', style: 'destructive', onPress: () => deleteDocument(doc.id) },
                          ]);
                        }}
                        disabled={downloadingDocumentId === doc.id}
                      >
                        <Ionicons 
                          name="trash-outline" 
                          size={18} 
                          color={downloadingDocumentId === doc.id ? colors.textTertiary : colors.textSecondary} 
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    {/* Orange Progress Bar */}
                    {downloadingDocumentId === doc.id && (
                      <View style={styles.documentProgressContainer}>
                        <View 
                          style={[
                            styles.documentProgressBar,
                            { 
                              width: `${downloadProgress}%`,
                              backgroundColor: '#FF6B35', // Orange color
                            }
                          ]} 
                        />
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Aucun document uploadé
                </Text>
              )}
            </View>

            {/* Derniers ajouts Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Derniers ajouts issus des jeux/tests
                </Text>
              </View>

              {profile?.recentActivities && profile.recentActivities.length > 0 ? (
                profile.recentActivities.map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={styles.greenDot} />
                    <View style={styles.activityInfo}>
                      <Text style={[styles.activityText, { color: colors.textPrimary }]}>
                        {activity.text}
                      </Text>
                      <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                        {activity.time}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Aucune activité récente
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <ProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Modifier le profil</Text>
              
              {/* Profile Image */}
              <View style={styles.editImageSection}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Photo de profil</Text>
                <View style={styles.imagePickerContainer}>
                    {(() => {
                      // Hide image during reload to force fresh render
                      if (isReloadingAvatar) {
                        return (
                          <View style={[styles.editAvatarPlaceholder, { backgroundColor: colors.surfaceBackground }]}>
                            <ActivityIndicator size="small" color={colors.primary} />
                          </View>
                        );
                      }
                      
                      // Use data URI if available (for authenticated images), otherwise use direct URI for local files
                      const imageSource = avatarDataUri || (avatarUri && avatarUri.startsWith('file://') ? avatarUri : null);
                      console.log('Edit Profile Modal - Image source:', imageSource ? 'available' : 'none', 'dataUri:', !!avatarDataUri, 'avatarUri:', avatarUri);
                      
                      if (imageSource) {
                        return (
                          <Image 
                            key={`edit-avatar-${avatarVersion}-${user?.avatar || avatarUri || Date.now()}`} // Force re-render when avatar changes
                            source={{ uri: imageSource }} 
                            style={styles.editAvatar}
                            onError={(error) => {
                              console.error('Edit Profile Modal - Image load error:', error.nativeEvent.error);
                              console.error('Failed to load image from URI:', imageSource);
                            }}
                            onLoad={() => {
                              console.log('Edit Profile Modal - Image loaded successfully');
                            }}
                          />
                        );
                      } else {
                        return (
                          <View style={[styles.editAvatarPlaceholder, { backgroundColor: colors.surfaceBackground }]}>
                            <Ionicons name="person" size={40} color={colors.textSecondary} />
                          </View>
                        );
                      }
                    })()}
                  <TouchableOpacity 
                    style={[styles.imagePickerButton, { backgroundColor: colors.primary }]}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="camera" size={20} color="white" />
                    <Text style={styles.imagePickerButtonText}>Changer</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Address */}
              <View style={styles.editFieldSection}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Adresse</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                  placeholder="Entrez votre adresse complète"
                  placeholderTextColor={colors.textTertiary}
                  value={addressText}
                  onChangeText={setAddressText}
                  multiline
                  numberOfLines={2}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>

              {/* Bio */}
              <View style={styles.editFieldSection}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Description (Bio)</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextarea, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                  placeholder="Décrivez-vous en quelques mots..."
                  placeholderTextColor={colors.textTertiary}
                  value={bioText}
                  onChangeText={setBioText}
                  multiline
                  numberOfLines={4}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  onPress={() => {
                    setShowEditProfileModal(false);
                    // Reset to original values
                    if (profile?.bio) setBioText(profile.bio);
                    if (profile?.location?.address) setAddressText(profile.location.address);
                    if (user?.avatar) {
                      const fixedUrl = fixAvatarUrl(user.avatar);
                      setAvatarUri(fixedUrl);
                    }
                    // Reset avatar changed flag when canceling
                    setAvatarChanged(false);
                  }} 
                  style={[styles.modalButton, { backgroundColor: colors.surfaceBackground }]}
                >
                  <Text style={{ color: colors.textSecondary }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSaveProfile} 
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                >
                  <Text style={{ color: 'white' }}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Education Modal */}
      <Modal visible={showEducationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editingEducationId ? 'Modifier la formation' : 'Ajouter une formation'}
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Diplôme"
                placeholderTextColor={colors.textTertiary}
                value={educationForm.degree}
                onChangeText={(text) => setEducationForm({ ...educationForm, degree: text })}
              />
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="École/Université"
                placeholderTextColor={colors.textTertiary}
                value={educationForm.school}
                onChangeText={(text) => setEducationForm({ ...educationForm, school: text })}
              />
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Année"
                placeholderTextColor={colors.textTertiary}
                value={educationForm.year}
                onChangeText={(text) => setEducationForm({ ...educationForm, year: text })}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  onPress={() => {
                    setShowEducationModal(false);
                    setEditingEducationId(null);
                    setEducationForm({ degree: '', school: '', year: '' });
                  }} 
                  style={[styles.modalButton, { backgroundColor: colors.surfaceBackground }]}
                >
                  <Text style={{ color: colors.textSecondary }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveEducation} style={[styles.modalButton, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: 'white' }}>{editingEducationId ? 'Enregistrer' : 'Ajouter'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Experience Modal */}
      <Modal visible={showExperienceModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editingExperienceId ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Titre du poste"
                placeholderTextColor={colors.textTertiary}
                value={experienceForm.title}
                onChangeText={(text) => setExperienceForm({ ...experienceForm, title: text })}
              />
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Entreprise"
                placeholderTextColor={colors.textTertiary}
                value={experienceForm.company}
                onChangeText={(text) => setExperienceForm({ ...experienceForm, company: text })}
              />
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Période (ex: 2020 - 2023)"
                placeholderTextColor={colors.textTertiary}
                value={experienceForm.period}
                onChangeText={(text) => setExperienceForm({ ...experienceForm, period: text })}
              />
              <TextInput
                style={[styles.modalInput, styles.modalTextarea, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Description (optionnel)"
                placeholderTextColor={colors.textTertiary}
                value={experienceForm.description}
                onChangeText={(text) => setExperienceForm({ ...experienceForm, description: text })}
                multiline
                numberOfLines={3}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  onPress={() => {
                    setShowExperienceModal(false);
                    setEditingExperienceId(null);
                    setExperienceForm({ title: '', company: '', period: '', description: '' });
                  }} 
                  style={[styles.modalButton, { backgroundColor: colors.surfaceBackground }]}
                >
                  <Text style={{ color: colors.textSecondary }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveExperience} style={[styles.modalButton, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: 'white' }}>{editingExperienceId ? 'Enregistrer' : 'Ajouter'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Skill Modal */}
      <Modal visible={showSkillModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editingSkillId ? 'Modifier la compétence' : 'Ajouter une compétence'}
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Nom de la compétence"
                placeholderTextColor={colors.textTertiary}
                value={skillForm.name}
                onChangeText={(text) => setSkillForm({ ...skillForm, name: text })}
              />
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceBackground, color: colors.textPrimary }]}
                placeholder="Niveau (0-100)"
                placeholderTextColor={colors.textTertiary}
                value={skillForm.level}
                onChangeText={(text) => setSkillForm({ ...skillForm, level: text })}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  onPress={() => {
                    setShowSkillModal(false);
                    setEditingSkillId(null);
                    setSkillForm({ name: '', level: '' });
                  }} 
                  style={[styles.modalButton, { backgroundColor: colors.surfaceBackground }]}
                >
                  <Text style={{ color: colors.textSecondary }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveSkill} style={[styles.modalButton, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: 'white' }}>{editingSkillId ? 'Enregistrer' : 'Ajouter'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    marginTop: 100,
  },
  contentWrapper: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: SPACING.lg,
    padding: SPACING.xl,
  },
  leftColumn: {
    flex: isLargeScreen ? 1.5 : 1,
    gap: SPACING.lg,
  },
  rightColumn: {
    flex: 1,
    gap: SPACING.lg,
  },
  profileHeader: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
  },
  editProfileIconButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    gap: SPACING.lg,
    alignItems: 'flex-start',
    paddingRight: SPACING.xl, // Add padding to prevent overlap with pencil icon
  },
  profileTop: {
    flexDirection: 'row',
    gap: SPACING.lg,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    backgroundColor: COLORS.primary + '20',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoContainer: {
    flex: 1,
    minWidth: 0, // Allows text to wrap properly
    gap: SPACING.sm,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.md,
    flex: 1,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0, // Allows text to wrap properly
  },
  profileName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
    flexShrink: 1,
  },
  profileDetails: {
    gap: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONTS.sizes.sm,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  section: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  synthesisItem: {
    marginBottom: SPACING.lg,
  },
  synthesisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  synthesisTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  synthesisText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginLeft: SPACING.lg,
  },
  experienceItem: {
    marginBottom: SPACING.lg,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: FONTS.sizes.sm,
  },
  experienceDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginLeft: SPACING.lg,
  },
  educationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  educationInfo: {
    flex: 1,
  },
  educationDegree: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 2,
  },
  educationSchool: {
    fontSize: FONTS.sizes.sm,
  },
  educationYear: {
    fontSize: FONTS.sizes.sm,
  },
  skillItem: {
    marginBottom: SPACING.lg,
  },
  skillName: {
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.xs,
  },
  skillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  skillProgressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  skillPercentage: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    minWidth: 40,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  uploadTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginTop: SPACING.md,
  },
  uploadSubtitle: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
    transition: 'width 0.3s ease',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentProgressContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 107, 53, 0.2)', // Light orange background
    borderRadius: BORDER_RADIUS.xs,
    overflow: 'hidden',
    marginTop: -SPACING.md,
    marginBottom: SPACING.md,
  },
  documentProgressBar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.xs,
    transition: 'width 0.3s ease',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    marginBottom: 2,
  },
  documentMeta: {
    fontSize: FONTS.sizes.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: FONTS.sizes.xs,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
  },
  bioText: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  bioEditContainer: {
    marginTop: SPACING.sm,
  },
  bioInput: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minHeight: 80,
    fontSize: FONTS.sizes.sm,
    textAlignVertical: 'top',
  },
  bioActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  addBioButton: {
    marginTop: SPACING.sm,
  },
  addBioText: {
    fontSize: FONTS.sizes.sm,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: FONTS.sizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: SPACING.md,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  educationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.lg,
  },
  modalInput: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONTS.sizes.md,
  },
  modalTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  modalButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 100,
    alignItems: 'center',
  },
  editImageSection: {
    marginBottom: SPACING.lg,
  },
  modalLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.sm,
  },
  imagePickerContainer: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '20',
  },
  editAvatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  imagePickerButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  editFieldSection: {
    marginBottom: SPACING.lg,
  },
  synthesisBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  synthesisBannerText: {
    flex: 1,
    fontSize: FONTS.sizes.xs,
    lineHeight: 18,
  },
  synthesisLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  synthesisLoadingText: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
  synthesisErrorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  synthesisErrorText: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  retryButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  synthesisEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  synthesisEmptyText: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  generateButtonText: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default ProfileScreen;

