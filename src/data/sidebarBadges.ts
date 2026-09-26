// Computes live, data-driven badge values for the Sidebar of each role.
// Reads the SAME stores & seeds that the underlying views use.

import { UserRole } from '../types';
import { loadStudentSkills, loadCurriculumCatalog, SKILLS_UPDATED_EVENT, CURRICULUM_UPDATED_EVENT } from './skillsStore';
import { loadProjects, PROJECTS_UPDATED_EVENT, checkJobEligibility, computeCompanyAtsScore } from './projectsStore';
import { loadInternships, JOBS_UPDATED_EVENT } from './jobsStore';
import { loadCompanyImprovementPaths, IMPROVEMENT_PATHS_UPDATED_EVENT } from './improvementPathStore';
import { loadStoredResumes, RESUMES_UPDATED_EVENT } from './resumeStore';
import { loadCampusRecruitingCompanies } from './campusRecruitingCompaniesStore';
import { loadDriveRequests, DRIVE_REQUESTS_UPDATED_EVENT } from './driveRequestsStore';
import { loadCollegeApproachRequests, COLLEGE_APPROACH_UPDATED_EVENT } from './collegeApproachStore';
import { loadBatchFeedbackList, loadFeedbackList, FEEDBACK_UPDATED_EVENT, BATCH_FEEDBACK_UPDATED_EVENT } from './feedbackStore';
import { loadLoginSessions, SESSIONS_UPDATED_EVENT } from './sessionTrackingStore';
import { loadApprovalRecords } from './approvalStore';
import { adminStudentsSeed, adminCompaniesSeed, adminUniversitiesSeed } from './adminSeedData';
import { studentApplicationsStore } from './studentApplicationsStore';

export interface SidebarBadge {
  badge: string;
  badgeColor: string;
}

export type SidebarBadgeMap = Record<string, SidebarBadge>;

const verifiedColor = 'bg-emerald-100 text-emerald-800';
const amberColor = 'bg-amber-100 text-amber-800';
const indigoColor = 'bg-indigo-100 text-indigo-800';
const blueColor = 'bg-blue-100 text-blue-800';
const purpleColor = 'bg-purple-100 text-purple-800';
const tealColor = 'bg-teal-100 text-teal-800';
const roseColor = 'bg-rose-100 text-rose-800';
const slateColor = 'bg-slate-100 text-slate-700';

export const SIDEBAR_REFRESH_EVENTS = [
  SKILLS_UPDATED_EVENT,
  CURRICULUM_UPDATED_EVENT,
  PROJECTS_UPDATED_EVENT,
  JOBS_UPDATED_EVENT,
  IMPROVEMENT_PATHS_UPDATED_EVENT,
  RESUMES_UPDATED_EVENT,
  DRIVE_REQUESTS_UPDATED_EVENT,
  COLLEGE_APPROACH_UPDATED_EVENT,
  FEEDBACK_UPDATED_EVENT,
  BATCH_FEEDBACK_UPDATED_EVENT,
  SESSIONS_UPDATED_EVENT,
];

// Subtle but intentional: we mirror the alive check used by InternshipsView so
// badge counts are consistent with what the page itself shows.
const isJobMatching = (job: ReturnType<typeof loadInternships>[number], skills = loadStudentSkills(), projects = loadProjects()): boolean => {
  const ats = computeCompanyAtsScore(job.requiredSkills, skills, projects);
  if (ats.atsScore > 0) return true;
  const eligibility = checkJobEligibility(job, skills, projects);
  return eligibility.isApproved;
};

