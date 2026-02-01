import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import NeooriLogo from '../common/NeooriLogo';
import { useAvatar } from '../../hooks/useAvatar';

interface AppHeaderProps {
  onMenuPress?: () => void;
  onBackPress?: () => void;
  onProfilePress?: () => void;
  title?: string;
  showLogo?: boolean;
  showNotifications?: boolean;
  showChat?: boolean;
  showProfile?: boolean;
  transparent?: boolean;
  style?: object;
  showBackButton?: boolean; // If true, shows back button instead of menu
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuPress,
  onBackPress,
  onProfilePress,
  title = 'Neoori',
  showLogo = true,
  showNotifications = true,
  showChat = true,
  showProfile = true,
  transparent = false,
  style = {},
  showBackButton = false,
}) => {
  const { colors, theme } = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme === 'dark';
  const { avatarDataUri, avatarVersion } = useAvatar();
  
  return (
    <View style={[
      styles.container, 
      transparent ? 
        { backgroundColor: 'rgba(15, 23, 42, 0.95)' } : // Navy blue with transparency
        { 
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? 'rgba(255, 107, 53, 0.1)' : 'rgba(30, 41, 59, 0.1)' // Brand color borders
        },
      style
    ]}>
      <View style={styles.leftSection}>
        {showBackButton && onBackPress ? (
          <>
            <TouchableOpacity 
              onPress={onBackPress} 
              style={styles.menuButton}
              accessibilityRole="button"
              accessibilityLabel="Retour"
            >
              <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            {showLogo && (
              <NeooriLogo size="medium" />
            )}
          </>
        ) : (
          <>
            {onMenuPress && (
              <TouchableOpacity 
                onPress={onMenuPress} 
                style={styles.menuButton}
                accessibilityRole="button"
                accessibilityLabel="Menu"
              >
                <Ionicons name="menu" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            )}
            {showLogo && (
              <NeooriLogo size="medium" />
            )}
          </>
        )}
      </View>

      <View style={styles.rightSection}>
        {showNotifications && (
          <TouchableOpacity 
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <View style={styles.iconButtonContainer}>
              <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            </View>
          </TouchableOpacity>
        )}
        {showChat && (
          <TouchableOpacity 
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Messages"
          >
            <View style={styles.iconButtonContainer}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.textPrimary} />
            </View>
          </TouchableOpacity>
        )}
        {showProfile && onProfilePress && (
          <TouchableOpacity 
            style={[styles.iconButton, styles.profileButton]}
            onPress={onProfilePress}
            accessibilityRole="button"
            accessibilityLabel="Profil"
          >
            {avatarDataUri ? (
              <View style={[styles.profileAvatarContainer, { borderColor: colors.primary }]}>
                <Image 
                  key={`header-avatar-${user?.avatar || ''}-${avatarVersion}`}
                  source={{ uri: avatarDataUri }} 
                  style={styles.profileAvatar} 
                />
              </View>
            ) : (
              <View style={[styles.profileIconContainer, { borderColor: colors.primary }]}>
                <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: 45,
    minHeight: 70,
    zIndex: 100,
  },
  // Styles de fond gérés dynamiquement dans le composant
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginLeft: SPACING.sm,
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: SPACING.md,
  },
  iconButtonContainer: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  profileButton: {
    marginLeft: SPACING.sm,
  },
  profileAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  profileIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppHeader;
