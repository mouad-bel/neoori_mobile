import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import VisionCreationGame from './VisionCreationGame';

interface MyCareerVisionGameProps extends BaseGameProps {}

const MyCareerVisionGame: React.FC<MyCareerVisionGameProps> = ({ game, onComplete }) => {
  const questions = [
    {
      id: '1',
      label: 'Où te vois-tu dans 5 ans ?',
      placeholder: 'Décris ta vision professionnelle...',
      icon: 'eye',
    },
    {
      id: '2',
      label: 'Quels sont tes objectifs de carrière ?',
      placeholder: 'Liste tes principaux objectifs...',
      icon: 'flag',
    },
    {
      id: '3',
      label: 'Qu\'est-ce qui te motive vraiment ?',
      placeholder: 'Qu\'est-ce qui t\'anime dans ton travail ?',
      icon: 'flame',
    },
    {
      id: '4',
      label: 'Quel impact veux-tu avoir ?',
      placeholder: 'Comment veux-tu contribuer au monde ?',
      icon: 'star',
    },
  ];

  const instructions = 'Crée ta vision de carrière en répondant à ces questions. Sois authentique et détaillé !';

  return (
    <VisionCreationGame
      game={game}
      onComplete={onComplete}
      questions={questions}
      instructions={instructions}
    />
  );
};

export default MyCareerVisionGame;


