import React, { useState } from 'react';
import { 
  Users, 
  Landmark, 
  Briefcase, 
  FileText, 
  Hourglass, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  AlertTriangle, 
  Calendar, 
  Bell, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  ExternalLink,
  Search,
  Check,
  X,
  Eye,
  SlidersHorizontal,
  Lock,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('This Month');
  const [dateRange, setDateRange] = useState('01 May 2025 - 31 May 2025');
  const [activeReviewItem, setActiveReviewItem] = useState<{
    name: string;
    type: string;
    submittedOn: string;
    details?: string;
  } | null>(null);
  const [reviewActionDone, setReviewActionDone] = useState<string | null>(null);

  // Review modal handler
  const handleApproveReview = () => {
    setReviewActionDone(`Successfully approved verification for ${activeReviewItem?.name}`);
    setTimeout(() => {
      setActiveReviewItem(null);
      setReviewActionDone(null);
    }, 1200);
  };

  const handleFlagReview = () => {
    setReviewActionDone(`Marked ${activeReviewItem?.name} as High-Risk Alert for AST code audit`);
    setTimeout(() => {
      setActiveReviewItem(null);
      setReviewActionDone(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Top Header Bar inside Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, Admin!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening on SkillBridge platform today.
          </p>
        </div>

        {/* Date Filter & Admin Profile Snapshot */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <span>{dateRange}</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <button 
            onClick={() => onNavigateTab('risk-alerts')}
            className="relative p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40 shadow-2xs transition-colors"
            title="12 Active Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              12
            </span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              AU
            </div>
            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 dark:text-white dark:text-white">Admin User</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Super Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6 TOP METRIC KPI CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Students */}
        <div 
          onClick={() => onNavigateTab('all-students')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Students</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">12,450</span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>8.6% from last month</span>
          </div>
        </div>

        {/* Total Universities */}
        <div 
          onClick={() => onNavigateTab('all-universities')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Universities</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">86</span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>5.4% from last month</span>
          </div>
        </div>

        {/* Total Companies */}
        <div 
          onClick={() => onNavigateTab('all-companies')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Companies</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">320</span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>7.2% from last month</span>
          </div>
        </div>

        {/* Active Internships */}
        <div 
          onClick={() => onNavigateTab('internships-jobs')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Active Internships</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">580</span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>10.3% from last month</span>
          </div>
        </div>

        {/* Pending Signups (TPO & Companies) */}
        <div 
          onClick={() => onNavigateTab('university-approval')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Hourglass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Pending Signups</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">4</span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <TrendingUp className="w-3 h-3" />
            <span>TPOs & Companies awaiting approval</span>
          </div>
        </div>

        {/* High Risk Alerts */}
        <div 
          onClick={() => onNavigateTab('risk-alerts')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700 hover:border-red-400 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">High Risk Alerts</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white dark:text-white dark:text-red-400">18</span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>12.5% from last month</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MIDDLE ROW: 3 VISUAL CARDS (Platform Overview, Verification Status, Recent Risk Alerts) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* 1. Platform Overview (Line Graph) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">Platform Overview</h2>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 font-medium focus:outline-hidden"
              >
                <option value="This Month">This Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            {/* Legends */}
            <div className="flex items-center gap-4 text-xs mb-3 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-600 dark:text-slate-400">Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">Companies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600 dark:text-slate-400">Internships</span>
              </div>
            </div>

            {/* SVG Interactive Multi-Line Chart */}
            <div className="relative h-48 w-full pt-2">
              <svg viewBox="0 0 450 180" className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="440" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="60" x2="440" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="100" x2="440" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="140" x2="440" y2="140" stroke="#F1F5F9" strokeWidth="1" />

                {/* Y-axis Labels */}
                <text x="32" y="24" fontSize="10" fill="#94A3B8" textAnchor="end">14K</text>
                <text x="32" y="64" fontSize="10" fill="#94A3B8" textAnchor="end">12K</text>
                <text x="32" y="104" fontSize="10" fill="#94A3B8" textAnchor="end">8K</text>
                <text x="32" y="144" fontSize="10" fill="#94A3B8" textAnchor="end">4K</text>
                <text x="32" y="176" fontSize="10" fill="#94A3B8" textAnchor="end">0</text>

                {/* Students Curve (Blue) 6K -> 12.4K */}
                <path
                  d="M 50 115 C 120 100, 180 85, 230 70 C 300 55, 360 40, 430 30"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                {/* Blue Nodes */}
                <circle cx="50" cy="115" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="150" cy="92" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="230" cy="70" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="330" cy="48" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="430" cy="30" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Companies Curve (Green) */}
                <path
                  d="M 50 162 C 120 160, 200 158, 260 156 C 330 154, 380 150, 430 146"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />
                <circle cx="50" cy="162" r="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="180" cy="158" r="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="310" cy="153" r="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="430" cy="146" r="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />

                {/* Internships Curve (Orange) */}
                <path
                  d="M 50 172 C 120 171, 200 169, 270 167 C 340 164, 380 162, 430 159"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
                <circle cx="50" cy="172" r="3" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="230" cy="168" r="3" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="430" cy="159" r="3" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />

                {/* X-axis Labels */}
                <text x="50" y="176" fontSize="10" fill="#94A3B8" textAnchor="middle">1 May</text>
                <text x="145" y="176" fontSize="10" fill="#94A3B8" textAnchor="middle">8 May</text>
                <text x="240" y="176" fontSize="10" fill="#94A3B8" textAnchor="middle">15 May</text>
                <text x="335" y="176" fontSize="10" fill="#94A3B8" textAnchor="middle">22 May</text>
                <text x="430" y="176" fontSize="10" fill="#94A3B8" textAnchor="middle">31 May</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Verification Status (Donut Chart) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white mb-2">Verification Status</h2>
            
            <div className="flex items-center justify-between gap-2 my-2">
              {/* SVG Donut Chart with Center Text */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Total 14,665:
                      Verified: 61% (stroke-dasharray 61 39) - Emerald
                      Pending: 21% - Amber
                      Under Review: 10% - Blue
                      High Risk: 6% - Red
                      Rejected: 2% - Slate
                  */}
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E2E8F0" strokeWidth="14" />
                  {/* Verified: 61% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="14"
                    strokeDasharray="145.7 93"
                    strokeDashoffset="0"
                  />
                  {/* Pending: 21% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="14"
                    strokeDasharray="50.1 188"
                    strokeDashoffset="-145.7"
                  />
                  {/* Under Review: 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="14"
                    strokeDasharray="23.8 214.2"
                    strokeDashoffset="-195.8"
                  />
                  {/* High Risk: 6% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#EF4444"
                    strokeWidth="14"
                    strokeDasharray="14.3 223.7"
                    strokeDashoffset="-219.6"
                  />
                  {/* Rejected: 2% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#94A3B8"
                    strokeWidth="14"
                    strokeDasharray="4.8 233.2"
                    strokeDashoffset="-233.9"
                  />
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                    14,665
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    Total Profiles
                  </span>
                </div>
              </div>

              {/* Status List with exact counts */}
              <div className="space-y-1.5 text-xs flex-1 pl-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Verified</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">8,942 (61%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Pending</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">3,142 (21%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Under Review</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">1,482 (10%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">High Risk</span>
                  </div>
                  <span className="font-bold text-red-600 dark:text-red-400">884 (6%)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Rejected</span>
                  </div>
                  <span className="font-bold text-slate-600 dark:text-slate-400">215 (2%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Recent Risk Alerts */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">Recent Risk Alerts</h2>
              <button 
                onClick={() => onNavigateTab('risk-alerts')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'High risk resume detected', sub: 'Rahul Sharma', time: '5 min ago' },
                { title: 'Skill mismatch detected', sub: 'Priya Verma', time: '15 min ago' },
                { title: 'Fake certificate suspected', sub: 'Aman Yadav', time: '28 min ago' },
                { title: 'Experience not verified', sub: 'Sneha Patel', time: '45 min ago' },
                { title: 'Multiple suspicious activities', sub: 'User ID: STU12345', time: '1 hr ago' },
              ].map((alert, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {alert.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                      <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{alert.sub}</span>
                      <span className="shrink-0">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('risk-alerts')}
            className="w-full mt-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center transition-colors shadow-2xs"
          >
            View All Alerts
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ROW: 3 DATA TABLES (Pending Verifications, Universities Overview, Recent Opportunities) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Table 1: Pending Signups (TPO & Companies) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">Pending Signups (TPO & Co.)</h2>
                <p className="text-[11px] text-slate-400">One-time admin approval for direct login</p>
              </div>
              <button 
                onClick={() => onNavigateTab('university-approval')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-2">Entity</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Registered</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { name: 'Heritage Inst. of Sci.', type: 'TPO / University', date: 'Yesterday', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
                    { name: 'ZetaEdge Technologies', type: 'Company / Recruiter', date: 'Today', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
                    { name: 'Apex National Academy', type: 'TPO / University', date: 'Today', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
                    { name: 'CloudScale Corp', type: 'Company / Recruiter', date: 'Yesterday', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                          {row.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[130px] font-semibold">{row.name}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.badge}`}>
                          {row.type.split('/')[0].trim()}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            if (row.type.includes('University')) {
                              onNavigateTab('university-approval');
                            } else {
                              onNavigateTab('all-companies');
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 2: Universities Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">Universities Overview</h2>
              <button 
                onClick={() => onNavigateTab('all-universities')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-2">University</th>
                    <th className="pb-2">Students</th>
                    <th className="pb-2">Skill Gap</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { name: 'ABC University', count: '2,450', gap: 'High', gapColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', status: 'Active', active: true },
                    { name: 'XYZ Institute of Tech', count: '1,980', gap: 'Medium', gapColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', status: 'Active', active: true },
                    { name: 'Global Engineering College', count: '1,670', gap: 'Medium', gapColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', status: 'Active', active: true },
                    { name: 'PQR University', count: '1,240', gap: 'High', gapColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', status: 'Active', active: true },
                    { name: 'LMN Technical University', count: '1,120', gap: 'Low', gapColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800', status: 'Inactive', active: false },
                  ].map((u, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 font-medium text-slate-900 dark:text-white truncate max-w-[140px]">
                        {u.name}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300 font-semibold">
                        {u.count}
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${u.gapColor}`}>
                          {u.gap}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('all-universities')}
            className="w-full mt-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold text-center transition-colors shadow-2xs"
          >
            Manage Universities
          </button>
        </div>

        {/* Table 3: Recent Opportunities */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">Recent Opportunities</h2>
              <button 
                onClick={() => onNavigateTab('internships-jobs')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-2">Job Title</th>
                    <th className="pb-2">Company</th>
                    <th className="pb-2">Applications</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { title: 'Frontend Developer Intern', company: 'TechNova', apps: '91', status: 'Active', isPending: false },
                    { title: 'Data Analyst Intern', company: 'DataHub Solutions', apps: '64', status: 'Active', isPending: false },
                    { title: 'UI/UX Design Intern', company: 'DesignCraft', apps: '53', status: 'Active', isPending: false },
                    { title: 'Backend Developer Intern', company: 'CodeSoft', apps: '48', status: 'Pending', isPending: true },
                    { title: 'AI/ML Intern', company: 'InnoMind AI', apps: '37', status: 'Active', isPending: false },
                  ].map((job, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 font-medium text-slate-900 dark:text-white truncate max-w-[130px]">
                        {job.title}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-400 text-[11px] truncate max-w-[90px]">
                        {job.company}
                      </td>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                        {job.apps}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.isPending 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('internships-jobs')}
            className="w-full mt-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold text-center transition-colors shadow-2xs"
          >
            Manage Opportunities
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FOOTER STRIP: ADMIN CONTROL CENTER */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">Admin Control Center</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage students, universities, companies and ensure platform integrity.
            </p>
          </div>
        </div>

        {/* 4 Feature Pills from Screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight">Verify & Approve</div>
              <div className="text-[10px] text-slate-400 leading-tight">Profiles & documents</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight">Detect & Prevent</div>
              <div className="text-[10px] text-slate-400 leading-tight">Fake or suspicious activity</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
            <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight">Monitor & Analytics</div>
              <div className="text-[10px] text-slate-400 leading-tight">Real-time insights</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight">Ensure Trust</div>
              <div className="text-[10px] text-slate-400 leading-tight">Safe & transparent platform</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal for Pending Verification item */}
      {activeReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">
                    Verification Review
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeReviewItem.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveReviewItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewActionDone ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold text-center">
                {reviewActionDone}
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Applicant:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeReviewItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Submission Date:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{activeReviewItem.submittedOn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">AI Integrity Score:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">89% Originality ✓</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeReviewItem.details}
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={handleFlagReview}
                    className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-colors"
                  >
                    Flag as High Risk
                  </button>
                  <button
                    onClick={handleApproveReview}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Approve & Verify
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
