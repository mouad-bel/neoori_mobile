import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface CompetenciesLeadershipGameProps {
  game: Game;
  onComplete: () => void;
}

const CompetenciesLeadershipGame: React.FC<CompetenciesLeadershipGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    // Section Compétences
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
    // Section Leadership
    {
      id: 11,
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
      id: 12,
      question: 'Comment évalues-tu ta capacité à motiver une équipe ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
    {
      id: 13,
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
      id: 14,
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
      id: 15,
      question: 'Quelle est ta capacité à déléguer efficacement ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 16,
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
      id: 17,
      question: 'Est-ce que tu arrives à créer une vision claire pour ton équipe ?',
      type: 'yes-no',
    },
    {
      id: 18,
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
      id: 19,
      question: 'Quelle est ta capacité à prendre des décisions difficiles ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 20,
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
      id: 21,
      question: 'Est-ce que tu arrives à inspirer les autres par tes actions ?',
      type: 'yes-no',
    },
    {
      id: 22,
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
      id: 23,
      question: 'Quelle est ta capacité à gérer le changement et l\'incertitude ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 24,
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
      id: 25,
      question: 'Est-ce que tu considères que tu as un impact positif sur les autres ?',
      type: 'yes-no',
    },
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default CompetenciesLeadershipGame;

