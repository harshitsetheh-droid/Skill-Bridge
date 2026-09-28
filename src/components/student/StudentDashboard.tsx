import React from 'react';
import { Skill, Project, Internship } from '../../types';
import { CircularProgress } from '../common/CircularProgress';
import { SkillPill } from '../common/SkillPill';
import {
  Award,
  Send,
  FolderGit2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { loadDailyStreakState, STREAK_UPDATED_EVENT } from '../../data/dailyQuizStore';
import { loadStudentSkills, SKILLS_UPDATED_EVENT } from '../../data/skillsStore';
import { loadProjects, PROJECTS_UPDATED_EVENT, computeCompanyAtsScore } from '../../data/projectsStore';
import { loadInternships, JOBS_UPDATED_EVENT } from '../../data/jobsStore';
import { loadStoredResumes, RESUMES_UPDATED_EVENT } from '../../data/resumeStore';
import { loadCompanyImprovementPaths, IMPROVEMENT_PATHS_UPDATED_EVENT } from '../../data/improvementPathStore';
import { campusRecruitingCompaniesData } from '../../data/campusRecruitingCompaniesStore';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
}

const REFRESH_EVENTS = [
  STREAK_UPDATED_EVENT,
  SKILLS_UPDATED_EVENT,
  PROJECTS_UPDATED_EVENT,
  JOBS_UPDATED_EVENT,
  RESUMES_UPDATED_EVENT,
  IMPROVEMENT_PATHS_UPDATED_EVENT,
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const [streakState, setStreakState] = React.useState(loadDailyStreakState);
  const [skills, setSkills] = React.useState<Skill[]>(() => loadStudentSkills());
  const [projects, setProjects] = React.useState<Project[]>(() => loadProjects());
  const [jobs, setJobs] = React.useState<Internship[]>(() => loadInternships());
  const [resumes, setResumes] = React.useState(() => loadStoredResumes());
  const [paths, setPaths] = React.useState(() => loadCompanyImprovementPaths());
  const [selectedCompany, setSelectedCompany] = React.useState<string>('overall');

  React.useEffect(() => {
    const handleUpdate = () => {
      setStreakState(loadDailyStreakState());
      setSkills(loadStudentSkills());
      setProjects(loadProjects());
      setJobs(loadInternships());
      setResumes(loadStoredResumes());
      setPaths(loadCompanyImprovementPaths());
    };
    REFRESH_EVENTS.forEach((ev) => window.addEventListener(ev, handleUpdate));
    return () => REFRESH_EVENTS.forEach((ev) => window.removeEventListener(ev, handleUpdate));
  }, []);

  const verifiedCount = skills.filter((s) => s.status === 'verified').length;
  const selfClaimedCount = skills.filter((s) => s.status === 'self-claimed' || s.status === 'unverified').length;
  const appliedJobs = jobs.filter((j) => j.isApplied);
  const passedProjects = projects.filter((p) => p.status === 'passed');
  const pendingProjects = projects.filter((p) => p.status === 'pending');
  const avgOriginality = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + (p.originalityScore || 0), 0) / projects.length)
    : 0;
  const readiness = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + (s.proficiency || 0), 0) / skills.length)
    : 0;

  // Company-wise placement readiness (ATS per company based on its required skills)
  const companyReadiness = React.useMemo(() => {
    const jobsByCompany = jobs.filter((j) => j.requiredSkills && j.requiredSkills.length > 0);
    const knownCompanies = new Map<string, { name: string; roleHints: string[] }>();

    campusRecruitingCompaniesData.forEach((c) => {
      knownCompanies.set(c.name, { name: c.name, roleHints: c.pastTargetedRoles || [c.industry] });
    });
    jobsByCompany.forEach((j) => {
      if (!knownCompanies.has(j.company)) {
        knownCompanies.set(j.company, { name: j.company, roleHints: [j.title] });
      }
    });

    const list = Array.from(knownCompanies.entries()).map(([name, meta]) => {
      const requiredSkills =
        campusRecruitingCompaniesData.find((c) => c.name === name)?.requiredSkills ||
        jobsByCompany.find((j) => j.company === name)?.requiredSkills ||
        [];
      const ats = computeCompanyAtsScore(requiredSkills, skills, projects);
      return {
        name,
        roleHint: meta.roleHints[0] || 'Software Engineering',
        requiredSkills,
        atsScore: ats.atsScore,
        verifiedCount: ats.verifiedCount,
        requiredCount: ats.requiredCount,
        projectCount: ats.projectCount,
      };
    });

    return list.sort((a, b) => b.atsScore - a.atsScore);
  }, [jobs, skills, projects]);

  const activeCompany =
    selectedCompany === 'overall'
      ? null
      : companyReadiness.find((c) => c.name === selectedCompany) || null;
  const displayedReadyValue = activeCompany ? activeCompany.atsScore : readiness;
  const readyAccentColor = displayedReadyValue >= 85 ? '#10B981' : displayedReadyValue >= 65 ? '#F59E0B' : '#DC2626';
  const readyStatusLabel =
    displayedReadyValue >= 85 ? 'Drives Ahead of Play' : displayedReadyValue >= 65 ? 'Near-Ready' : 'Training Needed';

  const activeResume = resumes.find((r) => r.status === 'active') || resumes[0];
  const displayName = activeResume?.candidateName?.trim() || 'Student';
  const displayEducation = activeResume?.education?.trim() || '';
  const targetRole = paths[0]?.targetRole || appliedJobs[0]?.title || '';

  const firstUnverified = skills.find((s) => s.status !== 'verified');

  const recommendedActions: { tab: string; title: string; desc: string }[] = [];
  if (selfClaimedCount > 0 && firstUnverified) {
    recommendedActions.push({
      tab: 'skills',
      title: `Verify ${firstUnverified.name}`,
      desc: `${selfClaimedCount} self-claimed skill${selfClaimedCount === 1 ? '' : 's'} awaiting quiz verification to earn the verified badge.`,
    });
  } else if (skills.length === 0) {
    recommendedActions.push({
      tab: 'skills',
      title: 'Add Your First Skill',
      desc: 'Build your portfolio matrix by adding skills and completing their checkpoints.',
    });
  } else {
    recommendedActions.push({
      tab: 'skill-gap',
      title: 'Check Skill Gaps',
      desc: 'Compare your verified skills against current target-role requirements.',
    });
  }

  if (pendingProjects.length > 0) {
    recommendedActions.push({
      tab: 'projects',
      title: 'Complete Logic Q&A Defense',
      desc: `${pendingProjects.length} project${pendingProjects.length === 1 ? '' : 's'} pending verification to earn approval.`,
    });
  } else if (projects.length === 0) {
    recommendedActions.push({
      tab: 'projects',
      title: 'Add a Project',
      desc: 'Projects demonstrate real-world coverage for your claimed skills.',
    });
  } else {
    recommendedActions.push({
      tab: 'projects',
      title: 'Projects Up to Date',
      desc: `${projects.length} project${projects.length === 1 ? '' : 's'} recorded with an average originality score of ${avgOriginality}%.`,
    });
  }

  if (targetRole) {
    recommendedActions.push({
      tab: 'skill-gap',
      title: `Close ${targetRole} Gap`,
      desc: 'Review recommended micro-modules to qualify for the target role.',
    });
  } else {
    recommendedActions.push({
      tab: 'resume',
      title: 'Refine Your Resume',
      desc: 'Upload a resume to extract skills, score ATS readiness, and receive recommendations.',
    });
  }

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
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            {displayEducation
              ? displayEducation
              : skills.length > 0
                ? `${verifiedCount} verified • ${selfClaimedCount} self-claimed skills`
                : 'Complete your profile and skill matrix to calibrate readiness.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs text-slate-500 font-medium">Target Role:</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
              {targetRole || 'Not Set'}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {verifiedCount} Verified Skill{verifiedCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Large Circular Readiness Score Ring (Overall or Company-Specific) */}
        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 shrink-0 w-full max-w-[300px]">
          <CircularProgress
            value={displayedReadyValue}
            size={140}
            strokeWidth={12}
            accentColor={readyAccentColor}
            sublabel={activeCompany ? `Ready: ${activeCompany.name}` : 'Placement Ready'}
          />
          <span className="text-xs text-slate-500 mt-2 font-medium">
            {activeCompany
              ? `${activeCompany.verifiedCount}/${activeCompany.requiredCount} required skills verified • ${activeCompany.projectCount} projects`
              : skills.length > 0
                ? `Avg proficiency across ${skills.length} skills`
                : 'No skills added yet'}
          </span>
          <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            displayedReadyValue >= 85
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : displayedReadyValue >= 65
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {readyStatusLabel}
          </span>

          {companyReadiness.length > 0 && (
            <div className="mt-3 pt-3 w-full border-t border-slate-200/70">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Placement Readiness By Company
              </label>
              <select
                value={activeCompany ? activeCompany.name : 'overall'}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="overall">Overall (All Companies)</option>
                {companyReadiness.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} — {c.atsScore}%
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clickable company chips */}
          <div className="mt-3 w-full flex flex-wrap gap-1.5 justify-center">
            {companyReadiness.slice(0, 4).map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCompany(c.name)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  activeCompany && activeCompany.name === c.name
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : c.atsScore >= 85
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : c.atsScore >= 65
                    ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                }`}
              >
                {c.name} {c.atsScore}%
              </button>
            ))}
          </div>
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
              {verifiedCount}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">{skills.length} Total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {selfClaimedCount > 0
              ? `${selfClaimedCount} self-claimed awaiting quiz verification`
              : skills.length > 0
                ? 'All skills verified'
                : 'No skills added yet'}
          </p>
        </div>

        {/* Stat 3: Active Applications */}
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
              {appliedJobs.length}
            </span>
            <span className="text-xs text-indigo-600 font-semibold">{jobs.length} Live Jobs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {appliedJobs.length > 0 ? `Latest: ${appliedJobs[0].title}` : 'Browse internships to apply'}
          </p>
        </div>

        {/* Stat 4: Projects Reviewed */}
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
              {projects.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">{passedProjects.length} Passed ✓</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {projects.length > 0
              ? `Avg originality score: ${avgOriginality}%`
              : 'No projects added yet'}
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
              {skills.length > 0 ? (
                skills.map((skill) => {
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
                })
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  No skills added yet. Head to Skills to build your portfolio matrix.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Verified Skills: <strong>{verifiedCount} of {skills.length}</strong></span>
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

          {recommendedActions.length > 0 ? (
            <div className="space-y-3">
              {recommendedActions.map((action, idx) => (
                <div
                  key={action.title}
                  onClick={() => onNavigateTab(action.tab)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    idx === 0
                      ? 'border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0 text-xs font-bold ${
                      idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-slate-900' : 'bg-amber-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-slate-900">
                        {action.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              No recommendations yet. Add data to unlock next steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};