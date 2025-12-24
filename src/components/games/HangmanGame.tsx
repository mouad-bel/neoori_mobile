import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { BaseGameProps } from './BaseGameInterface';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_WRONG_GUESSES = 9;

// Liste de mots courts en français (un seul mot)
const WORDS = [
  'CODE',
  'WEB',
  'APP',
  'DATA',
  'CLOUD',
  'API',
  'UI',
  'UX',
  'DEV',
  'TEST',
  'BUG',
  'FIX',
  'GIT',
  'SQL',
  'CSS',
  'HTML',
  'JS',
  'PHP',
  'JAVA',
  'PYTHON',
  'NODE',
  'REACT',
  'VUE',
  'ANGULAR',
  'TYPESCRIPT',
  'DOCKER',
  'LINUX',
  'MACOS',
  'WINDOWS',
  'IOS',
  'ANDROID',
];

interface GameState {
  word: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  gameOver: boolean;
  won: boolean;
}

const HangmanGame: React.FC<BaseGameProps> = ({ game, onComplete }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    guessedLetters: new Set(),
    wrongGuesses: 0,
    gameOver: false,
    won: false,
  });

  // Animation refs
  const successAnimation = useRef(new Animated.Value(0)).current;
  const failureAnimation = useRef(new Animated.Value(0)).current;
  const wordRevealAnimation = useRef(new Animated.Value(0)).current;

  // Initialiser le jeu avec un mot aléatoire
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setGameState({
      word: randomWord,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      gameOver: false,
      won: false,
    });
    // Réinitialiser les animations
    successAnimation.setValue(0);
    failureAnimation.setValue(0);
    wordRevealAnimation.setValue(0);
  };

  const handleLetterPress = (letter: string) => {
    if (gameState.gameOver || gameState.guessedLetters.has(letter)) {
      return;
    }

    const newGuessedLetters = new Set(gameState.guessedLetters);
    newGuessedLetters.add(letter);

    const isWrongGuess = !gameState.word.includes(letter);
    const newWrongGuesses = isWrongGuess
      ? gameState.wrongGuesses + 1
      : gameState.wrongGuesses;

    // Vérifier si le joueur a gagné
    const hasWon = gameState.word
      .split('')
      .every((char) => newGuessedLetters.has(char));

    // Vérifier si le joueur a perdu
    const hasLost = newWrongGuesses >= MAX_WRONG_GUESSES;

    setGameState({
      ...gameState,
      guessedLetters: newGuessedLetters,
      wrongGuesses: newWrongGuesses,
      gameOver: hasWon || hasLost,
      won: hasWon,
    });

    // Si le jeu est terminé, déclencher les animations
    if (hasWon || hasLost) {
      if (hasWon) {
        // Animation de succès
        successAnimation.setValue(0);
        Animated.sequence([
          Animated.spring(successAnimation, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(successAnimation, {
                toValue: 1.1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(successAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
      } else {
        // Animation d'échec
        failureAnimation.setValue(0);
        Animated.sequence([
          Animated.timing(failureAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(failureAnimation, {
                toValue: 0.95,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(failureAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();

        // Animation de révélation du mot
        wordRevealAnimation.setValue(0);
        Animated.timing(wordRevealAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }

      // Appeler onComplete après un délai
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  // Rendre le mot avec des tirets pour les lettres non devinées
  const renderWord = () => {
    return gameState.word
      .split('')
      .map((letter, index) => {
        const isGuessed = gameState.guessedLetters.has(letter);
        return (
          <View key={index} style={styles.letterContainer}>
            <Text
              style={[
                styles.letterText,
                {
                  color: isGuessed ? colors.textPrimary : colors.textSecondary,
                  borderBottomColor: colors.textPrimary,
                },
              ]}
            >
              {isGuessed ? letter : '_'}
            </Text>
          </View>
        );
      });
  };

  // Rendre le dessin du pendu
  const renderHangman = () => {
    const wrongGuesses = gameState.wrongGuesses;

    return (
      <View style={styles.hangmanContainer}>
        {/* Base */}
        {wrongGuesses >= 1 && (
          <View style={[styles.hangmanPart, styles.hangmanBase, { backgroundColor: colors.textPrimary }]} />
        )}
        {/* Poteau */}
        {wrongGuesses >= 2 && (
          <View style={[styles.hangmanPart, styles.hangmanPole, { backgroundColor: colors.textPrimary }]} />
        )}
        {/* Traverse */}
        {wrongGuesses >= 3 && (
          <View style={[styles.hangmanPart, styles.hangmanBeam, { backgroundColor: colors.textPrimary }]} />
        )}
        {/* Corde */}
        {wrongGuesses >= 4 && (
          <View style={[styles.hangmanPart, styles.hangmanRope, { backgroundColor: colors.textPrimary }]} />
        )}
        {/* Tête */}
        {wrongGuesses >= 5 && (
          <View
            style={[
              styles.hangmanPart,
              styles.hangmanHead,
              {
                borderColor: colors.textPrimary,
                backgroundColor: 'transparent',
              },
            ]}
          />
        )}
        {/* Corps */}
        {wrongGuesses >= 6 && (
          <View style={[styles.hangmanPart, styles.hangmanBody, { backgroundColor: colors.textPrimary }]} />
        )}
        {/* Bras gauche */}
        {wrongGuesses >= 7 && (
          <View style={[styles.hangmanPart, styles.hangmanLeftArm, { backgroundColor: colors.textPrimary }]} />
        )}
        {/* Bras droit */}
        {wrongGuesses >= 8 && (
          <View style={[styles.hangmanPart, styles.hangmanRightArm, { backgroundColor: colors.textPrimary }]} />
        )}
        {/* Jambes */}
        {wrongGuesses >= 9 && (
          <>
            <View style={[styles.hangmanPart, styles.hangmanLeftLeg, { backgroundColor: colors.textPrimary }]} />
            <View style={[styles.hangmanPart, styles.hangmanRightLeg, { backgroundColor: colors.textPrimary }]} />
          </>
        )}
      </View>
    );
  };

  // Générer les lettres de l'alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <RNSafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {game.title}
        </Text>
        <TouchableOpacity onPress={startNewGame} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Game Content */}
      <View style={styles.gameContent}>
        {/* Hangman Drawing */}
        <View style={styles.hangmanSection}>
          {renderHangman()}
        </View>

        {/* Word Display */}
        <View style={styles.wordSection}>
          <View style={styles.wordContainer}>{renderWord()}</View>
        </View>

        {/* Game Status */}
        <View style={styles.statusSection}>
          {gameState.gameOver ? (
            <View style={styles.statusContainer}>
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: gameState.won
                        ? successAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          })
                        : failureAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1],
                          }),
                    },
                  ],
                }}
              >
                <Text style={[styles.statusText, { color: gameState.won ? COLORS.success : COLORS.error }]}>
                  {gameState.won ? '🎉 Bravo ! Vous avez gagné !' : '💀 Partie terminée !'}
                </Text>
              </Animated.View>
              {!gameState.won && (
                <Animated.View
                  style={{
                    opacity: wordRevealAnimation,
                    transform: [
                      {
                        translateY: wordRevealAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <Text style={[styles.wordReveal, { color: colors.textSecondary }]}>
                    Le mot était : {gameState.word}
                  </Text>
                </Animated.View>
              )}
            </View>
          ) : (
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              Erreurs : {gameState.wrongGuesses} / {MAX_WRONG_GUESSES}
            </Text>
          )}
        </View>

        {/* Keyboard */}
        {!gameState.gameOver && (
          <View style={styles.keyboardSection}>
            <View style={styles.keyboard}>
              {alphabet.map((letter) => {
                const isGuessed = gameState.guessedLetters.has(letter);
                const isWrong = isGuessed && !gameState.word.includes(letter);
                const isCorrect = isGuessed && gameState.word.includes(letter);

                return (
                  <TouchableOpacity
                    key={letter}
                    style={[
                      styles.keyButton,
                      {
                        backgroundColor: isCorrect
                          ? colors.primary + '20'
                          : isWrong
                          ? COLORS.error + '20'
                          : colors.cardBackground,
                        borderColor: isCorrect
                          ? colors.primary
                          : isWrong
                          ? COLORS.error
                          : colors.textSecondary + '40',
                      },
                      isGuessed && styles.keyButtonDisabled,
                    ]}
                    onPress={() => handleLetterPress(letter)}
                    disabled={isGuessed || gameState.gameOver}
                  >
                    <Text
                      style={[
                        styles.keyButtonText,
                        {
                          color: isCorrect
                            ? colors.primary
                            : isWrong
                            ? COLORS.error
                            : colors.textPrimary,
                        },
                      ]}
                    >
                      {letter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </RNSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    padding: SPACING.xs,
  },
  gameContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  hangmanSection: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  hangmanContainer: {
    width: 200,
    height: 280,
    position: 'relative',
  },
  hangmanPart: {
    position: 'absolute',
  },
  // Base du pendu (en bas)
  hangmanBase: {
    bottom: 0,
    left: 50,
    width: 100,
    height: 6,
  },
  // Poteau vertical (monte depuis la base)
  hangmanPole: {
    bottom: 0,
    left: 50,
    width: 6,
    height: 150,
  },
  // Traverse horizontale (au sommet du poteau)
  hangmanBeam: {
    top: 130,
    left: 50,
    width: 80,
    height: 6,
  },
  // Corde (au bout de la traverse, pend vers le bas)
  hangmanRope: {
    top: 130,
    left: 129.5,
    width: 3,
    height: 35,
  },
  // Tête (sous la corde, centrée)
  hangmanHead: {
    top: 165,
    left: 121,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
  },
  // Corps (sous la tête, centré)
  hangmanBody: {
    top: 183,
    left: 128,
    width: 4,
    height: 40,
  },
  // Bras gauche (au niveau des épaules, vers la gauche)
  hangmanLeftArm: {
    top: 183,
    left: 118,
    width: 15,
    height: 3,
    transform: [{ rotate: '-30deg' }],
  },
  // Bras droit (au niveau des épaules, vers la droite)
  hangmanRightArm: {
    top: 183,
    left: 128,
    width: 15,
    height: 3,
    transform: [{ rotate: '30deg' }],
  },
  // Jambe gauche (sous le corps, comme les bras - horizontale puis verticale)
  hangmanLeftLeg: {
    top: 223,
    left: 118,
    width: 15,
    height: 3,
    transform: [{ rotate: '-30deg' }],
  },
  // Jambe droite (sous le corps, comme les bras - horizontale puis verticale)
  hangmanRightLeg: {
    top: 223,
    left: 128,
    width: 15,
    height: 3,
    transform: [{ rotate: '30deg' }],
  },
  wordSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    minHeight: 80,
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  letterContainer: {
    marginHorizontal: SPACING.xs,
  },
  letterText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    borderBottomWidth: 3,
    minWidth: 30,
    textAlign: 'center',
    paddingBottom: SPACING.xs,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    minHeight: 50,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
  wordReveal: {
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  keyboardSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xxl + SPACING.lg,
    marginBottom: SPACING.xl,
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  keyButton: {
    width: (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.xs * 6) / 7,
    height: 45,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonDisabled: {
    opacity: 0.5,
  },
  keyButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
});

export default HangmanGame;

