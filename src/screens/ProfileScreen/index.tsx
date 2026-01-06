import React, { useState } from 'react';
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

  // Helper function to fix localhost URLs for iOS
  const fixAvatarUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    
    // If URL contains localhost, replace with API base URL's host
    if (url.includes('localhost')) {
      try {
        const apiBaseUrl = API_CONFIG.BASE_URL; // e.g., http://192.168.1.128:3000/api
        const apiUrlObj = new URL(apiBaseUrl);
        const urlObj = new URL(url);
        
        // Replace localhost with the API host
        urlObj.host = apiUrlObj.host;
        urlObj.protocol = apiUrlObj.protocol;
        
        const fixedUrl = urlObj.toString();
        console.log('Fixed avatar URL from', url, 'to', fixedUrl);
        return fixedUrl;
      } catch (error) {
        console.error('Error fixing avatar URL:', error);
        return url;
      }
    }
    
    return url;
  };

  // Load authenticated avatar image
  const loadAvatarImage = async (url: string) => {
    try {
      // If it's a local file URI, use it directly
      if (url.startsWith('file://')) {
        setAvatarDataUri(url);
        return;
      }

      // Extract the API path from the full URL
      // URL format: http://192.168.1.128:3000/api/files/avatars/userId/filename
      // BASE_URL: http://192.168.1.128:3000/api
      // So we need: /files/avatars/userId/filename (without /api prefix)
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
      const response = await apiClient.getClient().get(apiPath, {
        responseType: 'arraybuffer',
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
    if (user?.avatar) {
      const fixedAvatarUrl = fixAvatarUrl(user.avatar);
      console.log('Setting avatarUri from user.avatar:', user.avatar, 'fixed to:', fixedAvatarUrl);
      setAvatarUri(fixedAvatarUrl);
      
      // Load the image with authentication if it's an HTTP URL
      if (fixedAvatarUrl && fixedAvatarUrl.startsWith('http')) {
        loadAvatarImage(fixedAvatarUrl);
      } else if (fixedAvatarUrl && fixedAvatarUrl.startsWith('file://')) {
        setAvatarDataUri(fixedAvatarUrl);
      } else {
        setAvatarDataUri(null);
      }
    } else {
      console.log('No user avatar found, user:', user);
      setAvatarDataUri(null);
    }
  }, [profile, user]);

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

      // Download file using axios with auth token
      const axiosClient = apiClient.getClient();
      const response = await axiosClient.get(endpoint, {
        responseType: 'arraybuffer',
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
      } else {
        console.log('Image selection canceled or no asset');
      }
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const handleSaveProfile = async () => {
    try {
      // If avatar was changed, upload it first
      if (avatarUri && avatarUri !== user?.avatar && !avatarUri.startsWith('http')) {
        try {
          // Get file info - need to detect mime type from URI extension
          const uriParts = avatarUri.split('.');
          const extension = uriParts[uriParts.length - 1].toLowerCase();
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

          await uploadAvatar(file);
          // uploadAvatar already updates the user in AuthContext via updateUser
          // No need to call refreshAuth here
        } catch (error: any) {
          console.error('Upload error:', error);
          Alert.alert('Erreur', 'Échec de l\'upload de l\'avatar: ' + (error.message || 'Erreur inconnue'));
          return;
        }
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
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        await uploadDocument(file, 'other');
        Alert.alert('Succès', 'Document uploadé avec succès');
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de l\'upload');
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
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
                onPress={() => setShowEditProfileModal(true)}
              >
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
              
              <View style={styles.profileHeaderContent}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatarBorder, { borderColor: colors.primary }]}>
                    {(() => {
                      // Use data URI if available (for authenticated images), otherwise use direct URI
                      const imageSource = avatarDataUri || (avatarUri && avatarUri.startsWith('file://') ? avatarUri : (user?.avatar ? fixAvatarUrl(user.avatar) : null));
                      
                      if (imageSource) {
                        return (
                          <Image 
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
              </View>

              <View style={styles.synthesisItem}>
                <View style={styles.synthesisHeader}>
                  <View style={styles.greenDot} />
                  <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>Forces</Text>
                </View>
                <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                  Excellente communicante avec de solides compétences rédactionnelles. Vous avez une
                  bonne expérience en marketing et communication qui vous donne une base solide pour
                  votre projet de reconversion.
                </Text>
              </View>

              <View style={styles.synthesisItem}>
                <View style={styles.synthesisHeader}>
                  <View style={styles.greenDot} />
                  <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>
                    Axes de progression
                  </Text>
                </View>
                <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                  Développer davantage vos compétences techniques, notamment en design graphique qui
                  pourrait compléter votre profil.
                </Text>
              </View>

              <View style={styles.synthesisItem}>
                <View style={styles.synthesisHeader}>
                  <View style={styles.greenDot} />
                  <Text style={[styles.synthesisTitle, { color: colors.textPrimary }]}>
                    Intérêts clés
                  </Text>
                </View>
                <Text style={[styles.synthesisText, { color: colors.textSecondary }]}>
                  D'après vos tests, vous montrez un fort intérêt pour la créativité, l'innovation et
                  le travail en équipe. Ces éléments sont de bons indicateurs pour orienter votre
                  reconversion.
                </Text>
              </View>
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
                style={[styles.uploadArea, { borderColor: colors.border }]}
                activeOpacity={0.7}
                onPress={handleUploadDocument}
              >
                <Ionicons name="cloud-upload-outline" size={40} color={colors.textTertiary} />
                <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>
                  Déposer un document
                </Text>
                <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                  Cliquez pour sélectionner un fichier
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mes Documents Section */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="folder-outline" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Mes Documents
                </Text>
                <TouchableOpacity style={styles.addButton} onPress={handleUploadDocument}>
                  <Ionicons name="add" size={20} color={colors.primary} />
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
                  <TouchableOpacity 
                    key={doc.id} 
                    style={styles.documentItem}
                    onPress={() => handleOpenDocument(doc)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.documentIcon, { backgroundColor: '#EF444420' }]}>
                      <Ionicons name={getDocumentIcon(doc.type || '') as any} size={20} color="#EF4444" />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={[styles.documentName, { color: colors.textPrimary }]}>
                        {doc.name}
                      </Text>
                      <Text style={[styles.documentMeta, { color: colors.textSecondary }]}>
                        {formatFileSize(doc.size || 0)} • {formatDate(doc.uploadedAt)}
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
                    >
                      <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
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
                      // Use data URI if available (for authenticated images), otherwise use direct URI for local files
                      const imageSource = avatarDataUri || (avatarUri && avatarUri.startsWith('file://') ? avatarUri : null);
                      console.log('Edit Profile Modal - Image source:', imageSource ? 'available' : 'none', 'dataUri:', !!avatarDataUri, 'avatarUri:', avatarUri);
                      
                      if (imageSource) {
                        return (
                          <Image 
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
                    if (user?.avatar) setAvatarUri(user.avatar);
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
});

export default ProfileScreen;

