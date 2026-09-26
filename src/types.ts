export type UserRole = 'student' | 'company' | 'institution' | 'admin';

export type AuthStep = 'role-select' | 'signup' | 'login' | 'welcome' | 'app';

export type AdminTab =
  | 'dashboard'
  | 'all-students'
  | 'student-verification'
  | 'suspicious-profiles'
  | 'all-universities'
  | 'university-approval'
  | 'skill-gap-overview'
  | 'all-companies'
  | 'internships-jobs'
  | 'applications-overview'
  | 'resume-issues'
  | 'skill-verification'
  | 'risk-alerts'
  | 'session-tracker';

export type StudentTab = 
  | 'dashboard' 
  | 'daily-questions'
  | 'skills' 
  | 'skill-gap' 
  | 'projects' 
  | 'resume' 
  | 'improvement-path' 
  | 'internships' 
  | 'companies'
  | 'profile-settings';

export interface DailyQuizQuestion {
  id: string;
  skill: string;
  portionLearned: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface DailyQuizAttempt {
  id: string;
  date: string;
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  isRetest: boolean;
  questions: DailyQuizQuestion[];
  userAnswers: number[];
  timestamp: string;
}

export interface DailyStreakState {
  streakCount: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  lastAttemptDate: string | null;
  lastLoginDate: string | null;
  todayCompleted: boolean;
  todayScore: number | null;
  todayCorrectCount: number | null;
  streakStatus: 'active' | 'paused' | 'broken' | 'pending';
  history: DailyQuizAttempt[];
  retestAvailable: boolean;
}

export type CompanyTab = 
  | 'dashboard' 
  | 'profile' 
  | 'post-job' 
  | 'applied'
  | 'requests'
  | 'feedback'
  | 'analytics' 
  | 'settings';

export type InstitutionTab = 
  | 'overview' 
  | 'skills'
  | 'curriculum-gaps' 
  | 'students' 
  | 'companies' 
  | 'applied-selected'
  | 'requests'
  | 'feedback'
  | 'project-integrity' 
  | 'reports';

export interface SkillCheckpoint {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface SkillTier {
  weight: number; // 33 for beginner, 33 for intermediate, 34 for advance
  checkpoints: SkillCheckpoint[];
}

export interface SkillLevels {
  beginner: SkillTier;
  intermediate: SkillTier;
  advance: SkillTier;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Core CS' | 'DevOps' | 'AI / Data' | 'Soft Skills';
  proficiency: number; // 0-100
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  status: 'verified' | 'self-claimed' | 'unverified';
  verifiedDate?: string;
  quizAvailable?: boolean;
  levels?: SkillLevels;
  assessmentScore?: number;
  assessmentAttemptDate?: string;
  beginnerVerified?: boolean;
}

export interface StudentSkillRequest {
  id: string;
  studentName: string;
  studentRoll?: string;
  collegeName: string;
  skillName: string;
  category: Skill['category'];
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  tpoRemarks?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  liveUrl?: string;
  originalityScore: number;
  status: 'passed' | 'pending' | 'flagged';
  flagReason?: string;
  verifiedDate?: string;
  qnaPassed?: boolean;
  methodsAnalyzed?: string[];
  architectureSummary?: string;
  questionsScore?: { correct: number; total: number };
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  stipend: string;
  matchScore: number; // 0-100
  requiredSkills: string[];
  preferredSkills: string[];
  missingSkills: string[];
  description: string;
  applicantsCount: number;
  deadline: string;
  isApplied?: boolean;
  campusType?: 'on_campus' | 'off_campus';
  targetUniversity?: string;
  driveStartDate?: string;
  driveEndDate?: string;
  tpoApprovalStatus?: 'approved' | 'pending' | 'rejected';
}

export interface Candidate {
  id: string;
  anonymousId: string;
  name: string;
  rollNumber?: string;
  college: string;
  branch: string;
  year: string;
  avatar: string;
  matchScore: number; // 0-100
  topSkills: string[];
  projectVerified: boolean;
  originalityScore: number;
  logicQnAScore: number;
  status: 'new' | 'shortlisted' | 'rejected' | 'interviewing' | 'selected';
  selectedRole?: string;
  selectedPackage?: string;
  postingLocation?: string;
  joiningDate?: string;
  resumeHighlights: {
    gpa: string;
    verifiedCount: number;
    projectsCount: number;
    summary: string;
  };
  skillsBreakdown: { name: string; score: number; verified: boolean; howLearned?: string; isSelfClaimed?: boolean }[];
  skillsLearnedDetailed?: Array<{
    name: string;
    level: string;
    verified: boolean;
    score: number;
    howLearned?: string;
  }>;
  projectsDetailed?: Array<{
    id?: string;
    title: string;
    techStack: string[];
    originalityScore: number;
    logicDefenseScore: number;
    status: 'passed' | 'pending' | 'flagged';
    summary: string;
    githubUrl?: string;
    demoUrl?: string;
  }>;
  resumeUrl?: string;
  links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    email?: string;
  };
  certificates?: Array<{
    title: string;
    issuer: string;
    issueDate: string;
    verified: boolean;
    credentialId?: string;
  }>;
}

export interface DepartmentGapData {
  department: string;
  skills: {
    name: string;
    curriculumCoverage: number; // 0-100%
    industryDemand: number; // 0-100%
    status: 'gap' | 'moderate' | 'covered';
  }[];
}

export interface StudentReadinessRow {
  id: string;
  name: string;
  email: string;
  branch: string;
  completeness: number;
  verifiedSkillsCount: number;
  status: 'High' | 'Medium' | 'Action Needed';
  readinessScore: number;
}

export interface FlaggedProjectRow {
  id: string;
  studentName: string;
  branch: string;
  projectTitle: string;
  originalityScore: number;
  flagReason: string;
  submissionDate: string;
  status: 'Under Review' | 'Flagged' | 'Cleared';
}

export interface PartnerCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  jobsPosted: number;
  studentsShortlisted: number;
  hiringRate: number;
  trend: number[];
}

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  duration: string;
  skillAddressed: string;
  level: string;
  matchBoost: number;
  rating: number;
  enrollUrl?: string;
  // College & Company Feedback fields (USER REQUEST)
  prescribedByCollege?: string;
  companyFeedbackSource?: string;
  feedbackQuote?: string;
  assignedByMentor?: string;
  isEnrolled?: boolean;
  isCompleted?: boolean;
}

