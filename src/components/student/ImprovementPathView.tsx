import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Play, 
  Flame, 
  Building2, 
  AlertTriangle, 
  ArrowRight, 
  Trash2, 
  Plus, 
  ExternalLink, 
  BookOpen, 
  Code2, 
  Layers, 
  FolderGit2, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  Check, 
  Compass, 
  GraduationCap, 
  X,
  Target,
  FileCheck2,
  Calendar,
  AlertCircle,
  GitFork
} from 'lucide-react';
import { 
  CompanyImprovementPath, 
  SuggestedProject 
} from '../../types';
import { 
  loadCompanyImprovementPaths, 
  saveCompanyImprovementPaths, 
  deleteCompanyImprovementPath, 
  toggleActionChecklist, 
  toggleSkillMissingCompleted,
  IMPROVEMENT_PATHS_UPDATED_EVENT 
} from '../../data/improvementPathStore';

interface CoreMilestone {
  id: string;
  stageNumber: number;
  title: string;
  category: string;
  status: 'completed' | 'current' | 'locked';
  description: string;
  skillsUnlocked: string[];
  tasks: { name: string; completed: boolean }[];
}

const coreSkillMilestones: CoreMilestone[] = [
  {
    id: 'm-1',
    stageNumber: 1,
    title: 'Foundational Web & Programming Rigor',
    category: 'Tier 1 • Core Fundamentals',
    status: 'completed',
    description: 'Master core CS data structures, asymptotic notation, and modern JavaScript ES6+ execution model.',
    skillsUnlocked: ['JavaScript ES6', 'Data Structures', 'Git Basics'],
    tasks: [
      { name: 'Pass DSA Array & Trees benchmark with 80%+', completed: true },
      { name: 'Connect GitHub repository and pass commit chronology check', completed: true },
    ]
  },
  {
    id: 'm-2',
    stageNumber: 2,
    title: 'State Architecture & React Mastery',
    category: 'Tier 2 • Frontend Specialization',
    status: 'completed',
    description: 'Construct scalable frontend components with custom hooks, memoization, and strict TypeScript types.',
    skillsUnlocked: ['React.js', 'TypeScript', 'Tailwind CSS'],
    tasks: [
      { name: 'Build Distributed Collaborative Canvas with real-time sync', completed: true },
      { name: 'Verify React proficiency quiz with zero re-render regressions', completed: true },
    ]
  },
  {
    id: 'm-3',
    stageNumber: 3,
    title: 'AI Code Logic & Architectural Defense',
    category: 'Tier 3 • Autonomous Engineering',
    status: 'current',
    description: 'Defend your code architecture in live AI Logic Q&A to eliminate template suspicion and earn the Integrity Seal.',
    skillsUnlocked: ['Code Autonomy Seal', 'System Architecture'],
    tasks: [
      { name: 'Pass AST Scan on 2 primary repositories (>85% originality)', completed: true },
      { name: 'Complete 5/5 AI Logic Q&A questions for Smart Campus Hub', completed: false },
      { name: 'Conduct peer architectural code review', completed: false },
    ]
  },
  {
    id: 'm-4',
    stageNumber: 4,
    title: 'Containerization & Microservices DevOps',
    category: 'Tier 4 • Cloud Production',
    status: 'locked',
    description: 'Package distributed microservices with Docker, construct CI/CD test matrices, and configure Kubernetes ingress.',
    skillsUnlocked: ['Docker', 'Kubernetes Basics', 'CI/CD Pipelines'],
    tasks: [
      { name: 'Containerize multi-tier application with multi-stage Dockerfile', completed: false },
      { name: 'Achieve 95%+ match for CloudSphere trainee role', completed: false },
    ]
  },
  {
    id: 'm-5',
    stageNumber: 5,
    title: 'Staff-Level Scalability & Blind Screening Elite',
    category: 'Tier 5 • Placement Hall of Fame',
    status: 'locked',
    description: 'Unlock direct fast-track interviews with top tech teams through automated high-ranking blind screening.',
    skillsUnlocked: ['Staff-Tier Fast Track', 'Top 1% Badge'],
    tasks: [
      { name: 'Maintain 90%+ readiness score across all 3 partner job profiles', completed: false },
      { name: 'Receive verified interview offer via Blind Screening pool', completed: false },
    ]
  }
];

