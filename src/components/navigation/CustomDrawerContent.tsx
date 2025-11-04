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
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { DRAWER_ROUTES } from '../../constants/routes';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { logout } = useAuth();

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
          <Text style={styles.sectionHeader}>{route.section}</Text>
        )}
        <TouchableOpacity
          style={[styles.menuItem, isActive && styles.menuItemActive]}
          onPress={() => props.navigation.navigate(route.name)}
        >
          <Ionicons
            name={route.icon as any}
            size={24}
            color={isActive ? COLORS.primary : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.menuLabel,
              isActive && styles.menuLabelActive,
            ]}
          >
            {route.label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
      >
        {/* Menu Items */}
        <View style={styles.menuSection}>
          {DRAWER_ROUTES.map((route, index) => renderMenuItem(route, index))}
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.primary + '20',
  },
  menuLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
  menuLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBackground,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  logoutText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.error,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
});

export default CustomDrawerContent;
