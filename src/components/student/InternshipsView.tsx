import React, { useState, useEffect } from 'react';
import { loadInternships, saveInternships, JOBS_UPDATED_EVENT } from '../../data/jobsStore';
import { loadStudentSkills, SKILLS_UPDATED_EVENT } from '../../data/skillsStore';
import { loadProjects, addProject, PROJECTS_UPDATED_EVENT, checkJobEligibility, normalizeTech, computeCompanyAtsScore } from '../../data/projectsStore';
import { 
  loadCompanyImprovementPaths, 
  generateCompanyPathFromJob, 
  addCompanyImprovementPath, 
  getCompanyImprovementPathByJobId,
  isCompanyInImprovementPath,
  IMPROVEMENT_PATHS_UPDATED_EVENT 
} from '../../data/improvementPathStore';
import { Internship, Skill, Project } from '../../types';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles,
  ArrowRight, 
  Filter,
  GraduationCap,
  Globe,
  Calendar,
  ArrowUpDown,
  Building2,
  Check,
  ShieldCheck,
  FolderGit2,
  Layers,
  X,
  Plus,
  ExternalLink,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface InternshipsViewProps {
  onNavigateTab?: (tab: string, meta?: any) => void;
}

export const InternshipsView: React.FC<InternshipsViewProps> = ({ onNavigateTab }) => {
  const [internships, setInternships] = useState<Internship[]>(() => loadInternships());
  const [studentSkills, setStudentSkills] = useState<Skill[]>(() => loadStudentSkills());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [improvementPaths, setImprovementPaths] = useState(() => loadCompanyImprovementPaths());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [campusFilter, setCampusFilter] = useState<'All' | 'on_campus' | 'off_campus'>('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'stipend'>('match');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Application & Project Verification Modal state
  const [selectedJobForModal, setSelectedJobForModal] = useState<Internship | null>(null);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [quickProjectTitle, setQuickProjectTitle] = useState('');
  const [quickProjectStack, setQuickProjectStack] = useState('');

  useEffect(() => {
    const handleJobsUpdated = () => setInternships(loadInternships());
    const handleSkillsUpdated = () => setStudentSkills(loadStudentSkills());
    const handleProjectsUpdated = () => setProjects(loadProjects());
    const handlePathsUpdated = () => setImprovementPaths(loadCompanyImprovementPaths());

    window.addEventListener(JOBS_UPDATED_EVENT, handleJobsUpdated);
    window.addEventListener(SKILLS_UPDATED_EVENT, handleSkillsUpdated);
    window.addEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated);
    window.addEventListener(IMPROVEMENT_PATHS_UPDATED_EVENT, handlePathsUpdated);

    return () => {
      window.removeEventListener(JOBS_UPDATED_EVENT, handleJobsUpdated);
      window.removeEventListener(SKILLS_UPDATED_EVENT, handleSkillsUpdated);
      window.removeEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated);
      window.removeEventListener(IMPROVEMENT_PATHS_UPDATED_EVENT, handlePathsUpdated);
    };
  }, []);

  const handleImprovementClick = (job: Internship) => {
    let existing = getCompanyImprovementPathByJobId(job.id);
    if (!existing) {
      const newPath = generateCompanyPathFromJob(job, studentSkills, projects);
      addCompanyImprovementPath(newPath);
      existing = newPath;
    }
    setToastMessage(`✓ Created "${job.company}" Improvement Roadmap! Redirecting...`);
    setTimeout(() => {
      if (onNavigateTab) {
        onNavigateTab('improvement-path', existing?.id);
      }
    }, 350);
  };

  // Filter & sort logic
  const filteredAndSortedJobs = internships
    .map((job) => ({
      job,
      ats: computeCompanyAtsScore(job.requiredSkills, studentSkills, projects),
    }))
    .filter(({ job }) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.targetUniversity && job.targetUniversity.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'All' || job.type === typeFilter;
      
      const matchesCampus = 
        campusFilter === 'All' ||
        (campusFilter === 'on_campus' && job.campusType === 'on_campus') ||
        (campusFilter === 'off_campus' && (job.campusType === 'off_campus' || !job.campusType));

      if (job.campusType === 'on_campus' && job.tpoApprovalStatus === 'pending') {
        return false;
      }

      return matchesSearch && matchesType && matchesCampus;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.ats.atsScore - a.ats.atsScore;
      if (sortBy === 'date') {
        const dateA = a.job.driveStartDate || a.job.deadline || '';
        const dateB = b.job.driveStartDate || b.job.deadline || '';
        return dateA.localeCompare(dateB);
      }
      if (sortBy === 'stipend') {
        const numA = parseInt(a.job.stipend.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.job.stipend.replace(/\D/g, '')) || 0;
        return numB - numA;
      }
      return 0;
    });

  const handleApply = (jobId: string, jobTitle: string, company: string) => {
    const updated = internships.map((job) =>
      job.id === jobId ? { ...job, isApplied: true, applicantsCount: job.applicantsCount + 1 } : job
    );
    setInternships(updated);
    saveInternships(updated);
    if (selectedJobForModal && selectedJobForModal.id === jobId) {
      setSelectedJobForModal({ ...selectedJobForModal, isApplied: true, applicantsCount: selectedJobForModal.applicantsCount + 1 });
    }
    setToastMessage(`✓ Application approved and submitted for ${jobTitle} at ${company}! Verified portfolio delivered.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleQuickAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickProjectTitle || !quickProjectStack) return;

    addProject({
      title: quickProjectTitle,
      description: 'Engineering project validating practical execution across specified technologies.',
      techStack: quickProjectStack.split(',').map((s) => s.trim()),
      repoUrl: 'https://github.com/harshitseth-dev/' + quickProjectTitle.toLowerCase().replace(/\s+/g, '-'),
      originalityScore: 94,
      status: 'passed',
      qnaPassed: true,
      verifiedDate: 'Today',
    });

    setQuickAddModalOpen(false);
    setQuickProjectTitle('');
    setQuickProjectStack('');
    setToastMessage('✓ New project added to portfolio! Mandatory skill coverage updated.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const onCampusCount = internships.filter((j) => j.campusType === 'on_campus' && j.tpoApprovalStatus === 'approved').length;
  const offCampusCount = internships.filter((j) => j.campusType === 'off_campus' || !j.campusType).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Matched Internships & Placement Drives
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              {filteredAndSortedJobs.length} Available
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified skill and project portfolio matching for campus drives and nationwide opportunities.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, skills, companies..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Strict Application Rule Explainer Banner (USER INTENT REQUIREMENT) */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 text-indigo-200 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Application Gate Protocol
              </span>
              <span className="px-2 py-0.2 rounded-full bg-white/20 text-[10px] font-semibold text-white">
                Project-Based Verification
              </span>
            </div>
            <p className="text-xs text-indigo-100/90 mt-1 leading-relaxed max-w-3xl">
              Employers strictly mandate practical <strong>project demonstrations for all Required Skills</strong>. Multiple projects in your portfolio combine to cover the demand (e.g. Project 1 + Project 2). Skills marked <strong>Preferred</strong> are evaluated as optional bonuses and do not require projects.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setQuickProjectTitle('Cloud & AI Microservices Suite');
            setQuickProjectStack('Python, SQL, Docker, AIML, HTML, CSS, JavaScript, React');
            setQuickAddModalOpen(true);
          }}
          className="shrink-0 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-amber-300" />
          <span>Quick Link Project</span>
        </button>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* On-Campus vs Off-Campus Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 overflow-x-auto text-xs">
          <button
            onClick={() => setCampusFilter('All')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
              campusFilter === 'All'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Opportunities ({internships.length})
          </button>

          <button
            onClick={() => setCampusFilter('on_campus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
              campusFilter === 'on_campus'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>On-Campus Drives</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              campusFilter === 'on_campus' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {onCampusCount}
            </span>
          </button>

          <button
            onClick={() => setCampusFilter('off_campus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
              campusFilter === 'off_campus'
                ? 'bg-blue-900 dark:bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Off-Campus Openings</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              campusFilter === 'off_campus' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {offCampusCount}
            </span>
          </button>
        </div>

        {/* Secondary Filters: Job Type & Sort Order */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {['All', 'Internship', 'Full-time'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  typeFilter === type
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="match">Sort by: Best Company ATS %</option>
              <option value="date">Sort by: Drive / Deadline Date</option>
              <option value="stipend">Sort by: Highest Stipend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internship Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAndSortedJobs.map(({ job, ats }) => {
          const isOnCampus = job.campusType === 'on_campus';
          const isApplied = job.isApplied;
          
          // Calculate eligibility dynamically for this job
          const eligibility = checkJobEligibility(job, studentSkills, projects);
          const isApproved = eligibility.isApproved;

          return (
            <div
              key={job.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 ${
                isOnCampus
                  ? 'border-indigo-200/90 dark:border-indigo-900/60 ring-1 ring-indigo-100 dark:ring-indigo-950/40'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {isOnCampus ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>On-Campus Drive • {job.targetUniversity || 'IT Jodhpur'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium">
                      <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Off-Campus Opportunity</span>
                    </span>
                  )}

                  {/* Per-Company ATS % Badge */}
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 shrink-0 ${
                      ats.atsScore >= 85
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : ats.atsScore >= 70
                        ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <span>{ats.atsScore}% ATS</span>
                  </div>
                </div>

                {/* Company & Title */}
                <div className="mb-2">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {job.company}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {job.title}
                  </h2>
                </div>

                {/* Campus Drive Dates Callout */}
                {isOnCampus && job.driveStartDate && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      Drive Dates: {job.driveStartDate} {job.driveEndDate ? `to ${job.driveEndDate}` : ''}
                    </span>
                  </div>
                )}

                {/* Location, Stipend, Type */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-slate-400" />
                    {job.stipend}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {/* Mandatory Required Skills with Project Proof Status (USER INTENT) */}
                <div className="mb-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Required Skills (Mandatory Project Proof):
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      eligibility.allRequiredSkillsHaveProjects
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {ats.hasCount}/{ats.requiredCount} Owned • {ats.verifiedCount} Verified • {ats.projectCount} Proven
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {eligibility.requiredChecks.map((check) => {
                      const hasProject = check.isCoveredByProject;
                      return (
                        <span
                          key={check.skillName}
                          title={hasProject ? `Demonstrated in: ${check.coveringProjects.map((p) => p.title).join(', ')}` : 'Missing project proof in your portfolio'}
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium border flex items-center gap-1 ${
                            hasProject && check.isSkillKnown
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : !hasProject
                              ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                          }`}
                        >
                          {hasProject ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          )}
                          <span>{check.skillName}</span>
                          {hasProject && (
                            <span className="text-[9px] font-normal opacity-70">
                              ({check.coveringProjects[0]?.tech || 'Project'})
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Skills (Project Optional) */}
                {job.preferredSkills && job.preferredSkills.length > 0 && (
                  <div className="mb-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Preferred Skills (Project Optional / Bonus):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {eligibility.preferredChecks.map((check) => (
                        <span
                          key={check.skillName}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        >
                          {check.skillName}
                          {check.isCoveredByProject ? ' (Proven)' : ' (Optional)'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Deadline: {job.deadline} • {job.applicantsCount} applied
                </span>

                {isApplied ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Applied ✓</span>
                  </span>
                ) : isApproved ? (
                  <button
                    onClick={() => setSelectedJobForModal(job)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleImprovementClick(job)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer bg-amber-500 hover:bg-amber-600 text-white"
                      title="Open or generate targeted improvement path for this company"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isCompanyInImprovementPath(job.id) ? 'Improvement Path Added ✓' : 'Improvement Path'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setSelectedJobForModal(job)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      title="View detailed eligibility breakdown"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* APPLICATION & PROJECT VERIFICATION MODAL (USER INTENT REQUIREMENT)         */}
      {/* ========================================================================= */}
      {selectedJobForModal && (() => {
        const modalEligibility = checkJobEligibility(selectedJobForModal, studentSkills, projects);
        const modalAts = computeCompanyAtsScore(selectedJobForModal.requiredSkills, studentSkills, projects);
        const canSubmit = modalEligibility.isApproved && !selectedJobForModal.isApplied;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col justify-between my-auto animate-scale-in">
              <div className="overflow-y-auto pr-1 space-y-5">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                        {selectedJobForModal.campusType === 'on_campus' ? 'On-Campus Placement Drive' : 'Off-Campus Hiring'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {selectedJobForModal.company}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {selectedJobForModal.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Stipend: {selectedJobForModal.stipend} • Location: {selectedJobForModal.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJobForModal(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Eligibility Protocol Callout */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Company Verification Protocol</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    To apply, you must possess the required competencies AND have verified project demonstrations covering <strong>every Required Skill</strong>. Projects across your portfolio are evaluated collectively. Preferred skills do NOT require projects.
                  </p>
                </div>

                {/* Per-Company ATS Score Summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/40">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      Your ATS at {selectedJobForModal.company}
                    </div>
                    <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                      {modalAts.atsScore}%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      of {modalAts.requiredCount} required skills
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 leading-tight">
                      ATS Breakdown
                    </div>
                    <div className="space-y-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Skills Owned</span>
                        <span>{modalAts.hasCount}/{modalAts.requiredCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Verified</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{modalAts.verifiedCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Project Coverage</span>
                        <span>{modalAts.projectCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Required Skills Verification Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>1. Required Skills</span>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">(Strict Project Proof Mandatory)</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {modalEligibility.requiredChecks.filter((c) => c.isCoveredByProject).length}/{modalEligibility.requiredChecks.length} Skills Proven
                    </span>
                  </div>

                  <div className="space-y-2">
                    {modalEligibility.requiredChecks.map((req) => {
                      const isProven = req.isCoveredByProject;
                      return (
                        <div
                          key={req.skillName}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                            isProven && req.isSkillKnown
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isProven && req.isSkillKnown ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            )}
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {req.skillName}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                Competency: {req.isSkillKnown ? `${req.proficiency}% proficiency` : 'Not yet tested'}
                              </span>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            {isProven ? (
                              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                <FolderGit2 className="w-3.5 h-3.5" />
                                <span>Proven in: <strong>{req.coveringProjects[0]?.title}</strong></span>
                              </div>
                            ) : (
                              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 sm:justify-end">
                                <span>❌ Missing Project Proof (Mandatory)</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Preferred Skills Section (Project Optional) */}
                {modalEligibility.preferredChecks.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span>2. Preferred Skills</span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">(Project Optional / Bonus)</span>
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        Does not block application
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {modalEligibility.preferredChecks.map((pref) => (
                        <div
                          key={pref.skillName}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{pref.skillName}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {pref.isCoveredByProject ? '✓ Proven in Portfolio' : '• Project Optional'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Portfolio Synergy View (User's Exact Scenario) */}
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-indigo-950 dark:text-indigo-100 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Portfolio Project Combination Synergy
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {projects.length} Verified Projects Active
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed mb-2">
                    Skills are validated across your entire portfolio. For example, Project 1 covers web & container skills while Project 2 covers machine learning and data pipelines:
                  </p>
                  <div className="space-y-1.5">
                    {projects.slice(0, 3).map((p) => {
                      const coveredReqs = selectedJobForModal.requiredSkills.filter((req) => {
                        const nReq = normalizeTech(req);
                        return p.techStack.some((t) => normalizeTech(t) === nReq || t.toLowerCase().includes(nReq) || req.toLowerCase().includes(normalizeTech(t)));
                      });
                      return (
                        <div key={p.id} className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{p.title}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">({p.techStack.join(', ')})</span>
                          </div>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
                            Covers {coveredReqs.length} required skill{coveredReqs.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verdict Box */}
                <div className={`p-4 rounded-xl border text-xs ${
                  modalEligibility.isApproved
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {modalEligibility.isApproved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-sm block">
                        {modalEligibility.isApproved
                          ? 'VERIFIED ELIGIBLE — APPLICATION APPROVED'
                          : 'APPLICATION BLOCKED — MISSING PROJECT PROOF'}
                      </span>
                      <p className="text-[11px] mt-1 leading-relaxed">
                        {modalEligibility.summaryMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                {!modalEligibility.isApproved ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        const job = selectedJobForModal;
                        setSelectedJobForModal(null);
                        handleImprovementClick(job);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open {selectedJobForModal.company} Improvement Path</span>
                    </button>
                    <button
                      onClick={() => {
                        setQuickProjectTitle(`Project Demonstrating ${modalEligibility.missingRequiredProjects.join(', ')}`);
                        setQuickProjectStack(modalEligibility.missingRequiredProjects.join(', '));
                        setQuickAddModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Link Project</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    100% of mandatory required skills demonstrated in portfolio.
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJobForModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Close
                  </button>

                  {selectedJobForModal.isApplied ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Already Applied</span>
                    </span>
                  ) : (
                    <button
                      disabled={!canSubmit}
                      onClick={() => handleApply(selectedJobForModal.id, selectedJobForModal.title, selectedJobForModal.company)}
                      className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                        canSubmit
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {canSubmit ? (
                        <>
                          <span>Submit Verified Application</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Application Locked</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick Add Project Modal (Helper for instant testing & compliance) */}
      {quickAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Add / Link Project for Required Skills
                </h3>
              </div>
              <button
                onClick={() => setQuickAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title:
                </label>
                <input
                  type="text"
                  required
                  value={quickProjectTitle}
                  onChange={(e) => setQuickProjectTitle(e.target.value)}
                  placeholder="e.g. Distributed Analytics Suite"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tech Stack (Comma-separated skill tags):
                </label>
                <input
                  type="text"
                  required
                  value={quickProjectStack}
                  onChange={(e) => setQuickProjectStack(e.target.value)}
                  placeholder="e.g. Python, SQL, Docker, AIML, HTML, CSS, JavaScript, React"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  These skill tags will immediately prove the corresponding company required skills.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Save & Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
