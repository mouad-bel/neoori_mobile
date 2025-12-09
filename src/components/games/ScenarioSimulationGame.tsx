import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
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

interface Scenario {
  id: string;
  title: string;
  description: string;
  question: string;
  options: {
    id: string;
    label: string;
    description: string;
    outcome: string;
  }[];
}

interface ScenarioSimulationGameProps extends BaseGameProps {
  scenarios: Scenario[];
  instructions: string;
}

const ScenarioSimulationGame: React.FC<ScenarioSimulationGameProps> = ({
  game,
  onComplete,
  scenarios,
  instructions,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress?.gameData?.currentScenarioIndex !== undefined) {
      setCurrentScenarioIndex(progress.gameData.currentScenarioIndex);
      setAnswers(progress.gameData.answers || {});
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
          gameType: 'simulation' as GameType,
          gameData: {
            currentScenarioIndex: 0,
            answers: {},
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
        gameType: 'simulation' as GameType,
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

  const handleOptionSelect = (optionId: string) => {
    const currentScenario = scenarios[currentScenarioIndex];
    const newAnswers = { ...answers, [currentScenario.id]: optionId };
    setAnswers(newAnswers);

    // Save progress
    saveProgress({
      currentScenarioIndex,
      answers: newAnswers,
    });

    // Move to next scenario or complete
    if (currentScenarioIndex < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenarioIndex(currentScenarioIndex + 1);
      }, 500);
    } else {
      setTimeout(() => {
        handleComplete(newAnswers);
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1);
    }
  };

  const handleComplete = async (finalAnswers: Record<string, string>) => {
    await saveProgress(
      {
        currentScenarioIndex: scenarios.length - 1,
        answers: finalAnswers,
      },
      true
    );
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const currentScenario = scenarios[currentScenarioIndex];
  const selectedAnswer = answers[currentScenario?.id];
  const progressPercentage = ((currentScenarioIndex + 1) / scenarios.length) * 100;

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
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              Scénario {currentScenarioIndex + 1} / {scenarios.length}
            </Text>
            <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.instructionsSection, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name="bulb" size={20} color={colors.primary} />
          <Text style={[styles.instructionsText, { color: colors.textPrimary }]}>
            {instructions}
          </Text>
        </View>

        {/* Scenario Card */}
        <View style={[styles.scenarioCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.scenarioHeader}>
            <View style={[styles.scenarioIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Ionicons name="document-text" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.scenarioTitle, { color: colors.textPrimary }]}>
              {currentScenario.title}
            </Text>
          </View>
          <Text style={[styles.scenarioDescription, { color: colors.textSecondary }]}>
            {currentScenario.description}
          </Text>
          <View style={[styles.questionBox, { backgroundColor: `${colors.primary}10` }]}>
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>
              {currentScenario.question}
            </Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {currentScenario.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.background,
                    borderWidth: isSelected ? 3 : 2,
                  },
                ]}
                onPress={() => handleOptionSelect(option.id)}
              >
                <View style={styles.optionHeader}>
                  <View
                    style={[
                      styles.optionIcon,
                      {
                        backgroundColor: isSelected
                          ? colors.background
                          : `${colors.primary}20`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'radio-button-off'}
                      size={24}
                      color={isSelected ? colors.primary : colors.textPrimary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected ? colors.background : colors.textPrimary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionDescription,
                    {
                      color: isSelected
                        ? `${colors.background}CC`
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Navigation */}
        {currentScenarioIndex > 0 && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.cardBackground }]}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>
              Précédent
            </Text>
          </TouchableOpacity>
        )}

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
  progressSection: {
    marginBottom: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
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
  scenarioCard: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  scenarioIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioTitle: {
    flex: 1,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  scenarioDescription: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  questionBox: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  questionText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsSection: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  optionCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
  },
  optionDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginLeft: 56,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});

export default ScenarioSimulationGame;


