import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ExternalLink,
  Award,
  BookOpen,
  Eye,
  Ban,
  RotateCcw,
  Shield,
  Code2,
  FileCheck,
  Sparkles,
  Info,
  Building,
  GraduationCap,
  LayoutGrid,
  List,
  CheckCircle
} from 'lucide-react';

export interface AdminStudentsViewProps {
  initialSubTab?: 'all-students' | 'student-verification' | 'suspicious-profiles' | 'resume-issues' | 'risk-alerts';
  subTab?: 'all-students' | 'student-verification' | 'suspicious-profiles' | 'resume-issues' | 'risk-alerts';
  onNavigateTab?: (tab: string) => void;
}

import { AdminStudentDetailModal } from './AdminStudentDetailModal';

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  cgpa: string;
  skillsVerified: number;
  skillsList: string[];
  originalityScore: number;
  isDelisted: boolean;
  delistReason?: string;
  riskStatus: 'clean' | 'suspicious' | 'delisted';
  flagReason?: string;
  riskType?: 'ast_plagiarism' | 'fake_cert' | 'resume_inflation' | 'bot_activity';
  avatar: string;
  githubRepo?: string;
  resumeAtsScore: number;
  codeDefensePassed: number;
  codeDefenseTotal: number;
}

const initialStudents: StudentRecord[] = [
  {
    id: 'STU101',
    name: 'Harshit Seth',
    email: 'harshit.s@itj.ac.in',
    college: 'IIT Jodhpur',
    degree: 'B.Tech CSE 2026',
    cgpa: '9.2',
    skillsVerified: 12,
    skillsList: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'System Design', 'TypeScript', 'Redis', 'Python'],
    originalityScore: 94,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'HS',
    githubRepo: 'github.com/harshitseth/cloud-cache-proxy',
    resumeAtsScore: 88,
    codeDefensePassed: 5,
    codeDefenseTotal: 5,
  },
  {
    id: 'STU102',
    name: 'Rahul Sharma',
    email: 'rahul.s@abc.edu',
    college: 'ABC University',
    degree: 'B.Tech IT 2025',
    cgpa: '7.8',
    skillsVerified: 6,
    skillsList: ['HTML', 'CSS', 'JavaScript', 'Django'],
    originalityScore: 42,
    isDelisted: false,
    riskStatus: 'suspicious',
    riskType: 'ast_plagiarism',
    flagReason: 'AST code similarity 78% with existing public repo; copied solution structure and variable names altered.',
    avatar: 'RS',
    githubRepo: 'github.com/rahul-s/e-commerce-backend-fork',
    resumeAtsScore: 62,
    codeDefensePassed: 1,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU103',
    name: 'Aman Kumar',
    email: 'aman.k@xyz.ac.in',
    college: 'XYZ Institute of Tech',
    degree: 'B.Tech CSE 2026',
    cgpa: '8.4',
    skillsVerified: 8,
    skillsList: ['Java', 'Spring Boot', 'MySQL', 'Kafka', 'REST APIs'],
    originalityScore: 88,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'AK',
    githubRepo: 'github.com/amank/event-driven-payment',
    resumeAtsScore: 82,
    codeDefensePassed: 4,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU104',
    name: 'Neha Singh',
    email: 'neha.singh@gec.edu',
    college: 'Global Engineering College',
    degree: 'B.Tech ECE 2025',
    cgpa: '8.9',
    skillsVerified: 9,
    skillsList: ['Python', 'FastAPI', 'Pandas', 'NumPy', 'TensorFlow Basics'],
    originalityScore: 91,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'NS',
    githubRepo: 'github.com/nehasingh/iot-telemetry-engine',
    resumeAtsScore: 90,
    codeDefensePassed: 4,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU105',
    name: 'Priya Verma',
    email: 'priya.v@pqr.ac.in',
    college: 'PQR University',
    degree: 'MCA 2025',
    cgpa: '7.4',
    skillsVerified: 4,
    skillsList: ['Python', 'C++'],
    originalityScore: 54,
    isDelisted: true,
    delistReason: 'Delisted by Admin: Self-claimed expert in PyTorch with zero commits & failed live defense challenge 3 times.',
    riskStatus: 'delisted',
    riskType: 'resume_inflation',
    flagReason: 'Skill defense failed 3 times; self-claimed expert in PyTorch without repo or demonstrable code.',
    avatar: 'PV',
    githubRepo: 'github.com/priyaverma/empty-playground',
    resumeAtsScore: 55,
    codeDefensePassed: 0,
    codeDefenseTotal: 3,
  },
  {
    id: 'STU106',
    name: 'Aman Yadav',
    email: 'aman.y@lmn.edu',
    college: 'LMN Technical University',
    degree: 'B.Tech CSE 2026',
    cgpa: '6.9',
    skillsVerified: 5,
    skillsList: ['Go', 'Docker', 'Linux'],
    originalityScore: 48,
    isDelisted: false,
    riskStatus: 'suspicious',
    riskType: 'fake_cert',
    flagReason: 'Fake certificate suspected: issuer cryptographic SHA-256 hash failed institutional verification check.',
    avatar: 'AY',
    githubRepo: 'github.com/ayadav/micro-agent',
    resumeAtsScore: 58,
    codeDefensePassed: 2,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU107',
    name: 'Sneha Patel',
    email: 'sneha.p@itj.ac.in',
    college: 'IIT Jodhpur',
    degree: 'B.Tech CSE 2026',
    cgpa: '9.5',
    skillsVerified: 11,
    skillsList: ['Rust', 'WebAssembly', 'C++', 'Algorithms', 'Distributed Systems'],
    originalityScore: 96,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'SP',
    githubRepo: 'github.com/snehap/wasm-matrix-engine',
    resumeAtsScore: 94,
    codeDefensePassed: 6,
    codeDefenseTotal: 6,
  },
];

