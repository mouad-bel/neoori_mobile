import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';

interface AppHeaderProps {
  onMenuPress?: () => void;
  title?: string;
  showLogo?: boolean;
  showNotifications?: boolean;
  showChat?: boolean;
  transparent?: boolean;
  style?: object;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuPress,
  title = 'Neoori',
  showLogo = true,
  showNotifications = true,
  showChat = true,
  transparent = false,
  style = {},
}) => {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.container, 
      transparent ? 
        { backgroundColor: 'rgba(10, 15, 30, 0.9)' } : 
        { 
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.cardBackground 
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
            <Text style={[styles.logoTitle, { color: colors.textPrimary }]}>{title}</Text>
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
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        {showChat && (
          <TouchableOpacity 
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Messages"
          >
            <Ionicons name="chatbubble-outline" size={24} color={colors.textPrimary} />
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
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  },
  logoTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginLeft: SPACING.md,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: SPACING.lg,
  },
});

export default AppHeader;
