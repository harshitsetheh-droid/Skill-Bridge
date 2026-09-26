import React, { useState, useEffect } from 'react';
import { 
  loadBatchFeedbackList, 
  updateBatchFeedbackStatus,
  CompanyBatchFeedback, 
  BATCH_FEEDBACK_UPDATED_EVENT,
  loadFeedbackList,
  CandidateFeedback
} from '../../data/feedbackStore';
import { 
  getAllFeedbackSkills, 
  loadSelectedFeedbackSkills, 
  toggleFeedbackSkillSelection, 
  selectAllFeedbackSkills, 
  selectCriticalFeedbackSkills,
  saveSelectedFeedbackSkills,
  FEEDBACK_SKILLS_UPDATED_EVENT
} from '../../data/feedbackSkillsStore';
import { 
  loadCurriculumCatalog, 
  registerCurriculumSkill, 
  CURRICULUM_UPDATED_EVENT 
} from '../../data/skillsStore';
import { Skill } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  BookOpen, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  X, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Award,
  ChevronRight
} from 'lucide-react';

interface CollegeFeedbackViewProps {
  onNavigateTab?: (tab: string) => void;
}

// Helper to provide smart initial checkpoints based on skill name
function getSuggestedCheckpoints(skillName: string): {
  category: Skill['category'];
  beginner: string[];
  intermediate: string[];
  advance: string[];
} {
  const norm = skillName.toLowerCase();

  if (norm.includes('docker') || norm.includes('container')) {
    return {
      category: 'DevOps',
      beginner: [
        'Containerization fundamentals, Docker architecture & Dockerfile directives',
        'Image layering, port mappings, environment variables & persistent volumes'
      ],
      intermediate: [
        'Multi-stage Docker builds for minimal production image footprints',
        'Docker Compose multi-container networking, health checks & volume mounts'
      ],
      advance: [
        'Non-root container security, vulnerability scanning & image signing',
        'Docker daemon tuning, resource limits (cgroups) & registry publishing'
      ]
    };
  }

  if (norm.includes('kubernetes') || norm.includes('k8s')) {
    return {
      category: 'DevOps',
      beginner: [
        'Kubernetes control plane vs node architecture & kubectl CLI mastery',
        'Pod definitions, ReplicaSets and basic ClusterIP Service discovery'
      ],
      intermediate: [
        'Deployments, rolling update strategies, ConfigMaps & Secrets management',
        'Ingress Controllers, Liveness/Readiness probes & Persistent Volume Claims'
      ],
      advance: [
        'Helm chart packaging, release lifecycle & Custom Resource Definitions (CRDs)',
        'Horizontal Pod Autoscaling (HPA), Network Policies & RBAC security controls'
      ]
    };
  }

  if (norm.includes('sql') || norm.includes('database') || norm.includes('index') || norm.includes('query')) {
    return {
      category: 'Database',
      beginner: [
        'Relational schema normalization (1NF-3NF), primary/foreign keys & constraints',
        'Complex JOINs (INNER, LEFT, RIGHT), GROUP BY, HAVING & window aggregations'
      ],
      intermediate: [
        'B-Tree and Hash indexing strategies, EXPLAIN query plan profiling',
        'ACID transactions, isolation levels, row-level locking & deadlocks resolution'
      ],
      advance: [
        'Database connection pooling, read replicas, sharding & table partitioning',
        'Buffer cache tuning, slow query profiling & distributed transaction guarantees'
      ]
    };
  }

  if (norm.includes('system design') || norm.includes('concurrency') || norm.includes('distributed')) {
    return {
      category: 'Core CS',
      beginner: [
        'Client-server architecture, HTTP/HTTPS protocols & RESTful contract design',
        'Vertical vs Horizontal scaling, DNS routing & reverse proxy load balancing'
      ],
      intermediate: [
        'Distributed in-memory caching (Redis/Memcached) & invalidation strategies',
        'Asynchronous message brokers (Kafka/RabbitMQ), event-driven queues & workers'
      ],
      advance: [
        'CAP theorem trade-offs, Paxos/Raft consensus & distributed rate limiting',
        'Thread safety, atomic primitives, non-blocking I/O & fault tolerance recovery'
      ]
    };
  }

  if (norm.includes('vector') || norm.includes('rag') || norm.includes('ai') || norm.includes('llm')) {
    return {
      category: 'AI / Data',
      beginner: [
        'Text embeddings fundamentals, vector dimensions & cosine distance metrics',
        'Vector database architectures (ChromaDB, Pinecone, PGVector) & indexing'
      ],
      intermediate: [
        'RAG architecture: document ingestion, recursive chunking & semantic search',
        'Prompt orchestration, context window management & hallucination guards'
      ],
      advance: [
        'Hybrid search (Dense vectors + BM25 keyword search) & Cross-Encoder re-ranking',
        'Vector quantization (HNSW vs IVF), memory compaction & evaluation metrics'
      ]
    };
  }

  if (norm.includes('ci/cd') || norm.includes('pipeline') || norm.includes('test') || norm.includes('unit')) {
    return {
      category: 'DevOps',
      beginner: [
        'Unit testing fundamentals, test assertions, mocks and code coverage metrics',
        'Git branch management, pull request standards & automated linting hooks'
      ],
      intermediate: [
        'GitHub Actions / GitLab CI pipeline workflows with matrix build runners',
        'Automated integration test suites, build artifact generation & test reports'
      ],
      advance: [
        'Zero-downtime deployment automation (Canary / Blue-Green deploy strategies)',
        'Secrets rotation in CI/CD, SAST/DAST security scanning & artifact provenance'
      ]
    };
  }

  if (norm.includes('next') || norm.includes('router') || norm.includes('react')) {
    return {
      category: 'Frontend',
      beginner: [
        'Modern React Component patterns, JSX hierarchy, props & state management',
        'Next.js App Router conventions: layouts, pages, loading states & route handlers'
      ],
      intermediate: [
        'React Server Components (RSC), Client Components boundary & Suspense streaming',
        'Server Actions, form validation with Zod & optimistic state updates'
      ],
      advance: [
        'Edge middleware, static generation (SSG) vs ISR incremental regeneration',
        'Core Web Vitals tuning, bundle size minimization & streaming hydration'
      ]
    };
  }

  // Fallback default
  return {
    category: 'Core CS',
    beginner: [
      `Foundational concepts, development toolchain & syntax for ${skillName}`,
      `Basic problem-solving, standard patterns & initial exercise verification`
    ],
    intermediate: [
      `Modular architecture, error handling & test verification in ${skillName}`,
      `Practical integration, real-world data flow & automated unit validation`
    ],
    advance: [
      `Production performance tuning, security auditing & scalability in ${skillName}`,
      `High-concurrency systems design, distributed edge cases & monitoring`
    ]
  };
}

