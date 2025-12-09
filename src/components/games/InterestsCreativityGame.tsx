import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface InterestsCreativityGameProps {
  game: Game;
  onComplete: () => void;
}

const InterestsCreativityGame: React.FC<InterestsCreativityGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    // Section Intérêts & Motivation
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
    // Section Créativité & Innovation
    {
      id: 7,
      question: 'Comment évalues-tu ta capacité à générer des idées nouvelles ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
    {
      id: 8,
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
      id: 9,
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
      id: 10,
      question: 'Est-ce que tu oses proposer des idées non conventionnelles ?',
      type: 'yes-no',
    },
    {
      id: 11,
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
      id: 12,
      question: 'Quelle est ta capacité à connecter des idées de différents domaines ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 13,
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
      id: 14,
      question: 'Est-ce que tu pratiques régulièrement des activités créatives ?',
      type: 'yes-no',
    },
    {
      id: 15,
      question: 'Comment évalues-tu ta capacité à transformer des idées en réalité ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default InterestsCreativityGame;

