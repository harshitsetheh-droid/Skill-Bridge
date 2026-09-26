import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCode, 
  ExternalLink, 
  Check, 
  X,
  MessageSquare
} from 'lucide-react';

interface FlaggedProject {
  id: string;
  studentName: string;
  rollNumber: string;
  branch: string;
  projectTitle: string;
  originalityScore: number;
  flagReason: string;
  status: 'flagged' | 'resolved' | 'defense_requested';
}

const initialFlagged: FlaggedProject[] = [
  {
    id: 'f-1',
    studentName: 'Vikram Joshi',
    rollNumber: 'ITJ22CS089',
    branch: 'Computer Science',
    projectTitle: 'E-Commerce Microservices Storefront',
    originalityScore: 42,
    flagReason: 'AST fingerprint matches popular GitHub tutorial clone with minor variable renaming.',
    status: 'flagged'
  },
  {
    id: 'f-2',
    studentName: 'Ananya Verma',
    rollNumber: 'ITJ22EC034',
    branch: 'Electronics & Comm',
    projectTitle: 'Smart Home Automation Controller',
    originalityScore: 58,
    flagReason: 'Failed live Logic Q&A on MQTT QoS levels and memory leak mitigation in Arduino C++.',
    status: 'defense_requested'
  },
  {
    id: 'f-3',
    studentName: 'Kunal Singhania',
    rollNumber: 'ITJ22CS112',
    branch: 'Computer Science',
    projectTitle: 'Decentralized Voting DApp',
    originalityScore: 39,
    flagReason: 'Smart contract bytecode 94% identical to OpenZeppelin example without custom logic.',
    status: 'flagged'
  }
];

export const ProjectIntegrityView: React.FC = () => {
  const [flaggedProjects, setFlaggedProjects] = useState<FlaggedProject[]>(initialFlagged);
  const [toastMessage, setToastMessage] = useState('');

  const handleAction = (id: string, newStatus: 'resolved' | 'defense_requested', msg: string) => {
    setFlaggedProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Project Code Integrity & Plagiarism Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated AST parsing and AI logic comprehension defenses protecting university accreditation.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Platform-wide Integrity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Original & Defended Code</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">89%</span>
            <span className="text-xs text-emerald-600 font-semibold">1,264 Projects</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Passed AST scan & 5/5 AI logic defenses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Flagged for Integrity Review</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600">8%</span>
            <span className="text-xs text-red-600 font-semibold">114 Flagged</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Boilerplate copy or logic Q&A failure</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Pending Oral / AI Defense</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">3%</span>
            <span className="text-xs text-amber-600 font-semibold">42 Awaiting</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Scheduled for lab faculty review</p>
        </div>
      </div>

      {/* Flagged Projects Review List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Flagged Projects Requiring Academic TPO Action
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review flagged submissions to uphold verified placement credentials for campus hiring partners.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {flaggedProjects.map((item) => {
            const isResolved = item.status === 'resolved';
            const isDefenseReq = item.status === 'defense_requested';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl border transition-all ${
                  isResolved
                    ? 'bg-slate-50/50 border-slate-200 opacity-60'
                    : 'bg-white border-red-200 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {item.projectTitle}
                      </span>
                      {isResolved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Resolved / Cleared
                        </span>
                      ) : isDefenseReq ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Oral Defense Scheduled
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          Flagged ⚠
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submitted by: <strong>{item.studentName}</strong> ({item.rollNumber}) • {item.branch}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 font-medium block">Originality Score</span>
                    <span className="text-lg font-black text-red-600">
                      {item.originalityScore}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-red-50/50 border border-red-100 text-xs text-red-900 mb-4">
                  <span className="font-bold">AST Scan Audit Reason:</span> {item.flagReason}
                </div>

                {/* Review Action Buttons */}
                {!isResolved && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() =>
                        handleAction(
                          item.id,
                          'defense_requested',
                          `Defense meeting scheduled for ${item.studentName} with Faculty Advisor.`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request Oral Defense</span>
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          item.id,
                          'resolved',
                          `Project cleared for ${item.studentName} following faculty review.`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Dismiss Flag & Verify</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
