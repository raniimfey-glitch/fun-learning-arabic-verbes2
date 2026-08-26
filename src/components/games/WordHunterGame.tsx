import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WORD_HUNTER_LEVELS } from '../../data/gamesData';
import { UserProgress } from '../../types';
import { SoundButton } from '../SoundButton';
import { Sparkles, Trophy, RotateCcw, Check, X, ArrowLeft } from 'lucide-react';
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
    <div className="bg-white rounded-3xl border-3 border-amber-300 shadow-lg p-4 sm:p-7 space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-amber-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full font-tajawal">
              لُعْبَةُ صَائِدِ الْأَفْعَالِ 🎯
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-700 text-xs font-bold font-tajawal">
              الْمَرْحَلَةُ {levelIndex + 1} مِنْ {WORD_HUNTER_LEVELS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-baloo leading-tight tashkeel-text">
            {currentLevel.questionText}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMenu}
            type="button"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold font-tajawal flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>الْأَلْعَابُ</span>
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
      <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold font-tajawal text-amber-900 text-sm">
          <span>🎯 الْأَفْعَالُ الَّتِي صِدْتَهَا:</span>
          <span className="text-base font-black text-amber-700 bg-white px-2 py-0.5 rounded-lg border border-amber-300">
            {caughtVerbsCount} / {targetVerbs.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {targetVerbs.map((_, i) => (
            <span
              key={i}
              className={`text-xl transition-transform ${
                i < caughtVerbsCount ? 'scale-125 animate-twinkle' : 'opacity-30'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Floating Word Bubbles / Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-2">
        {currentLevel.words.map((word, idx) => {
          const isSelected = selectedWordIds.includes(word.id);

          return (
            <motion.button
              key={word.id}
              id={`hunt-word-${word.id}`}
              onClick={() => handleWordClick(word)}
              whileHover={{ scale: isSelected ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className={`relative p-4 sm:p-6 rounded-3xl border-3 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer select-none min-h-[130px] sm:min-h-[150px] ${
                isSelected
                  ? word.isVerb
                    ? 'bg-emerald-100 border-emerald-500 shadow-md ring-4 ring-emerald-200'
                    : 'bg-rose-100 border-rose-400 opacity-70 ring-2 ring-rose-200'
                  : 'bg-gradient-to-b from-white to-amber-50/50 hover:to-amber-100/60 border-amber-200 hover:border-amber-400 shadow-md'
              }`}
            >
              {/* Status Badge */}
              {isSelected && (
                <span
                  className={`absolute top-2 right-2 rounded-full p-1 text-white text-xs ${
                    word.isVerb ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                >
                  {word.isVerb ? <Check size={14} /> : <X size={14} />}
                </span>
              )}

              <span className="text-3xl sm:text-4xl">{word.emoji}</span>
              
              <span className="text-xl sm:text-2xl font-black font-baloo text-slate-800 tashkeel-text">
                {word.text}
              </span>

              {isSelected && (
                <span className={`text-xs font-bold font-tajawal px-2 py-0.5 rounded-full ${
                  word.isVerb ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
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
          className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 text-base font-tajawal font-bold ${
            feedback.isSuccess
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <span>{feedback.text}</span>
          <SoundButton textToSpeak={feedback.text} size="sm" variant="ghost" rate={progress.speechRate} />
        </motion.div>
      )}

      {/* Level Complete Dialog / Actions */}
      {isLevelFinished && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-3 border-amber-400 p-6 rounded-3xl text-center space-y-4 shadow-xl"
        >
          <div className="text-5xl animate-bounce">🏆</div>
          <h3 className="text-2xl font-black font-baloo text-amber-950">
            أَحْسَنْتَ يَا صَائِدَ الْأَفْعَالِ الْبَطَلَ!
          </h3>
          <p className="text-base font-bold font-tajawal text-amber-900">
            لَقَدْ صِدْتَ جَمِيعَ الْأَفْعَالِ بِنَجَاحٍ وَرَبِحْتَ 20 نَجْمَةً وَجَوْهَرَةً سِحْرِيَّةً! ✨
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            {levelIndex < WORD_HUNTER_LEVELS.length - 1 ? (
              <button
                onClick={handleNextLevel}
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-tajawal font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer btn-chunky"
              >
                الْمَرْحَلَةُ التَّالِيَةُ 🚀
              </button>
            ) : (
              <button
                onClick={onBackToMenu}
                type="button"
                className="bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer btn-chunky"
              >
                الْعَوْدَةُ لِقَائِمَةِ الْأَلْعَابِ 🎮
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
