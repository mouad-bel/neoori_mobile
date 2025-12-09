import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import ValuesSelectionGame from './ValuesSelectionGame';

interface CareerValuesGameProps extends BaseGameProps {}

const CareerValuesGame: React.FC<CareerValuesGameProps> = ({ game, onComplete }) => {
  const values = [
    {
      id: '1',
      label: 'Autonomie',
      description: 'Avoir la liberté de prendre mes propres décisions',
      icon: 'rocket',
    },
    {
      id: '2',
      label: 'Équilibre vie pro/perso',
      description: 'Avoir du temps pour ma vie personnelle',
      icon: 'balance-scale',
    },
    {
      id: '3',
      label: 'Impact social',
      description: 'Contribuer positivement à la société',
      icon: 'heart',
    },
    {
      id: '4',
      label: 'Croissance',
      description: 'Apprendre et évoluer continuellement',
      icon: 'trending-up',
    },
    {
      id: '5',
      label: 'Sécurité',
      description: 'Avoir un emploi stable et sécurisé',
      icon: 'shield-checkmark',
    },
    {
      id: '6',
      label: 'Reconnaissance',
      description: 'Être valorisé pour mes contributions',
      icon: 'trophy',
    },
    {
      id: '7',
      label: 'Créativité',
      description: 'Exprimer ma créativité dans mon travail',
      icon: 'color-palette',
    },
    {
      id: '8',
      label: 'Collaboration',
      description: 'Travailler en équipe et créer des liens',
      icon: 'people',
    },
    {
      id: '9',
      label: 'Défi',
      description: 'Relever des défis stimulants',
      icon: 'flame',
    },
    {
      id: '10',
      label: 'Leadership',
      description: 'Guider et influencer les autres',
      icon: 'star',
    },
    {
      id: '11',
      label: 'Innovation',
      description: 'Travailler sur des projets innovants',
      icon: 'bulb',
    },
    {
      id: '12',
      label: 'Flexibilité',
      description: 'Avoir des horaires et conditions flexibles',
      icon: 'time',
    },
  ];

  const question = 'Quelles sont tes valeurs professionnelles les plus importantes ?';
  const instructions = 'Sélectionne entre 3 et 5 valeurs qui te correspondent le mieux.';

  return (
    <ValuesSelectionGame
      game={game}
      onComplete={onComplete}
      values={values}
      question={question}
      instructions={instructions}
      minSelection={3}
      maxSelection={5}
    />
  );
};

export default CareerValuesGame;


