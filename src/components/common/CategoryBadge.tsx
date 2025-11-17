import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';

interface CategoryBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  fixedColors?: boolean; // Pour forcer des couleurs fixes indépendamment du thème
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  icon,
  label,
  color,
  fixedColors = false,
}) => {
  const { colors } = useTheme();
  // Si fixedColors est true, on utilise la couleur fournie ou une couleur fixe
  const badgeColor = fixedColors ? (color || '#FF6B35') : (color || colors.primary); // Brand orange
  return (
    <View style={[styles.container, { backgroundColor: badgeColor + '20' }]}>
      <Ionicons name={icon} size={16} color={badgeColor} />
      <Text style={[styles.label, { color: badgeColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    marginLeft: SPACING.xs,
  },
});

export default CategoryBadge;

