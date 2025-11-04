import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface CategoryBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  icon,
  label,
  color = COLORS.primary,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
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

