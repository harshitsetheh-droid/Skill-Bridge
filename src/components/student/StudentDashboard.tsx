import React from 'react';
import { initialStudentData, initialSkills } from '../../data/mockData';
import { CircularProgress } from '../common/CircularProgress';
import { SkillPill } from '../common/SkillPill';
import { 
  Award, 
  Send, 
  FolderGit2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  Flame
} from 'lucide-react';
import { loadDailyStreakState, STREAK_UPDATED_EVENT } from '../../data/dailyQuizStore';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const [streakState, setStreakState] = React.useState(loadDailyStreakState);

  React.useEffect(() => {
    const handleUpdate = () => {
      setStreakState(loadDailyStreakState());
    };
    window.addEventListener(STREAK_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STREAK_UPDATED_EVENT, handleUpdate);
  }, []);
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Greeting & Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Placement Matrix Calibrated</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {initialStudentData.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            {initialStudentData.branch} • {initialStudentData.college} (CGPA {initialStudentData.cgpa})
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs text-slate-500 font-medium">Target Role:</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
              Frontend & Fullstack Engineer
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified by TPO
            </span>
          </div>
        </div>

        {/* Large Circular Readiness Score Ring */}
        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 shrink-0">
          <CircularProgress
            value={initialStudentData.readinessScore}
            size={140}
            strokeWidth={12}
            accentColor="#4F46E5"
            sublabel="Placement Ready"
          />
          <span className="text-xs text-slate-500 mt-2 font-medium">
            Top 8% in IT Jodhpur CSE
          </span>
        </div>
      </div>

      {/* 4 Stat Cards including Daily Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Daily Streak */}
        <div 
          onClick={() => onNavigateTab('daily-questions')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Daily Streak</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {streakState.streakCount} Days
            </span>
            <span className={`text-xs font-bold ${streakState.todayCompleted ? 'text-emerald-600' : streakState.streakStatus === 'paused' ? 'text-rose-600' : 'text-orange-600'}`}>
              {streakState.todayCompleted ? '✓ Secured' : streakState.streakStatus === 'paused' ? 'Paused ⚠️' : '• 5 Qs Ready'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {streakState.todayCompleted ? `Score: ${streakState.todayScore}% today` : 'Score ≥80% for +1 day'}
          </p>
        </div>

        {/* Stat 2: Skills Verified */}
        <div 
          onClick={() => onNavigateTab('skills')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Skills Verified</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {initialStudentData.stats.skillsVerified}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">+2 this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            4 self-claimed awaiting quiz verification
          </p>
        </div>

        {/* Stat 2: Active Applications */}
        <div 
          onClick={() => onNavigateTab('internships')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Applications</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {initialStudentData.stats.activeApplications}
            </span>
            <span className="text-xs text-indigo-600 font-semibold">1 Shortlisted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            TechNova Frontend Intern interview scheduled
          </p>
        </div>

        {/* Stat 3: Projects Reviewed */}
        <div 
          onClick={() => onNavigateTab('projects')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Projects Reviewed</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {initialStudentData.stats.projectsReviewed}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">2 Passed ✓</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Avg originality score: 90.5%
          </p>
        </div>
      </div>

      {/* Main Grid: Skill Tag Cloud & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill-Tag Cloud (green/amber/grey) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Skill Portfolio Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified (green) • Self-claimed (amber) • Unverified (grey)
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('skills')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tag Cloud */}
            <div className="flex flex-wrap gap-2 pt-2">
              {initialSkills.map((skill) => {
                const variant = 
                  skill.status === 'verified' ? 'verified' :
                  skill.status === 'self-claimed' ? 'warning' : 'neutral';

                return (
                  <SkillPill
                    key={skill.id}
                    name={skill.name}
                    variant={variant}
                    score={skill.proficiency}
                    onClick={() => onNavigateTab('skills')}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Verified Skills: <strong>8 of 12</strong></span>
            <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => onNavigateTab('skill-gap')}>
              Compare with Target Role →
            </span>
          </div>
        </div>

        {/* Recommended Next Steps List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Recommended Next Steps
            </h2>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-3">
            {/* Action 1 */}
            <div 
              onClick={() => onNavigateTab('skills')}
              className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">
                    Verify TypeScript Skill
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Take a 3-minute interactive coding quiz to elevate from self-claimed to Verified ✓.
                  </p>
                </div>
              </div>
            </div>

            {/* Action 2 */}
            <div 
              onClick={() => onNavigateTab('projects')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">
                    Complete AI Logic Q&A
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    "Smart Campus Event Hub" is pending logic defense to earn the verified badge.
                  </p>
                </div>
              </div>
            </div>

            {/* Action 3 */}
            <div 
              onClick={() => onNavigateTab('skill-gap')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">
                    Close Docker Gap (+14% Match)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Review recommended 6-hour Docker micro-module to qualify for CloudSphere trainee role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
