
import React from 'react';
import { GameSettings, Translations, FoodTypeSetting, Language } from '../types';

interface SettingsProps {
  settings: GameSettings;
  t: Translations;
  onUpdate: (updates: Partial<GameSettings>) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, t, onUpdate, onClose }) => {
  const ToggleButton = ({ label, value, field }: { label: string, value: boolean, field: keyof GameSettings }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border-2 border-orange-100">
      <span className="text-lg font-bold text-gray-700">{label}</span>
      <button
        onClick={() => onUpdate({ [field]: !value })}
        className={`px-6 py-2 rounded-full font-fredoka transition-all ${
          value ? 'bg-green-400 text-white shadow-[0_4px_0_rgb(34,197,94)]' : 'bg-gray-200 text-gray-500'
        }`}
      >
        {value ? t.on : t.off}
      </button>
    </div>
  );

  const RangeInput = ({ label, value, field, min, max }: { label: string, value: number, field: keyof GameSettings, min: number, max: number }) => (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-2xl shadow-sm border-2 border-orange-100">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-700">{label}</span>
        <span className="text-2xl font-fredoka text-orange-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onUpdate({ [field]: parseInt(e.target.value) })}
        className="w-full h-3 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-orange-50 z-50 overflow-y-auto p-6 flex flex-col items-center">
      <h2 className="text-4xl font-fredoka text-orange-500 mb-8 drop-shadow-sm">{t.settings}</h2>
      
      <div className="w-full max-w-md space-y-4 mb-8">
        {/* Language Selection */}
        <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border-2 border-orange-100">
          <span className="text-lg font-bold text-gray-700">{t.language}</span>
          <div className="flex gap-2">
            {(['en', 'pt-BR'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => onUpdate({ language: lang })}
                className={`px-3 py-1 rounded-lg font-bold ${settings.language === lang ? 'bg-blue-400 text-white shadow-[0_3px_0_rgb(59,130,246)]' : 'bg-gray-100 text-gray-400'}`}
              >
                {lang === 'en' ? '🇺🇸' : '🇧🇷'}
              </button>
            ))}
          </div>
        </div>

        <ToggleButton label={t.teleport} value={settings.teleportEnabled} field="teleportEnabled" />
        <ToggleButton label={t.sound} value={settings.soundEnabled} field="soundEnabled" />
        <RangeInput label={t.volume} value={settings.volume} field="volume" min={0} max={5} />
        <RangeInput label={t.speed} value={settings.speed} field="speed" min={1} max={5} />
        
        {/* Food Types */}
        <div className="flex flex-col gap-2 p-3 bg-white rounded-2xl shadow-sm border-2 border-orange-100">
          <span className="text-lg font-bold text-gray-700">{t.foodTypes}</span>
          <div className="flex gap-2">
            {(['fruits', 'insects', 'both'] as FoodTypeSetting[]).map(type => (
              <button
                key={type}
                onClick={() => onUpdate({ foodType: type })}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                  settings.foodType === type 
                  ? 'bg-yellow-400 text-white shadow-[0_4px_0_rgb(234,179,8)] translate-y-[-2px]' 
                  : 'bg-gray-100 text-gray-400'
                }`}
              >
                {t[type]}
              </button>
            ))}
          </div>
        </div>

        <ToggleButton label={t.autoRestart} value={settings.autoRestart} field="autoRestart" />
        <ToggleButton label={t.selfCollision} value={settings.selfCollisionEnabled} field="selfCollisionEnabled" />
      </div>

      <button
        onClick={onClose}
        className="px-12 py-4 bg-orange-500 text-white rounded-full font-fredoka text-2xl shadow-[0_8px_0_rgb(194,65,12)] hover:translate-y-[2px] hover:shadow-[0_6px_0_rgb(194,65,12)] active:translate-y-[4px] active:shadow-none transition-all"
      >
        {t.back}
      </button>
    </div>
  );
};

export default Settings;
