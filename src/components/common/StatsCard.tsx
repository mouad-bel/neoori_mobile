import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color }) => {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    gap: SPACING.sm,
    minWidth: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
  },
});

export default StatsCard;

