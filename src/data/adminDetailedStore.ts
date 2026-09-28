// ============================================================================
// DETAILED STUDENT TYPES
// ============================================================================

export interface StudentDetailedProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  originalityScore: number;
  liveDemo?: string;
  githubRepo: string;
  codeDefenseStatus: 'Verified (AST Integrity 95%+)' | 'Passed' | 'Under Audit';
  verifiedDate: string;
}

export interface StudentDetailedSkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advance' | 'Expert';
  score: number;
  verified: boolean;
  verifiedBy: string;
}

export interface StudentActiveApplication {
  id: string;
  company: string;
  companyLogo: string;
  role: string;
  appliedDate: string;
  currentStage: string;
  nextRoundDate: string;
  expectedCtc: string;
  driveType: 'On-Campus Drive' | 'Off-Campus Pool';
}

export interface StudentSelectedOffer {
  id: string;
  company: string;
  companyLogo: string;
  role: string;
  packageOffered: string;
  offerDate: string;
  joiningDate: string;
  location: string;
  status: 'Accepted' | 'Declined' | 'Offer Under Consideration';
  driveType: 'On-Campus Drive' | 'Direct Fast-Track';
}

export interface StudentRejectedApplication {
  id: string;
  company: string;
  companyLogo: string;
  role: string;
  appliedDate: string;
  rejectedStage: string;
  rejectionReason: string;
  rejectionDate: string;
  driveType: 'On-Campus Drive' | 'Off-Campus Screening';
}

export interface StudentAdminDetail {
  id: string;
  name: string;
  rollNo: string;
  college: string;
  branch: string;
  degree: string;
  yearOfStudy: string;
  currentSemester: string;
  cgpa: string;
  email: string;
  mobileNo: string;
  alternatePhone?: string;
  location: string;
  avatar: string;

  links: {
    github: string;
    linkedin: string;
    portfolio?: string;
    leetcode?: string;
    codeforces?: string;
    resumePdf?: string;
  };

  placementStatus: 'Offer Accepted' | 'Multiple Offers' | 'In Active Interviews' | 'Open to Placement';
  activeApplications: StudentActiveApplication[];
  selectedOffers: StudentSelectedOffer[];
  rejectedApplications: StudentRejectedApplication[];

  projects: StudentDetailedProject[];
  skillsList: StudentDetailedSkill[];

  originalityScore: number;
  resumeAtsScore: number;
  codeDefensePassed: number;
  codeDefenseTotal: number;
  riskStatus: 'clean' | 'suspicious' | 'delisted';
  isDelisted: boolean;
  delistReason?: string;
  flagReason?: string;
  riskType?: string;
}

// ============================================================================
// DETAILED COLLEGE / TPO TYPES
// ============================================================================

export interface VisitingCompanyHistoryRecord {
  id: string;
  year: string;
  companyName: string;
  companyLogo: string;
  visitStartDate: string;
  visitEndDate: string;
  driveDays: number;
  rolesOffered: string[];
  packageHighest: string;
  packageMedian: string;
  candidatesApplied: number;
  candidatesSelected: number;
  candidatesRejected: number;
  driveStatus: 'Completed' | 'Ongoing' | 'Scheduled';
}

export interface CompanyFeedbackToCollege {
  id: string;
  companyName: string;
  companyLogo: string;
  date: string;
  driveRole: string;
  overallRating: number;
  strengths: string[];
  gapsIdentified: string[];
  feedbackText: string;
  recommendationForTpo: string;
}

export interface CurriculumRevisionRecord {
  id: string;
  revisionVersion: string;
  date: string;
  academicYear: string;
  department: string;
  title: string;
  summaryOfChanges: string;
  newCoursesAdded: string[];
  legacyCoursesRemoved: string[];
  approvedBy: string;
}

export interface CollegeBranchStudentSummary {
  id: string;
  rollNo: string;
  name: string;
  branch: string;
  year: string;
  cgpa: string;
  email: string;
  mobile: string;
  placementStatus: 'Placed' | 'In Process' | 'Seeking';
  placedCompany?: string;
  package?: string;
}

export interface CollegeToCompanyRequest {
  id: string;
  companyName: string;
  companyLogo: string;
  requestDate: string;
  proposedDates: string;
  jobRolesInvited: string[];
  minBatch: string;
  status: 'Accepted' | 'Declined' | 'Under Review';
  companyReplyDate: string;
  companyReplyMessage: string;
}

