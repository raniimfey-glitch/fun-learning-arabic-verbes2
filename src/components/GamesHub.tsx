import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProgress } from '../types';
import { WordHunterGame } from './games/WordHunterGame';
import { TimeSortingGame } from './games/TimeSortingGame';
import { SentenceCompletionGame } from './games/SentenceCompletionGame';
import { MagicTransformerGame } from './games/MagicTransformerGame';
import { ChampionsQuizGame } from './games/ChampionsQuizGame';
import { Mascot } from './Mascot';
import { Target, Clock, BookOpen, Wand2, Trophy, Star, Play, Sparkles } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../utils/audio';

type ActiveGame = 'menu' | 'hunter' | 'sorter' | 'completer' | 'transformer' | 'quiz';

interface GamesHubProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onGoToRewards: () => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  progress,
  onUpdateProgress,
  onGoToRewards
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');

  const gamesList = [
    {
      id: 'hunter' as ActiveGame,
      title: 'صَائِدُ الْأَفْعَالِ',
      subtitle: 'اِصْطَدِ الْأَفْعَالَ وَاتْرُكِ الْأَسْمَاءَ وَالْحُرُوفَ!',
      icon: '🎯',
      starsReward: 20,
      badge: 'الْمُسْتَوَى 1',
      bgGradient: 'from-amber-400 to-orange-500',
      cardBg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-300',
      buttonBg: 'bg-amber-500 hover:bg-amber-600',
      score: progress.gameScores.hunter || 0
    },
    {
      id: 'sorter' as ActiveGame,
      title: 'صُنْدُوقُ الْأَزْمِنَةِ',
      subtitle: 'صَنِّفِ الْأَفْعَالَ فِي صَنَادِيقِ (مَاضٍ ⏳ | مُضَارِعٌ ⏰ | أَمْرٌ 📢)',
      icon: '⏳',
      starsReward: 25,
      badge: 'الْمُسْتَوَى 2',
      bgGradient: 'from-teal-400 to-emerald-600',
      cardBg: 'bg-teal-50 hover:bg-teal-100/70 border-teal-300',
      buttonBg: 'bg-teal-600 hover:bg-teal-700',
      score: progress.gameScores.sorter || 0
    },
    {
      id: 'completer' as ActiveGame,
      title: 'أَكْمِلِ الْجُمْلَةَ بِالْفِعْلِ',
      subtitle: 'اِخْتَرِ الْفِعْلَ الصَّحِيحَ لِمَلْءِ فَرَاغِ الْقِصَّةِ!',
      icon: '🧩',
      starsReward: 25,
      badge: 'الْمُسْتَوَى 3',
      bgGradient: 'from-indigo-400 to-sky-600',
      cardBg: 'bg-indigo-50 hover:bg-indigo-100/70 border-indigo-300',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
      score: progress.gameScores.completer || 0
    },
    {
      id: 'transformer' as ActiveGame,
      title: 'عَصَا التَّحْوِيلِ السِّحْرِيَّةِ',
      subtitle: 'حَوِّلِ الْفِعْلَ بَيْنَ الْمَاضِي وَالْمُضَارِعِ وَالْأَمْرِ كَالسَّاحِرِ!',
      icon: '🪄',
      starsReward: 30,
      badge: 'الْمُسْتَوَى 4',
      bgGradient: 'from-pink-400 to-rose-600',
      cardBg: 'bg-pink-50 hover:bg-pink-100/70 border-pink-300',
      buttonBg: 'bg-pink-600 hover:bg-pink-700',
      score: progress.gameScores.transformer || 0
    },
    {
      id: 'quiz' as ActiveGame,
      title: 'تَحَدِّي أَبْطَالِ الْأَفْعَالِ',
      subtitle: 'اخْتِبَارُ الْعَبَاقِرَةِ لِرِبْحِ كَأْسِ التَّفَوُّقِ وَشَهَادَةِ الشَّرَفِ!',
      icon: '🏆',
      starsReward: 50,
      badge: 'التَّحَدِّي الْأَكْبَر',
      bgGradient: 'from-yellow-400 to-amber-600',
      cardBg: 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-400',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
      score: progress.gameScores.quiz || 0
    }
  ];

  const handleLaunchGame = (gameId: ActiveGame) => {
    soundEffects.playStarEarned();
    setActiveGame(gameId);
    const selected = gamesList.find(g => g.id === gameId);
    if (selected) {
      ArabicSpeechEngine.speak(`هَيَّا نَلْعَبْ: ${selected.title}. ${selected.subtitle}`, progress.speechRate);
    }
  };

  if (activeGame === 'hunter') {
    return (
      <WordHunterGame
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onBackToMenu={() => setActiveGame('menu')}
      />
    );
  }

  if (activeGame === 'sorter') {
    return (
      <TimeSortingGame
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onBackToMenu={() => setActiveGame('menu')}
      />
    );
  }

  if (activeGame === 'completer') {
    return (
      <SentenceCompletionGame
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onBackToMenu={() => setActiveGame('menu')}
      />
    );
  }

  if (activeGame === 'transformer') {
    return (
      <MagicTransformerGame
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onBackToMenu={() => setActiveGame('menu')}
      />
    );
  }

  if (activeGame === 'quiz') {
    return (
      <ChampionsQuizGame
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onBackToMenu={() => setActiveGame('menu')}
        onGoToRewards={onGoToRewards}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Friendly Mascot Intro */}
      <Mascot
        message={`هَيَّا يَا ${progress.childName}! اخْتَر لُعْبَةً مِنْ أَلْعَابِ الْأَفْعَالِ لِتَرْبَحَ النُّجُومَ وَتَفْتَحَ الْمُلْصَقَاتِ وَالشَّارَاتِ!`}
        mood="happy"
      />

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {gamesList.map((game, idx) => (
          <motion.div
            key={game.id}
            id={`game-card-${game.id}`}
            whileHover={{ scale: 1.02 }}
            className={`p-5 sm:p-6 rounded-3xl border-3 ${game.cardBg} shadow-md flex flex-col justify-between transition-all ${
              idx === gamesList.length - 1 ? 'md:col-span-2' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-white/90 text-slate-800 border border-slate-200 font-tajawal shadow-xs">
                  {game.badge}
                </span>

                <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl text-amber-900 font-bold text-xs font-tajawal">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>+{game.starsReward} نَجْمَةً</span>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-3">
                <div className="text-4xl sm:text-5xl flex-shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                  {game.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-baloo text-slate-900 tashkeel-text leading-tight">
                    {game.title}
                  </h3>
                  <p className="text-sm font-bold font-tajawal text-slate-600 mt-1">
                    {game.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-bold font-tajawal text-slate-500">
                {game.score > 0 ? `أُنْجِزَتْ ${game.score} مَرَّاتٍ ✨` : 'لَمْ تُجَرَّبْ بَعْدُ'}
              </span>

              <button
                id={`launch-game-btn-${game.id}`}
                onClick={() => handleLaunchGame(game.id)}
                type="button"
                className={`${game.buttonBg} text-white font-tajawal font-bold text-base px-6 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky`}
              >
                <Play size={18} className="fill-white" />
                <span>اِلْعَبِ الْآنَ</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
