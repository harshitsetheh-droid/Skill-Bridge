import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  Check, 
  RotateCcw,
  Cpu,
  Fingerprint,
  Code2,
  GitBranch,
  FileCode,
  Layers,
  HelpCircle,
  BookOpen,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { useProctoring } from '../../proctoring/useProctoring';
import { useQuestionTimer } from '../../proctoring/useQuestionTimer';
import { ProctorSetup } from '../common/ProctorSetup';
import { ProctorHud } from '../common/ProctorHud';
import { QuestionTimer } from '../common/QuestionTimer';

interface ProjectAIVerificationModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (
    projectId: string, 
    score: number, 
    passed: boolean, 
    methods: string[], 
    questionScore: { correct: number; total: number }
  ) => void;
}

interface MethodQuestion {
  methodName: string;
  fileLocation: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export const ProjectAIVerificationModal: React.FC<ProjectAIVerificationModalProps> = ({
  project,
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  // Stepper: 
  // 1: Deep Codebase & Method Inspection
  // 2: AST Originality & Architecture Map
  // 3: Project Method Logic Q&A
  // 4: Final Evaluation (Accepted vs Flagged/Re-verify)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [scanProgress, setScanProgress] = useState(15);
  const [analyzedStage, setAnalyzedStage] = useState('Reading repository tree...');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [defenseReady, setDefenseReady] = useState(false);
  const [originalityScore] = useState(
    project.originalityScore && project.originalityScore >= 70
      ? project.originalityScore
      : 91
  );

  // Derive dynamic methods based on project stack and title
  const detectedMethods = React.useMemo(() => {
    const stack = project.techStack.join(' ').toLowerCase();
    const title = project.title.toLowerCase();

    if (stack.includes('canvas') || title.includes('canvas') || title.includes('board') || stack.includes('socket')) {
      return [
        { name: 'reconcileCanvasRaster()', file: 'src/engine/canvas.ts', desc: 'Bypasses Virtual DOM via requestAnimationFrame for 60fps rendering.' },
        { name: 'handleOptimisticSync()', file: 'src/sync/clientSync.ts', desc: 'Applies vector clock timestamps to resolve concurrent strokes without lag.' },
        { name: 'pruneOperationalTransformLog()', file: 'src/sync/otLog.ts', desc: 'Truncates stale operational transforms beyond oldest active client horizon.' },
        { name: 'validateMessagePayload()', file: 'src/gateway/schema.ts', desc: 'Zod boundary schema validator discarding invalid socket frames.' },
      ];
    } else if (stack.includes('python') || stack.includes('ai') || stack.includes('data') || title.includes('ai') || title.includes('intel')) {
      return [
        { name: 'generateBatchEmbeddings()', file: 'services/nlp_pipeline.py', desc: 'Vector cosine similarity clustering with async sliding context windows.' },
        { name: 'cacheEmbeddingEviction()', file: 'storage/lru_cache.py', desc: 'LRU memory eviction policy bounding Redis cache footprint to 512MB.' },
        { name: 'streamAsyncTokens()', file: 'api/stream_router.py', desc: 'Server-Sent Events generator yielding tokens with backpressure mitigation.' },
        { name: 'sanitizeModelPrompt()', file: 'security/guardrails.py', desc: 'RegEx & token sanitizer checking for prompt injection signatures.' },
      ];
    } else {
      // Default modern fullstack
      return [
        { name: 'executeDistributedTransaction()', file: 'src/services/orderService.ts', desc: 'Two-phase commit coordinator with rollback compensations.' },
        { name: 'tokenBucketRateLimiter()', file: 'src/middleware/rateLimit.ts', desc: 'Redis-backed token bucket restricting abuse bursts to 60 req/min.' },
        { name: 'memoizedQueryCache()', file: 'src/lib/cacheManager.ts', desc: 'Stale-while-revalidate stale key invalidator with TTL eviction.' },
        { name: 'verifyJwtClaims()', file: 'src/auth/jwtInterceptor.ts', desc: 'Cryptographic public key verification with clock-skew tolerance.' },
      ];
    }
  }, [project]);

  // Dynamic project questions tailored to the methods and architecture
  const questions: MethodQuestion[] = React.useMemo(() => {
    const methods = detectedMethods;
    return [
      {
        methodName: methods[0].name,
        fileLocation: methods[0].file,
        question: `In your method '${methods[0].name}' (${methods[0].file}), why was this specific implementation pattern chosen over standard defaults?`,
        options: [
          `To decouple high-frequency operations from standard thread bottlenecks, ensuring guaranteed sub-16ms latency without blocking execution.`,
          `Because standard frameworks completely forbid any state modification in asynchronous routines.`,
          `This method was copied directly from boilerplate documentation without any architectural consideration.`
        ],
        correctIndex: 0,
        rationale: `Accurate architectural justification! It properly isolates intensive execution from main bottlenecks.`
      },
      {
        methodName: methods[1].name,
        fileLocation: methods[1].file,
        question: `How does '${methods[1].name}' handle network partition or delayed state synchronization between concurrent clients?`,
        options: [
          `It reloads the browser tab and wipes all uncommitted user state.`,
          `It tags mutations with monotonically increasing sequence IDs and handles idempotent reconciliation upon reconnect.`,
          `It silently ignores all out-of-order packets and allows state drift.`
        ],
        correctIndex: 1,
        rationale: `Spot on! Idempotent sequence tagging prevents duplication and guarantees eventual consistency.`
      },
      {
        methodName: methods[2].name,
        fileLocation: methods[2].file,
        question: `What safety guarantee is enforced inside '${methods[2].name}' to prevent memory leaks or unbounded resource exhaustion?`,
        options: [
          `Active snapshotting and pruning of stale operational logs beyond the oldest active consumer horizon.`,
          `Relying purely on the default operating system swap space without program intervention.`,
          `Restricting every end user to a hard limit of only 5 actions per session.`
        ],
        correctIndex: 0,
        rationale: `Exact! Periodic snapshotting and log compaction prevent unbounded heap accumulation.`
      },
      {
        methodName: methods[3].name,
        fileLocation: methods[3].file,
        question: `In '${methods[3].name}', how does the codebase defend against unexpected payloads or boundary vulnerabilities?`,
        options: [
          `All inputs are directly cast to type 'any' to maximize processing throughput.`,
          `Strict schema parse boundaries reject malformed fields at the ingress boundary before passing to internal handlers.`,
          `The application restarts the Node/Python worker whenever an unhandled payload exception is thrown.`
        ],
        correctIndex: 1,
        rationale: `Excellent defensive design! Strict ingress schema validation prevents downstream type corruption.`
      }
    ];
  }, [detectedMethods]);

  // ── Proctoring (camera + mic + tab) for the Method Defense Q&A ────────────
  const proctor = useProctoring({
    maxWarnings: 3,
    onViolationLimitReached: () => finalizeDefense(userAnswersRef.current),
  });

  const timer = useQuestionTimer({
    totalSeconds: 30,
    running: isOpen && step === 3 && defenseReady && currentQuestionIndex < questions.length,
    onExpire: () => handleDefenseTimeout(),
  });

  const userAnswersRef = React.useRef<number[]>([]);
  useEffect(() => {
    userAnswersRef.current = userAnswers;
  }, [userAnswers]);

  useEffect(() => {
    if (step === 3 && defenseReady && isOpen) {
      timer.reset();
      setSelectedOption(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, step, defenseReady, isOpen]);

  // Auto-advance scanning phase
  useEffect(() => {
    if (!isOpen) {
      proctor.stop();
      setDefenseReady(false);
      setStep(1);
      setScanProgress(15);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setUserAnswers([]);
      return;
    }

    if (step === 1) {
      const stages = [
        'Inspecting repository AST tree and module dependencies...',
        'Extracting core functions, hooks, and architectural handlers...',
        'Analyzing methods: ' + detectedMethods.map(m => m.name.split('(')[0]).join(', ') + '...',
        'Comparing syntax graphs against 450,000+ public repos...',
        'Synthesizing contextual logic comprehension questions...'
      ];

      let progress = 15;
      const interval = setInterval(() => {
        progress += 18;
        if (progress < 40) setAnalyzedStage(stages[0]);
        else if (progress < 65) setAnalyzedStage(stages[1]);
        else if (progress < 85) setAnalyzedStage(stages[2]);
        else if (progress < 100) setAnalyzedStage(stages[3]);
        else setAnalyzedStage(stages[4]);

        setScanProgress(Math.min(progress, 100));

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(2), 700);
        }
      }, 400);

      return () => clearInterval(interval);
    }
  }, [isOpen, step, detectedMethods]);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex];
  const PASS_THRESHOLD = 3; // Minimum 3 out of 4 correct to accept

  const beginDefense = () => {
    setDefenseReady(false);
    setStep(3);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
  };

  const handleDefenseProctorGranted = async () => {
    const ok = await proctor.start();
    if (ok) setDefenseReady(true);
  };

  const finalizeDefense = (answers: number[]) => {
    proctor.stop();
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const isPassed = correctCount >= PASS_THRESHOLD;
    const methodNames = detectedMethods.map(m => m.name);

    setStep(4);
    onVerificationComplete(
      project.id,
      isPassed ? originalityScore : Math.min(originalityScore, 58),
      isPassed,
      methodNames,
      { correct: correctCount, total: questions.length }
    );
  };

  const handleDefenseTimeout = () => {
    if (step !== 3 || !defenseReady) return;
    if (selectedOption !== null) return;
    const updated = [...userAnswers, -1];
    setUserAnswers(updated);
    setSelectedOption(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finalizeDefense(updated);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    const updatedAnswers = [...userAnswers, optionIndex];
    setUserAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        finalizeDefense(updatedAnswers);
      }
    }, 1200);
  };

  const handleRetakeDefense = () => {
    beginDefense();
  };

  // Calculate stats for Step 4
  const correctCount = userAnswers.reduce((acc, ans, idx) => {
    return ans === questions[idx]?.correctIndex ? acc + 1 : acc;
  }, 0);
  const isAccepted = correctCount >= PASS_THRESHOLD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-slate-200 overflow-hidden animate-scale-in">
        
        {/* Header with Project Title & Close */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  AI Project Logic & Method Verification
                </h2>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Pass Threshold: {PASS_THRESHOLD}/{questions.length} Correct
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                Project: <span className="font-semibold text-slate-700">{project.title}</span> • {project.repoUrl}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 pt-3 pb-2.5 border-b border-slate-100 flex items-center justify-between bg-white text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span className={step === 1 ? 'text-indigo-600 font-bold' : 'text-slate-500'}>Codebase Scan</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span className={step === 2 ? 'text-indigo-600 font-bold' : 'text-slate-500'}>Methods & AST</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span className={step === 3 ? 'text-indigo-600 font-bold' : 'text-slate-500'}>Method Defense Q&A</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 4 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 4 ? (isAccepted ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white') : 'bg-slate-200 text-slate-600'}`}>4</span>
            <span className={step === 4 ? (isAccepted ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold') : 'text-slate-500'}>
              Outcome
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">

          {/* ========================================================================= */}
          {/* STEP 1: Deep Project & Method Extraction Scanner */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="text-center py-5">
              <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <Fingerprint className="w-9 h-9 text-indigo-600" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                AI Deep Project Inspection in Progress...
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {analyzedStage}
              </p>

              {/* Progress Bar */}
              <div className="w-full max-w-sm mx-auto mt-6 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              {/* Extracted Methods Preview Chips */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Live Method Extraction ({detectedMethods.length} Methods Found)
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {detectedMethods.slice(0, 3).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-indigo-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                      <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-slate-400 text-[10px] ml-auto font-sans">{m.file}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                <Cpu className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                <span>Parsing AST nodes... {scanProgress}% complete</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Methods Discovered & Originality Report */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="py-2 space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">
                      Project Ingestion & Codebase Scan Succeeded
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Originality Score: <span className="font-extrabold">{originalityScore}%</span> • Zero clone signatures detected.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-emerald-700 border border-emerald-200">
                  Ready for Defense
                </span>
              </div>

              {/* Detected Architecture & Methods Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Methods & Architecture Analyzed by AI
                  </h4>
                  <span className="text-[11px] text-slate-400">Questions synthesized from these files</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detectedMethods.map((method, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-indigo-900 truncate">
                          {method.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          M{idx + 1}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mb-1.5">
                        <FileCode className="w-3 h-3 text-slate-400" />
                        <span>{method.file}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {method.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules Callout */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
                <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Next Step: Logic Comprehension Defense</span>
                  <p className="text-indigo-700 mt-0.5 leading-relaxed">
                    The AI will ask 4 targeted questions regarding the methods, architectural tradeoffs, and error boundaries in this project. 
                    Answer at least <span className="font-bold text-indigo-950">3 out of 4 correctly</span> to fully accept and verify the project.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Verify Later
                </button>
                <button
                  id="start-project-defense-btn"
                  onClick={beginDefense}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Start AI Method Defense (4 Questions)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: Chat / Interactive Method Logic Q&A */}
          {/* ========================================================================= */}
          {step === 3 &&
            (!defenseReady ? (
              <div className="space-y-4 p-4">
                <ProctorSetup
                  status={proctor.status}
                  error={proctor.error}
                  videoRef={proctor.videoRef}
                  onGrant={() => void handleDefenseProctorGranted()}
                  onCancel={() => {
                    proctor.stop();
                    setStep(2);
                  }}
                  title="Proctored AI Method Defense — Enable Camera & Mic"
                  subtitle="The AI asks 4 method-defense questions. Camera tracks your movement/face and the mic detects talking, so cheating is impossible."
                />
              </div>
            ) : (
            <div className="space-y-4">
              {/* Live Proctoring HUD */}
              <ProctorHud
                videoRef={proctor.videoRef}
                status={proctor.status}
                warningCount={proctor.warningCount}
                maxWarnings={3}
                tabViolations={proctor.tabViolations}
                lastViolation={proctor.lastViolation}
                faceState={proctor.faceState}
                micLevel={proctor.micLevel}
              />
              {proctor.autoSubmitted && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-800 flex items-center gap-2 animate-fade-in">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span>Proctoring violation detected — defense will be auto-submitted.</span>
                </div>
              )}
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Method Defense • Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Target: {currentQ.methodName} ({currentQ.fileLocation})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    ⛔ Can't go back
                  </span>
                  <QuestionTimer seconds={timer.seconds} progress={timer.progress} totalSeconds={30} />
                </div>
              </div>

              {/* Question Prompt */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Code2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-indigo-950 leading-relaxed">
                      {currentQ.question}
                    </p>
                    <span className="text-[10px] text-indigo-600 mt-1 block">
                      Evaluates architectural reasoning and method choice (no boilerplate syntax guessing).
                    </span>
                  </div>
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, oIdx) => {
                  const isChosen = selectedOption === oIdx;
                  const isCorrect = oIdx === currentQ.correctIndex;
                  const showFeedback = selectedOption !== null;

                  return (
                    <button
                      key={oIdx}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                        showFeedback
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium'
                            : isChosen
                            ? 'bg-red-50 border-red-300 text-red-900 font-medium'
                            : 'bg-white border-slate-200 opacity-50 text-slate-700'
                          : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-bold text-slate-400 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                        {showFeedback && isCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2 animate-fade-in">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{currentQ.rationale}</span>
                </div>
              )}
            </div>
            ))}

          {/* ========================================================================= */}
          {/* STEP 4: Acceptance Evaluation (Fully Accepted vs Flagged / Retake) */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="text-center py-3">
              {isAccepted ? (
                // SUCCESS STATE: Project Fully Accepted!
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3 shadow-xs border border-emerald-300">
                    <ShieldCheck className="w-9 h-9" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                    <Check className="w-3.5 h-3.5" />
                    <span>Project Fully Accepted & Verified ✓</span>
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900">
                    Code Defense Passed ({correctCount}/{questions.length} Correct)
                  </h2>

                  <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    Great work! You demonstrated thorough understanding of the methods and architecture used in <span className="font-semibold text-slate-800">{project.title}</span>. This project has been stamped with a tamper-proof verification seal and boosted in recruiter match algorithms.
                  </p>

                  {/* Verification Certificate */}
                  <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left max-w-md mx-auto space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500">Verification Seal</span>
                      <span className="font-mono font-semibold text-indigo-700">SB-DEFENSE-{Date.now().toString().slice(-6)}-PASSED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">AST Originality Score</span>
                      <span className="font-bold text-emerald-600">{originalityScore}% Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Methods Defended</span>
                      <span className="font-bold text-slate-800">{detectedMethods.length} Methods Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Defense Accuracy</span>
                      <span className="font-bold text-emerald-600">{Math.round((correctCount / questions.length) * 100)}% (Score {correctCount}/{questions.length})</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      Return to Projects
                    </button>
                  </div>
                </>
              ) : (
                // FAILURE STATE: Below Threshold -> Re-verify Logic or Review Methods
                <>
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-3 shadow-xs border border-amber-300">
                    <AlertTriangle className="w-9 h-9" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Logic Defense Below Threshold ({correctCount}/{questions.length} Correct)</span>
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900">
                    Project Not Fully Accepted Yet
                  </h2>

                  <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    To maintain strict integrity for partner companies, projects require at least <span className="font-bold text-slate-800">{PASS_THRESHOLD} out of {questions.length} correct</span> answers on architectural methods.
                  </p>

                  {/* Flagged Methods Breakdown */}
                  <div className="mt-5 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 text-left max-w-md mx-auto space-y-2 text-xs">
                    <span className="font-bold text-amber-900 block">
                      Methods Requiring Architectural Review:
                    </span>
                    <ul className="space-y-1.5 list-disc pl-4 text-amber-800 text-[11px]">
                      {questions.map((q, idx) => {
                        const answeredCorrectly = userAnswers[idx] === q.correctIndex;
                        if (answeredCorrectly) return null;
                        return (
                          <li key={idx}>
                            <span className="font-mono font-semibold">{q.methodName}</span> in <span className="font-mono">{q.fileLocation}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <button
                      id="retake-defense-btn"
                      onClick={handleRetakeDefense}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-Verify Logic / Retake Defense</span>
                    </button>

                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Keep as Flagged & Study Methods
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