export interface CompanyToCollegeRequest {
  id: string;
  companyName: string;
  companyLogo: string;
  requestDate: string;
  proposedDriveDates: string;
  jobRole: string;
  proposedCtc: string;
  status: 'Slot Confirmed' | 'Counter-Proposed' | 'Declined' | 'Pending Review';
  tpoReplyDate: string;
  tpoReplyRemarks: string;
}

export interface OngoingCollegeDrive {
  id: string;
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  dayProgress: string;
  currentRound: string;
  candidatesRemaining: number;
  venue: string;
}

export interface CollegeAdminDetail {
  id: string;
  name: string;
  tpoHead: string;
  email: string;
  mobileNo: string;
  officePhone: string;
  state: string;
  city: string;
  nirfRank: number;
  accreditation: string;
  establishedYear: number;
  totalStudents: number;
  status: 'Active' | 'Pending Approval' | 'Delisted';
  delistReason?: string;

  ongoingDrives: OngoingCollegeDrive[];

  visitingCompaniesHistory: VisitingCompanyHistoryRecord[];

  companyFeedbacks: CompanyFeedbackToCollege[];

  curriculumRevisions: CurriculumRevisionRecord[];

  branchWiseStudents: Record<string, CollegeBranchStudentSummary[]>;

  collegeToCompanyRequests: CollegeToCompanyRequest[];
  companyToCollegeRequests: CompanyToCollegeRequest[];
}

// ============================================================================
// DETAILED COMPANY TYPES
// ============================================================================

export interface CompanySelectedStudentEntry {
  id: string;
  studentName: string;
  rollNo: string;
  college: string;
  branch: string;
  postRole: string;
  selectionDate: string;
  packageLpa: string;
  hiringType: 'On-Campus Drive' | 'Off-Campus Pool';
}

export interface CompanyDriveHistoryItem {
  id: string;
  collegeName: string;
  collegeId: string;
  startDate: string;
  endDate: string;
  driveDays: number;
  roleHired: string;
  packageLpa: string;
  stipendDuringInternship?: string;
  candidatesAppeared: number;
  candidatesSelected: number;
  candidatesRejected: number;
  selectedStudents: CompanySelectedStudentEntry[];
}

export interface CompanyOngoingDriveTracker {
  id: string;
  collegeName: string;
  role: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  currentDay: number;
  currentRound: string;
  candidatesRemaining: number;
  totalInitialApplicants: number;
}

export interface CompanyFeedbackSent {
  id: string;
  collegeName: string;
  feedbackDate: string;
  driveRole: string;
  rating: number;
  feedbackPoints: string[];
  strengthsObserved: string;
  areasToImprove: string;
}

export interface CompanyCollegeOutreachLog {
  id: string;
  collegeName: string;
  requestDate: string;
  proposedDates: string;
  role: string;
  packageCtc: string;
  collegeResponse: 'Accepted' | 'Rejected' | 'Rescheduled' | 'Under Review';
  responseDate: string;
  responseRemarks: string;
}

export interface CollegeToCompanyProposalLog {
  id: string;
  collegeName: string;
  invitationDate: string;
  proposedSlot: string;
  expectedBatchSize: number;
  companyDecision: 'Accepted' | 'Declined' | 'Under Review';
  replyDate: string;
  decisionNotes: string;
}

export interface CompanyOffCampusPost {
  id: string;
  title: string;
  postedDate: string;
  status: 'Active (Direct Live)' | 'Closed';
  applicationsCount: number;
  hiredCount: number;
  ctc: string;
  location: string;
  skillsRequired: string[];
}

export interface CompanyOffCampusRecruit {
  id: string;
  studentName: string;
  email: string;
  college: string;
  role: string;
  hiredDate: string;
  ctc: string;
  recruitmentSource: 'SkillBridge AST Verified Pool' | 'Direct Portal Submission' | 'National Hackathon Winner';
  interviewScore: number;
}

export interface CompanyAdminDetail {
  id: string;
  name: string;
  logo: string;
  industry: string;
  headquarters: string;
  email: string;
  phone: string;
  registeredDate: string;
  website: string;
  status: 'Active' | 'Pending Approval' | 'Delisted';
  delistReason?: string;

  totalDrivesConducted: number;
  totalStudentsSelected: number;
  totalOffCampusPostsCount: number;
  collegesAcceptedCount: number;
  collegesRejectedCount: number;

