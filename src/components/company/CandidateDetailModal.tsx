import React, { useState } from 'react';
import { Candidate } from '../../types';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Check, 
  UserX, 
  UserCheck,
  EyeOff,
  Eye,
  Award,
  Github,
  Globe,
  Mail,
  Linkedin,
  FolderGit2,
  Send,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { transmitCandidateSelectionToTpo } from '../../data/studentApplicationsStore';

interface CandidateDetailModalProps {
  candidate: Candidate;
  isBlindMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onSelectAndTransmit?: (candidate: Candidate, offerDetails: {
    role: string;
    packageOffered: string;
    postingLocation: string;
    offerType: string;
    placementYear: string;
    joiningDate: string;
  }) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isBlindMode: initialBlindMode,
  isOpen,
  onClose,
  onShortlist,
  onReject,
  onSelectAndTransmit,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'skills' | 'projects' | 'certificates' | 'resume'>('skills');
  const [revealIdentity, setRevealIdentity] = useState(false);
  
  // Offer transmission form state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerRole, setOfferRole] = useState(candidate.selectedRole || 'Full-Stack Software Engineer');
  const [offerPackage, setOfferPackage] = useState(candidate.selectedPackage || '₹24.0 LPA');
  const [offerLocation, setOfferLocation] = useState(candidate.postingLocation || 'Bengaluru, Karnataka (Hybrid)');
  const [offerType, setOfferType] = useState<'Direct On-Campus Hire' | 'Internship + PPO' | 'FTE'>('Direct On-Campus Hire');
  const [offerJoiningDate, setOfferJoiningDate] = useState('July 2026');
  const [offerBatch, setOfferBatch] = useState(candidate.year || '2026');
  const [isTransmitted, setIsTransmitted] = useState(candidate.status === 'selected');

  if (!isOpen) return null;

  // If candidate is already shortlisted or selected, or company clicks reveal, show actual identity
  const isBlind = initialBlindMode && !revealIdentity && candidate.status !== 'shortlisted' && candidate.status !== 'selected';
  const displayName = isBlind ? candidate.anonymousId : candidate.name;
  const displayCollege = isBlind ? 'Accredited Technical University (Redacted for Blind Screening)' : candidate.college;
  const displayRoll = isBlind ? 'REDACTED-ID' : (candidate.rollNumber || '21BCSE042');

  // Breakdown of verified vs self-proclaimed skills
  const verifiedSkillsList = candidate.skillsLearnedDetailed?.filter(s => s.verified) || 
    candidate.skillsBreakdown.filter(s => s.verified && !s.isSelfClaimed).map(s => ({
      name: s.name,
      level: 'Advanced',
      verified: true,
      score: s.score,
      howLearned: s.howLearned || 'Verified by AI Logic Defense & Code Audit'
    }));

  const selfProclaimedSkillsList = candidate.skillsLearnedDetailed?.filter(s => !s.verified) || 
    candidate.skillsBreakdown.filter(s => !s.verified || s.isSelfClaimed).map(s => ({
      name: s.name,
      level: 'Intermediate',
      verified: false,
      score: s.score,
      howLearned: s.howLearned || 'Self-claimed by student (Pending Code Audit)'
    }));

