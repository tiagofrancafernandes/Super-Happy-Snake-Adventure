
import { Translations, Language } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const FRUITS = ['🍎', '🍌', '🍓', '🍇', '🍒', '🍉', '🍍', '🍑'];
export const INSECTS = ['🐝', '🐞', '🦋', '🐛', '🦗', '🐜'];

export const TRANSLATIONS: Record<Language, Translations> = {
  'en': {
    title: 'Happy Snake!',
    score: 'Score',
    highScore: 'Best',
    settings: 'Settings',
    gameOver: 'Game Over!',
    restart: 'Try Again',
    play: 'Play!',
    language: 'Language',
    teleport: 'Wall Teleport',
    sound: 'Sound Effects',
    volume: 'Volume',
    speed: 'Snake Speed',
    foodTypes: 'Yummy Snacks',
    autoRestart: 'Auto Restart',
    selfCollision: 'Wall of Tummy',
    fruits: 'Fruits',
    insects: 'Happy Bugs',
    both: 'Both',
    on: 'ON',
    off: 'OFF',
    back: 'Done'
  },
  'pt-BR': {
    title: 'Cobrinha Feliz!',
    score: 'Pontos',
    highScore: 'Recorde',
    settings: 'Opções',
    gameOver: 'Fim de Jogo!',
    restart: 'Tentar de Novo',
    play: 'Jogar!',
    language: 'Idioma',
    teleport: 'Atravessar Paredes',
    sound: 'Efeitos de Som',
    volume: 'Volume',
    speed: 'Velocidade',
    foodTypes: 'Comidinhas',
    autoRestart: 'Auto Reiniciar',
    selfCollision: 'Bater no Corpo',
    fruits: 'Frutas',
    insects: 'Insetos',
    both: 'Ambos',
    on: 'LIGADO',
    off: 'DESLIGADO',
    back: 'Pronto'
  }
};

export const SPEED_MAP = {
  1: 250,
  2: 200,
  3: 150,
  4: 100,
  5: 60
};
