import React, { useState, useEffect } from 'react';
import { 
  getFeedbackHeatmapRows, 
  getAllFeedbackSkills, 
  loadSelectedFeedbackSkills, 
  toggleFeedbackSkillSelection, 
  selectAllFeedbackSkills, 
  selectCriticalFeedbackSkills,
  saveSelectedFeedbackSkills,
  FEEDBACK_SKILLS_UPDATED_EVENT,
  FeedbackSkillItem
} from '../../data/feedbackSkillsStore';
import { BATCH_FEEDBACK_UPDATED_EVENT } from '../../data/feedbackStore';
import { departmentsList } from '../../data/mockData';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
  Building2,
  Check,
  Plus,
  Layers,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';

export const CurriculumGapsView: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => loadSelectedFeedbackSkills());
  const [allFeedbackSkills, setAllFeedbackSkills] = useState<FeedbackSkillItem[]>(() => getAllFeedbackSkills());
  
  const [selectedCell, setSelectedCell] = useState<{
    skill: string;
    dept: string;
    coverage: number;
    notes?: string;
    sourceCompanies?: string[];
    priority?: string;
  } | null>(null);

  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [proposalGenerated, setProposalGenerated] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSelectedSkills(loadSelectedFeedbackSkills());
      setAllFeedbackSkills(getAllFeedbackSkills());
    };

    window.addEventListener(FEEDBACK_SKILLS_UPDATED_EVENT, handleUpdate);
    window.addEventListener(BATCH_FEEDBACK_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(FEEDBACK_SKILLS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener(BATCH_FEEDBACK_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  // Compute heatmap rows strictly based on selected feedback skills
  const heatmapRows = getFeedbackHeatmapRows(selectedSkills);

  const handleGenerateSyllabusRevision = () => {
    setGeneratingProposal(true);
    setTimeout(() => {
      setGeneratingProposal(false);
      setProposalGenerated(true);
    }, 1200);
  };

  const getHeatmapColor = (coverage: number) => {
    if (coverage < 40) {
      return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100';
    } else if (coverage <= 70) {
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100';
    } else {
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100';
    }
  };

  const getHeatmapBadge = (coverage: number) => {
    if (coverage < 40) return 'Critical Gap';
    if (coverage <= 70) return 'Moderate';
    return 'Covered';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Curriculum Gap Matrix & Department Heatmap
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold">
              Dynamic Feedback Driven
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Department vs Skill Heatmap generated directly from recruiter feedback reports and selected industry competencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting Department vs Skill Heatmap to CSV...')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            disabled={generatingProposal}
            onClick={handleGenerateSyllabusRevision}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{generatingProposal ? 'Synthesizing...' : 'Generate Syllabus Addendum'}</span>
          </button>
        </div>
      </div>

      {/* Prominent Callout Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white shadow-sm border border-teal-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Recruiter Feedback Synced Matrix</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-teal-50 leading-snug">
              "Heatmap rows are formulated from active industry feedback (TechNova, CloudSphere, DataHub). Select or deselect skills below to evaluate departmental syllabus coverage."
            </p>
            <p className="text-xs text-teal-200/70">
              Currently analyzing {heatmapRows.length} active feedback skills across Computer Science, AI & DS, Electronics, and Mechanical.
            </p>
          </div>

          <button
            onClick={handleGenerateSyllabusRevision}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 text-xs font-bold shrink-0 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Review Recommended Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Syllabus Proposal Banner if generated */}
      {proposalGenerated && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 animate-scale-in flex items-start justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Docker & Kubernetes Lab Addendum (Draft v1.4) Ready</span>
            </div>
            <p className="text-emerald-800 dark:text-emerald-300">
              A 4-week module outline with grading rubric, Dockerfile lab exercises, and AWS Academy sandbox credentials has been drafted for Academic Council approval.
            </p>
          </div>
          <button
            onClick={() => alert('Downloading Draft Addendum PDF for Academic Senate...')}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shrink-0 cursor-pointer"
          >
            Download Draft PDF
          </button>
        </div>
      )}

      {/* Skill Selection Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Corporate Feedback Skills Included in Heatmap ({selectedSkills.length} of {allFeedbackSkills.length})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                const all = selectAllFeedbackSkills();
                setSelectedSkills(all);
              }}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
            >
              Select All
            </button>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <button
              onClick={() => {
                const crit = selectCriticalFeedbackSkills();
                setSelectedSkills(crit);
              }}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
            >
              Critical Only
            </button>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <button
              onClick={() => {
                saveSelectedFeedbackSkills([]);
                setSelectedSkills([]);
              }}
              className="text-rose-600 dark:text-rose-400 font-semibold hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Click any skill chip to toggle its inclusion in the Department vs Skill Heatmap matrix below:
        </p>

        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {allFeedbackSkills.map((fbSkill) => {
            const isSelected = selectedSkills.includes(fbSkill.skill);
            return (
              <button
                key={fbSkill.skill}
                type="button"
                onClick={() => {
                  const updated = toggleFeedbackSkillSelection(fbSkill.skill);
                  setSelectedSkills(updated);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{fbSkill.skill}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected
                      ? 'bg-teal-800 text-teal-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {fbSkill.sourceCompanies[0] || 'Company'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Department vs Skill Heatmap Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Department vs Skill Heatmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlating each department's active curriculum coverage against selected recruiter feedback skills. Click any cell to inspect syllabus and lab coverage.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Gap (&lt;40%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Moderate (40–70%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Covered (&gt;70%)</span>
            </span>
          </div>
        </div>

        {/* Heatmap Table or Empty State */}
        {heatmapRows.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <Layers className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Feedback Skills Currently Selected
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Select skills from the chips above or from the "Corporate Feedback" section to generate the Department vs Skill Heatmap.
            </p>
            <button
              onClick={() => {
                const all = selectAllFeedbackSkills();
                setSelectedSkills(all);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Select All Corporate Feedback Skills ({allFeedbackSkills.length})</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-800/50 rounded-l-xl">
                    Technology / Competency (Recruiter Flagged)
                  </th>
                  {departmentsList.map((dept, idx) => (
                    <th
                      key={dept}
                      className={`py-3 px-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-800/50 text-center ${
                        idx === departmentsList.length - 1 ? 'rounded-r-xl' : ''
                      }`}
                    >
                      {dept}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {heatmapRows.map((row) => (
                  <tr key={row.skill} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {row.skill}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${
                              row.priority === 'Critical'
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {row.priority}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            Flagged by: {row.sourceCompanies.join(', ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    {departmentsList.map((dept) => {
                      const coverage = row.departments[dept] || 0;
                      const colorClass = getHeatmapColor(coverage);
                      const badge = getHeatmapBadge(coverage);

                      return (
                        <td key={dept} className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCell({
                                skill: row.skill,
                                dept,
                                coverage,
                                sourceCompanies: row.sourceCompanies,
                                priority: row.priority,
                                notes: `${dept} covers ${coverage}% of target learning outcomes in semester course syllabi and lab sessions.`
                              })
                            }
                            className={`w-full py-2 px-3 rounded-xl border font-bold transition-transform hover:scale-105 cursor-pointer ${colorClass}`}
                          >
                            <div className="text-xs">{coverage}%</div>
                            <div className="text-[9px] uppercase tracking-wider font-semibold opacity-80">
                              {badge}
                            </div>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Selected Cell Drilldown Drawer / Card */}
        {selectedCell && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs animate-fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedCell.dept} • {selectedCell.skill}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedCell.coverage < 40
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : selectedCell.coverage <= 70
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {selectedCell.coverage}% Coverage ({getHeatmapBadge(selectedCell.coverage)})
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{selectedCell.notes}</p>
              {selectedCell.sourceCompanies && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Corporate Advisory Source: <strong>{selectedCell.sourceCompanies.join(', ')}</strong> (Priority: {selectedCell.priority})
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={handleGenerateSyllabusRevision}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                Draft Syllabus Addendum
              </button>
              <button
                onClick={() => setSelectedCell(null)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
