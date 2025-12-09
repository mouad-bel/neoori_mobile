import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface InterestsMotivationGameProps {
  game: Game;
  onComplete: () => void;
}

const InterestsMotivationGame: React.FC<InterestsMotivationGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    {
      id: 1,
      question: 'Quel domaine t\'intéresse le plus actuellement ?',
      type: 'multiple-choice',
      options: [
        'Technologie et innovation',
        'Business et entrepreneuriat',
        'Design et créativité',
        'Sciences et recherche',
        'Social et impact',
      ],
    },
    {
      id: 2,
      question: 'Qu\'est-ce qui te motive le plus dans ton travail ?',
      type: 'multiple-choice',
      options: [
        'Résoudre des problèmes complexes',
        'Créer et innover',
        'Aider les autres',
        'Apprendre continuellement',
        'Gagner en autonomie',
      ],
    },
    {
      id: 3,
      question: 'Comment préfères-tu apprendre de nouvelles choses ?',
      type: 'multiple-choice',
      options: [
        'En pratiquant directement',
        'En lisant et étudiant',
        'En regardant des vidéos/tutoriels',
        'En discutant avec d\'autres',
        'En suivant une formation structurée',
      ],
    },
    {
      id: 4,
      question: 'Quel type d\'environnement de travail te convient le mieux ?',
      type: 'multiple-choice',
      options: [
        'Équipe collaborative',
        'Travail autonome',
        'Startup dynamique',
        'Grande entreprise structurée',
        'Freelance/indépendant',
      ],
    },
    {
      id: 5,
      question: 'À quelle fréquence aimes-tu changer de projet ou de défi ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Rarement', max: 'Très souvent' },
    },
    {
      id: 6,
      question: 'Est-ce que tu préfères travailler sur plusieurs projets en même temps ?',
      type: 'yes-no',
    },
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default InterestsMotivationGame;

