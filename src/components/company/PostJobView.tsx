import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  X, 
  Plus, 
  ArrowRight, 
  Briefcase, 
  MapPin, 
  Banknote, 
  GraduationCap, 
  Calendar, 
  Globe, 
  Clock, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { addInternship } from '../../data/jobsStore';
import { addDriveRequest } from '../../data/driveRequestsStore';

interface SkillTag {
  id: string;
  name: string;
  type: 'required' | 'preferred';
}

const availableUniversities = [
  'Institute of Technology, Jodhpur',
  'ABC University',
  'XYZ Institute of Tech',
  'Global Engineering College',
  'National Institute of Science & Tech',
];

export const PostJobView: React.FC = () => {
  const [title, setTitle] = useState('Frontend Developer Intern');
  const [jobType, setJobType] = useState<'Internship' | 'Full-time' | 'Contract'>('Internship');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [stipend, setStipend] = useState('₹45,000 / month');
  const [deadline, setDeadline] = useState('2026-10-25');
  const [description, setDescription] = useState(
    'Looking for a passionate Frontend Developer Intern with strong command over React, TypeScript, and Tailwind CSS. Experience with WebSockets, state caching, and responsive design systems is highly valued. Students with verified projects will be prioritized.'
  );

  // Campus Scope & University Targeting (USER MANDATE)
  const [campusRouting, setCampusRouting] = useState<'on_campus' | 'off_campus'>('on_campus');
  const [selectedUniversity, setSelectedUniversity] = useState('Institute of Technology, Jodhpur');
  const [driveStartDate, setDriveStartDate] = useState('2026-10-18');
  const [driveEndDate, setDriveEndDate] = useState('2026-10-21');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [targetBranches, setTargetBranches] = useState('CSE, IT, ECE');

  // AI-Detected Skills
  const [skills, setSkills] = useState<SkillTag[]>([
    { id: '1', name: 'React.js', type: 'required' },
    { id: '2', name: 'TypeScript', type: 'required' },
    { id: '3', name: 'Tailwind CSS', type: 'required' },
    { id: '4', name: 'Git & Collaboration', type: 'required' },
    { id: '5', name: 'WebSockets', type: 'preferred' },
    { id: '6', name: 'Next.js', type: 'preferred' },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillType, setNewSkillType] = useState<'required' | 'preferred'>('required');
  const [publishedInfo, setPublishedInfo] = useState<{
    type: 'on_campus' | 'off_campus';
    university?: string;
    dates?: string;
  } | null>(null);

  // Toggle skill between Required (solid) and Preferred (outline)
  const toggleSkillType = (id: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, type: s.type === 'required' ? 'preferred' : 'required' }
          : s
      )
    );
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([
      ...skills,
      {
        id: `skill-${Date.now()}`,
        name: newSkillName.trim(),
        type: newSkillType,
      },
    ]);
    setNewSkillName('');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredSkillsList = skills.filter((s) => s.type === 'required').map((s) => s.name);
    const preferredSkillsList = skills.filter((s) => s.type === 'preferred').map((s) => s.name);

    if (campusRouting === 'on_campus' && selectedUniversity && driveStartDate) {
      // 1. Add On-Campus Job with pending TPO status
      addInternship({
        title,
        company: 'TechNova Solutions',
        location,
        type: jobType,
        stipend,
        matchScore: 90,
        requiredSkills: requiredSkillsList,
        preferredSkills: preferredSkillsList,
        missingSkills: [],
        description,
        deadline: driveEndDate || deadline,
        campusType: 'on_campus',
        targetUniversity: selectedUniversity,
        driveStartDate,
        driveEndDate,
        tpoApprovalStatus: 'pending', // Will become visible to students once TPO approves!
      });

      // 2. Add Campus Drive Request to University TPO
      addDriveRequest({
        companyId: 'COM1',
        companyName: 'TechNova Solutions',
        universityName: selectedUniversity,
        jobTitle: title,
        jobType,
        stipend,
        location,
        driveStartDate,
        driveEndDate,
        eligibleBranches: targetBranches.split(',').map((b) => b.trim()),
        minCgpa,
        roundsPlanned: ['AST Code Integrity Audit', 'Technical Interview', 'HR Discussion'],
        notes: description,
      });

      setPublishedInfo({
        type: 'on_campus',
        university: selectedUniversity,
        dates: `${driveStartDate} to ${driveEndDate}`,
      });
    } else {
      // Off-Campus immediate publish
      addInternship({
        title,
        company: 'TechNova Solutions',
        location,
        type: jobType,
        stipend,
        matchScore: 88,
        requiredSkills: requiredSkillsList,
        preferredSkills: preferredSkillsList,
        missingSkills: [],
        description,
        deadline,
        campusType: 'off_campus',
        tpoApprovalStatus: 'approved',
      });

      setPublishedInfo({
        type: 'off_campus',
      });
    }

    setTimeout(() => {
      setPublishedInfo(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Post a Job & Campus Drive
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish open-market opportunities or schedule verified on-campus hiring drives with partner university TPOs.
          </p>
        </div>

        {publishedInfo && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {publishedInfo.type === 'on_campus' ? (
              <span>
                Campus drive request sent to <strong>{publishedInfo.university} TPO</strong>! (Scheduled for {publishedInfo.dates}). Once approved by the TPO, it will go live for their students on-campus.
              </span>
            ) : (
              <span>
                Job published nationwide as an <strong>Off-Campus Opportunity</strong> accessible to all students!
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        {/* ========================================================================= */}
        {/* CAMPUS ROUTING TYPE: ON-CAMPUS DRIVE vs OFF-CAMPUS (USER REQUEST)         */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-indigo-200/80 dark:border-indigo-900/60 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Hiring Channel & University Targeting
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose between university on-campus recruitment or nationwide off-campus hiring.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Option 1: On-Campus Drive */}
            <div
              onClick={() => setCampusRouting('on_campus')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                campusRouting === 'on_campus'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  On-Campus Drive
                </span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  campusRouting === 'on_campus' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                }`}>
                  {campusRouting === 'on_campus' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Requires TPO approval. Once approved by the university TPO, it appears exclusively for that university's students with drive dates.
              </p>
            </div>

            {/* Option 2: Off-Campus Opening */}
            <div
              onClick={() => setCampusRouting('off_campus')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                campusRouting === 'off_campus'
                  ? 'border-blue-700 bg-blue-50/40 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  Off-Campus Opening
                </span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  campusRouting === 'off_campus' ? 'border-blue-700 bg-blue-700' : 'border-slate-300'
                }`}>
                  {campusRouting === 'off_campus' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                No university TPO approval needed. Visible immediately across all universities nationwide under the Off-Campus sort.
              </p>
            </div>
          </div>

          {/* Conditional Fields for On-Campus Drive: University and Dates */}
          {campusRouting === 'on_campus' && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* University Selection Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Target Partner University <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden font-medium"
                    required
                  >
                    {availableUniversities.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Drive Start Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Drive Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={driveStartDate}
                    onChange={(e) => setDriveStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden font-medium"
                    required
                  />
                </div>

                {/* Drive End Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Drive End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={driveEndDate}
                    onChange={(e) => setDriveEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Eligible Branches
                  </label>
                  <input
                    type="text"
                    value={targetBranches}
                    onChange={(e) => setTargetBranches(e.target.value)}
                    placeholder="e.g. CSE, IT, ECE"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="text"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(e.target.value)}
                    placeholder="e.g. 7.5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-100/60 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Automated TPO Routing:</strong> Submitting will send this drive request to the TPO of <strong>{selectedUniversity}</strong>. If approved, it will be listed in their students' portal with the drive schedule. If rejected, it will remain archived in your Requests tab.
                </span>
              </div>
            </div>
          )}

          {campusRouting === 'off_campus' && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-2 animate-fade-in">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Instant Nationwide Broadcast:</strong> This job will go live immediately under Off-Campus opportunities for all students across the platform without waiting for any institutional TPO verification.
              </span>
            </div>
          )}
        </div>

        {/* Basic Job Details */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Core Position Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Job / Role Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Developer Intern"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Position Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Location / Work Model
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Hybrid or Remote"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Compensation / Stipend
              </label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g. ₹45,000 / month"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Role Description & Candidate Expectations
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Required vs Preferred Skills Calibration */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Skill Calibration & Weightage
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click chips to toggle between <span className="font-bold text-indigo-600 dark:text-indigo-400">Required</span> and <span className="font-semibold text-slate-500 dark:text-slate-400">Preferred</span>.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {skills.length} Skills Calibrated
            </span>
          </div>

          {/* Chips list */}
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => toggleSkillType(skill.id)}
                className={`group px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  skill.type === 'required'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60'
                }`}
              >
                <span>{skill.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                  skill.type === 'required' ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200'
                }`}>
                  {skill.type}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSkill(skill.id);
                  }}
                  className="opacity-60 hover:opacity-100 p-0.5 hover:bg-black/10 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom skill input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add additional competency (e.g. GraphQL, Docker)..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <select
              value={newSkillType}
              onChange={(e) => setNewSkillType(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden font-medium"
            >
              <option value="required">Required</option>
              <option value="preferred">Preferred</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {campusRouting === 'on_campus'
                ? `Route Drive Proposal to ${selectedUniversity} TPO`
                : 'Publish Off-Campus Opportunity Nationwide'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
