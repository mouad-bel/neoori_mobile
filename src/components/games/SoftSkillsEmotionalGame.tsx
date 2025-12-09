import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface SoftSkillsEmotionalGameProps {
  game: Game;
  onComplete: () => void;
}

const SoftSkillsEmotionalGame: React.FC<SoftSkillsEmotionalGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
    // Section Soft Skills
    {
      id: 1,
      question: 'Dans une situation de conflit avec un collègue, comment réagis-tu ?',
      type: 'multiple-choice',
      options: [
        'Je cherche un compromis',
        'J\'évite le conflit',
        'Je défends fermement mon point de vue',
        'Je cherche à comprendre l\'autre',
        'Je propose une solution créative',
      ],
    },
    {
      id: 2,
      question: 'Comment gères-tu le stress et la pression ?',
      type: 'multiple-choice',
      options: [
        'Je reste calme et organisé',
        'Je priorise les tâches',
        'Je demande de l\'aide',
        'Je prends des pauses régulières',
        'Je transforme le stress en motivation',
      ],
    },
    {
      id: 3,
      question: 'Quand tu travailles en équipe, quel est ton rôle naturel ?',
      type: 'multiple-choice',
      options: [
        'Leader et coordinateur',
        'Médiateur et facilitateur',
        'Créatif et innovateur',
        'Organisateur et planificateur',
        'Supporter et motivateur',
      ],
    },
    {
      id: 4,
      question: 'Comment évalues-tu ta capacité à communiquer clairement ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'À améliorer', max: 'Excellente' },
    },
    {
      id: 5,
      question: 'Face à une critique, comment réagis-tu généralement ?',
      type: 'multiple-choice',
      options: [
        'Je l\'accepte et j\'apprends',
        'Je demande des précisions',
        'Je me remets en question',
        'Je défends ma position',
        'Je cherche à comprendre l\'intention',
      ],
    },
    {
      id: 6,
      question: 'Quelle est ta capacité à t\'adapter aux changements ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 7,
      question: 'Est-ce que tu es à l\'aise pour donner du feedback constructif ?',
      type: 'yes-no',
    },
    {
      id: 8,
      question: 'Comment gères-tu les échéances serrées ?',
      type: 'multiple-choice',
      options: [
        'Je planifie à l\'avance',
        'Je travaille sous pression',
        'Je négocie les délais',
        'Je demande de l\'aide',
        'Je priorise l\'essentiel',
      ],
    },
    // Section Intelligence Émotionnelle
    {
      id: 9,
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
      id: 10,
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
      id: 11,
      question: 'Comment évalues-tu ta capacité à comprendre les émotions des autres ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 12,
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
      id: 13,
      question: 'Est-ce que tu pratiques régulièrement l\'auto-réflexion ?',
      type: 'yes-no',
    },
    {
      id: 14,
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
      id: 15,
      question: 'Quelle est ta capacité à exprimer tes émotions de manière appropriée ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Faible', max: 'Excellente' },
    },
    {
      id: 16,
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
      id: 17,
      question: 'Est-ce que tu arrives à identifier les émotions non exprimées des autres ?',
      type: 'yes-no',
    },
    {
      id: 18,
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
      id: 19,
      question: 'Quelle est ta capacité à gérer tes propres émotions négatives ?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Difficile', max: 'Très facile' },
    },
    {
      id: 20,
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

export default SoftSkillsEmotionalGame;

