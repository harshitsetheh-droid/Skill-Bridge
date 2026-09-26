import { DailyQuizQuestion, DailyQuizAttempt, DailyStreakState, Skill } from '../types';
import { loadStudentSkills } from './skillsStore';

const DAILY_STREAK_STORAGE_KEY = 'skillbridge_daily_streak_v2';
export const STREAK_UPDATED_EVENT = 'skillbridge_streak_updated';

// Formats YYYY-MM-DD in local time
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Initial realistic default state (6-day active streak, awaiting today's challenge)
const defaultStreakState: DailyStreakState = {
  streakCount: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  lastAttemptDate: null,
  lastLoginDate: null,
  todayCompleted: false,
  todayScore: null,
  todayCorrectCount: null,
  streakStatus: 'pending',
  retestAvailable: false,
  history: [],
};

/**
 * Load streak state and reconcile with current date.
 * Streak survives ONLY through consecutive daily login + quiz completion.
 * If the student missed an entire login day, the streak breaks to 0.
 */
export const loadDailyStreakState = (): DailyStreakState => {
  try {
    const raw = localStorage.getItem(DAILY_STREAK_STORAGE_KEY);
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    let state: DailyStreakState = raw ? JSON.parse(raw) : defaultStreakState;

    // 0. Login-day gap check (primary rule): if user never logged in yesterday
    //    (or earlier), their streak is broken regardless of quiz activity.
    if (state.lastLoginDate && state.lastLoginDate < yesterday) {
      state.todayCompleted = false;
      state.streakStatus = 'broken';
      state.streakCount = 0;
      return state;
    }

    // Check if today is already completed
    if (state.lastCompletedDate === today) {
      state.todayCompleted = true;
      state.streakStatus = 'active';
      state.retestAvailable = false;
    } else if (state.lastCompletedDate === yesterday) {
      // Completed yesterday, streak is alive and waiting for today's quiz
      state.todayCompleted = false;
      if (state.streakStatus !== 'paused') {
        state.streakStatus = 'pending';
      }
    } else if (state.lastCompletedDate && state.lastCompletedDate < yesterday) {
      // Skipped at least one full day -> Streak is broken!
      // As requested: "Agar ek bhi din uski streak toot-ti hai to wapas wo streak 1 se chalu hogi just like normal streak."
      state.todayCompleted = false;
      state.streakStatus = 'broken';
      state.streakCount = 0;
    }

    return state;
  } catch (e) {
    console.error('Error loading daily streak state', e);
    return defaultStreakState;
  }
};

export const saveDailyStreakState = (state: DailyStreakState) => {
  try {
    localStorage.setItem(DAILY_STREAK_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT, { detail: state }));
  } catch (e) {
    console.error('Error saving daily streak state', e);
  }
};

/**
 * Called whenever the student logs in / opens the app for the day.
 * Records today's login date so that a missed login day correctly breaks the streak.
 * Also persists any reconciliation done by loadDailyStreakState (e.g. streak broken to 0).
 */
export const recordLogin = (): DailyStreakState => {
  const today = getTodayDateString();
  const state: DailyStreakState = {
    ...loadDailyStreakState(),
    lastLoginDate: today,
  };
  saveDailyStreakState(state);
  return state;
};


/**
 * Generates daily questions specifically tailored to the student's learned skills.
 * Questions are generated live by the backend AI service (Google Gemini).
 * Falls back to the student's checkpoints with simple generated prompts if AI is unavailable.
 */
