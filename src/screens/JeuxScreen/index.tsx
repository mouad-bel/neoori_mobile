import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';
import { useTheme } from '../../store/ThemeContext';
import AppHeader from '../../components/navigation/AppHeader';
import ProfileModal from '../../components/ui/ProfileModal';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import GameCategoryFilter, { GameCategory } from '../../components/common/GameCategoryFilter';
import StatsCard from '../../components/common/StatsCard';
import BadgeCard, { Badge } from '../../components/common/BadgeCard';
import { MainDrawerParamList, Game, GameProgress } from '../../types';
import { MOCK_GAMES, GAME_CATEGORIES, MOCK_BADGES } from '../../constants/mockData';
import StorageService from '../../services/storage/StorageService';

const JeuxScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [gamesWithProgress, setGamesWithProgress] = useState<Game[]>(MOCK_GAMES);

  // Animation pour l'illustration
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Load game progress from storage
  useEffect(() => {
    const loadGameProgress = async () => {
      try {
        const allProgress = await StorageService.getAllGameProgress();
        const updatedGames = MOCK_GAMES.map(game => {
          const progress = allProgress.find(p => p.gameId === game.id);
          if (progress) {
            let progressPercentage = 0;
            if (progress.completed) {
              progressPercentage = 100;
            } else if (progress.currentQuestion !== undefined && progress.totalQuestions !== undefined) {
              progressPercentage = Math.round((progress.currentQuestion / progress.totalQuestions) * 100);
            }
            
            return {
              ...game,
              progress: progressPercentage,
              status: progress.completed ? 'completed' as const : 'in-progress' as const,
            };
          }
          return game;
        });
        setGamesWithProgress(updatedGames);
      } catch (error) {
        console.error('Error loading game progress:', error);
      }
    };

    loadGameProgress();
  }, []);

  // Reload progress when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadGameProgress = async () => {
        try {
          const allProgress = await StorageService.getAllGameProgress();
          const updatedGames = MOCK_GAMES.map(game => {
            const progress = allProgress.find(p => p.gameId === game.id);
            if (progress) {
              let progressPercentage = 0;
              
              if (progress.completed) {
                progressPercentage = 100;
              } else if (progress.gameType === 'quiz' && progress.currentQuestion !== undefined && progress.totalQuestions) {
                progressPercentage = Math.round((progress.currentQuestion / progress.totalQuestions) * 100);
              } else if (progress.gameType === 'matching' && progress.gameData?.completedPairs) {
                // Calculate progress based on completed pairs
                const totalPairs = progress.gameData.pairs?.length || 0;
                const completed = progress.gameData.completedPairs?.length || 0;
                progressPercentage = totalPairs > 0 ? Math.round((completed / totalPairs) * 100) : 0;
              } else if (progress.gameType === 'ranking' && progress.gameData?.rankedItems) {
                // Ranking games are considered in progress if they have data
                progressPercentage = progress.gameData.rankedItems.length > 0 ? 50 : 0;
              } else if (progress.gameType === 'simulation' && progress.gameData?.currentScenarioIndex !== undefined) {
                // Simulation games - progress based on scenarios completed
                const totalScenarios = 3; // Default, could be dynamic
                const current = progress.gameData.currentScenarioIndex || 0;
                progressPercentage = Math.round(((current + 1) / totalScenarios) * 100);
              } else if (progress.gameType === 'creation' && progress.gameData?.answers) {
                // Creation games - progress based on questions answered
                const answers = progress.gameData.answers || {};
                const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim().length > 0).length;
                const totalQuestions = 4; // Default, could be dynamic
                progressPercentage = Math.round((answeredCount / totalQuestions) * 100);
              } else if (progress.gameType === 'puzzle' && progress.gameData?.categoryPieces) {
                // Puzzle games - progress based on pieces placed
                const categoryPieces = progress.gameData.categoryPieces || {};
                const totalPlaced = Object.values(categoryPieces).reduce((sum: number, arr: any) => {
                  if (Array.isArray(arr)) {
                    return sum + arr.length;
                  }
                  return sum;
                }, 0);
                // For game 11, there are 9 pieces
                const totalPieces = game.id === '11' ? 9 : 9;
                progressPercentage = totalPieces > 0 ? Math.round((totalPlaced / totalPieces) * 100) : 0;
              } else if (progress.gameType === 'interactive') {
                // Interactive games - different calculation based on game type
                if (progress.gameData?.selectedValues) {
                  // Values selection game
                  const selectedCount = progress.gameData.selectedValues?.length || 0;
                  const maxSelection = 5;
                  progressPercentage = Math.round((selectedCount / maxSelection) * 100);
                } else if (progress.gameData?.answers && progress.gameData?.currentAxisIndex !== undefined) {
                  // Wheel of Meaning game
                  const axes = 6; // Default for wheel
                  const currentAxis = progress.gameData.currentAxisIndex || 0;
                  const answers = progress.gameData.answers || {};
                  let totalAnswered = 0;
                  let totalQuestions = 0;
                  // Estimate based on current axis
                  progressPercentage = Math.round(((currentAxis + 1) / axes) * 100);
                } else if (progress.gameData?.currentIndex !== undefined) {
                  // SkillMatch game
                  const currentIndex = progress.gameData.currentIndex || 0;
                  const totalScenarios = 5; // Default
                  progressPercentage = Math.round(((currentIndex + 1) / totalScenarios) * 100);
                }
              }
              
              return {
                ...game,
                progress: progressPercentage,
                status: (progress.completed ? 'completed' : 'in-progress') as 'completed' | 'in-progress',
              };
            }
            return game;
          });
          setGamesWithProgress(updatedGames);
        } catch (error) {
          console.error('Error loading game progress:', error);
        }
      };
      loadGameProgress();
    });

    return unsubscribe;
  }, [navigation]);

  // Calculer les jeux complétés
  const completedGames = gamesWithProgress.filter(
    game => game.status === 'completed' || (game.progress !== undefined && game.progress > 0)
  ).length;
  const totalGames = gamesWithProgress.length;
  
  // Filtrer les jeux par type de jeu et recherche
  const filteredGames = useMemo(() => {
    let games = gamesWithProgress;
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      games = games.filter(
        game =>
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtre par type de jeu (gameType)
    if (selectedCategory) {
      games = games.filter(game => game.gameType === selectedCategory);
    }
    
    return games;
  }, [searchQuery, selectedCategory, gamesWithProgress]);
  
  // Trouver le premier jeu non complété pour le CTA
  const firstIncompleteGame = gamesWithProgress.find(
    game => game.status === 'not-started' || game.status === 'in-progress' || (game.progress === undefined || game.progress === 0)
  );

  const handleStartGame = (gameId: string) => {
    navigation.navigate('Game', { gameId });
  };

  // Statistiques mockées
  const stats = {
    totalTime: '12 min',
    todayCompleted: 2,
    streak: 3,
  };

  // Calculate badges based on actual game progress
  const calculateBadges = useMemo(() => {
    const completedGames = gamesWithProgress.filter(
      game => game.status === 'completed'
    ).length;
    
    return MOCK_BADGES.map(badge => {
      let unlocked = false;
      
      // Badge 1: Complète ton premier jeu
      if (badge.id === '1') {
        unlocked = completedGames >= 1;
      }
      // Badge 2: Complète 3 jeux différents
      else if (badge.id === '2') {
        unlocked = completedGames >= 3;
      }
      // Badge 3: Complète 5 jeux
      else if (badge.id === '3') {
        unlocked = completedGames >= 5;
      }
      // Badge 4: Complète tous les jeux
      else if (badge.id === '4') {
        unlocked = completedGames >= totalGames;
      }
      
      return {
        ...badge,
        unlocked,
        unlockedDate: unlocked && !badge.unlockedDate ? new Date().toISOString().split('T')[0] : badge.unlockedDate,
      };
    });
  }, [gamesWithProgress, totalGames]);

  // Detect newly unlocked badges
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<string[]>([]);
  const [previousBadgesState, setPreviousBadgesState] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const currentState: Record<string, boolean> = {};
    calculateBadges.forEach(badge => {
      currentState[badge.id] = badge.unlocked;
    });

    // Initialize previous state on first load (don't animate on initial load)
    if (!isInitialized) {
      setPreviousBadgesState(currentState);
      setIsInitialized(true);
      return;
    }

    // Find newly unlocked badges (only after initialization)
    const newlyUnlocked: string[] = [];
    Object.keys(currentState).forEach(badgeId => {
      const wasUnlocked = previousBadgesState[badgeId] || false;
      const isUnlocked = currentState[badgeId];
      if (isUnlocked && !wasUnlocked) {
        newlyUnlocked.push(badgeId);
      }
    });

    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedBadges(newlyUnlocked);
      // Clear after animation
      setTimeout(() => {
        setNewlyUnlockedBadges([]);
      }, 3000);
    }

    setPreviousBadgesState(currentState);
  }, [calculateBadges, isInitialized]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        title="Jeux & Tests" 
        onProfilePress={() => setShowProfileModal(true)}
      />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          {/* Illustration/Animation */}
          <View style={styles.illustrationContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={[styles.illustrationCircle, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name="game-controller" size={48} color={colors.primary} />
              </View>
            </Animated.View>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Découvre-toi en jouant ✨
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Quelques petites expériences rapides pour commencer à mieux te connaître.
          </Text>
          
          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <ProgressIndicator completed={completedGames} total={totalGames} />
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Rechercher..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowCategories(!showCategories)}
            >
              <Ionicons name="filter" size={20} color={colors.background} />
              <Text style={[styles.filterButtonText, { color: colors.background }]}>Filtrer</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filters - Affichage conditionnel */}
          {showCategories && (
            <View style={styles.categorySection}>
              <GameCategoryFilter
                categories={GAME_CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={(categoryId) => {
                  setSelectedCategory(categoryId);
                  setShowCategories(false); // Fermer après sélection
                }}
              />
            </View>
          )}
        </View>

      {/* Available Games Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Jeux Disponibles</Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesScroll}
        >
          {filteredGames.map((game) => (
            <View key={game.id} style={[styles.gameCard, { backgroundColor: colors.cardBackground }]}>
              <ImageBackground
                source={{ uri: game.image }}
                style={styles.gameImage}
                imageStyle={styles.gameImageStyle}
              >
                <View style={styles.gameImageOverlay} />
                <View style={styles.difficultyBadge}>
                  <Text style={[styles.difficultyText, { color: colors.background }]}>{game.difficulty}</Text>
                </View>
              </ImageBackground>

              <View style={styles.gameContent}>
                <View style={[styles.gameIconContainer, { backgroundColor: colors.background }]}>
                  <Ionicons name={game.icon as any} size={24} color={colors.primary} />
                </View>

                <Text style={[styles.gameTitle, { color: colors.textPrimary }]}>{game.title}</Text>
                
                <Text style={[styles.gameDetails, { color: colors.textSecondary }]}>
                  {game.duration} {game.questions ? `• ${game.questions} questions` : `• ${game.gameType === 'matching' ? 'Association' : game.gameType === 'ranking' ? 'Classement' : 'Interactif'}`}
                </Text>
                
                <Text style={[styles.gameDescription, { color: colors.textSecondary }]}>{game.description}</Text>

                <View style={styles.gameFooter}>
                  <View style={styles.credits}>
                    <Ionicons name="logo-bitcoin" size={16} color="#F59E0B" />
                    <Text style={styles.creditsText}>{game.credits} crédits</Text>
                  </View>

                  {/* Toujours afficher la barre de progression pour maintenir l'alignement */}
                  <View style={styles.progressContainer}>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progression</Text>
                    <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${game.progress || 0}%`, 
                            backgroundColor: colors.primary 
                          }
                        ]} 
                      />
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleStartGame(game.id)}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.background }]}>
                      {game.status === 'in-progress' ? 'Reprendre' : game.status === 'completed' ? 'Refaire' : 'Commencer'} →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

        {/* CTA Button */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // Navigation vers le premier jeu non complété
              if (firstIncompleteGame) {
                handleStartGame(firstIncompleteGame.id);
              }
            }}
          >
            <Text style={[styles.ctaButtonText, { color: colors.background }]}>
              Commencer une session 🎮
            </Text>
          </TouchableOpacity>
        </View>

        {/* Badges Section */}
        <View style={styles.badgesSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Badges débloqués 🏆
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesScroll}
          >
            {calculateBadges.map((badge) => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                isNewlyUnlocked={newlyUnlockedBadges.includes(badge.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Tes statistiques 📊
          </Text>
          <View style={styles.statsGrid}>
            <StatsCard
              icon="time-outline"
              label="Temps total"
              value={stats.totalTime}
              color={colors.primary}
            />
            <StatsCard
              icon="checkmark-circle-outline"
              label="Aujourd'hui"
              value={`${stats.todayCompleted}`}
              color="#10B981"
            />
            <StatsCard
              icon="flame-outline"
              label="Série"
              value={`${stats.streak} jours`}
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Motivational Text - Déplacé à la fin */}
        <View style={styles.motivationalSection}>
          <Text style={[styles.motivationalText, { color: colors.textSecondary }]}>
            Plus tu joues, plus Neoori commence à te comprendre. Rien de compliqué, juste toi.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <ProfileModal 
        visible={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </View>
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
    paddingTop: 100, // More space for AppHeader to avoid overlap
  },
  header: {
    padding: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.md,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    marginBottom: SPACING.lg,
  },
  categorySection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONTS.sizes.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  filterButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  section: {
    padding: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginBottom: SPACING.xl,
  },
  gamesScroll: {
    gap: SPACING.lg,
  },
  gameCard: {
    width: 320,
    minHeight: 520, // Hauteur minimale pour aligner toutes les cartes
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: 180,
  },
  gameImageStyle: {
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderTopRightRadius: BORDER_RADIUS.md,
  },
  gameImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  difficultyBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  gameContent: {
    padding: SPACING.lg,
    flex: 1,
    justifyContent: 'space-between', // Distribue l'espace uniformément
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  gameTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  gameDetails: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
  },
  gameDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  gameFooter: {
    gap: SPACING.md,
    marginTop: 'auto', // Pousse le footer en bas
  },
  credits: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsText: {
    color: '#F59E0B',
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  progressContainer: {
    gap: SPACING.xs,
  },
  progressLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  motivationalSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  motivationalText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ctaSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  ctaButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  badgesSection: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  badgesScroll: {
    gap: SPACING.md,
    paddingTop: SPACING.lg,
  },
  statsSection: {
    padding: SPACING.xl,
    paddingTop: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.lg,
  },
});

export default JeuxScreen;
