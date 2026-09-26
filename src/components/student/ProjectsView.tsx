import React, { useState, useEffect } from 'react';
import { loadProjects, saveProjects, PROJECTS_UPDATED_EVENT } from '../../data/projectsStore';
import { Project } from '../../types';
import { ProjectAIVerificationModal } from './ProjectAIVerificationModal';
import { 
  FolderGit2, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Github, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck,
  Plus,
  X,
  Code2,
  Check,
  RotateCcw,
  FileCode,
  FileArchive,
  Layers
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeVerifyingProject, setActiveVerifyingProject] = useState<Project | null>(null);
  
  useEffect(() => {
    const handleUpdate = () => {
      setProjects(loadProjects());
    };
    window.addEventListener(PROJECTS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(PROJECTS_UPDATED_EVENT, handleUpdate);
  }, []);
  
  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [newStack, setNewStack] = useState('React, TypeScript, Tailwind CSS, Node.js');
  const [autoStartDefense, setAutoStartDefense] = useState(true);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);

  const handleVerificationComplete = (
    projectId: string, 
    score: number, 
    passed: boolean, 
    methods: string[], 
    questionScore: { correct: number; total: number }
  ) => {
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        status: passed ? ('passed' as const) : ('flagged' as const),
        originalityScore: score,
        qnaPassed: passed,
        methodsAnalyzed: methods,
        questionsScore: questionScore,
        verifiedDate: passed ? 'Sep 2026' : undefined,
        flagReason: passed
          ? undefined
          : `Architectural defense score below threshold (${questionScore.correct}/${questionScore.total} correct). Re-verify logic required.`,
      };
    });
    setProjects(updated);
    saveProjects(updated);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newProj: Project = {
      id: `p-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Full-stack engineering project demonstrating clean architecture and distributed state handling.',
      techStack: newStack.split(',').map((s) => s.trim()),
      repoUrl: newRepo || 'https://github.com/harshitseth-dev/' + newTitle.toLowerCase().replace(/\s+/g, '-'),
      originalityScore: 89,
      status: 'pending',
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setIsUploadOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewRepo('');
    setUploadFileName(null);

    // If auto-start defense is selected, trigger AI analysis immediately
    if (autoStartDefense) {
      setTimeout(() => {
        setActiveVerifyingProject(newProj);
      }, 300);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Projects & AI Code Defense
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload code or connect GitHub. The AI inspects internal methods, detects architectural patterns, and conducts a logic defense Q&A.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Project / Git Repo</span>
        </button>
      </div>

      {/* Info Callout Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-indigo-950 dark:text-indigo-100">AI Deep Method Verification Standard</span>
            <span className="text-indigo-700 dark:text-indigo-300 leading-relaxed text-[11px] block mt-0.5">
              Score ≥ 3/4 on architectural defense Q&A to unlock the verified badge and top candidate ranking for recruiters.
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-emerald-950 dark:text-emerald-100">Mandatory Application Gate: Project Proof</span>
            <span className="text-emerald-700 dark:text-emerald-300 leading-relaxed text-[11px] block mt-0.5">
              Companies require project demonstrations for all <strong>Required Skills</strong>. Multiple projects combine to fulfill this (e.g. Project 1 + Project 2). Preferred skills do not mandate projects.
            </span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Drag-Drop Upload Card */}
        <div
          onClick={() => setIsUploadOpen(true)}
          className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Upload Project or Connect Git Link
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Drag & drop zip code bundle or paste a GitHub repo URL. AI will parse your methods and initiate the interactive defense.
          </p>
          <span className="mt-3 text-xs font-semibold text-indigo-600 underline">
            Add New Project Now
          </span>
        </div>

        {/* Existing Projects */}
        {projects.map((project) => {
          const isPassed = project.status === 'passed';
          const isPending = project.status === 'pending';
          const isFlagged = project.status === 'flagged';

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                {/* Top Badge area */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {project.title}
                    </h2>
                    {project.questionsScore && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        Defense Score: {project.questionsScore.correct}/{project.questionsScore.total} Correct
                      </span>
                    )}
                  </div>

                  {isPassed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>AI Verified ✓</span>
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending AI Q&A</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flagged / Re-Verify</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3.5 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* AI Inspected Methods Tags (if analyzed) */}
                {project.methodsAnalyzed && project.methodsAnalyzed.length > 0 && (
                  <div className="mb-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Code2 className="w-3 h-3 text-indigo-600" />
                      Inspected Methods ({project.methodsAnalyzed.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.methodsAnalyzed.map((m, i) => (
                        <span key={i} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Originality Score Bar */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">AST Originality Score</span>
                    <span className={`font-bold ${isFlagged ? 'text-red-600' : 'text-slate-900'}`}>
                      {project.originalityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFlagged ? 'bg-red-500' : isPassed ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${project.originalityScore}%` }}
                    />
                  </div>
                  {project.flagReason && (
                    <p className="text-[11px] text-red-600 mt-2 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{project.flagReason}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>

                {isPending && (
                  <button
                    onClick={() => setActiveVerifyingProject(project)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Verify Logic Now</span>
                  </button>
                )}

                {isPassed && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified {project.verifiedDate}
                    </span>
                    <button
                      onClick={() => setActiveVerifyingProject(project)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium underline ml-1"
                    >
                      Review Q&A
                    </button>
                  </div>
                )}

                {isFlagged && (
                  <button
                    onClick={() => setActiveVerifyingProject(project)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Verify Logic</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Project AI Verification Stepper Modal */}
      {activeVerifyingProject && (
        <ProjectAIVerificationModal
          project={activeVerifyingProject}
          isOpen={true}
          onClose={() => setActiveVerifyingProject(null)}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      {/* Upload New Project Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Upload Project for AI Verification
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Supports GitHub URL or ZIP archive upload
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue & Broker"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                />
              </div>

              {/* Git Link or Zip File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  GitHub Repository URL or File Upload
                </label>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={newRepo}
                      onChange={(e) => {
                        setNewRepo(e.target.value);
                        setUploadFileName(null);
                      }}
                      placeholder="https://github.com/username/project-repo"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                    />
                  </div>

                  <label className="cursor-pointer px-3 py-2 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 text-indigo-700 text-xs font-medium flex items-center gap-1.5 shrink-0">
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Upload ZIP</span>
                    <input
                      type="file"
                      accept=".zip,.tar,.gz"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadFileName(file.name);
                          setNewRepo(`local://${file.name}`);
                          if (!newTitle) {
                            setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                {uploadFileName && (
                  <div className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span className="font-mono truncate">{uploadFileName} attached</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadFileName(null);
                        setNewRepo('');
                      }}
                      className="text-slate-400 hover:text-slate-600 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  value={newStack}
                  onChange={(e) => setNewStack(e.target.value)}
                  placeholder="React, TypeScript, Node.js, Redis"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Project Description & Key Architectural Methods
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize key methods used (e.g. rate limiting, concurrency locks, caching)..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                />
              </div>

              {/* Auto start AI logic defense checkbox */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto-start-defense"
                    checked={autoStartDefense}
                    onChange={(e) => setAutoStartDefense(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <label htmlFor="auto-start-defense" className="text-xs font-medium text-slate-800 cursor-pointer">
                    Launch AI method scan & defense immediately upon upload
                  </label>
                </div>
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  {autoStartDefense ? 'Upload & Start Defense' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
