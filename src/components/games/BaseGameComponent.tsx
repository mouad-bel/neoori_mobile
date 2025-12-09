import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Game, GameProgress, GameQuestion } from '../../types';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import StorageService from '../../services/storage/StorageService';
import AppHeader from '../navigation/AppHeader';
import CongratulationsModal from '../common/CongratulationsModal';
import ConfettiAnimation from '../common/ConfettiAnimation';
import AnimatedButton from '../common/AnimatedButton';

interface BaseGameComponentProps {
  game: Game;
  questions: GameQuestion[];
  onComplete: () => void;
}

const BaseGameComponent: React.FC<BaseGameComponentProps> = ({
  game,
  questions,
  onComplete,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const optionAnimations = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress) {
      setCurrentQuestionIndex(progress.currentQuestion);
      setAnswers(progress.answers || {});
    }
  }, [progress]);

  useEffect(() => {
    // Load saved answer for current question
    if (answers[currentQuestionIndex] !== undefined) {
      setCurrentAnswer(answers[currentQuestionIndex]);
    } else {
      setCurrentAnswer(null);
    }

    // Animate question transition
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Initialize option animations
    const question = questions[currentQuestionIndex];
    if (question?.options) {
      optionAnimations.length = 0;
      question.options.forEach(() => {
        optionAnimations.push(new Animated.Value(0));
      });
      
      // Stagger animation for options
      Animated.stagger(
        50,
        optionAnimations.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [currentQuestionIndex, answers]);

  const loadProgress = async () => {
    try {
      const savedProgress = await StorageService.getGameProgress(game.id);
      if (savedProgress) {
        // If completed, allow restart by initializing new progress
        // User can still see previous answers if needed
        if (savedProgress.completed) {
          // Initialize new progress for restart
          const newProgress: GameProgress = {
            gameId: game.id,
            gameType: 'quiz',
            currentQuestion: 0,
            totalQuestions: questions.length,
            answers: {},
            startedAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            completed: false,
          };
          setProgress(newProgress);
        } else {
          // Load existing progress
          setProgress(savedProgress);
        }
      } else {
        // Initialize new progress
        const newProgress: GameProgress = {
          gameId: game.id,
          gameType: 'quiz',
          currentQuestion: 0,
          totalQuestions: questions.length,
          answers: {},
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

  const saveProgress = async (questionIndex: number, answer: any, nextQuestionIndex?: number) => {
    try {
      const updatedAnswers = { ...answers, [questionIndex]: answer };
      setAnswers(updatedAnswers);

      // If moving to next question, save the next question index
      // Otherwise, save the current question index
      const savedQuestionIndex = nextQuestionIndex !== undefined ? nextQuestionIndex : questionIndex;

      const updatedProgress: GameProgress = {
        gameId: game.id,
        gameType: 'quiz',
        currentQuestion: savedQuestionIndex,
        totalQuestions: questions.length,
        answers: updatedAnswers,
        startedAt: progress?.startedAt || new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        completed: savedQuestionIndex >= questions.length - 1 && questionIndex === questions.length - 1,
      };

      await StorageService.saveGameProgress(updatedProgress);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleNext = async () => {
    // Check if answer is valid (not null/undefined and not empty string for text inputs)
    const isValidAnswer = currentAnswer !== null && 
                          currentAnswer !== undefined && 
                          (currentQuestion.type !== 'text' || (typeof currentAnswer === 'string' && currentAnswer.trim().length > 0));
    
    if (!isValidAnswer) {
      console.log('Answer is not valid:', { currentAnswer, type: currentQuestion.type });
      return;
    }

    try {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        const nextIndex = currentQuestionIndex + 1;
        // Save progress with the next question index
        await saveProgress(currentQuestionIndex, currentAnswer, nextIndex);
        setCurrentQuestionIndex(nextIndex);
      } else {
        // Game completed - save final answer and mark as completed
        await saveProgress(currentQuestionIndex, currentAnswer, currentQuestionIndex);
        await handleComplete();
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
    }
  };

  const handlePrevious = async () => {
    if (currentQuestionIndex > 0) {
      try {
        const isValidAnswer = currentAnswer !== null && 
                              currentAnswer !== undefined && 
                              (currentQuestion.type !== 'text' || (typeof currentAnswer === 'string' && currentAnswer.trim().length > 0));
        
        const previousIndex = currentQuestionIndex - 1;
        
        // Save current answer if valid, and update progress to previous question
        if (isValidAnswer) {
          await saveProgress(currentQuestionIndex, currentAnswer, previousIndex);
        } else {
          // Even if no answer, update progress to show we're going back
          const updatedAnswers = { ...answers };
          const updatedProgress: GameProgress = {
            gameId: game.id,
            gameType: 'quiz',
            currentQuestion: previousIndex,
            totalQuestions: questions.length,
            answers: updatedAnswers,
            startedAt: progress?.startedAt || new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            completed: false,
          };
          await StorageService.saveGameProgress(updatedProgress);
          setProgress(updatedProgress);
        }
        
        // Move to previous question
        setCurrentQuestionIndex(previousIndex);
      } catch (error) {
        console.error('Error in handlePrevious:', error);
      }
    }
  };

  const handleComplete = async () => {
    if (currentAnswer !== null) {
      await saveProgress(currentQuestionIndex, currentAnswer);
    }

    // Mark as completed
    const finalProgress: GameProgress = {
      gameId: game.id,
      gameType: 'quiz',
      currentQuestion: questions.length - 1,
      totalQuestions: questions.length,
      answers: { ...answers, [currentQuestionIndex]: currentAnswer },
      startedAt: progress?.startedAt || new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      completed: true,
    };
    await StorageService.saveGameProgress(finalProgress);

    // Show confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    // Show congratulations modal
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const canGoNext = currentAnswer !== null && 
                    currentAnswer !== undefined && 
                    (currentQuestion.type !== 'text' || (typeof currentAnswer === 'string' && currentAnswer.trim().length > 0));

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => {
              const animValue = optionAnimations[index] || new Animated.Value(1);
              const scaleAnim = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              });
              const opacityAnim = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              });

              return (
                <Animated.View
                  key={index}
                  style={{
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: currentAnswer === index ? colors.primary : colors.cardBackground,
                        borderColor: currentAnswer === index ? colors.primary : colors.background,
                        borderWidth: currentAnswer === index ? 3 : 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                    ]}
                    onPress={() => {
                      setCurrentAnswer(index);
                      // Bounce animation on selection
                      Animated.sequence([
                        Animated.timing(animValue, {
                          toValue: 0.9,
                          duration: 100,
                          useNativeDriver: true,
                        }),
                        Animated.spring(animValue, {
                          toValue: 1,
                          tension: 200,
                          friction: 3,
                          useNativeDriver: true,
                        }),
                      ]).start();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: currentAnswer === index ? colors.background : colors.textPrimary },
                      ]}
                    >
                      {option}
                    </Text>
                    {currentAnswer === index && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.background} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        );

      case 'scale':
        const scaleRange = currentQuestion.scaleMax! - currentQuestion.scaleMin!;
        return (
          <View style={styles.scaleContainer}>
            <View style={styles.scaleLabels}>
              <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>
                {currentQuestion.scaleLabels?.min || 'Min'}
              </Text>
              <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>
                {currentQuestion.scaleLabels?.max || 'Max'}
              </Text>
            </View>
            <View style={styles.scaleButtons}>
              {Array.from({ length: scaleRange + 1 }, (_, i) => {
                const value = currentQuestion.scaleMin! + i;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.scaleButton,
                      {
                        backgroundColor: currentAnswer === value ? colors.primary : colors.cardBackground,
                        borderColor: currentAnswer === value ? colors.primary : colors.background,
                      },
                    ]}
                    onPress={() => setCurrentAnswer(value)}
                  >
                    <Text
                      style={[
                        styles.scaleButtonText,
                        { color: currentAnswer === value ? colors.background : colors.textPrimary },
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'yes-no':
        return (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: currentAnswer === true ? colors.primary : colors.cardBackground,
                  borderColor: currentAnswer === true ? colors.primary : colors.background,
                },
              ]}
              onPress={() => setCurrentAnswer(true)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: currentAnswer === true ? colors.background : colors.textPrimary },
                ]}
              >
                Oui
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: currentAnswer === false ? colors.primary : colors.cardBackground,
                  borderColor: currentAnswer === false ? colors.primary : colors.background,
                },
              ]}
              onPress={() => setCurrentAnswer(false)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: currentAnswer === false ? colors.background : colors.textPrimary },
                ]}
              >
                Non
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'text':
        return (
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.cardBackground,
                color: colors.textPrimary,
                borderColor: colors.background,
              },
            ]}
            placeholder="Tape ta réponse..."
            placeholderTextColor={colors.textSecondary}
            value={currentAnswer || ''}
            onChangeText={setCurrentAnswer}
            multiline
            numberOfLines={4}
          />
        );

      default:
        return null;
    }
  };

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
        <ConfettiAnimation visible={showConfetti} />
        
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              Question {currentQuestionIndex + 1} sur {questions.length}
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

        {/* Question */}
        <Animated.View
          style={[
            styles.questionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>
            {currentQuestion.question}
          </Text>
        </Animated.View>

        {/* Answer Input */}
        <View style={styles.answerSection}>{renderQuestionInput()}</View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.background }]}>
        <AnimatedButton
          onPress={async () => {
            if (currentQuestionIndex > 0) {
              await handlePrevious();
            }
          }}
          disabled={currentQuestionIndex === 0}
          variant="secondary"
          icon="chevron-back"
          iconPosition="left"
          style={styles.navButton}
          buttonStyle={{
            backgroundColor: currentQuestionIndex === 0 ? colors.background : colors.cardBackground,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.lg,
            borderRadius: BORDER_RADIUS.md,
          }}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: currentQuestionIndex === 0 ? colors.textSecondary : colors.textPrimary },
            ]}
          >
            Précédent
          </Text>
        </AnimatedButton>

        <AnimatedButton
          onPress={() => {
            if (canGoNext) {
              handleNext();
            }
          }}
          disabled={!canGoNext}
          variant="primary"
          icon={currentQuestionIndex < questions.length - 1 ? "chevron-forward" : "checkmark-circle"}
          iconPosition="right"
          style={styles.navButton}
          buttonStyle={{
            backgroundColor: canGoNext ? colors.primary : colors.background,
            opacity: canGoNext ? 1 : 0.5,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.lg,
            borderRadius: BORDER_RADIUS.md,
          }}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: canGoNext ? colors.background : colors.textSecondary },
            ]}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
          </Text>
        </AnimatedButton>
      </View>

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
    paddingBottom: 150, // Space for bottom bar and navigation buttons
  },
  progressSection: {
    marginBottom: SPACING.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionSection: {
    marginBottom: SPACING.xl,
  },
  questionText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    lineHeight: 32,
  },
  answerSection: {
    marginBottom: SPACING.xl,
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
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: SPACING.sm,
  },
  scaleContainer: {
    gap: SPACING.md,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: FONTS.sizes.sm,
  },
  scaleButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  scaleButton: {
    minWidth: 50,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  scaleButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  textInput: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    fontSize: FONTS.sizes.md,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    marginBottom: 80, // Extra space to prevent BottomBar from hiding buttons
  },
  navButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  previousButton: {
    // Styles handled by backgroundColor
  },
  nextButton: {
    // Styles handled by backgroundColor
  },
  navButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});

export default BaseGameComponent;

