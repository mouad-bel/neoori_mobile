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

interface PuzzlePiece {
  id: string;
  label: string;
  category: string;
  correctPosition: number;
}

interface SkillsPuzzleGameProps extends BaseGameProps {
  pieces: PuzzlePiece[];
  categories: string[];
  instructions: string;
}

const SkillsPuzzleGame: React.FC<SkillsPuzzleGameProps> = ({
  game,
  onComplete,
  pieces,
  categories,
  instructions,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  // Initialize categories
  const getInitialCategories = () => {
    const initialCategories: Record<string, string[]> = {};
    categories.forEach(cat => {
      initialCategories[cat] = [];
    });
    return initialCategories;
  };

  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [categoryPieces, setCategoryPieces] = useState<Record<string, string[]>>(getInitialCategories());
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const pieceAnimations = useRef<Record<string, Animated.Value>>({}).current;

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress?.gameData?.categoryPieces && Object.keys(progress.gameData.categoryPieces).length > 0) {
      // Ensure all categories exist
      const savedCategories = { ...progress.gameData.categoryPieces };
      categories.forEach(cat => {
        if (!savedCategories[cat]) {
          savedCategories[cat] = [];
        }
      });
      setCategoryPieces(savedCategories);
      setSelectedPieces(progress.gameData.selectedPieces || []);
    } else {
      setCategoryPieces(getInitialCategories());
      setSelectedPieces([]);
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
          gameType: 'puzzle' as GameType,
          gameData: {
            selectedPieces: [],
            categoryPieces: {},
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
        gameType: 'puzzle' as GameType,
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

  const getPieceAnimation = (pieceId: string) => {
    if (!pieceAnimations[pieceId]) {
      pieceAnimations[pieceId] = new Animated.Value(1);
    }
    return pieceAnimations[pieceId];
  };

  const handlePieceSelect = (pieceId: string) => {
    const anim = getPieceAnimation(pieceId);
    
    if (selectedPieces.includes(pieceId)) {
      // Deselect
      setSelectedPieces(selectedPieces.filter(id => id !== pieceId));
      Animated.spring(anim, {
        toValue: 1,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      // Select
      setSelectedPieces([...selectedPieces, pieceId]);
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.9,
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
  };

  const handleCategorySelect = (category: string) => {
    if (selectedPieces.length === 0) return;

    // Move selected pieces to category
    const newCategoryPieces = { ...categoryPieces };
    selectedPieces.forEach(pieceId => {
      // Remove from other categories
      Object.keys(newCategoryPieces).forEach(cat => {
        newCategoryPieces[cat] = newCategoryPieces[cat].filter(id => id !== pieceId);
      });
      // Add to selected category
      if (!newCategoryPieces[category].includes(pieceId)) {
        newCategoryPieces[category].push(pieceId);
      }
    });

    setCategoryPieces(newCategoryPieces);
    setSelectedPieces([]);

    // Check completion
    const totalPlaced = Object.values(newCategoryPieces).reduce((sum, arr) => sum + arr.length, 0);
    if (totalPlaced === pieces.length) {
      setTimeout(() => {
        handleComplete(newCategoryPieces);
      }, 500);
    } else {
      saveProgress({
        selectedPieces: [],
        categoryPieces: newCategoryPieces,
      });
    }
  };

  const handleRemoveFromCategory = (pieceId: string, category: string) => {
    const newCategoryPieces = { ...categoryPieces };
    newCategoryPieces[category] = newCategoryPieces[category].filter(id => id !== pieceId);
    setCategoryPieces(newCategoryPieces);
    saveProgress({
      selectedPieces,
      categoryPieces: newCategoryPieces,
    });
  };

  const handleComplete = async (finalCategories: Record<string, string[]>) => {
    await saveProgress(
      {
        selectedPieces: [],
        categoryPieces: finalCategories,
      },
      true
    );
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const availablePieces = pieces.filter(p => {
    const isInCategory = Object.values(categoryPieces).some(arr => arr.includes(p.id));
    return !isInCategory;
  });

  const totalPlaced = Object.values(categoryPieces).reduce((sum, arr) => sum + arr.length, 0);
  const progressPercentage = pieces.length > 0 ? (totalPlaced / pieces.length) * 100 : 0;

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
              {totalPlaced} / {pieces.length} compétences classées
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
          <Ionicons name="grid" size={20} color={colors.primary} />
          <Text style={[styles.instructionsText, { color: colors.textPrimary }]}>
            {instructions}
          </Text>
        </View>

        {/* Available Pieces */}
        <View style={styles.piecesSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Compétences disponibles
          </Text>
          {availablePieces.length > 0 ? (
            <View style={styles.piecesGrid}>
              {availablePieces.map((piece) => {
                const isSelected = selectedPieces.includes(piece.id);
                const anim = getPieceAnimation(piece.id);
                return (
                  <Animated.View
                    key={piece.id}
                    style={{
                      transform: [{ scale: anim }],
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.pieceCard,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                          borderColor: isSelected ? colors.primary : colors.background,
                          borderWidth: isSelected ? 3 : 2,
                        },
                      ]}
                      onPress={() => handlePieceSelect(piece.id)}
                      activeOpacity={0.8}
                    >
                    <Text
                      style={[
                        styles.pieceText,
                        {
                          color: isSelected ? colors.background : colors.textPrimary,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}
                    >
                      {piece.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.background} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                Toutes les compétences ont été classées ! 🎉
              </Text>
            </View>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {selectedPieces.length > 0 ? 'Sélectionne une catégorie' : 'Catégories'}
          </Text>
          {categories.map((category) => {
            const categoryItems = categoryPieces[category] || [];
            return (
              <View
                key={category}
                style={[styles.categoryCard, { backgroundColor: colors.cardBackground }]}
              >
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>
                    {category}
                  </Text>
                  <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                    {categoryItems.length} compétence(s)
                  </Text>
                </View>
                {selectedPieces.length > 0 && (
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Ionicons name="add" size={20} color={colors.background} />
                    <Text style={[styles.addButtonText, { color: colors.background }]}>
                      Ajouter {selectedPieces.length} compétence(s)
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={styles.categoryPieces}>
                  {categoryItems.map((pieceId) => {
                    const piece = pieces.find(p => p.id === pieceId);
                    if (!piece) return null;
                    return (
                      <View
                        key={pieceId}
                        style={[styles.categoryPiece, { backgroundColor: `${colors.primary}20` }]}
                      >
                        <Text style={[styles.categoryPieceText, { color: colors.textPrimary }]}>
                          {piece.label}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveFromCategory(pieceId, category)}
                        >
                          <Ionicons name="close-circle" size={20} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

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
  piecesSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  piecesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  checkIcon: {
    marginLeft: SPACING.xs,
  },
  pieceCard: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
  },
  pieceText: {
    fontSize: FONTS.sizes.sm,
  },
  categoriesSection: {
    marginBottom: SPACING.xl,
  },
  categoryCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  categoryCount: {
    fontSize: FONTS.sizes.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  addButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  categoryPieces: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryPiece: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  categoryPieceText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  emptyState: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.md,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SkillsPuzzleGame;


