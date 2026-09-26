import React from 'react';
import { initialCompanyData, initialCandidates } from '../../data/mockData';
import { CircularProgress } from '../common/CircularProgress';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  PlusCircle, 
  ShieldCheck, 
  Briefcase 
} from 'lucide-react';

interface CompanyDashboardProps {
  onNavigateTab: (tab: string) => void;
  onViewCandidate: (id: string) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  onNavigateTab,
  onViewCandidate,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold mb-2 border border-blue-200">
            <Building2 className="w-3.5 h-3.5 text-blue-900" />
            <span>Recruiter Console • Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {initialCompanyData.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
            {initialCompanyData.tagline}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('post-job')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Total Applicants</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{initialCompanyData.stats.totalApplicants}</span>
            <span className="text-xs text-emerald-600 font-semibold">+18 today</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 3 active openings</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Avg Candidate Match</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{initialCompanyData.stats.avgMatchScore}%</span>
            <span className="text-xs text-blue-900 font-semibold">High Quality</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calibrated to skill requirements</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">AI-Verified Talent</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {initialCompanyData.stats.verifiedCandidatesPercent}%
            </span>
            <span className="text-xs text-slate-500 font-medium">158 talent</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Passed code originality & logic</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Active Job Postings</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{initialCompanyData.stats.activePostings}</span>
            <span className="text-xs text-indigo-600 font-semibold">Frontend Intern</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Accepting verified applicants</p>
        </div>
      </div>

      {/* Top Matched Candidates Snapshot */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Top Ranked Applicants
        </h2>

        {/* Candidate List */}
        <div className="space-y-3">
          {initialCandidates.slice(0, 3).map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => onNavigateTab('applied')}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-10 h-10 rounded-xl object-cover shadow-2xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {candidate.name}
                    </span>
                    {candidate.projectVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified ✓</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {candidate.college} • {candidate.branch}
                  </p>
                </div>
              </div>

              {/* Match bar and tags */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
                  {candidate.topSkills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-emerald-600">
                    {candidate.matchScore}%
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Match Score
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