export const CollegeFeedbackView: React.FC<CollegeFeedbackViewProps> = ({ onNavigateTab }) => {
  const [batchFeedbacks, setBatchFeedbacks] = useState<CompanyBatchFeedback[]>(() => loadBatchFeedbackList());
  const [candidateFeedbacks, setCandidateFeedbacks] = useState<CandidateFeedback[]>(() => loadFeedbackList());
  const [curriculumSkills, setCurriculumSkills] = useState<Skill[]>(() => loadCurriculumCatalog());
  const [activeTab, setActiveTab] = useState<'batch-reports' | 'candidate-scorecards'>('batch-reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Response inline state
  const [respondingFeedbackId, setRespondingFeedbackId] = useState<string | null>(null);
  const [tpoResponseText, setTpoResponseText] = useState('');

  // ADD MISSING SKILL MODAL STATE
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [modalSkillName, setModalSkillName] = useState('');
  const [modalCategory, setModalCategory] = useState<Skill['category']>('Core CS');
  const [modalSourceFeedback, setModalSourceFeedback] = useState<CompanyBatchFeedback | null>(null);

  // Checkpoints for the 3 tiers
  const [beginnerCheckpoints, setBeginnerCheckpoints] = useState<string[]>([]);
  const [intermediateCheckpoints, setIntermediateCheckpoints] = useState<string[]>([]);
  const [advanceCheckpoints, setAdvanceCheckpoints] = useState<string[]>([]);

  // Manual input fields for typing custom checkpoints directly
  const [manualBeginnerInput, setManualBeginnerInput] = useState('');
  const [manualIntermediateInput, setManualIntermediateInput] = useState('');
  const [manualAdvanceInput, setManualAdvanceInput] = useState('');

  // Selected feedback skills for Curriculum Heatmap
  const [selectedHeatmapSkills, setSelectedHeatmapSkills] = useState<string[]>(() => loadSelectedFeedbackSkills());

  useEffect(() => {
    const handleFeedbackUpdate = () => {
      setBatchFeedbacks(loadBatchFeedbackList());
      setCandidateFeedbacks(loadFeedbackList());
    };
    const handleCurriculumUpdate = () => {
      setCurriculumSkills(loadCurriculumCatalog());
    };
    const handleSkillsUpdate = () => {
      setSelectedHeatmapSkills(loadSelectedFeedbackSkills());
    };

    window.addEventListener(BATCH_FEEDBACK_UPDATED_EVENT, handleFeedbackUpdate);
    window.addEventListener(CURRICULUM_UPDATED_EVENT, handleCurriculumUpdate);
    window.addEventListener(FEEDBACK_SKILLS_UPDATED_EVENT, handleSkillsUpdate);
    return () => {
      window.removeEventListener(BATCH_FEEDBACK_UPDATED_EVENT, handleFeedbackUpdate);
      window.removeEventListener(CURRICULUM_UPDATED_EVENT, handleCurriculumUpdate);
      window.removeEventListener(FEEDBACK_SKILLS_UPDATED_EVENT, handleSkillsUpdate);
    };
  }, []);

  // Helper to check if a skill already exists in the curriculum catalog
  const isSkillInCurriculum = (skillName: string): boolean => {
    const norm = skillName.trim().toLowerCase();
    return curriculumSkills.some(
      (s) => s.name.trim().toLowerCase() === norm ||
             s.name.toLowerCase().includes(norm) ||
             norm.includes(s.name.toLowerCase())
    );
  };

  // Open modal prefilled with clicked missing skill
  const handleOpenAddSkillModal = (skillName: string, sourceFb?: CompanyBatchFeedback) => {
    const presets = getSuggestedCheckpoints(skillName);
    setModalSkillName(skillName);
    setModalCategory(presets.category);
    setBeginnerCheckpoints([...presets.beginner]);
    setIntermediateCheckpoints([...presets.intermediate]);
    setAdvanceCheckpoints([...presets.advance]);
    setManualBeginnerInput('');
    setManualIntermediateInput('');
    setManualAdvanceInput('');
    setModalSourceFeedback(sourceFb || null);
    setIsAddSkillModalOpen(true);
  };

  // Reset to default presets
  const handleResetPresets = () => {
    if (!modalSkillName.trim()) return;
    const presets = getSuggestedCheckpoints(modalSkillName);
    setBeginnerCheckpoints([...presets.beginner]);
    setIntermediateCheckpoints([...presets.intermediate]);
    setAdvanceCheckpoints([...presets.advance]);
  };

  // Manual checkpoint additions
  const handleAddManualBeginner = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualBeginnerInput.trim()) return;
    setBeginnerCheckpoints((prev) => [...prev, manualBeginnerInput.trim()]);
    setManualBeginnerInput('');
  };

  const handleAddManualIntermediate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualIntermediateInput.trim()) return;
    setIntermediateCheckpoints((prev) => [...prev, manualIntermediateInput.trim()]);
    setManualIntermediateInput('');
  };

  const handleAddManualAdvance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualAdvanceInput.trim()) return;
    setAdvanceCheckpoints((prev) => [...prev, manualAdvanceInput.trim()]);
    setManualAdvanceInput('');
  };

  // Save skill to curriculum catalog
  const handleSaveSkillToCurriculum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSkillName.trim()) return;

    // Filter non-empty checkpoints
    const bList = beginnerCheckpoints.map((s) => s.trim()).filter((s) => s.length > 0);
    const iList = intermediateCheckpoints.map((s) => s.trim()).filter((s) => s.length > 0);
    const aList = advanceCheckpoints.map((s) => s.trim()).filter((s) => s.length > 0);

    // Ensure at least 1 checkpoint per tier
    if (bList.length === 0) bList.push(`Foundations and core setup for ${modalSkillName}`);
    if (iList.length === 0) iList.push(`Modular implementation and testing for ${modalSkillName}`);
    if (aList.length === 0) aList.push(`Advanced production optimization for ${modalSkillName}`);

    // Register in curriculum catalog
    registerCurriculumSkill(modalSkillName.trim(), modalCategory, bList, iList, aList);

    // If initiated from a specific company feedback report, record curriculum action
    if (modalSourceFeedback) {
      updateBatchFeedbackStatus(
        modalSourceFeedback.id,
        'Curriculum Action Initiated',
        `TPO Action: Added "${modalSkillName.trim()}" to college curriculum catalog with ${bList.length} Beginner, ${iList.length} Intermediate, and ${aList.length} Advance checkpoints.`
      );
    }

    setToastMessage(
      `✓ "${modalSkillName.trim()}" successfully registered into TPO Curriculum Catalog with ${bList.length + iList.length + aList.length} verified checkpoints!`
    );
    setTimeout(() => setToastMessage(null), 5500);
    setIsAddSkillModalOpen(false);
  };

  const handleAcknowledge = (id: string, currentCollege: string) => {
    const note = `Acknowledged by TPO Dr. Sharma (Institute of Technology, Jodhpur): Lab syllabus and academic electives have been reviewed and calibrated based on your feedback.`;
    updateBatchFeedbackStatus(id, 'Acknowledged by College', note, 'Dr. Sharma (Dean TPO, Institute of Technology, Jodhpur)');
    setToastMessage(`✓ Acknowledged feedback from company. Official response dispatched to Company Portal!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleInitiateCurriculumAction = (id: string) => {
    if (!tpoResponseText.trim()) return;
    updateBatchFeedbackStatus(
      id, 
      'Curriculum Action Initiated', 
      tpoResponseText.trim(),
      'Dr. Sharma (Dean TPO, Institute of Technology, Jodhpur)'
    );
    setRespondingFeedbackId(null);
    setTpoResponseText('');
    setToastMessage(`✓ Curriculum action logged and official response message sent to Company hiring team!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Filter batch feedbacks
  const filteredBatchFeedbacks = batchFeedbacks.filter((fb) => {
    const matchesSearch = 
      fb.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.missingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fb.requiredSkillsNotFound.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBatch = batchFilter === 'All' || fb.batchYear.includes(batchFilter);
    return matchesSearch && matchesBatch;
  });

  // Dynamic calculations for the modal
  const bCount = Math.max(1, beginnerCheckpoints.filter((s) => s.trim().length > 0).length);
  const iCount = Math.max(1, intermediateCheckpoints.filter((s) => s.trim().length > 0).length);
  const aCount = Math.max(1, advanceCheckpoints.filter((s) => s.trim().length > 0).length);

  const bPerCheckpoint = (33 / bCount).toFixed(1);
  const iPerCheckpoint = (33 / iCount).toFixed(1);
  const aPerCheckpoint = (34 / aCount).toFixed(1);

  // Aggregates
  const totalReports = batchFeedbacks.length;
  const criticalReports = batchFeedbacks.filter((f) => f.priority === 'Critical').length;
  const acknowledgedCount = batchFeedbacks.filter((f) => f.status !== 'Delivered to TPO').length;
  const allAvailableFeedbackSkills = getAllFeedbackSkills();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <div className="flex items-center gap-3">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('skills')}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <span>View in Curriculum Skills Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 dark:text-emerald-300 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Corporate Placement Feedback & Batch Skill Gaps
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              Received from Companies
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            Direct evaluations submitted by corporate recruiters after campus hiring drives. Review missing skills in student batches, competencies demanded that were not found, and actionable directives to upgrade college labs and syllabi.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('batch-reports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'batch-reports'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Company Batch Reports ({batchFeedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab('candidate-scorecards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'candidate-scorecards'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Interview Scorecards ({candidateFeedbacks.length})
          </button>
        </div>
      </div>

      {/* Aggregate Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Corporate Advisories</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalReports} <span className="text-xs font-normal text-slate-400">Companies Submitted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">TechNova, CloudSphere, DataHub, InnoMind</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical Batch Flags</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {criticalReports} <span className="text-xs font-normal text-slate-400">Gaps Urgent</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Click missing skills to add to TPO curriculum</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curriculum Action Taken</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {acknowledgedCount} <span className="text-xs font-normal text-slate-400">of {totalReports} Addressed</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">3-Level Checkpoint System Synced</p>
        </div>
      </div>

      {activeTab === 'batch-reports' ? (
        <div className="space-y-4">
          {/* Curriculum Heatmap Skill Sync & Mapping Control */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm border border-teal-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
                    Curriculum Heatmap Generator
                  </span>
                  <span className="text-xs text-teal-200/80 font-medium">
                    {selectedHeatmapSkills.length} of {allAvailableFeedbackSkills.length} Skills Selected
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  Select Corporate Feedback Skills to Formulate Department Heatmap
                </h2>
                <p className="text-xs text-teal-100/70 mt-0.5 max-w-3xl">
                  The skills you check below directly generate the Department vs Skill Heatmap under "Curriculum Gaps" across CSE, AI & DS, ECE, and Mechanical.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('curriculum-gaps')}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Heatmap ({selectedHeatmapSkills.length} Skills)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Skill Selector Chips */}
            <div className="pt-2 border-t border-teal-800/60">
              <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                <span className="text-teal-200/80 text-[11px] font-semibold">
                  Click any skill chip to toggle inclusion in the Curriculum Matrix:
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      const all = selectAllFeedbackSkills();
                      setSelectedHeatmapSkills(all);
                    }}
                    className="text-teal-300 hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-teal-500">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      const crit = selectCriticalFeedbackSkills();
                      setSelectedHeatmapSkills(crit);
                    }}
                    className="text-teal-300 hover:underline cursor-pointer"
                  >
                    Select Critical Only
                  </button>
                  <span className="text-teal-500">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      saveSelectedFeedbackSkills([]);
                      setSelectedHeatmapSkills([]);
                    }}
                    className="text-rose-300 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {allAvailableFeedbackSkills.map((fbSkill) => {
                  const isSelected = selectedHeatmapSkills.includes(fbSkill.skill);
                  return (
                    <button
                      key={fbSkill.skill}
                      type="button"
                      onClick={() => {
                        const updated = toggleFeedbackSkillSelection(fbSkill.skill);
                        setSelectedHeatmapSkills(updated);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-500 text-teal-950 font-bold shadow-xs'
                          : 'bg-white/10 text-teal-100 hover:bg-white/20 border border-teal-700/40'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-teal-950 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-teal-300" />
                      )}
                      <span>{fbSkill.skill}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isSelected ? 'bg-teal-950/20 text-teal-900' : 'bg-black/30 text-teal-200'
                        }`}
                      >
                        {fbSkill.sourceCompanies[0] || 'Company'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company, missing skill (e.g. Docker, SQL), or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Batch:</span>
              {['All', '2026', '2025'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBatchFilter(b)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                    batchFilter === b
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {b === 'All' ? 'All' : `Batch ${b}`}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Feedback Cards */}
          <div className="space-y-4">
            {filteredBatchFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Feedback from: {fb.companyName}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {fb.batchYear}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {fb.department}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span>Drive: <strong className="text-slate-700 dark:text-slate-300">{fb.hiringDriveTitle}</strong></span>
                      <span>•</span>
                      <span>Target: {fb.collegeName}</span>
                      <span>•</span>
                      <span>Date: {fb.dateSubmitted}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        fb.priority === 'Critical'
                          ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {fb.priority} Priority Gap
                    </span>

                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        fb.status === 'Acknowledged by College'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : fb.status === 'Curriculum Action Initiated'
                          ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {fb.status}
                    </span>
                  </div>
                </div>

                {/* The Two Key Requirements with Interactive Click-to-Add to TPO Curriculum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Missing in this batch */}
                  <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>Skills Missing in this Graduating Batch</span>
                      </div>
                      <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium">
                        Click skill to add to TPO curriculum
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {fb.missingSkills.map((s, idx) => {
                        const inCatalog = isSkillInCurriculum(s);
                        const isMappedToHeatmap = selectedHeatmapSkills.includes(s);
                        return (
                          <div
                            key={idx}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                              inCatalog
                                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-rose-200 dark:border-rose-800/80'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenAddSkillModal(s, fb)}
                              title={inCatalog ? 'Already in Curriculum Catalog (Click to inspect or reconfigure)' : 'Click to add directly to TPO Curriculum Catalog with custom checkpoints'}
                              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                            >
                              {inCatalog ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              )}
                              <span>{s}</span>
                              <span className="text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-indigo-600 hover:text-white transition-colors">
                                {inCatalog ? 'In Catalog' : '+ Add'}
                              </span>
                            </button>

                            <span className="text-slate-300 dark:text-slate-600">|</span>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = toggleFeedbackSkillSelection(s);
                                setSelectedHeatmapSkills(updated);
                              }}
                              title={isMappedToHeatmap ? 'Included in Department Heatmap (Click to remove)' : 'Click to include in Department vs Skill Heatmap'}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                                isMappedToHeatmap
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-teal-100 hover:text-teal-800 dark:hover:bg-teal-900/60 dark:hover:text-teal-200'
                              }`}
                            >
                              {isMappedToHeatmap ? '✓ Heatmap' : '+ Map'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Demanded but not found */}
                  <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Critical Skills Demanded but Not Found</span>
                      </div>
                      <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-medium">
                        Click skill to add to TPO curriculum
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {fb.requiredSkillsNotFound.map((s, idx) => {
                        const inCatalog = isSkillInCurriculum(s);
                        const isMappedToHeatmap = selectedHeatmapSkills.includes(s);
                        return (
                          <div
                            key={idx}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                              inCatalog
                                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-200 dark:border-amber-800/80'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenAddSkillModal(s, fb)}
                              title={inCatalog ? 'Already in Curriculum Catalog (Click to inspect or reconfigure)' : 'Click to add directly to TPO Curriculum Catalog with custom checkpoints'}
                              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                            >
                              {inCatalog ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                              <span>{s}</span>
                              <span className="text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-indigo-600 hover:text-white transition-colors">
                                {inCatalog ? 'In Catalog' : '+ Add'}
                              </span>
                            </button>

                            <span className="text-slate-300 dark:text-slate-600">|</span>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = toggleFeedbackSkillSelection(s);
                                setSelectedHeatmapSkills(updated);
                              }}
                              title={isMappedToHeatmap ? 'Included in Department Heatmap (Click to remove)' : 'Click to include in Department vs Skill Heatmap'}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                                isMappedToHeatmap
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-teal-100 hover:text-teal-800 dark:hover:bg-teal-900/60 dark:hover:text-teal-200'
                              }`}
                            >
                              {isMappedToHeatmap ? '✓ Heatmap' : '+ Map'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Improvement Directive from Company */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Company Improvement Directives for College / TPO
                    </span>
                    <span className="text-[11px] text-slate-400">Panel recommendation</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{fb.improvementDirective}"
                  </p>
                </div>

                {/* TPO Actions & Status Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>Evaluated: <strong className="text-slate-700 dark:text-slate-300">{fb.studentsEvaluatedCount} students</strong></span>
                    <span>Readiness: <strong className="text-indigo-600 dark:text-indigo-400">{fb.readinessScore}%</strong></span>
                    <span>Hired: <strong className="text-emerald-600 dark:text-emerald-400">{fb.shortlistedCount}</strong></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {fb.status === 'Delivered to TPO' && (
                      <button
                        onClick={() => handleAcknowledge(fb.id, fb.collegeName)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge & Calibrate</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setRespondingFeedbackId(respondingFeedbackId === fb.id ? null : fb.id);
                        setTpoResponseText('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center gap-1 hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{respondingFeedbackId === fb.id ? 'Close' : 'Log Curriculum Action'}</span>
                    </button>
                  </div>
                </div>

                {/* Active TPO Response Note Display */}
                {fb.tpoResponseNote && (
                  <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">College TPO Action Note:</span>
                      <p className="mt-0.5">{fb.tpoResponseNote}</p>
                    </div>
                  </div>
                )}

                {/* Inline Curriculum Action Form */}
                {respondingFeedbackId === fb.id && (
                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800 space-y-2.5 animate-fade-in">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Log Remedial Curriculum Action for {fb.batchYear} ({fb.department}):
                    </label>
                    <textarea
                      rows={2}
                      value={tpoResponseText}
                      onChange={(e) => setTpoResponseText(e.target.value)}
                      placeholder="e.g., Curriculum committee introduced a mandatory 3-week hands-on Docker & SQL tuning workshop for semester 7..."
                      className="w-full text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRespondingFeedbackId(null)}
                        className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleInitiateCurriculumAction(fb.id)}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                      >
                        Save Action Plan & Notify Company
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Candidate Scorecards Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {candidateFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {fb.companyName}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {fb.candidateName} ({fb.candidateRoll})
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Role: {fb.roleApplied}
                  </div>
                </div>

                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  {fb.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg">
                "{fb.interviewerNotes}"
              </p>

              <div className="text-xs text-slate-500 flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                <span>Technical: <strong>{fb.technicalCompetency}%</strong></span>
                <span>Soft Skills: <strong>{fb.communicationScore}%</strong></span>
                <span>Date: <strong>{fb.interviewDate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD MISSING SKILL TO TPO CURRICULUM WITH MANUAL CHECKPOINTS MODAL         */}
      {/* ========================================================================= */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Add Missing Skill to Curriculum & Configure Checkpoints
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sourced from corporate placement feedback. Configure manual checkpoints across Beginner, Intermediate & Advance tiers.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAddSkillModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Source Information Badge */}
            {modalSourceFeedback && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>Reported by: <strong className="text-slate-900 dark:text-white">{modalSourceFeedback.companyName}</strong></span>
                  <span>•</span>
                  <span>Batch: <strong className="text-slate-900 dark:text-white">{modalSourceFeedback.batchYear}</strong> ({modalSourceFeedback.department})</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetPresets}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reset to Suggested Presets</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSaveSkillToCurriculum} className="space-y-5 text-xs">
              {/* Skill Name and Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalSkillName}
                    onChange={(e) => setModalSkillName(e.target.value)}
                    placeholder="e.g. Docker & Multi-Stage Containers"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value as Skill['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
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

              {/* Dynamic Weight Equation Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-amber-50 to-purple-50 dark:from-emerald-950/30 dark:via-amber-950/25 dark:to-purple-950/25 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    3-Tier Verification Weight Equation:
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Beginner (33%) + Intermediate (33%) + Advance (34%) = 100% Total Proficiency
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                    Beginner: +{bPerCheckpoint}% / item
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                    Intermediate: +{iPerCheckpoint}% / item
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold text-[11px]">
                    Advance: +{aPerCheckpoint}% / item
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 1. BEGINNER TIER (33% WEIGHT)                                            */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/25 dark:bg-emerald-950/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                      1. Beginner Tier Checkpoints (Fixed 33% Total Weight)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    {beginnerCheckpoints.length} Checkpoints ({bPerCheckpoint}% each)
                  </span>
                </div>

                {/* Existing Checkpoints List */}
                <div className="space-y-2">
                  {beginnerCheckpoints.map((cp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-center text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={cp}
                        onChange={(e) => {
                          const copy = [...beginnerCheckpoints];
                          copy[idx] = e.target.value;
                          setBeginnerCheckpoints(copy);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                        placeholder="Checkpoint milestone title..."
                        required
                      />
                      {beginnerCheckpoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setBeginnerCheckpoints(beginnerCheckpoints.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer rounded-md"
                          title="Remove checkpoint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dedicated Manual Add Checkpoint Input */}
                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={manualBeginnerInput}
                      onChange={(e) => setManualBeginnerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddManualBeginner();
                        }
                      }}
                      placeholder="Manually type a custom Beginner checkpoint & hit Enter..."
                      className="w-full pl-3 pr-3 py-1.5 text-xs rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddManualBeginner()}
                      disabled={!manualBeginnerInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Checkpoint</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBeginnerCheckpoints([...beginnerCheckpoints, ''])}
                      className="px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 2. INTERMEDIATE TIER (33% WEIGHT)                                        */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/25 dark:bg-amber-950/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                      2. Intermediate Tier Checkpoints (Fixed 33% Total Weight)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    {intermediateCheckpoints.length} Checkpoints ({iPerCheckpoint}% each)
                  </span>
                </div>

                {/* Existing Checkpoints List */}
                <div className="space-y-2">
                  {intermediateCheckpoints.map((cp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-center text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={cp}
                        onChange={(e) => {
                          const copy = [...intermediateCheckpoints];
                          copy[idx] = e.target.value;
                          setIntermediateCheckpoints(copy);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                        placeholder="Checkpoint milestone title..."
                        required
                      />
                      {intermediateCheckpoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setIntermediateCheckpoints(intermediateCheckpoints.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer rounded-md"
                          title="Remove checkpoint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dedicated Manual Add Checkpoint Input */}
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={manualIntermediateInput}
                      onChange={(e) => setManualIntermediateInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddManualIntermediate();
                        }
                      }}
                      placeholder="Manually type a custom Intermediate checkpoint & hit Enter..."
                      className="w-full pl-3 pr-3 py-1.5 text-xs rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddManualIntermediate()}
                      disabled={!manualIntermediateInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Checkpoint</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntermediateCheckpoints([...intermediateCheckpoints, ''])}
                      className="px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 3. ADVANCE TIER (34% WEIGHT)                                             */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/25 dark:bg-purple-950/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">
                      3. Advance Tier Checkpoints (Fixed 34% Total Weight)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                    {advanceCheckpoints.length} Checkpoints ({aPerCheckpoint}% each)
                  </span>
                </div>

                {/* Existing Checkpoints List */}
                <div className="space-y-2">
                  {advanceCheckpoints.map((cp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-center text-purple-700 dark:text-purple-400 font-bold text-[11px]">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={cp}
                        onChange={(e) => {
                          const copy = [...advanceCheckpoints];
                          copy[idx] = e.target.value;
                          setAdvanceCheckpoints(copy);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                        placeholder="Checkpoint milestone title..."
                        required
                      />
                      {advanceCheckpoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setAdvanceCheckpoints(advanceCheckpoints.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer rounded-md"
                          title="Remove checkpoint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dedicated Manual Add Checkpoint Input */}
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/40 flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={manualAdvanceInput}
                      onChange={(e) => setManualAdvanceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddManualAdvance();
                        }
                      }}
                      placeholder="Manually type a custom Advance checkpoint & hit Enter..."
                      className="w-full pl-3 pr-3 py-1.5 text-xs rounded-lg border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddManualAdvance()}
                      disabled={!manualAdvanceInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Checkpoint</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdvanceCheckpoints([...advanceCheckpoints, ''])}
                      className="px-2.5 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Publish Skill to TPO Curriculum Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