export const AdminStudentsView: React.FC<AdminStudentsViewProps> = ({ 
  initialSubTab = 'all-students',
  subTab
}) => {
  const currentIncoming = subTab || initialSubTab;
  const isSuspiciousInitial = 
    currentIncoming === 'suspicious-profiles' || 
    currentIncoming === 'risk-alerts' || 
    currentIncoming === 'resume-issues';

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'suspicious'>(
    isSuspiciousInitial ? 'suspicious' : 'all'
  );
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [selectedStudentForData, setSelectedStudentForData] = useState<StudentRecord | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [delistingStudent, setDelistingStudent] = useState<StudentRecord | null>(null);
  const [customDelistReason, setCustomDelistReason] = useState('');

  // Sync state whenever navigation changes from sidebar!
  useEffect(() => {
    if (
      subTab === 'suspicious-profiles' || 
      subTab === 'risk-alerts' || 
      subTab === 'resume-issues'
    ) {
      setActiveSubTab('suspicious');
    } else if (subTab === 'all-students') {
      setActiveSubTab('all');
    }
  }, [subTab]);

  const filtered = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.degree.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeSubTab === 'suspicious') {
      return s.riskStatus === 'suspicious' || (s.riskStatus === 'delisted' && s.flagReason);
    }
    return true;
  });

  const handleOpenDelistModal = (student: StudentRecord) => {
    setDelistingStudent(student);
    setCustomDelistReason(student.flagReason ? `Violation: ${student.flagReason}` : 'Delisted by Administrator due to integrity audit.');
  };

  const handleConfirmDelist = () => {
    if (!delistingStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === delistingStudent.id) {
        return {
          ...s,
          isDelisted: true,
          riskStatus: 'delisted',
          delistReason: customDelistReason || 'Delisted by Administrator'
        };
      }
      return s;
    }));
    setActionNotice(`Delisted student: ${delistingStudent.name}. Platform access suspended.`);
    setDelistingStudent(null);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRestoreStudent = (student: StudentRecord) => {
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          isDelisted: false,
          riskStatus: s.flagReason ? 'suspicious' : 'clean',
          delistReason: undefined
        };
      }
      return s;
    }));
    setActionNotice(`Restored platform access for student: ${student.name}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleDismissAlert = (student: StudentRecord) => {
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          riskStatus: s.isDelisted ? 'delisted' : 'clean',
          flagReason: undefined,
          riskType: undefined
        };
      }
      return s;
    }));
    setActionNotice(`Dismissed risk alert for ${student.name} as false positive.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Student Directory & Data Explorer</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  12,450 Total Students
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin Data Portal: Inspect comprehensive student records, AST originality, and exercise delisting control.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, college, degree, email..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Admin Scope Notice */}
      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-indigo-900">Admin Operational Policy:</span> Student verification is automated via university TPO accreditation and AST code defense challenges. As an administrator, you have read access to all student records and the authority to <span className="font-semibold text-rose-700">delist / suspend</span> any non-compliant student across the network.
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Sub-Tabs & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Students ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('suspicious')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'suspicious'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
            <span>Suspicious Profiles & Risk Alerts</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeSubTab === 'suspicious' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
            }`}>
              {students.filter(s => s.riskStatus === 'suspicious' || (s.riskStatus === 'delisted' && s.flagReason)).length} Flagged
            </span>
          </button>
        </div>

        {/* View Mode Toggle: Cards vs Compact Table */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Executive Dossier Cards (Auto-Fit, Zero Horizontal Scroll)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dossier Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Auto-Fitting Compact Table"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Compact Table</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: EXECUTIVE DOSSIER CARDS (Responsive Grid, Zero Horizontal Scroll) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No students matching the current filter.
            </div>
          ) : (
            filtered.map(student => (
              <div
                key={student.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                  student.isDelisted
                    ? 'border-rose-200 bg-rose-50/20'
                    : student.riskStatus === 'suspicious'
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        student.isDelisted ? 'bg-rose-200 text-rose-800' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {student.avatar}
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedStudentForData(student)}
                          className="text-left font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer block leading-tight text-sm group"
                        >
                          <span className="group-hover:underline">{student.name}</span>
                        </button>
                        <div className="text-[11px] text-slate-400 mt-0.5">{student.email}</div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {student.isDelisted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                        <Ban className="w-3 h-3" />
                        Delisted
                      </span>
                    ) : student.riskStatus === 'suspicious' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Clean
                      </span>
                    )}
                  </div>

                  {/* College & Degree */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1 text-xs">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>{student.college}</span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">CGPA {student.cgpa}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{student.degree}</div>
                  </div>

                  {/* AST Defense & Originality Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-medium text-slate-400 block">AST Originality</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${student.originalityScore > 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${student.originalityScore}%` }}
                          />
                        </div>
                        <span className={`font-bold text-xs ${student.originalityScore > 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {student.originalityScore}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-medium text-slate-400 block">Code Defenses</span>
                      <span className="text-xs font-bold text-slate-900 mt-1 block">
                        {student.codeDefensePassed}/{student.codeDefenseTotal} Passed
                      </span>
                    </div>
                  </div>

                  {/* Verified Skills */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wide">
                      Verified Skills ({student.skillsVerified}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.skillsList.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {skill}
                        </span>
                      ))}
                      {student.skillsList.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          +{student.skillsList.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flag Reason if any */}
                  {student.flagReason && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                      <span className="font-bold">Flag:</span> {student.flagReason}
                    </div>
                  )}

                  {student.delistReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-medium">
                      <span className="font-bold">Delist Notice:</span> {student.delistReason}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedStudentForData(student)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  {activeSubTab === 'suspicious' && student.riskStatus === 'suspicious' && (
                    <button
                      onClick={() => handleDismissAlert(student)}
                      className="py-2 px-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer shrink-0"
                      title="Dismiss false alarm alert"
                    >
                      Dismiss
                    </button>
                  )}

                  {student.isDelisted ? (
                    <button
                      onClick={() => handleRestoreStudent(student)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenDelistModal(student)}
                      className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      title="Suspend / Delist Student"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Delist</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MODE 2: AUTO-FITTING COMPACT TABLE (Zero horizontal scroll) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <table className="w-full text-left text-xs table-auto">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 w-[32%]">Student Profile & Academic</th>
                <th className="py-3 px-4 w-[24%]">Verified Skills & AST Integrity</th>
                <th className="py-3 px-4 w-[24%]">Compliance & Status</th>
                <th className="py-3 px-4 w-[20%] text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No students matching the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map(student => (
                  <tr key={student.id} className={`transition-colors ${student.isDelisted ? 'bg-rose-50/30' : 'hover:bg-slate-50/60'}`}>
                    {/* Col 1: Student Profile & Academic */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          student.isDelisted ? 'bg-rose-200 text-rose-800' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {student.avatar}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => setSelectedStudentForData(student)}
                            className="text-left group cursor-pointer block"
                          >
                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors underline decoration-slate-300 underline-offset-2">
                              {student.name}
                            </span>
                          </button>
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate">{student.email}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            <span className="font-semibold">{student.college}</span> • {student.degree} (CGPA: {student.cgpa})
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Verified Skills & AST Integrity */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-100">
                          <Award className="w-3 h-3" />
                          {student.skillsVerified} Verified
                        </span>
                        <span className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                          student.originalityScore > 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {student.originalityScore}% AST Original
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-500">
                        {student.skillsList.slice(0, 3).map((sk, i) => (
                          <span key={i} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">{sk}</span>
                        ))}
                      </div>
                    </td>

                    {/* Col 3: Compliance & Status */}
                    <td className="py-3.5 px-4 align-top">
                      {student.isDelisted ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <Ban className="w-3 h-3" />
                            Delisted
                          </span>
                          {student.delistReason && (
                            <p className="text-[10px] text-rose-700 mt-0.5 font-medium line-clamp-1" title={student.delistReason}>
                              {student.delistReason}
                            </p>
                          )}
                        </div>
                      ) : student.riskStatus === 'suspicious' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3" />
                            Flagged Profile
                          </span>
                          {student.flagReason && (
                            <p className="text-[10px] text-amber-800 mt-0.5 font-medium line-clamp-1" title={student.flagReason}>
                              {student.flagReason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Clean Record
                        </span>
                      )}
                    </td>

                    {/* Col 4: Admin Actions */}
                    <td className="py-3.5 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudentForData(student)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>

                        {activeSubTab === 'suspicious' && student.riskStatus === 'suspicious' && (
                          <button
                            onClick={() => handleDismissAlert(student)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-medium transition-colors cursor-pointer"
                            title="Dismiss alert"
                          >
                            Dismiss
                          </button>
                        )}

                        {student.isDelisted ? (
                          <button
                            onClick={() => handleRestoreStudent(student)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenDelistModal(student)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Delist student"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Delist</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Full Student Dossier Modal with Minute Details */}
      {selectedStudentForData && (
        <AdminStudentDetailModal
          studentIdOrName={selectedStudentForData.id}
          onClose={() => setSelectedStudentForData(null)}
          onDelist={(studentId, reason) => {
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isDelisted: true, riskStatus: 'delisted', delistReason: reason } : s));
          }}
          onRestore={(studentId) => {
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isDelisted: false, riskStatus: 'clean', delistReason: undefined } : s));
          }}
        />
      )}

      {/* Delist Confirmation Modal */}
      {delistingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delist Student Account</h3>
                <p className="text-xs text-slate-500">Revoke network access and placement opportunities.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              You are about to delist <span className="font-bold text-slate-900">{delistingStudent.name}</span> ({delistingStudent.email}) from SkillBridge. Delisted students cannot apply to jobs or share verified skill credentials.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Delisting:
              </label>
              <textarea
                value={customDelistReason}
                onChange={(e) => setCustomDelistReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                placeholder="Enter infraction description..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDelistingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelist}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
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
