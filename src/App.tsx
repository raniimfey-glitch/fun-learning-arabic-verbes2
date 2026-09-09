/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppViewMode, ActivityId, UserProgress } from './types';
import { INITIAL_USER_PROGRESS } from './data/rewardsData';
import { HomeHub } from './components/HomeHub';
import { ActivityView } from './components/ActivityView';
import { soundEffects } from './utils/audio';
import { Sparkles, Download, Check } from 'lucide-react';

const STORAGE_KEY = 'faal_kid_app_progress_v2';

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('hub');
  const [activeActivityId, setActiveActivityId] = useState<ActivityId | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...INITIAL_USER_PROGRESS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn('Failed to load saved progress:', e);
      }
    }
    return INITIAL_USER_PROGRESS;
  });

  // Save progress changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (e) {
        console.warn('Failed to persist progress:', e);
      }
    }
  }, [progress]);

  // Synchronize mute state
  useEffect(() => {
    soundEffects.setSoundEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  const updateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress(prev => updater(prev));
  };

  const handleOpenActivity = (activityId: ActivityId) => {
    setActiveActivityId(activityId);
    setViewMode('activity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setViewMode('hub');
    setActiveActivityId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper app-viewport-wrapper h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col justify-between bg-gradient-to-b from-amber-50 via-orange-50/40 to-yellow-50 text-slate-800 selection:bg-amber-300 selection:text-amber-950 font-baloo">
      {/* App Header / PWA Install Banner */}
      <header className="app-header header app-header-area flex-shrink-0 w-full z-20">
        {installPrompt && !isInstalled && (
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1.5 text-center text-xs sm:text-sm font-bold font-tajawal flex items-center justify-center gap-3 shadow-md">
            <span>📲 أَضِفِ التَّطْبِيقَ إِلَى الشَّاشَةِ الرَّئِيسِيَّةِ لِيَعْمَلَ كَتَطْبِيقٍ كَامِلٍ بِدُونِ إِنْتَرْنِت!</span>
            <button
              onClick={handleInstallPWA}
              type="button"
              className="bg-white text-amber-900 px-2.5 py-0.5 rounded-xl text-xs font-black hover:bg-amber-100 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download size={13} />
              <span>تَثْبِيتُ التَّطْبِيقِ</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area: Centered max-w-[900px] occupying remaining space */}
      <main className="main main-content content app-main-content flex-1 flex flex-col min-h-0 w-full max-w-[900px] mx-auto px-3 sm:px-4 py-2 sm:py-3 overflow-y-auto overflow-x-hidden">
        {viewMode === 'hub' ? (
          <HomeHub
            progress={progress}
            onUpdateProgress={updateProgress}
            onOpenActivity={handleOpenActivity}
          />
        ) : (
          <ActivityView
            activityId={activeActivityId || 'lesson-2'}
            progress={progress}
            onUpdateProgress={updateProgress}
            onBackToHub={handleBackToHub}
            onOpenActivity={handleOpenActivity}
          />
        )}
      </main>

      {/* Bottom Navigation Bar: Sticks to absolute bottom, flex-shrink: 0 */}
      <footer id="app-bottom-navbar" className="footer bottom-nav navbar buttons-container app-bottom-navbar flex-shrink-0 w-full bg-white/95 backdrop-blur-md border-t-2 border-amber-200 select-none z-20 py-1.5 px-3">
        <div className="max-w-[900px] mx-auto flex flex-row items-center justify-between gap-2">
          {/* Quick Navigation Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-btn-home"
              onClick={handleBackToHub}
              type="button"
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold font-tajawal flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'hub'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="الْوَاجِهَةُ الرَّئِيسِيَّةُ"
            >
              <span>🏠</span>
              <span className="hidden xs:inline sm:inline">الرَّئِيسِيَّةُ</span>
            </button>

            <button
              id="nav-btn-lessons"
              onClick={() => handleOpenActivity('lesson-2')}
              type="button"
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold font-tajawal flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'activity' && activeActivityId?.startsWith('lesson-')
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="دُرُوسُ الأَفْعَالِ"
            >
              <span>📖</span>
              <span className="hidden xs:inline sm:inline">الدُّرُوسُ</span>
            </button>

            <button
              id="nav-btn-games"
              onClick={() => handleOpenActivity('games-menu')}
              type="button"
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold font-tajawal flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'activity' && (activeActivityId === 'games-menu' || activeActivityId?.startsWith('game-'))
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="أَلْعَابُ الأَفْعَالِ"
            >
              <span>🎮</span>
              <span className="hidden xs:inline sm:inline">الأَلْعَابُ</span>
            </button>

            <button
              id="nav-btn-rewards"
              onClick={() => handleOpenActivity('rewards')}
              type="button"
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold font-tajawal flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'activity' && activeActivityId === 'rewards'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="الأَوْسِمَةُ وَالشَّهَادَةُ"
            >
              <span>🏆</span>
              <span className="hidden xs:inline sm:inline">الأَوْسِمَةُ</span>
            </button>
          </div>

          {/* Official Credit Title */}
          <div className="text-[11px] sm:text-xs font-bold font-tajawal text-amber-950 truncate text-left sm:text-center">
            <span>التّعلّم الممتِع - عالم الأفعال - سميرة عبد الصدوق</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
