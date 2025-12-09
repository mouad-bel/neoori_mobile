import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
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

interface VisionCreationGameProps extends BaseGameProps {
  questions: {
    id: string;
    label: string;
    placeholder: string;
    icon: string;
  }[];
  instructions: string;
}

const VisionCreationGame: React.FC<VisionCreationGameProps> = ({
  game,
  onComplete,
  questions,
  instructions,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress?.gameData?.answers) {
      setAnswers(progress.gameData.answers);
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
          gameType: 'creation' as GameType,
          gameData: {
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
        gameType: 'creation' as GameType,
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

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    saveProgress({ answers: newAnswers });
  };

  const handleComplete = async () => {
    const allAnswered = questions.every(q => answers[q.id] && answers[q.id].trim().length > 0);
    
    if (!allAnswered) {
      return; // Can't complete without all answers
    }

    await saveProgress({ answers }, true);
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const answeredCount = questions.filter(q => answers[q.id] && answers[q.id].trim().length > 0).length;
  const canComplete = answeredCount === questions.length;

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
        {/* Instructions */}
        <View style={[styles.instructionsSection, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name="create" size={24} color={colors.primary} />
          <Text style={[styles.instructionsText, { color: colors.textPrimary }]}>
            {instructions}
          </Text>
        </View>

        {/* Progress */}
        <View style={[styles.progressSection, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {answeredCount} / {questions.length} questions complétées
          </Text>
          <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(answeredCount / questions.length) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Questions */}
        <View style={styles.questionsSection}>
          {questions.map((question, index) => {
            const answer = answers[question.id] || '';
            const isAnswered = answer.trim().length > 0;

            return (
              <View
                key={question.id}
                style={[styles.questionCard, { backgroundColor: colors.cardBackground }]}
              >
                <View style={styles.questionHeader}>
                  <View style={[styles.questionIcon, { backgroundColor: `${colors.primary}20` }]}>
                    <Ionicons name={question.icon as any} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.questionNumber}>
                    <Text style={[styles.questionNumberText, { color: colors.primary }]}>
                      {index + 1}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.questionLabel, { color: colors.textPrimary }]}>
                  {question.label}
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.textPrimary,
                      borderColor: isAnswered ? colors.primary : colors.background,
                    },
                  ]}
                  placeholder={question.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  value={answer}
                  onChangeText={(text) => handleAnswerChange(question.id, text)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {isAnswered && (
                  <View style={styles.checkIndicator}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                    <Text style={[styles.checkText, { color: colors.primary }]}>
                      Complété
                    </Text>
                  </View>
                )}
              </View>
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
            {canComplete ? 'Terminer ma vision' : `Complète ${questions.length - answeredCount} question(s) restante(s)`}
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
  instructionsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  instructionsText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  progressSection: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
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
  questionsSection: {
    marginBottom: SPACING.xl,
  },
  questionCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  questionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  questionLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  textInput: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    fontSize: FONTS.sizes.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  checkText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
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

export default VisionCreationGame;


