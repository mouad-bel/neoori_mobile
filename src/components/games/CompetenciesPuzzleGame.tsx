import React from 'react';
import { Game } from '../../types';
import { BaseGameProps } from './BaseGameInterface';
import SkillsPuzzleGame from './SkillsPuzzleGame';

interface CompetenciesPuzzleGameProps extends BaseGameProps {}

const CompetenciesPuzzleGame: React.FC<CompetenciesPuzzleGameProps> = ({ game, onComplete }) => {
  const pieces = [
    { id: '1', label: 'React', category: 'Technique', correctPosition: 0 },
    { id: '2', label: 'Python', category: 'Technique', correctPosition: 1 },
    { id: '3', label: 'SQL', category: 'Technique', correctPosition: 2 },
    { id: '4', label: 'Leadership', category: 'Soft Skills', correctPosition: 0 },
    { id: '5', label: 'Communication', category: 'Soft Skills', correctPosition: 1 },
    { id: '6', label: 'Empathie', category: 'Soft Skills', correctPosition: 2 },
    { id: '7', label: 'Agile', category: 'Méthodologie', correctPosition: 0 },
    { id: '8', label: 'Design Thinking', category: 'Méthodologie', correctPosition: 1 },
    { id: '9', label: 'Scrum', category: 'Méthodologie', correctPosition: 2 },
  ];

  const categories = ['Technique', 'Soft Skills', 'Méthodologie'];

  const instructions = 'Sélectionne des compétences et classe-les dans les bonnes catégories. Clique sur plusieurs compétences puis sur une catégorie pour les ajouter.';

  return (
    <SkillsPuzzleGame
      game={game}
      onComplete={onComplete}
      pieces={pieces}
      categories={categories}
      instructions={instructions}
    />
  );
};

export default CompetenciesPuzzleGame;


