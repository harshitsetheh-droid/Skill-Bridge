import React, { useState, useEffect } from 'react';
import { 
  loadBatchFeedbackList, 
  loadReceivedResponses,
  addCompanyBatchFeedback, 
  CompanyBatchFeedback, 
  BATCH_FEEDBACK_UPDATED_EVENT 
} from '../../data/feedbackStore';
import { 
  Building2, 
  GraduationCap, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  Send, 
  Sliders, 
  ArrowRight, 
  BookOpen, 
  Users, 
  BarChart3, 
  Clock, 
  Sparkles, 
  X,
  FileText,
  HelpCircle,
  TrendingDown,
  Layers,
  Inbox,
  MessageSquare,
  Check,
  CornerDownRight
} from 'lucide-react';

export const CompanyFeedbackView: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<CompanyBatchFeedback[]>(() => loadBatchFeedbackList());
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reply state for following up with a college on their response
  const [replyTarget, setReplyTarget] = useState<CompanyBatchFeedback | null>(null);
  const [replyText, setReplyText] = useState('');

  // Form State for Sending Feedback to College
  const [targetCollege, setTargetCollege] = useState('MBM University, Jodhpur');
  const [targetBatch, setTargetBatch] = useState('Batch 2026');
  const [targetDepartment, setTargetDepartment] = useState('Computer Science & Engineering');
  const [hiringDriveTitle, setHiringDriveTitle] = useState('Fall 2026 Campus Placement & Internship Drive');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium'>('Critical');
  
  // Tag inputs
  const [missingSkillsInput, setMissingSkillsInput] = useState('');
  const [missingSkills, setMissingSkills] = useState<string[]>([
    'Docker & Multi-Stage Containers',
    'Kubernetes Orchestration',
    'Production SQL Indexing'
  ]);

  const [requiredNotFoundInput, setRequiredNotFoundInput] = useState('');
  const [requiredSkillsNotFound, setRequiredSkillsNotFound] = useState<string[]>([
    'System Design & Concurrency',
    'Automated CI/CD & Unit Testing',
    'Vector Databases & Embeddings'
  ]);

  const [satisfactoryInput, setSatisfactoryInput] = useState('');
  const [satisfactorySkills, setSatisfactorySkills] = useState<string[]>([
    'React & Frontend Architecture',
    'DSA & Problem Solving (LeetCode)'
  ]);

  const [improvementDirective, setImprovementDirective] = useState(
    'Students have strong theoretical computer science concepts, but over 70% of candidates could not write a basic Dockerfile or explain database query indexing during technical rounds. We strongly recommend that the TPO and CSE faculty introduce mandatory hands-on containerization and system design labs in the 6th/7th semester so candidates are industry-ready.'
  );

  const [studentsScreened, setStudentsScreened] = useState<number>(85);
  const [readinessScore, setReadinessScore] = useState<number>(65);
  const [shortlistedCount, setShortlistedCount] = useState<number>(16);

  useEffect(() => {
    const handleUpdate = () => {
      setFeedbacks(loadBatchFeedbackList());
    };
    window.addEventListener(BATCH_FEEDBACK_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(BATCH_FEEDBACK_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleAddMissingSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !missingSkills.includes(trimmed)) {
      setMissingSkills([...missingSkills, trimmed]);
      setMissingSkillsInput('');
    }
  };

  const handleRemoveMissingSkill = (skill: string) => {
    setMissingSkills(missingSkills.filter((s) => s !== skill));
  };

  const handleAddRequiredNotFound = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !requiredSkillsNotFound.includes(trimmed)) {
      setRequiredSkillsNotFound([...requiredSkillsNotFound, trimmed]);
      setRequiredNotFoundInput('');
    }
  };

  const handleRemoveRequiredNotFound = (skill: string) => {
    setRequiredSkillsNotFound(requiredSkillsNotFound.filter((s) => s !== skill));
  };

  const handleAddSatisfactory = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !satisfactorySkills.includes(trimmed)) {
      setSatisfactorySkills([...satisfactorySkills, trimmed]);
      setSatisfactoryInput('');
    }
  };

  const handleRemoveSatisfactory = (skill: string) => {
    setSatisfactorySkills(satisfactorySkills.filter((s) => s !== skill));
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCollege || !improvementDirective.trim()) return;

    addCompanyBatchFeedback({
      companyName: 'TechNova Solutions',
      collegeName: targetCollege,
      department: targetDepartment,
      batchYear: targetBatch,
      hiringDriveTitle,
      missingSkills,
      requiredSkillsNotFound,
      satisfactorySkills,
      improvementDirective: improvementDirective.trim(),
      studentsEvaluatedCount: Number(studentsScreened) || 50,
      readinessScore: Number(readinessScore) || 60,
      shortlistedCount: Number(shortlistedCount) || 10,
      priority,
      status: 'Delivered to TPO'
    });

    setToastMessage(`✓ Feedback successfully dispatched to ${targetCollege} (TPO Cell) for ${targetBatch}!`);
    setTimeout(() => setToastMessage(null), 5000);
    setIsModalOpen(false);
  };

  // Quick skill chip suggestions
  const suggestedMissing = ['Docker', 'Kubernetes', 'Next.js App Router', 'Redis', 'Kafka', 'GraphQL', 'Terraform', 'WebSockets'];
  const suggestedDemanded = ['System Design', 'Production SQL Indexing', 'CI/CD Pipelines', 'FastAPI', 'Vector Search', 'Unit Testing'];

  // Filtering
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch = 
      fb.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.hiringDriveTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.missingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fb.requiredSkillsNotFound.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBatch = selectedBatchFilter === 'All' || fb.batchYear.includes(selectedBatchFilter);
    const matchesPriority = selectedPriorityFilter === 'All' || fb.priority === selectedPriorityFilter;

    return matchesSearch && matchesBatch && matchesPriority;
  });

  // Aggregates
  const totalReports = feedbacks.length;
  const criticalGapsCount = feedbacks.filter((f) => f.priority === 'Critical').length;
  const avgReadiness = Math.round(
    feedbacks.reduce((acc, f) => acc + f.readinessScore, 0) / (feedbacks.length || 1)
  );

  // Received Responses from Colleges
  const receivedResponses = loadReceivedResponses('All');

  const filteredReceived = receivedResponses.filter((fb) => {
    const matchesSearch = 
      fb.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.hiringDriveTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.tpoResponseNote && fb.tpoResponseNote.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fb.acknowledgedBy && fb.acknowledgedBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fb.missingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fb.requiredSkillsNotFound.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBatch = selectedBatchFilter === 'All' || fb.batchYear.includes(selectedBatchFilter);
    return matchesSearch && matchesBatch;
  });

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTarget || !replyText.trim()) return;
    setToastMessage(`Follow-up message successfully transmitted to ${replyTarget.collegeName} TPO Placement Cell!`);
    setReplyTarget(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 dark:text-emerald-300 font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Institutional Batch Feedback & Curriculum Advisory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              Company ↔ College Two-Way Protocol
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            Provide direct feedback to colleges on missing skills and curriculum directives, and receive real-time acknowledgments and remediation action plans from university TPOs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Send Feedback to College</span>
        </button>
      </div>

      {/* Primary Tab Switcher: Sent Advisories vs Received Responses */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Sent Advisories ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'received'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Received Responses from Colleges</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
            activeTab === 'received' ? 'bg-white text-emerald-800' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
          }`}>
            {receivedResponses.length}
          </span>
        </button>
      </div>

      {activeTab === 'sent' ? (
        <>
          {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Batch Reports Submitted</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalReports} <span className="text-xs font-normal text-slate-400">Colleges Advised</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Synced to university TPO portals</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Missing Competency</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-1 truncate">
            Docker & Containers
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lacked by 74% of evaluated students</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical Gaps Flagged</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {criticalGapsCount} <span className="text-xs font-normal text-slate-400">Batches Urgent</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate lab interventions</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Batch Readiness</span>
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {avgReadiness}%
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Target: 80% for Tier-1 hires</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by college, department, drive, or missing skill (e.g. Docker, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Batch:</span>
          </div>
          {['All', '2026', '2025'].map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBatchFilter(b)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                selectedBatchFilter === b
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {b === 'All' ? 'All Batches' : `Batch ${b}`}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />

          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <span>Priority:</span>
          </div>
          {['All', 'Critical', 'High'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriorityFilter(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                selectedPriorityFilter === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Reports List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <GraduationCap className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No feedback reports found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or submit a new feedback advisory to partner colleges.
            </p>
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      {fb.collegeName}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {fb.batchYear}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {fb.department}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Drive: <strong className="text-slate-700 dark:text-slate-300">{fb.hiringDriveTitle}</strong></span>
                    <span>•</span>
                    <span>Submitted: {fb.dateSubmitted}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      fb.priority === 'Critical'
                        ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : fb.priority === 'High'
                        ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {fb.priority} Priority
                  </span>

                  {fb.status !== 'Delivered to TPO' ? (
                    <button
                      onClick={() => {
                        setActiveTab('received');
                        setSearchQuery(fb.collegeName);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{fb.status === 'Curriculum Action Initiated' ? 'Action Plan Received' : 'Response Received'} →</span>
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {fb.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Two Core Columns: Missing Skills in Batch vs Demanded Skills Not Found */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Missing Skills in this Batch */}
                <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Skills Missing in this Graduating Batch</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fb.missingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-rose-900/40 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <X className="w-3 h-3 text-rose-500" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Skills Demanded by Company but Not Found in Students */}
                <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Critical Skills Demanded but Not Found</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fb.requiredSkillsNotFound.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Search className="w-3 h-3 text-amber-500" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Satisfactory Skills */}
              {fb.satisfactorySkills && fb.satisfactorySkills.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Demonstrated Strengths in Batch:
                  </span>
                  {fb.satisfactorySkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Directive to College / TPO */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Curriculum & Lab Improvement Directives for College / TPO
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Sent from {fb.companyName} Hiring Panel</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{fb.improvementDirective}"
                </p>
              </div>

              {/* Batch Screening Stats & TPO Response */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-4">
                  <span>Students Screened: <strong className="text-slate-800 dark:text-slate-200">{fb.studentsEvaluatedCount}</strong></span>
                  <span>Shortlisted: <strong className="text-emerald-600 dark:text-emerald-400">{fb.shortlistedCount}</strong></span>
                  <span>Readiness: <strong className="text-indigo-600 dark:text-indigo-400">{fb.readinessScore}%</strong></span>
                </div>

                {fb.tpoResponseNote && (
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-900/60 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>{fb.tpoResponseNote}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  ) : (
    /* Received Responses Tab View */
    <div className="space-y-6 animate-fade-in">
      {/* Highlights Bar for Received Responses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Responses Received</span>
            <Inbox className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {receivedResponses.length} <span className="text-xs font-normal text-slate-400">Total Replies</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From university TPOs & Deans</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remedial Actions Initiated</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {receivedResponses.filter(r => r.status === 'Curriculum Action Initiated').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lab upgrades & curriculum shifts</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Official Acknowledgments</span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            {receivedResponses.filter(r => r.status === 'Acknowledged by College').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Signed by Placement Officers</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Cohort Readiness</span>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {Math.round(receivedResponses.reduce((acc, r) => acc + r.readinessScore, 0) / (receivedResponses.length || 1))}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across responsive colleges</p>
        </div>
      </div>

      {/* Filter & Search Bar for Received */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search college name, response message, responder dean, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Batch:</span>
          {['All', '2026', '2025'].map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBatchFilter(b)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedBatchFilter === b
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {b === 'All' ? 'All Batches' : `Batch ${b}`}
            </button>
          ))}
        </div>
      </div>

      {/* List of Received Responses */}
      <div className="space-y-4">
        {filteredReceived.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Responses Received Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              When partner colleges acknowledge your batch feedback or log curriculum remediation actions, their official response messages will appear here.
            </p>
            <button
              onClick={() => setActiveTab('sent')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              View Sent Advisories
            </button>
          </div>
        ) : (
          filteredReceived.map((resp) => (
            <div
              key={resp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 transition-all space-y-4"
            >
              {/* Response Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {resp.collegeName}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {resp.batchYear}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {resp.department}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Drive: <strong className="text-slate-700 dark:text-slate-300">{resp.hiringDriveTitle}</strong></span>
                    <span>•</span>
                    <span>Feedback Advisory Id: <span className="font-mono">{resp.id}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  {resp.status === 'Curriculum Action Initiated' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Curriculum Remediation Action Initiated</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Acknowledged by College TPO</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Highlighted Official Response Container */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Official Response & Remediation Note from University:
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                    {resp.responseSubmittedAt || resp.acknowledgedAt || 'Recently Received'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed bg-white dark:bg-slate-900/90 p-3.5 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  "{resp.tpoResponseNote || 'This college has officially acknowledged your feedback advisory report. Remedial lab sessions and syllabus adjustments are being coordinated by the placement cell.'}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 pt-1">
                  <span>
                    Signed by: <strong>{resp.acknowledgedBy || 'Dr. Sharma (Dean TPO, ' + resp.collegeName + ')'}</strong>
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">
                    Status: Formally Logged into Placement Council Minutes
                  </span>
                </div>
              </div>

              {/* Recruiter Original Directives and Evaluated Scope */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Your Original Advisory Directive:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] italic line-clamp-3">
                    "{resp.improvementDirective}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                    Screened Cohort Context:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-900 dark:text-white">{resp.studentsEvaluatedCount}</div>
                      <div className="text-[10px] text-slate-400">Evaluated</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{resp.shortlistedCount}</div>
                      <div className="text-[10px] text-slate-400">Shortlisted</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">{resp.readinessScore}%</div>
                      <div className="text-[10px] text-slate-400">Readiness</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addressed Skills Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Skills Addressed:</span>
                {resp.missingSkills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-semibold border border-rose-200 dark:border-rose-800">
                    {s}
                  </span>
                ))}
                {resp.requiredSkillsNotFound.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => {
                    setActiveTab('sent');
                    setSearchQuery(resp.collegeName);
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Sent Advisory Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setReplyTarget(resp);
                    setReplyText(`Dear ${resp.acknowledgedBy || 'Placement Officer'},\nThank you for acknowledging our hiring feedback. We would be glad to share lab problem sets and Docker challenge rubrics to support the remedial sessions.`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Follow-up with College TPO</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )}

  {/* Follow-up Reply Modal */}
  {replyTarget && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-scale-in">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Follow-up with {replyTarget.collegeName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Replying to acknowledgment on drive: <strong>{replyTarget.hiringDriveTitle}</strong>
            </p>
          </div>
          <button
            onClick={() => setReplyTarget(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSendFollowUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipient
            </label>
            <input
              type="text"
              disabled
              value={`${replyTarget.acknowledgedBy || 'Dean TPO'} (${replyTarget.collegeName})`}
              className="w-full text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Follow-up Note / Sandbox Resources *
            </label>
            <textarea
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full text-xs p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
              placeholder="Provide additional lab problem sets, mentoring contact, or technical references..."
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setReplyTarget(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Follow-up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

      {/* Modal: Send Batch Skill Feedback to College */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Send Batch Skill Feedback to College
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Report missing skills and curriculum improvement directives to the university TPO.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* College & Batch Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select University / College *
                  </label>
                  <select
                    value={targetCollege}
                    onChange={(e) => setTargetCollege(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    required
                  >
                    <option value="MBM University, Jodhpur">MBM University, Jodhpur</option>
                    <option value="Global Engineering College">Global Engineering College</option>
                    <option value="Delhi Technological Institute">Delhi Technological Institute</option>
                    <option value="National Institute of Engineering">National Institute of Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Graduating Batch *
                  </label>
                  <select
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    required
                  >
                    <option value="Batch 2026">Batch 2026 (Final Year)</option>
                    <option value="Batch 2027">Batch 2027 (Pre-Final Year)</option>
                    <option value="Batch 2025">Batch 2025 (Alumni / Recent Graduates)</option>
                  </select>
                </div>
              </div>

              {/* Department & Drive Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department / Stream *
                  </label>
                  <select
                    value={targetDepartment}
                    onChange={(e) => setTargetDepartment(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology & Cloud Systems">Information Technology & Cloud Systems</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hiring Drive / Placement Title *
                  </label>
                  <input
                    type="text"
                    value={hiringDriveTitle}
                    onChange={(e) => setHiringDriveTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    placeholder="e.g. Fall 2026 Campus Recruitment Drive"
                    required
                  />
                </div>
              </div>

              {/* 1. Missing Skills in Batch */}
              <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <label className="block text-xs font-bold text-rose-800 dark:text-rose-300">
                  1. Skills Missing in this Graduating Batch *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={missingSkillsInput}
                    onChange={(e) => setMissingSkillsInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMissingSkill(missingSkillsInput);
                      }
                    }}
                    placeholder="Type skill & press Enter (e.g. Docker, Kubernetes, Next.js)..."
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddMissingSkill(missingSkillsInput)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400">Suggestions:</span>
                  {suggestedMissing.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddMissingSkill(s)}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-medium hover:bg-rose-100"
                    >
                      + {s}
                    </button>
                  ))}
                </div>

                {/* Selected Missing Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {missingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMissingSkill(s)}
                        className="hover:text-rose-950 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Demanded Skills Not Found */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <label className="block text-xs font-bold text-amber-800 dark:text-amber-300">
                  2. Critical Skills Demanded but Not Found in Candidates *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={requiredNotFoundInput}
                    onChange={(e) => setRequiredNotFoundInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequiredNotFound(requiredNotFoundInput);
                      }
                    }}
                    placeholder="Type demanded skill & press Enter (e.g. System Design, SQL Indexing)..."
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddRequiredNotFound(requiredNotFoundInput)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400">Suggestions:</span>
                  {suggestedDemanded.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddRequiredNotFound(s)}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-medium hover:bg-amber-100"
                    >
                      + {s}
                    </button>
                  ))}
                </div>

                {/* Selected Demanded Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {requiredSkillsNotFound.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequiredNotFound(s)}
                        className="hover:text-amber-950 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Satisfactory Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills Where Batch Performed Well (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={satisfactoryInput}
                    onChange={(e) => setSatisfactoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSatisfactory(satisfactoryInput);
                      }
                    }}
                    placeholder="Type skill & press Enter (e.g. React, DSA)..."
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSatisfactory(satisfactoryInput)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {satisfactorySkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium flex items-center gap-1"
                    >
                      <span>✓ {s}</span>
                      <button type="button" onClick={() => handleRemoveSatisfactory(s)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Improvement Directive */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Curriculum & Lab Improvement Directives for College / TPO *
                </label>
                <textarea
                  rows={4}
                  value={improvementDirective}
                  onChange={(e) => setImprovementDirective(e.target.value)}
                  placeholder="Explain exactly what the college should improve in their syllabus, laboratory assignments, or project guidelines so next batch is prepared..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                  required
                />
              </div>

              {/* Stats & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Students Screened
                  </label>
                  <input
                    type="number"
                    value={studentsScreened}
                    onChange={(e) => setStudentsScreened(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Shortlisted
                  </label>
                  <input
                    type="number"
                    value={shortlistedCount}
                    onChange={(e) => setShortlistedCount(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Readiness Score (%)
                  </label>
                  <input
                    type="number"
                    value={readinessScore}
                    onChange={(e) => setReadinessScore(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Gap Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Feedback to College (TPO)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
