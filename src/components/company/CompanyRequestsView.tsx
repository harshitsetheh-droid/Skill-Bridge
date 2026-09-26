import React, { useState, useEffect } from 'react';
import { 
  loadDriveRequests, 
  CampusDriveRequest, 
  DRIVE_REQUESTS_UPDATED_EVENT 
} from '../../data/driveRequestsStore';
import {
  loadCollegeApproachRequests,
  approveCollegeApproachRequest,
  rejectCollegeApproachRequest,
  CollegeApproachRequest,
  COLLEGE_APPROACH_UPDATED_EVENT
} from '../../data/collegeApproachStore';
import { 
  Building2, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  MapPin,
  Send,
  Inbox,
  Info,
  Check,
  X,
  Mail,
  Phone,
  Sparkles,
  Award,
  Users,
  Briefcase
} from 'lucide-react';

interface CompanyRequestsViewProps {
  onNavigateToPostJob?: () => void;
}

export const CompanyRequestsView: React.FC<CompanyRequestsViewProps> = ({ onNavigateToPostJob }) => {
  // Main Tab: 'send' (Sent by Company) vs 'receive' (Received from Colleges)
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('receive');

  // Sent requests state (Company -> Colleges)
  const [sentRequests, setSentRequests] = useState<CampusDriveRequest[]>(() => loadDriveRequests());
  const [sentStatusFilter, setSentStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sentSearchQuery, setSentSearchQuery] = useState('');

  // Received requests state (Colleges -> Company)
  const [receivedRequests, setReceivedRequests] = useState<CollegeApproachRequest[]>(() => loadCollegeApproachRequests());
  const [receivedStatusFilter, setReceivedStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [receivedSearchQuery, setReceivedSearchQuery] = useState('');

  // Approval Modal state for Received Proposals
  const [approvingProposal, setApprovingProposal] = useState<CollegeApproachRequest | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [hrContact, setHrContact] = useState('Pooja Hegde (Campus Talent Acquisition Lead)');
  const [confirmedDates, setConfirmedDates] = useState('');

  // Reject modal state
  const [rejectingProposal, setRejectingProposal] = useState<CollegeApproachRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleSentUpdate = () => {
      setSentRequests(loadDriveRequests());
    };
    const handleReceivedUpdate = () => {
      setReceivedRequests(loadCollegeApproachRequests());
    };

    window.addEventListener(DRIVE_REQUESTS_UPDATED_EVENT, handleSentUpdate);
    window.addEventListener(COLLEGE_APPROACH_UPDATED_EVENT, handleReceivedUpdate);

    return () => {
      window.removeEventListener(DRIVE_REQUESTS_UPDATED_EVENT, handleSentUpdate);
      window.removeEventListener(COLLEGE_APPROACH_UPDATED_EVENT, handleReceivedUpdate);
    };
  }, []);

  // Filtered Sent Requests
  const filteredSent = sentRequests.filter((req) => {
    const matchesStatus = sentStatusFilter === 'all' || req.status === sentStatusFilter;
    const matchesSearch = 
      req.universityName.toLowerCase().includes(sentSearchQuery.toLowerCase()) ||
      req.jobTitle.toLowerCase().includes(sentSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Received Requests
  const filteredReceived = receivedRequests.filter((req) => {
    const matchesStatus = receivedStatusFilter === 'all' || req.status === receivedStatusFilter;
    const matchesSearch = 
      req.collegeName.toLowerCase().includes(receivedSearchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(receivedSearchQuery.toLowerCase()) ||
      req.tpoName.toLowerCase().includes(receivedSearchQuery.toLowerCase()) ||
      req.targetBranches.some(b => b.toLowerCase().includes(receivedSearchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'pending').length;
  const approvedReceivedCount = receivedRequests.filter((r) => r.status === 'approved').length;

  const pendingSentCount = sentRequests.filter((r) => r.status === 'pending').length;
  const approvedSentCount = sentRequests.filter((r) => r.status === 'approved').length;

  // Open Approval Modal
  const handleOpenApprove = (proposal: CollegeApproachRequest) => {
    setApprovingProposal(proposal);
    setConfirmedDates(proposal.proposedDriveDates);
    setApprovalRemarks(
      `Approved! TechNova Solutions Talent Acquisition team will visit ${proposal.collegeName} for the campus recruitment drive on ${proposal.proposedDriveDates}. We look forward to assessing your verified talent pool.`
    );
    setHrContact('Pooja Hegde (Campus Talent Acquisition Lead, TechNova)');
  };

  const handleConfirmApproval = () => {
    if (!approvingProposal) return;
    approveCollegeApproachRequest(
      approvingProposal.id,
      approvalRemarks,
      hrContact,
      confirmedDates
    );
    setToastMessage(`✓ Approved campus drive proposal for ${approvingProposal.collegeName}! Status updated and confirmation dispatched to TPO ${approvingProposal.tpoName}.`);
    setApprovingProposal(null);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleOpenReject = (proposal: CollegeApproachRequest) => {
    setRejectingProposal(proposal);
    setRejectionReason('Currently our campus hiring slots for this quarter are filled. We would love to collaborate in the subsequent recruitment cycle.');
  };

  const handleConfirmReject = () => {
    if (!rejectingProposal) return;
    rejectCollegeApproachRequest(rejectingProposal.id, rejectionReason);
    setToastMessage(`Campus drive proposal from ${rejectingProposal.collegeName} declined.`);
    setRejectingProposal(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="leading-relaxed">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Header & Option Switcher (Send vs Receive) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Campus Drive Requests & University Partnerships
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                TechNova Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage requests sent to universities and evaluate incoming campus placement proposals initiated by College TPOs.
            </p>
          </div>

          {activeTab === 'send' && onNavigateToPostJob && (
            <button
              onClick={onNavigateToPostJob}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Campus Drive Request</span>
            </button>
          )}
        </div>

        {/* 2 Main Options: Send & Receive Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('receive')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-1 sm:flex-initial justify-center ${
              activeTab === 'receive'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4 text-indigo-500" />
            <span>Receive (From Colleges)</span>
            {pendingReceivedCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                {pendingReceivedCount} New
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                {receivedRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('send')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-1 sm:flex-initial justify-center ${
              activeTab === 'send'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Send className="w-4 h-4 text-indigo-500" />
            <span>Send (To Colleges)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
              {sentRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OPTION 1: RECEIVE TAB (Colleges Approaching Company)                       */}
      {/* ========================================================================= */}
      {activeTab === 'receive' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Company Review</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingReceivedCount}</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Colleges awaiting TechNova drive approval</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approved by TechNova</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{approvedReceivedCount}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Confirmed drives notified back to TPO</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total College Outreach</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{receivedRequests.length}</span>
                <GraduationCap className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Campuses inviting TechNova talent teams</span>
            </div>
          </div>

          {/* Filter and Search */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-full sm:w-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setReceivedStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                    receivedStatusFilter === st
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
                value={receivedSearchQuery}
                onChange={(e) => setReceivedSearchQuery(e.target.value)}
                placeholder="Search college, TPO, or branch..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* List of Received Proposals */}
          <div className="space-y-4">
            {filteredReceived.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                No incoming college proposals match your current filters.
              </div>
            ) : (
              filteredReceived.map((req) => {
                const isPending = req.status === 'pending';
                const isApproved = req.status === 'approved';
                const isRejected = req.status === 'rejected';

                return (
                  <div
                    key={req.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all space-y-5 ${
                      isPending
                        ? 'border-amber-200/80 dark:border-amber-900/60 ring-1 ring-amber-400/20'
                        : isApproved
                        ? 'border-emerald-200/80 dark:border-emerald-900/60'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            {req.id}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-200 dark:border-indigo-800">
                            {req.proposalType}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Received {req.submittedAt}
                          </span>
                        </div>

                        <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                          {req.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                            <GraduationCap className="w-4 h-4" />
                            <span>{req.collegeName}</span>
                          </div>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <span className="font-semibold">TPO:</span> {req.tpoName}
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{req.tpoEmail}</span>
                          </div>
                          {req.tpoPhone && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{req.tpoPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Pill & Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Awaiting TechNova Decision</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Approved by TechNova • Slot Confirmed</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Drive Declined</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Highlights Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                        <span className="text-slate-400 dark:text-slate-500 font-medium block">Eligible Pool</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          {req.eligibleStudentCount} Candidates (Avg {req.avgCgpa})
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                        <span className="text-slate-400 dark:text-slate-500 font-medium block">Proposed Window</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          {req.proposedDriveDates}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                        <span className="text-slate-400 dark:text-slate-500 font-medium block">Mode & Venue</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          {req.proposedMode}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                        <span className="text-slate-400 dark:text-slate-500 font-medium block">Expected CTC / Stipend</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {req.expectedPackageRange}
                        </span>
                      </div>
                    </div>

                    {/* Target Branches & Verified Skill Stack */}
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-600 dark:text-slate-400">Target Branches:</span>
                        {req.targetBranches.map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-600 dark:text-slate-400 mr-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          Verified Skills:
                        </span>
                        {req.verifiedSkillsHighlights.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-bold text-[11px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* TPO Pitch / Cover Letter */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/80 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        TPO Official Invitation & Pitch:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {req.coverLetter}
                      </p>
                    </div>

                    {/* Campus Facilities Offered */}
                    {req.campusFacilities && req.campusFacilities.length > 0 && (
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-slate-500 dark:text-slate-400 block">
                          Campus Infrastructure Provided by College:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700 dark:text-slate-300">
                          {req.campusFacilities.map((fac, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{fac}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Feedback / Company Remarks If Approved */}
                    {isApproved && (
                      <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Approved by TechNova Solutions • Dispatched to College TPO</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-900/40">
                          <div>
                            <span className="font-semibold text-emerald-800 dark:text-emerald-400 block">Confirmed Dates:</span>
                            <span>{req.confirmedDriveDates || req.proposedDriveDates}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-emerald-800 dark:text-emerald-400 block">TechNova Point of Contact:</span>
                            <span>{req.hrContactPerson || 'Talent Acquisition Team'}</span>
                          </div>
                        </div>
                        {req.companyRemarks && (
                          <div className="pt-1">
                            <span className="font-semibold text-emerald-800 dark:text-emerald-400 block">Approval Remarks Sent to TPO:</span>
                            <span className="italic">{req.companyRemarks}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* If Pending: Prominent Action Buttons for Company HR */}
                    {isPending && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenReject(req)}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Decline Request
                        </button>
                        <button
                          onClick={() => handleOpenApprove(req)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Schedule Campus Drive</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OPTION 2: SEND TAB (Requests Sent by Company to Universities)             */}
      {/* ========================================================================= */}
      {activeTab === 'send' && (
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending TPO Approval</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingSentCount}</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Awaiting university schedule confirmation</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approved & Scheduled</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{approvedSentCount}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Live for students on their campus portal</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Outbound Drives</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{sentRequests.length}</span>
                <Send className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Drives dispatched to placement cells</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-full sm:w-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSentStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                    sentStatusFilter === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
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
                value={sentSearchQuery}
                onChange={(e) => setSentSearchQuery(e.target.value)}
                placeholder="Search university or role..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredSent.map((req) => {
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
                        <GraduationCap className="w-4 h-4" />
                        <span>{req.universityName}</span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending TPO Approval</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved by TPO • Active Drive</span>
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

                  {/* Drive Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Drive Dates</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {req.driveStartDate} to {req.driveEndDate}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Stipend / CTC</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {req.stipend}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Eligible Branches</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {req.eligibleBranches.join(', ')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 font-medium block">Min CGPA Cutoff</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {req.minCgpa} CGPA
                      </span>
                    </div>
                  </div>

                  {/* TPO Remarks if approved or pending */}
                  {req.tpoRemarks && (
                    <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                      <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">TPO Official Notes:</span>
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
      {/* APPROVAL MODAL (Company Approving Inbound College Request)                 */}
      {/* ========================================================================= */}
      {approvingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Approve Campus Recruitment Drive
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {approvingProposal.collegeName} • TPO: {approvingProposal.tpoName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApprovingProposal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200">
              <span className="font-bold block">Action Summary:</span>
              Approving this proposal confirms TechNova's campus drive slot. The approval confirmation, dates, and HR contacts will immediately synchronize with the College TPO portal.
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirmed Drive Dates:
                </label>
                <input
                  type="text"
                  value={confirmedDates}
                  onChange={(e) => setConfirmedDates(e.target.value)}
                  placeholder="e.g. Nov 12 - Nov 15, 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  TechNova HR / Talent Acquisition Lead:
                </label>
                <input
                  type="text"
                  value={hrContact}
                  onChange={(e) => setHrContact(e.target.value)}
                  placeholder="e.g. Pooja Hegde (University Talent Lead)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Approval Remarks & Panel Instructions (Dispatched to TPO):
                </label>
                <textarea
                  rows={3}
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  placeholder="Notes on team size, test requirements, lab setups..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setApprovingProposal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Dispatch Approval to TPO</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Decline Proposal
              </h3>
              <button
                onClick={() => setRejectingProposal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Decline the recruitment proposal from <strong>{rejectingProposal.collegeName}</strong>. Please provide a brief reason for the college TPO.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden"
              placeholder="Reason for declining..."
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingProposal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Decline Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