  ongoingDrives: CompanyOngoingDriveTracker[];

  campusDrivesHistory: CompanyDriveHistoryItem[];

  feedbacksGivenToColleges: CompanyFeedbackSent[];

  companyToCollegeOutreach: CompanyCollegeOutreachLog[];
  collegeToCompanyProposals: CollegeToCompanyProposalLog[];

  offCampusPostings: CompanyOffCampusPost[];
  offCampusRecruits: CompanyOffCampusRecruit[];
}

// ============================================================================
// DETAILED STORE (derived realistic detail data)
// ============================================================================

import {
  adminStudentsSeed,
  adminCompaniesSeed,
  adminUniversitiesSeed,
  CompanyListing,
  UniversityRecord,
  StudentRecord,
} from './adminSeedData';
import { campusRecruitingCompaniesData } from './campusRecruitingCompaniesStore';

const findStudent = (idOrName: string): StudentRecord | undefined => {
  return adminStudentsSeed.find(
    (s) => s.id.toLowerCase() === idOrName.toLowerCase() || s.name.toLowerCase() === idOrName.toLowerCase()
  );
};

const findCompany = (idOrName: string): CompanyListing | undefined => {
  return adminCompaniesSeed.find(
    (c) => c.id.toLowerCase() === idOrName.toLowerCase() || c.name.toLowerCase() === idOrName.toLowerCase()
  );
};

const findUniversity = (idOrName: string): UniversityRecord | undefined => {
  return adminUniversitiesSeed.find(
    (u) => u.id.toLowerCase() === idOrName.toLowerCase() || u.name.toLowerCase() === idOrName.toLowerCase()
  );
};

const companyMetaOf = (name: string): { logo: string; industry: string; location: string } => {
  const rec = campusRecruitingCompaniesData.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (rec) {
    return { logo: rec.logo, industry: rec.industry, location: rec.driveVenue || rec.website || '-' };
  }
  const listing = adminCompaniesSeed.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (listing) return { logo: listing.name.slice(0, 2).toUpperCase(), industry: listing.industry, location: listing.location };
  return { logo: name.slice(0, 2).toUpperCase(), industry: 'Technology', location: 'India' };
};

