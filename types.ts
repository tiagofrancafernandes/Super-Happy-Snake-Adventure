
export type Language = 'en' | 'pt-BR';

export type FoodTypeSetting = 'fruits' | 'insects' | 'both';

export interface GameSettings {
  language: Language;
  teleportEnabled: boolean;
  soundEnabled: boolean;
  volume: number; // 0 to 5
  speed: number; // 1 to 5
  foodType: FoodTypeSetting;
  autoRestart: boolean;
  selfCollisionEnabled: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  PAUSED = 'PAUSED'
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Translations {
  title: string;
  score: string;
  highScore: string;
  settings: string;
  gameOver: string;
  restart: string;
  play: string;
  language: string;
  teleport: string;
  sound: string;
  volume: string;
  speed: string;
  foodTypes: string;
  autoRestart: string;
  selfCollision: string;
  fruits: string;
  insects: string;
  both: string;
  on: string;
  off: string;
  back: string;
}
