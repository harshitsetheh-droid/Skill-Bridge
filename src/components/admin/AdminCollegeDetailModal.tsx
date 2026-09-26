import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  GraduationCap, 
  Users, 
  Calendar, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Send, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  ChevronRight, 
  AlertCircle,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Ban,
  RotateCcw
} from 'lucide-react';
import { CollegeAdminDetail, getAdminCollegeDetail, CollegeBranchStudentSummary } from '../../data/adminDetailedStore';

interface AdminCollegeDetailModalProps {
  collegeIdOrName: string;
  onClose: () => void;
  onOpenStudentDossier?: (studentIdOrName: string) => void;
  onApproveTPO?: (collegeId: string) => void;
  onDelistCollege?: (collegeId: string, reason: string) => void;
}

export const AdminCollegeDetailModal: React.FC<AdminCollegeDetailModalProps> = ({
  collegeIdOrName,
  onClose,
  onOpenStudentDossier,
  onApproveTPO,
  onDelistCollege
}) => {
  const [college, setCollege] = useState<CollegeAdminDetail>(() => getAdminCollegeDetail(collegeIdOrName));
  const [activeTab, setActiveTab] = useState<'visiting-companies' | 'company-feedbacks' | 'curriculum-updates' | 'branch-students' | 'invitation-trails'>('visiting-companies');
  
  // Branch sub-selector for branch-wise student directory
  const availableBranches = Object.keys(college.branchWiseStudents || {});
  const [selectedBranch, setSelectedBranch] = useState<string>(availableBranches[0] || 'Computer Science & Engineering');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin Institutional Dossier & Placement Cell
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
              NIRF Rank #{college.nirfRank}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
              {college.accreditation}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Institution Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/70 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                <Building2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {college.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    college.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : college.status === 'Pending Approval'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {college.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    TPO Head: {college.tpoHead}
                  </span>
                  <span>•</span>
                  <span>Established in {college.establishedYear}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {college.city}, {college.state}
                  </span>
                </div>

                {/* TPO Direct Contact Info */}
                <div className="pt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${college.email}`} className="hover:underline hover:text-indigo-600">
                      {college.email}
                    </a>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${college.mobileNo}`} className="hover:underline hover:text-indigo-600">
                      {college.mobileNo}
                    </a>
                    {college.officePhone && <span className="text-slate-400 font-normal">({college.officePhone})</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-5">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">Enrolled Students</div>
                <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {college.totalStudents.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">Companies Visited</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {college.visitingCompaniesHistory.length}+
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">Curriculum Updates</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {college.curriculumRevisions.length} Times
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Live Campus Drive Alert Banner (if any) */}
          {college.ongoingDrives && college.ongoingDrives.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                    Live Ongoing Campus Drive in Session!
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                  Active On Campus
                </span>
              </div>

              {college.ongoingDrives.map(drv => (
                <div key={drv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <div>
                    <span className="font-black text-sm text-slate-900 dark:text-white">{drv.companyName}</span>
                    <span className="text-slate-600 dark:text-slate-300"> — {drv.jobTitle}</span>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Venue: {drv.venue} | Dates: {drv.startDate} to {drv.endDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 font-semibold text-indigo-700 dark:text-indigo-300">
                      {drv.dayProgress}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
                      {drv.candidatesRemaining} Candidates in {drv.currentRound}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('visiting-companies')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'visiting-companies'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Visiting Companies & Year-Wise Placements ({college.visitingCompaniesHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('company-feedbacks')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'company-feedbacks'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Company Feedback & Gaps ({college.companyFeedbacks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('curriculum-updates')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'curriculum-updates'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum Revision Log ({college.curriculumRevisions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('branch-students')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'branch-students'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Branch-Wise Students</span>
            </button>
            <button
              onClick={() => setActiveTab('invitation-trails')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'invitation-trails'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Drive Request & Reply Trails</span>
            </button>
          </div>

          {/* TAB 1: VISITING COMPANIES & YEAR-WISE HISTORY */}
          {activeTab === 'visiting-companies' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Detailed record of every visiting recruiting company: which academic year, duration of drive, how many students selected vs rejected, and offered package brackets.
              </div>

              <div className="space-y-3">
                {college.visitingCompaniesHistory.map(rec => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                          {rec.companyLogo}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-base text-slate-900 dark:text-white">
                              {rec.companyName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                              Batch {rec.year}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Drive Duration: <strong className="text-slate-700 dark:text-slate-300">{rec.driveDays} Days</strong> ({rec.visitStartDate} to {rec.visitEndDate})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                          rec.driveStatus === 'Completed' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {rec.driveStatus}
                        </span>
                      </div>
                    </div>

                    {/* Roles Offered */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-medium">Roles Offered: </span>
                      {rec.rolesOffered.map((role, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium">
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Numerical Stats: Selected, Rejected, Compensation */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-slate-500">Applied / Appeared</div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                          {rec.candidatesApplied} Students
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Final Selected ✓</div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                          {rec.candidatesSelected} Hired
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Rejected ✗</div>
                        <div className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                          {rec.candidatesRejected}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Compensation (Highest / Med)</div>
                        <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
                          {rec.packageHighest} / {rec.packageMedian}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY FEEDBACK TO COLLEGE */}
          {activeTab === 'company-feedbacks' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Direct feedback transmitted by company hiring panels to the college placement cell following campus hiring rounds.
              </div>

              <div className="space-y-4">
                {college.companyFeedbacks.map(fb => (
                  <div
                    key={fb.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {fb.companyLogo}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {fb.companyName}
                          </div>
                          <div className="text-xs text-slate-500">
                            Role: {fb.driveRole} • Date: {fb.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold">
                        <span>★ {fb.overallRating} / 5.0 Rating</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      "{fb.feedbackText}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                        <strong className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths Observed:
                        </strong>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 pl-1 space-y-0.5">
                          {fb.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 space-y-1">
                        <strong className="text-rose-800 dark:text-rose-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Gaps & Deficiencies:
                        </strong>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 pl-1 space-y-0.5">
                          {fb.gapsIdentified.map((g, idx) => (
                            <li key={idx}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-xs text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <div>
                        <strong>Actionable Recommendation for TPO: </strong>
                        {fb.recommendationForTpo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CURRICULUM UPDATES LOG */}
          {activeTab === 'curriculum-updates' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Audit trail of academic curriculum revisions made by the institution: exact dates, revision version, modules updated, and governing council approvals.
              </div>

              <div className="space-y-4">
                {college.curriculumRevisions.map((rev, idx) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs relative"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          #{college.curriculumRevisions.length - idx}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {rev.title}
                          </h4>
                          <span className="text-xs text-slate-500">
                            Version {rev.revisionVersion} • Academic Year {rev.academicYear} • Dept: {rev.department}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Date: {rev.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.summaryOfChanges}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">New Courses / Modules Introduced:</span>
                        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-1 space-y-0.5">
                          {rev.newCoursesAdded.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Legacy Syllabus Decommissioned:</span>
                        {rev.legacyCoursesRemoved.length > 0 ? (
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                            {rev.legacyCoursesRemoved.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-slate-400 mt-1 italic">None removed (Pure addition)</div>
                        )}
                      </div>
                    </div>

                    <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{rev.approvedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BRANCH-WISE STUDENT DIRECTORY */}
          {activeTab === 'branch-students' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-medium">
                  Branch-wise student roster with roll numbers, CGPA, verified skills, and placement outcomes. Click any student to open their deep-dive dossier!
                </div>

                {/* Branch selector tabs */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {availableBranches.map(branch => (
                    <button
                      key={branch}
                      onClick={() => setSelectedBranch(branch)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        selectedBranch === branch
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {branch} ({(college.branchWiseStudents[branch] || []).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Roll No.</th>
                      <th className="px-4 py-3 font-bold">Student Name</th>
                      <th className="px-4 py-3 font-bold">Year</th>
                      <th className="px-4 py-3 font-bold">CGPA</th>
                      <th className="px-4 py-3 font-bold">Email & Contact</th>
                      <th className="px-4 py-3 font-bold">Placement Status</th>
                      <th className="px-4 py-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {((college.branchWiseStudents[selectedBranch] || [])).map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                          {s.rollNo}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                          {s.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {s.year}
                        </td>
                        <td className="px-4 py-3 font-black text-indigo-600 dark:text-indigo-400">
                          {s.cgpa}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          <div>{s.email}</div>
                          <div className="text-[11px] text-slate-400">{s.mobile}</div>
                        </td>
                        <td className="px-4 py-3">
                          {s.placementStatus === 'Placed' ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                              Placed: {s.placedCompany} ({s.package})
                            </span>
                          ) : s.placementStatus === 'In Process' ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
                              Interviewing
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                              Open to Placement
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onOpenStudentDossier && onOpenStudentDossier(s.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DUAL DRIVE REQUEST & REPLY TRAILS */}
          {activeTab === 'invitation-trails' && (
            <div className="space-y-6">
              
              {/* College -> Company Sent Invitations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Invitations Sent by College to Companies & Company Replies ({college.collegeToCompanyRequests.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {college.collegeToCompanyRequests.map(req => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-2xs text-xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            {req.companyLogo}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              Proposal to {req.companyName}
                            </span>
                            <div className="text-slate-500">
                              Sent on {req.requestDate} • Proposed Slot: {req.proposedDates}
                            </div>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          req.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : req.status === 'Declined'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          Company Status: {req.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                        <div className="text-slate-500 text-[11px] mb-1">
                          Company Official Reply (Received on {req.companyReplyDate}):
                        </div>
                        <strong>"{req.companyReplyMessage}"</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company -> College Drive Requests */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Drive Slot Requests from Companies to College & TPO Reply ({college.companyToCollegeRequests.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {college.companyToCollegeRequests.map(req => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-2xs text-xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            {req.companyLogo}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              Request from {req.companyName}
                            </span>
                            <div className="text-slate-500">
                              Received {req.requestDate} • Role: {req.jobRole} • CTC: {req.proposedCtc}
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                          TPO Verdict: {req.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                        <div className="text-slate-500 text-[11px] mb-1">
                          TPO Placement Office Remarks (Sent on {req.tpoReplyDate}):
                        </div>
                        <strong>"{req.tpoReplyRemarks}"</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Institutional accreditation & TPO coordination records verified.
          </div>

          <div className="flex items-center gap-2">
            {college.status === 'Pending Approval' && onApproveTPO && (
              <button
                onClick={() => {
                  onApproveTPO(college.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Approve TPO Access
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
