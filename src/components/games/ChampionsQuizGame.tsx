import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { QUIZ_QUESTIONS } from '../../data/gamesData';
import { UserProgress } from '../../types';
import { SoundButton } from '../SoundButton';
import { Trophy, Award, ArrowLeft, RotateCcw, Check, X, Sparkles, Volume2, Star } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ChampionsQuizGameProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToMenu: () => void;
  onGoToRewards: () => void;
}

export const ChampionsQuizGame: React.FC<ChampionsQuizGameProps> = ({
  progress,
  onUpdateProgress,
  onBackToMenu,
  onGoToRewards
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = QUIZ_QUESTIONS[questionIndex];

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
    setSelectedOptionIndex(null);
    setFeedback(null);

    if (questionIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizFinished(true);
      soundEffects.playFanfare();
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

      const earnedStars = score * 5 + 20;
      onUpdateProgress(prev => ({
        ...prev,
        stars: prev.stars + earnedStars,
        gems: prev.gems + 3,
        gameScores: {
          ...prev.gameScores,
          quiz: Math.max(prev.gameScores.quiz || 0, score)
        }
      }));
    }
  };

  const handleSelectOption = (index: number) => {
    if (selectedOptionIndex !== null || isQuizFinished) return;

    setSelectedOptionIndex(index);
    const isCorrect = index === currentQ.correctIndex;

    let msg = '';
    if (isCorrect) {
      soundEffects.playCorrect();
      setScore(prev => prev + 1);
      msg = `إِجَابَةٌ صَحِيحَةٌ وَرَائِعَةٌ! 🌟 ${currentQ.explanation}`;
      setFeedback({ text: msg, isCorrect: true });
    } else {
      soundEffects.playWrong();
      msg = `إِجَابَةٌ غَيْرُ صَحِيحَةٍ. ${currentQ.explanation}`;
      setFeedback({ text: msg, isCorrect: false });
    }

    // Speak explanation in full, and only auto-advance after speech ends
    ArabicSpeechEngine.speak(msg, progress.speechRate, () => {
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
    setSelectedOptionIndex(null);
    setScore(0);
    setFeedback(null);
    setIsQuizFinished(false);
  };

  return (
    <div className="game-card fit-screen-card bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-amber-400 shadow-md p-3 sm:p-5 h-full w-full flex-1 flex flex-col justify-between min-h-0 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b-2 border-amber-100 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-950 text-xs sm:text-sm font-black px-3 py-1 rounded-full font-tajawal border border-amber-300 shadow-xs">
              تَحَدِّي أَبْطَالِ الْأَفْعَالِ الْكَبِيرِ
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-800 text-xs sm:text-sm font-extrabold font-tajawal">
              السُّؤَالُ {questionIndex + 1} مِنْ {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-950 font-baloo leading-tight tashkeel-text">
            اخْتَبِرْ مَعْلُومَاتِكَ وَارْبَحْ شَهَادَةَ التَّفَوُّقِ:
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
              ArabicSpeechEngine.stop();
              onBackToMenu();
            }}
            type="button"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold font-tajawal flex items-center gap-1.5 cursor-pointer border border-slate-300 shadow-xs"
          >
            <ArrowLeft size={16} />
            <span className="hidden xs:inline">الْأَلْعَابُ</span>
          </button>
          <SoundButton
            textToSpeak={currentQ.audioPrompt || currentQ.question}
            size="md"
            variant="primary"
            label="اِسْتَمِعْ"
            rate={progress.speechRate}
          />
        </div>
      </div>

      {!isQuizFinished ? (
        <div className="flex-1 flex flex-col justify-center min-h-0 py-2 sm:py-3 w-full max-w-[650px] mx-auto gap-3 sm:gap-4">
          {/* Question Card */}
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50 border-2 sm:border-3 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex items-center justify-center text-center flex-shrink-0"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-baloo text-amber-950 leading-snug tashkeel-text">
              {currentQ.question}
            </h3>
          </motion.div>

          {/* Answer Options */}
          <div className="flex flex-col gap-2.5 sm:gap-3 flex-shrink-0 w-full">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = idx === currentQ.correctIndex;

              return (
                <motion.button
                  key={idx}
                  id={`quiz-opt-${idx}`}
                  whileHover={{ scale: selectedOptionIndex === null ? 1.01 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(idx)}
                  type="button"
                  disabled={selectedOptionIndex !== null}
                  className={`quiz-option-btn w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl sm:rounded-3xl border-2 sm:border-3 text-right text-lg sm:text-xl md:text-2xl font-black font-baloo transition-all cursor-pointer flex items-center justify-between gap-3 tashkeel-text shadow-xs ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-3 ring-emerald-300 shadow-md'
                        : 'bg-rose-100 border-rose-400 text-rose-950 shadow-md'
                      : 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-400 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-950 border-2 border-amber-300 flex items-center justify-center text-base sm:text-lg font-black flex-shrink-0 shadow-2xs">
                      {idx === 0 ? 'أ' : idx === 1 ? 'ب' : 'ج'}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isSelected && (
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <Check size={26} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <X size={26} className="text-rose-600 stroke-[3]" />
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1">
                <button
                  type="button"
                  onClick={() => ArabicSpeechEngine.speak(feedback.text, progress.speechRate)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-amber-800 cursor-pointer flex-shrink-0 shadow-2xs"
                  title="إِعَادَةُ الِاسْتِمَاعِ لِلشَّرْحِ"
                >
                  <Volume2 size={20} />
                </button>
                <p className="text-base sm:text-lg font-tajawal font-black leading-snug tashkeel-text">
                  {feedback.text}
                </p>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={goToNextQuestion}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-tajawal font-black text-sm sm:text-base rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 btn-chunky"
              >
                <span>{questionIndex + 1 < QUIZ_QUESTIONS.length ? 'السُّؤَالُ التَّالِي' : 'عَرْضُ النَّتِيجَةِ'}</span>
                <ArrowLeft size={18} />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Quiz Finished Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-4 border-amber-400 p-6 sm:p-10 rounded-3xl text-center space-y-6 shadow-2xl"
        >
          <div className="flex justify-center">
            <Trophy size={64} className="text-amber-600 animate-bounce" />
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-black font-baloo text-amber-950 mb-2">
              تَهَانِينَا يَا عَبْقَرِيَّ الْأَفْعَالِ!
            </h3>
            <p className="text-xl font-bold font-tajawal text-amber-900">
              لَقَدْ أَجَبْتَ عَلَى {score} مِنْ {QUIZ_QUESTIONS.length} أَسْئِلَةٍ بِشَكْلٍ صَحِيحٍ!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-2">
            <div className="bg-white px-5 py-3 rounded-2xl border-2 border-amber-300 shadow-sm flex items-center gap-2">
              <Star size={24} className="text-amber-500 fill-amber-400" />
              <span className="font-tajawal font-bold text-amber-900 text-lg">
                +{score * 5 + 20} نَجْمَةً جَدِيدَةً!
              </span>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl border-2 border-sky-300 shadow-sm flex items-center gap-2">
              <Sparkles size={24} className="text-sky-500" />
              <span className="font-tajawal font-bold text-sky-900 text-lg">
                +3 جَوَاهِرَ!
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onGoToRewards}
              type="button"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-tajawal font-bold text-lg px-7 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2 btn-chunky"
            >
              <Award size={22} />
              <span>شَاهِدْ شَهَادَةَ التَّفَوُّقِ</span>
            </button>

            <button
              onClick={handleRestart}
              type="button"
              className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-tajawal font-bold text-base px-5 py-3 rounded-2xl flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={18} />
              <span>إِعَادَةُ التَّحَدِّي</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
