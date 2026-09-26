import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  Award, 
  Calendar, 
  DollarSign, 
  Users, 
  Briefcase, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X, 
  SlidersHorizontal,
  BookmarkCheck,
  BellRing,
  Info
} from 'lucide-react';
import { campusRecruitingCompaniesData } from '../../data/campusRecruitingCompaniesStore';
import { CampusRecruitingCompany, Skill, Project } from '../../types';
import { loadStudentSkills, SKILLS_UPDATED_EVENT } from '../../data/skillsStore';
import { loadProjects, PROJECTS_UPDATED_EVENT, computeCompanyAtsScore } from '../../data/projectsStore';

interface StudentCompaniesViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const StudentCompaniesView: React.FC<StudentCompaniesViewProps> = ({ onNavigateTab }) => {
  const [companies] = useState<CampusRecruitingCompany[]>(campusRecruitingCompaniesData);
  const [activeFilter, setActiveFilter] = useState<'all' | 'currently_visiting' | 'upcoming_visit' | 'past_visitor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CampusRecruitingCompany | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['rec-1', 'rec-3']);
  const [alertMessage, setAlertMessage] = useState('');
  const [studentSkills, setStudentSkills] = useState<Skill[]>(() => loadStudentSkills());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());

  useEffect(() => {
    const handleSkillsUpdated = () => setStudentSkills(loadStudentSkills());
    const handleProjectsUpdated = () => setProjects(loadProjects());

    window.addEventListener(SKILLS_UPDATED_EVENT, handleSkillsUpdated);
    window.addEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated);

    return () => {
      window.removeEventListener(SKILLS_UPDATED_EVENT, handleSkillsUpdated);
      window.removeEventListener(PROJECTS_UPDATED_EVENT, handleProjectsUpdated);
    };
  }, []);

  const companyAts = (company: CampusRecruitingCompany) =>
    computeCompanyAtsScore(company.requiredSkills, studentSkills, projects);

  const toggleBookmark = (id: string, name: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
      setAlertMessage(`Removed reminder alert for ${name}.`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      setAlertMessage(`Alert scheduled! You will receive notification 24 hours prior to ${name}'s campus session.`);
    }
    setTimeout(() => setAlertMessage(''), 3500);
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.pastTargetedRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const currentlyVisitingCount = companies.filter(c => c.status === 'currently_visiting').length;
  const upcomingCount = companies.filter(c => c.status === 'upcoming_visit').length;
  const pastCount = companies.filter(c => c.status === 'past_visitor').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner & Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
                Campus Placement Directory
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">• Institute of Technology, Jodhpur</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recruiting Companies & Campus Drives
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Explore companies visiting our campus — tracking live drives currently on campus, upcoming future visits, historical compensation records, highest LPA, median packages, and seats offered.
            </p>
          </div>

          {/* Quick campus compensation highlights */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Highest LPA</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">₹34.0 LPA</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Median Package</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400">₹16.8 LPA</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Total Recruiters</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{companies.length} Partners</span>
            </div>
          </div>
        </div>

        {/* Alert Feedback */}
        {alertMessage && (
          <div className="mt-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{alertMessage}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Companies ({companies.length})
          </button>
          <button
            onClick={() => setActiveFilter('currently_visiting')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilter === 'currently_visiting'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Currently Visiting ({currentlyVisitingCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('upcoming_visit')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilter === 'upcoming_visit'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming in Future ({upcomingCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('past_visitor')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilter === 'past_visitor'
                ? 'bg-slate-800 dark:bg-slate-700 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Past Recruiters ({pastCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, roles (e.g. SRE), skills..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Company Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanies.map((company) => {
          const isCurrent = company.status === 'currently_visiting';
          const isUpcoming = company.status === 'upcoming_visit';
          const isBookmarked = bookmarkedIds.includes(company.id);

          return (
            <div
              key={company.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-100 dark:ring-emerald-950/50 hover:shadow-md'
                  : isUpcoming
                  ? 'border-amber-200 dark:border-amber-800/80 hover:border-amber-400 hover:shadow-md'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header: Logo, Name, Visit Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-indigo-950 border border-slate-800 dark:border-indigo-800 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                      {company.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{company.name}</h2>
                        {company.website && (
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            title="Visit website"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {company.industry}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmark(company.id, company.name)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title={isBookmarked ? 'Alert Active' : 'Set Drive Alert'}
                  >
                    <BellRing className="w-4 h-4" />
                  </button>
                </div>

                {/* Company Description (Prominently visible in both Light and Dark mode) */}
                {company.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5 line-clamp-2">
                    {company.description}
                  </p>
                )}

                {/* Visit Stage Pill */}
                <div className="mb-4">
                  {isCurrent && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>{company.visitStageLabel}</span>
                    </div>
                  )}
                  {isUpcoming && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{company.visitStageLabel}</span>
                    </div>
                  )}
                  {!isCurrent && !isUpcoming && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{company.visitStageLabel}</span>
                    </div>
                  )}
                </div>

                {/* Primary Metrics Grid (Exact fields required by user) */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 mb-4 text-xs">
                  {/* Last Time Pay */}
                  <div className="col-span-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Last Time Campus Pay:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{company.lastTimePay}</strong>
                  </div>

                  {/* Highest LPA */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Highest LPA</span>
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{company.highestLpa}</span>
                  </div>

                  {/* Median Package */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Median Package</span>
                    <span className="text-sm font-black text-indigo-700 dark:text-indigo-400">{company.medianPackage}</span>
                  </div>

                  {/* Seats Offered */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Seats Offered</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{company.seatsOffered}</span>
                  </div>

                  {/* Last Time Visited */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Last Time Visited</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{company.lastTimeVisited}</span>
                  </div>
                </div>

                {/* Past Targeted Roles */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Roles Targeted:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.pastTargetedRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-100 dark:border-indigo-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Required Verified Skills */}
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Key Verified Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Per-Company ATS Score Strip */}
                {(() => {
                  const ats = companyAts(company);
                  return (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/40">
                      <div>
                        <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                          Your ATS at {company.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {ats.hasCount}/{ats.requiredCount} skills • {ats.verifiedCount} verified • {ats.projectCount} projects
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-sm font-black border whitespace-nowrap ${
                        ats.atsScore >= 85
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : ats.atsScore >= 70
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                      }`}>
                        {ats.atsScore}%
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Eligibility: Min <strong className="text-slate-800 dark:text-slate-200">{company.minCgpa}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCompany(company)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 hover:text-indigo-800 dark:hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Record</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  {(isCurrent || isUpcoming) && onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('internships')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apply Drive</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-indigo-950 border border-slate-800 dark:border-indigo-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedCompany.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCompany.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-700">
                      {selectedCompany.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCompany.industry} • Campus Placement Profile</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCompany(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5">
              {/* Detailed Description in Modal */}
              {selectedCompany.description && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    About {selectedCompany.name}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {selectedCompany.description}
                  </p>
                </div>
              )}

              {/* Current / Upcoming Drive Details */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Drive Schedule & Status:</span>
                  </span>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{selectedCompany.currentOrNextDriveDate}</span>
                </div>
                <p className="text-xs text-indigo-900 dark:text-indigo-200">{selectedCompany.visitStageLabel}</p>
                {selectedCompany.driveVenue && (
                  <div className="text-[11px] text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Venue: {selectedCompany.driveVenue}</span>
                  </div>
                )}
                {selectedCompany.tpoCoordinator && (
                  <div className="text-[11px] text-indigo-800 dark:text-indigo-300">
                    TPO Coordinator: <strong>{selectedCompany.tpoCoordinator}</strong>
                  </div>
                )}
              </div>

              {/* Requested Metrics Summary Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Campus Compensation & Intake Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase block">Highest LPA</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{selectedCompany.highestLpa}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase block">Median Package</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{selectedCompany.medianPackage}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase block">Avg Package</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">{selectedCompany.averagePackage}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase block">Seats Offered</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedCompany.seatsOffered}</span>
                  </div>
                </div>
              </div>

              {/* Historical Hiring Track Record */}
              {selectedCompany.hiringHistory && selectedCompany.hiringHistory.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Past Campus Hiring Track Record (Annual Breakdown)
                  </h4>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                        <tr>
                          <th className="py-2.5 px-3">Batch Year</th>
                          <th className="py-2.5 px-3">Offers Given</th>
                          <th className="py-2.5 px-3">Highest LPA</th>
                          <th className="py-2.5 px-3">Median LPA</th>
                          <th className="py-2.5 px-3">Profiles Selected</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {selectedCompany.hiringHistory.map((h) => (
                          <tr key={h.year}>
                            <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{h.year}</td>
                            <td className="py-2 px-3 font-semibold text-emerald-600 dark:text-emerald-400">{h.offersCount} Students</td>
                            <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">{h.highestLpa}</td>
                            <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{h.medianLpa}</td>
                            <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{h.roles.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Eligible Branches & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    Eligible Branches & Criteria
                  </span>
                  <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                    <div>Min CGPA: <strong className="text-slate-900 dark:text-white">{selectedCompany.minCgpa}</strong></div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Branches: {selectedCompany.eligibleBranches.join(' • ')}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    Required Verified Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompany.requiredSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Per-Company ATS Breakdown */}
              <div className="mt-4 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/40">
                {(() => {
                  const ats = companyAts(selectedCompany);
                  return (
                    <>
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div>
                          <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                            Your ATS at {selectedCompany.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Computed from this company's {ats.requiredCount} required skills vs your verified skill profile.
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-lg font-black border whitespace-nowrap ${
                          ats.atsScore >= 85
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : ats.atsScore >= 70
                            ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        }`}>
                          {ats.atsScore}% ATS
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                          <div className="text-base font-black text-slate-900 dark:text-white">
                            {ats.hasCount}<span className="text-[10px] font-semibold text-slate-400">/{ats.requiredCount}</span>
                          </div>
                          <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skills Owned</div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                          <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{ats.verifiedCount}</div>
                          <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verified</div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                          <div className="text-base font-black text-slate-900 dark:text-white">{ats.projectCount}</div>
                          <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill Projects</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              {(selectedCompany.status === 'currently_visiting' || selectedCompany.status === 'upcoming_visit') && onNavigateTab && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompany(null);
                    onNavigateTab('internships');
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Go to On-Campus Drives & Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
