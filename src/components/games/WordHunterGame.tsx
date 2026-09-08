import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WORD_HUNTER_LEVELS } from '../../data/gamesData';
import { UserProgress } from '../../types';
import { SoundButton } from '../SoundButton';
import { Sparkles, Trophy, RotateCcw, Check, X, ArrowLeft, Star } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface WordHunterGameProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToMenu: () => void;
}

export const WordHunterGame: React.FC<WordHunterGameProps> = ({
  progress,
  onUpdateProgress,
  onBackToMenu
}) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  const currentLevel = WORD_HUNTER_LEVELS[levelIndex] || WORD_HUNTER_LEVELS[0];
  const targetVerbs = currentLevel.words.filter(w => w.isVerb);
  const caughtVerbsCount = selectedWordIds.filter(id => {
    const word = currentLevel.words.find(w => w.id === id);
    return word?.isVerb;
  }).length;

  const handleWordClick = (word: { id: string; text: string; isVerb: boolean; typeLabel: string; emoji: string }) => {
    if (selectedWordIds.includes(word.id)) return;

    soundEffects.playPop();
    const newSelected = [...selectedWordIds, word.id];
    setSelectedWordIds(newSelected);

    if (word.isVerb) {
      soundEffects.playCorrect();
      const praise = `صَيْدٌ مُمْتَازٌ! (${word.text}) هُوَ ${word.typeLabel}`;
      setFeedback({ text: praise, isSuccess: true });
      ArabicSpeechEngine.speak(praise, progress.speechRate);
    } else {
      soundEffects.playWrong();
      const warning = `اِنْتَبِهْ! (${word.text}) هُوَ ${word.typeLabel} وَلَيْسَ فِعْلًا!`;
      setFeedback({ text: warning, isSuccess: false });
      ArabicSpeechEngine.speak(warning, progress.speechRate);
    }

    // Check if all verbs in this level are caught
    const allVerbsCaught = targetVerbs.every(v => newSelected.includes(v.id));
    if (allVerbsCaught) {
      setIsLevelFinished(true);
      soundEffects.playFanfare();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

      onUpdateProgress(prev => ({
        ...prev,
        stars: prev.stars + 20,
        gems: prev.gems + 1,
        gameScores: {
          ...prev.gameScores,
          hunter: (prev.gameScores.hunter || 0) + 1
        }
      }));
    }
  };

  const handleNextLevel = () => {
    soundEffects.playClick();
    if (levelIndex < WORD_HUNTER_LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setSelectedWordIds([]);
      setFeedback(null);
      setIsLevelFinished(false);
    } else {
      onBackToMenu();
    }
  };

  const handleResetLevel = () => {
    soundEffects.playClick();
    setSelectedWordIds([]);
    setFeedback(null);
    setIsLevelFinished(false);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-amber-300 shadow-md p-3 sm:p-5 flex-1 flex flex-col justify-between min-h-0 w-full max-w-[900px] mx-auto fit-screen-card">
      {/* Game Header */}
      <div className="flex flex-row items-center justify-between gap-2 pb-3 border-b-2 border-amber-100 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-950 text-xs sm:text-sm font-black px-3 py-1 rounded-full font-tajawal border border-amber-300 shadow-xs">
              لُعْبَةُ صَائِدِ الْأَفْعَالِ
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-800 text-xs sm:text-sm font-extrabold font-tajawal">
              الْمَرْحَلَةُ {levelIndex + 1} مِنْ {WORD_HUNTER_LEVELS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-950 font-baloo leading-tight tashkeel-text">
            {currentLevel.questionText}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onBackToMenu}
            type="button"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold font-tajawal flex items-center gap-1.5 cursor-pointer border border-slate-300 shadow-xs"
          >
            <ArrowLeft size={16} />
            <span className="hidden xs:inline">الْأَلْعَابُ</span>
          </button>
          <SoundButton
            textToSpeak={currentLevel.questionText}
            size="md"
            variant="amber"
            label="اِسْتَمِعْ"
            rate={progress.speechRate}
          />
        </div>
      </div>

      {/* Progress Bar for Current Level Verbs */}
      <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 flex items-center justify-between flex-shrink-0 my-2">
        <div className="flex items-center gap-2 font-bold font-tajawal text-amber-950 text-sm sm:text-base">
          <span>الْأَفْعَالُ الَّتِي صِدْتَهَا:</span>
          <span className="text-base sm:text-xl font-black text-amber-900 bg-white px-3 py-0.5 rounded-xl border border-amber-300 shadow-xs">
            {caughtVerbsCount} / {targetVerbs.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {targetVerbs.map((_, i) => (
            <Star
              key={i}
              size={22}
              className={`transition-transform ${
                i < caughtVerbsCount ? 'text-amber-500 fill-amber-400 scale-115' : 'text-slate-300 fill-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Word Bubbles / Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-2 flex-1 min-h-0">
        {currentLevel.words.map((word) => {
          const isSelected = selectedWordIds.includes(word.id);

          return (
            <motion.button
              key={word.id}
              id={`hunt-word-${word.id}`}
              onClick={() => handleWordClick(word)}
              whileHover={{ scale: isSelected ? 1 : 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              className={`relative p-4 sm:p-6 rounded-3xl border-3 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer select-none min-h-0 flex-shrink-1 fit-screen-card ${
                isSelected
                  ? word.isVerb
                    ? 'bg-emerald-100 border-emerald-500 shadow-md ring-4 ring-emerald-300'
                    : 'bg-rose-100 border-rose-400 opacity-75 ring-3 ring-rose-300'
                  : 'bg-gradient-to-b from-white to-amber-50/70 hover:to-amber-100/80 border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Status Badge */}
              {isSelected && (
                <span
                  className={`absolute top-2 right-2 rounded-full p-1 text-white text-xs ${
                    word.isVerb ? 'bg-emerald-500 shadow-xs' : 'bg-rose-500 shadow-xs'
                  }`}
                >
                  {word.isVerb ? <Check size={16} /> : <X size={16} />}
                </span>
              )}
              
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-baloo text-slate-900 tashkeel-text leading-tight">
                {word.text}
              </span>

              {isSelected && (
                <span className={`text-sm sm:text-base font-extrabold font-tajawal px-3 py-1 rounded-full shadow-xs ${
                  word.isVerb ? 'bg-emerald-200 text-emerald-950' : 'bg-rose-200 text-rose-950'
                }`}>
                  {word.typeLabel}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Live Feedback Notification */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-3 flex items-center justify-between gap-3 text-lg sm:text-xl font-tajawal font-black shadow-md ${
            feedback.isSuccess
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <span className="leading-relaxed tashkeel-text">{feedback.text}</span>
          <SoundButton textToSpeak={feedback.text} size="md" variant="ghost" rate={progress.speechRate} />
        </motion.div>
      )}

      {/* Level Complete Dialog / Actions */}
      {isLevelFinished && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-3 border-amber-400 p-6 rounded-3xl text-center space-y-4 shadow-xl"
        >
          <Trophy size={48} className="text-amber-500 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black font-baloo text-amber-950">
            أَحْسَنْتَ يَا صَائِدَ الْأَفْعَالِ الْبَطَلَ!
          </h3>
          <p className="text-base font-bold font-tajawal text-amber-900">
            لَقَدْ صِدْتَ جَمِيعَ الْأَفْعَالِ بِنَجَاحٍ وَرَبِحْتَ 20 نَجْمَةً وَجَوْهَرَةً سِحْرِيَّةً!
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            {levelIndex < WORD_HUNTER_LEVELS.length - 1 ? (
              <button
                onClick={handleNextLevel}
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-tajawal font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer btn-chunky"
              >
                الْمَرْحَلَةُ التَّالِيَةُ
              </button>
            ) : (
              <button
                onClick={onBackToMenu}
                type="button"
                className="bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer btn-chunky"
              >
                الْعَوْدَةُ لِقَائِمَةِ الْأَلْعَابِ
              </button>
            )}

            <button
              onClick={handleResetLevel}
              type="button"
              className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-tajawal font-bold px-4 py-3 rounded-2xl flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={18} />
              <span>إِعَادَةٌ</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
