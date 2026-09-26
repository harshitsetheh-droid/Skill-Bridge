import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Award,
  GitCompare,
  FolderGit2,
  FileCheck,
  TrendingUp,
  Briefcase,
  Settings,
  Building,
  PlusCircle,
  Users,
  BarChart3,
  Network,
  FileSpreadsheet,
  X,
  GraduationCap,
  Building2,
  Landmark,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  MessageSquare,
  UserCheck,
  Flame,
  Clock
} from 'lucide-react';
import { loadDailyStreakState, STREAK_UPDATED_EVENT } from '../../data/dailyQuizStore';
import { computeSidebarBadges, SIDEBAR_REFRESH_EVENTS } from '../../data/sidebarBadges';

export interface SidebarProps {
  currentRole?: UserRole;
  role?: UserRole;
  activeTab?: string;
  currentTab?: string;
  onSelectTab: (tab: string) => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  onLogout?: () => void;
  onOpenAuth?: () => void;
  onRoleChange?: (role: UserRole) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  role,
  activeTab,
  currentTab,
  onSelectTab,
  isMobileMenuOpen = false,
  onCloseMobileMenu = () => {},
  onLogout,
  onOpenAuth,
  onRoleChange,
}) => {
  // Normalize role and activeTab props
  const resolvedRole: UserRole = currentRole || role || 'student';
  const resolvedTab: string = activeTab || currentTab || 'dashboard';

  // Dynamic Streak State for Student
  const [streakState, setStreakState] = React.useState(loadDailyStreakState);

  React.useEffect(() => {
    const handleUpdate = () => {
      // Rebuild streak + let the memo below recompute badges with fresh store data.
      setStreakState(loadDailyStreakState());
    };
    window.addEventListener(STREAK_UPDATED_EVENT, handleUpdate);
    SIDEBAR_REFRESH_EVENTS.forEach((evt) => window.addEventListener(evt, handleUpdate));
    return () => {
      window.removeEventListener(STREAK_UPDATED_EVENT, handleUpdate);
      SIDEBAR_REFRESH_EVENTS.forEach((evt) => window.removeEventListener(evt, handleUpdate));
    };
  }, [resolvedRole]);

  // Dynamic badges derived from the SAME stores the views use.
  const dynamicBadges = React.useMemo(
    () => computeSidebarBadges(resolvedRole),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedRole, streakState]
  );

  const streakBadge = streakState.todayCompleted
    ? `${streakState.streakCount}d 🔥`
    : streakState.streakStatus === 'paused'
    ? 'Paused ⚠️'
    : streakState.streakCount > 0
    ? `${streakState.streakCount}d • Today`
    : 'Start 0d';

  const streakBadgeColor = streakState.todayCompleted
    ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 font-bold'
    : streakState.streakStatus === 'paused'
    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold'
    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold';

  // Complete side panel options for Student
  const studentNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily-questions', label: 'Daily Questions', icon: Flame, badge: streakBadge, badgeColor: streakBadgeColor },
    { id: 'skills', label: 'My Skills', icon: Award },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: GitCompare },
    { id: 'projects', label: 'Projects & Code Defense', icon: FolderGit2 },
    { id: 'resume', label: 'Certificates & Resume', icon: FileCheck },
    { id: 'improvement-path', label: 'Improvement Path', icon: TrendingUp },
    { id: 'internships', label: 'Internships & Jobs', icon: Briefcase },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
  ];

  // Complete side panel options for Company
  const companyNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Company Profile', icon: Building, badge: 'Verified', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'post-job', label: 'Post a Job', icon: PlusCircle },
    { id: 'applied', label: 'Applied', icon: UserCheck },
    { id: 'requests', label: 'Requests', icon: Send },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'analytics', label: 'Talent Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Company Settings', icon: Settings },
  ];

  // Complete side panel options for Institution
  const institutionNav: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'curriculum-gaps', label: 'Curriculum Gaps', icon: Network },
    { id: 'students', label: 'Student Readiness', icon: Users },
    { id: 'companies', label: 'Recruiting Companies', icon: Building },
    { id: 'applied-selected', label: 'Applied & Selected', icon: CheckCircle2 },
    { id: 'requests', label: 'Requests', icon: Send },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'reports', label: 'Accreditation Reports', icon: FileSpreadsheet, badge: 'NIRF / NAAC', badgeColor: 'bg-emerald-100 text-emerald-800' },
  ];

  // Complete side panel options for Admin (same clean UI style as other roles)
  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all-students', label: 'All Students (Data & Delist)', icon: Users },
    { id: 'suspicious-profiles', label: 'Suspicious Profiles & Risk Alerts', icon: AlertTriangle },
    { id: 'all-universities', label: 'All Universities', icon: Landmark },
    { id: 'university-approval', label: 'University Approval (TPO)', icon: CheckCircle2 },
    { id: 'skill-gap-overview', label: 'Skill Gap Overview', icon: BarChart3 },
    { id: 'all-companies', label: 'All Companies', icon: Briefcase },
    { id: 'internships-jobs', label: 'Internships / Jobs', icon: FileText },
    { id: 'applications-overview', label: 'Applications Overview', icon: Users },
    { id: 'session-tracker', label: 'User Login & Session Tracker', icon: Clock },
  ];

  const navItems =
    resolvedRole === 'student' ? studentNav :
    resolvedRole === 'company' ? companyNav :
    resolvedRole === 'admin' ? adminNav :
    institutionNav;

  // Role-specific styles matching TalentBridge Design System (Signal Garden)
  const roleStyles = {
    student: {
      accentColor: '#4F46E5',
      softSurface: '#EEF2FF',
      activeBg: 'bg-indigo-50 text-indigo-700 border-l-[3px] border-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-400 font-semibold',
      activeLabel: 'text-indigo-900 dark:text-indigo-100 font-bold',
      hoverBg: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
      activeIcon: 'text-indigo-600 dark:text-indigo-400',
      inactiveIcon: 'text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400',
      avatarBg: 'bg-[#4F46E5] text-white shadow-[0_5px_12px_rgba(79,70,229,0.22)]',
      badgeBg: 'bg-[#EEF2FF] text-[#4F46E5] border border-[#A5B4FC]',
      name: 'Harshit Seth',
      detail: 'CSE • 2026 Batch',
      roleLabel: 'Student Portal',
      initials: 'HS',
    },
    company: {
      accentColor: '#1E3A8A',
      softSurface: '#EFF5FF',
      activeBg: 'bg-blue-50 text-blue-900 border-l-[3px] border-blue-800 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-400 font-semibold',
      activeLabel: 'text-blue-950 dark:text-blue-100 font-bold',
      hoverBg: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
      activeIcon: 'text-blue-800 dark:text-blue-400',
      inactiveIcon: 'text-slate-400 group-hover:text-blue-800 dark:text-slate-500 dark:group-hover:text-blue-400',
      avatarBg: 'bg-[#1E3A8A] text-white shadow-xs',
      badgeBg: 'bg-[#EFF5FF] text-[#1E3A8A] border border-[#BFDBFE]',
      name: 'TechNova Solutions',
      detail: 'Talent Acquisition Team',
      roleLabel: 'Company Portal',
      initials: 'TN',
    },
    institution: {
      accentColor: '#0F766E',
      softSurface: '#E8F7F3',
      activeBg: 'bg-teal-50 text-teal-800 border-l-[3px] border-teal-700 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-400 font-semibold',
      activeLabel: 'text-teal-950 dark:text-teal-100 font-bold',
      hoverBg: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
      activeIcon: 'text-teal-700 dark:text-teal-400',
      inactiveIcon: 'text-slate-400 group-hover:text-teal-700 dark:text-slate-500 dark:group-hover:text-teal-400',
      avatarBg: 'bg-[#0F766E] text-white shadow-xs',
      badgeBg: 'bg-[#E8F7F3] text-[#0F766E] border border-[#BCE5DC]',
      name: 'IIT / IT Jodhpur',
      detail: 'Training & Placement Office',
      roleLabel: 'Institution / TPO',
      initials: 'ITJ',
    },
    admin: {
      accentColor: '#B45309',
      softSurface: '#FFF7E8',
      activeBg: 'bg-amber-50 text-amber-900 border-l-[3px] border-amber-600 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-400 font-semibold',
      activeLabel: 'text-amber-950 dark:text-amber-100 font-bold',
      hoverBg: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
      activeIcon: 'text-amber-700 dark:text-amber-400',
      inactiveIcon: 'text-slate-400 group-hover:text-amber-700 dark:text-slate-500 dark:group-hover:text-amber-400',
      avatarBg: 'bg-[#B45309] text-white shadow-xs',
      badgeBg: 'bg-[#FFF7E8] text-[#B45309] border border-[#F1D5A0]',
      name: 'Admin User',
      detail: 'Super Admin • Governance',
      roleLabel: 'Admin Portal',
      initials: 'AU',
    }
  }[resolvedRole];

  // Tab matcher supporting aliases
  const isTabActive = (itemId: string) => {
    if (resolvedTab === itemId) return true;
    if (itemId === 'suspicious-profiles' && (resolvedTab === 'risk-alerts' || resolvedTab === 'resume-issues' || resolvedTab === 'skill-verification')) return true;
    if (itemId === 'skill-gap' && resolvedTab === 'gaps') return true;
    if (itemId === 'improvement-path' && resolvedTab === 'roadmap') return true;
    if (itemId === 'profile-settings' && resolvedTab === 'profile') return true;
    if (itemId === 'project-integrity' && resolvedTab === 'integrity') return true;
    if (itemId === 'overview' && resolvedTab === 'dashboard') return true;
    return false;
  };

  const handleTabClick = (itemId: string) => {
    onSelectTab(itemId);
    onCloseMobileMenu();
  };

  // Reusable navigation content for both desktop and mobile drawer
  const renderSidebarContent = (isMobile = false) => {
    // Default Clean Sidebar for Student, Company, Institution, Admin
    return (
      <div className="flex flex-col h-full select-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Profile Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${roleStyles.avatarBg}`}>
              {roleStyles.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {roleStyles.name}
                </h2>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950 shrink-0" title="Online & Verified" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {roleStyles.detail}
              </p>
            </div>
            {isMobile && (
              <button
                onClick={onCloseMobileMenu}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Current Active Workspace Tag */}
          <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{roleStyles.roleLabel}</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Live
            </span>
          </div>
        </div>

        {/* Navigation Links (Scrollable with hidden scrollbar) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation Modules ({navItems.length})
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isTabActive(item.id);

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-display transition-all duration-150 text-left cursor-pointer ${
                  active
                    ? roleStyles.activeBg
                    : `text-slate-600 dark:text-slate-400 ${roleStyles.hoverBg}`
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? roleStyles.activeIcon : roleStyles.inactiveIcon
                    }`}
                  />
                  <span className={`truncate ${
                    active 
                      ? (roleStyles.activeLabel || 'text-slate-900 dark:text-white font-bold') 
                      : 'text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                </div>

                {(item.badge || dynamicBadges[item.id]?.badge) && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2 border ${
                      (dynamicBadges[item.id]?.badgeColor || item.badgeColor)
                        ? `${dynamicBadges[item.id]?.badgeColor || item.badgeColor} border-current/15`
                        : active
                        ? 'bg-indigo-600 text-white border-indigo-700 dark:bg-indigo-500 dark:border-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {dynamicBadges[item.id]?.badge || item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Role Quick Switcher & System Status */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 space-y-2">
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-2 uppercase tracking-wider">
            Quick Role Switching
          </div>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => onRoleChange && onRoleChange('student')}
              className={`px-1.5 py-1.5 rounded-lg text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-all ${
                resolvedRole === 'student'
                  ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Student</span>
            </button>

            <button
              onClick={() => onRoleChange && onRoleChange('company')}
              className={`px-1.5 py-1.5 rounded-lg text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-all ${
                resolvedRole === 'company'
                  ? 'bg-blue-900 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Company</span>
            </button>

            <button
              onClick={() => onRoleChange && onRoleChange('institution')}
              className={`px-1.5 py-1.5 rounded-lg text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-all ${
                resolvedRole === 'institution'
                  ? 'bg-teal-700 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700'
              }`}
            >
              <Landmark className="w-3 h-3" />
              <span>College</span>
            </button>

            <button
              onClick={() => onRoleChange && onRoleChange('admin')}
              className={`px-1.5 py-1.5 rounded-lg text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-all ${
                (resolvedRole as string) === 'admin'
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="w-full mt-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Switch Account / Sign In</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR: Clean flex child (w-64 shrink-0), NEVER overlaps <main> */}
      {/* ========================================================================= */}
      <aside
        id="desktop-app-sidebar"
        className="hidden lg:flex flex-col w-64 shrink-0 rounded-2xl shadow-xs h-[calc(100vh-5.5rem)] sticky top-20 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
      >
        {renderSidebarContent(false)}
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET OVERLAY DRAWER: Appears only when triggered by menu icon */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <aside
            id="mobile-app-sidebar"
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 flex flex-col overflow-hidden bg-white dark:bg-slate-900"
          >
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
