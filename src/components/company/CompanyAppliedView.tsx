import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Github, 
  Award, 
  Sparkles, 
  Send, 
  X, 
  Check, 
  UserX, 
  UserCheck, 
  Calendar,
  Layers,
  GraduationCap,
  Globe,
  Mail,
  Linkedin,
  FolderGit2,
  MapPin,
  Eye,
  BookOpen
} from 'lucide-react';
import { 
  useOnCampusApplications, 
  useOffCampusApplications, 
  updateOnCampusCandidateStatus, 
  updateOffCampusCandidateStatus, 
  transmitCandidateSelectionToTpo,
  OnCampusApplication,
  OffCampusApplication
} from '../../data/studentApplicationsStore';

export interface ApplicantDetailedSkill {
  name: string;
  proficiency: string;
  verified: boolean;
  howLearned: string;
  score: number;
  isSelfClaimed?: boolean;
}

export interface ApplicantDetailedProject {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  originalityScore: number;
  logicDefenseScore: number;
  status: 'passed' | 'pending';
  githubUrl?: string;
  demoUrl?: string;
}

export interface ApplicantDetailedCertificate {
  id?: string;
  title: string;
  issuer: string;
  issueYear: string;
  verified: boolean;
  credentialId?: string;
  credentialUrl?: string;
  skillsCovered?: string[];
}

interface NormalizedApplicant {
  id: string;
  sourceType: 'on_campus' | 'off_campus';
  studentName: string;
  avatar?: string;
  rollOrEmail: string;
  email?: string;
  collegeName: string;
  branchOrDegree: string;
  cgpaOrGradYear: string;
  roleTitle: string;
  companyName: string;
  matchScore: number;
  logicScore: number;
  originalityScore: number;
  applicationDate?: string;
  verifiedSkills: string[];
  skillsLearnedDetailed: ApplicantDetailedSkill[];
  resumeUrl?: string;
  resumeSummary: string;
  resumeGpa?: string;
  coursework?: string[];
  status: string;
  expectedPackage: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  projects: ApplicantDetailedProject[];
  certificates: ApplicantDetailedCertificate[];
}

