import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileWarning, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink,
  Ban,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

interface AdminFraudRiskViewProps {
  initialSubTab?: 'resume-issues' | 'skill-verification' | 'risk-alerts';
}

interface RiskItem {
  id: string;
  category: 'Resume Fraud' | 'AST Plagiarism' | 'Fake Certificate' | 'Skill Mismatch';
  targetUser: string;
  targetId: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium';
  detectedAt: string;
  status: 'Investigating' | 'Resolved' | 'Suspended';
}

const mockRisks: RiskItem[] = [
  { id: 'RISK-01', category: 'Resume Fraud', targetUser: 'Rahul Sharma', targetId: 'STU102', description: 'Resume claimed 2 years of production microservices experience at Razorpay while enrolled as full-time 2nd year student. Company verification failed.', severity: 'Critical', detectedAt: '5 min ago', status: 'Investigating' },
  { id: 'RISK-02', category: 'Skill Mismatch', targetUser: 'Priya Verma', targetId: 'STU105', description: 'Claimed Expert level in PyTorch and Distributed Training, but failed 3 consecutive AST code defenses and repo lacked neural net commits.', severity: 'High', detectedAt: '15 min ago', status: 'Investigating' },
  { id: 'RISK-03', category: 'Fake Certificate', targetUser: 'Aman Yadav', targetId: 'STU106', description: 'AWS Solutions Architect certificate serial number invalid; failed cryptographic check on Amazon Web Services public badge verifier.', severity: 'Critical', detectedAt: '28 min ago', status: 'Investigating' },
  { id: 'RISK-04', category: 'Resume Fraud', targetUser: 'Sneha Patel', targetId: 'STU107', description: 'Internship completion certificate mismatch: organization corporate domain inactive and registered only 4 days ago.', severity: 'High', detectedAt: '45 min ago', status: 'Investigating' },
  { id: 'RISK-05', category: 'AST Plagiarism', targetUser: 'User ID: STU12345', targetId: 'STU12345', description: 'AST Abstract Syntax Tree matcher reported 96% token-for-token clone of an open-source Canvas drawing tool with variable names obfuscated.', severity: 'Critical', detectedAt: '1 hr ago', status: 'Investigating' },
  { id: 'RISK-06', category: 'Skill Mismatch', targetUser: 'Kunal Deshmukh', targetId: 'STU109', description: 'Kubernetes production deployment quiz answered in 4 seconds with 100% textbook match; behavioral mouse jitter flagged headless bot.', severity: 'Medium', detectedAt: '2 hrs ago', status: 'Investigating' },
];

export const AdminFraudRiskView: React.FC<AdminFraudRiskViewProps> = ({ initialSubTab = 'risk-alerts' }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'resume' | 'skills'>(
    initialSubTab === 'resume-issues' ? 'resume' : initialSubTab === 'skill-verification' ? 'skills' : 'all'
  );
  const [risks, setRisks] = useState<RiskItem[]>(mockRisks);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = risks.filter(r => {
    if (activeTab === 'resume') return r.category === 'Resume Fraud';
    if (activeTab === 'skills') return r.category === 'Skill Mismatch' || r.category === 'AST Plagiarism';
    return true;
  });

  const handleResolve = (id: string, action: 'clear' | 'suspend') => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, status: action === 'clear' ? 'Resolved' : 'Suspended' } : r));
    setToast(action === 'clear' ? 'Alert dismissed and marked as False Positive' : 'Student account suspended pending manual campus hearing');
    setSelectedRisk(null);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Fraud Prevention & Platform Integrity</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              18 Active Integrity Alerts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated AST code clone detection, credential cryptographic hash audits, and behavioral fraud telemetry.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between shadow-md">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Risk Alerts ({risks.length})
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'resume' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Resume & Experience Fraud
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'skills' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          AST Code Clone & Skill Mismatches
        </button>
      </div>

      {/* Risk Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div 
            key={item.id} 
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {item.category}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {item.targetUser}
                    </h2>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.severity === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {item.severity}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Detected {item.detectedAt}
              </span>

              <div className="flex items-center gap-2">
                {item.status === 'Investigating' ? (
                  <>
                    <button
                      onClick={() => handleResolve(item.id, 'clear')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolve(item.id, 'suspend')}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
                    >
                      Suspend Student
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Status: {item.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
