import {
  WordHunterQuestion,
  TimeSortingQuestion,
  SentenceCompletionQuestion,
  MagicTransformQuestion,
  QuizQuestion
} from '../types';

// Game 1: Verb Hunter (Find the verbs)
export const WORD_HUNTER_LEVELS: WordHunterQuestion[] = [
  {
    id: 'hunter-1',
    questionText: 'اِصْطَدْ فَقَطِ الْأَفْعَالَ الَّتِي تَدُلُّ عَلَى عَمَلٍ أَوْ حَرَكَةٍ:',
    words: [
      { id: 'w-1-1', text: 'يَكْتُبُ', isVerb: true, typeLabel: 'فِعْلٌ مُضَارِعٌ', emoji: '✍️' },
      { id: 'w-1-2', text: 'بَيْتٌ', isVerb: false, typeLabel: 'اِسْمُ جَمَادٍ', emoji: '🏠' },
      { id: 'w-1-3', text: 'رَكَضَ', isVerb: true, typeLabel: 'فِعْلٌ مَاضٍ', emoji: '🏃' },
      { id: 'w-1-4', text: 'عَلَى', isVerb: false, typeLabel: 'حَرْفُ جَرٍّ', emoji: '🔗' },
      { id: 'w-1-5', text: 'اِسْمَعْ', isVerb: true, typeLabel: 'فِعْلُ أَمْرٍ', emoji: '👂' },
      { id: 'w-1-6', text: 'عُصْفُورٌ', isVerb: false, typeLabel: 'اِسْمُ طَائِرٍ', emoji: '🐦' }
    ]
  },
  {
    id: 'hunter-2',
    questionText: 'اِخْتَرِ الْأَفْعَالَ الَّتِي يَقُومُ بِهَا الْأَبْطَالُ فِي الْمَدْرَسَةِ:',
    words: [
      { id: 'w-2-1', text: 'يَقْرَأُ', isVerb: true, typeLabel: 'فِعْلٌ مُضَارِعٌ', emoji: '📖' },
      { id: 'w-2-2', text: 'مِسْطَرَةٌ', isVerb: false, typeLabel: 'اِسْمُ أَدَاةٍ', emoji: '📏' },
      { id: 'w-2-3', text: 'رَسَمَتْ', isVerb: true, typeLabel: 'فِعْلٌ مَاضٍ', emoji: '🎨' },
      { id: 'w-2-4', text: 'فِي', isVerb: false, typeLabel: 'حَرْفُ جَرٍّ', emoji: '📍' },
      { id: 'w-2-5', text: 'اِحْفَظْ', isVerb: true, typeLabel: 'فِعْلُ أَمْرٍ', emoji: '🧠' },
      { id: 'w-2-6', text: 'مَدْرَسَةٌ', isVerb: false, typeLabel: 'اِسْمُ مَكَانٍ', emoji: '🏫' }
    ]
  },
  {
    id: 'hunter-3',
    questionText: 'اِصْطَدْ أَفْعَالَ الْحَيَوَانَاتِ وَالطَّبِيعَةِ:',
    words: [
      { id: 'w-3-1', text: 'يَطِيرُ', isVerb: true, typeLabel: 'فِعْلٌ مُضَارِعٌ', emoji: '🦅' },
      { id: 'w-3-2', text: 'أَسَدٌ', isVerb: false, typeLabel: 'اِسْمُ حَيَوَانٍ', emoji: '🦁' },
      { id: 'w-3-3', text: 'نَبَحَ', isVerb: true, typeLabel: 'فِعْلٌ مَاضٍ', emoji: '🐕' },
      { id: 'w-3-4', text: 'شَمْسٌ', isVerb: false, typeLabel: 'اِسْمٌ', emoji: '☀️' },
      { id: 'w-3-5', text: 'تَسْبَحُ', isVerb: true, typeLabel: 'فِعْلٌ مُضَارِعٌ', emoji: '🐟' },
      { id: 'w-3-6', text: 'زَهْرَةٌ', isVerb: false, typeLabel: 'اِسْمُ نَبَاتٍ', emoji: '🌸' }
    ]
  }
];

