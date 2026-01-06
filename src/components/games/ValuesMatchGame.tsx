import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import SkillMatchGame from './SkillMatchGame';

interface ValuesMatchGameProps extends BaseGameProps {}

const ValuesMatchGame: React.FC<ValuesMatchGameProps> = ({ game, onComplete }) => {
  const scenarios = [
    {
      id: '16',
      title: 'Routine confortable',
      description: 'Ton poste actuel est stable, bien payé, mais peu varié.',
      situation: 'Ton poste actuel est stable, bien payé, mais peu varié.',
      options: [
        {
          id: 'a',
          label: 'Ça te convient, tu aimes la prévisibilité.',
          skills: ['Stabilité', 'Confort', 'Prévisibilité'],
        },
        {
          id: 'b',
          label: 'Tu cherches plus de diversité.',
          skills: ['Diversité', 'Variété', 'Exploration'],
        },
      ],
    },
    {
      id: '17',
      title: 'Sens du projet',
      description: 'On t\'affecte à un projet dont tu ne vois pas l\'utilité.',
      situation: 'On t\'affecte à un projet dont tu ne vois pas l\'utilité.',
      options: [
        {
          id: 'a',
          label: 'Tu l\'exécutes, c\'est ton rôle.',
          skills: ['Discipline', 'Respect hiérarchique', 'Professionnalisme'],
        },
        {
          id: 'b',
          label: 'Tu demandes une réaffectation, tu as besoin de sens.',
          skills: ['Sens', 'Cohérence', 'Engagement'],
        },
      ],
    },
    {
      id: '18',
      title: 'Autonomie limitée',
      description: 'Ton manager veut valider chacune de tes décisions.',
      situation: 'Ton manager veut valider chacune de tes décisions.',
      options: [
        {
          id: 'a',
          label: 'Tu acceptes, il a l\'expérience.',
          skills: ['Respect de l\'autorité', 'Apprentissage', 'Humilité'],
        },
        {
          id: 'b',
          label: 'Ça te pèse, tu veux plus d\'autonomie.',
          skills: ['Autonomie', 'Indépendance', 'Liberté'],
        },
      ],
    },
    {
      id: '19',
      title: 'Alerte santé',
      description: 'Tu te sens très fatigué·e. Ton responsable te dit : « Tenez bon, il reste encore deux mois. »',
      situation: 'Tu te sens très fatigué·e. Ton responsable te dit : « Tenez bon, il reste encore deux mois. »',
      options: [
        {
          id: 'a',
          label: 'Tu fais l\'effort de tenir jusqu\'au bout en mobilisant tes dernières ressources.',
          skills: ['Persévérance', 'Engagement', 'Détermination'],
        },
        {
          id: 'b',
          label: 'Tu décides de t\'arrêter pour te préserver, ta santé passe avant tout.',
          skills: ['Santé', 'Équilibre', 'Bien-être'],
        },
      ],
    },
    {
      id: '20',
      title: 'Créer ou exécuter',
      description: 'Deux postes se libèrent dans ton équipe.',
      situation: 'Deux postes se libèrent dans ton équipe.',
      options: [
        {
          id: 'a',
          label: 'Un poste où tu imagines et testes de nouvelles idées, même si ton travail est peu visible au début.',
          skills: ['Créativité', 'Innovation', 'Vision'],
        },
        {
          id: 'b',
          label: 'Un poste où tu appliques des méthodes éprouvées, avec des résultats rapidement reconnus.',
          skills: ['Reconnaissance', 'Efficacité', 'Méthodes'],
        },
      ],
    },
    {
      id: '21',
      title: 'Question salariale',
      description: 'Deux missions se présentent à toi.',
      situation: 'Deux missions se présentent à toi.',
      options: [
        {
          id: 'a',
          label: 'Une mission alignée avec tes aspirations à 2 000€/mois.',
          skills: ['Sens', 'Alignement', 'Valeurs'],
        },
        {
          id: 'b',
          label: 'Une mission sans intérêt particulier pour toi payée 3 200€/mois.',
          skills: ['Rémunération', 'Pragmatisme', 'Financier'],
        },
      ],
    },
    {
      id: '22',
      title: 'Inéquité salariale',
      description: 'Un collègue au même poste que toi gagne 500€ de plus.',
      situation: 'Un collègue au même poste que toi gagne 500€ de plus.',
      options: [
        {
          id: 'a',
          label: 'Tu interpelles ta hiérarchie.',
          skills: ['Justice', 'Revendication', 'Équité'],
        },
        {
          id: 'b',
          label: 'Tu ne te compares pas, chacun a son parcours.',
          skills: ['Acceptation', 'Paix intérieure', 'Individualité'],
        },
      ],
    },
    {
      id: '23',
      title: 'Projet personnel',
      description: 'Tu envisages de lancer un projet entrepreneurial qui demanderait d\'y consacrer tes soirées et tes week-ends pendant six mois.',
      situation: 'Tu envisages de lancer un projet entrepreneurial qui demanderait d\'y consacrer tes soirées et tes week-ends pendant six mois.',
      options: [
        {
          id: 'a',
          label: 'Tu te lances, car tu estimes que l\'opportunité en vaut l\'investissement.',
          skills: ['Entrepreneuriat', 'Détermination', 'Opportunité'],
        },
        {
          id: 'b',
          label: 'Tu choisis de ne pas t\'engager, afin de préserver ton temps personnel.',
          skills: ['Équilibre', 'Temps personnel', 'Préservation'],
        },
      ],
    },
    {
      id: '24',
      title: 'Compétition interne',
      description: 'Tu es en concurrence avec un collègue pour une promotion.',
      situation: 'Tu es en concurrence avec un collègue pour une promotion.',
      options: [
        {
          id: 'a',
          label: 'Tu joues le jeu à fond.',
          skills: ['Compétitivité', 'Ambition', 'Performance'],
        },
        {
          id: 'b',
          label: 'Tu te retires, votre relation est plus importante.',
          skills: ['Relations', 'Harmonie', 'Valeurs humaines'],
        },
      ],
    },
    {
      id: '25',
      title: 'Feedback difficile',
      description: 'Ton manager fait une remarque critique sur ton travail en réunion.',
      situation: 'Ton manager fait une remarque critique sur ton travail en réunion.',
      options: [
        {
          id: 'a',
          label: 'Tu prends ce retour comme un moyen pour toi de t\'améliorer.',
          skills: ['Apprentissage', 'Développement', 'Ouverture'],
        },
        {
          id: 'b',
          label: 'Tu le vis mal, tu préfères que ce type de retour se fasse avec plus de respect.',
          skills: ['Respect', 'Dignité', 'Communication'],
        },
      ],
    },
    {
      id: '26',
      title: 'Charge de travail',
      description: 'Ton équipe est en sous-effectif et tu travailles au-delà de ton temps habituel.',
      situation: 'Ton équipe est en sous-effectif et tu travailles au-delà de ton temps habituel.',
      options: [
        {
          id: 'a',
          label: 'Tu acceptes de travailler plus, c\'est temporaire et reconnu par ta hiérarchie.',
          skills: ['Flexibilité', 'Engagement', 'Collaboration'],
        },
        {
          id: 'b',
          label: 'Tu poses des limites claires pour protéger ta santé et ton temps libre.',
          skills: ['Limites', 'Santé', 'Équilibre'],
        },
      ],
    },
    {
      id: '27',
      title: 'Changement permanent',
      description: 'L\'entreprise change de stratégie tous les 6–8 mois.',
      situation: 'L\'entreprise change de stratégie tous les 6–8 mois.',
      options: [
        {
          id: 'a',
          label: 'Ça te pèse. Tu as besoin de stabilité pour être à l\'aise.',
          skills: ['Stabilité', 'Prévisibilité', 'Confort'],
        },
        {
          id: 'b',
          label: 'Ça te booste. Tu kiffs l\'imprévu et les nouveaux défis.',
          skills: ['Adaptabilité', 'Défi', 'Dynamisme'],
        },
      ],
    },
    {
      id: '28',
      title: 'Transparence',
      description: 'Tu reçois seulement les infos qui concernent ton poste. Le reste, tu ne le connais pas.',
      situation: 'Tu reçois seulement les infos qui concernent ton poste. Le reste, tu ne le connais pas.',
      options: [
        {
          id: 'a',
          label: 'Ça te va. Tu préfères te concentrer sur ton boulot sans te disperser.',
          skills: ['Focus', 'Simplicité', 'Concentration'],
        },
        {
          id: 'b',
          label: 'Ça te frustre. Tu veux comprendre la stratégie globale de l\'entreprise.',
          skills: ['Vision globale', 'Compréhension', 'Curiosité'],
        },
      ],
    },
    {
      id: '29',
      title: 'Équilibre des priorités',
      description: 'Ton/ta partenaire a une belle opportunité professionnelle. Mais ça demande que tu sois plus présent·e à la maison pendant quelques mois.',
      situation: 'Ton/ta partenaire a une belle opportunité professionnelle. Mais ça demande que tu sois plus présent·e à la maison pendant quelques mois.',
      options: [
        {
          id: 'a',
          label: 'Tu mets ta carrière en pause pour le/la soutenir. C\'est temporaire.',
          skills: ['Relations', 'Soutien', 'Équilibre'],
        },
        {
          id: 'b',
          label: 'Tu continues ton chemin pro. Chacun·e gère sa carrière de son côté.',
          skills: ['Indépendance', 'Carrière', 'Autonomie'],
        },
      ],
    },
  ];

  const instructions =
    'Glisse à droite (Oui) ou à gauche (Non) selon ta réaction, ou clique directement sur une option. Découvre tes valeurs professionnelles !';

  return (
    <SkillMatchGame
      game={game}
      onComplete={onComplete}
      scenarios={scenarios}
      instructions={instructions}
    />
  );
};

export default ValuesMatchGame;

