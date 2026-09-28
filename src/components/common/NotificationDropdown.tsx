import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ShieldAlert,
  Building2,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  ChevronRight,
  Filter,
  Zap,
  Calendar,
  Send,
  MessageSquare,
  ShieldCheck,
  Play,
  RotateCcw
} from 'lucide-react';
import { AppNotification, UserRole } from '../../types';
import {
  loadNotifications,
  saveNotifications,
  defaultNotifications,
  NOTIFICATIONS_UPDATED_EVENT,
  notifyTpoOfCampusDriveRequest,
  notifyStudentsOfCampusDrive,
  notifyStudentsOfTpoNudge,
  notifyCompanyOfCollegeApproach,
  notifyCompanyOfAdminApproval,
  notifyCollegeOfProposalDecision,
  notifyTpoOfCompanyFeedback,
  notifyCompanyOfTpoFeedbackAction,
} from '../../data/notificationStore';

interface NotificationDropdownProps {
  currentRole: UserRole;
  onNavigate?: (tab: string, role?: UserRole) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  currentRole,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());
  const [filter, setFilter] = useState<'my-role' | 'all' | 'unread' | 'alerts'>('my-role');
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorFeedback, setSimulatorFeedback] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with storage on mount and when event fires
  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(loadNotifications());
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const roleLabelMap: Record<UserRole, string> = {
    student: 'Student',
    institution: 'TPO / College',
    company: 'Company',
    admin: 'Admin',
  };

  const myRoleCount = notifications.filter(
    (n) => !n.targetRole || n.targetRole === currentRole || n.targetRole === 'all'
  ).length;

  const unreadCount = notifications.filter(
    (n) => (!n.targetRole || n.targetRole === currentRole || n.targetRole === 'all') && !n.isRead
  ).length;

  const totalUnreadAll = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const handleResetDefaults = () => {
    setNotifications(defaultNotifications);
    saveNotifications(defaultNotifications);
  };

  const handleItemClick = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    if (onNavigate && notif.targetTab) {
      onNavigate(notif.targetTab, notif.targetRole && notif.targetRole !== 'all' ? notif.targetRole : undefined);
      setIsOpen(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'my-role') {
      return !n.targetRole || n.targetRole === currentRole || n.targetRole === 'all';
    }
    if (filter === 'unread') {
      return !n.isRead;
    }
    if (filter === 'alerts') {
      return n.category === 'nudge' || n.category === 'drive' || n.category === 'risk' || n.priority === 'urgent' || n.category === 'approval';
    }
    return true; // 'all'
  });

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'nudge':
        return <Zap className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'drive':
        return <Calendar className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'feedback':
        return <MessageSquare className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'request':
        return <Send className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'approval':
        return <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'verification':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'risk':
        return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const getRoleBadgeStyle = (role?: UserRole | 'all') => {
    switch (role) {
      case 'student':
        return 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'institution':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'company':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'admin':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const triggerSim = (name: string, fn: () => void) => {
    fn();
    setSimulatorFeedback(`✓ Dispatched "${name}"!`);
    setTimeout(() => setSimulatorFeedback(null), 3000);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-150 flex items-center justify-center ${
          isOpen
            ? 'bg-slate-200/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
        }`}
        title="Notifications"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[9px] font-bold items-center justify-center shadow-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          id="notification-dropdown-panel"
          className="absolute right-0 mt-2 w-84 sm:w-[420px] max-w-[94vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  Live Notifications
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-900/50">
                      {unreadCount} unread
                    </span>
                  )}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSimulator(!showSimulator)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border ${
                  showSimulator
                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
                title="Simulate / trigger test notifications for all roles"
              >
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">Simulate</span>
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-2 py-1 rounded-lg text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span className="hidden sm:inline">Read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Simulator Bar (when opened) */}
          {showSimulator && (
            <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1 text-[11px]">
                  <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                  Trigger Cross-Role Notification Events:
                </span>
                <button
                  onClick={handleResetDefaults}
                  className="text-[10px] text-amber-700 hover:underline flex items-center gap-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Reset Defaults
                </button>
              </div>

              {simulatorFeedback && (
                <div className="mb-2 p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {simulatorFeedback}
                </div>
              )}

              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  onClick={() =>
                    triggerSim('Company Posts Drive → TPO', () =>
                      notifyTpoOfCampusDriveRequest({
                        companyName: 'Nexlify Systems',
                        jobTitle: 'Cloud DevOps Intern',
                        driveStartDate: '2026-11-10',
                        driveEndDate: '2026-11-12',
                        eligibleBranches: ['CSE', 'IT', 'ECE'],
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="Company submits on-campus drive request to TPO"
                >
                  🏢 1. Company Drive → <b>TPO</b>
                </button>

                <button
                  onClick={() =>
                    triggerSim('TPO Posts Drive → Student', () =>
                      notifyStudentsOfCampusDrive({
                        companyName: 'Nexlify Systems',
                        jobTitle: 'Cloud DevOps Intern',
                        driveDates: '10 Nov - 12 Nov 2026',
                        eligibleBranches: ['CSE', 'IT', 'ECE'],
                        stipend: '₹50,000 / month',
                        tpoName: 'Dr. Sharma (TPO)',
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="TPO posts drive to students with dates"
                >
                  🎓 2. TPO Drive Live → <b>Student</b>
                </button>

                <button
                  onClick={() =>
                    triggerSim('TPO Nudges CSE & IT Stream', () =>
                      notifyStudentsOfTpoNudge({
                        stream: 'CSE & IT Streams',
                        nudgeMessage:
                          'Dr. Sharma (Head TPO) nudged CSE & IT: TechNova and Google Cloud campus drives start next week. Complete pending AST code defenses and project audit!',
                        tpoName: 'Dr. Sharma (Head TPO)',
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="TPO nudges students for specific stream"
                >
                  🔔 3. TPO Nudge → <b>CSE & IT</b>
                </button>

                <button
                  onClick={() =>
                    triggerSim('College Approach → Company', () =>
                      notifyCompanyOfCollegeApproach({
                        collegeName: 'MBM University, Jodhpur',
                        tpoName: 'Dr. R. K. Sharma',
                        targetBatch: 'Class of 2026',
                        targetBranches: ['CSE', 'AI-DS'],
                        proposedDates: 'Nov 12 - Nov 15, 2026',
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="TPO sends recruitment proposal to company"
                >
                  🏛️ 4. TPO Approach → <b>Company</b>
                </button>

                <button
                  onClick={() =>
                    triggerSim('Admin Approves Company', () =>
                      notifyCompanyOfAdminApproval({
                        companyName: 'CloudScale Corp',
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="Admin approves company registration"
                >
                  🛡️ 5. Admin Approves → <b>Company</b>
                </button>

                <button
                  onClick={() =>
                    triggerSim('Company Accepts College Request', () =>
                      notifyCollegeOfProposalDecision({
                        collegeName: 'MBM University, Jodhpur',
                        companyName: 'TechNova Solutions',
                        isApproved: true,
                        confirmedDates: 'Nov 12 - Nov 15, 2026',
                        remarks: 'Slot confirmed. Campus hiring panel assigned.',
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="Company accepts college recruitment request"
                >
                  ✅ 6. Company Accepts → <b>TPO</b>
                </button>

                <button
                  onClick={() =>
                    triggerSim('Company Feedback → TPO', () =>
                      notifyTpoOfCompanyFeedback({
                        companyName: 'DataHub Solutions',
                        department: 'Computer Science',
                        batchYear: 'Batch 2026',
                        missingSkills: ['PostgreSQL Indexing', 'Kafka Streaming'],
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="Company submits hiring feedback on curriculum"
                >
                  💬 7. Company Feedback → <b>TPO</b>
                </button>

                <button
                  onClick={() =>
                    triggerSim('TPO Acts on Feedback → Company', () =>
                      notifyCompanyOfTpoFeedbackAction({
                        collegeName: 'MBM University, Jodhpur',
                        companyName: 'TechNova Solutions',
                        department: 'CSE Department',
                        status: 'Curriculum Action Initiated',
                        tpoNote: 'Approved 3-week hands-on Docker & SQL indexing workshop.',
                      })
                    )
                  }
                  className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 text-left truncate font-medium"
                  title="TPO accepts and initiates curriculum action"
                >
                  🎯 8. TPO Acts Feedback → <b>Company</b>
                </button>
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex items-center gap-1.5 text-[11px] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter('my-role')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                filter === 'my-role'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>For {roleLabelMap[currentRole] || 'My Role'}</span>
              <span className="text-[10px] opacity-80">({myRoleCount})</span>
            </button>

            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Roles ({notifications.length})
            </button>

            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                filter === 'unread'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Unread</span>
              {totalUnreadAll > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </button>

            <button
              onClick={() => setFilter('alerts')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                filter === 'alerts'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Nudges & Drives</span>
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-88 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 no-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-2">
                  <Bell className="w-5 h-5 opacity-50" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No notifications found
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-xs mx-auto">
                  {filter === 'my-role'
                    ? `No notifications currently targeted for ${roleLabelMap[currentRole]}. Check "All Roles" or click "Simulate" above!`
                    : filter === 'unread'
                    ? 'All caught up! No unread notifications.'
                    : 'No matching alerts found.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 transition-colors cursor-pointer group flex items-start gap-3 relative ${
                    !item.isRead
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Category icon avatar */}
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {item.targetRole && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(
                            item.targetRole
                          )}`}
                        >
                          {item.targetRole === 'institution'
                            ? 'TPO / College'
                            : item.targetRole.toUpperCase()}
                        </span>
                      )}
                      {item.stream && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {item.stream}
                        </span>
                      )}
                      {item.category === 'nudge' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200">
                          ⚡ TPO Nudge
                        </span>
                      )}
                      {item.category === 'drive' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                          📅 Campus Drive
                        </span>
                      )}
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.timestamp}
                      </span>
                      {item.senderName && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          From: {item.senderName}
                        </span>
                      )}
                      {item.targetTab && (
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          View in {item.targetTab}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions on hover */}
                  <div className="absolute right-2.5 top-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!item.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(item.id, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 shadow-2xs"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 shadow-2xs"
                      title="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Quick Info */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Cross-Role Event Bus Active
            </span>
            <span className="font-medium">SkillBridge Central Relay</span>
          </div>
        </div>
      )}
    </div>
  );
};