// Game 2: Time Sorting (Past, Present, Imperative)
export const TIME_SORTING_ITEMS: TimeSortingQuestion[] = [
  { id: 'ts-1', word: 'أَكَلَ', tense: 'past', hint: 'أَكَلَ الطَّعَامَ وَشَبِعَ أَمْسِ', emoji: '🥣' },
  { id: 'ts-2', word: 'يَأْكُلُ', tense: 'present', hint: 'يَأْكُلُ فِي هَذِهِ اللَّحْظَةِ', emoji: '🥪' },
  { id: 'ts-3', word: 'كُلْ', tense: 'imperative', hint: 'طَلَبُ تَنَاوُلِ الطَّعَامِ', emoji: '🍽️' },
  { id: 'ts-4', word: 'شَرِبَ', tense: 'past', hint: 'شَرِبَ الْمَاءَ وَارْتَوَى فِي السَّابِقِ', emoji: '💧' },
  { id: 'ts-5', word: 'تَشْرَبُ', tense: 'present', hint: 'تَشْرَبُ الْعَصِيرَ الْآنَ', emoji: '🧃' },
  { id: 'ts-6', word: 'اِشْرَبْ', tense: 'imperative', hint: 'طَلَبُ شُرْبِ كَأْسِ الْحَلِيبِ', emoji: '🥛' },
  { id: 'ts-7', word: 'لَعِبَ', tense: 'past', hint: 'لَعِبَ بِالْكُرَةِ فِي الْمَاضِي', emoji: '⚽' },
  { id: 'ts-8', word: 'يَلْعَبُ', tense: 'present', hint: 'يَلْعَبُ مَعَ رِفَاقِهِ حَالِيًّا', emoji: '🎮' },
  { id: 'ts-9', word: 'اِلْعَبْ', tense: 'imperative', hint: 'طَلَبُ اللَّعِبِ وَالنَّشَاطِ', emoji: '🤹' },
  { id: 'ts-10', word: 'نَامَ', tense: 'past', hint: 'نَامَ وَاسْتَرَاحَ فِي الْمَاضِي', emoji: '🛌' },
  { id: 'ts-11', word: 'تَنَامُ', tense: 'present', hint: 'تَنَامُ فِي سَرِيرِهَا الْآنَ', emoji: '🌙' },
  { id: 'ts-12', word: 'نَمْ', tense: 'imperative', hint: 'طَلَبُ النَّوْمِ الْمُبَكِّرِ', emoji: '😴' }
];

// Game 3: Sentence Completion
export const SENTENCE_COMPLETION_QUESTIONS: SentenceCompletionQuestion[] = [
  {
    id: 'sc-1',
    sentenceBefore: 'الْوَلَدُ الْمُؤَدَّبُ',
    sentenceAfter: 'أَسْنَانَهُ بِالْفُرْشَاةِ وَالْمَعْجُونِ.',
    correctVerb: 'يُنَظِّفُ',
    options: ['يُنَظِّفُ', 'نَظَّارَةٌ', 'فِي', 'قَلَمٌ'],
    imageEmoji: '🪥',
    explanation: 'كَلِمَةُ (يُنَظِّفُ) هِيَ فِعْلٌ مُضَارِعٌ يَدُلُّ عَلَى النَّظَافَةِ وَالْعَمَلِ.'
  },
  {
    id: 'sc-2',
    sentenceBefore: 'الْعُصْفُورُ الصَّغِيرُ',
    sentenceAfter: 'فَوْقَ أَغْصَانِ الشَّجَرَةِ الْمُثْمِرَةِ.',
    correctVerb: 'يُغَرِّدُ',
    options: ['يُغَرِّدُ', 'شَجَرَةٌ', 'عَلَى', 'عُشٌّ'],
    imageEmoji: '🐦',
    explanation: 'كَلِمَةُ (يُغَرِّدُ) فِعْلٌ مُضَارِعٌ يُعَبِّرُ عَنْ صَوْتِ الْعُصْفُورِ.'
  },
  {
    id: 'sc-3',
    sentenceBefore: 'أَمْسِ،',
    sentenceAfter: 'التِّلْمِيذُ النَّشِيطُ دَرْسَ اللُّغَةِ الْعَرَبِيَّةِ.',
    correctVerb: 'كَتَبَ',
    options: ['كَتَبَ', 'يَكْتُبُ', 'كِتَابٌ', 'مَكْتَبٌ'],
    imageEmoji: '📝',
    explanation: 'لِأَنَّ كَلِمَةَ (أَمْسِ) تَدُلُّ عَلَى الْمَاضِي، نَخْتَارُ الْفِعْلَ الْمَاضِي (كَتَبَ).'
  },
  {
    id: 'sc-4',
    sentenceBefore: 'يَا صَدِيقِي،',
    sentenceAfter: 'صَوْتَ الْمُعَلِّمِ فِي الْقِسْمِ بِانْتِبَاهٍ.',
    correctVerb: 'اِسْمَعْ',
    options: ['اِسْمَعْ', 'سَمِعَ', 'أُذُنٌ', 'سَمَاعَةٌ'],
    imageEmoji: '👂',
    explanation: 'لِأَنَّنَا نُنَادِي صَدِيقَنَا وَنَطْلُبُ مِنْهُ عَمَلًا، نَسْتَعْمِلُ فِعْلَ الْأَمْرِ (اِسْمَعْ).'
  },
  {
    id: 'sc-5',
    sentenceBefore: 'الْفَتَاةُ الرَّائِعَةُ',
    sentenceAfter: 'أُمَّهَا فِي تَرْتِيبِ الْمَائِدَةِ الْآنَ.',
    correctVerb: 'تُسَاعِدُ',
    options: ['تُسَاعِدُ', 'سَاعَدَتْ', 'مَائِدَةٌ', 'مَعَ'],
    imageEmoji: '🍽️',
    explanation: 'كَلِمَةُ (الْآنَ) تَدُلُّ عَلَى الْحَاضِرِ، لِذَا نَسْتَعْمِلُ الْمُضَارِعَ (تُسَاعِدُ).'
  }
];

