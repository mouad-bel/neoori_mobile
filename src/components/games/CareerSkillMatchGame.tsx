import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import SkillMatchGame from './SkillMatchGame';

interface CareerSkillMatchGameProps extends BaseGameProps {}

const CareerSkillMatchGame: React.FC<CareerSkillMatchGameProps> = ({ game, onComplete }) => {
  const scenarios = [
    {
      id: '1',
      title: 'Défi d\'équipe',
      description: 'Ton équipe est en retard sur un projet critique',
      situation: 'Comment réagis-tu face à cette situation ?',
      options: [
        {
          id: 'a',
          label: 'J\'organise une réunion d\'urgence pour identifier les blocages et réorganiser',
          skills: ['Leadership', 'Organisation', 'Communication', 'Gestion de crise'],
        },
        {
          id: 'b',
          label: 'Je prends en charge les tâches les plus critiques moi-même',
          skills: ['Autonomie', 'Prise d\'initiative', 'Responsabilité', 'Efficacité'],
        },
      ],
    },
    {
      id: '2',
      title: 'Client mécontent',
      description: 'Un client important exprime sa frustration',
      situation: 'Que fais-tu en priorité ?',
      options: [
        {
          id: 'a',
          label: 'J\'écoute activement pour comprendre ses besoins réels',
          skills: ['Empathie', 'Écoute active', 'Communication', 'Résolution de problèmes'],
        },
        {
          id: 'b',
          label: 'Je propose immédiatement des solutions concrètes',
          skills: ['Réactivité', 'Proactivité', 'Créativité', 'Orientation solution'],
        },
      ],
    },
    {
      id: '3',
      title: 'Nouvelle technologie',
      description: 'Une nouvelle technologie émerge dans ton domaine',
      situation: 'Comment l\'abordes-tu ?',
      options: [
        {
          id: 'a',
          label: 'Je l\'étudie en profondeur avant de l\'adopter',
          skills: ['Curiosité', 'Apprentissage', 'Analyse', 'Prudence'],
        },
        {
          id: 'b',
          label: 'Je teste rapidement sur un projet pilote',
          skills: ['Agilité', 'Expérimentation', 'Innovation', 'Adaptabilité'],
        },
      ],
    },
    {
      id: '4',
      title: 'Conflit entre collègues',
      description: 'Deux membres de ton équipe sont en désaccord',
      situation: 'Quelle est ta approche ?',
      options: [
        {
          id: 'a',
          label: 'Je facilite une discussion pour trouver un compromis',
          skills: ['Médiation', 'Diplomatie', 'Empathie', 'Communication'],
        },
        {
          id: 'b',
          label: 'Je prends une décision rapide pour débloquer la situation',
          skills: ['Leadership', 'Décision', 'Efficacité', 'Autorité'],
        },
      ],
    },
    {
      id: '5',
      title: 'Opportunité inattendue',
      description: 'On te propose un poste dans une startup innovante',
      situation: 'Comment réagis-tu ?',
      options: [
        {
          id: 'a',
          label: 'J\'analyse en détail avant de décider',
          skills: ['Réflexion', 'Analyse', 'Prudence', 'Stratégie'],
        },
        {
          id: 'b',
          label: 'Je saisis l\'opportunité avec enthousiasme',
          skills: ['Prise de risque', 'Aventure', 'Optimisme', 'Adaptabilité'],
        },
      ],
    },
  ];

  const instructions =
    'Glisse à droite (Oui) ou à gauche (Non) selon ta réaction, ou clique directement sur une option. L\'IA identifiera tes compétences naturelles !';

  return (
    <SkillMatchGame
      game={game}
      onComplete={onComplete}
      scenarios={scenarios}
      instructions={instructions}
    />
  );
};

export default CareerSkillMatchGame;