interface ImprovementPathViewProps {
  onNavigateTab?: (tab: string, meta?: any) => void;
  initialPathId?: string | null;
}

export const ImprovementPathView: React.FC<ImprovementPathViewProps> = ({ 
  onNavigateTab, 
  initialPathId 
}) => {
  const [companyPaths, setCompanyPaths] = useState<CompanyImprovementPath[]>(() => loadCompanyImprovementPaths());
  
  // 'core-skills' is the primary permanent skill path; otherwise company path ID
  const [selectedPathKey, setSelectedPathKey] = useState<string>(() => {
    if (initialPathId) return initialPathId;
    return 'core-skills';
  });

  // Modal state for deleting a company path with explicit warning
  const [pathToDelete, setPathToDelete] = useState<CompanyImprovementPath | null>(null);

  // Success toast for interactive actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const updated = loadCompanyImprovementPaths();
      setCompanyPaths(updated);
    };

    window.addEventListener(IMPROVEMENT_PATHS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(IMPROVEMENT_PATHS_UPDATED_EVENT, handleUpdate);
  }, []);

  // Update selectedPathKey if initialPathId changes externally
  useEffect(() => {
    if (initialPathId) {
      setSelectedPathKey(initialPathId);
    }
  }, [initialPathId]);

  const activeCompanyPath = companyPaths.find((p) => p.id === selectedPathKey || p.companyName === selectedPathKey);

  const confirmDeletePath = () => {
    if (!pathToDelete) return;
    deleteCompanyImprovementPath(pathToDelete.id);
    const updated = companyPaths.filter((p) => p.id !== pathToDelete.id);
    setCompanyPaths(updated);
    
    // Switch to core-skills if the deleted one was active
    if (selectedPathKey === pathToDelete.id || selectedPathKey === pathToDelete.companyName) {
      setSelectedPathKey('core-skills');
    }
    
    setToastMessage(`✓ Removed "${pathToDelete.companyName}" improvement roadmap.`);
    setPathToDelete(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleTask = (pathId: string, actionId: string) => {
    toggleActionChecklist(pathId, actionId);
    const updated = loadCompanyImprovementPaths();
    setCompanyPaths(updated);
  };

  const handleToggleSkill = (pathId: string, skillName: string) => {
    toggleSkillMissingCompleted(pathId, skillName);
    const updated = loadCompanyImprovementPaths();
    setCompanyPaths(updated);
    setToastMessage(`Updated study status for "${skillName}".`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentStreakDays = 14;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Targeted Improvement & Skill Trees</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Career & Placement Roadmaps
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Switch between your foundational engineering skill tree and company-specific target improvement roadmaps generated from campus drives.
          </p>
        </div>

        {/* Streak Counter ONLY (User explicitly requested: XP removed completely, only streak) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold shadow-2xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span className="tracking-wide">{currentStreakDays} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-teal-600 dark:text-teal-400 hover:text-teal-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Multiple Paths Navigation Tabs (1 Permanent Skill Tree + Dynamic Companies) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 pb-2">
          Select Active Improvement Track:
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {/* 1. Permanent Core Skill Tree Path (Cannot be deleted!) */}
          <button
            onClick={() => setSelectedPathKey('core-skills')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              selectedPathKey === 'core-skills'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>1. Core Skill Tree</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
              selectedPathKey === 'core-skills' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              Foundation
            </span>
          </button>

          {/* 2. Dynamic Company-Specific Improvement Paths */}
          {companyPaths.map((cPath) => {
            const isActive = selectedPathKey === cPath.id || (selectedPathKey === cPath.companyName && companyPaths.filter(p => p.companyName === cPath.companyName).length === 1);

            return (
              <div
                key={cPath.id}
                className={`flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-300 dark:ring-indigo-700'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setSelectedPathKey(cPath.id)}
                  className="flex items-center gap-2 cursor-pointer py-1 text-left"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-indigo-950 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {cPath.companyLogo || cPath.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="truncate max-w-[140px] leading-tight font-bold">{cPath.companyName}</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[140px] leading-tight">
                      {cPath.targetRole}
                    </span>
                  </div>
                  {cPath.diagnosis?.hasLearnedSkillsLackingProject && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Project proof required" />
                  )}
                </button>

                {/* Delete / Cancel Button with Warning trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPathToDelete(cPath);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors ml-0.5 cursor-pointer"
                  title={`Remove ${cPath.companyName} (${cPath.targetRole}) Roadmap`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Quick link to internships if user wants to add another company */}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('internships')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 shrink-0 cursor-pointer"
              title="Browse internships & jobs to add target company roadmaps"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Company from Drives</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CORE SKILL TREE (PERMANENT FOUNDATIONAL ROADMAP)                   */}
      {/* ========================================================================= */}
      {selectedPathKey === 'core-skills' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                <strong>General Engineering Skill Tree</strong>: Complete foundational milestones in sequence to unlock verified institutional badges and salary tiers.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hidden sm:inline">
              Permanent Path
            </span>
          </div>

          {/* Linear Skill Tree Nodes */}
          <div className="relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-8 sm:before:left-12 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {coreSkillMilestones.map((milestone) => {
              const isCompleted = milestone.status === 'completed';
              const isCurrent = milestone.status === 'current';
              const isLocked = milestone.status === 'locked';

              return (
                <div
                  key={milestone.id}
                  className="relative flex items-start gap-4 sm:gap-6 group"
                >
                  {/* Milestone Icon Node */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-emerald-200'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-indigo-200 ring-4 ring-indigo-100 dark:ring-indigo-950/80 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div
                    className={`flex-1 rounded-2xl p-5 sm:p-6 transition-all border ${
                      isCurrent
                        ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-700 shadow-md ring-1 ring-indigo-200 dark:ring-indigo-900/60'
                        : isCompleted
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                        : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {milestone.category}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                            In Progress Now
                          </span>
                        )}
                      </div>
                      {isCompleted && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified Mastered</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Tasks checklist */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        Milestone Verification Steps:
                      </span>
                      {milestone.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2 text-xs">
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                          <span className={task.completed ? 'text-slate-600 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white font-medium'}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Skills Unlocked */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium mr-1">Unlocks:</span>
                      {milestone.skillsUnlocked.map((s) => (
                        <span
                          key={s}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: TARGET COMPANY IMPROVEMENT PATH (EXACT USER REQUIREMENTS)         */}
      {/* ========================================================================= */}
      {selectedPathKey !== 'core-skills' && activeCompanyPath && (
        <div className="space-y-6">
          {/* Company Target Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-indigo-950 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                  {activeCompanyPath.companyLogo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeCompanyPath.companyName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                      Target Placement Drive
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Target Role: <strong className="text-slate-800 dark:text-slate-200">{activeCompanyPath.targetRole}</strong> • Package: <strong className="text-emerald-600 dark:text-emerald-400">{activeCompanyPath.stipendOrPackage}</strong>
                  </p>
                </div>
              </div>

              {/* Action: Delete / Cancel Company Roadmap */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPathToDelete(activeCompanyPath)}
                  className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Roadmap</span>
                </button>

                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('internships')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>View Drive Listing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* DIAGNOSIS BANNER (USER INTENT: "dikhayega ki problem kya hai") */}
            <div className={`mt-5 p-4 rounded-xl border flex items-start gap-3 text-xs ${
              activeCompanyPath.diagnosis.hasLearnedSkillsLackingProject
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
                : 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/80 text-blue-950 dark:text-blue-200'
            }`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                activeCompanyPath.diagnosis.hasLearnedSkillsLackingProject ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
              }`} />
              <div>
                <span className="font-bold text-sm block mb-1">
                  {activeCompanyPath.diagnosis.hasLearnedSkillsLackingProject
                    ? '⚠️ Identified Problem: Skills Learned, but Verified Project Proof Missing'
                    : '⚠️ Identified Problem: Missing Required Technical Competencies & Project Evidence'}
                </span>
                <p className="text-xs leading-relaxed opacity-90">
                  {activeCompanyPath.diagnosis.summary}
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* COMPANY TARGET SKILL TREE & PROGRESSION ROADMAP PIPELINE              */}
          {/* ===================================================================== */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-indigo-600" />
                  <span>{activeCompanyPath.companyName} Skill Tree & Roadmap Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Milestone pathway tailored specifically for {activeCompanyPath.targetRole} placement criteria.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
                Role Roadmap: {activeCompanyPath.targetRole}
              </span>
            </div>

            {/* Pipeline Stage Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Stage 1: Verified Prerequisites */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Stage 1: Cleared</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                    {activeCompanyPath.skillsLearned.length} Skills
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Mastered Prerequisites</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {activeCompanyPath.skillsLearned.slice(0, 4).map(s => (
                    <span key={s.name} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-700 dark:text-slate-300">
                      ✓ {s.name}
                    </span>
                  ))}
                  {activeCompanyPath.skillsLearned.length > 4 && (
                    <span className="text-[10px] text-slate-400 px-1 py-0.5">+{activeCompanyPath.skillsLearned.length - 4} more</span>
                  )}
                </div>
              </div>

              {/* Stage 2: Missing Core Gaps */}
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Stage 2: Core Gaps</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                    {activeCompanyPath.skillsMissing.filter(s => s.importance !== 'Preferred / Differentiator').length} Pending
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Mandatory Skills</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {activeCompanyPath.skillsMissing.filter(s => s.importance !== 'Preferred / Differentiator').map(s => (
                    <span key={s.name} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-slate-700 dark:text-slate-300 font-medium">
                      {s.isCompleted ? '✓ ' : '• '}{s.name}
                    </span>
                  ))}
                  {activeCompanyPath.skillsMissing.filter(s => s.importance !== 'Preferred / Differentiator').length === 0 && (
                    <span className="text-[10px] text-emerald-600 font-medium">All mandatory skills mastered!</span>
                  )}
                </div>
              </div>

              {/* Stage 3: Targeted Differentiator Skills */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Stage 3: Differentiators</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                    {activeCompanyPath.skillsMissing.filter(s => s.importance === 'Preferred / Differentiator').length} Added
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{activeCompanyPath.companyName} Bonuses</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {activeCompanyPath.skillsMissing.filter(s => s.importance === 'Preferred / Differentiator').map(s => (
                    <span key={s.name} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 font-medium">
                      ★ {s.name}
                    </span>
                  ))}
                  {activeCompanyPath.skillsMissing.filter(s => s.importance === 'Preferred / Differentiator').length === 0 && (
                    <span className="text-[10px] text-slate-400 font-medium">Click preferred skills in Skill Gap to add bonuses here</span>
                  )}
                </div>
              </div>

              {/* Stage 4: Verified Project Evidence */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Stage 4: Proof-of-Work</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Required
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Audited Project Proof</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Must pass AST originality analysis & live Q&A defense to unlock recruiter dossier.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION 1: SKILL COMPARISON (What you know vs what company requires) */}
          {/* ===================================================================== */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Company Skill Gap Analysis</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Comparison between your current verified abilities and {activeCompanyPath.companyName}'s prerequisites.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {activeCompanyPath.skillsLearned.length} Mastered • {activeCompanyPath.skillsMissing.length} Missing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Skills You Have Mastered */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Skills You Have Mastered</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Verified
                  </span>
                </div>

                <div className="space-y-2">
                  {activeCompanyPath.skillsLearned.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold text-slate-900 dark:text-white">{skill.name}</span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {skill.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Skills Company Requires (Missing from Profile) */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Missing Skills Required by Company</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300">
                    Roadmap Needed
                  </span>
                </div>

                <div className="space-y-2">
                  {activeCompanyPath.skillsMissing.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white block">{skill.name}</span>
                          {skill.importance.includes('Preferred') || skill.importance.includes('Differentiator') ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              Targeted Differentiator for {activeCompanyPath.companyName}
                            </span>
                          ) : null}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          Est. Time: {skill.estimatedHours} hrs • {skill.importance}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleSkill(activeCompanyPath.id, skill.name)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                          skill.isCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {skill.isCompleted ? '✓ Learned' : 'Mark Learned'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guided Roadmap for Each Missing Skill */}
            {activeCompanyPath.skillsMissing.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Curriculum Roadmap for Missing Skills:</span>
                </h4>

                <div className="space-y-3">
                  {activeCompanyPath.skillsMissing.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          <span>Module: {skill.name}</span>
                          <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                            (Targeted for {activeCompanyPath.companyName} • {activeCompanyPath.targetRole})
                          </span>
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          Recommended Resource: <em>{skill.recommendedResource}</em>
                        </span>
                      </div>

                      <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1">
                        {skill.roadmapTopics.map((topic, tIdx) => (
                          <li key={tIdx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: SUGGESTED PROJECTS (USER INTENT: "project bana ne k liye       */}
          {/* bolega and ho ske toh suggest bhi krega")                                 */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800 mb-1">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Mandatory Proof-of-Work Project Requirement</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recommended Projects for {activeCompanyPath.companyName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeCompanyPath.projectRequirement.reason}
                </p>
              </div>
            </div>

            {/* Suggested Projects Grid */}
            <div className="space-y-4">
              {activeCompanyPath.projectRequirement.suggestedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold">
                          {proj.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    {onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab('projects')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Build in Projects Tab</span>
                      </button>
                    )}
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Key Features to build */}
                  <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/60 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Core Functional Requirements to Implement:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                      {proj.keyFeatures.map((feat, fIdx) => (
                        <li key={fIdx}>{feat}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Defense Topics to prepare */}
                  <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/60 text-xs">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Interview Logic Defense Questions to Expect:</span>
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                      {proj.defenseTopics.map((q, qIdx) => (
                        <li key={qIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: STEP-BY-STEP ACTION ROADMAP FOR THIS COMPANY                   */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Target Company Progression Checklist</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete these sequential tasks to turn your application eligibility to APPROVED.
                </p>
              </div>

              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {activeCompanyPath.actionChecklist.filter((a) => a.completed).length} / {activeCompanyPath.actionChecklist.length} Steps Done
              </span>
            </div>

            <div className="space-y-2.5">
              {activeCompanyPath.actionChecklist.map((action, aIdx) => (
                <div
                  key={action.id}
                  onClick={() => handleToggleTask(activeCompanyPath.id, action.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                    action.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300'
                      : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                        action.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {action.completed && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <span className={`font-bold block ${action.completed ? 'line-through text-slate-500' : ''}`}>
                        Step {aIdx + 1}: {action.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {action.description}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                    action.category === 'Skill'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : action.category === 'Project'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : action.category === 'Defense'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {action.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Application Unlocking Callout */}
            {activeCompanyPath.actionChecklist.every((a) => a.completed) ? (
              <div className="mt-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">🎉 Roadmap Complete! Ready to Apply!</span>
                  <p className="text-xs mt-0.5">
                    You have mastered the skills and verified the project proof required by {activeCompanyPath.companyName}.
                  </p>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('internships')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Go Apply Now
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE COMPANY IMPROVEMENT PATH CONFIRMATION WARNING               */}
      {/* (USER INTENT: "cancel pe click krne k baad usse warning de dena ki ye     */}
      {/*  path delete ho jayega if yes then delete that improvement path else      */}
      {/*  do not destroy it")                                                      */}
      {/* ========================================================================= */}
      {pathToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Delete {pathToDelete.companyName} ({pathToDelete.targetRole}) Roadmap?
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Are you sure you want to remove the improvement roadmap for <strong>{pathToDelete.companyName}</strong> ({pathToDelete.targetRole})? 
              <br /><br />
              <span className="text-red-600 dark:text-red-400 font-semibold">
                ⚠️ Warning: Your tracked task completions, missing skill notes, and suggested project milestones for this role will be permanently deleted from your profile.
              </span>
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPathToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel (Keep Roadmap)
              </button>

              <button
                type="button"
                onClick={confirmDeletePath}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Yes, Delete Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
