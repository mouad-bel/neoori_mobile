import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';
import { SPACING } from '../../constants/theme';

interface ThemeToggleProps {
  style?: object;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style = {}, showLabel = false }) => {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </Text>
      )}
      <TouchableOpacity
        onPress={toggleTheme}
        style={[
          styles.button,
          { backgroundColor: colors.cardBackground }
        ]}
        accessibilityLabel={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
        accessibilityHint="Change le thème de l'application"
        accessibilityRole="button"
      >
        <Ionicons
          name={theme === 'dark' ? 'sunny' : 'moon'}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: SPACING.sm,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginRight: SPACING.md,
    fontSize: 14,
  },
});

export default ThemeToggle;
