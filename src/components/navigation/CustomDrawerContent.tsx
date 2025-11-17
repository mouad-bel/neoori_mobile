import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import ThemeToggle from '../ui/ThemeToggle';
import { DRAWER_ROUTES } from '../../constants/routes';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { logout } = useAuth();
  const { colors, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderMenuItem = (route: typeof DRAWER_ROUTES[0], index: number) => {
    // Get the current active route name from the navigation state
    const currentRouteName = props.state.routes[props.state.index]?.name;
    const isActive = currentRouteName === route.name;
    const showSectionHeader =
      index === 0 ||
      (route.section && route.section !== DRAWER_ROUTES[index - 1]?.section);

    return (
      <View key={route.name}>
        {showSectionHeader && route.section && (
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
            {route.section}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.menuItem, isActive && styles.menuItemActive]}
          onPress={() => props.navigation.navigate(route.name)}
          accessibilityRole="button"
          accessibilityLabel={route.label}
        >
          <Ionicons
            name={route.icon as any}
            size={24}
            color={isActive ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.menuLabel,
              { color: colors.textSecondary },
              isActive && { color: colors.primary, fontWeight: '600' },
            ]}
          >
            {route.label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView
        {...props}
      >
        {/* Logo Header */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconContainer}>
            {/* Logo Icon Container with background for visibility in dark mode */}
            <View style={[
              styles.logoIconWrapper,
              isDarkMode && styles.logoIconWrapperDark,
              !isDarkMode && styles.logoIconWrapperLight
            ]}>
              {/* Logo Icon: Navy blue base with orange gradient element (sweeping upward) */}
              <View style={styles.logoIcon}>
                {/* Navy blue base shape (curved/teardrop) */}
                <View style={[
                  styles.logoBaseShape,
                  isDarkMode && styles.logoBaseShapeDark,
                  !isDarkMode && styles.logoBaseShapeLight
                ]} />
                {/* Orange gradient element (sweeping upward) */}
                <LinearGradient
                  colors={['#FF6B35', '#FF8C42', '#FFB380']}
                  start={{ x: 0.5, y: 0.8 }}
                  end={{ x: 0.5, y: 0 }}
                  style={styles.logoGradient}
                >
                  <View style={styles.logoGradientShape} />
                </LinearGradient>
                {/* Small orange dot above (spark/head) */}
                <View style={styles.logoDot} />
              </View>
            </View>
          </View>
          {/* Wordmark: "neo" in navy blue (light in dark mode), "ori" in orange with orange dot on 'i' */}
          <View style={styles.logoTextContainer}>
            <Text style={[
              styles.logoTextNavy,
              !isDarkMode && { color: '#1E293B' }, // Navy blue in light mode
              isDarkMode && { color: '#F8FAFC' } // Light color in dark mode
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

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {DRAWER_ROUTES.map((route, index) => renderMenuItem(route, index))}
        </View>
      </DrawerContentScrollView>

      {/* Settings and Logout */}
      <View style={[styles.footer, { borderTopColor: isDarkMode ? 'rgba(255, 107, 53, 0.15)' : 'rgba(30, 41, 59, 0.1)' }]}>
        <View style={styles.settingsRow}>
          <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Thème</Text>
          <ThemeToggle />
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { borderColor: colors.error }]} 
          onPress={handleLogout}
          accessibilityLabel="Se déconnecter"
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 53, 0.15)', // Brand orange separator
    marginBottom: SPACING.md,
  },
  logoIconContainer: {
    position: 'relative',
  },
  logoIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 6,
  },
  logoIconWrapperDark: {
    backgroundColor: '#1E293B', // Navy blue background for dark mode
    borderWidth: 1.5,
    borderColor: 'rgba(255, 107, 53, 0.2)', // Subtle orange border
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  logoIconWrapperLight: {
    backgroundColor: '#F8FAFC', // Light background for light mode
    borderWidth: 1.5,
    borderColor: 'rgba(30, 41, 59, 0.15)', // Subtle navy blue border
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  logoBaseShape: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#1E293B', // Navy blue - brand primary base
    bottom: 2,
    left: 2,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoBaseShapeDark: {
    backgroundColor: '#1E293B', // Navy blue
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoBaseShapeLight: {
    backgroundColor: '#1E293B', // Navy blue - same in both modes
    borderColor: 'rgba(30, 41, 59, 0.2)',
  },
  logoGradient: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 16,
    bottom: 2,
    right: 2,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoGradientShape: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 12,
  },
  logoDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    top: 2,
    right: 6,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextNavy: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
    // Color will be set dynamically based on theme
  },
  logoOriContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoTextOrange: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
    color: '#FF6B35', // Brand orange - always visible
    textShadowColor: 'rgba(255, 107, 53, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  logoI: {
    position: 'relative',
  },
  logoIDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF6B35', // Brand orange
    top: -2,
    right: -1,
  },
  scrollContent: {
    paddingTop: SPACING.md,
  },
  menuSection: {
    paddingVertical: SPACING.lg,
  },
  sectionHeader: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 0,
    transition: 'all 0.2s',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)', // Brand orange background
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35', // Brand orange accent border
  },
  menuLabel: {
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  settingsLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  logoutText: {
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
});

export default CustomDrawerContent;