export interface StudentLearnedSkill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Core CS' | 'DevOps' | 'AI / Data' | 'Soft Skills';
  proficiency: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified: boolean;
  verifiedDate?: string;
  verifiedMethod?: 'AI Logic Q&A Defense' | 'AST Code Audit' | 'Quiz Assessment' | 'Self Claimed';
  checkpointsCompleted?: number;
  totalCheckpoints?: number;
}

export interface StudentAuditedProject {
  id: string;
  title: string;
  techStack: string[];
  originalityScore: number;
  logicDefenseScore: number;
  status: 'passed' | 'flagged' | 'pending';
  summary?: string;
  repoUrl?: string;
}

export interface InstitutionStudent {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  cgpa: string;
  readinessPercent: number;
  verifiedSkillsCount: number;
  projectsCount: number;
  status: string;
  // Deep skill and profile details for TPO review
  email?: string;
  phone?: string;
  batch?: string;
  semester?: string;
  atsResumeScore?: number;
  codeLogicScore?: number;
  integrityStatus?: 'Verified' | 'Under Review' | 'Flagged';
  skillsLearned?: StudentLearnedSkill[];
  projects?: StudentAuditedProject[];
  shortlistedCompanies?: string[];
  recommendedFocus?: string[];
}

export interface CampusRecruitingCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description?: string;
  website?: string;
  status: 'currently_visiting' | 'upcoming_visit' | 'past_visitor';
  visitStageLabel: string;
  lastTimeVisited: string;
  currentOrNextDriveDate: string;
  lastTimePay: string;
  highestLpa: string;
  medianPackage: string;
  averagePackage: string;
  seatsOffered: string;
  pastTargetedRoles: string[];
  eligibleBranches: string[];
  minCgpa: string;
  requiredSkills: string[];
  hiringHistory?: Array<{
    year: string;
    offersCount: number;
    highestLpa: string;
    medianLpa: string;
    roles: string[];
    recruitedStudents?: RecruitedStudentRecord[];
  }>;
  activeDriveJobId?: string;
  driveVenue?: string;
  tpoCoordinator?: string;
}

export interface RecruitedStudentRecord {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  packageOffered: string; // e.g. "₹24.5 LPA"
  role: string; // e.g. "Full-Stack Software Engineer"
  hireType: 'FTE' | 'Intern + PPO' | 'Direct FTE';
  hiringDate?: string;
  cgpa: string;
  verifiedSkills: string[];
  avatar?: string;
  status: 'Joined' | 'Offer Accepted';
}