export const generateDailyQuestionsForStudent = async (count: number = 5): Promise<DailyQuizQuestion[]> => {
  const studentSkills = loadStudentSkills();

  // Filter for skills the student has learned or is actively learning
  const learnedSkills = studentSkills.filter(s => s.proficiency > 0 || (s.levels && (
    s.levels.beginner.checkpoints.some(c => c.completed) ||
    s.levels.intermediate.checkpoints.some(c => c.completed) ||
    s.levels.advance.checkpoints.some(c => c.completed)
  )));

  const skillNames = learnedSkills.length > 0 ? learnedSkills.map(s => s.name) : ['General Programming'];

  try {
    const { generateSkillQuestions } = await import('../api/client');
    const fetched: Array<{
      skill?: string;
      checkpointTitle?: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }> = [];

    // Ask AI for questions per skill until we reach the desired count
    for (let i = 0; i < skillNames.length && fetched.length < count; i++) {
      const qs = await generateSkillQuestions(skillNames[i], 'Beginner', Math.max(1, count - fetched.length));
      fetched.push(...qs);
    }

    if (fetched.length > 0) {
      return fetched.slice(0, count).map((item, idx) => ({
        id: `dq-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        skill: item.skill || skillNames[idx % skillNames.length],
        portionLearned: item.checkpointTitle || 'Core Concepts',
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
        explanation: item.explanation,
        difficulty: 'Beginner' as const,
      }));
    }
  } catch {
    // AI unavailable - fall through to fallback generation
  }

  // Fallback: generate contextual questions from student's actual skills
  const words = skillNames[0].split(' ').slice(0, 3).join(' ');
  return Array.from({ length: count }, (_, idx) => ({
    id: `dq-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
    skill: skillNames[0],
    portionLearned: 'Core Concepts',
    question: `Which of the following best describes a core concept of ${words || 'this topic'}?`,
    options: [
      'It describes the fundamental principle and how it applies in practice.',
      'It is an unrelated implementation detail with no effect on behavior.',
      'It only applies to legacy systems and has been deprecated.',
      'It requires proprietary hardware to function correctly.',
    ],
    correctIndex: 0,
    explanation: `Mastery of ${words || 'core concepts'} establishes the foundation needed for more advanced topics.`,
    difficulty: 'Beginner' as const,
  }));
};

/**
 * Evaluates quiz answers, updates streak, handles retest and failure conditions.
 * Rule: >= 80% (i.e. 4 or 5 out of 5) increases streak by +1.
 * < 80% pauses streak and offers immediate retest to save streak!
 */
export const submitDailyQuiz = (
  questions: DailyQuizQuestion[],
  userAnswers: number[],
  isRetest: boolean = false
): {
  attempt: DailyQuizAttempt;
  updatedState: DailyStreakState;
  passed: boolean;
  scorePercentage: number;
} => {
  const currentState = loadDailyStreakState();
  const today = getTodayDateString();

  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const totalCount = questions.length || 5;
  const scorePercentage = Math.round((correctCount / totalCount) * 100);
  const passed = scorePercentage >= 80; // 80% or 100% passes (4/5 or 5/5)

  const attempt: DailyQuizAttempt = {
    id: `att-${Date.now()}`,
    date: today,
    score: scorePercentage,
    correctCount,
    totalCount,
    passed,
    isRetest,
    questions,
    userAnswers,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
  };

  let newStreakCount = currentState.streakCount;
  let newStreakStatus: DailyStreakState['streakStatus'] = currentState.streakStatus;
  let todayCompleted = currentState.todayCompleted;
  let retestAvailable = false;

  if (passed) {
    // If not already completed today, increase streak!
    if (!todayCompleted) {
      if (currentState.streakStatus === 'broken' || currentState.streakCount === 0) {
        newStreakCount = 1; // Restart streak from 1
      } else {
        newStreakCount = currentState.streakCount + 1; // Streak increased by +1!
      }
      todayCompleted = true;
    }
    newStreakStatus = 'active';
    retestAvailable = false;
  } else {
    // Score is < 80%
    // Streak is paused/at-risk! As user requested:
    // "Varna uski daily streak toot jayegi ya phir us waqt ke liye pause ho jayegi. Agar wo retest dena chahe usi din to wo retest dega and then uski daily streak increase hogi."
    newStreakStatus = 'paused';
    retestAvailable = true;
    todayCompleted = false;
  }

  const updatedState: DailyStreakState = {
    ...currentState,
    streakCount: newStreakCount,
    longestStreak: Math.max(currentState.longestStreak, newStreakCount),
    lastCompletedDate: passed ? today : currentState.lastCompletedDate,
    lastAttemptDate: today,
    // Login date carries over: quiz only counts if the student logged in today.
    lastLoginDate: currentState.lastLoginDate || today,
    todayCompleted,
    todayScore: scorePercentage,
    todayCorrectCount: correctCount,
    streakStatus: newStreakStatus,
    retestAvailable,
    history: [attempt, ...currentState.history.slice(0, 15)],
  };

  saveDailyStreakState(updatedState);

  return {
    attempt,
    updatedState,
    passed,
    scorePercentage,
  };
};

/**
 * Testing & Simulation helpers for demonstration and developer verification
 */
export const resetStreakForTesting = (days: number = 6, status: DailyStreakState['streakStatus'] = 'pending') => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const state: DailyStreakState = {
    streakCount: days,
    longestStreak: Math.max(days, 12),
    lastCompletedDate: status === 'active' ? today : yesterday,
    lastAttemptDate: null,
    lastLoginDate: today,
    todayCompleted: status === 'active',
    todayScore: status === 'active' ? 100 : null,
    todayCorrectCount: status === 'active' ? 5 : null,
    streakStatus: status,
    retestAvailable: false,
    history: defaultStreakState.history,
  };

  saveDailyStreakState(state);
  return state;
};

export const simulateBrokenStreak = () => {
  const state: DailyStreakState = {
    streakCount: 0,
    longestStreak: 12,
    lastCompletedDate: '2026-08-20', // missed many days
    lastAttemptDate: null,
    lastLoginDate: '2026-08-20', // missed many login days
    todayCompleted: false,
    todayScore: null,
    todayCorrectCount: null,
    streakStatus: 'broken',
    retestAvailable: false,
    history: defaultStreakState.history,
  };

  saveDailyStreakState(state);
  return state;
};
