import { Badge, Sticker, UserProgress } from '../types';

export const INITIAL_USER_PROGRESS: UserProgress = {
  childName: 'بَطَلُ اللُّغَةِ',
  avatar: '👦',
  stars: 10,
  gems: 2,
  completedLessons: [],
  unlockedBadges: ['badge-1'],
  unlockedStickers: ['stk-1', 'stk-2'],
  gameScores: {
    hunter: 0,
    sorter: 0,
    completer: 0,
    transformer: 0,
    quiz: 0
  },
  stickerPlacements: [
    { stickerId: 'stk-1', x: 25, y: 35 },
    { stickerId: 'stk-2', x: 70, y: 45 }
  ],
  speechRate: 0.82,
  soundEnabled: true
};

export const BADGES_DATA: Badge[] = [
  {
    id: 'badge-1',
    title: 'خُطْوَةُ الْبِدَايَةِ',
    description: 'بَدَأْتَ رِحْلَتَكَ الْمُمْتِعَةَ فِي عَالَمِ الْأَفْعَالِ!',
    icon: '🚀',
    requiredStars: 0,
    category: 'starter',
    unlocked: true
  },
  {
    id: 'badge-2',
    title: 'صَائِدُ الْأَفْعَالِ',
    description: 'تَمَيَّزْتَ فِي مَعْرِفَةِ الْفِعْلِ وَالتَّمْيِيزِ بَيْنَهُ وَبَيْنَ الِاسْمِ!',
    icon: '🎯',
    requiredStars: 20,
    category: 'explorer',
    unlocked: false
  },
  {
    id: 'badge-3',
    title: 'عَبْقَرِيُّ الْأَزْمِنَةِ',
    description: 'تَمَكَّنْتَ مِنْ تَرْتِيبِ الْأَفْعَالِ فِي الْمَاضِي وَالْمُضَارِعِ وَالْأَمْرِ!',
    icon: '⏳',
    requiredStars: 45,
    category: 'explorer',
    unlocked: false
  },
  {
    id: 'badge-4',
    title: 'سَاحِرُ التَّحْوِيلِ',
    description: 'حَوَّلْتَ الْأَفْعَالَ بِعَصَاكَ السِّحْرِيَّةِ بِبَرَاعَةٍ!',
    icon: '🪄',
    requiredStars: 75,
    category: 'master',
    unlocked: false
  },
  {
    id: 'badge-5',
    title: 'نَجْمُ الْجُمَلِ الرَّائِعِ',
    description: 'أَكْمَلْتَ الْجُمَلَ بِأَفْعَالٍ دَقِيقَةٍ وَجَمِيلَةٍ!',
    icon: '🌟',
    requiredStars: 105,
    category: 'master',
    unlocked: false
  },
  {
    id: 'badge-6',
    title: 'سَيِّدُ الْأَفْعَالِ الذَّهَبِي',
    description: 'حَصَلْتَ عَلَى الْعَلَامَةِ الْكَامِلَةِ وَأَصْبَحْتَ عَبْقَرِيَّ الْأَفْعَالِ لِلسَّنَةِ الثَّانِيَةِ!',
    icon: '👑',
    requiredStars: 140,
    category: 'genius',
    unlocked: false
  }
];

export const STICKERS_DATA: Sticker[] = [
  {
    id: 'stk-1',
    name: 'الْأَرْنَبُ يَقْفِزُ',
    emoji: '🐇',
    actionText: 'يَقْفِزُ عَالِيًا',
    tense: 'مُضَارِعٌ',
    unlocked: true,
    costStars: 0
  },
  {
    id: 'stk-2',
    name: 'الْفَرَاشَةُ تَطِيرُ',
    emoji: '🦋',
    actionText: 'تَطِيرُ بَيْنَ الزُّهُورِ',
    tense: 'مُضَارِعٌ',
    unlocked: true,
    costStars: 0
  },
  {
    id: 'stk-3',
    name: 'الْقِطَّةُ تَشْرَبُ',
    emoji: '🐱',
    actionText: 'شَرِبَتِ الْحَلِيبَ',
    tense: 'مَاضٍ',
    unlocked: false,
    costStars: 15
  },
  {
    id: 'stk-4',
    name: 'الْأَسَدُ يَزْأَرُ',
    emoji: '🦁',
    actionText: 'يَزْأَرُ بِقُوَّةٍ',
    tense: 'مُضَارِعٌ',
    unlocked: false,
    costStars: 25
  },
  {
    id: 'stk-5',
    name: 'الْعُصْفُورُ يُغَرِّدُ',
    emoji: '🐦',
    actionText: 'يُغَرِّدُ بِعُذُوبَةٍ',
    tense: 'مُضَارِعٌ',
    unlocked: false,
    costStars: 35
  },
  {
    id: 'stk-6',
    name: 'الْقِرْدُ يَأْكُلُ',
    emoji: '🐵',
    actionText: 'أَكَلَ الْمَوْزَةَ',
    tense: 'مَاضٍ',
    unlocked: false,
    costStars: 45
  },
  {
    id: 'stk-7',
    name: 'الْفَارِسُ يَرْكَبُ',
    emoji: '🏇',
    actionText: 'اِرْكَبْ جَوَادَكَ',
    tense: 'أَمْرٌ',
    unlocked: false,
    costStars: 60
  },
  {
    id: 'stk-8',
    name: 'الْبَطَلُ يَسْبَحُ',
    emoji: '🏊‍♂️',
    actionText: 'يَسْبَحُ بِمَهَارَةٍ',
    tense: 'مُضَارِعٌ',
    unlocked: false,
    costStars: 75
  },
  {
    id: 'stk-9',
    name: 'الرَّسَّامُ يَرْسُمُ',
    emoji: '🎨',
    actionText: 'اِرْسُمْ لَوْحَةً',
    tense: 'أَمْرٌ',
    unlocked: false,
    costStars: 90
  },
  {
    id: 'stk-10',
    name: 'الصَّارُوخُ يَنْطَلِقُ',
    emoji: '🚀',
    actionText: 'اِنْطَلَقَ لِلْفَضَاءِ',
    tense: 'مَاضٍ',
    unlocked: false,
    costStars: 110
  },
  {
    id: 'stk-11',
    name: 'الْكِتَابُ يُقْرَأُ',
    emoji: '📖',
    actionText: 'اِقْرَأْ كِتَابَكَ',
    tense: 'أَمْرٌ',
    unlocked: false,
    costStars: 125
  },
  {
    id: 'stk-12',
    name: 'التَّاجُ الْمَلَكِي',
    emoji: '👑',
    actionText: 'تَوِّجْ نَفْسَكَ بَطَلًا',
    tense: 'أَمْرٌ',
    unlocked: false,
    costStars: 150
  }
];
