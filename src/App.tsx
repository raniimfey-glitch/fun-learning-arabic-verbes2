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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-yellow-50 text-slate-800 flex flex-col justify-between selection:bg-amber-300 selection:text-amber-950 font-baloo">
      {/* PWA Install Banner if Available */}
      {installPrompt && !isInstalled && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-bold font-tajawal flex items-center justify-center gap-3 shadow-md">
          <span>📲 أَضِفِ التَّطْبِيقَ إِلَى الشَّاشَةِ الرَّئِيسِيَّةِ لِيَعْمَلَ كَتَطْبِيقٍ كَامِلٍ بِدُونِ إِنْتَرْنِت!</span>
          <button
            onClick={handleInstallPWA}
            type="button"
            className="bg-white text-amber-900 px-3 py-1 rounded-xl text-xs font-black hover:bg-amber-100 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Download size={14} />
            <span>تَثْبِيتُ التَّطْبِيقِ</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex-1">
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

      {/* Footer */}
      <footer id="app-footer" className="bg-white/90 border-t-2 border-amber-200 py-4 px-4 text-center select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm sm:text-base font-bold font-tajawal text-amber-950">
          <span>التّعلّم الممتِع - عالم الأفعال - سميرة عبد الصدوق</span>
        </div>
      </footer>
    </div>
  );
}
