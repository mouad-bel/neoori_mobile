import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import SkillMatchGame from './SkillMatchGame';

interface CareerSkillMatchGameProps extends BaseGameProps {}

const CareerSkillMatchGame: React.FC<CareerSkillMatchGameProps> = ({ game, onComplete }) => {
  const scenarios = [
    {
      id: '1',
      title: 'Deux offres de stage',
      description: 'Tu as deux propositions de stage',
      situation: 'Tu as deux propositions de stage',
      options: [
        {
          id: 'a',
          label: 'Startup en forte croissance, salaire attractif, 55–60h/semaine.',
          skills: ['Ambition', 'Performance', 'Croissance'],
        },
        {
          id: 'b',
          label: 'Association à impact social, salaire modeste, 35h/semaine.',
          skills: ['Impact social', 'Équilibre', 'Valeurs'],
        },
      ],
    },
    {
      id: '2',
      title: 'Créer une entreprise',
      description: 'Un proche te propose de co-fonder une entreprise.',
      situation: 'Un proche te propose de co-fonder une entreprise.',
      options: [
        {
          id: 'a',
          label: 'Tu quittes ton CDI pour tenter l\'aventure.',
          skills: ['Prise de risque', 'Entrepreneuriat', 'Autonomie'],
        },
        {
          id: 'b',
          label: 'Tu préfères garder ton poste stable.',
          skills: ['Sécurité', 'Stabilité', 'Prudence'],
        },
      ],
    },
    {
      id: '3',
      title: 'Devenir manager',
      description: 'On t\'offre un poste de responsable (+20% salaire) dans ton entreprise.',
      situation: 'On t\'offre un poste de responsable (+20% salaire) dans ton entreprise.',
      options: [
        {
          id: 'a',
          label: 'Tu acceptes, même si tu sais que tu devras gérer des conflits.',
          skills: ['Leadership', 'Responsabilité', 'Défi'],
        },
        {
          id: 'b',
          label: 'Tu refuses, tu es bien dans ton équipe actuelle.',
          skills: ['Harmonie', 'Satisfaction', 'Équipe'],
        },
      ],
    },
    {
      id: '4',
      title: 'Dilemme éthique',
      description: 'Ton chef veut embellir des données pour convaincre un client.',
      situation: 'Ton chef veut embellir des données pour convaincre un client.',
      options: [
        {
          id: 'a',
          label: 'Tu acceptes, c\'est courant dans le commerce.',
          skills: ['Pragmatisme', 'Adaptabilité', 'Conformité'],
        },
        {
          id: 'b',
          label: 'Tu refuses, même si tu sais que le contrat est compromis.',
          skills: ['Intégrité', 'Éthique', 'Valeurs'],
        },
      ],
    },
    {
      id: '5',
      title: 'Qualité ou délai',
      description: 'Tu as un projet à livrer à ton responsable.',
      situation: 'Tu as un projet à livrer à ton responsable.',
      options: [
        {
          id: 'a',
          label: 'Tu livres à temps avec le niveau actuel.',
          skills: ['Efficacité', 'Respect des délais', 'Pragmatisme'],
        },
        {
          id: 'b',
          label: 'Tu prends 3 jours pour viser l\'excellence.',
          skills: ['Excellence', 'Qualité', 'Perfectionnisme'],
        },
      ],
    },
    {
      id: '6',
      title: 'Mutation géographique',
      description: 'On te propose ton poste de rêve, mais il à 600 km de chez toi.',
      situation: 'On te propose ton poste de rêve, mais il à 600 km de chez toi.',
      options: [
        {
          id: 'a',
          label: 'Tu acceptes, c\'est une opportunité pour ta carrière.',
          skills: ['Mobilité', 'Carrière', 'Opportunité'],
        },
        {
          id: 'b',
          label: 'Tu refuses, tu préfères rester proche de tes repères.',
          skills: ['Stabilité géographique', 'Équilibre personnel', 'Racines'],
        },
      ],
    },
    {
      id: '7',
      title: 'Urgence le week-end',
      description: 'Un Incident professionnel critique arrive un vendredi soir, il nécessite une intervention urgente samedi et dimanche.',
      situation: 'Un Incident professionnel critique arrive un vendredi soir, il nécessite une intervention urgente samedi et dimanche.',
      options: [
        {
          id: 'a',
          label: 'Tu te portes volontaire pour montrer ton engagement.',
          skills: ['Engagement', 'Dévouement', 'Disponibilité'],
        },
        {
          id: 'b',
          label: 'Tu laisses l\'équipe d\'astreinte gérer, ton temps perso est prioritaire.',
          skills: ['Équilibre vie pro/perso', 'Limites', 'Priorités personnelles'],
        },
      ],
    },
    {
      id: '8',
      title: 'Spécialisation',
      description: 'On te propose une formation de 6 mois pour devenir expert d\'un domaine.',
      situation: 'On te propose une formation de 6 mois pour devenir expert d\'un domaine.',
      options: [
        {
          id: 'a',
          label: 'Tu acceptes pour construire une expertise forte et devenir une référence dans ton domaine.',
          skills: ['Expertise', 'Spécialisation', 'Excellence'],
        },
        {
          id: 'b',
          label: 'Tu refuses, tu préfères explorer plusieurs fonctions pour développer une carrière variée.',
          skills: ['Polyvalence', 'Exploration', 'Diversité'],
        },
      ],
    },
    {
      id: '9',
      title: 'Retour au bureau',
      description: 'Ton entreprise impose le retour au présentiel à temps plein.',
      situation: 'Ton entreprise impose le retour au présentiel à temps plein.',
      options: [
        {
          id: 'a',
          label: 'Tu te remets en cherches d\'un poste plus flexible.',
          skills: ['Autonomie', 'Flexibilité', 'Valeurs personnelles'],
        },
        {
          id: 'b',
          label: 'Tu t\'adaptes, la stabilité compte.',
          skills: ['Adaptabilité', 'Stabilité', 'Conformité'],
        },
      ],
    },
    {
      id: '10',
      title: 'Type de projet',
      description: 'Tu as le choix entre deux missions possibles.',
      situation: 'Tu as le choix entre deux missions possibles.',
      options: [
        {
          id: 'a',
          label: 'Un projet structuré avec des objectifs clairs.',
          skills: ['Organisation', 'Structure', 'Clarté'],
        },
        {
          id: 'b',
          label: 'Un projet innovant mais avec beaucoup d\'incertitude.',
          skills: ['Innovation', 'Créativité', 'Adaptabilité'],
        },
      ],
    },
    {
      id: '11',
      title: 'Salaire ou ambiance',
      description: 'On te propose une offre très bien payée mais tu sais que l\'ambiance est tendue.',
      situation: 'On te propose une offre très bien payée mais tu sais que l\'ambiance est tendue.',
      options: [
        {
          id: 'a',
          label: 'Tu acceptes, le salaire compense.',
          skills: ['Rémunération', 'Priorité financière', 'Pragmatisme'],
        },
        {
          id: 'b',
          label: 'Tu refuses, la qualité relationnelle est essentielle.',
          skills: ['Ambiance de travail', 'Relations', 'Bien-être'],
        },
      ],
    },
    {
      id: '12',
      title: 'Réunions inutiles',
      description: 'Ton agenda est rempli de réunions peu utiles.',
      situation: 'Ton agenda est rempli de réunions peu utiles.',
      options: [
        {
          id: 'a',
          label: 'Tu y participes, l\'échange collectif c\'est important.',
          skills: ['Collaboration', 'Communication', 'Collectif'],
        },
        {
          id: 'b',
          label: 'Tu les évites pour te concentrer sur tes tâches.',
          skills: ['Efficacité', 'Focus', 'Productivité'],
        },
      ],
    },
    {
      id: '13',
      title: 'Validation hiérarchique',
      description: 'Dans ton entreprise, les décisions passent par plusieurs niveaux de validation.',
      situation: 'Dans ton entreprise, les décisions passent par plusieurs niveaux de validation.',
      options: [
        {
          id: 'a',
          label: 'Tu respectes le processus tel qu\'il est défini.',
          skills: ['Respect des processus', 'Conformité', 'Structure'],
        },
        {
          id: 'b',
          label: 'Tu cherches à avoir plus d\'autonomie pour décider par toi-même.',
          skills: ['Autonomie', 'Initiative', 'Indépendance'],
        },
      ],
    },
    {
      id: '14',
      title: 'Reconnaissance manquante',
      description: 'Tu as beaucoup contribué à un projet collectif, mais un collègue reçoit seul les félicitations.',
      situation: 'Tu as beaucoup contribué à un projet collectif, mais un collègue reçoit seul les félicitations.',
      options: [
        {
          id: 'a',
          label: 'Ça te frustre, tu as besoin de reconnaissance.',
          skills: ['Reconnaissance', 'Valorisation', 'Identification'],
        },
        {
          id: 'b',
          label: 'Tu relativises, l\'objectif collectif compte.',
          skills: ['Collectif', 'Humilité', 'Objectif commun'],
        },
      ],
    },
    {
      id: '15',
      title: 'Offre concurrente',
      description: 'Un concurrent propose +30% de salaire.',
      situation: 'Un concurrent propose +30% de salaire.',
      options: [
        {
          id: 'a',
          label: 'Tu étudies l\'offre.',
          skills: ['Opportunité', 'Rémunération', 'Carrière'],
        },
        {
          id: 'b',
          label: 'Tu refuses par loyauté envers ton équipe.',
          skills: ['Loyauté', 'Fidélité', 'Relations'],
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

