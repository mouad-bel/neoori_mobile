import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  showBar?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  completed, 
  total,
  showBar = true 
}) => {
  const { colors } = useTheme();
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={[styles.progressText, { color: colors.textPrimary }]}>
          {completed}/{total} explorations complétées
        </Text>
      </View>
      
      {showBar && (
        <View style={[styles.progressBarContainer, { backgroundColor: colors.cardBackground }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${percentage}%`, 
                backgroundColor: colors.primary 
              }
            ]} 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  progressBarContainer: {
    height: 6,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
});

export default ProgressIndicator;