// Game 4: Magic Transformation
export const MAGIC_TRANSFORM_QUESTIONS: MagicTransformQuestion[] = [
  {
    id: 'mt-1',
    baseWord: 'رَسَمَ',
    fromTense: 'فِعْلٌ مَاضٍ',
    toTense: 'الْفِعْلِ الْمُضَارِعِ',
    targetTenseKey: 'present',
    correctWord: 'يَرْسُمُ',
    options: ['يَرْسُمُ', 'اِرْسُمْ', 'رَسَّامٌ', 'رَسْمَةٌ'],
    emoji: '🎨'
  },
  {
    id: 'mt-2',
    baseWord: 'شَرِبَ',
    fromTense: 'فِعْلٌ مَاضٍ',
    toTense: 'فِعْلِ الْأَمْرِ',
    targetTenseKey: 'imperative',
    correctWord: 'اِشْرَبْ',
    options: ['اِشْرَبْ', 'يَشْرَبُ', 'شَرَابٌ', 'شَرِبَتْ'],
    emoji: '🥛'
  },
  {
    id: 'mt-3',
    baseWord: 'يَلْعَبُ',
    fromTense: 'فِعْلٌ مُضَارِعٌ',
    toTense: 'الْفِعْلِ الْمَاضِي',
    targetTenseKey: 'past',
    correctWord: 'لَعِبَ',
    options: ['لَعِبَ', 'اِلْعَبْ', 'لُعْبَةٌ', 'مَلْعَبٌ'],
    emoji: '⚽'
  },
  {
    id: 'mt-4',
    baseWord: 'يَكْتُبُ',
    fromTense: 'فِعْلٌ مُضَارِعٌ',
    toTense: 'فِعْلِ الْأَمْرِ',
    targetTenseKey: 'imperative',
    correctWord: 'اِكْتُبْ',
    options: ['اِكْتُبْ', 'كَتَبَ', 'كَاتِبٌ', 'مَكْتَبَةٌ'],
    emoji: '✍️'
  },
  {
    id: 'mt-5',
    baseWord: 'اِسْمَعْ',
    fromTense: 'فِعْلُ أَمْرٍ',
    toTense: 'الْفِعْلِ الْمُضَارِعِ',
    targetTenseKey: 'present',
    correctWord: 'يَسْمَعُ',
    options: ['يَسْمَعُ', 'سَمِعَ', 'سَامِعٌ', 'سَمَاعٌ'],
    emoji: '👂'
  },
  {
    id: 'mt-6',
    baseWord: 'اِرْكُضْ',
    fromTense: 'فِعْلُ أَمْرٍ',
    toTense: 'الْفِعْلِ الْمَاضِي',
    targetTenseKey: 'past',
    correctWord: 'رَكَضَ',
    options: ['رَكَضَ', 'يَرْكُضُ', 'رَاكِضٌ', 'رَكْضٌ'],
    emoji: '🏃'
  },
  {
    id: 'mt-7',
    baseWord: 'نَامَ',
    fromTense: 'فِعْلٌ مَاضٍ',
    toTense: 'الْفِعْلِ الْمُضَارِعِ',
    targetTenseKey: 'present',
    correctWord: 'يَنَامُ',
    options: ['يَنَامُ', 'نَمْ', 'نَوْمٌ', 'سَرِيرٌ'],
    emoji: '🛌'
  },
  {
    id: 'mt-8',
    baseWord: 'اِحْفَظْ',
    fromTense: 'فِعْلُ أَمْرٍ',
    toTense: 'الْفِعْلِ الْمُضَارِعِ',
    targetTenseKey: 'present',
    correctWord: 'يَحْفَظُ',
    options: ['يَحْفَظُ', 'حَفِظَ', 'حَافِظٌ', 'مَحْفُوظٌ'],
    emoji: '🧠'
  }
];

