import React, { useState, useEffect, useCallback } from 'react';
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  Brain,
  Info,
  Play,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { useProctoring } from '../../proctoring/useProctoring';
import { useQuestionTimer } from '../../proctoring/useQuestionTimer';
import { ProctorSetup } from '../common/ProctorSetup';
import { ProctorHud } from '../common/ProctorHud';
import { QuestionTimer } from '../common/QuestionTimer';
import {
  DailyQuizQuestion,
  DailyStreakState,
} from '../../types';
import {
  loadDailyStreakState,
  generateDailyQuestionsForStudent,
  submitDailyQuiz,
  recordLogin,
  STREAK_UPDATED_EVENT,
  getTodayDateString,
} from '../../data/dailyQuizStore';
import { loadStudentSkills } from '../../data/skillsStore';

export const DailyQuestionsView: React.FC = () => {
  const [streakState, setStreakState] = useState<DailyStreakState>(loadDailyStreakState);
  const [questions, setQuestions] = useState<DailyQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    score: number;
    correctCount: number;
    isRetest: boolean;
  } | null>(null);
  const [isRetestMode, setIsRetestMode] = useState(false);
  const [showProctorSetup, setShowProctorSetup] = useState(false);
  const [locked, setLocked] = useState<boolean[]>([]);
  const [needAnswerHint, setNeedAnswerHint] = useState(false);

  // ── Proctoring (camera + mic + tab) ────────────────────────────────────────
  const proctor = useProctoring({
    maxWarnings: 3,
    onViolationLimitReached: () => submitQuiz(),
  });

  const timer = useQuestionTimer({
    totalSeconds: 30,
    running: quizStarted && !quizSubmitted && !showProctorSetup,
    onExpire: () => handleQuestionTimeout(),
  });

  useEffect(() => {
    if (quizStarted && !quizSubmitted && !showProctorSetup) {
      timer.reset();
      setNeedAnswerHint(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, quizStarted, quizSubmitted, showProctorSetup]);

  // Sync with streak storage events
  useEffect(() => {
    const handleUpdate = () => {
      setStreakState(loadDailyStreakState());
    };
    window.addEventListener(STREAK_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STREAK_UPDATED_EVENT, handleUpdate);
  }, []);

  // Initialize or load fresh questions when starting quiz
  const handleStartQuiz = async (retest: boolean = false) => {
    const qs = await generateDailyQuestionsForStudent(5);
    setQuestions(qs);
    setSelectedAnswers(new Array(5).fill(-1));
    setLocked(new Array(5).fill(false));
    setNeedAnswerHint(false);
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setQuizResult(null);
    setIsRetestMode(retest);
    setQuizStarted(true);
  };

  const beginProctoredQuiz = (retest: boolean) => {
    setIsRetestMode(retest);
    setShowProctorSetup(true);
  };

  const handleProctorGranted = async () => {
    const ok = await proctor.start();
    if (ok) {
      setShowProctorSetup(false);
      await handleStartQuiz(isRetestMode);
    }
  };

  const handleProctorCancel = () => {
    setShowProctorSetup(false);
    proctor.stop();
  };

  const submitQuiz = () => {
    if (quizSubmitted) return;

    proctor.stop();

    const { passed, scorePercentage, attempt } = submitDailyQuiz(
      questions,
      selectedAnswers,
      isRetestMode
    );

    setQuizResult({
      passed,
      score: scorePercentage,
      correctCount: attempt.correctCount,
      isRetest: isRetestMode,
    });
    setQuizSubmitted(true);
    setStreakState(loadDailyStreakState());
  };

  const handleQuestionTimeout = () => {
    if (quizSubmitted) return;
    const idx = currentQuestionIndex;
    setLocked((prev) => {
      const n = [...prev];
      n[idx] = true;
      return n;
    });
    if (idx < questions.length - 1) {
      setCurrentQuestionIndex(idx + 1);
    } else {
      submitQuiz();
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (quizSubmitted || locked[currentQuestionIndex]) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    setNeedAnswerHint(false);
  };

  const handleNextQuestion = () => {
    if (quizSubmitted) return;
    if (selectedAnswers[currentQuestionIndex] === -1) setNeedAnswerHint(true);
    if (currentQuestionIndex < questions.length - 1) {
      setLocked((prev) => {
        const n = [...prev];
        n[currentQuestionIndex] = true;
        return n;
      });
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const studentSkills = loadStudentSkills();
  const learnedSkillsList = studentSkills.filter(s => s.proficiency > 0);

  const currentQ = questions[currentQuestionIndex];

  // Past 7 Days representation
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <>
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-16 animate-fade-in">
      {/* Proctoring Setup Overlay */}
      {showProctorSetup && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-8 animate-scale-in">
            <ProctorSetup
              status={proctor.status}
              error={proctor.error}
              videoRef={proctor.videoRef}
              onGrant={() => void handleProctorGranted()}
              onCancel={handleProctorCancel}
              title="Proctored Daily Quiz — Enable Camera & Mic"
              subtitle="Your 5 daily questions are AI-proctored. Camera tracks your movement/face and the mic detects talking, so cheating is impossible."
            />
          </div>
        </div>
      )}
      {/* Top Banner: Streak Status & Daily Motivation */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>AI-Powered Skill Assessment • 5 Questions Daily</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Daily Streak & Skill Challenge 🔥
            </h1>

            <p className="text-xs sm:text-sm text-amber-50/90 max-w-xl leading-relaxed">
              Log in daily and score <span className="font-bold underline text-white">80% or more (4/5)</span> on 5 random questions from your learned skills to maintain and increase your streak!
            </p>
          </div>

          {/* Big Flame Counter Badge */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner min-w-[190px]">
            <div className="flex items-center gap-2">
              <Flame className={`w-9 h-9 text-amber-300 drop-shadow-md ${streakState.streakStatus === 'active' ? 'animate-bounce' : ''}`} />
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {streakState.streakCount}
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 mt-1">
              Days Streak
            </span>
            <div className="text-[10px] text-white/80 mt-1 font-medium">
              Best Record: {streakState.longestStreak} Days
            </div>
          </div>
        </div>

        {/* 7-Day Visual Progress Track */}
        <div className="mt-6 pt-5 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === currentDayIndex;
              const isPast = idx < currentDayIndex;
              const completedDay = isPast || (isToday && streakState.todayCompleted);

              return (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                    isToday
                      ? 'bg-white text-slate-900 ring-2 ring-amber-300 shadow-md scale-105'
                      : completedDay
                      ? 'bg-white/20 text-white'
                      : 'bg-black/10 text-white/60'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{day}</span>
                  <div className="mt-1">
                    {completedDay ? (
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ) : isToday ? (
                      streakState.streakStatus === 'paused' ? (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400 animate-pulse" />
                      )
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/30 block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-right text-xs">
            {streakState.todayCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/30 border border-emerald-300/40 text-white font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                Today's Streak Secured! ({streakState.todayScore}%)
              </span>
            ) : streakState.streakStatus === 'paused' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/30 border border-rose-300/40 text-white font-bold">
                <AlertCircle className="w-4 h-4 text-rose-200" />
                Streak Paused • Retest Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/30 border border-amber-200/40 text-white font-bold">
                <Clock className="w-4 h-4 text-amber-200" />
                Today's Challenge Pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!quizStarted ? (
        /* Overview & Start Screen */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Cols: Start Action & Challenge Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Today's Daily Assessment</h2>
                    <p className="text-xs text-slate-500">
                      Generated from your verified curriculum skills & checkpoints
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  5 MCQs • ~3 mins
                </span>
              </div>

              {/* Status Alert */}
              {streakState.todayCompleted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900 leading-relaxed">
                    <div className="font-bold text-sm text-emerald-950">
                      Awesome job, Harshit! Streak is active ({streakState.streakCount} Days 🔥)
                    </div>
                    You achieved <span className="font-bold">{streakState.todayScore}%</span> today. You have completed today's daily streak obligation! You can take an extra practice test anytime without affecting your streak.
                  </div>
                </div>
              ) : streakState.streakStatus === 'paused' ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-900 leading-relaxed">
                    <div className="font-bold text-sm text-rose-950">
                      Streak Paused! Retest Required Today
                    </div>
                    Your previous attempt was below 80%. Take an immediate retest now! If you score 80% or higher, your streak will be safely incremented by +1.
                  </div>
                </div>
              ) : streakState.streakStatus === 'broken' ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <div className="font-bold text-sm text-amber-950">
                      Streak Reset: Ready for Day 1!
                    </div>
                    A day was missed, so the streak resets. Pass today's 5 questions with ≥80% to launch your new 1-Day streak.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
                  <Flame className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 leading-relaxed">
                    <div className="font-bold text-sm text-blue-950">
                      Keep Your {streakState.streakCount}-Day Streak Alive!
                    </div>
                    Answer today's 5 AI-curated questions. Get 4 or 5 correct (≥80%) to reach <span className="font-bold text-indigo-700">{streakState.streakCount + 1} Days</span>!
                  </div>
                </div>
              )}

              {/* Skills In Question Scope */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Skills Being Evaluated Today:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {learnedSkillsList.slice(0, 7).map(skill => (
                    <span
                      key={skill.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rules Checklist */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-800">Streak Mechanics & Rules:</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li><span className="font-semibold text-slate-900">Score ≥80%:</span> Daily streak increments by +1 immediately.</li>
                  <li><span className="font-semibold text-slate-900">Score &lt;80%:</span> Streak pauses. Take an immediate retest on the same day to earn your +1 streak!</li>
                  <li><span className="font-semibold text-slate-900">Miss a Day:</span> Streak resets back to 1 on your next successful quiz.</li>
                  <li><span className="font-semibold text-slate-900">AI Tailored:</span> Only questions from portions you have studied are selected.</li>
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => beginProctoredQuiz(streakState.streakStatus === 'paused')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {streakState.todayCompleted
                      ? 'Practice Bonus Daily Quiz'
                      : streakState.streakStatus === 'paused'
                      ? 'Take Streak Retest Now (Save Streak!)'
                      : 'Start Today’s 5 Questions'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Streak Stats & Recent History */}
          <div className="space-y-5">
            {/* Streak Health Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Streak Insights</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-600">Current Streak</span>
                  <span className="text-base font-bold text-orange-600 flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    {streakState.streakCount} Days
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-600">Longest Streak</span>
                  <span className="text-base font-bold text-indigo-700">
                    {streakState.longestStreak} Days
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-600">Passing Threshold</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    ≥ 80% (4/5 Qs)
                  </span>
                </div>
              </div>
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Recent Daily Quizzes</span>
              </h3>

              <div className="space-y-2">
                {streakState.history.slice(0, 4).map((att, idx) => (
                  <div
                    key={att.id || idx}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{att.timestamp || att.date}</div>
                      <div className="text-[10px] text-slate-400">
                        {att.correctCount} of {att.totalCount} correct
                        {att.isRetest && ' (Retest)'}
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        att.passed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {att.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : !quizSubmitted ? (
        /* Active Quiz Screen (5 Questions) */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
          {/* Live Proctoring HUD */}
          <ProctorHud
            videoRef={proctor.videoRef}
            status={proctor.status}
            warningCount={proctor.warningCount}
            maxWarnings={3}
            tabViolations={proctor.tabViolations}
            lastViolation={proctor.lastViolation}
            faceState={proctor.faceState}
            micLevel={proctor.micLevel}
          />

          {/* Manual submit from results-return reset */}
          {proctor.autoSubmitted && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>Proctoring violation detected — this answer sheet will be auto-submitted.</span>
            </div>
          )}

          {/* Question Progress Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                {isRetestMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Streak Retest Mode
                  </span>
                )}
                {locked[currentQuestionIndex] && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-slate-800 mt-0.5">
                Topic: {currentQ?.skill} • <span className="text-slate-500 font-normal">{currentQ?.portionLearned}</span>
              </h2>
            </div>

            {/* Question Badges */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {currentQ?.difficulty}
              </span>
              <QuestionTimer seconds={timer.seconds} progress={timer.progress} totalSeconds={30} />
            </div>
          </div>

          {needAnswerHint && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-800 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              No option selected — this question will be skipped and earn no marks.
            </div>
          )}

          {/* Stepper Dots (non-clickable — forward-only) */}
          <div className="flex items-center gap-2">
            {questions.map((_, idx) => (
              <span
                key={idx}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentQuestionIndex
                    ? 'w-8 bg-indigo-600'
                    : selectedAnswers[idx] !== -1 && locked[idx]
                    ? 'w-4 bg-indigo-400'
                    : selectedAnswers[idx] !== -1
                    ? 'w-4 bg-emerald-500'
                    : 'w-4 bg-slate-200'
                }`}
                title={idx < currentQuestionIndex ? `Question ${idx + 1} (answered & locked)` : `Question ${idx + 1}`}
              />
            ))}
            <span className="ml-auto text-[10px] text-slate-400 font-medium hidden sm:inline">
              ⛔ You can't go back to a previous question.
            </span>
          </div>

          {/* Current Question Body */}
          {currentQ && (
            <div className="space-y-5">
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  const isLocked = locked[currentQuestionIndex];

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isLocked && !isSelected
                          ? 'opacity-60 cursor-not-allowed border-slate-200'
                          : isLocked && isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs cursor-default'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 cursor-pointer'
                      }`}
                      title={isLocked ? 'This answer is locked — you cannot go back or change it.' : ''}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className={`text-xs sm:text-sm ${isSelected ? 'font-bold text-indigo-950' : 'text-slate-800'}`}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Answered questions are locked permanently.
            </div>

            <div className="flex items-center gap-3">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Submit &amp; Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => submitQuiz()}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Daily Assessment</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          {proctor.autoSubmitted && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>
                Answer sheet was auto-submitted due to a proctoring violation (tab switch / camera / mic warning). Any
                unanswered questions were marked incorrect.
              </span>
            </div>
          )}
          {quizResult && (
            <div className="space-y-6">
              {/* Header Status Outcome */}
              <div
                className={`p-6 rounded-2xl border text-center space-y-3 ${
                  quizResult.passed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto shadow-md">
                  {quizResult.passed ? (
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Flame className="w-9 h-9 fill-amber-300 text-amber-300 animate-bounce" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center">
                      <AlertCircle className="w-9 h-9 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    {quizResult.passed
                      ? 'Streak +1 Awarded! Daily Challenge Passed 🎉'
                      : 'Score Below 80% • Streak Paused ⚠️'}
                  </h2>
                  <p className="text-xs sm:text-sm mt-1 max-w-md mx-auto">
                    {quizResult.passed
                      ? `Congratulations! You scored ${quizResult.score}% (${quizResult.correctCount}/5). Your streak has grown to ${streakState.streakCount} Days!`
                      : `You scored ${quizResult.score}% (${quizResult.correctCount}/5). Minimum required is 80% (4/5). Retest immediately to restore and increase your streak!`}
                  </p>
                </div>

                {/* Score Pill */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="px-4 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200 text-xs font-bold text-slate-800">
                    Score: {quizResult.score}% ({quizResult.correctCount}/5 Correct)
                  </div>
                  <div className="px-4 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200 text-xs font-bold text-orange-600 flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    Streak: {streakState.streakCount} Days
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  {!quizResult.passed ? (
                    <button
                      onClick={() => beginProctoredQuiz(true)}
                      className="py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Take Streak Retest Now (Same Day)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizStarted(false);
                        setQuizSubmitted(false);
                      }}
                      className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Return to Streak Dashboard
                    </button>
                  )}
                </div>
              </div>

              {/* Detailed Breakdown with Explanations */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Question Review & Explanations</span>
                </h3>

                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">Question {idx + 1}</span>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                {q.skill}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({q.portionLearned})
                              </span>
                            </div>
                            <div className="text-sm font-bold text-slate-900 mt-1">
                              {q.question}
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        {/* Options check */}
                        <div className="mt-3 space-y-1.5 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isUserPick = userAns === optIdx;
                            const isCorrectOpt = q.correctIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl flex items-center justify-between ${
                                  isCorrectOpt
                                    ? 'bg-emerald-100/70 text-emerald-900 font-bold border border-emerald-300'
                                    : isUserPick
                                    ? 'bg-rose-100/70 text-rose-900 font-bold border border-rose-300'
                                    : 'bg-white text-slate-600'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isCorrectOpt && <span className="text-[10px] uppercase font-bold text-emerald-800">Correct Answer</span>}
                                {isUserPick && !isCorrectOpt && <span className="text-[10px] uppercase font-bold text-rose-700">Your Choice</span>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <div className="mt-3 p-3 rounded-xl bg-white border border-slate-100 text-xs text-slate-600 leading-relaxed">
                          <span className="font-bold text-indigo-700">Explanation:</span> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};
