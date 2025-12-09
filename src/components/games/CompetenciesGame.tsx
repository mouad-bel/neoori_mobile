import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface CompetenciesGameProps {
  game: Game;
  onComplete: () => void;
}

const CompetenciesGame: React.FC<CompetenciesGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    {
      id: 1,
      question: 'Quelles sont tes compétences techniques les plus fortes ?',
      type: 'multiple-choice',
      options: [
        'Développement et programmation',
        'Design et UX/UI',
        'Marketing et communication',
        'Gestion de projet',
        'Analyse de données',
        'Autre',
      ],
    },
    {
      id: 2,
      question: 'Comment évalues-tu ton niveau en compétences techniques ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Débutant', max: 'Expert' },
    },
    {
      id: 3,
      question: 'Quelles compétences souhaites-tu développer en priorité ?',
      type: 'multiple-choice',
      options: [
        'Compétences techniques',
        'Leadership et management',
        'Communication',
        'Créativité et innovation',
        'Stratégie et vision',
        'Réseau et networking',
      ],
    },
    {
      id: 4,
      question: 'Comment préfères-tu acquérir de nouvelles compétences ?',
      type: 'multiple-choice',
      options: [
        'Formation en ligne',
        'Mentorat',
        'Pratique sur projets',
        'Lecture et recherche',
        'Événements et conférences',
      ],
    },
    {
      id: 5,
      question: 'Quel est ton niveau de confiance dans tes compétences actuelles ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Très élevé' },
    },
    {
      id: 6,
      question: 'As-tu déjà utilisé tes compétences pour résoudre un problème complexe ?',
      type: 'yes-no',
    },
    {
      id: 7,
      question: 'Quel domaine technique t\'intéresse le plus ?',
      type: 'multiple-choice',
      options: [
        'Intelligence artificielle',
        'Développement web/mobile',
        'Cloud et infrastructure',
        'Cybersécurité',
        'Data science',
        'Aucun domaine technique spécifique',
      ],
    },
    {
      id: 8,
      question: 'Comment évalues-tu ta capacité à apprendre rapidement de nouvelles technologies ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Lent', max: 'Très rapide' },
    },
    {
      id: 9,
      question: 'Quelle est ta méthode préférée pour valider tes compétences ?',
      type: 'multiple-choice',
      options: [
        'Certifications',
        'Projets personnels',
        'Feedback de pairs',
        'Résultats concrets',
        'Formation continue',
      ],
    },
    {
      id: 10,
      question: 'Est-ce que tu te sens à jour avec les dernières tendances de ton domaine ?',
      type: 'yes-no',
    },
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default CompetenciesGame;

