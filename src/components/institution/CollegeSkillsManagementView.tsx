import React, { useState, useEffect } from 'react';
import { 
  loadCurriculumCatalog, 
  registerCurriculumSkill, 
  calculateSkillProficiency, 
  CURRICULUM_UPDATED_EVENT 
} from '../../data/skillsStore';
import { 
  loadSkillRequests, 
  updateSkillRequestStatus, 
  StudentSkillRequest, 
  SKILL_REQUESTS_UPDATED_EVENT 
} from '../../data/skillRequestsStore';
import { Skill } from '../../types';
import { 
  Award, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Trash2, 
  ChevronRight, 
  Check, 
  X, 
  Sparkles, 
  GraduationCap, 
  User, 
  ArrowRight,
  Sliders
} from 'lucide-react';

export const CollegeSkillsManagementView: React.FC = () => {
  const [curriculumSkills, setCurriculumSkills] = useState<Skill[]>(() => loadCurriculumCatalog());
  const [skillRequests, setSkillRequests] = useState<StudentSkillRequest[]>(() => loadSkillRequests());
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'requests'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState<Skill['category']>('Core CS');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // Checkpoints for modal
  const [beginnerList, setBeginnerList] = useState<string[]>([
    'Core syntax, environment setup and fundamentals',
    'Standard library types and basic algorithms'
  ]);
  const [intermediateList, setIntermediateList] = useState<string[]>([
    'Practical module architecture and design patterns',
    'Error handling, automated unit testing and mock data'
  ]);
  const [advanceList, setAdvanceList] = useState<string[]>([
    'Production optimization, profiling and security auditing',
    'High-concurrency systems and distributed scalability'
  ]);

  // Manual checkpoint text inputs for TPO fast entry
  const [manualBeginnerText, setManualBeginnerText] = useState('');
  const [manualIntermediateText, setManualIntermediateText] = useState('');
  const [manualAdvanceText, setManualAdvanceText] = useState('');

  useEffect(() => {
    const handleCurriculum = () => setCurriculumSkills(loadCurriculumCatalog());
    const handleRequests = () => setSkillRequests(loadSkillRequests());

    window.addEventListener(CURRICULUM_UPDATED_EVENT, handleCurriculum);
    window.addEventListener(SKILL_REQUESTS_UPDATED_EVENT, handleRequests);
    return () => {
      window.removeEventListener(CURRICULUM_UPDATED_EVENT, handleCurriculum);
      window.removeEventListener(SKILL_REQUESTS_UPDATED_EVENT, handleRequests);
    };
  }, []);

  const handleOpenAddModal = (request?: StudentSkillRequest) => {
    if (request) {
      setActiveRequestId(request.id);
      setNewSkillName(request.skillName);
      setNewCategory(request.category);
      setBeginnerList([
        `Fundamentals & development environment setup for ${request.skillName}`,
        `Core syntax, standard conventions & basic exercises`
      ]);
      setIntermediateList([
        `Intermediate architecture, packages & design patterns in ${request.skillName}`,
        `Production debugging, exception handling & testing`
      ]);
      setAdvanceList([
        `Advanced performance tuning, memory profiling & concurrency`,
        `Real-world deployment, microservice integration & security`
      ]);
    } else {
      setActiveRequestId(null);
      setNewSkillName('');
      setNewCategory('Core CS');
      setBeginnerList(['Core syntax and fundamentals', 'Basic exercises and environment setup']);
      setIntermediateList(['Practical architectural implementation', 'Validation, error handling and testing']);
      setAdvanceList(['Production performance tuning and scalability', 'Security auditing and deployment']);
    }
    setIsAddModalOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    registerCurriculumSkill(
      newSkillName.trim(),
      newCategory,
      beginnerList.filter((s) => s.trim().length > 0),
      intermediateList.filter((s) => s.trim().length > 0),
      advanceList.filter((s) => s.trim().length > 0)
    );

    if (activeRequestId) {
      updateSkillRequestStatus(
        activeRequestId,
        'approved',
        `Approved by TPO Dr. Sharma. Added to official college curriculum with 3-tier milestone checkpoints.`
      );
    }

    setToastMessage(`✓ Successfully added "${newSkillName}" with 3 competency tiers to the curriculum catalog!`);
    setTimeout(() => setToastMessage(null), 4500);
    setIsAddModalOpen(false);
  };

  const handleRejectRequest = (req: StudentSkillRequest) => {
    updateSkillRequestStatus(
      req.id,
      'rejected',
      'Curriculum board determined this overlaps with existing Elective CS-402.'
    );
    setToastMessage(`Request for "${req.skillName}" marked as declined.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const pendingRequestsCount = skillRequests.filter((r) => r.status === 'pending').length;

  const filteredSkills = curriculumSkills.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = skillRequests.filter((r) =>
    r.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal dynamic calculations
  const bCount = Math.max(1, beginnerList.filter((s) => s.trim().length > 0).length);
  const iCount = Math.max(1, intermediateList.filter((s) => s.trim().length > 0).length);
  const aCount = Math.max(1, advanceList.filter((s) => s.trim().length > 0).length);

  const bPerCheckpoint = (33 / bCount).toFixed(1);
  const iPerCheckpoint = (33 / iCount).toFixed(1);
  const aPerCheckpoint = (34 / aCount).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 dark:text-emerald-300 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Curriculum Skill & Checkpoint Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              3-Level Competency Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure verifiable skill checkpoints across <strong>Beginner (33%)</strong>, <strong>Intermediate (33%)</strong>, and <strong>Advance (34%)</strong> tiers (totaling 100%). Approve student-submitted skill requests.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Curriculum Skill</span>
        </button>
      </div>

      {/* Internal Weight Formula Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/20 border border-indigo-100 dark:border-indigo-900/40 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Beginner Tier
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">33% Weight</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Syntax, fundamentals & core environment readiness. Checkpoint value = 33 / N%.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Intermediate Tier
            </span>
            <span className="text-amber-600 dark:text-amber-400">33% Weight</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Real-world architecture, modules & error handling. Checkpoint value = 33 / N%.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Advance Tier
            </span>
            <span className="text-purple-600 dark:text-purple-400">34% Weight</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Production tuning, security, concurrency & scale. Checkpoint value = 34 / N%.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-600 text-white flex flex-col justify-center">
          <span className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Dynamic Equation</span>
          <span className="text-lg font-black mt-0.5">33% + 33% + 34% = 100%</span>
          <span className="text-[10px] text-indigo-100 mt-1">Auto-calculated per checkpoint item</span>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'catalog'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Catalog ({curriculumSkills.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'requests'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Student Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill, category or student..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* TAB 1: CURRICULUM CATALOG */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          {filteredSkills.map((skill) => {
            const calc = calculateSkillProficiency(skill.levels);
            const bCps = skill.levels?.beginner?.checkpoints || [];
            const iCps = skill.levels?.intermediate?.checkpoints || [];
            const aCps = skill.levels?.advance?.checkpoints || [];

            return (
              <div
                key={skill.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4"
              >
                {/* Skill Title & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {skill.name}
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                          {skill.category}
                        </span>
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {bCps.length + iCps.length + aCps.length} Total Verifiable Milestones across 3 tiers
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Checkpoint Values:
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                      Beg: +{calc.checkpointValues.beginner}%
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                      Int: +{calc.checkpointValues.intermediate}%
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
                      Adv: +{calc.checkpointValues.advance}%
                    </span>
                  </div>
                </div>

                {/* 3 Tiers Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Beginner */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                      <span>1. Beginner Tier (33%)</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                        +{calc.checkpointValues.beginner}% / item
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {bCps.map((cp) => (
                        <div key={cp.id} className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-emerald-200/60 dark:border-emerald-900/40 flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cp.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intermediate */}
                  <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-2">
                    <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300">
                      <span>2. Intermediate Tier (33%)</span>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
                        +{calc.checkpointValues.intermediate}% / item
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {iCps.map((cp) => (
                        <div key={cp.id} className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span>{cp.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advance */}
                  <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
                    <div className="flex items-center justify-between font-bold text-purple-800 dark:text-purple-300">
                      <span>3. Advance Tier (34%)</span>
                      <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 px-1.5 py-0.5 rounded">
                        +{calc.checkpointValues.advance}% / item
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {aCps.map((cp) => (
                        <div key={cp.id} className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-purple-200/60 dark:border-purple-900/40 flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          <span>{cp.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STUDENT SKILL REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';

            return (
              <div
                key={req.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border transition-all space-y-4 ${
                  isPending
                    ? 'border-amber-200 dark:border-amber-900/60 ring-1 ring-amber-100 dark:ring-amber-950/30'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{req.id}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Requested {req.submittedAt}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Requested Skill: {req.skillName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{req.studentName}</span>
                      {req.studentRoll && <span>({req.studentRoll})</span>}
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{req.category}</span>
                    </div>
                  </div>

                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting TPO Configuration</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved & Integrated</span>
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">
                        <X className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200">Student Placement Justification: </strong>
                  {req.reason}
                </p>

                {isApproved && req.tpoRemarks && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">TPO Integration Note:</span>
                      <span>{req.tpoRemarks}</span>
                    </div>
                  </div>
                )}

                {isPending && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRejectRequest(req)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleOpenAddModal(req)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Approve & Configure Checkpoints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / CONFIGURE SKILL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeRequestId ? 'Approve & Configure Student Skill' : 'Add New Curriculum Skill'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Checkpoints will automatically receive dynamic value weightage: Beginner (33%), Intermediate (33%), Advance (34%).
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Apache Spark & Distributed Analytics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Core CS">Core CS</option>
                    <option value="DevOps">DevOps</option>
                    <option value="AI / Data">AI / Data</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Live Value Calculator */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Calculated Value Per Checkpoint:
                </span>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
                    Beginner: +{bPerCheckpoint}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">
                    Intermediate: +{iPerCheckpoint}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold">
                    Advance: +{aPerCheckpoint}%
                  </span>
                </div>
              </div>

              {/* 1. Beginner Checkpoints */}
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span>1. Beginner Tier Checkpoints (Total 33%)</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {beginnerList.length} items ({bPerCheckpoint}% each)
                  </span>
                </div>
                {beginnerList.map((cp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-center text-slate-400 font-bold">{idx + 1}.</span>
                    <input
                      type="text"
                      value={cp}
                      onChange={(e) => {
                        const copy = [...beginnerList];
                        copy[idx] = e.target.value;
                        setBeginnerList(copy);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                      required
                    />
                    {beginnerList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBeginnerList(beginnerList.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {/* Dedicated Manual Add Checkpoint Input */}
                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={manualBeginnerText}
                    onChange={(e) => setManualBeginnerText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (manualBeginnerText.trim()) {
                          setBeginnerList([...beginnerList, manualBeginnerText.trim()]);
                          setManualBeginnerText('');
                        }
                      }
                    }}
                    placeholder="Type custom Beginner checkpoint & hit Enter..."
                    className="flex-1 w-full px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      disabled={!manualBeginnerText.trim()}
                      onClick={() => {
                        if (manualBeginnerText.trim()) {
                          setBeginnerList([...beginnerList, manualBeginnerText.trim()]);
                          setManualBeginnerText('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Checkpoint
                    </button>
                    <button
                      type="button"
                      onClick={() => setBeginnerList([...beginnerList, ''])}
                      className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 text-[11px] hover:underline cursor-pointer shrink-0"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Intermediate Checkpoints */}
              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300">
                  <span>2. Intermediate Tier Checkpoints (Total 33%)</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">
                    {intermediateList.length} items ({iPerCheckpoint}% each)
                  </span>
                </div>
                {intermediateList.map((cp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-center text-slate-400 font-bold">{idx + 1}.</span>
                    <input
                      type="text"
                      value={cp}
                      onChange={(e) => {
                        const copy = [...intermediateList];
                        copy[idx] = e.target.value;
                        setIntermediateList(copy);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                      required
                    />
                    {intermediateList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setIntermediateList(intermediateList.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {/* Dedicated Manual Add Checkpoint Input */}
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={manualIntermediateText}
                    onChange={(e) => setManualIntermediateText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (manualIntermediateText.trim()) {
                          setIntermediateList([...intermediateList, manualIntermediateText.trim()]);
                          setManualIntermediateText('');
                        }
                      }
                    }}
                    placeholder="Type custom Intermediate checkpoint & hit Enter..."
                    className="flex-1 w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      disabled={!manualIntermediateText.trim()}
                      onClick={() => {
                        if (manualIntermediateText.trim()) {
                          setIntermediateList([...intermediateList, manualIntermediateText.trim()]);
                          setManualIntermediateText('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Checkpoint
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntermediateList([...intermediateList, ''])}
                      className="text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1 text-[11px] hover:underline cursor-pointer shrink-0"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Advance Checkpoints */}
              <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/10 space-y-2">
                <div className="flex items-center justify-between font-bold text-purple-800 dark:text-purple-300">
                  <span>3. Advance Tier Checkpoints (Total 34%)</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400">
                    {advanceList.length} items ({aPerCheckpoint}% each)
                  </span>
                </div>
                {advanceList.map((cp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-center text-slate-400 font-bold">{idx + 1}.</span>
                    <input
                      type="text"
                      value={cp}
                      onChange={(e) => {
                        const copy = [...advanceList];
                        copy[idx] = e.target.value;
                        setAdvanceList(copy);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                      required
                    />
                    {advanceList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setAdvanceList(advanceList.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {/* Dedicated Manual Add Checkpoint Input */}
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/40 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={manualAdvanceText}
                    onChange={(e) => setManualAdvanceText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (manualAdvanceText.trim()) {
                          setAdvanceList([...advanceList, manualAdvanceText.trim()]);
                          setManualAdvanceText('');
                        }
                      }
                    }}
                    placeholder="Type custom Advance checkpoint & hit Enter..."
                    className="flex-1 w-full px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      disabled={!manualAdvanceText.trim()}
                      onClick={() => {
                        if (manualAdvanceText.trim()) {
                          setAdvanceList([...advanceList, manualAdvanceText.trim()]);
                          setManualAdvanceText('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Checkpoint
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdvanceList([...advanceList, ''])}
                      className="text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1 text-[11px] hover:underline cursor-pointer shrink-0"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors"
                >
                  Publish Skill to Curriculum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
