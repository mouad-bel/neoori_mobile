import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList, Game } from '../../types';
import { useTheme } from '../../store/ThemeContext';
import { MOCK_GAMES } from '../../constants/mockData';
import StorageService from '../../services/storage/StorageService';
import BottomBar from '../../components/navigation/BottomBar';

// Import individual game components
import InterestsCreativityGame from '../../components/games/InterestsCreativityGame';
import SoftSkillsEmotionalGame from '../../components/games/SoftSkillsEmotionalGame';
import CompetenciesLeadershipGame from '../../components/games/CompetenciesLeadershipGame';
import CareerValuesGame from '../../components/games/CareerValuesGame';
import PrioritiesRankingGame from '../../components/games/PrioritiesRankingGame';
import MyCareerVisionGame from '../../components/games/MyCareerVisionGame';
import CompetenciesPuzzleGame from '../../components/games/CompetenciesPuzzleGame';
import MyWheelOfMeaningGame from '../../components/games/MyWheelOfMeaningGame';
import CareerSkillMatchGame from '../../components/games/CareerSkillMatchGame';
import ValuesMatchGame from '../../components/games/ValuesMatchGame';
import ImagePuzzleGame from '../../components/games/ImagePuzzleGame';
import ConnectFourGame from '../../components/games/ConnectFourGame';
import HangmanGame from '../../components/games/HangmanGame';
import Couch2048Game from '../../components/games/Couch2048Game';

type GameScreenRouteProp = RouteProp<MainDrawerParamList, 'Game'>;

const GameScreen = () => {
  const route = useRoute<GameScreenRouteProp>();
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors } = useTheme();
  const { gameId } = route.params;
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const foundGame = MOCK_GAMES.find(g => g.id === gameId);
        if (foundGame) {
          setGame(foundGame);
        }
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!game) {
    return null;
  }

  // Route to the appropriate game component based on gameId
  const renderGame = () => {
    switch (gameId) {
      case '1':
        return <InterestsCreativityGame game={game} onComplete={handleGameComplete} />;
      case '2':
        return <SoftSkillsEmotionalGame game={game} onComplete={handleGameComplete} />;
      case '3':
        return <CompetenciesLeadershipGame game={game} onComplete={handleGameComplete} />;
      case '7':
        return <CareerValuesGame game={game} onComplete={handleGameComplete} />;
      case '8':
        return <PrioritiesRankingGame game={game} onComplete={handleGameComplete} />;
      case '10':
        return <MyCareerVisionGame game={game} onComplete={handleGameComplete} />;
      case '11':
        return <CompetenciesPuzzleGame game={game} onComplete={handleGameComplete} />;
      case '12':
        return <MyWheelOfMeaningGame game={game} onComplete={handleGameComplete} />;
      case '13':
        return <CareerSkillMatchGame game={game} onComplete={handleGameComplete} />;
      case '14':
        return (
          <ImagePuzzleGame
            game={game}
            onComplete={handleGameComplete}
            imageUri="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
            instructions="Clique sur une pièce pour la sélectionner, puis clique sur l'espace vide pour la déplacer. Les pièces correctement placées sont marquées en vert."
          />
        );
      case '15':
        return <ConnectFourGame game={game} onComplete={handleGameComplete} />;
      case '16':
        return <HangmanGame game={game} onComplete={handleGameComplete} />;
      case '17':
        return <Couch2048Game game={game} onComplete={handleGameComplete} />;
      case '18':
        return <ValuesMatchGame game={game} onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  const handleGameComplete = async () => {
    // Navigate back to the games screen
    console.log('[GameScreen] handleGameComplete called - navigating back');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderGame()}
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GameScreen;

