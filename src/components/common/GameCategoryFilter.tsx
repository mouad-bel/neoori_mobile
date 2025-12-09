import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export interface GameCategory {
  id: string;
  label: string;
  icon: string;
}

interface GameCategoryFilterProps {
  categories: GameCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const GameCategoryFilter: React.FC<GameCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.filterPill,
          {
            backgroundColor: selectedCategory === null ? colors.primary : colors.cardBackground,
            borderColor: selectedCategory === null ? colors.primary : colors.border,
            borderWidth: 1,
          },
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text
          style={[
            styles.filterText,
            {
              color: selectedCategory === null ? colors.background : colors.textPrimary,
              fontWeight: selectedCategory === null ? '600' : '400',
            },
          ]}
        >
          Tous
        </Text>
      </TouchableOpacity>

      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterPill,
              {
                backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: isSelected ? colors.background : colors.textPrimary,
                  fontWeight: isSelected ? '600' : '400',
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
  },
});

export default GameCategoryFilter;