const studentDetailFor = (s: StudentRecord): StudentAdminDetail => {
  const baseSkills: StudentDetailedSkill[] = (s.skillsList || []).map((sk, idx) => ({
    name: sk,
    proficiency: idx < 4 ? 'Expert' : idx < 7 ? 'Advance' : 'Intermediate',
    score: Math.max(65, Math.min(98, 98 - idx * 7)),
    verified: true,
    verifiedBy: idx % 3 === 0 ? 'AI Logic Q&A Defense' : 'Institutional Codespace Auditor',
  }));

  const projects: StudentDetailedProject[] = [
    {
      id: `${s.id}-p1`,
      title: s.githubRepo ? s.githubRepo.split('/').pop()?.replace(/-/g, ' ') || 'Cloud Cache Proxy' : 'Distributed Systems Capstone',
      description: `Production-grade full-stack build with ${Math.max(2, s.skillsList?.length || 3)} verified skills applied. AST integrity audit passed with ${s.originalityScore}% originality.`,
      techStack: s.skillsList?.slice(0, 5) || ['React', 'Node.js'],
      originalityScore: s.originalityScore,
      githubRepo: `https://${s.githubRepo || `github.com/${s.name.toLowerCase().replace(/\s+/g, '')}/capstone`}`,
      liveDemo: `https://${s.githubRepo?.split('/')[1] || 'demo'}.vercel.app`,
      codeDefenseStatus: s.originalityScore >= 80 ? 'Verified (AST Integrity 95%+)' : s.codeDefensePassed > 0 ? 'Passed' : 'Under Audit',
      verifiedDate: 'Aug 2026',
    },
    {
      id: `${s.id}-p2`,
      title: 'Backend API Service',
      description: 'High-load REST service with caching, rate limiting and observability. Passed 2 rounds of code defense.',
      techStack: s.skillsList?.slice(3, 8) || ['Node.js', 'Redis'],
      originalityScore: Math.max(60, s.originalityScore - 12),
      githubRepo: `https://${s.githubRepo || `github.com/${s.name.toLowerCase().replace(/\s+/g, '')}/backend-service`}`,
      codeDefenseStatus: s.codeDefensePassed >= 4 ? 'Verified (AST Integrity 95%+)' : 'Passed',
      verifiedDate: 'Jul 2026',
    },
  ];

  const resumeSkills = (s.skillsList || []).slice(0, 3);
  return {
    id: s.id,
    name: s.name,
    rollNo: `${s.id.replace('STU', '')}-${s.name.slice(0, 3).toUpperCase()}${s.cgpa.replace('.', '')}`,
    college: s.college,
    branch: s.degree.split(' ')[1] || 'CSE',
    degree: s.degree,
    yearOfStudy: s.degree.includes('2025') ? 'Final Year' : 'Pre-Final Year',
    currentSemester: s.degree.includes('2025') ? 'Sem 8' : 'Sem 6',
    cgpa: s.cgpa,
    email: s.email,
    mobileNo: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
    location: 'Jodhpur, Rajasthan',
    avatar: s.avatar,

    links: {
      github: `https://${s.githubRepo || 'github.com/' + s.email.split('@')[0]}`,
      linkedin: `https://linkedin.com/in/${s.name.toLowerCase().replace(/\s+/g, '-')}`,
      portfolio: `https://${s.name.toLowerCase().replace(/\s+/g, '-')}.vercel.app`,
      leetcode: `https://leetcode.com/${s.email.split('@')[0]}`,
      codeforces: `https://codeforces.com/profile/${s.email.split('@')[0]}`,
      resumePdf: `${s.name.replace(/\s+/g, '_')}_Resume.pdf`,
    },

    placementStatus: s.originalityScore >= 85 ? 'Offer Accepted' : s.codeDefensePassed >= 3 ? 'In Active Interviews' : 'Open to Placement',
    activeApplications: [
      {
        id: `${s.id}-app1`,
        company: 'TechNova Solutions',
        companyLogo: 'TN',
        role: 'Frontend Developer Intern',
        appliedDate: 'Sep 18, 2026',
        currentStage: 'Technical Interview (Round 2)',
        nextRoundDate: 'Oct 5, 2026',
        expectedCtc: '₹12.0 LPA',
        driveType: 'Off-Campus Pool',
      },
      {
        id: `${s.id}-app2`,
        company: 'InnovateStack',
        companyLogo: 'IV',
        role: 'Software Engineer Intern (PPO Track)',
        appliedDate: 'Sep 20, 2026',
        currentStage: 'Shortlisted – Drive Round 1',
        nextRoundDate: 'Nov 2, 2026',
        expectedCtc: '₹9.8 LPA',
        driveType: 'On-Campus Drive',
      },
    ],
    selectedOffers:
      s.originalityScore >= 85
        ? [
            {
              id: `${s.id}-off1`,
              company: 'CloudMatrix',
              companyLogo: 'CM',
              role: 'Backend Engineer Intern',
              packageOffered: '₹18.0 LPA',
              offerDate: 'Sep 25, 2026',
              joiningDate: 'Jun 2027',
              location: 'Bengaluru',
              status: 'Offer Under Consideration',
              driveType: 'Direct Fast-Track',
            },
          ]
        : [],
    rejectedApplications: [
      {
        id: `${s.id}-rej1`,
        company: 'DataHub Solutions',
        companyLogo: 'DH',
        role: 'Data Analyst Intern',
        appliedDate: 'Jul 12, 2026',
        rejectedStage: 'Online Assessment',
        rejectionReason: 'SQL window functions section score below cutoff.',
        rejectionDate: 'Jul 19, 2026',
        driveType: 'Off-Campus Screening',
      },
    ],

    projects,
    skillsList: baseSkills,

    originalityScore: s.originalityScore,
    resumeAtsScore: s.resumeAtsScore,
    codeDefensePassed: s.codeDefensePassed,
    codeDefenseTotal: s.codeDefenseTotal,
    riskStatus: s.riskStatus,
    isDelisted: s.isDelisted,
    delistReason: s.delistReason,
    flagReason: s.flagReason,
    riskType: s.riskType,
  };
};

