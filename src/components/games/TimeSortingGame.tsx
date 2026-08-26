import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { TIME_SORTING_ITEMS } from '../../data/gamesData';
import { UserProgress } from '../../types';
import { SoundButton } from '../SoundButton';
import { Clock, History, Megaphone, RotateCcw, ArrowLeft, Check, X, Sparkles, Volume2 } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface TimeSortingGameProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToMenu: () => void;
}

export const TimeSortingGame: React.FC<TimeSortingGameProps> = ({
  progress,
  onUpdateProgress,
  onBackToMenu
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedTense, setSelectedTense] = useState<string | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentItem = TIME_SORTING_ITEMS[currentIndex];

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      ArabicSpeechEngine.stop();
    };
  }, []);

  const goToNextItem = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    ArabicSpeechEngine.stop();
    soundEffects.playClick();
    setSelectedTense(null);
    setFeedback(null);

    if (currentIndex + 1 < TIME_SORTING_ITEMS.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsGameOver(true);
      soundEffects.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      onUpdateProgress(prev => ({
        ...prev,
        stars: prev.stars + 25,
        gems: prev.gems + 1,
        gameScores: {
          ...prev.gameScores,
          sorter: (prev.gameScores.sorter || 0) + 1
        }
      }));
    }
  };

  const handleChooseTense = (tense: 'past' | 'present' | 'imperative') => {
    if (selectedTense || isGameOver) return;

    setSelectedTense(tense);
    const isCorrect = tense === currentItem.tense;

    let msg = '';
    if (isCorrect) {
      soundEffects.playCorrect();
      setScore(prev => prev + 1);
      msg = `صَحِيحٌ يَا بَطَلُ! (${currentItem.word}) هُوَ فِعْلٌ ${
        tense === 'past' ? 'مَاضٍ ⏳' : tense === 'present' ? 'مُضَارِعٌ ⏰' : 'أَمْرٌ 📢'
      }. ${currentItem.hint}`;
      setFeedback({ text: msg, isCorrect: true });
    } else {
      soundEffects.playWrong();
      msg = `حَاوِلْ مَرَّةً أُخْرَى! (${currentItem.word}) هُوَ فِعْلٌ ${
        currentItem.tense === 'past' ? 'مَاضٍ' : currentItem.tense === 'present' ? 'مُضَارِعٌ' : 'أَمْرٌ'
      }. ${currentItem.hint}`;
      setFeedback({ text: msg, isCorrect: false });
    }

    ArabicSpeechEngine.speak(msg, progress.speechRate, () => {
      autoAdvanceTimerRef.current = setTimeout(() => {
        goToNextItem();
      }, 1800);
    });
  };

  const handleRestart = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    ArabicSpeechEngine.stop();
    soundEffects.playClick();
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setIsGameOver(false);
    setSelectedTense(null);
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-teal-300 shadow-lg p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-teal-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-100 text-teal-900 text-xs font-black px-3 py-1 rounded-full font-tajawal">
              لُعْبَةُ صُنْدُوقِ الْأَزْمِنَةِ ⏳
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-700 text-xs font-bold font-tajawal">
              الْكَلِمَةُ {currentIndex + 1} مِنْ {TIME_SORTING_ITEMS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-teal-950 font-baloo leading-tight tashkeel-text">
            ضَعِ الْفِعْلَ فِي صُنْدُوقِ الزَّمَنِ الْمُنَاسِبِ لَهُ:
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
              ArabicSpeechEngine.stop();
              onBackToMenu();
            }}
            type="button"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold font-tajawal flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>الْأَلْعَابُ</span>
          </button>
          <SoundButton
            textToSpeak={`ضَعِ الْفِعْلَ: ${currentItem?.word || ''} فِي صُنْدُوقِهِ الصَّحِيحِ.`}
            size="md"
            variant="emerald"
            label="اِسْتَمِعْ"
            rate={progress.speechRate}
          />
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Active Verb Presentation Card */}
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-gradient-to-tr from-amber-100 via-orange-50 to-yellow-100 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-center shadow-md max-w-md mx-auto relative overflow-hidden"
          >
            <span className="text-5xl sm:text-6xl mb-2 block">{currentItem.emoji}</span>
            <h3 className="text-3xl sm:text-4xl font-black font-baloo text-amber-950 tashkeel-text mb-2">
              {currentItem.word}
            </h3>
            <p className="text-sm font-bold font-tajawal text-slate-600">
              💡 تَلْمِيحٌ: {currentItem.hint}
            </p>
            <div className="mt-3 flex justify-center">
              <SoundButton textToSpeak={currentItem.word} size="sm" variant="amber" rate={progress.speechRate} />
            </div>
          </motion.div>

          {/* 3 Sorting Boxes (Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
            {/* Past Box */}
            <motion.button
              id="sort-box-past"
              whileHover={{ scale: selectedTense ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChooseTense('past')}
              type="button"
              disabled={selectedTense !== null}
              className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                selectedTense === 'past'
                  ? currentItem.tense === 'past'
                    ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300'
                    : 'bg-rose-100 border-rose-400'
                  : 'bg-gradient-to-b from-teal-50 to-teal-100/70 border-teal-300 hover:border-teal-500 shadow-md'
              }`}
            >
              <History size={36} className="text-teal-600" />
              <h4 className="text-xl font-black font-baloo text-teal-950">
                الْفِعْلُ الْمَاضِي
              </h4>
              <span className="text-xs font-bold font-tajawal text-teal-800 bg-teal-200/80 px-2.5 py-0.5 rounded-full">
                ⏳ حَدَثَ وَانْتَهَى
              </span>
            </motion.button>

            {/* Present Box */}
            <motion.button
              id="sort-box-present"
              whileHover={{ scale: selectedTense ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChooseTense('present')}
              type="button"
              disabled={selectedTense !== null}
              className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                selectedTense === 'present'
                  ? currentItem.tense === 'present'
                    ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300'
                    : 'bg-rose-100 border-rose-400'
                  : 'bg-gradient-to-b from-sky-50 to-sky-100/70 border-sky-300 hover:border-sky-500 shadow-md'
              }`}
            >
              <Clock size={36} className="text-sky-600" />
              <h4 className="text-xl font-black font-baloo text-sky-950">
                الْفِعْلُ الْمُضَارِعُ
              </h4>
              <span className="text-xs font-bold font-tajawal text-sky-800 bg-sky-200/80 px-2.5 py-0.5 rounded-full">
                ⏰ يَحْدُثُ الْآنَ
              </span>
            </motion.button>

            {/* Imperative Box */}
            <motion.button
              id="sort-box-imperative"
              whileHover={{ scale: selectedTense ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChooseTense('imperative')}
              type="button"
              disabled={selectedTense !== null}
              className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                selectedTense === 'imperative'
                  ? currentItem.tense === 'imperative'
                    ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300'
                    : 'bg-rose-100 border-rose-400'
                  : 'bg-gradient-to-b from-purple-50 to-purple-100/70 border-purple-300 hover:border-purple-500 shadow-md'
              }`}
            >
              <Megaphone size={36} className="text-purple-600" />
              <h4 className="text-xl font-black font-baloo text-purple-950">
                فِعْلُ الْأَمْرِ
              </h4>
              <span className="text-xs font-bold font-tajawal text-purple-800 bg-purple-200/80 px-2.5 py-0.5 rounded-full">
                📢 طَلَبُ الْعَمَلِ
              </span>
            </motion.button>
          </div>

          {/* Feedback & Next Button */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-3xl border-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => ArabicSpeechEngine.speak(feedback.text, progress.speechRate)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-teal-700 cursor-pointer flex-shrink-0 shadow-xs mt-0.5"
                  title="إِعَادَةُ الِاسْتِمَاعِ لِلشَّرْحِ"
                >
                  <Volume2 size={20} />
                </button>
                <p className="text-base sm:text-lg font-tajawal font-bold leading-relaxed tashkeel-text">
                  {feedback.text}
                </p>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={goToNextItem}
                className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-tajawal font-bold text-base rounded-2xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 btn-chunky"
              >
                <span>{currentIndex + 1 < TIME_SORTING_ITEMS.length ? 'الْكَلِمَةُ التَّالِيَةُ' : 'عَرْضُ النَّتِيجَةِ'}</span>
                <ArrowLeft size={18} />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Game Over Summary */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-teal-100 via-emerald-100 to-teal-100 border-3 border-teal-400 p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-xl"
        >
          <div className="text-6xl animate-bounce">🎉</div>
          <h3 className="text-2xl sm:text-3xl font-black font-baloo text-teal-950">
            مَبْرُوكٌ يَا خَبِيرَ الْأَزْمِنَةِ!
          </h3>
          <p className="text-lg font-bold font-tajawal text-teal-900">
            لَقَدْ صَنَّفْتَ {score} مِنْ {TIME_SORTING_ITEMS.length} أَفْعَالٍ صَحِيحَةً وَرَبِحْتَ 25 نَجْمَةً! ⭐
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
                ArabicSpeechEngine.stop();
                onBackToMenu();
              }}
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white font-tajawal font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer btn-chunky"
            >
              الْعَوْدَةُ لِقَائِمَةِ الْأَلْعَابِ 🎮
            </button>
            <button
              onClick={handleRestart}
              type="button"
              className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-tajawal font-bold px-4 py-3 rounded-2xl flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={18} />
              <span>إِعَادَةُ التَّصْنِيفِ</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
