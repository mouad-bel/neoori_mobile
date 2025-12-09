import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import RankingGame from './RankingGame';

interface PrioritiesRankingGameProps extends BaseGameProps {}

const PrioritiesRankingGame: React.FC<PrioritiesRankingGameProps> = ({ game, onComplete }) => {
  const items = [
    {
      id: '1',
      label: 'Équilibre vie pro/perso',
      description: 'Avoir du temps pour ma vie personnelle',
    },
    {
      id: '2',
      label: 'Salaire élevé',
      description: 'Gagner un bon salaire',
    },
    {
      id: '3',
      label: 'Apprentissage continu',
      description: 'Apprendre de nouvelles choses régulièrement',
    },
    {
      id: '4',
      label: 'Impact social',
      description: 'Contribuer à quelque chose de significatif',
    },
    {
      id: '5',
      label: 'Autonomie',
      description: 'Avoir de la liberté dans mon travail',
    },
    {
      id: '6',
      label: 'Reconnaissance',
      description: 'Être reconnu pour mes contributions',
    },
  ];

  const instructions = 'Classe ces priorités du plus important au moins important pour toi dans ta carrière. Utilise les flèches pour réorganiser.';
  const question = 'Quelles sont tes priorités professionnelles ?';

  return (
    <RankingGame
      game={game}
      onComplete={onComplete}
      items={items}
      instructions={instructions}
      question={question}
    />
  );
};

export default PrioritiesRankingGame;

