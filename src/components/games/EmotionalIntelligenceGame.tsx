import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface EmotionalIntelligenceGameProps {
  game: Game;
  onComplete: () => void;
}

const EmotionalIntelligenceGame: React.FC<EmotionalIntelligenceGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    {
      id: 1,
      question: 'Comment reconnais-tu généralement tes émotions ?',
      type: 'multiple-choice',
      options: [
        'Immédiatement et clairement',
        'Après réflexion',
        'Parfois difficilement',
        'En observant mes réactions',
        'En parlant avec d\'autres',
      ],
    },
    {
      id: 2,
      question: 'Quand tu es stressé, comment réagis-tu ?',
      type: 'multiple-choice',
      options: [
        'Je prends du recul et j\'analyse',
        'Je cherche du soutien',
        'Je fais une pause',
        'Je continue malgré tout',
        'Je communique mes besoins',
      ],
    },
    {
      id: 3,
      question: 'Comment évalues-tu ta capacité à comprendre les émotions des autres ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 4,
      question: 'Dans une situation émotionnellement chargée, comment réagis-tu ?',
      type: 'multiple-choice',
      options: [
        'Je reste calme et rationnel',
        'Je ressens l\'émotion mais je la gère',
        'Je suis submergé par l\'émotion',
        'Je cherche à comprendre',
        'Je communique mes sentiments',
      ],
    },
    {
      id: 5,
      question: 'Est-ce que tu pratiques régulièrement l\'auto-réflexion ?',
      type: 'yes-no',
    },
    {
      id: 6,
      question: 'Comment gères-tu les critiques personnelles ?',
      type: 'multiple-choice',
      options: [
        'Je les accepte et j\'apprends',
        'Je me défends',
        'Je les analyse objectivement',
        'Je demande des précisions',
        'Je prends du temps pour y réfléchir',
      ],
    },
    {
      id: 7,
      question: 'Quelle est ta capacité à exprimer tes émotions de manière appropriée ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
    {
      id: 8,
      question: 'Comment réagis-tu face à la colère d\'un collègue ?',
      type: 'multiple-choice',
      options: [
        'Je reste calme et écoute',
        'Je cherche à comprendre la cause',
        'Je me mets sur la défensive',
        'Je propose de l\'aide',
        'Je prends mes distances',
      ],
    },
    {
      id: 9,
      question: 'Est-ce que tu arrives à identifier les émotions non exprimées des autres ?',
      type: 'yes-no',
    },
    {
      id: 10,
      question: 'Comment utilises-tu tes émotions pour prendre des décisions ?',
      type: 'multiple-choice',
      options: [
        'Je les intègre avec la logique',
        'Je les ignore complètement',
        'Je les laisse guider mes choix',
        'Je les analyse d\'abord',
        'Je demande conseil',
      ],
    },
    {
      id: 11,
      question: 'Quelle est ta capacité à gérer tes propres émotions négatives ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 12,
      question: 'Comment construis-tu l\'empathie avec les autres ?',
      type: 'multiple-choice',
      options: [
        'En écoutant activement',
        'En me mettant à leur place',
        'En posant des questions',
        'En observant leur langage corporel',
        'En partageant mes expériences',
      ],
    },
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default EmotionalIntelligenceGame;

