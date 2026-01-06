import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  PanResponder,
  GestureResponderEvent,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 60;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;
const SWIPE_THRESHOLD = 80; // Reduced threshold for easier swiping

interface Scenario {
  id: string;
  title: string;
  description: string;
  situation: string;
  options: {
    id: string;
    label: string;
    skills: string[];
  }[];
}

interface SkillMatchGameProps extends BaseGameProps {
  scenarios: Scenario[];
  instructions: string;
}

const SkillMatchGame: React.FC<SkillMatchGameProps> = ({
  game,
  onComplete,
  scenarios,
  instructions,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string[]>>({});
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const hasLoadedProgress = useRef(false);
  const currentIndexRef = useRef(0); // Keep ref in sync with state
  const greenOverlayOpacity = useRef(new Animated.Value(0)).current;
  const redOverlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress?.gameData && !hasLoadedProgress.current) {
      // Only load progress on initial load, not when updating
      const savedIndex = progress.gameData.currentIndex || 0;
      console.log('Loading saved progress, index:', savedIndex);
      setCurrentIndex(savedIndex);
      currentIndexRef.current = savedIndex;
      setSelectedSkills(progress.gameData.selectedSkills || {});
      hasLoadedProgress.current = true;
    }
  }, [progress]);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    console.log('Current index updated to:', currentIndex);
  }, [currentIndex]);

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
            currentIndex: 0,
            selectedSkills: {},
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Capture if horizontal movement is significant and dominant
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        return isHorizontal && Math.abs(gestureState.dx) > 15;
      },
      onStartShouldSetPanResponderCapture: () => false, // Don't capture on start
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Only capture if it's clearly a horizontal swipe
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
        return isHorizontal && Math.abs(gestureState.dx) > 20;
      },
      onPanResponderGrant: () => {
        // Reset when starting
        position.setValue({ x: 0, y: 0 });
        console.log('Pan responder granted');
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update position based on horizontal movement
        position.setValue({ x: gestureState.dx, y: gestureState.dy * 0.3 });
        opacity.setValue(Math.max(0.3, 1 - Math.abs(gestureState.dx) / 300));
        scale.setValue(Math.max(0.9, 1 - Math.abs(gestureState.dx) / 1000));
        
        // Show color overlays based on swipe direction
        if (gestureState.dx > 0) {
          // Swiping right (green/yes)
          const opacityValue = Math.min(Math.abs(gestureState.dx) / SWIPE_THRESHOLD, 1);
          greenOverlayOpacity.setValue(opacityValue);
          redOverlayOpacity.setValue(0);
        } else if (gestureState.dx < 0) {
          // Swiping left (red/no)
          const opacityValue = Math.min(Math.abs(gestureState.dx) / SWIPE_THRESHOLD, 1);
          redOverlayOpacity.setValue(opacityValue);
          greenOverlayOpacity.setValue(0);
        } else {
          greenOverlayOpacity.setValue(0);
          redOverlayOpacity.setValue(0);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log('Swipe release:', { 
          dx: gestureState.dx, 
          dy: gestureState.dy,
          threshold: SWIPE_THRESHOLD,
          absDx: Math.abs(gestureState.dx)
        });
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          // Swipe detected - proceed to next scenario
          const direction = gestureState.dx > 0 ? 'right' : 'left';
          console.log('Swipe detected:', direction, 'at index:', currentIndex);
          handleSwipe(direction);
        } else {
          console.log('Swipe not strong enough, returning to center');
          // Return to center
          Animated.parallel([
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(greenOverlayOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(redOverlayOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        }
      },
      onPanResponderTerminationRequest: () => true, // Allow termination if needed
    })
  ).current;

  const handleSwipe = (direction: 'left' | 'right') => {
    // Use ref to get the latest value
    const currentIdx = currentIndexRef.current;
    const currentScenario = scenarios[currentIdx];
    if (!currentScenario) {
      console.log('No current scenario at index:', currentIdx);
      return;
    }
    
    console.log('Handling swipe:', { direction, currentIndex: currentIdx, scenarioId: currentScenario.id });
    
    const selectedOption = direction === 'right' ? currentScenario.options[0] : currentScenario.options[1];
    
    const newSkills = {
      ...selectedSkills,
      [currentScenario.id]: selectedOption.skills,
    };
    console.log('New skills:', newSkills);
    setSelectedSkills(newSkills);

    const nextIndex = currentIdx + 1;
    console.log('Next index will be:', nextIndex, 'out of', scenarios.length);

      Animated.parallel([
        Animated.timing(position, {
          toValue: { x: direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(greenOverlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(redOverlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
      console.log('Animation completed, moving to next scenario');
      if (nextIndex < scenarios.length) {
        // Update state and ref
        console.log('Setting currentIndex to:', nextIndex);
        setCurrentIndex(nextIndex);
        currentIndexRef.current = nextIndex;
        position.setValue({ x: 0, y: 0 });
        opacity.setValue(1);
        scale.setValue(1);
        greenOverlayOpacity.setValue(0);
        redOverlayOpacity.setValue(0);
        // Then save progress with the new index (async, won't trigger useEffect reset)
        saveProgress({
          currentIndex: nextIndex,
          selectedSkills: newSkills,
        });
        console.log('Progress saved, current index:', nextIndex);
      } else {
        console.log('All scenarios completed');
        handleComplete(newSkills);
      }
    });
  };

  const handleOptionPress = (optionIndex: number) => {
    const currentIdx = currentIndexRef.current;
    const currentScenario = scenarios[currentIdx];
    const selectedOption = currentScenario.options[optionIndex];
    
    const newSkills = {
      ...selectedSkills,
      [currentScenario.id]: selectedOption.skills,
    };
    setSelectedSkills(newSkills);

    const nextIndex = currentIdx + 1;
    if (nextIndex < scenarios.length) {
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
      saveProgress({
        currentIndex: nextIndex,
        selectedSkills: newSkills,
      });
    } else {
      handleComplete(newSkills);
    }
  };

  const handleComplete = async (finalSkills: Record<string, string[]>) => {
    // Calculate most common skills
    const allSkills: Record<string, number> = {};
    Object.values(finalSkills).forEach(skills => {
      skills.forEach(skill => {
        allSkills[skill] = (allSkills[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(allSkills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([skill]) => skill);

    await saveProgress(
      {
        currentIndex: scenarios.length - 1,
        selectedSkills: finalSkills,
        topSkills,
      },
      true
    );
    
    // Show congratulations modal
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const currentScenario = scenarios[currentIndex];
  const progressPercentage = ((currentIndex + 1) / scenarios.length) * 100;

  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  if (showInstructions) {
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
        <View style={styles.instructionsContainer}>
          <View style={[styles.instructionsCard, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="flash" size={48} color={colors.primary} />
            <Text style={[styles.instructionsTitle, { color: colors.textPrimary }]}>
              SkillMatch ⚡
            </Text>
            <Text style={[styles.instructionsText, { color: colors.textSecondary }]}>
              {instructions}
            </Text>
            <View style={styles.swipeHint}>
              <View style={styles.swipeHintItem}>
                <Ionicons name="arrow-back" size={24} color="#EF4444" />
                <Text style={[styles.swipeHintText, { color: colors.textSecondary }]}>
                  Glisse à gauche
                </Text>
              </View>
              <View style={styles.swipeHintItem}>
                <Ionicons name="arrow-forward" size={24} color="#10B981" />
                <Text style={[styles.swipeHintText, { color: colors.textSecondary }]}>
                  Glisse à droite
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={[styles.startButtonText, { color: colors.background }]}>
                Commencer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        title={game.title}
        showLogo={false}
        showNotifications={false}
        showChat={false}
        showProfile={false}
      />
      <View style={styles.gameContainer}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {currentIndex + 1} / {scenarios.length}
          </Text>
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

        {/* Card Stack */}
        <View style={styles.cardStack}>
          {/* Color Overlays */}
          <Animated.View
            style={[
              styles.colorOverlay,
              styles.greenOverlay,
              {
                opacity: greenOverlayOpacity,
              },
            ]}
            pointerEvents="none"
          >
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            <Text style={styles.overlayText}>OUI</Text>
          </Animated.View>
          
          <Animated.View
            style={[
              styles.colorOverlay,
              styles.redOverlay,
              {
                opacity: redOverlayOpacity,
              },
            ]}
            pointerEvents="none"
          >
            <Ionicons name="close-circle" size={80} color="#EF4444" />
            <Text style={styles.overlayText}>NON</Text>
          </Animated.View>

          {currentScenario && (
            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: colors.cardBackground,
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate: rotation as any },
                    { scale: scale },
                  ],
                  opacity: opacity,
                },
              ]}
              {...panResponder.panHandlers}
            >
              <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardBadge, { backgroundColor: `${colors.primary}20` }]}>
                  <Ionicons name="document-text" size={20} color={colors.primary} />
                  <Text style={[styles.cardBadgeText, { color: colors.primary }]}>
                    Scénario {currentIndex + 1}
                  </Text>
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                {currentScenario.title}
              </Text>

              <View style={[styles.situationBox, { backgroundColor: `${colors.primary}10` }]}>
                <Text style={[styles.situationText, { color: colors.textPrimary }]}>
                  {currentScenario.situation}
                </Text>
              </View>

              <View style={styles.optionsContainer} pointerEvents="box-none">
                {currentScenario.options.map((option, index) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: index === 0 ? '#10B981' : '#EF4444',
                        borderColor: index === 0 ? '#10B981' : '#EF4444',
                      },
                    ]}
                    onPress={() => handleOptionPress(index)}
                    delayPressIn={100}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionHeader}>
                      <Ionicons
                        name={index === 0 ? 'checkmark-circle' : 'close-circle'}
                        size={24}
                        color={colors.background}
                      />
                      <Text style={[styles.optionLabel, { color: colors.background }]}>
                        {index === 0 ? 'Oui' : 'Non'}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, { color: colors.background }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.swipeHintCard}>
                <Text style={[styles.swipeHintCardText, { color: colors.textSecondary }]}>
                  👈 Glisse ou 👆 Clique
                </Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
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
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: 100,
  },
  instructionsCard: {
    width: '100%',
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  instructionsText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  swipeHint: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  swipeHintItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  swipeHintText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  startButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  gameContainer: {
    flex: 1,
    paddingTop: 100,
  },
  progressSection: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  progressText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    textAlign: 'center',
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
  colorOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  greenOverlay: {
    right: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  redOverlay: {
    left: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: SPACING.md,
  },
  cardStack: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    width: CARD_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.75,
    borderRadius: BORDER_RADIUS.lg,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  cardContent: {
    padding: SPACING.lg,
    minHeight: '100%',
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  cardBadgeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginBottom: SPACING.md,
    lineHeight: 26,
  },
  situationBox: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  situationText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  optionCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  optionLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  optionText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  swipeHintCard: {
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
  },
  swipeHintCardText: {
    fontSize: FONTS.sizes.xs,
    fontStyle: 'italic',
  },
});

export default SkillMatchGame;

