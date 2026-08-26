import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ArabicSpeechEngine, soundEffects } from '../utils/audio';

interface SoundButtonProps {
  textToSpeak: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber' | 'emerald';
  label?: string;
  className?: string;
  rate?: number;
}

export const SoundButton: React.FC<SoundButtonProps> = ({
  textToSpeak,
  size = 'md',
  variant = 'primary',
  label,
  className = '',
  rate = 0.82
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playClick();

    if (isSpeaking) {
      ArabicSpeechEngine.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    ArabicSpeechEngine.speak(textToSpeak, rate, () => {
      setIsSpeaking(false);
    });
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs gap-1',
    md: 'p-2.5 text-sm gap-1.5',
    lg: 'px-4 py-2.5 text-base gap-2',
    xl: 'px-5 py-3.5 text-lg gap-2.5'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  const variantClasses = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md active:bg-amber-700',
    secondary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-md active:bg-sky-700',
    amber: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300',
    emerald: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md',
    ghost: 'bg-transparent hover:bg-black/5 text-slate-700'
  };

  return (
    <button
      id={`sound-btn-${textToSpeak.slice(0, 10).replace(/\s+/g, '-')}`}
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-200 cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${
        isSpeaking ? 'ring-4 ring-amber-300 animate-pulse scale-105' : 'hover:scale-105 active:scale-95'
      } ${className}`}
      title="اِسْتَمِعْ إِلَى النُّطْقِ الصَّوْتِيِّ"
      aria-label="نطق الكلمة"
    >
      {isSpeaking ? (
        <Volume2 size={iconSizes[size]} className="text-current animate-bounce" />
      ) : (
        <Volume2 size={iconSizes[size]} className="text-current" />
      )}
      {label && <span className="font-tajawal font-bold">{label}</span>}
    </button>
  );
};
