import React, { useState } from 'react';
import { initialCandidates } from '../../data/mockData';
import { Candidate } from '../../types';
import { CandidateDetailModal } from './CandidateDetailModal';
import { 
  Users, 
  Search, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Sparkles,
  ArrowUpDown,
  Award
} from 'lucide-react';
import { updateCandidateStatusByRollOrName } from '../../data/studentApplicationsStore';

interface CandidatesViewProps {
  initialSelectedId?: string | null;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({ initialSelectedId }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    initialSelectedId ? candidates.find(c => c.id === initialSelectedId) || null : null
  );

  const handleShortlist = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updateCandidateStatusByRollOrName(c.rollNumber || c.name, 'shortlisted');
          return { ...c, status: 'shortlisted' };
        }
        return c;
      })
    );
    setSelectedCandidate((prev) => (prev && prev.id === id ? { ...prev, status: 'shortlisted' } : prev));
  };

  const handleReject = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updateCandidateStatusByRollOrName(c.rollNumber || c.name, 'rejected');
          return { ...c, status: 'rejected' };
        }
        return c;
      })
    );
    setSelectedCandidate((prev) => (prev && prev.id === id ? { ...prev, status: 'rejected' } : prev));
  };

  const handleSelectAndTransmit = (
    candidate: Candidate,
    offerDetails: {
      role: string;
      packageOffered: string;
      postingLocation: string;
      offerType: string;
      placementYear: string;
      joiningDate: string;
    }
  ) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidate.id) {
          return {
            ...c,
            status: 'selected',
            selectedRole: offerDetails.role,
            selectedPackage: offerDetails.packageOffered,
            postingLocation: offerDetails.postingLocation,
            joiningDate: offerDetails.joiningDate
          };
        }
        return c;
      })
    );
    setSelectedCandidate((prev) =>
      prev && prev.id === candidate.id
        ? {
            ...prev,
            status: 'selected',
            selectedRole: offerDetails.role,
            selectedPackage: offerDetails.packageOffered,
            postingLocation: offerDetails.postingLocation,
            joiningDate: offerDetails.joiningDate
          }
        : prev
    );
  };

  const filteredCandidates = candidates.filter((c) => {
    const isRevealed = !isBlindMode || c.status === 'shortlisted' || c.status === 'selected';
    const searchTarget = isRevealed ? c.name : c.anonymousId;
    const matchesSearch = searchTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter.toLowerCase();
    const matchesVerified = !verifiedOnly || c.projectVerified;
    return matchesSearch && matchesStatus && matchesVerified;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Blind Screening Mode Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Candidate Pipeline & Screening
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate engineering talent strictly based on verified skill competency and audited project logic.
          </p>
        </div>

        {/* Blind Screening Mode Toggle Pill */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <EyeOff className={`w-4 h-4 ${isBlindMode ? 'text-blue-900' : 'text-slate-400'}`} />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                Blind Screening Mode
              </span>
              <span className="text-[10px] text-slate-500">
                {isBlindMode ? 'Anonymizing names, colleges & photos' : 'Standard profile view active'}
              </span>
            </div>
          </div>

          <button
            id="toggle-blind-screening-btn"
            type="button"
            onClick={() => setIsBlindMode(!isBlindMode)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              isBlindMode ? 'bg-blue-900' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isBlindMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBlindMode ? "Search by Candidate #, skill..." : "Search by name, skill..."}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Verified Only Filter */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              verifiedOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Projects Only</span>
          </button>

          {/* Status filter tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
            {['All', 'New', 'Shortlisted', 'Selected', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-3">
        {filteredCandidates.map((candidate) => {
          const isRevealed = !isBlindMode || candidate.status === 'shortlisted' || candidate.status === 'selected';
          const displayName = isRevealed ? candidate.name : candidate.anonymousId;
          const displayCollege = isRevealed ? candidate.college : 'Accredited Institution (Blind Profile)';

          return (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left: Avatar & Identity */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 overflow-hidden">
                  {isRevealed ? (
                    <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-blue-200" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {displayName}
                    </span>
                    {candidate.rollNumber && isRevealed && (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {candidate.rollNumber}
                      </span>
                    )}
                    {candidate.projectVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Project Verified ✓</span>
                      </span>
                    )}
                    {candidate.status === 'shortlisted' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                        <Sparkles className="w-3 h-3" />
                        <span>Shortlisted for Interview</span>
                      </span>
                    )}
                    {candidate.status === 'selected' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <Award className="w-3 h-3 text-emerald-600" />
                        <span>Selected • {candidate.selectedPackage || 'Offer Transmitted'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {displayCollege} • {candidate.branch}
                  </p>
                </div>
              </div>

              {/* Center: Top Matched Skill Tags */}
              <div className="flex flex-wrap gap-1.5 max-w-sm">
                {candidate.topSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Right: Match Score Bar (amber-to-green gradient) & Action Arrow */}
              <div className="flex items-center gap-5 justify-between md:justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="w-36 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 text-[11px] font-medium">Match</span>
                    <span className="font-extrabold text-slate-900">{candidate.matchScore}%</span>
                  </div>
                  {/* Amber-to-green gradient progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500"
                      style={{ width: `${candidate.matchScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-2 rounded-xl text-slate-400 group-hover:text-blue-900 group-hover:bg-blue-50 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          isBlindMode={isBlindMode}
          isOpen={true}
          onClose={() => setSelectedCandidate(null)}
          onShortlist={handleShortlist}
          onReject={handleReject}
          onSelectAndTransmit={handleSelectAndTransmit}
        />
      )}
    </div>
  );
};
