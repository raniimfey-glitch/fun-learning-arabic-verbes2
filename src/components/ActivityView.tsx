import React from 'react';
import { motion } from 'motion/react';
import { ActivityId, UserProgress } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { LessonsView } from './LessonsView';
import { GamesCatalogView } from './GamesCatalogView';
import { WordHunterGame } from './games/WordHunterGame';
import { TimeSortingGame } from './games/TimeSortingGame';
import { SentenceCompletionGame } from './games/SentenceCompletionGame';
import { MagicTransformerGame } from './games/MagicTransformerGame';
import { ChampionsQuizGame } from './games/ChampionsQuizGame';
import { RewardsView } from './RewardsView';
import { ParentTeacherGuide } from './ParentTeacherGuide';
import { Home, ArrowRight, Star, Sparkles, Gamepad2, ArrowLeft } from 'lucide-react';
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
  const isGameActivity = [
    'game-hunter',
    'game-sorter',
    'game-completer',
    'game-transformer',
    'game-quiz'
  ].includes(activityId);

  const getActivityHeaderInfo = () => {
    switch (activityId) {
      case 'lesson-1':
        return { title: 'مَا هُوَ الْفِعْلُ؟', badge: 'دَرْسُ التَّمْهِيدِ' };
      case 'lesson-2':
        return { title: 'الْفِعْلُ الْمَاضِي', badge: 'دَرْسُ الْأَزْمِنَةِ' };
      case 'lesson-3':
        return { title: 'الْفِعْلُ الْمُضَارِعُ', badge: 'دَرْسُ الْأَزْمِنَةِ' };
      case 'lesson-4':
        return { title: 'فِعْلُ الْأَمْرِ', badge: 'دَرْسُ الْأَزْمِنَةِ' };
      case 'lesson-5':
        return { title: 'مَسْرَحُ تَحْوِيلِ الْأَفْعَالِ', badge: 'دَرْسُ التَّطْبِيقِ' };
      case 'games-menu':
        return { title: 'أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ', badge: 'قَائِمَةُ الْأَلْعَابِ' };
      case 'game-hunter':
        return { title: 'صَيَّادُ الْأَفْعَالِ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ' };
      case 'game-sorter':
        return { title: 'صُنْدُوقُ الْأَزْمِنَةِ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ' };
      case 'game-completer':
        return { title: 'أَكْمِلِ الْجُمْلَةَ بِالْفِعْلِ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ' };
      case 'game-transformer':
        return { title: 'عَصَا التَّحْوِيلِ السِّحْرِيَّةُ', badge: 'لُعْبَةٌ تَفَاعُلِيَّةٌ' };
      case 'game-quiz':
        return { title: 'تَحَدِّي الْأَبْطَالِ الْكَبِيرُ', badge: 'اخْتِبَارُ التَّفَوُّقِ' };
      case 'rewards':
        return { title: 'سِجِلُّ الْأَوْسِمَةِ وَالْمُكَافَآتِ', badge: 'أَلْبُومُ التَّفَوُّقِ' };
      case 'guide':
        return { title: 'دَلِيلُ الْمُعَلِّمِ وَالْوَلِيِّ', badge: 'إِرْشَادَاتٌ تَرْبَوِيَّةٌ' };
      default:
        return { title: 'النَّشَاطُ التَّعْلِيمِيُّ', badge: 'تَعَلَّمْ وَالْعَبْ' };
    }
  };

  const headerInfo = getActivityHeaderInfo();

  const handleBackToHomeClick = () => {
    soundEffects.playClick();
    onBackToHub();
  };

  const handleBackToGamesMenu = () => {
    soundEffects.playClick();
    onOpenActivity('games-menu');
  };

  // If this is the games catalog menu view
  if (activityId === 'games-menu') {
    return (
      <GamesCatalogView
        progress={progress}
        onSelectGame={(id) => onOpenActivity(id)}
        onBackToHub={onBackToHub}
        onGoToRewards={() => onOpenActivity('rewards')}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3 pb-2 w-full">
      {/* Top Dedicated Navigation Bar with Dual Return Buttons */}
      <div className="bg-white rounded-3xl border-3 border-amber-300 shadow-sm p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-20">
        {/* Navigation Return Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Home Button */}
          <button
            id="btn-back-to-home"
            onClick={handleBackToHomeClick}
            type="button"
            className="bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-extrabold text-sm sm:text-base px-3.5 sm:px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky flex-shrink-0"
            title="الرُّجُوعُ إِلَى الْوَاجِهَةِ الرَّئِيسِيَّةِ"
          >
            <Home size={18} />
            <span>الْوَاجِهَةُ الرَّئِيسِيَّةُ</span>
          </button>

          {/* If inside an individual game, show Back to Games List button */}
          {isGameActivity && (
            <button
              id="btn-back-to-games-list"
              onClick={handleBackToGamesMenu}
              type="button"
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 font-tajawal font-extrabold text-sm sm:text-base px-3.5 sm:px-4 py-2 rounded-2xl shadow-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
              title="الرُّجُوعُ إِلَى قَائِمَةِ الْأَلْعَابِ"
            >
              <Gamepad2 size={18} className="text-amber-600" />
              <span>قَائِمَةُ الْأَلْعَابِ</span>
            </button>
          )}
        </div>

        {/* Activity Name & Badge in Middle */}
        <div className="text-center truncate px-2 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-base sm:text-xl md:text-2xl font-black font-baloo text-amber-950 truncate tashkeel-text">
              {headerInfo.title}
            </h2>
            <span className="text-xs sm:text-sm font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full font-tajawal shadow-xs">
              {headerInfo.badge}
            </span>
          </div>
        </div>

        {/* Live Kid Stars */}
        <div className="bg-amber-50 border-2 border-amber-300 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-amber-950 font-black font-tajawal text-sm sm:text-base shadow-xs flex-shrink-0">
          <Star className="text-amber-500 fill-amber-500" size={18} />
          <span>{progress.stars} نَجْمَةً</span>
        </div>
      </div>

      {/* 🎯 Isolated Activity Content */}
      <div className="flex-1 flex flex-col min-h-0 transition-all duration-300">
        {/* Lessons: Display only the selected tense / lesson */}
        {activityId.startsWith('lesson-') && (
          <LessonsView
            lessonId={activityId}
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onGoToGames={() => onOpenActivity('games-menu')}
            onBackToMenu={onBackToHub}
          />
        )}

        {/* Game 1: Word Hunter */}
        {activityId === 'game-hunter' && (
          <WordHunterGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={handleBackToGamesMenu}
          />
        )}

        {/* Game 2: Time Sorter */}
        {activityId === 'game-sorter' && (
          <TimeSortingGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={handleBackToGamesMenu}
          />
        )}

        {/* Game 3: Sentence Completion */}
        {activityId === 'game-completer' && (
          <SentenceCompletionGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={handleBackToGamesMenu}
          />
        )}

        {/* Game 4: Magic Transformer */}
        {activityId === 'game-transformer' && (
          <MagicTransformerGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={handleBackToGamesMenu}
          />
        )}

        {/* Game 5: Champions Quiz */}
        {activityId === 'game-quiz' && (
          <ChampionsQuizGame
            progress={progress}
            onUpdateProgress={onUpdateProgress}
            onBackToMenu={handleBackToGamesMenu}
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