const collegeDetailFor = (u: UniversityRecord): CollegeAdminDetail => {
  const year = '2026';
  const collegeRecs = campusRecruitingCompaniesData;

  const visitingCompaniesHistory: VisitingCompanyHistoryRecord[] = collegeRecs.slice(0, 5).map((c, idx) => ({
    id: `${u.id}-visit${idx + 1}`,
    year,
    companyName: c.name,
    companyLogo: c.logo,
    visitStartDate: idx === 0 ? 'Nov 2, 2026' : idx === 1 ? 'Sep 12, 2026' : `${idx + 1} ${['Mar', 'Aug', 'Jan'][idx - 1] || 'Feb'}, 202${idx === 4 ? 5 : 6}`,
    visitEndDate: idx === 0 ? 'Nov 5, 2026' : idx === 1 ? 'Sep 14, 2026' : `${idx + 1} ${['Mar', 'Aug', 'Jan'][idx - 1] || 'Feb'}, 202${idx === 4 ? 5 : 6}`,
    driveDays: 3,
    rolesOffered: c.pastTargetedRoles,
    packageHighest: c.highestLpa,
    packageMedian: c.medianPackage,
    candidatesApplied: 140 - idx * 12,
    candidatesSelected: 22 - idx * 3,
    candidatesRejected: 110 - idx * 9,
    driveStatus: idx === 0 ? 'Scheduled' : idx === 1 ? 'Ongoing' : 'Completed',
  }));

  const companyFeedbacks: CompanyFeedbackToCollege[] = collegeRecs.slice(0, 3).map((c, idx) => ({
    id: `${u.id}-fb${idx + 1}`,
    companyName: c.name,
    companyLogo: c.logo,
    date: `${idx + 1} ${['Apr', 'Mar', 'Nov'][idx]} 2026`,
    driveRole: c.pastTargetedRoles[0] || 'Software Engineer Intern',
    overallRating: 4 + (idx === 2 ? 0 : idx === 1 ? -1 : 0),
    strengths: ['Strong fundamentals in DS/Algo', 'Good communication during interviews', 'Keen problem-solving attitude'],
    gapsIdentified:
      idx === 2
        ? ['Weaker cloud/DevOps exposure', 'Fewer production real-world projects']
        : ['Limited experience with (AI/ML) tools', 'Interviews revealed scope for cleaner architecture'],
    feedbackText: 'Overall good batch. Students performed well in coding rounds; exposure to modern tooling could be improved.',
    recommendationForTpo: 'Introduce mandatory project semester on real-world tech stacks and industry-standard tooling.',
  }));

  const curriculumRevisions: CurriculumRevisionRecord[] = [
    {
      id: `${u.id}-cr1`,
      revisionVersion: 'R4.2',
      date: 'Jun 2026',
      academicYear: '2026-27',
      department: 'CSE',
      title: 'Modern Backend Engineering Track',
      summaryOfChanges: 'Replaced legacy Java-only backend course with Node.js + PostgreSQL + Docker lab modules and a credit-based capstone.',
      newCoursesAdded: ['Modern Backend Engineering', 'Cloud & DevOps Fundamentals', 'System Design Studio'],
      legacyCoursesRemoved: ['Legacy COBOL Lab', 'Outdated .NET Desktop Dev'],
      approvedBy: 'Academic Council – 42nd Meeting',
    },
    {
      id: `${u.id}-cr2`,
      revisionVersion: 'R4.1',
      date: 'Jan 2026',
      academicYear: '2025-26',
      department: 'AI & DS',
      title: 'ML Productionization Elective',
      summaryOfChanges: 'Introduced end-to-end ML deployment pipeline course with MLOps focus, replacing standalone notebook-based labs.',
      newCoursesAdded: ['MLOps & Model Deployment', 'Large Language Model Applications'],
      legacyCoursesRemoved: ['Classic Data Warehouse Theory'],
      approvedBy: 'Board of Studies – CSE',
    },
  ];

  const branches = ['CSE', 'IT', 'ECE', 'AI & DS'];
  const branchWiseStudents: Record<string, CollegeBranchStudentSummary[]> = {};
  const allStudents = adminStudentsSeed;
  branches.forEach((branch, bi) => {
    const pool = allStudents.slice(bi * 2, bi * 2 + 2);
    branchWiseStudents[branch] = pool.map((s, si) => ({
      id: `${u.id}-stu-${bi}-${si}`,
      rollNo: `${Math.floor(1000 + Math.random() * 8999)}BCSE${bi}${si}`,
      name: s.name,
      branch,
      year: '2026',
      cgpa: s.cgpa,
      email: s.email,
      mobile: `+91 95${Math.floor(10000000 + Math.random() * 89999999)}`,
      placementStatus: s.originalityScore >= 85 ? 'Placed' : s.codeDefensePassed >= 3 ? 'In Process' : 'Seeking',
      placedCompany: s.originalityScore >= 85 ? 'TechNova Solutions' : undefined,
      package: s.originalityScore >= 85 ? '₹12.0 LPA' : undefined,
    }));
  });

  const collegeToCompanyRequests: CollegeToCompanyRequest[] = collegeRecs.slice(0, 3).map((c, idx) => ({
    id: `${u.id}-req${idx + 1}`,
    companyName: c.name,
    companyLogo: c.logo,
    requestDate: `${idx + 1} ${['Sep', 'Aug', 'Jul'][idx]} 2026`,
    proposedDates: idx === 0 ? 'Nov 2 - Nov 5, 2026' : idx === 1 ? 'Nov 26 - Nov 27, 2026' : 'Dec 10, 2026',
    jobRolesInvited: c.pastTargetedRoles,
    minBatch: '2026 Batch (B.Tech CSE, IT, ECE, AI&DS)',
    status: idx === 2 ? 'Declined' : idx === 1 ? 'Under Review' : 'Accepted',
    companyReplyDate: idx === 2 ? 'Jul 5, 2026' : idx === 1 ? '-' : 'Sep 25, 2026',
    companyReplyMessage:
      idx === 2
        ? 'Drive date conflicts with our internal release cycle; propose rescheduling to Jan 2027.'
        : 'Confirmed. TPO to share eligible student roster by Oct 20.',
  }));

  const companyToCollegeRequests: CompanyToCollegeRequest[] = collegeRecs.slice(0, 2).map((c, idx) => ({
    id: `${u.id}-c2c${idx + 1}`,
    companyName: c.name,
    companyLogo: c.logo,
    requestDate: `${idx + 1} ${['Sep', 'Aug'][idx]} 2026`,
    proposedDriveDates: idx === 0 ? 'Nov 10 - Nov 11, 2026' : 'Nov 16 - Nov 17, 2026',
    jobRole: c.pastTargetedRoles[0] || 'SDE Intern',
    proposedCtc: c.highestLpa,
    status: 'Slot Confirmed',
    tpoReplyDate: 'Sep 24, 2026',
    tpoReplyRemarks: 'Slot allocated; seminar hall reserved, proctoring infra arranged.',
  }));

  return {
    id: u.id,
    name: u.name,
    tpoHead: u.tpoHead,
    email: u.email,
    mobileNo: '+91 98765 43210',
    officePhone: '+91 141 275 0000',
    state: u.state,
    city: u.state.split(' ')[0] || 'Metro City',
    nirfRank: u.nirfRank || 45,
    accreditation: u.accreditation,
    establishedYear: 1995,
    totalStudents: u.studentsCount,
    status: u.status === 'Delisted' ? 'Delisted' : u.status === 'Pending Approval' ? 'Pending Approval' : 'Active',
    delistReason: u.delistReason,

    ongoingDrives: collegeRecs.slice(0, 2).map((c, idx) => ({
      id: `${u.id}-drive${idx + 1}`,
      companyName: c.name,
      companyLogo: c.logo,
      jobTitle: c.pastTargetedRoles[0] || 'SDE Intern',
      startDate: idx === 0 ? 'Nov 2, 2026' : 'Nov 16, 2026',
      endDate: idx === 0 ? 'Nov 5, 2026' : 'Nov 17, 2026',
      dayProgress: idx === 0 ? 'Day 1 of 3' : 'Day 1 of 2',
      currentRound: idx === 0 ? 'Technical Interview Round 1' : 'Online Assessment + Group Discussion',
      candidatesRemaining: idx === 0 ? 58 : 96,
      venue: c.driveVenue || 'Central Seminar Hall',
    })),

    visitingCompaniesHistory,
    companyFeedbacks,
    curriculumRevisions,
    branchWiseStudents,
    collegeToCompanyRequests,
    companyToCollegeRequests,
  };
};

