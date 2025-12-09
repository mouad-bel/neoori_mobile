import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Game, GameProgress, GameType } from '../../types';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import StorageService from '../../services/storage/StorageService';
import AppHeader from '../navigation/AppHeader';
import { BaseGameProps } from './BaseGameInterface';
import CongratulationsModal from '../common/CongratulationsModal';

interface ValueItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface ValuesSelectionGameProps extends BaseGameProps {
  values: ValueItem[];
  question: string;
  instructions: string;
  minSelection?: number;
  maxSelection?: number;
}

const ValuesSelectionGame: React.FC<ValuesSelectionGameProps> = ({
  game,
  onComplete,
  values,
  question,
  instructions,
  minSelection = 3,
  maxSelection = 5,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const valueAnimations = useRef<Record<string, Animated.Value>>({}).current;

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress?.gameData?.selectedValues) {
      setSelectedValues(progress.gameData.selectedValues);
    }
  }, [progress]);

  const loadProgress = async () => {
    try {
      const savedProgress = await StorageService.getGameProgress(game.id);
      if (savedProgress && !savedProgress.completed) {
        setProgress(savedProgress);
      } else {
        const newProgress: GameProgress = {
          gameId: game.id,
          gameType: 'interactive' as GameType,
          gameData: {
            selectedValues: [],
          },
          startedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          completed: false,
        };
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (gameData: any, completed: boolean = false) => {
    try {
      const updatedProgress: GameProgress = {
        gameId: game.id,
        gameType: 'interactive' as GameType,
        gameData,
        startedAt: progress?.startedAt || new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        completed,
      };
      await StorageService.saveGameProgress(updatedProgress);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getValueAnimation = (valueId: string) => {
    if (!valueAnimations[valueId]) {
      valueAnimations[valueId] = new Animated.Value(1);
    }
    return valueAnimations[valueId];
  };

  const toggleValue = (valueId: string) => {
    const isSelected = selectedValues.includes(valueId);
    const anim = getValueAnimation(valueId);
    let newSelection: string[];

    if (isSelected) {
      // Remove from selection
      newSelection = selectedValues.filter(id => id !== valueId);
      Animated.spring(anim, {
        toValue: 1,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      // Add to selection (check max limit)
      if (selectedValues.length >= maxSelection) {
        return; // Can't select more
      }
      newSelection = [...selectedValues, valueId];
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(anim, {
          toValue: 1,
          tension: 200,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }

    setSelectedValues(newSelection);
    saveProgress({ selectedValues: newSelection });
  };

  const handleComplete = async () => {
    if (selectedValues.length < minSelection) {
      return; // Can't complete without minimum selection
    }

    await saveProgress({ selectedValues }, true);
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const canComplete = selectedValues.length >= minSelection && selectedValues.length <= maxSelection;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          title={game.title}
          showLogo={true}
          showNotifications={false}
          showChat={false}
          showProfile={false}
        />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>
            {question}
          </Text>
        </View>

        {/* Instructions */}
        <View style={[styles.instructionsSection, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={[styles.instructionsText, { color: colors.textPrimary }]}>
            {instructions}
          </Text>
        </View>

        {/* Selection Counter */}
        <View style={[styles.counterSection, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.counterContent}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <View style={styles.counterText}>
              <Text style={[styles.counterNumber, { color: colors.primary }]}>
                {selectedValues.length} / {maxSelection}
              </Text>
              <Text style={[styles.counterLabel, { color: colors.textSecondary }]}>
                valeurs sélectionnées
              </Text>
            </View>
          </View>
          {selectedValues.length < minSelection && (
            <Text style={[styles.minText, { color: colors.textSecondary }]}>
              Minimum {minSelection} requis
            </Text>
          )}
        </View>

        {/* Values Grid */}
        <View style={styles.valuesSection}>
          {values.map((value) => {
            const isSelected = selectedValues.includes(value.id);
            const isDisabled = !isSelected && selectedValues.length >= maxSelection;
            const anim = getValueAnimation(value.id);

            return (
              <Animated.View
                key={value.id}
                style={{
                  transform: [{ scale: anim }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.valueCard,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                      borderColor: isSelected ? colors.primary : colors.background,
                      borderWidth: isSelected ? 3 : 2,
                      opacity: isDisabled ? 0.5 : 1,
                    },
                  ]}
                  onPress={() => !isDisabled && toggleValue(value.id)}
                  disabled={isDisabled}
                  activeOpacity={0.8}
                >
                <View style={styles.valueHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: isSelected
                          ? colors.background
                          : `${colors.primary}20`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={value.icon as any}
                      size={24}
                      color={isSelected ? colors.primary : colors.textPrimary}
                    />
                  </View>
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: colors.background }]}>
                      <Ionicons name="checkmark" size={16} color={colors.primary} />
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.valueLabel,
                    {
                      color: isSelected ? colors.background : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {value.label}
                </Text>
                <Text
                  style={[
                    styles.valueDescription,
                    {
                      color: isSelected
                        ? `${colors.background}CC`
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {value.description}
                </Text>
              </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor: canComplete ? colors.primary : colors.background,
              opacity: canComplete ? 1 : 0.5,
            },
          ]}
          onPress={handleComplete}
          disabled={!canComplete}
        >
          <Text
            style={[
              styles.completeButtonText,
              { color: canComplete ? colors.background : colors.textSecondary },
            ]}
          >
            {selectedValues.length < minSelection
              ? `Sélectionne au moins ${minSelection} valeurs`
              : selectedValues.length > maxSelection
              ? `Maximum ${maxSelection} valeurs`
              : 'Terminer'}
          </Text>
          {canComplete && (
            <Ionicons name="checkmark-circle" size={24} color={colors.background} />
          )}
        </TouchableOpacity>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      <CongratulationsModal
        visible={showCongratulations}
        onClose={handleCongratulationsClose}
        title="Félicitations ! 🎉"
        message={`Tu as terminé "${game.title}" avec succès !`}
        delay={2000}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: 100,
    paddingBottom: 100, // Space for bottom bar
  },
  questionSection: {
    marginBottom: SPACING.lg,
  },
  questionText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
  },
  instructionsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  instructionsText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    lineHeight: 18,
  },
  counterSection: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  counterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  counterText: {
    flex: 1,
  },
  counterNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  counterLabel: {
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  minText: {
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  valuesSection: {
    marginBottom: SPACING.xl,
  },
  valueCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueLabel: {
    fontSize: FONTS.sizes.lg,
    marginBottom: SPACING.xs,
  },
  valueDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  completeButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
});

export default ValuesSelectionGame;


