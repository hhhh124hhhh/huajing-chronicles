
export interface Level {
  id: number;
  title: string; // e.g., "LEVEL 1"
  subtitle: string; // e.g., "新手村"
  description: string;
  colors: {
    bg: string; // Main card background hex
    text: string; // Main text color hex
    button: string; // Button background hex
    shadow: string; // Shadow color hex
    accent: string; // Decorative elements
  };
  modules: GameModule[];
  imageKeyword: string; // For placeholder images
}

export interface GameModule {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface QuizData {
  scenario: string; // The story setup
  question: string; // The immediate decision
  options: string[]; // The choices
  outcomes: string[]; // Specific narrative result for EACH option
  correctIndex: number; // Which one yields the best 'Financial XP'
  explanation: string; // (Optional) General educational takeaway
}

export interface ModuleRecord {
  moduleId: string;
  quizData: QuizData;
  selectedOptionIndex: number;
  timestamp: number; // For sorting history
  isOptimal: boolean; // Track if it was the "correct" financial choice
}

export type AgeGroup = 'child' | 'teen' | 'adult';

export interface UserProfile {
  nickname: string;
  age: number;
  ageGroup: AgeGroup;
  industry?: string; // 新增：行业/职业背景
  avatarStyle: string; // 新增：视觉风格
}

export interface IntroData {
  story: string;
  imageUrl: string | null;
}

export interface FinancialReport {
  personaTitle: string; // e.g. "稳健的长期主义者" or "激进的投机客"
  analysis: string; // Detailed analysis of their playstyle
  advice: string; // Advice for improvement
  score: number; // Calculated financial IQ score 0-100
}

export interface UserProgress {
  unlockedLevels: number; // Max unlocked level ID (starts at 1)
  completedModules: string[]; // List of module IDs completed
  xp: number;
  history: Record<string, ModuleRecord>; // Map of moduleId to result history
  profile?: UserProfile; // User's age and persona info
  report?: FinancialReport; // The AI generated report
  narrativeContext: string; // Accumulating story context for AI personalization
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  condition: (progress: UserProgress) => boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}
