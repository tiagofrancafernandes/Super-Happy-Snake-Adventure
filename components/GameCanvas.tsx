
import React, { useRef, useEffect } from 'react';
import { Position, GameSettings, GameState, Direction } from '../types';
import { GRID_SIZE } from '../constants';

interface GameCanvasProps {
  snake: Position[];
  food: Position;
  foodEmoji: string;
  settings: GameSettings;
  gameState: GameState;
  onGameOver: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ snake, food, foodEmoji, settings, gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(window.innerWidth - 40, 500);
    const cellSize = size / GRID_SIZE;
    
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw grid background
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(0, 0, size, size);
    
    ctx.strokeStyle = '#dcfce7';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((part, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#4ade80' : '#86efac';
      
      const padding = 2;
      const x = part.x * cellSize + padding;
      const y = part.y * cellSize + padding;
      const rSize = cellSize - padding * 2;
      
      // Draw rounded segment
      ctx.beginPath();
      ctx.roundRect(x, y, rSize, rSize, isHead ? 10 : 6);
      ctx.fill();

      // If head, draw eyes
      if (isHead) {
        ctx.fillStyle = 'white';
        // Left eye
        ctx.beginPath();
        ctx.arc(x + rSize * 0.3, y + rSize * 0.3, rSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.arc(x + rSize * 0.7, y + rSize * 0.3, rSize * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x + rSize * 0.3, y + rSize * 0.3, rSize * 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + rSize * 0.7, y + rSize * 0.3, rSize * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw food
    ctx.font = `${cellSize * 0.8}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      foodEmoji, 
      food.x * cellSize + cellSize / 2, 
      food.y * cellSize + cellSize / 2
    );

  }, [snake, food, foodEmoji, gameState]);

  return (
    <div className="relative shadow-2xl rounded-3xl overflow-hidden border-8 border-white bg-white">
      <canvas 
        ref={canvasRef} 
        className="block"
        style={{ touchAction: 'none' }}
      />
      {gameState === GameState.PAUSED && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
           <div className="bg-white p-6 rounded-3xl shadow-xl font-fredoka text-2xl text-orange-500">PAUSED</div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
