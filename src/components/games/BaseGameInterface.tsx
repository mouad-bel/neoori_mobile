import React from 'react';
import { Game, GameProgress } from '../../types';

export interface BaseGameProps {
  game: Game;
  onComplete: () => void;
  onProgressUpdate?: (progress: GameProgress) => void;
}

export interface BaseGameComponent extends React.FC<BaseGameProps> {}

