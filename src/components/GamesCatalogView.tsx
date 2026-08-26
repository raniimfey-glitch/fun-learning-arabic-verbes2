import React from 'react';
import { motion } from 'motion/react';
import { ActivityId, UserProgress } from '../types';
import { SoundButton } from './SoundButton';
import { Mascot } from './Mascot';
import { Home, Play, Star, Trophy, Sparkles, ArrowLeft, Award } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../utils/audio';

interface GamesCatalogViewProps {
  progress: UserProgress;
  onSelectGame: (gameId: ActivityId) => void;
  onBackToHub: () => void;
  onGoToRewards?: () => void;
}

export const GamesCatalogView: React.FC<GamesCatalogViewProps> = ({
  progress,
  onSelectGame,
  onBackToHub,
  onGoToRewards
}) => {
  const gamesList = [
    {
      id: 'game-hunter' as ActivityId,
      title: 'صَيَّادُ الْأَفْعَالِ',
      subtitle: 'اِصْطَدِ الْأَفْعَالَ وَمَيِّزْهَا عَنِ الْأَسْمَاءِ وَالْحُرُوفِ فِي الْغَابَةِ السِّحْرِيَّةِ!',
      icon: '🎯',
      badge: 'الْمَرْحَلَةُ 1',
      starsReward: 20,
      color: 'text-amber-950',
      bgGradient: 'bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50',
      borderCol: 'border-amber-300 hover:border-amber-500',
      btnBg: 'bg-amber-500 hover:bg-amber-600',
      scoreKey: 'hunter' as const,
      btnLabel: 'الْعَبْ صَيَّادَ الْأَفْعَالِ 🎯'
    },
    {
      id: 'game-sorter' as ActivityId,
      title: 'صُنْدُوقُ الْأَزْمِنَةِ',
      subtitle: 'صَنِّفِ الْأَفْعَالَ فِي صَنَادِيقِ الْأَزْمِنَةِ: (مَاضٍ ⏳ | مُضَارِعٌ ⏰ | أَمْرٌ 📢)!',
      icon: '⏳',
      badge: 'الْمَرْحَلَةُ 2',
      starsReward: 25,
      color: 'text-teal-950',
      bgGradient: 'bg-gradient-to-br from-teal-50 via-emerald-50/60 to-cyan-50',
      borderCol: 'border-teal-300 hover:border-teal-500',
      btnBg: 'bg-teal-600 hover:bg-teal-700',
      scoreKey: 'sorter' as const,
      btnLabel: 'الْعَبْ صُنْدُوقَ الْأَزْمِنَةِ ⏳'
    },
    {
      id: 'game-completer' as ActivityId,
      title: 'أَكْمِلِ الْجُمْلَةَ بِالْفِعْلِ',
      subtitle: 'اِخْتَرِ الْفِعْلَ الصَّحِيحَ لِمَلْءِ فَرَاغِ الْجُمْلَةِ وَإِكْمَالِ مَعْنَاهَا بِدِقَّةٍ!',
      icon: '🧩',
      badge: 'الْمَرْحَلَةُ 3',
      starsReward: 25,
      color: 'text-indigo-950',
      bgGradient: 'bg-gradient-to-br from-indigo-50 via-sky-50/60 to-blue-50',
      borderCol: 'border-indigo-300 hover:border-indigo-500',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700',
      scoreKey: 'completer' as const,
      btnLabel: 'الْعَبْ أَكْمِلِ الْجُمْلَةَ 🧩'
    },
    {
      id: 'game-transformer' as ActivityId,
      title: 'عَصَا التَّحْوِيلِ السِّحْرِيَّةُ',
      subtitle: 'حَوِّلِ الْفِعْلَ بِسِحْرِكَ بَيْنَ الْمَاضِي وَالْمُضَارِعِ وَالْأَمْرِ كَالسَّاحِرِ الذَّكِيِّ!',
      icon: '🪄',
      badge: 'الْمَرْحَلَةُ 4',
      starsReward: 30,
      color: 'text-pink-950',
      bgGradient: 'bg-gradient-to-br from-pink-50 via-rose-50/60 to-purple-50',
      borderCol: 'border-pink-300 hover:border-pink-500',
      btnBg: 'bg-pink-600 hover:bg-pink-700',
      scoreKey: 'transformer' as const,
      btnLabel: 'الْعَبْ عَصَا التَّحْوِيلِ 🪄'
    },
    {
      id: 'game-quiz' as ActivityId,
      title: 'تَحَدِّي الْأَبْطَالِ الْكَبِيرُ',
      subtitle: 'اخْتِبَارُ الْعَبَاقِرَةِ الشَّامِلُ فِي جَمِيعِ الْأَفْعَالِ لِرِبْحِ الْكَأْسِ وَالشَّهَادَةِ!',
      icon: '🏆',
      badge: 'التَّحَدِّي الْأَكْبَرُ 👑',
      starsReward: 50,
      color: 'text-amber-950',
      bgGradient: 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100',
      borderCol: 'border-amber-400 hover:border-amber-600',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
      scoreKey: 'quiz' as const,
      btnLabel: 'اِبْدَأْ تَحَدِّيَ الْأَبْطَالِ 🏆'
    }
  ];

  const handleSelect = (gameId: ActivityId, gameTitle: string) => {
    soundEffects.playStarEarned();
    ArabicSpeechEngine.speak(`هَيَّا نَلْعَبْ: ${gameTitle}!`, progress.speechRate);
    onSelectGame(gameId);
  };

  const handleReturnHome = () => {
    soundEffects.playClick();
    ArabicSpeechEngine.stop();
    onBackToHub();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 🧭 Top Navigation Bar */}
      <div className="bg-white rounded-3xl border-3 border-amber-300 shadow-md p-3 sm:p-4 flex items-center justify-between gap-3">
        {/* Back to Home Hub Button */}
        <button
          id="btn-catalog-back-home"
          onClick={handleReturnHome}
          type="button"
          className="bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky flex-shrink-0"
        >
          <Home size={18} />
          <span>الْوَاجِهَةُ الرَّئِيسِيَّةُ</span>
        </button>

        {/* Title */}
        <div className="text-center truncate px-2">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl sm:text-2xl">🎮</span>
            <h1 className="text-lg sm:text-2xl font-black font-baloo text-amber-950 truncate">
              أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةُ
            </h1>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full font-tajawal inline-block">
            5 أَلْعَابٍ تَعْلِيمِيَّةٍ مُمْتِعَةٍ
          </span>
        </div>

        {/* Stars Counter & Audio */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SoundButton
            textToSpeak="قَائِمَةُ أَلْعَابِ الْأَفْعَالِ التَّفَاعُلِيَّةِ. اخْتَرِ اللَّعْبَةَ الَّتِي تُرِيدُهَا لِتَبْدَأَ التَّحَدِّيَ وَتَرْبَحَ النُّجُومَ!"
            size="md"
            variant="amber"
            label="اِسْتَمِعْ"
            rate={progress.speechRate}
          />
          <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-amber-900 font-black font-tajawal text-xs sm:text-sm">
            <Star className="text-amber-500 fill-amber-500" size={16} />
            <span>{progress.stars}</span>
          </div>
        </div>
      </div>

      {/* 🦁 Friendly Mascot Greeting */}
      <Mascot
        message={`هَيَّا يَا بَطَلَنَا ${progress.childName}! اخْتَرْ لُعْبَةً مِنْ بَيْنِ الْأَلْعَابِ الْخَمْسِ لِتَبْدَأَ التَّحَدِّيَ وَتَرْبَحَ النُّجُومَ وَتَفْتَحَ الْمُلْصَقَاتِ السِّحْرِيَّةَ! 🌟`}
        mood="excited"
      />

      {/* 🎮 The 5 Interactive Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {gamesList.map((game, idx) => {
          const userScore = progress.gameScores[game.scoreKey] || 0;
          const isGrandQuiz = game.id === 'game-quiz';

          return (
            <motion.div
              key={game.id}
              id={`game-catalog-card-${game.id}`}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-3xl border-3 ${game.borderCol} ${game.bgGradient} p-5 sm:p-7 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative group ${
                isGrandQuiz ? 'md:col-span-2' : ''
              }`}
            >
              <div>
                {/* Top Badge & Star Reward */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-white/90 text-slate-800 text-xs font-black px-3 py-1 rounded-full font-tajawal border border-slate-200 shadow-xs">
                    {game.badge}
                  </span>

                  <div className="flex items-center gap-1.5 bg-white/90 border border-amber-300 px-3 py-1 rounded-xl text-amber-900 font-black text-xs font-tajawal shadow-xs">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span>+{game.starsReward} نَجْمَةً</span>
                  </div>
                </div>

                {/* Card Icon & Titles */}
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-5xl sm:text-6xl p-3 bg-white rounded-3xl shadow-sm border border-slate-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <div>
                    <h2 className={`text-2xl sm:text-3xl font-black font-baloo ${game.color} leading-tight tashkeel-text`}>
                      {game.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-bold font-tajawal text-slate-600 mt-1.5 leading-relaxed">
                      {game.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress & Launch Button */}
              <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold font-tajawal text-slate-600">
                  <Trophy size={16} className="text-amber-500" />
                  <span>
                    {userScore > 0 ? `أُنْجِزَتْ ${userScore} مَرَّاتٍ بِتَفَوُّقٍ ✨` : 'لَمْ تُجَرَّبْ بَعْدُ'}
                  </span>
                </div>

                <button
                  id={`btn-launch-${game.id}`}
                  onClick={() => handleSelect(game.id, game.title)}
                  type="button"
                  className={`${game.btnBg} text-white font-tajawal font-black text-sm sm:text-base px-6 py-3 rounded-2xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky`}
                >
                  <Play size={18} className="fill-white" />
                  <span>{game.btnLabel}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rewards Album Shortcut */}
      {onGoToRewards && (
        <div className="pt-2">
          <div
            onClick={() => {
              soundEffects.playClick();
              onGoToRewards();
            }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                📜
              </div>
              <div>
                <h3 className="text-xl font-black font-baloo">شَاهِدْ شَهَادَةَ التَّفَوُّقِ وَأَلْبُومَ الْمُلْصَقَاتِ 🎨</h3>
                <p className="text-xs font-bold font-tajawal text-emerald-100">
                  كُلَّمَا لَعِبْتَ أَلْعَابًا أَكْثَرَ، فَتَحْتَ شَارَاتٍ وَمُلْصَقَاتٍ جَدِيدَةً!
                </p>
              </div>
            </div>
            <ArrowLeft size={22} className="text-emerald-100" />
          </div>
        </div>
      )}
    </div>
  );
};
