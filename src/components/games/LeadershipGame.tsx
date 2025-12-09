import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface LeadershipGameProps {
  game: Game;
  onComplete: () => void;
}

const LeadershipGame: React.FC<LeadershipGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    {
      id: 1,
      question: 'Quel est ton style de leadership naturel ?',
      type: 'multiple-choice',
      options: [
        'Directif et décisionnaire',
        'Participatif et collaboratif',
        'Visionnaire et inspirant',
        'Coach et développeur',
        'Démocratique et consensuel',
      ],
    },
    {
      id: 2,
      question: 'Comment évalues-tu ta capacité à motiver une équipe ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
    {
      id: 3,
      question: 'Face à une décision importante, comment procèdes-tu ?',
      type: 'multiple-choice',
      options: [
        'Je décide seul après analyse',
        'Je consulte l\'équipe',
        'Je délègue la décision',
        'Je cherche un consensus',
        'Je combine plusieurs approches',
      ],
    },
    {
      id: 4,
      question: 'Comment gères-tu les performances d\'une équipe ?',
      type: 'multiple-choice',
      options: [
        'Je fixe des objectifs clairs',
        'Je donne du feedback régulier',
        'Je reconnais les réussites',
        'Je gère les difficultés individuellement',
        'Je crée un environnement de confiance',
      ],
    },
    {
      id: 5,
      question: 'Quelle est ta capacité à déléguer efficacement ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 6,
      question: 'Comment réagis-tu face à l\'échec d\'un membre de ton équipe ?',
      type: 'multiple-choice',
      options: [
        'Je cherche à comprendre',
        'Je propose du soutien',
        'Je donne des conseils',
        'Je réévalue les objectifs',
        'Je transforme en apprentissage',
      ],
    },
    {
      id: 7,
      question: 'Est-ce que tu arrives à créer une vision claire pour ton équipe ?',
      type: 'yes-no',
    },
    {
      id: 8,
      question: 'Comment gères-tu les conflits au sein d\'une équipe ?',
      type: 'multiple-choice',
      options: [
        'Je médie directement',
        'Je laisse l\'équipe résoudre',
        'Je cherche la cause racine',
        'Je facilite la communication',
        'Je prends une décision rapide',
      ],
    },
    {
      id: 9,
      question: 'Quelle est ta capacité à prendre des décisions difficiles ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 10,
      question: 'Comment développes-tu les talents de ton équipe ?',
      type: 'multiple-choice',
      options: [
        'Formation et développement',
        'Défis et responsabilités',
        'Mentorat individuel',
        'Feedback constructif',
        'Opportunités de croissance',
      ],
    },
    {
      id: 11,
      question: 'Est-ce que tu arrives à inspirer les autres par tes actions ?',
      type: 'yes-no',
    },
    {
      id: 12,
      question: 'Comment équilibres-tu autorité et empathie ?',
      type: 'multiple-choice',
      options: [
        'Je trouve un équilibre naturel',
        'Je privilégie l\'autorité',
        'Je privilégie l\'empathie',
        'J\'adapte selon la situation',
        'Je communique clairement mes attentes',
      ],
    },
    {
      id: 13,
      question: 'Quelle est ta capacité à gérer le changement et l\'incertitude ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 14,
      question: 'Comment construis-tu la confiance avec ton équipe ?',
      type: 'multiple-choice',
      options: [
        'Transparence et communication',
        'Cohérence dans mes actions',
        'Reconnaissance et respect',
        'Soutien et disponibilité',
        'Partage de responsabilités',
      ],
    },
    {
      id: 15,
      question: 'Est-ce que tu considères que tu as un impact positif sur les autres ?',
      type: 'yes-no',
    },
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default LeadershipGame;

