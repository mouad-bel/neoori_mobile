import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface CreativityGameProps {
  game: Game;
  onComplete: () => void;
}

const CreativityGame: React.FC<CreativityGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    {
      id: 1,
      question: 'Comment évalues-tu ta capacité à générer des idées nouvelles ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
    {
      id: 2,
      question: 'Quand tu es bloqué sur un problème, quelle est ta approche ?',
      type: 'multiple-choice',
      options: [
        'Je change de perspective',
        'Je cherche l\'inspiration ailleurs',
        'Je collabore avec d\'autres',
        'Je prends une pause',
        'Je teste plusieurs solutions',
      ],
    },
    {
      id: 3,
      question: 'Comment préfères-tu travailler sur des projets créatifs ?',
      type: 'multiple-choice',
      options: [
        'Seul avec du temps de réflexion',
        'En brainstorming avec d\'autres',
        'En itérant rapidement',
        'En explorant librement',
        'En structurant méthodiquement',
      ],
    },
    {
      id: 4,
      question: 'Est-ce que tu oses proposer des idées non conventionnelles ?',
      type: 'yes-no',
    },
    {
      id: 5,
      question: 'Comment gères-tu l\'échec d\'une idée créative ?',
      type: 'multiple-choice',
      options: [
        'Je l\'apprends et j\'itère',
        'Je cherche ce qui a fonctionné',
        'Je passe à autre chose',
        'Je persiste et j\'adapte',
        'Je demande des feedbacks',
      ],
    },
    {
      id: 6,
      question: 'Quelle est ta capacité à connecter des idées de différents domaines ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 7,
      question: 'Comment trouves-tu l\'inspiration ?',
      type: 'multiple-choice',
      options: [
        'En observant le monde',
        'En lisant et apprenant',
        'En discutant avec d\'autres',
        'En expérimentant',
        'En prenant du recul',
      ],
    },
    {
      id: 8,
      question: 'Est-ce que tu pratiques régulièrement des activités créatives ?',
      type: 'yes-no',
    },
    {
      id: 9,
      question: 'Comment évalues-tu ta capacité à transformer des idées en réalité ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default CreativityGame;

