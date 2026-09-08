import React from 'react';
import { motion } from 'motion/react';
import { UserProgress, ActivityId } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { SoundButton } from './SoundButton';
import {
  Star,
  Sparkles,
  Trophy,
  Award,
  Play,
  History,
  Clock,
  Megaphone,
  Wand2,
  Gamepad2,
  BookOpen,
  Volume2,
  VolumeX,
  User,
  CheckCircle2,
  GraduationCap,
  Sparkle,
  ArrowLeft
} from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../utils/audio';

interface HomeHubProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onOpenActivity: (activityId: ActivityId) => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  progress,
  onUpdateProgress,
  onOpenActivity
}) => {
  const handleLaunchActivity = (actId: ActivityId, title: string) => {
    soundEffects.playClick();
    ArabicSpeechEngine.speak(title, progress.speechRate);
    onOpenActivity(actId);
  };

  const handleToggleSound = () => {
    soundEffects.playClick();
    const next = !progress.soundEnabled;
    onUpdateProgress(prev => ({ ...prev, soundEnabled: next }));
    soundEffects.setSoundEnabled(next);
  };

  const handleChangeSpeed = () => {
    soundEffects.playClick();
    const next = progress.speechRate === 0.8 ? 1.0 : progress.speechRate === 1.0 ? 0.65 : 0.8;
    onUpdateProgress(prev => ({ ...prev, speechRate: next }));
    ArabicSpeechEngine.speak(
      next === 0.65 ? 'سُرْعَةُ النُّطْقِ: بَطِيئَةٌ جِدًّا' : next === 0.8 ? 'سُرْعَةُ النُّطْقِ: مُنَاسِبَةٌ لِلْأَطْفَالِ' : 'سُرْعَةُ النُّطْقِ: عَادِيَّةٌ',
      next
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-4">
      {/* 🌟 Welcome & Kid Profile Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-lg relative overflow-hidden flex-shrink-0">
        {/* Background Sparkles */}
        <div className="absolute top-2 left-6 text-xl opacity-40 animate-twinkle">✨</div>
        <div className="absolute bottom-2 right-10 text-2xl opacity-30 animate-twinkle">🌟</div>
        <div className="absolute top-1/2 left-1/4 text-lg opacity-30 animate-twinkle">💫</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Avatar & Welcome Greeting */}
          <div className="flex items-center gap-3 text-center sm:text-right">
            <div className="text-4xl sm:text-5xl bg-white/20 p-2 rounded-2xl backdrop-blur-xs border-2 border-white/40 shadow-inner flex-shrink-0 animate-bounce-gentle">
              {progress.avatar}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                <span className="bg-amber-300 text-amber-950 font-black text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-tajawal">
                  السَّنَةُ الثَّانِيَةُ ابْتِدَائِي
                </span>
                <span className="text-amber-100 text-[11px] sm:text-xs font-bold font-tajawal">
                  بِالْحَرَكَاتِ وَالصَّوْتِ
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black font-baloo leading-tight">
                أَهْلًا بِكَ يَا بَطَلَنَا: {progress.childName}
              </h1>
              <p className="text-amber-100 text-[11px] sm:text-xs font-tajawal font-bold mt-0.5">
                تَعَلَّمْ أَقْسَامَ الْفِعْلِ الثَّلَاثَةِ وَالْعَبْ وَارْبَحِ النُّجُومَ وَالْأَوْسِمَةَ!
              </p>
            </div>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Stars Counter */}
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30 flex items-center gap-1 shadow-sm">
              <Star className="text-yellow-300 fill-yellow-300" size={18} />
              <span className="font-black font-tajawal text-base sm:text-lg">{progress.stars}</span>
              <span className="text-[11px] font-bold font-tajawal text-amber-100">نَجْمَةً</span>
            </div>

            {/* Gems Counter */}
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30 flex items-center gap-1 shadow-sm">
              <Sparkles className="text-cyan-200" size={18} />
              <span className="font-black font-tajawal text-base sm:text-lg">{progress.gems}</span>
              <span className="text-[11px] font-bold font-tajawal text-amber-100">جَوْهَرَةً</span>
            </div>

            {/* Speech Rate Button */}
            <button
              onClick={handleChangeSpeed}
              type="button"
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold font-tajawal flex items-center gap-1 cursor-pointer transition-all"
              title="تَغْيِيرُ سُرْعَةِ النُّطْقِ"
            >
              <span>النُّطْقُ: {progress.speechRate === 0.65 ? 'بَطِيءٌ' : progress.speechRate === 0.8 ? 'مِثَالِيٌّ' : 'سَرِيعٌ'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              type="button"
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl cursor-pointer transition-all"
              title={progress.soundEnabled ? 'كَتْمُ الصَّوْتِ' : 'تَشْغِيلُ الصَّوْتِ'}
            >
              {progress.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: بطاقات الأزمنة الثلاث ودروس الأفعال */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-baloo text-amber-950">
                دُرُوسُ وَأَزْمِنَةُ الْفِعْلِ الثَّلَاثَةُ
              </h2>
              <p className="text-xs font-bold font-tajawal text-slate-600">
                اخْتَرِ الدَّرْسَ لِلتَّعَلُّمِ مَعَ الْأَمْثِلَةِ الصَّوْتِيَّةِ:
              </p>
            </div>
          </div>

          <SoundButton
            textToSpeak="دُرُوسُ وَأَزْمِنَةُ الْفِعْلِ الثَّلَاثَةُ. الْفِعْلُ الْمَاضِي، الْفِعْلُ الْمُضَارِعُ، وَفِعْلُ الْأَمْرِ."
            size="sm"
            variant="amber"
            label="اِسْتَمِعْ"
            rate={progress.speechRate}
          />
        </div>

        {/* The 3 Core Tense Highlight Cards (Past, Present, Imperative) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* 1. الماضي */}
          <motion.div
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-b from-teal-50 via-emerald-50 to-teal-100/60 rounded-3xl border-3 border-teal-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden min-h-[300px]"
            onClick={() => handleLaunchActivity('lesson-2', 'الْفِعْلُ الْمَاضِي')}
          >
            {progress.completedLessons.includes('lesson-2') && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm">
                <CheckCircle2 size={16} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
                  <History size={28} />
                </div>
                <span className="bg-teal-200 text-teal-950 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full font-tajawal shadow-xs">
                  حَدَثَ وَانْتَهَى
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-baloo text-teal-950 mb-2 tashkeel-text leading-tight">
                الْفِعْلُ الْمَاضِي
              </h3>
              <p className="text-sm sm:text-base font-bold font-tajawal text-slate-700 mb-4 leading-relaxed tashkeel-text">
                عَمَلٌ وَقَعَ وَانْتَهَى فِي الزَّمَنِ الْمَاضِي قَبْلَ وَقْتِ الْكَلَامِ.
              </p>

              {/* Quick Examples Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-teal-950 border-2 border-teal-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  كَتَبَ
                </span>
                <span className="bg-white text-teal-950 border-2 border-teal-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  لَعِبَ
                </span>
                <span className="bg-white text-teal-950 border-2 border-teal-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  أَكَلَ
                </span>
              </div>
            </div>

            <div className="pt-3.5 border-t-2 border-teal-200/90 flex items-center justify-between">
              <span className="text-sm sm:text-base font-black font-tajawal text-teal-900">
                {progress.completedLessons.includes('lesson-2') ? 'مُكْتَمَلٌ' : 'اِبْدَأِ الدَّرْسَ'}
              </span>
              <div className="w-9 h-9 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-md">
                <ArrowLeft size={18} />
              </div>
            </div>
          </motion.div>

          {/* 2. المضارع */}
          <motion.div
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-b from-sky-50 via-blue-50 to-sky-100/60 rounded-3xl border-3 border-sky-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden min-h-[300px]"
            onClick={() => handleLaunchActivity('lesson-3', 'الْفِعْلُ الْمُضَارِعُ')}
          >
            {progress.completedLessons.includes('lesson-3') && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm">
                <CheckCircle2 size={16} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shadow-xs">
                  <Clock size={28} />
                </div>
                <span className="bg-sky-200 text-sky-950 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full font-tajawal shadow-xs">
                  يَحْدُثُ الْآنَ
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-baloo text-sky-950 mb-2 tashkeel-text leading-tight">
                الْفِعْلُ الْمُضَارِعُ
              </h3>
              <p className="text-sm sm:text-base font-bold font-tajawal text-slate-700 mb-4 leading-relaxed tashkeel-text">
                عَمَلٌ يَحْدُثُ الْآنَ فِي الْحَاضِرِ، وَيَبْدَأُ بِـ: (نَـ، أَ، تَـ، يَـ).
              </p>

              {/* Quick Examples Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-sky-950 border-2 border-sky-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  يَكْتُبُ
                </span>
                <span className="bg-white text-sky-950 border-2 border-sky-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  تَلْعَبُ
                </span>
                <span className="bg-white text-sky-950 border-2 border-sky-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  نَقْرَأُ
                </span>
              </div>
            </div>

            <div className="pt-3.5 border-t-2 border-sky-200/90 flex items-center justify-between">
              <span className="text-sm sm:text-base font-black font-tajawal text-sky-900">
                {progress.completedLessons.includes('lesson-3') ? 'مُكْتَمَلٌ' : 'اِبْدَأِ الدَّرْسَ'}
              </span>
              <div className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-md">
                <ArrowLeft size={18} />
              </div>
            </div>
          </motion.div>

          {/* 3. الأمر */}
          <motion.div
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-b from-purple-50 via-violet-50 to-purple-100/60 rounded-3xl border-3 border-purple-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden min-h-[300px]"
            onClick={() => handleLaunchActivity('lesson-4', 'فِعْلُ الْأَمْرِ')}
          >
            {progress.completedLessons.includes('lesson-4') && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm">
                <CheckCircle2 size={16} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
                  <Megaphone size={28} />
                </div>
                <span className="bg-purple-200 text-purple-950 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full font-tajawal shadow-xs">
                  طَلَبُ عَمَلٍ
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-baloo text-purple-950 mb-2 tashkeel-text leading-tight">
                فِعْلُ الْأَمْرِ
              </h3>
              <p className="text-sm sm:text-base font-bold font-tajawal text-slate-700 mb-4 leading-relaxed tashkeel-text">
                طَلَبُ الْقِيَامِ بِعَمَلٍ فِي الْمُسْتَقْبَلِ بِصِيغَةِ الطَّلَبِ الْمُؤَدَّبِ.
              </p>

              {/* Quick Examples Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-purple-950 border-2 border-purple-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  اُكْتُبْ
                </span>
                <span className="bg-white text-purple-950 border-2 border-purple-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  اِلْعَبْ
                </span>
                <span className="bg-white text-purple-950 border-2 border-purple-300 px-3.5 py-1.5 rounded-xl text-base sm:text-lg font-black font-baloo tashkeel-text shadow-sm hover:scale-105 transition-transform">
                  نَمْ بَاكِرًا
                </span>
              </div>
            </div>

            <div className="pt-3.5 border-t-2 border-purple-200/90 flex items-center justify-between">
              <span className="text-sm sm:text-base font-black font-tajawal text-purple-900">
                {progress.completedLessons.includes('lesson-4') ? 'مُكْتَمَلٌ' : 'اِبْدَأِ الدَّرْسَ'}
              </span>
              <div className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md">
                <ArrowLeft size={18} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary Supporting Lessons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* ما هو الفعل */}
          <div
            onClick={() => handleLaunchActivity('lesson-1', 'مَا هُوَ الْفِعْلُ؟')}
            className="p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between fit-screen-card"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 font-tajawal">دَرْسُ التَّمْهِيدِ</span>
                <h4 className="text-base font-black font-baloo text-amber-950">مَا هُوَ الْفِعْلُ؟ (الْفَرْقُ بَيْنَ الْفِعْلِ وَالِاسْمِ)</h4>
              </div>
            </div>
            <ArrowLeft size={16} className="text-amber-500" />
          </div>

          {/* مسرح التحويل */}
          <div
            onClick={() => handleLaunchActivity('lesson-5', 'مَسْرَحُ تَحْوِيلِ الْأَفْعَالِ')}
            className="p-3 bg-white rounded-xl border border-pink-200 hover:border-pink-400 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between fit-screen-card"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-pink-100 text-pink-700 rounded-xl">
                <Wand2 size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-pink-700 font-tajawal">دَرْسُ التَّطْبِيقِ</span>
                <h4 className="text-base font-black font-baloo text-pink-950">مَسْرَحُ تَحْوِيلِ الْأَفْعَالِ (بَيْنَ الْأَزْمِنَةِ)</h4>
              </div>
            </div>
            <ArrowLeft size={16} className="text-pink-500" />
          </div>
        </div>
      </div>

      {/* SECTION 2: بطاقة ألعاب الأفعال التفاعلية الموحدة */}
      <div className="space-y-3 pt-1">
        <motion.div
          id="hub-single-games-card"
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg text-white relative overflow-hidden border-2 border-amber-300 fit-screen-card"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Card Info */}
            <div className="flex items-center gap-3 sm:gap-4 text-center md:text-right w-full md:w-auto justify-center md:justify-start">
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center shadow-md flex-shrink-0">
                <Gamepad2 size={36} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-baloo leading-tight text-white">
                  أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ
                </h2>
                <p className="text-[11px] sm:text-xs font-bold font-tajawal text-amber-100 mt-0.5 leading-relaxed max-w-xl">
                  تَحَدَّ نَفْسَكَ وَارْبَحِ النُّجُومَ وَالْأَوْسِمَةَ الشَّرَفِيَّةَ فِي عَالَمِ الْأَلْعَابِ التَّعْلِيمِيَّةِ الْمُمْتِعَةِ!
                </p>
              </div>
            </div>

            {/* Actions: Sound & Single Enter Button */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-center md:justify-end flex-shrink-0">
              <SoundButton
                textToSpeak="أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ. اضْغَطْ عَلَى الزِّرِّ لِلدُّخُولِ إِلَى قَائِمَةِ الْأَلْعَابِ!"
                size="sm"
                variant="white"
                label="اِسْتَمِعْ"
                rate={progress.speechRate}
              />

              <button
                id="btn-go-to-games-catalog"
                onClick={() => handleLaunchActivity('games-menu', 'أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ')}
                type="button"
                className="bg-white hover:bg-amber-50 text-amber-900 font-tajawal font-black text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky flex-shrink-0"
              >
                <span>اِلْعَبِ الْآنَ</span>
                <Play size={18} className="fill-amber-900 text-amber-900" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 3: المكافآت، الأوسمة، الشهادة، ودليل المعلم والولي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Rewards & Trophy Room */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLaunchActivity('rewards', 'سِجِلُّ الْمُكَافَآتِ وَالْأَوْسِمَةِ')}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-4 shadow-md cursor-pointer flex items-center justify-between fit-screen-card"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Award size={20} className="text-yellow-300" />
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">سِجِلُّ التَّفَوُّقِ</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-baloo">الْأَوْسِمَةُ وَأَلْبُومُ الْمُلْصَقَاتِ</h3>
            <p className="text-[11px] font-bold text-emerald-100 font-tajawal">
              شَاهِدْ أَوْسِمَتَكَ، زَيِّنْ حَدِيقَةَ الْأَفْعَالِ، وَاطْبَعْ شَهَادَتَكَ!
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <ArrowLeft size={18} />
          </div>
        </motion.div>

        {/* Teacher & Parent Guide */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLaunchActivity('guide', 'دَلِيلُ الْمُعَلِّمِ وَالْوَلِيّ')}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl p-4 shadow-md cursor-pointer flex items-center justify-between fit-screen-card"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <GraduationCap size={20} className="text-amber-300" />
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">لِلْآبَاءِ وَالْمُعَلِّمِينَ</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-baloo">دَلِيلُ الْمُعَلِّمِ وَالْوَلِيِّ</h3>
            <p className="text-[11px] font-bold text-purple-100 font-tajawal">
              أَهْدَافُ الْمِنْهَاجِ وَحِيَلٌ ذَهَبِيَّةٌ لِتَسْهِيلِ التَّمْيِيزِ لِلطِّفْلِ.
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <ArrowLeft size={18} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
