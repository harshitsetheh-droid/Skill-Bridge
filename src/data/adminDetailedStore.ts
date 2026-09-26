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
// EMPTY STORE (no default data)
// ============================================================================

const emptyStudent = (idOrName: string): StudentAdminDetail => ({
  id: idOrName,
  name: '',
  rollNo: '',
  college: '',
  branch: '',
  degree: '',
  yearOfStudy: '',
  currentSemester: '',
  cgpa: '',
  email: '',
  mobileNo: '',
  location: '',
  avatar: '',
  links: { github: '', linkedin: '' },
  placementStatus: 'Open to Placement',
  activeApplications: [],
  selectedOffers: [],
  rejectedApplications: [],
  projects: [],
  skillsList: [],
  originalityScore: 0,
  resumeAtsScore: 0,
  codeDefensePassed: 0,
  codeDefenseTotal: 0,
  riskStatus: 'clean',
  isDelisted: false,
});

const emptyCollege = (idOrName: string): CollegeAdminDetail => ({
  id: idOrName,
  name: '',
  tpoHead: '',
  email: '',
  mobileNo: '',
  officePhone: '',
  state: '',
  city: '',
  nirfRank: 0,
  accreditation: '',
  establishedYear: 0,
  totalStudents: 0,
  status: 'Pending Approval',
  ongoingDrives: [],
  visitingCompaniesHistory: [],
  companyFeedbacks: [],
  curriculumRevisions: [],
  branchWiseStudents: {},
  collegeToCompanyRequests: [],
  companyToCollegeRequests: [],
});

const emptyCompany = (idOrName: string): CompanyAdminDetail => ({
  id: idOrName,
  name: '',
  logo: '',
  industry: '',
  headquarters: '',
  email: '',
  phone: '',
  registeredDate: '',
  website: '',
  status: 'Pending Approval',
  totalDrivesConducted: 0,
  totalStudentsSelected: 0,
  totalOffCampusPostsCount: 0,
  collegesAcceptedCount: 0,
  collegesRejectedCount: 0,
  ongoingDrives: [],
  campusDrivesHistory: [],
  feedbacksGivenToColleges: [],
  companyToCollegeOutreach: [],
  collegeToCompanyProposals: [],
  offCampusPostings: [],
  offCampusRecruits: [],
});

export const getAdminStudentDetail = (idOrName: string): StudentAdminDetail => {
  return emptyStudent(idOrName);
};

export const getAdminCollegeDetail = (idOrName: string): CollegeAdminDetail => {
  return emptyCollege(idOrName);
};

export const getAdminCompanyDetail = (idOrName: string): CompanyAdminDetail => {
  return emptyCompany(idOrName);
};