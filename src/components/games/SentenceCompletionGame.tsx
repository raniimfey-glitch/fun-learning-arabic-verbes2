import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { SENTENCE_COMPLETION_QUESTIONS } from '../../data/gamesData';
import { UserProgress } from '../../types';
import { SoundButton } from '../SoundButton';
import { ArrowLeft, RotateCcw, Check, X, Sparkles, BookOpen, Volume2, ArrowRight } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface SentenceCompletionGameProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToMenu: () => void;
}

export const SentenceCompletionGame: React.FC<SentenceCompletionGameProps> = ({
  progress,
  onUpdateProgress,
  onBackToMenu
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = SENTENCE_COMPLETION_QUESTIONS[questionIndex];

  // Cleanup timers and sound on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      ArabicSpeechEngine.stop();
    };
  }, []);

  const goToNextQuestion = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    ArabicSpeechEngine.stop();
    soundEffects.playClick();
    setSelectedOption(null);
    setFeedback(null);

    if (questionIndex + 1 < SENTENCE_COMPLETION_QUESTIONS.length) {
      setQuestionIndex(prev => prev + 1);
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
          completer: (prev.gameScores.completer || 0) + 1
        }
      }));
    }
  };

  const handleSelectOption = (opt: string) => {
    if (selectedOption || isGameOver) return;

    setSelectedOption(opt);
    const isCorrect = opt === currentQ.correctVerb;

    let msg = '';
    if (isCorrect) {
      soundEffects.playCorrect();
      setScore(prev => prev + 1);
      const fullSentence = `${currentQ.sentenceBefore} ${opt} ${currentQ.sentenceAfter}`;
      msg = `مُمْتَازٌ! الْجُمْلَةُ الصَّحِيحَةُ هِيَ: «${fullSentence}». ${currentQ.explanation}`;
      setFeedback({ text: msg, isCorrect: true });
    } else {
      soundEffects.playWrong();
      msg = `إِجَابَةٌ غَيْرُ صَحِيحَةٍ. الْفِعْلُ الْمُنَاسِبُ هُوَ: (${currentQ.correctVerb}). ${currentQ.explanation}`;
      setFeedback({ text: msg, isCorrect: false });
    }

    // Speak explanation in full. Only schedule auto-advance AFTER speech ends completely.
    ArabicSpeechEngine.speak(msg, progress.speechRate, () => {
      // Speech finished! Give child a comfortable 1.8 seconds to view the completed sentence.
      autoAdvanceTimerRef.current = setTimeout(() => {
        goToNextQuestion();
      }, 1800);
    });
  };

  const handleRestart = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    ArabicSpeechEngine.stop();
    soundEffects.playClick();
    setQuestionIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-indigo-300 shadow-lg p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-indigo-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-3 py-1 rounded-full font-tajawal">
              لُعْبَةُ إِكْمَالِ الْجُمَلِ 🧩
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-700 text-xs font-bold font-tajawal">
              الْجُمْلَةُ {questionIndex + 1} مِنْ {SENTENCE_COMPLETION_QUESTIONS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 font-baloo leading-tight tashkeel-text">
            اِخْتَرِ الْفِعْلَ الْمُنَاسِبَ لِمَلْءِ الْفَرَاغِ:
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
            textToSpeak={`${currentQ.sentenceBefore} فَرَاغٌ ${currentQ.sentenceAfter}`}
            size="md"
            variant="secondary"
            label="اِسْتَمِعْ لِلْجُمْلَةِ"
            rate={progress.speechRate}
          />
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Illustrated Sentence Card */}
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-50 via-sky-50 to-indigo-50 border-3 border-indigo-200 rounded-3xl p-6 sm:p-8 text-center shadow-inner space-y-4"
          >
            <span className="text-6xl block">{currentQ.imageEmoji}</span>

            <div className="text-2xl sm:text-3xl font-black font-baloo text-slate-900 leading-relaxed tashkeel-text flex flex-wrap items-center justify-center gap-2">
              <span>{currentQ.sentenceBefore}</span>
              <span className="inline-block min-w-[120px] px-4 py-1.5 rounded-2xl border-2 border-dashed border-indigo-400 bg-white text-indigo-700 font-extrabold shadow-sm">
                {selectedOption || '......'}
              </span>
              <span>{currentQ.sentenceAfter}</span>
            </div>
          </motion.div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {currentQ.options.map(opt => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctVerb;

              return (
                <motion.button
                  key={opt}
                  id={`opt-btn-${opt}`}
                  whileHover={{ scale: selectedOption ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectOption(opt)}
                  type="button"
                  disabled={selectedOption !== null}
                  className={`p-4 sm:p-5 rounded-3xl border-3 text-xl sm:text-2xl font-black font-baloo transition-all cursor-pointer select-none tashkeel-text flex items-center justify-center gap-2 ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-md ring-4 ring-emerald-300'
                        : 'bg-rose-100 border-rose-400 text-rose-950'
                      : 'bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-slate-800 shadow-sm'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    isCorrect ? <Check size={20} className="text-emerald-600" /> : <X size={20} className="text-rose-600" />
                  )}
                </motion.button>
              );
            })}
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
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-indigo-700 cursor-pointer flex-shrink-0 shadow-xs mt-0.5"
                  title="إِعَادَةُ الِاسْتِمَاعِ لِلشَّرْحِ"
                >
                  <Volume2 size={20} />
                </button>
                <p className="text-base sm:text-lg font-tajawal font-bold leading-relaxed tashkeel-text">
                  {feedback.text}
                </p>
              </div>

              {/* Next Question Button */}
              <button
                type="button"
                onClick={goToNextQuestion}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-tajawal font-bold text-base rounded-2xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 btn-chunky"
              >
                <span>{questionIndex + 1 < SENTENCE_COMPLETION_QUESTIONS.length ? 'الْجُمْلَةُ التَّالِيَةُ' : 'عَرْضُ النَّتِيجَةِ'}</span>
                <ArrowLeft size={18} />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Game Over */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 border-3 border-indigo-400 p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-xl"
        >
          <div className="text-6xl animate-bounce">🌟</div>
          <h3 className="text-2xl sm:text-3xl font-black font-baloo text-indigo-950">
            أَحْسَنْتَ يَا بَطَلَ الْجُمَلِ!
          </h3>
          <p className="text-lg font-bold font-tajawal text-indigo-900">
            لَقَدْ أَكْمَلْتَ {score} مِنْ {SENTENCE_COMPLETION_QUESTIONS.length} جُمَلٍ بِنَجَاحٍ وَرَبِحْتَ 25 نَجْمَةً! ⭐
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
                ArabicSpeechEngine.stop();
                onBackToMenu();
              }}
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-tajawal font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer btn-chunky"
            >
              الْعَوْدَةُ لِقَائِمَةِ الْأَلْعَابِ 🎮
            </button>
            <button
              onClick={handleRestart}
              type="button"
              className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-tajawal font-bold px-4 py-3 rounded-2xl flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={18} />
              <span>إِعَادَةُ اللَّعِبِ</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
