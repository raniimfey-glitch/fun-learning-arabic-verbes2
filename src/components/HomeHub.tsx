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
    <div className="space-y-8 pb-12">
      {/* 🌟 Welcome & Kid Profile Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute top-2 left-6 text-2xl opacity-40 animate-twinkle">✨</div>
        <div className="absolute bottom-3 right-10 text-3xl opacity-30 animate-twinkle">🌟</div>
        <div className="absolute top-1/2 left-1/4 text-xl opacity-30 animate-twinkle">💫</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Avatar & Welcome Greeting */}
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="text-5xl sm:text-6xl bg-white/20 p-2.5 rounded-3xl backdrop-blur-xs border-2 border-white/40 shadow-inner flex-shrink-0 animate-bounce-gentle">
              {progress.avatar}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="bg-amber-300 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full font-tajawal">
                  السَّنَةُ الثَّانِيَةُ ابْتِدَائِي
                </span>
                <span className="text-amber-100 text-xs font-bold font-tajawal">
                  بِالْحَرَكَاتِ وَالصَّوْتِ
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-baloo leading-tight">
                أَهْلًا بِكَ يَا بَطَلَنَا: {progress.childName} 👋
              </h1>
              <p className="text-amber-100 text-xs sm:text-sm font-tajawal font-bold mt-0.5">
                تَعَلَّمْ أَقْسَامَ الْفِعْلِ الثَّلَاثَةِ وَالْعَبْ وَارْبَحِ النُّجُومَ وَالْأَوْسِمَةَ!
              </p>
            </div>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* Stars Counter */}
            <div className="bg-white/20 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/30 flex items-center gap-1.5 shadow-sm">
              <Star className="text-yellow-300 fill-yellow-300" size={20} />
              <span className="font-black font-tajawal text-lg">{progress.stars}</span>
              <span className="text-xs font-bold font-tajawal text-amber-100">نَجْمَةً</span>
            </div>

            {/* Gems Counter */}
            <div className="bg-white/20 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/30 flex items-center gap-1.5 shadow-sm">
              <span className="text-lg">💎</span>
              <span className="font-black font-tajawal text-lg">{progress.gems}</span>
              <span className="text-xs font-bold font-tajawal text-amber-100">جَوْهَرَةً</span>
            </div>

            {/* Speech Rate Button */}
            <button
              onClick={handleChangeSpeed}
              type="button"
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-2xl text-xs font-bold font-tajawal flex items-center gap-1 cursor-pointer transition-all"
              title="تَغْيِيرُ سُرْعَةِ النُّطْقِ"
            >
              <span>⚡ سُرْعَةُ النُّطْقِ: {progress.speechRate === 0.65 ? 'بَطِيئَةٌ' : progress.speechRate === 0.8 ? 'مِثَالِيَّةٌ' : 'سَرِيعَةٌ'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              type="button"
              className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-2xl cursor-pointer transition-all"
              title={progress.soundEnabled ? 'كَتْمُ الصَّوْتِ' : 'تَشْغِيلُ الصَّوْتِ'}
            >
              {progress.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* 📚 SECTION 1: بطاقات الأزمنة الثلاث ودروس الأفعال (The 3 Main Tense Cards & Lessons) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-baloo text-amber-950">
                دُرُوسُ وَأَزْمِنَةُ الْفِعْلِ الثَّلَاثَةُ
              </h2>
              <p className="text-xs sm:text-sm font-bold font-tajawal text-slate-600">
                اخْتَرِ الدَّرْسَ الَّذِي تُرِيدُ تَعَلُّمَهُ مَعَ الْأَمْثِلَةِ الصَّوْتِيَّةِ وَالتَّدْرِيبَاتِ:
              </p>
            </div>
          </div>

          <SoundButton
            textToSpeak="دُرُوسُ وَأَزْمِنَةُ الْفِعْلِ الثَّلَاثَةُ. الْفِعْلُ الْمَاضِي، الْفِعْلُ الْمُضَارِعُ، وَفِعْلُ الْأَمْرِ."
            size="md"
            variant="amber"
            label="اِسْتَمِعْ"
            rate={progress.speechRate}
          />
        </div>

        {/* The 3 Core Tense Highlight Cards (Past, Present, Imperative) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* 1. الماضي */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-b from-teal-50 to-emerald-50 rounded-3xl border-3 border-teal-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
            onClick={() => handleLaunchActivity('lesson-2', 'الْفِعْلُ الْمَاضِي')}
          >
            {progress.completedLessons.includes('lesson-2') && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                <CheckCircle2 size={16} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">⏳</span>
                <span className="bg-teal-200 text-teal-950 text-xs font-black px-3 py-1 rounded-full font-tajawal">
                  حَدَثَ وَانْتَهَى
                </span>
              </div>

              <h3 className="text-2xl font-black font-baloo text-teal-950 mb-1 tashkeel-text">
                الْفِعْلُ الْمَاضِي
              </h3>
              <p className="text-xs font-bold font-tajawal text-slate-600 mb-4 leading-relaxed">
                عَمَلٌ وَقَعَ وَانْتَهَى فِي الزَّمَنِ الْمَاضِي قَبْلَ وَقْتِ الْكَلَامِ.
              </p>

              {/* Quick Examples Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-teal-900 border border-teal-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  كَتَبَ ✍️
                </span>
                <span className="bg-white text-teal-900 border border-teal-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  لَعِبَ ⚽
                </span>
                <span className="bg-white text-teal-900 border border-teal-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  أَكَلَ 🍎
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-teal-200/80 flex items-center justify-between">
              <span className="text-xs font-black font-tajawal text-teal-800">
                {progress.completedLessons.includes('lesson-2') ? 'مُكْتَمَلٌ ✨' : 'اِبْدَأِ الدَّرْسَ'}
              </span>
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <ArrowLeft size={16} />
              </div>
            </div>
          </motion.div>

          {/* 2. المضارع */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl border-3 border-sky-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
            onClick={() => handleLaunchActivity('lesson-3', 'الْفِعْلُ الْمُضَارِعُ')}
          >
            {progress.completedLessons.includes('lesson-3') && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                <CheckCircle2 size={16} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">⏰</span>
                <span className="bg-sky-200 text-sky-950 text-xs font-black px-3 py-1 rounded-full font-tajawal">
                  يَحْدُثُ الْآنَ
                </span>
              </div>

              <h3 className="text-2xl font-black font-baloo text-sky-950 mb-1 tashkeel-text">
                الْفِعْلُ الْمُضَارِعُ
              </h3>
              <p className="text-xs font-bold font-tajawal text-slate-600 mb-4 leading-relaxed">
                عَمَلٌ يَحْدُثُ الْآنَ فِي الْحَاضِرِ، وَيَبْدَأُ بِـ: (نَـ، أَ، تَـ، يَـ).
              </p>

              {/* Quick Examples Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-sky-900 border border-sky-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  يَكْتُبُ 📝
                </span>
                <span className="bg-white text-sky-900 border border-sky-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  تَلْعَبُ 🏃‍♀️
                </span>
                <span className="bg-white text-sky-900 border border-sky-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  نَقْرَأُ 📖
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-sky-200/80 flex items-center justify-between">
              <span className="text-xs font-black font-tajawal text-sky-800">
                {progress.completedLessons.includes('lesson-3') ? 'مُكْتَمَلٌ ✨' : 'اِبْدَأِ الدَّرْسَ'}
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-sm">
                <ArrowLeft size={16} />
              </div>
            </div>
          </motion.div>

          {/* 3. الأمر */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-b from-purple-50 to-violet-50 rounded-3xl border-3 border-purple-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
            onClick={() => handleLaunchActivity('lesson-4', 'فِعْلُ الْأَمْرِ')}
          >
            {progress.completedLessons.includes('lesson-4') && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                <CheckCircle2 size={16} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">📢</span>
                <span className="bg-purple-200 text-purple-950 text-xs font-black px-3 py-1 rounded-full font-tajawal">
                  طَلَبُ عَمَلٍ
                </span>
              </div>

              <h3 className="text-2xl font-black font-baloo text-purple-950 mb-1 tashkeel-text">
                فِعْلُ الْأَمْرِ
              </h3>
              <p className="text-xs font-bold font-tajawal text-slate-600 mb-4 leading-relaxed">
                طَلَبُ الْقِيَامِ بِعَمَلٍ فِي الْمُسْتَقْبَلِ بِصِيغَةِ الطَّلَبِ الْمُؤَدَّبِ.
              </p>

              {/* Quick Examples Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-purple-900 border border-purple-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  اُكْتُبْ ✏️
                </span>
                <span className="bg-white text-purple-900 border border-purple-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  اِلْعَبْ 🏃‍♂️
                </span>
                <span className="bg-white text-purple-900 border border-purple-300 px-3 py-1 rounded-xl text-base font-black font-baloo tashkeel-text shadow-xs">
                  نَمْ بَاكِرًا 🛌
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-200/80 flex items-center justify-between">
              <span className="text-xs font-black font-tajawal text-purple-800">
                {progress.completedLessons.includes('lesson-4') ? 'مُكْتَمَلٌ ✨' : 'اِبْدَأِ الدَّرْسَ'}
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <ArrowLeft size={16} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary Supporting Lessons (Intro: ما هو الفعل & Advanced: مسرح التحويل) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* ما هو الفعل */}
          <div
            onClick={() => handleLaunchActivity('lesson-1', 'مَا هُوَ الْفِعْلُ؟')}
            className="p-4 bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-amber-100 p-2 rounded-2xl">🌱</span>
              <div>
                <span className="text-xs font-bold text-amber-700 font-tajawal">دَرْسُ التَّمْهِيدِ</span>
                <h4 className="text-lg font-black font-baloo text-amber-950">مَا هُوَ الْفِعْلُ؟ (الْفَرْقُ بَيْنَ الْفِعْلِ وَالِاسْمِ)</h4>
              </div>
            </div>
            <ArrowLeft size={18} className="text-amber-500" />
          </div>

          {/* مسرح التحويل */}
          <div
            onClick={() => handleLaunchActivity('lesson-5', 'مَسْرَحُ تَحْوِيلِ الْأَفْعَالِ')}
            className="p-4 bg-white rounded-2xl border-2 border-pink-200 hover:border-pink-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-pink-100 p-2 rounded-2xl">🎭</span>
              <div>
                <span className="text-xs font-bold text-pink-700 font-tajawal">دَرْسُ التَّطْبِيقِ</span>
                <h4 className="text-lg font-black font-baloo text-pink-950">مَسْرَحُ تَحْوِيلِ الْأَفْعَالِ (بَيْنَ الْأَزْمِنَةِ)</h4>
              </div>
            </div>
            <ArrowLeft size={18} className="text-pink-500" />
          </div>
        </div>
      </div>

      {/* 🎮 SECTION 2: بطاقة ألعاب الأفعال التفاعلية الموحدة (Single Games Card) */}
      <div className="space-y-4 pt-2">
        <motion.div
          id="hub-single-games-card"
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden border-3 border-amber-300"
        >
          {/* Decorative Sparkles in Background */}
          <div className="absolute top-3 left-8 text-3xl opacity-30">🎮</div>
          <div className="absolute bottom-4 right-8 text-4xl opacity-25">🌟</div>
          <div className="absolute top-1/2 left-1/4 text-2xl opacity-20">✨</div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Card Info */}
            <div className="flex items-center gap-4 sm:gap-5 text-center md:text-right w-full md:w-auto justify-center md:justify-start">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-md flex-shrink-0">
                🎮
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-baloo leading-tight text-white">
                  أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ
                </h2>
                <p className="text-xs sm:text-sm font-bold font-tajawal text-amber-100 mt-1 leading-relaxed max-w-xl">
                  تَحَدَّ نَفْسَكَ وَارْبَحِ النُّجُومَ وَالْأَوْسِمَةَ الشَّرَفِيَّةَ فِي عَالَمِ الْأَلْعَابِ التَّعْلِيمِيَّةِ الْمُمْتِعَةِ!
                </p>
              </div>
            </div>

            {/* Actions: Sound & Single Enter Button */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end flex-shrink-0">
              <SoundButton
                textToSpeak="أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ. اضْغَطْ عَلَى الزِّرِّ لِلدُّخُولِ إِلَى قَائِمَةِ الْأَلْعَابِ!"
                size="md"
                variant="white"
                label="اِسْتَمِعْ"
                rate={progress.speechRate}
              />

              <button
                id="btn-go-to-games-catalog"
                onClick={() => handleLaunchActivity('games-menu', 'أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ')}
                type="button"
                className="bg-white hover:bg-amber-50 text-amber-900 font-tajawal font-black text-base sm:text-lg px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky flex-shrink-0"
              >
                <span>اِلْعَبِ الْآنَ</span>
                <Play size={22} className="fill-amber-900 text-amber-900" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 🏆 SECTION 3: المكافآت، الأوسمة، الشهادة، ودليل المعلم والولي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Rewards & Trophy Room */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLaunchActivity('rewards', 'سِجِلُّ الْمُكَافَآتِ وَالْأَوْسِمَةِ')}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-lg cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award size={24} className="text-yellow-300" />
              <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full">سِجِلُّ التَّفَوُّقِ</span>
            </div>
            <h3 className="text-2xl font-black font-baloo">الْأَوْسِمَةُ وَأَلْبُومُ الْمُلْصَقَاتِ 🎨</h3>
            <p className="text-xs font-bold text-emerald-100 font-tajawal">
              شَاهِدْ أَوْسِمَتَكَ، زَيِّنْ حَدِيقَةَ الْأَفْعَالِ، وَاطْبَعْ شَهَادَتَكَ!
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <ArrowLeft size={24} />
          </div>
        </motion.div>

        {/* Teacher & Parent Guide */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLaunchActivity('guide', 'دَلِيلُ الْمُعَلِّمِ وَالْوَلِيّ')}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <GraduationCap size={24} className="text-amber-300" />
              <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full">لِلْآبَاءِ وَالْمُعَلِّمِينَ</span>
            </div>
            <h3 className="text-2xl font-black font-baloo">دَلِيلُ الْمُعَلِّمِ وَالْوَلِيِّ 👨‍🏫</h3>
            <p className="text-xs font-bold text-purple-100 font-tajawal">
              أَهْدَافُ الْمِنْهَاجِ وَحِيَلٌ ذَهَبِيَّةٌ لِتَسْهِيلِ التَّمْيِيزِ لِلطِّفْلِ.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <ArrowLeft size={24} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
