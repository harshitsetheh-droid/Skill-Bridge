import React from 'react';
import { UserRole, AuthStep } from '../../types';
import {
  GraduationCap,
  Building2,
  Landmark,
  LogIn,
  Sparkles,
  Menu,
  ShieldCheck,
  Sun,
  Moon,
  Flame
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { loadDailyStreakState, STREAK_UPDATED_EVENT } from '../../data/dailyQuizStore';

export interface TopRoleBarProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onSelectRole?: (role: UserRole) => void;
  onOpenAuth?: () => void;
  onToggleMobileMenu?: () => void;
  authStep?: AuthStep;
  onNavigateAuth?: (step: AuthStep) => void;
  inApp?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onNavigateTab?: (tab: string, role?: UserRole) => void;
}

export const TopRoleBar: React.FC<TopRoleBarProps> = ({
  currentRole,
  onRoleChange,
  onSelectRole,
  onOpenAuth,
  onToggleMobileMenu,
  authStep = 'app',
  onNavigateAuth,
  inApp = true,
  isDarkMode = false,
  onToggleDarkMode,
  onNavigateTab,
}) => {
  // Streak state subscription
  const [streakState, setStreakState] = React.useState(loadDailyStreakState);

  React.useEffect(() => {
    const handleUpdate = () => {
      setStreakState(loadDailyStreakState());
    };
    window.addEventListener(STREAK_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STREAK_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleRoleClick = (role: UserRole) => {
    if (onRoleChange) onRoleChange(role);
    if (onSelectRole) onSelectRole(role);
  };

  const handleAuthClick = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else if (onNavigateAuth) {
      onNavigateAuth('role-select');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-[1720px] 2xl:max-w-[1880px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button + Brand Logo */}
        <div className="flex items-center gap-2.5">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 -ml-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* TalentBridge Constellation / Three-Node Bridge Mark */}
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-[0_5px_12px_rgba(79,70,229,0.22)] shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5" cy="17" r="2.5" fill="currentColor" />
              <circle cx="12" cy="7" r="2.5" fill="currentColor" />
              <circle cx="19" cy="17" r="2.5" fill="currentColor" />
              <line x1="7" y1="15.5" x2="10.5" y2="8.5" />
              <line x1="13.5" y1="8.5" x2="17" y2="15.5" />
              <line x1="7.5" y1="17" x2="16.5" y2="17" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-[#1F3048] dark:text-[#F3F6FA] tracking-tight text-base font-display">
                TalentBridge
              </span>
              <span className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                v1.0
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Skills-to-Opportunity Platform
            </span>
          </div>
        </div>

        {/* Center Role Quick-Switcher */}
        <div className="flex items-center bg-[#F5F7FA] dark:bg-[#172033] p-1 rounded-lg border border-[#E8ECF1] dark:border-[#334155] text-xs font-medium overflow-x-auto max-w-[500px]">
          <button
            id="role-switch-student"
            onClick={() => handleRoleClick('student')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-150 shrink-0 font-display ${
              currentRole === 'student'
                ? 'bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#1E2248] dark:text-[#818CF8] font-bold shadow-2xs border border-[#A5B4FC]/50 dark:border-[#3730A3]'
                : 'text-[#718196] hover:text-[#1F3048] dark:hover:text-[#F3F6FA]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
            <span className="hidden xs:inline">Student</span>
            <span className="hidden md:inline text-[10px] opacity-75 font-normal">(Harshit)</span>
          </button>

          <button
            id="role-switch-company"
            onClick={() => handleRoleClick('company')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-150 shrink-0 font-display ${
              currentRole === 'company'
                ? 'bg-[#EFF5FF] text-[#1E3A8A] dark:bg-[#1B2942] dark:text-[#93C5FD] font-bold shadow-2xs border border-[#BFDBFE]/60 dark:border-[#1E3A8A]'
                : 'text-[#718196] hover:text-[#1F3048] dark:hover:text-[#F3F6FA]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-[#93C5FD]" />
            <span className="hidden xs:inline">Company</span>
            <span className="hidden md:inline text-[10px] opacity-75 font-normal">(TechNova)</span>
          </button>

          <button
            id="role-switch-institution"
            onClick={() => handleRoleClick('institution')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-150 shrink-0 font-display ${
              currentRole === 'institution'
                ? 'bg-[#E8F7F3] text-[#0F766E] dark:bg-[#0E3432] dark:text-[#2DD4BF] font-bold shadow-2xs border border-[#BCE5DC] dark:border-[#115E59]'
                : 'text-[#718196] hover:text-[#1F3048] dark:hover:text-[#F3F6FA]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="hidden xs:inline">TPO College</span>
            <span className="hidden md:inline text-[10px] opacity-75 font-normal">(IIT Jodhpur)</span>
          </button>

          <button
            id="role-switch-admin"
            onClick={() => handleRoleClick('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-150 shrink-0 font-display ${
              currentRole === 'admin'
                ? 'bg-[#FFF7E8] text-[#B45309] dark:bg-[#382613] dark:text-[#FBBF24] font-bold shadow-2xs border border-[#F1D5A0] dark:border-[#78350F]'
                : 'text-[#718196] hover:text-[#1F3048] dark:hover:text-[#F3F6FA]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FBBF24]" />
            <span>Admin</span>
            <span className="hidden lg:inline text-[10px] opacity-75 font-normal">(Governance)</span>
          </button>
        </div>

        {/* Right Nav Actions: Dark Mode Toggle, Notification Bell, Auth button, Role Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak Navigation Button */}
          <button
            id="nav-daily-streak-btn"
            onClick={() => {
              if (currentRole !== 'student' && onRoleChange) {
                onRoleChange('student');
              }
              if (onNavigateTab) {
                onNavigateTab('daily-questions', 'student');
              }
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              streakState.todayCompleted
                ? 'bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 hover:bg-orange-100 hover:border-orange-300'
                : streakState.streakStatus === 'paused'
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
            }`}
            title={
              streakState.todayCompleted
                ? `Daily Streak: ${streakState.streakCount} Days! Today's challenge completed.`
                : streakState.streakStatus === 'paused'
                ? `Daily Streak: ${streakState.streakCount} Days (Paused). Click to take Retest!`
                : `Daily Streak: ${streakState.streakCount} Days. Click to answer today's questions!`
            }
          >
            <Flame
              className={`w-4 h-4 text-orange-500 fill-orange-500 ${
                streakState.todayCompleted ? 'animate-bounce' : streakState.streakStatus === 'paused' ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
            <span className="hidden sm:inline font-black">
              {streakState.streakCount} {streakState.streakCount === 1 ? 'Day' : 'Days'}
            </span>
            <span className="sm:hidden font-black">{streakState.streakCount}d</span>
            {streakState.todayCompleted ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Today completed" />
            ) : streakState.streakStatus === 'paused' ? (
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" title="Retest needed" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-ping" title="Daily quiz pending" />
            )}
          </button>

          {/* Notification Bell with interactive dropdown */}
          <NotificationDropdown
            currentRole={currentRole}
            onNavigate={(tab, role) => {
              if (role && onRoleChange) onRoleChange(role);
              if (onNavigateTab) onNavigateTab(tab, role);
            }}
          />

          {/* Dark Mode Toggle Button */}
          {onToggleDarkMode && (
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          )}

          {/* Auth Flow toggle */}
          <button
            id="view-auth-flow-btn"
            onClick={handleAuthClick}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Role Sign In</span>
          </button>

          {/* Role Accent Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              currentRole === 'student'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50'
                : currentRole === 'company'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50'
                : currentRole === 'institution'
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50'
                : 'bg-indigo-950 dark:bg-slate-800 text-white border border-indigo-900 dark:border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentRole === 'student'
                  ? 'bg-indigo-600'
                  : currentRole === 'company'
                  ? 'bg-blue-900'
                  : currentRole === 'institution'
                  ? 'bg-teal-700'
                  : 'bg-indigo-400'
              }`}
            />
            <span className="capitalize">{currentRole === 'admin' ? 'Super Admin' : currentRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