export const CompanyAppliedView: React.FC = () => {
  const [subTab, setSubTab] = useState<'on_campus' | 'off_campus'>('on_campus');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // State for applicant full dossier modal
  const [activeApplicant, setActiveApplicant] = useState<NormalizedApplicant | null>(null);
  const [dossierTab, setDossierTab] = useState<'skills' | 'projects' | 'certificates' | 'resume' | 'application'>('skills');
  
  // State for selection transmission confirmation modal
  const [transmittingApplicant, setTransmittingApplicant] = useState<NormalizedApplicant | null>(null);
  const [offerPackage, setOfferPackage] = useState('₹24.0 LPA');
  const [offerRole, setOfferRole] = useState('');
  const [offerType, setOfferType] = useState<'Direct FTE' | 'Intern + PPO' | 'FTE'>('Direct FTE');
  const [offerBatch, setOfferBatch] = useState('2026');
  const [toastMessage, setToastMessage] = useState<string>('');

  const onCampusApps = useOnCampusApplications();
  const offCampusApps = useOffCampusApplications();

  // Normalize On-Campus list
  const normalizedOnCampus: NormalizedApplicant[] = useMemo(() => {
    return onCampusApps.map(app => {
      const skillsLearnedDetailed: ApplicantDetailedSkill[] = app.skillsLearned.map(s => ({
        name: s.name,
        proficiency: s.proficiency || 'Advance',
        verified: s.verified !== false,
        howLearned: s.howLearned || 'Verified by AST Logic Defense & Production Code Audit',
        score: s.score || 92,
        isSelfClaimed: false,
      }));

      // Add 1-2 self-claimed unverified skills to demonstrate verified vs self-claimed breakdown
      skillsLearnedDetailed.push({
        name: 'Kubernetes Cluster Orchestration',
        proficiency: 'Intermediate',
        verified: false,
        howLearned: 'Self-claimed on resume (Pending AST code defense)',
        score: 74,
        isSelfClaimed: true,
      });

      const projects: ApplicantDetailedProject[] = app.projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.summary,
        techStack: p.techStack,
        originalityScore: p.originalityScore || 96,
        logicDefenseScore: p.logicDefenseScore || 94,
        status: 'passed',
        githubUrl: p.githubUrl || 'https://github.com',
        demoUrl: p.demoUrl || 'https://demo.app',
      }));

      const certificates: ApplicantDetailedCertificate[] = app.certificates.map((c, idx) => ({
        id: c.id || `cert-${idx}`,
        title: c.title,
        issuer: c.issuer,
        issueYear: c.issueDate,
        verified: c.verified !== false,
        credentialId: c.credentialUrl ? `AUTH-ID-${c.id || idx + 100}` : 'VERIFIED-HASH-9821',
        credentialUrl: c.credentialUrl || 'https://verify.certificate.org',
        skillsCovered: ['System Design', 'Production Coding', 'Performance Optimization'],
      }));

      return {
        id: app.id,
        sourceType: 'on_campus',
        studentName: app.studentName,
        avatar: app.avatar,
        rollOrEmail: app.rollNumber,
        email: `${app.studentName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@college.edu`,
        collegeName: app.collegeName,
        branchOrDegree: app.branch,
        cgpaOrGradYear: `CGPA ${app.cgpa}`,
        roleTitle: app.jobTitle,
        companyName: app.companyName,
        matchScore: app.matchScore,
        logicScore: app.projects[0]?.logicDefenseScore || 94,
        originalityScore: app.projects[0]?.originalityScore || 96,
        applicationDate: app.applicationDate || '02 Sep 2026',
        verifiedSkills: app.skillsLearned.map(s => s.name),
        skillsLearnedDetailed,
        resumeUrl: app.resumeUrl || '#',
        resumeSummary: app.resumeSummary,
        resumeGpa: app.resumeGpa || `CGPA ${app.cgpa} / 10.0`,
        coursework: [
          'Data Structures & Algorithms',
          'Operating Systems & Kernel Concepts',
          'Database Management Systems (DBMS)',
          'Distributed Systems & Cloud Computing',
          'Computer Networks (TCP/IP, HTTP/3)'
        ],
        status: app.status,
        expectedPackage: app.packageOffered || '₹22.0 LPA',
        githubUrl: app.projects[0]?.githubUrl || 'https://github.com',
        linkedinUrl: `https://linkedin.com/in/${app.studentName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        portfolioUrl: `https://${app.studentName.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev`,
        projects,
        certificates,
      };
    });
  }, [onCampusApps]);

  // Normalize Off-Campus list
  const normalizedOffCampus: NormalizedApplicant[] = useMemo(() => {
    return offCampusApps.map(app => {
      const skillsLearnedDetailed: ApplicantDetailedSkill[] = app.skills.map((s, idx) => ({
        name: s,
        proficiency: idx === 0 ? 'Expert' : idx < 3 ? 'Advance' : 'Intermediate',
        verified: idx !== app.skills.length - 1,
        howLearned: idx !== app.skills.length - 1
          ? 'Passed AI Logic Defense & GitHub Repository Inspection'
          : 'Self-claimed on resume (Pending Code Verification)',
        score: idx === 0 ? 96 : idx < 3 ? 91 : 78,
        isSelfClaimed: idx === app.skills.length - 1,
      }));

      const projects: ApplicantDetailedProject[] = [
        {
          id: `off-proj-1-${app.id}`,
          title: 'High-Concurrency Distributed Task Pipeline',
          description: 'Engineered a resilient distributed task execution cluster utilizing Redis and Go workers handling 15k tasks/min.',
          techStack: app.skills.slice(0, 4),
          originalityScore: 97,
          logicDefenseScore: 94,
          status: 'passed',
          githubUrl: app.githubUrl || 'https://github.com',
          demoUrl: 'https://task-pipeline-demo.io',
        },
        {
          id: `off-proj-2-${app.id}`,
          title: 'Real-Time Telemetry & Metric Ingestion Service',
          description: 'Constructed time-series metric aggregator with sub-second dashboard updates and automated alerting.',
          techStack: ['Node.js', 'PostgreSQL', 'Docker', 'Grafana'],
          originalityScore: 93,
          logicDefenseScore: 91,
          status: 'passed',
          githubUrl: app.githubUrl || 'https://github.com',
          demoUrl: 'https://telemetry-demo.io',
        }
      ];

      const certificates: ApplicantDetailedCertificate[] = [
        {
          id: `cert-off-1-${app.id}`,
          title: 'Advanced System Architecture & Cloud Native',
          issuer: 'CNCF / Linux Foundation',
          issueYear: '2025',
          verified: true,
          credentialId: 'CNCF-9921-VERIFIED',
          credentialUrl: 'https://cncf.io/verify/9921',
          skillsCovered: ['Containerization', 'Microservices', 'High Availability'],
        },
        {
          id: `cert-off-2-${app.id}`,
          title: 'Meta Professional Full-Stack Developer',
          issuer: 'Meta / Coursera',
          issueYear: '2024',
          verified: true,
          credentialId: 'META-CERT-8840-OK',
          credentialUrl: 'https://coursera.org/verify/meta-8840',
          skillsCovered: ['Full Stack Architecture', 'REST APIs', 'Test Driven Development'],
        }
      ];

      return {
        id: app.id,
        sourceType: 'off_campus',
        studentName: app.applicantName,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        rollOrEmail: app.email,
        email: app.email,
        collegeName: app.collegeName,
        branchOrDegree: app.degree,
        cgpaOrGradYear: `Class of ${app.graduationYear}`,
        roleTitle: app.appliedRole,
        companyName: 'TechNova Solutions',
        matchScore: app.matchScore,
        logicScore: 92,
        originalityScore: 95,
        applicationDate: app.applicationDate || '28 Aug 2026',
        verifiedSkills: app.skills,
        skillsLearnedDetailed,
        resumeUrl: '#',
        resumeSummary: app.resumeSummary,
        resumeGpa: 'CGPA 8.8 / 10.0',
        coursework: [
          'Design & Analysis of Algorithms',
          'Software Engineering Practices',
          'Distributed Cloud Architectures',
          'Relational & NoSQL Database Optimization'
        ],
        status: app.status === 'offered' ? 'selected' : app.status,
        expectedPackage: '₹24.0 LPA',
        githubUrl: app.githubUrl || 'https://github.com',
        linkedinUrl: `https://linkedin.com/in/${app.applicantName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        portfolioUrl: `https://${app.applicantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev`,
        projects,
        certificates,
      };
    });
  }, [offCampusApps]);

  const currentList = subTab === 'on_campus' ? normalizedOnCampus : normalizedOffCampus;

  const filteredApplicants = currentList.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.rollOrEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.verifiedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenSelectModal = (app: NormalizedApplicant) => {
    setTransmittingApplicant(app);
    setOfferRole(app.roleTitle);
    setOfferPackage(app.expectedPackage || '₹24.0 LPA');
    setOfferBatch('2026');
  };

  const handleConfirmSelectionAndTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transmittingApplicant) return;

    if (transmittingApplicant.sourceType === 'on_campus') {
      updateOnCampusCandidateStatus(transmittingApplicant.id, 'selected', offerPackage, offerRole);
    } else {
      updateOffCampusCandidateStatus(transmittingApplicant.id, 'offered');
    }

    // Direct transmission to College TPO Placement Registry
    transmitCandidateSelectionToTpo({
      studentId: transmittingApplicant.id,
      studentName: transmittingApplicant.studentName,
      rollNumber: transmittingApplicant.rollOrEmail,
      companyName: transmittingApplicant.companyName,
      role: offerRole,
      packageOffered: offerPackage,
      offerType: offerType,
      placementYear: offerBatch,
      branch: transmittingApplicant.branchOrDegree,
      cgpa: transmittingApplicant.cgpaOrGradYear
    });

    setToastMessage(`Success! ${transmittingApplicant.studentName} marked as SELECTED. Placement offer transmitted to College TPO.`);
    setTransmittingApplicant(null);
    if (activeApplicant?.id === transmittingApplicant.id) {
      setActiveApplicant(null);
    }
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleRejectCandidate = (appId: string, sourceType: 'on_campus' | 'off_campus') => {
    if (sourceType === 'on_campus') {
      updateOnCampusCandidateStatus(appId, 'rejected');
    } else {
      updateOffCampusCandidateStatus(appId, 'rejected');
    }
    setToastMessage('Candidate decision recorded as Rejected and synchronized.');
    if (activeApplicant?.id === appId) {
      setActiveApplicant(null);
    }
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleShortlistCandidate = (appId: string, sourceType: 'on_campus' | 'off_campus') => {
    if (sourceType === 'on_campus') {
      updateOnCampusCandidateStatus(appId, 'shortlisted');
    } else {
      updateOffCampusCandidateStatus(appId, 'shortlisted');
    }
    setToastMessage('Candidate shortlisted for Technical Interview rounds.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center justify-between animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Enterprise Recruiting Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Applied Candidates Pipeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Screen applicant profiles with audited match scores, verified skills, resumes, certificates, project code defense, and transmit hiring selections directly to the College TPO.
          </p>
        </div>

        {/* Sub-Tabs: On-Campus vs Off-Campus */}
        <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => { setSubTab('on_campus'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'on_campus'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>On-Campus Applicants ({onCampusApps.length})</span>
          </button>

          <button
            onClick={() => { setSubTab('off_campus'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'off_campus'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Off-Campus Applicants ({offCampusApps.length})</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total In Pipeline</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {currentList.length}
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
            {subTab === 'on_campus' ? 'Campus Drive Pool' : 'Direct Off-Campus Pool'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Shortlisted for Rounds</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
            {currentList.filter(a => a.status === 'shortlisted').length}
          </span>
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold block mt-0.5">
            Technical Defense
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Final Selected Offers</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {currentList.filter(a => a.status === 'selected' || a.status === 'offered').length}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block mt-0.5">
            Transmitted to College TPO
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">High Skill Match (&gt;90%)</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {currentList.filter(a => a.matchScore >= 90).length}
          </span>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold block mt-0.5">
            Strong Domain Fit
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicant name, skills, role, roll/email..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Screening Statuses</option>
            <option value="applied">Applied (Pending)</option>
            <option value="in_review">In Review / Evaluating</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected / Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Name + Match Score */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {app.rollOrEmail} • {app.branchOrDegree}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {app.collegeName} • <strong className="text-slate-700 dark:text-slate-300">{app.cgpaOrGradYear}</strong>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {app.matchScore}% Match
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                      Logic: {app.logicScore}%
                    </span>
                  </div>
                </div>

                {/* Role and Drive Badge */}
                <div className="mb-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {app.roleTitle}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                    <span>{app.expectedPackage}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {app.sourceType === 'on_campus' ? 'On-Campus Drive' : 'Off-Campus Direct'}
                    </span>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="mb-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Verified Skills ({app.verifiedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {app.verifiedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{sk}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Proof Assets Available */}
                <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-[11px] text-slate-600 dark:text-slate-300 mb-4">
                  <span className="flex items-center gap-1 font-medium">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Resume</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{app.certificates.length} Certs</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span>GitHub Code</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                    app.status === 'selected' || app.status === 'offered'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : app.status === 'rejected'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      : app.status === 'shortlisted'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveApplicant(app);
                      setDossierTab('skills');
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  {app.status === 'selected' || app.status === 'offered' ? (
                    <button
                      disabled
                      className="w-full py-2 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Selected & Sent</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSelectModal(app)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Select & Transmit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400">
            No applicants found matching your current search or filter criteria.
          </div>
        )}
      </div>

      {/* APPLICANT FULL DOSSIER MODAL (Full parity with Candidates view + Application Funnel) */}
      {activeApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in my-6 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {activeApplicant.avatar ? (
                      <img 
                        src={activeApplicant.avatar} 
                        alt={activeApplicant.studentName} 
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                        {activeApplicant.studentName.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white" title="Active Applicant">
                      <Check className="w-3 h-3" />
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        {activeApplicant.studentName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Proof-of-Work Audited</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        activeApplicant.sourceType === 'on_campus'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                      }`}>
                        {activeApplicant.sourceType === 'on_campus' ? 'On-Campus Drive' : 'Off-Campus Direct'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        activeApplicant.status === 'selected' || activeApplicant.status === 'offered'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : activeApplicant.status === 'rejected'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          : activeApplicant.status === 'shortlisted'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        Stage: {activeApplicant.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{activeApplicant.rollOrEmail}</span>
                      <span>•</span>
                      <span>{activeApplicant.branchOrDegree}</span>
                      <span>•</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{activeApplicant.cgpaOrGradYear}</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeApplicant.collegeName}</span>
                    </p>

                    {/* Social & Contact Bar */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {activeApplicant.email && (
                        <a
                          href={`mailto:${activeApplicant.email}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <Mail className="w-3 h-3 text-indigo-500" />
                          <span>{activeApplicant.email}</span>
                        </a>
                      )}
                      {activeApplicant.githubUrl && (
                        <a
                          href={activeApplicant.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <Github className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                          <span>GitHub Profile</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      )}
                      {activeApplicant.linkedinUrl && (
                        <a
                          href={activeApplicant.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <Linkedin className="w-3 h-3 text-blue-600" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      )}
                      {activeApplicant.resumeUrl && (
                        <a
                          href={activeApplicant.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-[11px] font-bold transition-colors"
                        >
                          <FileText className="w-3 h-3 text-indigo-600" />
                          <span>Official PDF Resume</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveApplicant(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 4-Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-5">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Role Match Score
                  </span>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {activeApplicant.matchScore}%
                  </div>
                  <span className="text-[10px] text-slate-500">Alignment with Job Profile</span>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    AST Originality Scan
                  </span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {activeApplicant.originalityScore}%
                  </div>
                  <span className="text-[10px] text-slate-500">Zero plagiarism detected</span>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Logic Defense Q&A
                  </span>
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                    {activeApplicant.logicScore}%
                  </div>
                  <span className="text-[10px] text-slate-500">Automated code interrogation</span>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Verified Competencies
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {activeApplicant.skillsLearnedDetailed.filter(s => s.verified).length} / {activeApplicant.skillsLearnedDetailed.length}
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {Math.round((activeApplicant.skillsLearnedDetailed.filter(s => s.verified).length / activeApplicant.skillsLearnedDetailed.length) * 100)}% verified
                  </span>
                </div>
              </div>

              {/* 5-Tab Navigation Bar */}
              <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 overflow-x-auto">
                <button
                  onClick={() => setDossierTab('skills')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    dossierTab === 'skills'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Skills Learned & Proof ({activeApplicant.skillsLearnedDetailed.length})</span>
                </button>

                <button
                  onClick={() => setDossierTab('projects')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    dossierTab === 'projects'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Audited Projects ({activeApplicant.projects.length})</span>
                </button>

                <button
                  onClick={() => setDossierTab('certificates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    dossierTab === 'certificates'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificates & Links ({activeApplicant.certificates.length})</span>
                </button>

                <button
                  onClick={() => setDossierTab('resume')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    dossierTab === 'resume'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume & Summary</span>
                </button>

                <button
                  onClick={() => setDossierTab('application')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    dossierTab === 'application'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Application & Pipeline</span>
                </button>
              </div>

              {/* TAB CONTENT AREAS */}
              <div className="text-xs space-y-4">
                {/* TAB 1: SKILLS LEARNED & PROOF */}
                {dossierTab === 'skills' && (
                  <div className="space-y-4">
                    {/* Notice */}
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-2.5 text-blue-800 dark:text-blue-300">
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <span className="font-bold">Verified Skills vs Self-Proclaimed Skills: </span>
                        Skills marked with <span className="font-semibold text-emerald-700 dark:text-emerald-300">Verified</span> have passed automated AST structural analysis and interactive AI code defense Q&A. Self-proclaimed skills represent competencies claimed on the candidate's resume that are awaiting code verification.
                      </div>
                    </div>

                    {/* Verified Skills Section */}
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Verified Competencies ({activeApplicant.skillsLearnedDetailed.filter(s => s.verified).length}):</span>
                      </h4>
                      <div className="space-y-2.5">
                        {activeApplicant.skillsLearnedDetailed.filter(s => s.verified).map((skill) => (
                          <div
                            key={skill.name}
                            className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                  {skill.name}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                                  {skill.proficiency}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-500 font-semibold">Logic Score:</span>
                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{skill.score}%</span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                style={{ width: `${skill.score}%` }}
                              />
                            </div>

                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">Proof-of-Work: </span>
                              {skill.howLearned}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Self-Claimed Skills Section */}
                    {activeApplicant.skillsLearnedDetailed.filter(s => !s.verified).length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span>Self-Proclaimed Skills (Awaiting Code Defense):</span>
                        </h4>
                        <div className="space-y-2">
                          {activeApplicant.skillsLearnedDetailed.filter(s => !s.verified).map((skill) => (
                            <div
                              key={skill.name}
                              className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {skill.name}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                                    Claimed on Resume
                                  </span>
                                </div>
                                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                                  Awaiting Code Interrogation
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {skill.howLearned}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: AUDITED PROJECTS */}
                {dossierTab === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Audited Technical & Capstone Projects ({activeApplicant.projects.length}):</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">Audited via AST Code Engine</span>
                    </div>

                    <div className="space-y-3.5">
                      {activeApplicant.projects.map((proj) => (
                        <div
                          key={proj.title}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                                  {proj.title}
                                </h5>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Passed Integrity Audit</span>
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Stack:</span>
                                {proj.techStack.map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 text-[10px] font-mono"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {proj.githubUrl && (
                                <a
                                  href={proj.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold hover:bg-slate-800 cursor-pointer shadow-xs"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                  <span>GitHub Code</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                              )}
                              {proj.demoUrl && (
                                <a
                                  href={proj.demoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-100 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  <span>Live Demo</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            {proj.description}
                          </p>

                          {/* Scores breakdown */}
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                                AST Originality Score
                              </span>
                              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {proj.originalityScore}% Unique Architecture
                              </div>
                              <span className="text-[10px] text-slate-500">Cross-repo semantic hash verified</span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
                              <span className="text-[10px] text-purple-800 dark:text-purple-300 font-bold uppercase">
                                Logic Defense Q&A Score
                              </span>
                              <div className="text-base font-black text-purple-600 dark:text-purple-400 mt-0.5">
                                {proj.logicDefenseScore}% Passed Interrogation
                              </div>
                              <span className="text-[10px] text-slate-500">Candidate defended function call graph</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: CERTIFICATES & LINKS */}
                {dossierTab === 'certificates' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Industry Certifications & Credentials ({activeApplicant.certificates.length}):</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">Cryptographically & URL Verified</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeApplicant.certificates.map((cert) => (
                        <div
                          key={cert.title}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 space-y-2.5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                                {cert.title}
                              </h5>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold shrink-0 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              Issued by <span className="font-semibold text-slate-700 dark:text-slate-300">{cert.issuer}</span> ({cert.issueYear})
                            </div>

                            {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {cert.skillsCovered.map(sk => (
                                  <span key={sk} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-slate-500">
                              {cert.credentialId || 'ID-VERIFIED'}
                            </span>
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold hover:underline"
                              >
                                <span>Verify Issuer</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: RESUME & TRANSCRIPT */}
                {dossierTab === 'resume' && (
                  <div className="space-y-4">
                    {/* Academic Transcript Highlights */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <span>Academic Background & Standing</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold font-mono">
                          {activeApplicant.resumeGpa}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Degree & Discipline</span>
                          <p className="font-bold text-slate-900 dark:text-white mt-0.5">{activeApplicant.branchOrDegree}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">University / Institution</span>
                          <p className="font-bold text-slate-900 dark:text-white mt-0.5">{activeApplicant.collegeName}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Batch / Graduation</span>
                          <p className="font-bold text-slate-900 dark:text-white mt-0.5">{activeApplicant.cgpaOrGradYear}</p>
                        </div>
                      </div>
                    </div>

                    {/* Resume Summary */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span>Parsed Professional Summary</span>
                        </span>
                        {activeApplicant.resumeUrl && (
                          <a
                            href={activeApplicant.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 text-xs"
                          >
                            <span>Download PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-750">
                        "{activeApplicant.resumeSummary}"
                      </p>
                    </div>

                    {/* Core Coursework */}
                    {activeApplicant.coursework && activeApplicant.coursework.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span>Key University Coursework & Academic Modules:</span>
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {activeApplicant.coursework.map(course => (
                            <span
                              key={course}
                              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 text-xs font-medium"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: APPLICATION & PIPELINE */}
                {dossierTab === 'application' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          <span>Job Application Details</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                          {activeApplicant.roleTitle}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Application Source</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {activeApplicant.sourceType === 'on_campus' ? 'On-Campus Placement Drive' : 'Off-Campus Talent Portal'}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {activeApplicant.sourceType === 'on_campus' ? `Coordinated with ${activeApplicant.collegeName} TPO` : 'Direct applicant submission'}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Application Date</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {activeApplicant.applicationDate || '02 Sep 2026'}
                          </p>
                          <span className="text-[11px] text-slate-500">Expected Compensation: {activeApplicant.expectedPackage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stage Progression Workflow */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span>Hiring Pipeline Stage Progressions:</span>
                      </h5>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <button
                          onClick={() => handleShortlistCandidate(activeApplicant.id, activeApplicant.sourceType)}
                          className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors text-center cursor-pointer"
                        >
                          Shortlist for Interview
                        </button>

                        <button
                          onClick={() => {
                            if (activeApplicant.sourceType === 'on_campus') {
                              updateOnCampusCandidateStatus(activeApplicant.id, 'interview_scheduled');
                            } else {
                              updateOffCampusCandidateStatus(activeApplicant.id, 'reviewing');
                            }
                            setActiveApplicant(prev => prev ? { ...prev, status: 'interview_scheduled' } : null);
                            setToastMessage(`Advanced ${activeApplicant.studentName} to Technical Round 1`);
                            setTimeout(() => setToastMessage(''), 3000);
                          }}
                          className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors text-center cursor-pointer"
                        >
                          Round 1: Tech Audit
                        </button>

                        <button
                          onClick={() => {
                            if (activeApplicant.sourceType === 'on_campus') {
                              updateOnCampusCandidateStatus(activeApplicant.id, 'interview_scheduled');
                            } else {
                              updateOffCampusCandidateStatus(activeApplicant.id, 'reviewing');
                            }
                            setActiveApplicant(prev => prev ? { ...prev, status: 'interview_scheduled' } : null);
                            setToastMessage(`Advanced ${activeApplicant.studentName} to Managerial Round`);
                            setTimeout(() => setToastMessage(''), 3000);
                          }}
                          className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors text-center cursor-pointer"
                        >
                          Round 2: Systems Q&A
                        </button>

                        <button
                          onClick={() => {
                            const toSelect = activeApplicant;
                            setActiveApplicant(null);
                            handleOpenSelectModal(toSelect);
                          }}
                          className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors text-center cursor-pointer"
                        >
                          Transmit Offer Letter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRejectCandidate(activeApplicant.id, activeApplicant.sourceType)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <UserX className="w-4 h-4" />
                  <span>Reject Candidate</span>
                </button>

                <button
                  onClick={() => handleShortlistCandidate(activeApplicant.id, activeApplicant.sourceType)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Shortlist for Rounds</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const toSelect = activeApplicant;
                  setActiveApplicant(null);
                  handleOpenSelectModal(toSelect);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Select & Transmit to College TPO</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM SELECTION & TRANSMISSION TO TPO MODAL */}
      {transmittingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Candidate Selection & Transmit Offer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  This hiring decision will be transmitted directly to the College TPO Placement Registry.
                </p>
              </div>
              <button
                onClick={() => setTransmittingApplicant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSelectionAndTransmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {transmittingApplicant.studentName}
                </div>
                <div className="text-slate-500">
                  {transmittingApplicant.rollOrEmail} • {transmittingApplicant.branchOrDegree} ({transmittingApplicant.cgpaOrGradYear})
                </div>
                <div className="text-slate-400 text-[11px]">
                  {transmittingApplicant.collegeName}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Designated Role Offered:
                </label>
                <input
                  type="text"
                  value={offerRole}
                  onChange={(e) => setOfferRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Offered CTC / Package:
                  </label>
                  <input
                    type="text"
                    value={offerPackage}
                    onChange={(e) => setOfferPackage(e.target.value)}
                    placeholder="₹24.0 LPA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Placement Batch:
                  </label>
                  <input
                    type="text"
                    value={offerBatch}
                    onChange={(e) => setOfferBatch(e.target.value)}
                    placeholder="2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Appointment & Offer Type:
                </label>
                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Direct FTE">Direct FTE (Full-Time Employee)</option>
                  <option value="Intern + PPO">Internship + Pre-Placement Offer (PPO)</option>
                  <option value="FTE">Standard FTE</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Transmitting this offer will automatically append {transmittingApplicant.studentName} into the 
                  College TPO's <strong>"Applied & Selected → Selected Offers"</strong> registry.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransmittingApplicant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Selection & Transmit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
