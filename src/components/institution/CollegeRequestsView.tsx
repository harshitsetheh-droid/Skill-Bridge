import React, { useState, useEffect } from 'react';
import { 
  loadDriveRequests, 
  updateDriveRequestStatus, 
  CampusDriveRequest, 
  DRIVE_REQUESTS_UPDATED_EVENT 
} from '../../data/driveRequestsStore';
import {
  loadCollegeApproachRequests,
  addCollegeApproachRequest,
  markProposalJobPublished,
  CollegeApproachRequest,
  COLLEGE_APPROACH_UPDATED_EVENT
} from '../../data/collegeApproachStore';
import { updateJobTpoStatus, addInternship } from '../../data/jobsStore';
import { 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Check, 
  X, 
  GraduationCap, 
  AlertCircle,
  Briefcase,
  MapPin,
  Banknote,
  Send,
  Inbox,
  Info,
  Plus,
  Users,
  ShieldCheck,
  Mail,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CollegeRequestsView: React.FC = () => {
  // Main Tab: 'outgoing' (College to Companies) vs 'incoming' (Companies to College)
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');

  // Incoming Drives (from Companies)
  const [incomingRequests, setIncomingRequests] = useState<CampusDriveRequest[]>(() => loadDriveRequests());
  const [incomingFilter, setIncomingFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [incomingSearch, setIncomingSearch] = useState('');
  const [remarksInput, setRemarksInput] = useState<Record<string, string>>({});

  // Outgoing Proposals (to Companies)
  const [outgoingRequests, setOutgoingRequests] = useState<CollegeApproachRequest[]>(() => loadCollegeApproachRequests());
  const [outgoingFilter, setOutgoingFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [outgoingSearch, setOutgoingSearch] = useState('');

  // New Proposal Modal (College approaching Company)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetCompany, setTargetCompany] = useState('TechNova Solutions');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalType, setProposalType] = useState<CollegeApproachRequest['proposalType']>('Campus Placement Drive');
  const [targetBatch, setTargetBatch] = useState('Class of 2026 (Final Year)');
  const [targetBranches, setTargetBranches] = useState('Computer Science & Engg, Information Technology, AI & Data Science');
  const [studentCount, setStudentCount] = useState(145);
  const [avgCgpa, setAvgCgpa] = useState('8.3 / 10.0');
  const [skillTags, setSkillTags] = useState('React.js, TypeScript, Node.js, Python, Docker, SQL');
  const [proposedDates, setProposedDates] = useState('Nov 16 - Nov 19, 2026');
  const [proposedMode, setProposedMode] = useState<CollegeApproachRequest['proposedMode']>('On-Campus (Offline)');
  const [expectedPackage, setExpectedPackage] = useState('₹8.0 - ₹16.0 LPA');
  const [coverLetter, setCoverLetter] = useState(
    'Dear Campus Talent Acquisition Team,\n\nWe cordially invite your esteemed organization for our upcoming campus recruitment cycle. Our 2026 graduating students have completed project integrity and code logic verification on SkillBridge, demonstrating high autonomy in full-stack and systems engineering.'
  );

  // Modal: Post a Job for Students from an Approved Drive Request
  const [postingJobForProposal, setPostingJobForProposal] = useState<CollegeApproachRequest | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<'Internship' | 'Full-time' | 'Contract'>('Internship');
  const [jobStipend, setJobStipend] = useState('');
  const [jobLocation, setJobLocation] = useState('Bengaluru / Hybrid');
  const [jobDeadline, setJobDeadline] = useState('Nov 10, 2026');
  const [jobDriveDates, setJobDriveDates] = useState('');
  const [jobRequiredSkills, setJobRequiredSkills] = useState('');
  const [jobPreferredSkills, setJobPreferredSkills] = useState('Git, Linux, CI/CD');
  const [jobDescription, setJobDescription] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleIncomingUpdate = () => {
      setIncomingRequests(loadDriveRequests());
    };
    const handleOutgoingUpdate = () => {
      setOutgoingRequests(loadCollegeApproachRequests());
    };

    window.addEventListener(DRIVE_REQUESTS_UPDATED_EVENT, handleIncomingUpdate);
    window.addEventListener(COLLEGE_APPROACH_UPDATED_EVENT, handleOutgoingUpdate);

    return () => {
      window.removeEventListener(DRIVE_REQUESTS_UPDATED_EVENT, handleIncomingUpdate);
      window.removeEventListener(COLLEGE_APPROACH_UPDATED_EVENT, handleOutgoingUpdate);
    };
  }, []);

  // Filter Incoming
  const filteredIncoming = incomingRequests.filter((req) => {
    const matchesStatus = incomingFilter === 'all' || req.status === incomingFilter;
    const matchesSearch = 
      req.companyName.toLowerCase().includes(incomingSearch.toLowerCase()) ||
      req.jobTitle.toLowerCase().includes(incomingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter Outgoing
  const filteredOutgoing = outgoingRequests.filter((req) => {
    const matchesStatus = outgoingFilter === 'all' || req.status === outgoingFilter;
    const matchesSearch = 
      req.companyName.toLowerCase().includes(outgoingSearch.toLowerCase()) ||
      req.title.toLowerCase().includes(outgoingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'pending').length;
  const pendingOutgoingCount = outgoingRequests.filter((r) => r.status === 'pending').length;
  const approvedOutgoingCount = outgoingRequests.filter((r) => r.status === 'approved').length;

  const handleApproveIncoming = (req: CampusDriveRequest) => {
    const defaultNote = remarksInput[req.id] || 'Approved by Head TPO. Lab 2 booked for technical assessments.';
    updateDriveRequestStatus(req.id, 'approved', defaultNote);
    updateJobTpoStatus(req.universityName, req.jobTitle, 'approved');

    setToastMessage(`✓ Approved campus recruitment drive for "${req.jobTitle}" by ${req.companyName}! Now visible to enrolled students.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleRejectIncoming = (req: CampusDriveRequest) => {
    const defaultNote = remarksInput[req.id] || 'Schedule conflict with mid-semester examinations.';
    updateDriveRequestStatus(req.id, 'rejected', defaultNote);
    updateJobTpoStatus(req.universityName, req.jobTitle, 'rejected');

    setToastMessage(`Drive request from ${req.companyName} declined.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleSendNewProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim()) return;

    addCollegeApproachRequest({
      collegeId: 'COL-ITJ',
      collegeName: 'Institute of Technology, Jodhpur',
      tpoName: 'Dr. R. K. Sharma (Head TPO)',
      tpoEmail: 'tpo@itj.ac.in',
      tpoPhone: '+91 98290 12345',
      companyId: targetCompany === 'TechNova Solutions' ? 'COM1' : 'COM2',
      companyName: targetCompany,
      title: proposalTitle.trim(),
      proposalType,
      targetBatch,
      targetBranches: targetBranches.split(',').map(b => b.trim()).filter(Boolean),
      eligibleStudentCount: Number(studentCount) || 120,
      avgCgpa,
      verifiedSkillsHighlights: skillTags.split(',').map(s => s.trim()).filter(Boolean),
      proposedDriveDates: proposedDates,
      proposedMode,
      expectedPackageRange: expectedPackage,
      campusFacilities: [
        '250-Node Dedicated Computer Center with High-Speed Leased Line',
        'Auditorium (450 Seating) with HD Projection & AV for Pre-Placement Talk',
        '8 Interview Cubicles & Discussion Rooms',
        'Proctored AI Assessment Lab Ready'
      ],
      coverLetter: coverLetter.trim()
    });

    setToastMessage(`✓ Placement drive proposal successfully dispatched to ${targetCompany}! Awaiting company review.`);
    setIsModalOpen(false);
    setProposalTitle('');
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Open "Post a Job for Students" modal prefilled with proposal details
  const handleOpenPostJobModal = (proposal: CollegeApproachRequest) => {
    setPostingJobForProposal(proposal);
    
    // Clean default title
    const cleanTitle = proposal.title
      .replace(/^proposal for /i, '')
      .replace(/^invitation for /i, '')
      .replace(/^proposal: /i, '');
    setJobTitle(cleanTitle || `${proposal.companyName} Campus Software Engineer`);
    
    setJobType(proposal.proposalType.includes('Internship') ? 'Internship' : 'Full-time');
    setJobStipend(proposal.expectedPackageRange || '₹50,000 / month');
    setJobLocation(proposal.proposedMode.includes('Offline') ? 'On-Campus / Hybrid' : 'Remote / Hybrid');
    setJobDeadline(proposal.confirmedDriveDates ? proposal.confirmedDriveDates.split('-')[0].trim() : 'Nov 10, 2026');
    setJobDriveDates(proposal.confirmedDriveDates || proposal.proposedDriveDates);
    setJobRequiredSkills(proposal.verifiedSkillsHighlights.join(', '));
    setJobPreferredSkills('Git, Linux, CI/CD');
    setJobDescription(
      `Exclusive on-campus recruitment drive by ${proposal.companyName} for students of ${proposal.collegeName}.\n\nTarget Batch: ${proposal.targetBatch}\nTarget Branches: ${proposal.targetBranches.join(', ')}\n\nCandidates must have verified skills and project submissions on SkillBridge for all mandatory required skills.`
    );
  };

  // Confirm posting job to student portal
  const handleConfirmPublishJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postingJobForProposal) return;

    const dates = jobDriveDates.split('-');
    const startDate = dates[0]?.trim() || '2026-11-12';
    const endDate = dates[1]?.trim() || '2026-11-15';

    const createdJob = addInternship({
      title: jobTitle.trim(),
      company: postingJobForProposal.companyName,
      location: jobLocation.trim(),
      type: jobType,
      stipend: jobStipend.trim(),
      matchScore: 94,
      requiredSkills: jobRequiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: jobPreferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      missingSkills: [],
      description: jobDescription.trim(),
      deadline: jobDeadline.trim(),
      campusType: 'on_campus',
      targetUniversity: postingJobForProposal.collegeName,
      driveStartDate: startDate,
      driveEndDate: endDate,
      tpoApprovalStatus: 'approved'
    });

    markProposalJobPublished(postingJobForProposal.id, createdJob.id);

    setToastMessage(`✓ Published On-Campus Drive job for "${jobTitle}" by ${postingJobForProposal.companyName}! Enrolled students can now view and apply under "Internships & Jobs -> On-Campus Drives".`);
    setPostingJobForProposal(null);
    setTimeout(() => setToastMessage(null), 5500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                TPO Placement Drives & Company Outreach
              </h1>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Institute of Technology, Jodhpur</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track proposals your college dispatches to companies, approve company requests, and post approved recruitment drives directly to students.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Approach New Company</span>
          </button>
        </div>

        {/* 2 Main Tabs: Outgoing (Sent to Companies) vs Incoming (From Companies) */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-1 sm:flex-initial justify-center ${
              activeTab === 'outgoing'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Send className="w-4 h-4 text-indigo-500" />
            <span>Our Outgoing Proposals (Sent to Companies)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
              {outgoingRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-1 sm:flex-initial justify-center ${
              activeTab === 'incoming'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4 text-indigo-500" />
            <span>Incoming Company Drives (Received)</span>
            {pendingIncomingCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                {pendingIncomingCount} Pending
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OUTGOING PROPOSALS TAB (College Approaching Companies)                     */}
      {/* ========================================================================= */}
      {activeTab === 'outgoing' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approved by Companies</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{approvedOutgoingCount}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Confirmed recruitment drives & visit slots</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Awaiting Company Decision</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingOutgoingCount}</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Proposals under review by corporate HR teams</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Companies Approached</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{outgoingRequests.length}</span>
                <Building2 className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Active campus partnership dialogues</span>
            </div>
          </div>

          {/* Filter and Search */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-full sm:w-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOutgoingFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                    outgoingFilter === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={outgoingSearch}
                onChange={(e) => setOutgoingSearch(e.target.value)}
                placeholder="Search target company or proposal title..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Outgoing Cards List */}
          <div className="space-y-4">
            {filteredOutgoing.map((req) => {
              const isApproved = req.status === 'approved';
              const isPending = req.status === 'pending';

              return (
                <div
                  key={req.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all space-y-4 ${
                    isApproved
                      ? 'border-emerald-200/90 dark:border-emerald-900/60 ring-1 ring-emerald-400/20'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{req.id}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Submitted {req.submittedAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {req.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        <Building2 className="w-4 h-4" />
                        <span>Approached Company: <strong>{req.companyName}</strong></span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isApproved && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Approved by Company ({req.companyName})</span>
                          </span>
                          {!req.isJobPublishedToStudents ? (
                            <button
                              onClick={() => handleOpenPostJobModal(req)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              <Briefcase className="w-3.5 h-3.5" />
                              <span>Post a Job for Students</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                              ✓ Live in Student On-Campus Drives
                            </span>
                          )}
                        </div>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Awaiting Company Review</span>
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Declined by Company</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PROMINENT REAL-TIME APPROVAL BANNER IF APPROVED BY COMPANY */}
                  {isApproved && (
                    <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Company Accepted! Campus Recruitment Drive Confirmed</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-900/40">
                        <div>
                          <span className="font-semibold text-emerald-800 dark:text-emerald-400 block">Confirmed Drive Dates:</span>
                          <span className="font-bold">{req.confirmedDriveDates || req.proposedDriveDates}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-emerald-800 dark:text-emerald-400 block">Company HR Lead:</span>
                          <span className="font-bold">{req.hrContactPerson || 'Talent Acquisition Team'}</span>
                        </div>
                      </div>
                      {req.companyRemarks && (
                        <div className="pt-1">
                          <span className="font-semibold text-emerald-800 dark:text-emerald-400 block">Official Company Remarks:</span>
                          <span className="italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg block mt-0.5 border border-emerald-200/60 dark:border-emerald-800/40">
                            "{req.companyRemarks}"
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Logistics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Proposed Window</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {req.proposedDriveDates}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Talent Pool Size</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        {req.eligibleStudentCount} Students ({req.avgCgpa})
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Mode & Format</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {req.proposedMode}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Target Package</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {req.expectedPackageRange}
                      </span>
                    </div>
                  </div>

                  {/* Skills Highlights */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Audited Skill Stack:
                    </span>
                    {req.verifiedSkillsHighlights.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-bold text-[11px]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Cover Letter excerpt */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/80 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">TPO Invitation Pitch:</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                      {req.coverLetter}
                    </p>
                  </div>

                  {/* ========================================================================= */}
                  {/* USER INTENT KEY REQUIREMENT: POST A JOB FOR STUDENTS ACTION ROW           */}
                  {/* ========================================================================= */}
                  {isApproved && (
                    <div className="pt-2">
                      {req.isJobPublishedToStudents ? (
                        <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>
                              ✓ Live on Student Portal: Included under <strong>"Internships & Jobs → On-Campus Drives"</strong> for your students!
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenPostJobModal(req)}
                            className="px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white/80 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Edit / Re-publish Listing</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-indigo-50/70 to-blue-50 dark:from-indigo-950/60 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                                Company Approved
                              </span>
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                Publish On-Campus Drive Job for Students
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                              Post this approved drive so your students can see and apply directly under their <strong>Internships & Jobs → On-Campus Drives</strong> section.
                            </p>
                          </div>
                          <button
                            onClick={() => handleOpenPostJobModal(req)}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all hover:shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Post a Job for Students</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INCOMING DRIVES TAB (Requests Dispatched by Companies to this College)     */}
      {/* ========================================================================= */}
      {activeTab === 'incoming' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-full sm:w-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setIncomingFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all cursor-pointer ${
                    incomingFilter === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={incomingSearch}
                onChange={(e) => setIncomingSearch(e.target.value)}
                placeholder="Search company or role title..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Drive Requests Cards List */}
          <div className="space-y-4">
            {filteredIncoming.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          {req.id}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Submitted {req.submittedAt}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {req.jobTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                        <Building2 className="w-4 h-4" />
                        <span>{req.companyName}</span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending TPO Review</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved by TPO • Unlocked for Students</span>
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Drive Declined</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Drive Logistics Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Scheduled Drive Dates</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {req.driveStartDate} to {req.driveEndDate}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Stipend / CTC</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                        {req.stipend}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Target Departments</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {req.eligibleBranches.join(', ')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Min CGPA Required</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {req.minCgpa} CGPA
                      </span>
                    </div>
                  </div>

                  {/* Assessment Rounds & Notes */}
                  {req.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-200">Company Proposal Notes: </strong>
                      {req.notes}
                    </p>
                  )}

                  {/* TPO Action Bar */}
                  {isPending && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Add lab allocation remarks (e.g. Lab 3 booked, 80 PCs available)..."
                          value={remarksInput[req.id] || ''}
                          onChange={(e) =>
                            setRemarksInput((prev) => ({ ...prev, [req.id]: e.target.value }))
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRejectIncoming(req)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => handleApproveIncoming(req)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Campus Drive</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Already Approved Info */}
                  {isApproved && req.tpoRemarks && (
                    <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">TPO Dispatch Note:</span>
                        <span>{req.tpoRemarks}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TPO Approaching a Company (Send New Proposal)                    */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Dispatch Placement Drive Proposal to Company
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Institute of Technology, Jodhpur • TPO Corporate Outreach
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNewProposal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Company:
                  </label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  >
                    <option value="TechNova Solutions">TechNova Solutions</option>
                    <option value="Google Cloud Partners">Google Cloud Partners</option>
                    <option value="Razorpay Systems">Razorpay Systems</option>
                    <option value="DataHub Solutions">DataHub Solutions</option>
                    <option value="InnoMind AI">InnoMind AI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Drive Proposal Type:
                  </label>
                  <select
                    value={proposalType}
                    onChange={(e) => setProposalType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  >
                    <option value="Campus Placement Drive">Campus Placement Drive</option>
                    <option value="Internship & PPO Pool">Internship & PPO Pool</option>
                    <option value="Skill Hackathon & Hiring">Skill Hackathon & Hiring</option>
                    <option value="Curriculum & Lab Partnership">Curriculum & Lab Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposal Subject / Drive Title:
                </label>
                <input
                  type="text"
                  required
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="e.g. Invitation for 2026 Batch Campus Recruitment Drive (CSE, IT & AI-DS)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Batch:
                  </label>
                  <input
                    type="text"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eligible Candidates Count:
                  </label>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Average Batch CGPA:
                  </label>
                  <input
                    type="text"
                    value={avgCgpa}
                    onChange={(e) => setAvgCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Proposed Drive Dates:
                  </label>
                  <input
                    type="text"
                    value={proposedDates}
                    onChange={(e) => setProposedDates(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mode / Format:
                  </label>
                  <select
                    value={proposedMode}
                    onChange={(e) => setProposedMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="On-Campus (Offline)">On-Campus (Offline)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Virtual / Remote">Virtual / Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verified Skill Highlights (Comma-separated):
                </label>
                <input
                  type="text"
                  value={skillTags}
                  onChange={(e) => setSkillTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Cover Letter & Invitation Pitch:
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Proposal to {targetCompany}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TPO POST A JOB FOR STUDENTS (FROM APPROVED DRIVE)                */}
      {/* ========================================================================= */}
      {postingJobForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Post On-Campus Drive Job for Students
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Company: <strong className="text-indigo-600 dark:text-indigo-400">{postingJobForProposal.companyName}</strong> • Target College: {postingJobForProposal.collegeName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPostingJobForProposal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanatory Info Card */}
            <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Publishing this form will immediately add this recruitment drive to your enrolled students' <strong>"Internships & Jobs → On-Campus Drives"</strong> section. Eligible students can apply using their audited SkillBridge profile.
              </p>
            </div>

            <form onSubmit={handleConfirmPublishJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Job / Role Designation:
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Cloud & AI Systems Software Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Position Type:
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stipend / CTC Package:
                  </label>
                  <input
                    type="text"
                    required
                    value={jobStipend}
                    onChange={(e) => setJobStipend(e.target.value)}
                    placeholder="e.g. ₹55,000 / month or ₹14 LPA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Location:
                  </label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Bengaluru / Hybrid or Onsite"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Application Deadline:
                  </label>
                  <input
                    type="text"
                    required
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    placeholder="e.g. Nov 10, 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Drive Dates:
                </label>
                <input
                  type="text"
                  value={jobDriveDates}
                  onChange={(e) => setJobDriveDates(e.target.value)}
                  placeholder="e.g. Nov 12, 2026 - Nov 15, 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Required Skills (Comma-separated - students need project proofs):
                </label>
                <input
                  type="text"
                  required
                  value={jobRequiredSkills}
                  onChange={(e) => setJobRequiredSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js, Python, Docker, SQL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred / Bonus Skills (Comma-separated):
                </label>
                <input
                  type="text"
                  value={jobPreferredSkills}
                  onChange={(e) => setJobPreferredSkills(e.target.value)}
                  placeholder="e.g. Kubernetes, AWS, GraphQL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Drive Details & Student Eligibility Instructions:
                </label>
                <textarea
                  rows={4}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPostingJobForProposal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Publish to Student On-Campus Drives</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