// Game 5: Champions Grand Quiz (10 Questions for Grade 2 Arabic Verbs)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'qq-1',
    question: 'مَا هُوَ التَّعْرِيفُ الصَّحِيحُ لِلْفِعْلِ؟',
    audioPrompt: 'مَا هُوَ التَّعْرِيفُ الصَّحِيحُ لِلْفِعْلِ يَا بَطَلُ؟',
    options: [
      'كَلِمَةٌ تَدُلُّ عَلَى عَمَلٍ أَوْ حَرَكَةٍ فِي زَمَنٍ مُعَيَّنٍ.',
      'كَلِمَةٌ تَدُلُّ عَلَى اسْمِ إِنْسَانٍ أَوْ جَمَادٍ فَقَطْ.',
      'حَرْفٌ صَغِيرٌ يَرْبِطُ بَيْنَ الْكَلِمَاتِ.'
    ],
    correctIndex: 0,
    explanation: 'الْفِعْلُ دَائِمًا يَدُلُّ عَلَى عَمَلٍ أَوْ حَرَكَةٍ نَقُومُ بِهَا!',
    emoji: '🌟'
  },
  {
    id: 'qq-2',
    question: 'أَيُّ الْكَلِمَاتِ التَّالِيَةِ تُعْتَبَرُ فِعْلًا؟',
    audioPrompt: 'أَيُّ الْكَلِمَاتِ التَّالِيَةِ تُعْتَبَرُ فِعْلًا؟',
    options: ['شَجَرَةٌ', 'يَسْبَحُ', 'طَاوِلَةٌ'],
    correctIndex: 1,
    explanation: 'كَلِمَةُ (يَسْبَحُ) فِعْلٌ لِأَنَّهَا حَرَكَةٌ، بَيْنَمَا الشَّجَرَةُ وَالطَّاوِلَةُ أَسْمَاءٌ.',
    emoji: '🏊‍♂️'
  },
  {
    id: 'qq-3',
    question: 'كَلِمَةُ (قَرَأَ) هِيَ فِعْلٌ:',
    audioPrompt: 'كَلِمَةُ قَرَأَ هِيَ فِعْلٌ:',
    options: ['مَاضٍ (حَدَثَ وَانْتَهَى)', 'مُضَارِعٌ (يَحْدُثُ الْآنَ)', 'أَمْرٌ (طَلَبُ الْعَمَلِ)'],
    correctIndex: 0,
    explanation: '(قَرَأَ) فِعْلٌ مَاضٍ لِأَنَّهُ قَرَأَ فِي السَّابِقِ وَانْتَهَى مِنْ قِرَاءَتِهِ.',
    emoji: '📖'
  },
  {
    id: 'qq-4',
    question: 'كَلِمَةُ (تَرْكُضُ) هِيَ فِعْلٌ:',
    audioPrompt: 'كَلِمَةُ تَرْكُضُ هِيَ فِعْلٌ:',
    options: ['مَاضٍ', 'مُضَارِعٌ (تَرْكُضُ الْآنَ)', 'أَمْرٌ'],
    correctIndex: 1,
    explanation: '(تَرْكُضُ) فِعْلٌ مُضَارِعٌ يَبْدَأُ بِحَرْفِ التَّاءِ وَيَحْدُثُ فِي هَذِهِ اللَّحْظَةِ.',
    emoji: '🏃‍♀️'
  },
  {
    id: 'qq-5',
    question: 'عِنْدَمَا أَقُولُ لِأَخِي: (نَظِّفْ غُرْفَتَكَ)، كَلِمَةُ (نَظِّفْ) هِيَ فِعْلُ:',
    audioPrompt: 'عِنْدَمَا أَقُولُ لِأَخِي نَظِّفْ غُرْفَتَكَ، كَلِمَةُ نَظِّفْ هِيَ فِعْلُ:',
    options: ['مَاضٍ', 'مُضَارِعٌ', 'أَمْرٌ'],
    correctIndex: 2,
    explanation: '(نَظِّفْ) فِعْلُ أَمْرٍ لِأَنَّنَا نَطْلُبُ مِنْهُ الْقِيَامَ بِالتَّنْظِيفِ.',
    emoji: '🧹'
  },
  {
    id: 'qq-6',
    question: 'هَلْ يَقْبَلُ الْفِعْلُ أَنْ نَضَعَ لَهُ (الـ) التَّعْرِيفِ مِثْلَ: (الـيَكْتُبُ)؟',
    audioPrompt: 'هَلْ يَقْبَلُ الْفِعْلُ أَنْ نَضَعَ لَهُ أَلِفَ وَلَامَ التَّعْرِيفِ؟',
    options: ['لَا، الْفِعْلُ لَا يَقْبَلُ (الـ) التَّعْرِيفِ أَبَدًا', 'نَعَمْ، يَقْبَلُهَا دَائِمًا', 'فِي بَعْضِ الْأَحْيَانِ فَقَطْ'],
    correctIndex: 0,
    explanation: 'مُمْتَازٌ! (الـ) التَّعْرِيفِ تَدْخُلُ عَلَى الْأَسْمَاءِ فَقَطْ وَلَا تَدْخُلُ عَلَى الْأَفْعَالِ.',
    emoji: '🚫'
  },
  {
    id: 'qq-7',
    question: 'حَوِّلِ الْفِعْلَ الْمَاضِي (شَرِبَ) إِلَى فِعْلِ أَمْرٍ:',
    audioPrompt: 'حَوِّلِ الْفِعْلَ الْمَاضِي شَرِبَ إِلَى فِعْلِ أَمْرٍ:',
    options: ['اِشْرَبْ', 'يَشْرَبُ', 'شَارِبٌ'],
    correctIndex: 0,
    explanation: 'الْفِعْلُ الْمَاضِي (شَرِبَ) يُصْبِحُ فِي الْأَمْرِ (اِشْرَبْ).',
    emoji: '🥛'
  },
  {
    id: 'qq-8',
    question: 'مَا هُوَ الْفِعْلُ الْمُنَاسِبُ لِلْجُمْلَةِ: (سَارَةُ ... لَوْحَةً بِالْأَلْوَانِ الْآنَ)؟',
    audioPrompt: 'مَا هُوَ الْفِعْلُ الْمُنَاسِبُ لِلْجُمْلَةِ سَارَةُ لَوْحَةً بِالْأَلْوَانِ الْآنَ؟',
    options: ['تَرْسُمُ', 'رَسَمَ', 'اِرْسُمْ'],
    correctIndex: 0,
    explanation: 'لِأَنَّ سَارَةَ بِنْتٌ وَالْعَمَلُ يَحْدُثُ (الْآنَ)، نَسْتَعْمِلُ (تَرْسُمُ).',
    emoji: '🎨'
  },
  {
    id: 'qq-9',
    question: 'حُرُوفُ الْمُضَارَعَةِ الَّتِي يَبْدَأُ بِهَا الْفِعْلُ الْمُضَارِعُ مَجْمُوعَةٌ فِي كَلِمَةِ:',
    audioPrompt: 'حُرُوفُ الْمُضَارَعَةِ مَجْمُوعَةٌ فِي كَلِمَةِ:',
    options: ['نَأْتِي (نـ - أَ - تـ - يـ)', 'قَلَمٌ', 'بَابٌ'],
    correctIndex: 0,
    explanation: 'حُرُوفُ الْمُضَارَعَةِ هِيَ: (نَكْتُبُ - أَكْتُبُ - تَكْتُبُ - يَكْتُبُ) مَجْمُوعَةٌ فِي (نَأْتِي)!',
    emoji: '🎯'
  },
  {
    id: 'qq-10',
    question: 'أَيُّ الْجُمَلِ التَّالِيَةِ تَحْتَوِي عَلَى فِعْلٍ مَاضٍ؟',
    audioPrompt: 'أَيُّ الْجُمَلِ التَّالِيَةِ تَحْتَوِي عَلَى فِعْلٍ مَاضٍ؟',
    options: [
      'نَجَحَ التِّلْمِيذُ فِي الِامْتِحَانِ.',
      'يَشْرَحُ الْمُعَلِّمُ الدَّرْسَ.',
      'اِحْذَرْ مِنَ السَّيَّارَاتِ.'
    ],
    correctIndex: 0,
    explanation: '(نَجَحَ) فِعْلٌ مَاضٍ يَدُلُّ عَلَى النَّجَاحِ الَّذِي تَحَقَّقَ وَانْتَهَى!',
    emoji: '🏆'
  }
];
