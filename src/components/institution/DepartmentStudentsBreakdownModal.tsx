import React, { useState, useMemo } from 'react';
import { initialInstitutionStudents } from '../../data/mockData';
import { InstitutionStudent } from '../../types';
import { 
  X, 
  Search, 
  Filter, 
  GraduationCap, 
  Users, 
  Building2, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  Wrench,
  Download
} from 'lucide-react';

interface DepartmentStudentsBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  initialDept?: string;
}

// Complete mock dataset for students across all 4 departments
export const allDepartmentStudents: InstitutionStudent[] = [
  ...initialInstitutionStudents,
  // Additional students to make all departments rich and comprehensive
  {
    id: 's8',
    name: 'Devansh Singhania',
    rollNumber: 'ITJ22AI012',
    branch: 'AI & Data Science',
    cgpa: '8.8',
    readinessPercent: 86,
    verifiedSkillsCount: 9,
    projectsCount: 2,
    status: 'High',
    email: 'devansh.s@itj.ac.in',
    phone: '+91 98297 11223',
    batch: 'Class of 2026 (Final Year)',
    semester: '7th Semester',
    atsResumeScore: 88,
    codeLogicScore: 90,
    integrityStatus: 'Verified',
    shortlistedCompanies: ['DataHub Systems', 'InnoMind AI'],
    recommendedFocus: ['Distributed Training', 'TensorRT'],
    skillsLearned: [
      { name: 'PyTorch & Transformers', category: 'AI / Data', proficiency: 92, level: 'Expert', verified: true, verifiedDate: 'Aug 24, 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 3, totalCheckpoints: 3 },
      { name: 'Vector Databases (Milvus/Chroma)', category: 'AI / Data', proficiency: 86, level: 'Advanced', verified: true, verifiedDate: 'Aug 20, 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 3, totalCheckpoints: 3 },
      { name: 'FastAPI Microservices', category: 'Backend', proficiency: 84, level: 'Advanced', verified: true, verifiedDate: 'Jul 15, 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 2, totalCheckpoints: 3 }
    ],
    projects: [
      {
        id: 'pr-801',
        title: 'Document Intelligence & Vector RAG',
        techStack: ['Python', 'Milvus', 'FastAPI', 'PyTorch'],
        originalityScore: 91,
        logicDefenseScore: 93,
        status: 'passed',
        summary: 'Hybrid dense-sparse retrieval pipeline with re-ranking for engineering manuals.'
      }
    ]
  },
  {
    id: 's9',
    name: 'Tanvi Agarwal',
    rollNumber: 'ITJ22AI045',
    branch: 'AI & Data Science',
    cgpa: '8.1',
    readinessPercent: 74,
    verifiedSkillsCount: 7,
    projectsCount: 2,
    status: 'Medium',
    email: 'tanvi.a@itj.ac.in',
    phone: '+91 98298 22334',
    batch: 'Class of 2026 (Final Year)',
    semester: '7th Semester',
    atsResumeScore: 82,
    codeLogicScore: 78,
    integrityStatus: 'Verified',
    shortlistedCompanies: ['TechNova Solutions'],
    recommendedFocus: ['MLOps pipelines', 'Airflow ETL'],
    skillsLearned: [
      { name: 'Pandas & Big Data', category: 'AI / Data', proficiency: 88, level: 'Advanced', verified: true, verifiedDate: 'Jul 28, 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 3, totalCheckpoints: 3 },
      { name: 'SQL & Database Indexing', category: 'Database', proficiency: 76, level: 'Intermediate', verified: true, verifiedDate: 'Aug 02, 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 2, totalCheckpoints: 3 }
    ],
    projects: [
      {
        id: 'pr-901',
        title: 'Customer Churn Prediction Engine',
        techStack: ['Python', 'XGBoost', 'SQL', 'Streamlit'],
        originalityScore: 84,
        logicDefenseScore: 80,
        status: 'passed',
        summary: 'Predictive churn modeling on 250k telecom records with SHAP explainability.'
      }
    ]
  },
  {
    id: 's10',
    name: 'Siddharth Iyer',
    rollNumber: 'ITJ22EC058',
    branch: 'Electronics & Comm',
    cgpa: '8.5',
    readinessPercent: 83,
    verifiedSkillsCount: 8,
    projectsCount: 2,
    status: 'High',
    email: 'siddharth.i@itj.ac.in',
    phone: '+91 98299 33445',
    batch: 'Class of 2026 (Final Year)',
    semester: '7th Semester',
    atsResumeScore: 85,
    codeLogicScore: 86,
    integrityStatus: 'Verified',
    shortlistedCompanies: ['Siemens Technology India', 'Google Cloud Partners'],
    recommendedFocus: ['RTOS multi-threading', 'Linux Device Drivers'],
    skillsLearned: [
      { name: 'Embedded C & RTOS', category: 'Core CS', proficiency: 90, level: 'Advanced', verified: true, verifiedDate: 'Aug 18, 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 3, totalCheckpoints: 3 },
      { name: 'VLSI & Verilog Synthesis', category: 'Core CS', proficiency: 84, level: 'Advanced', verified: true, verifiedDate: 'Jul 22, 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 3, totalCheckpoints: 3 }
    ],
    projects: [
      {
        id: 'pr-1001',
        title: 'Low Latency Sensor Fusion RTOS Kernel',
        techStack: ['Embedded C', 'FreeRTOS', 'SPI', 'I2C'],
        originalityScore: 89,
        logicDefenseScore: 88,
        status: 'passed',
        summary: 'Deterministic scheduling engine polling 8 sensor buses with sub-millisecond jitter.'
      }
    ]
  },
  {
    id: 's11',
    name: 'Pooja Rawat',
    rollNumber: 'ITJ22ME028',
    branch: 'Mechanical Eng',
    cgpa: '8.4',
    readinessPercent: 78,
    verifiedSkillsCount: 7,
    projectsCount: 2,
    status: 'High',
    email: 'pooja.r@itj.ac.in',
    phone: '+91 98300 44556',
    batch: 'Class of 2026 (Final Year)',
    semester: '7th Semester',
    atsResumeScore: 80,
    codeLogicScore: 82,
    integrityStatus: 'Verified',
    shortlistedCompanies: ['Siemens Technology India'],
    recommendedFocus: ['Python for robotics', 'Automated CAD scripts'],
    skillsLearned: [
      { name: 'SolidWorks 3D & FEA', category: 'Core CS', proficiency: 92, level: 'Expert', verified: true, verifiedDate: 'Aug 12, 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 3, totalCheckpoints: 3 },
      { name: 'ANSYS Mechanical Structural', category: 'Core CS', proficiency: 86, level: 'Advanced', verified: true, verifiedDate: 'Jul 30, 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 3, totalCheckpoints: 3 }
    ],
    projects: [
      {
        id: 'pr-1101',
        title: 'Topology Optimization for Lightweight UAV Bracket',
        techStack: ['ANSYS', 'SolidWorks', 'Python Automation'],
        originalityScore: 90,
        logicDefenseScore: 86,
        status: 'passed',
        summary: 'Reduced aircraft structural weight by 28% while maintaining 2.5x safety factor.'
      }
    ]
  }
];

export const DepartmentStudentsBreakdownModal: React.FC<DepartmentStudentsBreakdownModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  initialDept = 'All'
}) => {
  const [selectedDept, setSelectedDept] = useState<string>(initialDept);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedStudentForPreview, setSelectedStudentForPreview] = useState<InstitutionStudent | null>(null);

  if (!isOpen) return null;

  // Department department tabs configuration
  const deptTabs = [
    { id: 'All', label: 'All Departments', count: 1420, icon: Users, badgeColor: 'bg-slate-100 text-slate-800' },
    { id: 'CSE', label: 'Computer Science (CSE)', count: 520, icon: BookOpen, badgeColor: 'bg-indigo-50 text-indigo-700' },
    { id: 'AI', label: 'AI & Data Science (AI)', count: 280, icon: Cpu, badgeColor: 'bg-teal-50 text-teal-700' },
    { id: 'ECE', label: 'Electronics & Comm (ECE)', count: 360, icon: Layers, badgeColor: 'bg-purple-50 text-purple-700' },
    { id: 'Mechanical', label: 'Mechanical Eng (Mech)', count: 260, icon: Wrench, badgeColor: 'bg-amber-50 text-amber-700' },
  ];

  // Map student's branch to tab id
  const matchesDepartment = (student: InstitutionStudent, deptId: string) => {
    if (deptId === 'All') return true;
    const b = student.branch.toLowerCase();
    if (deptId === 'CSE') return b.includes('computer') || b.includes('cse');
    if (deptId === 'AI') return b.includes('ai') || b.includes('data');
    if (deptId === 'ECE') return b.includes('electronics') || b.includes('ece') || b.includes('comm');
    if (deptId === 'Mechanical') return b.includes('mech');
    return true;
  };

  // Filter students
  const filteredStudents = allDepartmentStudents.filter((student) => {
    const inDept = matchesDepartment(student, selectedDept);
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skillsLearned.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

    return inDept && matchesSearch && matchesStatus;
  });

  // Department specific aggregate stats
  const currentDeptStats = {
    totalEnrolled: deptTabs.find((d) => d.id === selectedDept)?.count || 1420,
    activeInBatch: filteredStudents.length,
    highReadinessCount: filteredStudents.filter((s) => s.status === 'High').length,
    mediumCount: filteredStudents.filter((s) => s.status === 'Medium').length,
    actionNeededCount: filteredStudents.filter((s) => s.status === 'Action Needed').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200/90 my-auto flex flex-col max-h-[92vh] overflow-hidden animate-scale-in">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Enrolled Students Directory & Department Breakdown
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                  Batch 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive distribution across CSE, AI & Data Science, ECE, and Mechanical departments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Department Switcher Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
          {deptTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedDept === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedDept(tab.id);
                  setSelectedStudentForPreview(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-200' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-teal-900/60 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 shrink-0">Readiness:</span>
            {['All', 'High', 'Medium', 'Action Needed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Student List & Detailed Preview */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Students List */}
          <div className={selectedStudentForPreview ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">No students found matching current filters</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting the department tab or search keyword</p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedStudentForPreview?.id === student.id;
                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentForPreview(student)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-xs ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/30'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0 border border-teal-200">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{student.name}</span>
                            <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {student.rollNumber}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                              {student.branch}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                            <span>CGPA: <strong className="text-slate-800">{student.cgpa}</strong></span>
                            <span>•</span>
                            <span>{student.semester}</span>
                            <span>•</span>
                            <span>{student.verifiedSkillsCount} verified skills</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-center">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-xs font-black text-slate-900">{student.readinessPercent}%</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                student.status === 'High'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : student.status === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {student.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Readiness Index</span>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    </div>

                    {/* Top Skills Badges */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      {student.skillsLearned.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{skill.name}</span>
                        </span>
                      ))}
                      {student.skillsLearned.length > 4 && (
                        <span className="text-[11px] text-slate-400 font-medium ml-1">
                          +{student.skillsLearned.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Side Preview when a student is clicked */}
          {selectedStudentForPreview && (
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 animate-fade-in self-start sticky top-0">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedStudentForPreview.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedStudentForPreview.rollNumber} • {selectedStudentForPreview.branch}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudentForPreview(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[11px]">Academic CGPA</span>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedStudentForPreview.cgpa} <span className="text-[11px] font-normal text-slate-400">/ 10</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[11px]">Readiness Score</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">
                    {selectedStudentForPreview.readinessPercent}%
                  </div>
                </div>
              </div>

              {/* Verified Skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Verified Competencies</span>
                  <span className="text-[11px] text-teal-700 font-semibold">
                    {selectedStudentForPreview.verifiedSkillsCount} verified
                  </span>
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedStudentForPreview.skillsLearned.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800">{s.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">
                        {s.level} ({s.proficiency}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shortlisted Companies */}
              {selectedStudentForPreview.shortlistedCompanies.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800">Shortlisted for Campus Drives</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudentForPreview.shortlistedCompanies.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button: Jump to Student Readiness View */}
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('students');
                }}
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Open Full Student Readiness Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> students in{' '}
            <strong className="text-slate-800">
              {deptTabs.find((d) => d.id === selectedDept)?.label || selectedDept}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateTab('students');
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Open Full Student Readiness Page
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