const companyDetailFor = (c: CompanyListing): CompanyAdminDetail => {
  const meta = companyMetaOf(c.name);
  const hasOngoing = c.id === 'COM1' || c.id === 'COM4' || c.id === 'COM5';

  const campusDrivesHistory: CompanyDriveHistoryItem[] = [
    {
      id: `${c.id}-drv1`,
      collegeName: 'ABC University',
      collegeId: 'UNI1',
      startDate: 'Apr 2026',
      endDate: 'Apr 2026',
      driveDays: 2,
      roleHired: 'Software Engineer Intern',
      packageLpa: c.totalHired > 20 ? '₹12.0 LPA' : '₹9.8 LPA',
      stipendDuringInternship: '₹40,000 / month',
      candidatesAppeared: 210,
      candidatesSelected: c.totalHired,
      candidatesRejected: 210 - c.totalHired,
      selectedStudents: adminStudentsSeed.slice(0, 2).map((s, si) => ({
        id: `${c.id}-sel${si + 1}`,
        studentName: s.name,
        rollNo: s.id,
        college: s.college,
        branch: s.degree.split(' ')[1] || 'CSE',
        postRole: 'Software Engineer Intern',
        selectionDate: 'Apr 10, 2026',
        packageLpa: si === 0 ? '₹12.0 LPA' : '₹9.8 LPA',
        hiringType: si === 0 ? 'On-Campus Drive' : 'Off-Campus Pool',
      })),
    },
    {
      id: `${c.id}-drv2`,
      collegeName: 'XYZ Institute of Tech',
      collegeId: 'UNI2',
      startDate: 'Feb 2026',
      endDate: 'Feb 2026',
      driveDays: 2,
      roleHired: c.industry.includes('AI') ? 'AI/ML Engineer Intern' : 'Backend Developer Intern',
      packageLpa: '₹10.5 LPA',
      candidatesAppeared: 168,
      candidatesSelected: Math.max(4, Math.floor(c.totalHired / 2)),
      candidatesRejected: 160,
      selectedStudents: adminStudentsSeed.slice(3, 5).map((s, si) => ({
        id: `${c.id}-sel${si + 3}`,
        studentName: s.name,
        rollNo: s.id,
        college: s.college,
        branch: s.degree.split(' ')[1] || 'CSE',
        postRole: 'Backend Developer Intern',
        selectionDate: 'Feb 15, 2026',
        packageLpa: '₹10.5 LPA',
        hiringType: 'On-Campus Drive',
      })),
    },
  ];

  return {
    id: c.id,
    name: c.name,
    logo: meta.logo || c.name.slice(0, 2).toUpperCase(),
    industry: meta.industry,
    headquarters: c.location,
    email: c.email,
    phone: '+91 96 4000 1200',
    registeredDate: c.registeredDate,
    website: `https://${c.name.toLowerCase().replace(/\s+/g, '')}.com`,
    status: c.status === 'Delisted' ? 'Delisted' : c.status === 'Pending Approval' ? 'Pending Approval' : 'Active',
    delistReason: c.delistReason,

    totalDrivesConducted: Math.max(2, Math.ceil(c.totalHired / 12)),
    totalStudentsSelected: c.totalHired,
    totalOffCampusPostsCount: c.activeJobs,
    collegesAcceptedCount: 4,
    collegesRejectedCount: 1,

    ongoingDrives:
      hasOngoing
        ? [
            {
              id: `${c.id}-od1`,
              collegeName: 'ABC University',
              role: 'Frontend Developer Intern',
              startDate: 'Nov 2, 2026',
              endDate: 'Nov 4, 2026',
              totalDays: 3,
              currentDay: 1,
              currentRound: 'Technical Interview Round 1',
              candidatesRemaining: 58,
              totalInitialApplicants: 142,
            },
          ]
        : [],

    campusDrivesHistory,

    feedbacksGivenToColleges: [
      {
        id: `${c.id}-fdb1`,
        collegeName: 'ABC University',
        feedbackDate: 'Apr 25, 2026',
        driveRole: 'Software Engineer Intern',
        rating: 4,
        feedbackPoints: ['Strong DS/Algo fundamentals', 'Good aptitude for production engineering', 'Need more modern stack exposure'],
        strengthsObserved: 'Students consistently wrote clean, testable code under time pressure.',
        areasToImprove: 'System design knowledge and cloud deployment experience.',
      },
    ],

    companyToCollegeOutreach: [
      {
        id: `${c.id}-out1`,
        collegeName: 'Global Engineering College',
        requestDate: 'Sep 15, 2026',
        proposedDates: 'Nov 16 - Nov 17, 2026',
        role: 'Backend Developer Intern',
        packageCtc: '₹11.0 LPA',
        collegeResponse: 'Accepted',
        responseDate: 'Sep 22, 2026',
        responseRemarks: 'Slot confirmed for November drive.',
      },
      {
        id: `${c.id}-out2`,
        collegeName: 'PQR University',
        requestDate: 'Sep 02, 2026',
        proposedDates: 'Dec 5, 2026',
        role: 'SDE Intern (PPO)',
        packageCtc: '₹10.5 LPA',
        collegeResponse: 'Under Review',
        responseDate: '-',
        responseRemarks: 'Awaiting placement cell committee approval.',
      },
    ],

    collegeToCompanyProposals: [
      {
        id: `${c.id}-prop1`,
        collegeName: 'XYZ Institute of Tech',
        invitationDate: 'Aug 20, 2026',
        proposedSlot: 'Autumn Campus Drive 2026-27',
        expectedBatchSize: 180,
        companyDecision: 'Accepted',
        replyDate: 'Sep 05, 2026',
        decisionNotes: 'Confirmed participation with new role track.',
      },
    ],

    offCampusPostings: [
      {
        id: `${c.id}-off1`,
        title: 'Frontend Developer Intern',
        postedDate: 'Sep 18, 2026',
        status: 'Active (Direct Live)',
        applicationsCount: 91,
        hiredCount: 6,
        ctc: '₹40,000 / month',
        location: 'Remote',
        skillsRequired: ['React', 'TypeScript', 'Tailwind CSS'],
      },
      {
        id: `${c.id}-off2`,
        title: 'Full-Stack Engineer (1+ yr)',
        postedDate: 'Aug 30, 2026',
        status: 'Closed',
        applicationsCount: 148,
        hiredCount: 3,
        ctc: '₹14.0 LPA',
        location: 'Bengaluru / Remote',
        skillsRequired: ['Node.js', 'PostgreSQL', 'React', 'Docker'],
      },
    ],

    offCampusRecruits: adminStudentsSeed.slice(0, 3).map((s, si) => ({
      id: `${c.id}-rec${si + 1}`,
      studentName: s.name,
      email: s.email,
      college: s.college,
      role: si === 0 ? 'Frontend Developer Intern' : 'Software Engineer Intern',
      hiredDate: si === 0 ? 'Sep 21, 2026' : 'Aug 12, 2026',
      ctc: si === 0 ? '₹12.0 LPA' : '₹10.5 LPA',
      recruitmentSource: si === 0 ? 'SkillBridge AST Verified Pool' : si === 1 ? 'Direct Portal Submission' : 'National Hackathon Winner',
      interviewScore: 88 - si * 6,
    })),
  };
};

