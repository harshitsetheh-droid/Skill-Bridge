import React from 'react';
import { initialCompanyData, topMissingSkillsData } from '../../data/mockData';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles,
  Download
} from 'lucide-react';

export const CompanyAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Talent Pool & Quality Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry on candidate match distributions and competency bottlenecks.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Talent Quality Benchmark Report (PDF)...')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* KPI Cards: Total Applicants, Avg Match Score, Verified Candidates % */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Total Applicants Received</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {initialCompanyData.stats.totalApplicants}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">+24% vs last cycle</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across 4 university partner batches</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Average Match Score</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-900">
              {initialCompanyData.stats.avgMatchScore}%
            </span>
            <span className="text-xs text-blue-800 font-semibold">High benchmark</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Top tier: 42 candidates above 88%</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Verified Candidates %</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {initialCompanyData.stats.verifiedCandidatesPercent}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">158 verified</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Defended code logic with zero plagiarism</p>
        </div>
      </div>

      {/* "Top Missing Skills Across Applicant Pool" Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Top Missing Skills Across Applicant Pool
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies which industry-mandated technologies are most lacking in student applications.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            N = 248 Total Applicants Analyzed
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="space-y-4">
          {topMissingSkillsData.map((item) => (
            <div key={item.skill} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  {item.skill}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{item.count} applicants lacking</span>
                  <span className="font-extrabold text-slate-900">{item.percentage}%</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* TPO Collaboration Insight Callout */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-blue-950">
          <Sparkles className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Automated Feedback Shared with University TPOs:</span>
            <p className="text-blue-900/80 leading-relaxed">
              57% of applicants lack hands-on Docker containerization experience. This aggregate feedback has been synced to the Institute of Technology, Jodhpur curriculum gap tracker to help update upcoming lab modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
