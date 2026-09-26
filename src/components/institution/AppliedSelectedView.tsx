import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Award, 
  ExternalLink, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Download,
  AlertCircle,
  Eye,
  X,
  ShieldCheck,
  MapPin,
  Check,
  Code,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';
import { useOnCampusApplications, useCollegeSelectedStudents } from '../../data/studentApplicationsStore';
import { campusRecruitingCompaniesData } from '../../data/campusRecruitingCompaniesStore';
import { OnCampusApplication, CollegeSelectedStudentRecord } from '../../types';

export const AppliedSelectedView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applied' | 'selected'>('applied');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  // Modal state for viewing candidate full dossier
  const [selectedDossierApp, setSelectedDossierApp] = useState<OnCampusApplication | null>(null);
  const [selectedSelectedStudent, setSelectedSelectedStudent] = useState<CollegeSelectedStudentRecord | null>(null);

  const onCampusApplications = useOnCampusApplications();
  const collegeSelectedStudents = useCollegeSelectedStudents();

  // Distinct company lists for filter dropdown
  const companies = Array.from(new Set([
    ...campusRecruitingCompaniesData.map(c => c.name),
    ...onCampusApplications.map(a => a.companyName),
    ...collegeSelectedStudents.map(s => s.companyName)
  ]));

  // Distinct years for Selected tab
  const availableYears = Array.from(
    new Set(collegeSelectedStudents.map(s => s.selectionYear || (s as any).placementYear))
  ).filter(Boolean).sort().reverse();

  // Filter Applied candidates
  const filteredApplied = onCampusApplications.filter(app => {
    const roleString = app.jobTitle || (app as any).roleTitle || (app as any).offeredRole || '';
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roleString.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany = selectedCompanyFilter === 'all' || app.companyName === selectedCompanyFilter;
    const matchesStatus = selectedStatusFilter === 'all' || app.status === selectedStatusFilter;

    return matchesSearch && matchesCompany && matchesStatus;
  });

  // Shortlisted candidates: strictly those whose status is 'shortlisted' or 'interview_scheduled' and not 'selected'
  const shortlistedCandidates = filteredApplied.filter(
    app => (app.status === 'shortlisted' || app.status === 'interview_scheduled') && app.status !== 'selected'
  );

  // Under Review candidates: strictly those with status 'applied', 'under_evaluation', or 'in_review'
  // CRITICAL REQUIREMENT: Candidates who are shortlisted or selected are EXCLUDED from this lower section!
  const underReviewCandidates = filteredApplied.filter(
    app => 
      (app.status === 'applied' || app.status === 'under_evaluation' || (app as any).status === 'in_review') &&
      app.status !== 'shortlisted' &&
      app.status !== 'interview_scheduled' &&
      app.status !== 'selected'
  );

  // Filter Selected candidates
  const filteredSelected = collegeSelectedStudents.filter(std => {
    const matchesSearch = 
      std.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCompany = selectedCompanyFilter === 'all' || std.companyName === selectedCompanyFilter;
    const stdYear = std.selectionYear || (std as any).placementYear;
    const matchesYear = selectedYearFilter === 'all' || stdYear === selectedYearFilter;

    return matchesSearch && matchesCompany && matchesYear;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>TPO Placement & Recruitment Cell</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Applied & Selected Candidates
          </h1>
          <p className="text-sm text-[#718196] dark:text-[#9AA9BC] mt-1">
            Track live company shortlist sync, manage candidate screening, and monitor verified company selections with role & CTC records.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-[#F5F7FA] dark:bg-[#172033] rounded-lg border border-[#E8ECF1] dark:border-[#334155] shrink-0">
          <button
            onClick={() => { setActiveTab('applied'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold font-display transition-all cursor-pointer ${
              activeTab === 'applied'
                ? 'bg-[#0F766E] text-white shadow-[0_5px_12px_rgba(15,118,110,0.22)]'
                : 'text-[#718196] hover:text-[#1F3048] dark:hover:text-[#F3F6FA]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Campus Applied ({onCampusApplications.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('selected'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold font-display transition-all cursor-pointer ${
              activeTab === 'selected'
                ? 'bg-[#15803D] text-white shadow-[0_5px_12px_rgba(21,128,61,0.22)]'
                : 'text-[#718196] hover:text-[#1F3048] dark:hover:text-[#F3F6FA]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selected Offers ({collegeSelectedStudents.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Active Applications</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {onCampusApplications.length}
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 block">
            Across {new Set(onCampusApplications.map(a => a.companyName)).size} Campus Drives
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Live Shortlisted for Rounds</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
            {onCampusApplications.filter(a => a.status === 'shortlisted' || a.status === 'interview_scheduled').length}
          </span>
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold mt-0.5 block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Interview Defense Stage</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Recruited Students</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {collegeSelectedStudents.length}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold mt-0.5 block">
            Transmitted by Companies
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Highest Recruited Package</span>
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400 mt-1 block">
            ₹34.0 LPA
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 block">
            AlphaCloud / Google Partners
          </span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'applied' ? "Search student, roll number, company, role..." : "Search selected student, company, role..."}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Company filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="all">All Recruiting Companies</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tab-specific filter */}
          {activeTab === 'applied' ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="all">All Stages (Shortlisted & Under Review)</option>
                <option value="shortlisted">Shortlisted for Rounds Only</option>
                <option value="applied">Under Initial Review Only</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedYearFilter}
                onChange={(e) => setSelectedYearFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="all">All Placement Years</option>
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>Batch {yr}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: APPLIED STUDENTS (On-Campus Active & Future Drives) */}
      {activeTab === 'applied' && (
        <div className="space-y-6">
          {/* ========================================================================= */}
          {/* SECTION 1: LIVE COMPANY SHORTLISTED CANDIDATES (INTERVIEW DEFENSE ROUND)  */}
          {/* ========================================================================= */}
          {(selectedStatusFilter === 'all' || selectedStatusFilter === 'shortlisted') && (
            <div className="space-y-3">
              {/* Shortlist Header Banner with Live Sync Indicator */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50/60 to-white dark:from-purple-950/40 dark:via-slate-800 dark:to-slate-800 p-4 rounded-xl border border-purple-200 dark:border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                        Live Company Shortlisted Candidates (Technical Interview Stage)
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200 text-[10px] font-extrabold border border-purple-300 dark:border-purple-700">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                        <span>Live Company Sync Active</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Candidates below have cleared initial resume and proof-of-work screening and have been shortlisted by recruiters for interview rounds.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-extrabold text-xs shadow-2xs">
                    {shortlistedCandidates.length} Shortlisted
                  </span>
                </div>
              </div>

              {/* Shortlisted Candidates Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-purple-200 dark:border-purple-800/60 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 border-b border-purple-100 dark:border-purple-900">
                      <tr>
                        <th className="py-3 px-3.5">Candidate Details</th>
                        <th className="py-3 px-3.5">Shortlisting Company</th>
                        <th className="py-3 px-3.5">Target Role & Package</th>
                        <th className="py-3 px-3.5">Verified Skill Match</th>
                        <th className="py-3 px-3.5">Academic & CGPA</th>
                        <th className="py-3 px-3.5">Live Company Sync Status</th>
                        <th className="py-3 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100/70 dark:divide-slate-700/60">
                      {shortlistedCandidates.length > 0 ? (
                        shortlistedCandidates.map((app) => (
                          <tr key={app.id} className="hover:bg-purple-50/40 dark:hover:bg-slate-750/50 transition-colors">
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                                  {app.avatar ? (
                                    <img src={app.avatar} alt={app.studentName} className="w-full h-full object-cover" />
                                  ) : (
                                    app.studentName.substring(0, 2).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <span>{app.studentName}</span>
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <Check className="w-2.5 h-2.5" />
                                      <span>Verified</span>
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{app.rollNumber}</div>
                                  <div className="text-[10px] text-slate-400">{app.branch}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                <span>{app.companyName}</span>
                              </div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-1 bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                                Campus Recruitment Drive
                              </span>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="font-semibold text-slate-800 dark:text-slate-200">
                                {app.jobTitle || (app as any).offeredRole || 'Software Engineer'}
                              </div>
                              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                {app.packageOffered || (app as any).expectedPackageOrStipend || '₹22.0 LPA - ₹28.0 LPA'}
                              </div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-purple-600 dark:text-purple-400 text-sm">{app.matchScore}%</span>
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${app.matchScore}%` }} />
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 flex flex-wrap gap-1">
                                {app.skillsLearned?.slice(0, 2).map(s => (
                                  <span key={s.name} className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="font-bold text-slate-800 dark:text-slate-200">CGPA: {app.cgpa}</div>
                              <div className="text-slate-500 text-[10px]">{app.collegeName || 'Accredited Institution'}</div>
                            </td>

                            <td className="py-3 px-3.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                <span>Shortlisted for Interview</span>
                              </span>
                              <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                                Synced from Recruiter Portal ✓
                              </span>
                            </td>

                            <td className="py-3 px-3.5 text-right">
                              <button
                                onClick={() => setSelectedDossierApp(app)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/40 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-700 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Dossier</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-slate-400">
                            No candidates currently shortlisted matching your filter. When recruiting companies shortlist students in their portal, they will automatically appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: APPLICATIONS UNDER INITIAL REVIEW & SCREENING ("NICHE")         */}
          {/* CRITICAL: Shortlisted and selected students are EXCLUDED from this list!   */}
          {/* ========================================================================= */}
          {(selectedStatusFilter === 'all' || selectedStatusFilter === 'applied' || selectedStatusFilter === 'in_review') && (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                      Applications Under Initial Review & Screening
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                      {underReviewCandidates.length} Pending Initial Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Applicants undergoing preliminary automated AST screening and proof verification. Once shortlisted by a company, they move exclusively to the Live Shortlisted Candidates stream above.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3 px-3.5">Student Details</th>
                        <th className="py-3 px-3.5">Recruiting Company & Drive</th>
                        <th className="py-3 px-3.5">Applied Role & Stipend</th>
                        <th className="py-3 px-3.5">Skill Match</th>
                        <th className="py-3 px-3.5">Academic & CGPA</th>
                        <th className="py-3 px-3.5">Application Status</th>
                        <th className="py-3 px-3.5">Submission Date</th>
                        <th className="py-3 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {underReviewCandidates.length > 0 ? (
                        underReviewCandidates.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors">
                            <td className="py-3 px-3.5">
                              <div className="font-bold text-slate-900 dark:text-white">{app.studentName}</div>
                              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{app.rollNumber}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{app.branch}</div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                                <span>{app.companyName}</span>
                              </div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                Preliminary Screening
                              </span>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="font-semibold text-slate-800 dark:text-slate-200">{app.jobTitle}</div>
                              <div className="text-slate-500 text-[11px]">{app.packageOffered || 'Standard Drive Package'}</div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">{app.matchScore}%</span>
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${app.matchScore}%` }} />
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {app.skillsLearned?.slice(0, 2).map(s => s.name).join(', ')}
                              </div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="font-bold text-slate-800 dark:text-slate-200">CGPA: {app.cgpa}</div>
                              <div className="text-slate-500 text-[11px]">{app.branch}</div>
                            </td>

                            <td className="py-3 px-3.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Under Review</span>
                              </span>
                            </td>

                            <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400">
                              {app.applicationDate}
                            </td>

                            <td className="py-3 px-3.5 text-right">
                              <button
                                onClick={() => setSelectedDossierApp(app)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-6 text-slate-400">
                            No student applications currently under review matching your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SELECTED STUDENTS (By Company, Year, Role & Package) */}
      {activeTab === 'selected' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 dark:text-emerald-200">
              <p className="font-bold">Official Campus Placement Offers & Transmitted Selections</p>
              <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                These records represent verified students selected by recruiting companies, organized by recruiting enterprise, academic batch year, role designation, and CTC package.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-3.5">Student & Roll No</th>
                    <th className="py-3 px-3.5">Recruiting Enterprise</th>
                    <th className="py-3 px-3.5">Recruited Role Designation</th>
                    <th className="py-3 px-3.5">Package (CTC / Stipend)</th>
                    <th className="py-3 px-3.5">Posting Location</th>
                    <th className="py-3 px-3.5">Placement Batch</th>
                    <th className="py-3 px-3.5">Department & CGPA</th>
                    <th className="py-3 px-3.5">Selection Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredSelected.length > 0 ? (
                    filteredSelected.map((std) => (
                      <tr 
                        key={std.id} 
                        onClick={() => setSelectedSelectedStudent(std)}
                        className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">{std.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{std.rollNumber}</div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{std.companyName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{std.hiringType}</span>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-bold text-indigo-700 dark:text-indigo-400">{std.role}</div>
                          <div className="text-[10px] text-slate-400">Offer Date: {std.selectionDate}</div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            {std.packageOffered}
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {std.postingLocation || 'Bengaluru, Karnataka'}
                          </div>
                          {std.joiningDate && (
                            <div className="text-[10px] text-slate-400">Joining: {std.joiningDate}</div>
                          )}
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200">
                            Batch {std.selectionYear || (std as any).placementYear}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="text-slate-800 dark:text-slate-200 font-medium">{std.branch}</div>
                          <div className="text-slate-500 font-bold text-[11px]">CGPA: {std.cgpa || '8.5+'}</div>
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Offer Transmitted ✓</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        No recruited student records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANDIDATE FULL DOSSIER MODAL (FOR SHORTLISTED & APPLIED APPLICANTS)        */}
      {/* ========================================================================= */}
      {selectedDossierApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden shrink-0">
                  {selectedDossierApp.avatar ? (
                    <img src={selectedDossierApp.avatar} alt={selectedDossierApp.studentName} className="w-full h-full object-cover" />
                  ) : (
                    selectedDossierApp.studentName.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedDossierApp.studentName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      selectedDossierApp.status === 'shortlisted'
                        ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                        : selectedDossierApp.status === 'selected'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {selectedDossierApp.status === 'shortlisted' ? 'Shortlisted for Interview' : selectedDossierApp.status === 'selected' ? 'Selected Offer Transmitted' : 'Under Review'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    Roll: {selectedDossierApp.rollNumber} • {selectedDossierApp.branch} • CGPA {selectedDossierApp.cgpa}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDossierApp(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Drive Information */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Drive / Recruiter</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>{selectedDossierApp.companyName}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Role Designation</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                  {selectedDossierApp.jobTitle}
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Drive Match Score</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {selectedDossierApp.matchScore}% Match
                </span>
              </div>
            </div>

            {/* Skills Learned: Verified vs Self-Proclaimed */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Skills Acquisition & Verification Breakdown</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDossierApp.skillsLearned?.map((skill) => (
                  <div 
                    key={skill.name} 
                    className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                      skill.verified
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{skill.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        skill.verified
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {skill.verified ? '✓ Verified Proof' : 'Self Claimed'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {skill.howLearned}
                    </p>
                    {skill.score && (
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                        Defense Score: {skill.score}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Audited Projects */}
            {selectedDossierApp.projects && selectedDossierApp.projects.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Audited Projects ({selectedDossierApp.projects.length})</span>
                </h4>
                <div className="space-y-2">
                  {selectedDossierApp.projects.map((proj) => (
                    <div key={proj.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{proj.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                          Passed Audit
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{proj.summary}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span>Originality: <strong className="text-slate-900 dark:text-white">{proj.originalityScore}%</strong></span>
                        <span>Logic Defense: <strong className="text-indigo-600 dark:text-indigo-400">{proj.logicDefenseScore}%</strong></span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline">
                            <Github className="w-3.5 h-3.5" />
                            <span>Repository</span>
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-teal-600 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates & Verification Links */}
            {selectedDossierApp.certificates && selectedDossierApp.certificates.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Verified Credentials & Certificates</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDossierApp.certificates.map((cert) => (
                    <div key={cert.id} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{cert.title}</div>
                      <div className="text-slate-500 text-[11px]">{cert.issuer} • {cert.issueDate}</div>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:underline mt-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Certificate</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Summary */}
            {selectedDossierApp.resumeSummary && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                  Resume Summary:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedDossierApp.resumeSummary}
                </p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Placement & Audit Dossier • Digital TPO Portal
              </span>
              <button
                onClick={() => setSelectedDossierApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Student Offer Letter Details Modal */}
      {selectedSelectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Official Placement Selection Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Batch {selectedSelectedStudent.selectionYear || (selectedSelectedStudent as any).placementYear} • {selectedSelectedStudent.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">Package Offered</span>
                  <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">{selectedSelectedStudent.packageOffered}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">Offer Designation</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedSelectedStudent.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Student Name</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSelectedStudent.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Roll Number</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSelectedStudent.rollNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Department</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedSelectedStudent.branch}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Posting Location</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedSelectedStudent.postingLocation || 'Bengaluru'}</span>
                </div>
                {selectedSelectedStudent.joiningDate && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[10px] block">Expected Joining Date</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedSelectedStudent.joiningDate}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
