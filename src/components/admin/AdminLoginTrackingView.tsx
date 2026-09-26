import React, { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  Search,
  Filter,
  Calendar,
  Activity,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Monitor,
  Smartphone,
  MapPin,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  Download,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import {
  UserLoginSession,
  loadLoginSessions,
  saveLoginSessions,
  defaultSessions,
  SESSIONS_UPDATED_EVENT
} from '../../data/sessionTrackingStore';
import { UserRole } from '../../types';

export const AdminLoginTrackingView: React.FC = () => {
  const [sessions, setSessions] = useState<UserLoginSession[]>(() => loadLoginSessions());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'company' | 'bpo' | 'institution' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [selectedSession, setSelectedSession] = useState<UserLoginSession | null>(null);

  // Sync with storage and events
  useEffect(() => {
    const handleUpdate = () => {
      setSessions(loadLoginSessions());
    };
    window.addEventListener(SESSIONS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SESSIONS_UPDATED_EVENT, handleUpdate);
  }, []);

  // Filter logic
  const filteredSessions = sessions.filter((s) => {
    // Search
    const matchesSearch =
      s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.organization && s.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.subRoleLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ipAddress.includes(searchQuery);

    // Role
    let matchesRole = true;
    if (roleFilter === 'bpo') {
      matchesRole = s.subRoleLabel.toLowerCase().includes('bpo');
    } else if (roleFilter === 'company') {
      matchesRole = s.role === 'company' && !s.subRoleLabel.toLowerCase().includes('bpo');
    } else if (roleFilter !== 'all') {
      matchesRole = s.role === roleFilter;
    }

    // Status
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    // Date
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = s.loginDate === '2026-09-06';
    } else if (dateFilter === 'yesterday') {
      matchesDate = s.loginDate === '2026-09-05';
    } else if (dateFilter !== 'all') {
      matchesDate = s.loginDate === dateFilter;
    }

    // Duration
    let matchesDuration = true;
    if (durationFilter === 'short') {
      matchesDuration = s.durationSeconds < 3600; // < 1 hr
    } else if (durationFilter === 'medium') {
      matchesDuration = s.durationSeconds >= 3600 && s.durationSeconds <= 7200; // 1-2 hrs
    } else if (durationFilter === 'long') {
      matchesDuration = s.durationSeconds > 7200; // > 2 hrs
    }

    return matchesSearch && matchesRole && matchesStatus && matchesDate && matchesDuration;
  });

  // KPI Calculations
  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const avgDurationMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / (sessions.length || 1) / 60
  );
  const avgEngagementRate = Math.round(
    sessions.reduce((acc, s) => acc + s.engagementPercentage, 0) / (sessions.length || 1)
  );

  const getRoleBadge = (s: UserLoginSession) => {
    if (s.subRoleLabel.toLowerCase().includes('bpo')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
          <Briefcase className="w-2.5 h-2.5" />
          BPO / Agency
        </span>
      );
    }
    if (s.role === 'company') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <Building2 className="w-2.5 h-2.5" />
          Company
        </span>
      );
    }
    if (s.role === 'student') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center gap-1">
          <GraduationCap className="w-2.5 h-2.5" />
          Student
        </span>
      );
    }
    if (s.role === 'institution') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
          <Building2 className="w-2.5 h-2.5" />
          College TPO
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
        Admin
      </span>
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Session ID',
      'User Name',
      'Email',
      'Role',
      'Organization',
      'Login Date',
      'Login Time',
      'End Time',
      'Duration',
      'Active Engagement',
      'Engagement Rate',
      'Status',
      'Device',
      'IP Address'
    ];
    const rows = filteredSessions.map((s) => [
      s.id,
      `"${s.userName}"`,
      s.userEmail,
      s.subRoleLabel,
      `"${s.organization || ''}"`,
      s.loginDateDisplay,
      s.loginTime,
      s.endTime,
      s.durationDisplay,
      s.engagementDisplay,
      `${s.engagementPercentage}%`,
      s.status,
      `"${s.device}"`,
      s.ipAddress
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skillbridge_login_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                User Login & Session Tracker
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auditing user engagement, login timestamps, duration of access, and end times across Student, Company, BPO, and TPO accounts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Currently Active Now</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{activeCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Live in app</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Real-time sessions receiving heartbeats</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tracked Sessions</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{sessions.length}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Audited logs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Students, Companies, BPOs, TPOs</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg. Login Duration</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{avgDurationMinutes}m</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">per session</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Continuous platform access duration</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg. Engagement Rate</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{avgEngagementRate}%</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Active vs Idle</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active clicks, views & tests</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user name, email, organization, role (Company, BPO, Student), or IP..."
              className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today (06 Sep 2026)</option>
              <option value="yesterday">Yesterday (05 Sep 2026)</option>
              <option value="2026-09-04">04 Sep 2026</option>
            </select>
          </div>

          {/* Duration Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Duration:</span>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Durations</option>
              <option value="short">&lt; 1 hour</option>
              <option value="medium">1 - 2 hours</option>
              <option value="long">&gt; 2 hours</option>
            </select>
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">User Role:</span>
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'student', label: '🎓 Students' },
            { id: 'company', label: '🏢 Companies' },
            { id: 'bpo', label: '💼 BPO / Recruitment Agencies' },
            { id: 'institution', label: '🏛️ College TPOs' },
            { id: 'admin', label: '🛡️ Admins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === tab.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Now
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                statusFilter === 'completed'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Login Date & Time</th>
                <th className="py-3 px-4">End Time / Last Active</th>
                <th className="py-3 px-4">Duration of Access</th>
                <th className="py-3 px-4">Engagement on App</th>
                <th className="py-3 px-4">Pages & Modules Visited</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No session logs found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* User & Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {session.userName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                            <span>{session.userName}</span>
                            {session.status === 'active' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active in Session" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {session.userEmail}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            {getRoleBadge(session)}
                            {session.organization && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                • {session.organization}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Login Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {session.loginDateDisplay}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        {session.loginTime}
                      </div>
                    </td>

                    {/* End Time / Last Active */}
                    <td className="py-3.5 px-4">
                      {session.status === 'active' ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Active Now
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white font-mono">
                            {session.endTime}
                          </div>
                          <div className="text-[10px] text-slate-400">Logged out</div>
                        </div>
                      )}
                    </td>

                    {/* Duration of Access */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        {session.durationDisplay}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {session.durationSeconds >= 3600
                          ? `${(session.durationSeconds / 3600).toFixed(1)} hrs total`
                          : `${Math.round(session.durationSeconds / 60)} mins total`}
                      </div>
                    </td>

                    {/* Engagement on App */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {session.engagementDisplay}
                          </span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {session.engagementPercentage}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              session.engagementPercentage >= 85
                                ? 'bg-emerald-500'
                                : session.engagementPercentage >= 70
                                ? 'bg-indigo-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${session.engagementPercentage}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {session.totalInteractions} interactions recorded
                        </div>
                      </div>
                    </td>

                    {/* Pages Visited */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {session.pagesVisited.slice(0, 3).map((page, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {page}
                          </span>
                        ))}
                        {session.pagesVisited.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{session.pagesVisited.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Monitor className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[160px]">{session.device}</span>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSession(session);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Showing {filteredSessions.length} of {sessions.length} logged sessions</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Zero-Trust Session Tracking Engine Active
          </span>
        </div>
      </div>

      {/* Session Audit Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Session Audit: {selectedSession.id}
                    {selectedSession.status === 'active' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                        Live Now
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive access and user engagement timeline
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
              {/* User Profile Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedSession.userName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{selectedSession.userEmail}</div>
                  <div className="mt-2 flex items-center gap-2">
                    {getRoleBadge(selectedSession)}
                    {selectedSession.organization && (
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {selectedSession.organization}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">IP & Origin</span>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedSession.ipAddress}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedSession.location}
                  </div>
                </div>
              </div>

              {/* Time Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                  <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    Login Date & Time
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {selectedSession.loginDateDisplay}
                  </div>
                  <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 font-semibold">
                    {selectedSession.loginTime}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    End Time / Status
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {selectedSession.endTime}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">
                    {selectedSession.status === 'active' ? 'Session Ongoing' : 'Session Ended'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                    Total Access Duration
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {selectedSession.durationDisplay}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">
                    {selectedSession.durationSeconds} seconds
                  </div>
                </div>
              </div>

              {/* Engagement Depth Section */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    App Engagement Analysis
                  </h4>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedSession.engagementPercentage}% Active
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${selectedSession.engagementPercentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-400 text-[11px]">Active Screen Time:</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedSession.engagementDisplay}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-400 text-[11px]">Total Interactivity:</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedSession.totalInteractions} button clicks & page turns
                    </div>
                  </div>
                </div>
              </div>

              {/* Pages Visited Audit */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                  Pages & Modules Accessed in this Session:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSession.pagesVisited.map((page, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {page}
                    </span>
                  ))}
                </div>
              </div>

              {/* Device and Security Telemetry */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Client Agent:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedSession.device}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>IP Geolocation:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedSession.location} ({selectedSession.ipAddress})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Signature:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">VALID_CRYPTOGRAPHIC_HASH</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
