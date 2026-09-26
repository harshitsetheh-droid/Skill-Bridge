import React, { useState, useEffect } from 'react';
import { 
  loadStudentSkills, 
  saveStudentSkills, 
  toggleSkillCheckpoint,
  calculateSkillProficiency,
  addStudentSkill,
  updateSkillVerification,
  TIER_WEIGHTS,
  SKILLS_UPDATED_EVENT 
} from '../../data/skillsStore';
import { addStudentSkillRequest } from '../../data/skillRequestsStore';
import { 
  getOrGenerateSkillAssessment, 
  evaluateAssessment, 
  AssessmentQuestion, 
  AssessmentResult 
} from '../../data/aiSkillAssessments';
import { Skill } from '../../types';
import {
  Award, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  Sparkles, 
  Check, 
  X, 
  Plus, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Send, 
  CheckSquare, 
  Square, 
  CheckCheck,
  GraduationCap,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Target,
  RotateCcw,
  FileQuestion,
  Lock
} from 'lucide-react';
import { useProctoring } from '../../proctoring/useProctoring';
import { useQuestionTimer } from '../../proctoring/useQuestionTimer';
import { ProctorSetup } from '../common/ProctorSetup';
import { ProctorHud } from '../common/ProctorHud';
import { QuestionTimer } from '../common/QuestionTimer';