  const projectsList = candidate.projectsDetailed && candidate.projectsDetailed.length > 0 
    ? candidate.projectsDetailed 
    : [
        {
          id: 'p-default-1',
          title: 'High-Concurrency Real-Time Canvas Engine',
          techStack: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'Redis'],
          originalityScore: candidate.originalityScore || 92,
          logicDefenseScore: candidate.logicQnAScore || 95,
          status: 'passed' as const,
          summary: 'Engineered a conflict-free replicated data type (CRDT) collaborative state engine handling simultaneous multi-user stroke propagation with zero layout collisions.',
          githubUrl: candidate.links?.github || 'https://github.com/candidate-portfolio/collaborative-engine',
          demoUrl: candidate.links?.portfolio || 'https://collaborative-engine.app'
        },
        {
          id: 'p-default-2',
          title: 'Distributed Rate-Limited Microservices Gateway',
          techStack: ['TypeScript', 'Express', 'Redis', 'PostgreSQL', 'Docker'],
          originalityScore: 94,
          logicDefenseScore: 92,
          status: 'passed' as const,
          summary: 'Token bucket rate-limiting middleware capable of throttling 12,000 requests/sec with Redis distributed locks and atomic Lua scripts.',
          githubUrl: candidate.links?.github || 'https://github.com/candidate-portfolio/gateway-service'
        }
      ];

  const certificatesList = candidate.certificates && candidate.certificates.length > 0
    ? candidate.certificates
    : [
        {
          title: 'Meta Certified Frontend Developer Professional',
          issuer: 'Meta / Coursera',
          issueDate: 'May 2025',
          verified: true,
          credentialId: 'META-CERT-VERIFIED-9821'
        },
        {
          title: 'AWS Certified Cloud Practitioner (CLF-C02)',
          issuer: 'Amazon Web Services',
          issueDate: 'Jan 2026',
          verified: true,
          credentialId: 'AWS-VERIFIED-7712'
        }
      ];

  const handleConfirmTransmitOffer = (e: React.FormEvent) => {
    e.preventDefault();

    // Transmit directly to College TPO Placement Registry
    transmitCandidateSelectionToTpo({
      studentId: candidate.id,
      studentName: candidate.name,
      rollNumber: candidate.rollNumber || displayRoll,
      companyName: 'TechNova Solutions',
      role: offerRole,
      packageOffered: offerPackage,
      offerType: offerType,
      placementYear: offerBatch,
      branch: candidate.branch,
      cgpa: candidate.resumeHighlights.gpa.split(' ')[0] || '8.9',
      postingLocation: offerLocation,
      joiningDate: offerJoiningDate,
      avatar: candidate.avatar
    });

    if (onSelectAndTransmit) {
      onSelectAndTransmit(candidate, {
        role: offerRole,
        packageOffered: offerPackage,
        postingLocation: offerLocation,
        offerType: offerType,
        placementYear: offerBatch,
        joiningDate: offerJoiningDate
      });
    }

    setIsTransmitted(true);
    setIsOfferModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in my-6 max-h-[92vh] flex flex-col">
        
        {/* Header with Photo, Badges & Screening Status */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-indigo-900 text-white flex items-center justify-center text-xl font-bold shadow-sm overflow-hidden shrink-0 border-2 border-white dark:border-slate-700">
              {isBlind ? (
                <div className="flex flex-col items-center justify-center text-center p-1">
                  <EyeOff className="w-6 h-6 text-indigo-300" />
                  <span className="text-[9px] text-indigo-200 font-mono mt-0.5">ANON</span>
                </div>
              ) : (
                <img 
                  src={candidate.avatar} 
                  alt={candidate.name} 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {displayName}
                </h2>
                
                {/* Status Badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  candidate.status === 'selected' || isTransmitted
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : candidate.status === 'shortlisted'
                    ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                    : candidate.status === 'rejected'
                    ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                    : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                }`}>
                  {isTransmitted || candidate.status === 'selected' 
                    ? '✓ Selected (Offer Transmitted to TPO)' 
                    : candidate.status === 'shortlisted' 
                    ? '⭐ Shortlisted for Interview' 
                    : candidate.status === 'rejected' 
                    ? 'Rejected' 
                    : 'New Pipeline Candidate'}
                </span>

                {candidate.projectVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Project Logic Passed ✓</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{displayCollege}</span>
                <span>•</span>
                <span>{candidate.branch}</span>
                <span>•</span>
                <span className="font-mono font-semibold">Roll: {displayRoll}</span>
                <span>•</span>
                <span>Batch {candidate.year}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {initialBlindMode && (
              <button
                onClick={() => setRevealIdentity(!revealIdentity)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                title="Toggle blind screening for this candidate"
              >
                {revealIdentity ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealIdentity ? 'Hide Info' : 'Show Photo & Details'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlight Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 font-medium block">Job Match Score</span>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {candidate.matchScore}%
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 font-medium block">Originality Scan</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {candidate.originalityScore}%
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 font-medium block">AI Logic Defense</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {candidate.logicQnAScore}%
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 font-medium block">Skills Audit Ratio</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {verifiedSkillsList.length} <span className="text-xs font-semibold text-emerald-600">Verified</span> / {selfProclaimedSkillsList.length} <span className="text-xs font-semibold text-amber-500">Claimed</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Skills Learned ({verifiedSkillsList.length} Verified vs {selfProclaimedSkillsList.length} Self-Proclaimed)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('projects')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'projects'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects & Passed Status ({projectsList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'certificates'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Certificates & Links</span>
          </button>

          <button
            onClick={() => setActiveSubTab('resume')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'resume'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume & Summary</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: SKILLS LEARNED BREAKDOWN (VERIFIED VS SELF-PROCLAIMED) */}
          {activeSubTab === 'skills' && (
            <div className="space-y-6">
              {/* Informational banner */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-start gap-2.5 text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block">Verified vs Self-Proclaimed Skills Differentiation</span>
                  <p className="text-indigo-800 dark:text-indigo-300 mt-0.5">
                    Skills marked as <strong>Verified</strong> have successfully passed automated AST code analysis, AI logic defense rounds, and institutional lab benchmarks.
                    Skills marked as <strong>Self-Proclaimed</strong> have been claimed on the resume without audited code execution.
                  </p>
                </div>
              </div>

              {/* Group 1: Verified Skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Skills (Passed AI Logic Defense & AST Code Audit) — {verifiedSkillsList.length}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                    High Confidence
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verifiedSkillsList.map((skill) => (
                    <div 
                      key={skill.name}
                      className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {skill.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                            {skill.score}% Proficiency
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5">
                          {skill.howLearned}
                        </p>
                      </div>

                      <div className="w-full bg-emerald-100 dark:bg-emerald-950 h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${skill.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2: Self-Proclaimed Skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Self-Proclaimed Skills (Claimed on Resume • Awaiting Code Defense) — {selfProclaimedSkillsList.length}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
                    Unverified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selfProclaimedSkillsList.map((skill) => (
                    <div 
                      key={skill.name}
                      className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            {skill.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                            {skill.score}% Claimed
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                          {skill.howLearned}
                        </p>
                      </div>

                      <div className="w-full bg-amber-100 dark:bg-amber-950 h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${skill.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS BUILT & PASSED STATUS */}
          {activeSubTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Audited GitHub Projects & Proof-of-Work
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  All Active Projects Passed AST Logic Audit
                </span>
              </div>

              <div className="space-y-3.5">
                {projectsList.map((project) => {
                  const isPassed = project.status === 'passed';
                  return (
                    <div 
                      key={project.title}
                      className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              {project.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isPassed 
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            }`}>
                              {isPassed ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-rose-600" />}
                              <span>{isPassed ? 'PASSED CODE DEFENSE' : 'FLAGGED DUPLICATION'}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {project.techStack.map((tech) => (
                              <span 
                                key={tech} 
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Originality</span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400">{project.originalityScore}%</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Logic Defense</span>
                            <span className="font-black text-indigo-600 dark:text-indigo-400">{project.logicDefenseScore}%</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {project.summary}
                      </p>

                      {/* Action Links */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3 text-xs">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>View GitHub Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-400 hover:underline font-semibold"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Live Deployment</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES & LINKS */}
          {activeSubTab === 'certificates' && (
            <div className="space-y-6">
              {/* Certificates list */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                  Verified Industry Certificates & Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certificatesList.map((cert) => (
                    <div 
                      key={cert.title}
                      className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {cert.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Issued by <strong>{cert.issuer}</strong> • {cert.issueDate}
                      </p>
                      {cert.credentialId && (
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1">
                          ID: {cert.credentialId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Links */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                  Professional Profile Links & Handles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">GitHub Profile</span>
                    </div>
                    <a 
                      href={candidate.links?.github || `https://github.com/${candidate.name.toLowerCase().replace(' ', '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explore Repos</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">LinkedIn Network</span>
                    </div>
                    <a 
                      href={candidate.links?.linkedin || 'https://linkedin.com'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Personal Portfolio</span>
                    </div>
                    <a 
                      href={candidate.links?.portfolio || 'https://portfolio.dev'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-rose-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Institutional Email</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {candidate.links?.email || `${candidate.name.toLowerCase().replace(' ', '.')}@itjodhpur.ac.in`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESUME & EXECUTIVE SUMMARY */}
          {activeSubTab === 'resume' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Verified Resume Highlights & ATS Summary
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                    CGPA {candidate.resumeHighlights.gpa}
                  </span>
                </div>

                <blockquote className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{candidate.resumeHighlights.summary}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-slate-500">
                    Verified Proof Checkpoints: <strong>{candidate.resumeHighlights.verifiedCount} Total</strong>
                  </span>

                  <a 
                    href={candidate.resumeUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Official Resume (PDF)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shortlisted / Selected Status Banners */}
        {isTransmitted ? (
          <div className="mx-6 mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-xs text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Candidate Selected!</strong> Role: <strong>{offerRole}</strong> • CTC: <strong>{offerPackage}</strong> • Location: <strong>{offerLocation}</strong> (Data Transmitted to College TPO)
              </span>
            </div>
            <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-300">TPO Synchronized</span>
          </div>
        ) : candidate.status === 'shortlisted' ? (
          <div className="mx-6 mb-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 flex items-center justify-between text-xs text-purple-950 dark:text-purple-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                <strong>Shortlisted for Interview Round.</strong> In TPO&apos;s Applied & Selected section, this candidate is marked as <strong>Shortlisted</strong>.
              </span>
            </div>
            <span className="font-bold text-[11px] text-purple-700 dark:text-purple-300">Ready for Offer</span>
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Candidate Pipeline Status: <strong className="capitalize text-slate-800 dark:text-slate-200">{isTransmitted ? 'Selected' : candidate.status}</strong>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* If not shortlisted yet: show shortlist & reject */}
            {candidate.status !== 'shortlisted' && !isTransmitted && candidate.status !== 'selected' && (
              <>
                <button
                  onClick={() => {
                    onReject(candidate.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => {
                    onShortlist(candidate.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Shortlist for Interview</span>
                </button>
              </>
            )}

            {/* If shortlisted: Company can proceed to select candidate and transmit offer to TPO */}
            {(candidate.status === 'shortlisted' || isTransmitted) && (
              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isTransmitted ? 'Update / Re-transmit Offer' : 'Select Candidate & Transmit Offer to TPO'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Transmit Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={candidate.avatar} 
                  alt={candidate.name} 
                  className="w-10 h-10 rounded-xl object-cover border" 
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Select Candidate: {candidate.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Roll: {candidate.rollNumber || '21BCSE042'} • {candidate.branch}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmTransmitOffer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Offered Role Designation:
                  </label>
                  <input
                    type="text"
                    value={offerRole}
                    onChange={(e) => setOfferRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Package (CTC in LPA):
                  </label>
                  <input
                    type="text"
                    value={offerPackage}
                    onChange={(e) => setOfferPackage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 font-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Posting Location:
                </label>
                <input
                  type="text"
                  value={offerLocation}
                  onChange={(e) => setOfferLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka (Hybrid)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Offer Type:
                  </label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Direct On-Campus Hire">Direct On-Campus Hire</option>
                    <option value="Internship + PPO">Internship + PPO</option>
                    <option value="FTE">Full-Time Employee (FTE)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Joining Date:
                  </label>
                  <input
                    type="text"
                    value={offerJoiningDate}
                    onChange={(e) => setOfferJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 dark:text-emerald-200">
                  This selection will immediately update the student&apos;s status to <strong>Selected</strong> and transmit their package (<strong>{offerPackage}</strong>), role (<strong>{offerRole}</strong>), and location (<strong>{offerLocation}</strong>) to the College TPO Placement Registry.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm & Transmit to College TPO</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

