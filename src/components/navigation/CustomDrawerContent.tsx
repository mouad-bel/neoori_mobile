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
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import ThemeToggle from '../ui/ThemeToggle';
import { DRAWER_ROUTES } from '../../constants/routes';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { logout } = useAuth();
  const { colors } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderMenuItem = (route: typeof DRAWER_ROUTES[0], index: number) => {
    const isActive = props.state.index === index;
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
        {/* Menu Items */}
        <View style={styles.menuSection}>
          {DRAWER_ROUTES.map((route, index) => renderMenuItem(route, index))}
        </View>
      </DrawerContentScrollView>

      {/* Settings and Logout */}
      <View style={[styles.footer, { borderTopColor: colors.cardBackground }]}>
        <View style={styles.settingsRow}>
          <Text style={[styles.settingsLabel, { color: colors.textSecondary }]}>Thème</Text>
          <ThemeToggle />
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
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
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  menuItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)', // Bleu avec transparence
  },
  menuLabel: {
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
    fontWeight: '500',
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
  },
  logoutText: {
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
});

export default CustomDrawerContent;
