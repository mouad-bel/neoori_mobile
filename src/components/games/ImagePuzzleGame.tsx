import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Image,
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
import CongratulationsModal from '../common/CongratulationsModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PUZZLE_SIZE = 3; // 3x3 grid = 9 pieces
const GRID_SIZE = SCREEN_WIDTH - SPACING.xl * 2;
const PIECE_SIZE = GRID_SIZE / PUZZLE_SIZE;

interface PuzzlePiece {
  id: number;
  correctPosition: number; // Position in the grid (0-8)
  currentPosition: number; // Current position in the grid
  imageUri: string; // URI for this piece of the image
}

interface ImagePuzzleGameProps extends BaseGameProps {
  imageUri: string;
  instructions: string;
}

const ImagePuzzleGame: React.FC<ImagePuzzleGameProps> = ({
  game,
  onComplete,
  imageUri,
  instructions,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [emptyPosition, setEmptyPosition] = useState<number>(PUZZLE_SIZE * PUZZLE_SIZE - 1);
  const pieceScales = useRef<Record<number, Animated.Value>>({}).current;

  useEffect(() => {
    const init = async () => {
      const savedProgress = await StorageService.getGameProgress(game.id);
      if (savedProgress && !savedProgress.completed && savedProgress.gameData?.pieces && savedProgress.gameData.pieces.length > 0) {
        setProgress(savedProgress);
        setPuzzlePieces(savedProgress.gameData.pieces);
        setEmptyPosition(savedProgress.gameData.emptyPosition || PUZZLE_SIZE * PUZZLE_SIZE - 1);
      } else {
        // Initialize new puzzle
        initializePuzzle();
      }
    };
    init();
  }, []);

  // Check if puzzle is solved
  useEffect(() => {
    if (puzzlePieces.length > 0) {
      const isSolved = puzzlePieces.every(
        piece => piece.currentPosition === piece.correctPosition
      );
      if (isSolved) {
        setTimeout(() => {
          handleComplete();
        }, 500);
      }
    }
  }, [puzzlePieces]);

  const initializePuzzle = () => {
    const pieces: PuzzlePiece[] = [];
    
    // Create pieces with correct positions
    for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE - 1; i++) {
      pieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        imageUri: imageUri, // In a real implementation, you'd slice the image
      });
    }

    // Shuffle pieces (Fisher-Yates shuffle)
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPosition, shuffled[j].currentPosition] = 
        [shuffled[j].currentPosition, shuffled[i].currentPosition];
    }

    setPuzzlePieces(shuffled);
    setEmptyPosition(PUZZLE_SIZE * PUZZLE_SIZE - 1);
    
    // Save initial state (async, don't await)
    saveProgress({
      pieces: shuffled,
      emptyPosition: PUZZLE_SIZE * PUZZLE_SIZE - 1,
    }).catch(err => console.error('Error saving initial progress:', err));
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

  const getPieceScale = (pieceId: number) => {
    if (!pieceScales[pieceId]) {
      pieceScales[pieceId] = new Animated.Value(1);
    }
    return pieceScales[pieceId];
  };

  const canMove = (piecePosition: number): boolean => {
    const row = Math.floor(piecePosition / PUZZLE_SIZE);
    const col = piecePosition % PUZZLE_SIZE;
    const emptyRow = Math.floor(emptyPosition / PUZZLE_SIZE);
    const emptyCol = emptyPosition % PUZZLE_SIZE;

    // Check if piece is adjacent to empty position
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handlePieceClick = (pieceId: number) => {
    const piece = puzzlePieces.find(p => p.id === pieceId);
    if (!piece) return;

    // If piece is already selected, deselect it
    if (selectedPiece === pieceId) {
      setSelectedPiece(null);
      const scale = getPieceScale(pieceId);
      Animated.spring(scale, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }).start();
      return;
    }

    // If another piece is selected, deselect it first
    if (selectedPiece !== null) {
      const prevScale = getPieceScale(selectedPiece);
      Animated.spring(prevScale, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }).start();
    }

    // Select the new piece
    setSelectedPiece(pieceId);
    const scale = getPieceScale(pieceId);
    Animated.spring(scale, {
      toValue: 1.1,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const handleEmptySpaceClick = () => {
    if (selectedPiece === null) return;

    const piece = puzzlePieces.find(p => p.id === selectedPiece);
    if (!piece || !canMove(piece.currentPosition)) {
      // Can't move, deselect
      setSelectedPiece(null);
      const scale = getPieceScale(selectedPiece);
      Animated.spring(scale, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }).start();
      return;
    }

    // Move piece to empty position
    const newPieces = puzzlePieces.map(p => {
      if (p.id === selectedPiece) {
        return { ...p, currentPosition: emptyPosition };
      }
      return p;
    });

    setEmptyPosition(piece.currentPosition);
    setPuzzlePieces(newPieces);
    setSelectedPiece(null);
    
    saveProgress({
      pieces: newPieces,
      emptyPosition: piece.currentPosition,
    });

    // Animation
    const scale = getPieceScale(selectedPiece);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleComplete = async () => {
    await saveProgress({ pieces: puzzlePieces, emptyPosition }, true);
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const getPieceStyle = (piece: PuzzlePiece) => {
    const row = Math.floor(piece.currentPosition / PUZZLE_SIZE);
    const col = piece.currentPosition % PUZZLE_SIZE;
    const isCorrect = piece.currentPosition === piece.correctPosition;
    const isSelected = selectedPiece === piece.id;

    return {
      position: 'absolute' as const,
      left: col * PIECE_SIZE,
      top: row * PIECE_SIZE,
      width: PIECE_SIZE,
      height: PIECE_SIZE,
      backgroundColor: isCorrect 
        ? 'rgba(16, 185, 129, 0.1)' 
        : isSelected
        ? `${colors.primary}20`
        : 'rgba(239, 68, 68, 0.1)',
      borderWidth: isCorrect ? 3 : isSelected ? 3 : 1,
      borderColor: isCorrect 
        ? '#10B981' 
        : isSelected
        ? colors.primary
        : colors.border,
    };
  };

  const getImageClipStyle = (piece: PuzzlePiece) => {
    const correctRow = Math.floor(piece.correctPosition / PUZZLE_SIZE);
    const correctCol = piece.correctPosition % PUZZLE_SIZE;

    // Calculate the offset to show the correct portion of the image
    return {
      width: GRID_SIZE,
      height: GRID_SIZE,
      position: 'absolute' as const,
      left: -correctCol * PIECE_SIZE,
      top: -correctRow * PIECE_SIZE,
    };
  };

  if (puzzlePieces.length === 0) {
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
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement du puzzle...
          </Text>
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={[styles.instructionsText, { color: colors.textPrimary }]}>
            {instructions}
          </Text>
        </View>

        {/* Puzzle Grid */}
        <View style={styles.puzzleSection}>
          <View style={[styles.puzzleGrid, { width: GRID_SIZE, height: GRID_SIZE }]}>
            {puzzlePieces.map((piece) => {
              const scale = getPieceScale(piece.id);
              const isCorrect = piece.currentPosition === piece.correctPosition;
              const isSelected = selectedPiece === piece.id;

              return (
                <TouchableOpacity
                  key={piece.id}
                  activeOpacity={0.8}
                  onPress={() => handlePieceClick(piece.id)}
                  style={[
                    getPieceStyle(piece),
                    {
                      transform: [{ scale }],
                      zIndex: isSelected ? 1000 : 1,
                    },
                  ]}
                >
                  <Animated.View style={[styles.pieceContainer, { overflow: 'hidden' }]}>
                    <Image
                      source={{ uri: imageUri }}
                      style={getImageClipStyle(piece)}
                      resizeMode="cover"
                    />
                    {isCorrect && (
                      <View style={styles.correctIndicator}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      </View>
                    )}
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="hand-left" size={24} color={colors.primary} />
                      </View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
            {/* Empty space indicator */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleEmptySpaceClick}
              style={[
                styles.emptySpace,
                {
                  left: (emptyPosition % PUZZLE_SIZE) * PIECE_SIZE,
                  top: Math.floor(emptyPosition / PUZZLE_SIZE) * PIECE_SIZE,
                  width: PIECE_SIZE,
                  height: PIECE_SIZE,
                  backgroundColor: selectedPiece !== null && canMove(puzzlePieces.find(p => p.id === selectedPiece)?.currentPosition || -1) 
                    ? `${colors.primary}20` 
                    : colors.cardBackground,
                  borderWidth: selectedPiece !== null ? 3 : 2,
                  borderColor: selectedPiece !== null && canMove(puzzlePieces.find(p => p.id === selectedPiece)?.currentPosition || -1)
                    ? colors.primary
                    : colors.border,
                  borderStyle: 'dashed',
                },
              ]}
            >
              <Ionicons 
                name={selectedPiece !== null ? "arrow-forward-circle" : "grid-outline"} 
                size={32} 
                color={selectedPiece !== null && canMove(puzzlePieces.find(p => p.id === selectedPiece)?.currentPosition || -1)
                  ? colors.primary
                  : colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {/* Hint: Show correct image */}
          <View style={styles.hintSection}>
            <Text style={[styles.hintTitle, { color: colors.textSecondary }]}>
              Image à reconstruire :
            </Text>
            <Image
              source={{ uri: imageUri }}
              style={styles.hintImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>

      <CongratulationsModal
        visible={showCongratulations}
        onClose={handleCongratulationsClose}
        title="Félicitations ! 🎉"
        message={`Tu as reconstruit l'image avec succès !`}
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
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
  },
  instructionsSection: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  instructionsText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
  },
  puzzleSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  puzzleGrid: {
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  pieceContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 2,
  },
  emptySpace: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  correctIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  hintSection: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  hintTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  hintImage: {
    width: GRID_SIZE * 0.5,
    height: GRID_SIZE * 0.5,
    borderRadius: BORDER_RADIUS.md,
  },
});

export default ImagePuzzleGame;

