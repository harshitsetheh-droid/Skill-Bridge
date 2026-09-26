import React, { useState, useEffect } from 'react';
import { loadInternships, JOBS_UPDATED_EVENT } from '../../data/jobsStore';
import { loadStudentSkills, SKILLS_UPDATED_EVENT } from '../../data/skillsStore';
import { loadProjects, PROJECTS_UPDATED_EVENT, checkJobEligibility } from '../../data/projectsStore';
import { 
  addSkillToCompanyImprovementPath, 
  isSkillInCompanyPath, 
  IMPROVEMENT_PATHS_UPDATED_EVENT 
} from '../../data/improvementPathStore';
import { Internship, Skill, Project } from '../../types';
import { CircularProgress } from '../common/CircularProgress';
import { 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  FolderGit2,
  Sparkles,
  Plus,
  Check,
  ArrowRight,
  X
} from 'lucide-react';

interface SkillGapViewProps {
  onNavigateTab?: (tab: string, roleOrMeta?: any) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ onNavigateTab }) => {
  const [internships, setInternships] = useState<Internship[]>(() => loadInternships());
  const [skills, setSkills] = useState<Skill[]>(() => loadStudentSkills());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    const list = loadInternships();
    return list[0]?.id || 'job-flagship';
  });
  const [pathUpdateCount, setPathUpdateCount] = useState(0);
  const [toastInfo, setToastInfo] = useState<{
    message: string;
    pathId?: string;
    companyName?: string;
    roleName?: string;
  } | null>(null);

  useEffect(() => {
    const handleJobs = () => setInternships(loadInternships());
    const handleSkills = () => setSkills(loadStudentSkills());
    const handleProjects = () => setProjects(loadProjects());
    const handlePaths = () => setPathUpdateCount(c => c + 1);

    window.addEventListener(JOBS_UPDATED_EVENT, handleJobs);
    window.addEventListener(SKILLS_UPDATED_EVENT, handleSkills);
    window.addEventListener(PROJECTS_UPDATED_EVENT, handleProjects);
    window.addEventListener(IMPROVEMENT_PATHS_UPDATED_EVENT, handlePaths);

    return () => {
      window.removeEventListener(JOBS_UPDATED_EVENT, handleJobs);
      window.removeEventListener(SKILLS_UPDATED_EVENT, handleSkills);
      window.removeEventListener(PROJECTS_UPDATED_EVENT, handleProjects);
      window.removeEventListener(IMPROVEMENT_PATHS_UPDATED_EVENT, handlePaths);
    };
  }, []);

  const targetJob = internships.find((j) => j.id === selectedJobId) || internships[0];

  // Dynamic eligibility check for the selected target job
  const eligibility = targetJob ? checkJobEligibility(targetJob, skills, projects) : null;

  const handleAddPreferredSkill = (skillName: string) => {
    if (!targetJob) return;

    const { path, alreadyExisted } = addSkillToCompanyImprovementPath(
      skillName,
      targetJob,
      skills,
      projects
    );

    setToastInfo({
      message: alreadyExisted
        ? `"${skillName}" is already part of ${targetJob.company} (${targetJob.title}) Improvement Roadmap.`
        : `✓ "${skillName}" added to ${targetJob.company} (${targetJob.title}) Improvement Roadmap!`,
      pathId: path.id,
      companyName: targetJob.company,
      roleName: targetJob.title
    });
  };

  const scoreColor = 
    targetJob && targetJob.matchScore >= 85 ? '#10B981' :
    targetJob && targetJob.matchScore >= 70 ? '#F59E0B' : '#DC2626';

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-12">
      {/* Header & Target Role Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Target Role Skill Gap Analysis
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time comparison of your verified competencies and portfolio project implementations against industry job profiles.
          </p>
        </div>

        {/* Role Selector dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Target Opportunity:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          >
            {internships.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company} ({job.matchScore}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Toast Notification when a skill is added to an improvement path */}
      {toastInfo && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950 dark:text-indigo-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-sm text-indigo-950 dark:text-indigo-100">
                {toastInfo.companyName} Skill Tree Updated
              </span>
              <p className="text-xs opacity-90">{toastInfo.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onNavigateTab && toastInfo.pathId && (
              <button
                onClick={() => onNavigateTab('improvement-path', toastInfo.pathId)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>View {toastInfo.companyName} Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setToastInfo(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {targetJob && (
        <>
          {/* Comparison Hero Card with Circular Match % Ring */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Match Ring & Quick Stats */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 text-center">
              <CircularProgress
                value={targetJob.matchScore}
                size={150}
                strokeWidth={13}
                accentColor={scoreColor}
                sublabel="Match Score"
              />
              <div className="mt-3">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    targetJob.matchScore >= 85
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : targetJob.matchScore >= 70
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                  }`}
                >
                  {targetJob.matchScore >= 85
                    ? 'High Qualification Match'
                    : targetJob.matchScore >= 70
                    ? 'Moderate Gap Detected'
                    : 'Significant Training Needed'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {targetJob.company} • {targetJob.location}
              </p>

              {/* Project Proof Status Badge */}
              <div className="mt-3 w-full pt-3 border-t border-slate-200 dark:border-slate-700">
                {eligibility && (
                  <div className={`p-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 ${
                    eligibility.allRequiredSkillsHaveProjects
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}>
                    <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {eligibility.allRequiredSkillsHaveProjects
                        ? '100% Required Skills Have Project Proof ✓'
                        : `${eligibility.missingRequiredProjects.length} Required Skills Missing Project Proof`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Your Skills vs Required Skills Breakdown */}
            <div className="md:col-span-8 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Skills & Project Verification Breakdown
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Mandatory: Project proof strictly required for all Required Skills
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verified matches and portfolio project implementations satisfy company recruitment criteria. Preferred skills are optional bonuses.
                </p>
              </div>

              {/* Required Skills Section (Mandatory Project Coverage) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Mandatory Required Skills (Project Proof Strictly Required)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Strict Gate
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {eligibility?.requiredChecks.map((req) => (
                    <div
                      key={req.skillName}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
                        req.isCoveredByProject && req.isSkillKnown
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                          : !req.isCoveredByProject
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                          : 'bg-red-50 dark:bg-red-950/80 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {req.isCoveredByProject && req.isSkillKnown ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      )}
                      <span>{req.skillName}</span>
                      <span className="text-[10px] opacity-75 font-normal">
                        {req.isCoveredByProject 
                          ? `(Project: ${req.coveringProjects[0]?.title.split(' ')[0]}...)`
                          : '(Missing Project Proof)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred / Bonus Skills (Project Optional) - Clickable to add to target company's improvement roadmap */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>Preferred & Differentiator Skills (Project Optional / Bonus)</span>
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Click any skill below to add it directly to <strong className="text-indigo-600 dark:text-indigo-400">{targetJob.company}</strong>'s Improvement Path & Skill Tree.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
                    Interactive • Click to Add
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {eligibility?.preferredChecks.map((pref) => {
                    const isAdded = targetJob ? isSkillInCompanyPath(pref.skillName, targetJob) : false;

                    return (
                      <button
                        key={pref.skillName}
                        type="button"
                        onClick={() => handleAddPreferredSkill(pref.skillName)}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer group ${
                          isAdded
                            ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-200 dark:ring-indigo-800'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-300 shadow-2xs'
                        }`}
                        title={
                          isAdded 
                            ? `"${pref.skillName}" is already in ${targetJob.company} (${targetJob.title}) Improvement Path`
                            : `Click to add "${pref.skillName}" to ${targetJob.company} (${targetJob.title}) Improvement Path`
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className={`w-3.5 h-3.5 ${isAdded ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                          <span>{pref.skillName}</span>
                        </div>

                        {isAdded ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            <span>In {targetJob.company} Path</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-0.5 transition-colors">
                            <Plus className="w-2.5 h-2.5" />
                            <span>Add to Roadmap</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Eligibility Verdict Banner */}
              {eligibility && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  eligibility.isApproved
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}>
                  {eligibility.isApproved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block mb-0.5">
                      {eligibility.isApproved ? 'Application Approved for Submission' : 'Application Requirement Notice'}
                    </span>
                    <p className="leading-relaxed">
                      {eligibility.summaryMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
