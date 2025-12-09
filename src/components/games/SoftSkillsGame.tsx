import React from 'react';
import { Game, GameQuestion } from '../../types';
import BaseGameComponent from './BaseGameComponent';

interface SoftSkillsGameProps {
  game: Game;
  onComplete: () => void;
}

const SoftSkillsGame: React.FC<SoftSkillsGameProps> = ({ game, onComplete }) => {
  const questions: GameQuestion[] = [
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
  ];

  return <BaseGameComponent game={game} questions={questions} onComplete={onComplete} />;
};

export default SoftSkillsGame;

