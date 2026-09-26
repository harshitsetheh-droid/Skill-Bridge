import React, { useState } from 'react';
import { initialCompanyData } from '../../data/mockData';
import { 
  Building2, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  Save, 
  Globe, 
  Users,
  Award
} from 'lucide-react';

export const CompanyProfileView: React.FC = () => {
  const [name, setName] = useState(initialCompanyData.name);
  const [tagline, setTagline] = useState(initialCompanyData.tagline);
  const [about, setAbout] = useState(initialCompanyData.about);
  const [recruitmentPhilosophy, setRecruitmentPhilosophy] = useState(initialCompanyData.recruitmentPhilosophy);
  const [highlights, setHighlights] = useState<string[]>(initialCompanyData.highlights);
  const [newHighlight, setNewHighlight] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Company Profile & Culture Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displayed to students and institution placement cells across the SkillBridge ecosystem.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-2xl shadow-xs">
              {initialCompanyData.logo}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">Verified Employer Partner • Tech & Product</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company Headline / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              About Us
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
          </div>
        </div>

        {/* How We Recruit Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-900" />
            <h2 className="text-sm font-bold text-slate-900">
              "How We Recruit" & Hiring Philosophy
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Tell students what your engineering culture values most (e.g. skills-first, project autonomy, zero brand bias).
          </p>

          <textarea
            rows={3}
            value={recruitmentPhilosophy}
            onChange={(e) => setRecruitmentPhilosophy(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
          />
        </div>

        {/* "Highlights" Tag Chips */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Company Highlights & Culture Tags
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pill badges featured on job listings and company cards.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {highlights.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(idx)}
                  className="hover:text-red-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Add new highlight (e.g. ₹50k Stipend, Health Insurance)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddHighlight}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              Add Tag
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
