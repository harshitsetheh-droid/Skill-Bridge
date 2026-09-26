/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { recordLogin } from './data/dailyQuizStore';
import { TopRoleBar } from './components/common/TopRoleBar';
import { Sidebar } from './components/common/Sidebar';
import { AuthFlow } from './components/auth/AuthFlow';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { DailyQuestionsView } from './components/student/DailyQuestionsView';
import { MySkillsView } from './components/student/MySkillsView';
import { SkillGapView } from './components/student/SkillGapView';
import { ProjectsView } from './components/student/ProjectsView';
import { ResumeAnalyzerView } from './components/student/ResumeAnalyzerView';
import { ImprovementPathView } from './components/student/ImprovementPathView';
import { InternshipsView } from './components/student/InternshipsView';
import { StudentCompaniesView } from './components/student/StudentCompaniesView';
import { StudentProfileSettings } from './components/student/StudentProfileSettings';

// Company Views
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { CompanyProfileView } from './components/company/CompanyProfileView';
import { PostJobView } from './components/company/PostJobView';
import { CompanyAnalyticsView } from './components/company/CompanyAnalyticsView';
import { CompanySettingsView } from './components/company/CompanySettingsView';
import { CompanyRequestsView } from './components/company/CompanyRequestsView';
import { CompanyFeedbackView } from './components/company/CompanyFeedbackView';
import { CompanyAppliedView } from './components/company/CompanyAppliedView';

// Institution Views
import { InstitutionOverview } from './components/institution/InstitutionOverview';
import { CurriculumGapsView } from './components/institution/CurriculumGapsView';
import { StudentReadinessView } from './components/institution/StudentReadinessView';
import { ProjectIntegrityView } from './components/institution/ProjectIntegrityView';
import { CompanyEngagementView } from './components/institution/CompanyEngagementView';
import { InstitutionReportsView } from './components/institution/InstitutionReportsView';
import { CollegeRequestsView } from './components/institution/CollegeRequestsView';
import { CollegeFeedbackView } from './components/institution/CollegeFeedbackView';
import { CollegeSkillsManagementView } from './components/institution/CollegeSkillsManagementView';
import { AppliedSelectedView } from './components/institution/AppliedSelectedView';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStudentsView } from './components/admin/AdminStudentsView';
import { AdminUniversitiesView } from './components/admin/AdminUniversitiesView';
import { AdminCompaniesView } from './components/admin/AdminCompaniesView';
import { AdminFraudRiskView } from './components/admin/AdminFraudRiskView';
import { AdminLoginTrackingView } from './components/admin/AdminLoginTrackingView';

