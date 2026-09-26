import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Globe, 
  Code, 
  FileText, 
  Phone, 
  Mail, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  Award, 
  Calendar, 
  MapPin, 
  Sparkles, 
  AlertTriangle,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  Ban,
  RotateCcw
} from 'lucide-react';
import { StudentAdminDetail, getAdminStudentDetail } from '../../data/adminDetailedStore';

interface AdminStudentDetailModalProps {
  studentIdOrName: string;
  onClose: () => void;
  onDelist?: (studentId: string, reason: string) => void;
  onRestore?: (studentId: string) => void;
}

export const AdminStudentDetailModal: React.FC<AdminStudentDetailModalProps> = ({
  studentIdOrName,
  onClose,
  onDelist,
  onRestore
}) => {
  const [student, setStudent] = useState<StudentAdminDetail>(() => getAdminStudentDetail(studentIdOrName));
  const [activeTab, setActiveTab] = useState<'applications' | 'projects' | 'skills' | 'integrity'>('applications');
  const [delistPromptOpen, setDelistPromptOpen] = useState(false);
  const [delistReasonInput, setDelistReasonInput] = useState('Flagged for integrity review by platform administrator.');

  const handleDelistConfirm = () => {
    setStudent(prev => ({
      ...prev,
      isDelisted: true,
      riskStatus: 'delisted',
      delistReason: delistReasonInput
    }));
    if (onDelist) {
      onDelist(student.id, delistReasonInput);
    }
    setDelistPromptOpen(false);
  };

  const handleRestoreConfirm = () => {
    setStudent(prev => ({
      ...prev,
      isDelisted: false,
      riskStatus: 'clean',
      delistReason: undefined
    }));
    if (onRestore) {
      onRestore(student.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Modal Top Navigation Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin Deep-Dive Dossier
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-semibold">
              Roll No: {student.rollNo}
            </span>
            {student.isDelisted && (
              <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
                DELISTED
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Dossier Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Primary Profile Identity Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/70 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            {/* Left: Avatar & Identity */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {student.avatar || student.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {student.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    student.placementStatus === 'Offer Accepted' || student.placementStatus === 'Multiple Offers'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      : student.placementStatus === 'In Active Interviews'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    {student.placementStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-y-1 gap-x-3">
                  <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                    <Building2 className="w-3.5 h-3.5" />
                    {student.college}
                  </span>
                  <span>•</span>
                  <span>{student.branch} ({student.degree})</span>
                  <span>•</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    {student.yearOfStudy} | {student.currentSemester}
                  </span>
                </div>

                {/* Direct Contact Details: Email, Mobile, Location */}
                <div className="pt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${student.email}`} className="hover:underline hover:text-indigo-600">
                      {student.email}
                    </a>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${student.mobileNo}`} className="hover:underline hover:text-indigo-600">
                      {student.mobileNo}
                    </a>
                    {student.alternatePhone && (
                      <span className="text-[11px] text-slate-400">({student.alternatePhone})</span>
                    )}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {student.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Key Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-5">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">CGPA</div>
                <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {student.cgpa}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">AST Originality</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {student.originalityScore}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
                <div className="text-[11px] text-slate-500 font-medium">Code Defense</div>
                <div className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                  {student.codeDefensePassed}/{student.codeDefenseTotal}
                </div>
              </div>
            </div>

          </div>

          {/* Social / Portfolio Links Row */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              External Portfolios, Repositories & Profiles
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {student.links.github && (
                <a
                  href={student.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {student.links.linkedin && (
                <a
                  href={student.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077B5] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-2xs"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              )}
              {student.links.portfolio && (
                <a
                  href={student.links.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Personal Portfolio</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              )}
              {student.links.leetcode && (
                <a
                  href={student.links.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
                >
                  <Code className="w-3.5 h-3.5 text-amber-600" />
                  <span>LeetCode: {student.links.leetcode.replace('https://', '')}</span>
                  <ExternalLink className="w-3 h-3 text-amber-500" />
                </a>
              )}
              {student.links.resumePdf && (
                <a
                  href={student.links.resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition-colors shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ATS Resume ({student.resumeAtsScore}/100)</span>
                  <ExternalLink className="w-3 h-3 text-indigo-500" />
                </a>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Company Applications & Outcomes ({student.activeApplications.length + student.selectedOffers.length + student.rejectedApplications.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Projects Portfolio ({student.projects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'skills'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Verified Skills ({student.skillsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('integrity')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'integrity'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Integrity & Risk Audit</span>
            </button>
          </div>

          {/* TAB 1: APPLICATIONS (Where applied, where active, where rejected, where selected) */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              
              {/* 1. Offers / Selected */}
              {student.selectedOffers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Offers Secured & Selected Positions ({student.selectedOffers.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {student.selectedOffers.map(off => (
                      <div 
                        key={off.id}
                        className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {off.companyLogo}
                            </span>
                            <div>
                              <div className="text-sm font-black text-slate-900 dark:text-white">{off.company}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{off.role}</div>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold">
                            {off.status}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/60 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Offered CTC: </span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-300">{off.packageOffered}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Offer Date: </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{off.offerDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Joining Date: </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{off.joiningDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Drive Mode: </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{off.driveType}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Currently In-Progress / Active Applications */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Currently Active / In-Progress Applications ({student.activeApplications.length})
                  </h3>
                </div>

                {student.activeApplications.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center">
                    No active in-progress applications right now.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {student.activeApplications.map(app => (
                      <div 
                        key={app.id}
                        className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {app.companyLogo}
                            </span>
                            <div>
                              <div className="text-sm font-black text-slate-900 dark:text-white">{app.company}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{app.role}</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                            In Progress
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-amber-100 dark:border-amber-900/40 text-xs">
                          <div>
                            <span className="text-slate-500 font-medium">Current Stage: </span>
                            <span className="font-bold text-slate-900 dark:text-white">{app.currentStage}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                            <span>Next Round: <strong className="text-slate-900 dark:text-white">{app.nextRoundDate}</strong></span>
                            <span>Target CTC: <strong className="text-indigo-600 dark:text-indigo-400">{app.expectedCtc}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Rejections / Regrets */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Rejections & Feedback Trail ({student.rejectedApplications.length})
                  </h3>
                </div>

                {student.rejectedApplications.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center">
                    Zero application rejections on record.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {student.rejectedApplications.map(rej => (
                      <div 
                        key={rej.id}
                        className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                              {rej.companyLogo}
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">{rej.company}</span>
                              <span className="text-slate-400"> — {rej.role}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-semibold text-[11px]">
                              {rej.rejectedStage}
                            </span>
                            <span className="text-slate-400 text-[11px]">{rej.rejectionDate}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/40 text-slate-700 dark:text-slate-300">
                          <strong className="text-rose-800 dark:text-rose-400">Recruiter Feedback / Reason: </strong>
                          {rej.rejectionReason}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                All projects verified through automated Abstract Syntax Tree (AST) scanning and defense challenges.
              </div>

              <div className="space-y-4">
                {student.projects.map(proj => (
                  <div 
                    key={proj.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                          {proj.originalityScore}% Originality
                        </span>
                      </div>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {proj.techStack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links & Verification Audit Status */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <a 
                          href={proj.githubRepo} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>View Code Repo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {proj.liveDemo && (
                          <a 
                            href={proj.liveDemo} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Live Deployment</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{proj.codeDefenseStatus}</span>
                        <span>•</span>
                        <span>Verified on {proj.verifiedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Verified skill proficiencies backed by code contributions and peer verification.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.skillsList.map((skill, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        skill.proficiency === 'Expert' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' 
                          : skill.proficiency === 'Advance'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                      }`}>
                        {skill.proficiency}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Mastery Score</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{skill.score}/100</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${skill.score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{skill.verifiedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INTEGRITY & RISK AUDIT */}
          {activeTab === 'integrity' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Automated Academic Integrity Status
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    student.riskStatus === 'clean' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : student.riskStatus === 'suspicious'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {student.riskStatus.toUpperCase()}
                  </span>
                </div>

                {student.flagReason && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                    <strong>Flagged Alert: </strong> {student.flagReason}
                  </div>
                )}

                {student.delistReason && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200">
                    <strong>Delist Audit Note: </strong> {student.delistReason}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500">AST Plagiarism Check</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {100 - student.originalityScore}% similarity rate
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500">Resume Inflation ATS</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {student.resumeAtsScore} / 100 Score
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500">Live AI Code Defenses</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {student.codeDefensePassed} / {student.codeDefenseTotal} Passed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Student dossier synchronized across campus placement databases.
          </div>

          <div className="flex items-center gap-2">
            {student.isDelisted ? (
              <button
                onClick={handleRestoreConfirm}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Student Access</span>
              </button>
            ) : (
              <button
                onClick={() => setDelistPromptOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Delist / Flag Student</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>

      {/* Delist Confirmation Modal */}
      {delistPromptOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delist Student Account</h3>
                <p className="text-xs text-slate-500">Revoke hiring visibility and placement eligibility.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delist <strong>{student.name}</strong> ({student.rollNo})?
              Delisting restricts the student from appearing in campus drives and sharing certified badges.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Delisting:
              </label>
              <textarea
                value={delistReasonInput}
                onChange={(e) => setDelistReasonInput(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                placeholder="Specify violation or audit remarks..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDelistPromptOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelistConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirm Delist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
