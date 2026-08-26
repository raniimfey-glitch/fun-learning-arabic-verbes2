import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, CheckCircle, Lightbulb, Heart, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { SoundButton } from './SoundButton';

export const ParentTeacherGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border-3 border-purple-200 shadow-md p-5 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-purple-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full font-tajawal">
              دَلِيلُ الْمُعَلِّمِ وَالْوَلِيّ 👨‍🏫👩‍👦
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-purple-700 text-xs font-bold font-tajawal">مِنْهَاجُ السَّنَةِ الثَّانِيَةِ ابْتِدَائِي</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 font-baloo leading-tight">
            كَيْفَ نُسَاعِدُ الطِّفْلَ عَلَى إِتْقَانِ «الْفِعْلِ» بِسُهُولَةٍ وَمَرَحٍ؟
          </h2>
        </div>

        <SoundButton
          textToSpeak="مَرْحَبًا بِكُمْ فِي دَلِيلِ الْمُعَلِّمِ وَالْوَلِيِّ لِتَعْلِيمِ الْفِعْلِ لِلسَّنَةِ الثَّانِيَةِ ابْتِدَائِي."
          size="md"
          variant="secondary"
          label="اِسْتَمِعْ لِلْمُقَدِّمَةِ"
        />
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Pillar 1: Objectives */}
        <div className="bg-purple-50/70 border-2 border-purple-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-bold">
            <BookOpen size={22} className="text-purple-600" />
            <h3 className="text-lg font-black font-baloo">1. الْأَهْدَافُ التَّعْلِيمِيَّةُ الْمُسْتَهْدَفَةُ</h3>
          </div>
          <ul className="space-y-2 text-sm font-tajawal font-bold text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
              <span>إِدْرَاكُ أَنَّ الْفِعْلَ يَدُلُّ عَلَى عَمَلٍ أَوْ حَرَكَةٍ مُرْتَبِطَةٍ بِزَمَنٍ.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
              <span>التَّمْيِيزُ بَيْنَ أَقْسَامِ الْفِعْلِ الثَّلَاثَةِ: (الْمَاضِي ⏳، الْمُضَارِعُ ⏰، الْأَمْرُ 📢).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
              <span>تَحْوِيلُ الْفِعْلِ بَيْنَ الْأَزْمِنَةِ وَمَعَ الضَّمَائِرِ الْبَسِيطَةِ (هُوَ، هِيَ، أَنَا، نَحْنُ).</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Magic Child Tricks */}
        <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <Lightbulb size={22} className="text-amber-600" />
            <h3 className="text-lg font-black font-baloo">2. حِيَلٌ ذَهَبِيَّةٌ لِتَسْهِيلِ التَّمْيِيزِ لِلطِّفْلِ</h3>
          </div>
          <ul className="space-y-2 text-sm font-tajawal font-bold text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">💡 حِيلَةُ (الـ) التَّعْرِيفِ:</span>
              <span>جَرِّبْ وَضْعَ (الـ)؛ إِذَا قَبِلَتْهَا الْكَلِمَةُ فَهِيَ اسْمٌ (الْقَلَمُ)، وَإِذَا لَمْ تَقْبَلْهَا فَهِيَ فِعْلٌ (الـيَكْتُبُ ❌).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">💡 حِيلَةُ التَّنْوِينِ:</span>
              <span>الْفِعْلُ لَا يَقْبَلُ التَّنْوِينَ أَبَدًا (لَا نَقُولُ: رَكَضٌ ❌).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-black">💡 حُرُوفُ (نَأْتِي):</span>
              <span>الْفِعْلُ الْمُضَارِعُ يَبْدَأُ دَائِمًا بِأَحَدِ هَذِهِ الْحُرُوفِ (نَـ، أَ، تَـ، يَـ).</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Offline & Classroom Readiness */}
        <div className="bg-sky-50/70 border-2 border-sky-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sky-900 font-bold">
            <ShieldCheck size={22} className="text-sky-600" />
            <h3 className="text-lg font-black font-baloo">3. مُمَيِّزَاتُ التَّطْبِيقِ الصَّفِّيِّ وَالْمَنْزِلِيِّ</h3>
          </div>
          <ul className="space-y-2 text-sm font-tajawal font-bold text-slate-700 leading-relaxed">
            <li>✅ يَعْمَلُ بِنِسْبَةِ 100% بِدُونِ إِنْتَرْنِت فِي أَيِّ مَكَانٍ وَعَلَى كُلِّ الشَّاشَاتِ.</li>
            <li>✅ نُطْقٌ صَوْتِيٌّ نَقِيٌّ لِكُلِّ كَلِمَةٍ مَعَ خَاصِّيَّةِ تَهْدِئَةِ سُرْعَةِ النُّطْقِ لِلْأَطْفَالِ.</li>
            <li>✅ نِظَامُ مُكَافَآتٍ بَصَرِيٍّ وَصَوْتِيٍّ يُشَجِّعُ الطِّفْلَ عَلَى التَّعَلُّمِ الذَّاتِيِّ دُونَ ضَغْطٍ.</li>
          </ul>
        </div>

        {/* Pillar 4: Recommended Routine */}
        <div className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold">
            <Heart size={22} className="text-rose-600" />
            <h3 className="text-lg font-black font-baloo">4. خُطَّةُ الـ 15 دَقِيقَةِ الْيَوْمِيَّةِ</h3>
          </div>
          <p className="text-xs sm:text-sm font-tajawal font-bold text-slate-700 leading-relaxed">
            يُوصَى بِقَضَاءِ 5 دَقَائِقَ فِي قِرَاءَةِ دَرْسٍ وَاحِدٍ مَعَ الِاسْتِمَاعِ لِلْأَمْثِلَةِ، ثُمَّ 10 دَقَائِقَ فِي لُعْبَةٍ أَوْ لُعْبَتَيْنِ لِجَمْعِ النُّجُومِ وَفَتْحِ مُلْصَقَاتِ حَدِيقَةِ الْأَفْعَالِ.
          </p>
        </div>
      </div>
    </div>
  );
};