export interface SkillAcquisitionProof {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advance';
  verified: boolean; // true = verified, false = self-proclaimed
  howLearned: string; // e.g. "Lab CS302 (DBMS), Course Project, & AI AST Code Defense"
  score?: number;
  verificationMethod?: 'AI Logic Q&A Defense' | 'AST Code Audit' | 'Quiz Assessment' | 'Self Claimed';
}

export interface StudentCertificateEvidence {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  verified: boolean;
  credentialUrl?: string;
}

export interface StudentProjectEvidence {
  id: string;
  title: string;
  techStack: string[];
  originalityScore: number;
  logicDefenseScore: number;
  githubUrl: string;
  demoUrl?: string;
  summary: string;
  status?: 'passed' | 'pending' | 'flagged';
}

export interface OnCampusApplication {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  collegeName: string;
  branch: string;
  cgpa: string;
  avatar?: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  matchScore: number;
  applicationDate: string;
  status: 'applied' | 'under_evaluation' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected';
  packageOffered?: string; // e.g. "₹22.5 LPA"
  offeredRole?: string;
  selectionYear?: string;
  postingLocation?: string; // e.g. "Bengaluru, Karnataka"
  joiningDate?: string;
  isTransmittedToTpo?: boolean;
  
  // Detailed portfolio data for Company review
  skillsLearned: SkillAcquisitionProof[];
  resumeUrl?: string;
  resumeGpa?: string;
  resumeSummary: string;
  certificates: StudentCertificateEvidence[];
  projects: StudentProjectEvidence[];
  links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    email?: string;
  };
}

export interface OffCampusApplication {
  id: string;
  applicantName: string;
  email: string;
  location: string;
  collegeName: string;
  degree: string;
  graduationYear: string;
  appliedRole: string;
  matchScore: number;
  applicationDate: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'offered';
  skills: string[];
  resumeSummary: string;
  githubUrl?: string;
  projectsCount: number;
}

export interface CollegeSelectedStudentRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  collegeName: string;
  branch: string;
  cgpa?: string;
  avatar?: string;
  companyName: string;
  companyLogo?: string;
  role: string;
  packageOffered: string; // CTC in LPA, e.g. "₹24.5 LPA"
  selectionYear: string; // "2026", "2025", "2024", "2023"
  hiringType: 'On-Campus Placement' | 'PPO via Internship' | 'Direct On-Campus Hire';
  selectionDate: string;
  verifiedSkills: string[];
  postingLocation?: string; // e.g. "Bengaluru (Hybrid)", "Hyderabad", "Pune"
  joiningDate?: string;
  isDirectCompanyTransmission?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'approval' | 'risk' | 'job' | 'system' | 'verification' | 'drive' | 'nudge' | 'feedback' | 'request';
  targetRole?: UserRole | 'all';
  targetTab?: string;
  isRead: boolean;
  priority?: 'high' | 'normal' | 'urgent';
  stream?: string; // e.g. "CSE & IT" for TPO stream nudges
  senderName?: string;
  senderRole?: UserRole;
  meta?: Record<string, any>;
}

export interface SuggestedProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  keyFeatures: string[];
  defenseTopics: string[];
  difficulty: 'Intermediate' | 'Advanced';
  status?: 'not_started' | 'in_progress' | 'audited';
}

export interface CompanyImprovementPath {
  id: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  jobId?: string;
  targetRole: string;
  stipendOrPackage: string;
  campusType?: 'on_campus' | 'off_campus';
  createdAt: string;
  status: 'active' | 'completed';
  
  diagnosis: {
    summary: string;
    hasLearnedSkillsLackingProject: boolean;
    missingSkillsCount: number;
    unverifiedProjectsCount: number;
  };

  skillsLearned: Array<{
    name: string;
    proficiency: string;
    isVerified: boolean;
  }>;

  skillsMissing: Array<{
    name: string;
    importance: 'Mandatory' | 'High' | 'Preferred' | 'Preferred / Differentiator';
    estimatedHours: number;
    recommendedResource: string;
    roadmapTopics: string[];
    isCompleted?: boolean;
  }>;

  projectRequirement: {
    needed: boolean;
    reason: string;
    suggestedProjects: SuggestedProject[];
  };

  actionChecklist: Array<{
    id: string;
    title: string;
    description: string;
    category: 'Skill' | 'Project' | 'Defense' | 'Apply';
    completed: boolean;
  }>;
}

