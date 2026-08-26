export type AppTab = 'lessons' | 'games' | 'rewards' | 'guide';

export type AppViewMode = 'hub' | 'activity';

export type ActivityId =
  | 'lesson-1' // ما هو الفعل
  | 'lesson-2' // الفعل الماضي
  | 'lesson-3' // الفعل المضارع
  | 'lesson-4' // فعل الأمر
  | 'lesson-5' // مسرح التحويل
  | 'games-menu' // واجهة قائمة ألعاب الأفعال التفاعلية
  | 'game-hunter' // صياد الأفعال
  | 'game-sorter' // صندوق الأزمنة
  | 'game-completer' // أكمل الجملة بالفعل
  | 'game-transformer' // عصا التحويل السحرية
  | 'game-quiz' // تحدي الأبطال الكبير
  | 'rewards' // المكافآت والأوسمة
  | 'guide'; // دليل المعلم والولي

export type VerbTense = 'past' | 'present' | 'imperative' | 'not_verb';

export interface VerbItem {
  id: string;
  word: string;
  tashkeel: string;
  tense: VerbTense;
  tenseNameAr: string;
  meaningAr: string;
  exampleSentence: string;
  emoji: string;
  animationType?: 'jump' | 'write' | 'eat' | 'run' | 'read' | 'sleep' | 'draw' | 'swim';
  root?: string;
  pastForm?: string;
  presentForm?: string;
  imperativeForm?: string;
}

export interface LessonSection {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  iconName: string;
  conceptSummary: string;
  ruleExplanation: string[];
  examples: VerbItem[];
  interactiveDemo: {
    prompt: string;
    items: {
      id: string;
      text: string;
      isCorrect: boolean;
      hint: string;
    }[];
  };
}

export interface WordHunterQuestion {
  id: string;
  questionText: string;
  words: {
    id: string;
    text: string;
    isVerb: boolean;
    typeLabel: string;
    emoji: string;
  }[];
}

export interface TimeSortingQuestion {
  id: string;
  word: string;
  tense: 'past' | 'present' | 'imperative';
  hint: string;
  emoji: string;
}

export interface SentenceCompletionQuestion {
  id: string;
  sentenceBefore: string;
  sentenceAfter: string;
  correctVerb: string;
  options: string[];
  imageEmoji: string;
  explanation: string;
}

export interface MagicTransformQuestion {
  id: string;
  baseWord: string;
  fromTense: string;
  toTense: string;
  targetTenseKey: 'past' | 'present' | 'imperative';
  correctWord: string;
  options: string[];
  emoji: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  audioPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  emoji: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredStars: number;
  category: 'starter' | 'explorer' | 'master' | 'genius';
  unlocked: boolean;
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  actionText: string;
  tense: string;
  unlocked: boolean;
  costStars: number;
  x?: number;
  y?: number;
}

export interface UserProgress {
  childName: string;
  avatar: string;
  stars: number;
  gems: number;
  completedLessons: string[];
  unlockedBadges: string[];
  unlockedStickers: string[];
  gameScores: {
    hunter: number;
    sorter: number;
    completer: number;
    transformer: number;
    quiz: number;
  };
  stickerPlacements: {
    stickerId: string;
    x: number;
    y: number;
  }[];
  speechRate: number; // 0.8 for kids
  soundEnabled: boolean;
}