export const computeSidebarBadges = (role: UserRole): SidebarBadgeMap => {
  const badges: SidebarBadgeMap = {};

  if (role === 'student') {
    const skills = loadStudentSkills();
    const projects = loadProjects();
    const jobs = loadInternships();
    const paths = loadCompanyImprovementPaths();
    const resumes = loadStoredResumes();

    const verifiedCount = skills.filter((s) => s.status === 'verified').length;
    const selfClaimedCount = skills.filter((s) => s.status === 'self-claimed' || s.status === 'unverified').length;

    // Skill gaps = distinct required skills across all jobs that the student does not possess.
    const gapSkillNames = new Set<string>();
    jobs.forEach((job) => {
      job.requiredSkills.forEach((req) => {
        const normReq = req.toLowerCase();
        const known = skills.some((s) => s.name.toLowerCase().includes(normReq) || normReq.includes(s.name.toLowerCase()));
        if (!known) gapSkillNames.add(req);
      });
    });

    // Best ATS across live jobs.
    let bestAts = 0;
    jobs.forEach((job) => {
      bestAts = Math.max(bestAts, computeCompanyAtsScore(job.requiredSkills, skills, projects).atsScore);
    });

    const matchedJobs = jobs.filter((job) => isJobMatching(job, skills, projects)).length;

    badges.skills = {
      badge: `${verifiedCount} Verified${selfClaimedCount > 0 ? ` • ${selfClaimedCount} Self` : ''}`,
      badgeColor: verifiedCount > 0 ? verifiedColor : slateColor,
    };
    badges['skill-gap'] = {
      badge: `${gapSkillNames.size} Gaps`,
      badgeColor: gapSkillNames.size > 0 ? amberColor : verifiedColor,
    };
    badges.projects = {
      badge: `${projects.length} Active`,
      badgeColor: projects.length > 0 ? indigoColor : slateColor,
    };
    badges.resume = {
      badge: bestAts > 0 ? `ATS ${bestAts}%${resumes.length > 0 ? ` • ${resumes.length} Resume` : ''}` : `${resumes.length} Resume`,
      badgeColor: bestAts >= 70 ? verifiedColor : bestAts > 0 ? amberColor : blueColor,
    };
    badges['improvement-path'] = {
      badge: `${paths.length} Track${paths.length === 1 ? '' : 's'}`,
      badgeColor: paths.length > 0 ? purpleColor : slateColor,
    };
    badges.internships = {
      badge: `${matchedJobs} Matched`,
      badgeColor: matchedJobs > 0 ? tealColor : slateColor,
    };
    badges.companies = {
      badge: `${loadCampusRecruitingCompanies().length + new Set(jobs.map((j) => j.company)).size} Companies`,
      badgeColor: indigoColor,
    };
    badges.jobCount = { badge: String(jobs.length), badgeColor: slateColor };
  }

  if (role === 'company') {
    const jobs = loadInternships();
    const requests = loadDriveRequests();
    const feedback = loadBatchFeedbackList().length + loadFeedbackList().length;
    const applied = studentApplicationsStore.getOnCampusApplications().length + studentApplicationsStore.getOffCampusApplications().length;

    badges['post-job'] = {
      badge: `${jobs.length} Live`,
      badgeColor: jobs.length > 0 ? blueColor : slateColor,
    };
    badges.applied = {
      badge: `${applied} Applied`,
      badgeColor: applied > 0 ? indigoColor : slateColor,
    };
    badges.requests = {
      badge: `${requests.length} Drives`,
      badgeColor: requests.length > 0 ? amberColor : slateColor,
    };
    badges.feedback = {
      badge: `${feedback} Reviews`,
      badgeColor: feedback > 0 ? purpleColor : slateColor,
    };
  }

  if (role === 'institution') {
    const curriculum = loadCurriculumCatalog();
    const drives = loadDriveRequests();
    const approaches = loadCollegeApproachRequests();
    const selected = studentApplicationsStore.getSelectedStudents().length;
    const feedback = loadFeedbackList().length;

    const universitiesWithGaps = adminUniversitiesSeed.filter(
      (u) => (u.primaryGaps?.length || 0) > 0 && u.status !== 'Delisted'
    ).length;
    const totalStudents = adminUniversitiesSeed.filter((u) => u.status !== 'Delisted').reduce((sum, u) => sum + (u.studentsCount || 0), 0);
    const totalCompanies = adminCompaniesSeed.filter((c) => c.status === 'Active').length;

    badges.skills = {
      badge: `${curriculum.length} Skills`,
      badgeColor: curriculum.length > 0 ? indigoColor : slateColor,
    };
    badges['curriculum-gaps'] = {
      badge: `${universitiesWithGaps} Depts`,
      badgeColor: universitiesWithGaps > 0 ? amberColor : slateColor,
    };
    badges.students = {
      badge: `${totalStudents.toLocaleString('en-IN')} Total`,
      badgeColor: totalStudents > 0 ? tealColor : slateColor,
    };
    badges.companies = {
      badge: `${totalCompanies} Partners`,
      badgeColor: totalCompanies > 0 ? blueColor : slateColor,
    };
    badges['applied-selected'] = {
      badge: `${selected} Selected`,
      badgeColor: selected > 0 ? emeraldColor() : slateColor,
    };
    badges.requests = {
      badge: `${approaches.length + drives.length} Review`,
      badgeColor: approaches.length + drives.length > 0 ? amberColor : slateColor,
    };
    badges.feedback = {
      badge: `${feedback} Insights`,
      badgeColor: feedback > 0 ? indigoColor : slateColor,
    };
  }

  if (role === 'admin') {
    const approvals = loadApprovalRecords();

    const flagged = adminStudentsSeed.filter(
      (s) => s.riskStatus === 'suspicious' || s.riskStatus === 'delisted'
    ).length;
    const pendingUniversities = adminUniversitiesSeed.filter((u) => u.status === 'Pending Approval').length;
    const pendingApprovals = approvals.filter((a) => a.status === 'pending_approval').length;
    const liveJobs = adminCompaniesSeed.reduce((sum, c) => sum + (c.activeJobs || 0), 0);
    const sessions = loadLoginSessions();

    badges['all-students'] = {
      badge: adminStudentsSeed.length.toLocaleString('en-IN'),
      badgeColor: slateColor,
    };
    badges['suspicious-profiles'] = {
      badge: `${flagged} Flagged`,
      badgeColor: flagged > 0 ? roseColor : verifiedColor,
    };
    badges['all-universities'] = {
      badge: adminUniversitiesSeed.length.toLocaleString('en-IN'),
      badgeColor: slateColor,
    };
    badges['university-approval'] = {
      badge: `${pendingUniversities + pendingApprovals} Pending`,
      badgeColor: pendingUniversities + pendingApprovals > 0 ? amberColor : verifiedColor,
    };
    badges['all-companies'] = {
      badge: adminCompaniesSeed.length.toLocaleString('en-IN'),
      badgeColor: slateColor,
    };
    badges['internships-jobs'] = {
      badge: `${liveJobs} Direct Live`,
      badgeColor: emeraldColor(),
    };
    badges['session-tracker'] = {
      badge: `${sessions.length} Logs`,
      badgeColor: sessions.length > 0 ? indigoColor : slateColor,
    };
  }

  return badges;
};

function emeraldColor() {
  return 'bg-emerald-100 text-emerald-800';
}