export const MySkillsView: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>(() => loadStudentSkills());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>('1'); // Default expand React.js
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Skill Modal
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Frontend');

  // Request to TPO Modal
  const [isRequestTpoOpen, setIsRequestTpoOpen] = useState(false);
  const [requestSkillName, setRequestSkillName] = useState('');
  const [requestCategory, setRequestCategory] = useState<Skill['category']>('Core CS');
  const [requestReason, setRequestReason] = useState('');

  // AI Assessment Modal State
  const [activeAssessmentSkill, setActiveAssessmentSkill] = useState<Skill | null>(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [proctorSetupMode, setProctorSetupMode] = useState(true);
  const [locked, setLocked] = useState<boolean[]>([]);
  const [needAnswerHint, setNeedAnswerHint] = useState(false);

  // ── Proctoring (camera + mic + tab) ────────────────────────────────────────
  const proctor = useProctoring({
    maxWarnings: 3,
    onViolationLimitReached: () => handleSubmitAssessment(true),
  });

  const timer = useQuestionTimer({
    totalSeconds: 30,
    running:
      !!activeAssessmentSkill &&
      !assessmentResult &&
      assessmentQuestions.length > 0 &&
      !proctorSetupMode,
    onExpire: () => handleAssessmentTimeout(),
  });

  useEffect(() => {
    if (
      activeAssessmentSkill &&
      !assessmentResult &&
      assessmentQuestions.length > 0 &&
      !proctorSetupMode
    ) {
      timer.reset();
      setNeedAnswerHint(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, activeAssessmentSkill, assessmentQuestions, assessmentResult, proctorSetupMode]);

  useEffect(() => {
    const handleUpdated = () => {
      setSkills(loadStudentSkills());
    };
    window.addEventListener(SKILLS_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(SKILLS_UPDATED_EVENT, handleUpdated);
  }, []);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Core CS', 'DevOps', 'AI / Data', 'Soft Skills'];

  const filteredSkills = skills.filter((skill) => {
    const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggleCheckpoint = (
    skill: Skill,
    tier: 'beginner' | 'intermediate' | 'advance',
    checkpointId: string,
    checkpointTitle: string
  ) => {
    const { updatedSkills, changedSkill } = toggleSkillCheckpoint(skill.id, tier, checkpointId);
    setSkills(updatedSkills);

    if (changedSkill && changedSkill.levels) {
      const calc = calculateSkillProficiency(changedSkill.levels);
      const isNowCompleted = changedSkill.levels[tier].checkpoints.find((c) => c.id === checkpointId)?.completed;
      const pointVal = calc.checkpointValues[tier];

      const allBeginnerDone = changedSkill.levels.beginner.checkpoints.every((c) => c.completed);
      if (tier === 'beginner' && isNowCompleted && allBeginnerDone && changedSkill.status !== 'verified') {
        setToastMessage(
          `🎉 All Beginner Checkpoints completed for ${changedSkill.name}! AI Verification Test is unlocked. Score 80%+ to get Verified!`
        );
      } else {
        setToastMessage(
          isNowCompleted
            ? `✓ Completed "${checkpointTitle}" (+${pointVal}%). ${changedSkill.name} is now at ${changedSkill.proficiency}%!`
            : `Checkpoint unmarked. ${changedSkill.name} is now at ${changedSkill.proficiency}%.`
        );
      }
      setTimeout(() => setToastMessage(null), 4500);
    }
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const res = addStudentSkill(newSkillName.trim(), newSkillCategory);
    if (res.success) {
      setToastMessage(`✓ ${res.message} Checkpoints loaded for Beginner, Intermediate, and Advance!`);
      setTimeout(() => setToastMessage(null), 4000);
      setIsAddSkillOpen(false);
      setNewSkillName('');
      if (res.skill) setExpandedSkillId(res.skill.id);
    } else {
      setToastMessage(`Notice: ${res.message}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleSubmitTpoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestSkillName.trim() || !requestReason.trim()) return;

    addStudentSkillRequest(
      requestSkillName.trim(),
      requestCategory,
      requestReason.trim(),
      'Harshit Seth',
      'Institute of Technology, Jodhpur'
    );

    setToastMessage(
      `✓ Request for "${requestSkillName}" sent to TPO! The placement cell will review and add official checkpoints.`
    );
    setTimeout(() => setToastMessage(null), 5000);
    setIsRequestTpoOpen(false);
    setRequestSkillName('');
    setRequestReason('');
  };

  const handleStartAssessment = async (skill: Skill) => {
    setActiveAssessmentSkill(skill);
    setAssessmentResult(null);
    setProctorSetupMode(true);
  };

  const handleAssessmentProctorGranted = async () => {
    if (!activeAssessmentSkill) return;
    const ok = await proctor.start();
    if (!ok) return;
    const questions = await getOrGenerateSkillAssessment(activeAssessmentSkill);
    setAssessmentQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setAssessmentResult(null);
    setLocked(new Array(questions.length).fill(false));
    setNeedAnswerHint(false);
    setProctorSetupMode(false);
  };

  const closeAssessmentModal = () => {
    proctor.stop();
    setActiveAssessmentSkill(null);
    setAssessmentResult(null);
    setAssessmentQuestions([]);
    setProctorSetupMode(true);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (locked[currentQuestionIndex]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIdx,
    }));
    setNeedAnswerHint(false);
  };

  const handleNextAssessmentQuestion = () => {
    if (assessmentQuestions.length === 0) return;
    if (userAnswers[currentQuestionIndex] === undefined) setNeedAnswerHint(true);
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setLocked((prev) => {
        const n = [...prev];
        n[currentQuestionIndex] = true;
        return n;
      });
      setCurrentQuestionIndex((prev) => Math.min(assessmentQuestions.length - 1, prev + 1));
    }
  };

  const handleAssessmentTimeout = () => {
    if (!activeAssessmentSkill || assessmentResult) return;
    const idx = currentQuestionIndex;
    setLocked((prev) => {
      const n = [...prev];
      n[idx] = true;
      return n;
    });
    if (idx < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(idx + 1);
    } else {
      handleSubmitAssessment(true);
    }
  };

  const handleSubmitAssessment = (forceOverride: boolean = false) => {
    if (!activeAssessmentSkill) return;

    proctor.stop();

    const result = evaluateAssessment(activeAssessmentSkill, assessmentQuestions, userAnswers);
    setAssessmentResult(result);

    const newStatus: 'verified' | 'self-claimed' = result.passed ? 'verified' : 'self-claimed';
    updateSkillVerification(activeAssessmentSkill.id, newStatus, result.scorePercentage);
    setSkills(loadStudentSkills());

    if (result.passed) {
      setToastMessage(
        `🎉 Verified Badge Earned! Scored ${result.scorePercentage}% (≥80%). ${activeAssessmentSkill.name} is now officially Verified!`
      );
    } else {
      setToastMessage(
        `Score: ${result.scorePercentage}% (<80%). ${activeAssessmentSkill.name} remains Self-Claimed. Review checkpoints below and retry!`
      );
    }
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleRetakeAssessment = () => {
    if (!activeAssessmentSkill) return;
    void handleStartAssessment(activeAssessmentSkill);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-indigo-700 dark:text-indigo-300 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              My Skills & 3-Level Competencies
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {skills.length} Tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track and check off verifiable milestones across <strong>Beginner (33%)</strong>, <strong>Intermediate (33%)</strong>, and <strong>Advance (34%)</strong> tiers. Overall proficiency auto-recalculates on every checkpoint.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          {/* Request to TPO Button */}
          <button
            onClick={() => {
              setRequestSkillName(searchQuery);
              setIsRequestTpoOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Request a skill that is not present in the college system"
          >
            <Send className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Request Skill to TPO</span>
          </button>

          {/* Add Skill Button */}
          <button
            id="add-skill-button"
            onClick={() => setIsAddSkillOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Weighting Breakdown Summary Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Checkpoint Evaluation System:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-bold text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Beginner Tier: 33% Total
          </span>
          <span className="text-slate-300 dark:text-slate-700">+</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Intermediate Tier: 33% Total
          </span>
          <span className="text-slate-300 dark:text-slate-700">+</span>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Advance Tier: 34% Total
          </span>
          <span className="text-slate-300 dark:text-slate-700">=</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white">
            100% Mastery
          </span>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your skills..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Skill Cards List with Interactive 3-Tier Checkpoints */}
      <div className="space-y-4">
        {filteredSkills.map((skill) => {
          const isExpanded = expandedSkillId === skill.id;
          const calc = calculateSkillProficiency(skill.levels);
          const isVerified = skill.status === 'verified';
          const bCps = skill.levels?.beginner?.checkpoints || [];
          const iCps = skill.levels?.intermediate?.checkpoints || [];
          const aCps = skill.levels?.advance?.checkpoints || [];

          return (
            <div
              key={skill.id}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
            >
              {/* Card Summary Header */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0">
                    {skill.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {skill.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                        {skill.category}
                      </span>
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified {skill.assessmentScore ? `(${skill.assessmentScore}%)` : ''}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Self-Claimed {skill.assessmentScore !== undefined ? `(${skill.assessmentScore}% - Needs ≥80%)` : ''}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Tier Level: <strong className="text-slate-700 dark:text-slate-300">{skill.level}</strong></span>
                      <span>•</span>
                      <span>
                        Checkpoints: <strong className="text-slate-700 dark:text-slate-300">
                          {bCps.filter((c) => c.completed).length + iCps.filter((c) => c.completed).length + aCps.filter((c) => c.completed).length} / {bCps.length + iCps.length + aCps.length}
                        </strong> Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Progress Display */}
                <div className="flex items-center gap-4">
                  <div className="w-48 hidden sm:block">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 text-[11px]">Skill Competency</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {skill.proficiency}%
                      </span>
                    </div>
                    {/* Segmented 3-part Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex gap-0.5">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-300" 
                        style={{ width: `${(calc.beginnerScore / 33) * 33}%` }} 
                        title={`Beginner: ${calc.beginnerScore}% / 33%`}
                      />
                      <div 
                        className="bg-amber-500 h-full transition-all duration-300" 
                        style={{ width: `${(calc.intermediateScore / 33) * 33}%` }} 
                        title={`Intermediate: ${calc.intermediateScore}% / 33%`}
                      />
                      <div 
                        className="bg-purple-500 h-full transition-all duration-300" 
                        style={{ width: `${(calc.advanceScore / 34) * 34}%` }} 
                        title={`Advance: ${calc.advanceScore}% / 34%`}
                      />
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {skill.proficiency}%
                    </span>
                  </div>

                  {/* Toggle Checkpoints Drawer Button */}
                  <button
                    onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
                    title={isExpanded ? 'Hide Checkpoints' : 'View & Complete Checkpoints'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3-TIER EXPANDED CHECKPOINTS DRAWER */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-4 animate-fade-in">
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Click any checkpoint below to complete it and update your competency percentage.</span>
                    </div>

                    <button
                      onClick={() => handleStartAssessment(skill)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs ${
                        isVerified
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : bCps.length > 0 && bCps.every((c) => c.completed)
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white animate-pulse'
                          : 'bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>
                        {isVerified 
                          ? `AI Verified (${skill.assessmentScore || 85}%) • Retake Test` 
                          : 'Take AI Beginner Test (80%+ to Verify)'}
                      </span>
                    </button>
                  </div>

                  {/* 3 Columns Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* 1. BEGINNER LEVEL */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                        <div>
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                            1. Beginner Level
                          </span>
                          <span className="text-[10px] text-slate-400">33% Total Weight</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {calc.beginnerScore} / 33%
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            +{calc.checkpointValues.beginner}% each
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        {bCps.map((cp) => (
                          <div
                            key={cp.id}
                            onClick={() => handleToggleCheckpoint(skill, 'beginner', cp.id, cp.title)}
                            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                              cp.completed
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-200 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {cp.completed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </div>
                            <div className="flex-1 text-[11px] leading-relaxed">
                              <span className={cp.completed ? 'line-through opacity-80' : ''}>
                                {cp.title}
                              </span>
                              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                                {cp.completed ? '✓ Completed' : `+${calc.checkpointValues.beginner}% towards score`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Beginner Verification Test Box */}
                      {(() => {
                        const bTotal = bCps.length;
                        const bDone = bCps.filter((c) => c.completed).length;
                        const isBeginnerCompleted = bTotal > 0 && bDone === bTotal;

                        if (isBeginnerCompleted) {
                          if (isVerified) {
                            return (
                              <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 space-y-2 shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    Beginner Verified ✓
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                    Score: {skill.assessmentScore || 85}%
                                  </span>
                                </div>
                                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 leading-tight">
                                  Official AI assessment passed (score ≥80%). Visible as institutional Verified to campus recruiters.
                                </p>
                                <button
                                  onClick={() => handleStartAssessment(skill)}
                                  className="w-full py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-emerald-100/50 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Retake AI Assessment</span>
                                </button>
                              </div>
                            );
                          } else {
                            return (
                              <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/60 dark:to-emerald-950/40 border-2 border-indigo-300 dark:border-indigo-700 space-y-2.5 shadow-xs">
                                <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200 font-bold text-[11px]">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                  <span>Beginner Tier Completed! Take AI Test</span>
                                </div>
                                <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                                  Score <strong className="text-indigo-700 dark:text-indigo-300 font-bold">80%+</strong> on the AI assessment covering these beginner checkpoints to earn the <strong className="text-emerald-700 dark:text-emerald-300 font-bold">Verified</strong> mark. Otherwise remains <strong className="text-amber-700 dark:text-amber-300 font-bold">Self-Claimed</strong>.
                                </p>
                                {skill.assessmentScore !== undefined && (
                                  <div className="text-[10px] text-amber-800 dark:text-amber-200 font-medium bg-amber-100/80 dark:bg-amber-950/80 px-2 py-1 rounded-md border border-amber-300 dark:border-amber-700 flex items-center gap-1.5">
                                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>Last Score: {skill.assessmentScore}% (Needs ≥80% for Verified)</span>
                                  </div>
                                )}
                                <button
                                  onClick={() => handleStartAssessment(skill)}
                                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  <span>Take AI Test (80%+ to Verify)</span>
                                </button>
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                              <span>
                                {bDone} of {bTotal} checkpoints completed
                              </span>
                              <button
                                onClick={() => handleStartAssessment(skill)}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                              >
                                Try AI Test
                              </button>
                            </div>
                          );
                        }
                      })()}
                    </div>


                    {/* 2. INTERMEDIATE LEVEL */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-amber-100 dark:border-amber-900/40">
                        <div>
                          <span className="font-bold text-amber-800 dark:text-amber-300 block">
                            2. Intermediate Level
                          </span>
                          <span className="text-[10px] text-slate-400">33% Total Weight</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {calc.intermediateScore} / 33%
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            +{calc.checkpointValues.intermediate}% each
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        {iCps.map((cp) => (
                          <div
                            key={cp.id}
                            onClick={() => handleToggleCheckpoint(skill, 'intermediate', cp.id, cp.title)}
                            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                              cp.completed
                                ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-200 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {cp.completed ? (
                                <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </div>
                            <div className="flex-1 text-[11px] leading-relaxed">
                              <span className={cp.completed ? 'line-through opacity-80' : ''}>
                                {cp.title}
                              </span>
                              <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                                {cp.completed ? '✓ Completed' : `+${calc.checkpointValues.intermediate}% towards score`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. ADVANCE LEVEL */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-purple-900/40">
                        <div>
                          <span className="font-bold text-purple-800 dark:text-purple-300 block">
                            3. Advance Level
                          </span>
                          <span className="text-[10px] text-slate-400">34% Total Weight</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {calc.advanceScore} / 34%
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            +{calc.checkpointValues.advance}% each
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        {aCps.map((cp) => (
                          <div
                            key={cp.id}
                            onClick={() => handleToggleCheckpoint(skill, 'advance', cp.id, cp.title)}
                            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                              cp.completed
                                ? 'bg-purple-50/60 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-200 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {cp.completed ? (
                                <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </div>
                            <div className="flex-1 text-[11px] leading-relaxed">
                              <span className={cp.completed ? 'line-through opacity-80' : ''}>
                                {cp.title}
                              </span>
                              <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                                {cp.completed ? '✓ Completed' : `+${calc.checkpointValues.advance}% towards score`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredSkills.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No skills found matching "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              If this skill isn't uploaded in the system yet, you can submit a request directly to your College TPO to add it to the curriculum.
            </p>
            <button
              onClick={() => {
                setRequestSkillName(searchQuery);
                setIsRequestTpoOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request "{searchQuery}" to TPO</span>
            </button>
          </div>
        )}
      </div>

      {/* REQUEST SKILL TO TPO MODAL */}
      {isRequestTpoOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Request New Skill to TPO
                </h2>
              </div>
              <button
                onClick={() => setIsRequestTpoOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              If a technology or domain skill isn't listed in the system, submit it here. Your placement cell (TPO) will configure the 3-level checkpoints (Beginner, Intermediate, Advance) and add it to the verified curriculum.
            </p>

            <form onSubmit={handleSubmitTpoRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill / Technology Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rust, Solidity, Kafka, Apache Flink"
                  value={requestSkillName}
                  onChange={(e) => setRequestSkillName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={requestCategory}
                  onChange={(e) => setRequestCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Core CS">Core CS</option>
                  <option value="DevOps">DevOps</option>
                  <option value="AI / Data">AI / Data</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Justification / Placement Context
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention why this skill is needed (e.g. required for upcoming fintech campus drive, capstone project, or personal specialization)..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestTpoOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                >
                  Send Request to TPO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SKILL MODAL */}
      {isAddSkillOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Add Skill to Profile
              </h2>
              <button
                onClick={() => setIsAddSkillOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, GraphQL, Kubernetes"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Core CS">Core CS</option>
                  <option value="DevOps">DevOps</option>
                  <option value="AI / Data">AI / Data</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Skill checkpoints across Beginner (33%), Intermediate (33%), and Advance (34%) will be automatically attached so you can start checking them off!
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSkillOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI ASSESSMENT MODAL */}
      {activeAssessmentSkill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{activeAssessmentSkill.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      Beginner Verification Test
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    5 AI-generated questions mapped directly to beginner checkpoints
                  </p>
                </div>
              </div>
              <button
                onClick={closeAssessmentModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Proctoring Setup Gate (before questions load) */}
            {proctorSetupMode ? (
              <ProctorSetup
                status={proctor.status}
                error={proctor.error}
                videoRef={proctor.videoRef}
                onGrant={() => void handleAssessmentProctorGranted()}
                onCancel={closeAssessmentModal}
                title={`Proctored Verification Test — ${activeAssessmentSkill.name}`}
                subtitle="Your 5 verification questions are AI-proctored. Camera tracks your movement/face and the mic detects talking, so cheating is impossible."
              />
            ) : !assessmentResult && assessmentQuestions.length > 0 ? (
              <div className="space-y-4">
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

                {/* Benchmark Rules Banner */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Verification Criteria:</span>
                    <span className="block mt-0.5">
                      Score <strong className="text-emerald-700 dark:text-emerald-400 font-bold">80% or higher</strong> to officially earn the <strong className="text-emerald-700 dark:text-emerald-400 font-bold">Verified</strong> mark. Any score below 80% remains marked as <strong className="text-amber-700 dark:text-amber-400 font-bold">Self-Claimed / Self-Proclaimed</strong>.
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Indicators */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
                      {locked[currentQuestionIndex] !== undefined && locked[currentQuestionIndex] && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-[11px]">
                        Answered: {Object.keys(userAnswers).length} / {assessmentQuestions.length}
                      </span>
                      <QuestionTimer seconds={timer.seconds} progress={timer.progress} totalSeconds={30} />
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {needAnswerHint && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    No option selected — this question will be skipped and earn no marks.
                  </div>
                )}

                {/* Question Stepper Pills (non-clickable — forward-only) */}
                <div className="flex items-center gap-1.5">
                  {assessmentQuestions.map((_, qIdx) => {
                    const isAnswered = userAnswers[qIdx] !== undefined;
                    const isCurrent = qIdx === currentQuestionIndex;
                    const isLocked = locked[qIdx] === true;
                    return (
                      <span
                        key={qIdx}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold text-center ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : isLocked
                            ? 'bg-indigo-200 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                            : isAnswered
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                        title={
                          qIdx < currentQuestionIndex
                            ? `Question ${qIdx + 1} (submitted & locked)`
                            : `Question ${qIdx + 1}`
                        }
                      >
                        Q{qIdx + 1}
                      </span>
                    );
                  })}
                </div>

                {/* Active Question Box */}
                {(() => {
                  const currentQ = assessmentQuestions[currentQuestionIndex];
                  if (!currentQ) return null;

                  return (
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
                      {/* Checkpoint Tag */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold">
                        <Target className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Tested Checkpoint: {currentQ.checkpointTitle}</span>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                        {currentQ.question}
                      </p>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {currentQ.options.map((opt, optIdx) => {
                          const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                          const isLocked = locked[currentQuestionIndex] === true;
                          const optionLabels = ['A', 'B', 'C', 'D'];

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectAnswer(optIdx)}
                              disabled={isLocked}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-100 font-semibold shadow-2xs ring-1 ring-indigo-500 cursor-default'
                                  : isLocked
                                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-500 opacity-60 cursor-not-allowed'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                                }`}
                              >
                                {optionLabels[optIdx]}
                              </div>
                              <div className="flex-1 leading-relaxed">
                                {opt}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Question Navigation Controls (forward-only, answers locked) */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    Answered questions are locked — you can't go back.
                  </span>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex < assessmentQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextAssessmentQuestion}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Submit &amp; Next Question
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmitAssessment(false)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Submit & Grade Assessment</span>
                      </button>
                    )}
                  </div>
                </div>

                {Object.keys(userAnswers).length < assessmentQuestions.length && currentQuestionIndex === assessmentQuestions.length - 1 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 text-right">
                    * Unanswered questions will be skipped and earn no marks.
                  </p>
                )}
              </div>
            ) : null}

            {/* Assessment Result & Grading Screen */}
            {assessmentResult && (
              <div className="space-y-4">
                {/* Result Hero Banner */}
                {assessmentResult.passed ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 text-center space-y-2.5">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider mb-1">
                        Assessment Passed (Score ≥ 80%)
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Official Status: VERIFIED ✓
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                        You scored <strong>{assessmentResult.scorePercentage}%</strong> ({assessmentResult.correctAnswers} of {assessmentResult.totalQuestions} questions correct).
                        Your skill in <strong>{assessmentResult.skillName}</strong> has been officially upgraded to <strong>Verified</strong> and is now highlighted to company recruiters and TPO.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 text-center space-y-2.5">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[11px] uppercase tracking-wider mb-1">
                        Threshold Not Met (Needed ≥ 80%)
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Status Remains: SELF-CLAIMED / SELF-PROCLAIMED
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                        You scored <strong>{assessmentResult.scorePercentage}%</strong> ({assessmentResult.correctAnswers} of {assessmentResult.totalQuestions} questions correct).
                        To ensure verified standards, <strong>80%+ is strictly required</strong>. This skill remains marked as <strong>Self-Claimed</strong>. Review the beginner checkpoints below and retake the assessment!
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Checkpoint-by-Checkpoint Evaluation */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>Checkpoint-by-Checkpoint Review:</span>
                    <span className="text-[11px] text-slate-500">
                      Score: {assessmentResult.scorePercentage}%
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                    {assessmentResult.checkpointBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          item.passed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Q{idx + 1}. {item.checkpointTitle}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              item.passed
                                ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {item.passed ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Correct (+20%)</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                <span>Needs Review</span>
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          <strong>Concept: </strong> {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Result Modal Action Buttons */}
                {proctor.autoSubmitted && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 animate-fade-in">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>
                      Answer sheet was auto-submitted due to a proctoring violation (tab switch / camera / mic
                      warning). Unanswered questions were marked incorrect.
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {!assessmentResult.passed ? (
                    <>
                      <button
                        type="button"
                        onClick={closeAssessmentModal}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        Close & Review Checkpoints
                      </button>
                      <button
                        type="button"
                        onClick={handleRetakeAssessment}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake AI Assessment Now</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={closeAssessmentModal}
                      className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Done • View Verified Skill</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
