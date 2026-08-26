import React from 'react';
import { motion } from 'motion/react';
import { ActivityId, UserProgress } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { LessonsView } from './LessonsView';
import { WordHunterGame } from './games/WordHunterGame';
import { TimeSortingGame } from './games/TimeSortingGame';
import { SentenceCompletionGame } from './games/SentenceCompletionGame';
import { MagicTransformerGame } from './games/MagicTransformerGame';
import { ChampionsQuizGame } from './games/ChampionsQuizGame';
import { RewardsView } from './RewardsView';
import { ParentTeacherGuide } from './ParentTeacherGuide';
import { Home, ArrowRight, Star, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface ActivityViewProps {
  activityId: ActivityId;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToHub: () => void;
  onOpenActivity: (id: ActivityId) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  activityId,
  progress,
  onUpdateProgress,
  onBackToHub,
  onOpenActivity
}) => {
  const getActivityHeaderInfo = () => {
    switch (activityId) {
      case 'lesson-1':
        return { title: 'مَا هُوَ الْفِعْلُ؟', badge: 'دَرْسُ التَّمْهِيدِ', emoji: '🌱' };
      case 'lesson-2':
        return { title: 'الْفِعْلُ الْمَاضِي', badge: 'دَرْسُ الْأَزْمِنَةِ', emoji: '⏳' };
      case 'lesson-3':
        return { title: 'الْفِعْلُ الْمُضَارِعُ', badge: 'دَرْسُ الْأَزْمِنَةِ', emoji: '⏰' };
      case 'lesson-4':
        return { title: 'فِعْلُ الْأَمْرِ', badge: 'دَرْسُ الْأَزْمِنَةِ', emoji: '📢' };
      case 'lesson-5':
        return { title: 'مَسْرَحُ تَحْوِيلِ الْأَفْعَالِ', badge: 'دَرْسُ التَّطْبِيقِ', emoji: '🎭' };
      case 'game-hunter':
        return { title: 'صَائِدُ الْأَفْعَالِ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ', emoji: '🎯' };
      case 'game-sorter':
        return { title: 'صُنْدُوقُ الْأَزْمِنَةِ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ', emoji: '⏳' };
      case 'game-completer':
        return { title: 'أَكْمِلِ الْجُمْلَةَ بِالْفِعْلِ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ', emoji: '🧩' };
      case 'game-transformer':
        return { title: 'عَصَا التَّحْوِيلِ السِّحْرِيَّةِ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ', emoji: '🪄' };
      case 'game-quiz':
        return { title: 'تَحَدِّي أَبْطَالِ الْأَفْعَالِ الْكَبِيرِ', badge: 'اخْتِبَارُ التَّفَوُّقِ', emoji: '🏆' };
      case 'rewards':
        return { title: 'سِجِلُّ الْأَوْسِمَةِ وَالْمُكَافَآتِ', badge: 'أَلْبُومُ التَّفَوُّقِ', emoji: '🎨' };
      case 'guide':
        return { title: 'دَلِيلُ الْمُعَلِّمِ وَالْوَلِيِّ', badge: 'إِرْشَادَاتٌ تَرْبَوِيَّةٌ', emoji: '👨‍🏫' };
      default:
        return { title: 'النَّشَاطُ التَّعْلِيمِيُّ', badge: 'تَعَلَّمْ وَالْعَبْ', emoji: '⭐' };
    }
  };

  const headerInfo = getActivityHeaderInfo();

  const handleBackClick = () => {
    soundEffects.playClick();
    onBackToHub();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🧭 Top Dedicated Navigation Bar with Prominent Back Button */}
      <div className="bg-white rounded-3xl border-3 border-amber-300 shadow-md p-3 sm:p-4 flex items-center justify-between gap-3 sticky top-3 z-30">
        {/* Prominent Back Button */}
        <button
          id="btn-back-to-hub"
          onClick={handleBackClick}
          type="button"
          className="bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky flex-shrink-0"
        >
          <Home size={18} />
          <span>الْقَائِمَةُ الرَّئِيسِيَّةُ</span>
        </button>

        {/* Activity Name & Badge in Middle */}
        <div className="text-center truncate px-2">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-lg sm:text-xl">{headerInfo.emoji}</span>
            <h2 className="text-base sm:text-xl font-black font-baloo text-amber-950 truncate">
              {headerInfo.title}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-tajawal inline-block">
            {headerInfo.badge}
          </span>
        </div>

        {/* Live Kid Stars */}
        <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-amber-900 font-black font-tajawal text-xs sm:text-sm flex-shrink-0">
          <Star className="text-amber-500 fill-amber-500" size={16} />
          <span>{progress.stars}</span>
        </div>
      </div>

      {/* 🎯 Isolated Activity Content */}
      <div className="transition-all duration-300">
        {/* Lessons: Display only the selected tense / lesson */}
        {activityId.startsWith('lesson-') && (
          <LessonsView
            lessonId={activityId}
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onGoToGames={() => onOpenActivity('game-hunter')}
            onBackToMenu={onBackToHub}
          />
        )}

        {/* Game 1: Word Hunter */}
        {activityId === 'game-hunter' && (
          <WordHunterGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={onBackToHub}
          />
        )}

        {/* Game 2: Time Sorter */}
        {activityId === 'game-sorter' && (
          <TimeSortingGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={onBackToHub}
          />
        )}

        {/* Game 3: Sentence Completion */}
        {activityId === 'game-completer' && (
          <SentenceCompletionGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={onBackToHub}
          />
        )}

        {/* Game 4: Magic Transformer */}
        {activityId === 'game-transformer' && (
          <MagicTransformerGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={onBackToHub}
          />
        )}

        {/* Game 5: Champions Quiz */}
        {activityId === 'game-quiz' && (
          <ChampionsQuizGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={onBackToHub}
            onGoToRewards={() => onOpenActivity('rewards')}
          />
        )}

        {/* Rewards & Trophy Room */}
        {activityId === 'rewards' && (
          <RewardsView
            progress={progress}
            onUpdateProgress={onUpdateProgress}
          />
        )}

        {/* Parent & Teacher Guide */}
        {activityId === 'guide' && (
          <ParentTeacherGuide />
        )}
      </div>
    </div>
  );
};
