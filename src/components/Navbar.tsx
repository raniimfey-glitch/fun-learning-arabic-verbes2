import React, { useState } from 'react';
import { AppTab, UserProgress } from '../types';
import { Star, Award, Volume2, VolumeX, Sparkles, BookOpen, Gamepad2, GraduationCap, Edit3, User } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../utils/audio';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  progress,
  onUpdateProgress
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(progress.childName);
  const [tempAvatar, setTempAvatar] = useState(progress.avatar);

  const avatars = ['👦', '👧', '🦁', '🦊', '🚀', '⭐', '🦉', '🐱'];

  const handleTabChange = (tab: AppTab) => {
    soundEffects.playClick();
    onSelectTab(tab);
  };

  const toggleSound = () => {
    const nextSound = !progress.soundEnabled;
    soundEffects.setMuted(!nextSound);
    onUpdateProgress(prev => ({ ...prev, soundEnabled: nextSound }));
    if (nextSound) {
      soundEffects.playStarEarned();
    }
  };

  const toggleSpeed = () => {
    soundEffects.playClick();
    const newRate = progress.speechRate === 0.82 ? 0.65 : 0.82;
    onUpdateProgress(prev => ({ ...prev, speechRate: newRate }));
    ArabicSpeechEngine.speak(newRate === 0.65 ? 'سُرْعَةُ نُطْقٍ هَادِئَةٌ لِلْأَبْطَالِ' : 'سُرْعَةُ نُطْقٍ مُمْتَازَةٌ', newRate);
  };

  const saveProfile = () => {
    soundEffects.playStarEarned();
    onUpdateProgress(prev => ({
      ...prev,
      childName: tempName.trim() || 'بَطَلُ اللُّغَةِ',
      avatar: tempAvatar
    }));
    setIsEditingProfile(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Brand */}
          <div 
            onClick={() => handleTabChange('lessons')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center border-2 border-white">
              <span className="text-2xl sm:text-3xl">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl text-amber-900 font-baloo tracking-wide">
                  عَالَمُ الأَفْعَالِ
                </span>
                <span className="hidden md:inline-block bg-amber-200 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  السَّنَة 2 ابْتِدَائِي
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-700 font-tajawal hidden sm:block">
                تَعَلَّمْ وَالْعَبْ مَعَ أَقْسَامِ الْفِعْلِ
              </p>
            </div>
          </div>

          {/* Player Stats & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Stars Counter */}
            <div 
              id="stars-badge"
              onClick={() => {
                soundEffects.playStarEarned();
                onSelectTab('rewards');
              }}
              className="flex items-center gap-1 sm:gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 px-2.5 sm:px-3.5 py-1.5 rounded-2xl font-black text-sm sm:text-base shadow-sm cursor-pointer transition-transform hover:scale-105"
              title="رَصِيدُ النُّجُومِ - اِضْغَطْ لِرُؤْيَةِ الْمُكَافَآتِ"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-twinkle" />
              <span className="font-tajawal font-extrabold">{progress.stars}</span>
            </div>

            {/* Gems Counter */}
            <div 
              id="gems-badge"
              className="hidden sm:flex items-center gap-1 bg-sky-100 border-2 border-sky-300 text-sky-900 px-2.5 py-1.5 rounded-2xl font-black text-sm shadow-sm"
              title="الْجَوَاهِرُ السِّحْرِيَّةُ"
            >
              <span className="text-sm">💎</span>
              <span className="font-tajawal font-extrabold">{progress.gems}</span>
            </div>

            {/* Speech Rate Toggle */}
            <button
              id="speech-speed-btn"
              onClick={toggleSpeed}
              type="button"
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-tajawal border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
              title="سُرْعَةُ النُّطْقِ"
            >
              <span>{progress.speechRate === 0.82 ? '🗣️ نُطْقٌ عَادِي' : '🐢 نُطْقٌ هَادِئ'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={toggleSound}
              type="button"
              className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                progress.soundEnabled
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                  : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
              }`}
              title={progress.soundEnabled ? 'كَتْمُ الصَّوْتِ' : 'تَشْغِيلُ الصَّوْتِ'}
            >
              {progress.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Profile Avatar Button */}
            <button
              id="child-profile-btn"
              onClick={() => {
                soundEffects.playClick();
                setIsEditingProfile(true);
              }}
              type="button"
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white pl-2 pr-1.5 py-1 rounded-2xl text-xs sm:text-sm font-bold shadow-sm hover:scale-105 transition-all cursor-pointer"
              title="تَعْدِيلُ اسْمِ الْبَطَلِ"
            >
              <span className="text-lg">{progress.avatar}</span>
              <span className="font-tajawal max-w-[80px] sm:max-w-[100px] truncate">{progress.childName}</span>
              <Edit3 size={12} className="opacity-80" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="mt-3 flex items-center justify-center gap-1.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            id="nav-tab-lessons"
            onClick={() => handleTabChange('lessons')}
            type="button"
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-2xl font-tajawal font-bold text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'lessons'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
                : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200/80'
            }`}
          >
            <BookOpen size={18} />
            <span>الدُّرُوسُ التَّفَاعُلِيَّة</span>
          </button>

          <button
            id="nav-tab-games"
            onClick={() => handleTabChange('games')}
            type="button"
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-2xl font-tajawal font-bold text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'games'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 scale-105'
                : 'bg-sky-100/70 text-sky-900 hover:bg-sky-200/80'
            }`}
          >
            <Gamepad2 size={18} />
            <span>أَلْعَابُ الْأَفْعَالِ</span>
            <span className="bg-sky-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-sans">5</span>
          </button>

          <button
            id="nav-tab-rewards"
            onClick={() => handleTabChange('rewards')}
            type="button"
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-2xl font-tajawal font-bold text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'rewards'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105'
                : 'bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200/80'
            }`}
          >
            <Award size={18} />
            <span>الْمُكَافَآتُ وَالشَّهَادَة</span>
          </button>

          <button
            id="nav-tab-guide"
            onClick={() => handleTabChange('guide')}
            type="button"
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl font-tajawal font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'guide'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-purple-100/70 text-purple-900 hover:bg-purple-200/80'
            }`}
          >
            <GraduationCap size={16} />
            <span>دَلِيلُ الْمُعَلِّمِ وَالْوَلِيّ</span>
          </button>
        </nav>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl animate-bounce-gentle">
            <h3 className="text-xl font-bold font-baloo text-amber-900 text-center mb-4">
              ✨ مَلَفُّ الْبَطَلِ الصَّغِيرِ ✨
            </h3>

            {/* Avatar Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-2 font-tajawal">
                اِخْتَرْ صُورَتَكَ الرَّمْزِيَّةَ:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {avatars.map(av => (
                  <button
                    key={av}
                    onClick={() => {
                      soundEffects.playClick();
                      setTempAvatar(av);
                    }}
                    type="button"
                    className={`text-3xl p-2 rounded-2xl border-2 transition-transform cursor-pointer ${
                      tempAvatar === av ? 'border-amber-500 bg-amber-100 scale-110 shadow-sm' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Child Name Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-600 mb-2 font-tajawal">
                اِسْمُ الْبَطَلِ أَوِ الْبَطَلَةِ:
              </label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                placeholder="اُكْتُبِ اسْمَكَ هُنَا..."
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-hidden font-tajawal font-bold text-center text-lg text-amber-900"
                maxLength={20}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                type="button"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold py-2.5 rounded-2xl shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                حِفْظُ التَّعْدِيلَاتِ ✨
              </button>
              <button
                onClick={() => setIsEditingProfile(false)}
                type="button"
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-tajawal font-bold py-2.5 rounded-2xl cursor-pointer"
              >
                إِلْغَاءٌ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
