import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Briefcase, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Send, 
  ArrowRight, 
  Award, 
  FileText, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  Ban,
  RotateCcw
} from 'lucide-react';
import { CompanyAdminDetail, getAdminCompanyDetail } from '../../data/adminDetailedStore';

interface AdminCompanyDetailModalProps {
  companyIdOrName: string;
  onClose: () => void;
  onOpenStudentDossier?: (studentIdOrName: string) => void;
  onApproveCompany?: (companyId: string) => void;
  onDelistCompany?: (companyId: string, reason: string) => void;
}

export const AdminCompanyDetailModal: React.FC<AdminCompanyDetailModalProps> = ({
  companyIdOrName,
  onClose,
  onOpenStudentDossier,
  onApproveCompany,
  onDelistCompany
}) => {
  const [company, setCompany] = useState<CompanyAdminDetail>(() => getAdminCompanyDetail(companyIdOrName));
  const [activeTab, setActiveTab] = useState<'campus-drives' | 'feedback-given' | 'outreach-proposals' | 'off-campus-recruits' | 'selected-students-master'>('campus-drives');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin Corporate Recruiting & Campus Drives Dossier
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
              {company.industry}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Company Identity Banner Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/70 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {company.logo || company.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {company.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    company.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : company.status === 'Pending Approval'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {company.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    HQ: {company.headquarters}
                  </span>
                  <span>•</span>
                  <span>Registered {company.registeredDate}</span>
                  <span>•</span>
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{company.website.replace('https://', '')}</span>
                  </a>
                </div>

                {/* Recruiter Contact */}
                <div className="pt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${company.email}`} className="hover:underline hover:text-indigo-600">
                      {company.email}
                    </a>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${company.phone}`} className="hover:underline hover:text-indigo-600">
                      {company.phone}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-5">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">Campus Drives</div>
                <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {company.totalDrivesConducted} Completed
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">Students Hired</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {company.totalStudentsSelected} Total
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">Off-Campus Posts</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {company.totalOffCampusPostsCount} Posts
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">College Acceptance</div>
                <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {company.collegesAcceptedCount} Accepted / {company.collegesRejectedCount} Rej
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Live Ongoing Campus Drives Tracker (if active) */}
          {company.ongoingDrives && company.ongoingDrives.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                    Live Ongoing Campus Drive Right Now!
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                  Active On-Site
                </span>
              </div>

              {company.ongoingDrives.map(drv => (
                <div key={drv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <div>
                    <span className="font-black text-sm text-slate-900 dark:text-white">{drv.collegeName}</span>
                    <span className="text-slate-600 dark:text-slate-300"> — Role: {drv.role}</span>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Drive Window: {drv.startDate} to {drv.endDate} ({drv.totalDays} Total Days)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 font-bold text-emerald-700 dark:text-emerald-300">
                      Day {drv.currentDay} of {drv.totalDays}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
                      {drv.currentRound} ({drv.candidatesRemaining} candidates left of {drv.totalInitialApplicants})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Tab Selector */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('campus-drives')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'campus-drives'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Campus Drives & Days ({company.campusDrivesHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('selected-students-master')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'selected-students-master'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selected Students List & Package (CTC)</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback-given')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'feedback-given'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedbacks Given to Colleges ({company.feedbacksGivenToColleges.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('outreach-proposals')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'outreach-proposals'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>College Outreach & Reply Trails</span>
            </button>
            <button
              onClick={() => setActiveTab('off-campus-recruits')}
              className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'off-campus-recruits'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Off-Campus Posts & Recruited Hires ({company.offCampusRecruits.length})</span>
            </button>
          </div>

          {/* TAB 1: CAMPUS DRIVES WITH DATES & DAYS */}
          {activeTab === 'campus-drives' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Record of every campus drive conducted by {company.name}: target college, exact drive dates, number of drive days, roles hired, and student selection vs rejection counts.
              </div>

              <div className="space-y-4">
                {company.campusDrivesHistory.map(drive => (
                  <div
                    key={drive.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-slate-900 dark:text-white">
                            {drive.collegeName}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                            {drive.driveDays} Days Drive
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Dates: <strong className="text-slate-800 dark:text-slate-200">{drive.startDate}</strong> to <strong className="text-slate-800 dark:text-slate-200">{drive.endDate}</strong>
                        </div>
                      </div>

                      <div className="text-xs text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {drive.packageLpa}
                        </span>
                        {drive.stipendDuringInternship && (
                          <div className="text-[11px] text-slate-400">
                            Stipend: {drive.stipendDuringInternship}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      <strong>Role Hired: </strong> {drive.roleHired}
                    </div>

                    {/* Funnel Metrics Bar */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-slate-500">Appeared in Drive</div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                          {drive.candidatesAppeared} Students
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Selected & Offered ✓</div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                          {drive.candidatesSelected} Students
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Rejected ✗</div>
                        <div className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                          {drive.candidatesRejected} Students
                        </div>
                      </div>
                    </div>

                    {/* Selected candidates preview snippet */}
                    {drive.selectedStudents && drive.selectedStudents.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Selected Candidates from this Drive:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {drive.selectedStudents.map(sel => (
                            <button
                              key={sel.id}
                              onClick={() => onOpenStudentDossier && onOpenStudentDossier(sel.studentName)}
                              className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>{sel.studentName} ({sel.rollNo})</span>
                              <span className="text-emerald-600 font-bold">• {sel.packageLpa}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SELECTED STUDENTS MASTER LIST */}
          {activeTab === 'selected-students-master' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Comprehensive list of all students selected across campus drives with their exact selection date, college, post/role, and compensation package. Click any student to view their dossier.
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Student Name</th>
                      <th className="px-4 py-3 font-bold">Roll No.</th>
                      <th className="px-4 py-3 font-bold">College</th>
                      <th className="px-4 py-3 font-bold">Post / Job Role</th>
                      <th className="px-4 py-3 font-bold">Selection Date</th>
                      <th className="px-4 py-3 font-bold">Offered Package</th>
                      <th className="px-4 py-3 font-bold text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {company.campusDrivesHistory.flatMap(d => d.selectedStudents).map(sel => (
                      <tr key={sel.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                          {sel.studentName}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                          {sel.rollNo}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                          {sel.college}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {sel.postRole}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {sel.selectionDate}
                        </td>
                        <td className="px-4 py-3 font-black text-emerald-600 dark:text-emerald-400">
                          {sel.packageLpa}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onOpenStudentDossier && onOpenStudentDossier(sel.studentName)}
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

          {/* TAB 3: FEEDBACKS GIVEN TO COLLEGES */}
          {activeTab === 'feedback-given' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Evaluations and gap feedback sent by {company.name} to institutions after drives, including overall rating, technical observations, and curriculum advice.
              </div>

              <div className="space-y-4">
                {company.feedbacksGivenToColleges.map(fb => (
                  <div
                    key={fb.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            Feedback Sent to {fb.collegeName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono">
                            {fb.feedbackDate}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Role Evaluated: {fb.driveRole}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold">
                        <span>★ {fb.rating} / 5.0 Rating</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <strong className="text-slate-700 dark:text-slate-300">Specific Feedback Points:</strong>
                      <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 pl-1 space-y-0.5">
                        {fb.feedbackPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/60">
                        <strong className="text-emerald-800 dark:text-emerald-300">Observed Strengths:</strong>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">{fb.strengthsObserved}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/60">
                        <strong className="text-rose-800 dark:text-rose-300">Recommended Improvement Area:</strong>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">{fb.areasToImprove}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COLLEGE OUTREACH & PROPOSAL TRAILS */}
          {activeTab === 'outreach-proposals' && (
            <div className="space-y-6">
              
              {/* Acceptance / Rejection stats bar */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Institutional Acceptance Metric: </span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">{company.collegesAcceptedCount} Colleges Accepted</span>
                  <span className="text-slate-400"> vs </span>
                  <span className="text-rose-700 dark:text-rose-300 font-bold">{company.collegesRejectedCount} Declined</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Proposals tracked in real-time across institutional TPO offices.
                </div>
              </div>

              {/* Company -> College Outreach */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Drive Requests Sent by {company.name} to Colleges ({company.companyToCollegeOutreach.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {company.companyToCollegeOutreach.map(out => (
                    <div
                      key={out.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs text-xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            Target College: {out.collegeName}
                          </span>
                          <div className="text-slate-500">
                            Sent on {out.requestDate} • Proposed Slot: {out.proposedDates} • Role: {out.role} ({out.packageCtc})
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          out.collegeResponse === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : out.collegeResponse === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          College Verdict: {out.collegeResponse}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                        <div className="text-slate-500 text-[11px] mb-1">
                          College TPO Official Response (Received on {out.responseDate}):
                        </div>
                        <strong>"{out.responseRemarks}"</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* College -> Company Invitations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Invitations Received from Colleges & Company Decision ({company.collegeToCompanyProposals.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {company.collegeToCompanyProposals.map(prop => (
                    <div
                      key={prop.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs text-xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            Invitation from {prop.collegeName}
                          </span>
                          <div className="text-slate-500">
                            Invited on {prop.invitationDate} • Slot: {prop.proposedSlot} • Batch: {prop.expectedBatchSize} Students
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          prop.companyDecision === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          Decision: {prop.companyDecision}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                        <div className="text-slate-500 text-[11px] mb-1">
                          Company Recruitment Panel Reason (Replied on {prop.replyDate}):
                        </div>
                        <strong>"{prop.decisionNotes}"</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: OFF-CAMPUS POSTINGS & RECRUITS */}
          {activeTab === 'off-campus-recruits' && (
            <div className="space-y-6">
              
              {/* Off-Campus Job Postings History */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Direct Off-Campus Job Openings Posted ({company.offCampusPostings.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {company.offCampusPostings.map(post => (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {post.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          post.status.includes('Active')
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {post.status}
                        </span>
                      </div>

                      <div className="text-slate-500">
                        Posted on: {post.postedDate} • Location: {post.location}
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{post.ctc}</span>
                        <span className="text-slate-500 font-medium">
                          {post.applicationsCount} Applied / <strong>{post.hiredCount} Hired</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruited Off-Campus Candidates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Candidates Recruited via Off-Campus / Direct Pool ({company.offCampusRecruits.length})
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-4 py-3 font-bold">Candidate Name</th>
                        <th className="px-4 py-3 font-bold">College Origin</th>
                        <th className="px-4 py-3 font-bold">Hired Post</th>
                        <th className="px-4 py-3 font-bold">Hired Date</th>
                        <th className="px-4 py-3 font-bold">Offered CTC</th>
                        <th className="px-4 py-3 font-bold">Recruitment Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {company.offCampusRecruits.map(rec => (
                        <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                            <div>{rec.studentName}</div>
                            <div className="text-[11px] text-slate-400 font-normal">{rec.email}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                            {rec.college}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {rec.role}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-500">
                            {rec.hiredDate}
                          </td>
                          <td className="px-4 py-3 font-black text-emerald-600 dark:text-emerald-400">
                            {rec.ctc}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                              {rec.recruitmentSource}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Corporate placement audit synchronized with central SkillBridge registry.
          </div>

          <div className="flex items-center gap-2">
            {company.status === 'Pending Approval' && onApproveCompany && (
              <button
                onClick={() => {
                  onApproveCompany(company.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Approve Company Access
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
