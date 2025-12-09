import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import WheelOfMeaningGame from './WheelOfMeaningGame';

interface MyWheelOfMeaningGameProps extends BaseGameProps {}

const MyWheelOfMeaningGame: React.FC<MyWheelOfMeaningGameProps> = ({ game, onComplete }) => {
  const axes = [
    {
      id: 'values',
      label: 'Valeurs',
      icon: 'heart',
      color: '#FF6B35',
      questions: [
        {
          id: 'v1',
          question: 'Quelles valeurs sont les plus importantes pour toi dans le travail ?',
          options: [
            'Autonomie et liberté',
            'Sécurité et stabilité',
            'Impact et contribution',
            'Reconnaissance et prestige',
            'Équilibre vie pro/perso',
          ],
        },
        {
          id: 'v2',
          question: 'Qu\'est-ce qui te motive vraiment ?',
          options: [
            'L\'argent et les avantages',
            'L\'apprentissage continu',
            'Aider les autres',
            'Créer et innover',
            'Diriger et influencer',
          ],
        },
      ],
    },
    {
      id: 'talents',
      label: 'Talents',
      icon: 'star',
      color: '#F59E0B',
      questions: [
        {
          id: 't1',
          question: 'Quelles sont tes forces naturelles ?',
          options: [
            'Analyser et résoudre des problèmes',
            'Créer et imaginer',
            'Communiquer et convaincre',
            'Organiser et planifier',
            'Motiver et inspirer',
          ],
        },
        {
          id: 't2',
          question: 'Dans quoi excelles-tu naturellement ?',
          options: [
            'Les compétences techniques',
            'La créativité',
            'Le relationnel',
            'La gestion de projet',
            'Le leadership',
          ],
        },
      ],
    },
    {
      id: 'passions',
      label: 'Passions',
      icon: 'flame',
      color: '#EF4444',
      questions: [
        {
          id: 'p1',
          question: 'Qu\'est-ce qui te passionne vraiment ?',
          options: [
            'La technologie et l\'innovation',
            'L\'art et la créativité',
            'Les relations humaines',
            'Le business et l\'entrepreneuriat',
            'Les sciences et la recherche',
          ],
        },
        {
          id: 'p2',
          question: 'Sur quoi pourrais-tu passer des heures sans t\'ennuyer ?',
          options: [
            'Coder et développer',
            'Créer et designer',
            'Échanger avec les gens',
            'Stratégie et business',
            'Apprendre et découvrir',
          ],
        },
      ],
    },
    {
      id: 'needs',
      label: 'Besoins',
      icon: 'hand-left',
      color: '#10B981',
      questions: [
        {
          id: 'n1',
          question: 'De quoi as-tu besoin pour être épanoui au travail ?',
          options: [
            'Autonomie et flexibilité',
            'Structure et clarté',
            'Reconnaissance et feedback',
            'Défis et croissance',
            'Équipe et collaboration',
          ],
        },
        {
          id: 'n2',
          question: 'Qu\'est-ce qui est essentiel pour toi ?',
          options: [
            'Un bon salaire',
            'Un environnement stable',
            'Des opportunités d\'évolution',
            'Un sens à mon travail',
            'Un bon équilibre vie pro/perso',
          ],
        },
      ],
    },
    {
      id: 'constraints',
      label: 'Contraintes',
      icon: 'lock-closed',
      color: '#6366F1',
      questions: [
        {
          id: 'c1',
          question: 'Quelles sont tes contraintes principales ?',
          options: [
            'Localisation géographique',
            'Horaires et disponibilité',
            'Formation et compétences',
            'Situation financière',
            'Responsabilités personnelles',
          ],
        },
        {
          id: 'c2',
          question: 'Qu\'est-ce qui limite tes choix professionnels ?',
          options: [
            'Le lieu de travail',
            'Les horaires',
            'Mes compétences actuelles',
            'Mon budget',
            'Ma situation familiale',
          ],
        },
      ],
    },
    {
      id: 'environment',
      label: 'Environnement',
      icon: 'globe',
      color: '#8B5CF6',
      questions: [
        {
          id: 'e1',
          question: 'Quel environnement de travail te convient le mieux ?',
          options: [
            'Startup dynamique',
            'Grande entreprise',
            'Freelance/indépendant',
            'PME familiale',
            'Organisation publique',
          ],
        },
        {
          id: 'e2',
          question: 'Comment préfères-tu travailler ?',
          options: [
            'En équipe collaborative',
            'En autonomie complète',
            'En mode hybride',
            'En présentiel',
            'En télétravail',
          ],
        },
      ],
    },
  ];

  const instructions =
    'Réponds aux questions pour chaque axe. Ta Roue du Sens se construira progressivement et révélera ton portrait professionnel unique.';

  return (
    <WheelOfMeaningGame
      game={game}
      onComplete={onComplete}
      axes={axes}
      instructions={instructions}
    />
  );
};

export default MyWheelOfMeaningGame;

