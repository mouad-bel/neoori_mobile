import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, ICON_SIZES, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label?: string;
  count?: number;
  active?: boolean;
  size?: keyof typeof ICON_SIZES;
  style?: ViewStyle;
  fixedColors?: boolean; // Pour forcer des couleurs fixes indépendamment du thème
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  label,
  count,
  active = false,
  size = 'md',
  style,
  fixedColors = false,
}) => {
  const { colors } = useTheme();
  const iconSize = ICON_SIZES[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={iconSize}
          color={active 
            ? (fixedColors ? COLORS.primary : colors.primary) // Brand orange
            : (fixedColors ? '#FFFFFF' : colors.textPrimary)}
        />
        {count !== undefined && count > 0 && (
          <Text style={[styles.count, { color: fixedColors ? '#FFFFFF' : colors.textPrimary }]}>{formatCount(count)}</Text>
        )}
      </View>
      {label && <Text style={[styles.label, { color: fixedColors ? '#FFFFFF' : colors.textPrimary }]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // Couleur semi-transparente fixe
  },
  count: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.regular,
    marginTop: SPACING.xs,
  },
});

export default IconButton;

