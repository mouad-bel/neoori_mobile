import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { MainDrawerParamList } from '../../types';
import ThemeToggle from './ThemeToggle';
import StorageService from '../../services/storage/StorageService';
import { useAvatar } from '../../hooks/useAvatar';

const { height } = Dimensions.get('window');

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const { colors, theme } = useTheme();
  const { user, logout } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { avatarDataUri, avatarVersion } = useAvatar();

  // Refresh profile when modal opens to get latest completion percentage
  useEffect(() => {
    if (visible) {
      console.log('📊 ProfileModal opened - refreshing profile');
      refreshProfile();
    }
  }, [visible, refreshProfile]);

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    let completed = 0;
    let total = 0;

    // Basic info (name is always there, check bio, location)
    total += 3;
    if (user?.name) completed++;
    if (profile.bio) completed++;
    if (profile.location?.city || profile.location?.address) completed++;

    // Education
    total += 1;
    if (profile.education && profile.education.length > 0) completed++;

    // Experiences
    total += 1;
    if (profile.experiences && profile.experiences.length > 0) completed++;

    // Skills
    total += 1;
    if (profile.skills && profile.skills.length > 0) completed++;

    // Documents
    total += 1;
    if (profile.documents && profile.documents.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }, [profile, user]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: 'home-outline',
      title: 'Tableau de bord',
      subtitle: 'Dash',
      iconBg: COLORS.primary, // Brand orange
      onPress: () => {
        onClose();
        navigation.navigate('MainTabs', { screen: 'Progresser' });
      },
    },
    {
      id: 'rewards',
      icon: 'ribbon-outline',
      title: 'Récompenses',
      subtitle: 'Rec',
      iconBg: COLORS.primaryLight, // Brand orange light
      onPress: () => {
        onClose();
        navigation.navigate('Recompenses');
      },
    },
    {
      id: 'profile',
      icon: 'person-outline',
      title: 'Mon Profil',
      subtitle: 'Gérer vos informations',
      iconBg: COLORS.primary, // Brand orange
      onPress: () => {
        onClose();
        navigation.navigate('MainTabs', { screen: 'Moi' });
      },
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      title: 'Paramètres',
      subtitle: 'Préférences et confidentialité',
      iconBg: COLORS.accentPeach, // Brand orange peach
      onPress: () => {
        onClose();
        navigation.navigate('Parametres');
      },
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      title: 'Aide & Support',
      subtitle: "Centre d'aide",
      iconBg: COLORS.primaryLight, // Brand orange light
      onPress: () => {
        onClose();
        navigation.navigate('About');
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {/* Header with close button */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.notificationIcon}
                accessibilityLabel="Notifications"
              >
                <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatIcon} accessibilityLabel="Messages">
                <Ionicons name="chatbubble-outline" size={24} color={colors.textPrimary} />
                <View style={[styles.notificationDot, { backgroundColor: COLORS.primary }]} />
              </TouchableOpacity>
              {user?.avatar && avatarDataUri && (
                <Image 
                  key={`header-avatar-${user?.avatar}-${avatarVersion}`}
                  source={{ uri: avatarDataUri }} 
                  style={styles.headerAvatar} 
                />
              )}
            </View>
            <View style={styles.headerRight}>
              <Text style={[styles.headerName, { color: colors.textPrimary }]}>
                {user?.name || 'User'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* User Profile Card - Brand Orange Gradient */}
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight, COLORS.accentPeach]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCard}
            >
              <View style={styles.profileAvatarContainer}>
                {user?.avatar && avatarDataUri && (
                  <Image 
                    key={`profile-avatar-${user?.avatar}-${avatarVersion}`}
                    source={{ uri: avatarDataUri }} 
                    style={styles.profileAvatar} 
                  />
                )}
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'user@neoori.com'}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${profileCompletion}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{profileCompletion}%</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon as any} size={24} color="white" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
              
              {/* Theme Toggle */}
              <View style={[styles.themeToggleContainer, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.themeToggleLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="color-palette-outline" size={24} color="white" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
                      Thème
                    </Text>
                    <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                      {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
                    </Text>
                  </View>
                </View>
                <ThemeToggle />
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: height * 0.9,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    paddingTop: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  notificationIcon: {
    position: 'relative',
  },
  chatIcon: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  profileAvatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary, // Brand orange
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: 'white',
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF', // White progress fill on orange gradient
    borderRadius: 3,
    opacity: 0.9,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: 'white',
  },
  menuContainer: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.md,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONTS.sizes.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  logoutText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: '#EF4444',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.md,
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
});

export default ProfileModal;

