import React, { useState } from 'react';
import { initialInstitutionData, demandVsSupplySkills } from '../../data/mockData';
import { DepartmentStudentsBreakdownModal } from './DepartmentStudentsBreakdownModal';
import { 
  Landmark, 
  Users, 
  TrendingUp, 
  Briefcase, 
  Sparkles, 
  Network, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface InstitutionOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const InstitutionOverview: React.FC<InstitutionOverviewProps> = ({ onNavigateTab }) => {
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedDeptForModal, setSelectedDeptForModal] = useState('All');

  const handleOpenDeptStudents = (dept: string) => {
    setSelectedDeptForModal(dept);
    setIsStudentsModalOpen(true);
  };
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Landmark className="w-3.5 h-3.5 text-teal-700" />
            <span>Training & Placement Cell (TPO)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {initialInstitutionData.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {initialInstitutionData.accreditation} • 4 Academic Departments Active
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('curriculum-gaps')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Network className="w-4 h-4" />
          <span>Curriculum Gap Heatmap</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Students - with Department Breakdown */}
        <div 
          onClick={() => handleOpenDeptStudents('All')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Enrolled Students</span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Click for Depts
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
              {initialInstitutionData.stats.totalStudents}
            </span>
            <span className="text-xs text-teal-700 font-semibold">2026 Batch</span>
          </div>
          
          {/* Department breakdown pills */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeptStudents('All');
              }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-teal-700 hover:text-white transition-colors"
            >
              All
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeptStudents('CSE');
              }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              CSE
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeptStudents('AI');
              }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors"
            >
              AI
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeptStudents('ECE');
              }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors"
            >
              ECE
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeptStudents('Mechanical');
              }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition-colors"
            >
              Mech
            </button>
          </div>
        </div>

        {/* Placement Ready % */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer group"
        >
          <span className="text-xs font-medium text-slate-500">Placement-Ready %</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {initialInstitutionData.stats.placementReadyPercent}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">+8% vs last year</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1,079 students verified</p>
        </div>

        {/* Active Job Postings */}
        <div 
          onClick={() => onNavigateTab('companies')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer group"
        >
          <span className="text-xs font-medium text-slate-500">Active Campus Openings</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {initialInstitutionData.stats.activeJobPostings}
            </span>
            <span className="text-xs text-teal-700 font-semibold">32 Companies</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">TechNova, Google, Razorpay</p>
        </div>

        {/* Avg Match Score */}
        <div 
          onClick={() => onNavigateTab('curriculum-gaps')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer group"
        >
          <span className="text-xs font-medium text-slate-500">Avg Candidate Match</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-800">
              {initialInstitutionData.stats.avgMatchScore}%
            </span>
            <span className="text-xs text-teal-700 font-semibold">Healthy Index</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Benchmarked against industry</p>
        </div>
      </div>

      {/* Demand vs Supply Skill Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Industry Demand vs Campus Student Supply
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies technology imbalances between employer requirements and verified student proficiencies.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-teal-800">
              <span className="w-3 h-3 rounded-full bg-teal-700" />
              Industry Demand
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-600">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              Student Supply
            </span>
          </div>
        </div>

        {/* Demand vs Supply Bars */}
        <div className="space-y-4">
          {demandVsSupplySkills.map((item) => {
            const gap = item.demand - item.supply;
            const isSevereGap = gap > 35;

            return (
              <div key={item.skill} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    {item.skill}
                    {isSevereGap && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        Critical Gap: -{gap}%
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-teal-800 font-bold">Demand: {item.demand}%</span>
                    <span className="text-slate-500">Supply: {item.supply}%</span>
                  </div>
                </div>

                {/* Paired comparative bars */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-700 h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.demand}%` }}
                    />
                  </div>
                  <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isSevereGap ? 'bg-red-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${item.supply}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-3 text-xs text-teal-950">
          <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Executive TPO Recommendation:</span>
            <p className="text-teal-900/80 mt-0.5 leading-relaxed">
              Cloud DevOps has a 67% deficit between demand (91%) and verified supply (24%). Launching a 4-week containerization crash cohort is projected to raise overall batch placement readiness to 86%.
            </p>
          </div>
        </div>
      </div>

      {/* Department Breakdown Modal for Enrolled Students */}
      <DepartmentStudentsBreakdownModal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        onNavigateTab={onNavigateTab}
        initialDept={selectedDeptForModal}
      />
    </div>
  );
};
