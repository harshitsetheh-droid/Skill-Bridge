import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Bell, 
  ShieldCheck, 
  Key, 
  Save, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const CompanySettingsView: React.FC = () => {
  const [atsWebhook, setAtsWebhook] = useState('https://technova.workday.com/api/v2/skillbridge-webhook');
  const [autoShortlistThreshold, setAutoShortlistThreshold] = useState('85');
  const [verifiedProjectRequirement, setVerifiedProjectRequirement] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Company Preferences & Screening Rules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automate shortlisting pipelines, ATS sync tokens, and recruitment team permissions.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Screening Rules */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Automated Pipeline Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Fast-Track Interview Match Threshold (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={autoShortlistThreshold}
                onChange={(e) => setAutoShortlistThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Applicants scoring above this threshold receive automated interview invites.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ATS Webhook Endpoint URL
              </label>
              <input
                type="text"
                value={atsWebhook}
                onChange={(e) => setAtsWebhook(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Direct JSON payload delivery to Greenhouse, Lever, or Workday.
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Mandate AI Project Verification for Applicant Pool
              </span>
              <p className="text-[11px] text-slate-500">
                Automatically archive applicants who have not passed code originality scans or logic Q&A defense.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVerifiedProjectRequirement(!verifiedProjectRequirement)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                verifiedProjectRequirement ? 'bg-blue-900' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  verifiedProjectRequirement ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
