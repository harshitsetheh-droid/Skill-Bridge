import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Users, 
  TrendingUp, 
  UserPlus, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Award, 
  Search, 
  ChevronRight, 
  Filter,
  Plus,
  Send,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { campusRecruitingCompaniesData } from '../../data/campusRecruitingCompaniesStore';
import { CampusRecruitingCompany } from '../../types';
import { addInternship } from '../../data/jobsStore';

export const CompanyEngagementView: React.FC = () => {
  const [companies, setCompanies] = useState<CampusRecruitingCompany[]>(campusRecruitingCompaniesData);
  const [activeTab, setActiveTab] = useState<'all' | 'currently_visiting' | 'upcoming_visit' | 'past_visitor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CampusRecruitingCompany | null>(null);
  const [selectedDossierYear, setSelectedDossierYear] = useState<string>('');
  
  // Track companies for which a job has been published
  const [publishedCompanyJobIds, setPublishedCompanyJobIds] = useState<Set<string>>(new Set(['rec-1']));

  const handleOpenDossier = (company: CampusRecruitingCompany) => {
    setSelectedCompany(company);
    if (company.hiringHistory && company.hiringHistory.length > 0) {
      setSelectedDossierYear(company.hiringHistory[0].year);
    } else {
      setSelectedDossierYear('');
    }
  };
  
  // Post a Job for Students Modal State
  const [postJobCompany, setPostJobCompany] = useState<CampusRecruitingCompany | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobStipend, setJobStipend] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobDriveStartDate, setJobDriveStartDate] = useState('');
  const [jobDriveEndDate, setJobDriveEndDate] = useState('');
  const [jobBranches, setJobBranches] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Send Invitation to Past Company Modal State
  const [sendInviteCompany, setSendInviteCompany] = useState<CampusRecruitingCompany | null>(null);
  const [inviteDriveSession, setInviteDriveSession] = useState('Autumn Campus Drive 2026-27');
  const [inviteTargetBatch, setInviteTargetBatch] = useState('2026 Batch (B.Tech CSE, IT, ECE, AI&DS)');
  const [inviteExpectedPackage, setInviteExpectedPackage] = useState('₹14.0 LPA - ₹26.0 LPA');
  const [inviteCustomNote, setInviteCustomNote] = useState('');

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setToastMessage(`Recruitment partnership invitation dispatched to ${inviteEmail}.`);
    setIsInviteOpen(false);
    setInviteEmail('');
    setInviteName('');
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleOpenSendInvitation = (company: CampusRecruitingCompany) => {
    setSendInviteCompany(company);
    setInviteCustomNote(`Dear Campus Hiring Team at ${company.name},\n\nMBM University, Jodhpur formally invites your esteemed organization for the upcoming ${inviteDriveSession}. Our 2026 graduating batch boasts rigorous verified code defenses and high industry readiness.`);
  };

  const handleConfirmSendCompanyInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendInviteCompany) return;

    setToastMessage(`✓ Placement drive invitation successfully sent to ${sendInviteCompany.name}! Direct request transmitted to recruiter relations.`);
    setSendInviteCompany(null);
    setTimeout(() => setToastMessage(''), 5000);
  };

  const handleOpenPostJob = (company: CampusRecruitingCompany) => {
    setPostJobCompany(company);
    setJobTitle(company.pastTargetedRoles[0] || `${company.name} Campus Trainee`);
    setJobStipend(company.lastTimePay.includes('Internship:') ? company.lastTimePay.split('Internship:')[1].trim() : '₹50,000 / month');
    setJobSkills(company.requiredSkills.join(', '));
    setJobBranches(company.eligibleBranches.join(', '));
    
    // Parse dates or set defaults
    const dateParts = company.currentOrNextDriveDate.split(' - ');
    setJobDriveStartDate(dateParts[0] || '2026-11-12');
    setJobDriveEndDate(dateParts[1] || '2026-11-15');
    setJobDescription(`Official on-campus recruitment drive for ${company.name} at MBM University, Jodhpur. Selected candidates join the core engineering team with competitive package and PPO prospects.`);
  };

  const handleConfirmPostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postJobCompany || !jobTitle.trim()) return;

    const parsedSkills = jobSkills.split(',').map(s => s.trim()).filter(Boolean);

    addInternship({
      title: jobTitle,
      company: postJobCompany.name,
      location: 'On-Campus / Bengaluru Hybrid',
      type: 'Internship',
      stipend: jobStipend || '₹50,000 / month',
      matchScore: 92,
      requiredSkills: parsedSkills.length > 0 ? parsedSkills : postJobCompany.requiredSkills,
      preferredSkills: ['Problem Solving', 'System Design'],
      missingSkills: [],
      description: jobDescription,
      deadline: jobDriveEndDate || '2026-11-20',
      campusType: 'on_campus',
      targetUniversity: 'MBM University, Jodhpur',
      driveStartDate: jobDriveStartDate,
      driveEndDate: jobDriveEndDate,
      tpoApprovalStatus: 'approved'
    });

    // Mark as published
    setPublishedCompanyJobIds(prev => new Set(prev).add(postJobCompany.id));

    setToastMessage(`✓ Successfully published On-Campus Drive job "${jobTitle}" for ${postJobCompany.name}! It is now marked Published and visible under "Internships & Jobs → On-Campus Drives".`);
    setPostJobCompany(null);
    setTimeout(() => setToastMessage(''), 5500);
  };

  // Filter companies according to active tab
  const filteredCompanies = companies.filter((c) => {
    let matchesTab = true;
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'currently_visiting') {
      matchesTab = c.status === 'currently_visiting';
    } else if (activeTab === 'upcoming_visit') {
      matchesTab = c.status === 'upcoming_visit';
    } else if (activeTab === 'past_visitor') {
      matchesTab = c.status === 'past_visitor';
    }

    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pastTargetedRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const currentlyVisitingCount = companies.filter(c => c.status === 'currently_visiting').length;
  const upcomingCount = companies.filter(c => c.status === 'upcoming_visit').length;
  const pastCount = companies.filter(c => c.status === 'past_visitor').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-[11px] font-bold uppercase tracking-wider">
              TPO Placement Administration
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">• Currently Visiting & Scheduled Future Drives</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Recruiting Companies & Campus Engagement
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Live and scheduled enterprise recruiters visiting our campus. Inspect offers issued, highest package (LPA), median compensation, and historical roles targeted.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Recruiter</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-semibold animate-fade-in flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage('')}
            className="text-teal-700 dark:text-teal-300 font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Currently On-Campus</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{currentlyVisitingCount} Companies</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Live assessments & PIs in labs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Future / Scheduled</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{upcomingCount} Drives</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Scheduled for coming weeks</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Highest Campus LPA</span>
            <Award className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">₹34.0 LPA</div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">AlphaCloud / Google Ptrs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Median Campus Package</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₹16.8 LPA</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Across verified offers</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Recruiter Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Recruiting Partners ({companies.length})
          </button>
          <button
            onClick={() => setActiveTab('currently_visiting')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'currently_visiting'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Currently Visiting ({currentlyVisitingCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming_visit')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upcoming_visit'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Future Visits ({upcomingCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('past_visitor')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'past_visitor'
                ? 'bg-purple-700 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Past Recruiting Partners ({pastCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, targeted profiles, skills..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Partner Companies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanies.map((company) => {
          const isCurrent = company.status === 'currently_visiting';
          const isUpcoming = company.status === 'upcoming_visit';
          const isPast = company.status === 'past_visitor';
          const isJobPublished = publishedCompanyJobIds.has(company.id);

          return (
            <div
              key={company.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all flex flex-col justify-between ${
                isCurrent 
                  ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-400/20' 
                  : isPast
                  ? 'border-purple-200/80 dark:border-purple-900/60 hover:border-purple-400'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
              }`}
            >
              <div>
                {/* Top Badge & Company Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {company.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 dark:text-white text-base">
                          {company.name}
                        </h2>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-teal-700 dark:hover:text-teal-400"
                            title="Visit Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {company.industry}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : isPast
                      ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      : 'bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}>
                    {isCurrent ? 'Live On Campus' : isPast ? 'Past Partner Recruiter' : 'Future Scheduled Drive'}
                  </span>
                </div>

                {/* Visit Window / Stage info */}
                <div className="mb-4">
                  <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    isCurrent
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                      : isPast
                      ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200'
                      : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      ) : isPast ? (
                        <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span>{company.visitStageLabel}</span>
                    </div>
                    {company.driveVenue && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">
                        {company.driveVenue.split('&')[0].trim()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Metrics Required by User:
                    - कितने ऑफर्स दिए हैं (Offers Given / Seats Offered)
                    - मैक्सिमम कितना गया है / हाईएस्ट एलपीए क्या थी (Highest LPA)
                    - मीडियन पैकेज क्या था (Median Package)
                    - पिछले साल क्या पे किया (Last Time Campus Pay)
                    - पिछले साल क्या-क्या टारगेट करी (Targeted Profiles)
                */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 mb-4 text-xs">
                  {/* Last Time Campus Pay */}
                  <div className="col-span-2 pb-2 border-b border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Last Campus Drive Pay:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{company.lastTimePay}</strong>
                  </div>

                  {/* Offers Given / Seats Offered */}
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Offers Issued</span>
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{company.seatsOffered}</span>
                  </div>

                  {/* Highest LPA */}
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Highest LPA</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{company.highestLpa}</span>
                  </div>

                  {/* Median Package */}
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Median Package</span>
                    <span className="text-sm font-black text-indigo-700 dark:text-indigo-400">{company.medianPackage}</span>
                  </div>

                  {/* Last Time Visited */}
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Last Visited</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{company.lastTimeVisited}</span>
                  </div>
                </div>

                {/* Profiles Targeted Last Year / Currently */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Targeted Profiles & Roles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.pastTargetedRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[11px] font-semibold border border-teal-100 dark:border-teal-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Required Skills */}
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Required Verified Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                  Eligible: Min <strong>{company.minCgpa}</strong> • {company.eligibleBranches.length} Branches
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {isPast ? (
                    <button
                      onClick={() => handleOpenSendInvitation(company)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send an Invitation</span>
                    </button>
                  ) : isJobPublished ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Published</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenPostJob(company)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Post a Job for Students</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenDossier(company)}
                    className="text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1 cursor-pointer py-1"
                  >
                    <span>Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* POST A JOB FOR STUDENTS MODAL (DIRECT USER REQUIREMENT)                   */}
      {/* ========================================================================= */}
      {postJobCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Post On-Campus Drive Job for Students
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Publishing for {postJobCompany.name} • On-Campus Drives section
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPostJobCompany(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPostJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Designation / Role Title:
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Software Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stipend / Package:
                  </label>
                  <input
                    type="text"
                    value={jobStipend}
                    onChange={(e) => setJobStipend(e.target.value)}
                    placeholder="e.g. ₹55,000 / month (or ₹16.0 LPA)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Drive Application Deadline:
                  </label>
                  <input
                    type="text"
                    value={jobDriveEndDate}
                    onChange={(e) => setJobDriveEndDate(e.target.value)}
                    placeholder="e.g. 2026-11-15"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Required Skills (comma-separated):
                </label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="React, Node.js, SQL, Docker..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Eligible Branches:
                </label>
                <input
                  type="text"
                  value={jobBranches}
                  onChange={(e) => setJobBranches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Description & Campus Drive Notes:
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>
                  This listing will immediately appear under the student's <strong>"Internships & Jobs → On-Campus Drives"</strong> tab with <strong>TPO Approved</strong> status.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPostJobCompany(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Publish Job for Students</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Drive Dossier & Historical Breakdown Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedCompany.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCompany.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-bold uppercase">
                      {selectedCompany.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCompany.industry} • TPO Placement Dossier</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedCompany.status === 'past_visitor' && (
                  <button
                    onClick={() => {
                      const comp = selectedCompany;
                      setSelectedCompany(null);
                      handleOpenSendInvitation(comp);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send an Invitation</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-5 text-xs">
              {/* Drive Schedule Banner */}
              <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span>Active Drive Window & Operations:</span>
                  </span>
                  <span className="font-semibold text-teal-800 dark:text-teal-300">{selectedCompany.currentOrNextDriveDate}</span>
                </div>
                <p className="text-teal-900 dark:text-teal-200">{selectedCompany.visitStageLabel}</p>
                {selectedCompany.driveVenue && (
                  <div className="text-[11px] text-teal-800 dark:text-teal-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span>Allocated Venue: {selectedCompany.driveVenue}</span>
                  </div>
                )}
                {selectedCompany.tpoCoordinator && (
                  <div className="text-[11px] text-teal-800 dark:text-teal-300">
                    Designated TPO Coordinator: <strong>{selectedCompany.tpoCoordinator}</strong>
                  </div>
                )}
              </div>

              {/* Core Requested Stats Grid */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Campus Placement & Intake Historical Records
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Highest LPA</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">{selectedCompany.highestLpa}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Median Package</span>
                    <span className="text-base font-black text-indigo-700 dark:text-indigo-400">{selectedCompany.medianPackage}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Last Time Pay</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">{selectedCompany.lastTimePay.split('•')[0]}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Total Offers</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{selectedCompany.seatsOffered.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Profiles Targeted Last Year / Currently */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Historical & Active Profiles Targeted:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.pastTargetedRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200 text-xs font-semibold border border-teal-200 dark:border-teal-800"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Year by year Breakdown & Recruited Students */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Year-Wise Hiring & Offers Breakdown:
                  </h4>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    Click any year to view recruited students
                  </span>
                </div>
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      <tr>
                        <th className="py-2.5 px-3">Batch / Year</th>
                        <th className="py-2.5 px-3">Offers Issued</th>
                        <th className="py-2.5 px-3">Highest CTC</th>
                        <th className="py-2.5 px-3">Median CTC</th>
                        <th className="py-2.5 px-3">Targeted Roles</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedCompany.hiringHistory?.map((h) => {
                        const isCurrentYear = (selectedDossierYear === h.year) || (!selectedDossierYear && h.year === selectedCompany.hiringHistory?.[0]?.year);
                        return (
                          <tr 
                            key={h.year} 
                            onClick={() => setSelectedDossierYear(h.year)}
                            className={`cursor-pointer transition-colors ${
                              isCurrentYear 
                                ? 'bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {isCurrentYear && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                              <span>{h.year}</span>
                            </td>
                            <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{h.offersCount} Offers</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{h.highestLpa}</td>
                            <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400 font-medium">{h.medianLpa}</td>
                            <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 text-[11px]">{h.roles.join(', ')}</td>
                            <td className="py-2.5 px-3 text-right">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                isCurrentYear
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}>
                                {isCurrentYear ? 'Viewing Candidates' : 'View Students'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Recruited Students Detail Section */}
                {(() => {
                  const activeYearData = selectedCompany.hiringHistory?.find(
                    h => h.year === (selectedDossierYear || selectedCompany.hiringHistory?.[0]?.year)
                  ) || selectedCompany.hiringHistory?.[0];
                  
                  const studentsList = activeYearData?.recruitedStudents || [];

                  return (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-700">
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Students Recruited in {activeYearData?.year} ({selectedCompany.name})</span>
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Verified institutional placement records with role designation and package CTC.
                          </p>
                        </div>

                        {/* Interactive Year Switcher Badges */}
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Switch Year:</span>
                          {selectedCompany.hiringHistory?.map((h) => {
                            const isSelected = (selectedDossierYear === h.year) || (!selectedDossierYear && h.year === selectedCompany.hiringHistory?.[0]?.year);
                            return (
                              <button
                                key={h.year}
                                type="button"
                                onClick={() => setSelectedDossierYear(h.year)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                                }`}
                              >
                                {h.year}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recruited Students Table */}
                      {studentsList.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                              <tr>
                                <th className="py-2 px-2.5">Student & Roll No</th>
                                <th className="py-2 px-2.5">Department</th>
                                <th className="py-2 px-2.5">Recruited Role</th>
                                <th className="py-2 px-2.5">Package (CTC)</th>
                                <th className="py-2 px-2.5">Type</th>
                                <th className="py-2 px-2.5">CGPA</th>
                                <th className="py-2 px-2.5">Verified Skills</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-850">
                              {studentsList.map((std) => (
                                <tr key={std.id} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors">
                                  <td className="py-2.5 px-2.5">
                                    <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                                    <div className="text-[10px] font-mono text-slate-500">{std.rollNumber}</div>
                                  </td>
                                  <td className="py-2.5 px-2.5 text-slate-700 dark:text-slate-300">{std.branch}</td>
                                  <td className="py-2.5 px-2.5 font-semibold text-indigo-700 dark:text-indigo-400">{std.role}</td>
                                  <td className="py-2.5 px-2.5 font-black text-emerald-600 dark:text-emerald-400">{std.packageOffered}</td>
                                  <td className="py-2.5 px-2.5">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                                      {std.hireType}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-2.5 font-bold text-slate-800 dark:text-slate-200">{std.cgpa}</td>
                                  <td className="py-2.5 px-2.5">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                      {std.verifiedSkills.map((sk) => (
                                        <span key={sk} className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-semibold border border-emerald-200 dark:border-emerald-800">
                                          {sk}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
                          <p className="font-semibold text-xs">No individual student profiles digitized for batch {activeYearData?.year}.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Recorded aggregate offers count: {activeYearData?.offersCount || 0} with highest package {activeYearData?.highestLpa || 'N/A'}.</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Required Skills Stack */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Verified Skill Stack Demanded:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCompany.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {selectedCompany.status === 'past_visitor' ? (
                <button
                  onClick={() => {
                    const companyToInvite = selectedCompany;
                    setSelectedCompany(null);
                    handleOpenSendInvitation(companyToInvite);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Recruitment Invitation</span>
                </button>
              ) : publishedCompanyJobIds.has(selectedCompany.id) ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Job Published for Students</span>
                </span>
              ) : (
                <button
                  onClick={() => {
                    const companyToPost = selectedCompany;
                    setSelectedCompany(null);
                    handleOpenPostJob(companyToPost);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Post a Job for Students</span>
                </button>
              )}

              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Send Campus Recruitment Invitation Modal */}
      {sendInviteCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                  {sendInviteCompany.logo}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Send Drive Invitation: {sendInviteCompany.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">Official Placement Drive Proposal</p>
                </div>
              </div>
              <button
                onClick={() => setSendInviteCompany(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSendCompanyInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Placement Drive Session:</label>
                <input
                  type="text"
                  value={inviteDriveSession}
                  onChange={(e) => setInviteDriveSession(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Batches:</label>
                  <input
                    type="text"
                    value={inviteTargetBatch}
                    onChange={(e) => setInviteTargetBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expected CTC Band:</label>
                  <input
                    type="text"
                    value={inviteExpectedPackage}
                    onChange={(e) => setInviteExpectedPackage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Custom Invitation Note & Dossier Summary:</label>
                <textarea
                  rows={4}
                  value={inviteCustomNote}
                  onChange={(e) => setInviteCustomNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-teal-900 dark:text-teal-200">
                  Transmits institutional readiness dossier, verified coding credentials, and placement window slots directly to {sendInviteCompany.name}&apos;s University Relations desk.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSendInviteCompany(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Recruitment Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recruiter Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Invite Campus Recruiter</h3>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recruiter / HR Name:</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Corporate Email:</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="campus-hiring@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dispatches an official invitation with a pre-configured employer portal link and verified student readiness overview for MBM University, Jodhpur.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
