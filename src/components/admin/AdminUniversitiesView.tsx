import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShieldCheck,
  Award,
  ChevronRight,
  Ban,
  RotateCcw,
  Eye,
  Info,
  Clock,
  CheckCircle,
  LayoutGrid,
  List,
  MapPin,
  Mail,
  Send,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { loadApprovalRecords, saveApprovalRecords, ApprovalRecord } from '../../data/approvalStore';
import { AdminCollegeDetailModal } from './AdminCollegeDetailModal';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';

export interface AdminUniversitiesViewProps {
  initialSubTab?: 'all-universities' | 'university-approval' | 'skill-gap-overview';
  subTab?: 'all-universities' | 'university-approval' | 'skill-gap-overview';
  onNavigateTab?: (tab: string) => void;
}

import { UniversityRecord, adminUniversitiesSeed as defaultUniversities } from '../../data/adminSeedData';

export const AdminUniversitiesView: React.FC<AdminUniversitiesViewProps> = ({ 
  initialSubTab = 'all-universities',
  subTab
}) => {
  const currentIncoming = subTab || initialSubTab;
  const [activeTab, setActiveTab] = useState<'all' | 'approval' | 'gaps'>(
    currentIncoming === 'university-approval' ? 'approval' : currentIncoming === 'skill-gap-overview' ? 'gaps' : 'all'
  );
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastNoticeSent, setBroadcastNoticeSent] = useState(false);
  const [universities, setUniversities] = useState<UniversityRecord[]>(() => {
    // Merge with persistent store
    const stored = loadApprovalRecords();
    return defaultUniversities.map(u => {
      const match = stored.find(s => s.id === u.id);
      if (match) {
        return {
          ...u,
          status: match.status === 'active' ? 'Active' : match.status === 'delisted' ? 'Delisted' : 'Pending Approval',
          delistReason: match.delistedReason || u.delistReason
        };
      }
      return u;
    });
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedUniForDetails, setSelectedUniForDetails] = useState<UniversityRecord | null>(null);
  const [selectedStudentIdForModal, setSelectedStudentIdForModal] = useState<string | null>(null);
  const [delistingUni, setDelistingUni] = useState<UniversityRecord | null>(null);
  const [customDelistReason, setCustomDelistReason] = useState('');

  // Sync state whenever incoming prop changes!
  useEffect(() => {
    if (subTab === 'university-approval') {
      setActiveTab('approval');
    } else if (subTab === 'skill-gap-overview') {
      setActiveTab('gaps');
    } else if (subTab === 'all-universities') {
      setActiveTab('all');
    }
  }, [subTab]);

  const filtered = universities.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.tpoHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'approval') return u.status === 'Pending Approval';
    return true;
  });

  const handleApproveTPO = (uni: UniversityRecord) => {
    setUniversities(prev => prev.map(u => u.id === uni.id ? { ...u, status: 'Active', delistReason: undefined } : u));
    
    // Update central store so TPO can now log in directly!
    const store = loadApprovalRecords();
    const updated = store.map(item => item.id === uni.id ? { ...item, status: 'active' as const, approvedAt: 'Just Now' } : item);
    if (!store.some(i => i.id === uni.id)) {
      updated.push({
        id: uni.id,
        name: uni.name,
        role: 'institution',
        email: uni.email,
        status: 'active',
        registeredAt: uni.appliedDate,
        approvedAt: 'Just Now'
      });
    }
    saveApprovalRecords(updated);

    setNotification(`Approved TPO access for ${uni.name}. This university can now log in directly anytime without re-approval.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenDelist = (uni: UniversityRecord) => {
    setDelistingUni(uni);
    setCustomDelistReason('Delisted by Admin: Accreditation review pending / placement guideline violations.');
  };

  const handleConfirmDelist = () => {
    if (!delistingUni) return;
    setUniversities(prev => prev.map(u => {
      if (u.id === delistingUni.id) {
        return {
          ...u,
          status: 'Delisted',
          delistReason: customDelistReason || 'Delisted by Administrator'
        };
      }
      return u;
    }));

    const store = loadApprovalRecords();
    const updated = store.map(item => item.id === delistingUni.id ? { ...item, status: 'delisted' as const, delistedReason: customDelistReason } : item);
    saveApprovalRecords(updated);

    setNotification(`Delisted university: ${delistingUni.name}. Campus access revoked.`);
    setDelistingUni(null);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRestoreUni = (uni: UniversityRecord) => {
    setUniversities(prev => prev.map(u => u.id === uni.id ? { ...u, status: 'Active', delistReason: undefined } : u));
    
    const store = loadApprovalRecords();
    const updated = store.map(item => item.id === uni.id ? { ...item, status: 'active' as const, delistedReason: undefined } : item);
    saveApprovalRecords(updated);

    setNotification(`Restored active institutional standing for ${uni.name}. Direct login re-enabled.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBroadcastAdvisory = () => {
    setBroadcastNoticeSent(true);
    setNotification('Broadcasting AI-Driven Curriculum Gap Advisory to all affiliated university Deans & TPO departments...');
    setTimeout(() => {
      setBroadcastNoticeSent(false);
      setNotification('Official Syllabus Alignment advisory sent successfully to 7 institutional placement cells.');
      setTimeout(() => setNotification(null), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">University Management & TPO Network</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {universities.filter(u => u.status === 'Active').length} Active Universities
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Admin Control: Review initial TPO registration signups, grant direct login approvals, and manage institutional delisting.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search universities, TPO head, state..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Policy Notice */}
      <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/70 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-emerald-900 dark:text-emerald-200">TPO Approval Workflow:</span> When an institution or TPO registers on SkillBridge, they require one-time Admin approval. Once you approve their application, <span className="font-semibold text-slate-900 dark:text-slate-100">they can directly login anytime without asking for approval again</span>. Admin also retains full authority to <span className="font-semibold text-rose-700 dark:text-rose-300">delist</span> any institution.
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>All Universities ({universities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'approval' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>TPO Signups Pending Approval</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'approval' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
            }`}>
              {universities.filter(u => u.status === 'Pending Approval').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gaps' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Curriculum Gap Overview</span>
          </button>
        </div>

        {/* View Mode Toggle: Dossier Cards vs Compact Table */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Executive Dossier Cards (Responsive Auto-Fit, Zero Horizontal Scroll)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dossier Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Auto-Fitting Compact Table"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Compact Table</span>
          </button>
        </div>
      </div>

      {/* Curriculum Gap Dedicated Banner if in 'gaps' tab */}
      {activeTab === 'gaps' && (
        <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-950/40 via-purple-50 dark:via-purple-950/40 to-blue-50 dark:to-blue-950/40 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">Institutional Curriculum Diagnostics</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Real-time analysis comparing university degree syllabi against live job recruiter requirements. Top industry missing topics across affiliated colleges: <span className="font-semibold text-slate-900 dark:text-slate-100">Distributed Systems (71%), Cloud DevOps (64%), System Design (58%)</span>.
            </p>
          </div>
          <button
            onClick={handleBroadcastAdvisory}
            disabled={broadcastNoticeSent}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{broadcastNoticeSent ? 'Broadcasting...' : 'Broadcast Syllabus Advisory'}</span>
          </button>
        </div>
      )}

      {/* VIEW MODE 1: EXECUTIVE DOSSIER CARDS (Default - completely eliminates horizontal scroll) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-xs">
              No universities matching the current filter.
            </div>
          ) : (
            filtered.map(uni => (
              <div 
                key={uni.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                  uni.status === 'Delisted' 
                    ? 'border-rose-200 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/20' 
                    : uni.status === 'Pending Approval' 
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20' 
                    : 'border-slate-200/90 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                {/* Card Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        uni.status === 'Delisted' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 
                        uni.status === 'Pending Approval' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                        'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedUniForDetails(uni)}
                          className="text-left font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer block leading-tight text-sm group"
                        >
                          <span className="group-hover:underline">{uni.name}</span>
                        </button>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {uni.accreditation}
                          </span>
                          {uni.nirfRank && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                              NIRF #{uni.nirfRank}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {uni.status === 'Active' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {uni.status === 'Pending Approval' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                    {uni.status === 'Delisted' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shrink-0">
                        <Ban className="w-3 h-3" />
                        Delisted
                      </span>
                    )}
                  </div>

                  {/* TPO Contact & State Details */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 text-[11px]">TPO Head:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{uni.tpoHead}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 text-[11px]">Email:</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400 truncate max-w-[180px]">{uni.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 text-[11px]">Location:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{uni.state}</span>
                    </div>
                  </div>

                  {/* Enrolled Students & Curriculum Gap Level */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-50/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block">Cohort Size</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{uni.studentsCount.toLocaleString()} Students</span>
                    </div>
                    <div className="bg-slate-50/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block">Curriculum Gap</span>
                      <span className={`inline-block text-xs font-bold mt-0.5 px-2 py-0.5 rounded-md border ${
                        uni.skillGapLevel === 'High' ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' :
                        uni.skillGapLevel === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                        'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {uni.skillGapLevel} Risk
                      </span>
                    </div>
                  </div>

                  {/* Syllabus Gap Tags */}
                  <div className="pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mb-1.5 uppercase tracking-wide">
                      Missing in Syllabus:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.primaryGaps.map((gap, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors">
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {uni.delistReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-200 font-medium">
                      <span className="font-bold">Delist Notice:</span> {uni.delistReason}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedUniForDetails(uni)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Dossier & Records</span>
                  </button>

                  {uni.status === 'Pending Approval' && (
                    <button
                      onClick={() => handleApproveTPO(uni)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve TPO</span>
                    </button>
                  )}

                  {uni.status === 'Active' && (
                    <button
                      onClick={() => handleOpenDelist(uni)}
                      className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      title="Delist University"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Delist</span>
                    </button>
                  )}

                  {uni.status === 'Delisted' && (
                    <button
                      onClick={() => handleRestoreUni(uni)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MODE 2: AUTO-FITTING COMPACT TABLE (Consolidated columns, zero horizontal scroll) */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left text-xs table-auto">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4 w-[34%]">University & Leadership</th>
                <th className="py-3 px-4 w-[22%]">Cohort & Gap Severity</th>
                <th className="py-3 px-4 w-[24%]">Status & Direct Login</th>
                <th className="py-3 px-4 w-[20%] text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No universities found in this tab.
                  </td>
                </tr>
              ) : (
                filtered.map(uni => (
                  <tr key={uni.id} className={`transition-colors ${uni.status === 'Delisted' ? 'bg-rose-50/30 dark:bg-rose-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'}`}>
                    {/* Col 1: University & Leadership */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          uni.status === 'Delisted' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => setSelectedUniForDetails(uni)}
                            className="text-left group cursor-pointer block"
                          >
                            <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors underline decoration-slate-300 dark:decoration-slate-600 underline-offset-2">
                              {uni.name}
                            </span>
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{uni.state}</span>
                            <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                              {uni.accreditation}
                            </span>
                            {uni.nirfRank && (
                              <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.2 rounded">
                                Rank #{uni.nirfRank}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                            TPO: <span className="text-slate-600 dark:text-slate-400 font-medium">{uni.tpoHead}</span> • {uni.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Cohort & Gap Severity */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-bold text-slate-900 dark:text-white">{uni.studentsCount.toLocaleString()} Students</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          uni.skillGapLevel === 'High' ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' :
                          uni.skillGapLevel === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                          'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}>
                          {uni.skillGapLevel} Gap
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                        {uni.primaryGaps.slice(0, 2).map((g, i) => (
                          <span key={i} className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{g}</span>
                        ))}
                      </div>
                    </td>

                    {/* Col 3: Status & Direct Login */}
                    <td className="py-3.5 px-4 align-top">
                      {uni.status === 'Active' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved (Direct Login)
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Can login anytime</span>
                        </div>
                      )}
                      {uni.status === 'Pending Approval' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            Awaiting Approval
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{uni.appliedDate}</span>
                        </div>
                      )}
                      {uni.status === 'Delisted' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            <Ban className="w-3 h-3" />
                            Delisted
                          </span>
                          {uni.delistReason && (
                            <p className="text-[10px] text-rose-700 dark:text-rose-300 mt-0.5 font-medium line-clamp-1" title={uni.delistReason}>
                              {uni.delistReason}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Col 4: Admin Actions */}
                    <td className="py-3.5 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUniForDetails(uni)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>

                        {uni.status === 'Pending Approval' && (
                          <button
                            onClick={() => handleApproveTPO(uni)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {uni.status === 'Active' && (
                          <button
                            onClick={() => handleOpenDelist(uni)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Delist university"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Delist</span>
                          </button>
                        )}

                        {uni.status === 'Delisted' && (
                          <button
                            onClick={() => handleRestoreUni(uni)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* University & Placement Cell Deep-Dive Dossier Modal */}
      {selectedUniForDetails && (
        <AdminCollegeDetailModal
          collegeIdOrName={selectedUniForDetails.name}
          onClose={() => setSelectedUniForDetails(null)}
          onOpenStudentDossier={(studentId) => setSelectedStudentIdForModal(studentId)}
          onApproveTPO={(collegeId) => {
            handleApproveTPO(selectedUniForDetails);
            setSelectedUniForDetails(null);
          }}
          onDelistCollege={(collegeId, reason) => {
            setUniversities(prev => prev.map(u => u.id === collegeId ? { ...u, status: 'Delisted', delistReason: reason } : u));
            setSelectedUniForDetails(null);
          }}
        />
      )}

      {/* Cross-Modal: Deep-Dive Student Dossier from College Roster */}
      {selectedStudentIdForModal && (
        <AdminStudentDetailModal
          studentIdOrName={selectedStudentIdForModal}
          onClose={() => setSelectedStudentIdForModal(null)}
        />
      )}

      {/* Delist Modal */}
      {delistingUni && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delist University / TPO</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Suspend campus placement access.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Delisting <span className="font-bold text-slate-900 dark:text-slate-100">{delistingUni.name}</span> will deactivate all placement coordinator privileges and restrict institutional reports.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Delisting:
              </label>
              <textarea
                value={customDelistReason}
                onChange={(e) => setCustomDelistReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDelistingUni(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelist}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Delist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
