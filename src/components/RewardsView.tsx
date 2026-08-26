import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BADGES_DATA, STICKERS_DATA } from '../data/rewardsData';
import { UserProgress, Badge, Sticker } from '../types';
import { SoundButton } from './SoundButton';
import { Mascot } from './Mascot';
import { Trophy, Award, Star, Lock, Unlock, Printer, Sparkles, PlusCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { soundEffects, ArabicSpeechEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface RewardsViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  progress,
  onUpdateProgress
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'stickers' | 'certificate'>('badges');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [placedStickers, setPlacedStickers] = useState<{ id: string; stickerId: string; x: number; y: number }[]>(
    progress.stickerPlacements.map((p, idx) => ({ id: `p-${idx}`, ...p }))
  );

  const handleUnlockSticker = (sticker: Sticker) => {
    if (progress.unlockedStickers.includes(sticker.id)) return;
    if (progress.stars < sticker.costStars) {
      soundEffects.playWrong();
      ArabicSpeechEngine.speak(`تَحْتَاجُ إِلَى ${sticker.costStars} نَجْمَةً لِفَتْحِ هَذَا الْمُلْصَقِ. أَنْتَ تَمْلِكُ ${progress.stars} نَجْمَةً.`, progress.speechRate);
      return;
    }

    soundEffects.playStarEarned();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    onUpdateProgress(prev => ({
      ...prev,
      stars: prev.stars - sticker.costStars,
      unlockedStickers: [...prev.unlockedStickers, sticker.id]
    }));

    ArabicSpeechEngine.speak(`مَبْرُوكٌ! لَقَدْ فَتَحْتَ مُلْصَقَ: ${sticker.name}. ${sticker.actionText}`, progress.speechRate);
  };

  const handleAddStickerToPark = (sticker: Sticker) => {
    if (!progress.unlockedStickers.includes(sticker.id)) return;

    soundEffects.playPop();
    const newPlacement = {
      id: `p-${Date.now()}`,
      stickerId: sticker.id,
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 50) + 20
    };

    const updated = [...placedStickers, newPlacement];
    setPlacedStickers(updated);
    onUpdateProgress(prev => ({
      ...prev,
      stickerPlacements: updated.map(u => ({ stickerId: u.stickerId, x: u.x, y: u.y }))
    }));

    ArabicSpeechEngine.speak(sticker.actionText, progress.speechRate);
  };

  const handleClearPark = () => {
    soundEffects.playClick();
    setPlacedStickers([]);
    onUpdateProgress(prev => ({ ...prev, stickerPlacements: [] }));
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    const isUnlocked = progress.stars >= badge.requiredStars || progress.unlockedBadges.includes(badge.id);

    if (isUnlocked) {
      soundEffects.playStarEarned();
      ArabicSpeechEngine.speak(`وِسَامُ: ${badge.title}. ${badge.description}`, progress.speechRate);
    } else {
      soundEffects.playWrong();
      ArabicSpeechEngine.speak(`وِسَامُ: ${badge.title}. تَحْتَاجُ إِلَى ${badge.requiredStars} نَجْمَةً لِفَتْحِهِ.`, progress.speechRate);
    }
  };

  const handlePrintCertificate = () => {
    soundEffects.playFanfare();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Mascot Cheer */}
      <Mascot
        message={`هَذَا سِجِلُّ إِنْجَازَاتِكَ يَا ${progress.childName}! اِجْمَعِ النُّجُومَ، اِفْتَحِ الْمُلْصَقَاتِ الْمُتَحَرِّكَةَ، وَاحْصُلْ عَلَى شَهَادَةِ التَّفَوُّقِ الذَّهَبِيَّةِ!`}
        mood="celebrating"
      />

      {/* Rewards Navigation Bar */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 bg-white p-2 rounded-3xl border-2 border-emerald-200 shadow-sm">
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('badges');
          }}
          type="button"
          className={`flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-2xl font-tajawal font-bold text-sm sm:text-base transition-all cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-700 hover:bg-emerald-50'
          }`}
        >
          <Award size={18} />
          <span>أَوْسِمَةُ الشَّرَفِ 🏅</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('stickers');
          }}
          type="button"
          className={`flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-2xl font-tajawal font-bold text-sm sm:text-base transition-all cursor-pointer ${
            activeTab === 'stickers'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-700 hover:bg-emerald-50'
          }`}
        >
          <Sparkles size={18} />
          <span>أَلْبُومُ الْمُلْصَقَاتِ 🎨</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('certificate');
          }}
          type="button"
          className={`flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-2xl font-tajawal font-bold text-sm sm:text-base transition-all cursor-pointer ${
            activeTab === 'certificate'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-700 hover:bg-emerald-50'
          }`}
        >
          <Trophy size={18} />
          <span>شَهَادَةُ التَّفَوُّقِ 📜</span>
        </button>
      </div>

      {/* Tab 1: Badges */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-3xl border-3 border-emerald-200 shadow-md p-5 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black font-baloo text-emerald-950">
                أَوْسِمَةُ التَّفَوُّقِ فِي اللُّغَةِ الْعَرَبِيَّةِ
              </h2>
              <p className="text-sm font-bold font-tajawal text-slate-600">
                اِفْتَحِ الْأَوْسِمَةَ كُلَّمَا جَمَعْتَ الْمَزِيدَ مِنَ النُّجُومِ فِي الدُّرُوسِ وَالْأَلْعَابِ!
              </p>
            </div>
            <div className="bg-amber-100 border-2 border-amber-300 px-4 py-2 rounded-2xl flex items-center gap-2 text-amber-900 font-black font-tajawal">
              <Star className="text-amber-500 fill-amber-500" size={20} />
              <span>{progress.stars} نَجْمَةً</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BADGES_DATA.map(badge => {
              const isUnlocked = progress.stars >= badge.requiredStars || progress.unlockedBadges.includes(badge.id);

              return (
                <motion.div
                  key={badge.id}
                  id={`badge-card-${badge.id}`}
                  onClick={() => handleBadgeClick(badge)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-3xl border-3 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/70 border-amber-400 shadow-md ring-2 ring-amber-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-5xl bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex-shrink-0">
                      {badge.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-lg font-black font-baloo text-slate-900">
                          {badge.title}
                        </h3>
                        {isUnlocked ? (
                          <Unlock size={14} className="text-emerald-600" />
                        ) : (
                          <Lock size={14} className="text-slate-400" />
                        )}
                      </div>
                      <p className="text-xs font-bold font-tajawal text-slate-600 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold font-tajawal">
                    <span className={isUnlocked ? 'text-emerald-700' : 'text-slate-500'}>
                      {isUnlocked ? 'مَفْتُوحٌ لَدَيْكَ ✨' : `يَحْتَاجُ ${badge.requiredStars} نَجْمَةً`}
                    </span>
                    <SoundButton textToSpeak={`${badge.title}. ${badge.description}`} size="sm" variant="ghost" rate={progress.speechRate} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Stickers & Action Park */}
      {activeTab === 'stickers' && (
        <div className="space-y-6">
          {/* Interactive Park / Canvas */}
          <div className="bg-white rounded-3xl border-3 border-emerald-300 shadow-md p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-black font-baloo text-emerald-950">
                  🌳 حَدِيقَةُ الْأَفْعَالِ التَّفَاعُلِيَّةِ
                </h3>
                <p className="text-xs sm:text-sm font-bold font-tajawal text-slate-600">
                  اِضْغَطْ عَلَى مُلْصَقَاتِكَ الْمَفْتُوحَةِ لِتَضَعَهَا فِي الْحَدِيقَةِ، وَانْقُرْ عَلَيْهَا لِتَنْطِقَ حَرَكَتَهَا!
                </p>
              </div>

              <button
                onClick={handleClearPark}
                type="button"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-tajawal flex items-center gap-1 cursor-pointer w-fit"
              >
                <RefreshCw size={14} />
                <span>إِعَادَةُ تَرْتِيبِ الْحَدِيقَةِ</span>
              </button>
            </div>

            {/* Park Scene Background */}
            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden border-3 border-emerald-400 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 shadow-inner select-none">
              {/* Scenery details */}
              <div className="absolute top-4 left-6 text-3xl animate-float">☁️</div>
              <div className="absolute top-8 right-12 text-4xl">☀️</div>
              <div className="absolute top-12 left-1/3 text-2xl animate-float">☁️</div>
              <div className="absolute bottom-2 left-6 text-4xl">🌳</div>
              <div className="absolute bottom-2 right-8 text-4xl">🏡</div>
              <div className="absolute bottom-4 left-1/2 text-2xl">🌸</div>
              <div className="absolute bottom-3 left-1/4 text-2xl">🍄</div>

              {/* Placed Stickers */}
              {placedStickers.map(placed => {
                const sticker = STICKERS_DATA.find(s => s.id === placed.stickerId);
                if (!sticker) return null;

                return (
                  <motion.div
                    key={placed.id}
                    onClick={() => {
                      soundEffects.playStarEarned();
                      ArabicSpeechEngine.speak(`${sticker.name}. ${sticker.actionText}`, progress.speechRate);
                    }}
                    style={{ left: `${placed.x}%`, top: `${placed.y}%` }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute cursor-pointer p-2 bg-white/80 backdrop-blur-xs rounded-2xl shadow-md border border-white flex flex-col items-center group -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className="text-4xl animate-bounce-gentle">{sticker.emoji}</span>
                    <span className="text-[10px] font-bold font-tajawal text-slate-800 bg-amber-200 px-1.5 py-0.2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {sticker.actionText}
                    </span>
                  </motion.div>
                );
              })}

              {placedStickers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-tajawal font-bold text-sm bg-black/5">
                  اِخْتَرْ مُلْصَقًا مِنْ أَسْفَلُ لِتَضَعَهُ هُنَا! 🌟
                </div>
              )}
            </div>
          </div>

          {/* Stickers Grid Collection */}
          <div className="bg-white rounded-3xl border-3 border-emerald-200 shadow-md p-5 sm:p-6 space-y-4">
            <h3 className="text-xl font-black font-baloo text-slate-900">
              أَلْبُومُ الْمُلْصَقَاتِ الْمُتَحَرِّكَةِ (12 مُلْصَقًا)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {STICKERS_DATA.map(stk => {
                const isUnlocked = progress.unlockedStickers.includes(stk.id);

                return (
                  <div
                    key={stk.id}
                    id={`sticker-item-${stk.id}`}
                    className={`p-4 rounded-3xl border-2 flex flex-col justify-between items-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/80 border-amber-300 hover:border-amber-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="text-4xl sm:text-5xl mb-2">{stk.emoji}</div>
                    <h4 className="font-baloo font-bold text-base text-slate-900">
                      {stk.name}
                    </h4>
                    <p className="text-xs font-bold font-tajawal text-amber-900 mb-3 bg-amber-100 px-2 py-0.5 rounded-full">
                      {stk.actionText}
                    </p>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleAddStickerToPark(stk)}
                        type="button"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-tajawal font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-102"
                      >
                        <PlusCircle size={14} />
                        <span>أَضِفْ لِلْحَدِيقَةِ</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlockSticker(stk)}
                        type="button"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-102"
                      >
                        <Star size={14} className="fill-white" />
                        <span>اِفْتَحْ بـ {stk.costStars} نَجْمَةً</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Official Certificate of Excellence */}
      {activeTab === 'certificate' && (
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <button
              id="print-certificate-btn"
              onClick={handlePrintCertificate}
              type="button"
              className="bg-amber-500 hover:bg-amber-600 text-white font-tajawal font-bold text-base px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer btn-chunky"
            >
              <Printer size={20} />
              <span>طِبَاعَةُ أَو حِفْظُ الشَّهَادَةِ 🖨️</span>
            </button>
          </div>

          {/* Certificate Board */}
          <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 p-4 sm:p-8 rounded-3xl border-8 border-amber-400 shadow-2xl relative overflow-hidden text-center max-w-3xl mx-auto">
            {/* Ornate corner stamps */}
            <div className="absolute top-3 left-4 text-3xl">⚜️</div>
            <div className="absolute top-3 right-4 text-3xl">⚜️</div>
            <div className="absolute bottom-3 left-4 text-3xl">⚜️</div>
            <div className="absolute bottom-3 right-4 text-3xl">⚜️</div>

            <div className="border-4 border-dashed border-amber-300 p-6 sm:p-10 rounded-2xl bg-white/90 backdrop-blur-xs space-y-6">
              {/* Header */}
              <div>
                <span className="text-5xl block mb-2">👑</span>
                <span className="text-xs sm:text-sm font-bold font-tajawal text-amber-800 bg-amber-200/80 px-4 py-1 rounded-full uppercase tracking-widest">
                  الْمَمْلَكَةُ التَّعْلِيمِيَّةُ لِلُّغَةِ الْعَرَبِيَّةِ
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-baloo text-amber-950 mt-3">
                  شَهَادَةُ بَطَلِ الْأَفْعَالِ
                </h2>
                <p className="text-base font-bold font-tajawal text-amber-800 mt-1">
                  لِتَلَامِيذِ السَّنَةِ الثَّانِيَةِ ابْتِدَائِي
                </p>
              </div>

              {/* Awarded text */}
              <div className="space-y-3 py-2">
                <p className="text-slate-600 font-tajawal text-base font-bold">
                  تُهْدَى هَذِهِ الشَّهَادَةُ التَّقْدِيرِيَّةُ بِفَخْرٍ إِلَى الْبَطَلِ الرَّائِعِ:
                </p>
                <div className="inline-block bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 px-8 py-3 rounded-2xl font-black font-baloo text-3xl sm:text-4xl shadow-md border-2 border-white">
                  {progress.avatar} {progress.childName}
                </div>
                <p className="text-slate-700 font-tajawal font-bold text-base sm:text-lg max-w-xl mx-auto leading-relaxed tashkeel-text">
                  تَقْدِيرًا لِتَمَيُّزِهِ الْبَاهِرِ فِي إِتْقَانِ «الْفِعْلِ» وَالتَّمْيِيزِ بَيْنَ أَقْسَامِهِ الثَّلَاثَةِ:
                  <br />
                  <span className="text-teal-700 font-extrabold">(الْمَاضِي ⏳)</span> -{' '}
                  <span className="text-sky-700 font-extrabold">(الْمُضَارِعِ ⏰)</span> -{' '}
                  <span className="text-purple-700 font-extrabold">(الْأَمْرِ 📢)</span>
                </p>
              </div>

              {/* Stars & Seal */}
              <div className="flex items-center justify-between pt-6 border-t-2 border-amber-200">
                <div className="text-right font-tajawal text-xs sm:text-sm text-slate-600">
                  <p className="font-bold">التَّارِيخُ: {new Date().toLocaleDateString('ar-EG')}</p>
                  <p className="font-bold text-amber-900 mt-0.5">رَصِيدُ النُّجُومِ: {progress.stars} ⭐</p>
                </div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 border-4 border-amber-300 shadow-lg flex flex-col items-center justify-center text-white">
                  <span className="text-xs font-black font-tajawal">خَتْمُ التَّفَوُّقِ</span>
                  <span className="text-2xl sm:text-3xl">🌟</span>
                  <span className="text-[10px] font-bold">100%</span>
                </div>

                <div className="text-left font-tajawal text-xs sm:text-sm text-slate-600">
                  <p className="font-bold">الْمُرْشِدُ التَّعْلِيمِي:</p>
                  <p className="font-black font-baloo text-amber-900 text-base">فَلْفُول الْبَطَل 🦊</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
