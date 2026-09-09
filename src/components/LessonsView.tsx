import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LESSONS_DATA } from '../data/lessonsData';
import { LessonSection, UserProgress, VerbItem } from '../types';
import { SoundButton } from './SoundButton';
import { Sparkles, CheckCircle2, Star, ArrowRight, ArrowLeft, BookOpen, Play, HelpCircle, Check, X, Volume2 } from 'lucide-react';
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

  /**
   * Spoken explanation according to pedagogical instruction:
   * 1. Only the written definition (activeLesson.conceptSummary).
   * 2. Sentence: "كَيْفَ نُمَيِّزُ هَذَا الْفِعْلَ عَنْ غَيْرِهِ؟"
   * 3. Numbered signs 1, 2, 3, etc. until the example.
   */
  const buildExplanationSpeech = (lesson: LessonSection): string => {
    const definition = lesson.conceptSummary.trim();
    const question = lesson.id === 'lesson-1'
      ? 'كَيْفَ نُمَيِّزُ الْفِعْلَ عَنْ غَيْرِهِ؟'
      : lesson.id === 'lesson-5'
      ? 'كَيْفَ نُمَيِّزُ هَذَا التَّحْوِيلَ؟'
      : 'كَيْفَ نُمَيِّزُ هَذَا الْفِعْلَ عَنْ غَيْرِهِ؟';

    const numberedRules = lesson.ruleExplanation.map((rule, idx) => `${idx + 1}: ${rule}`).join(' ');

    return `${definition} ${question} ${numberedRules}`;
  };

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
      setDemoFeedback('أَحْسَنْتَ يَا بَطَلُ! لَقَدْ حَصَلْتَ عَلَى 15 نَجْمَةً لِإِتْمَامِ هَذَا التَّطْبِيقِ!');
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-amber-100">
          <div>
            {isLessonCompleted && (
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-900 text-sm sm:text-base font-black px-3.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300 shadow-xs">
                  <CheckCircle2 size={18} />
                  <span>دَرْسٌ مُكْتَمَلٌ</span>
                </span>
              </div>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-950 font-baloo leading-tight tashkeel-text">
              {activeLesson.title}
            </h2>
            {activeLesson.subtitle ? (
              <p className="text-slate-700 font-tajawal font-bold text-base sm:text-xl mt-2 leading-relaxed tashkeel-text">
                {activeLesson.subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <SoundButton
              textToSpeak={buildExplanationSpeech(activeLesson)}
              size="lg"
              variant="primary"
              label="اِسْتَمِعْ لِلشَّرْحِ"
              rate={progress.speechRate}
            />
          </div>
        </div>

        {/* Golden Rule Box */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-sm">
          <div className="flex flex-row items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5 text-amber-950 font-black">
              <Sparkles size={26} className="text-amber-500" />
              <span className="font-baloo text-xl sm:text-2xl">تَعْرِيفُ الْفِعْلِ:</span>
            </div>
            <SoundButton
              textToSpeak={activeLesson.conceptSummary}
              size="sm"
              variant="amber"
              label="نُطْقُ التَّعْرِيفِ"
              rate={progress.speechRate}
            />
          </div>
          
          <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 shadow-xs mb-4">
            <p className="text-xl sm:text-2xl lg:text-3xl text-amber-950 font-black font-baloo leading-loose tashkeel-text">
              {activeLesson.conceptSummary}
            </p>
          </div>

          {/* Question Sentence: كيف نميز هذا الفعل عن غيره؟ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-5 mb-3 pt-4 border-t-2 border-amber-200/80">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-xs flex-shrink-0"></span>
              <h3 className="font-baloo text-lg sm:text-2xl font-black text-amber-950 tashkeel-text">
                {activeLesson.id === 'lesson-1'
                  ? 'كَيْفَ نُمَيِّزُ الْفِعْلَ عَنْ غَيْرِهِ؟ (عَلَامَاتُ الْفِعْلِ):'
                  : activeLesson.id === 'lesson-5'
                  ? 'كَيْفَ نُمَيِّزُ هَذَا التَّحْوِيلَ؟:'
                  : 'كَيْفَ نُمَيِّزُ هَذَا الْفِعْلَ عَنْ غَيْرِهِ؟ (عَلَامَاتُ الْفِعْلِ):'}
              </h3>
            </div>
            <SoundButton
              textToSpeak={`${activeLesson.id === 'lesson-1' ? 'كَيْفَ نُمَيِّزُ الْفِعْلَ عَنْ غَيْرِهِ؟' : activeLesson.id === 'lesson-5' ? 'كَيْفَ نُمَيِّزُ هَذَا التَّحْوِيلَ؟' : 'كَيْفَ نُمَيِّزُ هَذَا الْفِعْلَ عَنْ غَيْرِهِ؟'} ${activeLesson.ruleExplanation.map((r, i) => `${i + 1}: ${r}`).join(' ')}`}
              size="sm"
              variant="amber"
              label="نُطْقُ الْعَلَامَاتِ"
              rate={progress.speechRate}
            />
          </div>

          {/* List of numbered signs until example */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {activeLesson.ruleExplanation.map((rule, idx) => (
              <div
                key={idx}
                onClick={() => {
                  soundEffects.playClick();
                  ArabicSpeechEngine.speak(`${idx + 1}: ${rule}`, progress.speechRate);
                }}
                className="flex items-start gap-3 bg-white/95 hover:bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 hover:border-amber-400 text-slate-900 font-tajawal font-extrabold text-base sm:text-xl shadow-xs leading-loose cursor-pointer transition-all hover:scale-[1.01] select-none"
                title="اِضْغَطْ لِلِاسْتِمَاعِ لِهَذِهِ الْعَلَامَةِ"
              >
                <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm sm:text-base font-black flex-shrink-0 mt-1 shadow-xs">
                  {idx + 1}
                </span>
                <span className="tashkeel-text flex-1">{rule}</span>
                <div className="text-amber-600 p-1 flex-shrink-0 opacity-70 hover:opacity-100 mt-0.5">
                  <Volume2 size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Verb Examples Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <BookOpen size={26} className="text-amber-600" />
              <h3 className="text-xl sm:text-2xl font-black font-baloo text-slate-900">
                أَمْثِلَةٌ تَفَاعُلِيَّةٌ مَعَ النُّطْقِ الْوَاضِحِ (اِضْغَطْ لِتَسْتَمِعَ):
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {activeLesson.examples.map(example => {
              const isActive = activeVerbCard === example.id;

              return (
                <motion.div
                  key={example.id}
                  id={`verb-card-${example.id}`}
                  onClick={() => handleVerbCardClick(example)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-100/95 border-amber-500 shadow-xl ring-4 ring-amber-300'
                      : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-2xl bg-amber-200 flex items-center justify-center text-amber-900">
                        <Sparkles size={18} />
                      </div>
                      <span className="text-xs sm:text-sm bg-amber-200 text-amber-950 font-black px-3 py-1 rounded-full font-tajawal shadow-xs">
                        {example.tenseNameAr}
                      </span>
                    </div>

                    {/* Vocalized Word */}
                    <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-950 font-baloo tashkeel-text my-1 leading-tight">
                      {example.tashkeel}
                    </h4>
                    <p className="text-sm sm:text-base font-bold text-slate-600 font-tajawal mt-1">
                      {example.meaningAr}
                    </p>
                  </div>

                  {/* Example Sentence with Audio Icon */}
                  <div className="mt-4 pt-4 border-t-2 border-slate-200/90">
                    <p className="text-base sm:text-xl font-black text-slate-800 font-baloo leading-loose tashkeel-text">
                      {example.exampleSentence}
                    </p>
                    <div className="mt-3 flex items-center justify-end">
                      <SoundButton
                        textToSpeak={`${example.tashkeel}. ${example.exampleSentence}`}
                        size="md"
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
            <div className="flex items-center gap-2.5">
              <Star size={28} className="text-sky-600 fill-sky-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-baloo text-sky-950">
                  تَدْرِيبُ الْبَطَلِ الصَّغِيرِ (اِرْبَحْ 15 نَجْمَةً!):
                </h3>
                <p className="text-base sm:text-lg font-tajawal font-extrabold text-sky-900 mt-1 leading-relaxed tashkeel-text">
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
          <div className="flex flex-wrap gap-3 sm:gap-4 my-4">
            {activeLesson.interactiveDemo.items.map(item => {
              const isSelected = !!selectedDemoAnswers[item.id];

              return (
                <button
                  key={item.id}
                  id={`demo-btn-${item.id}`}
                  onClick={() => handleDemoItemClick(item)}
                  type="button"
                  className={`text-xl sm:text-3xl font-black font-baloo px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl border-3 transition-all cursor-pointer flex items-center gap-2.5 tashkeel-text shadow-sm ${
                    isSelected
                      ? item.isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                        : 'bg-rose-500 text-white border-rose-600 shadow-md'
                      : 'bg-white text-slate-900 border-sky-300 hover:border-sky-500 hover:bg-sky-100/60'
                  }`}
                >
                  <span>{item.text}</span>
                  {isSelected && (
                    item.isCorrect ? <Check size={22} className="stroke-[3]" /> : <X size={22} className="stroke-[3]" />
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
              className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-sky-300 text-sky-950 font-black font-tajawal text-lg sm:text-xl flex items-center justify-between gap-3 shadow-xs leading-relaxed"
            >
              <span>{demoFeedback}</span>
              <SoundButton textToSpeak={demoFeedback} size="md" variant="ghost" rate={progress.speechRate} />
            </motion.div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-slate-100">
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              type="button"
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-tajawal font-black text-base sm:text-lg px-6 py-3 rounded-2xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowRight size={18} />
              <span>الْعَوْدَةُ لِلْقَائِمَةِ الرَّئِيسِيَّةِ</span>
            </button>
          )}

          <button
            onClick={onGoToGames}
            type="button"
            className="bg-sky-500 hover:bg-sky-600 text-white font-tajawal font-black text-base sm:text-lg px-7 py-3 rounded-2xl shadow-md flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer mr-auto btn-chunky"
          >
            <span>اِنْتَقِلْ إِلَى أَلْعَابِ الْأَفْعَالِ</span>
            <ArrowLeft size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
