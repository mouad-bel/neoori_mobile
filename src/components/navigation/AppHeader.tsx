import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';

interface AppHeaderProps {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  title?: string;
  showLogo?: boolean;
  showNotifications?: boolean;
  showChat?: boolean;
  showProfile?: boolean;
  transparent?: boolean;
  style?: object;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuPress,
  onProfilePress,
  title = 'Neoori',
  showLogo = true,
  showNotifications = true,
  showChat = true,
  showProfile = true,
  transparent = false,
  style = {},
}) => {
  const { colors, theme } = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme === 'dark';
  
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
          <View style={styles.logoContainer}>
            {/* Brand Logo Icon */}
            <View style={[
              styles.logoIconWrapper,
              isDarkMode && styles.logoIconWrapperDark,
              !isDarkMode && styles.logoIconWrapperLight
            ]}>
              <View style={styles.logoIcon}>
                <View style={[
                  styles.logoBaseShape,
                  isDarkMode && styles.logoBaseShapeDark,
                  !isDarkMode && styles.logoBaseShapeLight
                ]} />
                <LinearGradient
                  colors={['#FF6B35', '#FF8C42', '#FFB380']}
                  start={{ x: 0.5, y: 0.8 }}
                  end={{ x: 0.5, y: 0 }}
                  style={styles.logoGradient}
                >
                  <View style={styles.logoGradientShape} />
                </LinearGradient>
                <View style={styles.logoDot} />
              </View>
            </View>
            {/* Brand Wordmark */}
            <View style={styles.logoTextContainer}>
              <Text style={[
                styles.logoTextNavy,
                !isDarkMode && { color: '#1E293B' },
                isDarkMode && { color: '#F8FAFC' }
              ]}>neo</Text>
              <View style={styles.logoOriContainer}>
                <Text style={styles.logoTextOrange}>or</Text>
                <View style={styles.logoI}>
                  <Text style={styles.logoTextOrange}>i</Text>
                  <View style={styles.logoIDot} />
                </View>
              </View>
            </View>
          </View>
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
            {user?.avatar ? (
              <View style={[styles.profileAvatarContainer, { borderColor: colors.primary }]}>
                <Image 
                  source={{ uri: user.avatar }} 
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
    paddingTop: 50,
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 3,
  },
  logoIconWrapperDark: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  logoIconWrapperLight: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(30, 41, 59, 0.15)',
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  logoBaseShape: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 15,
    backgroundColor: '#1E293B',
    bottom: 1,
    left: 1,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoBaseShapeDark: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoBaseShapeLight: {
    borderColor: 'rgba(30, 41, 59, 0.2)',
  },
  logoGradient: {
    position: 'absolute',
    width: 21,
    height: 21,
    borderRadius: 12,
    bottom: 1,
    right: 1,
    overflow: 'hidden',
  },
  logoGradientShape: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 9,
  },
  logoDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B35',
    top: 1,
    right: 4,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextNavy: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.5,
  },
  logoOriContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoTextOrange: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.5,
    color: '#FF6B35',
  },
  logoI: {
    position: 'relative',
  },
  logoIDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FF6B35',
    top: -1,
    right: -1,
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
