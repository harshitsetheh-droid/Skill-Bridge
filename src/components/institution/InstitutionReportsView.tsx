import React, { useState } from 'react';
import { initialInstitutionData } from '../../data/mockData';
import { 
  FileText, 
  Download, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  FileSpreadsheet, 
  Calendar, 
  ShieldCheck,
  Building
} from 'lucide-react';

export const InstitutionReportsView: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (reportName: string) => {
    setDownloading(reportName);
    setTimeout(() => {
      setDownloading(null);
      alert(`${reportName} generated and exported successfully!`);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Accreditation & NIRF / NAAC Placement Audit Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official verifiable documentation of student technical competencies, employer offers, and salary distributions.
          </p>
        </div>

        <button
          onClick={() => handleDownload('Consolidated NIRF 2026 Packet')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{downloading === 'Consolidated NIRF 2026 Packet' ? 'Exporting...' : 'Export Complete NIRF Dossier'}</span>
        </button>
      </div>

      {/* Accreditation Compliance Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Institutional Compliance & Readiness Index
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            NAAC Grade A++ Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs font-medium text-slate-500">Graduation Outcomes (GO)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">94.2 / 100</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Top 5 percentile in state</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs font-medium text-slate-500">Verified Project Originality</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">89% Original</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Eliminated fraudulent repository clones</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs font-medium text-slate-500">Median CTC Package</span>
            <div className="text-2xl font-black text-teal-800 mt-1">₹14.2 LPA</div>
            <p className="text-[11px] text-slate-400 mt-0.5">+18% growth year-over-year</p>
          </div>
        </div>
      </div>

      {/* Available Dossiers and Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'NIRF Placement & Higher Studies Table (Metric 5.2.1)',
            desc: 'Complete student-by-student roll registry with company offer letters, stipend compensation, and joining dates.',
            format: 'CSV + Signed PDF',
            id: 'nirf-521',
          },
          {
            title: 'Curriculum Industry-Alignment & Gap Audit',
            desc: 'Detailed breakdown comparing ABET / UGC engineering syllabi against 4,000+ live industry skills.',
            format: 'Executive Summary PDF',
            id: 'curriculum-audit',
          },
          {
            title: 'AI Project Authenticity & Code Defense Registry',
            desc: 'Audit logs of 1,200+ student software submissions with AST originality scores and faculty sign-offs.',
            format: 'Cryptographic Audit PDF',
            id: 'authenticity-log',
          },
          {
            title: 'Department-wise Placement Performance Matrix',
            desc: 'Comparative breakdown of CSE, ECE, Mechanical, and AI-DS placement ratios and recruiters.',
            format: 'Excel Spreadsheet',
            id: 'dept-matrix',
          },
        ].map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:border-teal-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {report.format}
                </span>
                <span className="text-xs text-slate-400">Updated Sept 2026</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {report.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleDownload(report.title)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-800 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading === report.title ? 'Generating...' : 'Download Report'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
