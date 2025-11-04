import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';

interface DurationBadgeProps {
  duration: string;
}

const DurationBadge: React.FC<DurationBadgeProps> = ({ duration }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.semiTransparent }]}>
      <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
      <Text style={[styles.duration, { color: colors.textPrimary }]}>{duration}</Text>
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
  duration: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    marginLeft: SPACING.xs,
  },
});

export default DurationBadge;

