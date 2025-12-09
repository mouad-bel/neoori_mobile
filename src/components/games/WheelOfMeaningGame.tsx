import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
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
import NeooriLogo from '../common/NeooriLogo';
import CongratulationsModal from '../common/CongratulationsModal';

interface Axis {
  id: string;
  label: string;
  icon: string;
  color: string;
  questions: {
    id: string;
    question: string;
    options: string[];
  }[];
}

interface WheelOfMeaningGameProps extends BaseGameProps {
  axes: Axis[];
  instructions: string;
}

const WheelOfMeaningGame: React.FC<WheelOfMeaningGameProps> = ({
  game,
  onComplete,
  axes,
  instructions,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [currentAxisIndex, setCurrentAxisIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, number>>>({});
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress?.gameData?.answers) {
      setAnswers(progress.gameData.answers);
      const allAnswered = checkAllAnswered(progress.gameData.answers);
      if (allAnswered && progress.completed && !showCongratulations) {
        // Only show results if game was completed AND congratulations modal is not showing
        // This prevents showing results before congratulations modal appears
        console.log('[WheelOfMeaning] Loading completed game - showing results');
        setHasCompleted(true);
        setShowResults(true);
      }
    }
  }, [progress, showCongratulations]);

  const loadProgress = async () => {
    try {
      const savedProgress = await StorageService.getGameProgress(game.id);
      if (savedProgress && !savedProgress.completed) {
        setProgress(savedProgress);
        if (savedProgress.gameData?.currentAxisIndex !== undefined) {
          setCurrentAxisIndex(savedProgress.gameData.currentAxisIndex);
        }
      } else {
        const newProgress: GameProgress = {
          gameId: game.id,
          gameType: 'interactive' as GameType,
          gameData: {
            answers: {},
            currentAxisIndex: 0,
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

  const checkAllAnswered = (currentAnswers: Record<string, Record<string, number>>) => {
    return axes.every(axis =>
      axis.questions.every(q => currentAnswers[axis.id]?.[q.id] !== undefined)
    );
  };

  const handleAnswer = (axisId: string, questionId: string, answerIndex: number) => {
    console.log('[WheelOfMeaning] handleAnswer called:', { axisId, questionId, answerIndex });
    const newAnswers = {
      ...answers,
      [axisId]: {
        ...answers[axisId],
        [questionId]: answerIndex,
      },
    };
    setAnswers(newAnswers);

    // Check if all questions for this axis are answered
    const currentAxis = axes.find(a => a.id === axisId);
    const axisAnswered = currentAxis?.questions.every(q => newAnswers[axisId]?.[q.id] !== undefined);
    console.log('[WheelOfMeaning] Axis answered:', { axisId, axisAnswered, currentAxisIndex, totalAxes: axes.length });

    if (axisAnswered && currentAxisIndex < axes.length - 1) {
      // Move to next axis
      setTimeout(() => {
        const nextIndex = currentAxisIndex + 1;
        setCurrentAxisIndex(nextIndex);
        saveProgress({
          answers: newAnswers,
          currentAxisIndex: nextIndex,
        });
      }, 500);
    } else {
      saveProgress({
        answers: newAnswers,
        currentAxisIndex,
      });
    }

    // Check if all axes completed - automatically trigger completion flow
    const allAnswered = checkAllAnswered(newAnswers);
    console.log('[WheelOfMeaning] All answered check:', { allAnswered, newAnswers });
    if (allAnswered) {
      console.log('[WheelOfMeaning] All questions answered! Triggering completion...');
      // All questions answered - automatically complete the game
      setTimeout(() => {
        handleComplete(newAnswers);
      }, 500);
    }
  };

  const calculateAxisScore = (axisId: string) => {
    const axisAnswers = answers[axisId] || {};
    const axis = axes.find(a => a.id === axisId);
    if (!axis) return 0;

    const total = axis.questions.reduce((sum, q) => {
      const answer = axisAnswers[q.id];
      return sum + (answer !== undefined ? answer + 1 : 0);
    }, 0);

    const max = axis.questions.length * 5; // Assuming 5 options max
    return Math.round((total / max) * 100);
  };

  const handleComplete = async (finalAnswers?: Record<string, Record<string, number>>) => {
    console.log('[WheelOfMeaning] handleComplete called:', { 
      hasFinalAnswers: !!finalAnswers, 
      showResults, 
      hasCompleted,
      showCongratulations 
    });
    
    // Use provided answers or current answers
    const answersToUse = finalAnswers || answers;
    
    // Check if all questions are answered
    const allAnswered = checkAllAnswered(answersToUse);
    console.log('[WheelOfMeaning] All answered check in handleComplete:', { allAnswered });
    
    if (!allAnswered) {
      console.log('[WheelOfMeaning] Cannot complete - not all questions answered');
      // Can't complete without all answers
      return;
    }

    // If already showing results, just navigate back
    if (showResults && hasCompleted) {
      console.log('[WheelOfMeaning] Already completed and showing results - navigating back');
      if (onComplete) {
        onComplete();
      } else {
        navigation.goBack();
      }
      return;
    }

    console.log('[WheelOfMeaning] Saving progress and showing congratulations...');
    // Set state FIRST before saving to prevent useEffect from triggering showResults
    setHasCompleted(true);
    setShowCongratulations(true);
    console.log('[WheelOfMeaning] State updated:', { hasCompleted: true, showCongratulations: true });
    
    // Save progress AFTER setting state to prevent race condition
    await saveProgress(
      {
        answers: answersToUse,
        currentAxisIndex: axes.length - 1,
      },
      true
    );
  };

  const handleCongratulationsClose = () => {
    console.log('[WheelOfMeaning] handleCongratulationsClose called');
    setShowCongratulations(false);
    setShowResults(true);
    console.log('[WheelOfMeaning] State updated:', { showCongratulations: false, showResults: true });
  };

  const currentAxis = axes[currentAxisIndex];
  const currentQuestionIndex = currentAxis
    ? currentAxis.questions.findIndex(q => !answers[currentAxis.id]?.[q.id])
    : 0;
  const currentQuestion = currentAxis?.questions[currentQuestionIndex];

  const allAnswered = checkAllAnswered(answers);
  const progressPercentage = axes.reduce((sum, axis) => {
    const axisAnswers = answers[axis.id] || {};
    const answered = axis.questions.filter(q => axisAnswers[q.id] !== undefined).length;
    return sum + answered;
  }, 0);
  const totalQuestions = axes.reduce((sum, axis) => sum + axis.questions.length, 0);
  const overallProgress = totalQuestions > 0 ? (progressPercentage / totalQuestions) * 100 : 0;

  console.log('[WheelOfMeaning] Render state:', { 
    showResults, 
    hasCompleted, 
    showCongratulations,
    allAnswered: checkAllAnswered(answers)
  });

  if (showResults && hasCompleted) {
    console.log('[WheelOfMeaning] Rendering results screen');
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
          <View style={styles.resultsSection}>
            <View style={styles.titleContainer}>
              <Text style={[styles.resultsTitle, { color: colors.textPrimary }]}>
                Ta Roue du Sens
              </Text>
              <NeooriLogo size="small" showText={false} style={styles.logo} />
            </View>
            <Text style={[styles.resultsSubtitle, { color: colors.textSecondary }]}>
              Voici ton portrait professionnel personnalisé
            </Text>

            {/* Wheel Visualization */}
            <View style={[styles.wheelContainer, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.wheelGrid}>
                {axes.map((axis, index) => {
                  const score = calculateAxisScore(axis.id);
                  const angle = (index * 360) / axes.length;
                  return (
                    <View
                      key={axis.id}
                      style={[
                        styles.wheelSegment,
                        {
                          backgroundColor: `${axis.color}30`,
                          borderColor: axis.color,
                        },
                      ]}
                    >
                      <View style={[styles.segmentIcon, { backgroundColor: `${axis.color}20` }]}>
                        <Ionicons name={axis.icon as any} size={24} color={axis.color} />
                      </View>
                      <Text style={[styles.segmentLabel, { color: colors.textPrimary }]}>
                        {axis.label}
                      </Text>
                      <View style={styles.segmentScoreBar}>
                        <View
                          style={[
                            styles.segmentScoreFill,
                            {
                              width: `${score}%`,
                              backgroundColor: axis.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.segmentScore, { color: axis.color }]}>
                        {score}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Detailed Results */}
            <View style={styles.axesDetails}>
              <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>
                Détails par axe
              </Text>
              {axes.map(axis => {
                const score = calculateAxisScore(axis.id);
                return (
                  <View
                    key={axis.id}
                    style={[styles.axisDetailCard, { backgroundColor: colors.cardBackground }]}
                  >
                    <View style={styles.axisDetailHeader}>
                      <View
                        style={[
                          styles.axisIconContainer,
                          { backgroundColor: `${axis.color}20` },
                        ]}
                      >
                        <Ionicons name={axis.icon as any} size={28} color={axis.color} />
                      </View>
                      <View style={styles.axisDetailContent}>
                        <Text style={[styles.axisDetailLabel, { color: colors.textPrimary }]}>
                          {axis.label}
                        </Text>
                        <View style={styles.scoreBar}>
                          <View
                            style={[
                              styles.scoreFill,
                              {
                                width: `${score}%`,
                                backgroundColor: axis.color,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.scoreText, { color: colors.textSecondary }]}>
                          Score : {score}%
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.completeButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => {
                console.log('[WheelOfMeaning] Terminer button pressed in results screen');
                console.log('[WheelOfMeaning] onComplete exists:', !!onComplete);
                if (onComplete) {
                  console.log('[WheelOfMeaning] Calling onComplete...');
                  onComplete();
                } else {
                  console.log('[WheelOfMeaning] onComplete not provided, using navigation.goBack()');
                  navigation.goBack();
                }
              }}
            >
              <Text style={[styles.completeButtonText, { color: colors.background }]}>
                Terminer
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
              {currentAxis?.label || 'Démarrage'}
            </Text>
            <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
              {Math.round(overallProgress)}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${overallProgress}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.instructionsSection, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={[styles.instructionsText, { color: colors.textPrimary }]}>
            {instructions}
          </Text>
        </View>

        {/* Axis Progress */}
        <View style={styles.axesProgress}>
          {axes.map((axis, index) => {
            const axisAnswers = answers[axis.id] || {};
            const answered = axis.questions.filter(q => axisAnswers[q.id] !== undefined).length;
            const axisProgress = (answered / axis.questions.length) * 100;
            const isCurrent = index === currentAxisIndex;
            const isCompleted = answered === axis.questions.length;

            return (
              <View
                key={axis.id}
                style={[
                  styles.axisProgressItem,
                  {
                    backgroundColor: isCurrent
                      ? `${axis.color}20`
                      : isCompleted
                      ? `${axis.color}10`
                      : colors.cardBackground,
                    borderColor: isCurrent ? axis.color : colors.background,
                    borderWidth: isCurrent ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.axisProgressHeader}>
                  <Ionicons
                    name={axis.icon as any}
                    size={20}
                    color={isCompleted ? axis.color : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.axisProgressLabel,
                      {
                        color: isCurrent ? axis.color : colors.textPrimary,
                        fontWeight: isCurrent ? '700' : '500',
                      },
                    ]}
                  >
                    {axis.label}
                  </Text>
                </View>
                <View style={styles.axisProgressBar}>
                  <View
                    style={[
                      styles.axisProgressFill,
                      {
                        width: `${axisProgress}%`,
                        backgroundColor: axis.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Current Question */}
        {currentQuestion && (
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <View
                style={[
                  styles.axisBadge,
                  {
                    backgroundColor: `${currentAxis.color}20`,
                  },
                ]}
              >
                <Ionicons name={currentAxis.icon as any} size={20} color={currentAxis.color} />
                <Text style={[styles.axisBadgeText, { color: currentAxis.color }]}>
                  {currentAxis.label}
                </Text>
              </View>
              <Text style={[styles.questionNumber, { color: colors.textSecondary }]}>
                {currentQuestionIndex + 1} / {currentAxis.questions.length}
              </Text>
            </View>

            <Text style={[styles.questionText, { color: colors.textPrimary }]}>
              {currentQuestion.question}
            </Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const isSelected =
                  answers[currentAxis.id]?.[currentQuestion.id] === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isSelected
                          ? currentAxis.color
                          : colors.cardBackground,
                        borderColor: isSelected ? currentAxis.color : colors.background,
                        borderWidth: isSelected ? 3 : 2,
                      },
                    ]}
                    onPress={() => handleAnswer(currentAxis.id, currentQuestion.id, index)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected ? colors.background : colors.textPrimary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
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
  axesProgress: {
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  axisProgressItem: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  axisProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  axisProgressLabel: {
    fontSize: FONTS.sizes.sm,
    flex: 1,
  },
  axisProgressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  axisProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionSection: {
    marginTop: SPACING.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  axisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  axisBadgeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  questionNumber: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  questionText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: SPACING.lg,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionButton: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
  },
  optionText: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
  },
  resultsSection: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  resultsTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    textAlign: 'center',
  },
  logo: {
    marginLeft: SPACING.xs,
  },
  resultsSubtitle: {
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  wheelContainer: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  wheelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  wheelSegment: {
    width: '45%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  segmentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  segmentLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  segmentScoreBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  segmentScoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  segmentScore: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  axesDetails: {
    width: '100%',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  detailsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  axisDetailCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  axisDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  axisIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  axisDetailContent: {
    flex: 1,
  },
  axisDetailLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  scoreBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 5,
  },
  scoreText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  completeButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
    width: '100%',
  },
  completeButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
});

export default WheelOfMeaningGame;
