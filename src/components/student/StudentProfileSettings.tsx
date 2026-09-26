import React, { useState } from 'react';
import { initialStudentData } from '../../data/mockData';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  Github, 
  Globe, 
  Bell, 
  ShieldCheck, 
  EyeOff, 
  Save,
  CheckCircle2
} from 'lucide-react';

export const StudentProfileSettings: React.FC = () => {
  const [name, setName] = useState(initialStudentData.name);
  const [email, setEmail] = useState(initialStudentData.email);
  const [branch, setBranch] = useState(initialStudentData.branch);
  const [college, setCollege] = useState(initialStudentData.college);
  const [cgpa, setCgpa] = useState(initialStudentData.cgpa);
  const [bio, setBio] = useState(initialStudentData.bio);
  const [github, setGithub] = useState(initialStudentData.links.github);
  const [portfolio, setPortfolio] = useState(initialStudentData.links.portfolio);

  // Toggles
  const [blindScreeningOptIn, setBlindScreeningOptIn] = useState(true);
  const [openToRecruiters, setOpenToRecruiters] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aiAuditSharing, setAiAuditSharing] = useState(true);

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Profile & Privacy Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your verified institutional identity and recruiter visibility preferences.
          </p>
        </div>

        {savedToast && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Academic & Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institute Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                College / Institution
              </label>
              <input
                type="text"
                value={college}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Academic Branch & Year
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                CGPA / Academic Score
              </label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                GitHub Profile
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Short Professional Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Privacy & Recruiter Toggles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Privacy & Screening Toggles
          </h2>

          <div className="space-y-4">
            {/* Toggle 1: Blind Screening Mode */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
                  Participate in Blind Screening Mode
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Anonymizes your name, college, and profile photo to "Candidate #042" during initial resume screening to guarantee 100% skills-based evaluation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBlindScreeningOptIn(!blindScreeningOptIn)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  blindScreeningOptIn ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    blindScreeningOptIn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Open to Recruiters */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Open to Recruiter Outreach
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Allow partner companies to contact you for fast-track interview scheduling when your match exceeds 80%.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenToRecruiters(!openToRecruiters)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  openToRecruiters ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    openToRecruiters ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: AI Audit Sharing */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Share AI Logic Q&A Transcripts
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Include your 5/5 logic verification answers in candidate packets sent to lead engineers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAiAuditSharing(!aiAuditSharing)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  aiAuditSharing ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    aiAuditSharing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4: Email Alerts */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Weekly Curriculum & Placement Digest
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Receive recommendations when high-match jobs in your field get listed by TPO.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  emailAlerts ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    emailAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
