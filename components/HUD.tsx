
import React from 'react';
import { Translations } from '../types';

interface HUDProps {
  score: number;
  highScore: number;
  t: Translations;
  onOpenSettings: () => void;
}

const HUD: React.FC<HUDProps> = ({ score, highScore, t, onOpenSettings }) => {
  return (
    <div className="w-full max-w-lg flex items-center justify-between p-4 mb-4">
      <div className="flex flex-col">
        <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">{t.score}</span>
        <span className="text-4xl font-fredoka text-blue-500 drop-shadow-sm">{score}</span>
      </div>

      <button
        onClick={onOpenSettings}
        className="w-16 h-16 bg-white rounded-2xl shadow-[0_6px_0_#e2e8f0] flex items-center justify-center text-3xl hover:translate-y-[2px] hover:shadow-[0_4px_0_#e2e8f0] active:translate-y-[4px] active:shadow-none transition-all"
      >
        ⚙️
      </button>

      <div className="flex flex-col items-end">
        <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">{t.highScore}</span>
        <span className="text-4xl font-fredoka text-purple-500 drop-shadow-sm">{highScore}</span>
      </div>
    </div>
  );
};

export default HUD;