export const getAdminStudentDetail = (idOrName: string): StudentAdminDetail => {
  const s = findStudent(idOrName);
  if (!s) {
    const fallback: StudentAdminDetail = {
      id: idOrName,
      name: idOrName.replace(/-/g, ' '),
      rollNo: '',
      college: 'Institute of Technology, Jodhpur',
      branch: 'CSE',
      degree: 'B.Tech CSE 2026',
      yearOfStudy: 'Pre-Final Year',
      currentSemester: 'Sem 6',
      cgpa: '8.9',
      email: 'student@itjodhpur.ac.in',
      mobileNo: '+91 98 8000 1122',
      location: 'Jodhpur, Rajasthan',
      avatar: 'ST',
      links: { github: `https://github.com/${idOrName.toLowerCase()}`, linkedin: `https://linkedin.com/in/${idOrName.toLowerCase()}` },
      placementStatus: 'Open to Placement',
      activeApplications: [],
      selectedOffers: [],
      rejectedApplications: [],
      projects: [],
      skillsList: [],
      originalityScore: 90,
      resumeAtsScore: 80,
      codeDefensePassed: 3,
      codeDefenseTotal: 4,
      riskStatus: 'clean',
      isDelisted: false,
    };
    return studentDetailFor({ ...adminStudentsSeed[0], name: fallback.name, id: fallback.id, email: fallback.email });
  }
  return studentDetailFor(s);
};

export const getAdminCollegeDetail = (idOrName: string): CollegeAdminDetail => {
  const u = findUniversity(idOrName);
  if (!u) {
    return collegeDetailFor(adminUniversitiesSeed[0]);
  }
  return collegeDetailFor(u);
};

export const getAdminCompanyDetail = (idOrName: string): CompanyAdminDetail => {
  const c = findCompany(idOrName);
  if (!c) {
    return companyDetailFor(adminCompaniesSeed[0]);
  }
  return companyDetailFor(c);
};