
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameState, 
  GameSettings, 
  Position, 
  Direction, 
  Language 
} from './types';
import { 
  GRID_SIZE, 
  INITIAL_SNAKE, 
  TRANSLATIONS, 
  SPEED_MAP, 
  FRUITS, 
  INSECTS 
} from './constants';
import { audioService } from './services/audioService';
import HUD from './components/HUD';
import GameCanvas from './components/GameCanvas';
import Settings from './components/Settings';

const DEFAULT_SETTINGS: GameSettings = {
  language: 'en',
  teleportEnabled: true,
  soundEnabled: true,
  volume: 3,
  speed: 3,
  foodType: 'both',
  autoRestart: true,
  selfCollisionEnabled: true,
};

const App: React.FC = () => {
  // Persistence
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('snake_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('snake_highscore');
    return saved ? parseInt(saved) : 0;
  });

  // Game Core State
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDirection, setNextDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [foodEmoji, setFoodEmoji] = useState<string>('🍎');
  const [score, setScore] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> to avoid 'Cannot find namespace NodeJS' error in browser environments.
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = TRANSLATIONS[settings.language];

  // Logic: Spawn Food
  const getRandomPosition = useCallback((currentSnake: Position[]): Position => {
    let newPos: Position;
    let isOccupied: boolean;
    do {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(part => part.x === newPos.x && part.y === newPos.y);
    } while (isOccupied);
    return newPos;
  }, []);

  const getRandomFoodEmoji = useCallback((): string => {
    let pool: string[] = [];
    if (settings.foodType === 'fruits') pool = FRUITS;
    else if (settings.foodType === 'insects') pool = INSECTS;
    else pool = [...FRUITS, ...INSECTS];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [settings.foodType]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection('UP');
    setNextDirection('UP');
    setScore(0);
    const newFood = getRandomPosition(INITIAL_SNAKE);
    setFood(newFood);
    setFoodEmoji(getRandomFoodEmoji());
    setGameState(GameState.PLAYING);
  }, [getRandomPosition, getRandomFoodEmoji]);

  const handleGameOver = useCallback(() => {
    if (settings.soundEnabled) {
      audioService.playGameOver(settings.volume);
    }
    setGameState(GameState.GAME_OVER);
    if (settings.autoRestart) {
      setTimeout(() => {
        resetGame();
      }, 2000);
    }
  }, [settings.soundEnabled, settings.volume, settings.autoRestart, resetGame]);

  const updateHighScore = useCallback((currentScore: number) => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('snake_highscore', currentScore.toString());
    }
  }, [highScore]);

  // Main Logic Step
  const moveSnake = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };
      const currentDir = nextDirection;
      setDirection(currentDir);

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision logic
      if (settings.teleportEnabled) {
        newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
        newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
      } else {
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }
      }

      // Self collision logic
      const selfHitIndex = prevSnake.findIndex(part => part.x === newHead.x && part.y === newHead.y);
      if (selfHitIndex !== -1) {
        if (settings.selfCollisionEnabled) {
          handleGameOver();
          return prevSnake;
        } else {
          // Shrink logic: cut from collision point onwards
          const newBody = [newHead, ...prevSnake.slice(0, selfHitIndex)];
          const pointsLost = prevSnake.length - newBody.length;
          setScore(s => Math.max(0, s - pointsLost));
          return newBody;
        }
      }

      const newSnake = [newHead, ...prevSnake];

      // Food logic
      if (newHead.x === food.x && newHead.y === food.y) {
        if (settings.soundEnabled) {
          audioService.playEat(settings.volume);
        }
        const nextScore = score + 1;
        setScore(nextScore);
        updateHighScore(nextScore);
        setFood(getRandomPosition(newSnake));
        setFoodEmoji(getRandomFoodEmoji());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [
    gameState, 
    nextDirection, 
    settings.teleportEnabled, 
    settings.selfCollisionEnabled, 
    settings.soundEnabled, 
    settings.volume, 
    food, 
    score, 
    getRandomPosition, 
    getRandomFoodEmoji, 
    handleGameOver, 
    updateHighScore
  ]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
        case ' ': // Space for pause/resume
          setGameState(prev => {
            if (prev === GameState.PLAYING) return GameState.PAUSED;
            if (prev === GameState.PAUSED) return GameState.PLAYING;
            return prev;
          });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Game Loop
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      gameLoopRef.current = setInterval(moveSnake, SPEED_MAP[settings.speed as keyof typeof SPEED_MAP]);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, moveSnake, settings.speed]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('snake_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center select-none overflow-hidden p-4">
      {/* Background Decor */}
      <div className="fixed top-[-5%] left-[-5%] w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 z-[-1]" />
      <div className="fixed bottom-[-5%] right-[-5%] w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 z-[-1]" />
      
      <h1 className="text-5xl md:text-6xl font-fredoka text-green-500 mb-2 tracking-tight drop-shadow-[0_4px_0_white]">
        {t.title}
      </h1>

      <HUD 
        score={score} 
        highScore={highScore} 
        t={t} 
        onOpenSettings={() => setShowSettings(true)} 
      />

      <div className="relative">
        <GameCanvas 
          snake={snake} 
          food={food} 
          foodEmoji={foodEmoji}
          settings={settings}
          gameState={gameState}
          onGameOver={handleGameOver}
        />

        {/* Start / Game Over Overlays */}
        {(gameState === GameState.START || (gameState === GameState.GAME_OVER && !settings.autoRestart)) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl p-8">
            {gameState === GameState.GAME_OVER && (
              <>
                <h2 className="text-4xl font-fredoka text-red-500 mb-2">{t.gameOver}</h2>
                <p className="text-xl font-bold text-gray-600 mb-8">{t.score}: {score}</p>
              </>
            )}
            
            <button
              onClick={resetGame}
              className="px-12 py-5 bg-green-500 text-white rounded-full font-fredoka text-3xl shadow-[0_10px_0_rgb(21,128,61)] hover:translate-y-[2px] hover:shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-[4px] active:shadow-none transition-all"
            >
              {gameState === GameState.START ? t.play : t.restart}
            </button>
          </div>
        )}

        {/* Temporary Notification for Auto-restart */}
        {gameState === GameState.GAME_OVER && settings.autoRestart && (
           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl p-8">
              <h2 className="text-5xl font-fredoka text-red-500 animate-bounce">{t.gameOver}</h2>
           </div>
        )}
      </div>

      {/* Control Help (Mobile hints could go here, but prompt asked for keyboard) */}
      <div className="mt-8 flex gap-4">
        <div className="flex flex-col items-center p-3 bg-white rounded-2xl border-2 border-gray-100 opacity-60">
            <span className="text-sm font-bold text-gray-400">⌨️ Arrows</span>
            <span className="text-xs text-gray-400">to move</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-2xl border-2 border-gray-100 opacity-60">
            <span className="text-sm font-bold text-gray-400">⌨️ Space</span>
            <span className="text-xs text-gray-400">to pause</span>
        </div>
      </div>

      {showSettings && (
        <Settings 
          settings={settings} 
          t={t} 
          onUpdate={updateSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
};

export default App;