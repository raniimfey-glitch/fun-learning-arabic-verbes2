import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LESSONS_DATA } from '../data/lessonsData';
import { LessonSection, UserProgress, VerbItem } from '../types';
import { SoundButton } from './SoundButton';
import { Sparkles, CheckCircle2, Star, ArrowRight, ArrowLeft, BookOpen, Play, HelpCircle, Check, X } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LessonsViewProps {
  lessonId?: string;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onGoToGames: () => void;
  onBackToMenu?: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  lessonId = 'lesson-2',
  progress,
  onUpdateProgress,
  onGoToGames,
  onBackToMenu
}) => {
  const [selectedDemoAnswers, setSelectedDemoAnswers] = useState<Record<string, boolean>>({});
  const [demoFeedback, setDemoFeedback] = useState<string | null>(null);
  const [activeVerbCard, setActiveVerbCard] = useState<string | null>(null);

  const activeLesson = LESSONS_DATA.find(l => l.id === lessonId) || LESSONS_DATA[1];
  const isLessonCompleted = progress.completedLessons.includes(activeLesson.id);

  // Reset state when lessonId changes
  useEffect(() => {
    setSelectedDemoAnswers({});
    setDemoFeedback(null);
    setActiveVerbCard(null);
  }, [lessonId]);

  const handleVerbCardClick = (verb: VerbItem) => {
    soundEffects.playStarEarned();
    setActiveVerbCard(verb.id);
    const textToSpeak = `${verb.tashkeel}. مَعْنَاهُ: ${verb.meaningAr}. مِثَالٌ: ${verb.exampleSentence}`;
    ArabicSpeechEngine.speak(textToSpeak, progress.speechRate);
  };

  const handleDemoItemClick = (item: { id: string; text: string; isCorrect: boolean; hint: string }) => {
    const isCurrentlySelected = !!selectedDemoAnswers[item.id];
    const newSelected = { ...selectedDemoAnswers, [item.id]: !isCurrentlySelected };
    setSelectedDemoAnswers(newSelected);

    if (item.isCorrect) {
      soundEffects.playCorrect();
      setDemoFeedback(item.hint);
      ArabicSpeechEngine.speak(item.hint, progress.speechRate);
    } else {
      soundEffects.playWrong();
      setDemoFeedback(item.hint);
      ArabicSpeechEngine.speak(item.hint, progress.speechRate);
    }

    // Check if all correct items are selected
    const allCorrectIds = activeLesson.interactiveDemo.items.filter(i => i.isCorrect).map(i => i.id);
    const areAllFound = allCorrectIds.every(id => newSelected[id]);

    if (areAllFound && !isLessonCompleted) {
      soundEffects.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onUpdateProgress(prev => ({
        ...prev,
        stars: prev.stars + 15,
        gems: prev.gems + 1,
        completedLessons: [...new Set([...prev.completedLessons, activeLesson.id])]
      }));
      setDemoFeedback('🎉 أَحْسَنْتَ يَا بَطَلُ! لَقَدْ حَصَلْتَ عَلَى 15 نَجْمَةً لِإِتْمَامِ هَذَا التَّطْبِيقِ!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Active Lesson Content - Directly displayed without tabs */}
      <motion.div
        key={activeLesson.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border-3 border-amber-200 shadow-md p-4 sm:p-8 space-y-6 sm:space-y-8"
      >
        {/* Header of Active Lesson */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-amber-100">
          <div>
            {isLessonCompleted && (
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  <span>دَرْسٌ مُكْتَمَلٌ ✨</span>
                </span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-baloo leading-tight tashkeel-text">
              {activeLesson.title}
            </h2>
            {activeLesson.subtitle ? (
              <p className="text-slate-600 font-tajawal font-medium text-sm sm:text-base mt-1">
                {activeLesson.subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <SoundButton
              textToSpeak={`${activeLesson.title}. ${activeLesson.subtitle ? activeLesson.subtitle + '. ' : ''}${activeLesson.conceptSummary}`}
              size="lg"
              variant="primary"
              label="اِسْتَمِعْ لِلشَّرْحِ"
              rate={progress.speechRate}
            />
          </div>
        </div>

        {/* Golden Rule Box */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-inner">
          <div className="flex items-center gap-2 text-amber-900 font-bold mb-3">
            <Sparkles size={20} className="text-amber-500" />
            <span className="font-baloo text-lg sm:text-xl">قَاعِدَةٌ ذَهَبِيَّةٌ لِلْأَبْطَالِ 🌟</span>
          </div>
          <p className="text-base sm:text-xl text-slate-800 font-bold font-baloo leading-relaxed tashkeel-text mb-4">
            {activeLesson.conceptSummary}
          </p>

          {/* List of rules */}
          <div className="grid sm:grid-cols-2 gap-2.5">
            {activeLesson.ruleExplanation.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 bg-white/90 p-3 rounded-2xl border border-amber-200 text-slate-700 font-tajawal font-bold text-sm sm:text-base shadow-xs"
              >
                <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="tashkeel-text">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Verb Examples Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👀</span>
              <h3 className="text-xl font-bold font-baloo text-slate-800">
                أَمْثِلَةٌ تَفَاعُلِيَّةٌ مَعَ الرُّسُومِ الْمُتَحَرِّكَةِ (اِضْغَطْ لِتَسْمَعَ وَتُشَاهِدَ):
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {activeLesson.examples.map(example => {
              const isActive = activeVerbCard === example.id;

              return (
                <motion.div
                  key={example.id}
                  id={`verb-card-${example.id}`}
                  onClick={() => handleVerbCardClick(example)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-100/90 border-amber-500 shadow-lg ring-4 ring-amber-300'
                      : 'bg-slate-50 hover:bg-amber-50/60 border-slate-200 hover:border-amber-300 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Animated Emoji Header */}
                    <div className="flex items-center justify-between mb-2">
                      <motion.span
                        animate={
                          isActive
                            ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-5xl"
                      >
                        {example.emoji}
                      </motion.span>
                      <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full font-tajawal">
                        {example.tenseNameAr}
                      </span>
                    </div>

                    {/* Vocalized Word */}
                    <h4 className="text-2xl font-black text-amber-950 font-baloo tashkeel-text">
                      {example.tashkeel}
                    </h4>
                    <p className="text-xs font-bold text-slate-500 font-tajawal mt-0.5">
                      {example.meaningAr}
                    </p>
                  </div>

                  {/* Example Sentence with Audio Icon */}
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <p className="text-sm font-bold text-slate-700 font-baloo leading-relaxed tashkeel-text">
                      {example.exampleSentence}
                    </p>
                    <div className="mt-2 flex items-center justify-end">
                      <SoundButton
                        textToSpeak={`${example.tashkeel}. ${example.exampleSentence}`}
                        size="sm"
                        variant="amber"
                        rate={progress.speechRate}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Interactive Micro-Practice Box (Earn Stars) */}
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border-3 border-sky-300 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-xl font-bold font-baloo text-sky-950">
                  تَدْرِيبُ الْبَطَلِ الصَّغِيرِ (اِرْبَحْ 15 نَجْمَةً!):
                </h3>
                <p className="text-sm font-tajawal font-bold text-sky-800">
                  {activeLesson.interactiveDemo.prompt}
                </p>
              </div>
            </div>

            <SoundButton
              textToSpeak={`${activeLesson.interactiveDemo.prompt}`}
              size="md"
              variant="secondary"
              label="اِسْتَمِعْ لِلتَّعْلِيمَاتِ"
              rate={progress.speechRate}
            />
          </div>

          {/* Clickable Word Pills */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3.5 my-4">
            {activeLesson.interactiveDemo.items.map(item => {
              const isSelected = !!selectedDemoAnswers[item.id];

              return (
                <button
                  key={item.id}
                  id={`demo-btn-${item.id}`}
                  onClick={() => handleDemoItemClick(item)}
                  type="button"
                  className={`text-lg sm:text-xl font-black font-baloo px-5 py-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2 tashkeel-text ${
                    isSelected
                      ? item.isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                        : 'bg-rose-500 text-white border-rose-600 shadow-md'
                      : 'bg-white text-slate-800 border-sky-200 hover:border-sky-400 hover:bg-sky-100/50 shadow-sm'
                  }`}
                >
                  <span>{item.text}</span>
                  {isSelected && (
                    item.isCorrect ? <Check size={18} /> : <X size={18} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {demoFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-3.5 rounded-2xl border-2 border-sky-300 text-sky-950 font-bold font-tajawal text-base flex items-center justify-between gap-2 shadow-xs"
            >
              <span>{demoFeedback}</span>
              <SoundButton textToSpeak={demoFeedback} size="sm" variant="ghost" rate={progress.speechRate} />
            </motion.div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-slate-100">
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              type="button"
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-tajawal font-bold px-5 py-2.5 rounded-2xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowRight size={16} />
              <span>الْعَوْدَةُ لِلْقَائِمَةِ الرَّئِيسِيَّةِ</span>
            </button>
          )}

          <button
            onClick={onGoToGames}
            type="button"
            className="bg-sky-500 hover:bg-sky-600 text-white font-tajawal font-bold px-6 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer mr-auto"
          >
            <span>🎮 اِنْتَقِلْ إِلَى أَلْعَابِ الْأَفْعَالِ</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
