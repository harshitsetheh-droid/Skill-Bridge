import React, { useMemo, useState } from 'react';
import { initialCompanyData, talentSkillGapData, MissingSkillSegment } from '../../data/mockData';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles,
  Download,
  Building2,
  Filter,
  ArrowUpDown,
  Globe2
} from 'lucide-react';

type ScopeKey = 'overall' | 'off_campus' | 'college';
type SortMode = 'percentage' | 'count' | 'skill';

export const CompanyAnalyticsView: React.FC = () => {
  const [scopeKey, setScopeKey] = useState<ScopeKey>('overall');
  const [selectedCollege, setSelectedCollege] = useState<string>(talentSkillGapData.colleges[0].name);
  const [sortMode, setSortMode] = useState<SortMode>('percentage');

  const activeScope = useMemo(() => {
    if (scopeKey === 'overall') return talentSkillGapData.overall;
    if (scopeKey === 'off_campus') return talentSkillGapData.offCampus;
    return talentSkillGapData.colleges.find((c) => c.name === selectedCollege)?.scope || talentSkillGapData.colleges[0].scope;
  }, [scopeKey, selectedCollege]);

  const sortedSkills = useMemo(() => {
    const copy = [...activeScope.skills];
    if (sortMode === 'percentage') return copy.sort((a, b) => b.percentage - a.percentage);
    if (sortMode === 'count') return copy.sort((a, b) => b.count - a.count);
    return copy.sort((a, b) => a.skill.localeCompare(b.skill));
  }, [activeScope, sortMode]);

  const scopeSwitches: { key: ScopeKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overall', label: 'Overall', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'college', label: 'College-Wise', icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: 'off_campus', label: 'Off-Campus', icon: <Globe2 className="w-3.5 h-3.5" /> },
  ];

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Top Missing Skills Across Applicant Pool
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies which industry-mandated technologies are most lacking in student applications.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            N = {activeScope.applicants} Applicants Analyzed
          </span>
        </div>

        {/* Scope Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium">
            {scopeSwitches.map((sw) => (
              <button
                key={sw.key}
                onClick={() => setScopeKey(sw.key)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  scopeKey === sw.key
                    ? 'bg-white shadow-xs text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sw.icon}
                <span>{sw.label}</span>
              </button>
            ))}
          </div>

          {/* College Selector (visible only in college-wise mode) */}
          {scopeKey === 'college' && (
            <div className="flex items-center gap-2 text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-hidden cursor-pointer"
              >
                {talentSkillGapData.colleges.map((c) => (
                  <option key={c.scope.key} value={c.name}>
                    {c.name} ({c.scope.applicants} applicants)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-hidden cursor-pointer"
            >
              <option value="percentage">Sort by % Missing</option>
              <option value="count">Sort by Applicants</option>
              <option value="skill">Sort by Skill Name</option>
            </select>
          </div>
        </div>

        {/* Current Scope Summary Strip */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Active View: <span className="text-indigo-700">{activeScope.label}</span>
          </span>
          <span className="text-slate-500">Applicants in group: <strong className="text-slate-800">{activeScope.applicants}</strong></span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="space-y-4">
          {sortedSkills.map((item) => {
            const pct = item.percentage;
            return (
              <div key={item.skill} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    {item.skill}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      {item.count} / {item.applicantsInGroup} applicants lacking
                    </span>
                    <span className="font-extrabold text-slate-900">{pct}%</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* TPO Collaboration Insight Callout */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-blue-950">
          <Sparkles className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Automated Feedback Shared with University TPOs ({activeScope.label}):</span>
            <p className="text-blue-900/80 leading-relaxed">
              {sortedSkills[0]?.percentage || 0}% of applicants in this segment lack {sortedSkills[0]?.skill || 'critical skill'} experience. 
              This aggregate feedback has been synced to the {scopeKey === 'college' ? selectedCollege : scopeKey === 'off_campus' ? 'off-campus' : 'Institute of Technology, Jodhpur'} curriculum gap tracker to help update upcoming lab modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};