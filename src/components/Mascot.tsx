import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, Smile } from 'lucide-react';
import { ArabicSpeechEngine, soundEffects } from '../utils/audio';

interface MascotProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'teaching';
  audioText?: string;
  compact?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  message = 'مَرْحَبًا يَا بَطَلُ! أَنَا صَدِيقُكَ «فَلْفُول»، هَيَّا نَسْتَكْشِفْ سِحْرَ الْأَفْعَالِ مَعًا!',
  mood = 'happy',
  audioText,
  compact = false
}) => {
  const textToSpeak = audioText || message;

  const handleSpeak = () => {
    soundEffects.playClick();
    ArabicSpeechEngine.speak(textToSpeak);
  };

  const getEmoji = () => {
    switch (mood) {
      case 'celebrating':
        return '🥳';
      case 'thinking':
        return '🤔';
      case 'teaching':
        return '👨‍🏫';
      case 'happy':
      default:
        return '🦊';
    }
  };

  if (compact) {
    return (
      <div 
        id="mascot-compact"
        onClick={handleSpeak}
        className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-all group"
      >
        <motion.div
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-3xl bg-white p-2 rounded-xl shadow-inner border border-amber-200"
        >
          {getEmoji()}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-1 text-xs text-amber-800 font-bold">
            <span>صَدِيقُكَ فَلْفُول</span>
            <Volume2 size={14} className="group-hover:animate-bounce" />
          </div>
          <p className="text-sm font-tajawal font-bold text-slate-800 line-clamp-2">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      id="mascot-full-banner"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-l from-amber-100 via-orange-50 to-amber-100 border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-md overflow-hidden"
    >
      {/* Decorative stars */}
      <div className="absolute top-2 left-4 text-amber-300 text-xl animate-twinkle pointer-events-none">✨</div>
      <div className="absolute bottom-2 right-4 text-amber-300 text-lg animate-twinkle pointer-events-none">⭐</div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Animated Avatar */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: mood === 'celebrating' ? [0, -10, 10, 0] : [0, -3, 3, 0]
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative flex-shrink-0"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1.5 shadow-lg border-2 border-white flex items-center justify-center">
            <span className="text-5xl sm:text-6xl drop-shadow-sm select-none">{getEmoji()}</span>
          </div>
          <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm border border-white">
            فَلْفُول
          </span>
        </motion.div>

        {/* Speech Bubble */}
        <div className="flex-1 text-center sm:text-right">
          <div className="inline-flex items-center gap-1.5 bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full text-xs font-black mb-2">
            <Sparkles size={14} className="text-amber-700" />
            <span>نَصِيحَةُ الْبَطَلِ فَلْفُول</span>
          </div>
          <p className="text-slate-800 text-base sm:text-lg font-bold leading-relaxed tashkeel-text font-baloo">
            {message}
          </p>
        </div>

        {/* Listen Button */}
        <button
          id="mascot-speak-btn"
          onClick={handleSpeak}
          type="button"
          className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky"
        >
          <Volume2 size={20} className="animate-pulse" />
          <span>اِسْتَمِعْ لِفَلْفُول</span>
        </button>
      </div>
    </motion.div>
  );
};
