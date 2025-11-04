import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface MatchBadgeProps {
  percentage: number;
}

const MatchBadge: React.FC<MatchBadgeProps> = ({ percentage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.percentage}>{percentage}%</Text>
      <Text style={styles.label}>Match</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  percentage: {
    color: COLORS.background,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  label: {
    color: COLORS.background,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
});

export default MatchBadge;