// One-time migration: clears previously seeded demo data so the app starts empty.
// User data saved after this version flag is preserved.
const MIGRATION_FLAG = 'skillbridge_migrated_v2_empty';
function clearLegacySeedData() {
  try {
    if (localStorage.getItem(MIGRATION_FLAG)) return;
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('skillbridge_') || key.startsWith('sb_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem(MIGRATION_FLAG, 'yes');
  } catch {
    // ignore storage errors
  }
}
clearLegacySeedData();

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Dark Mode state with persistence and system preference fallback
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('skillbridge_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('skillbridge_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('skillbridge_theme', 'light');
      }
    } catch (e) {
      console.error('Failed to update dark mode class', e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Record daily login — streak only survives if the student logs in every single day.
  useEffect(() => {
    recordLogin();
  }, []);

  // Selected candidate to deep link into CandidateDetailModal if requested
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  // Selected improvement path to deep link into ImprovementPathView
  const [selectedImprovementPathId, setSelectedImprovementPathId] = useState<string | null>(null);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Reset to default dashboard for the selected role
    if (newRole === 'student') setActiveTab('dashboard');
    else if (newRole === 'company') setActiveTab('dashboard');
    else if (newRole === 'institution') setActiveTab('overview');
    else if (newRole === 'admin') setActiveTab('dashboard');
  };

  const handleNavigateTab = (tab: string, roleOrMeta?: UserRole | string) => {
    if (roleOrMeta && ['student', 'company', 'institution', 'admin'].includes(roleOrMeta)) {
      setCurrentRole(roleOrMeta as UserRole);
    } else if (typeof roleOrMeta === 'string' && (tab === 'improvement-path' || tab === 'roadmap')) {
      setSelectedImprovementPathId(roleOrMeta);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setActiveTab('applied');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE] dark:bg-[#111827] text-[#344A63] dark:text-[#D4DCE8] flex flex-col font-sans antialiased selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Top Universal App & Role Bar with Dark Mode Toggle & Notification Bell */}
      <TopRoleBar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onNavigateTab={handleNavigateTab}
      />

      {/* Main Container: Flex layout with dedicated Sidebar column and Main content column */}
      <div className="flex-1 flex w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative">
        {/* Responsive Sidebar (Fixed column on desktop, overlay drawer on mobile, ZERO overlap) */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onSelectTab={handleNavigateTab}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
          onRoleChange={handleRoleChange}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Dynamic Screen Content Area */}
        <main className="flex-1 min-w-0 pb-16 md:pb-6">
          {/* ==================== STUDENT ROLE SCREENS ==================== */}
          {currentRole === 'student' && (
            <>
              {activeTab === 'dashboard' && (
                <StudentDashboard onNavigateTab={handleNavigateTab} />
              )}
              {activeTab === 'daily-questions' && <DailyQuestionsView />}
              {activeTab === 'skills' && <MySkillsView />}
              {(activeTab === 'skill-gap' || activeTab === 'gaps') && (
                <SkillGapView onNavigateTab={handleNavigateTab} />
              )}
              {activeTab === 'projects' && <ProjectsView />}
              {activeTab === 'resume' && <ResumeAnalyzerView />}
              {(activeTab === 'improvement-path' || activeTab === 'roadmap') && (
                <ImprovementPathView 
                  onNavigateTab={handleNavigateTab} 
                  initialPathId={selectedImprovementPathId}
                />
              )}
              {activeTab === 'internships' && <InternshipsView onNavigateTab={handleNavigateTab} />}
              {activeTab === 'companies' && <StudentCompaniesView onNavigateTab={handleNavigateTab} />}
              {(activeTab === 'profile-settings' || activeTab === 'profile') && <StudentProfileSettings />}

              {/* Fallback for Student if an unknown tab is set */}
              {![
                'dashboard',
                'daily-questions',
                'skills',
                'skill-gap',
                'gaps',
                'projects',
                'resume',
                'improvement-path',
                'roadmap',
                'internships',
                'companies',
                'profile-settings',
                'profile'
              ].includes(activeTab) && (
                <StudentDashboard onNavigateTab={handleNavigateTab} />
              )}
            </>
          )}

          {/* ==================== COMPANY ROLE SCREENS ==================== */}
          {currentRole === 'company' && (
            <>
              {activeTab === 'dashboard' && (
                <CompanyDashboard
                  onNavigateTab={handleNavigateTab}
                  onViewCandidate={handleViewCandidate}
                />
              )}
              {activeTab === 'profile' && <CompanyProfileView />}
              {activeTab === 'post-job' && <PostJobView />}
              {(activeTab === 'applied' || activeTab === 'candidates') && <CompanyAppliedView />}
              {activeTab === 'requests' && (
                <CompanyRequestsView onNavigateToPostJob={() => handleNavigateTab('post-job')} />
              )}
              {activeTab === 'feedback' && <CompanyFeedbackView />}
              {activeTab === 'analytics' && <CompanyAnalyticsView />}
              {activeTab === 'settings' && <CompanySettingsView />}

              {/* Fallback for Company */}
              {!['dashboard', 'profile', 'post-job', 'applied', 'requests', 'feedback', 'analytics', 'settings'].includes(activeTab) && (
                <CompanyDashboard
                  onNavigateTab={handleNavigateTab}
                  onViewCandidate={handleViewCandidate}
                />
              )}
            </>
          )}

          {/* ==================== INSTITUTION (TPO) ROLE SCREENS ==================== */}
          {currentRole === 'institution' && (
            <>
              {(activeTab === 'overview' || activeTab === 'dashboard') && (
                <InstitutionOverview onNavigateTab={handleNavigateTab} />
              )}
              {activeTab === 'skills' && <CollegeSkillsManagementView />}
              {activeTab === 'curriculum-gaps' && <CurriculumGapsView />}
              {activeTab === 'students' && <StudentReadinessView />}
              {activeTab === 'companies' && <CompanyEngagementView />}
              {activeTab === 'applied-selected' && <AppliedSelectedView />}
              {activeTab === 'requests' && <CollegeRequestsView />}
              {activeTab === 'feedback' && <CollegeFeedbackView onNavigateTab={handleNavigateTab} />}
              {(activeTab === 'project-integrity' || activeTab === 'integrity') && <ProjectIntegrityView />}
              {activeTab === 'reports' && <InstitutionReportsView />}

              {/* Fallback for Institution */}
              {![
                'overview',
                'dashboard',
                'skills',
                'curriculum-gaps',
                'students',
                'companies',
                'applied-selected',
                'requests',
                'feedback',
                'project-integrity',
                'integrity',
                'reports'
              ].includes(activeTab) && (
                <InstitutionOverview onNavigateTab={handleNavigateTab} />
              )}
            </>
          )}

          {/* ==================== ADMIN ROLE SCREENS ==================== */}
          {currentRole === 'admin' && (
            <>
              {activeTab === 'dashboard' && (
                <AdminDashboard onNavigateTab={handleNavigateTab} />
              )}
              {(activeTab === 'all-students' ||
                activeTab === 'student-verification' ||
                activeTab === 'suspicious-profiles' ||
                activeTab === 'resume-issues' ||
                activeTab === 'skill-verification' ||
                activeTab === 'risk-alerts') && (
                <AdminStudentsView 
                  key={activeTab} 
                  subTab={activeTab as any} 
                  onNavigateTab={handleNavigateTab} 
                />
              )}
              {(activeTab === 'all-universities' ||
                activeTab === 'university-approval' ||
                activeTab === 'skill-gap-overview') && (
                <AdminUniversitiesView 
                  key={activeTab} 
                  subTab={activeTab as any} 
                  onNavigateTab={handleNavigateTab} 
                />
              )}
              {(activeTab === 'all-companies' ||
                activeTab === 'internships-jobs' ||
                activeTab === 'applications-overview') && (
                <AdminCompaniesView 
                  key={activeTab} 
                  subTab={activeTab as any} 
                  onNavigateTab={handleNavigateTab} 
                />
              )}
              {activeTab === 'session-tracker' && (
                <AdminLoginTrackingView />
              )}

              {/* Fallback for Admin */}
              {![
                'dashboard',
                'all-students',
                'student-verification',
                'suspicious-profiles',
                'all-universities',
                'university-approval',
                'skill-gap-overview',
                'all-companies',
                'internships-jobs',
                'applications-overview',
                'resume-issues',
                'skill-verification',
                'risk-alerts',
                'session-tracker',
              ].includes(activeTab) && (
                <AdminDashboard onNavigateTab={handleNavigateTab} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Auth Modal Flow (Role selection, login, signup, welcome) */}
      {isAuthOpen && (
        <AuthFlow
          currentRole={currentRole}
          onClose={() => setIsAuthOpen(false)}
          onRoleSelect={(role) => {
            handleRoleChange(role);
            setIsAuthOpen(false);
          }}
        />
      )}
    </div>
  );
}
